/**
 * News Routes - GET /api/news
 *
 * Implements news endpoint for fetching latest news items with regional filtering,
 * pagination, and category filtering following OpenAPI specification.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import NewsService from '../services/NewsService';
import { NewsCategory } from '../generated/prisma';
import { validateQuery } from '../lib/utils/validation';
import { logger } from '../lib/logger';

const router = Router();

// ============================================================================
// VALIDATION SCHEMAS (matching OpenAPI specification)
// ============================================================================

const getNewsQuerySchema = z.object({
  category: z
    .enum(['POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS', 'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'])
    .optional(),
  region: z
    .string()
    .optional()
    .refine((val) => !val || val === 'WORLDWIDE' || val.length === 2 || val.length === 3,
      'Region must be "WORLDWIDE" or valid ISO country code'),
  page: z
    .coerce
    .number()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z
    .coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot exceed 50')
    .default(20),
});

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

const newsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 news requests per window
  message: {
    error: 'Too many news requests',
    message: 'Please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatNewsResponse = (newsItem: any): any => {
  return {
    id: newsItem.id,
    title: newsItem.title,
    description: newsItem.description,
    content: newsItem.content,
    url: newsItem.url,
    sourceName: newsItem.sourceName,
    sourceUrl: newsItem.sourceUrl,
    author: newsItem.author,
    category: newsItem.category,
    topics: newsItem.topics || [],
    keywords: newsItem.keywords || [],
    entities: newsItem.entities || [],
    country: newsItem.country,
    region: newsItem.region,
    language: newsItem.language,
    sentimentScore: newsItem.sentimentScore,
    impactScore: newsItem.impactScore,
    controversyScore: newsItem.controversyScore,
    publishedAt: newsItem.publishedAt.toISOString(),
    discoveredAt: newsItem.discoveredAt.toISOString(),
    createdAt: newsItem.createdAt.toISOString(),
    aiSummary: newsItem.aiSummary,
    topicTags: newsItem.topicTags || []
  };
};

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * GET /api/news - Get latest news items
 */
router.get('/', newsRateLimit, validateQuery(getNewsQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, region, page, limit } = req.query as any;

    logger.info('Fetching news items', {
      category,
      region,
      page,
      limit
    });

    // Build search options for NewsService
    const searchOptions: any = {
      limit,
      fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    };

    if (category && category !== 'ALL') {
      searchOptions.category = category as NewsCategory;
    }

    if (region && region !== 'WORLDWIDE') {
      searchOptions.country = region;
    }

    // Get recent news from NewsService
    let newsItems = await NewsService.getRecentNews(searchOptions);

    // Apply pagination
    const offset = (page - 1) * limit;
    const total = newsItems.length;
    const paginatedNews = newsItems.slice(offset, offset + limit);

    const formattedNews = paginatedNews.map(formatNewsResponse);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const response = {
      news: formattedNews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      filters: {
        category: category || 'ALL',
        region: region || 'WORLDWIDE'
      }
    };

    logger.info('News items fetched successfully', {
      category,
      region,
      page,
      limit,
      newsCount: formattedNews.length,
      total
    });

    res.status(200).json(response);
  } catch (error: any) {
    logger.error('Failed to fetch news items:', error);

    if (error.message?.includes('No active news sources')) {
      return res.status(503).json({
        error: 'News service unavailable',
        message: 'No active news sources configured',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    if (error.message?.includes('validation') || error.message?.includes('Invalid')) {
      return res.status(400).json({
        error: 'Invalid request parameters',
        message: error.message || 'The provided parameters do not meet validation requirements',
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch news',
      message: 'An unexpected error occurred while fetching news items',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('News API error:', error);

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    const messages = error.issues.map((issue: any) =>
      `${issue.path.join('.')}: ${issue.message}`
    ).join(', ');

    return res.status(400).json({
      error: 'Validation error',
      message: messages,
      code: 'VALIDATION_ERROR'
    });
  }

  // Handle rate limit errors
  if (error.status === 429) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR'
  });
});

// ============================================================================
// CLEANUP
// ============================================================================

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  logger.info('Cleaning up news service connections...');
  // NewsService cleanup would go here if needed
});

process.on('SIGINT', async () => {
  logger.info('Cleaning up news service connections...');
  // NewsService cleanup would go here if needed
});

export default router;