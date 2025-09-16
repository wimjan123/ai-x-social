/**
 * PoliticalAlignment Model
 *
 * User's political stance and ideological positions that influence AI persona interactions.
 * Handles political spectrum positioning, issue preferences, and debate settings.
 */

import type { PoliticalAlignment as PrismaPoliticalAlignment } from '../generated/prisma';
import { z } from 'zod';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PoliticalAlignment {
  id: string;
  userId: string;

  // Political spectrum positioning (0-100 scale)
  economicPosition: number;
  socialPosition: number;

  // Specific stances
  primaryIssues: string[];
  partyAffiliation: string | null;
  ideologyTags: string[];

  // Engagement preferences
  debateWillingness: number;
  controversyTolerance: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePoliticalAlignmentInput {
  userId: string;
  economicPosition?: number;
  socialPosition?: number;
  primaryIssues?: string[];
  partyAffiliation?: string;
  ideologyTags?: string[];
  debateWillingness?: number;
  controversyTolerance?: number;
}

export interface UpdatePoliticalAlignmentInput {
  economicPosition?: number;
  socialPosition?: number;
  primaryIssues?: string[];
  partyAffiliation?: string;
  ideologyTags?: string[];
  debateWillingness?: number;
  controversyTolerance?: number;
}

export interface PoliticalCompass {
  economic: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  social: 'liberal' | 'moderate-liberal' | 'moderate' | 'moderate-conservative' | 'conservative';
  quadrant: 'auth-left' | 'auth-right' | 'lib-left' | 'lib-right';
}

export interface AlignmentCompatibility {
  score: number; // 0-100
  level: 'very-compatible' | 'compatible' | 'neutral' | 'incompatible' | 'very-incompatible';
  sharedIssues: string[];
  conflictingIssues: string[];
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const PositionSchema = z.number()
  .min(0, "Position must be between 0 and 100")
  .max(100, "Position must be between 0 and 100");

export const PrimaryIssuesSchema = z.array(
  z.string()
    .min(2, "Issue must be at least 2 characters")
    .max(50, "Issue must be at most 50 characters")
)
  .max(5, "Maximum 5 primary issues allowed");

export const IdeologyTagsSchema = z.array(
  z.string()
    .min(2, "Ideology tag must be at least 2 characters")
    .max(30, "Ideology tag must be at most 30 characters")
)
  .max(10, "Maximum 10 ideology tags allowed");

export const PartyAffiliationSchema = z.string()
  .max(100, "Party affiliation must be at most 100 characters")
  .optional()
  .nullable();

export const CreatePoliticalAlignmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  economicPosition: PositionSchema.default(50),
  socialPosition: PositionSchema.default(50),
  primaryIssues: PrimaryIssuesSchema.default([]),
  partyAffiliation: PartyAffiliationSchema,
  ideologyTags: IdeologyTagsSchema.default([]),
  debateWillingness: PositionSchema.default(50),
  controversyTolerance: PositionSchema.default(50),
});

export const UpdatePoliticalAlignmentSchema = z.object({
  economicPosition: PositionSchema.optional(),
  socialPosition: PositionSchema.optional(),
  primaryIssues: PrimaryIssuesSchema.optional(),
  partyAffiliation: PartyAffiliationSchema,
  ideologyTags: IdeologyTagsSchema.optional(),
  debateWillingness: PositionSchema.optional(),
  controversyTolerance: PositionSchema.optional(),
});

// ============================================================================
// BUSINESS LOGIC
// ============================================================================

