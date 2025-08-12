import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Rate limiting for mobile API
const mobileApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window for mobile
  message: {
    success: false,
    message: 'Too many requests from this device',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all mobile routes
router.use(mobileApiLimiter);

// @route   GET /mobile/profile
// @desc    Get user profile optimized for mobile
// @access  Private
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    // Optimized user data for mobile
    const mobileProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      stats: {
        repositories: 45, // TODO: Get from GitHub integration
        commits: 1250,
        problemsSolved: 89,
        projects: 12,
        streakDays: 15
      },
      preferences: {
        theme: user.settings?.theme || 'system',
        notifications: user.settings?.notifications || {},
        language: user.settings?.language || 'en'
      },
      lastActivity: user.lastLoginAt,
      joinedAt: user.createdAt
    };

    res.json({
      success: true,
      data: mobileProfile
    });

  } catch (error) {
    logger.error('Mobile profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   GET /mobile/dashboard
// @desc    Get dashboard data optimized for mobile
// @access  Private
router.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    // Optimized dashboard data for mobile
    const dashboardData = {
      stats: {
        repositories: 45,
        commits: 1250,
        problemsSolved: 89,
        projects: 12,
        todayCommits: 5,
        weeklyStreak: 7
      },
      quickActions: [
        {
          id: 'start_coding',
          title: 'Start Coding',
          description: 'Jump into a new coding session',
          icon: 'code',
          route: '/code-challenges'
        },
        {
          id: 'github_sync',
          title: 'GitHub Sync',
          description: 'Sync your latest repositories',
          icon: 'github',
          route: '/github'
        },
        {
          id: 'ai_mentor',
          title: 'AI Mentor',
          description: 'Get personalized guidance',
          icon: 'brain',
          route: '/ai-mentor'
        },
        {
          id: 'update_journal',
          title: 'Update Journal',
          description: 'Log your daily progress',
          icon: 'book',
          route: '/journal'
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'commit',
          title: 'Pushed to main branch',
          description: 'Updated mobile responsive design',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          icon: 'github'
        },
        {
          id: 2,
          type: 'problem',
          title: 'Solved: Two Sum Problem',
          description: 'Completed in 15 minutes',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          icon: 'check-circle'
        },
        {
          id: 3,
          type: 'journal',
          title: 'Daily reflection added',
          description: 'Documented learning progress',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          icon: 'book'
        }
      ],
      todaysFocus: [
        {
          id: 1,
          title: 'Complete React Native tutorial',
          description: '2 of 5 chapters completed',
          progress: 40,
          priority: 'medium',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: 'Review pull requests',
          description: '3 PRs pending review',
          progress: 0,
          priority: 'high',
          dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
        }
      ],
      achievements: [
        {
          id: 1,
          title: '7-Day Streak',
          description: 'Committed code for 7 consecutive days',
          icon: 'fire',
          unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    logger.error('Mobile dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /mobile/settings
// @desc    Update user settings for mobile
// @access  Private
router.post('/settings', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { theme, notifications, language, privacy } = req.body;

    // Update mobile-specific settings
    const updatedSettings = {
      ...user.settings,
      theme: theme || user.settings?.theme,
      language: language || user.settings?.language || 'en',
      notifications: {
        ...user.settings?.notifications,
        ...notifications
      },
      privacy: {
        ...user.settings?.privacy,
        ...privacy
      },
      mobile: {
        pushNotifications: req.body.pushNotifications ?? true,
        biometricAuth: req.body.biometricAuth ?? false,
        offlineMode: req.body.offlineMode ?? true,
        dataUsage: req.body.dataUsage || 'normal', // 'low', 'normal', 'high'
        autoSync: req.body.autoSync ?? true
      }
    };

    user.settings = updatedSettings;
    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: updatedSettings
      }
    });

  } catch (error) {
    logger.error('Mobile settings update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   GET /mobile/notifications
// @desc    Get notifications for mobile
// @access  Private
router.get('/notifications', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    // Mock notifications data - replace with actual notification system
    const notifications = [
      {
        id: 1,
        title: 'New GitHub Activity',
        message: 'You have 3 new stars on your repository',
        type: 'github',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        data: {
          repository: 'my-awesome-project',
          stars: 3
        }
      },
      {
        id: 2,
        title: 'Daily Goal Reminder',
        message: 'Complete your daily coding challenge',
        type: 'reminder',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Streak Achievement',
        message: 'Congratulations! You\'ve maintained a 7-day coding streak',
        type: 'achievement',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        data: {
          achievement: '7-day-streak',
          streakDays: 7
        }
      }
    ];

    // Filter unread only if requested
    const filteredNotifications = unreadOnly === 'true' 
      ? notifications.filter(n => !n.isRead)
      : notifications;

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(filteredNotifications.length / Number(limit)),
          totalItems: filteredNotifications.length,
          hasMore: endIndex < filteredNotifications.length
        },
        unreadCount: notifications.filter(n => !n.isRead).length
      }
    });

  } catch (error) {
    logger.error('Mobile notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /mobile/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.post('/notifications/:id/read', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement actual notification marking logic
    logger.info(`Notification ${id} marked as read for user ${req.user!._id}`);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   POST /mobile/sync
// @desc    Sync mobile app data
// @access  Private
router.post('/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { lastSyncTime, deviceInfo } = req.body;

    // Update user's last sync time and device info
    user.lastLoginAt = new Date();
    await user.save();

    // Return sync data
    const syncData = {
      serverTime: new Date().toISOString(),
      userVersion: user.updatedAt?.toISOString() || user.createdAt.toISOString(),
      hasUpdates: lastSyncTime ? new Date(lastSyncTime) < (user.updatedAt || user.createdAt) : true,
      syncId: `sync_${Date.now()}_${user._id}`
    };

    logger.info(`Mobile sync completed for user ${user._id}`, { deviceInfo });

    res.json({
      success: true,
      data: syncData
    });

  } catch (error) {
    logger.error('Mobile sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// @route   GET /mobile/health
// @desc    Mobile app health check
// @access  Public
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'DevBoard Mobile API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

export default router;
