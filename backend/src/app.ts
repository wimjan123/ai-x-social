/**
 * Express App Configuration
 *
 * Separate app configuration for testing purposes.
 * This file exports the Express app without starting the server.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { logger } from '@/lib/logger';
import { config } from '@/lib/config';
import { errorHandler } from '@/lib/middleware/errorHandler';
import { notFoundHandler } from '@/lib/middleware/notFoundHandler';
import authRoutes from '@/api/auth';
import userRoutes from '@/api/users';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
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
// app.use('/api/posts', postRoutes);
// app.use('/api/personas', personaRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/trends', trendsRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
export default app;