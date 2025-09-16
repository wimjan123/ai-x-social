#!/usr/bin/env node

import { redis } from '../lib/redis';
import { cacheService } from '../services/CacheService';
import { logger } from '../lib/logger';

async function initializeRedis() {
  try {
    logger.info('Starting Redis initialization...');

    // Connect to Redis
    await redis.connect();

    // Run health check
    const health = await redis.healthCheck();
    logger.info('Redis health check:', health);

    if (health.status === 'unhealthy') {
      throw new Error('Redis health check failed');
    }

    // Test basic operations
    logger.info('Testing Redis operations...');

    // Test basic key-value operations
    await redis.set('test:init', { message: 'Redis initialization test', timestamp: new Date() });
    const testValue = await redis.get('test:init');
    logger.info('Test value retrieved:', testValue);

    // Test hash operations
    await redis.hset('test:hash', 'field1', 'value1');
    await redis.hset('test:hash', 'field2', { nested: 'value2' });
    const hashValue = await redis.hgetall('test:hash');
    logger.info('Test hash retrieved:', hashValue);

    // Test list operations
    await redis.lpush('test:list', 'item1', 'item2', 'item3');
    const listLength = await redis.llen('test:list');
    const listItem = await redis.rpop('test:list');
    logger.info(`Test list length: ${listLength}, popped item:`, listItem);

    // Test set operations
    await redis.sadd('test:set', 'member1', 'member2', 'member3');
    const setMembers = await redis.smembers('test:set');
    logger.info('Test set members:', setMembers);

    // Test pub/sub (brief test)
    let messageReceived = false;
    const testHandler = (message: any) => {
      logger.info('Received pub/sub message:', message);
      messageReceived = true;
    };

    await redis.subscribe('test:channel', testHandler);
    await redis.publish('test:channel', { test: 'pub/sub message' });

    // Wait a bit for message to be received
    await new Promise(resolve => setTimeout(resolve, 100));

    if (messageReceived) {
      logger.info('Pub/sub test successful');
    } else {
      logger.warn('Pub/sub test failed - message not received');
    }

    await redis.unsubscribe('test:channel', testHandler);

    // Test increment operations
    await redis.incr('test:counter');
    await redis.incr('test:counter');
    const counterValue = await redis.get<number>('test:counter', false);
    logger.info(`Test counter value: ${counterValue}`);

    // Test cache service
    logger.info('Testing cache service...');

    // Test cache service operations
    const testUser = {
      id: 'test-user-123',
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed',
      emailVerified: true,
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await cacheService.cacheUserProfile(testUser, 300); // 5 minutes TTL
    const cachedUser = await cacheService.getUserProfile('test-user-123');

    if (cachedUser) {
      logger.info('Cache service test successful - user cached and retrieved');
    } else {
      logger.warn('Cache service test failed - user not retrieved');
    }

    // Test rate limiting
    const rateCount1 = await cacheService.incrementRateLimit('test:rate', 60000);
    const rateCount2 = await cacheService.incrementRateLimit('test:rate', 60000);
    logger.info(`Rate limiting test: ${rateCount1}, ${rateCount2}`);

    // Test online users tracking
    await cacheService.addOnlineUser('user1');
    await cacheService.addOnlineUser('user2');
    const onlineUsers = await cacheService.getOnlineUsers();
    logger.info('Online users test:', onlineUsers);

    // Get cache metrics
    const metrics = cacheService.getMetrics();
    logger.info('Cache metrics:', metrics);

    // Clean up test data
    logger.info('Cleaning up test data...');
    await redis.del('test:init');
    await redis.del('test:hash');
    await redis.del('test:list');
    await redis.del('test:set');
    await redis.del('test:counter');
    await redis.del('test:rate');
    await cacheService.invalidateUserProfile('test-user-123');
    await cacheService.removeOnlineUser('user1');
    await cacheService.removeOnlineUser('user2');

    // Warmup cache with initial data
    await cacheService.warmupCache();

    logger.info('Redis initialization completed successfully');

  } catch (error) {
    logger.error('Redis initialization failed:', error);
    process.exit(1);
  } finally {
    await redis.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  initializeRedis().catch((error) => {
    logger.error('Unhandled error during Redis initialization:', error);
    process.exit(1);
  });
}

export { initializeRedis };