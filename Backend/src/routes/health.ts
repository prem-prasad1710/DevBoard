import { Request, Response } from 'express';
import { getDatabase } from '../config/database';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      responseTime?: number;
    };
    redis: {
      status: 'connected' | 'disconnected' | 'error';
      responseTime?: number;
    };
    server: {
      status: 'running';
      uptime: number;
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
    };
  };
  version: string;
}

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const healthStatus: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'disconnected',
        },
        redis: {
          status: 'disconnected',
        },
        server: {
          status: 'running',
          uptime: process.uptime(),
          memory: {
            used: 0,
            total: 0,
            percentage: 0,
          },
        },
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    // Check database connection
    try {
      const dbStartTime = Date.now();
      const db = getDatabase();
      if (db.readyState === 1) {
        healthStatus.services.database.status = 'connected';
        healthStatus.services.database.responseTime = Date.now() - dbStartTime;
      } else {
        healthStatus.services.database.status = 'disconnected';
        healthStatus.status = 'error';
      }
    } catch (error) {
      healthStatus.services.database.status = 'error';
      healthStatus.status = 'error';
      logger.error('Database health check failed:', error);
    }

    // Check Redis connection
    try {
      const redisStartTime = Date.now();
      const redis = getRedisClient();
      if (redis) {
        await redis.ping();
        healthStatus.services.redis.status = 'connected';
        healthStatus.services.redis.responseTime = Date.now() - redisStartTime;
      } else {
        healthStatus.services.redis.status = 'disconnected';
        healthStatus.services.redis.responseTime = 0;
      }
    } catch (error) {
      healthStatus.services.redis.status = 'error';
      healthStatus.status = 'error';
      logger.error('Redis health check failed:', error);
    }

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    healthStatus.services.server.memory = {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
    };

    // Set response status based on health
    const statusCode = healthStatus.status === 'ok' ? 200 : 503;
    
    res.status(statusCode).json(healthStatus);
    
    // Log the health check
    logger.info('Health check completed', {
      status: healthStatus.status,
      duration: Date.now() - startTime,
      statusCode,
    });

  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Internal server error',
    });
  }
};

// Simple health check for Docker
export const simpleHealthCheck = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
};
