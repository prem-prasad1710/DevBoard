import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';
import { User, IUser } from '../models/User';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  AuthRequest,
  requireAuth,
  validatePassword
} from '../middleware/auth';
import { logger } from '../utils/logger';
import emailService from '../services/emailService2';
import crypto from 'crypto';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const updatePasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to create user response
const createUserResponse = (user: IUser) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  role: user.role,
  isActive: user.isActive,
  emailVerified: user.emailVerified,
  settings: user.settings,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerLimiter, async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const { username, email, password } = value;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
        code: 'WEAK_PASSWORD'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`,
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      settings: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          dailyDigest: true,
          weeklyReport: true,
          aiNudges: true,
        },
        privacy: {
          publicProfile: true,
          showActivity: true,
          showStats: true,
        },
        integrations: {
          github: false,
          stackoverflow: false,
          reddit: false,
          vscode: false,
        },
      },
      profile: {
        goals: [],
        skills: [],
        interests: [],
        experience: 'beginner',
        focusAreas: [],
        careerGoals: [],
      },
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send welcome email (don't wait for it)
    emailService.sendEmail({
      to: user.email,
      subject: 'Welcome to DevBoard!',
      template: 'welcome',
      data: { username: user.username }
    }).catch((error: any) => {
      logger.error('Failed to send welcome email:', error);
    });

    logger.info(`New user registered: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: createUserResponse(user),
        tokens: {
          accessToken,
          refreshToken,
        }
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password, rememberMe } = value;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: createUserResponse(user),
        tokens: {
          accessToken,
          refreshToken,
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check token version
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked',
        code: 'TOKEN_REVOKED'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      }
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /auth/logout
// @desc    Logout user (revoke refresh tokens)
// @access  Private
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    // Increment token version to invalidate all refresh tokens
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    logger.info(`User logged out: ${user.email}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    res.json({
      success: true,
      data: {
        user: createUserResponse(user)
      }
    });

  } catch (error) {
    logger.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const { email } = value;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists or not
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await emailService.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'passwordReset',
      data: { 
        username: user.username,
        resetUrl,
        expiresIn: '10 minutes'
      }
    });

    logger.info(`Password reset requested for: ${user.email}`);

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });

  } catch (error) {
    logger.error('Password reset error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const { token, newPassword } = value;

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
        code: 'WEAK_PASSWORD'
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
        code: 'INVALID_RESET_TOKEN'
      });
    }

    // Hash new password
    const saltRounds = 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all sessions
    
    await user.save();

    logger.info(`Password reset completed for: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    logger.error('Password reset completion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
