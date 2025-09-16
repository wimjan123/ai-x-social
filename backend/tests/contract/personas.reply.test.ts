import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '@/index';

describe('Contract: POST /api/personas/{personaId}/reply', () => {
  let conservativePersonaId: string;
  let liberalPersonaId: string;
  let authToken: string;

  beforeEach(async () => {
    // This will fail initially as the endpoint doesn't exist
    // In real implementation, these would be created test personas or known defaults
    conservativePersonaId = '123e4567-e89b-12d3-a456-426614174001'; // Conservative test persona
    liberalPersonaId = '123e4567-e89b-12d3-a456-426614174002'; // Liberal test persona
    authToken = 'test-jwt-token'; // Mock authentication token

    // Mock any external AI services to ensure consistent testing
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Cleanup test data
    jest.restoreAllMocks();
  });

  describe('Successful AI Response Generation', () => {
    it('should generate contextual AI response with correct Post schema', async () => {
      const context = 'The new healthcare proposal will provide universal coverage for all citizens';

      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: context,
          newsItemId: null
        })
        .expect(201);

      const post = response.body;

      // Validate Post schema compliance
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('isAIGenerated', true);
      expect(post).toHaveProperty('personaId', conservativePersonaId);
      expect(post).toHaveProperty('authorId', null);
      expect(post).toHaveProperty('publishedAt');
      expect(post).toHaveProperty('createdAt');

      // Validate data types
      expect(typeof post.id).toBe('string');
      expect(typeof post.content).toBe('string');
      expect(typeof post.isAIGenerated).toBe('boolean');
      expect(typeof post.publishedAt).toBe('string');
      expect(typeof post.createdAt).toBe('string');

      // Validate UUID format
      expect(post.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // Content should be within Twitter-like limits
      expect(post.content.length).toBeGreaterThan(0);
      expect(post.content.length).toBeLessThanOrEqual(280);

      // Should include persona information
      expect(post).toHaveProperty('persona');
      expect(post.persona).toHaveProperty('id', conservativePersonaId);
      expect(post.persona).toHaveProperty('name');
      expect(post.persona).toHaveProperty('handle');

      // Engagement metrics should be initialized
      expect(post).toHaveProperty('likeCount', 0);
      expect(post).toHaveProperty('repostCount', 0);
      expect(post).toHaveProperty('commentCount', 0);
      expect(post).toHaveProperty('impressionCount', 0);
    });

    it('should reflect political alignment in response content', async () => {
      const healthcareContext = 'Universal healthcare should be a fundamental right for everyone';

      // Test conservative persona response
      const conservativeResponse = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ context: healthcareContext })
        .expect(201);

      // Test liberal persona response
      const liberalResponse = await request(app)
        .post(`/api/personas/${liberalPersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ context: healthcareContext })
        .expect(201);

      const conservativeContent = conservativeResponse.body.content.toLowerCase();
      const liberalContent = liberalResponse.body.content.toLowerCase();

      // Conservative response should include market-oriented language
      const conservativeKeywords = ['cost', 'taxpayer', 'private', 'market', 'choice', 'freedom', 'budget', 'responsibility'];
      const hasConservativeLanguage = conservativeKeywords.some(keyword =>
        conservativeContent.includes(keyword)
      );

      // Liberal response should include social justice language
      const liberalKeywords = ['right', 'access', 'equality', 'justice', 'coverage', 'care', 'support', 'humanity'];
      const hasLiberalLanguage = liberalKeywords.some(keyword =>
        liberalContent.includes(keyword)
      );

      // At least one persona should show clear political alignment
      expect(hasConservativeLanguage || hasLiberalLanguage).toBe(true);

      // Responses should be substantively different
      expect(conservativeContent).not.toBe(liberalContent);
    });

    it('should handle news item context for current events response', async () => {
      const newsItemId = '456e7890-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Major economic policy announcement affects stock market',
          newsItemId: newsItemId
        })
        .expect(201);

      const post = response.body;

      expect(post).toHaveProperty('newsItemId', newsItemId);
      expect(post.content).toBeDefined();
      expect(post.content.length).toBeGreaterThan(10);

      // Should reference economic themes given the context
      const economicKeywords = ['economy', 'market', 'policy', 'economic', 'financial', 'business'];
      const hasEconomicContent = economicKeywords.some(keyword =>
        post.content.toLowerCase().includes(keyword)
      );
      expect(hasEconomicContent).toBe(true);
    });
  });

  describe('Political Simulation Accuracy', () => {
    it('should generate opposing responses to political topics', async () => {
      const politicalContext = 'Gun control measures should be strengthened to improve public safety';

      const conservativeResponse = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ context: politicalContext })
        .expect(201);

      const liberalResponse = await request(app)
        .post(`/api/personas/${liberalPersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ context: politicalContext })
        .expect(201);

      const conservativeContent = conservativeResponse.body.content.toLowerCase();
      const liberalContent = liberalResponse.body.content.toLowerCase();

      // Should demonstrate clear political opposition
      const conservativeGunKeywords = ['rights', 'amendment', 'constitution', 'freedom', 'law-abiding', 'criminals'];
      const liberalGunKeywords = ['safety', 'violence', 'children', 'victims', 'sensible', 'regulation', 'lives'];

      const conservativeMatch = conservativeGunKeywords.some(keyword =>
        conservativeContent.includes(keyword)
      );
      const liberalMatch = liberalGunKeywords.some(keyword =>
        liberalContent.includes(keyword)
      );

      // Should show political alignment in language choice
      expect(conservativeMatch || liberalMatch).toBe(true);
    });

    it('should maintain consistent persona voice across multiple topics', async () => {
      const topics = [
        'Climate change requires immediate government intervention',
        'Tax cuts stimulate economic growth and job creation',
        'Social welfare programs help reduce inequality'
      ];

      const responses = [];
      for (const topic of topics) {
        const response = await request(app)
          .post(`/api/personas/${conservativePersonaId}/reply`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ context: topic })
          .expect(201);

        responses.push(response.body.content);
      }

      // All responses should maintain consistent conservative tone
      responses.forEach(content => {
        expect(content).toBeDefined();
        expect(content.length).toBeGreaterThan(10);
      });

      // Should use consistent vocabulary patterns
      const allContent = responses.join(' ').toLowerCase();
      const conservativePatterns = ['government', 'freedom', 'free market', 'responsibility', 'constitution'];
      const hasConsistentVoice = conservativePatterns.some(pattern =>
        allContent.includes(pattern)
      );
      expect(hasConsistentVoice).toBe(true);
    });
  });

  describe('Demo Mode Fallback', () => {
    it('should handle AI service unavailability with demo responses', async () => {
      // Mock AI service failure
      const mockAIService = jest.fn().mockRejectedValue(new Error('AI service unavailable'));

      // This would require actual mocking of the AI orchestrator
      // For now, we test that the endpoint handles errors gracefully

      const response = await request(app)
        .post(`/api/personas/${liberalPersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Climate change requires immediate action'
        })
        .expect(201); // Should still return 201 with demo content

      const post = response.body;

      // Demo mode should be clearly indicated
      expect(post.content).toContain('[Demo Mode]');
      expect(post.isAIGenerated).toBe(true);

      // Should still maintain basic Post schema compliance
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('personaId', liberalPersonaId);
      expect(post).toHaveProperty('content');
    });

    it('should provide contextually relevant demo responses', async () => {
      // When AI is unavailable, demo should still be somewhat relevant
      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Economic stimulus package announced by government'
        })
        .expect(201);

      const post = response.body;

      if (post.content.includes('[Demo Mode]')) {
        // Demo content should reference the economic context
        const economicTerms = ['economic', 'economy', 'stimulus', 'government', 'policy', 'budget'];
        const hasRelevantContent = economicTerms.some(term =>
          post.content.toLowerCase().includes(term)
        );
        expect(hasRelevantContent).toBe(true);
      }
    });
  });

  describe('Error Handling and Validation', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .send({
          context: 'Test context without authentication'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent persona ID', async () => {
      const nonExistentId = '99999999-9999-9999-9999-999999999999';

      const response = await request(app)
        .post(`/api/personas/${nonExistentId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Test context for non-existent persona'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message.toLowerCase()).toContain('persona');
    });

    it('should return 400 for invalid request data', async () => {
      // Missing required context field
      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message.toLowerCase()).toContain('context');
    });

    it('should return 400 for invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';

      const response = await request(app)
        .post(`/api/personas/${invalidId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Test context with invalid persona ID'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message.toLowerCase()).toContain('uuid');
    });

    it('should handle empty context gracefully', async () => {
      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: ''
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message.toLowerCase()).toContain('context');
    });
  });

  describe('Performance and Rate Limiting', () => {
    it('should complete AI generation within reasonable time', async () => {
      const startTime = Date.now();

      await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Quick performance test context'
        })
        .expect(201);

      const responseTime = Date.now() - startTime;

      // AI response should complete within 10 seconds
      expect(responseTime).toBeLessThan(10000);
    });

    it('should handle concurrent persona requests', async () => {
      const context = 'Concurrent test context for multiple personas';

      const requests = [
        request(app)
          .post(`/api/personas/${conservativePersonaId}/reply`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ context }),
        request(app)
          .post(`/api/personas/${liberalPersonaId}/reply`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ context })
      ];

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('content');
        expect(response.body.isAIGenerated).toBe(true);
      });

      // Should return different responses for different personas
      expect(responses[0].body.content).not.toBe(responses[1].body.content);
    });
  });

  describe('Content Quality and Safety', () => {
    it('should generate appropriate content without harmful language', async () => {
      const response = await request(app)
        .post(`/api/personas/${conservativePersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Controversial political topic requiring measured response'
        })
        .expect(201);

      const content = response.body.content;

      // Content should be substantive
      expect(content.trim().length).toBeGreaterThan(20);

      // Should not contain obvious harmful patterns
      const harmfulPatterns = ['hate', 'violence', 'kill', 'die', 'murder'];
      const hasHarmfulContent = harmfulPatterns.some(pattern =>
        content.toLowerCase().includes(pattern)
      );
      expect(hasHarmfulContent).toBe(false);
    });

    it('should maintain professional discourse standards', async () => {
      const response = await request(app)
        .post(`/api/personas/${liberalPersonaId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          context: 'Heated political debate about immigration policy'
        })
        .expect(201);

      const content = response.body.content;

      // Should avoid excessive profanity or extreme language
      const extremeLanguage = ['stupid', 'idiot', 'moron', 'crazy'];
      const hasExtremeLanguage = extremeLanguage.some(word =>
        content.toLowerCase().includes(word)
      );

      // Political discourse should be civil even when disagreeing
      expect(hasExtremeLanguage).toBe(false);
    });
  });
});