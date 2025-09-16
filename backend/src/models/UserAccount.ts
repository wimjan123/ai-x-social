/**
 * UserAccount Model
 *
 * Represents an authenticated user with customizable politician/influencer persona.
 * Handles user authentication, account management, and basic profile data.
 */

import type { UserAccount as PrismaUserAccount, UserProfile, PoliticalAlignment, InfluenceMetrics, Settings, Post, Reaction } from '../generated/prisma';
import { PersonaType } from '../generated/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';

// ============================================================================
// INTERFACES
// ============================================================================

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginAt: Date | null;

  // Relationships
  profile?: UserProfile;
  politicalAlignment?: PoliticalAlignment;
  influenceMetrics?: InfluenceMetrics;
  settings?: Settings;
  posts?: Post[];
  reactions?: Reaction[];
}

export interface CreateUserAccountInput {
  username: string;
  email: string;
  password: string;
  displayName: string;
  personaType: PersonaType;
  bio?: string;
  politicalStance?: PoliticalStanceInput;
}

export interface UpdateUserAccountInput {
  email?: string;
  password?: string;
  isActive?: boolean;
}

export interface PoliticalStanceInput {
  economicPosition?: number;
  socialPosition?: number;
  primaryIssues?: string[];
  partyAffiliation?: string;
  ideologyTags?: string[];
  debateWillingness?: number;
  controversyTolerance?: number;
}


// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const UsernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(15, "Username must be at most 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const EmailSchema = z.string()
  .email("Invalid email format")
  .max(255, "Email must be at most 255 characters");

export const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number");

export const CreateUserAccountSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  displayName: z.string()
    .min(1, "Display name is required")
    .max(50, "Display name must be at most 50 characters"),
  personaType: z.nativeEnum(PersonaType),
  bio: z.string()
    .max(280, "Bio must be at most 280 characters")
    .optional(),
  politicalStance: z.object({
    economicPosition: z.number().min(0).max(100).optional(),
    socialPosition: z.number().min(0).max(100).optional(),
    primaryIssues: z.array(z.string().min(2).max(50)).max(5).optional(),
    partyAffiliation: z.string().max(100).optional(),
    ideologyTags: z.array(z.string().min(2).max(30)).max(10).optional(),
    debateWillingness: z.number().min(0).max(100).optional(),
    controversyTolerance: z.number().min(0).max(100).optional(),
  }).optional(),
});

export const UpdateUserAccountSchema = z.object({
  email: EmailSchema.optional(),
  password: PasswordSchema.optional(),
  isActive: z.boolean().optional(),
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

// ============================================================================
// BUSINESS LOGIC
// ============================================================================

export class UserAccountModel {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a unique username suggestion if the desired username is taken
   */
  static generateUsernameSuggestions(baseUsername: string): string[] {
    const suggestions: string[] = [];
    const cleanBase = baseUsername.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    // Add numbers
    for (let i = 1; i <= 5; i++) {
      suggestions.push(`${cleanBase}${i}`);
    }

    // Add common suffixes
    const suffixes = ['_official', '_real', '_user', '_pro'];
    suffixes.forEach(suffix => {
      if (cleanBase.length + suffix.length <= 15) {
        suggestions.push(`${cleanBase}${suffix}`);
      }
    });

    return suggestions.slice(0, 5); // Return max 5 suggestions
  }

  /**
   * Validate username format and availability (logic placeholder)
   */
  static validateUsername(username: string): { isValid: boolean; error?: string } {
    try {
      UsernameSchema.parse(username);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: "Invalid username format" };
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    try {
      EmailSchema.parse(email);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: "Invalid email format" };
    }
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; error?: string; strength: 'weak' | 'medium' | 'strong' } {
    try {
      PasswordSchema.parse(password);

      // Calculate password strength
      let score = 0;
      if (password.length >= 12) score += 2;
      else if (password.length >= 8) score += 1;

      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/\d/.test(password)) score += 1;
      if (/[^a-zA-Z0-9]/.test(password)) score += 2;

      const strength = score >= 6 ? 'strong' : score >= 4 ? 'medium' : 'weak';

      return { isValid: true, strength };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message, strength: 'weak' };
      }
      return { isValid: false, error: "Invalid password", strength: 'weak' };
    }
  }

  /**
   * Check if user account is eligible for deletion
   */
  static canDeleteAccount(user: UserAccount): { canDelete: boolean; reason?: string } {
    // Prevent deletion of recently created accounts (less than 24 hours)
    const accountAge = Date.now() - user.createdAt.getTime();
    const minAccountAge = 24 * 60 * 60 * 1000; // 24 hours

    if (accountAge < minAccountAge) {
      return {
        canDelete: false,
        reason: "Account must be at least 24 hours old before deletion"
      };
    }

    return { canDelete: true };
  }

  /**
   * Sanitize user data for public display
   */
  static sanitizeForPublic(user: UserAccount): Partial<UserAccount> {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      isActive: user.isActive,
      // Note: Never expose email, passwordHash, lastLoginAt in public data
    };
  }

  /**
   * Check if username or email is available (placeholder for database check)
   */
  static async checkAvailability(username?: string, email?: string): Promise<{
    usernameAvailable?: boolean;
    emailAvailable?: boolean;
  }> {
    // This would typically query the database
    // For now, return placeholder logic
    return {
      usernameAvailable: username ? true : undefined,
      emailAvailable: email ? true : undefined,
    };
  }

  /**
   * Generate account summary for analytics
   */
  static generateAccountSummary(user: UserAccount): {
    accountAge: number;
    isVerified: boolean;
    activityLevel: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const now = new Date();
    const accountAge = Math.floor((now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Activity level based on last login
    let activityLevel: 'low' | 'medium' | 'high' = 'low';
    if (user.lastLoginAt) {
      const daysSinceLogin = Math.floor((now.getTime() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLogin <= 1) activityLevel = 'high';
      else if (daysSinceLogin <= 7) activityLevel = 'medium';
    }

    // Basic risk assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (!user.emailVerified) riskLevel = 'medium';
    if (!user.isActive) riskLevel = 'high';

    return {
      accountAge,
      isVerified: user.emailVerified,
      activityLevel,
      riskLevel,
    };
  }
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class UserAccountError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'UserAccountError';
  }
}

export class UsernameUnavailableError extends UserAccountError {
  constructor(username: string) {
    super(`Username "${username}" is already taken`, 'USERNAME_UNAVAILABLE', 409);
  }
}

export class EmailUnavailableError extends UserAccountError {
  constructor(email: string) {
    super(`Email "${email}" is already registered`, 'EMAIL_UNAVAILABLE', 409);
  }
}

export class InvalidCredentialsError extends UserAccountError {
  constructor() {
    super('Invalid username or password', 'INVALID_CREDENTIALS', 401);
  }
}

export class AccountNotVerifiedError extends UserAccountError {
  constructor() {
    super('Account email not verified', 'ACCOUNT_NOT_VERIFIED', 403);
  }
}

export class AccountInactiveError extends UserAccountError {
  constructor() {
    super('Account has been deactivated', 'ACCOUNT_INACTIVE', 403);
  }
}