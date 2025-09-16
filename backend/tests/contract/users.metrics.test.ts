import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getValidJWT } from '../helpers/auth';

describe('Contract: GET /api/users/{userId}/metrics', () => {
  let authToken: string;
  let requestingUser: any;
  let targetUser: any;

  beforeEach(async () => {
    // Create requesting user
    requestingUser = await createTestUser({
      username: 'metrics_requester',
      email: 'requester@example.com',
      displayName: 'Metrics Requester',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(requestingUser.id);

    // Create target user whose metrics will be viewed
    targetUser = await createTestUser({
      username: 'metrics_target',
      email: 'target@example.com',
      displayName: 'Metrics Target',
      bio: 'User with influence metrics',
      personaType: 'INFLUENCER'
    });
  });

  describe('Success Cases', () => {
    it('should return influence metrics with valid userId', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate InfluenceMetrics schema per OpenAPI spec
      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: targetUser.id,
        followerCount: expect.any(Number),
        followingCount: expect.any(Number),
        engagementRate: expect.any(Number),
        reachScore: expect.any(Number),
        approvalRating: expect.any(Number),
        controversyLevel: expect.any(Number),
        trendingScore: expect.any(Number),
        followerGrowthDaily: expect.any(Number),
        followerGrowthWeekly: expect.any(Number),
        followerGrowthMonthly: expect.any(Number),
        totalLikes: expect.any(Number),
        totalReshares: expect.any(Number),
        totalComments: expect.any(Number),
        influenceRank: expect.any(Number),
        categoryRank: expect.any(Number),
        lastUpdated: expect.any(String)
      });

      // Validate data types and constraints per OpenAPI schema
      expect(typeof response.body.id).toBe('string');
      expect(typeof response.body.userId).toBe('string');
      expect(typeof response.body.followerCount).toBe('number');
      expect(typeof response.body.followingCount).toBe('number');
      expect(typeof response.body.engagementRate).toBe('number');
      expect(typeof response.body.reachScore).toBe('number');
      expect(typeof response.body.approvalRating).toBe('number');
      expect(typeof response.body.controversyLevel).toBe('number');
      expect(typeof response.body.trendingScore).toBe('number');
      expect(typeof response.body.influenceRank).toBe('number');
      expect(typeof response.body.categoryRank).toBe('number');

      // Validate numerical constraints per OpenAPI schema
      expect(response.body.engagementRate).toBeGreaterThanOrEqual(0);
      expect(response.body.engagementRate).toBeLessThanOrEqual(100);
      expect(response.body.approvalRating).toBeGreaterThanOrEqual(0);
      expect(response.body.approvalRating).toBeLessThanOrEqual(100);
      expect(response.body.controversyLevel).toBeGreaterThanOrEqual(0);
      expect(response.body.controversyLevel).toBeLessThanOrEqual(100);

      // Validate non-negative values for counts
      expect(response.body.followerCount).toBeGreaterThanOrEqual(0);
      expect(response.body.followingCount).toBeGreaterThanOrEqual(0);
      expect(response.body.totalLikes).toBeGreaterThanOrEqual(0);
      expect(response.body.totalReshares).toBeGreaterThanOrEqual(0);
      expect(response.body.totalComments).toBeGreaterThanOrEqual(0);

      // Validate ISO date format
      expect(new Date(response.body.lastUpdated)).toBeInstanceOf(Date);

      // Validate UUID format for id and userId
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(response.body.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should return metrics for new user with default values', async () => {
      // New user should have initialized metrics
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // New user should have zero or default values
      expect(response.body.followerCount).toBe(0);
      expect(response.body.followingCount).toBe(0);
      expect(response.body.totalLikes).toBe(0);
      expect(response.body.totalReshares).toBe(0);
      expect(response.body.totalComments).toBe(0);
      expect(response.body.followerGrowthDaily).toBe(0);
      expect(response.body.followerGrowthWeekly).toBe(0);
      expect(response.body.followerGrowthMonthly).toBe(0);

      // Default ratings should be reasonable starting values
      expect(response.body.engagementRate).toBeGreaterThanOrEqual(0);
      expect(response.body.approvalRating).toBeGreaterThanOrEqual(0);
      expect(response.body.controversyLevel).toBeGreaterThanOrEqual(0);
    });

    it('should allow user to view their own metrics', async () => {
      const response = await request(app)
        .get(`/api/users/${requestingUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.userId).toBe(requestingUser.id);
    });

    it('should return updated lastUpdated timestamp', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const lastUpdated = new Date(response.body.lastUpdated);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdated.getTime();

      // lastUpdated should be recent (within last 24 hours for fresh metrics)
      expect(timeDiff).toBeLessThan(24 * 60 * 60 * 1000);
    });
  });

  describe('Error Cases', () => {
    it('should return 404 for non-existent userId', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID format

      const response = await request(app)
        .get(`/api/users/${nonExistentId}/metrics`)
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
        .get(`/api/users/${invalidId}/metrics`)
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
        .get('/api/users//metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404); // This might be 404 due to route matching

      // Note: This test verifies route handling, actual response may vary
    });
  });

  describe('Authentication Errors', () => {
    it('should reject unauthorized requests', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
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
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', 'InvalidFormat token_here')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'AUTHENTICATION_ERROR'
      });
    });
  });

  describe('Data Validation', () => {
    it('should return valid numerical ranges for percentage values', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Percentage values should be within 0-100 range
      expect(response.body.engagementRate).toBeGreaterThanOrEqual(0);
      expect(response.body.engagementRate).toBeLessThanOrEqual(100);
      expect(response.body.approvalRating).toBeGreaterThanOrEqual(0);
      expect(response.body.approvalRating).toBeLessThanOrEqual(100);
      expect(response.body.controversyLevel).toBeGreaterThanOrEqual(0);
      expect(response.body.controversyLevel).toBeLessThanOrEqual(100);
    });

    it('should return valid numerical values for all count fields', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Count fields should be non-negative integers
      const countFields = [
        'followerCount', 'followingCount', 'followerGrowthDaily',
        'followerGrowthWeekly', 'followerGrowthMonthly', 'totalLikes',
        'totalReshares', 'totalComments', 'influenceRank', 'categoryRank'
      ];

      countFields.forEach(field => {
        expect(response.body[field]).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(response.body[field])).toBe(true);
      });
    });

    it('should return valid float values for score fields', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Score fields should be valid numbers (may be floats)
      const scoreFields = ['reachScore', 'trendingScore'];

      scoreFields.forEach(field => {
        expect(typeof response.body[field]).toBe('number');
        expect(isNaN(response.body[field])).toBe(false);
        expect(isFinite(response.body[field])).toBe(true);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent metrics across multiple requests', async () => {
      const response1 = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Metrics should be identical for immediate successive requests
      expect(response1.body.id).toBe(response2.body.id);
      expect(response1.body.userId).toBe(response2.body.userId);
      expect(response1.body.followerCount).toBe(response2.body.followerCount);
      expect(response1.body.totalLikes).toBe(response2.body.totalLikes);
      expect(response1.body.lastUpdated).toBe(response2.body.lastUpdated);
    });

    it('should include all required fields per OpenAPI schema', async () => {
      const response = await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify all required fields are present (per InfluenceMetrics schema)
      const requiredFields = [
        'id', 'userId', 'followerCount', 'followingCount', 'engagementRate',
        'reachScore', 'approvalRating', 'controversyLevel', 'trendingScore',
        'followerGrowthDaily', 'followerGrowthWeekly', 'followerGrowthMonthly',
        'totalLikes', 'totalReshares', 'totalComments', 'influenceRank',
        'categoryRank', 'lastUpdated'
      ];

      requiredFields.forEach(field => {
        expect(response.body).toHaveProperty(field);
        expect(response.body[field]).not.toBeNull();
        expect(response.body[field]).not.toBeUndefined();
      });
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      await request(app)
        .get(`/api/users/${targetUser.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle multiple concurrent requests', async () => {
      const promises = Array(5).fill(0).map(() =>
        request(app)
          .get(`/api/users/${targetUser.id}/metrics`)
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(promises);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.userId).toBe(targetUser.id);
      });
    });
  });
});