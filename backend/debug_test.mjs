import request from 'supertest';
import app from './src/app.ts';

// Set environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ai_x_social_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.PORT = '3001';

async function debugAuth() {
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

  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser);
    
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(response.body, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugAuth();
