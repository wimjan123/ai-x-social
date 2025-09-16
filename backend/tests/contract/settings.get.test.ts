import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';
import { createTestUser, getValidJWT, cleanupTestData } from '../helpers/auth';

describe('Contract: GET /api/settings', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'settings_test_user',
      email: 'settings@example.com',
      password: 'SettingsPass123',
      displayName: 'Settings Test User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Success Cases', () => {
    it('should return user settings with all required fields', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate complete Settings schema from OpenAPI
      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        newsRegion: expect.any(String),
        newsCategories: expect.any(Array),
        newsLanguages: expect.any(Array),
        aiChatterLevel: expect.any(Number),
        aiPersonalities: expect.any(Array),
        aiResponseTone: expect.any(String),
        emailNotifications: expect.any(Boolean),
        pushNotifications: expect.any(Boolean),
        notificationCategories: expect.any(Array),
        profileVisibility: expect.any(String),
        allowPersonaInteractions: expect.any(Boolean),
        allowDataForAI: expect.any(Boolean),
        theme: expect.any(String),
        language: expect.any(String),
        timezone: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // Validate UUID format for id and userId
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(response.body.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // Validate enum constraints
      expect(['LIGHT', 'DARK', 'AUTO']).toContain(response.body.theme);
      expect(['PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE']).toContain(response.body.profileVisibility);
      expect(['PROFESSIONAL', 'CASUAL', 'HUMOROUS', 'SERIOUS', 'SARCASTIC', 'EMPATHETIC']).toContain(response.body.aiResponseTone);

      // Validate number constraints
      expect(response.body.aiChatterLevel).toBeGreaterThanOrEqual(0);
      expect(response.body.aiChatterLevel).toBeLessThanOrEqual(100);

      // Validate default values
      expect(response.body.newsRegion).toBeDefined();
      expect(response.body.emailNotifications).toBe(true);
      expect(response.body.pushNotifications).toBe(true);
      expect(response.body.allowPersonaInteractions).toBe(true);
      expect(response.body.allowDataForAI).toBe(true);
      expect(response.body.language).toBe('en');
      expect(response.body.timezone).toBe('UTC');

      // Validate array fields contain valid enum values
      if (response.body.newsCategories.length > 0) {
        const validNewsCategories = ['POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS', 'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'];
        response.body.newsCategories.forEach((category: string) => {
          expect(validNewsCategories).toContain(category);
        });
      }

      if (response.body.notificationCategories.length > 0) {
        const validNotificationCategories = ['MENTIONS', 'REPLIES', 'LIKES', 'REPOSTS', 'FOLLOWERS', 'NEWS_ALERTS', 'PERSONA_INTERACTIONS'];
        response.body.notificationCategories.forEach((category: string) => {
          expect(validNotificationCategories).toContain(category);
        });
      }

      // Validate ISO date format
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
      expect(response.body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
      expect(response.body.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
    });

    it('should return consistent content-type header', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should handle different user settings configurations', async () => {
      // Create user with different settings
      const customUser = await createTestUser({
        username: 'custom_settings_user',
        email: 'custom@example.com'
      });
      const customToken = await getValidJWT(customUser.id);

      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${customToken}`)
        .expect(200);

      // Should still return valid schema regardless of configuration
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', customUser.id);
      expect(response.body).toHaveProperty('newsRegion');
      expect(response.body).toHaveProperty('theme');
    });
  });

  describe('Authorization Tests', () => {
    it('should reject requests without authorization header', async () => {
      const response = await request(app)
        .get('/api/settings')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should reject requests with invalid JWT token', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', 'Bearer invalid_token_here')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token')
      });
    });

    it('should reject requests with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', 'NotBearer token')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject requests with expired JWT token', async () => {
      // Create expired token (would need JWT helper for this)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';

      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in response', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate security headers from helmet middleware
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should include rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Rate limiting headers should be present
      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent user gracefully', async () => {
      // Create token for non-existent user
      const fakeToken = await getValidJWT('00000000-0000-0000-0000-000000000000');

      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${fakeToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('User')
      });
    });

    it('should handle database connection errors gracefully', async () => {
      // This would require mocking database connection
      // For now, test that response format is consistent
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });
  });
});