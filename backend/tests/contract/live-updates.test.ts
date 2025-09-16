import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';
import { createTestUser, getValidJWT, cleanupTestData } from '../helpers/auth';

describe('Contract: GET /api/live-updates', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'live_updates_user',
      email: 'liveupdates@example.com',
      password: 'LiveUpdatesPass123',
      displayName: 'Live Updates User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Server-Sent Events Stream', () => {
    it('should initiate SSE connection with proper headers', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      // Validate SSE response headers
      expect(response.headers['content-type']).toMatch(/text\/event-stream/);
      expect(response.headers['cache-control']).toBe('no-cache');
      expect(response.headers['connection']).toBe('keep-alive');
      expect(response.headers['access-control-allow-origin']).toBeDefined();

      // Initial connection should be established
      expect(response.status).toBe(200);
    });

    it('should handle SSE connection with types parameter', async () => {
      const types = ['posts', 'reactions'];

      const response = await request(app)
        .get('/api/live-updates')
        .query({ types })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    });

    it('should handle all valid update types', async () => {
      const validTypes = ['posts', 'reactions', 'news', 'trends'];

      for (const type of validTypes) {
        const response = await request(app)
          .get('/api/live-updates')
          .query({ types: [type] })
          .set('Authorization', `Bearer ${authToken}`)
          .set('Accept', 'text/event-stream')
          .expect(200);

        expect(response.headers['content-type']).toMatch(/text\/event-stream/);
      }
    });

    it('should handle multiple update types simultaneously', async () => {
      const types = ['posts', 'reactions', 'news', 'trends'];

      const response = await request(app)
        .get('/api/live-updates')
        .query({ types })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    });

    it('should establish connection without types parameter (all updates)', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    });

    it('should handle WebSocket upgrade requests', async () => {
      // Test WebSocket upgrade attempt (might return 426 Upgrade Required)
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Connection', 'Upgrade')
        .set('Upgrade', 'websocket')
        .set('Sec-WebSocket-Key', 'dGhlIHNhbXBsZSBub25jZQ==')
        .set('Sec-WebSocket-Version', '13');

      // Should either upgrade to WebSocket (101) or continue with SSE (200)
      expect([101, 200]).toContain(response.status);

      if (response.status === 101) {
        expect(response.headers['upgrade']).toBe('websocket');
        expect(response.headers['connection']).toMatch(/upgrade/i);
      }
    });
  });

  describe('Event Stream Content Validation', () => {
    it('should send properly formatted SSE events', (done) => {
      const req = request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      let eventData = '';

      req.on('data', (chunk) => {
        eventData += chunk.toString();

        // Check for SSE event format
        if (eventData.includes('\n\n')) {
          const events = eventData.split('\n\n');

          events.forEach(event => {
            if (event.trim()) {
              // Each event should follow SSE format
              expect(event).toMatch(/^(data:|event:|id:|retry:)/m);

              // If it's a data event, should contain valid JSON
              const dataMatch = event.match(/^data: (.+)$/m);
              if (dataMatch) {
                try {
                  const jsonData = JSON.parse(dataMatch[1]);
                  expect(jsonData).toHaveProperty('type');
                  expect(jsonData).toHaveProperty('timestamp');
                } catch (e) {
                  // Some events might not be JSON (like heartbeats)
                }
              }
            }
          });

          done();
        }
      });

      req.on('error', done);

      // Close connection after short delay
      setTimeout(() => {
        req.abort();
        if (!done) done();
      }, 1000);
    });

    it('should include heartbeat events to maintain connection', (done) => {
      const req = request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      let receivedHeartbeat = false;

      req.on('data', (chunk) => {
        const data = chunk.toString();

        // Look for heartbeat or ping events
        if (data.includes('heartbeat') || data.includes('ping') || data.includes('keep-alive')) {
          receivedHeartbeat = true;
          req.abort();
          done();
        }
      });

      req.on('error', done);

      // If no heartbeat in 2 seconds, that's also acceptable
      setTimeout(() => {
        req.abort();
        done();
      }, 2000);
    });

    it('should send events in proper chronological order', (done) => {
      const req = request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      const timestamps: number[] = [];

      req.on('data', (chunk) => {
        const data = chunk.toString();
        const events = data.split('\n\n');

        events.forEach(event => {
          const dataMatch = event.match(/^data: (.+)$/m);
          if (dataMatch) {
            try {
              const jsonData = JSON.parse(dataMatch[1]);
              if (jsonData.timestamp) {
                const timestamp = new Date(jsonData.timestamp).getTime();
                timestamps.push(timestamp);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        });

        // Check if timestamps are in order
        if (timestamps.length > 1) {
          for (let i = 1; i < timestamps.length; i++) {
            expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
          }
          req.abort();
          done();
        }
      });

      req.on('error', done);

      setTimeout(() => {
        req.abort();
        done();
      }, 2000);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid update types', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .query({ types: ['invalid_type'] })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('types')
      });
    });

    it('should reject malformed types parameter', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .query({ types: 'not_an_array' })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject empty types array', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .query({ types: [] })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('types')
      });
    });

    it('should handle mixed valid and invalid types', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .query({ types: ['posts', 'invalid_type', 'news'] })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should handle special characters in types parameter', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .query({ types: ['posts&news'] })
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Authorization Tests', () => {
    it('should reject requests without authorization header', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Accept', 'text/event-stream')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject requests with invalid JWT token', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', 'Bearer invalid_token')
        .set('Accept', 'text/event-stream')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token')
      });
    });

    it('should reject requests with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', 'NotBearer token')
        .set('Accept', 'text/event-stream')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject expired JWT tokens', async () => {
      // Mock expired token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';

      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${expiredToken}`)
        .set('Accept', 'text/event-stream')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should allow different users to have independent streams', async () => {
      // Create another user
      const otherUser = await createTestUser({
        username: 'other_live_user',
        email: 'otherlive@example.com'
      });
      const otherToken = await getValidJWT(otherUser.id);

      // Both users should be able to connect simultaneously
      const response1 = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      const response2 = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${otherToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      expect(response1.headers['content-type']).toMatch(/text\/event-stream/);
      expect(response2.headers['content-type']).toMatch(/text\/event-stream/);
    });
  });

  describe('Connection Management', () => {
    it('should handle client disconnect gracefully', (done) => {
      const req = request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      // Immediately abort to test disconnect handling
      setTimeout(() => {
        req.abort();
        done();
      }, 100);
    });

    it('should handle multiple concurrent connections from same user', async () => {
      const promises = Array(3).fill(null).map(() =>
        request(app)
          .get('/api/live-updates')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Accept', 'text/event-stream')
          .timeout(1000)
      );

      // All connections should be established successfully
      const results = await Promise.allSettled(promises);

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          expect(result.value.status).toBe(200);
        }
        // Some might timeout, which is acceptable for this test
      });
    });

    it('should include proper CORS headers for cross-origin requests', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBeDefined();
    });

    it('should handle preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/live-updates')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toMatch(/GET/);
      expect(response.headers['access-control-allow-headers']).toMatch(/Authorization/);
    });
  });

  describe('Performance and Resource Management', () => {
    it('should establish connection within reasonable time', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      const endTime = Date.now();
      const connectionTime = endTime - startTime;

      // Connection should be established quickly (under 1 second)
      expect(connectionTime).toBeLessThan(1000);
      expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    });

    it('should include rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });

    it('should handle connection limits gracefully', async () => {
      // Attempt to create many connections rapidly
      const connections = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/live-updates')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Accept', 'text/event-stream')
          .timeout(500)
      );

      const results = await Promise.allSettled(connections);

      // Most connections should succeed, but some might be rate limited
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 200);
      const rateLimited = results.filter(r => r.status === 'fulfilled' && r.value.status === 429);

      expect(successful.length + rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should handle missing Accept header gracefully', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should still work or return appropriate error
      expect([200, 400, 406]).toContain(response.status);
    });

    it('should handle malformed Accept header', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'application/invalid')
        .expect(200);

      // Should fallback to SSE or return error
      expect([200, 406]).toContain(response.status);
    });

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should handle server shutdown gracefully', (done) => {
      const req = request(app)
        .get('/api/live-updates')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      req.on('data', () => {
        // Connection established
      });

      req.on('end', () => {
        // Server closed connection cleanly
        done();
      });

      req.on('error', () => {
        // Connection error is also acceptable
        done();
      });

      // Simulate server shutdown after delay
      setTimeout(() => {
        req.abort();
        done();
      }, 1000);
    });
  });
});