export class PoliticalAlignmentModel {
  /**
   * Calculate political compass position
   */
  static calculatePoliticalCompass(alignment: PoliticalAlignment): PoliticalCompass {
    // Economic position mapping
    let economic: PoliticalCompass['economic'];
    if (alignment.economicPosition <= 20) economic = 'left';
    else if (alignment.economicPosition <= 40) economic = 'center-left';
    else if (alignment.economicPosition <= 60) economic = 'center';
    else if (alignment.economicPosition <= 80) economic = 'center-right';
    else economic = 'right';

    // Social position mapping (inverted: 0=liberal, 100=conservative)
    let social: PoliticalCompass['social'];
    if (alignment.socialPosition <= 20) social = 'liberal';
    else if (alignment.socialPosition <= 40) social = 'moderate-liberal';
    else if (alignment.socialPosition <= 60) social = 'moderate';
    else if (alignment.socialPosition <= 80) social = 'moderate-conservative';
    else social = 'conservative';

    // Quadrant determination (simplified)
    let quadrant: PoliticalCompass['quadrant'];
    const isEconomicallyLeft = alignment.economicPosition < 50;
    const isSociallyLiberal = alignment.socialPosition < 50;

    if (isEconomicallyLeft && isSociallyLiberal) quadrant = 'lib-left';
    else if (!isEconomicallyLeft && isSociallyLiberal) quadrant = 'lib-right';
    else if (isEconomicallyLeft && !isSociallyLiberal) quadrant = 'auth-left';
    else quadrant = 'auth-right';

    return { economic, social, quadrant };
  }

  /**
   * Calculate compatibility between two political alignments
   */
  static calculateCompatibility(
    alignment1: PoliticalAlignment,
    alignment2: PoliticalAlignment
  ): AlignmentCompatibility {
    // Calculate position distance (0-100 scale)
    const economicDistance = Math.abs(alignment1.economicPosition - alignment2.economicPosition);
    const socialDistance = Math.abs(alignment1.socialPosition - alignment2.socialPosition);
    const avgDistance = (economicDistance + socialDistance) / 2;

    // Calculate issue overlap
    const issues1 = new Set(alignment1.primaryIssues.map(i => i.toLowerCase()));
    const issues2 = new Set(alignment2.primaryIssues.map(i => i.toLowerCase()));

    const sharedIssues = Array.from(issues1).filter(issue => issues2.has(issue));
    const conflictingIssues = Array.from(issues1).filter(issue => !issues2.has(issue));

    // Calculate final compatibility score
    const distanceScore = Math.max(0, 100 - avgDistance); // Closer positions = higher score
    const issueScore = (sharedIssues.length / Math.max(issues1.size, issues2.size, 1)) * 100;
    const finalScore = Math.round((distanceScore * 0.7 + issueScore * 0.3));

    // Determine compatibility level
    let level: AlignmentCompatibility['level'];
    if (finalScore >= 80) level = 'very-compatible';
    else if (finalScore >= 60) level = 'compatible';
    else if (finalScore >= 40) level = 'neutral';
    else if (finalScore >= 20) level = 'incompatible';
    else level = 'very-incompatible';

    return {
      score: finalScore,
      level,
      sharedIssues,
      conflictingIssues,
    };
  }

  /**
   * Validate and normalize primary issues
   */
  static validatePrimaryIssues(issues: string[]): {
    isValid: boolean;
    normalizedIssues: string[];
    warnings: string[];
  } {
    const warnings: string[] = [];
    const normalizedIssues: string[] = [];

    // Common political issues for validation
    const validIssues = [
      'healthcare', 'education', 'economy', 'environment', 'immigration',
      'defense', 'taxation', 'social security', 'civil rights', 'gun rights',
      'abortion', 'lgbtq rights', 'climate change', 'infrastructure',
      'foreign policy', 'trade', 'technology', 'privacy', 'criminal justice',
      'housing', 'poverty', 'unemployment', 'veterans affairs', 'agriculture'
    ];

    // Inappropriate terms to filter
    const inappropriateTerms = [
      'hate', 'violence', 'extremism', 'terrorism', 'discrimination',
      'supremacy', 'genocide', 'assassination'
    ];

    for (const issue of issues) {
      const normalized = issue.toLowerCase().trim();

      // Check for inappropriate content
      if (inappropriateTerms.some(term => normalized.includes(term))) {
        warnings.push(`"${issue}" contains inappropriate content`);
        continue;
      }

      // Check if it's a recognized political issue
      const isRecognized = validIssues.some(validIssue =>
        normalized.includes(validIssue) || validIssue.includes(normalized)
      );

      if (!isRecognized && normalized.length > 0) {
        warnings.push(`"${issue}" may not be a recognized political issue`);
      }

      // Normalize capitalization
      normalizedIssues.push(this.capitalizeIssue(issue));
    }

    return {
      isValid: warnings.length === 0,
      normalizedIssues: normalizedIssues.slice(0, 5), // Max 5 issues
      warnings,
    };
  }

