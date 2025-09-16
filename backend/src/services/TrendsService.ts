// TrendsService: Real-time trending topic detection and regional filtering
// Implements data-model.md:429-478 specifications for trend calculation

import { z } from 'zod';
import { PrismaClient, Trend as PrismaTrend, TrendCategory } from '../generated/prisma';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface TrendCalculationOptions {
  timeWindow: '1h' | '6h' | '24h';
  region?: string;
  language?: string;
  category?: TrendCategory;
  limit?: number;
}

interface TrendMetrics {
  postCount: number;
  uniqueUsers: number;
  impressionCount: number;
  engagementCount: number;
  velocity: number; // Posts per hour
  peakTime?: Date;
}

interface RawTrendData {
  hashtag?: string;
  keyword?: string;
  topic: string;
  region?: string;
  language: string;
  category: TrendCategory;
  metrics: TrendMetrics;
  timeWindow: string;
}

export class TrendsService {
  private static readonly CACHE_TTL = 300; // 5 minutes cache for trends
  private static readonly MIN_POSTS_THRESHOLD = 5; // Minimum posts to be considered trending
  private static readonly MIN_USERS_THRESHOLD = 3; // Minimum unique users to be considered trending
  private static readonly TREND_DECAY_HOURS = 48; // Hours after which trends are considered expired

  /**
   * Calculate trending topics with time window analysis
   */
  static async calculateTrends(options: TrendCalculationOptions = { timeWindow: '24h' }): Promise<PrismaTrend[]> {
    const cacheKey = `trends:${JSON.stringify(options)}`;

    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const timeWindowHours = this.parseTimeWindow(options.timeWindow);
    const startTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);

    // Get hashtag trends
    const hashtagTrends = await this.calculateHashtagTrends(startTime, options);

    // Get keyword trends
    const keywordTrends = await this.calculateKeywordTrends(startTime, options);

    // Get news topic trends
    const newsTopicTrends = await this.calculateNewsTopicTrends(startTime, options);

    // Combine and score all trends
    const allTrends = [...hashtagTrends, ...keywordTrends, ...newsTopicTrends];
    const scoredTrends = await this.scoreTrends(allTrends, timeWindowHours);

    // Filter and sort by trend score
    const validTrends = scoredTrends
      .filter(trend => trend.metrics.postCount >= this.MIN_POSTS_THRESHOLD)
      .filter(trend => trend.metrics.uniqueUsers >= this.MIN_USERS_THRESHOLD)
      .sort((a, b) => b.metrics.velocity - a.metrics.velocity)
      .slice(0, options.limit || 50);

    // Store or update trends in database
    const savedTrends = await this.storeOrUpdateTrends(validTrends);

