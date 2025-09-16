# Contract Test Examples & Patterns

**Purpose**: Concrete examples and patterns for implementing API contract tests (T008-T027)
**Reference**: OpenAPI specification in `contracts/openapi.yaml`
**Test Framework**: Jest + Supertest for Node.js API testing

## Test Structure Pattern

All contract tests follow this consistent structure:

```typescript
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
          debateWillingness: 75,
          controversyTolerance: 50
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      // Validate response schema matches OpenAPI
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          username: validUser.username,
          displayName: validUser.displayName,
          personaType: validUser.personaType
        }),
        expiresIn: expect.any(Number)
      });

      // Validate JWT token format
      expect(response.body.accessToken).toMatch(/^eyJ/);
      expect(response.body.expiresIn).toBe(3600);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid username format', async () => {
      const invalidUser = {
        username: 'ab', // Too short
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
  });
});
```

## Authentication Test Patterns

### T008: Register Endpoint
```typescript
// File: backend/tests/contract/auth.register.test.ts
describe('Contract: POST /api/auth/register', () => {
  const validRegistration = {
    username: 'political_pundit',
    email: 'pundit@example.com',
    password: 'SecurePass123!',
    displayName: 'Political Pundit',
    personaType: 'POLITICIAN',
    bio: 'Fighting for transparency',
    politicalStance: {
      economicPosition: 25,    // Left-leaning
      socialPosition: 30,      // Liberal
      primaryIssues: ['Healthcare', 'Climate Change'],
      partyAffiliation: 'Progressive',
      ideologyTags: ['progressive', 'environmentalist'],
      debateWillingness: 85,
      controversyTolerance: 60
    }
  };

  it('should create politician persona with left-leaning stance', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validRegistration)
      .expect(201);

    // Validate user creation
    expect(response.body.user).toMatchObject({
      username: 'political_pundit',
      personaType: 'POLITICIAN',
      specialtyAreas: expect.any(Array)
    });

    // Validate JWT contains user ID
    const token = response.body.accessToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.sub).toBe(response.body.user.id);
  });

  // Test all PersonaType enums
  test.each([
    'POLITICIAN', 'INFLUENCER', 'JOURNALIST',
    'ACTIVIST', 'BUSINESS', 'ENTERTAINER'
  ])('should accept %s persona type', async (personaType) => {
    const userData = { ...validRegistration, personaType };

    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
  });
});
```

### T009: Login Endpoint
```typescript
// File: backend/tests/contract/auth.login.test.ts
describe('Contract: POST /api/auth/login', () => {
  beforeEach(async () => {
    // Create test user before each test
    await createTestUser({
      username: 'test_user',
      email: 'test@example.com',
      password: 'TestPassword123'
    });
  });

  it('should login with username', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'test_user',
        password: 'TestPassword123'
      })
      .expect(200);

    expect(response.body).toMatchSchema({
      accessToken: { type: 'string', pattern: '^eyJ' },
      refreshToken: { type: 'string' },
      user: { type: 'object' },
      expiresIn: { type: 'number', const: 3600 }
    });
  });

  it('should login with email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'test@example.com',
        password: 'TestPassword123'
      })
      .expect(200);

    expect(response.body.user.username).toBe('test_user');
  });
});
```

## User Profile Test Patterns

### T011: Get Current Profile
```typescript
// File: backend/tests/contract/users.profile.test.ts
describe('Contract: GET /api/users/profile', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'profile_user',
      displayName: 'Profile User',
      bio: 'Testing profiles',
      personaType: 'INFLUENCER'
    });
    authToken = await getValidJWT(testUser.id);
  });

  it('should return current user profile', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Validate complete UserProfile schema
    expect(response.body).toMatchObject({
      id: testUser.id,
      username: 'profile_user',
      displayName: 'Profile User',
      bio: 'Testing profiles',
      personaType: 'INFLUENCER',
      verificationBadge: false,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    // Validate ISO date formats
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
  });

  it('should reject unauthorized requests', async () => {
    await request(app)
      .get('/api/users/profile')
      .expect(401);
  });

  it('should reject invalid JWT tokens', async () => {
    await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
  });
});
```

## Posts Test Patterns

