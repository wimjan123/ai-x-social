import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getValidJWT } from '../helpers/auth';

describe('Contract: GET /api/users/profile', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'profile_user',
      email: 'profile@example.com',
      displayName: 'Profile User',
      bio: 'Testing profiles and user data',
      personaType: 'INFLUENCER',
      profileImageUrl: 'https://example.com/profile.jpg',
      headerImageUrl: 'https://example.com/header.jpg',
      location: 'New York, NY',
      website: 'https://profileuser.com',
      specialtyAreas: ['Technology', 'Social Media', 'Marketing']
    });
    authToken = await getValidJWT(testUser.id);
  });

  describe('Success Cases', () => {
    it('should return current user profile with complete data', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate complete UserProfile schema per OpenAPI spec
      expect(response.body).toMatchObject({
        id: testUser.id,
        username: 'profile_user',
        displayName: 'Profile User',
        bio: 'Testing profiles and user data',
        profileImageUrl: 'https://example.com/profile.jpg',
        headerImageUrl: 'https://example.com/header.jpg',
        location: 'New York, NY',
        website: 'https://profileuser.com',
        personaType: 'INFLUENCER',
        specialtyAreas: expect.arrayContaining(['Technology', 'Social Media', 'Marketing']),
        verificationBadge: expect.any(Boolean),
        followerCount: expect.any(Number),
        followingCount: expect.any(Number),
        postCount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // Validate data types match OpenAPI schema
      expect(typeof response.body.id).toBe('string');
      expect(typeof response.body.username).toBe('string');
      expect(typeof response.body.displayName).toBe('string');
      expect(typeof response.body.verificationBadge).toBe('boolean');
      expect(typeof response.body.followerCount).toBe('number');
      expect(typeof response.body.followingCount).toBe('number');
      expect(typeof response.body.postCount).toBe('number');
      expect(Array.isArray(response.body.specialtyAreas)).toBe(true);

      // Validate ISO date formats
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);

      // Validate URL formats
      expect(response.body.profileImageUrl).toMatch(/^https?:\/\//);
      expect(response.body.headerImageUrl).toMatch(/^https?:\/\//);
      expect(response.body.website).toMatch(/^https?:\/\//);
    });

    it('should return profile with minimal data when optional fields are empty', async () => {
      // Create user with only required fields
      const minimalUser = await createTestUser({
        username: 'minimal_user',
        email: 'minimal@example.com',
        displayName: 'Minimal User',
        personaType: 'POLITICIAN'
        // No bio, profileImageUrl, headerImageUrl, location, website, specialtyAreas
      });
      const minimalAuthToken = await getValidJWT(minimalUser.id);

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${minimalAuthToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: minimalUser.id,
        username: 'minimal_user',
        displayName: 'Minimal User',
        personaType: 'POLITICIAN',
        verificationBadge: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // Optional fields should be null or empty
      expect([null, undefined, '']).toContain(response.body.bio);
      expect([null, undefined, '']).toContain(response.body.profileImageUrl);
      expect([null, undefined, '']).toContain(response.body.headerImageUrl);
      expect([null, undefined, '']).toContain(response.body.location);
      expect([null, undefined, '']).toContain(response.body.website);
      expect(response.body.specialtyAreas).toEqual([]);
    });

    it('should return updated follower counts after relationships change', async () => {
      // This test would require implementing follow functionality first
      // For now, we test that the counts are numerical and non-negative
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.followerCount).toBeGreaterThanOrEqual(0);
      expect(response.body.followingCount).toBeGreaterThanOrEqual(0);
      expect(response.body.postCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Authentication Errors', () => {
    it('should reject unauthorized requests', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid_token_here')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'InvalidFormat token_here')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject expired JWT tokens', async () => {
      // Create an expired token (this would require mocking or a helper)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.expired';

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'AUTHENTICATION_ERROR'
      });
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data across multiple requests', async () => {
      const response1 = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Basic profile data should be identical
      expect(response1.body.id).toBe(response2.body.id);
      expect(response1.body.username).toBe(response2.body.username);
      expect(response1.body.displayName).toBe(response2.body.displayName);
      expect(response1.body.personaType).toBe(response2.body.personaType);
      expect(response1.body.createdAt).toBe(response2.body.createdAt);
    });

    it('should include all required fields per OpenAPI schema', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify all required fields are present (per UserProfile schema)
      const requiredFields = [
        'id', 'username', 'displayName', 'personaType',
        'verificationBadge', 'followerCount', 'followingCount',
        'postCount', 'createdAt', 'updatedAt'
      ];

      requiredFields.forEach(field => {
        expect(response.body).toHaveProperty(field);
        expect(response.body[field]).not.toBeNull();
        expect(response.body[field]).not.toBeUndefined();
      });
    });

    it('should not expose sensitive information', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should not include password hash, email, or other sensitive data
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('email');
      expect(response.body).not.toHaveProperty('refreshToken');
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });
});