/**
 * InfluenceService - Metrics calculation and ranking service
 *
 * Handles influence metrics calculation, ranking systems, growth tracking,
 * and background job scheduling for user influence measurement.
 *
 * Business Rules (per data-model.md:178-183):
 * - Metrics updated daily via background job
 * - Engagement rate = (likes + comments + reshares) / impressions
 * - Influence rank updated weekly across all users
 * - Approval rating based on positive vs negative reactions
 */

import { PrismaClient } from '../generated/prisma';
import {
  InfluenceMetricsModel,
  InfluenceMetrics,
  UpdateInfluenceMetricsInput,
  MetricsSnapshot,
  InfluenceAnalytics,
  RankingContext,
  InfluenceMetricsError,
  MetricsNotFoundError,
  InvalidMetricsDataError,
  MetricsCalculationError,
  UpdateInfluenceMetricsSchema
} from '../models/InfluenceMetrics';
import { UserProfileModel } from '../models/UserProfile';
import { PersonaType } from '../generated/prisma';
import { config } from '../lib/config';
import { logger } from '../lib/logger';
import { Redis } from 'ioredis';
import cron from 'node-cron';

export interface InfluenceTier {
  tier: 'nano' | 'micro' | 'mid' | 'macro' | 'mega';
  description: string;
  nextTierRequirements: string[];
}

export interface InfluenceRankingResult {
  userId: string;
  username: string;
  displayName: string;
  followerCount: number;
  engagementRate: number;
  influenceScore: number;
  globalRank: number;
  categoryRank: number;
  tier: InfluenceTier;
  personaType: PersonaType;
}

export interface MetricsUpdateResult {
  success: boolean;
  metrics: InfluenceMetrics;
  changes: {
    followerGrowth: number;
    engagementChange: number;
    approvalChange: number;
    rankChange: number;
  };
  warnings: string[];
}

export interface BulkMetricsUpdateResult {
  totalUsers: number;
  successCount: number;
  failureCount: number;
  errors: Array<{ userId: string; error: string }>;
  duration: number;
}

export interface GrowthAnalysis {
  period: 'daily' | 'weekly' | 'monthly';
  currentPeriod: MetricsSnapshot;
  previousPeriod: MetricsSnapshot | null;
  growthRate: number;
  trend: 'rising' | 'stable' | 'declining';
  projectedMetrics: Partial<InfluenceMetrics>;
  recommendations: string[];
}

export interface CategoryRanking {
  category: PersonaType;
  totalUsers: number;
  rankings: InfluenceRankingResult[];
  averageEngagement: number;
  topPercentileThreshold: number;
}

export interface InfluenceLeaderboard {
  global: InfluenceRankingResult[];
  categories: Record<PersonaType, CategoryRanking>;
  lastUpdated: Date;
  nextUpdateScheduled: Date;
}

