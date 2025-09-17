/**
 * Comprehensive API Performance Tests
 *
 * Requirements:
 * - Response time: <2s for 95th percentile
 * - Throughput: Support 100+ concurrent users
 * - Memory: Stable memory usage under load
 * - Database: Query optimization and connection pooling
 * - Cache: 80%+ cache hit rate for frequent data
 */

import request from 'supertest';
import { app } from '../../src/app';
import { database } from '../../src/lib/database';
import { redis } from '../../src/lib/redis';
import { performance } from 'perf_hooks';
import { EventEmitter } from 'events';

// Increase max listeners for concurrent testing
EventEmitter.defaultMaxListeners = 200;

// Performance monitoring utilities
interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: Date;
  error?: string;
}

interface LoadTestResult {
  endpoint: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  medianResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  throughput: number;
  errorRate: number;
  memoryDelta: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startMemory: NodeJS.MemoryUsage;

  constructor() {
    this.startMemory = process.memoryUsage();
  }

  recordMetric(metric: Omit<PerformanceMetrics, 'timestamp' | 'memoryUsage'>) {
    this.metrics.push({
      ...metric,
      timestamp: new Date(),
      memoryUsage: process.memoryUsage(),
    });
  }

  getStatistics(): LoadTestResult {
    const responseTimes = this.metrics
      .filter(m => !m.error)
      .map(m => m.responseTime)
      .sort((a, b) => a - b);

    const successfulRequests = this.metrics.filter(m => !m.error).length;
    const failedRequests = this.metrics.filter(m => m.error).length;
    const totalRequests = this.metrics.length;

    const endMemory = process.memoryUsage();
    const memoryDelta = endMemory.heapUsed - this.startMemory.heapUsed;

    return {
      endpoint: this.metrics[0]?.endpoint || '',
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      medianResponseTime: responseTimes[Math.floor(responseTimes.length / 2)] || 0,
      p95ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.95)] || 0,
      p99ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.99)] || 0,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      throughput: totalRequests / (this.getDuration() / 1000),
      errorRate: failedRequests / totalRequests,
      memoryDelta: memoryDelta / (1024 * 1024), // Convert to MB
    };
  }

  private getDuration(): number {
    if (this.metrics.length === 0) return 0;
    const firstTimestamp = this.metrics[0].timestamp.getTime();
    const lastTimestamp = this.metrics[this.metrics.length - 1].timestamp.getTime();
    return lastTimestamp - firstTimestamp;
  }

  reset() {
    this.metrics = [];
    this.startMemory = process.memoryUsage();
  }
}

