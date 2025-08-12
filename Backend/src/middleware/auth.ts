import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';
import { AuthenticationError, AuthorizationError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

// Generate access token (15 minutes)
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate refresh token (7 days)
export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      userId: user._id,
      tokenVersion: user.tokenVersion || 0,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Access token verification failed:', error);
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Refresh token verification failed:', error);
    return null;
  }
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Add user and token to request
    req.user = user;
    req.token = token;
    
    // Log authentication
    logger.info('User authenticated', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors
    next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AuthorizationError('Insufficient permissions'));
      return;
    }

    next();
  };
};

export const requireOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError('Authentication required'));
      return;
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (req.user.role !== 'admin' && req.user._id.toString() !== resourceUserId) {
      next(new AuthorizationError('Access denied'));
      return;
    }

    next();
  };
};

// Middleware to require authentication
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
    return;
  }
  next();
};

// Middleware to require admin role
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Admin access required',
      code: 'FORBIDDEN'
    });
    return;
  }
  next();
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
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
  
  // Check for token in query parameters (not recommended for production)
  const queryToken = req.query.token as string;
  if (queryToken) {
    return queryToken;
  }
  
  return null;
}

// Generate JWT token
export const generateToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload as object, secret, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  } as SignOptions);
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

// Decode JWT token without verification
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};
