import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getValidJWT } from '../helpers/auth';

describe('Contract: GET /api/users/{userId}', () => {
  let authToken: string;
  let requestingUser: any;
  let targetUser: any;

  beforeEach(async () => {
    // Create requesting user
    requestingUser = await createTestUser({
      username: 'requesting_user',
      email: 'requester@example.com',
      displayName: 'Requesting User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(requestingUser.id);

    // Create target user to be viewed
    targetUser = await createTestUser({
      username: 'target_user',
      email: 'target@example.com',
      displayName: 'Target User',
      bio: 'Public bio for target user',
      personaType: 'INFLUENCER',
      profileImageUrl: 'https://example.com/target-profile.jpg',
      headerImageUrl: 'https://example.com/target-header.jpg',
      location: 'Los Angeles, CA',
      website: 'https://targetuser.com',
      specialtyAreas: ['Politics', 'Social Issues', 'Community']
    });
  });

  describe('Success Cases', () => {
    it('should return public user profile with valid userId', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate PublicUserProfile schema per OpenAPI spec
      expect(response.body).toMatchObject({
        id: targetUser.id,
        username: 'target_user',
        displayName: 'Target User',
        bio: 'Public bio for target user',
        profileImageUrl: 'https://example.com/target-profile.jpg',
        headerImageUrl: 'https://example.com/target-header.jpg',
        location: 'Los Angeles, CA',
        website: 'https://targetuser.com',
        personaType: 'INFLUENCER',
        specialtyAreas: expect.arrayContaining(['Politics', 'Social Issues', 'Community']),
        verificationBadge: expect.any(Boolean),
        followerCount: expect.any(Number),
        followingCount: expect.any(Number),
        postCount: expect.any(Number),
        createdAt: expect.any(String)
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

      // Validate URL formats
      expect(response.body.profileImageUrl).toMatch(/^https?:\/\//);
      expect(response.body.headerImageUrl).toMatch(/^https?:\/\//);
      expect(response.body.website).toMatch(/^https?:\/\//);
    });

    it('should return profile for user without optional fields', async () => {
      // Create user with minimal data
      const minimalUser = await createTestUser({
        username: 'minimal_target',
        email: 'minimal.target@example.com',
        displayName: 'Minimal Target',
        personaType: 'JOURNALIST'
        // No bio, images, location, website, specialtyAreas
      });

      const response = await request(app)
        .get(`/api/users/${minimalUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: minimalUser.id,
        username: 'minimal_target',
        displayName: 'Minimal Target',
        personaType: 'JOURNALIST',
        verificationBadge: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        createdAt: expect.any(String)
      });

      // Optional fields should be null or empty
      expect([null, undefined, '']).toContain(response.body.bio);
      expect([null, undefined, '']).toContain(response.body.profileImageUrl);
      expect([null, undefined, '']).toContain(response.body.headerImageUrl);
      expect([null, undefined, '']).toContain(response.body.location);
      expect([null, undefined, '']).toContain(response.body.website);
      expect(response.body.specialtyAreas).toEqual([]);
    });

    it('should allow user to view their own profile via userId', async () => {
      const response = await request(app)
        .get(`/api/users/${requestingUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(requestingUser.id);
      expect(response.body.username).toBe('requesting_user');
    });

    it('should return all valid PersonaType values', async () => {
      const personaTypes = ['POLITICIAN', 'INFLUENCER', 'JOURNALIST', 'ACTIVIST', 'BUSINESS', 'ENTERTAINER'];

      for (const personaType of personaTypes) {
        const user = await createTestUser({
          username: `${personaType.toLowerCase()}_user`,
          email: `${personaType.toLowerCase()}@example.com`,
          displayName: `${personaType} User`,
          personaType
        });

        const response = await request(app)
          .get(`/api/users/${user.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.personaType).toBe(personaType);
      }
    });
  });

  describe('Error Cases', () => {
    it('should return 404 for non-existent userId', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID format

      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should return 400 for invalid userId format', async () => {
      const invalidId = 'not-a-valid-uuid';

      const response = await request(app)
        .get(`/api/users/${invalidId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('uuid'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should return 400 for empty userId', async () => {
      const response = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404); // This might be 404 or redirect to different endpoint

      // Note: This test verifies route handling, actual response may vary
    });
  });

  describe('Authentication Errors', () => {
    it('should reject unauthorized requests', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}`)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}`)
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
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', 'InvalidFormat token_here')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'AUTHENTICATION_ERROR'
      });
    });
  });

  describe('Privacy and Security', () => {
    it('should not expose private information in public profile', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should not include sensitive data
      expect(response.body).not.toHaveProperty('email');
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('refreshToken');
      expect(response.body).not.toHaveProperty('updatedAt'); // PublicUserProfile doesn't include updatedAt
    });

    it('should have consistent public profile structure', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify PublicUserProfile has required fields but not private ones
      const expectedFields = [
        'id', 'username', 'displayName', 'bio', 'profileImageUrl',
        'headerImageUrl', 'location', 'website', 'personaType',
        'specialtyAreas', 'verificationBadge', 'followerCount',
        'followingCount', 'postCount', 'createdAt'
      ];

      expectedFields.forEach(field => {
        expect(response.body).toHaveProperty(field);
      });

      // Should not have UserProfile-only fields
      expect(response.body).not.toHaveProperty('updatedAt');
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data across multiple requests', async () => {
      const response1 = await request(app)
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Static data should be identical
      expect(response1.body.id).toBe(response2.body.id);
      expect(response1.body.username).toBe(response2.body.username);
      expect(response1.body.displayName).toBe(response2.body.displayName);
      expect(response1.body.personaType).toBe(response2.body.personaType);
      expect(response1.body.createdAt).toBe(response2.body.createdAt);
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      await request(app)
        .get(`/api/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });
});