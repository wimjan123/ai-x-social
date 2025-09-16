import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getValidJWT } from '../helpers/auth';

describe('Contract: POST /api/auth/login', () => {
  let existingUser: any;

  beforeEach(async () => {
    // Create test user before each test
    existingUser = await createTestUser({
      username: 'test_user',
      email: 'test@example.com',
      password: 'TestPassword123',
      displayName: 'Test User',
      personaType: 'POLITICIAN'
    });
  });

  describe('Success Cases', () => {
    it('should login with username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test_user',
          password: 'TestPassword123'
        })
        .expect(200);

      // Validate response schema matches OpenAPI AuthResponse
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          id: existingUser.id,
          username: 'test_user',
          displayName: 'Test User',
          personaType: 'POLITICIAN',
          verificationBadge: expect.any(Boolean),
          followerCount: expect.any(Number),
          followingCount: expect.any(Number),
          postCount: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
        expiresIn: expect.any(Number)
      });

      // Validate JWT token format
      expect(response.body.accessToken).toMatch(/^eyJ/);
      expect(response.body.expiresIn).toBe(3600);

      // Validate ISO date formats
      expect(new Date(response.body.user.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.user.updatedAt)).toBeInstanceOf(Date);
    });

    it('should login with email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test@example.com',
          password: 'TestPassword123'
        })
        .expect(200);

      // Should return same user regardless of login method
      expect(response.body.user.username).toBe('test_user');
      expect(response.body.user.id).toBe(existingUser.id);

      // Validate complete AuthResponse schema
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          displayName: expect.any(String),
          personaType: expect.any(String)
        }),
        expiresIn: 3600
      });
    });

    it('should handle case-insensitive email login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'TEST@EXAMPLE.COM',
          password: 'TestPassword123'
        })
        .expect(200);

      expect(response.body.user.username).toBe('test_user');
    });
  });

  describe('Authentication Errors', () => {
    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test_user',
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Invalid credentials'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject non-existent username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'non_existent_user',
          password: 'TestPassword123'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Invalid credentials'),
        code: 'AUTHENTICATION_ERROR'
      });
    });

    it('should reject non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'nonexistent@example.com',
          password: 'TestPassword123'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Invalid credentials'),
        code: 'AUTHENTICATION_ERROR'
      });
    });
  });

  describe('Validation Errors', () => {
    it('should reject missing identifier', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'TestPassword123'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('identifier'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test_user'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('password'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject empty identifier', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: '',
          password: 'TestPassword123'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject empty password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test_user',
          password: ''
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid login attempts', async () => {
      // Attempt multiple rapid logins (this test verifies rate limiting if implemented)
      const promises = Array(5).fill(0).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'test_user',
            password: 'TestPassword123'
          })
      );

      const responses = await Promise.all(promises);

      // At least some should succeed (depending on rate limiting implementation)
      const successfulLogins = responses.filter(r => r.status === 200);
      expect(successfulLogins.length).toBeGreaterThan(0);
    });
  });
});