import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';

// Import configurations and utilities
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { logger } from './utils/logger';

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

async function startDevServer() {
  try {
    // Create Express app
    const app = express();
    
    // Create HTTP server
    const httpServer = http.createServer(app);

    logger.info('🚀 Starting DevBoard Backend in Development Mode...');

    // CORS configuration
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    };

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        mode: 'development',
        message: 'DevBoard Backend is running in development mode' 
      });
    });

    // Basic dev context
    const createDevContext = async ({ req, res }: { req: any; res: any }): Promise<MyContext> => ({
      isAuthenticated: false,
      dataSources: {
        github: null,
        stackoverflow: null,
        openai: null,
      },
    } as MyContext);

    // Create Apollo Server
    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
      introspection: true,
    });

    // Start the server
    await server.start();

    // Apply middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(corsOptions),
      json(),
      expressMiddleware(server, {
        context: createDevContext,
      })
    );

    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, () => {
        resolve();
      });
    });

    logger.info(`🚀 DevBoard Backend ready at http://localhost:${PORT}/graphql`);
    logger.info(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    logger.info(`🏥 Health check at http://localhost:${PORT}/health`);

  } catch (error) {
    logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the development server
startDevServer();
