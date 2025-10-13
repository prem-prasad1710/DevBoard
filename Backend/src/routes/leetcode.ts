import { Router, Request, Response } from 'express';
import { leetCodeService } from '../services/LeetCodeService';
import { logger } from '../utils/logger';

const router = Router();

// Base interface for API responses
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * GET /api/leetcode/validate/:username
 * Validate if a LeetCode username exists
 */
router.get('/validate/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      } as ApiResponse);
    }

    logger.info(`Validating LeetCode username: ${username}`);
    const isValid = await leetCodeService.validateUsername(username.trim());

    res.json({
      success: true,
      data: {
        username: username.trim(),
        exists: isValid,
      },
      message: isValid ? 'Username exists' : 'Username not found',
    } as ApiResponse);
  } catch (error) {
    logger.error('Error validating LeetCode username:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate username',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/profile/:username
 * Get LeetCode user profile
 */
router.get('/profile/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      } as ApiResponse);
    }

    logger.info(`Fetching LeetCode profile for: ${username}`);
    const profile = await leetCodeService.getUserProfile(username.trim());

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: profile,
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching LeetCode profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/stats/:username
 * Get LeetCode user statistics
 */
router.get('/stats/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      } as ApiResponse);
    }

    logger.info(`Fetching LeetCode stats for: ${username}`);
    const stats = await leetCodeService.getUserStats(username.trim());

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'User stats not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: stats,
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching LeetCode stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/submissions/:username
 * Get recent LeetCode submissions
 */
router.get('/submissions/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { limit } = req.query;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      } as ApiResponse);
    }

    const limitNum = parseInt(limit as string) || 20;
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 100',
      } as ApiResponse);
    }

    logger.info(`Fetching LeetCode submissions for: ${username}, limit: ${limitNum}`);
    const submissions = await leetCodeService.getRecentSubmissions(username.trim(), limitNum);

    res.json({
      success: true,
      data: {
        submissions,
        count: submissions.length,
        username: username.trim(),
      },
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching LeetCode submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/sync/:username
 * Get comprehensive LeetCode data (profile + stats + submissions)
 */
router.get('/sync/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      } as ApiResponse);
    }

    logger.info(`Syncing comprehensive LeetCode data for: ${username}`);
    const data = await leetCodeService.getComprehensiveUserData(username.trim());

    res.json({
      success: data.success,
      data,
      message: data.success ? 'Data synced successfully' : 'Partial sync completed with errors',
    } as ApiResponse);
  } catch (error) {
    logger.error('Error syncing LeetCode data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync LeetCode data',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/problem/:titleSlug
 * Get problem details by title slug
 */
router.get('/problem/:titleSlug', async (req: Request, res: Response) => {
  try {
    const { titleSlug } = req.params;

    if (!titleSlug || titleSlug.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Problem title slug is required',
      } as ApiResponse);
    }

    logger.info(`Fetching LeetCode problem: ${titleSlug}`);
    const problem = await leetCodeService.getProblemDetails(titleSlug.trim());

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: problem,
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching LeetCode problem:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problem details',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/problems
 * Get all problems with pagination and filtering
 */
router.get('/problems', async (req: Request, res: Response) => {
  try {
    const { 
      skip = '0', 
      limit = '50', 
      difficulty, 
      status, 
      tags 
    } = req.query;

    const skipNum = parseInt(skip as string) || 0;
    const limitNum = parseInt(limit as string) || 50;

    if (skipNum < 0) {
      return res.status(400).json({
        success: false,
        error: 'Skip must be non-negative',
      } as ApiResponse);
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 100',
      } as ApiResponse);
    }

    // Build filters
    const filters: any = {};
    if (difficulty) {
      filters.difficulty = difficulty;
    }
    if (status) {
      filters.status = status;
    }
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }

    logger.info(`Fetching LeetCode problems - skip: ${skipNum}, limit: ${limitNum}, filters:`, filters);
    const result = await leetCodeService.getAllProblems(skipNum, limitNum, Object.keys(filters).length > 0 ? filters : undefined);

    res.json({
      success: true,
      data: {
        problems: result.questions,
        total: result.total,
        skip: skipNum,
        limit: limitNum,
        hasMore: skipNum + limitNum < result.total,
      },
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching LeetCode problems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problems',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/daily-challenge
 * Get today's daily challenge
 */
router.get('/daily-challenge', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching LeetCode daily challenge');
    const challenge = await leetCodeService.getDailyChallenge();

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Daily challenge not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: challenge,
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching daily challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch daily challenge',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/search
 * Search problems by keyword
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q: keyword, limit = '20' } = req.query;

    if (!keyword || (keyword as string).trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search keyword is required',
      } as ApiResponse);
    }

    const limitNum = parseInt(limit as string) || 20;
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 100',
      } as ApiResponse);
    }

    logger.info(`Searching LeetCode problems with keyword: ${keyword}`);
    const problems = await leetCodeService.searchProblems(keyword as string, limitNum);

    res.json({
      success: true,
      data: {
        problems,
        keyword: keyword as string,
        count: problems.length,
      },
    } as ApiResponse);
  } catch (error) {
    logger.error('Error searching LeetCode problems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search problems',
    } as ApiResponse);
  }
});

/**
 * GET /api/leetcode/contest/:contestSlug
 * Get contest information
 */
router.get('/contest/:contestSlug', async (req: Request, res: Response) => {
  try {
    const { contestSlug } = req.params;

    if (!contestSlug || contestSlug.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Contest slug is required',
      } as ApiResponse);
    }

    logger.info(`Fetching LeetCode contest: ${contestSlug}`);
    const contest = await leetCodeService.getContestInfo(contestSlug.trim());

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: contest,
    } as ApiResponse);
  } catch (error) {
    logger.error('Error fetching contest info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contest information',
    } as ApiResponse);
  }
});

export default router;
