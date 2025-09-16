/**
 * InfluenceMetrics Model
 *
 * User progression data including follower count, engagement rate, approval rating, controversy level.
 * Handles influence calculations, growth tracking, and ranking systems.
 */

import type { InfluenceMetrics as PrismaInfluenceMetrics } from '../generated/prisma';
import { z } from 'zod';

// ============================================================================
// INTERFACES
// ============================================================================

export interface InfluenceMetrics {
  id: string;
  userId: string;

  // Core metrics
  followerCount: number;
  followingCount: number;
  engagementRate: number;
  reachScore: number;

  // Politician/Influencer specific metrics
  approvalRating: number;
  controversyLevel: number;
  trendingScore: number;

  // Growth tracking
  followerGrowthDaily: number;
  followerGrowthWeekly: number;
  followerGrowthMonthly: number;

  // Engagement breakdown
  totalLikes: number;
  totalReshares: number;
  totalComments: number;

  // Calculated fields
  influenceRank: number;
  categoryRank: number;

  lastUpdated: Date;
  createdAt: Date;
}

export interface UpdateInfluenceMetricsInput {
  followerCount?: number;
  followingCount?: number;
  totalLikes?: number;
  totalReshares?: number;
  totalComments?: number;
  impressionCount?: number;
}

export interface MetricsSnapshot {
  timestamp: Date;
  followers: number;
  engagement: number;
  approval: number;
  controversy: number;
  trending: number;
}

export interface InfluenceAnalytics {
  currentPeriod: MetricsSnapshot;
  previousPeriod: MetricsSnapshot;
  growthPercentage: number;
  trend: 'rising' | 'stable' | 'declining';
  insights: string[];
}

