// WebSocket Controller for interactive real-time features
// Implements T053b: WebSocket for typing indicators, live reactions, direct messages

import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import {
  WSConnection,
  RealtimeEvent,
  TypingIndicatorEvent,
  LiveReactionEvent,
  UserStatusEvent,
  ValidChannel,
  VALID_CHANNELS,
  ReactionType
} from './types';
import { EventPublisher } from './EventPublisher';
import { RateLimiter } from './RateLimiter';

export class WebSocketController {
  private wss: WebSocketServer;
  private connections: Map<string, WSConnection> = new Map();
  private userConnections: Map<string, Set<string>> = new Map(); // userId -> connectionIds
  private threadSubscriptions: Map<string, Set<string>> = new Map(); // threadId -> connectionIds
  private eventPublisher: EventPublisher;
  private rateLimiter: RateLimiter;
  private heartbeatInterval: NodeJS.Timeout;

  constructor(server: Server, eventPublisher: EventPublisher) {
    this.eventPublisher = eventPublisher;
    this.rateLimiter = new RateLimiter({
      windowMs: 1000, // 1 second
      maxRequests: 20, // 20 messages per second per connection
      skipSuccessfulRequests: false,
      skipFailedRequests: true
    });

    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      clientTracking: false // We handle tracking ourselves
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    this.setupHeartbeat();
    this.setupEventSubscriptions();

    console.log('WebSocketController initialized');
  }

  private setupEventSubscriptions(): void {
    // Subscribe to events that should be sent via WebSocket
    this.eventPublisher.subscribe('typing_indicators', this.handleTypingIndicator.bind(this));
    this.eventPublisher.subscribe('live_reactions', this.handleLiveReaction.bind(this));
    this.eventPublisher.subscribe('user_status', this.handleUserStatus.bind(this));
  }

  /**
   * Handle new WebSocket connection
   */
  private async handleConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
    const connectionId = this.generateConnectionId();

    // Extract user ID from auth token in query or headers
    const userId = await this.authenticateConnection(req);

    if (!userId) {
      ws.close(1008, 'Authentication required');
      return;
    }

    // Check for rate limiting on connection
    if (this.rateLimiter.isRateLimited(`conn_${userId}`)) {
      ws.close(1008, 'Connection rate limited');
      return;
    }

    const connection: WSConnection = {
      id: connectionId,
      userId,
      socket: ws,
      connectedAt: new Date(),
      lastPing: new Date(),
      subscriptions: new Set(),
      isAlive: true
    };

    this.connections.set(connectionId, connection);

    // Track user connections
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(connectionId);

    // Setup message handling
    ws.on('message', (data) => this.handleMessage(connectionId, data));
    ws.on('close', (code, reason) => this.handleDisconnect(connectionId, code, reason));
    ws.on('error', (error) => this.handleError(connectionId, error));

    // Setup pong handling for heartbeat
    ws.on('pong', () => {
      connection.lastPing = new Date();
      connection.isAlive = true;
    });

    // Send welcome message
    this.sendMessage(connectionId, {
      type: 'connection_established',
      data: {
        connectionId,
        userId,
        timestamp: new Date().toISOString(),
        features: ['typing_indicators', 'live_reactions', 'direct_messages']
      }
    });

    // Notify other users that this user is online
    await this.eventPublisher.publishUserStatus(userId, 'online');

