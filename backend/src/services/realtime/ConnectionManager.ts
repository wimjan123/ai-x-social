// Connection Manager for fallback and recovery mechanisms
// Implements T053c: Intelligent routing between SSE and WebSocket with graceful degradation

import {
  RealtimeEvent,
  SSEConnection,
  WSConnection,
  ConnectionStatus,
  PerformanceMetrics,
  ReconnectionOptions,
  ValidChannel
} from './types';
import { SSEController } from './SSEController';
import { WebSocketController } from './WebSocketController';
import { EventPublisher } from './EventPublisher';

export class ConnectionManager {
  private sseController: SSEController;
  private wsController: WebSocketController;
  private eventPublisher: EventPublisher;
  private fallbackStrategy: FallbackStrategy;
  private performanceMonitor: PerformanceMonitor;
  private isShuttingDown = false;

  constructor(
    sseController: SSEController,
    wsController: WebSocketController,
    eventPublisher: EventPublisher
  ) {
    this.sseController = sseController;
    this.wsController = wsController;
    this.eventPublisher = eventPublisher;
    this.fallbackStrategy = new FallbackStrategy();
    this.performanceMonitor = new PerformanceMonitor();

    this.setupEventRouting();
    this.startPerformanceMonitoring();
  }

  /**
   * Setup intelligent event routing between SSE and WebSocket
   */
  private setupEventRouting(): void {
    // Subscribe to all events and route them intelligently
    const eventTypes: ValidChannel[] = [
      'posts', 'reactions', 'trends', 'news', 'ai_responses',
      'typing_indicators', 'live_reactions', 'user_status', 'direct_messages'
    ];

    eventTypes.forEach(eventType => {
      this.eventPublisher.subscribe(eventType, async (event) => {
        await this.routeEvent(event);
      });
    });
  }

  /**
   * Intelligently route events based on their nature and available connections
   */
  async routeEvent(event: RealtimeEvent): Promise<void> {
    if (this.isShuttingDown) return;

    const startTime = Date.now();

    try {
      // Determine optimal delivery method based on event type
      if (this.isInteractiveEvent(event)) {
        // Interactive events: Try WebSocket first, fallback to SSE
        const wsSuccess = await this.tryWebSocketDelivery(event);
        if (!wsSuccess) {
          console.log(`WebSocket delivery failed for ${event.type}, falling back to SSE`);
          await this.trySSEDelivery(event);
        }
      } else {
        // Timeline events: Use SSE primarily, WebSocket as backup
        const sseSuccess = await this.trySSEDelivery(event);
        if (!sseSuccess) {
          console.log(`SSE delivery failed for ${event.type}, falling back to WebSocket`);
          await this.tryWebSocketDelivery(event);
        }
      }

      // Record performance metrics
      this.performanceMonitor.recordEventDelivery(event.type, Date.now() - startTime);

    } catch (error) {
      console.error(`Event routing failed for ${event.type}:`, error);
      this.performanceMonitor.recordError(event.type);
    }
  }

  /**
   * Determine if event is interactive (requires low-latency WebSocket)
   */
  private isInteractiveEvent(event: RealtimeEvent): boolean {
    const interactiveTypes = [
      'typing_indicators',
      'live_reactions',
      'direct_messages',
      'user_status'
    ];
    return interactiveTypes.includes(event.type);
  }

  /**
   * Attempt WebSocket delivery
   */
  private async tryWebSocketDelivery(event: RealtimeEvent): Promise<boolean> {
    try {
      const wsConnections = this.wsController.getActiveConnections();
      if (wsConnections === 0) {
        return false; // No WebSocket connections available
      }

      await this.wsController.broadcastEvent(event);
      this.performanceMonitor.recordWSSuccess(event.type);
      return true;

    } catch (error) {
      console.warn('WebSocket delivery failed:', error);
      this.performanceMonitor.recordWSFailure(event.type);
      this.fallbackStrategy.recordFailure('websocket');
      return false;
    }
  }

  /**
   * Attempt SSE delivery
   */
  private async trySSEDelivery(event: RealtimeEvent): Promise<boolean> {
    try {
      const sseConnections = this.sseController.getActiveConnections();
      if (sseConnections === 0) {
        return false; // No SSE connections available
      }

      await this.sseController.broadcastEvent(event);
      this.performanceMonitor.recordSSESuccess(event.type);
      return true;

    } catch (error) {
      console.error('SSE delivery failed:', error);
      this.performanceMonitor.recordSSEFailure(event.type);
      this.fallbackStrategy.recordFailure('sse');
      return false;
    }
  }

