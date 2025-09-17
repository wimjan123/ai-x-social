import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { logger, createRequestLogger, createPerformanceLogger } from '@/lib/logger';
import { config } from '@/lib/config';
import { errorHandler } from '@/lib/middleware/errorHandler';
import { notFoundHandler } from '@/lib/middleware/notFoundHandler';
import { getRealtimeService } from '@/services/RealtimeService';
import { database } from '@/lib/database';
import { redis } from '@/lib/redis';
import authRoutes from '@/api/auth';
import userRoutes from '@/api/users';
import postRoutes from '@/api/posts';
import personaRoutes from '@/api/personas';
import newsRoutes from '@/api/news';
import trendsRoutes from '@/api/trends';
import liveUpdatesRoutes from '@/api/live-updates';
import moderationRoutes from '@/api/moderation';
import settingsRoutes from '@/api/settings';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.corsOrigin.split(',').map(o => o.trim());

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow localhost in development
    if (config.nodeEnv === 'development' &&
        (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS policy'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-User-ID',
    'X-Request-ID'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset'
  ],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
}));

// Security headers middleware
app.use((req, res, next) => {
  // Add additional security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Add request ID for tracking
  req.headers['x-request-id'] = req.headers['x-request-id'] ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// General middleware
app.use(compression());

// Enhanced logging middleware
app.use(createRequestLogger());
app.use(createPerformanceLogger());

// Body parsing middleware
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    // Log large payloads for monitoring
    if (buf.length > 1024 * 1024) { // > 1MB
      logger.warn('Large payload detected', {
        size: buf.length,
        url: req.url,
        method: req.method,
        contentType: req.get('content-type'),
      });
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/live-updates', liveUpdatesRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, async () => {
    logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);

    try {
      // Initialize database and Redis connections
      await database.initialize();
      await redis.connect();
      logger.info('Database and Redis connections established');

      // Initialize real-time services
      const realtimeService = getRealtimeService(config.redisUrl);
      await realtimeService.initialize(server);
      logger.info('Real-time services initialized');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);

    try {
      // Shutdown real-time services first
      const realtimeService = getRealtimeService();
      await realtimeService.shutdown();

      // Close database and Redis connections
      await database.destroy();
      await redis.disconnect();

      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export { app };
export default app;