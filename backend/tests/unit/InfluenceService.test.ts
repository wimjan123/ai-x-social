import { describe, it, expect, beforeEach, afterEach, jest, beforeAll, afterAll } from '@jest/globals';

// Mock external dependencies first
jest.mock('@/lib/config', () => ({
  config: {
    redis: {
      host: 'localhost',
      port: 6379,
      password: '',
    },
  },
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock('node-cron');

// Mock Prisma Client with a factory function to avoid initialization issues
jest.mock('@/generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    influenceMetrics: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    userProfile: {
      findUnique: jest.fn(),
    },
    userAccount: {
      findMany: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    reaction: {
      groupBy: jest.fn(),
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  })),
  PersonaType: {
    POLITICIAN: 'POLITICIAN',
    INFLUENCER: 'INFLUENCER',
    JOURNALIST: 'JOURNALIST',
    ACTIVIST: 'ACTIVIST',
  },
}));

// Mock the Redis constructor
jest.mock('ioredis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

// Now import the modules after mocking
import { InfluenceService, MetricsUpdateResult, BulkMetricsUpdateResult, GrowthAnalysis } from '@/services/InfluenceService';
import { InfluenceMetricsModel, InfluenceMetrics } from '@/models/InfluenceMetrics';
import { PersonaType } from '@/generated/prisma';
import { PrismaClient } from '@/generated/prisma';
import { Redis } from 'ioredis';

describe('InfluenceService', () => {
  let influenceService: InfluenceService;
  let mockPrismaClient: any;
  let mockRedis: any;

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockUserProfile = {
    userId: mockUserId,
    personaType: PersonaType.INFLUENCER,
    followerCount: 1000,
    followingCount: 500,
  };

  const mockInfluenceMetrics: InfluenceMetrics = {
    id: 'metrics-id',
    userId: mockUserId,
    followerCount: 1000,
    followingCount: 500,
    engagementRate: 5.25,
    reachScore: 1500,
    approvalRating: 75,
    controversyLevel: 20,
    trendingScore: 60,
    followerGrowthDaily: 10,
    followerGrowthWeekly: 70,
    followerGrowthMonthly: 300,
    totalLikes: 5000,
    totalReshares: 1200,
    totalComments: 800,
    influenceRank: 42,
    categoryRank: 15,
    lastUpdated: new Date('2023-01-15T10:00:00Z'),
    createdAt: new Date('2023-01-01T00:00:00Z'),
  };

  beforeAll(() => {
    // Prevent background jobs from running during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Get fresh mock instances
    const MockedPrismaClient = PrismaClient as jest.MockedClass<typeof PrismaClient>;
    const MockedRedis = Redis as jest.MockedClass<typeof Redis>;

    // Create new instances to get fresh mocks
    influenceService = new InfluenceService();

    // Get the mock instances that were created
    mockPrismaClient = (influenceService as any).prisma;
    mockRedis = (influenceService as any).redis;

    // Setup default mock behaviors
    if (mockRedis.get) mockRedis.get.mockResolvedValue(null);
    if (mockRedis.setex) mockRedis.setex.mockResolvedValue('OK');
    if (mockRedis.del) mockRedis.del.mockResolvedValue(1);
    if (mockRedis.keys) mockRedis.keys.mockResolvedValue([]);
  });

  afterEach(async () => {
    if (influenceService && typeof influenceService.destroy === 'function') {
      await influenceService.destroy();
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getUserMetrics', () => {
    it('should return cached metrics when available', async () => {
      const cachedMetrics = JSON.stringify(mockInfluenceMetrics);
      mockRedis.get.mockResolvedValueOnce(cachedMetrics);

      const result = await influenceService.getUserMetrics(mockUserId);

      // Since JSON.parse converts dates to strings, we need to expect string dates
      const expectedMetrics = {
        ...mockInfluenceMetrics,
        createdAt: mockInfluenceMetrics.createdAt.toISOString(),
        lastUpdated: mockInfluenceMetrics.lastUpdated.toISOString(),
      };

      expect(result).toEqual(expectedMetrics);
      expect(mockRedis.get).toHaveBeenCalledWith(`metrics:${mockUserId}`);
      expect(mockPrismaClient.influenceMetrics.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from database when cache miss', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValueOnce(mockInfluenceMetrics);

      const result = await influenceService.getUserMetrics(mockUserId);

      expect(result).toEqual(mockInfluenceMetrics);
      expect(mockPrismaClient.influenceMetrics.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(mockRedis.setex).toHaveBeenCalledWith(
        `metrics:${mockUserId}`,
        3600,
        JSON.stringify(mockInfluenceMetrics)
      );
    });

    it('should throw MetricsNotFoundError when metrics do not exist', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValueOnce(null);

      await expect(influenceService.getUserMetrics(mockUserId))
        .rejects.toThrow('Influence metrics not found for user');
    });

    it('should handle cache retrieval errors gracefully', async () => {
      mockRedis.get.mockRejectedValueOnce(new Error('Redis error'));
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValueOnce(mockInfluenceMetrics);

      const result = await influenceService.getUserMetrics(mockUserId);

      expect(result).toEqual(mockInfluenceMetrics);
      expect(mockPrismaClient.influenceMetrics.findUnique).toHaveBeenCalled();
    });
  });

  describe('updateUserMetrics', () => {
    const mockUserProfileWithAccount = {
      ...mockUserProfile,
      userAccount: { username: 'testuser' },
    };

    const mockPostStats = {
      _count: { id: 5 },
      _sum: {
        impressionCount: 10000,
        likeCount: 500,
        repostCount: 120,
        commentCount: 80,
      },
    };

    const mockReactionStats = [
      { type: 'LIKE', _count: { type: 500 } },
      { type: 'REPORT', _count: { type: 10 } },
    ];

    beforeEach(() => {
      mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockUserProfileWithAccount);
      mockPrismaClient.post.aggregate.mockResolvedValue(mockPostStats);
      mockPrismaClient.post.findMany.mockResolvedValue([
        { id: 'post1' }, { id: 'post2' }, { id: 'post3' }, { id: 'post4' }, { id: 'post5' }
      ]);
      mockPrismaClient.reaction.groupBy.mockResolvedValue(mockReactionStats);
    });

    it('should calculate and update metrics for existing user', async () => {
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValueOnce(mockInfluenceMetrics);
      mockPrismaClient.influenceMetrics.upsert.mockResolvedValueOnce({
        ...mockInfluenceMetrics,
        followerCount: 1100,
        engagementRate: 6.0,
      });

      const result = await influenceService.updateUserMetrics(mockUserId);

      expect(result.success).toBe(true);
      expect(result.metrics).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.changes.followerGrowth).toBe(100); // 1100 - 1000
      expect(mockPrismaClient.influenceMetrics.upsert).toHaveBeenCalled();
    });

    it('should create new metrics for user without existing metrics', async () => {
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.upsert.mockResolvedValueOnce(mockInfluenceMetrics);

      const result = await influenceService.updateUserMetrics(mockUserId);

      expect(result.success).toBe(true);
      expect(result.changes.followerGrowth).toBe(mockInfluenceMetrics.followerCount);
      expect(mockPrismaClient.influenceMetrics.upsert).toHaveBeenCalled();
    });

    it('should validate input when provided', async () => {
      const invalidInput = { followerCount: -100 }; // Negative value

      await expect(influenceService.updateUserMetrics(mockUserId, invalidInput))
        .rejects.toThrow();
    });

    it('should throw error when user profile not found', async () => {
      mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null);

      await expect(influenceService.updateUserMetrics(mockUserId))
        .rejects.toThrow('User profile not found');
    });

    it('should clear rankings cache for significant changes', async () => {
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValueOnce(mockInfluenceMetrics);
      mockPrismaClient.influenceMetrics.upsert.mockResolvedValueOnce({
        ...mockInfluenceMetrics,
        followerCount: 1150, // +150 followers (significant change)
      });

      await influenceService.updateUserMetrics(mockUserId);

      expect(mockRedis.keys).toHaveBeenCalledWith('rankings:*');
      expect(mockRedis.del).toHaveBeenCalled();
    });
  });

  describe('Algorithm Correctness Tests', () => {
    describe('Engagement Rate Calculation', () => {
      it('should calculate engagement rate correctly with known inputs', () => {
        const result = InfluenceMetricsModel.calculateEngagementRate(100, 50, 25, 1000);
        expect(result).toBe(17.5); // (100 + 50 + 25) / 1000 * 100 = 17.5%
      });

      it('should return 0 for zero impressions', () => {
        const result = InfluenceMetricsModel.calculateEngagementRate(100, 50, 25, 0);
        expect(result).toBe(0);
      });

      it('should handle edge case with maximum engagement', () => {
        const result = InfluenceMetricsModel.calculateEngagementRate(1000, 1000, 1000, 1000);
        expect(result).toBe(300); // 300% (viral content)
      });
    });

    describe('Reach Score Calculation', () => {
      it('should calculate reach score with default multiplier', () => {
        const result = InfluenceMetricsModel.calculateReachScore(1000, 5);
        // reach = 1000 * (1 + 0.05) * 1.5 = 1000 * 1.05 * 1.5 = 1575
        expect(result).toBe(1575);
      });

      it('should handle zero followers', () => {
        const result = InfluenceMetricsModel.calculateReachScore(0, 10);
        expect(result).toBe(0);
      });

      it('should apply custom network multiplier', () => {
        const result = InfluenceMetricsModel.calculateReachScore(1000, 5, 2.0);
        // reach = 1000 * 1.05 * 2.0 = 2100
        expect(result).toBe(2100);
      });
    });

    describe('Approval Rating Calculation', () => {
      it('should calculate approval rating correctly', () => {
        const result = InfluenceMetricsModel.calculateApprovalRating(700, 1000, 10);
        // base approval = 700/1000 * 100 = 70%
        // penalty = 10 * 0.3 = 3
        // final = 70 - 3 = 67
        expect(result).toBe(67);
      });

      it('should return neutral rating for zero engagement', () => {
        const result = InfluenceMetricsModel.calculateApprovalRating(0, 0, 0);
        expect(result).toBe(50);
      });

      it('should not go below 0%', () => {
        const result = InfluenceMetricsModel.calculateApprovalRating(100, 1000, 400);
        // base = 10%, penalty = 120%, final = max(0, 10 - 120) = 0
        expect(result).toBe(0);
      });
    });

    describe('Controversy Level Calculation', () => {
      it('should calculate controversy level correctly', () => {
        const result = InfluenceMetricsModel.calculateControversyLevel(10, 50, 30, 1000);
        // report ratio: 10/1000 * 50 = 0.5
        // negative ratio: 50/1000 * 30 = 1.5
        // polarized ratio: 30/1000 * 20 = 0.6
        // total = 0.5 + 1.5 + 0.6 = 2.6, rounded = 3
        expect(result).toBe(3);
      });

      it('should return 0 for zero engagement', () => {
        const result = InfluenceMetricsModel.calculateControversyLevel(0, 0, 0, 0);
        expect(result).toBe(0);
      });

      it('should cap at 100', () => {
        // Create values that will definitely exceed 100 when calculated
        const result = InfluenceMetricsModel.calculateControversyLevel(1000, 1000, 1000, 1000);
        expect(result).toBe(100);
      });
    });

    describe('Trending Score Calculation', () => {
      it('should calculate trending score correctly', () => {
        const result = InfluenceMetricsModel.calculateTrendingScore(500, 50);
        // base = min(100, 500/10) = 50
        // growth = min(30, 50/5) = 10
        // trending = (50 + 10) * 0.95 = 57
        expect(result).toBe(57);
      });

      it('should handle zero engagement', () => {
        const result = InfluenceMetricsModel.calculateTrendingScore(0, 0);
        expect(result).toBe(0);
      });

      it('should apply time decay', () => {
        const resultWithDecay = InfluenceMetricsModel.calculateTrendingScore(1000, 150, 0.8);
        const resultWithoutDecay = InfluenceMetricsModel.calculateTrendingScore(1000, 150, 1.0);
        expect(resultWithDecay).toBeLessThan(resultWithoutDecay);
      });
    });

    describe('Influence Score Calculation', () => {
      it('should calculate composite influence score correctly', () => {
        const metrics = {
          ...mockInfluenceMetrics,
          followerCount: 10000, // log10(10000) * 20 = 80
          engagementRate: 5,    // 5 * 10 = 50
          approvalRating: 70,   // 70 direct
          followerGrowthDaily: 10,
          followerGrowthWeekly: 70, // consistency = 100 - |10 - 70/7| = 100 - 0 = 100
        };

        const result = InfluenceMetricsModel.calculateInfluenceScore(metrics);

        expect(result.score).toBeGreaterThan(0);
        expect(result.breakdown).toHaveProperty('reach');
        expect(result.breakdown).toHaveProperty('engagement');
        expect(result.breakdown).toHaveProperty('approval');
        expect(result.breakdown).toHaveProperty('consistency');

        // Verify weighted calculation logic
        expect(result.breakdown.reach).toBe(80);
        expect(result.breakdown.engagement).toBe(50);
        expect(result.breakdown.approval).toBe(70);
        expect(result.breakdown.consistency).toBe(100);
      });

      it('should handle edge cases in score calculation', () => {
        const edgeMetrics = {
          ...mockInfluenceMetrics,
          followerCount: 1,
          engagementRate: 0,
          approvalRating: 0,
          followerGrowthDaily: 1000,
          followerGrowthWeekly: 0,
        };

        const result = InfluenceMetricsModel.calculateInfluenceScore(edgeMetrics);

        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Growth Metrics Calculation', () => {
    it('should calculate growth percentages correctly', () => {
      const currentMetrics = {
        ...mockInfluenceMetrics,
        followerCount: 1100,
        engagementRate: 6.0,
        approvalRating: 80,
        controversyLevel: 15,
      };

      const previousMetrics = {
        ...mockInfluenceMetrics,
        followerCount: 1000,
        engagementRate: 5.0,
        approvalRating: 75,
        controversyLevel: 20,
      };

      const growth = InfluenceMetricsModel.calculateGrowthMetrics(currentMetrics, previousMetrics);

      expect(growth.followerGrowthPercentage).toBe(10); // (1100-1000)/1000 * 100 = 10%
      expect(growth.engagementGrowthPercentage).toBe(20); // (6-5)/5 * 100 = 20%
      expect(growth.approvalChange).toBe(5); // 80 - 75 = 5
      expect(growth.controversyChange).toBe(-5); // 15 - 20 = -5
    });

    it('should handle zero previous values', () => {
      const currentMetrics = { ...mockInfluenceMetrics };
      const previousMetrics = {
        ...mockInfluenceMetrics,
        followerCount: 0,
        engagementRate: 0,
      };

      const growth = InfluenceMetricsModel.calculateGrowthMetrics(currentMetrics, previousMetrics);

      expect(growth.followerGrowthPercentage).toBe(0);
      expect(growth.engagementGrowthPercentage).toBe(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero engagement metrics', async () => {
      const zeroEngagementStats = {
        _count: { id: 0 },
        _sum: {
          impressionCount: 0,
          likeCount: 0,
          repostCount: 0,
          commentCount: 0,
        },
      };

      mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockUserProfile);
      mockPrismaClient.post.aggregate.mockResolvedValue(zeroEngagementStats);
      mockPrismaClient.post.findMany.mockResolvedValue([]);
      mockPrismaClient.reaction.groupBy.mockResolvedValue([]);
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValue(null);
      mockPrismaClient.influenceMetrics.upsert.mockResolvedValue({
        ...mockInfluenceMetrics,
        engagementRate: 0,
        totalLikes: 0,
        totalReshares: 0,
        totalComments: 0,
      });

      const result = await influenceService.updateUserMetrics(mockUserId);

      expect(result.success).toBe(true);
      expect(result.metrics.engagementRate).toBe(0);
      expect(result.metrics.totalLikes).toBe(0);
    });

    it('should handle negative scores gracefully', () => {
      const controversialMetrics = {
        ...mockInfluenceMetrics,
        approvalRating: 10,
        controversyLevel: 90,
      };

      const result = InfluenceMetricsModel.calculateInfluenceScore(controversialMetrics);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.breakdown.approval).toBe(10);
    });

    it('should validate metrics correctly', () => {
      const invalidMetrics = {
        ...mockInfluenceMetrics,
        followerCount: -100,
        engagementRate: 150,
      };

      const validation = InfluenceMetricsModel.validateMetrics(invalidMetrics);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Follower count cannot be negative');
      expect(validation.errors).toContain('Engagement rate must be between 0 and 100');
    });

    it('should generate appropriate warnings for unusual metrics', () => {
      const unusualMetrics = {
        ...mockInfluenceMetrics,
        followerCount: 1000,
        engagementRate: 60, // Very high engagement rate
        followerGrowthDaily: 150, // Growth exceeds 10% of followers
        approvalRating: 5, // Very low approval with significant following
      };

      const validation = InfluenceMetricsModel.validateMetrics(unusualMetrics);

      expect(validation.warnings).toContain('Unusually high engagement rate for follower count');
      expect(validation.warnings).toContain('Daily growth exceeds 10% of total followers - may indicate artificial inflation');
      // The approval rating check only triggers if approval < 10, so let's test that specifically
      const lowApprovalMetrics = {
        ...mockInfluenceMetrics,
        approvalRating: 5,
        followerCount: 2000,
      };
      const lowApprovalValidation = InfluenceMetricsModel.validateMetrics(lowApprovalMetrics);
      expect(lowApprovalValidation.warnings).toContain('Very low approval rating with significant following may indicate issues');
    });
  });

  describe('Influence Tier Determination', () => {
    it('should correctly identify nano influencer', () => {
      const nanoMetrics = { ...mockInfluenceMetrics, followerCount: 500 };
      const tier = InfluenceMetricsModel.determineInfluenceTier(nanoMetrics);

      expect(tier.tier).toBe('nano');
      expect(tier.description).toBe('Building initial audience');
      expect(tier.nextTierRequirements).toContain('Reach 1,000 followers');
    });

    it('should correctly identify micro influencer', () => {
      const microMetrics = { ...mockInfluenceMetrics, followerCount: 5000 };
      const tier = InfluenceMetricsModel.determineInfluenceTier(microMetrics);

      expect(tier.tier).toBe('micro');
      expect(tier.description).toBe('Niche community leader');
      expect(tier.nextTierRequirements).toContain('Reach 10,000 followers');
    });

    it('should correctly identify mega influencer', () => {
      const megaMetrics = { ...mockInfluenceMetrics, followerCount: 2000000 };
      const tier = InfluenceMetricsModel.determineInfluenceTier(megaMetrics);

      expect(tier.tier).toBe('mega');
      expect(tier.description).toBe('Global influencer');
      expect(tier.nextTierRequirements).toContain('Maintain current status');
    });
  });

  describe('getInfluenceRankings', () => {
    const mockRankingsData = [
      {
        id: 'metrics1',
        userId: 'user1',
        followerCount: 10000,
        engagementRate: 8.5,
        influenceRank: 1,
        categoryRank: 1,
        user: {
          userAccount: { username: 'topuser' },
          userProfile: { displayName: 'Top User', personaType: PersonaType.INFLUENCER },
        },
      },
      {
        id: 'metrics2',
        userId: 'user2',
        followerCount: 8000,
        engagementRate: 7.2,
        influenceRank: 2,
        categoryRank: 2,
        user: {
          userAccount: { username: 'seconduser' },
          userProfile: { displayName: 'Second User', personaType: PersonaType.INFLUENCER },
        },
      },
    ];

    it('should return cached rankings when available', async () => {
      const cacheKey = 'rankings:global:all:50:0';
      const cachedData = JSON.stringify({
        rankings: mockRankingsData,
        total: 2,
        hasMore: false,
      });

      mockRedis.get.mockResolvedValueOnce(cachedData);

      const result = await influenceService.getInfluenceRankings();

      expect(result.rankings).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockRedis.get).toHaveBeenCalledWith(cacheKey);
      expect(mockPrismaClient.influenceMetrics.findMany).not.toHaveBeenCalled();
    });

    it('should fetch and cache rankings when cache miss', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.count.mockResolvedValueOnce(2);
      mockPrismaClient.influenceMetrics.findMany.mockResolvedValueOnce(mockRankingsData);

      const result = await influenceService.getInfluenceRankings({ limit: 10 });

      expect(result.rankings).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.hasMore).toBe(false);
      expect(mockRedis.setex).toHaveBeenCalled();
    });

    it('should filter by category when specified', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.count.mockResolvedValueOnce(1);
      mockPrismaClient.influenceMetrics.findMany.mockResolvedValueOnce([mockRankingsData[0]]);

      await influenceService.getInfluenceRankings({ category: PersonaType.INFLUENCER });

      expect(mockPrismaClient.influenceMetrics.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            user: {
              userProfile: {
                personaType: PersonaType.INFLUENCER,
              },
            },
          }),
        })
      );
    });

    it('should filter by tier when specified', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.count.mockResolvedValueOnce(1);
      mockPrismaClient.influenceMetrics.findMany.mockResolvedValueOnce([mockRankingsData[0]]);

      await influenceService.getInfluenceRankings({ tier: 'micro' });

      expect(mockPrismaClient.influenceMetrics.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            followerCount: { gte: 1000, lte: 9999 },
          }),
        })
      );
    });
  });

  describe('bulkUpdateMetrics', () => {
    const mockUsers = [
      { id: 'user1' },
      { id: 'user2' },
      { id: 'user3' },
    ];

    it('should process all users successfully', async () => {
      mockPrismaClient.userAccount.findMany.mockResolvedValueOnce(mockUsers);

      // Mock successful metric updates
      jest.spyOn(influenceService, 'updateUserMetrics')
        .mockResolvedValue({} as MetricsUpdateResult);

      const result = await influenceService.bulkUpdateMetrics();

      expect(result.totalUsers).toBe(3);
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle partial failures gracefully', async () => {
      mockPrismaClient.userAccount.findMany.mockResolvedValueOnce(mockUsers);

      // Mock mixed success/failure
      jest.spyOn(influenceService, 'updateUserMetrics')
        .mockResolvedValueOnce({} as MetricsUpdateResult)
        .mockRejectedValueOnce(new Error('Database error'))
        .mockResolvedValueOnce({} as MetricsUpdateResult);

      const result = await influenceService.bulkUpdateMetrics();

      expect(result.totalUsers).toBe(3);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        userId: 'user2',
        error: 'Database error',
      });
    });

    it('should process users in batches', async () => {
      const manyUsers = Array.from({ length: 100 }, (_, i) => ({ id: `user${i}` }));
      mockPrismaClient.userAccount.findMany.mockResolvedValueOnce(manyUsers);

      jest.spyOn(influenceService, 'updateUserMetrics')
        .mockResolvedValue({} as MetricsUpdateResult);

      const result = await influenceService.bulkUpdateMetrics();

      expect(result.totalUsers).toBe(100);
      expect(result.successCount).toBe(100);
      // Verify batch processing (should be called in batches of 50)
      expect(influenceService.updateUserMetrics).toHaveBeenCalledTimes(100);
    });
  });

  describe('analyzeGrowthTrends', () => {
    it('should analyze growth trends correctly', async () => {
      jest.spyOn(influenceService, 'getUserMetrics')
        .mockResolvedValueOnce(mockInfluenceMetrics);

      const result = await influenceService.analyzeGrowthTrends(mockUserId, 'weekly');

      expect(result.period).toBe('weekly');
      expect(result.currentPeriod).toMatchObject({
        timestamp: expect.any(Date),
        followers: mockInfluenceMetrics.followerCount,
        engagement: mockInfluenceMetrics.engagementRate,
        approval: mockInfluenceMetrics.approvalRating,
        controversy: mockInfluenceMetrics.controversyLevel,
        trending: mockInfluenceMetrics.trendingScore,
      });
      expect(result.growthRate).toBeGreaterThanOrEqual(0);
      expect(['rising', 'stable', 'declining']).toContain(result.trend);
      expect(result.projectedMetrics).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should generate appropriate recommendations based on trends', async () => {
      const decliningMetrics = {
        ...mockInfluenceMetrics,
        engagementRate: 1.5, // Low engagement
        approvalRating: 50,  // Low approval
      };

      jest.spyOn(influenceService, 'getUserMetrics')
        .mockResolvedValueOnce(decliningMetrics);

      const result = await influenceService.analyzeGrowthTrends(mockUserId);

      expect(result.recommendations).toContain('Improve engagement by responding to comments');
      expect(result.recommendations).toContain('Post at optimal times when your audience is active');
    });
  });

  describe('Time-based Metrics and Historical Data', () => {
    it('should handle historical data absence gracefully', async () => {
      // Mock getUserMetrics to return valid metrics
      jest.spyOn(influenceService, 'getUserMetrics')
        .mockResolvedValueOnce(mockInfluenceMetrics);

      const result = await influenceService.analyzeGrowthTrends(mockUserId);

      expect(result.previousPeriod).toBeNull();
      expect(result.growthRate).toBe(0);
    });

    it('should calculate time-based growth metrics', async () => {
      const mockUserProfileWithAccount = {
        ...mockUserProfile,
        userAccount: { username: 'testuser' },
      };

      mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockUserProfileWithAccount);
      mockPrismaClient.post.aggregate.mockResolvedValue({
        _count: { id: 1 },
        _sum: { impressionCount: 1000, likeCount: 50, repostCount: 10, commentCount: 5 },
      });
      mockPrismaClient.post.findMany.mockResolvedValue([{ id: 'post1' }]);
      mockPrismaClient.reaction.groupBy.mockResolvedValue([]);
      mockPrismaClient.influenceMetrics.findUnique.mockResolvedValue(null);
      mockPrismaClient.influenceMetrics.upsert.mockResolvedValue({
        ...mockInfluenceMetrics,
        followerGrowthDaily: 5,
        followerGrowthWeekly: 35,
        followerGrowthMonthly: 150,
      });

      // Test that the service handles time-based calculations
      const result = await influenceService.updateUserMetrics(mockUserId);

      expect(result.metrics.followerGrowthDaily).toBeDefined();
      expect(result.metrics.followerGrowthWeekly).toBeDefined();
      expect(result.metrics.followerGrowthMonthly).toBeDefined();
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should maintain precision in calculations', () => {
      // Test precise calculations with decimal values
      const result = InfluenceMetricsModel.calculateEngagementRate(333, 167, 100, 10000);
      expect(result).toBe(6); // (333+167+100)/10000 * 100 = 6.00%
    });

    it('should handle floating point precision correctly', () => {
      const metrics = {
        ...mockInfluenceMetrics,
        followerCount: 999,
        engagementRate: 3.33333,
        approvalRating: 66.6667,
      };

      const result = InfluenceMetricsModel.calculateInfluenceScore(metrics);

      expect(Number.isInteger(result.score)).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should round values consistently', () => {
      // Test that all calculation methods round consistently
      const engagementRate = InfluenceMetricsModel.calculateEngagementRate(167, 167, 166, 1000);
      expect(engagementRate).toBe(50); // Should round to 2 decimal places: 50.00%

      const approvalRating = InfluenceMetricsModel.calculateApprovalRating(666, 1000, 0);
      expect(Number.isInteger(approvalRating)).toBe(true); // Should be rounded to integer
    });
  });

  describe('Political Alignment and Influence Propagation', () => {
    it('should calculate rankings within persona categories', async () => {
      const mockRankingsData = [{
        id: 'metrics1',
        userId: 'user1',
        followerCount: 10000,
        engagementRate: 8.5,
        influenceRank: 1,
        categoryRank: 1,
        user: {
          userAccount: { username: 'topuser' },
          userProfile: { displayName: 'Top User', personaType: PersonaType.INFLUENCER },
        },
      }];

      const mockCategoryData = [
        { ...mockRankingsData[0], user: { ...mockRankingsData[0].user, userProfile: { ...mockRankingsData[0].user.userProfile, personaType: PersonaType.POLITICIAN } } }
      ];

      mockRedis.get.mockResolvedValueOnce(null);
      mockPrismaClient.influenceMetrics.count.mockResolvedValueOnce(1);
      mockPrismaClient.influenceMetrics.findMany.mockResolvedValueOnce(mockCategoryData);

      const result = await influenceService.getInfluenceRankings({
        category: PersonaType.POLITICIAN
      });

      expect(result.rankings[0].personaType).toBe(PersonaType.POLITICIAN);
      expect(mockPrismaClient.influenceMetrics.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            user: {
              userProfile: {
                personaType: PersonaType.POLITICIAN,
              },
            },
          }),
        })
      );
    });

    it('should generate insights based on political metrics', () => {
      const politicianMetrics = {
        ...mockInfluenceMetrics,
        followerCount: 50000,
        engagementRate: 8.5,
        approvalRating: 85,
        controversyLevel: 15,
      };

      const insights = InfluenceMetricsModel.generateInsights(politicianMetrics);

      expect(insights.insights).toContain('Strong follower-to-following ratio indicates authentic influence');
      expect(insights.insights).toContain('Excellent engagement rate shows strong audience connection');
      expect(insights.insights).toContain('High approval rating indicates positive public perception');
      expect(insights.insights).toContain('Low controversy with good reach shows balanced approach');
    });
  });
});