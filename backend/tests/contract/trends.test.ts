import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';
import { createTestUser, getValidJWT, cleanupTestData } from '../helpers/auth';

describe('Contract: GET /api/trends', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'trends_test_user',
      email: 'trends@example.com',
      password: 'TrendsPass123',
      displayName: 'Trends Test User',
      personaType: 'INFLUENCER'
    });
    authToken = await getValidJWT(testUser.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Success Cases', () => {
    it('should return array of trending topics with default parameters', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate response is array of Trend objects
      expect(Array.isArray(response.body)).toBe(true);

      // Validate individual trend items (if any exist)
      if (response.body.length > 0) {
        response.body.forEach((trend: any) => {
          expect(trend).toMatchObject({
            id: expect.any(String),
            hashtag: expect.any(String),
            keyword: expect.any(String),
            topic: expect.any(String),
            category: expect.any(String),
            region: expect.any(String),
            language: expect.any(String),
            volume: expect.any(Number),
            velocity: expect.any(Number),
            sentiment: expect.any(Number),
            controversyLevel: expect.any(Number),
            politicalBias: expect.any(Number),
            peakTime: expect.any(String),
            relatedTopics: expect.any(Array),
            associatedPersonas: expect.any(Array),
            newsItems: expect.any(Array),
            isActive: expect.any(Boolean),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          });

          // Validate UUID format
          expect(trend.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

          // Validate TrendCategory enum
          const validCategories = ['BREAKING_NEWS', 'POLITICS', 'ENTERTAINMENT', 'SPORTS', 'TECHNOLOGY', 'MEME', 'HASHTAG_GAME', 'OTHER'];
          expect(validCategories).toContain(trend.category);

          // Validate numeric ranges
          expect(trend.volume).toBeGreaterThanOrEqual(0);
          expect(trend.velocity).toBeGreaterThanOrEqual(0);
          expect(trend.sentiment).toBeGreaterThanOrEqual(-1);
          expect(trend.sentiment).toBeLessThanOrEqual(1);
          expect(trend.controversyLevel).toBeGreaterThanOrEqual(0);
          expect(trend.controversyLevel).toBeLessThanOrEqual(100);
          expect(trend.politicalBias).toBeGreaterThanOrEqual(-1);
          expect(trend.politicalBias).toBeLessThanOrEqual(1);

          // Validate hashtag format (should start with #)
          if (trend.hashtag) {
            expect(trend.hashtag).toMatch(/^#\w+/);
          }

          // Validate boolean field
          expect(typeof trend.isActive).toBe('boolean');

          // Validate date formats
          expect(new Date(trend.peakTime)).toBeInstanceOf(Date);
          expect(new Date(trend.createdAt)).toBeInstanceOf(Date);
          expect(new Date(trend.updatedAt)).toBeInstanceOf(Date);
          expect(trend.peakTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);

          // Validate arrays
          expect(Array.isArray(trend.relatedTopics)).toBe(true);
          expect(Array.isArray(trend.associatedPersonas)).toBe(true);
          expect(Array.isArray(trend.newsItems)).toBe(true);
        });
      }
    });

    it('should filter trends by region parameter', async () => {
      const region = 'US';

      const response = await request(app)
        .get('/api/trends')
        .query({ region })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned trends should match the requested region
      response.body.forEach((trend: any) => {
        expect(trend.region).toBe(region);
      });
    });

    it('should filter trends by category parameter', async () => {
      const category = 'POLITICS';

      const response = await request(app)
        .get('/api/trends')
        .query({ category })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned trends should match the requested category
      response.body.forEach((trend: any) => {
        expect(trend.category).toBe(category);
      });
    });

    it('should filter trends by timeframe parameter', async () => {
      const timeframe = '6h';

      const response = await request(app)
        .get('/api/trends')
        .query({ timeframe })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Trends should be from the specified timeframe
      if (response.body.length > 0) {
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        response.body.forEach((trend: any) => {
          const trendTime = new Date(trend.peakTime);
          expect(trendTime.getTime()).toBeGreaterThanOrEqual(sixHoursAgo.getTime());
        });
      }
    });

    it('should handle worldwide region parameter', async () => {
      const region = 'WORLDWIDE';

      const response = await request(app)
        .get('/api/trends')
        .query({ region })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle all valid timeframe parameters', async () => {
      const timeframes = ['1h', '6h', '24h'];

      for (const timeframe of timeframes) {
        const response = await request(app)
          .get('/api/trends')
          .query({ timeframe })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      }
    });

    it('should handle all valid TrendCategory enum values', async () => {
      const validCategories = ['BREAKING_NEWS', 'POLITICS', 'ENTERTAINMENT', 'SPORTS', 'TECHNOLOGY', 'MEME', 'HASHTAG_GAME', 'OTHER'];

      for (const category of validCategories) {
        const response = await request(app)
          .get('/api/trends')
          .query({ category })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);

        // Verify filtering worked correctly
        response.body.forEach((trend: any) => {
          expect(trend.category).toBe(category);
        });
      }
    });

    it('should handle combined query parameters', async () => {
      const queryParams = {
        region: 'US',
        category: 'POLITICS',
        timeframe: '24h'
      };

      const response = await request(app)
        .get('/api/trends')
        .query(queryParams)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Verify all filters applied correctly
      response.body.forEach((trend: any) => {
        expect(trend.region).toBe(queryParams.region);
        expect(trend.category).toBe(queryParams.category);
      });
    });

    it('should return trends sorted by relevance/volume', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // If multiple trends exist, they should be sorted by volume (descending)
      if (response.body.length > 1) {
        for (let i = 0; i < response.body.length - 1; i++) {
          expect(response.body[i].volume).toBeGreaterThanOrEqual(response.body[i + 1].volume);
        }
      }
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid category enum value', async () => {
      const response = await request(app)
        .get('/api/trends')
        .query({ category: 'INVALID_CATEGORY' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('category')
      });
    });

    it('should reject invalid timeframe enum value', async () => {
      const response = await request(app)
        .get('/api/trends')
        .query({ timeframe: 'invalid_timeframe' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('timeframe')
      });
    });

    it('should reject malformed query parameters', async () => {
      const response = await request(app)
        .get('/api/trends')
        .query({
          category: ['POLITICS', 'SPORTS'], // Should be string, not array
          region: 123 // Should be string, not number
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should handle invalid region codes gracefully', async () => {
      // Some invalid regions might return empty results rather than error
      const response = await request(app)
        .get('/api/trends')
        .query({ region: 'INVALID_REGION_CODE' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // May return empty array for non-existent regions
    });

    it('should handle special characters in parameters', async () => {
      const response = await request(app)
        .get('/api/trends')
        .query({ region: 'US&category=POLITICS' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Authorization Tests', () => {
    it('should work without authorization (public endpoint)', async () => {
      const response = await request(app)
        .get('/api/trends')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should work with valid authorization token', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should work with invalid authorization token (graceful degradation)', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', 'Bearer invalid_token')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle missing authorization header gracefully', async () => {
      const response = await request(app)
        .get('/api/trends')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Content Type and Headers', () => {
    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should include rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });

    it('should handle CORS requests', async () => {
      const response = await request(app)
        .options('/api/trends')
        .set('Origin', 'http://localhost:3000')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle empty trends database gracefully', async () => {
      // Test with filters that might return no results
      const response = await request(app)
        .get('/api/trends')
        .query({
          category: 'HASHTAG_GAME',
          region: 'ZZ', // Non-existent region
          timeframe: '1h'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([]);
    });

    it('should handle rapid successive requests', async () => {
      const promises = Array(3).fill(null).map(() =>
        request(app)
          .get('/api/trends')
          .query({ timeframe: '24h' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    it('should maintain reasonable response time', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/trends')
        .query({
          region: 'US',
          category: 'POLITICS',
          timeframe: '24h'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Response should be reasonably fast (under 3 seconds)
      expect(responseTime).toBeLessThan(3000);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle international characters in region codes', async () => {
      const response = await request(app)
        .get('/api/trends')
        .query({ region: 'JP' }) // Japan
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // If trends exist, they should have appropriate language
      response.body.forEach((trend: any) => {
        expect(trend.region).toBeDefined();
        expect(trend.language).toBeDefined();
      });
    });

    it('should handle concurrent requests with different parameters', async () => {
      const requests = [
        { category: 'POLITICS' },
        { category: 'SPORTS' },
        { timeframe: '1h' },
        { timeframe: '24h' },
        { region: 'US' }
      ];

      const promises = requests.map(params =>
        request(app)
          .get('/api/trends')
          .query(params)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
      );

      const responses = await Promise.all(promises);

      responses.forEach((response, index) => {
        expect(Array.isArray(response.body)).toBe(true);

        // Verify filtering worked for each request
        if (requests[index].category && response.body.length > 0) {
          response.body.forEach((trend: any) => {
            expect(trend.category).toBe(requests[index].category);
          });
        }
      });
    });
  });
});