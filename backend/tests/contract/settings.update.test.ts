import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';
import { createTestUser, getValidJWT, cleanupTestData } from '../helpers/auth';

describe('Contract: PUT /api/settings', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'settings_update_user',
      email: 'settingsupdate@example.com',
      password: 'UpdatePass123',
      displayName: 'Settings Update User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Success Cases', () => {
    it('should update user settings with valid data', async () => {
      const validUpdateData = {
        newsRegion: 'US',
        newsCategories: ['POLITICS', 'TECHNOLOGY'],
        newsLanguages: ['en', 'es'],
        aiChatterLevel: 75,
        aiPersonalities: ['conservative_voice', 'tech_expert'],
        aiResponseTone: 'PROFESSIONAL',
        emailNotifications: false,
        pushNotifications: true,
        notificationCategories: ['MENTIONS', 'REPLIES', 'NEWS_ALERTS'],
        profileVisibility: 'FOLLOWERS_ONLY',
        allowPersonaInteractions: false,
        allowDataForAI: true,
        theme: 'DARK',
        language: 'en-US',
        timezone: 'America/New_York'
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validUpdateData)
        .expect(200);

      // Validate response matches Settings schema
      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        newsRegion: 'US',
        newsCategories: ['POLITICS', 'TECHNOLOGY'],
        newsLanguages: ['en', 'es'],
        aiChatterLevel: 75,
        aiPersonalities: ['conservative_voice', 'tech_expert'],
        aiResponseTone: 'PROFESSIONAL',
        emailNotifications: false,
        pushNotifications: true,
        notificationCategories: ['MENTIONS', 'REPLIES', 'NEWS_ALERTS'],
        profileVisibility: 'FOLLOWERS_ONLY',
        allowPersonaInteractions: false,
        allowDataForAI: true,
        theme: 'DARK',
        language: 'en-US',
        timezone: 'America/New_York',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // Validate UUID format
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // Validate date formats
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);

      // updatedAt should be more recent than createdAt
      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(response.body.createdAt).getTime());
    });

    it('should update partial settings (only provided fields)', async () => {
      const partialUpdateData = {
        theme: 'LIGHT',
        aiChatterLevel: 25,
        emailNotifications: false
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(partialUpdateData)
        .expect(200);

      // Should update only specified fields
      expect(response.body.theme).toBe('LIGHT');
      expect(response.body.aiChatterLevel).toBe(25);
      expect(response.body.emailNotifications).toBe(false);

      // Other fields should remain (test by fetching current settings first, then updating)
      expect(response.body).toHaveProperty('newsRegion');
      expect(response.body).toHaveProperty('profileVisibility');
      expect(response.body).toHaveProperty('language');
    });

    it('should handle empty arrays in update', async () => {
      const updateData = {
        newsCategories: [],
        aiPersonalities: [],
        notificationCategories: []
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.newsCategories).toEqual([]);
      expect(response.body.aiPersonalities).toEqual([]);
      expect(response.body.notificationCategories).toEqual([]);
    });

    it('should update all valid NewsCategory enum values', async () => {
      const allNewsCategories = ['POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS', 'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'];

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ newsCategories: allNewsCategories })
        .expect(200);

      expect(response.body.newsCategories).toEqual(allNewsCategories);
    });

    it('should update all valid NotificationCategory enum values', async () => {
      const allNotificationCategories = ['MENTIONS', 'REPLIES', 'LIKES', 'REPOSTS', 'FOLLOWERS', 'NEWS_ALERTS', 'PERSONA_INTERACTIONS'];

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notificationCategories: allNotificationCategories })
        .expect(200);

      expect(response.body.notificationCategories).toEqual(allNotificationCategories);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid aiChatterLevel below minimum', async () => {
      const invalidData = {
        aiChatterLevel: -5
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('aiChatterLevel')
      });
    });

    it('should reject invalid aiChatterLevel above maximum', async () => {
      const invalidData = {
        aiChatterLevel: 150
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('aiChatterLevel')
      });
    });

    it('should reject invalid theme enum value', async () => {
      const invalidData = {
        theme: 'INVALID_THEME'
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('theme')
      });
    });

    it('should reject invalid profileVisibility enum value', async () => {
      const invalidData = {
        profileVisibility: 'INVALID_VISIBILITY'
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('profileVisibility')
      });
    });

    it('should reject invalid aiResponseTone enum value', async () => {
      const invalidData = {
        aiResponseTone: 'INVALID_TONE'
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('aiResponseTone')
      });
    });

    it('should reject invalid newsCategories enum values', async () => {
      const invalidData = {
        newsCategories: ['POLITICS', 'INVALID_CATEGORY', 'TECHNOLOGY']
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('newsCategories')
      });
    });

    it('should reject invalid notificationCategories enum values', async () => {
      const invalidData = {
        notificationCategories: ['MENTIONS', 'INVALID_NOTIFICATION', 'REPLIES']
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('notificationCategories')
      });
    });

    it('should reject invalid data types', async () => {
      const invalidData = {
        emailNotifications: 'not_a_boolean',
        aiChatterLevel: 'not_a_number',
        newsCategories: 'not_an_array'
      };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Authorization Tests', () => {
    it('should reject requests without authorization header', async () => {
      const validData = { theme: 'DARK' };

      const response = await request(app)
        .put('/api/settings')
        .send(validData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject requests with invalid JWT token', async () => {
      const validData = { theme: 'DARK' };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', 'Bearer invalid_token')
        .send(validData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token')
      });
    });

    it('should not allow updating another users settings', async () => {
      // Create another user
      const otherUser = await createTestUser({
        username: 'other_user',
        email: 'other@example.com'
      });
      const otherToken = await getValidJWT(otherUser.id);

      const updateData = { theme: 'LIGHT' };

      // Each user should only be able to update their own settings
      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${otherToken}`)
        .send(updateData)
        .expect(200);

      // Should update other user's settings, not the original test user's
      expect(response.body.userId).toBe(otherUser.id);
      expect(response.body.userId).not.toBe(testUser.id);
    });
  });

  describe('Content Type and Headers', () => {
    it('should return JSON content type', async () => {
      const updateData = { theme: 'DARK' };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should include security headers', async () => {
      const updateData = { theme: 'DARK' };

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty request body', async () => {
      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(200);

      // Should return current settings without changes
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', testUser.id);
    });

    it('should handle very long timezone string', async () => {
      const longTimezone = 'a'.repeat(1000);

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ timezone: longTimezone })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should handle very large arrays', async () => {
      const largeArray = Array(1000).fill('POLITICS');

      const response = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ newsCategories: largeArray })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });
});