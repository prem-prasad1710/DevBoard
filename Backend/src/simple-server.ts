import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Simple schema for testing
const typeDefs = `
  type Query {
    hello: String
    health: String
  }
`;

// Simple resolvers for testing
const resolvers = {
  Query: {
    hello: () => 'Hello from DevBoard GraphQL Server!',
    health: () => 'Server is running successfully!'
  }
};

async function startServer() {
  try {
    const app = express();
    const httpServer = http.createServer(app);

    console.log('🚀 Starting DevBoard Backend...');

    // Try to connect to MongoDB if available
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devboard');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.log('⚠️  MongoDB not available, continuing without database');
    }

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'DevBoard Backend is running'
      });
    });

    // Create Apollo Server
    const server = new ApolloServer({
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
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      }),
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      })
    );

    // Start HTTP server
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