  /**
   * Get current connection status across both protocols
   */
  getConnectionStatus(): ConnectionStatus {
    const sseConnections = this.sseController.getActiveConnections();
    const wsConnections = this.wsController.getActiveConnections();

    // Estimate unique users (may have both SSE and WS connections)
    const sseStats = this.sseController.getConnectionStats();
    const wsStats = this.wsController.getConnectionStats();

    return {
      sseConnections,
      wsConnections,
      totalUsers: Math.max(sseStats.authenticatedUsers || 0, wsStats.uniqueUsers || 0),
      activeStreams: sseConnections + wsConnections
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * Force disconnect user from all connections
   */
  async disconnectUser(userId: string, reason = 'User requested disconnect'): Promise<void> {
    console.log(`Disconnecting user ${userId}: ${reason}`);

    // Disconnect from both SSE and WebSocket
    this.sseController.disconnectUser(userId);
    this.wsController.disconnectUser(userId);

    // Publish user offline status
    await this.eventPublisher.publishUserStatus(userId, 'offline');
  }

  /**
   * Get connection details for a specific user
   */
  getUserConnectionDetails(userId: string): {
    sse: SSEConnection[];
    websocket: WSConnection[];
    totalConnections: number;
  } {
    const sseConnections = this.sseController.getConnectionsByUser(userId);
    const wsConnections = this.wsController.getUserConnections(userId);

    return {
      sse: sseConnections,
      websocket: wsConnections,
      totalConnections: sseConnections.length + wsConnections.length
    };
  }

  /**
   * Health check for the entire real-time system
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    sse: { active: boolean; connections: number };
    websocket: { active: boolean; connections: number };
    redis: { status: string; redis: boolean; subscriber: boolean };
    performance: PerformanceMetrics;
  }> {
    const redisHealth = await this.eventPublisher.healthCheck();
    const performance = this.getPerformanceMetrics();
    const connectionStatus = this.getConnectionStatus();

    const sseActive = connectionStatus.sseConnections > 0;
    const wsActive = connectionStatus.wsConnections > 0;
    const redisHealthy = redisHealth.status === 'healthy';

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';

    if (redisHealthy && (sseActive || wsActive) && performance.errorRate < 0.05) {
      overallStatus = 'healthy';
    } else if ((sseActive || wsActive) && performance.errorRate < 0.2) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    return {
      status: overallStatus,
      sse: {
        active: sseActive,
        connections: connectionStatus.sseConnections
      },
      websocket: {
        active: wsActive,
        connections: connectionStatus.wsConnections
      },
      redis: redisHealth,
      performance
    };
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    // Monitor system health every 30 seconds
    setInterval(async () => {
      const health = await this.healthCheck();

      if (health.status === 'unhealthy') {
        console.warn('Real-time system is unhealthy:', health);
      } else if (health.status === 'degraded') {
        console.warn('Real-time system is degraded:', health);
      }

      // Log performance metrics periodically
      if (health.performance.eventsPerSecond > 0) {
        console.log('Real-time performance:', {
          eventsPerSecond: health.performance.eventsPerSecond,
          avgResponseTime: health.performance.avgResponseTime,
          errorRate: health.performance.errorRate,
          connections: health.sse.connections + health.websocket.connections
        });
      }
    }, 30000);
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log('Initiating graceful shutdown of ConnectionManager...');
    this.isShuttingDown = true;

    try {
      // Stop accepting new events
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close controllers
      this.sseController.destroy();
      this.wsController.destroy();

      console.log('ConnectionManager shutdown completed');
    } catch (error) {
      console.error('Error during ConnectionManager shutdown:', error);
    }
  }
}

/**
 * Fallback strategy for handling connection failures
 */
class FallbackStrategy {
  private failures: Map<string, { count: number; lastFailure: Date }> = new Map();
  private readonly maxFailures = 5;
  private readonly resetWindow = 5 * 60 * 1000; // 5 minutes

  recordFailure(type: 'sse' | 'websocket'): void {
    const now = new Date();
    const existing = this.failures.get(type);

    if (existing && now.getTime() - existing.lastFailure.getTime() > this.resetWindow) {
      // Reset if outside window
      this.failures.set(type, { count: 1, lastFailure: now });
    } else {
      // Increment failure count
      this.failures.set(type, {
        count: (existing?.count || 0) + 1,
        lastFailure: now
      });
    }

    const failureData = this.failures.get(type)!;
    if (failureData.count >= this.maxFailures) {
      console.error(`${type} has exceeded max failures (${this.maxFailures}), may need intervention`);
    }
  }

  shouldAvoid(type: 'sse' | 'websocket'): boolean {
    const failure = this.failures.get(type);
    if (!failure) return false;

    const now = new Date();
    if (now.getTime() - failure.lastFailure.getTime() > this.resetWindow) {
      this.failures.delete(type); // Reset
      return false;
    }

    return failure.count >= this.maxFailures;
  }

  getFailureStats(): Record<string, { count: number; lastFailure: string | null }> {
    const stats: Record<string, { count: number; lastFailure: string | null }> = {};

    Array.from(this.failures.entries()).forEach(([type, data]) => {
      stats[type] = {
        count: data.count,
        lastFailure: data.lastFailure.toISOString()
      };
    });

    return stats;
  }
}

/**
 * Performance monitoring for real-time events
 */
class PerformanceMonitor {
  private eventCounts: Map<string, number> = new Map();
  private eventTimes: Map<string, number[]> = new Map();
  private errors: Map<string, number> = new Map();
  private wsSuccesses: Map<string, number> = new Map();
  private wsFailures: Map<string, number> = new Map();
  private sseSuccesses: Map<string, number> = new Map();
  private sseFailures: Map<string, number> = new Map();
  private startTime = Date.now();
  private peakConnections = 0;

  recordEventDelivery(eventType: string, responseTime: number): void {
    // Count events
    this.eventCounts.set(eventType, (this.eventCounts.get(eventType) || 0) + 1);

    // Track response times
    if (!this.eventTimes.has(eventType)) {
      this.eventTimes.set(eventType, []);
    }
    const times = this.eventTimes.get(eventType)!;
    times.push(responseTime);

    // Keep only last 100 response times per event type
    if (times.length > 100) {
      times.shift();
    }
  }

  recordError(eventType: string): void {
    this.errors.set(eventType, (this.errors.get(eventType) || 0) + 1);
  }

  recordWSSuccess(eventType: string): void {
    this.wsSuccesses.set(eventType, (this.wsSuccesses.get(eventType) || 0) + 1);
  }

  recordWSFailure(eventType: string): void {
    this.wsFailures.set(eventType, (this.wsFailures.get(eventType) || 0) + 1);
  }

  recordSSESuccess(eventType: string): void {
    this.sseSuccesses.set(eventType, (this.sseSuccesses.get(eventType) || 0) + 1);
  }

  recordSSEFailure(eventType: string): void {
    this.sseFailures.set(eventType, (this.sseFailures.get(eventType) || 0) + 1);
  }

  updatePeakConnections(currentConnections: number): void {
    this.peakConnections = Math.max(this.peakConnections, currentConnections);
  }

  getMetrics(): PerformanceMetrics {
    const totalEvents = Array.from(this.eventCounts.values()).reduce((sum, count) => sum + count, 0);
    const totalErrors = Array.from(this.errors.values()).reduce((sum, count) => sum + count, 0);
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;

    // Calculate average response time across all events
    let totalResponseTime = 0;
    let totalResponseCount = 0;

    Array.from(this.eventTimes.values()).forEach(times => {
      totalResponseTime += times.reduce((sum, time) => sum + time, 0);
      totalResponseCount += times.length;
    });

    const avgResponseTime = totalResponseCount > 0 ? totalResponseTime / totalResponseCount : 0;
    const eventsPerSecond = elapsedSeconds > 0 ? totalEvents / elapsedSeconds : 0;
    const errorRate = totalEvents > 0 ? totalErrors / totalEvents : 0;

    return {
      avgResponseTime,
      peakConnections: this.peakConnections,
      eventsPerSecond,
      errorRate,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
    };
  }

  getDetailedStats(): any {
    return {
      eventCounts: Object.fromEntries(this.eventCounts),
      errors: Object.fromEntries(this.errors),
      wsSuccesses: Object.fromEntries(this.wsSuccesses),
      wsFailures: Object.fromEntries(this.wsFailures),
      sseSuccesses: Object.fromEntries(this.sseSuccesses),
      sseFailures: Object.fromEntries(this.sseFailures),
      peakConnections: this.peakConnections,
      uptime: Date.now() - this.startTime
    };
  }
}