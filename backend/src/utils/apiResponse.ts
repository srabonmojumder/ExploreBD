import { Response } from 'express';

export interface ApiResponseOptions<T> {
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200, message?: string) {
    if (res.req && res.req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }
    return res.status(statusCode).json({
      success: true,
      ...(message ? { message } : {}),
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode = 500, errors?: unknown) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
