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

// Mock user data storage
let mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  bio: 'Full-stack developer passionate about building amazing applications.',
  githubUsername: 'johndoe',
  stackOverflowUsername: 'johndoe',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  twitterUrl: 'https://twitter.com/johndoe',
  personalWebsite: 'https://johndoe.dev'
};

// Schema with user profile support
const typeDefs = `
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    username: String
    bio: String
    githubUsername: String
    stackOverflowUsername: String
    linkedinUrl: String
    twitterUrl: String
    personalWebsite: String
  }

  type Query {
    hello: String
    health: String
    user: User
  }

  type Mutation {
    updateUserProfile(input: UserInput!): User
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    username: String
    bio: String
    githubUsername: String
    stackOverflowUsername: String
    linkedinUrl: String
    twitterUrl: String
    personalWebsite: String
  }
`;

// Resolvers with user profile support
const resolvers = {
  Query: {
    hello: () => 'Hello from DevBoard GraphQL Server!',
    health: () => 'Server is running successfully!',
    user: () => mockUser,
  },
  Mutation: {
    updateUserProfile: (_: any, { input }: { input: any }) => {
      console.log('Updating user profile with:', input);
      // Update mock user with new data
      mockUser = { ...mockUser, ...input };
      return mockUser;
    },
  },
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
        origin: ['http://localhost:3000', 'http://localhost:3001'],
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
