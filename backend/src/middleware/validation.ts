import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { logger } from '../lib/logger';

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Request validation failed:', {
          url: req.url,
          method: req.method,
          errors: formattedErrors,
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      logger.error('Unexpected validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query parameters
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Query validation failed:', {
          url: req.url,
          method: req.method,
          errors: formattedErrors,
        });

        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: formattedErrors,
        });
      }

      logger.error('Unexpected query validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
}

export function validateParams(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate route parameters
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Params validation failed:', {
          url: req.url,
          method: req.method,
          errors: formattedErrors,
        });

        return res.status(400).json({
          success: false,
          message: 'Parameters validation failed',
          errors: formattedErrors,
        });
      }

      logger.error('Unexpected params validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
}