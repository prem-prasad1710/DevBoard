import express from 'express';
import { User, IUser } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.updateLastActivity();

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      company,
      jobTitle,
      skills,
      socialLinks
    } = req.body;

    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (company !== undefined) user.company = company;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (skills !== undefined) user.skills = skills;
    if (socialLinks !== undefined) user.socialLinks = { ...user.socialLinks, ...socialLinks };

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   PUT /api/profile/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      theme,
      language,
      timezone,
      dateFormat,
      timeFormat,
      notifications,
      privacy,
      integrations,
      dashboard,
      coding
    } = req.body;

    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update settings
    if (theme !== undefined) user.settings.theme = theme;
    if (language !== undefined) user.settings.language = language;
    if (timezone !== undefined) user.settings.timezone = timezone;
    if (dateFormat !== undefined) user.settings.dateFormat = dateFormat;
    if (timeFormat !== undefined) user.settings.timeFormat = timeFormat;
    if (notifications !== undefined) {
      user.settings.notifications = { ...user.settings.notifications, ...notifications };
    }
    if (privacy !== undefined) {
      user.settings.privacy = { ...user.settings.privacy, ...privacy };
    }
    if (integrations !== undefined) {
      user.settings.integrations = { ...user.settings.integrations, ...integrations };
    }
    if (dashboard !== undefined) {
      user.settings.dashboard = { ...user.settings.dashboard, ...dashboard };
    }
    if (coding !== undefined) {
      user.settings.coding = { ...user.settings.coding, ...coding };
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
    res.status(500).json({
      success: false,
      message: 'Server error updating settings'
    });
  }
});

// @route   GET /api/profile/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        stats: user.stats
      }
    });

  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting statistics'
    });
  }
});

// @route   GET /api/profile/leaderboard
// @desc    Get user leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const users = await User.getLeaderboard(Number(limit));

    res.json({
      success: true,
      data: {
        leaderboard: users
      }
    });

  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting leaderboard'
    });
  }
});

export default router;
