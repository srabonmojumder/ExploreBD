import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { config } from '../config/index.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error | ApiError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.error(res, 'Validation failed', 400, formatted);
  }

  console.error('[Unhandled Server Error]:', err);

  const message = config.isDev ? err.message : 'Internal server error';
  return ApiResponse.error(res, message, 500);
}
