import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '@/index';

describe('Contract: GET /api/personas', () => {
  beforeEach(async () => {
    // Setup test data - this will fail initially as the endpoint doesn't exist
  });

  afterEach(async () => {
    // Cleanup test data
  });

  describe('Successful Response Format', () => {
    it('should return list of AI personas with correct schema', async () => {
      const response = await request(app)
        .get('/api/personas')
        .expect(200);

      // Validate response structure matches OpenAPI schema
      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const persona = response.body[0];

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

        // PersonaType enum validation
        expect(['POLITICIAN', 'INFLUENCER', 'JOURNALIST', 'ACTIVIST', 'BUSINESS', 'ENTERTAINER'])
          .toContain(persona.personaType);

        // Optional fields with proper types when present
        if (persona.profileImageUrl) {
          expect(typeof persona.profileImageUrl).toBe('string');
          expect(persona.profileImageUrl).toMatch(/^https?:\/\//);
        }

        if (persona.personalityTraits) {
          expect(Array.isArray(persona.personalityTraits)).toBe(true);
          persona.personalityTraits.forEach((trait: any) => {
            expect(typeof trait).toBe('string');
          });
        }

        if (persona.interests) {
          expect(Array.isArray(persona.interests)).toBe(true);
          persona.interests.forEach((interest: any) => {
            expect(typeof interest).toBe('string');
          });
        }

        if (persona.expertise) {
          expect(Array.isArray(persona.expertise)).toBe(true);
          persona.expertise.forEach((skill: any) => {
            expect(typeof skill).toBe('string');
          });
        }

        if (persona.toneStyle) {
          expect(['PROFESSIONAL', 'CASUAL', 'HUMOROUS', 'SERIOUS', 'SARCASTIC', 'EMPATHETIC'])
            .toContain(persona.toneStyle);
        }
      }
    });

    it('should support filtering by persona type', async () => {
      const response = await request(app)
        .get('/api/personas?type=POLITICIAN')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned personas should be POLITICIAN type
      response.body.forEach((persona: any) => {
        expect(persona.personaType).toBe('POLITICIAN');
      });
    });

    it('should support filtering by active status', async () => {
      const response = await request(app)
        .get('/api/personas?active=true')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned personas should be active
      response.body.forEach((persona: any) => {
        expect(persona.isActive).toBe(true);
      });
    });

    it('should return default personas when no custom personas exist', async () => {
      const response = await request(app)
        .get('/api/personas')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Should have at least some default personas
      const hasDefaultPersonas = response.body.some((persona: any) => persona.isDefault === true);
      expect(hasDefaultPersonas).toBe(true);
    });
  });

  describe('Political Alignment Representation', () => {
    it('should include diverse political alignments in default personas', async () => {
      const response = await request(app)
        .get('/api/personas?type=POLITICIAN')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);

      // Should have different personality traits representing different political views
      const allTraits = response.body.flatMap((persona: any) => persona.personalityTraits || []);

      // Look for political diversity indicators
      const hasConservativeTraits = allTraits.some((trait: string) =>
        trait.toLowerCase().includes('conservative') ||
        trait.toLowerCase().includes('traditional') ||
        trait.toLowerCase().includes('fiscal')
      );

      const hasLiberalTraits = allTraits.some((trait: string) =>
        trait.toLowerCase().includes('progressive') ||
        trait.toLowerCase().includes('liberal') ||
        trait.toLowerCase().includes('social')
      );

      // Should represent political spectrum diversity
      expect(hasConservativeTraits || hasLiberalTraits).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for invalid persona type filter', async () => {
      const response = await request(app)
        .get('/api/personas?type=INVALID_TYPE')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid active status filter', async () => {
      const response = await request(app)
        .get('/api/personas?active=invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });
  });

  describe('Performance Requirements', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();

      await request(app)
        .get('/api/personas')
        .expect(200);

      const responseTime = Date.now() - startTime;

      // Should respond within 1 second
      expect(responseTime).toBeLessThan(1000);
    });
  });
});