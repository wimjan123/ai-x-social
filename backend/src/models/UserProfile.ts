/**
 * UserProfile Model
 *
 * Public-facing persona including profile picture, bio, specialty areas, and political alignment.
 * Handles user profile display, engagement metrics, and public information.
 */

import type { UserProfile as PrismaUserProfile } from '../generated/prisma';
import { PersonaType } from '../generated/prisma';
import { z } from 'zod';

// ============================================================================
// INTERFACES
// ============================================================================

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  profileImageUrl: string | null;
  headerImageUrl: string | null;
  location: string | null;
  website: string | null;

  // Persona-specific fields
  personaType: PersonaType;
  specialtyAreas: string[];
  verificationBadge: boolean;

  // Engagement metrics (denormalized for performance)
  followerCount: number;
  followingCount: number;
  postCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProfileInput {
  userId: string;
  displayName: string;
  personaType: PersonaType;
  bio?: string;
  location?: string;
  website?: string;
  specialtyAreas?: string[];
}

export interface UpdateUserProfileInput {
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  headerImageUrl?: string;
  location?: string;
  website?: string;
  specialtyAreas?: string[];
}

export interface PublicUserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  profileImageUrl: string | null;
  headerImageUrl: string | null;
  location: string | null;
  website: string | null;
  personaType: PersonaType;
  specialtyAreas: string[];
  verificationBadge: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: Date;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const DisplayNameSchema = z.string()
  .min(1, "Display name is required")
  .max(50, "Display name must be at most 50 characters")
  .regex(/^[a-zA-Z0-9\s._-]+$/, "Display name contains invalid characters");

export const BioSchema = z.string()
  .max(280, "Bio must be at most 280 characters")
  .optional()
  .nullable();

export const WebsiteSchema = z.string()
  .url("Invalid website URL")
  .max(512, "Website URL is too long")
  .optional()
  .nullable();

export const LocationSchema = z.string()
  .max(100, "Location must be at most 100 characters")
  .optional()
  .nullable();

export const SpecialtyAreasSchema = z.array(
  z.string()
    .min(1, "Specialty area cannot be empty")
    .max(30, "Specialty area must be at most 30 characters")
)
  .max(5, "Maximum 5 specialty areas allowed")
  .optional();

export const CreateUserProfileSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  displayName: DisplayNameSchema,
  personaType: z.nativeEnum(PersonaType),
  bio: BioSchema,
  location: LocationSchema,
  website: WebsiteSchema,
  specialtyAreas: SpecialtyAreasSchema,
});

export const UpdateUserProfileSchema = z.object({
  displayName: DisplayNameSchema.optional(),
  bio: BioSchema,
  profileImageUrl: z.string().url().max(512).optional().nullable(),
  headerImageUrl: z.string().url().max(512).optional().nullable(),
  location: LocationSchema,
  website: WebsiteSchema,
  specialtyAreas: SpecialtyAreasSchema,
});

// ============================================================================
// BUSINESS LOGIC
// ============================================================================

export class UserProfileModel {
  /**
   * Generate default specialty areas based on persona type
   */
  static getDefaultSpecialtyAreas(personaType: PersonaType): string[] {
    const defaults: Record<PersonaType, string[]> = {
      [PersonaType.POLITICIAN]: ["Politics", "Policy", "Government"],
      [PersonaType.INFLUENCER]: ["Social Media", "Content Creation", "Lifestyle"],
      [PersonaType.JOURNALIST]: ["News", "Reporting", "Media"],
      [PersonaType.ACTIVIST]: ["Social Justice", "Advocacy", "Community"],
      [PersonaType.BUSINESS]: ["Business", "Entrepreneurship", "Leadership"],
      [PersonaType.ENTERTAINER]: ["Entertainment", "Performance", "Arts"],
    };

    return defaults[personaType] || [];
  }

