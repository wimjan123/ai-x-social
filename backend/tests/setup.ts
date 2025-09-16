// Set test environment variables BEFORE any imports
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ai_x_social_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.PORT = '3001';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX = '100';

import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { logger } from '@/lib/logger';

// Global test setup
beforeAll(async () => {
  // Silence logs during testing
  logger.silent = true;

  // Initialize test database connection if needed
  // await initializeTestDatabase();
});

afterAll(async () => {
  // Clean up test database
  // await cleanupTestDatabase();

  // Close database connections
  // await closeDatabaseConnections();
});

beforeEach(async () => {
  // Reset database state before each test if needed
  // await resetTestDatabase();
});

afterEach(async () => {
  // Clean up after each test if needed
  // await cleanupTestData();
});

// Mock external services during testing
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    silent: false,
  },
}));

// Mock Prisma Client
jest.mock('@/generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    userAccount: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    userProfile: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    politicalAlignment: {
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    settings: {
      create: jest.fn(),
      update: jest.fn(),
    },
    influenceMetrics: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  })),
}));

// Increase timeout for integration tests
jest.setTimeout(30000);