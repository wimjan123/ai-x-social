import { describe, it, expect, beforeAll } from '@jest/globals';
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  type JWTPayload,
} from '@/lib/utils/auth';

// Mock config for testing
jest.mock('@/lib/config', () => ({
  config: {
    jwtSecret: 'test-secret-key',
    jwtExpiresIn: '1h',
  },
}));

describe('Auth Utils', () => {
  const testPassword = 'TestPassword123';
  let hashedPassword: string;
  const testPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
  };

  beforeAll(async () => {
    hashedPassword = await hashPassword(testPassword);
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const hash = await hashPassword(testPassword);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(testPassword);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const isValid = await comparePassword(testPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const isValid = await comparePassword('WrongPassword123', hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.username).toBe(testPayload.username);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid token');
    });

    it('should throw error for malformed token', () => {
      expect(() => verifyToken('malformed.token')).toThrow('Invalid token');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const header = `Bearer ${token}`;
      const extracted = extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it('should return null for invalid header format', () => {
      expect(extractTokenFromHeader('Invalid header')).toBeNull();
      expect(extractTokenFromHeader('Basic token')).toBeNull();
      expect(extractTokenFromHeader('')).toBeNull();
      expect(extractTokenFromHeader(undefined)).toBeNull();
    });

    it('should return null for Bearer header without token', () => {
      expect(extractTokenFromHeader('Bearer ')).toBe('');
      expect(extractTokenFromHeader('Bearer')).toBeNull();
    });
  });
});