    console.log(`WebSocket connection established: ${connectionId} for user: ${userId}`);
  }

  /**
   * Handle incoming WebSocket messages
   */
  private async handleMessage(connectionId: string, data: any): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Rate limiting
    if (this.rateLimiter.isRateLimited(connectionId)) {
      this.sendMessage(connectionId, {
        type: 'error',
        data: { message: 'Rate limited', resetTime: this.rateLimiter.getResetTime(connectionId) }
      });
      return;
    }

    try {
      const message = JSON.parse(data.toString());

      // Record the request for rate limiting
      this.rateLimiter.recordRequest(connectionId, true);

      switch (message.type) {
        case 'subscribe':
          await this.handleSubscribe(connection, message.data);
          break;

        case 'unsubscribe':
          await this.handleUnsubscribe(connection, message.data);
          break;

        case 'typing_start':
          await this.handleTypingStart(connection, message.data);
          break;

        case 'typing_stop':
          await this.handleTypingStop(connection, message.data);
          break;

        case 'live_reaction':
          await this.handleLiveReactionMessage(connection, message.data);
          break;

        case 'join_thread':
          await this.handleJoinThread(connection, message.data);
          break;

        case 'leave_thread':
          await this.handleLeaveThread(connection, message.data);
          break;

        case 'ping':
          this.sendMessage(connectionId, {
            type: 'pong',
            data: { timestamp: Date.now() }
          });
          break;

        default:
          console.warn(`Unknown WebSocket message type: ${message.type}`);
          this.sendMessage(connectionId, {
            type: 'error',
            data: { message: `Unknown message type: ${message.type}` }
          });
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
      this.rateLimiter.recordRequest(connectionId, false);
      this.sendMessage(connectionId, {
        type: 'error',
        data: { message: 'Invalid message format' }
      });
    }
  }

  /**
   * Handle channel subscription
   */
  private async handleSubscribe(connection: WSConnection, data: any): Promise<void> {
    const { channel } = data;

    if (this.isValidChannel(channel)) {
      connection.subscriptions.add(channel);
      this.sendMessage(connection.id, {
        type: 'subscribed',
        data: { channel, timestamp: new Date().toISOString() }
      });
      console.log(`User ${connection.userId} subscribed to channel: ${channel}`);
    } else {
      this.sendMessage(connection.id, {
        type: 'error',
        data: { message: `Invalid channel: ${channel}` }
      });
    }
  }

  /**
   * Handle channel unsubscription
   */
  private async handleUnsubscribe(connection: WSConnection, data: any): Promise<void> {
    const { channel } = data;

    if (connection.subscriptions.has(channel)) {
      connection.subscriptions.delete(channel);
      this.sendMessage(connection.id, {
        type: 'unsubscribed',
        data: { channel, timestamp: new Date().toISOString() }
      });
      console.log(`User ${connection.userId} unsubscribed from channel: ${channel}`);
    }
  }

  /**
   * Handle typing start
   */
  private async handleTypingStart(connection: WSConnection, data: any): Promise<void> {
    const { threadId } = data;

    if (!threadId) {
      this.sendMessage(connection.id, {
        type: 'error',
        data: { message: 'threadId is required for typing indicators' }
      });
      return;
    }

    // Publish typing indicator event
    await this.eventPublisher.publishTypingIndicator(connection.userId, threadId, 'start');

    // Set auto-stop timeout (5 seconds)
    setTimeout(() => {
      this.handleTypingStop(connection, data).catch(console.error);
    }, 5000);
  }

  /**
   * Handle typing stop
   */
  private async handleTypingStop(connection: WSConnection, data: any): Promise<void> {
    const { threadId } = data;

    if (!threadId) return;

    // Publish typing indicator event
    await this.eventPublisher.publishTypingIndicator(connection.userId, threadId, 'stop');
  }

  /**
   * Handle live reaction
   */
  private async handleLiveReactionMessage(connection: WSConnection, data: any): Promise<void> {
    const { postId, reaction } = data;

    if (!postId || !reaction) {
      this.sendMessage(connection.id, {
        type: 'error',
        data: { message: 'postId and reaction are required' }
      });
      return;
    }

    // Validate reaction type
    const validReactions: ReactionType[] = ['like', 'dislike', 'laugh', 'angry', 'sad', 'support', 'oppose'];
    if (!validReactions.includes(reaction)) {
      this.sendMessage(connection.id, {
        type: 'error',
        data: { message: 'Invalid reaction type' }
      });
      return;
    }

    // Publish live reaction event
    await this.eventPublisher.publishLiveReaction(postId, connection.userId, reaction);
  }

  /**
   * Handle thread join
   */
  private async handleJoinThread(connection: WSConnection, data: any): Promise<void> {
    const { threadId } = data;

    if (!threadId) {
      this.sendMessage(connection.id, {
        type: 'error',
        data: { message: 'threadId is required' }
      });
      return;
    }

    // Add to thread subscriptions
    if (!this.threadSubscriptions.has(threadId)) {
      this.threadSubscriptions.set(threadId, new Set());
    }
    this.threadSubscriptions.get(threadId)!.add(connection.id);

    this.sendMessage(connection.id, {
      type: 'thread_joined',
      data: { threadId, timestamp: new Date().toISOString() }
    });

    console.log(`User ${connection.userId} joined thread: ${threadId}`);
  }

  /**
   * Handle thread leave
   */
  private async handleLeaveThread(connection: WSConnection, data: any): Promise<void> {
    const { threadId } = data;

    if (!threadId) return;

    // Remove from thread subscriptions
    const threadSubs = this.threadSubscriptions.get(threadId);
    if (threadSubs) {
      threadSubs.delete(connection.id);
      if (threadSubs.size === 0) {
        this.threadSubscriptions.delete(threadId);
      }
    }

    this.sendMessage(connection.id, {
      type: 'thread_left',
      data: { threadId, timestamp: new Date().toISOString() }
    });

    console.log(`User ${connection.userId} left thread: ${threadId}`);
  }

  /**
   * Handle typing indicator events from EventPublisher
   */
  private async handleTypingIndicator(event: TypingIndicatorEvent): Promise<void> {
    const { threadId, userId, action } = event.data;

    // Get connections subscribed to this thread
    const threadConnections = this.threadSubscriptions.get(threadId);
    if (!threadConnections) return;

    // Broadcast to all thread participants except the sender
    for (const connectionId of threadConnections) {
      const connection = this.connections.get(connectionId);
      if (connection && connection.userId !== userId && connection.socket.readyState === WebSocket.OPEN) {
        this.sendMessage(connectionId, {
          type: 'typing_indicator',
          data: {
            userId,
            threadId,
            action,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Handle live reaction events from EventPublisher
   */
  private async handleLiveReaction(event: LiveReactionEvent): Promise<void> {
    const { postId, userId, reaction } = event.data;

    // Broadcast to all connected users subscribed to live reactions
    for (const connection of this.connections.values()) {
      if (
        connection.subscriptions.has('live_reactions') &&
        connection.userId !== userId &&
        connection.socket.readyState === WebSocket.OPEN
      ) {
        this.sendMessage(connection.id, {
          type: 'live_reaction',
          data: {
            postId,
            userId,
            reaction,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Handle user status events from EventPublisher
   */
  private async handleUserStatus(event: UserStatusEvent): Promise<void> {
    const { userId, status } = event.data;

    // Broadcast to all connected users except the user themselves
    for (const connection of this.connections.values()) {
      if (
        connection.userId !== userId &&
        connection.socket.readyState === WebSocket.OPEN
      ) {
        this.sendMessage(connection.id, {
          type: 'user_status',
          data: {
            userId,
            status,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Send message to specific connection
   */
  private sendMessage(connectionId: string, message: any): void {
    const connection = this.connections.get(connectionId);
    if (connection && connection.socket.readyState === WebSocket.OPEN) {
      try {
        connection.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        this.handleDisconnect(connectionId, 1011, 'Send error');
      }
    }
  }

  /**
   * Broadcast message to multiple connections
   */
  private async broadcastToConnections(connectionIds: Set<string>, message: any, excludeUserId?: string): Promise<void> {
    for (const connectionId of connectionIds) {
      const connection = this.connections.get(connectionId);
      if (
        connection &&
        connection.userId !== excludeUserId &&
        connection.socket.readyState === WebSocket.OPEN
      ) {
        this.sendMessage(connectionId, message);
      }
    }
  }

  /**
   * Handle connection disconnect
   */
  private async handleDisconnect(connectionId: string, code?: number, reason?: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    console.log(`WebSocket connection ${connectionId} disconnected (code: ${code})`);

    // Remove from user connections tracking
    const userConnections = this.userConnections.get(connection.userId);
    if (userConnections) {
      userConnections.delete(connectionId);
      if (userConnections.size === 0) {
        this.userConnections.delete(connection.userId);

        // Notify other users that this user is offline
        await this.eventPublisher.publishUserStatus(connection.userId, 'offline');
      }
    }

    // Remove from thread subscriptions
    for (const [threadId, connectionSet] of this.threadSubscriptions) {
      connectionSet.delete(connectionId);
      if (connectionSet.size === 0) {
        this.threadSubscriptions.delete(threadId);
      }
    }

    // Remove connection
    this.connections.delete(connectionId);
  }

  /**
   * Handle connection error
   */
  private handleError(connectionId: string, error: Error): void {
    console.error(`WebSocket connection error for ${connectionId}:`, error);
    this.handleDisconnect(connectionId, 1011, Buffer.from('Connection error'));
  }

  /**
   * Setup heartbeat mechanism
   */
  private setupHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      for (const [connectionId, connection] of this.connections) {
        if (!connection.isAlive) {
          console.log(`Terminating dead WebSocket connection: ${connectionId}`);
          this.handleDisconnect(connectionId, 1001, Buffer.from('Heartbeat timeout'));
          continue;
        }

        connection.isAlive = false;
        if (connection.socket.readyState === WebSocket.OPEN) {
          try {
            connection.socket.ping();
          } catch (error) {
            console.error(`Failed to ping connection ${connectionId}:`, error);
            this.handleDisconnect(connectionId, 1011, Buffer.from('Ping error'));
          }
        }
      }
    }, 30000); // 30 seconds
  }

  /**
   * Authenticate WebSocket connection
   */
  private async authenticateConnection(req: IncomingMessage): Promise<string | null> {
    try {
      // Extract token from query parameters or Authorization header
      const url = new URL(req.url!, 'http://localhost');
      const token = url.searchParams.get('token') ||
                   req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return null;
      }

      // TODO: Implement actual JWT verification
      // For now, extract userId from a simple token format
      // In production, use proper JWT verification
      const decoded = Buffer.from(token, 'base64').toString();
      const [userId] = decoded.split(':');

      return userId || null;
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      return null;
    }
  }

  /**
   * Validate channel name
   */
  private isValidChannel(channel: string): boolean {
    const wsChannels: ValidChannel[] = [
      'typing_indicators',
      'live_reactions',
      'direct_messages',
      'user_status'
    ];
    return wsChannels.includes(channel as ValidChannel);
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `ws_${uuidv4()}`;
  }

  // Public API methods

  /**
   * Get active connection count
   */
  getActiveConnections(): number {
    return this.connections.size;
  }

  /**
   * Get connections for specific user
   */
  getUserConnections(userId: string): WSConnection[] {
    return Array.from(this.connections.values())
      .filter(conn => conn.userId === userId);
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): any {
    const stats = {
      totalConnections: this.connections.size,
      uniqueUsers: this.userConnections.size,
      activeThreads: this.threadSubscriptions.size,
      subscriptionBreakdown: {} as Record<string, number>
    };

    // Count subscription breakdown
    for (const connection of this.connections.values()) {
      for (const sub of connection.subscriptions) {
        stats.subscriptionBreakdown[sub] = (stats.subscriptionBreakdown[sub] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Broadcast event to relevant connections
   */
  async broadcastEvent(event: RealtimeEvent): Promise<void> {
    const eventType = event.type as ValidChannel;

    // Route to appropriate handler based on event type
    switch (eventType) {
      case 'typing_indicators':
        await this.handleTypingIndicator(event as TypingIndicatorEvent);
        break;
      case 'live_reactions':
        await this.handleLiveReaction(event as LiveReactionEvent);
        break;
      case 'user_status':
        await this.handleUserStatus(event as UserStatusEvent);
        break;
      default:
        console.warn(`Unhandled WebSocket event type: ${eventType}`);
    }
  }

  /**
   * Disconnect user from all WebSocket connections
   */
  disconnectUser(userId: string): void {
    const userConnections = this.getUserConnections(userId);
    userConnections.forEach(conn => {
      this.handleDisconnect(conn.id, 1000, Buffer.from('User disconnected'));
    });
  }

  /**
   * Send direct message to user
   */
  async sendDirectMessage(toUserId: string, fromUserId: string, message: any): Promise<boolean> {
    const userConnections = this.getUserConnections(toUserId);

    if (userConnections.length === 0) {
      return false; // User not connected
    }

    const directMessage = {
      type: 'direct_message',
      data: {
        fromUserId,
        toUserId,
        message,
        timestamp: new Date().toISOString()
      }
    };

    for (const connection of userConnections) {
      this.sendMessage(connection.id, directMessage);
    }

    return true;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all connections
    for (const [connectionId] of this.connections) {
      this.handleDisconnect(connectionId, 1001, Buffer.from('Server shutdown'));
    }

    // Close WebSocket server
    this.wss.close(() => {
      console.log('WebSocket server closed');
    });
  }
}