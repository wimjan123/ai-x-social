// Real-time Service Orchestrator
// Implements T053: Complete SSE + WebSocket hybrid real-time system
// Orchestrates EventPublisher, SSEController, WebSocketController, and ConnectionManager

import { Server } from 'http';
import { Request, Response } from 'express';
import {
  RealtimeEvent,
  ConnectionStatus,
  PerformanceMetrics,
  ReactionType,
  ValidChannel
} from './realtime/types';
import { EventPublisher } from './realtime/EventPublisher';
import { SSEController } from './realtime/SSEController';
import { WebSocketController } from './realtime/WebSocketController';
import { ConnectionManager } from './realtime/ConnectionManager';
import { Post, UserProfile, Persona, Trend, NewsItem } from '../generated/prisma';

export class RealtimeService {
  private eventPublisher: EventPublisher;
  private sseController: SSEController;
  private wsController: WebSocketController;
  private connectionManager: ConnectionManager;
  private isInitialized = false;
  private isShuttingDown = false;

  constructor(redisUrl: string) {
    // Initialize core components
    this.eventPublisher = new EventPublisher(redisUrl);
  }

  /**
   * Initialize the real-time service with HTTP server
   */
  async initialize(server: Server): Promise<void> {
    if (this.isInitialized) {
      console.warn('RealtimeService already initialized');
      return;
    }

    try {
      // Initialize EventPublisher first (requires Redis connection)
      await this.eventPublisher.initialize();

      // Initialize controllers
      this.sseController = new SSEController(this.eventPublisher);
      this.wsController = new WebSocketController(server, this.eventPublisher);

      // Initialize connection manager
      this.connectionManager = new ConnectionManager(
        this.sseController,
        this.wsController,
        this.eventPublisher
      );

      this.isInitialized = true;
      console.log('RealtimeService initialized successfully');

      // Log initial status
      setTimeout(() => {
        this.logSystemStatus();
      }, 1000);

    } catch (error) {
      console.error('Failed to initialize RealtimeService:', error);
      throw error;
    }
  }

  /**
   * Handle SSE connection requests
   */
  async handleSSEConnection(req: Request, res: Response): Promise<void> {
    if (!this.isInitialized) {
      res.status(503).json({ error: 'Real-time service not initialized' });
      return;
    }

    if (this.isShuttingDown) {
      res.status(503).json({ error: 'Service shutting down' });
      return;
    }

    try {
      await this.sseController.handleConnection(req, res);
    } catch (error) {
      console.error('SSE connection handling error:', error);
      res.status(500).json({ error: 'Failed to establish SSE connection' });
    }
  }

  // Event Publishing Methods (High-level API)