export interface RankingContext {
  globalRank: number;
  categoryRank: number;
  totalUsers: number;
  categoryUsers: number;
  percentile: number;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const NonNegativeNumberSchema = z.number()
  .min(0, "Value must be non-negative");

export const PercentageSchema = z.number()
  .min(0, "Percentage must be between 0 and 100")
  .max(100, "Percentage must be between 0 and 100");

export const UpdateInfluenceMetricsSchema = z.object({
  followerCount: NonNegativeNumberSchema.optional(),
  followingCount: NonNegativeNumberSchema.optional(),
  totalLikes: NonNegativeNumberSchema.optional(),
  totalReshares: NonNegativeNumberSchema.optional(),
  totalComments: NonNegativeNumberSchema.optional(),
  impressionCount: NonNegativeNumberSchema.optional(),
});

// ============================================================================
// BUSINESS LOGIC
// ============================================================================

export class InfluenceMetricsModel {
  /**
   * Calculate engagement rate from metrics
   * Formula: (likes + comments + reshares) / impressions * 100
   */
  static calculateEngagementRate(
    totalLikes: number,
    totalComments: number,
    totalReshares: number,
    impressionCount: number
  ): number {
    if (impressionCount === 0) return 0;

    const totalEngagement = totalLikes + totalComments + totalReshares;
    const engagementRate = (totalEngagement / impressionCount) * 100;

    return Math.round(engagementRate * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate reach score based on follower network and engagement
   */
  static calculateReachScore(
    followerCount: number,
    engagementRate: number,
    networkMultiplier: number = 1.5
  ): number {
    // Base reach is follower count
    let reach = followerCount;

    // Apply engagement multiplier (higher engagement = wider reach)
    const engagementMultiplier = 1 + (engagementRate / 100);
    reach *= engagementMultiplier;

    // Apply network effect (followers' followers)
    reach *= networkMultiplier;

    return Math.round(reach);
  }

  /**
   * Calculate approval rating based on positive vs negative reactions
   */
  static calculateApprovalRating(
    positiveLikes: number,
    totalEngagement: number,
    controversyLevel: number
  ): number {
    if (totalEngagement === 0) return 50; // Neutral if no engagement

    // Base approval from positive engagement ratio
    const positiveRatio = positiveLikes / totalEngagement;
    let approval = positiveRatio * 100;

    // Adjust for controversy (high controversy lowers approval)
    const controversyPenalty = controversyLevel * 0.3;
    approval = Math.max(0, approval - controversyPenalty);

    return Math.round(approval);
  }

  /**
   * Calculate controversy level based on engagement patterns
   */
  static calculateControversyLevel(
    reportCount: number,
    negativeFeedback: number,
    polarizedEngagement: number,
    totalEngagement: number
  ): number {
    if (totalEngagement === 0) return 0;

    let controversy = 0;

    // Report ratio contributes to controversy
    const reportRatio = reportCount / totalEngagement;
    controversy += reportRatio * 50;

    // Negative feedback ratio
    const negativeRatio = negativeFeedback / totalEngagement;
    controversy += negativeRatio * 30;

    // Polarized engagement (very high engagement with mixed reactions)
    const polarizedRatio = polarizedEngagement / totalEngagement;
    controversy += polarizedRatio * 20;

    return Math.min(100, Math.round(controversy));
  }

  /**
   * Calculate trending score based on recent activity and growth
   */
  static calculateTrendingScore(
    recentEngagement: number,
    followerGrowthDaily: number,
    timeDecay: number = 0.95
  ): number {
    // Base trending from recent engagement spike
    let trending = Math.min(100, recentEngagement / 10);

    // Add follower growth component
    const growthComponent = Math.min(30, followerGrowthDaily / 5);
    trending += growthComponent;

    // Apply time decay (trending should decrease over time)
    trending *= timeDecay;

    return Math.round(Math.max(0, trending));
  }

  /**
   * Calculate growth percentages
   */
  static calculateGrowthMetrics(
    current: InfluenceMetrics,
    previous: InfluenceMetrics
  ): {
    followerGrowthPercentage: number;
    engagementGrowthPercentage: number;
    approvalChange: number;
    controversyChange: number;
  } {
    const followerGrowthPercentage = previous.followerCount > 0
      ? ((current.followerCount - previous.followerCount) / previous.followerCount) * 100
      : 0;

    const engagementGrowthPercentage = previous.engagementRate > 0
      ? ((current.engagementRate - previous.engagementRate) / previous.engagementRate) * 100
      : 0;

    const approvalChange = current.approvalRating - previous.approvalRating;
    const controversyChange = current.controversyLevel - previous.controversyLevel;

    return {
      followerGrowthPercentage: Math.round(followerGrowthPercentage * 100) / 100,
      engagementGrowthPercentage: Math.round(engagementGrowthPercentage * 100) / 100,
      approvalChange: Math.round(approvalChange * 100) / 100,
      controversyChange: Math.round(controversyChange * 100) / 100,
    };
  }

  /**
   * Determine influence tier based on metrics
   */
  static determineInfluenceTier(metrics: InfluenceMetrics): {
    tier: 'nano' | 'micro' | 'mid' | 'macro' | 'mega';
    description: string;
    nextTierRequirements: string[];
  } {
    const { followerCount, engagementRate, reachScore } = metrics;

    let tier: 'nano' | 'micro' | 'mid' | 'macro' | 'mega';
    let description: string;
    let nextTierRequirements: string[] = [];

    if (followerCount < 1000) {
      tier = 'nano';
      description = 'Building initial audience';
      nextTierRequirements = [
        'Reach 1,000 followers',
        'Maintain 3%+ engagement rate',
        'Post consistently for 30 days'
      ];
    } else if (followerCount < 10000) {
      tier = 'micro';
      description = 'Niche community leader';
      nextTierRequirements = [
        'Reach 10,000 followers',
        'Maintain 5%+ engagement rate',
        'Achieve 60+ approval rating'
      ];
    } else if (followerCount < 100000) {
      tier = 'mid';
      description = 'Regional influence';
      nextTierRequirements = [
        'Reach 100,000 followers',
        'Maintain 7%+ engagement rate',
        'Achieve top 10% in category ranking'
      ];
    } else if (followerCount < 1000000) {
      tier = 'macro';
      description = 'National voice';
      nextTierRequirements = [
        'Reach 1,000,000 followers',
        'Maintain 10%+ engagement rate',
        'Achieve top 1% in global ranking'
      ];
    } else {
      tier = 'mega';
      description = 'Global influencer';
      nextTierRequirements = [
        'Maintain current status',
        'Lead industry conversations',
        'Mentor emerging voices'
      ];
    }

    return { tier, description, nextTierRequirements };
  }

  /**
   * Generate influence insights and recommendations
   */
  static generateInsights(
    current: InfluenceMetrics,
    previous?: InfluenceMetrics
  ): {
    insights: string[];
    recommendations: string[];
    warnings: string[];
  } {
    const insights: string[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Follower analysis
    if (current.followerCount > current.followingCount * 2) {
      insights.push("Strong follower-to-following ratio indicates authentic influence");
    } else if (current.followingCount > current.followerCount * 2) {
      warnings.push("Following too many accounts may appear spammy");
      recommendations.push("Focus on quality content to attract more followers");
    }

    // Engagement analysis
    if (current.engagementRate > 5) {
      insights.push("Excellent engagement rate shows strong audience connection");
    } else if (current.engagementRate < 2) {
      warnings.push("Low engagement rate may indicate audience disconnect");
      recommendations.push("Try posting at optimal times and engaging with followers");
    }

    // Approval rating analysis
    if (current.approvalRating > 70) {
      insights.push("High approval rating indicates positive public perception");
    } else if (current.approvalRating < 40) {
      warnings.push("Low approval rating suggests controversial content");
      recommendations.push("Consider more balanced or positive messaging");
    }

    // Controversy analysis
    if (current.controversyLevel > 70) {
      warnings.push("High controversy level may limit reach and partnerships");
      recommendations.push("Focus on constructive dialogue and avoid inflammatory content");
    } else if (current.controversyLevel < 20 && current.followerCount > 1000) {
      insights.push("Low controversy with good reach shows balanced approach");
    }

    // Growth analysis (if previous data available)
    if (previous) {
      const growth = this.calculateGrowthMetrics(current, previous);

      if (growth.followerGrowthPercentage > 10) {
        insights.push("Strong follower growth indicates increasing influence");
      } else if (growth.followerGrowthPercentage < -5) {
        warnings.push("Declining follower count needs attention");
        recommendations.push("Analyze recent content for potential issues");
      }

      if (growth.approvalChange > 10) {
        insights.push("Improving approval rating shows positive trend");
      } else if (growth.approvalChange < -10) {
        warnings.push("Declining approval requires strategy adjustment");
      }
    }

    return { insights, recommendations, warnings };
  }

  /**
   * Calculate influence score (composite metric)
   */
  static calculateInfluenceScore(metrics: InfluenceMetrics): {
    score: number;
    breakdown: {
      reach: number;
      engagement: number;
      approval: number;
      consistency: number;
    };
  } {
    // Normalize follower count (log scale to prevent extreme skew)
    const reachScore = Math.min(100, Math.log10(Math.max(1, metrics.followerCount)) * 20);

    // Engagement score (capped at reasonable rate)
    const engagementScore = Math.min(100, metrics.engagementRate * 10);

    // Approval score (direct mapping)
    const approvalScore = metrics.approvalRating;

    // Consistency score (based on growth stability)
    const growthVariance = Math.abs(metrics.followerGrowthDaily - metrics.followerGrowthWeekly / 7);
    const consistencyScore = Math.max(0, 100 - growthVariance);

    // Weighted composite score
    const weights = { reach: 0.3, engagement: 0.3, approval: 0.25, consistency: 0.15 };
    const score = Math.round(
      reachScore * weights.reach +
      engagementScore * weights.engagement +
      approvalScore * weights.approval +
      consistencyScore * weights.consistency
    );

    return {
      score,
      breakdown: {
        reach: Math.round(reachScore),
        engagement: Math.round(engagementScore),
        approval: Math.round(approvalScore),
        consistency: Math.round(consistencyScore),
      },
    };
  }

  /**
   * Validate metrics for business rules
   */
  static validateMetrics(metrics: InfluenceMetrics): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (metrics.followerCount < 0) errors.push("Follower count cannot be negative");
    if (metrics.followingCount < 0) errors.push("Following count cannot be negative");
    if (metrics.engagementRate < 0 || metrics.engagementRate > 100) {
      errors.push("Engagement rate must be between 0 and 100");
    }

    // Business rule validation
    if (metrics.followerCount > 0 && metrics.engagementRate > 50) {
      warnings.push("Unusually high engagement rate for follower count");
    }

    if (metrics.followerGrowthDaily > metrics.followerCount * 0.1) {
      warnings.push("Daily growth exceeds 10% of total followers - may indicate artificial inflation");
    }

    if (metrics.approvalRating < 10 && metrics.followerCount > 1000) {
      warnings.push("Very low approval rating with significant following may indicate issues");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate metrics summary for dashboards
   */
  static generateSummary(metrics: InfluenceMetrics): {
    tier: ReturnType<typeof InfluenceMetricsModel.determineInfluenceTier>;
    score: ReturnType<typeof InfluenceMetricsModel.calculateInfluenceScore>;
    status: 'excellent' | 'good' | 'average' | 'needs_improvement';
    keyMetric: 'followers' | 'engagement' | 'approval' | 'reach';
  } {
    const tier = this.determineInfluenceTier(metrics);
    const score = this.calculateInfluenceScore(metrics);

    // Determine overall status
    let status: 'excellent' | 'good' | 'average' | 'needs_improvement';
    if (score.score >= 80) status = 'excellent';
    else if (score.score >= 60) status = 'good';
    else if (score.score >= 40) status = 'average';
    else status = 'needs_improvement';

    // Identify key metric to focus on
    const breakdown = score.breakdown;
    const lowestScore = Math.min(breakdown.reach, breakdown.engagement, breakdown.approval, breakdown.consistency);
    let keyMetric: 'followers' | 'engagement' | 'approval' | 'reach';

    if (breakdown.reach === lowestScore) keyMetric = 'followers';
    else if (breakdown.engagement === lowestScore) keyMetric = 'engagement';
    else if (breakdown.approval === lowestScore) keyMetric = 'approval';
    else keyMetric = 'reach';

    return { tier, score, status, keyMetric };
  }
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class InfluenceMetricsError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'InfluenceMetricsError';
  }
}

export class MetricsNotFoundError extends InfluenceMetricsError {
  constructor(userId: string) {
    super(`Influence metrics not found for user ${userId}`, 'METRICS_NOT_FOUND', 404);
  }
}

export class InvalidMetricsDataError extends InfluenceMetricsError {
  constructor(message: string) {
    super(message, 'INVALID_METRICS_DATA', 400);
  }
}

export class MetricsCalculationError extends InfluenceMetricsError {
  constructor(message: string) {
    super(`Metrics calculation failed: ${message}`, 'CALCULATION_ERROR', 500);
  }
}