### T014: Create Post
```typescript
// File: backend/tests/contract/posts.create.test.ts
describe('Contract: POST /api/posts', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = await getValidJWT(testUser.id);
  });

  it('should create post with valid content', async () => {
    const postData = {
      content: 'This is a test post about political reform #reform #politics',
      mediaUrls: ['https://example.com/image1.jpg'],
      newsItemId: null,
      contentWarning: null
    };

    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(postData)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      authorId: testUser.id,
      content: postData.content,
      mediaUrls: ['https://example.com/image1.jpg'],
      hashtags: ['reform', 'politics'],
      mentions: [],
      isAIGenerated: false,
      likeCount: 0,
      repostCount: 0,
      commentCount: 0,
      publishedAt: expect.any(String),
      author: expect.objectContaining({
        username: testUser.username
      })
    });
  });

  it('should enforce 280 character limit', async () => {
    const longContent = 'a'.repeat(281);

    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: longContent })
      .expect(400);
  });

  it('should extract hashtags and mentions', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Hello @johndoe, check out #politics and #reform trends!'
      })
      .expect(201);

    expect(response.body.hashtags).toEqual(['politics', 'reform']);
    expect(response.body.mentions).toEqual(['johndoe']);
  });
});
```

## AI Personas Test Patterns

### T021: Persona Reply
```typescript
// File: backend/tests/contract/personas.reply.test.ts
describe('Contract: POST /api/personas/{personaId}/reply', () => {
  let conservativePersona: any;
  let liberalPersona: any;
  let authToken: string;

  beforeEach(async () => {
    // Create personas with different political alignments
    conservativePersona = await createTestPersona({
      name: 'Conservative Voice',
      handle: 'conservative_voice',
      politicalAlignment: {
        economicPosition: 80,  // Right-leaning
        socialPosition: 75     // Conservative
      }
    });

    liberalPersona = await createTestPersona({
      name: 'Progressive Voice',
      handle: 'progressive_voice',
      politicalAlignment: {
        economicPosition: 20,  // Left-leaning
        socialPosition: 25     // Liberal
      }
    });

    const testUser = await createTestUser();
    authToken = await getValidJWT(testUser.id);
  });

  it('should generate contextual AI response', async () => {
    const response = await request(app)
      .post(`/api/personas/${conservativePersona.id}/reply`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        context: 'The new healthcare proposal will provide universal coverage',
        newsItemId: null
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      authorId: null,
      personaId: conservativePersona.id,
      content: expect.any(String),
      isAIGenerated: true,
      persona: expect.objectContaining({
        name: 'Conservative Voice'
      })
    });

    // Conservative persona should oppose universal healthcare
    expect(response.body.content.toLowerCase()).toMatch(
      /(concern|cost|private|market|alternative)/
    );
  });

  it('should handle demo mode when AI service unavailable', async () => {
    // Mock AI service failure
    jest.spyOn(AIOrchestrator.prototype, 'generateResponse')
        .mockRejectedValue(new Error('API unavailable'));

    const response = await request(app)
      .post(`/api/personas/${liberalPersona.id}/reply`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        context: 'Climate change requires immediate action'
      })
      .expect(201);

    // Should return demo response
    expect(response.body.content).toContain('[Demo Mode]');
  });
});
```

## Mock Data Helpers

```typescript
// File: backend/tests/helpers/mock-data.ts

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: `test_user_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123',
    displayName: 'Test User',
    personaType: 'POLITICIAN',
    bio: 'Test bio'
  };

  const userData = { ...defaultUser, ...overrides };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await prisma.userAccount.create({
    data: {
      ...userData,
      passwordHash: hashedPassword,
      profile: {
        create: {
          displayName: userData.displayName,
          bio: userData.bio,
          personaType: userData.personaType
        }
      },
      politicalAlignment: {
        create: {
          economicPosition: 50,
          socialPosition: 50,
          primaryIssues: ['Economy'],
          debateWillingness: 50,
          controversyTolerance: 50
        }
      }
    },
    include: {
      profile: true,
      politicalAlignment: true
    }
  });
};

export const createTestPersona = async (overrides = {}) => {
  const defaultPersona = {
    name: `Test Persona ${Date.now()}`,
    handle: `test_persona_${Date.now()}`,
    bio: 'AI test persona',
    personaType: 'POLITICIAN',
    toneStyle: 'PROFESSIONAL',
    isActive: true,
    isDefault: false
  };

  return await prisma.persona.create({
    data: { ...defaultPersona, ...overrides }
  });
};

export const getValidJWT = (userId: string): string => {
  return jwt.sign(
    { sub: userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
```

## Schema Validation Helpers

```typescript
// File: backend/tests/helpers/schema-validation.ts

export const matchSchema = (schema: any) => ({
  asymmetricMatch: (actual: any) => {
    return validateSchema(actual, schema);
  },
  toString: () => 'matchSchema'
});

const validateSchema = (data: any, schema: any): boolean => {
  // Simple schema validation for contract tests
  for (const [key, rules] of Object.entries(schema)) {
    if (!(key in data)) return false;

    const value = data[key];
    const rule = rules as any;

    if (rule.type && typeof value !== rule.type) return false;
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) return false;
    if (rule.const && value !== rule.const) return false;
  }

  return true;
};
```

This contract test framework ensures all API endpoints conform to the OpenAPI specification while providing realistic test scenarios that match the political social media simulator requirements.