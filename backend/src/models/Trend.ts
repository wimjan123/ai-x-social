import { z } from 'zod';
import {
  Trend as PrismaTrend,
  TrendCategory,
  NewsCategory,
  Prisma
} from '../generated/prisma';
import type { PrismaClient } from '../generated/prisma';

// ============================================================================
// ENUMS (Re-exported from Prisma)
// ============================================================================

export { TrendCategory } from '../generated/prisma';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const TrendCategorySchema = z.nativeEnum(TrendCategory);

export const TrendCreateSchema = z.object({
  hashtag: z.string().max(100).nullable().optional(),
  keyword: z.string().max(100).nullable().optional(),
  topic: z.string().min(1).max(100),
  postCount: z.number().int().min(0).default(0),
  uniqueUsers: z.number().int().min(0).default(0),
  impressionCount: z.number().int().min(0).default(0),
  engagementCount: z.number().int().min(0).default(0),
  trendScore: z.number().int().min(0).max(100).default(0),
  velocity: z.number().min(0).default(0),
  peakTime: z.date().nullable().optional(),
  category: TrendCategorySchema.default(TrendCategory.OTHER),
  region: z.string().max(100).nullable().optional(),
  language: z.string().length(2).default('en'),
  isPromoted: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  startedAt: z.date().default(() => new Date()),
  endedAt: z.date().nullable().optional(),
  lastUpdated: z.date().default(() => new Date())
});

export const TrendUpdateSchema = TrendCreateSchema.partial().omit({
  startedAt: true // Start time should not be updatable
});

