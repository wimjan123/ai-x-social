import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getValidJWT } from '../helpers/auth';

describe('Contract: POST /api/auth/logout', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    // Create test user and get valid JWT before each test
    testUser = await createTestUser({
      username: 'logout_test_user',
      email: 'logout@example.com',
      password: 'TestPassword123',
      displayName: 'Logout Test User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);
  });

  describe('Success Cases', () => {
    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Validate response schema matches OpenAPI SuccessResponse
      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });

      // Verify logout message
      expect(response.body.message).toContain('successfully');
    });

    it('should invalidate token after logout', async () => {
      // First logout successfully
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Try to use the same token for protected endpoint
      await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });

    it('should handle logout with refresh token in body', async () => {
      // Login to get refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'logout_test_user',
          password: 'TestPassword123'
        });

      const { refreshToken } = loginResponse.body;

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });
    });
  });

  describe('Authentication Errors', () => {
    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject logout with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid_token_123')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject logout with malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'InvalidFormat token_here')
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject logout with expired token', async () => {
      // Create an expired token (this would require mocking or a helper)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.expired';

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'AUTHENTICATION_ERROR'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle double logout gracefully', async () => {
      // First logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Second logout with same token should fail
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });

    it('should handle logout with additional data in body', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          device: 'mobile',
          userAgent: 'TestAgent/1.0',
          extraField: 'should be ignored'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });
    });

    it('should handle logout with empty body', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });
    });
  });

  describe('Security Validation', () => {
    it('should not leak user information in logout response', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Response should only contain success and message
      expect(Object.keys(response.body)).toEqual(['success', 'message']);
      expect(response.body.message).not.toContain(testUser.email);
      expect(response.body.message).not.toContain(testUser.username);
    });

    it('should properly clean up session data', async () => {
      // This test verifies that logout properly cleans up any server-side session data
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify that subsequent requests cannot access protected resources
      await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });
  });
});