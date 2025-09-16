import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';
import { createTestUser, getValidJWT, cleanupTestData } from '../helpers/auth';

describe('Contract: PUT /api/settings/ai-config', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'ai_config_user',
      email: 'aiconfig@example.com',
      password: 'AIConfigPass123',
      displayName: 'AI Config User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Success Cases', () => {
    it('should configure AI settings with custom API key', async () => {
      const validAIConfig = {
        customAIApiKey: 'sk-1234567890abcdef1234567890abcdef',
        customAIBaseUrl: 'https://api.openai.com/v1'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validAIConfig)
        .expect(200);

      // Validate SuccessResponse schema
      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });

      // Should not expose sensitive API key in response
      expect(response.body.message).not.toContain(validAIConfig.customAIApiKey);
      expect(response.body).not.toHaveProperty('customAIApiKey');
    });

    it('should configure AI settings with custom base URL only', async () => {
      const validAIConfig = {
        customAIBaseUrl: 'https://custom-ai-service.example.com/api/v1'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validAIConfig)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });

      expect(response.body.message).toContain('updated');
    });

    it('should configure AI settings with API key only', async () => {
      const validAIConfig = {
        customAIApiKey: 'sk-proj-abcdef1234567890abcdef1234567890abcdef1234567890'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validAIConfig)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });
    });

    it('should handle empty configuration (reset to defaults)', async () => {
      const emptyConfig = {};

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(emptyConfig)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });
    });

    it('should configure with localhost development URLs', async () => {
      const devConfig = {
        customAIBaseUrl: 'http://localhost:8080/api'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(devConfig)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle different AI provider API key formats', async () => {
      const anthropicKey = 'sk-ant-api03-1234567890abcdef1234567890abcdef1234567890abcdef';

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ customAIApiKey: anthropicKey })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid URL format', async () => {
      const invalidConfig = {
        customAIBaseUrl: 'not-a-valid-url'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('URL')
      });
    });

    it('should reject malformed API key formats', async () => {
      const invalidConfig = {
        customAIApiKey: 'invalid-key-format'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('API key')
      });
    });

    it('should reject extremely long API keys', async () => {
      const tooLongKey = 'sk-' + 'a'.repeat(1000);

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ customAIApiKey: tooLongKey })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject invalid data types', async () => {
      const invalidConfig = {
        customAIApiKey: 12345,
        customAIBaseUrl: true
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject empty string values', async () => {
      const invalidConfig = {
        customAIApiKey: '',
        customAIBaseUrl: '   '
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject URLs with unsupported protocols', async () => {
      const invalidConfig = {
        customAIBaseUrl: 'ftp://example.com/api'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('protocol')
      });
    });

    it('should reject URLs without proper schemes', async () => {
      const invalidConfig = {
        customAIBaseUrl: 'example.com/api'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Authorization Tests', () => {
    it('should reject requests without authorization header', async () => {
      const validConfig = {
        customAIApiKey: 'sk-1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .send(validConfig)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should reject requests with invalid JWT token', async () => {
      const validConfig = {
        customAIApiKey: 'sk-1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', 'Bearer invalid_token')
        .send(validConfig)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token')
      });
    });

    it('should reject requests with malformed authorization header', async () => {
      const validConfig = {
        customAIApiKey: 'sk-1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', 'NotBearer token')
        .send(validConfig)
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should allow each user to configure their own AI settings independently', async () => {
      // Create another user
      const otherUser = await createTestUser({
        username: 'other_ai_user',
        email: 'otherai@example.com'
      });
      const otherToken = await getValidJWT(otherUser.id);

      const config1 = { customAIApiKey: 'sk-user1-key' };
      const config2 = { customAIApiKey: 'sk-user2-key' };

      // Configure first user's AI settings
      await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(config1)
        .expect(200);

      // Configure second user's AI settings
      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${otherToken}`)
        .send(config2)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Security Considerations', () => {
    it('should not expose API keys in response headers', async () => {
      const sensitiveConfig = {
        customAIApiKey: 'sk-very-secret-key-1234567890'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sensitiveConfig)
        .expect(200);

      // Check that API key is not in any response headers
      const headerValues = Object.values(response.headers).join(' ');
      expect(headerValues).not.toContain(sensitiveConfig.customAIApiKey);
    });

    it('should include security headers', async () => {
      const validConfig = {
        customAIApiKey: 'sk-1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validConfig)
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should handle potential injection attempts in URLs', async () => {
      const maliciousConfig = {
        customAIBaseUrl: 'https://evil.com/api?redirect=http://malicious.site'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Content Type and Request Handling', () => {
    it('should return JSON content type', async () => {
      const validConfig = {
        customAIApiKey: 'sk-1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validConfig)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send('{"customAIApiKey": "sk-test"}')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('Edge Cases and Error Recovery', () => {
    it('should handle very large request bodies gracefully', async () => {
      const largeConfig = {
        customAIApiKey: 'sk-' + 'a'.repeat(10000),
        customAIBaseUrl: 'https://example.com/' + 'path/'.repeat(1000)
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(largeConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should handle unicode characters in configuration', async () => {
      const unicodeConfig = {
        customAIApiKey: 'sk-test-🔑-1234567890'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(unicodeConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it('should rate limit configuration requests', async () => {
      const validConfig = {
        customAIApiKey: 'sk-1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/settings/ai-config')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validConfig)
        .expect(200);

      // Should include rate limiting headers
      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });
  });
});