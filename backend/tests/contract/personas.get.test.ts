import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';

describe('Contract: GET /api/personas/{personaId}', () => {
  let testPersonaId: string;

  beforeEach(async () => {
    // This will fail initially as the endpoint doesn't exist
    // In a real implementation, we would create test persona or use a known default one
    testPersonaId = '123e4567-e89b-12d3-a456-426614174000'; // Test UUID
  });

  afterEach(async () => {
    // Cleanup test data
  });

  describe('Successful Response Format', () => {
    it('should return specific persona with correct PublicPersona schema', async () => {
      const response = await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      const persona = response.body;

      // Required PublicPersona fields from OpenAPI schema
      expect(persona).toHaveProperty('id');
      expect(persona).toHaveProperty('name');
      expect(persona).toHaveProperty('handle');
      expect(persona).toHaveProperty('bio');
      expect(persona).toHaveProperty('personaType');
      expect(persona).toHaveProperty('isActive');
      expect(persona).toHaveProperty('isDefault');

      // Validate data types
      expect(typeof persona.id).toBe('string');
      expect(typeof persona.name).toBe('string');
      expect(typeof persona.handle).toBe('string');
      expect(typeof persona.bio).toBe('string');
      expect(typeof persona.isActive).toBe('boolean');
      expect(typeof persona.isDefault).toBe('boolean');

      // Validate UUID format for ID
      expect(persona.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // PersonaType enum validation
      expect(['POLITICIAN', 'INFLUENCER', 'JOURNALIST', 'ACTIVIST', 'BUSINESS', 'ENTERTAINER'])
        .toContain(persona.personaType);
    });

    it('should include detailed persona characteristics for political simulation', async () => {
      const response = await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      const persona = response.body;

      // For political simulation, personas should have meaningful characteristics
      expect(persona.bio).toBeDefined();
      expect(persona.bio.length).toBeGreaterThan(10); // Non-trivial bio

      if (persona.personalityTraits) {
        expect(Array.isArray(persona.personalityTraits)).toBe(true);
        expect(persona.personalityTraits.length).toBeGreaterThan(0);
        persona.personalityTraits.forEach((trait: any) => {
          expect(typeof trait).toBe('string');
          expect(trait.length).toBeGreaterThan(2);
        });
      }

      if (persona.interests) {
        expect(Array.isArray(persona.interests)).toBe(true);
        persona.interests.forEach((interest: any) => {
          expect(typeof interest).toBe('string');
          expect(interest.length).toBeGreaterThan(2);
        });
      }

      if (persona.expertise) {
        expect(Array.isArray(persona.expertise)).toBe(true);
        persona.expertise.forEach((skill: any) => {
          expect(typeof skill).toBe('string');
          expect(skill.length).toBeGreaterThan(2);
        });
      }

      if (persona.toneStyle) {
        expect(['PROFESSIONAL', 'CASUAL', 'HUMOROUS', 'SERIOUS', 'SARCASTIC', 'EMPATHETIC'])
          .toContain(persona.toneStyle);
      }
    });

    it('should validate handle format follows username pattern', async () => {
      const response = await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      const persona = response.body;

      // Handle should follow pattern: ^[a-zA-Z0-9_]{3,15}$
      expect(persona.handle).toMatch(/^[a-zA-Z0-9_]{3,15}$/);
      expect(persona.handle.length).toBeGreaterThanOrEqual(3);
      expect(persona.handle.length).toBeLessThanOrEqual(15);
    });

    it('should return consistent data for multiple requests', async () => {
      const response1 = await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      // Same persona should return identical data
      expect(response1.body).toEqual(response2.body);
    });
  });

  describe('Political Persona Validation', () => {
    it('should provide detailed political characteristics for POLITICIAN type', async () => {
      // First get a list to find a politician persona
      const listResponse = await request(app)
        .get('/api/personas?type=POLITICIAN')
        .expect(200);

      if (listResponse.body.length > 0) {
        const politicianId = listResponse.body[0].id;

        const response = await request(app)
          .get(`/api/personas/${politicianId}`)
          .expect(200);

        const persona = response.body;

        expect(persona.personaType).toBe('POLITICIAN');

        // Politicians should have political-relevant traits
        if (persona.interests) {
          const politicalInterests = persona.interests.some((interest: string) =>
            ['politics', 'government', 'policy', 'legislation', 'democracy', 'elections']
              .some(keyword => interest.toLowerCase().includes(keyword))
          );
          expect(politicalInterests).toBe(true);
        }

        // Should have expertise relevant to governance
        if (persona.expertise) {
          const politicalExpertise = persona.expertise.some((skill: string) =>
            ['public policy', 'legislation', 'governance', 'diplomacy', 'economics', 'law']
              .some(keyword => skill.toLowerCase().includes(keyword))
          );
          expect(politicalExpertise).toBe(true);
        }
      }
    });

    it('should have distinct personality traits for conservative vs liberal personas', async () => {
      const response = await request(app)
        .get('/api/personas?type=POLITICIAN')
        .expect(200);

      if (response.body.length >= 2) {
        // Get details for first two political personas
        const persona1Response = await request(app)
          .get(`/api/personas/${response.body[0].id}`)
          .expect(200);

        const persona2Response = await request(app)
          .get(`/api/personas/${response.body[1].id}`)
          .expect(200);

        const persona1 = persona1Response.body;
        const persona2 = persona2Response.body;

        // Should have different personality traits (political diversity)
        const traits1 = persona1.personalityTraits || [];
        const traits2 = persona2.personalityTraits || [];

        // At least some traits should be different
        const hasDistinctTraits = !traits1.every((trait: string) => traits2.includes(trait));
        expect(hasDistinctTraits).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent persona ID', async () => {
      const nonExistentId = '99999999-9999-9999-9999-999999999999';

      const response = await request(app)
        .get(`/api/personas/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid UUID format', async () => {
      const invalidId = 'invalid-uuid-format';

      const response = await request(app)
        .get(`/api/personas/${invalidId}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
      expect(response.body.message.toLowerCase()).toContain('uuid');
    });

    it('should return 400 for empty persona ID', async () => {
      const response = await request(app)
        .get('/api/personas/')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });
  });

  describe('Security and Data Privacy', () => {
    it('should not expose internal persona configuration data', async () => {
      const response = await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      const persona = response.body;

      // Should not expose internal fields like API keys, configuration, etc.
      expect(persona).not.toHaveProperty('apiKey');
      expect(persona).not.toHaveProperty('internalConfig');
      expect(persona).not.toHaveProperty('systemPrompt');
      expect(persona).not.toHaveProperty('createdAt');
      expect(persona).not.toHaveProperty('updatedAt');

      // Should only expose PublicPersona fields
      const allowedFields = [
        'id', 'name', 'handle', 'bio', 'profileImageUrl', 'personaType',
        'personalityTraits', 'interests', 'expertise', 'toneStyle',
        'isActive', 'isDefault'
      ];

      Object.keys(persona).forEach(key => {
        expect(allowedFields).toContain(key);
      });
    });
  });

  describe('Performance Requirements', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();

      await request(app)
        .get(`/api/personas/${testPersonaId}`)
        .expect(200);

      const responseTime = Date.now() - startTime;

      // Should respond within 500ms for individual persona lookup
      expect(responseTime).toBeLessThan(500);
    });
  });
});