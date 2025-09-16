import { redis } from '../lib/redis';
import { logger } from '../lib/logger';
import type { UserAccount, Post, NewsItem, Trend, Persona } from '../generated/prisma';

interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
}

export class CacheService {
  private static instance: CacheService;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  };

  // Cache TTL constants (in seconds)
  private readonly TTL = {
    USER_PROFILE: 3600,      // 1 hour
    POST: 1800,              // 30 minutes
    NEWS_ITEM: 7200,         // 2 hours
    TRENDING_TOPICS: 300,    // 5 minutes
    AI_PERSONA: 3600,        // 1 hour
    USER_FEED: 600,          // 10 minutes
    SEARCH_RESULTS: 1800,    // 30 minutes
    INFLUENCE_METRICS: 1800, // 30 minutes
    SESSION: 86400,          // 24 hours
    RATE_LIMIT: 900,         // 15 minutes
  } as const;

  // Cache key patterns
  private readonly KEYS = {
    USER_PROFILE: (userId: string) => `user:profile:${userId}`,
    USER_METRICS: (userId: string) => `user:metrics:${userId}`,
    POST: (postId: string) => `post:${postId}`,
    POST_REPLIES: (postId: string) => `post:replies:${postId}`,
    USER_POSTS: (userId: string) => `user:posts:${userId}`,
    USER_FEED: (userId: string) => `user:feed:${userId}`,
    NEWS_ITEM: (newsId: string) => `news:${newsId}`,
    NEWS_CATEGORY: (category: string) => `news:category:${category}`,
    TRENDING_TOPICS: () => `trends:topics`,
    TRENDING_HASHTAGS: () => `trends:hashtags`,
    AI_PERSONA: (personaId: string) => `persona:${personaId}`,
    AI_CONTEXT: (personaId: string, userId: string) => `ai:context:${personaId}:${userId}`,
    SEARCH_RESULTS: (query: string, type: string) => `search:${type}:${Buffer.from(query).toString('base64')}`,
    RATE_LIMIT: (identifier: string) => `rate:${identifier}`,
    SESSION: (sessionId: string) => `session:${sessionId}`,
    ONLINE_USERS: () => `users:online`,
    NOTIFICATION_COUNT: (userId: string) => `notifications:count:${userId}`,
  } as const;

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // User caching
  public async cacheUserProfile(user: UserAccount, ttl: number = this.TTL.USER_PROFILE): Promise<void> {
    try {
      await redis.set(this.KEYS.USER_PROFILE(user.id), user, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached user profile: ${user.id}`);
    } catch (error) {
      logger.error('Failed to cache user profile:', error);
    }
  }

  public async getUserProfile(userId: string): Promise<UserAccount | null> {
    try {
      const user = await redis.get<UserAccount>(this.KEYS.USER_PROFILE(userId));
      if (user) {
        this.metrics.hits++;
        logger.debug(`Cache hit for user profile: ${userId}`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for user profile: ${userId}`);
      }
      return user;
    } catch (error) {
      logger.error('Failed to get user profile from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  public async invalidateUserProfile(userId: string): Promise<boolean> {
    try {
      const deleted = await redis.del(this.KEYS.USER_PROFILE(userId));
      if (deleted) {
        this.metrics.deletes++;
        logger.debug(`Invalidated user profile cache: ${userId}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Failed to invalidate user profile cache:', error);
      return false;
    }
  }

  // Post caching
  public async cachePost(post: Post, ttl: number = this.TTL.POST): Promise<void> {
    try {
      await redis.set(this.KEYS.POST(post.id), post, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached post: ${post.id}`);
    } catch (error) {
      logger.error('Failed to cache post:', error);
    }
  }

  public async getPost(postId: string): Promise<Post | null> {
    try {
      const post = await redis.get<Post>(this.KEYS.POST(postId));
      if (post) {
        this.metrics.hits++;
        logger.debug(`Cache hit for post: ${postId}`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for post: ${postId}`);
      }
      return post;
    } catch (error) {
      logger.error('Failed to get post from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  public async invalidatePost(postId: string): Promise<boolean> {
    try {
      const deleted = await redis.del(this.KEYS.POST(postId));
      if (deleted) {
        this.metrics.deletes++;
        logger.debug(`Invalidated post cache: ${postId}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Failed to invalidate post cache:', error);
      return false;
    }
  }

  // User feed caching
  public async cacheUserFeed(userId: string, posts: Post[], ttl: number = this.TTL.USER_FEED): Promise<void> {
    try {
      await redis.set(this.KEYS.USER_FEED(userId), posts, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached user feed: ${userId} (${posts.length} posts)`);
    } catch (error) {
      logger.error('Failed to cache user feed:', error);
    }
  }

  public async getUserFeed(userId: string): Promise<Post[] | null> {
    try {
      const feed = await redis.get<Post[]>(this.KEYS.USER_FEED(userId));
      if (feed) {
        this.metrics.hits++;
        logger.debug(`Cache hit for user feed: ${userId}`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for user feed: ${userId}`);
      }
      return feed;
    } catch (error) {
      logger.error('Failed to get user feed from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  public async invalidateUserFeed(userId: string): Promise<boolean> {
    try {
      const deleted = await redis.del(this.KEYS.USER_FEED(userId));
      if (deleted) {
        this.metrics.deletes++;
        logger.debug(`Invalidated user feed cache: ${userId}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Failed to invalidate user feed cache:', error);
      return false;
    }
  }

  // News caching
  public async cacheNewsItem(newsItem: NewsItem, ttl: number = this.TTL.NEWS_ITEM): Promise<void> {
    try {
      await redis.set(this.KEYS.NEWS_ITEM(newsItem.id), newsItem, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached news item: ${newsItem.id}`);
    } catch (error) {
      logger.error('Failed to cache news item:', error);
    }
  }

  public async getNewsItem(newsId: string): Promise<NewsItem | null> {
    try {
      const newsItem = await redis.get<NewsItem>(this.KEYS.NEWS_ITEM(newsId));
      if (newsItem) {
        this.metrics.hits++;
        logger.debug(`Cache hit for news item: ${newsId}`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for news item: ${newsId}`);
      }
      return newsItem;
    } catch (error) {
      logger.error('Failed to get news item from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  // Trending topics caching
  public async cacheTrendingTopics(trends: Trend[], ttl: number = this.TTL.TRENDING_TOPICS): Promise<void> {
    try {
      await redis.set(this.KEYS.TRENDING_TOPICS(), trends, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached trending topics (${trends.length} items)`);
    } catch (error) {
      logger.error('Failed to cache trending topics:', error);
    }
  }

  public async getTrendingTopics(): Promise<Trend[] | null> {
    try {
      const trends = await redis.get<Trend[]>(this.KEYS.TRENDING_TOPICS());
      if (trends) {
        this.metrics.hits++;
        logger.debug('Cache hit for trending topics');
      } else {
        this.metrics.misses++;
        logger.debug('Cache miss for trending topics');
      }
      return trends;
    } catch (error) {
      logger.error('Failed to get trending topics from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  // AI Persona caching
  public async cacheAIPersona(persona: Persona, ttl: number = this.TTL.AI_PERSONA): Promise<void> {
    try {
      await redis.set(this.KEYS.AI_PERSONA(persona.id), persona, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached AI persona: ${persona.id}`);
    } catch (error) {
      logger.error('Failed to cache AI persona:', error);
    }
  }

  public async getAIPersona(personaId: string): Promise<Persona | null> {
    try {
      const persona = await redis.get<Persona>(this.KEYS.AI_PERSONA(personaId));
      if (persona) {
        this.metrics.hits++;
        logger.debug(`Cache hit for AI persona: ${personaId}`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for AI persona: ${personaId}`);
      }
      return persona;
    } catch (error) {
      logger.error('Failed to get AI persona from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  // AI context caching (for conversation history)
  public async cacheAIContext(personaId: string, userId: string, context: any, ttl: number = this.TTL.SESSION): Promise<void> {
    try {
      await redis.set(this.KEYS.AI_CONTEXT(personaId, userId), context, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached AI context: ${personaId}:${userId}`);
    } catch (error) {
      logger.error('Failed to cache AI context:', error);
    }
  }

  public async getAIContext(personaId: string, userId: string): Promise<any | null> {
    try {
      const context = await redis.get(this.KEYS.AI_CONTEXT(personaId, userId));
      if (context) {
        this.metrics.hits++;
        logger.debug(`Cache hit for AI context: ${personaId}:${userId}`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for AI context: ${personaId}:${userId}`);
      }
      return context;
    } catch (error) {
      logger.error('Failed to get AI context from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  // Rate limiting
  public async incrementRateLimit(identifier: string, windowMs: number): Promise<number> {
    try {
      const windowSeconds = Math.floor(windowMs / 1000);
      const count = await redis.incr(this.KEYS.RATE_LIMIT(identifier), windowSeconds);
      logger.debug(`Rate limit incremented for ${identifier}: ${count}`);
      return count;
    } catch (error) {
      logger.error('Failed to increment rate limit:', error);
      return 0;
    }
  }

  public async getRateLimit(identifier: string): Promise<number> {
    try {
      const count = await redis.get<number>(this.KEYS.RATE_LIMIT(identifier), false);
      return count ? parseInt(count.toString()) : 0;
    } catch (error) {
      logger.error('Failed to get rate limit:', error);
      return 0;
    }
  }

  // Online users tracking
  public async addOnlineUser(userId: string, ttl: number = 300): Promise<void> {
    try {
      await redis.sadd(this.KEYS.ONLINE_USERS(), userId);
      await redis.set(`user:online:${userId}`, Date.now(), { ttl });
      logger.debug(`Added online user: ${userId}`);
    } catch (error) {
      logger.error('Failed to add online user:', error);
    }
  }

  public async removeOnlineUser(userId: string): Promise<void> {
    try {
      await redis.srem(this.KEYS.ONLINE_USERS(), userId);
      await redis.del(`user:online:${userId}`);
      logger.debug(`Removed online user: ${userId}`);
    } catch (error) {
      logger.error('Failed to remove online user:', error);
    }
  }

  public async getOnlineUsers(): Promise<string[]> {
    try {
      return await redis.smembers<string>(this.KEYS.ONLINE_USERS());
    } catch (error) {
      logger.error('Failed to get online users:', error);
      return [];
    }
  }

  // Notification count tracking
  public async incrementNotificationCount(userId: string): Promise<number> {
    try {
      return await redis.incr(this.KEYS.NOTIFICATION_COUNT(userId));
    } catch (error) {
      logger.error('Failed to increment notification count:', error);
      return 0;
    }
  }

  public async resetNotificationCount(userId: string): Promise<void> {
    try {
      await redis.del(this.KEYS.NOTIFICATION_COUNT(userId));
      logger.debug(`Reset notification count for user: ${userId}`);
    } catch (error) {
      logger.error('Failed to reset notification count:', error);
    }
  }

  public async getNotificationCount(userId: string): Promise<number> {
    try {
      const count = await redis.get<number>(this.KEYS.NOTIFICATION_COUNT(userId), false);
      return count ? parseInt(count.toString()) : 0;
    } catch (error) {
      logger.error('Failed to get notification count:', error);
      return 0;
    }
  }

  // Search results caching
  public async cacheSearchResults(query: string, type: string, results: any[], ttl: number = this.TTL.SEARCH_RESULTS): Promise<void> {
    try {
      await redis.set(this.KEYS.SEARCH_RESULTS(query, type), results, { ttl });
      this.metrics.sets++;
      logger.debug(`Cached search results for "${query}" (${type}): ${results.length} items`);
    } catch (error) {
      logger.error('Failed to cache search results:', error);
    }
  }

  public async getSearchResults(query: string, type: string): Promise<any[] | null> {
    try {
      const results = await redis.get<any[]>(this.KEYS.SEARCH_RESULTS(query, type));
      if (results) {
        this.metrics.hits++;
        logger.debug(`Cache hit for search results: "${query}" (${type})`);
      } else {
        this.metrics.misses++;
        logger.debug(`Cache miss for search results: "${query}" (${type})`);
      }
      return results;
    } catch (error) {
      logger.error('Failed to get search results from cache:', error);
      this.metrics.misses++;
      return null;
    }
  }

  // Cache management
  public async clearUserCache(userId: string): Promise<void> {
    try {
      const patterns = [
        this.KEYS.USER_PROFILE(userId),
        this.KEYS.USER_METRICS(userId),
        this.KEYS.USER_POSTS(userId),
        this.KEYS.USER_FEED(userId),
        this.KEYS.NOTIFICATION_COUNT(userId),
      ];

      await Promise.all(patterns.map(key => redis.del(key)));
      logger.info(`Cleared cache for user: ${userId}`);
    } catch (error) {
      logger.error('Failed to clear user cache:', error);
    }
  }

  public async warmupCache(): Promise<void> {
    try {
      logger.info('Starting cache warmup...');

      // Warmup trending topics (would be replaced with actual data)
      await this.cacheTrendingTopics([]);

      logger.info('Cache warmup completed');
    } catch (error) {
      logger.error('Cache warmup failed:', error);
    }
  }

  public getMetrics(): CacheMetrics & { hitRate: number } {
    const total = this.metrics.hits + this.metrics.misses;
    const hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;

    return {
      ...this.metrics,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  public resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
  }
}

export const cacheService = CacheService.getInstance();