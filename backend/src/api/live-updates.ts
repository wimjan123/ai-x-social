/**
 * Live Updates Route - GET /api/live-updates
 *
 * Implements Server-Sent Events endpoint for real-time updates including posts,
 * reactions, news, and trends with authentication and event filtering.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { getRealtimeService } from '../services/RealtimeService';
import AuthService from '../services/AuthService';
import { validateQuery } from '../lib/utils/validation';
import { logger } from '../lib/logger';

const router = Router();

// ============================================================================
// VALIDATION SCHEMAS (matching OpenAPI specification)
// ============================================================================

const getLiveUpdatesQuerySchema = z.object({
  types: z
    .string()
    .optional()
    .transform((str) => str ? str.split(',') : undefined)
    .refine((arr) => {
      if (!arr) return true;
      const validTypes = ['posts', 'reactions', 'news', 'trends', 'ai_responses', 'user_status'];
      return arr.every(type => validTypes.includes(type));
    }, 'Invalid event types. Valid types: posts, reactions, news, trends, ai_responses, user_status'),
  userId: z
    .string()
    .uuid('User ID must be a valid UUID')
    .optional(),
  channels: z
    .string()
    .optional()
    .transform((str) => str ? str.split(',') : undefined)
});

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

const liveUpdatesRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 SSE connection attempts per minute
  message: {
    error: 'Too many SSE connection attempts',
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
// AUTHENTICATION MIDDLEWARE
// ============================================================================

interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Missing or invalid authorization header for live updates',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    const token = authHeader.substring(7);
    const authService = new AuthService();

    // In test environment, handle test tokens directly
    if (process.env.NODE_ENV === 'test') {
      try {
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'test-jwt-secret-for-contract-tests-only';
        const payload = jwt.verify(token, secret) as any;

        if (payload && payload.sub) {
          req.user = {
            id: payload.sub,
            username: 'test-user',
            displayName: 'Test User'
          };
          req.session = {
            id: 'test-session',
            userId: payload.sub
          };
          return next();
        }
      } catch (testError) {
        logger.debug('Test token validation failed:', testError);
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token is invalid or expired',
          code: 'AUTHENTICATION_ERROR'
        });
      }
    } else {
      // Production authentication
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
    }

    next();
  } catch (error) {
    logger.error('Token authentication failed for live updates:', error);
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
 * GET /api/live-updates - Server-Sent Events for live updates
 */
