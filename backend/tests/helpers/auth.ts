import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper functions for authentication in contract tests
 * These functions will initially fail as no implementation exists yet
 */

export interface TestUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  personaType: string;
  bio?: string;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createTestUser = async (overrides: Partial<TestUser> = {}): Promise<TestUser> => {
  const timestamp = Date.now();
  const defaultUser = {
    id: uuidv4(),
    username: `test_user_${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'TestPassword123',
    displayName: 'Test User',
    personaType: 'POLITICIAN',
    bio: 'Test bio for contract testing'
  };

  const userData = { ...defaultUser, ...overrides };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // This will fail initially as no database/prisma implementation exists
  // The test should expect this failure and validate the API contract
  try {
    // Mock implementation - this should be replaced with actual database call
    const mockUser: TestUser = {
      id: userData.id || uuidv4(),
      username: userData.username,
      email: userData.email,
      displayName: userData.displayName,
      personaType: userData.personaType,
      bio: userData.bio,
      passwordHash: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In real implementation, this would be:
    // return await prisma.userAccount.create({
    //   data: {
    //     ...userData,
    //     passwordHash: hashedPassword,
    //     profile: {
    //       create: {
    //         displayName: userData.displayName,
    //         bio: userData.bio,
    //         personaType: userData.personaType
    //       }
    //     },
    //     politicalAlignment: {
    //       create: {
    //         economicPosition: 50,
    //         socialPosition: 50,
    //         primaryIssues: ['Economy'],
    //         debateWillingness: 50,
    //         controversyTolerance: 50
    //       }
    //     }
    //   },
    //   include: {
    //     profile: true,
    //     politicalAlignment: true
    //   }
    // });

    return mockUser;
  } catch (error) {
    throw new Error(`Failed to create test user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getValidJWT = (userId: string, expiresIn: string = '1h'): string => {
  if (!process.env.JWT_SECRET) {
    // Use a test secret if not set
    process.env.JWT_SECRET = 'test-jwt-secret-for-contract-tests-only';
  }

  try {
    return jwt.sign(
      {
        sub: userId,
        type: 'access',
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  } catch (error) {
    throw new Error(`Failed to generate JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getExpiredJWT = (userId: string): string => {
  return getValidJWT(userId, '-1h'); // Expired 1 hour ago
};

export const getInvalidJWT = (): string => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
};

export const createTestUserWithProfile = async (overrides: any = {}): Promise<TestUser> => {
  const defaultProfile = {
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    verificationBadge: false,
    specialtyAreas: ['Politics'],
    location: 'Test City',
    website: 'https://test-user.example.com'
  };

  const profileData = { ...defaultProfile, ...overrides.profile };
  const userData = { ...overrides, profile: profileData };

  return createTestUser(userData);
};

export const loginTestUser = async (username: string, password: string): Promise<string> => {
  // This is a mock implementation for contract testing
  // In real implementation, this would validate credentials and return JWT

  if (!username || !password) {
    throw new Error('Username and password required');
  }

  // Mock successful login
  const mockUserId = uuidv4();
  return getValidJWT(mockUserId);
};

export const createMultipleTestUsers = async (count: number = 3): Promise<TestUser[]> => {
  const users: TestUser[] = [];

  for (let i = 0; i < count; i++) {
    const user = await createTestUser({
      username: `test_user_${i}_${Date.now()}`,
      email: `test${i}_${Date.now()}@example.com`,
      displayName: `Test User ${i + 1}`
    });
    users.push(user);
  }

  return users;
};

export const validateJWTStructure = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Validate it's properly base64 encoded
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    return !!(header.alg && header.typ && payload.sub);
  } catch {
    return false;
  }
};

export const extractUserIdFromJWT = (token: string): string | null => {
  try {
    const payload = jwt.decode(token) as any;
    return payload?.sub || null;
  } catch {
    return null;
  }
};

// Mock user data for consistent testing
export const MOCK_USERS = {
  POLITICIAN: {
    username: 'mock_politician',
    displayName: 'Mock Politician',
    personaType: 'POLITICIAN',
    bio: 'Fighting for political reform'
  },
  INFLUENCER: {
    username: 'mock_influencer',
    displayName: 'Mock Influencer',
    personaType: 'INFLUENCER',
    bio: 'Social media influence for good'
  },
  JOURNALIST: {
    username: 'mock_journalist',
    displayName: 'Mock Journalist',
    personaType: 'JOURNALIST',
    bio: 'Reporting truth and facts'
  },
  ACTIVIST: {
    username: 'mock_activist',
    displayName: 'Mock Activist',
    personaType: 'ACTIVIST',
    bio: 'Activist for social change'
  }
} as const;