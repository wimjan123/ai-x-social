/**
 * User Profile Routes - GET /api/users/profile, /api/users/{userId}, /api/users/{userId}/metrics
 *
 * Implements user profile endpoints with proper authentication, validation,
 * and privacy controls following OpenAPI specification.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import { influenceService } from '../services/InfluenceService';
import { validateParams } from '../lib/utils/validation';
import { logger } from '../lib/logger';

const router = Router();
const userService = new UserService();
const authService = new AuthService();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const userIdParamsSchema = z.object({
  userId: z.string().uuid('Invalid userId format')
});

// ============================================================================
// AUTHENTICATION MIDDLEWARE (copied from auth.ts)
// ============================================================================

interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Missing or invalid authorization header',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    const token = authHeader.substring(7);

    const authContext = await authService.validateToken(token);

    if (!authContext || !authContext.isAuthenticated) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    req.user = authContext.user;
    req.session = authContext.session;
    next();
  } catch (error) {
    logger.error('Token authentication failed:', error);
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Token verification failed',
      code: 'AUTHENTICATION_ERROR'
    });
  }
};

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * GET /api/users/profile - Get current user's complete profile (authenticated)
 */
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User ID not found in token',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    logger.info('Getting user profile', { userId });

    // Get complete user details including profile
    const userDetails = await userService.getUserById(userId);

    if (!userDetails || !userDetails.profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'User profile not found',
        code: 'NOT_FOUND_ERROR'
      });
    }

    // Format response according to OpenAPI UserProfile schema
    const response = {
      id: userDetails.id,
      username: userDetails.username,
      displayName: userDetails.profile.displayName,
      bio: userDetails.profile.bio,
      profileImageUrl: userDetails.profile.profileImageUrl,
      headerImageUrl: userDetails.profile.headerImageUrl,
      location: userDetails.profile.location,
      website: userDetails.profile.website,
      personaType: userDetails.profile.personaType,
      specialtyAreas: userDetails.profile.specialtyAreas || [],
      verificationBadge: userDetails.profile.verificationBadge,
      followerCount: userDetails.profile.followerCount,
      followingCount: userDetails.profile.followingCount,
      postCount: userDetails.profile.postCount,
      createdAt: userDetails.createdAt.toISOString(),
      updatedAt: userDetails.createdAt.toISOString() // Simplified for now
    };

    logger.info('User profile retrieved successfully', { userId });
    res.status(200).json(response);

  } catch (error: any) {
    logger.error('Error retrieving user profile:', error);

    if (error.message?.includes('not found')) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'User profile not found',
        code: 'NOT_FOUND_ERROR'
      });
    }

    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'An unexpected error occurred while retrieving profile',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/users/{userId} - Get public profile of any user
 */
router.get('/:userId', authenticateToken, validateParams(userIdParamsSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'User ID is required',
        code: 'VALIDATION_ERROR'
      });
    }

    logger.info('Getting public user profile', { userId, requesterId: req.user?.id });

    // Get public profile
    const userDetails = await userService.getUserById(userId);

    if (!userDetails || !userDetails.profile) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found',
        code: 'NOT_FOUND_ERROR'
      });
    }

    // Format response according to OpenAPI PublicUserProfile schema
    const response = {
      id: userDetails.id,
      username: userDetails.username,
      displayName: userDetails.profile.displayName,
      bio: userDetails.profile.bio,
      profileImageUrl: userDetails.profile.profileImageUrl,
      headerImageUrl: userDetails.profile.headerImageUrl,
      location: userDetails.profile.location,
      website: userDetails.profile.website,
      personaType: userDetails.profile.personaType,
      specialtyAreas: userDetails.profile.specialtyAreas || [],
      verificationBadge: userDetails.profile.verificationBadge,
      followerCount: userDetails.profile.followerCount,
      followingCount: userDetails.profile.followingCount,
      postCount: userDetails.profile.postCount,
      createdAt: userDetails.createdAt.toISOString()
    };

    logger.info('Public user profile retrieved successfully', { userId });
    res.status(200).json(response);

  } catch (error: any) {
    logger.error('Error retrieving public user profile:', error);

    if (error.message?.includes('not found')) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found',
        code: 'NOT_FOUND_ERROR'
      });
    }

    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'An unexpected error occurred while retrieving user profile',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/users/{userId}/metrics - Get influence metrics for any user
 */
router.get('/:userId/metrics', authenticateToken, validateParams(userIdParamsSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'User ID is required',
        code: 'VALIDATION_ERROR'
      });
    }

    logger.info('Getting user influence metrics', { userId, requesterId: req.user?.id });

    // Verify user exists first
    const userDetails = await userService.getUserById(userId);

    if (!userDetails || !userDetails.profile) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found',
        code: 'NOT_FOUND_ERROR'
      });
    }

    // Get influence metrics
    let metrics;
    try {
      metrics = await influenceService.getUserMetrics(userId);
    } catch (error: any) {
      // If metrics don't exist, create them first
      if (error.message?.includes('not found')) {
        logger.info('Creating initial metrics for user', { userId });
        const updateResult = await influenceService.updateUserMetrics(userId);
        metrics = updateResult.metrics;
      } else {
        throw error;
      }
    }

    // Format response according to OpenAPI InfluenceMetrics schema
    const response = {
      id: metrics.id,
      userId: metrics.userId,
      followerCount: metrics.followerCount,
      followingCount: metrics.followingCount,
      engagementRate: metrics.engagementRate,
      reachScore: metrics.reachScore,
      approvalRating: metrics.approvalRating,
      controversyLevel: metrics.controversyLevel,
      trendingScore: metrics.trendingScore,
      followerGrowthDaily: metrics.followerGrowthDaily,
      followerGrowthWeekly: metrics.followerGrowthWeekly,
      followerGrowthMonthly: metrics.followerGrowthMonthly,
      totalLikes: metrics.totalLikes,
      totalReshares: metrics.totalReshares,
      totalComments: metrics.totalComments,
      influenceRank: metrics.influenceRank,
      categoryRank: metrics.categoryRank,
      lastUpdated: metrics.lastUpdated.toISOString()
    };

    logger.info('User influence metrics retrieved successfully', { userId });
    res.status(200).json(response);

  } catch (error: any) {
    logger.error('Error retrieving user influence metrics:', error);

    if (error.message?.includes('not found')) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found',
        code: 'NOT_FOUND_ERROR'
      });
    }

    res.status(500).json({
      error: 'Metrics retrieval failed',
      message: 'An unexpected error occurred while retrieving user metrics',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ============================================================================
// CLEANUP
// ============================================================================

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  logger.info('Cleaning up user service connections...');
  await userService.disconnect();
  await authService.disconnect();
  await influenceService.destroy();
});

process.on('SIGINT', async () => {
  logger.info('Cleaning up user service connections...');
  await userService.disconnect();
  await authService.disconnect();
  await influenceService.destroy();
});

export default router;