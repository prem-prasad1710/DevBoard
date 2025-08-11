import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Simple GraphQL schema for development
const typeDefs = `
  type Query {
    hello: String
    health: String
  }
  
  type Mutation {
    updateProfile(input: UpdateProfileInput!): User!
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    stackoverflowId: String
  }
  
  input UpdateProfileInput {
    stackoverflowId: String
  }
`;

// Simple resolvers for development
const resolvers = {
  Query: {
    hello: () => 'Hello from DevBoard Backend!',
    health: () => 'OK'
  },
  Mutation: {
    updateProfile: async (_: any, { input }: any) => {
      console.log('updateProfile called with:', input);
      // Return mock user data
      return {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        stackoverflowId: input.stackoverflowId
      };
    }
  }
};

async function startStandaloneServer() {
  try {
    console.log('🚀 Starting DevBoard Backend in Standalone Mode...');

    // Create Express app
    const app = express();
    
    // Create HTTP server
    const httpServer = http.createServer(app);

    // CORS configuration
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    };

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    });

    // Start the server
    await server.start();

    // Apply middleware
    app.use(
      '/graphql',
      cors(corsOptions),
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          return {
            user: null,
            token: null,
            isAuthenticated: false,
            dataSources: {
              github: null,
              stackoverflow: null,
              openai: null,
            },
          };
        },
      })
    );

    // Start HTTP server
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    
    console.log(`✅ Server ready at http://localhost:${PORT}/`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Gracefully shutting down...');
  process.exit(0);
});

// Start the server
startStandaloneServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