  /**
   * Validate and normalize ideology tags
   */
  static validateIdeologyTags(tags: string[]): {
    isValid: boolean;
    normalizedTags: string[];
    warnings: string[];
  } {
    const warnings: string[] = [];
    const normalizedTags: string[] = [];

    // Common ideology tags
    const validTags = [
      'liberal', 'conservative', 'progressive', 'libertarian', 'socialist',
      'centrist', 'moderate', 'populist', 'nationalist', 'globalist',
      'environmentalist', 'feminist', 'traditionalist', 'reformist',
      'capitalist', 'democratic', 'republican', 'independent'
    ];

    // Extreme or hate-related tags to filter
    const extremeTags = [
      'supremacist', 'extremist', 'radical', 'fascist', 'nazi',
      'terrorist', 'fundamentalist', 'separatist'
    ];

    for (const tag of tags) {
      const normalized = tag.toLowerCase().trim();

      // Filter extreme tags
      if (extremeTags.some(extreme => normalized.includes(extreme))) {
        warnings.push(`"${tag}" is not an appropriate ideology tag`);
        continue;
      }

      // Check if it's a recognized ideology
      const isRecognized = validTags.some(validTag =>
        normalized.includes(validTag) || validTag.includes(normalized)
      );

      if (!isRecognized && normalized.length > 0) {
        warnings.push(`"${tag}" may not be a recognized political ideology`);
      }

      // Normalize capitalization
      normalizedTags.push(this.capitalizeTag(tag));
    }

    return {
      isValid: warnings.length === 0,
      normalizedTags: normalizedTags.slice(0, 10), // Max 10 tags
      warnings,
    };
  }

  /**
   * Generate AI persona matching recommendations
   */
  static generatePersonaRecommendations(alignment: PoliticalAlignment): {
    compatiblePersonas: string[];
    avoidPersonas: string[];
    interactionStyle: 'aggressive' | 'moderate' | 'passive';
  } {
    const compass = this.calculatePoliticalCompass(alignment);
    const compatiblePersonas: string[] = [];
    const avoidPersonas: string[] = [];

    // Generate recommendations based on political compass
    switch (compass.quadrant) {
      case 'lib-left':
        compatiblePersonas.push('progressive-politician', 'environmental-activist', 'social-justice-advocate');
        avoidPersonas.push('conservative-pundit', 'business-libertarian');
        break;
      case 'lib-right':
        compatiblePersonas.push('libertarian-commentator', 'tech-entrepreneur', 'free-market-advocate');
        avoidPersonas.push('progressive-politician', 'big-government-supporter');
        break;
      case 'auth-left':
        compatiblePersonas.push('union-leader', 'democratic-socialist', 'government-advocate');
        avoidPersonas.push('libertarian-commentator', 'corporate-executive');
        break;
      case 'auth-right':
        compatiblePersonas.push('traditional-conservative', 'law-and-order-advocate', 'nationalist-politician');
        avoidPersonas.push('progressive-activist', 'anarchist-commentator');
        break;
    }

    // Determine interaction style based on debate willingness and controversy tolerance
    let interactionStyle: 'aggressive' | 'moderate' | 'passive';
    const avgEngagement = (alignment.debateWillingness + alignment.controversyTolerance) / 2;

    if (avgEngagement >= 70) interactionStyle = 'aggressive';
    else if (avgEngagement >= 40) interactionStyle = 'moderate';
    else interactionStyle = 'passive';

    return {
      compatiblePersonas,
      avoidPersonas,
      interactionStyle,
    };
  }

