import { describe, it, expect } from '@jest/globals';
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
  postContentSchema,
  paginationSchema,
} from '@/lib/utils/validation';

describe('Validation Schemas', () => {
  describe('usernameSchema', () => {
    it('should validate correct usernames', () => {
      expect(usernameSchema.parse('john_doe')).toBe('john_doe');
      expect(usernameSchema.parse('user123')).toBe('user123');
      expect(usernameSchema.parse('USERNAME')).toBe('USERNAME');
    });

    it('should reject invalid usernames', () => {
      expect(() => usernameSchema.parse('ab')).toThrow(); // too short
      expect(() => usernameSchema.parse('a'.repeat(31))).toThrow(); // too long
      expect(() => usernameSchema.parse('user-name')).toThrow(); // invalid characters
      expect(() => usernameSchema.parse('user@name')).toThrow(); // invalid characters
    });
  });

  describe('emailSchema', () => {
    it('should validate correct emails', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com');
      expect(emailSchema.parse('test.email+tag@domain.co.uk')).toBe('test.email+tag@domain.co.uk');
    });

    it('should reject invalid emails', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow();
      expect(() => emailSchema.parse('user@')).toThrow();
      expect(() => emailSchema.parse('@domain.com')).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      expect(passwordSchema.parse('Password123')).toBe('Password123');
      expect(passwordSchema.parse('MySecure1Pass')).toBe('MySecure1Pass');
    });

    it('should reject weak passwords', () => {
      expect(() => passwordSchema.parse('short')).toThrow(); // too short
      expect(() => passwordSchema.parse('password')).toThrow(); // no uppercase or numbers
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow(); // no lowercase
      expect(() => passwordSchema.parse('Password')).toThrow(); // no numbers
    });
  });

  describe('postContentSchema', () => {
    it('should validate post content', () => {
      expect(postContentSchema.parse('Hello world!')).toBe('Hello world!');
      expect(postContentSchema.parse('A'.repeat(280))).toBe('A'.repeat(280));
    });

    it('should reject invalid post content', () => {
      expect(() => postContentSchema.parse('')).toThrow(); // empty
      expect(() => postContentSchema.parse('A'.repeat(281))).toThrow(); // too long
    });
  });

  describe('paginationSchema', () => {
    it('should validate pagination parameters', () => {
      const result = paginationSchema.parse({
        page: '2',
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'asc',
      });

      expect(result).toEqual({
        page: 2,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'asc',
      });
    });

    it('should apply defaults', () => {
      const result = paginationSchema.parse({});

      expect(result).toEqual({
        page: 1,
        limit: 20,
        sortOrder: 'desc',
      });
    });

    it('should reject invalid pagination', () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow(); // page < 1
      expect(() => paginationSchema.parse({ limit: 101 })).toThrow(); // limit > 100
    });
  });
});