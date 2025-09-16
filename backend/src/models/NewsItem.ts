import { z } from 'zod';
import {
  type NewsItem as PrismaNewsItem,
  NewsCategory,
  TrendCategory,
  Prisma
} from '../generated/prisma';
import type { PrismaClient } from '../generated/prisma';

// ============================================================================
// ENUMS (Re-exported from Prisma)
// ============================================================================

export { NewsCategory } from '../generated/prisma';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const NewsCategorySchema = z.nativeEnum(NewsCategory);

export const NewsItemCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  content: z.string().nullable().optional(),
  url: z.string().url().max(512),
  sourceName: z.string().min(1).max(100),
  sourceUrl: z.string().url().max(512),
  author: z.string().max(100).nullable().optional(),
  category: NewsCategorySchema.default(NewsCategory.WORLD),
  topics: z.array(z.string().max(100)).default([]),
  keywords: z.array(z.string().max(50)).default([]),
  entities: z.array(z.string().max(100)).default([]),
  country: z.string().length(2).nullable().optional(), // ISO 3166-1
  region: z.string().max(100).nullable().optional(),
  language: z.string().length(2).default('en'), // ISO 639-1
  sentimentScore: z.number().min(-1).max(1).default(0),
  impactScore: z.number().int().min(0).max(100).default(0),
  controversyScore: z.number().int().min(0).max(100).default(0),
  publishedAt: z.date(),
  discoveredAt: z.date().default(() => new Date()),
  aiSummary: z.string().nullable().optional(),
  topicTags: z.array(z.string().max(50)).default([])
});

export const NewsItemUpdateSchema = NewsItemCreateSchema.partial().omit({
  url: true // URL should not be updatable
});