  /**
   * Validate specialty areas for relevance and appropriateness
   */
  static validateSpecialtyAreas(areas: string[], personaType: PersonaType): {
    isValid: boolean;
    filteredAreas: string[];
    warnings: string[];
  } {
    const warnings: string[] = [];
    const filteredAreas: string[] = [];

    // Common inappropriate terms to filter
    const inappropriateTerms = [
      'hate', 'violence', 'extremism', 'terrorism', 'illegal',
      'drugs', 'weapons', 'pornography', 'gambling'
    ];

    // Persona-specific relevant terms
    const relevantTerms: Record<PersonaType, string[]> = {
      [PersonaType.POLITICIAN]: [
        'politics', 'policy', 'government', 'elections', 'democracy',
        'legislation', 'public service', 'civic engagement', 'leadership'
      ],
      [PersonaType.INFLUENCER]: [
        'social media', 'content', 'lifestyle', 'fashion', 'travel',
        'fitness', 'beauty', 'food', 'photography', 'branding'
      ],
      [PersonaType.JOURNALIST]: [
        'journalism', 'news', 'reporting', 'media', 'investigation',
        'writing', 'communication', 'current events', 'research'
      ],
      [PersonaType.ACTIVIST]: [
        'activism', 'social justice', 'advocacy', 'community', 'rights',
        'environment', 'equality', 'humanitarian', 'nonprofit'
      ],
      [PersonaType.BUSINESS]: [
        'business', 'entrepreneurship', 'leadership', 'management', 'strategy',
        'finance', 'marketing', 'innovation', 'technology', 'consulting'
      ],
      [PersonaType.ENTERTAINER]: [
        'entertainment', 'performance', 'arts', 'music', 'acting',
        'comedy', 'theater', 'film', 'television', 'creativity'
      ],
    };

    for (const area of areas) {
      const cleanArea = area.toLowerCase().trim();

      // Check for inappropriate content
      if (inappropriateTerms.some(term => cleanArea.includes(term))) {
        warnings.push(`"${area}" contains inappropriate content`);
        continue;
      }

      // Check relevance to persona type
      const relevant = relevantTerms[personaType];
      const isRelevant = relevant.some(term =>
        cleanArea.includes(term) || term.includes(cleanArea)
      );

      if (!isRelevant && cleanArea.length > 0) {
        warnings.push(`"${area}" may not be relevant to ${personaType.toLowerCase()} persona`);
      }

      // Add to filtered list (with proper capitalization)
      filteredAreas.push(this.capitalizeSpecialtyArea(area));
    }

    return {
      isValid: warnings.length === 0,
      filteredAreas: filteredAreas.slice(0, 5), // Max 5 areas
      warnings,
    };
  }