export const TrendQuerySchema = z.object({
  category: TrendCategorySchema.optional(),
  region: z.string().max(100).optional(),
  language: z.string().length(2).optional(),
  minScore: z.number().int().min(0).max(100).optional(),
  maxScore: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(), // Trends without endedAt
  startedAfter: z.date().optional(),
  startedBefore: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

export interface TrendBase extends Omit<PrismaTrend, 'newsItems'> {}

export interface TrendWithRelations extends PrismaTrend {
  newsItems?: any[];
}

export interface TrendMetrics {
  postCount: number;
  uniqueUsers: number;
  impressionCount: number;
  engagementCount: number;
  velocity: number;
  peakTime?: Date;
}

export interface TrendSearchOptions {
  query?: string;
  category?: TrendCategory;
  region?: string;
  language?: string;
  scoreRange?: [number, number];
  timeRange?: [Date, Date];
  isActive?: boolean;
  isPromoted?: boolean;
  isHidden?: boolean;
  limit?: number;
  offset?: number;
}

export interface TrendLifecycle {
  phase: 'emerging' | 'growing' | 'peak' | 'declining' | 'ended';
  age: number; // hours since started
  timeToPeak?: number; // hours to reach peak
  peakDuration?: number; // hours at peak level
  estimatedEnd?: Date;
}

export interface TrendEngagement {
  hourlyData: Array<{
    hour: Date;
    posts: number;
    users: number;
    impressions: number;
    engagement: number;
  }>;
  peakHour: Date;
  growthRate: number;
  sustainabilityScore: number;
}

// ============================================================================
// BUSINESS LOGIC CLASS
// ============================================================================

export class TrendModel {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new trend with validation
   */
  async create(data: z.infer<typeof TrendCreateSchema>): Promise<TrendBase> {
    const validated = TrendCreateSchema.parse(data);

    return this.prisma.trend.create({
      data: validated as Prisma.TrendCreateInput
    });
  }

  /**
   * Update an existing trend
   */
  async update(id: string, data: z.infer<typeof TrendUpdateSchema>): Promise<TrendBase> {
    const validated = TrendUpdateSchema.parse(data);
    
    return this.prisma.trend.update({
      where: { id },
      data: {
        ...validated,
        lastUpdated: new Date()
      } as Prisma.TrendUpdateInput
    });
  }

  /**
   * Find trend by ID with optional relations
   */
  async findById(id: string, includeRelations = false): Promise<TrendWithRelations | null> {
    return this.prisma.trend.findUnique({
      where: { id },
      include: includeRelations ? {
        newsItems: true
      } : undefined
    });
  }

  /**
   * Find trend by topic
   */
  async findByTopic(topic: string): Promise<TrendBase | null> {
    return this.prisma.trend.findFirst({
      where: { 
        topic: {
          equals: topic,
          mode: 'insensitive'
        }
      },
      orderBy: { trendScore: 'desc' }
    });
  }

  /**
   * Get current trending topics
   */
  async getCurrentTrending(
    limit = 10,
    category?: TrendCategory,
    region?: string
  ): Promise<TrendBase[]> {
    const where: any = {
      isHidden: false,
      endedAt: null, // Only active trends
      lastUpdated: {
        gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Updated within 2 hours
      }
    };

    if (category) where.category = category;
    if (region) where.region = region;

    return this.prisma.trend.findMany({
      where,
      orderBy: [
        { trendScore: 'desc' },
        { velocity: 'desc' },
        { lastUpdated: 'desc' }
      ],
      take: limit
    });
  }

  /**
   * Search trends with advanced filtering
   */
  async search(options: TrendSearchOptions): Promise<TrendBase[]> {
    const {
      query,
      category,
      region,
      language,
      scoreRange,
      timeRange,
      isActive,
      isPromoted,
      isHidden,
      limit = 20,
      offset = 0
    } = options;

    const where: any = {};

    if (category) where.category = category;
    if (region) where.region = region;
    if (language) where.language = language;
    if (isPromoted !== undefined) where.isPromoted = isPromoted;
    if (isHidden !== undefined) where.isHidden = isHidden;

    if (isActive !== undefined) {
      where.endedAt = isActive ? null : { not: null };
    }

    if (scoreRange) {
      where.trendScore = {
        gte: scoreRange[0],
        lte: scoreRange[1]
      };
    }

    if (timeRange) {
      where.startedAt = {
        gte: timeRange[0],
        lte: timeRange[1]
      };
    }

    // Search across topic, hashtag, and keyword
    if (query) {
      where.OR = [
        { topic: { contains: query, mode: 'insensitive' } },
        { hashtag: { contains: query, mode: 'insensitive' } },
        { keyword: { contains: query, mode: 'insensitive' } }
      ];
    }

    return this.prisma.trend.findMany({
      where,
      orderBy: [
        { trendScore: 'desc' },
        { lastUpdated: 'desc' }
      ],
      take: limit,
      skip: offset
    });
  }

  /**
   * Update trend metrics
   */
  async updateMetrics(id: string, metrics: TrendMetrics): Promise<TrendBase> {
    return this.prisma.trend.update({
      where: { id },
      data: {
        postCount: metrics.postCount,
        uniqueUsers: metrics.uniqueUsers,
        impressionCount: metrics.impressionCount,
        engagementCount: metrics.engagementCount,
        velocity: metrics.velocity,
        peakTime: metrics.peakTime,
        trendScore: this.calculateTrendScore(metrics),
        lastUpdated: new Date()
      }
    });
  }

  /**
   * Mark a trend as ended
   */
  async endTrend(id: string): Promise<TrendBase> {
    return this.prisma.trend.update({
      where: { id },
      data: {
        endedAt: new Date(),
        lastUpdated: new Date()
      }
    });
  }

  /**
   * Get trending hashtags
   */
  async getTrendingHashtags(limit = 20, region?: string): Promise<TrendBase[]> {
    const where: any = {
      hashtag: { not: null },
      isHidden: false,
      endedAt: null
    };

    if (region) where.region = region;

    return this.prisma.trend.findMany({
      where,
      orderBy: { trendScore: 'desc' },
      take: limit
    });
  }

  /**
   * Get emerging trends (high velocity, low age)
   */
  async getEmergingTrends(limit = 10): Promise<TrendBase[]> {
    const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000); // Last 6 hours
    
    return this.prisma.trend.findMany({
      where: {
        startedAt: { gte: cutoff },
        isHidden: false,
        endedAt: null,
        velocity: { gte: 5 } // High velocity threshold
      },
      orderBy: [
        { velocity: 'desc' },
        { trendScore: 'desc' }
      ],
      take: limit
    });
  }

  /**
   * Calculate trend lifecycle phase
   */
  getTrendLifecycle(trend: TrendBase): TrendLifecycle {
    const now = new Date();
    const age = (now.getTime() - trend.startedAt.getTime()) / (1000 * 60 * 60); // hours
    
    let phase: TrendLifecycle['phase'];
    
    if (trend.endedAt) {
      phase = 'ended';
    } else if (trend.peakTime) {
      const timeSincePeak = (now.getTime() - trend.peakTime.getTime()) / (1000 * 60 * 60);
      if (timeSincePeak < 2) {
        phase = 'peak';
      } else {
        phase = trend.velocity > 1 ? 'declining' : 'ended';
      }
    } else if (age < 2) {
      phase = 'emerging';
    } else {
      phase = trend.velocity > 2 ? 'growing' : 'declining';
    }

    const timeToPeak = trend.peakTime ? 
      (trend.peakTime.getTime() - trend.startedAt.getTime()) / (1000 * 60 * 60) : 
      undefined;

    const estimatedEnd = phase === 'declining' ? 
      new Date(now.getTime() + (24 * 60 * 60 * 1000)) : // 24 hours from now
      undefined;

    return {
      phase,
      age,
      timeToPeak,
      estimatedEnd
    };
  }

  /**
   * Delete trend by ID
   */
  async delete(id: string): Promise<void> {
    await this.prisma.trend.delete({
      where: { id }
    });
  }

  /**
   * Get trend statistics
   */
  async getStats(timeRange?: [Date, Date]) {
    const where = timeRange ? {
      startedAt: {
        gte: timeRange[0],
        lte: timeRange[1]
      }
    } : {};

    const [total, active, byCategory, avgScore] = await Promise.all([
      this.prisma.trend.count({ where }),
      this.prisma.trend.count({ 
        where: { ...where, endedAt: null } 
      }),
      this.prisma.trend.groupBy({
        by: ['category'],
        where,
        _count: true
      }),
      this.prisma.trend.aggregate({
        where,
        _avg: { trendScore: true }
      })
    ]);

    return {
      total,
      active,
      ended: total - active,
      byCategory: Object.fromEntries(
        byCategory.map(item => [item.category, item._count])
      ),
      averageScore: avgScore._avg.trendScore || 0
    };
  }

  /**
   * Private method to calculate trend score
   */
  private calculateTrendScore(metrics: TrendMetrics): number {
    const {
      postCount,
      uniqueUsers,
      impressionCount,
      engagementCount,
      velocity
    } = metrics;

    // Weight factors for different metrics
    const postWeight = 0.3;
    const userWeight = 0.25;
    const impressionWeight = 0.2;
    const engagementWeight = 0.15;
    const velocityWeight = 0.1;

    // Normalize values (log scale for better distribution)
    const normalizedPosts = Math.min(40, Math.log10(postCount + 1) * 10);
    const normalizedUsers = Math.min(30, Math.log10(uniqueUsers + 1) * 8);
    const normalizedImpressions = Math.min(20, Math.log10(impressionCount + 1) * 4);
    const normalizedEngagement = Math.min(15, Math.log10(engagementCount + 1) * 3);
    const normalizedVelocity = Math.min(10, velocity * 2);

    const score = (
      normalizedPosts * postWeight +
      normalizedUsers * userWeight +
      normalizedImpressions * impressionWeight +
      normalizedEngagement * engagementWeight +
      normalizedVelocity * velocityWeight
    );

    return Math.min(100, Math.round(score));
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate trend velocity based on historical data
 */
export function calculateVelocity(
  currentMetrics: TrendMetrics,
  previousMetrics: TrendMetrics,
  timeInterval: number // hours
): number {
  const postGrowth = currentMetrics.postCount - previousMetrics.postCount;
  const userGrowth = currentMetrics.uniqueUsers - previousMetrics.uniqueUsers;
  
  // Average growth rate per hour
  const postVelocity = postGrowth / timeInterval;
  const userVelocity = userGrowth / timeInterval;
  
  // Combined velocity score
  return Math.max(0, (postVelocity * 0.6) + (userVelocity * 0.4));
}

/**
 * Detect if a topic is trending based on growth patterns
 */
export function detectTrendingTopic(
  topicHistory: Array<{ timestamp: Date; mentions: number; users: number }>,
  minGrowthRate = 2.0,
  minMentions = 10
): boolean {
  if (topicHistory.length < 2) return false;
  
  const latest = topicHistory[topicHistory.length - 1];
  const previous = topicHistory[topicHistory.length - 2];
  
  // Must have minimum activity
  if (latest.mentions < minMentions) return false;
  
  // Calculate growth rate
  const growthRate = latest.mentions / (previous.mentions || 1);
  
  return growthRate >= minGrowthRate;
}

/**
 * Extract hashtags from text content
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#([\w\u00c0-\u024f\u1e00-\u1eff]+)/gi;
  const matches = text.match(hashtagRegex);
  
  return matches ? 
    matches.map(tag => tag.toLowerCase()).filter((tag, index, self) => 
      self.indexOf(tag) === index // Remove duplicates
    ) : 
    [];
}

/**
 * Classify trend category based on content analysis
 */
export function classifyTrendCategory(
  topic: string,
  keywords: string[],
  newsCategories: NewsCategory[]
): TrendCategory {
  const topicLower = topic.toLowerCase();
  
  // Check for breaking news indicators
  if (keywords.some(k => ['breaking', 'urgent', 'alert', 'developing'].includes(k.toLowerCase()))) {
    return TrendCategory.BREAKING_NEWS;
  }
  
  // Map from news categories
  if (newsCategories.includes(NewsCategory.POLITICS)) {
    return TrendCategory.POLITICS;
  }
  if (newsCategories.includes(NewsCategory.SPORTS)) {
    return TrendCategory.SPORTS;
  }
  if (newsCategories.includes(NewsCategory.TECHNOLOGY)) {
    return TrendCategory.TECHNOLOGY;
  }
  if (newsCategories.includes(NewsCategory.ENTERTAINMENT)) {
    return TrendCategory.ENTERTAINMENT;
  }
  
  // Check for meme indicators
  if (keywords.some(k => ['meme', 'viral', 'funny', 'lol', '😂'].includes(k.toLowerCase()))) {
    return TrendCategory.MEME;
  }
  
  // Check for hashtag games
  if (topicLower.includes('game') || keywords.some(k => k.toLowerCase().includes('challenge'))) {
    return TrendCategory.HASHTAG_GAME;
  }
  
  return TrendCategory.OTHER;
}

/**
 * Calculate trend sustainability score
 */
export function calculateSustainabilityScore(
  trend: TrendBase,
  engagementHistory: TrendEngagement
): number {
  const age = (Date.now() - trend.startedAt.getTime()) / (1000 * 60 * 60); // hours
  const velocity = trend.velocity;
  const growthRate = engagementHistory.growthRate;
  
  let score = 50; // Base score
  
  // Sustained velocity over time indicates sustainability
  if (velocity > 5 && age > 4) score += 20;
  if (velocity > 10 && age > 8) score += 15;
  
  // Consistent growth rate
  if (growthRate > 0 && growthRate < 5) score += 10; // Steady growth
  if (growthRate > 10) score -= 10; // Too rapid might not sustain
  
  // Category-based adjustments
  switch (trend.category) {
    case TrendCategory.BREAKING_NEWS:
      score -= 20; // News trends are short-lived
      break;
    case TrendCategory.HASHTAG_GAME:
      score += 15; // Games tend to sustain longer
      break;
    case TrendCategory.MEME:
      score -= 10; // Memes can be short-lived
      break;
  }
  
  return Math.max(0, Math.min(100, score));
}

export default TrendModel;
