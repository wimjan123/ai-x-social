import winston from 'winston';
import { config } from '@/lib/config';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

// Create the logger
export const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp(),
    errors({ stack: true }),
    config.nodeEnv === 'development'
      ? combine(colorize(), devFormat)
      : json()
  ),
  defaultMeta: { service: 'ai-x-social-backend' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to console with a simple format
if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      devFormat
    )
  }));
}

// Request/Response logging middleware with enhanced details
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log incoming request
    logger.info('Incoming Request', {
      requestId,
      method: req.method,
      url: req.url,
      query: req.query,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
      headers: {
        authorization: req.headers.authorization ? '[REDACTED]' : undefined,
        contentType: req.headers['content-type'],
        accept: req.headers.accept,
        origin: req.headers.origin,
      }
    });

    // Store requestId for use in response
    res.locals.requestId = requestId;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        contentLength: res.get('content-length'),
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user?.id,
        timestamp: new Date().toISOString(),
      };

      // Color-code based on status
      if (res.statusCode >= 500) {
        logger.error('HTTP Error Response', { ...logData, level: 'error' });
      } else if (res.statusCode >= 400) {
        logger.warn('HTTP Client Error', { ...logData, level: 'warn' });
      } else if (res.statusCode >= 300) {
        logger.info('HTTP Redirect', { ...logData, level: 'info' });
      } else {
        logger.info('HTTP Success', { ...logData, level: 'info' });
      }
    });

    res.on('error', (error: Error) => {
      logger.error('Response Error', {
        requestId,
        error: error.message,
        stack: error.stack,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  };
}

// Performance monitoring middleware
export function createPerformanceLogger() {
  const requestCounts = new Map<string, number>();
  const responseTimes = new Map<string, number[]>();

  return (req: any, res: any, next: any) => {
    const route = `${req.method} ${req.route?.path || req.url}`;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      // Track request count
      requestCounts.set(route, (requestCounts.get(route) || 0) + 1);

      // Track response times
      if (!responseTimes.has(route)) {
        responseTimes.set(route, []);
      }
      const times = responseTimes.get(route)!;
      times.push(duration);

      // Keep only last 100 response times per route
      if (times.length > 100) {
        times.shift();
      }

      // Log slow requests (> 2 seconds)
      if (duration > 2000) {
        logger.warn('Slow Request Detected', {
          route,
          duration,
          requestId: res.locals.requestId,
          method: req.method,
          url: req.url,
          userId: req.user?.id,
        });
      }
    });

    next();
  };
}

// Security event logger
export function logSecurityEvent(event: string, details: Record<string, any>) {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
    severity: 'security',
  });
}

// Database operation logger
export function logDatabaseOperation(operation: string, table: string, duration: number, success: boolean) {
  const logData = {
    operation,
    table,
    duration,
    success,
    timestamp: new Date().toISOString(),
    category: 'database',
  };

  if (success) {
    logger.debug('Database Operation', logData);
  } else {
    logger.error('Database Operation Failed', logData);
  }

  // Log slow database operations (> 1 second)
  if (duration > 1000) {
    logger.warn('Slow Database Operation', logData);
  }
}

// API rate limiting logger
export function logRateLimitEvent(ip: string, endpoint: string, limit: number, current: number) {
  logger.warn('Rate Limit Event', {
    ip,
    endpoint,
    limit,
    current,
    timestamp: new Date().toISOString(),
    category: 'rate-limit',
  });
}