    // Cache the results
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(savedTrends));

    return savedTrends;
  }

  /**
   * Calculate hashtag trends from posts
   */
  private static async calculateHashtagTrends(
    startTime: Date,
    options: TrendCalculationOptions
  ): Promise<RawTrendData[]> {
    const whereClause: any = {
      publishedAt: { gte: startTime },
      isHidden: false,
      hashtags: { not: { equals: [] } }
    };

    if (options.region) {
      // We'll need to join with user profile for location
      whereClause.author = {
        profile: {
          location: { contains: options.region }
        }
      };
    }

    // Get all posts with hashtags in the time window
    const posts = await prisma.post.findMany({
      where: whereClause,
      select: {
        id: true,
        hashtags: true,
        authorId: true,
        publishedAt: true,
        likeCount: true,
        repostCount: true,
        commentCount: true,
        impressionCount: true,
        author: {
          select: {
            profile: {
              select: {
                location: true
              }
            }
          }
        }
      }
    });

    // Aggregate hashtag metrics
    const hashtagMetrics: { [hashtag: string]: TrendMetrics & { posts: any[] } } = {};

    posts.forEach(post => {
      post.hashtags.forEach(hashtag => {
        if (!hashtagMetrics[hashtag]) {
          hashtagMetrics[hashtag] = {
            postCount: 0,
            uniqueUsers: new Set<string>().size,
            impressionCount: 0,
            engagementCount: 0,
            velocity: 0,
            posts: []
          };
        }

        hashtagMetrics[hashtag].postCount++;
        hashtagMetrics[hashtag].posts.push(post);
        hashtagMetrics[hashtag].impressionCount += post.impressionCount;
        hashtagMetrics[hashtag].engagementCount += post.likeCount + post.repostCount + post.commentCount;
      });
    });

    // Calculate unique users and velocity for each hashtag
    const trends: RawTrendData[] = [];

    for (const [hashtag, metrics] of Object.entries(hashtagMetrics)) {
      const uniqueUsers = new Set(metrics.posts.map(p => p.authorId)).size;
      const timeSpanHours = this.parseTimeWindow(options.timeWindow);
      const velocity = metrics.postCount / timeSpanHours;

      // Find peak time
      const hourlyDistribution = this.getHourlyDistribution(metrics.posts);
      const peakHour = Object.entries(hourlyDistribution).reduce((a, b) =>
        hourlyDistribution[a[0]] > hourlyDistribution[b[0]] ? a : b
      )[0];

      trends.push({
        hashtag,
        topic: hashtag,
        region: options.region,
        language: options.language || 'en',
        category: this.categorizeHashtag(hashtag),
        metrics: {
          postCount: metrics.postCount,
          uniqueUsers,
          impressionCount: metrics.impressionCount,
          engagementCount: metrics.engagementCount,
          velocity,
          peakTime: new Date(parseInt(peakHour))
        },
        timeWindow: options.timeWindow
      });
    }

    return trends;
  }

  /**
   * Calculate keyword trends from posts and news
   */
  private static async calculateKeywordTrends(
    startTime: Date,
    options: TrendCalculationOptions
  ): Promise<RawTrendData[]> {
    // Get keywords from posts
    const posts = await prisma.$queryRaw<Array<{
      keyword: string;
      post_count: bigint;
      unique_users: bigint;
      total_impressions: bigint;
      total_engagement: bigint;
    }>>`
      SELECT
        UNNEST(string_to_array(lower(regexp_replace(content, '[^a-zA-Z0-9\\s]', ' ', 'g')), ' ')) as keyword,
        COUNT(DISTINCT id) as post_count,
        COUNT(DISTINCT author_id) as unique_users,
        SUM(impression_count) as total_impressions,
        SUM(like_count + repost_count + comment_count) as total_engagement
      FROM posts
      WHERE published_at >= ${startTime}
        AND is_hidden = false
        AND LENGTH(UNNEST(string_to_array(lower(regexp_replace(content, '[^a-zA-Z0-9\\s]', ' ', 'g')), ' '))) > 3
      GROUP BY keyword
      HAVING COUNT(DISTINCT id) >= ${this.MIN_POSTS_THRESHOLD}
        AND COUNT(DISTINCT author_id) >= ${this.MIN_USERS_THRESHOLD}
      ORDER BY post_count DESC, total_engagement DESC
      LIMIT 100
    `;

    const timeSpanHours = this.parseTimeWindow(options.timeWindow);

    return posts.map(row => ({
      keyword: row.keyword,
      topic: row.keyword,
      region: options.region,
      language: options.language || 'en',
      category: this.categorizeKeyword(row.keyword),
      metrics: {
        postCount: Number(row.post_count),
        uniqueUsers: Number(row.unique_users),
        impressionCount: Number(row.total_impressions),
        engagementCount: Number(row.total_engagement),
        velocity: Number(row.post_count) / timeSpanHours
      },
      timeWindow: options.timeWindow
    }));
  }

  /**
   * Calculate news topic trends
   */
  private static async calculateNewsTopicTrends(
    startTime: Date,
    options: TrendCalculationOptions
  ): Promise<RawTrendData[]> {
    const whereClause: any = {
      publishedAt: { gte: startTime }
    };

    if (options.region) {
      whereClause.country = options.region;
    }
    if (options.language) {
      whereClause.language = options.language;
    }

    const newsTopics = await prisma.$queryRaw<Array<{
      topic: string;
      news_count: bigint;
      category: TrendCategory;
      avg_impact: number;
      total_controversy: number;
    }>>`
      SELECT
        UNNEST(topics) as topic,
        COUNT(*) as news_count,
        category,
        AVG(impact_score) as avg_impact,
        SUM(controversy_score) as total_controversy
      FROM news_items
      WHERE published_at >= ${startTime}
        ${options.region ? Prisma.sql`AND country = ${options.region}` : Prisma.empty}
        ${options.language ? Prisma.sql`AND language = ${options.language}` : Prisma.empty}
        AND array_length(topics, 1) > 0
      GROUP BY topic, category
      HAVING COUNT(*) >= 2
      ORDER BY news_count DESC, avg_impact DESC
      LIMIT 50
    `;

    const timeSpanHours = this.parseTimeWindow(options.timeWindow);

    return newsTopics.map(row => ({
      topic: row.topic,
      region: options.region,
      language: options.language || 'en',
      category: row.category,
      metrics: {
        postCount: Number(row.news_count),
        uniqueUsers: Number(row.news_count), // For news, each article is from a different "user" (source)
        impressionCount: Number(row.news_count) * 1000, // Estimate based on news reach
        engagementCount: Number(row.total_controversy), // Use controversy as engagement proxy
        velocity: Number(row.news_count) / timeSpanHours
      },
      timeWindow: options.timeWindow
    }));
  }

  /**
   * Score trends based on multiple factors
   */
  private static async scoreTrends(trends: RawTrendData[], timeWindowHours: number): Promise<RawTrendData[]> {
    return trends.map(trend => {
      const metrics = trend.metrics;

      // Base score components
      const velocityScore = Math.min(metrics.velocity * 10, 50); // Max 50 points for velocity
      const engagementScore = Math.min(metrics.engagementCount / 100, 30); // Max 30 points for engagement
      const uniquenessScore = Math.min(metrics.uniqueUsers * 2, 20); // Max 20 points for user diversity

      // Calculate trend score (0-100)
      const trendScore = Math.min(100, velocityScore + engagementScore + uniquenessScore);

      return {
        ...trend,
        metrics: {
          ...metrics,
          velocity: Math.round(metrics.velocity * 100) / 100 // Round to 2 decimal places
        },
        trendScore
      };
    });
  }

  /**
   * Store or update trends in database
   */
  private static async storeOrUpdateTrends(trends: (RawTrendData & { trendScore: number })[]): Promise<PrismaTrend[]> {
    const savedTrends: PrismaTrend[] = [];

    for (const trendData of trends) {
      // Check if trend already exists
      const existing = await prisma.trend.findFirst({
        where: {
          OR: [
            { hashtag: trendData.hashtag },
            { keyword: trendData.keyword },
            { topic: trendData.topic }
          ],
          region: trendData.region,
          language: trendData.language,
          endedAt: null // Only consider active trends
        }
      });

      if (existing) {
        // Update existing trend
        const updated = await prisma.trend.update({
          where: { id: existing.id },
          data: {
            postCount: trendData.metrics.postCount,
            uniqueUsers: trendData.metrics.uniqueUsers,
            impressionCount: trendData.metrics.impressionCount,
            engagementCount: trendData.metrics.engagementCount,
            trendScore: trendData.trendScore,
            velocity: trendData.metrics.velocity,
            peakTime: trendData.metrics.peakTime,
            lastUpdated: new Date()
          }
        });
        savedTrends.push(updated);
      } else {
        // Create new trend
        const created = await prisma.trend.create({
          data: {
            hashtag: trendData.hashtag,
            keyword: trendData.keyword,
            topic: trendData.topic,
            postCount: trendData.metrics.postCount,
            uniqueUsers: trendData.metrics.uniqueUsers,
            impressionCount: trendData.metrics.impressionCount,
            engagementCount: trendData.metrics.engagementCount,
            trendScore: trendData.trendScore,
            velocity: trendData.metrics.velocity,
            peakTime: trendData.metrics.peakTime,
            category: trendData.category,
            region: trendData.region,
            language: trendData.language,
            isPromoted: false,
            isHidden: false,
            startedAt: new Date(),
            lastUpdated: new Date()
          }
        });
        savedTrends.push(created);
      }
    }

    return savedTrends;
  }

  /**
   * Get current trending topics with caching
   */
  static async getTrendingTopics(options: TrendCalculationOptions = { timeWindow: '24h' }): Promise<PrismaTrend[]> {
    const trends = await prisma.trend.findMany({
      where: {
        isHidden: false,
        endedAt: null,
        region: options.region,
        language: options.language,
        category: options.category,
        lastUpdated: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Updated within last hour
        }
      },
      orderBy: [
        { trendScore: 'desc' },
        { velocity: 'desc' },
        { engagementCount: 'desc' }
      ],
      take: options.limit || 10
    });

    // If no recent trends, calculate new ones
    if (trends.length === 0) {
      return await this.calculateTrends(options);
    }

    return trends;
  }

  /**
   * Get regional trends
   */
  static async getRegionalTrends(region: string, limit: number = 10): Promise<PrismaTrend[]> {
    return await this.getTrendingTopics({
      timeWindow: '24h',
      region,
      limit
    });
  }

  /**
   * Get trending topics by category
   */
  static async getTrendingByCategory(category: TrendCategory, limit: number = 10): Promise<PrismaTrend[]> {
    return await this.getTrendingTopics({
      timeWindow: '24h',
      category,
      limit
    });
  }

  /**
   * Background job to update trend scores
   */
  static async updateTrendScores(): Promise<void> {
    const activeTrends = await prisma.trend.findMany({
      where: {
        endedAt: null,
        lastUpdated: {
          lt: new Date(Date.now() - 30 * 60 * 1000) // Not updated in last 30 minutes
        }
      }
    });

    for (const trend of activeTrends) {
      try {
        // Recalculate metrics for this specific trend
        const options: TrendCalculationOptions = {
          timeWindow: '24h',
          region: trend.region || undefined,
          language: trend.language
        };

        const updated = await this.calculateTrends(options);
        const matching = updated.find(t =>
          t.hashtag === trend.hashtag ||
          t.keyword === trend.keyword ||
          t.topic === trend.topic
        );

        if (matching) {
          await prisma.trend.update({
            where: { id: trend.id },
            data: {
              postCount: matching.postCount,
              uniqueUsers: matching.uniqueUsers,
              impressionCount: matching.impressionCount,
              engagementCount: matching.engagementCount,
              trendScore: matching.trendScore,
              velocity: matching.velocity,
              lastUpdated: new Date()
            }
          });
        } else {
          // Trend no longer active, mark as ended
          await prisma.trend.update({
            where: { id: trend.id },
            data: {
              endedAt: new Date()
            }
          });
        }
      } catch (error) {
        console.error(`Failed to update trend ${trend.id}:`, error);
      }
    }
  }

  /**
   * Cleanup expired trends
   */
  static async cleanupExpiredTrends(): Promise<number> {
    const expiredTime = new Date(Date.now() - this.TREND_DECAY_HOURS * 60 * 60 * 1000);

    const result = await prisma.trend.updateMany({
      where: {
        endedAt: null,
        startedAt: {
          lt: expiredTime
        }
      },
      data: {
        endedAt: new Date()
      }
    });

    return result.count;
  }

  /**
   * Get trend history for a specific topic
   */
  static async getTrendHistory(topic: string, days: number = 7): Promise<PrismaTrend[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return await prisma.trend.findMany({
      where: {
        OR: [
          { hashtag: topic },
          { keyword: topic },
          { topic: topic }
        ],
        startedAt: {
          gte: startDate
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
  }

  /**
   * Helper methods
   */
  private static parseTimeWindow(timeWindow: string): number {
    switch (timeWindow) {
      case '1h': return 1;
      case '6h': return 6;
      case '24h': return 24;
      default: return 24;
    }
  }

  private static getHourlyDistribution(posts: any[]): { [hour: string]: number } {
    const distribution: { [hour: string]: number } = {};

    posts.forEach(post => {
      const hour = new Date(post.publishedAt).getHours();
      const hourKey = hour.toString();
      distribution[hourKey] = (distribution[hourKey] || 0) + 1;
    });

    return distribution;
  }

  private static categorizeHashtag(hashtag: string): TrendCategory {
    const tag = hashtag.toLowerCase();

    if (tag.match(/politic|election|vote|campaign|government|congress|senate/)) {
      return TrendCategory.POLITICS;
    }
    if (tag.match(/breaking|news|urgent|alert/)) {
      return TrendCategory.BREAKING_NEWS;
    }
    if (tag.match(/sports|game|team|championship|league/)) {
      return TrendCategory.SPORTS;
    }
    if (tag.match(/entertainment|movie|music|celebrity|show/)) {
      return TrendCategory.ENTERTAINMENT;
    }
    if (tag.match(/tech|technology|ai|software|digital/)) {
      return TrendCategory.TECHNOLOGY;
    }
    if (tag.match(/funny|lol|meme|joke|humor/)) {
      return TrendCategory.MEME;
    }
    if (tag.match(/game|challenge|question|ask/)) {
      return TrendCategory.HASHTAG_GAME;
    }

    return TrendCategory.OTHER;
  }

  private static categorizeKeyword(keyword: string): TrendCategory {
    return this.categorizeHashtag(keyword); // Same logic for now
  }
}

export default TrendsService;