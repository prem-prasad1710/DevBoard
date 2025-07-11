import { Request } from 'express';
import { User } from '../models/User';
import { GitHubService } from '../services/GitHubService';
import { StackOverflowService } from '../services/StackOverflowService';
import { OpenAIService } from '../services/OpenAIService';
import { verifyToken } from '../middleware/auth';
import { logger } from '../utils/logger';

export interface GraphQLContext {
  user?: any;
  token?: string;
  isAuthenticated: boolean;
  dataSources: {
    github: GitHubService;
    stackoverflow: StackOverflowService;
    openai: OpenAIService;
  };
  req: Request;
}

export const createContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const context: GraphQLContext = {
    isAuthenticated: false,
    dataSources: {
      github: new GitHubService(),
      stackoverflow: new StackOverflowService(),
      openai: new OpenAIService(),
    },
    req,
  };

  try {
    // Extract token from request
    const token = extractToken(req);
    
    if (token) {
      // Verify token
      const decoded = verifyToken(token);
      
      // Find user
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        context.user = user;
        context.token = token;
        context.isAuthenticated = true;
        
        logger.debug('GraphQL context created with authenticated user', {
          userId: user._id,
          email: user.email,
        });
      }
    }
  } catch (error) {
    logger.warn('Failed to authenticate user in GraphQL context:', error);
    // Context will remain unauthenticated
  }

  return context;
};

// Helper function to extract token from request
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check for token in cookies
  const token = req.cookies?.token;
  if (token) {
    return token;
  }
  
  return null;
}

// Helper function to check if user is authenticated
export const requireAuth = (context: GraphQLContext) => {
  if (!context.isAuthenticated || !context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
};

// Helper function to check if user is admin
export const requireAdmin = (context: GraphQLContext) => {
  const user = requireAuth(context);
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
};

// Helper function to check if user owns resource
export const requireOwnership = (context: GraphQLContext, resourceUserId: string) => {
  const user = requireAuth(context);
  if (user.role !== 'admin' && user._id.toString() !== resourceUserId) {
    throw new Error('Access denied');
  }
  return user;
};