  /**
   * Properly capitalize specialty area names
   */
  private static capitalizeSpecialtyArea(area: string): string {
    return area
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Calculate engagement rate from metrics
   */
  static calculateEngagementRate(profile: UserProfile, totalLikes: number, totalComments: number, totalShares: number): number {
    if (profile.followerCount === 0) return 0;

    const totalEngagement = totalLikes + totalComments + totalShares;
    const engagementRate = (totalEngagement / profile.followerCount) * 100;

    return Math.round(engagementRate * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generate profile completeness score
   */
  static calculateProfileCompleteness(profile: UserProfile): {
    score: number;
    missingFields: string[];
    suggestions: string[];
  } {
    const fields = [
      { key: 'displayName', weight: 20, value: profile.displayName },
      { key: 'bio', weight: 15, value: profile.bio },
      { key: 'profileImageUrl', weight: 15, value: profile.profileImageUrl },
      { key: 'location', weight: 10, value: profile.location },
      { key: 'website', weight: 10, value: profile.website },
      { key: 'specialtyAreas', weight: 15, value: profile.specialtyAreas?.length > 0 ? 'yes' : null },
      { key: 'headerImageUrl', weight: 15, value: profile.headerImageUrl },
    ];

    let totalScore = 0;
    const missingFields: string[] = [];
    const suggestions: string[] = [];

    for (const field of fields) {
      if (field.value) {
        totalScore += field.weight;
      } else {
        missingFields.push(field.key);
      }
    }

    // Generate suggestions based on missing fields
    if (!profile.bio) {
      suggestions.push("Add a bio to tell others about yourself");
    }
    if (!profile.profileImageUrl) {
      suggestions.push("Upload a profile picture to make your account more recognizable");
    }
    if (!profile.specialtyAreas || profile.specialtyAreas.length === 0) {
      suggestions.push("Add specialty areas to help others find you");
    }
    if (!profile.location) {
      suggestions.push("Add your location to connect with local users");
    }
    if (!profile.website) {
      suggestions.push("Add a website to showcase your work");
    }

    return {
      score: totalScore,
      missingFields,
      suggestions,
    };
  }

  /**
   * Check if profile is eligible for verification
   */
  static checkVerificationEligibility(profile: UserProfile): {
    eligible: boolean;
    requirements: string[];
    missing: string[];
  } {
    const requirements = [
      "Complete profile (90%+ completeness)",
      "Minimum 100 followers",
      "Minimum 50 posts",
      "Active for at least 30 days",
      "Valid specialty areas for persona type",
    ];

    const missing: string[] = [];

    // Check profile completeness
    const { score } = this.calculateProfileCompleteness(profile);
    if (score < 90) {
      missing.push("Profile completeness below 90%");
    }

    // Check follower count
    if (profile.followerCount < 100) {
      missing.push("Need at least 100 followers");
    }

    // Check post count
    if (profile.postCount < 50) {
      missing.push("Need at least 50 posts");
    }

    // Check account age (30 days)
    const accountAge = Date.now() - profile.createdAt.getTime();
    const minAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    if (accountAge < minAge) {
      missing.push("Account must be at least 30 days old");
    }

    // Check specialty areas
    if (!profile.specialtyAreas || profile.specialtyAreas.length === 0) {
      missing.push("Need to add relevant specialty areas");
    }

    return {
      eligible: missing.length === 0,
      requirements,
      missing,
    };
  }

  /**
   * Sanitize profile data for public display
   */
  static sanitizeForPublic(profile: UserProfile, includePrivateFields = false): Partial<UserProfile> {
    const publicData: Partial<UserProfile> = {
      id: profile.id,
      displayName: profile.displayName,
      bio: profile.bio,
      profileImageUrl: profile.profileImageUrl,
      headerImageUrl: profile.headerImageUrl,
      location: profile.location,
      website: profile.website,
      personaType: profile.personaType,
      specialtyAreas: profile.specialtyAreas,
      verificationBadge: profile.verificationBadge,
      followerCount: profile.followerCount,
      followingCount: profile.followingCount,
      postCount: profile.postCount,
      createdAt: profile.createdAt,
    };

    if (includePrivateFields) {
      publicData.userId = profile.userId;
      publicData.updatedAt = profile.updatedAt;
    }

    return publicData;
  }

  /**
   * Generate profile analytics summary
   */
  static generateAnalyticsSummary(profile: UserProfile): {
    profileHealth: 'excellent' | 'good' | 'needs_improvement';
    growthPotential: 'high' | 'medium' | 'low';
    recommendedActions: string[];
  } {
    const { score } = this.calculateProfileCompleteness(profile);
    const followerToFollowingRatio = profile.followingCount > 0
      ? profile.followerCount / profile.followingCount
      : profile.followerCount;

    // Determine profile health
    let profileHealth: 'excellent' | 'good' | 'needs_improvement';
    if (score >= 90 && profile.followerCount > 50) {
      profileHealth = 'excellent';
    } else if (score >= 70 && profile.followerCount > 10) {
      profileHealth = 'good';
    } else {
      profileHealth = 'needs_improvement';
    }

    // Determine growth potential
    let growthPotential: 'high' | 'medium' | 'low';
    if (followerToFollowingRatio > 2 && profile.postCount > 20) {
      growthPotential = 'high';
    } else if (followerToFollowingRatio > 0.5 && profile.postCount > 5) {
      growthPotential = 'medium';
    } else {
      growthPotential = 'low';
    }

    // Generate recommended actions
    const recommendedActions: string[] = [];

    if (score < 80) {
      recommendedActions.push("Complete your profile");
    }
    if (profile.postCount < 10) {
      recommendedActions.push("Create more content");
    }
    if (profile.followerCount < profile.followingCount * 0.5) {
      recommendedActions.push("Engage more with your existing followers");
    }
    if (!profile.verificationBadge && profile.followerCount > 100) {
      recommendedActions.push("Apply for verification");
    }

    return {
      profileHealth,
      growthPotential,
      recommendedActions,
    };
  }
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class UserProfileError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'UserProfileError';
  }
}

export class ProfileNotFoundError extends UserProfileError {
  constructor(userId: string) {
    super(`Profile not found for user ${userId}`, 'PROFILE_NOT_FOUND', 404);
  }
}

export class InvalidProfileDataError extends UserProfileError {
  constructor(message: string) {
    super(message, 'INVALID_PROFILE_DATA', 400);
  }
}

export class ProfileUpdateNotAllowedError extends UserProfileError {
  constructor(reason: string) {
    super(`Profile update not allowed: ${reason}`, 'PROFILE_UPDATE_NOT_ALLOWED', 403);
  }
}

// Re-export PersonaType for convenience
export { PersonaType };