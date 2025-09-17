/**
 * UserService Unit Tests
 *
 * Comprehensive test suite for UserService with proper mocking of dependencies.
 * Tests all methods including user registration, profile management, retrieval,
 * authentication, validation, search, and analytics.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma Client
const mockUserAccount = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
};

const mockUserProfile = {
  create: jest.fn(),
  update: jest.fn(),
  findUnique: jest.fn(),
};

const mockPoliticalAlignment = {
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
};

const mockSettings = {
  create: jest.fn(),
};

const mockInfluenceMetrics = {
  create: jest.fn(),
};

const mockPrismaClient = {
  userAccount: mockUserAccount,
  userProfile: mockUserProfile,
  politicalAlignment: mockPoliticalAlignment,
  settings: mockSettings,
  influenceMetrics: mockInfluenceMetrics,
  $transaction: jest.fn(),
  $disconnect: jest.fn(),
};

// Mock the generated Prisma module first
jest.mock('@/generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  PersonaType: {
    POLITICIAN: 'POLITICIAN',
    INFLUENCER: 'INFLUENCER',
    JOURNALIST: 'JOURNALIST',
    ACTIVIST: 'ACTIVIST',
    BUSINESS: 'BUSINESS',
    ENTERTAINER: 'ENTERTAINER',
  },
}));

import { UserService } from '@/services/UserService';
import {
  UserAccountError,
  UsernameUnavailableError,
  EmailUnavailableError,
  InvalidCredentialsError,
  AccountInactiveError,
  UserAccountModel
} from '@/models/UserAccount';
import {
  UserProfileError,
  ProfileNotFoundError,
  UserProfileModel
} from '@/models/UserProfile';
import {
  PoliticalAlignmentError,
  PoliticalAlignmentModel
} from '@/models/PoliticalAlignment';
import { PersonaType } from '@/generated/prisma';

// Mock the UserAccount model methods
jest.mock('@/models/UserAccount', () => ({
  ...jest.requireActual('@/models/UserAccount'),
  UserAccountModel: {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
    generateUsernameSuggestions: jest.fn(),
    validateUsername: jest.fn(),
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    canDeleteAccount: jest.fn(),
    sanitizeForPublic: jest.fn(),
    checkAvailability: jest.fn(),
    generateAccountSummary: jest.fn(),
  },
}));

// Mock the UserProfile model methods
jest.mock('@/models/UserProfile', () => ({
  ...jest.requireActual('@/models/UserProfile'),
  UserProfileModel: {
    getDefaultSpecialtyAreas: jest.fn(),
    sanitizeForPublic: jest.fn(),
    calculateProfileCompleteness: jest.fn(),
    validatePersonaType: jest.fn(),
    canUpdateProfile: jest.fn(),
  },
}));

// Mock the PoliticalAlignment model methods
jest.mock('@/models/PoliticalAlignment', () => ({
  ...jest.requireActual('@/models/PoliticalAlignment'),
  PoliticalAlignmentModel: {
    calculateCompleteness: jest.fn(),
    calculatePoliticalCompass: jest.fn(),
    generateSummary: jest.fn(),
    validateAlignment: jest.fn(),
    calculateCompatibility: jest.fn(),
  },
}));

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();

    userService = new UserService();
    (userService as any).prisma = mockPrismaClient;
  });

  describe('User Creation and Registration', () => {
    describe('createUser', () => {
      const validUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123',
        displayName: 'Test User',
        personaType: PersonaType.POLITICIAN,
        bio: 'Test bio',
        politicalStance: {
          economicPosition: 60,
          socialPosition: 40,
          primaryIssues: ['healthcare', 'economy'],
          partyAffiliation: 'Independent',
          ideologyTags: ['moderate'],
          debateWillingness: 70,
          controversyTolerance: 30,
        },
      };

      const mockCreatedUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };

      const mockCreatedProfile = {
        id: 'profile-123',
        userId: 'user-123',
        displayName: 'Test User',
        bio: 'Test bio',
        profileImageUrl: null,
        headerImageUrl: null,
        location: null,
        website: null,
        personaType: PersonaType.POLITICIAN,
        specialtyAreas: ['politics'],
        verificationBadge: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedAlignment = {
        id: 'alignment-123',
        userId: 'user-123',
        economicPosition: 60,
        socialPosition: 40,
        primaryIssues: ['healthcare', 'economy'],
        partyAffiliation: 'Independent',
        ideologyTags: ['moderate'],
        debateWillingness: 70,
        controversyTolerance: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      it('should create a user successfully with all components', async () => {
        // Setup mocks
        mockUserAccount.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        (UserAccountModel.hashPassword as jest.Mock).mockResolvedValue('hashed-password');
        (UserProfileModel.getDefaultSpecialtyAreas as jest.Mock).mockReturnValue(['politics']);

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: {
              create: jest.fn().mockResolvedValue(mockCreatedUser),
            },
            userProfile: {
              create: jest.fn().mockResolvedValue(mockCreatedProfile),
            },
            politicalAlignment: {
              create: jest.fn().mockResolvedValue(mockCreatedAlignment),
            },
            settings: {
              create: jest.fn().mockResolvedValue({}),
            },
            influenceMetrics: {
              create: jest.fn().mockResolvedValue({}),
            },
          });
        });

        // Mock getUserById for final return
        const expectedUserDetails = {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          emailVerified: false,
          isActive: true,
          createdAt: mockCreatedUser.createdAt,
          lastLoginAt: null,
          profile: mockCreatedProfile,
          politicalAlignment: mockCreatedAlignment,
          influenceMetrics: {},
        };

        jest.spyOn(userService, 'getUserById').mockResolvedValue(expectedUserDetails);

        const result = await userService.createUser(validUserData);

        expect(result).toEqual(expectedUserDetails);
        expect(mockUserAccount.findUnique).toHaveBeenCalledTimes(2);
        expect(UserAccountModel.hashPassword).toHaveBeenCalledWith('TestPassword123');
        expect(mockPrismaClient.$transaction).toHaveBeenCalled();
      });

      it('should throw UsernameUnavailableError if username exists', async () => {
        mockUserAccount.findUnique.mockResolvedValueOnce({ id: 'existing-user' });

        await expect(userService.createUser(validUserData)).rejects.toThrow(
          UsernameUnavailableError
        );
        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { username: 'testuser' },
        });
      });

      it('should throw EmailUnavailableError if email exists', async () => {
        mockUserAccount.findUnique
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ id: 'existing-user' });

        await expect(userService.createUser(validUserData)).rejects.toThrow(
          EmailUnavailableError
        );
        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { email: 'test@example.com' },
        });
      });

      it('should create user without political stance if not provided', async () => {
        const userDataWithoutStance = { ...validUserData };
        delete userDataWithoutStance.politicalStance;

        mockUserAccount.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        (UserAccountModel.hashPassword as jest.Mock).mockResolvedValue('hashed-password');
        (UserProfileModel.getDefaultSpecialtyAreas as jest.Mock).mockReturnValue(['politics']);

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: { create: jest.fn().mockResolvedValue(mockCreatedUser) },
            userProfile: { create: jest.fn().mockResolvedValue(mockCreatedProfile) },
            politicalAlignment: { create: jest.fn() },
            settings: { create: jest.fn().mockResolvedValue({}) },
            influenceMetrics: { create: jest.fn().mockResolvedValue({}) },
          });
        });

        jest.spyOn(userService, 'getUserById').mockResolvedValue({
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          emailVerified: false,
          isActive: true,
          createdAt: mockCreatedUser.createdAt,
          lastLoginAt: null,
          profile: mockCreatedProfile,
          politicalAlignment: null,
          influenceMetrics: {},
        });

        const result = await userService.createUser(userDataWithoutStance);

        expect(result.politicalAlignment).toBeNull();
      });

      it('should handle validation errors', async () => {
        const invalidUserData = {
          ...validUserData,
          username: 'a', // Too short
        };

        await expect(userService.createUser(invalidUserData)).rejects.toThrow();
      });

      it('should handle database transaction errors', async () => {
        mockUserAccount.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        (UserAccountModel.hashPassword as jest.Mock).mockResolvedValue('hashed-password');

        mockPrismaClient.$transaction.mockRejectedValue(new Error('Database error'));

        await expect(userService.createUser(validUserData)).rejects.toThrow(
          UserAccountError
        );
      });
    });
  });

  describe('User Retrieval', () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      emailVerified: true,
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      profile: {
        id: 'profile-123',
        displayName: 'Test User',
        bio: 'Test bio',
        personaType: PersonaType.POLITICIAN,
        verificationBadge: false,
        followerCount: 10,
        followingCount: 5,
        postCount: 20,
      },
      politicalAlignment: {
        economicPosition: 50,
        socialPosition: 50,
      },
      influenceMetrics: {
        influenceScore: 100,
        engagementRate: 0.05,
      },
    };

    describe('getUserById', () => {
      it('should return user details successfully', async () => {
        mockUserAccount.findUnique.mockResolvedValue(mockUser);
        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUser.profile);

        const result = await userService.getUserById('user-123');

        expect(result).toEqual({
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          emailVerified: true,
          isActive: true,
          createdAt: mockUser.createdAt,
          lastLoginAt: mockUser.lastLoginAt,
          profile: mockUser.profile,
          politicalAlignment: mockUser.politicalAlignment,
          influenceMetrics: mockUser.influenceMetrics,
        });

        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true,
          },
        });
      });

      it('should throw UserAccountError if user not found', async () => {
        mockUserAccount.findUnique.mockResolvedValue(null);

        await expect(userService.getUserById('nonexistent')).rejects.toThrow(
          UserAccountError
        );
        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { id: 'nonexistent' },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true,
          },
        });
      });

      it('should handle database errors', async () => {
        mockUserAccount.findUnique.mockRejectedValue(new Error('Database error'));

        await expect(userService.getUserById('user-123')).rejects.toThrow(
          UserAccountError
        );
      });
    });

    describe('getUserByUsername', () => {
      it('should return user details for existing username', async () => {
        mockUserAccount.findUnique.mockResolvedValue(mockUser);
        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUser.profile);

        const result = await userService.getUserByUsername('testuser');

        expect(result).toBeDefined();
        expect(result?.username).toBe('testuser');
        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { username: 'testuser' },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true,
          },
        });
      });

      it('should return null for non-existent username', async () => {
        mockUserAccount.findUnique.mockResolvedValue(null);

        const result = await userService.getUserByUsername('nonexistent');

        expect(result).toBeNull();
      });

      it('should handle case insensitive username lookup', async () => {
        mockUserAccount.findUnique.mockResolvedValue(mockUser);
        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUser.profile);

        await userService.getUserByUsername('TESTUSER');

        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { username: 'testuser' },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true,
          },
        });
      });

      it('should handle database errors gracefully', async () => {
        mockUserAccount.findUnique.mockRejectedValue(new Error('Database error'));

        await expect(userService.getUserByUsername('testuser')).rejects.toThrow(
          UserAccountError
        );
      });
    });

    describe('getPublicProfile', () => {
      it('should return public profile for active user', async () => {
        const activeUser = { ...mockUser, isActive: true };
        mockUserAccount.findUnique.mockResolvedValue(activeUser);

        const result = await userService.getPublicProfile('testuser');

        expect(result).toEqual({
          id: mockUser.profile.id,
          username: 'testuser',
          displayName: 'Test User',
          bio: 'Test bio',
          profileImageUrl: undefined,
          headerImageUrl: undefined,
          location: undefined,
          website: undefined,
          personaType: PersonaType.POLITICIAN,
          specialtyAreas: undefined,
          verificationBadge: false,
          followerCount: 10,
          followingCount: 5,
          postCount: 20,
          createdAt: mockUser.createdAt,
        });
      });

      it('should return null for inactive user', async () => {
        const inactiveUser = { ...mockUser, isActive: false };
        mockUserAccount.findUnique.mockResolvedValue(inactiveUser);

        const result = await userService.getPublicProfile('testuser');

        expect(result).toBeNull();
      });

      it('should return null for user without profile', async () => {
        const userWithoutProfile = { ...mockUser, profile: null };
        mockUserAccount.findUnique.mockResolvedValue(userWithoutProfile);

        const result = await userService.getPublicProfile('testuser');

        expect(result).toBeNull();
      });

      it('should return null for non-existent user', async () => {
        mockUserAccount.findUnique.mockResolvedValue(null);

        const result = await userService.getPublicProfile('nonexistent');

        expect(result).toBeNull();
      });

      it('should handle database errors gracefully', async () => {
        mockUserAccount.findUnique.mockRejectedValue(new Error('Database error'));

        const result = await userService.getPublicProfile('testuser');

        expect(result).toBeNull();
      });
    });
  });

  describe('User Authentication', () => {
    describe('authenticateUser', () => {
      const validCredentials = {
        identifier: 'testuser',
        password: 'TestPassword123',
      };

      const mockAuthUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        emailVerified: true,
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null,
        profile: {
          displayName: 'Test User',
          personaType: PersonaType.POLITICIAN,
        },
        politicalAlignment: null,
        influenceMetrics: null,
      };

      it('should authenticate user with valid username and password', async () => {
        mockUserAccount.findFirst.mockResolvedValue(mockAuthUser);
        (UserAccountModel.verifyPassword as jest.Mock).mockResolvedValue(true);
        mockUserAccount.update.mockResolvedValue(mockAuthUser);
        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockAuthUser.profile);

        const result = await userService.authenticateUser(validCredentials);

        expect(result).toBeDefined();
        expect(result.username).toBe('testuser');
        expect(mockUserAccount.findFirst).toHaveBeenCalledWith({
          where: {
            OR: [
              { username: 'testuser' },
              { email: 'testuser' },
            ],
          },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true,
          },
        });
        expect(UserAccountModel.verifyPassword).toHaveBeenCalledWith(
          'TestPassword123',
          'hashed-password'
        );
        expect(mockUserAccount.update).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          data: { lastLoginAt: expect.any(Date) },
        });
      });

      it('should authenticate user with email as identifier', async () => {
        const emailCredentials = {
          identifier: 'test@example.com',
          password: 'TestPassword123',
        };

        mockUserAccount.findFirst.mockResolvedValue(mockAuthUser);
        (UserAccountModel.verifyPassword as jest.Mock).mockResolvedValue(true);
        mockUserAccount.update.mockResolvedValue(mockAuthUser);
        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockAuthUser.profile);

        const result = await userService.authenticateUser(emailCredentials);

        expect(result).toBeDefined();
        expect(mockUserAccount.findFirst).toHaveBeenCalledWith({
          where: {
            OR: [
              { username: 'test@example.com' },
              { email: 'test@example.com' },
            ],
          },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true,
          },
        });
      });

      it('should throw InvalidCredentialsError for non-existent user', async () => {
        mockUserAccount.findFirst.mockResolvedValue(null);

        await expect(userService.authenticateUser(validCredentials)).rejects.toThrow(
          InvalidCredentialsError
        );
      });

      it('should throw InvalidCredentialsError for incorrect password', async () => {
        mockUserAccount.findFirst.mockResolvedValue(mockAuthUser);
        (UserAccountModel.verifyPassword as jest.Mock).mockResolvedValue(false);

        await expect(userService.authenticateUser(validCredentials)).rejects.toThrow(
          InvalidCredentialsError
        );
      });

      it('should throw AccountInactiveError for inactive account', async () => {
        const inactiveUser = { ...mockAuthUser, isActive: false };
        mockUserAccount.findFirst.mockResolvedValue(inactiveUser);
        (UserAccountModel.verifyPassword as jest.Mock).mockResolvedValue(true);

        await expect(userService.authenticateUser(validCredentials)).rejects.toThrow(
          AccountInactiveError
        );
      });

      it('should handle validation errors', async () => {
        const invalidCredentials = {
          identifier: '', // Invalid
          password: 'TestPassword123',
        };

        await expect(userService.authenticateUser(invalidCredentials)).rejects.toThrow();
      });

      it('should handle database errors', async () => {
        mockUserAccount.findFirst.mockRejectedValue(new Error('Database error'));

        await expect(userService.authenticateUser(validCredentials)).rejects.toThrow(
          UserAccountError
        );
      });
    });
  });

  describe('User Updates', () => {
    describe('updateUser', () => {
      const userId = 'user-123';
      const mockUpdatedUser = {
        id: userId,
        username: 'testuser',
        email: 'updated@example.com',
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        profile: {
          displayName: 'Updated User',
          bio: 'Updated bio',
        },
        politicalAlignment: {
          economicPosition: 60,
          socialPosition: 40,
        },
        influenceMetrics: {},
      };

      it('should update user email successfully', async () => {
        const updateData = {
          email: 'updated@example.com',
        };

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: {
              findFirst: jest.fn().mockResolvedValue(null),
              update: jest.fn().mockResolvedValue(mockUpdatedUser),
              findUnique: jest.fn().mockResolvedValue(mockUpdatedUser),
            },
          });
        });

        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUpdatedUser.profile);

        const result = await userService.updateUser(userId, updateData);

        expect(result.email).toBe('updated@example.com');
        expect(result.emailVerified).toBe(false);
      });

      it('should update user password successfully', async () => {
        const updateData = {
          password: 'NewPassword123',
        };

        (UserAccountModel.hashPassword as jest.Mock).mockResolvedValue('new-hashed-password');

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: {
              update: jest.fn().mockResolvedValue(mockUpdatedUser),
              findUnique: jest.fn().mockResolvedValue(mockUpdatedUser),
            },
          });
        });

        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUpdatedUser.profile);

        const result = await userService.updateUser(userId, updateData);

        expect(UserAccountModel.hashPassword).toHaveBeenCalledWith('NewPassword123');
        expect(result).toBeDefined();
      });

      it('should update user profile successfully', async () => {
        const updateData = {
          profile: {
            displayName: 'Updated User',
            bio: 'Updated bio',
          },
        };

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userProfile: {
              update: jest.fn().mockResolvedValue({}),
            },
            userAccount: {
              findUnique: jest.fn().mockResolvedValue(mockUpdatedUser),
            },
          });
        });

        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUpdatedUser.profile);

        const result = await userService.updateUser(userId, updateData);

        expect(result).toBeDefined();
      });

      it('should update political alignment successfully', async () => {
        const updateData = {
          politicalAlignment: {
            economicPosition: 70,
            socialPosition: 30,
          },
        };

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            politicalAlignment: {
              upsert: jest.fn().mockResolvedValue({}),
            },
            userAccount: {
              findUnique: jest.fn().mockResolvedValue(mockUpdatedUser),
            },
          });
        });

        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUpdatedUser.profile);

        const result = await userService.updateUser(userId, updateData);

        expect(result).toBeDefined();
      });

      it('should update user active status successfully', async () => {
        const updateData = {
          isActive: false,
        };

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: {
              update: jest.fn().mockResolvedValue(mockUpdatedUser),
              findUnique: jest.fn().mockResolvedValue({ ...mockUpdatedUser, isActive: false }),
            },
          });
        });

        (UserProfileModel.sanitizeForPublic as jest.Mock).mockReturnValue(mockUpdatedUser.profile);

        const result = await userService.updateUser(userId, updateData);

        expect(result).toBeDefined();
      });

      it('should throw EmailUnavailableError for existing email', async () => {
        const updateData = {
          email: 'existing@example.com',
        };

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: {
              findFirst: jest.fn().mockResolvedValue({ id: 'other-user' }),
            },
          });
        });

        await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
          EmailUnavailableError
        );
      });

      it('should throw UserAccountError if user not found after update', async () => {
        const updateData = {
          email: 'updated@example.com',
        };

        mockPrismaClient.$transaction.mockImplementation(async (callback) => {
          return callback({
            userAccount: {
              findFirst: jest.fn().mockResolvedValue(null),
              update: jest.fn().mockResolvedValue({}),
              findUnique: jest.fn().mockResolvedValue(null),
            },
          });
        });

        await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
          UserAccountError
        );
      });

      it('should handle validation errors', async () => {
        const updateData = {
          profile: {
            displayName: '', // Invalid
          },
        };

        await expect(userService.updateUser(userId, updateData)).rejects.toThrow();
      });

      it('should handle database transaction errors', async () => {
        const updateData = {
          email: 'updated@example.com',
        };

        mockPrismaClient.$transaction.mockRejectedValue(new Error('Database error'));

        await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
          UserAccountError
        );
      });
    });
  });

  describe('User Validation', () => {
    describe('checkUsernameAvailability', () => {
      it('should return available for valid, non-existent username', async () => {
        (UserAccountModel.validateUsername as jest.Mock).mockReturnValue({ isValid: true });
        mockUserAccount.findUnique.mockResolvedValue(null);

        const result = await userService.checkUsernameAvailability('newuser');

        expect(result).toEqual({ available: true });
        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { username: 'newuser' },
        });
      });

      it('should return unavailable with suggestions for taken username', async () => {
        (UserAccountModel.validateUsername as jest.Mock).mockReturnValue({ isValid: true });
        mockUserAccount.findUnique.mockResolvedValue({ id: 'existing-user' });
        (UserAccountModel.generateUsernameSuggestions as jest.Mock).mockReturnValue([
          'newuser1',
          'newuser2',
          'newuser_official',
        ]);

        const result = await userService.checkUsernameAvailability('newuser');

        expect(result).toEqual({
          available: false,
          suggestions: ['newuser1', 'newuser2', 'newuser_official'],
        });
      });

      it('should return unavailable for invalid username format', async () => {
        (UserAccountModel.validateUsername as jest.Mock).mockReturnValue({ isValid: false });

        const result = await userService.checkUsernameAvailability('ab');

        expect(result).toEqual({ available: false });
        expect(mockUserAccount.findUnique).not.toHaveBeenCalled();
      });

      it('should handle database errors gracefully', async () => {
        (UserAccountModel.validateUsername as jest.Mock).mockReturnValue({ isValid: true });
        mockUserAccount.findUnique.mockRejectedValue(new Error('Database error'));

        const result = await userService.checkUsernameAvailability('newuser');

        expect(result).toEqual({ available: false });
      });
    });

    describe('checkEmailAvailability', () => {
      it('should return available for valid, non-existent email', async () => {
        (UserAccountModel.validateEmail as jest.Mock).mockReturnValue({ isValid: true });
        mockUserAccount.findUnique.mockResolvedValue(null);

        const result = await userService.checkEmailAvailability('new@example.com');

        expect(result).toEqual({ available: true });
        expect(mockUserAccount.findUnique).toHaveBeenCalledWith({
          where: { email: 'new@example.com' },
        });
      });

      it('should return unavailable for existing email', async () => {
        (UserAccountModel.validateEmail as jest.Mock).mockReturnValue({ isValid: true });
        mockUserAccount.findUnique.mockResolvedValue({ id: 'existing-user' });

        const result = await userService.checkEmailAvailability('existing@example.com');

        expect(result).toEqual({ available: false });
      });

      it('should return unavailable for invalid email format', async () => {
        (UserAccountModel.validateEmail as jest.Mock).mockReturnValue({ isValid: false });

        const result = await userService.checkEmailAvailability('invalid-email');

        expect(result).toEqual({ available: false });
        expect(mockUserAccount.findUnique).not.toHaveBeenCalled();
      });

      it('should handle database errors gracefully', async () => {
        (UserAccountModel.validateEmail as jest.Mock).mockReturnValue({ isValid: true });
        mockUserAccount.findUnique.mockRejectedValue(new Error('Database error'));

        const result = await userService.checkEmailAvailability('new@example.com');

        expect(result).toEqual({ available: false });
      });
    });
  });

  describe('User Search and Discovery', () => {
    describe('searchUsers', () => {
      const mockSearchResults = [
        {
          username: 'politician1',
          isActive: true,
          createdAt: new Date(),
          profile: {
            id: 'profile-1',
            displayName: 'Political User 1',
            bio: 'A great politician',
            personaType: PersonaType.POLITICIAN,
            verificationBadge: true,
            followerCount: 1000,
            followingCount: 100,
            postCount: 50,
          },
        },
        {
          username: 'influencer1',
          isActive: true,
          createdAt: new Date(),
          profile: {
            id: 'profile-2',
            displayName: 'Influencer User 1',
            bio: 'A social media influencer',
            personaType: PersonaType.INFLUENCER,
            verificationBadge: false,
            followerCount: 500,
            followingCount: 200,
            postCount: 100,
          },
        },
      ];

      it('should search users with query', async () => {
        const searchOptions = {
          query: 'politician',
          page: 1,
          limit: 20,
        };

        mockUserAccount.findMany.mockResolvedValue(mockSearchResults);
        mockUserAccount.count.mockResolvedValue(2);

        const result = await userService.searchUsers(searchOptions);

        expect(result).toEqual({
          users: [
            {
              id: 'profile-1',
              username: 'politician1',
              displayName: 'Political User 1',
              bio: 'A great politician',
              profileImageUrl: undefined,
              headerImageUrl: undefined,
              location: undefined,
              website: undefined,
              personaType: PersonaType.POLITICIAN,
              specialtyAreas: undefined,
              verificationBadge: true,
              followerCount: 1000,
              followingCount: 100,
              postCount: 50,
              createdAt: mockSearchResults[0].createdAt,
            },
            {
              id: 'profile-2',
              username: 'influencer1',
              displayName: 'Influencer User 1',
              bio: 'A social media influencer',
              profileImageUrl: undefined,
              headerImageUrl: undefined,
              location: undefined,
              website: undefined,
              personaType: PersonaType.INFLUENCER,
              specialtyAreas: undefined,
              verificationBadge: false,
              followerCount: 500,
              followingCount: 200,
              postCount: 100,
              createdAt: mockSearchResults[1].createdAt,
            },
          ],
          total: 2,
          page: 1,
          hasMore: false,
        });

        expect(mockUserAccount.findMany).toHaveBeenCalledWith({
          where: {
            isActive: true,
            profile: {
              isNot: null,
            },
            OR: [
              { username: { contains: 'politician', mode: 'insensitive' } },
              { profile: { displayName: { contains: 'politician', mode: 'insensitive' } } },
              { profile: { bio: { contains: 'politician', mode: 'insensitive' } } },
            ],
          },
          include: {
            profile: true,
          },
          orderBy: [
            { profile: { verificationBadge: 'desc' } },
            { profile: { followerCount: 'desc' } },
            { createdAt: 'desc' },
          ],
          skip: 0,
          take: 20,
        });
      });

      it('should search users with persona type filter', async () => {
        const searchOptions = {
          personaType: PersonaType.POLITICIAN,
          page: 1,
          limit: 10,
        };

        mockUserAccount.findMany.mockResolvedValue([mockSearchResults[0]]);
        mockUserAccount.count.mockResolvedValue(1);

        const result = await userService.searchUsers(searchOptions);

        expect(result.users).toHaveLength(1);
        expect(result.users[0].personaType).toBe(PersonaType.POLITICIAN);
      });

      it('should search users with verification badge filter', async () => {
        const searchOptions = {
          verificationBadge: true,
          page: 1,
          limit: 10,
        };

        mockUserAccount.findMany.mockResolvedValue([mockSearchResults[0]]);
        mockUserAccount.count.mockResolvedValue(1);

        const result = await userService.searchUsers(searchOptions);

        expect(result.users).toHaveLength(1);
        expect(result.users[0].verificationBadge).toBe(true);
      });

      it('should search users with minimum followers filter', async () => {
        const searchOptions = {
          minFollowers: 750,
          page: 1,
          limit: 10,
        };

        mockUserAccount.findMany.mockResolvedValue([mockSearchResults[0]]);
        mockUserAccount.count.mockResolvedValue(1);

        const result = await userService.searchUsers(searchOptions);

        expect(result.users).toHaveLength(1);
        expect(result.users[0].followerCount).toBeGreaterThanOrEqual(750);
      });

      it('should handle pagination correctly', async () => {
        const searchOptions = {
          page: 2,
          limit: 1,
        };

        mockUserAccount.findMany.mockResolvedValue([mockSearchResults[1]]);
        mockUserAccount.count.mockResolvedValue(2);

        const result = await userService.searchUsers(searchOptions);

        expect(result).toEqual({
          users: expect.any(Array),
          total: 2,
          page: 2,
          hasMore: false,
        });

        expect(mockUserAccount.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 1,
            take: 1,
          })
        );
      });

      it('should filter out users without profiles', async () => {
        const usersWithAndWithoutProfiles = [
          mockSearchResults[0],
          {
            ...mockSearchResults[1],
            profile: null,
          },
        ];

        mockUserAccount.findMany.mockResolvedValue(usersWithAndWithoutProfiles);
        mockUserAccount.count.mockResolvedValue(2);

        const result = await userService.searchUsers({});

        expect(result.users).toHaveLength(1);
        expect(result.users[0].username).toBe('politician1');
      });

      it('should handle database errors', async () => {
        mockUserAccount.findMany.mockRejectedValue(new Error('Database error'));

        await expect(userService.searchUsers({})).rejects.toThrow(UserAccountError);
      });
    });
  });

  describe('User Analytics', () => {
    describe('getUserAnalytics', () => {
      const mockAnalyticsUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: true,
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        profile: {
          id: 'profile-123',
          displayName: 'Test User',
          bio: 'Test bio',
          personaType: PersonaType.POLITICIAN,
          verificationBadge: false,
          followerCount: 100,
          followingCount: 50,
          postCount: 25,
          createdAt: new Date(),
        },
        politicalAlignment: {
          economicPosition: 60,
          socialPosition: 40,
          primaryIssues: ['healthcare'],
          ideologyTags: ['moderate'],
        },
        influenceMetrics: {
          influenceScore: 150,
          engagementRate: 0.08,
        },
      };

      const mockAccountSummary = {
        accountAge: 30,
        isVerified: true,
        activityLevel: 'high' as const,
        riskLevel: 'low' as const,
      };

      const mockProfileCompleteness = {
        score: 85,
        missingFields: ['website'],
        suggestions: ['Add a website to increase credibility'],
      };

      const mockPoliticalAnalysis = {
        completeness: 90,
        compass: { quadrant: 'center-right' },
        summary: 'Moderate conservative with healthcare focus',
      };

      it('should return comprehensive user analytics', async () => {
        jest.spyOn(userService, 'getUserById').mockResolvedValue(mockAnalyticsUser);
        (UserAccountModel.generateAccountSummary as jest.Mock).mockReturnValue(mockAccountSummary);
        (UserProfileModel.calculateProfileCompleteness as jest.Mock).mockReturnValue(mockProfileCompleteness);
        (PoliticalAlignmentModel.calculateCompleteness as jest.Mock).mockReturnValue(90);
        (PoliticalAlignmentModel.calculatePoliticalCompass as jest.Mock).mockReturnValue({ quadrant: 'center-right' });
        (PoliticalAlignmentModel.generateSummary as jest.Mock).mockReturnValue('Moderate conservative with healthcare focus');

        const result = await userService.getUserAnalytics('user-123');

        expect(result).toEqual({
          accountSummary: mockAccountSummary,
          profileCompleteness: mockProfileCompleteness,
          politicalAlignment: mockPoliticalAnalysis,
          engagementMetrics: mockAnalyticsUser.influenceMetrics,
        });

        expect(userService.getUserById).toHaveBeenCalledWith('user-123');
        expect(UserAccountModel.generateAccountSummary).toHaveBeenCalledWith({
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          passwordHash: '',
          emailVerified: true,
          createdAt: mockAnalyticsUser.createdAt,
          updatedAt: expect.any(Date),
          isActive: true,
          lastLoginAt: mockAnalyticsUser.lastLoginAt,
        });
      });

      it('should handle user without profile', async () => {
        const userWithoutProfile = { ...mockAnalyticsUser, profile: null };
        jest.spyOn(userService, 'getUserById').mockResolvedValue(userWithoutProfile);
        (UserAccountModel.generateAccountSummary as jest.Mock).mockReturnValue(mockAccountSummary);

        const result = await userService.getUserAnalytics('user-123');

        expect(result.profileCompleteness).toBeNull();
        expect(UserProfileModel.calculateProfileCompleteness).not.toHaveBeenCalled();
      });

      it('should handle user without political alignment', async () => {
        const userWithoutAlignment = { ...mockAnalyticsUser, politicalAlignment: null };
        jest.spyOn(userService, 'getUserById').mockResolvedValue(userWithoutAlignment);
        (UserAccountModel.generateAccountSummary as jest.Mock).mockReturnValue(mockAccountSummary);
        (UserProfileModel.calculateProfileCompleteness as jest.Mock).mockReturnValue(mockProfileCompleteness);

        const result = await userService.getUserAnalytics('user-123');

        expect(result.politicalAlignment).toBeNull();
        expect(PoliticalAlignmentModel.calculateCompleteness).not.toHaveBeenCalled();
      });

      it('should handle getUserById errors', async () => {
        jest.spyOn(userService, 'getUserById').mockRejectedValue(new UserAccountError('User not found', 'USER_NOT_FOUND', 404));

        await expect(userService.getUserAnalytics('nonexistent')).rejects.toThrow(
          UserAccountError
        );
      });

      it('should handle analytics generation errors', async () => {
        jest.spyOn(userService, 'getUserById').mockResolvedValue(mockAnalyticsUser);
        (UserAccountModel.generateAccountSummary as jest.Mock).mockImplementation(() => {
          throw new Error('Analytics error');
        });

        await expect(userService.getUserAnalytics('user-123')).rejects.toThrow(
          UserAccountError
        );
      });
    });
  });

  describe('Cleanup', () => {
    describe('disconnect', () => {
      it('should disconnect from database', async () => {
        await userService.disconnect();

        expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
      });
    });
  });

  // Edge Cases and Error Handling
  describe('Edge Cases and Error Handling', () => {
    it('should handle empty search results', async () => {
      mockUserAccount.findMany.mockResolvedValue([]);
      mockUserAccount.count.mockResolvedValue(0);

      const result = await userService.searchUsers({ query: 'nonexistent' });

      expect(result).toEqual({
        users: [],
        total: 0,
        page: 1,
        hasMore: false,
      });
    });

    it('should handle large pagination numbers', async () => {
      const result = await userService.searchUsers({ page: 1000, limit: 20 });

      expect(mockUserAccount.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 19980, // (1000-1) * 20
          take: 20,
        })
      );
    });

    it('should handle concurrent user creation attempts', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123',
        displayName: 'Test User',
        personaType: PersonaType.POLITICIAN,
      };

      // Set up mock to return existing user on second attempt
      mockUserAccount.findUnique
        .mockResolvedValueOnce(null) // First check for username
        .mockResolvedValueOnce(null) // First check for email
        .mockResolvedValueOnce({ id: 'existing-user' }); // Second attempt finds existing user

      mockPrismaClient.$transaction.mockResolvedValueOnce({
        user: { id: 'user-123' },
        profile: {},
        politicalAlignment: null,
      });

      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null,
        profile: null,
        politicalAlignment: null,
        influenceMetrics: null,
      });

      // First call should succeed
      const result1 = await userService.createUser(userData);
      expect(result1.id).toBe('user-123');

      // Second call should fail due to username conflict
      await expect(userService.createUser(userData)).rejects.toThrow(
        UsernameUnavailableError
      );
    });
  });
});