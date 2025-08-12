import express, { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuthRequest, requireAuth, validatePassword } from '../middleware/auth';
import { logger } from '../utils/logger';
import { uploadService } from '../services/uploadService2';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// Validation schemas
const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  bio: Joi.string().max(500).allow(''),
  location: Joi.string().max(100).allow(''),
  website: Joi.string().uri().max(200).allow(''),
  company: Joi.string().max(100).allow(''),
  githubUsername: Joi.string().max(50).allow(''),
  stackoverflowId: Joi.string().max(50).allow(''),
});

const updateSettingsSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark', 'system'),
  notifications: Joi.object({
    email: Joi.boolean(),
    push: Joi.boolean(),
    dailyDigest: Joi.boolean(),
    weeklyReport: Joi.boolean(),
    aiNudges: Joi.boolean(),
  }),
  privacy: Joi.object({
    publicProfile: Joi.boolean(),
    showActivity: Joi.boolean(),
    showStats: Joi.boolean(),
  }),
  integrations: Joi.object({
    github: Joi.boolean(),
    stackoverflow: Joi.boolean(),
    reddit: Joi.boolean(),
    vscode: Joi.boolean(),
  }),
});

const updateGoalsSchema = Joi.object({
  goals: Joi.array().items(Joi.string().max(200)).max(10),
  skills: Joi.array().items(Joi.string().max(50)).max(20),
  interests: Joi.array().items(Joi.string().max(50)).max(15),
  experience: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
  focusAreas: Joi.array().items(Joi.string().max(50)).max(10),
  careerGoals: Joi.array().items(Joi.string().max(200)).max(5),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

// Helper function to create user response
const createUserResponse = (user: any) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  location: user.location,
  website: user.website,
  company: user.company,
  githubUsername: user.githubUsername,
  stackoverflowId: user.stackoverflowId,
  role: user.role,
  isActive: user.isActive,
  emailVerified: user.emailVerified,
  profile: user.profile,
  settings: user.settings,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});

// @route   GET /users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    res.json({
      success: true,
      data: {
        user: createUserResponse(user)
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   PUT /users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const user = req.user!;

    // Check if username is already taken (if being changed)
    if (value.username && value.username !== user.username) {
      const existingUser = await User.findOne({ username: value.username });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username is already taken',
          code: 'USERNAME_TAKEN'
        });
      }
    }

    // Update user fields
    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        (user as any)[key] = value[key];
      }
    });

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: createUserResponse(user)
      }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /users/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', requireAuth, upload.single('avatar'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        code: 'NO_FILE'
      });
    }

    const user = req.user!;

    // Upload to cloud storage (implement uploadService)
    const avatarUrl = await uploadService.uploadAvatar(req.file, user._id);

    // Update user avatar
    user.avatarUrl = avatarUrl;
    await user.save();

    logger.info(`Avatar updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatarUrl
      }
    });

  } catch (error) {
    logger.error('Upload avatar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      code: 'UPLOAD_ERROR'
    });
  }
});

// @route   PUT /users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = updateSettingsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const user = req.user!;

    // Update settings
    if (value.theme) user.settings.theme = value.theme;
    if (value.notifications) {
      user.settings.notifications = { ...user.settings.notifications, ...value.notifications };
    }
    if (value.privacy) {
      user.settings.privacy = { ...user.settings.privacy, ...value.privacy };
    }
    if (value.integrations) {
      user.settings.integrations = { ...user.settings.integrations, ...value.integrations };
    }

    await user.save();

    logger.info(`Settings updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: user.settings
      }
    });

  } catch (error) {
    logger.error('Update settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   PUT /users/goals
// @desc    Update user goals and profile
// @access  Private
router.put('/goals', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = updateGoalsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const user = req.user!;

    // Update profile fields
    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        (user.profile as any)[key] = value[key];
      }
    });

    await user.save();

    logger.info(`Goals updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Goals updated successfully',
      data: {
        profile: user.profile
      }
    });

  } catch (error) {
    logger.error('Update goals error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   PUT /users/password
// @desc    Change user password
// @access  Private
router.put('/password', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        code: 'VALIDATION_ERROR'
      });
    }

    const { currentPassword, newPassword } = value;

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

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const saltRounds = 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all sessions

    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   DELETE /users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    // Deactivate instead of delete for data integrity
    user.isActive = false;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all sessions

    await user.save();

    logger.info(`Account deactivated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    logger.error('Deactivate account error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   GET /users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    // This would typically aggregate data from various collections
    // For now, return mock data structure
    const stats = {
      github: {
        repositories: 0,
        commits: 0,
        stars: 0,
        forks: 0,
      },
      stackoverflow: {
        reputation: 0,
        questions: 0,
        answers: 0,
        badges: 0,
      },
      projects: {
        total: 0,
        completed: 0,
        inProgress: 0,
      },
      journal: {
        entries: 0,
        wordsWritten: 0,
      },
      aiMentor: {
        questionsAsked: 0,
        suggestionsReceived: 0,
      }
    };

    res.json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    logger.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
