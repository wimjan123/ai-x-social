import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';
import { createTestUser, getValidJWT, cleanupTestData } from '../helpers/auth';

describe('Contract: GET /api/news', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'news_test_user',
      email: 'news@example.com',
      password: 'NewsPass123',
      displayName: 'News Test User',
      personaType: 'JOURNALIST'
    });
    authToken = await getValidJWT(testUser.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Success Cases', () => {
    it('should return paginated news list with default parameters', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate NewsListResponse schema
      expect(response.body).toMatchObject({
        news: expect.any(Array),
        pagination: expect.objectContaining({
          page: expect.any(Number),
          limit: expect.any(Number),
          total: expect.any(Number),
          pages: expect.any(Number)
        })
      });

      // Validate default pagination values
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(20);
      expect(response.body.pagination.page).toBeGreaterThan(0);
      expect(response.body.pagination.limit).toBeGreaterThan(0);

      // Validate news items array (if any items exist)
      if (response.body.news.length > 0) {
        response.body.news.forEach((newsItem: any) => {
          expect(newsItem).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            content: expect.any(String),
            url: expect.any(String),
            sourceName: expect.any(String),
            sourceUrl: expect.any(String),
            author: expect.any(String),
            category: expect.any(String),
            topics: expect.any(Array),
            keywords: expect.any(Array),
            entities: expect.any(Array),
            country: expect.any(String),
            region: expect.any(String),
            language: expect.any(String),
            sentimentScore: expect.any(Number),
            impactScore: expect.any(Number),
            controversyScore: expect.any(Number),
            publishedAt: expect.any(String),
            discoveredAt: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          });

          // Validate UUID format
          expect(newsItem.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

          // Validate URL format
          expect(newsItem.url).toMatch(/^https?:\/\/.+/);
          expect(newsItem.sourceUrl).toMatch(/^https?:\/\/.+/);

          // Validate category enum
          const validCategories = ['POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS', 'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'];
          expect(validCategories).toContain(newsItem.category);

          // Validate score ranges
          expect(newsItem.sentimentScore).toBeGreaterThanOrEqual(-1);
          expect(newsItem.sentimentScore).toBeLessThanOrEqual(1);
          expect(newsItem.impactScore).toBeGreaterThanOrEqual(0);
          expect(newsItem.impactScore).toBeLessThanOrEqual(100);
          expect(newsItem.controversyScore).toBeGreaterThanOrEqual(0);
          expect(newsItem.controversyScore).toBeLessThanOrEqual(100);

          // Validate date formats
          expect(new Date(newsItem.publishedAt)).toBeInstanceOf(Date);
          expect(new Date(newsItem.discoveredAt)).toBeInstanceOf(Date);
          expect(new Date(newsItem.createdAt)).toBeInstanceOf(Date);
          expect(new Date(newsItem.updatedAt)).toBeInstanceOf(Date);
        });
      }
    });

    it('should filter news by category parameter', async () => {
      const category = 'POLITICS';

      const response = await request(app)
        .get('/api/news')
        .query({ category })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');

      // All returned news items should match the requested category
      response.body.news.forEach((newsItem: any) => {
        expect(newsItem.category).toBe(category);
      });
    });

    it('should filter news by region parameter', async () => {
      const region = 'US';

      const response = await request(app)
        .get('/api/news')
        .query({ region })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');

      // News items should be relevant to the requested region
      response.body.news.forEach((newsItem: any) => {
        expect(newsItem.country).toBeDefined();
        expect(newsItem.region).toBeDefined();
      });
    });

    it('should handle worldwide region parameter', async () => {
      const region = 'WORLDWIDE';

      const response = await request(app)
        .get('/api/news')
        .query({ region })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should respect pagination parameters', async () => {
      const page = 2;
      const limit = 10;

      const response = await request(app)
        .get('/api/news')
        .query({ page, limit })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(page);
      expect(response.body.pagination.limit).toBe(limit);
      expect(response.body.news.length).toBeLessThanOrEqual(limit);
    });

    it('should handle maximum limit parameter', async () => {
      const limit = 50; // Maximum allowed

      const response = await request(app)
        .get('/api/news')
        .query({ limit })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.pagination.limit).toBe(limit);
      expect(response.body.news.length).toBeLessThanOrEqual(limit);
    });

    it('should handle combined query parameters', async () => {
      const queryParams = {
        category: 'TECHNOLOGY',
        region: 'US',
        page: 1,
        limit: 15
      };

      const response = await request(app)
        .get('/api/news')
        .query(queryParams)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(queryParams.page);
      expect(response.body.pagination.limit).toBe(queryParams.limit);

      // Check category filtering if news items exist
      if (response.body.news.length > 0) {
        response.body.news.forEach((newsItem: any) => {
          expect(newsItem.category).toBe(queryParams.category);
        });
      }
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid category enum value', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({ category: 'INVALID_CATEGORY' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('category')
      });
    });

    it('should reject page parameter below minimum', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({ page: 0 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('page')
      });
    });

    it('should reject negative page parameter', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({ page: -1 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('page')
      });
    });

    it('should reject limit parameter below minimum', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({ limit: 0 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('limit')
      });
    });

    it('should reject limit parameter above maximum', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({ limit: 100 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('limit')
      });
    });

    it('should reject invalid data types for parameters', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({
          page: 'not_a_number',
          limit: 'also_not_a_number'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should handle all valid NewsCategory enum values', async () => {
      const validCategories = ['POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS', 'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'];

      for (const category of validCategories) {
        const response = await request(app)
          .get('/api/news')
          .query({ category })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('news');
        expect(response.body).toHaveProperty('pagination');
      }
    });
  });

  describe('Authorization Tests', () => {
    it('should work without authorization (public endpoint)', async () => {
      const response = await request(app)
        .get('/api/news')
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should work with valid authorization token', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should work with invalid authorization token (graceful degradation)', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', 'Bearer invalid_token')
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('Content Type and Headers', () => {
    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should include rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });

    it('should handle CORS requests', async () => {
      const response = await request(app)
        .options('/api/news')
        .set('Origin', 'http://localhost:3000')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle empty news database gracefully', async () => {
      // This test assumes a fresh database or filtered query with no results
      const response = await request(app)
        .get('/api/news')
        .query({ category: 'SCIENCE', region: 'ZZ' }) // Unlikely combination
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.news).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
      expect(response.body.pagination.pages).toBe(0);
    });

    it('should handle large page numbers gracefully', async () => {
      const response = await request(app)
        .get('/api/news')
        .query({ page: 9999 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.news).toEqual([]);
    });

    it('should maintain performance with multiple query parameters', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/news')
        .query({
          category: 'POLITICS',
          region: 'US',
          page: 1,
          limit: 20
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Response should be reasonably fast (under 5 seconds)
      expect(responseTime).toBeLessThan(5000);
      expect(response.body).toHaveProperty('news');
    });

    it('should handle concurrent requests properly', async () => {
      const promises = Array(5).fill(null).map(() =>
        request(app)
          .get('/api/news')
          .query({ limit: 5 })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.body).toHaveProperty('news');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.pagination.limit).toBe(5);
      });
    });
  });
});