import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import dotenv from 'dotenv';

// Import configurations and utilities
import { connectToDatabase } from './config/database';
import { connectToRedis } from './config/redis';
import { connectToKafka } from './config/kafka';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { startCronJobs } from './services/cronJobs';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import { healthCheck } from './routes/health';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const SSL_ENABLED = process.env.SSL_ENABLED === 'true';

interface MyContext {
  user?: any;
  token?: string;
  isAuthenticated: boolean;
  dataSources: {
    github: any;
    stackoverflow: any;
    openai: any;
  };
}

async function startServer() {
  try {
    logger.info('🚀 Starting DevBoard Backend Server...');

    // Connect to databases and external services
    await connectToDatabase();
    await connectToRedis();
    
    // Connect to Kafka (optional, continue without it if it fails)
    try {
      await connectToKafka();
    } catch (error) {
      logger.warn('Kafka connection failed, continuing without it:', error);
    }

    // Create Express app
    const app = express();

    // Trust proxy for rate limiting and IP detection
    app.set('trust proxy', 1);

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    const corsOptions = {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };

    app.use(cors(corsOptions));

    // Request logging
    const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(morganFormat, {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));

    // Rate limiting
    const globalRateLimit = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: NODE_ENV === 'production' ? 1000 : 10000, // requests per window
      message: {
        error: {
          message: 'Too many requests from this IP',
          code: 'RATE_LIMIT_EXCEEDED',
        },
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use(globalRateLimit);

    // Body parsing middleware
    app.use(json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static file serving for uploads
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

    // Apply auth middleware globally (optional auth)
    app.use(authMiddleware);

    // Health check endpoint
    app.get('/health', healthCheck);
    app.get('/api/health', healthCheck);

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    // Create HTTP server
    let httpServer: http.Server | https.Server;

    if (SSL_ENABLED && NODE_ENV === 'production') {
      // HTTPS server for production
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH!),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH!),
      };
      httpServer = https.createServer(sslOptions, app);
      logger.info('✅ HTTPS server configured');
    } else {
      // HTTP server for development
      httpServer = http.createServer(app);
    }

    // Initialize Apollo Server
    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Use GraphQL Playground in development
        NODE_ENV === 'development' 
          ? ApolloServerPluginLandingPageLocalDefault({ 
              embed: true,
              includeCookies: true,
            })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      // Enable introspection and playground in development
      introspection: NODE_ENV === 'development',
      formatError: (error) => {
        logger.error('GraphQL Error:', error);
        return {
          message: error.message,
          code: error.extensions?.code,
          path: error.path || [],
        };
      },
    });

    // Start Apollo Server
    await server.start();

    // Apply GraphQL middleware
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: createContext,
      })
    );

    // Catch-all route for undefined endpoints
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        code: 'ENDPOINT_NOT_FOUND',
        path: req.originalUrl,
      });
    });

    // Global error handler (must be last)
    app.use(errorHandler);

    // Start the server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, () => {
        logger.info(`🎯 Server running on ${SSL_ENABLED ? 'https' : 'http'}://localhost:${PORT}`);
        logger.info(`🚀 GraphQL endpoint: ${SSL_ENABLED ? 'https' : 'http'}://localhost:${PORT}/graphql`);
        logger.info(`🏥 Health check: ${SSL_ENABLED ? 'https' : 'http'}://localhost:${PORT}/health`);
        logger.info(`📊 Environment: ${NODE_ENV}`);
        resolve();
      });
    });

    // Start background services
    startCronJobs();

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      logger.info(`📡 Received ${signal}. Starting graceful shutdown...`);

      // Stop accepting new requests
      httpServer.close(async () => {
        try {
          // Stop Apollo Server
          await server.stop();
          logger.info('✅ Apollo Server stopped');

          // Close database connections
          await Promise.all([
            // Add your cleanup functions here
          ]);

          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    logger.info('✅ DevBoard Backend Server started successfully!');

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export default startServer;
