import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class HealthController {
  async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = await healthService.getHealthStatus();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      return ApiResponse.success(res, health, statusCode);
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
