/**
 * Authentication Routes - POST /api/auth/register, /api/auth/login, /api/auth/logout
 *
 * Implements JWT-based authentication endpoints with proper validation,
 * rate limiting, and security measures following OpenAPI specification.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import { validateBody } from '../lib/utils/validation';
import { logger } from '../lib/logger';

const router = Router();
const authService = new AuthService();
const userService = new UserService();

// ============================================================================
// VALIDATION SCHEMAS (matching OpenAPI specification)
// ============================================================================

const registerRequestSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .regex(/^[a-zA-Z0-9_]{3,15}$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be less than 50 characters'),
  personaType: z.enum(['POLITICIAN', 'INFLUENCER', 'JOURNALIST', 'ACTIVIST', 'BUSINESS', 'ENTERTAINER']),
  bio: z
    .string()
    .max(280, 'Bio must be less than 280 characters')
    .optional(),
  politicalStance: z.object({
    economicPosition: z
      .number()
      .min(0, 'Economic position must be between 0-100')
      .max(100, 'Economic position must be between 0-100')
      .optional(),
    socialPosition: z
      .number()
      .min(0, 'Social position must be between 0-100')
      .max(100, 'Social position must be between 0-100')
      .optional(),
    primaryIssues: z
      .array(z.string())
      .max(5, 'Maximum 5 primary issues allowed')
      .optional(),
    partyAffiliation: z.string().optional(),
    ideologyTags: z
      .array(z.string())
      .max(10, 'Maximum 10 ideology tags allowed')
      .optional(),
    debateWillingness: z
      .number()
      .min(0, 'Debate willingness must be between 0-100')
      .max(100, 'Debate willingness must be between 0-100')
      .optional(),
    controversyTolerance: z
      .number()
      .min(0, 'Controversy tolerance must be between 0-100')
      .max(100, 'Controversy tolerance must be between 0-100')
      .optional(),
  }).optional(),
});

const loginRequestSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Username or email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in test environment or for logout
    return process.env.NODE_ENV === 'test' || req.path === '/logout';
  }
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Stricter limit for login attempts
  message: {
    error: 'Too many login attempts',
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
 * POST /api/auth/register - Register new user account
 */
router.post('/register', authRateLimit, validateBody(registerRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      username,
      email,
      password,
      displayName,
      personaType,
      bio,
      politicalStance
    } = req.body;

    logger.info('User registration attempt', { username, email });

    // Create user account with profile and political alignment
    const userDetails = await userService.createUser({
      username,
      email,
      password,
      displayName,
      personaType,
      bio,
      politicalStance
    });

    // Authenticate the newly created user
    const loginResult = await authService.login(username, password, {
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    });

    // Format response according to OpenAPI AuthResponse schema
    const response = {
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      user: {
        id: userDetails.id,
        username: userDetails.username,
        displayName: userDetails.profile?.displayName || userDetails.username,
        bio: userDetails.profile?.bio || null,
        profileImageUrl: userDetails.profile?.profileImageUrl || null,
        headerImageUrl: userDetails.profile?.headerImageUrl || null,
        location: userDetails.profile?.location || null,
        website: userDetails.profile?.website || null,
        personaType: userDetails.profile?.personaType,
        specialtyAreas: userDetails.profile?.specialtyAreas || [],
        verificationBadge: userDetails.profile?.verificationBadge || false,
        followerCount: userDetails.profile?.followerCount || 0,
        followingCount: userDetails.profile?.followingCount || 0,
        postCount: userDetails.profile?.postCount || 0,
        createdAt: userDetails.createdAt.toISOString(),
        updatedAt: userDetails.createdAt.toISOString()
      },
      expiresIn: 3600 // 1 hour in seconds
    };

    logger.info('User registered successfully', {
      userId: userDetails.id,
      username: userDetails.username
    });

    res.status(201).json(response);
  } catch (error: any) {
    logger.error('Registration failed:', error);

    if (error.message?.includes('already exists') || error.message?.includes('Username') || error.message?.includes('Email')) {
      return res.status(409).json({
        error: 'User already exists',
        message: error.message || 'Username or email already exists',
        code: 'CONFLICT_ERROR'
      });
    }

    if (error.name === 'ZodError' || error.message?.includes('validation')) {
      return res.status(400).json({
        error: 'Invalid registration data',
        message: error.message || 'The provided data does not meet validation requirements',
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'An unexpected error occurred during registration',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/login - User login
 */
router.post('/login', loginRateLimit, validateBody(loginRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body;

    logger.info('User login attempt', { identifier });

    // Authenticate user
    const loginResult = await authService.login(identifier, password, {
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    });

    // Get user details for response
    const userDetails = await userService.getUserById(loginResult.user.id);

    // Format response according to OpenAPI AuthResponse schema
    const response = {
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      user: {
        id: userDetails.id,
        username: userDetails.username,
        displayName: userDetails.profile?.displayName || userDetails.username,
        bio: userDetails.profile?.bio || null,
        profileImageUrl: userDetails.profile?.profileImageUrl || null,
        headerImageUrl: userDetails.profile?.headerImageUrl || null,
        location: userDetails.profile?.location || null,
        website: userDetails.profile?.website || null,
        personaType: userDetails.profile?.personaType,
        specialtyAreas: userDetails.profile?.specialtyAreas || [],
        verificationBadge: userDetails.profile?.verificationBadge || false,
        followerCount: userDetails.profile?.followerCount || 0,
        followingCount: userDetails.profile?.followingCount || 0,
        postCount: userDetails.profile?.postCount || 0,
        createdAt: userDetails.createdAt.toISOString(),
        updatedAt: userDetails.createdAt.toISOString()
      },
      expiresIn: 3600 // 1 hour in seconds
    };

    logger.info('User login successful', {
      userId: userDetails.id,
      username: userDetails.username
    });

    res.status(200).json(response);
  } catch (error: any) {
    logger.error('Login failed:', error);

    if (error.message?.includes('credentials') ||
        error.message?.includes('Invalid') ||
        error.message?.includes('not found')) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'The username/email or password is incorrect',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    if (error.message?.includes('rate limit') || error.message?.includes('Too many')) {
      return res.status(429).json({
        error: 'Too many attempts',
        message: error.message || 'Too many login attempts. Please try again later.',
        code: 'RATE_LIMIT_ERROR'
      });
    }

    if (error.name === 'ZodError' || error.message?.includes('validation')) {
      return res.status(400).json({
        error: 'Invalid login data',
        message: error.message || 'The provided credentials are invalid',
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      error: 'Login failed',
      message: 'An unexpected error occurred during login',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout - User logout
 */
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.session?.id;

    if (!sessionId) {
      return res.status(401).json({
        error: 'No active session',
        message: 'No session found to logout',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    logger.info('User logout attempt', {
      userId: req.user?.id,
      sessionId
    });

    // Logout user (invalidate session and tokens)
    await authService.logout(sessionId);

    logger.info('User logout successful', {
      userId: req.user?.id,
      sessionId
    });

    // Format response according to OpenAPI SuccessResponse schema
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    logger.error('Logout failed:', error);

    res.status(500).json({
      error: 'Logout failed',
      message: 'An unexpected error occurred during logout',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ============================================================================
// CLEANUP
// ============================================================================

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  logger.info('Cleaning up auth service connections...');
  await authService.disconnect();
  await userService.disconnect();
});

process.on('SIGINT', async () => {
  logger.info('Cleaning up auth service connections...');
  await authService.disconnect();
  await userService.disconnect();
});

export default router;