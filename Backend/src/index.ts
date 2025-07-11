import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
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
import { healthCheck } from './routes/health';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
    // Create Express app
    const app = express();
    
    // Create HTTP server
    const httpServer = http.createServer(app);

    // Connect to databases and services (with fallback for development)
    try {
      await connectToDatabase();
      logger.info('✅ MongoDB connected');
    } catch (error) {
      logger.warn('⚠️  MongoDB connection failed, continuing without database:', error);
    }

    try {
      await connectToRedis();
      logger.info('✅ Redis connected');
    } catch (error) {
      logger.warn('⚠️  Redis connection failed, continuing without cache:', error);
    }

    try {
      await connectToKafka();
      logger.info('✅ Kafka connected');
    } catch (error) {
      logger.warn('⚠️  Kafka connection failed, continuing without event streaming:', error);
    }

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: NODE_ENV === 'production' ? {} : false,
      crossOriginEmbedderPolicy: false,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/graphql', limiter);

    // Logging
    app.use(morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }));

    // CORS configuration
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    };

    // Health check endpoint
    app.get('/health', healthCheck);

    // API routes
    app.use('/api/health', healthCheck);

    // Create Apollo Server
    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        NODE_ENV === 'production' 
          ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ 
              includeCookies: true,
              footer: false,
            }),
      ],
      formatError: (error) => {
        logger.error('GraphQL Error:', error);
        
        // Don't expose internal server errors in production
        if (NODE_ENV === 'production' && error.message.includes('Internal')) {
          return new Error('Internal server error');
        }
        
        return error;
      },
      introspection: NODE_ENV !== 'production',
    });

    // Start Apollo Server
    await server.start();

    // Apply middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(corsOptions),
      json({ limit: '10mb' }),
      expressMiddleware(server, {
        context: createContext,
      })
    );

    // Error handling middleware
    app.use(errorHandler);

    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, resolve);
    });

    // Start cron jobs
    if (NODE_ENV === 'production') {
      startCronJobs();
    }

    logger.info(`🚀 Server ready at http://localhost:${PORT}`);
    logger.info(`🔗 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    logger.info(`💾 Environment: ${NODE_ENV}`);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await server.stop();
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await server.stop();
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
