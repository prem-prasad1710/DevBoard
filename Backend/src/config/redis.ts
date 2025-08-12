import Redis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis;

export async function connectToRedis(): Promise<void> {
  // Skip Redis connection if Redis URL indicates it's not available
  if (REDIS_URL === 'redis://localhost:6379' && process.env.NODE_ENV === 'development') {
    try {
      redisClient = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        connectTimeout: 5000, // 5 second timeout
      });

      // Connect to Redis with timeout
      await redisClient.connect();
      logger.info('✅ Connected to Redis');

      // Handle Redis events
      redisClient.on('error', (error: any) => {
        logger.error('Redis connection error:', error);
      });

      redisClient.on('connect', () => {
        logger.info('Redis connected');
      });

      redisClient.on('ready', () => {
        logger.info('Redis ready');
      });

      redisClient.on('close', () => {
        logger.warn('Redis connection closed');
      });

      redisClient.on('reconnecting', () => {
        logger.info('Redis reconnecting');
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await redisClient.quit();
        logger.info('Redis connection closed through app termination');
      });

    } catch (error: any) {
      logger.warn('⚠️  Redis not available, continuing without Redis caching:', error?.message || error);
      redisClient = null as any;
      return;
    }
  } else {
    try {
      redisClient = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
      });

      // Connect to Redis
      await redisClient.connect();

      logger.info('✅ Connected to Redis');

      // Handle Redis events
      redisClient.on('error', (error: any) => {
        logger.error('Redis connection error:', error);
      });

      redisClient.on('connect', () => {
        logger.info('Redis connected');
      });

      redisClient.on('ready', () => {
        logger.info('Redis ready');
      });

      redisClient.on('close', () => {
        logger.warn('Redis connection closed');
      });

      redisClient.on('reconnecting', () => {
        logger.info('Redis reconnecting');
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await redisClient.quit();
        logger.info('Redis connection closed through app termination');
      });

    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }
}

export function getRedisClient(): Redis | null {
  return redisClient;
}

// Cache utility functions
export class CacheService {
  private client: Redis | null;

  constructor() {
    this.client = getRedisClient();
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache set');
      return;
    }
    
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache get');
      return null;
    }
    
    try {
      const value = await this.client.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache del');
      return;
    }
    
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Cache del error:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache exists');
      return false;
    }
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache expire');
      return;
    }
    
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      logger.error('Cache expire error:', error);
      throw error;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache keys');
      return [];
    }
    
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error('Cache keys error:', error);
      return [];
    }
  }

  async flushPattern(pattern: string): Promise<void> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache flushPattern');
      return;
    }
    
    try {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      logger.error('Cache flushPattern error:', error);
      throw error;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache increment');
      return 0;
    }
    
    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      logger.error('Cache increment error:', error);
      throw error;
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    if (!this.client) {
      logger.debug('Redis not available, skipping cache decrement');
      return 0;
    }
    
    try {
      return await this.client.decrby(key, amount);
    } catch (error) {
      logger.error('Cache decrement error:', error);
      throw error;
    }
  }
}

let cacheServiceInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService();
  }
  return cacheServiceInstance;
}

export const cacheService = {
  get: (...args: Parameters<CacheService['get']>) => getCacheService().get(...args),
  set: (...args: Parameters<CacheService['set']>) => getCacheService().set(...args),
  del: (...args: Parameters<CacheService['del']>) => getCacheService().del(...args),
  exists: (...args: Parameters<CacheService['exists']>) => getCacheService().exists(...args),
  expire: (...args: Parameters<CacheService['expire']>) => getCacheService().expire(...args),
  keys: (...args: Parameters<CacheService['keys']>) => getCacheService().keys(...args),
  flushPattern: (...args: Parameters<CacheService['flushPattern']>) => getCacheService().flushPattern(...args),
  increment: (...args: Parameters<CacheService['increment']>) => getCacheService().increment(...args),
  decrement: (...args: Parameters<CacheService['decrement']>) => getCacheService().decrement(...args),
};
