// Event Publisher with Redis pub/sub for cross-instance communication
// Implements T053a: Redis-based event distribution

import { Redis } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import {
  RealtimeEvent,
  EventHandler,
  PostCreatedEvent,
  PostReactionEvent,
  TrendUpdateEvent,
  NewsItemEvent,
  AIResponseEvent,
  UserStatusEvent,
  ReactionType,
  ValidChannel
} from './types';
import { Post, UserProfile, Persona, Trend, NewsItem } from '../../generated/prisma';

export class EventPublisher {
  private redis: Redis;
  private subscriber: Redis;
  private subscribers: Map<string, EventHandler[]> = new Map();
  private isInitialized = false;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true
    });

    this.subscriber = this.redis.duplicate();
    this.setupRedisSubscriptions();
  }

  /**
   * Initialize the event publisher
   */
  async initialize(): Promise<void> {
    try {
      await this.redis.connect();
      await this.subscriber.connect();
      this.isInitialized = true;
      console.log('EventPublisher initialized with Redis connection');
    } catch (error) {
      console.error('Failed to initialize EventPublisher:', error);
      throw error;
    }
  }

  /**
   * Publish an event to Redis and local subscribers
   */
  async publish(eventType: ValidChannel, data: any): Promise<void> {
    if (!this.isInitialized) {
      console.warn('EventPublisher not initialized, skipping publish');
      return;
    }

    const event: RealtimeEvent = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
      id: this.generateEventId(),
      userId: data.userId || data.authorId
    };

    try {
      // Publish to Redis for cross-instance communication
      await this.redis.publish(`events:${eventType}`, JSON.stringify(event));

      // Notify local subscribers immediately
      await this.notifyLocalSubscribers(eventType, event);

    } catch (error) {
      console.error(`Failed to publish event ${eventType}:`, error);
      // Still try to notify local subscribers even if Redis fails
      await this.notifyLocalSubscribers(eventType, event);
    }
  }

  /**
   * Subscribe to events
   */
  subscribe(eventType: ValidChannel, handler: EventHandler): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(handler);
    console.log(`Subscribed to event type: ${eventType}`);
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(eventType: ValidChannel, handler: EventHandler): void {
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        console.log(`Unsubscribed from event type: ${eventType}`);
      }
    }
  }

  /**
   * Setup Redis subscriptions for cross-instance events
   */
  private async setupRedisSubscriptions(): Promise<void> {
    this.subscriber.on('connect', () => {
      console.log('EventPublisher Redis subscriber connected');
    });

    this.subscriber.on('error', (error) => {
      console.error('EventPublisher Redis subscriber error:', error);
    });

    this.subscriber.on('message', async (channel: string, message: string) => {
      try {
        const eventType = channel.replace('events:', '') as ValidChannel;
        const event = JSON.parse(message) as RealtimeEvent;

        // Only process events from other instances (avoid duplication)
        if (event.id && !this.isLocalEvent(event.id)) {
          await this.notifyLocalSubscribers(eventType, event);
        }
      } catch (error) {
        console.error('Redis message processing error:', error);
      }
    });

    // Subscribe to all event channels when connected
    this.subscriber.on('ready', async () => {
      try {
        await this.subscriber.psubscribe('events:*');
        console.log('EventPublisher subscribed to all event channels');
      } catch (error) {
        console.error('Failed to subscribe to Redis channels:', error);
      }
    });
  }

  /**
   * Notify local subscribers
   */
  private async notifyLocalSubscribers(eventType: ValidChannel, event: RealtimeEvent): Promise<void> {
    const handlers = this.subscribers.get(eventType) || [];

    const promises = handlers.map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Event handler error for ${eventType}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Check if event was generated locally (to avoid processing duplicates)
   */
  private isLocalEvent(eventId: string): boolean {
    // Simple check - could be enhanced with instance ID
    return eventId.startsWith(process.env.INSTANCE_ID || 'local');
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    const instanceId = process.env.INSTANCE_ID || 'local';
    return `${instanceId}_${uuidv4()}`;
  }

  // Convenience methods for common events

  /**
   * Publish post created event
   */
  async publishPostCreated(post: Post, author: UserProfile): Promise<void> {
    const eventData: PostCreatedEvent['data'] = {
      postId: post.id,
      post,
      author,
      authorId: author.id,
      timestamp: new Date().toISOString()
    };

    await this.publish('posts', eventData);
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
    const eventData: PostReactionEvent['data'] = {
      postId,
      userId,
      reactionType,
      newCount,
      timestamp: new Date().toISOString()
    };

    await this.publish('reactions', eventData);
  }

  /**
   * Publish trend update event
   */
  async publishTrendUpdate(
    trend: Trend,
    action: 'new' | 'update' | 'expired'
  ): Promise<void> {
    const eventData: TrendUpdateEvent['data'] = {
      trend,
      action,
      timestamp: new Date().toISOString()
    };

    await this.publish('trends', eventData);
  }

  /**
   * Publish news item event
   */
  async publishNewsItem(newsItem: NewsItem, relevanceScore: number): Promise<void> {
    const eventData: NewsItemEvent['data'] = {
      newsItem,
      relevanceScore,
      timestamp: new Date().toISOString()
    };

    await this.publish('news', eventData);
  }

  /**
   * Publish AI response event
   */
  async publishAIResponse(
    post: Post,
    persona: Persona,
    originalPostId?: string
  ): Promise<void> {
    const eventData: AIResponseEvent['data'] = {
      responseId: post.id,
      post,
      persona,
      originalPostId,
      timestamp: new Date().toISOString()
    };

    await this.publish('ai_responses', eventData);
  }

  /**
   * Publish user status event
   */
  async publishUserStatus(userId: string, status: 'online' | 'offline'): Promise<void> {
    const eventData: UserStatusEvent['data'] = {
      userId,
      status,
      timestamp: new Date().toISOString()
    };

    await this.publish('user_status', eventData);
  }

  /**
   * Publish typing indicator event
   */
  async publishTypingIndicator(
    userId: string,
    threadId: string,
    action: 'start' | 'stop'
  ): Promise<void> {
    const eventData = {
      userId,
      threadId,
      action,
      timestamp: new Date().toISOString()
    };

    await this.publish('typing_indicators', eventData);
  }

  /**
   * Publish live reaction event
   */
  async publishLiveReaction(
    postId: string,
    userId: string,
    reaction: ReactionType
  ): Promise<void> {
    const eventData = {
      postId,
      userId,
      reaction,
      timestamp: Date.now()
    };

    await this.publish('live_reactions', eventData);
  }

  /**
   * Batch publish multiple events
   */
  async publishBatch(events: Array<{ type: ValidChannel; data: any }>): Promise<void> {
    const promises = events.map(({ type, data }) => this.publish(type, data));
    await Promise.allSettled(promises);
  }

  /**
   * Get subscription statistics
   */
  getSubscriptionStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const [eventType, handlers] of this.subscribers) {
      stats[eventType] = handlers.length;
    }

    return stats;
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<{ status: string; redis: boolean; subscriber: boolean }> {
    try {
      const redisPing = await this.redis.ping();
      const subscriberStatus = this.subscriber.status;

      return {
        status: redisPing === 'PONG' && subscriberStatus === 'ready' ? 'healthy' : 'unhealthy',
        redis: redisPing === 'PONG',
        subscriber: subscriberStatus === 'ready'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        redis: false,
        subscriber: false
      };
    }
  }

  /**
   * Get event publishing metrics
   */
  getMetrics(): {
    totalSubscribers: number;
    eventTypes: string[];
    redisConnected: boolean;
  } {
    return {
      totalSubscribers: Array.from(this.subscribers.values())
        .reduce((total, handlers) => total + handlers.length, 0),
      eventTypes: Array.from(this.subscribers.keys()),
      redisConnected: this.redis.status === 'ready'
    };
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    try {
      // Unsubscribe from Redis channels
      await this.subscriber.punsubscribe();

      // Close Redis connections
      await this.redis.quit();
      await this.subscriber.quit();

      // Clear local subscribers
      this.subscribers.clear();

      console.log('EventPublisher destroyed successfully');
    } catch (error) {
      console.error('Error destroying EventPublisher:', error);
    }
  }
}