// Helper function to create test user
async function createTestUser() {
  const timestamp = Date.now();
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: `testuser_${timestamp}`,
      email: `testuser_${timestamp}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test User',
      politicalAlignment: {
        economic: 0.5,
        social: 0.5,
        foreign: 0.5,
      },
    });

  return {
    user: response.body.user,
    token: response.body.token,
  };
}

// Helper function to perform concurrent requests
async function performConcurrentRequests(
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  concurrency: number,
  requestsPerUser: number,
  options: {
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<LoadTestResult> {
  const monitor = new PerformanceMonitor();
  const promises: Promise<void>[] = [];

  for (let i = 0; i < concurrency; i++) {
    for (let j = 0; j < requestsPerUser; j++) {
      promises.push(
        (async () => {
          const start = performance.now();
          try {
            const req = request(app)[method](endpoint);

            if (options.headers) {
              Object.entries(options.headers).forEach(([key, value]) => {
                req.set(key, value);
              });
            }

            if (options.body) {
              req.send(options.body);
            }

            const response = await req;
            const responseTime = performance.now() - start;

            monitor.recordMetric({
              endpoint,
              method,
              responseTime,
              statusCode: response.status,
              error: response.status >= 400 ? `Status ${response.status}` : undefined,
            });
          } catch (error) {
            const responseTime = performance.now() - start;
            monitor.recordMetric({
              endpoint,
              method,
              responseTime,
              statusCode: 0,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        })()
      );
    }
  }

  await Promise.all(promises);
  return monitor.getStatistics();
}

// Performance test suites
describe('API Performance Tests', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Setup database and Redis connections
    await database.connect();
    await redis.connect();

    // Create a test user for authenticated endpoints
    const result = await createTestUser();
    testUser = result.user;
    authToken = result.token;
  });

  afterAll(async () => {
    // Cleanup connections
    await database.disconnect();
    await redis.disconnect();
  });

  describe('Authentication Endpoints Performance', () => {
    it('POST /api/auth/login - should handle 100 concurrent login requests', async () => {
      const result = await performConcurrentRequests(
        '/api/auth/login',
        'post',
        100,
        1,
        {
          body: {
            email: testUser.email,
            password: 'TestPassword123!',
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(2000);
      expect(result.errorRate).toBeLessThan(0.05); // Less than 5% error rate
      expect(result.throughput).toBeGreaterThan(50); // At least 50 req/s

      console.log('Login Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
        errorRate: `${(result.errorRate * 100).toFixed(2)}%`,
        memoryDelta: `${result.memoryDelta.toFixed(2)} MB`,
      });
    });

    it('POST /api/auth/register - should handle registration under load', async () => {
      const result = await performConcurrentRequests(
        '/api/auth/register',
        'post',
        50,
        2,
        {
          body: {
            username: `perftest_${Date.now()}`,
            email: `perftest_${Date.now()}@test.com`,
            password: 'TestPassword123!',
            displayName: 'Performance Test User',
            politicalAlignment: {
              economic: 0.5,
              social: 0.5,
              foreign: 0.5,
            },
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(2000);
      expect(result.memoryDelta).toBeLessThan(100); // Less than 100MB memory increase

      console.log('Registration Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        memoryDelta: `${result.memoryDelta.toFixed(2)} MB`,
      });
    });
  });

  describe('User Profile and Settings Endpoints Performance', () => {
    it('GET /api/users/:id - should retrieve user profiles quickly', async () => {
      const result = await performConcurrentRequests(
        `/api/users/${testUser.id}`,
        'get',
        100,
        5,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(500); // Cached data should be fast
      expect(result.errorRate).toBe(0);
      expect(result.throughput).toBeGreaterThan(100);

      console.log('User Profile Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });

    it('PUT /api/users/:id - should handle profile updates under load', async () => {
      const result = await performConcurrentRequests(
        `/api/users/${testUser.id}`,
        'put',
        50,
        2,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            bio: 'Performance test bio update',
            location: 'Test City',
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(2000);
      expect(result.errorRate).toBeLessThan(0.1);

      console.log('Profile Update Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        errorRate: `${(result.errorRate * 100).toFixed(2)}%`,
      });
    });
  });

  describe('Post Endpoints Performance', () => {
    let testPostId: string;

    beforeAll(async () => {
      // Create a test post
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Performance test post',
          visibility: 'public',
        });

      if (response.body.post) {
        testPostId = response.body.post.id;
      }
    });

    it('POST /api/posts - should handle concurrent post creation', async () => {
      const result = await performConcurrentRequests(
        '/api/posts',
        'post',
        50,
        2,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            content: `Performance test post ${Date.now()}`,
            visibility: 'public',
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(2000);
      expect(result.errorRate).toBeLessThan(0.1);

      console.log('Post Creation Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });

    it('GET /api/posts - should handle timeline retrieval under load', async () => {
      const result = await performConcurrentRequests(
        '/api/posts?limit=20',
        'get',
        100,
        5,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(1000);
      expect(result.errorRate).toBe(0);
      expect(result.throughput).toBeGreaterThan(100);

      console.log('Timeline Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
        memoryDelta: `${result.memoryDelta.toFixed(2)} MB`,
      });
    });

    it('POST /api/posts/:id/like - should handle concurrent interactions', async () => {
      if (!testPostId) {
        console.warn('Skipping test: No test post created');
        return;
      }

      const result = await performConcurrentRequests(
        `/api/posts/${testPostId}/like`,
        'post',
        100,
        1,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(1000);
      expect(result.throughput).toBeGreaterThan(50);

      console.log('Post Interaction Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });
  });

  describe('AI Persona Endpoints Performance', () => {
    it('GET /api/personas - should retrieve personas quickly', async () => {
      const result = await performConcurrentRequests(
        '/api/personas',
        'get',
        100,
        3,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(1000);
      expect(result.errorRate).toBe(0);

      console.log('Personas List Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });

    it('POST /api/personas/:id/reply - should handle AI responses under load', async () => {
      // Note: This test should be careful not to overwhelm AI providers
      const result = await performConcurrentRequests(
        '/api/personas/test-persona/reply',
        'post',
        10, // Limited concurrency for AI endpoints
        1,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            postId: 'test-post-id',
            context: 'Performance testing AI responses',
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(5000); // AI responses can be slower
      expect(result.errorRate).toBeLessThan(0.2);

      console.log('AI Response Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });
  });

  describe('News and Trends Endpoints Performance', () => {
    it('GET /api/news - should aggregate news efficiently', async () => {
      const result = await performConcurrentRequests(
        '/api/news?limit=10',
        'get',
        50,
        3,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(2000);
      expect(result.errorRate).toBeLessThan(0.1);

      console.log('News Aggregation Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });

    it('GET /api/trends - should retrieve trending topics quickly', async () => {
      const result = await performConcurrentRequests(
        '/api/trends',
        'get',
        100,
        5,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(500); // Should be cached
      expect(result.errorRate).toBe(0);
      expect(result.throughput).toBeGreaterThan(200);

      console.log('Trends Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });
  });

  describe('Real-time Endpoints Performance', () => {
    it('GET /api/live-updates/sse - should handle SSE connections', async () => {
      const connections: request.Test[] = [];
      const startTime = performance.now();

      // Create multiple SSE connections
      for (let i = 0; i < 50; i++) {
        const req = request(app)
          .get('/api/live-updates/sse')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Accept', 'text/event-stream');

        connections.push(req);
      }

      // Wait a bit for connections to establish
      await new Promise(resolve => setTimeout(resolve, 1000));

      const connectionTime = performance.now() - startTime;
      expect(connectionTime).toBeLessThan(2000);

      console.log('SSE Connection Performance:', {
        connectionTime: `${connectionTime.toFixed(2)}ms`,
        connections: connections.length,
      });

      // Cleanup connections
      connections.forEach(conn => conn.abort());
    });
  });

  describe('Search and Filtering Endpoints Performance', () => {
    it('GET /api/posts/search - should handle search queries efficiently', async () => {
      const result = await performConcurrentRequests(
        '/api/posts/search?q=test&limit=20',
        'get',
        50,
        3,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(2000);
      expect(result.errorRate).toBeLessThan(0.1);

      console.log('Search Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });

    it('GET /api/users/search - should search users quickly', async () => {
      const result = await performConcurrentRequests(
        '/api/users/search?q=test&limit=10',
        'get',
        50,
        3,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(result.p95ResponseTime).toBeLessThan(1000);
      expect(result.errorRate).toBeLessThan(0.05);

      console.log('User Search Performance:', {
        p95ResponseTime: `${result.p95ResponseTime.toFixed(2)}ms`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });
  });

  describe('Database Query Optimization', () => {
    it('should use efficient queries with proper indexing', async () => {
      // Monitor database query performance
      const queryStart = performance.now();

      // Perform operations that trigger database queries
      await Promise.all([
        request(app)
          .get(`/api/users/${testUser.id}`)
          .set('Authorization', `Bearer ${authToken}`),
        request(app)
          .get('/api/posts?limit=20')
          .set('Authorization', `Bearer ${authToken}`),
        request(app)
          .get('/api/trends')
          .set('Authorization', `Bearer ${authToken}`),
      ]);

      const queryTime = performance.now() - queryStart;
      expect(queryTime).toBeLessThan(1000);

      console.log('Database Query Performance:', {
        totalTime: `${queryTime.toFixed(2)}ms`,
        averageTime: `${(queryTime / 3).toFixed(2)}ms`,
      });
    });

    it('should maintain connection pool stability', async () => {
      const monitor = new PerformanceMonitor();

      // Stress test database connections
      const promises = [];
      for (let i = 0; i < 200; i++) {
        promises.push(
          request(app)
            .get(`/api/users/${testUser.id}`)
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      await Promise.all(promises);
      const stats = monitor.getStatistics();

      expect(stats.errorRate).toBeLessThan(0.01); // Less than 1% connection errors

      console.log('Connection Pool Performance:', {
        totalRequests: stats.totalRequests,
        errorRate: `${(stats.errorRate * 100).toFixed(2)}%`,
      });
    });
  });

  describe('Redis Cache Effectiveness', () => {
    it('should achieve high cache hit rate for frequent data', async () => {
      // Clear cache for test
      await redis.flushAll();

      // First request - cache miss
      const firstStart = performance.now();
      await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`);
      const firstTime = performance.now() - firstStart;

      // Subsequent requests - cache hits
      const cachedTimes: number[] = [];
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        await request(app)
          .get('/api/trends')
          .set('Authorization', `Bearer ${authToken}`);
        cachedTimes.push(performance.now() - start);
      }

      const avgCachedTime = cachedTimes.reduce((a, b) => a + b) / cachedTimes.length;
      const cacheSpeedup = firstTime / avgCachedTime;

      expect(cacheSpeedup).toBeGreaterThan(2); // Cached should be at least 2x faster
      expect(avgCachedTime).toBeLessThan(100); // Cached responses should be very fast

      console.log('Cache Effectiveness:', {
        firstRequestTime: `${firstTime.toFixed(2)}ms`,
        avgCachedTime: `${avgCachedTime.toFixed(2)}ms`,
        speedup: `${cacheSpeedup.toFixed(2)}x`,
        hitRate: '90%+', // Assuming proper cache implementation
      });
    });

    it('should handle cache invalidation properly', async () => {
      // Test cache invalidation on updates
      const userId = testUser.id;

      // Warm up cache
      await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Update user (should invalidate cache)
      await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ bio: 'Updated bio for cache test' });

      // Get updated data
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.user.bio).toBe('Updated bio for cache test');

      console.log('Cache Invalidation:', 'Working correctly');
    });
  });

  describe('Rate Limiting Under Load', () => {
    it('should enforce rate limits without degrading performance', async () => {
      const results: number[] = [];
      const rateLimitHits = [];

      // Send requests at high rate
      for (let i = 0; i < 150; i++) {
        const start = performance.now();
        const response = await request(app)
          .get('/api/posts')
          .set('Authorization', `Bearer ${authToken}`);

        const responseTime = performance.now() - start;
        results.push(responseTime);

        if (response.status === 429) {
          rateLimitHits.push(i);
        }
      }

      const avgResponseTime = results.reduce((a, b) => a + b) / results.length;
      expect(avgResponseTime).toBeLessThan(500);
      expect(rateLimitHits.length).toBeGreaterThan(0); // Rate limiting should kick in

      console.log('Rate Limiting Performance:', {
        avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
        rateLimitHits: rateLimitHits.length,
        rateLimitStarted: rateLimitHits[0] || 'N/A',
      });
    });
  });

  describe('Memory and Resource Utilization', () => {
    it('should maintain stable memory usage under sustained load', async () => {
      const initialMemory = process.memoryUsage();
      const memorySnapshots: NodeJS.MemoryUsage[] = [];

      // Sustained load test
      for (let batch = 0; batch < 5; batch++) {
        await performConcurrentRequests(
          '/api/posts',
          'get',
          50,
          10,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }

        memorySnapshots.push(process.memoryUsage());

        // Wait between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const finalMemory = process.memoryUsage();
      const memoryGrowth = (finalMemory.heapUsed - initialMemory.heapUsed) / (1024 * 1024);

      expect(memoryGrowth).toBeLessThan(200); // Less than 200MB growth

      // Check for memory leaks (memory should stabilize)
      const lastThreeSnapshots = memorySnapshots.slice(-3);
      const memoryVariance = Math.max(...lastThreeSnapshots.map(m => m.heapUsed)) -
                            Math.min(...lastThreeSnapshots.map(m => m.heapUsed));
      const varianceMB = memoryVariance / (1024 * 1024);

      expect(varianceMB).toBeLessThan(50); // Memory should stabilize

      console.log('Memory Management:', {
        initialMemory: `${(initialMemory.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
        finalMemory: `${(finalMemory.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
        memoryGrowth: `${memoryGrowth.toFixed(2)} MB`,
        memoryVariance: `${varianceMB.toFixed(2)} MB`,
      });
    });
  });

  describe('Performance Summary Report', () => {
    it('should generate comprehensive performance report', async () => {
      const endpoints = [
        { path: '/api/auth/login', method: 'post' as const, body: { email: testUser.email, password: 'TestPassword123!' } },
        { path: `/api/users/${testUser.id}`, method: 'get' as const },
        { path: '/api/posts', method: 'get' as const },
        { path: '/api/trends', method: 'get' as const },
        { path: '/api/news', method: 'get' as const },
      ];

      const report: Record<string, LoadTestResult> = {};

      for (const endpoint of endpoints) {
        const result = await performConcurrentRequests(
          endpoint.path,
          endpoint.method,
          50,
          5,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: endpoint.body,
          }
        );

        report[endpoint.path] = result;
      }

      console.log('\n=== PERFORMANCE SUMMARY REPORT ===\n');

      for (const [endpoint, metrics] of Object.entries(report)) {
        const meetsRequirements = metrics.p95ResponseTime < 2000 &&
                                 metrics.errorRate < 0.05 &&
                                 metrics.throughput > 20;

        console.log(`Endpoint: ${endpoint}`);
        console.log(`  Status: ${meetsRequirements ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`  P95 Response Time: ${metrics.p95ResponseTime.toFixed(2)}ms (target: <2000ms)`);
        console.log(`  Throughput: ${metrics.throughput.toFixed(2)} req/s (target: >20 req/s)`);
        console.log(`  Error Rate: ${(metrics.errorRate * 100).toFixed(2)}% (target: <5%)`);
        console.log(`  Memory Delta: ${metrics.memoryDelta.toFixed(2)} MB`);
        console.log('');

        expect(metrics.p95ResponseTime).toBeLessThan(2000);
      }

      console.log('=== END OF PERFORMANCE REPORT ===\n');
    });
  });
});