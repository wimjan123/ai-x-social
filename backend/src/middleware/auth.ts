import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../lib/logger';
import { prisma } from '../lib/database';

interface JWTPayload {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        isAdmin?: boolean;
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET environment variable not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Get user from database to ensure they still exist and are active
    const user = await prisma.userAccount.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: false, // Would check admin role from database
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
      });
    }

    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Try to authenticate but don't fail if no token provided
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without authentication
  }

  // Use the main auth middleware if token is provided
  authMiddleware(req, res, next);
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required',
    });
  }

  next();
}