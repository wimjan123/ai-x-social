import Redis, { Redis as RedisType } from 'ioredis';
import { logger } from './logger';

interface RedisConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db: number;
  keyPrefix: string;
  retryAttempts: number;
  retryDelay: number;
  connectionTimeout: number;
  commandTimeout: number;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
}

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  serialize?: boolean;
  compress?: boolean;
}

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

class RedisClient {
  private static instance: RedisClient;
  private client: RedisType;
  private subscriber: RedisType;
  private publisher: RedisType;
  private config: RedisConfig;
  private isConnected: boolean = false;
  private eventHandlers: Map<string, Set<Function>> = new Map();

  private constructor() {
    this.config = this.parseConfig();
    this.client = this.createConnection('main');
    this.subscriber = this.createConnection('subscriber');
    this.publisher = this.createConnection('publisher');
    this.setupEventListeners();
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  private parseConfig(): RedisConfig {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const url = new URL(redisUrl);

    return {
      host: url.hostname || 'localhost',
      port: parseInt(url.port) || 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      db: parseInt(url.pathname.slice(1)) || 0,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'aix:',
      retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '200'),
      connectionTimeout: parseInt(process.env.REDIS_CONNECTION_TIMEOUT || '10000'),
      commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000'),
      maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
      lazyConnect: true,
    };
  }

  private createConnection(name: string): RedisType {
    const connection = new Redis({
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
      password: this.config.password,
      db: this.config.db,
      keyPrefix: this.config.keyPrefix,
      retryDelayOnFailover: this.config.retryDelay,
      maxRetriesPerRequest: this.config.maxRetriesPerRequest,
      lazyConnect: this.config.lazyConnect,
      connectTimeout: this.config.connectionTimeout,
      commandTimeout: this.config.commandTimeout,
      family: 4, // IPv4
      keepAlive: 30000,
      connectionName: `ai-x-social-${name}`,
    });

    connection.on('connect', () => {
      logger.info(`Redis ${name} connection established`);
      if (name === 'main') this.isConnected = true;
    });

    connection.on('ready', () => {
      logger.info(`Redis ${name} connection ready`);
    });

    connection.on('error', (error) => {
      logger.error(`Redis ${name} connection error:`, error);
      if (name === 'main') this.isConnected = false;
    });

    connection.on('close', () => {
      logger.warn(`Redis ${name} connection closed`);
      if (name === 'main') this.isConnected = false;
    });

    connection.on('reconnecting', () => {
      logger.info(`Redis ${name} reconnecting...`);
    });

    return connection;
  }

  private setupEventListeners(): void {
    // Handle graceful shutdown
    process.on('beforeExit', async () => {
      await this.disconnect();
    });

    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public async connect(): Promise<void> {
    try {
      logger.info('Connecting to Redis...');

      await Promise.all([
        this.client.connect(),
        this.subscriber.connect(),
        this.publisher.connect(),
      ]);

      // Test connection
      await this.client.ping();

      logger.info('Redis connections established successfully', {
        host: this.config.host,
        port: this.config.port,
        db: this.config.db,
      });

    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      logger.info('Disconnecting from Redis...');

      await Promise.all([
        this.client.disconnect(),
        this.subscriber.disconnect(),
        this.publisher.disconnect(),
      ]);

      this.isConnected = false;
      logger.info('Redis connections closed successfully');
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
    }
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    memory: any;
    connections: number;
    version: string;
  }> {
    const startTime = Date.now();

    try {
      const [pong, info, memory] = await Promise.all([
        this.client.ping(),
        this.client.info('server'),
        this.client.info('memory'),
      ]);

      const latency = Date.now() - startTime;

      // Parse server info
      const serverInfo = this.parseRedisInfo(info);
      const memoryInfo = this.parseRedisInfo(memory);

      return {
        status: pong === 'PONG' ? 'healthy' : 'unhealthy',
        latency,
        memory: {
          used: memoryInfo.used_memory_human,
          peak: memoryInfo.used_memory_peak_human,
          lua: memoryInfo.used_memory_lua_human,
        },
        connections: parseInt(serverInfo.connected_clients) || 0,
        version: serverInfo.redis_version || 'unknown',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        memory: {},
        connections: 0,
        version: 'unknown',
      };
    }
  }

  private parseRedisInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = info.split('\r\n');

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    }