export class InfluenceService {
  private prisma: PrismaClient;
  private redis: Redis;
  private jobsInitialized = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    // Initialize background jobs on first service instantiation
    if (!this.jobsInitialized) {
      this.initializeBackgroundJobs();
      this.jobsInitialized = true;
    }
  }

  /**
   * Get current influence metrics for a user
   */
  async getUserMetrics(userId: string): Promise<InfluenceMetrics> {
    try {
      // Try to get from cache first
      const cached = await this.getCachedMetrics(userId);
      if (cached) {
        return cached;
      }

      // Fetch from database
      const metrics = await this.prisma.influenceMetrics.findUnique({
        where: { userId },
      });

      if (!metrics) {
        throw new MetricsNotFoundError(userId);
      }

      // Cache the result
      await this.cacheMetrics(userId, metrics);

      return metrics as InfluenceMetrics;
    } catch (error) {
      logger.error('Error fetching user metrics:', { userId, error });
      if (error instanceof InfluenceMetricsError) {
        throw error;
      }
      throw new MetricsCalculationError(`Failed to fetch metrics for user ${userId}`);
    }
  }

  /**
   * Calculate and update metrics for a specific user
   */
  async updateUserMetrics(
    userId: string,
    input?: UpdateInfluenceMetricsInput
  ): Promise<MetricsUpdateResult> {
    try {
      // Validate input if provided
      if (input) {
        UpdateInfluenceMetricsSchema.parse(input);
      }

      // Get current metrics or create if doesn't exist
      let currentMetrics = await this.prisma.influenceMetrics.findUnique({
        where: { userId },
      });

      // Get user profile for persona type
      const userProfile = await this.prisma.userProfile.findUnique({
        where: { userId },
        include: {
          userAccount: {
            select: { username: true }
          }
        }
      });

      if (!userProfile) {
        throw new InvalidMetricsDataError(`User profile not found for ${userId}`);
      }

      // Calculate fresh metrics from database
      const calculatedMetrics = await this.calculateUserMetrics(userId, input);

      // Store previous values for change tracking
      const previousMetrics = currentMetrics ? { ...currentMetrics } : null;

      // Update or create metrics
      const updatedMetrics = await this.prisma.influenceMetrics.upsert({
        where: { userId },
        update: {
          ...calculatedMetrics,
          lastUpdated: new Date(),
        },
        create: {
          userId,
          ...calculatedMetrics,
          createdAt: new Date(),
          lastUpdated: new Date(),
        },
      });

      // Calculate changes
      const changes = {
        followerGrowth: previousMetrics
          ? updatedMetrics.followerCount - previousMetrics.followerCount
          : updatedMetrics.followerCount,
        engagementChange: previousMetrics
          ? updatedMetrics.engagementRate - previousMetrics.engagementRate
          : updatedMetrics.engagementRate,
        approvalChange: previousMetrics
          ? updatedMetrics.approvalRating - previousMetrics.approvalRating
          : updatedMetrics.approvalRating,
        rankChange: previousMetrics
          ? previousMetrics.influenceRank - updatedMetrics.influenceRank // Lower rank = better
          : 0,
      };

      // Validate metrics and collect warnings
      const validation = InfluenceMetricsModel.validateMetrics(updatedMetrics as InfluenceMetrics);

      // Update cache
      await this.cacheMetrics(userId, updatedMetrics);

      // Clear rankings cache if significant changes
      if (Math.abs(changes.followerGrowth) > 100 || Math.abs(changes.engagementChange) > 1) {
        await this.clearRankingsCache();
      }

      return {
        success: true,
        metrics: updatedMetrics as InfluenceMetrics,
        changes,
        warnings: validation.warnings,
      };

    } catch (error) {
      logger.error('Error updating user metrics:', { userId, error });
      if (error instanceof InfluenceMetricsError) {
        throw error;
      }
      throw new MetricsCalculationError(`Failed to update metrics for user ${userId}`);
    }
  }

  /**
   * Calculate fresh metrics from database aggregations
   */
  private async calculateUserMetrics(
    userId: string,
    input?: UpdateInfluenceMetricsInput
  ): Promise<Omit<InfluenceMetrics, 'id' | 'userId' | 'createdAt' | 'lastUpdated'>> {
    // Get user profile data
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      throw new InvalidMetricsDataError(`User profile not found for ${userId}`);
    }

    // Get post engagement data
    const postStats = await this.prisma.post.aggregate({
      where: { authorId: userId },
      _count: { id: true },
      _sum: {
        impressionCount: true,
        likeCount: true,
        repostCount: true,
        commentCount: true,
      },
    });

    // Get reaction data for approval rating calculation
    const userPosts = await this.prisma.post.findMany({
      where: { authorId: userId },
      select: { id: true },
    });

    const postIds = userPosts.map(p => p.id);

    const reactionStats = await this.prisma.reaction.groupBy({
      by: ['type'],
      where: {
        postId: { in: postIds },
      },
      _count: { type: true },
    });

    // Extract metrics from input or use calculated values
    const followerCount = input?.followerCount ?? userProfile.followerCount;
    const followingCount = input?.followingCount ?? userProfile.followingCount;
    const totalLikes = input?.totalLikes ?? (postStats._sum.likeCount || 0);
    const totalReshares = input?.totalReshares ?? (postStats._sum.repostCount || 0);
    const totalComments = input?.totalComments ?? (postStats._sum.commentCount || 0);
    const impressionCount = input?.impressionCount ?? (postStats._sum.impressionCount || 0);

    // Calculate engagement rate per data-model.md formula
    const engagementRate = InfluenceMetricsModel.calculateEngagementRate(
      totalLikes,
      totalComments,
      totalReshares,
      impressionCount
    );

    // Calculate reach score
    const reachScore = InfluenceMetricsModel.calculateReachScore(
      followerCount,
      engagementRate
    );

    // Calculate approval rating from reactions
    const likeCount = reactionStats.find(r => r.type === 'LIKE')?._count.type || 0;
    const totalEngagement = totalLikes + totalComments + totalReshares;
    const reportCount = reactionStats.find(r => r.type === 'REPORT')?._count.type || 0;

    const approvalRating = InfluenceMetricsModel.calculateApprovalRating(
      likeCount,
      totalEngagement,
      0 // Will calculate controversy level separately
    );

    // Calculate controversy level
    const controversyLevel = InfluenceMetricsModel.calculateControversyLevel(
      reportCount,
      Math.max(0, totalEngagement - likeCount), // Negative feedback approximation
      Math.min(totalEngagement * 0.1, totalEngagement), // Polarized engagement approximation
      totalEngagement
    );

    // Calculate growth metrics (requires historical data)
    const growthMetrics = await this.calculateGrowthMetrics(userId, followerCount);

    // Calculate trending score
    const recentEngagement = await this.getRecentEngagement(userId);
    const trendingScore = InfluenceMetricsModel.calculateTrendingScore(
      recentEngagement,
      growthMetrics.followerGrowthDaily
    );

    // Calculate influence rank (will be updated by weekly job)
    const { influenceRank, categoryRank } = await this.calculateUserRanks(
      userId,
      userProfile.personaType,
      followerCount,
      engagementRate
    );

    return {
      followerCount,
      followingCount,
      engagementRate,
      reachScore,
      approvalRating,
      controversyLevel,
      trendingScore,
      followerGrowthDaily: growthMetrics.followerGrowthDaily,
      followerGrowthWeekly: growthMetrics.followerGrowthWeekly,
      followerGrowthMonthly: growthMetrics.followerGrowthMonthly,
      totalLikes,
      totalReshares,
      totalComments,
      influenceRank,
      categoryRank,
    };
  }

  /**
   * Calculate growth metrics from historical data
   */
  private async calculateGrowthMetrics(
    userId: string,
    currentFollowers: number
  ): Promise<{
    followerGrowthDaily: number;
    followerGrowthWeekly: number;
    followerGrowthMonthly: number;
  }> {
    try {
      // Get historical snapshots from cache/database
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // For now, we'll use a simple approximation
      // In production, this would query historical metrics tables
      const dailySnapshot = await this.getHistoricalSnapshot(userId, oneDayAgo);
      const weeklySnapshot = await this.getHistoricalSnapshot(userId, oneWeekAgo);
      const monthlySnapshot = await this.getHistoricalSnapshot(userId, oneMonthAgo);

      return {
        followerGrowthDaily: dailySnapshot ? currentFollowers - dailySnapshot.followers : 0,
        followerGrowthWeekly: weeklySnapshot ? currentFollowers - weeklySnapshot.followers : 0,
        followerGrowthMonthly: monthlySnapshot ? currentFollowers - monthlySnapshot.followers : 0,
      };
    } catch (error) {
      logger.warn('Error calculating growth metrics:', { userId, error });
      return {
        followerGrowthDaily: 0,
        followerGrowthWeekly: 0,
        followerGrowthMonthly: 0,
      };
    }
  }

  /**
   * Get recent engagement for trending calculation
   */
  private async getRecentEngagement(userId: string): Promise<number> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentPosts = await this.prisma.post.aggregate({
      where: {
        authorId: userId,
        createdAt: { gte: oneDayAgo },
      },
      _sum: {
        likeCount: true,
        repostCount: true,
        commentCount: true,
      },
    });

    return (recentPosts._sum.likeCount || 0) +
           (recentPosts._sum.repostCount || 0) +
           (recentPosts._sum.commentCount || 0);
  }

  /**
   * Calculate user rankings within global and category contexts
   */
  private async calculateUserRanks(
    userId: string,
    personaType: PersonaType,
    followerCount: number,
    engagementRate: number
  ): Promise<{ influenceRank: number; categoryRank: number }> {
    try {
      // Calculate influence score for ranking
      const mockMetrics = {
        followerCount,
        engagementRate,
        approvalRating: 50, // Placeholder
        followerGrowthDaily: 0,
        followerGrowthWeekly: 0,
      } as InfluenceMetrics;

      const { score } = InfluenceMetricsModel.calculateInfluenceScore(mockMetrics);

      // Get global rank
      const globalRank = await this.prisma.influenceMetrics.count({
        where: {
          OR: [
            { followerCount: { gt: followerCount } },
            {
              followerCount: followerCount,
              engagementRate: { gt: engagementRate },
            },
          ],
        },
      }) + 1;

      // Get category rank
      const categoryRank = await this.prisma.influenceMetrics.count({
        where: {
          user: {
            userProfile: {
              personaType: personaType,
            },
          },
          OR: [
            { followerCount: { gt: followerCount } },
            {
              followerCount: followerCount,
              engagementRate: { gt: engagementRate },
            },
          ],
        },
      }) + 1;

      return { influenceRank: globalRank, categoryRank };
    } catch (error) {
      logger.warn('Error calculating user ranks:', { userId, error });
      return { influenceRank: 999999, categoryRank: 999999 };
    }
  }

  /**
   * Get influence rankings with filtering and pagination
   */
  async getInfluenceRankings(options: {
    category?: PersonaType;
    limit?: number;
    offset?: number;
    tier?: 'nano' | 'micro' | 'mid' | 'macro' | 'mega';
  } = {}): Promise<{
    rankings: InfluenceRankingResult[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const { category, limit = 50, offset = 0, tier } = options;

      // Check cache first
      const cacheKey = `rankings:${category || 'global'}:${tier || 'all'}:${limit}:${offset}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Build query filters
      const where: any = {};
      if (category) {
        where.user = {
          userProfile: {
            personaType: category,
          },
        };
      }

      // Add tier filtering
      if (tier) {
        const tierRanges = {
          nano: { min: 0, max: 999 },
          micro: { min: 1000, max: 9999 },
          mid: { min: 10000, max: 99999 },
          macro: { min: 100000, max: 999999 },
          mega: { min: 1000000, max: Number.MAX_SAFE_INTEGER },
        };
        const range = tierRanges[tier];
        where.followerCount = { gte: range.min, lte: range.max };
      }

      // Get total count
      const total = await this.prisma.influenceMetrics.count({ where });

      // Fetch rankings
      const metrics = await this.prisma.influenceMetrics.findMany({
        where,
        include: {
          user: {
            include: {
              userAccount: {
                select: { username: true }
              },
              userProfile: {
                select: { displayName: true, personaType: true }
              }
            }
          }
        },
        orderBy: [
          { followerCount: 'desc' },
          { engagementRate: 'desc' },
        ],
        take: limit,
        skip: offset,
      });

      // Transform to ranking results
      const rankings: InfluenceRankingResult[] = metrics.map((metric, index) => {
        const influenceScore = InfluenceMetricsModel.calculateInfluenceScore(metric as InfluenceMetrics);
        const tierInfo = InfluenceMetricsModel.determineInfluenceTier(metric as InfluenceMetrics);

        return {
          userId: metric.userId,
          username: metric.user.userAccount.username,
          displayName: metric.user.userProfile?.displayName || metric.user.userAccount.username,
          followerCount: metric.followerCount,
          engagementRate: metric.engagementRate,
          influenceScore: influenceScore.score,
          globalRank: metric.influenceRank,
          categoryRank: metric.categoryRank,
          tier: tierInfo,
          personaType: metric.user.userProfile?.personaType || PersonaType.INFLUENCER,
        };
      });

      const result = {
        rankings,
        total,
        hasMore: offset + limit < total,
      };

      // Cache for 5 minutes
      await this.redis.setex(cacheKey, 300, JSON.stringify(result));

      return result;
    } catch (error) {
      logger.error('Error fetching influence rankings:', { options, error });
      throw new MetricsCalculationError('Failed to fetch influence rankings');
    }
  }

  /**
   * Get complete leaderboard with global and category rankings
   */
  async getInfluenceLeaderboard(): Promise<InfluenceLeaderboard> {
    try {
      const cacheKey = 'leaderboard:complete';
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Get global top 100
      const globalRankings = await this.getInfluenceRankings({ limit: 100 });

      // Get category rankings
      const categories: Record<PersonaType, CategoryRanking> = {} as any;

      for (const personaType of Object.values(PersonaType)) {
        const categoryResults = await this.getInfluenceRankings({
          category: personaType,
          limit: 50
        });

        // Calculate category stats
        const allCategoryMetrics = await this.prisma.influenceMetrics.findMany({
          where: {
            user: {
              userProfile: {
                personaType: personaType,
              },
            },
          },
          select: { engagementRate: true, followerCount: true },
        });

        const avgEngagement = allCategoryMetrics.length > 0
          ? allCategoryMetrics.reduce((sum, m) => sum + m.engagementRate, 0) / allCategoryMetrics.length
          : 0;

        const sortedByFollowers = allCategoryMetrics.sort((a, b) => b.followerCount - a.followerCount);
        const topPercentileIndex = Math.floor(sortedByFollowers.length * 0.1);
        const topPercentileThreshold = sortedByFollowers[topPercentileIndex]?.followerCount || 0;

        categories[personaType] = {
          category: personaType,
          totalUsers: categoryResults.total,
          rankings: categoryResults.rankings,
          averageEngagement: Math.round(avgEngagement * 100) / 100,
          topPercentileThreshold,
        };
      }

      const leaderboard: InfluenceLeaderboard = {
        global: globalRankings.rankings,
        categories,
        lastUpdated: new Date(),
        nextUpdateScheduled: this.getNextScheduledUpdate(),
      };

      // Cache for 1 hour
      await this.redis.setex(cacheKey, 3600, JSON.stringify(leaderboard));

      return leaderboard;
    } catch (error) {
      logger.error('Error generating leaderboard:', error);
      throw new MetricsCalculationError('Failed to generate influence leaderboard');
    }
  }

  /**
   * Analyze growth trends for a user
   */
  async analyzeGrowthTrends(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<GrowthAnalysis> {
    try {
      const currentMetrics = await this.getUserMetrics(userId);

      // Get historical snapshot
      const daysBack = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
      const pastDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
      const previousSnapshot = await this.getHistoricalSnapshot(userId, pastDate);

      const currentSnapshot: MetricsSnapshot = {
        timestamp: new Date(),
        followers: currentMetrics.followerCount,
        engagement: currentMetrics.engagementRate,
        approval: currentMetrics.approvalRating,
        controversy: currentMetrics.controversyLevel,
        trending: currentMetrics.trendingScore,
      };

      // Calculate growth rate
      let growthRate = 0;
      if (previousSnapshot && previousSnapshot.followers > 0) {
        growthRate = ((currentSnapshot.followers - previousSnapshot.followers) / previousSnapshot.followers) * 100;
      }

      // Determine trend
      let trend: 'rising' | 'stable' | 'declining';
      if (growthRate > 5) trend = 'rising';
      else if (growthRate < -5) trend = 'declining';
      else trend = 'stable';

      // Project future metrics
      const projectedMetrics = this.projectFutureMetrics(currentMetrics, growthRate, period);

      // Generate recommendations
      const recommendations = this.generateGrowthRecommendations(
        currentMetrics,
        previousSnapshot,
        trend
      );

      return {
        period,
        currentPeriod: currentSnapshot,
        previousPeriod: previousSnapshot,
        growthRate: Math.round(growthRate * 100) / 100,
        trend,
        projectedMetrics,
        recommendations,
      };
    } catch (error) {
      logger.error('Error analyzing growth trends:', { userId, period, error });
      throw new MetricsCalculationError(`Failed to analyze growth trends for user ${userId}`);
    }
  }

  /**
   * Bulk update metrics for all users (daily job)
   */
  async bulkUpdateMetrics(): Promise<BulkMetricsUpdateResult> {
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;
    const errors: Array<{ userId: string; error: string }> = [];

    try {
      logger.info('Starting bulk metrics update');

      // Get all users with profiles
      const users = await this.prisma.userAccount.findMany({
        where: {
          userProfile: { isNot: null },
          isActive: true,
        },
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      });

      logger.info(`Processing metrics for ${users.length} users`);

      // Process in batches to avoid overwhelming the database
      const batchSize = 50;
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);

        const batchPromises = batch.map(async (user) => {
          try {
            await this.updateUserMetrics(user.id);
            successCount++;
          } catch (error) {
            failureCount++;
            errors.push({
              userId: user.id,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            logger.warn('Failed to update metrics for user:', { userId: user.id, error });
          }
        });

        await Promise.allSettled(batchPromises);

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const duration = Date.now() - startTime;

      logger.info('Bulk metrics update completed', {
        totalUsers: users.length,
        successCount,
        failureCount,
        duration: `${duration}ms`,
      });

      return {
        totalUsers: users.length,
        successCount,
        failureCount,
        errors,
        duration,
      };
    } catch (error) {
      logger.error('Error in bulk metrics update:', error);
      throw new MetricsCalculationError('Bulk metrics update failed');
    }
  }

  /**
   * Recalculate all rankings (weekly job)
   */
  async recalculateRankings(): Promise<void> {
    try {
      logger.info('Starting ranking recalculation');

      // Update global rankings
      await this.prisma.$transaction(async (tx) => {
        // Get all metrics ordered by influence score
        const allMetrics = await tx.influenceMetrics.findMany({
          include: {
            user: {
              include: {
                userProfile: {
                  select: { personaType: true }
                }
              }
            }
          },
          orderBy: [
            { followerCount: 'desc' },
            { engagementRate: 'desc' },
          ],
        });

        // Calculate and update global ranks
        for (let i = 0; i < allMetrics.length; i++) {
          await tx.influenceMetrics.update({
            where: { id: allMetrics[i].id },
            data: { influenceRank: i + 1 },
          });
        }

        // Calculate and update category ranks
        for (const personaType of Object.values(PersonaType)) {
          const categoryMetrics = allMetrics.filter(
            m => m.user.userProfile?.personaType === personaType
          );

          for (let i = 0; i < categoryMetrics.length; i++) {
            await tx.influenceMetrics.update({
              where: { id: categoryMetrics[i].id },
              data: { categoryRank: i + 1 },
            });
          }
        }
      });

      // Clear all ranking caches
      await this.clearRankingsCache();

      logger.info('Ranking recalculation completed');
    } catch (error) {
      logger.error('Error recalculating rankings:', error);
      throw new MetricsCalculationError('Failed to recalculate rankings');
    }
  }

  /**
   * Initialize background jobs for metrics and rankings
   */
  private initializeBackgroundJobs(): void {
    // Daily metrics update at 2 AM
    cron.schedule('0 2 * * *', async () => {
      try {
        logger.info('Starting scheduled daily metrics update');
        await this.bulkUpdateMetrics();
      } catch (error) {
        logger.error('Scheduled metrics update failed:', error);
      }
    });

    // Weekly ranking recalculation on Sundays at 3 AM
    cron.schedule('0 3 * * 0', async () => {
      try {
        logger.info('Starting scheduled weekly ranking recalculation');
        await this.recalculateRankings();
      } catch (error) {
        logger.error('Scheduled ranking recalculation failed:', error);
      }
    });

    // Hourly cache cleanup
    cron.schedule('0 * * * *', async () => {
      try {
        await this.cleanupExpiredCache();
      } catch (error) {
        logger.warn('Cache cleanup failed:', error);
      }
    });

    logger.info('Background jobs initialized for InfluenceService');
  }

  /**
   * Cache management methods
   */
  private async getCachedMetrics(userId: string): Promise<InfluenceMetrics | null> {
    try {
      const cached = await this.redis.get(`metrics:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Cache retrieval failed:', { userId, error });
      return null;
    }
  }

  private async cacheMetrics(userId: string, metrics: any): Promise<void> {
    try {
      await this.redis.setex(`metrics:${userId}`, 3600, JSON.stringify(metrics)); // 1 hour cache
    } catch (error) {
      logger.warn('Cache storage failed:', { userId, error });
    }
  }

  private async clearRankingsCache(): Promise<void> {
    try {
      const keys = await this.redis.keys('rankings:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      await this.redis.del('leaderboard:complete');
    } catch (error) {
      logger.warn('Cache clearing failed:', error);
    }
  }

  private async cleanupExpiredCache(): Promise<void> {
    // Redis handles TTL automatically, but we can clean up specific patterns
    try {
      const expiredKeys = await this.redis.keys('metrics:*');
      // Keys with TTL will expire automatically
      logger.debug(`Cache cleanup checked ${expiredKeys.length} keys`);
    } catch (error) {
      logger.warn('Cache cleanup error:', error);
    }
  }

  /**
   * Helper methods
   */
  private async getHistoricalSnapshot(userId: string, date: Date): Promise<MetricsSnapshot | null> {
    // In a production system, this would query a historical metrics table
    // For now, we'll return null and rely on current metrics
    return null;
  }

  private getNextScheduledUpdate(): Date {
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
    nextSunday.setHours(3, 0, 0, 0);
    return nextSunday;
  }

  private projectFutureMetrics(
    current: InfluenceMetrics,
    growthRate: number,
    period: 'daily' | 'weekly' | 'monthly'
  ): Partial<InfluenceMetrics> {
    const multiplier = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
    const projectedGrowth = growthRate * multiplier / 100;

    return {
      followerCount: Math.round(current.followerCount * (1 + projectedGrowth)),
      engagementRate: Math.max(0, current.engagementRate), // Assume stable
      approvalRating: Math.max(0, Math.min(100, current.approvalRating)), // Assume stable
    };
  }

  private generateGrowthRecommendations(
    current: InfluenceMetrics,
    previous: MetricsSnapshot | null,
    trend: 'rising' | 'stable' | 'declining'
  ): string[] {
    const recommendations: string[] = [];

    if (trend === 'declining') {
      recommendations.push('Focus on engaging content to reverse follower decline');
      recommendations.push('Analyze recent posts for potential issues');
      recommendations.push('Increase posting frequency and consistency');
    }

    if (current.engagementRate < 2) {
      recommendations.push('Improve engagement by responding to comments');
      recommendations.push('Post at optimal times when your audience is active');
    }

    if (current.approvalRating < 60) {
      recommendations.push('Consider more positive and balanced content');
      recommendations.push('Avoid controversial topics that may harm approval');
    }

    if (trend === 'stable' && current.followerCount > 1000) {
      recommendations.push('Experiment with new content formats to boost growth');
      recommendations.push('Collaborate with other users in your category');
    }

    return recommendations;
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    await this.prisma.$disconnect();
    await this.redis.disconnect();
  }
}

// Export singleton instance
export const influenceService = new InfluenceService();