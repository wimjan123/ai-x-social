// Server-Sent Events Controller for timeline updates
// Implements T053a: SSE for posts, reactions, trends, news

import { Request, Response } from 'express';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}
import { v4 as uuidv4 } from 'uuid';
import {
  SSEConnection,
  SSEEvent,
  PostCreatedEvent,
  PostReactionEvent,
  TrendUpdateEvent,
  NewsItemEvent,
  AIResponseEvent,
  UserFilters,
  ValidChannel,
  VALID_CHANNELS
} from './types';
import { EventPublisher } from './EventPublisher';
import { RateLimiter } from './RateLimiter';

export class SSEController {
  private connections: Map<string, SSEConnection> = new Map();
  private eventPublisher: EventPublisher;
  private rateLimiter: RateLimiter;
  private userConnections: Map<string, Set<string>> = new Map(); // userId -> connectionIds
  private cleanupInterval: NodeJS.Timeout;

  constructor(eventPublisher: EventPublisher) {
    this.eventPublisher = eventPublisher;
    this.rateLimiter = new RateLimiter({
      windowMs: 1000, // 1 second
      maxRequests: 10, // 10 events per second per connection
      skipSuccessfulRequests: false,
      skipFailedRequests: true
    });

    // Subscribe to events
    this.setupEventSubscriptions();

    // Setup periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleConnections();
    }, 60000); // Every minute
  }

  private setupEventSubscriptions(): void {
    this.eventPublisher.subscribe('posts', this.handlePostCreated.bind(this));
    this.eventPublisher.subscribe('reactions', this.handlePostReaction.bind(this));
    this.eventPublisher.subscribe('trends', this.handleTrendUpdate.bind(this));
    this.eventPublisher.subscribe('news', this.handleNewsItem.bind(this));
    this.eventPublisher.subscribe('ai_responses', this.handleAIResponse.bind(this));
  }

  /**
   * Handle new SSE connection
   */
  async handleConnection(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    const connectionId = this.generateConnectionId();
    const subscriptionTypes = this.parseSubscriptionTypes(req.query.types as string);

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control, Authorization',
      'X-Accel-Buffering': 'no' // Disable nginx buffering
    });

    // Send initial connection event
    this.sendEvent(res, {
      type: 'connection',
      data: {
        connectionId,
        timestamp: new Date().toISOString(),
        subscriptions: subscriptionTypes
      }
    });

    // Create connection object
    const connection: SSEConnection = {
      id: connectionId,
      userId,
      response: res,
      connectedAt: new Date(),
      lastActivity: new Date(),
      subscriptions: subscriptionTypes,
      filters: await this.getUserFilters(userId)
    };

    this.connections.set(connectionId, connection);

    // Track user connections
    if (userId) {
      if (!this.userConnections.has(userId)) {
        this.userConnections.set(userId, new Set());
      }
      this.userConnections.get(userId)!.add(connectionId);
    }

    // Handle client disconnect
    req.on('close', () => {
      this.handleDisconnect(connectionId);
    });

    req.on('error', (error) => {
      console.error(`SSE connection error for ${connectionId}:`, error);
      this.handleDisconnect(connectionId);
    });

    // Send keepalive every 30 seconds
    const keepalive = setInterval(() => {
      if (this.connections.has(connectionId)) {
        this.sendEvent(res, {
          type: 'keepalive',
          data: { timestamp: new Date().toISOString() }
        });
        connection.lastActivity = new Date();
      } else {
        clearInterval(keepalive);
      }
    }, 30000);

    console.log(`SSE connection established: ${connectionId} for user: ${userId || 'anonymous'}`);
  }

  /**
   * Handle post creation events
   */
  private async handlePostCreated(event: PostCreatedEvent): Promise<void> {
    const relevantConnections = this.getConnectionsForEvent('posts', event);

    for (const connection of relevantConnections) {
      if (await this.shouldSendToUser(connection, event)) {
        this.sendEvent(connection.response, {
          type: 'posts',
          id: event.data.postId,
          data: {
            post: event.data.post,
            author: event.data.author,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Handle post reaction events
   */
  private async handlePostReaction(event: PostReactionEvent): Promise<void> {
    const relevantConnections = this.getConnectionsForEvent('reactions', event);

    for (const connection of relevantConnections) {
      // Only send if user is viewing the post or is the author
      if (await this.isRelevantReaction(connection, event)) {
        this.sendEvent(connection.response, {
          type: 'reactions',
          id: event.data.postId,
          data: {
            postId: event.data.postId,
            reactionType: event.data.reactionType,
            count: event.data.newCount,
            userId: event.data.userId,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Handle trend update events
   */
  private async handleTrendUpdate(event: TrendUpdateEvent): Promise<void> {
    const relevantConnections = this.getConnectionsForEvent('trends', event);

    for (const connection of relevantConnections) {
      // Filter trends by user's region preferences
      if (await this.isTrendRelevant(connection, event.data.trend)) {
        this.sendEvent(connection.response, {
          type: 'trends',
          data: {
            trend: event.data.trend,
            action: event.data.action,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Handle news item events
   */
  private async handleNewsItem(event: NewsItemEvent): Promise<void> {
    const relevantConnections = this.getConnectionsForEvent('news', event);

    for (const connection of relevantConnections) {
      if (await this.isNewsRelevant(connection, event)) {
        this.sendEvent(connection.response, {
          type: 'news',
          data: {
            newsItem: event.data.newsItem,
            relevanceScore: event.data.relevanceScore,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Handle AI response events
   */
  private async handleAIResponse(event: AIResponseEvent): Promise<void> {
    // Send AI responses in real-time to create dynamic conversation feel
    const relevantConnections = this.getConnectionsForEvent('ai_responses', event);

    for (const connection of relevantConnections) {
      if (await this.shouldSendToUser(connection, event)) {
        this.sendEvent(connection.response, {
          type: 'ai_responses',
          id: event.data.responseId,
          data: {
            post: event.data.post,
            persona: event.data.persona,
            inReplyTo: event.data.originalPostId,
            timestamp: event.data.timestamp
          }
        });
      }
    }
  }

  /**
   * Send SSE event to client
   */
  private sendEvent(res: Response, event: SSEEvent): void {
    try {
      const eventData = `id: ${event.id || Date.now()}\n` +
                       `event: ${event.type}\n` +
                       `data: ${JSON.stringify(event.data)}\n\n`;

      res.write(eventData);
    } catch (error) {
      console.error('Failed to send SSE event:', error);
    }
  }

  /**
   * Get connections subscribed to specific event type
   */
  private getConnectionsForEvent(eventType: ValidChannel, event: any): SSEConnection[] {
    return Array.from(this.connections.values())
      .filter(conn => conn.subscriptions.includes(eventType))
      .filter(conn => !this.rateLimiter.isRateLimited(conn.id));
  }

  /**
   * Check if event should be sent to specific user
   */
  private async shouldSendToUser(connection: SSEConnection, event: any): Promise<boolean> {
    // Apply user-specific filtering
    if (!connection.filters) return true;

    // Don't send user's own posts back to them
    if (event.data?.authorId === connection.userId) return false;

    // Apply content filters
    if (connection.filters.blockedUsers?.includes(event.data?.authorId)) return false;

    // Check for blocked topics in content
    if (connection.filters.blockedTopics && event.data?.post?.content) {
      const hasBlockedTopic = connection.filters.blockedTopics.some(topic =>
        event.data.post.content.toLowerCase().includes(topic.toLowerCase())
      );
      if (hasBlockedTopic) return false;
    }

    // Apply political alignment filtering if configured
    if (connection.filters.politicalFilter && event.data?.author?.politicalAlignment) {
      return this.isPoliticallyRelevant(
        connection.filters.politicalFilter,
        event.data.author.politicalAlignment
      );
    }

    return true;
  }

  /**
   * Check if reaction is relevant to user
   */
  private async isRelevantReaction(connection: SSEConnection, event: PostReactionEvent): Promise<boolean> {
    // Always relevant if it's user's own post
    // TODO: Add logic to check if user is post author or currently viewing post
    return true;
  }

  /**
   * Check if trend is relevant to user
   */
  private async isTrendRelevant(connection: SSEConnection, trend: any): Promise<boolean> {
    if (!connection.filters?.regionFilter) return true;

    // Filter by region if user has preferences
    return connection.filters.regionFilter.includes(trend.region || 'global');
  }

  /**
   * Check if news item is relevant to user
   */
  private async isNewsRelevant(connection: SSEConnection, event: NewsItemEvent): Promise<boolean> {
    // Filter by relevance score threshold
    const minRelevance = connection.filters?.contentFilter?.minEngagement || 0;
    return event.data.relevanceScore >= minRelevance;
  }

  /**
   * Check political relevance
   */
  private isPoliticallyRelevant(filter: any, alignment: string): boolean {
    if (!filter.alignment) return true;

    const isOpposing = alignment !== filter.alignment;
    if (isOpposing && !filter.showOpposing) return false;

    const isNeutral = alignment === 'neutral';
    if (isNeutral && !filter.showNeutral) return false;

    return true;
  }

  /**
   * Handle connection disconnect
   */
  private handleDisconnect(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      try {
        connection.response.end();
      } catch (error) {
        // Connection may already be closed
      }

      // Remove from user connections tracking
      if (connection.userId) {
        const userConnections = this.userConnections.get(connection.userId);
        if (userConnections) {
          userConnections.delete(connectionId);
          if (userConnections.size === 0) {
            this.userConnections.delete(connection.userId);
          }
        }
      }

      this.connections.delete(connectionId);
      console.log(`SSE connection ${connectionId} disconnected`);
    }
  }

  /**
   * Parse subscription types from query parameter
   */
  private parseSubscriptionTypes(types: string | undefined): ValidChannel[] {
    if (!types) {
      return ['posts', 'reactions', 'trends', 'news']; // Default subscriptions
    }

    const requestedTypes = types.split(',') as ValidChannel[];
    return requestedTypes.filter(type => VALID_CHANNELS.includes(type));
  }

  /**
   * Get user-specific filters
   */
  private async getUserFilters(userId: string | undefined): Promise<UserFilters | undefined> {
    if (!userId) return undefined;

    try {
      // TODO: Implement database lookup for user preferences
      // For now, return default filters
      return {
        blockedUsers: [],
        blockedTopics: [],
        politicalFilter: {
          showOpposing: true,
          showNeutral: true,
          intensity: 'medium'
        }
      };
    } catch (error) {
      console.error('Failed to get user filters:', error);
      return undefined;
    }
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `sse_${uuidv4()}`;
  }

  /**
   * Cleanup stale connections
   */
  private cleanupStaleConnections(): void {
    const now = new Date();
    const staleTimeout = 5 * 60 * 1000; // 5 minutes

    Array.from(this.connections.entries()).forEach(([connectionId, connection]) => {
      if (now.getTime() - connection.lastActivity.getTime() > staleTimeout) {
        console.log(`Cleaning up stale SSE connection: ${connectionId}`);
        this.handleDisconnect(connectionId);
      }
    });
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
  getConnectionsByUser(userId: string): SSEConnection[] {
    return Array.from(this.connections.values())
      .filter(conn => conn.userId === userId);
  }

  /**
   * Disconnect all connections for a user
   */
  disconnectUser(userId: string): void {
    const userConnections = this.getConnectionsByUser(userId);
    userConnections.forEach(conn => this.handleDisconnect(conn.id));
  }

  /**
   * Broadcast event to all relevant connections
   */
  async broadcastEvent(event: any): Promise<void> {
    const eventType = event.type as ValidChannel;
    if (!VALID_CHANNELS.includes(eventType)) {
      console.warn(`Invalid event type for SSE broadcast: ${eventType}`);
      return;
    }

    // Route to appropriate handler based on event type
    switch (eventType) {
      case 'posts':
        await this.handlePostCreated(event as PostCreatedEvent);
        break;
      case 'reactions':
        await this.handlePostReaction(event as PostReactionEvent);
        break;
      case 'trends':
        await this.handleTrendUpdate(event as TrendUpdateEvent);
        break;
      case 'news':
        await this.handleNewsItem(event as NewsItemEvent);
        break;
      case 'ai_responses':
        await this.handleAIResponse(event as AIResponseEvent);
        break;
      default:
        console.warn(`Unhandled SSE event type: ${eventType}`);
    }
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): any {
    const stats = {
      totalConnections: this.connections.size,
      authenticatedUsers: this.userConnections.size,
      anonymousConnections: 0,
      subscriptionBreakdown: {} as Record<string, number>
    };

    // Count anonymous connections and subscription breakdown
    Array.from(this.connections.values()).forEach(connection => {
      if (!connection.userId) {
        stats.anonymousConnections++;
      }

      connection.subscriptions.forEach(sub => {
        stats.subscriptionBreakdown[sub] = (stats.subscriptionBreakdown[sub] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Close all connections
    Array.from(this.connections.keys()).forEach(connectionId => {
      this.handleDisconnect(connectionId);
    });
  }
}