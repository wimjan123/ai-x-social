/**
 * Trends Routes - GET /api/trends
 *
 * Implements trends endpoint for fetching trending topics with time window filtering,
 * regional trends, and category filtering following OpenAPI specification.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import TrendsService from '../services/TrendsService';
import { TrendCategory } from '../generated/prisma';
import { validateQuery } from '../lib/utils/validation';
import { logger } from '../lib/logger';

const router = Router();

// ============================================================================
// VALIDATION SCHEMAS (matching OpenAPI specification)
// ============================================================================

const getTrendsQuerySchema = z.object({
  region: z
    .string()
    .optional()
    .refine((val) => !val || val === 'WORLDWIDE' || val.length === 2 || val.length === 3,
      'Region must be "WORLDWIDE" or valid ISO country code'),
  category: z
    .enum(['BREAKING_NEWS', 'POLITICS', 'ENTERTAINMENT', 'SPORTS', 'TECHNOLOGY', 'MEME', 'HASHTAG_GAME', 'OTHER'])
    .optional(),
  timeframe: z
    .enum(['1h', '6h', '24h'])
    .default('24h'),
  limit: z
    .coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot exceed 50')
    .default(10),
});

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

const trendsRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 60, // Limit each IP to 60 trends requests per window
  message: {
    error: 'Too many trends requests',
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

const formatTrendResponse = (trend: any): any => {
  return {
    id: trend.id,
    hashtag: trend.hashtag,
    keyword: trend.keyword,
    topic: trend.topic,
    postCount: trend.postCount,
    uniqueUsers: trend.uniqueUsers,
    impressionCount: trend.impressionCount,
    engagementCount: trend.engagementCount,
    trendScore: trend.trendScore,
    velocity: trend.velocity,
    peakTime: trend.peakTime ? trend.peakTime.toISOString() : null,
    category: trend.category,
    region: trend.region,
    language: trend.language,
    isPromoted: trend.isPromoted,
    isHidden: trend.isHidden,
    startedAt: trend.startedAt.toISOString(),
    endedAt: trend.endedAt ? trend.endedAt.toISOString() : null,
    lastUpdated: trend.lastUpdated.toISOString()
  };
};

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * GET /api/trends - Get trending topics
 */
router.get('/', trendsRateLimit, validateQuery(getTrendsQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { region, category, timeframe, limit } = req.query as any;

    logger.info('Fetching trending topics', {
      region,
      category,
      timeframe,
      limit
    });

    // Build options for TrendsService
    const trendOptions: any = {
      timeWindow: timeframe,
      limit
    };

    if (region && region !== 'WORLDWIDE') {
      trendOptions.region = region;
    }

    if (category) {
      trendOptions.category = category as TrendCategory;
    }

    // Get trending topics from TrendsService
    let trends;

    if (region && region !== 'WORLDWIDE') {
      // Get regional trends
      trends = await TrendsService.getRegionalTrends(region, limit);
    } else if (category) {
      // Get trends by category
      trends = await TrendsService.getTrendingByCategory(category as TrendCategory, limit);
    } else {
      // Get general trending topics
      trends = await TrendsService.getTrendingTopics(trendOptions);
    }

    const formattedTrends = trends.map(formatTrendResponse);

    // Add metadata about the trends
    const response = formattedTrends.map(trend => ({
      ...trend,
      metadata: {
        timeframe,
        region: region || 'WORLDWIDE',
        category: category || 'ALL',
        calculatedAt: new Date().toISOString(),
        // Calculate trending direction based on velocity
        direction: trend.velocity > 5 ? 'rising' : trend.velocity > 1 ? 'stable' : 'declining',
        // Calculate relative strength
        strength: trend.trendScore > 80 ? 'strong' : trend.trendScore > 50 ? 'moderate' : 'weak'
      }
    }));

    logger.info('Trending topics fetched successfully', {
      region,
      category,
      timeframe,
      limit,
      trendsCount: formattedTrends.length
    });

    res.status(200).json(response);
  } catch (error: any) {
    logger.error('Failed to fetch trending topics:', error);

    if (error.message?.includes('validation') || error.message?.includes('Invalid')) {
      return res.status(400).json({
        error: 'Invalid request parameters',
        message: error.message || 'The provided parameters do not meet validation requirements',
        code: 'VALIDATION_ERROR'
      });
    }

    if (error.message?.includes('rate limit') || error.message?.includes('Rate limit')) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Trends calculation service is currently rate limited',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch trends',
      message: 'An unexpected error occurred while fetching trending topics',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/trends/history/:topic - Get trend history for a specific topic (bonus endpoint)
 */
router.get('/history/:topic', trendsRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic } = req.params;
    const days = parseInt(req.query.days as string) || 7;

    logger.info('Fetching trend history', { topic, days });

    const history = await TrendsService.getTrendHistory(topic, days);
    const formattedHistory = history.map(formatTrendResponse);

    logger.info('Trend history fetched successfully', {
      topic,
      days,
      historyCount: formattedHistory.length
    });

    res.status(200).json({
      topic,
      days,
      history: formattedHistory
    });
  } catch (error: any) {
    logger.error('Failed to fetch trend history:', error);

    if (error.message?.includes('not found')) {
      return res.status(404).json({
        error: 'Trend not found',
        message: 'No trend history found for the specified topic',
        code: 'NOT_FOUND_ERROR'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch trend history',
      message: 'An unexpected error occurred while fetching trend history',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/trends/categories - Get trending topics by all categories (bonus endpoint)
 */
router.get('/categories', trendsRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    logger.info('Fetching trends by categories', { limit });

    const categories = ['BREAKING_NEWS', 'POLITICS', 'ENTERTAINMENT', 'SPORTS', 'TECHNOLOGY', 'MEME', 'HASHTAG_GAME', 'OTHER'] as TrendCategory[];

    const categorizedTrends: any = {};

    // Get trends for each category
    await Promise.all(categories.map(async (category) => {
      try {
        const trends = await TrendsService.getTrendingByCategory(category, limit);
        categorizedTrends[category] = trends.map(formatTrendResponse);
      } catch (error) {
        logger.warn(`Failed to fetch trends for category ${category}:`, error);
        categorizedTrends[category] = [];
      }
    }));

    logger.info('Categorized trends fetched successfully', {
      limit,
      categoriesCount: Object.keys(categorizedTrends).length
    });

    res.status(200).json({
      categories: categorizedTrends,
      metadata: {
        limit,
        calculatedAt: new Date().toISOString(),
        timeframe: '24h'
      }
    });
  } catch (error: any) {
    logger.error('Failed to fetch categorized trends:', error);

    res.status(500).json({
      error: 'Failed to fetch categorized trends',
      message: 'An unexpected error occurred while fetching trends by categories',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Trends API error:', error);

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

  // Handle database connection errors
  if (error.message?.includes('connection') || error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Database connection error',
      code: 'SERVICE_UNAVAILABLE'
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
  logger.info('Cleaning up trends service connections...');
  // TrendsService cleanup would go here if needed
});

process.on('SIGINT', async () => {
  logger.info('Cleaning up trends service connections...');
  // TrendsService cleanup would go here if needed
});

export default router;