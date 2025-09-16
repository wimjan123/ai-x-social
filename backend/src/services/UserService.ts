/**
 * UserService - Core user management service
 *
 * Handles user account operations including creation, updates, profile management,
 * and validation. Integrates with UserAccount, UserProfile, and PoliticalAlignment models.
 */

import { PrismaClient } from '../generated/prisma';
import {
  UserAccountModel,
  UserAccountError,
  UsernameUnavailableError,
  EmailUnavailableError,
  InvalidCredentialsError,
  AccountNotVerifiedError,
  AccountInactiveError,
  CreateUserAccountInput,
  UpdateUserAccountInput,
  CreateUserAccountSchema,
  UpdateUserAccountSchema,
  LoginSchema
} from '../models/UserAccount';
import {
  UserProfileModel,
  UserProfileError,
  ProfileNotFoundError,
  InvalidProfileDataError,
  CreateUserProfileInput,
  UpdateUserProfileInput,
  CreateUserProfileSchema,
  UpdateUserProfileSchema,
  PublicUserProfile
} from '../models/UserProfile';
import {
  PoliticalAlignmentModel,
  PoliticalAlignmentError,
  AlignmentNotFoundError,
  CreatePoliticalAlignmentInput,
  UpdatePoliticalAlignmentInput,
  CreatePoliticalAlignmentSchema,
  UpdatePoliticalAlignmentSchema,
  AlignmentCompatibility
} from '../models/PoliticalAlignment';
import { PersonaType } from '../generated/prisma';
import { config } from '../lib/config';
import { logger } from '../lib/logger';

export interface CreateUserData extends CreateUserAccountInput {}

export interface UpdateUserData {
  email?: string;
  password?: string;
  isActive?: boolean;
  profile?: UpdateUserProfileInput;
  politicalAlignment?: UpdatePoliticalAlignmentInput;
}

export interface UserDetails {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  profile: PublicUserProfile | null;
  politicalAlignment: any | null;
  influenceMetrics: any | null;
}

export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
}

