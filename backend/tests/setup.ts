import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { logger } from '@/lib/logger';

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';

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

// Increase timeout for integration tests
jest.setTimeout(30000);