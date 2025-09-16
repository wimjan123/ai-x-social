import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getValidJWT } from '../helpers/auth';

describe('Contract: POST /api/auth/register', () => {
  describe('Success Cases', () => {
    it('should register user with valid data', async () => {
      const validUser = {
        username: 'test_politician',
        email: 'test@example.com',
        password: 'SecurePass123',
        displayName: 'Test Politician',
        personaType: 'POLITICIAN',
        bio: 'Passionate about reform',
        politicalStance: {
          economicPosition: 45,
          socialPosition: 60,
          primaryIssues: ['Healthcare', 'Education'],
          partyAffiliation: 'Progressive',
          ideologyTags: ['progressive', 'reformist'],
          debateWillingness: 75,
          controversyTolerance: 50
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      // Validate response schema matches OpenAPI AuthResponse
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          username: validUser.username,
          displayName: validUser.displayName,
          personaType: validUser.personaType,
          bio: validUser.bio,
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

    // Test all PersonaType enums per OpenAPI spec
    test.each([
      'POLITICIAN', 'INFLUENCER', 'JOURNALIST',
      'ACTIVIST', 'BUSINESS', 'ENTERTAINER'
    ])('should accept %s persona type', async (personaType) => {
      const userData = {
        username: `test_${personaType.toLowerCase()}_${Date.now()}`,
        email: `test_${personaType.toLowerCase()}@example.com`,
        password: 'SecurePass123',
        displayName: `Test ${personaType}`,
        personaType,
        bio: `Test ${personaType} bio`,
        politicalStance: {
          economicPosition: 50,
          socialPosition: 50,
          primaryIssues: ['Economy'],
          debateWillingness: 50,
          controversyTolerance: 50
        }
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid username format (too short)', async () => {
      const invalidUser = {
        username: 'ab', // Violates pattern '^[a-zA-Z0-9_]{3,15}$'
        email: 'test@example.com',
        password: 'SecurePass123',
        displayName: 'Test User',
        personaType: 'POLITICIAN'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('username'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject invalid username format (special characters)', async () => {
      const invalidUser = {
        username: 'test-user!', // Violates pattern '^[a-zA-Z0-9_]{3,15}$'
        email: 'test@example.com',
        password: 'SecurePass123',
        displayName: 'Test User',
        personaType: 'POLITICIAN'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('username'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject invalid email format', async () => {
      const invalidUser = {
        username: 'test_user',
        email: 'invalid-email', // Violates email format
        password: 'SecurePass123',
        displayName: 'Test User',
        personaType: 'POLITICIAN'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('email'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject short password', async () => {
      const invalidUser = {
        username: 'test_user',
        email: 'test@example.com',
        password: 'short', // Violates minLength: 8
        displayName: 'Test User',
        personaType: 'POLITICIAN'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('password'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject missing required fields', async () => {
      const incompleteUser = {
        username: 'test_user',
        email: 'test@example.com'
        // Missing password, displayName, personaType
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject bio exceeding 280 characters', async () => {
      const longBio = 'a'.repeat(281); // Exceeds maxLength: 280

      const invalidUser = {
        username: 'test_user',
        email: 'test@example.com',
        password: 'SecurePass123',
        displayName: 'Test User',
        personaType: 'POLITICIAN',
        bio: longBio
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('bio'),
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Conflict Errors', () => {
    it('should reject duplicate username', async () => {
      // Create existing user first
      await createTestUser({ username: 'existing_user' });

      const duplicateUser = {
        username: 'existing_user',
        email: 'different@example.com',
        password: 'SecurePass123',
        displayName: 'Different User',
        personaType: 'INFLUENCER'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(409);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('already exists'),
        code: 'CONFLICT_ERROR'
      });
    });

    it('should reject duplicate email', async () => {
      // Create existing user first
      await createTestUser({ email: 'existing@example.com' });

      const duplicateUser = {
        username: 'different_user',
        email: 'existing@example.com',
        password: 'SecurePass123',
        displayName: 'Different User',
        personaType: 'INFLUENCER'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(409);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('already exists'),
        code: 'CONFLICT_ERROR'
      });
    });
  });
});