export interface UserSearchOptions {
  query?: string;
  personaType?: PersonaType;
  verificationBadge?: boolean;
  minFollowers?: number;
  page?: number;
  limit?: number;
}

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ============================================================================
  // USER CREATION AND REGISTRATION
  // ============================================================================

  /**
   * Create a new user account with profile and political alignment
   */
  async createUser(userData: CreateUserData): Promise<UserDetails> {
    try {
      // Validate input data
      const validatedData = CreateUserAccountSchema.parse(userData);

      // Check username availability
      const existingUsername = await this.prisma.userAccount.findUnique({
        where: { username: validatedData.username.toLowerCase() }
      });

      if (existingUsername) {
        throw new UsernameUnavailableError(validatedData.username);
      }

      // Check email availability
      const existingEmail = await this.prisma.userAccount.findUnique({
        where: { email: validatedData.email.toLowerCase() }
      });

      if (existingEmail) {
        throw new EmailUnavailableError(validatedData.email);
      }

      // Hash password
      const passwordHash = await UserAccountModel.hashPassword(validatedData.password);

      // Create user in transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create user account
        const user = await tx.userAccount.create({
          data: {
            username: validatedData.username.toLowerCase(),
            email: validatedData.email.toLowerCase(),
            passwordHash,
            emailVerified: false,
            isActive: true,
            lastLoginAt: null
          }
        });

        // Create user profile
        const profile = await tx.userProfile.create({
          data: {
            userId: user.id,
            displayName: validatedData.displayName,
            bio: validatedData.bio || null,
            personaType: validatedData.personaType,
            specialtyAreas: UserProfileModel.getDefaultSpecialtyAreas(validatedData.personaType),
            verificationBadge: false,
            followerCount: 0,
            followingCount: 0,
            postCount: 0
          }
        });

        // Create political alignment if provided
        let politicalAlignment = null;
        if (validatedData.politicalStance) {
          politicalAlignment = await tx.politicalAlignment.create({
            data: {
              userId: user.id,
              economicPosition: validatedData.politicalStance.economicPosition || 50,
              socialPosition: validatedData.politicalStance.socialPosition || 50,
              primaryIssues: validatedData.politicalStance.primaryIssues || [],
              partyAffiliation: validatedData.politicalStance.partyAffiliation || null,
              ideologyTags: validatedData.politicalStance.ideologyTags || [],
              debateWillingness: validatedData.politicalStance.debateWillingness || 50,
              controversyTolerance: validatedData.politicalStance.controversyTolerance || 50
            }
          });
        }

        // Create default settings
        await tx.settings.create({
          data: {
            userId: user.id,
            theme: 'DARK',
            language: 'en',
            region: 'US',
            timezone: 'UTC',
            profileVisibility: 'PUBLIC',
            allowDirectMessages: true,
            allowMentions: true,
            allowFollowRequests: true,
            showOnlineStatus: false,
            twoFactorEnabled: false,
            notificationPreferences: JSON.stringify({
              email: true,
              push: true,
              inApp: true,
              categories: {
                LIKES: true,
                COMMENTS: true,
                FOLLOWS: true,
                MENTIONS: true,
                REPOSTS: true,
                NEWS: false,
                SYSTEM: true
              }
            }),
            newsPreferences: JSON.stringify({
              sources: [],
              categories: [],
              regions: ['US'],
              languages: ['en'],
              personalized: true,
              breakingNews: true
            }),
            aiPreferences: JSON.stringify({
              preferredProvider: 'CLAUDE',
              chatterLevel: 50,
              autoReply: false,
              contextAware: true,
              learningEnabled: true
            })
          }
        });

        // Create initial influence metrics
        await tx.influenceMetrics.create({
          data: {
            userId: user.id,
            influenceScore: 0,
            engagementRate: 0,
            followerGrowthRate: 0,
            virality: 0,
            credibilityScore: 50, // Start at neutral credibility
            approvalRating: 50,
            polarityIndex: 0,
            trendingScore: 0,
            mediaAttention: 0,
            debateParticipation: 0,
            controversyLevel: 0
          }
        });

        return { user, profile, politicalAlignment };
      });

      logger.info(`User created successfully: ${result.user.username}`, {
        userId: result.user.id,
        email: result.user.email
      });

      return await this.getUserById(result.user.id);

    } catch (error) {
      if (error instanceof UserAccountError) {
        throw error;
      }
      logger.error('Error creating user:', error);
      throw new UserAccountError('Failed to create user account', 'USER_CREATION_FAILED', 500);
    }
  }

  // ============================================================================
  // USER RETRIEVAL
  // ============================================================================

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string): Promise<UserDetails> {
    try {
      const user = await this.prisma.userAccount.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          politicalAlignment: true,
          influenceMetrics: true
        }
      });

      if (!user) {
        throw new UserAccountError('User not found', 'USER_NOT_FOUND', 404);
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        profile: user.profile ? UserProfileModel.sanitizeForPublic(user.profile, true) : null,
        politicalAlignment: user.politicalAlignment,
        influenceMetrics: user.influenceMetrics
      };

    } catch (error) {
      if (error instanceof UserAccountError) {
        throw error;
      }
      logger.error('Error retrieving user by ID:', error);
      throw new UserAccountError('Failed to retrieve user', 'USER_RETRIEVAL_FAILED', 500);
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<UserDetails | null> {
    try {
      const user = await this.prisma.userAccount.findUnique({
        where: { username: username.toLowerCase() },
        include: {
          profile: true,
          politicalAlignment: true,
          influenceMetrics: true
        }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        profile: user.profile ? UserProfileModel.sanitizeForPublic(user.profile, true) : null,
        politicalAlignment: user.politicalAlignment,
        influenceMetrics: user.influenceMetrics
      };

    } catch (error) {
      logger.error('Error retrieving user by username:', error);
      throw new UserAccountError('Failed to retrieve user', 'USER_RETRIEVAL_FAILED', 500);
    }
  }

  /**
   * Get public user profile by username
   */
  async getPublicProfile(username: string): Promise<PublicUserProfile | null> {
    try {
      const user = await this.prisma.userAccount.findUnique({
        where: { username: username.toLowerCase() },
        include: {
          profile: true
        }
      });

      if (!user || !user.profile || !user.isActive) {
        return null;
      }

      return {
        id: user.profile.id,
        username: user.username,
        displayName: user.profile.displayName,
        bio: user.profile.bio,
        profileImageUrl: user.profile.profileImageUrl,
        headerImageUrl: user.profile.headerImageUrl,
        location: user.profile.location,
        website: user.profile.website,
        personaType: user.profile.personaType,
        specialtyAreas: user.profile.specialtyAreas,
        verificationBadge: user.profile.verificationBadge,
        followerCount: user.profile.followerCount,
        followingCount: user.profile.followingCount,
        postCount: user.profile.postCount,
        createdAt: user.createdAt
      };

    } catch (error) {
      logger.error('Error retrieving public profile:', error);
      return null;
    }
  }

  // ============================================================================
  // USER AUTHENTICATION
  // ============================================================================

  /**
   * Authenticate user login
   */
  async authenticateUser(credentials: LoginCredentials): Promise<UserDetails> {
    try {
      // Validate credentials
      const validatedCredentials = LoginSchema.parse(credentials);

      // Find user by username or email
      const user = await this.prisma.userAccount.findFirst({
        where: {
          OR: [
            { username: validatedCredentials.identifier.toLowerCase() },
            { email: validatedCredentials.identifier.toLowerCase() }
          ]
        },
        include: {
          profile: true,
          politicalAlignment: true,
          influenceMetrics: true
        }
      });

      if (!user) {
        throw new InvalidCredentialsError();
      }

      // Verify password
      const isValidPassword = await UserAccountModel.verifyPassword(
        validatedCredentials.password,
        user.passwordHash
      );

      if (!isValidPassword) {
        throw new InvalidCredentialsError();
      }

      // Check account status
      if (!user.isActive) {
        throw new AccountInactiveError();
      }

      // Update last login time
      await this.prisma.userAccount.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      logger.info(`User authenticated successfully: ${user.username}`, {
        userId: user.id
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: new Date(),
        profile: user.profile ? UserProfileModel.sanitizeForPublic(user.profile, true) : null,
        politicalAlignment: user.politicalAlignment,
        influenceMetrics: user.influenceMetrics
      };

    } catch (error) {
      if (error instanceof UserAccountError) {
        throw error;
      }
      logger.error('Error authenticating user:', error);
      throw new UserAccountError('Authentication failed', 'AUTHENTICATION_FAILED', 500);
    }
  }

  // ============================================================================
  // USER UPDATES
  // ============================================================================

  /**
   * Update user account information
   */
  async updateUser(userId: string, updateData: UpdateUserData): Promise<UserDetails> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Update user account if basic fields provided
        if (updateData.email || updateData.password || updateData.isActive !== undefined) {
          const accountUpdateData: any = {};

          if (updateData.email) {
            // Check email availability
            const existingEmail = await tx.userAccount.findFirst({
              where: {
                email: updateData.email.toLowerCase(),
                NOT: { id: userId }
              }
            });

            if (existingEmail) {
              throw new EmailUnavailableError(updateData.email);
            }

            accountUpdateData.email = updateData.email.toLowerCase();
            accountUpdateData.emailVerified = false; // Reset verification on email change
          }

          if (updateData.password) {
            accountUpdateData.passwordHash = await UserAccountModel.hashPassword(updateData.password);
          }

          if (updateData.isActive !== undefined) {
            accountUpdateData.isActive = updateData.isActive;
          }

          await tx.userAccount.update({
            where: { id: userId },
            data: accountUpdateData
          });
        }

        // Update profile if provided
        if (updateData.profile) {
          const validatedProfile = UpdateUserProfileSchema.parse(updateData.profile);

          await tx.userProfile.update({
            where: { userId },
            data: validatedProfile
          });
        }

        // Update political alignment if provided
        if (updateData.politicalAlignment) {
          const validatedAlignment = UpdatePoliticalAlignmentSchema.parse(updateData.politicalAlignment);

          await tx.politicalAlignment.upsert({
            where: { userId },
            update: validatedAlignment,
            create: {
              userId,
              economicPosition: 50,
              socialPosition: 50,
              primaryIssues: [],
              ideologyTags: [],
              debateWillingness: 50,
              controversyTolerance: 50,
              ...validatedAlignment
            }
          });
        }

        return tx.userAccount.findUnique({
          where: { id: userId },
          include: {
            profile: true,
            politicalAlignment: true,
            influenceMetrics: true
          }
        });
      });

      if (!result) {
        throw new UserAccountError('User not found', 'USER_NOT_FOUND', 404);
      }

      logger.info(`User updated successfully: ${result.username}`, {
        userId: result.id
      });

      return {
        id: result.id,
        username: result.username,
        email: result.email,
        emailVerified: result.emailVerified,
        isActive: result.isActive,
        createdAt: result.createdAt,
        lastLoginAt: result.lastLoginAt,
        profile: result.profile ? UserProfileModel.sanitizeForPublic(result.profile, true) : null,
        politicalAlignment: result.politicalAlignment,
        influenceMetrics: result.influenceMetrics
      };

    } catch (error) {
      if (error instanceof UserAccountError || error instanceof UserProfileError || error instanceof PoliticalAlignmentError) {
        throw error;
      }
      logger.error('Error updating user:', error);
      throw new UserAccountError('Failed to update user', 'USER_UPDATE_FAILED', 500);
    }
  }

  // ============================================================================
  // USER VALIDATION
  // ============================================================================

  /**
   * Validate username availability
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean; suggestions?: string[] }> {
    try {
      const validation = UserAccountModel.validateUsername(username);
      if (!validation.isValid) {
        return { available: false };
      }

      const existingUser = await this.prisma.userAccount.findUnique({
        where: { username: username.toLowerCase() }
      });

      if (existingUser) {
        const suggestions = UserAccountModel.generateUsernameSuggestions(username);
        return { available: false, suggestions };
      }

      return { available: true };

    } catch (error) {
      logger.error('Error checking username availability:', error);
      return { available: false };
    }
  }

  /**
   * Validate email availability
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const validation = UserAccountModel.validateEmail(email);
      if (!validation.isValid) {
        return { available: false };
      }

      const existingUser = await this.prisma.userAccount.findUnique({
        where: { email: email.toLowerCase() }
      });

      return { available: !existingUser };

    } catch (error) {
      logger.error('Error checking email availability:', error);
      return { available: false };
    }
  }

  // ============================================================================
  // USER SEARCH AND DISCOVERY
  // ============================================================================

  /**
   * Search users with filters and pagination
   */
  async searchUsers(options: UserSearchOptions): Promise<{
    users: PublicUserProfile[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    try {
      const {
        query,
        personaType,
        verificationBadge,
        minFollowers = 0,
        page = 1,
        limit = 20
      } = options;

      const offset = (page - 1) * limit;

      const where: any = {
        isActive: true,
        profile: {
          isNot: null
        }
      };

      // Add search conditions
      if (query) {
        where.OR = [
          { username: { contains: query, mode: 'insensitive' } },
          { profile: { displayName: { contains: query, mode: 'insensitive' } } },
          { profile: { bio: { contains: query, mode: 'insensitive' } } }
        ];
      }

      if (personaType) {
        where.profile.personaType = personaType;
      }

      if (verificationBadge !== undefined) {
        where.profile.verificationBadge = verificationBadge;
      }

      if (minFollowers > 0) {
        where.profile.followerCount = { gte: minFollowers };
      }

      const [users, total] = await Promise.all([
        this.prisma.userAccount.findMany({
          where,
          include: {
            profile: true
          },
          orderBy: [
            { profile: { verificationBadge: 'desc' } },
            { profile: { followerCount: 'desc' } },
            { createdAt: 'desc' }
          ],
          skip: offset,
          take: limit
        }),
        this.prisma.userAccount.count({ where })
      ]);

      const publicProfiles: PublicUserProfile[] = users
        .filter(user => user.profile)
        .map(user => ({
          id: user.profile!.id,
          username: user.username,
          displayName: user.profile!.displayName,
          bio: user.profile!.bio,
          profileImageUrl: user.profile!.profileImageUrl,
          headerImageUrl: user.profile!.headerImageUrl,
          location: user.profile!.location,
          website: user.profile!.website,
          personaType: user.profile!.personaType,
          specialtyAreas: user.profile!.specialtyAreas,
          verificationBadge: user.profile!.verificationBadge,
          followerCount: user.profile!.followerCount,
          followingCount: user.profile!.followingCount,
          postCount: user.profile!.postCount,
          createdAt: user.createdAt
        }));

      return {
        users: publicProfiles,
        total,
        page,
        hasMore: offset + users.length < total
      };

    } catch (error) {
      logger.error('Error searching users:', error);
      throw new UserAccountError('Failed to search users', 'USER_SEARCH_FAILED', 500);
    }
  }

  // ============================================================================
  // USER ANALYTICS
  // ============================================================================

  /**
   * Get user analytics and insights
   */
  async getUserAnalytics(userId: string): Promise<{
    accountSummary: any;
    profileCompleteness: any;
    politicalAlignment?: any;
    engagementMetrics: any;
  }> {
    try {
      const user = await this.getUserById(userId);

      const accountSummary = UserAccountModel.generateAccountSummary({
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: '', // Not needed for summary
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: new Date(),
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt
      });

      let profileCompleteness = null;
      if (user.profile) {
        profileCompleteness = UserProfileModel.calculateProfileCompleteness({
          id: user.profile.id!,
          userId: user.id,
          displayName: user.profile.displayName!,
          bio: user.profile.bio,
          profileImageUrl: user.profile.profileImageUrl,
          headerImageUrl: user.profile.headerImageUrl,
          location: user.profile.location,
          website: user.profile.website,
          personaType: user.profile.personaType!,
          specialtyAreas: user.profile.specialtyAreas!,
          verificationBadge: user.profile.verificationBadge!,
          followerCount: user.profile.followerCount!,
          followingCount: user.profile.followingCount!,
          postCount: user.profile.postCount!,
          createdAt: user.profile.createdAt!,
          updatedAt: new Date()
        });
      }

      let politicalAlignmentAnalysis = null;
      if (user.politicalAlignment) {
        politicalAlignmentAnalysis = {
          completeness: PoliticalAlignmentModel.calculateCompleteness(user.politicalAlignment),
          compass: PoliticalAlignmentModel.calculatePoliticalCompass(user.politicalAlignment),
          summary: PoliticalAlignmentModel.generateSummary(user.politicalAlignment)
        };
      }

      return {
        accountSummary,
        profileCompleteness,
        politicalAlignment: politicalAlignmentAnalysis,
        engagementMetrics: user.influenceMetrics
      };

    } catch (error) {
      logger.error('Error getting user analytics:', error);
      throw new UserAccountError('Failed to get user analytics', 'USER_ANALYTICS_FAILED', 500);
    }
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default UserService;