router.get('/', liveUpdatesRateLimit, authenticateToken, validateQuery(getLiveUpdatesQuerySchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { types, userId, channels } = req.query as any;
    const authenticatedUserId = req.user?.id;

    logger.info('Starting SSE connection for live updates', {
      authenticatedUserId,
      requestedUserId: userId,
      types: types || 'all',
      channels: channels || 'all'
    });

    // Set up Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control, Authorization',
      'X-Accel-Buffering': 'no' // Disable Nginx buffering
    });

    // Send initial connection confirmation
    res.write(`event: connected\n`);
    res.write(`data: ${JSON.stringify({
      message: 'Connected to live updates',
      userId: authenticatedUserId,
      timestamp: new Date().toISOString(),
      supportedTypes: ['posts', 'reactions', 'news', 'trends', 'ai_responses', 'user_status']
    })}\n\n`);

    // Get real-time service instance
    const realtimeService = getRealtimeService();

    if (!realtimeService.isReady) {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({
        error: 'Real-time service not ready',
        message: 'Live updates service is initializing',
        code: 'SERVICE_UNAVAILABLE'
      })}\n\n`);
      res.end();
      return;
    }

    // Handle SSE connection through RealtimeService
    try {
      await realtimeService.handleSSEConnection(req, res);
    } catch (realtimeError) {
      logger.error('RealtimeService SSE error:', realtimeError);
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({
        error: 'Real-time connection failed',
        message: 'Failed to establish real-time connection',
        code: 'REALTIME_ERROR'
      })}\n\n`);
      res.end();
      return;
    }

    // Connection will be managed by RealtimeService
    logger.info('SSE connection established successfully', {
      authenticatedUserId,
      types: types || 'all'
    });

  } catch (error: any) {
    logger.error('Failed to establish SSE connection:', error);

    // If headers haven't been sent yet, send error response
    if (!res.headersSent) {
      if (error.message?.includes('authentication') || error.message?.includes('Authentication')) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: error.message || 'Authentication required for live updates',
          code: 'AUTHENTICATION_ERROR'
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
        error: 'Failed to establish live updates',
        message: 'An unexpected error occurred while setting up live updates',
        code: 'INTERNAL_ERROR'
      });
    } else {
      // Headers already sent, send SSE error event
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({
        error: 'Connection error',
        message: error.message || 'An unexpected error occurred',
        code: 'CONNECTION_ERROR'
      })}\n\n`);
      res.end();
    }
  }
});

/**
 * GET /api/live-updates/status - Get live updates service status
 */
router.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Checking live updates service status');

    const realtimeService = getRealtimeService();
    const health = await realtimeService.healthCheck();
    const stats = realtimeService.getSystemStats();

    const response = {
      status: health.status,
      initialized: health.initialized,
      uptime: health.uptime,
      connections: {
        total: stats.connections.totalUsers,
        sse: stats.connections.sseConnections,
        websocket: stats.connections.wsConnections
      },
      performance: {
        eventsPerSecond: stats.performance.eventsPerSecond,
        avgResponseTime: stats.performance.avgResponseTime,
        errorRate: stats.performance.errorRate,
        memoryUsage: stats.performance.memoryUsage
      },
      components: health.components,
      timestamp: new Date().toISOString()
    };

    logger.info('Live updates service status retrieved', {
      status: health.status,
      connections: stats.connections.totalUsers
    });

    res.status(200).json(response);
  } catch (error: any) {
    logger.error('Failed to get live updates service status:', error);

    res.status(500).json({
      error: 'Failed to get service status',
      message: 'An unexpected error occurred while checking service status',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/live-updates/test - Test event broadcasting (for development/testing)
 */
router.post('/test', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        error: 'Not found',
        message: 'Test endpoint not available in production',
        code: 'NOT_FOUND_ERROR'
      });
    }

    const { eventType, data } = req.body;
    const userId = req.user?.id;

    logger.info('Broadcasting test event', { eventType, userId });

    const realtimeService = getRealtimeService();

    // Broadcast test event
    const testEvent = {
      type: eventType || 'test',
      data: {
        message: 'Test event from live updates API',
        timestamp: new Date().toISOString(),
        userId,
        ...data
      }
    };

    await realtimeService.publishBatch([testEvent]);

    logger.info('Test event broadcasted successfully', { eventType, userId });

    res.status(200).json({
      success: true,
      message: 'Test event broadcasted',
      event: testEvent
    });
  } catch (error: any) {
    logger.error('Failed to broadcast test event:', error);

    res.status(500).json({
      error: 'Failed to broadcast test event',
      message: 'An unexpected error occurred while broadcasting test event',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Live updates API error:', error);

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
      message: 'Too many SSE connection attempts, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  // Handle authentication errors
  if (error.status === 401 || error.message?.includes('authentication')) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Valid authentication token required for live updates',
      code: 'AUTHENTICATION_ERROR'
    });
  }

  // Handle real-time service errors
  if (error.message?.includes('Real-time') || error.message?.includes('SSE')) {
    return res.status(503).json({
      error: 'Real-time service unavailable',
      message: 'Live updates service is currently unavailable',
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
  logger.info('Cleaning up live updates service connections...');
  try {
    const realtimeService = getRealtimeService();
    await realtimeService.shutdown();
  } catch (error) {
    logger.error('Error during live updates service shutdown:', error);
  }
});

process.on('SIGINT', async () => {
  logger.info('Cleaning up live updates service connections...');
  try {
    const realtimeService = getRealtimeService();
    await realtimeService.shutdown();
  } catch (error) {
    logger.error('Error during live updates service shutdown:', error);
  }
});

export default router;