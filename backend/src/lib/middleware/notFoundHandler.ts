import { Request, Response } from 'express';
import { ApiResponse } from '@/lib/types';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  };

  res.status(404).json(response);
};