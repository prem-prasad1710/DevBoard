import winston from 'winston';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(logColors);

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        consoleFormat
      ),
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    }),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Create a stream object with a 'write' function that will be used by morgan
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Helper functions for structured logging
export const loggerHelpers = {
  // Log API requests
  logRequest: (method: string, url: string, userId?: string) => {
    logger.info('API Request', {
      method,
      url,
      userId,
      timestamp: new Date().toISOString(),
    });
  },

  // Log API responses
  logResponse: (method: string, url: string, statusCode: number, duration: number, userId?: string) => {
    logger.info('API Response', {
      method,
      url,
      statusCode,
      duration,
      userId,
      timestamp: new Date().toISOString(),
    });
  },

  // Log database operations
  logDB: (operation: string, collection: string, duration?: number, error?: any) => {
    if (error) {
      logger.error('Database Error', {
        operation,
        collection,
        duration,
        error: error.message,
        stack: error.stack,
      });
    } else {
      logger.debug('Database Operation', {
        operation,
        collection,
        duration,
      });
    }
  },

  // Log external API calls
  logExternalAPI: (service: string, endpoint: string, method: string, statusCode?: number, duration?: number, error?: any) => {
    if (error) {
      logger.error('External API Error', {
        service,
        endpoint,
        method,
        statusCode,
        duration,
        error: error.message,
      });
    } else {
      logger.info('External API Call', {
        service,
        endpoint,
        method,
        statusCode,
        duration,
      });
    }
  },

  // Log authentication events
  logAuth: (event: string, userId?: string, userEmail?: string, ip?: string, userAgent?: string) => {
    logger.info('Authentication Event', {
      event,
      userId,
      userEmail,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },

  // Log security events
  logSecurity: (event: string, level: 'info' | 'warn' | 'error', details: any) => {
    logger.log(level, 'Security Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
    });
  },

  // Log performance metrics
  logPerformance: (metric: string, value: number, unit: string, context?: any) => {
    logger.info('Performance Metric', {
      metric,
      value,
      unit,
      context,
      timestamp: new Date().toISOString(),
    });
  },

  // Log business events
  logBusinessEvent: (event: string, userId: string, data: any) => {
    logger.info('Business Event', {
      event,
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  // Log AI/ML events
  logAI: (event: string, model: string, tokens?: number, cost?: number, userId?: string) => {
    logger.info('AI Event', {
      event,
      model,
      tokens,
      cost,
      userId,
      timestamp: new Date().toISOString(),
    });
  },

  // Log cache operations
  logCache: (operation: string, key: string, hit: boolean, ttl?: number) => {
    logger.debug('Cache Operation', {
      operation,
      key,
      hit,
      ttl,
    });
  },

  // Log queue operations
  logQueue: (operation: string, queue: string, messageId?: string, error?: any) => {
    if (error) {
      logger.error('Queue Error', {
        operation,
        queue,
        messageId,
        error: error.message,
      });
    } else {
      logger.debug('Queue Operation', {
        operation,
        queue,
        messageId,
      });
    }
  },
};

// Export default logger
export default logger;
