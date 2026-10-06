import prisma from '../repositories/prisma.js';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    connected: boolean;
    provider: string;
    responseTimeMs?: number;
    error?: string;
  };
  app: {
    name: string;
    version: string;
  };
}

export class HealthService {
  async getHealthStatus(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    let dbConnected = false;
    let dbError: string | undefined;

    try {
      // Direct raw query to verify PostgreSQL connection and responsiveness
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (err: unknown) {
      dbConnected = false;
      dbError = err instanceof Error ? err.message : 'Database query failed';
    }

    const responseTimeMs = Date.now() - startTime;

    return {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbConnected,
        provider: 'postgresql',
        responseTimeMs,
        ...(dbError ? { error: dbError } : {}),
      },
      app: {
        name: 'ExploreBD API',
        version: '1.0.0',
      },
    };
  }
}

export const healthService = new HealthService();
