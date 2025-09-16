import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';
import { ApiResponse } from '@/lib/types';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class HttpError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError | ZodError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle different error types
  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    logger.warn('Validation error', {
      url: req.url,
      method: req.method,
      errors: validationErrors,
    });

    const response: ApiResponse = {
      success: false,
      error: message,
      data: validationErrors,
    };

    res.status(statusCode).json(response);
    return;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
    isOperational = true;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    isOperational = true;
  } else if (error.message.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Service Unavailable';
    isOperational = true;
  }

  // Log error details
  if (!isOperational || statusCode >= 500) {
    logger.error('Unhandled error', {
      url: req.url,
      method: req.method,
      statusCode,
      message: error.message,
      stack: error.stack,
      isOperational,
    });
  } else {
    logger.warn('Handled error', {
      url: req.url,
      method: req.method,
      statusCode,
      message: error.message,
    });
  }

  const response: ApiResponse = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};