  /**
   * Publish post creation event
   */
  async publishPostCreated(post: Post, author: UserProfile): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishPostCreated(post, author);
  }

  /**
   * Publish post reaction event
   */
  async publishPostReaction(
    postId: string,
    userId: string,
    reactionType: ReactionType,
    newCount: number
  ): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishPostReaction(postId, userId, reactionType, newCount);
  }

  /**
   * Publish trend update event
   */
  async publishTrendUpdate(
    trend: Trend,
    action: 'new' | 'update' | 'expired'
  ): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishTrendUpdate(trend, action);
  }

  /**
   * Publish news item event
   */
  async publishNewsItem(newsItem: NewsItem, relevanceScore: number): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishNewsItem(newsItem, relevanceScore);
  }

  /**
   * Publish AI response event
   */
  async publishAIResponse(
    post: Post,
    persona: Persona,
    originalPostId?: string
  ): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishAIResponse(post, persona, originalPostId);
  }

  /**
   * Publish user status change
   */
  async publishUserStatus(userId: string, status: 'online' | 'offline'): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishUserStatus(userId, status);
  }

  /**
   * Publish typing indicator
   */
  async publishTypingIndicator(
    userId: string,
    threadId: string,
    action: 'start' | 'stop'
  ): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishTypingIndicator(userId, threadId, action);
  }

  /**
   * Publish live reaction
   */
  async publishLiveReaction(
    postId: string,
    userId: string,
    reaction: ReactionType
  ): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishLiveReaction(postId, userId, reaction);
  }

  /**
   * Batch publish multiple events
   */
  async publishBatch(events: Array<{ type: ValidChannel; data: any }>): Promise<void> {
    this.ensureInitialized();
    await this.eventPublisher.publishBatch(events);
  }

  // Connection Management Methods

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    this.ensureInitialized();
    return this.connectionManager.getConnectionStatus();
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    this.ensureInitialized();
    return this.connectionManager.getPerformanceMetrics();
  }

  /**
   * Disconnect a user from all real-time connections
   */
  async disconnectUser(userId: string, reason = 'User requested disconnect'): Promise<void> {
    this.ensureInitialized();
    await this.connectionManager.disconnectUser(userId, reason);
  }

  /**
   * Get connection details for a specific user
   */
  getUserConnectionDetails(userId: string): any {
    this.ensureInitialized();
    return this.connectionManager.getUserConnectionDetails(userId);
  }

  /**
   * Send direct message to user via WebSocket
   */
  async sendDirectMessage(
    toUserId: string,
    fromUserId: string,
    message: any
  ): Promise<boolean> {
    this.ensureInitialized();
    return this.wsController.sendDirectMessage(toUserId, fromUserId, message);
  }

  // System Health and Monitoring

  /**
   * Comprehensive health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    initialized: boolean;
    components: any;
    performance: PerformanceMetrics;
    uptime: number;
  }> {
    if (!this.isInitialized) {
      return {
        status: 'unhealthy',
        initialized: false,
        components: {},
        performance: {
          avgResponseTime: 0,
          peakConnections: 0,
          eventsPerSecond: 0,
          errorRate: 1,
          memoryUsage: 0
        },
        uptime: 0
      };
    }

    const health = await this.connectionManager.healthCheck();
    const eventPublisherHealth = await this.eventPublisher.healthCheck();

    return {
      status: health.status,
      initialized: this.isInitialized,
      components: {
        eventPublisher: eventPublisherHealth,
        sse: health.sse,
        websocket: health.websocket,
        redis: health.redis
      },
      performance: health.performance,
      uptime: process.uptime()
    };
  }

  /**
   * Get detailed system statistics
   */
  getSystemStats(): {
    connections: ConnectionStatus;
    performance: PerformanceMetrics;
    eventPublisher: any;
    sseController: any;
    wsController: any;
  } {
    this.ensureInitialized();

    return {
      connections: this.getConnectionStatus(),
      performance: this.getPerformanceMetrics(),
      eventPublisher: this.eventPublisher.getMetrics(),
      sseController: this.sseController.getConnectionStats(),
      wsController: this.wsController.getConnectionStats()
    };
  }

  /**
   * Log current system status
   */
  private async logSystemStatus(): Promise<void> {
    try {
      const health = await this.healthCheck();
      const stats = this.getSystemStats();

      console.log('=== Real-time System Status ===');
      console.log(`Status: ${health.status}`);
      console.log(`SSE Connections: ${stats.connections.sseConnections}`);
      console.log(`WebSocket Connections: ${stats.connections.wsConnections}`);
      console.log(`Total Users: ${stats.connections.totalUsers}`);
      console.log(`Events/sec: ${stats.performance.eventsPerSecond.toFixed(2)}`);
      console.log(`Avg Response Time: ${stats.performance.avgResponseTime.toFixed(2)}ms`);
      console.log(`Error Rate: ${(stats.performance.errorRate * 100).toFixed(2)}%`);
      console.log(`Memory Usage: ${stats.performance.memoryUsage.toFixed(2)}MB`);
      console.log('===============================');
    } catch (error) {
      console.error('Failed to log system status:', error);
    }
  }

  // Utility Methods

  /**
   * Subscribe to real-time events (for internal services)
   */
  subscribe(eventType: ValidChannel, handler: (event: RealtimeEvent) => Promise<void>): void {
    this.ensureInitialized();
    this.eventPublisher.subscribe(eventType, handler);
  }

  /**
   * Unsubscribe from real-time events
   */
  unsubscribe(eventType: ValidChannel, handler: (event: RealtimeEvent) => Promise<void>): void {
    this.ensureInitialized();
    this.eventPublisher.unsubscribe(eventType, handler);
  }

  /**
   * Manually trigger system status logging
   */
  async logStatus(): Promise<void> {
    await this.logSystemStatus();
  }

  // Lifecycle Management

  /**
   * Graceful shutdown of the real-time service
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized || this.isShuttingDown) {
      return;
    }

    console.log('Initiating graceful shutdown of RealtimeService...');
    this.isShuttingDown = true;

    try {
      // Shutdown in reverse order of initialization
      if (this.connectionManager) {
        await this.connectionManager.shutdown();
      }

      if (this.eventPublisher) {
        await this.eventPublisher.destroy();
      }

      console.log('RealtimeService shutdown completed');
    } catch (error) {
      console.error('Error during RealtimeService shutdown:', error);
    } finally {
      this.isInitialized = false;
      this.isShuttingDown = false;
    }
  }

  /**
   * Restart the service (useful for configuration changes)
   */
  async restart(server: Server): Promise<void> {
    console.log('Restarting RealtimeService...');
    await this.shutdown();
    await this.initialize(server);
    console.log('RealtimeService restarted successfully');
  }

  // Private Helper Methods

  /**
   * Ensure service is initialized before operations
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('RealtimeService not initialized. Call initialize() first.');
    }

    if (this.isShuttingDown) {
      throw new Error('RealtimeService is shutting down. Operations not available.');
    }
  }

  /**
   * Check if service is ready for operations
   */
  get isReady(): boolean {
    return this.isInitialized && !this.isShuttingDown;
  }

  /**
   * Get service status
   */
  get status(): 'uninitialized' | 'ready' | 'shutting_down' {
    if (this.isShuttingDown) return 'shutting_down';
    if (this.isInitialized) return 'ready';
    return 'uninitialized';
  }
}

// Export singleton instance factory
let realtimeServiceInstance: RealtimeService | null = null;

/**
 * Get or create the singleton RealtimeService instance
 */
export function getRealtimeService(redisUrl?: string): RealtimeService {
  if (!realtimeServiceInstance) {
    if (!redisUrl) {
      throw new Error('Redis URL required for first RealtimeService initialization');
    }
    realtimeServiceInstance = new RealtimeService(redisUrl);
  }
  return realtimeServiceInstance;
}

/**
 * Reset the singleton (useful for testing)
 */
export function resetRealtimeService(): void {
  realtimeServiceInstance = null;
}

// Types for external consumption
export type {
  RealtimeEvent,
  ConnectionStatus,
  PerformanceMetrics,
  ReactionType,
  ValidChannel
} from './realtime/types';