  /**
   * Calculate political alignment completeness
   */
  static calculateCompleteness(alignment: PoliticalAlignment): {
    score: number;
    missingFields: string[];
    recommendations: string[];
  } {
    let score = 0;
    const missingFields: string[] = [];
    const recommendations: string[] = [];

    // Check positions (default 50 means not set)
    if (alignment.economicPosition !== 50) score += 20;
    else missingFields.push('economicPosition');

    if (alignment.socialPosition !== 50) score += 20;
    else missingFields.push('socialPosition');

    // Check issues
    if (alignment.primaryIssues.length > 0) score += 25;
    else missingFields.push('primaryIssues');

    // Check ideology tags
    if (alignment.ideologyTags.length > 0) score += 20;
    else missingFields.push('ideologyTags');

    // Check party affiliation (optional but adds value)
    if (alignment.partyAffiliation) score += 10;

    // Check engagement preferences (default 50 means not set)
    if (alignment.debateWillingness !== 50) score += 2.5;
    if (alignment.controversyTolerance !== 50) score += 2.5;

    // Generate recommendations
    if (missingFields.includes('economicPosition')) {
      recommendations.push("Set your economic position on the political spectrum");
    }
    if (missingFields.includes('socialPosition')) {
      recommendations.push("Set your social position on the political spectrum");
    }
    if (missingFields.includes('primaryIssues')) {
      recommendations.push("Add your top political issues of interest");
    }
    if (missingFields.includes('ideologyTags')) {
      recommendations.push("Add ideology tags that describe your political views");
    }

    return {
      score: Math.round(score),
      missingFields,
      recommendations,
    };
  }

  /**
   * Helper method to capitalize issue names
   */
  private static capitalizeIssue(issue: string): string {
    return issue
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Helper method to capitalize ideology tags
   */
  private static capitalizeTag(tag: string): string {
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  }

  /**
   * Generate alignment summary for display
   */
  static generateSummary(alignment: PoliticalAlignment): {
    compassPosition: PoliticalCompass;
    primaryFocus: string;
    engagementLevel: 'high' | 'medium' | 'low';
    description: string;
  } {
    const compass = this.calculatePoliticalCompass(alignment);
    const primaryFocus = alignment.primaryIssues[0] || 'General Politics';
    const avgEngagement = (alignment.debateWillingness + alignment.controversyTolerance) / 2;

    let engagementLevel: 'high' | 'medium' | 'low';
    if (avgEngagement >= 70) engagementLevel = 'high';
    else if (avgEngagement >= 40) engagementLevel = 'medium';
    else engagementLevel = 'low';

    // Generate description
    const descriptions = {
      'lib-left': 'Progressive values with emphasis on social and economic equality',
      'lib-right': 'Individual freedom with free-market economics',
      'auth-left': 'Strong government role in ensuring economic equality',
      'auth-right': 'Traditional values with strong institutions and order',
    };

    return {
      compassPosition: compass,
      primaryFocus,
      engagementLevel,
      description: descriptions[compass.quadrant],
    };
  }
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class PoliticalAlignmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'PoliticalAlignmentError';
  }
}

export class AlignmentNotFoundError extends PoliticalAlignmentError {
  constructor(userId: string) {
    super(`Political alignment not found for user ${userId}`, 'ALIGNMENT_NOT_FOUND', 404);
  }
}

export class InvalidAlignmentDataError extends PoliticalAlignmentError {
  constructor(message: string) {
    super(message, 'INVALID_ALIGNMENT_DATA', 400);
  }
}

export class ExtremeContentError extends PoliticalAlignmentError {
  constructor(content: string) {
    super(`Content not allowed: ${content}`, 'EXTREME_CONTENT', 400);
  }
}