export const NewsItemQuerySchema = z.object({
  category: NewsCategorySchema.optional(),
  country: z.string().length(2).optional(),
  region: z.string().max(100).optional(),
  language: z.string().length(2).optional(),
  sentimentMin: z.number().min(-1).max(1).optional(),
  sentimentMax: z.number().min(-1).max(1).optional(),
  impactMin: z.number().int().min(0).max(100).optional(),
  impactMax: z.number().int().min(0).max(100).optional(),
  publishedAfter: z.date().optional(),
  publishedBefore: z.date().optional(),
  topics: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

export interface NewsItemBase extends Omit<PrismaNewsItem, 'trends' | 'relatedPosts'> {}

export interface NewsItemWithRelations extends PrismaNewsItem {
  trends?: any[];
  relatedPosts?: any[];
}

export interface NewsSearchOptions {
  query?: string;
  category?: NewsCategory;
  country?: string;
  region?: string;
  language?: string;
  sentimentRange?: [number, number];
  impactRange?: [number, number];
  dateRange?: [Date, Date];
  topics?: string[];
  keywords?: string[];
  limit?: number;
  offset?: number;
}

export interface NewsAnalysis {
  sentimentScore: number;
  impactScore: number;
  controversyScore: number;
  topics: string[];
  entities: string[];
  keywords: string[];
  summary?: string;
}

// ============================================================================
// BUSINESS LOGIC CLASS
// ============================================================================

export class NewsItemModel {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new news item with validation
   */
  async create(data: z.infer<typeof NewsItemCreateSchema>): Promise<NewsItemBase> {
    const validated = NewsItemCreateSchema.parse(data);

    return this.prisma.newsItem.create({
      data: validated as Prisma.NewsItemCreateInput
    });
  }

  /**
   * Update an existing news item
   */
  async update(id: string, data: z.infer<typeof NewsItemUpdateSchema>): Promise<NewsItemBase> {
    const validated = NewsItemUpdateSchema.parse(data);

    return this.prisma.newsItem.update({
      where: { id },
      data: validated as Prisma.NewsItemUpdateInput
    });
  }

  /**
   * Find news item by ID with optional relations
   */
  async findById(id: string, includeRelations = false): Promise<NewsItemWithRelations | null> {
    if (includeRelations) {
      return this.prisma.newsItem.findUnique({
        where: { id },
        include: {
          trends: true,
          relatedPosts: true
        }
      });
    } else {
      return this.prisma.newsItem.findUnique({
        where: { id }
      });
    }
  }

  /**
   * Find news item by URL (unique constraint)
   */
  async findByUrl(url: string): Promise<NewsItemBase | null> {
    return this.prisma.newsItem.findUnique({
      where: { url }
    });
  }

  /**
   * Search news items with advanced filtering
   */
  async search(options: NewsSearchOptions): Promise<NewsItemBase[]> {
    const {
      query,
      category,
      country,
      region,
      language,
      sentimentRange,
      impactRange,
      dateRange,
      topics,
      keywords,
      limit = 20,
      offset = 0
    } = options;

    const where: any = {};

    if (category) where.category = category;
    if (country) where.country = country;
    if (region) where.region = region;
    if (language) where.language = language;

    if (sentimentRange) {
      where.sentimentScore = {
        gte: sentimentRange[0],
        lte: sentimentRange[1]
      };
    }

    if (impactRange) {
      where.impactScore = {
        gte: impactRange[0],
        lte: impactRange[1]
      };
    }

    if (dateRange) {
      where.publishedAt = {
        gte: dateRange[0],
        lte: dateRange[1]
      };
    }

    if (topics && topics.length > 0) {
      where.topics = {
        hasSome: topics
      };
    }

    if (keywords && keywords.length > 0) {
      where.keywords = {
        hasSome: keywords
      };
    }

    // Full-text search across title and description
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ];
    }

    return this.prisma.newsItem.findMany({
      where,
      orderBy: [
        { publishedAt: 'desc' },
        { impactScore: 'desc' }
      ],
      take: limit,
      skip: offset
    });
  }

  /**
   * Get trending news by impact and recency
   */
  async getTrending(limit = 10, category?: NewsCategory): Promise<NewsItemBase[]> {
    const where: any = {
      publishedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    };

    if (category) {
      where.category = category;
    }

    return this.prisma.newsItem.findMany({
      where,
      orderBy: [
        { impactScore: 'desc' },
        { controversyScore: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: limit
    });
  }

  /**
   * Get news by sentiment range
   */
  async getBySentiment(
    sentimentMin: number,
    sentimentMax: number,
    limit = 20
  ): Promise<NewsItemBase[]> {
    return this.prisma.newsItem.findMany({
      where: {
        sentimentScore: {
          gte: sentimentMin,
          lte: sentimentMax
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    });
  }

  /**
   * Update AI analysis for a news item
   */
  async updateAnalysis(id: string, analysis: NewsAnalysis): Promise<NewsItemBase> {
    return this.prisma.newsItem.update({
      where: { id },
      data: {
        sentimentScore: analysis.sentimentScore,
        impactScore: analysis.impactScore,
        controversyScore: analysis.controversyScore,
        topicTags: analysis.topics,
        entities: analysis.entities,
        keywords: analysis.keywords,
        aiSummary: analysis.summary
      }
    });
  }

  /**
   * Delete news item by ID
   */
  async delete(id: string): Promise<void> {
    await this.prisma.newsItem.delete({
      where: { id }
    });
  }

  /**
   * Get news statistics
   */
  async getStats(timeRange?: [Date, Date]) {
    const where = timeRange ? {
      publishedAt: {
        gte: timeRange[0],
        lte: timeRange[1]
      }
    } : {};

    const [total, byCategory, avgSentiment, avgImpact] = await Promise.all([
      this.prisma.newsItem.count({ where }),
      this.prisma.newsItem.groupBy({
        by: ['category'],
        where,
        _count: true
      }),
      this.prisma.newsItem.aggregate({
        where,
        _avg: { sentimentScore: true }
      }),
      this.prisma.newsItem.aggregate({
        where,
        _avg: { impactScore: true }
      })
    ]);

    return {
      total,
      byCategory: Object.fromEntries(
        byCategory.map(item => [item.category, item._count])
      ),
      averageSentiment: avgSentiment._avg.sentimentScore || 0,
      averageImpact: avgImpact._avg.impactScore || 0
    };
  }

  /**
   * Check if news item exists by URL
   */
  async exists(url: string): Promise<boolean> {
    const count = await this.prisma.newsItem.count({
      where: { url }
    });
    return count > 0;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract keywords from news content using simple text analysis
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  // Simple keyword extraction - in production, use NLP library
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Calculate impact score based on various factors
 */
export function calculateImpactScore(
  sourceTier: 'major' | 'regional' | 'local' | 'blog',
  shareCount: number,
  commentCount: number,
  timeRecency: number // hours since publication
): number {
  let baseScore = 0;
  
  // Source tier scoring
  switch (sourceTier) {
    case 'major': baseScore = 70; break;
    case 'regional': baseScore = 50; break;
    case 'local': baseScore = 30; break;
    case 'blog': baseScore = 10; break;
  }

  // Engagement boost
  const engagementScore = Math.min(30, Math.log10(shareCount + commentCount + 1) * 10);
  
  // Recency penalty (older news gets lower impact)
  const recencyMultiplier = Math.max(0.1, 1 - (timeRecency / 72)); // 72 hours decay

  return Math.min(100, Math.round((baseScore + engagementScore) * recencyMultiplier));
}

/**
 * Determine controversy score based on sentiment variance and topic sensitivity
 */
export function calculateControversyScore(
  sentimentVariance: number,
  politicalTopics: string[],
  socialTopics: string[]
): number {
  let score = 0;

  // High sentiment variance indicates controversy
  score += sentimentVariance * 50;

  // Political topics are inherently more controversial
  score += politicalTopics.length * 15;
  
  // Social issues can also be controversial
  score += socialTopics.length * 10;

  return Math.min(100, Math.round(score));
}

// ============================================================================
// SEARCH AND INDEXING UTILITIES
// ============================================================================

/**
 * Build full-text search index for news items
 */
export function buildSearchIndex(newsItems: NewsItemBase[]) {
  return newsItems.map(item => ({
    id: item.id,
    searchText: [
      item.title,
      item.description,
      item.content,
      ...item.topics,
      ...item.keywords,
      ...item.entities
    ].filter(Boolean).join(' ').toLowerCase(),
    category: item.category,
    publishedAt: item.publishedAt,
    impactScore: item.impactScore
  }));
}

/**
 * Perform fuzzy search on news items
 */
export function fuzzySearch(
  query: string,
  searchIndex: ReturnType<typeof buildSearchIndex>,
  threshold = 0.3
) {
  const queryWords = query.toLowerCase().split(/\s+/);
  
  return searchIndex
    .map(item => {
      const matchScore = queryWords.reduce((score, word) => {
        return score + (item.searchText.includes(word) ? 1 : 0);
      }, 0) / queryWords.length;
      
      return { ...item, matchScore };
    })
    .filter(item => item.matchScore >= threshold)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export default NewsItemModel;
