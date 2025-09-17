/**
 * Content Moderation Middleware
 * Automatically moderates content before processing
 */

import { Request, Response, NextFunction } from 'express';
import { contentModerationService, ModerationResult } from '@/services/ContentModerationService';
import { logger } from '@/lib/logger';
import { ApiResponse } from '@/lib/types';

export interface ModeratedRequest extends Request {
  moderationResult?: ModerationResult;
}

/**
 * Middleware to moderate text content in request body
 */
export function moderateContent(contentField: string = 'content') {
  return async (req: ModeratedRequest, res: Response, next: NextFunction) => {
    try {
      const content = req.body[contentField];

      if (!content || typeof content !== 'string') {
        return next(); // Skip moderation if no content to moderate
      }

      // Perform content moderation
      const moderationResult = await contentModerationService.moderateContent({
        text: content,
        metadata: {
          authorId: req.user?.id || 'anonymous',
          postType: 'user_content',
          timestamp: new Date().toISOString()
        }
      });

      // Store moderation result for use in route handler
      req.moderationResult = moderationResult;

      // Block content if flagged as high risk
      if (moderationResult.isBlocked) {
        const response: ApiResponse = {
          success: false,
          error: 'Content violates community guidelines',
          data: {
            reasons: moderationResult.reasons,
            categories: moderationResult.categories,
            severity: moderationResult.severity
          }
        };

        logger.warn('Content blocked by moderation', {
          authorId: req.user?.id,
          content: content.substring(0, 100) + '...', // Log first 100 chars
          reasons: moderationResult.reasons,
          confidence: moderationResult.confidence,
          requestId: res.locals?.requestId
        });

        return res.status(400).json(response);
      }

      // Log flagged content but allow through
      if (moderationResult.suggestedAction === 'flag' || moderationResult.confidence > 0.4) {
        logger.info('Content flagged but allowed', {
          authorId: req.user?.id,
          reasons: moderationResult.reasons,
          confidence: moderationResult.confidence,
          suggestedAction: moderationResult.suggestedAction,
          requestId: res.locals?.requestId
        });
      }

      next();
    } catch (error) {
      logger.error('Content moderation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        authorId: req.user?.id,
        requestId: res.locals?.requestId
      });

      // On moderation service failure, allow content through but log the issue
      next();
    }
  };
}

/**
 * Middleware to check user reputation and posting limits
 */
export function checkUserLimits() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(); // Skip for anonymous users
      }

      // Check posting rate limits (posts per hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentPostCount = await (req as any).prisma?.post.count({
        where: {
          authorId: userId,
          createdAt: {
            gte: oneHourAgo
          }
        }
      }) || 0;

      // Rate limit: 30 posts per hour for regular users
      const rateLimit = 30;
      if (recentPostCount >= rateLimit) {
        const response: ApiResponse = {
          success: false,
          error: 'Posting rate limit exceeded. Please wait before posting again.',
          data: {
            limit: rateLimit,
            current: recentPostCount,
            resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
          }
        };

        logger.warn('User posting rate limit exceeded', {
          userId,
          postCount: recentPostCount,
          limit: rateLimit,
          requestId: res.locals?.requestId
        });

        return res.status(429).json(response);
      }

      next();
    } catch (error) {
      logger.error('User limits check failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
        requestId: res.locals?.requestId
      });

      // On failure, allow request through
      next();
    }
  };
}

/**
 * Middleware to validate content length and format
 */
export function validateContentFormat(maxLength: number = 2000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const content = req.body.content;

    if (!content) {
      const response: ApiResponse = {
        success: false,
        error: 'Content is required',
        data: null
      };
      return res.status(400).json(response);
    }

    if (typeof content !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Content must be a string',
        data: null
      };
      return res.status(400).json(response);
    }

    // Check length
    if (content.length > maxLength) {
      const response: ApiResponse = {
        success: false,
        error: `Content exceeds maximum length of ${maxLength} characters`,
        data: {
          currentLength: content.length,
          maxLength
        }
      };
      return res.status(400).json(response);
    }

    // Check for empty/whitespace-only content
    if (content.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Content cannot be empty',
        data: null
      };
      return res.status(400).json(response);
    }

    next();
  };
}

/**
 * Middleware to sanitize content
 */
export function sanitizeContent(contentField: string = 'content') {
  return (req: Request, res: Response, next: NextFunction) => {
    const content = req.body[contentField];

    if (content && typeof content === 'string') {
      // Basic sanitization
      let sanitized = content
        .trim()
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Remove null characters
        .replace(/\0/g, '')
        // Remove control characters except newlines and tabs
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

      req.body[contentField] = sanitized;
    }

    next();
  };
}

/**
 * Middleware for content reporting
 */
export function handleContentReport() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contentId, reason, category } = req.body;
      const reporterId = req.user?.id;

      if (!reporterId) {
        const response: ApiResponse = {
          success: false,
          error: 'Authentication required to report content',
          data: null
        };
        return res.status(401).json(response);
      }

      if (!contentId || !reason || !category) {
        const response: ApiResponse = {
          success: false,
          error: 'contentId, reason, and category are required',
          data: null
        };
        return res.status(400).json(response);
      }

      // Submit the report
      await contentModerationService.reportContent(contentId, reporterId, reason, category);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Content report submitted successfully',
          reportId: `report_${Date.now()}`,
          status: 'pending'
        }
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error('Content reporting failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        reporterId: req.user?.id,
        requestId: res.locals?.requestId
      });

      const response: ApiResponse = {
        success: false,
        error: 'Failed to submit content report',
        data: null
      };

      return res.status(500).json(response);
    }
  };
}

/**
 * Combine all moderation middleware for posts
 */
export function fullContentModeration(maxLength: number = 2000) {
  return [
    validateContentFormat(maxLength),
    sanitizeContent(),
    checkUserLimits(),
    moderateContent()
  ];
}