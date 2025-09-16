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