    return result;
  }

  // Cache operations
  public async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const { ttl = 3600, serialize = true } = options;

    try {
      const cacheEntry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
      };

      const serializedValue = serialize ? JSON.stringify(cacheEntry) : value as string;

      if (ttl > 0) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  }

  public async get<T>(key: string, serialize: boolean = true): Promise<T | null> {
    try {
      const value = await this.client.get(key);

      if (!value) {
        return null;
      }

      if (!serialize) {
        return value as T;
      }

      const cacheEntry: CacheEntry<T> = JSON.parse(value);

      // Check if entry has expired (additional safety check)
      const now = Date.now();
      if (cacheEntry.ttl > 0 && (now - cacheEntry.timestamp) / 1000 > cacheEntry.ttl) {
        await this.del(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result > 0;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  public async incr(key: string, ttl?: number): Promise<number> {
    try {
      const result = await this.client.incr(key);

      if (ttl && result === 1) {
        await this.client.expire(key, ttl);
      }

      return result;
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      throw error;
    }
  }

  public async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      logger.error(`Redis DECR error for key ${key}:`, error);
      throw error;
    }
  }

  // List operations
  public async lpush<T>(key: string, ...values: T[]): Promise<number> {
    try {
      const serializedValues = values.map(v => JSON.stringify(v));
      return await this.client.lpush(key, ...serializedValues);
    } catch (error) {
      logger.error(`Redis LPUSH error for key ${key}:`, error);
      throw error;
    }
  }

  public async rpop<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.rpop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis RPOP error for key ${key}:`, error);
      return null;
    }
  }

  public async llen(key: string): Promise<number> {
    try {
      return await this.client.llen(key);
    } catch (error) {
      logger.error(`Redis LLEN error for key ${key}:`, error);
      return 0;
    }
  }

  // Hash operations
  public async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.hset(key, field, serializedValue);
    } catch (error) {
      logger.error(`Redis HSET error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }

  public async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hget(key, field);

      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    } catch (error) {
      logger.error(`Redis HGET error for key ${key}, field ${field}:`, error);
      return null;
    }
  }

  public async hgetall<T>(key: string): Promise<Record<string, T>> {
    try {
      const hash = await this.client.hgetall(key);
      const result: Record<string, T> = {};

      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value as T;
        }
      }

      return result;
    } catch (error) {
      logger.error(`Redis HGETALL error for key ${key}:`, error);
      return {};
    }
  }

  // Set operations
  public async sadd<T>(key: string, ...members: T[]): Promise<number> {
    try {
      const serializedMembers = members.map(m => JSON.stringify(m));
      return await this.client.sadd(key, ...serializedMembers);
    } catch (error) {
      logger.error(`Redis SADD error for key ${key}:`, error);
      throw error;
    }
  }

  public async smembers<T>(key: string): Promise<T[]> {
    try {
      const members = await this.client.smembers(key);
      return members.map(m => JSON.parse(m));
    } catch (error) {
      logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      return [];
    }
  }

  public async srem<T>(key: string, ...members: T[]): Promise<number> {
    try {
      const serializedMembers = members.map(m => JSON.stringify(m));
      return await this.client.srem(key, ...serializedMembers);
    } catch (error) {
      logger.error(`Redis SREM error for key ${key}:`, error);
      throw error;
    }
  }

  // Pub/Sub operations
  public async publish(channel: string, message: any): Promise<number> {
    try {
      const serializedMessage = typeof message === 'string' ? message : JSON.stringify(message);
      return await this.publisher.publish(channel, serializedMessage);
    } catch (error) {
      logger.error(`Redis PUBLISH error for channel ${channel}:`, error);
      throw error;
    }
  }

  public async subscribe(channel: string, handler: (message: any) => void): Promise<void> {
    try {
      if (!this.eventHandlers.has(channel)) {
        this.eventHandlers.set(channel, new Set());

        await this.subscriber.subscribe(channel);

        this.subscriber.on('message', (receivedChannel, message) => {
          if (receivedChannel === channel) {
            const handlers = this.eventHandlers.get(channel);
            if (handlers) {
              try {
                const parsedMessage = JSON.parse(message);
                handlers.forEach(h => h(parsedMessage));
              } catch {
                handlers.forEach(h => h(message));
              }
            }
          }
        });
      }

      this.eventHandlers.get(channel)!.add(handler);
    } catch (error) {
      logger.error(`Redis SUBSCRIBE error for channel ${channel}:`, error);
      throw error;
    }
  }

  public async unsubscribe(channel: string, handler?: (message: any) => void): Promise<void> {
    try {
      const handlers = this.eventHandlers.get(channel);

      if (handlers) {
        if (handler) {
          handlers.delete(handler);
        } else {
          handlers.clear();
        }

        if (handlers.size === 0) {
          await this.subscriber.unsubscribe(channel);
          this.eventHandlers.delete(channel);
        }
      }
    } catch (error) {
      logger.error(`Redis UNSUBSCRIBE error for channel ${channel}:`, error);
      throw error;
    }
  }

  // Utility methods
  public async clearCache(pattern?: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern || '*');

      if (keys.length === 0) {
        return 0;
      }

      return await this.client.del(...keys);
    } catch (error) {
      logger.error('Redis CLEAR error:', error);
      throw error;
    }
  }

  public async getKeys(pattern: string = '*'): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error(`Redis KEYS error for pattern ${pattern}:`, error);
      return [];
    }
  }

  public get isReady(): boolean {
    return this.isConnected && this.client.status === 'ready';
  }

  public getClient(): RedisType {
    return this.client;
  }
}

// Export singleton instance
export const redis = RedisClient.getInstance();
export type { CacheOptions, CacheEntry };
export { RedisClient };