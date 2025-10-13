import { GraphQLContext, requireAuth, requireOwnership } from './context';
import { User } from '../models/User';
import { generateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ValidationError, AuthenticationError, ConflictError } from '../middleware/errorHandler';
import { 
  GitHubActivity, 
  DeveloperJournal, 
  Project, 
  Resume, 
  StackOverflowActivity,
  OpenIssue,
  AIChat,
  CodeChallenge 
} from '../models';
import { 
  GitHubService, 
  StackOverflowService, 
  OpenAIService, 
  DataAnalyticsService,
  LeetCodeService 
} from '../services';
import { GraphQLScalarType, Kind } from 'graphql';

// Custom scalar types
const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (value: any) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue: (value: any) => {
    return new Date(value);
  },
  parseLiteral: (ast: any) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const JSONType = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize: (value: any) => value,
  parseValue: (value: any) => value,
  parseLiteral: (ast: any) => {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        return null;
      }
    }
    return null;
  },
});

export const resolvers = {
  // Scalar types
  Date: DateType,
  JSON: JSONType,

  Query: {
    // User queries
    me: async (_: any, __: any, context: GraphQLContext) => {
      const user = requireAuth(context);
      return user;
    },

    user: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if profile is public or user is owner/admin
      if (!user.settings.privacy.publicProfile) {
        requireOwnership(context, user._id.toString());
      }
      
      return user;
    },

    users: async (_: any, __: any, context: GraphQLContext) => {
      // Only admins can list all users
      const currentUser = requireAuth(context);
      if (currentUser.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      return await User.find({ isActive: true });
    },

    // GitHub queries
    githubActivity: async (
      _: any,
      { userId, limit = 20, offset = 0 }: { userId: string; limit?: number; offset?: number },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const activities = await GitHubActivity.find({ userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset);
        
        return activities;
      } catch (error) {
        logger.error('Failed to fetch GitHub activity:', error);
        throw error;
      }
    },

    githubRepos: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const user = await User.findById(userId);
        if (!user || !user.githubUsername) {
          throw new Error('GitHub username not configured');
        }

        const githubService = new GitHubService();
        const repos = await githubService.getUserRepositories(user.githubUsername);
        return repos;
      } catch (error) {
        logger.error('Failed to fetch GitHub repos:', error);
        throw error;
      }
    },

    githubStats: async (
      _: any,
      { userId, period = 'week' }: { userId: string; period?: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const user = await User.findById(userId);
        if (!user || !user.githubUsername) {
          throw new Error('GitHub username not configured');
        }

        // For now, return basic stats structure
        // TODO: Implement proper stats calculation
        return {
          totalCommits: 0,
          totalPRs: 0,
          totalIssues: 0,
          totalStars: 0,
          languages: [],
          period
        };
      } catch (error) {
        logger.error('Failed to fetch GitHub stats:', error);
        throw error;
      }
    },

    openIssues: async (
      _: any,
      { 
        userId, 
        technologies = [], 
        difficulty = 'BEGINNER',
        limit = 10 
      }: { 
        userId: string; 
        technologies?: string[]; 
        difficulty?: string;
        limit?: number 
      },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const user = await User.findById(userId);
        if (!user || !user.githubUsername) {
          throw new Error('GitHub username not configured');
        }

        const githubService = new GitHubService();
        const query = `is:issue is:open ${technologies.map(t => `language:${t}`).join(' ')} good-first-issue`;
        const issues = await githubService.searchIssues(query, {
          sort: 'created'
        });
        
        return issues;
      } catch (error) {
        logger.error('Failed to fetch open issues:', error);
        throw error;
      }
    },

    // StackOverflow queries
    stackoverflowActivity: async (
      _: any,
      { userId, limit = 20, offset = 0 }: { userId: string; limit?: number; offset?: number },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const activities = await StackOverflowActivity.find({ userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset);
        
        return activities;
      } catch (error) {
        logger.error('Failed to fetch StackOverflow activity:', error);
        throw error;
      }
    },

    stackoverflowProfile: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const user = await User.findById(userId);
        if (!user || !user.stackoverflowId) {
          throw new Error('StackOverflow ID not configured');
        }

        const stackOverflowService = new StackOverflowService();
        const profile = await stackOverflowService.getUserProfile(user.stackoverflowId);
        return profile;
      } catch (error) {
        logger.error('Failed to fetch StackOverflow profile:', error);
        throw error;
      }
    },

    // Journal queries
    journals: async (
      _: any,
      { userId, limit = 20, offset = 0 }: { userId: string; limit?: number; offset?: number },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const journals = await DeveloperJournal.find({ userId })
          .sort({ date: -1 })
          .limit(limit)
          .skip(offset);
        
        return journals;
      } catch (error) {
        logger.error('Failed to fetch journals:', error);
        throw error;
      }
    },

    journal: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        const journal = await DeveloperJournal.findById(id);
        if (!journal) {
          throw new Error('Journal not found');
        }
        
        requireOwnership(context, journal.userId);
        return journal;
      } catch (error) {
        logger.error('Failed to fetch journal:', error);
        throw error;
      }
    },

    // AI queries
    aiInsights: async (
      _: any,
      { userId, type, limit = 10 }: { userId: string; type?: string; limit?: number },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const dataAnalyticsService = new DataAnalyticsService();
        const insights = await dataAnalyticsService.getLearningInsights(userId);
        
        return insights;
      } catch (error) {
        logger.error('Failed to fetch AI insights:', error);
        throw error;
      }
    },

    aiChats: async (
      _: any,
      { userId, limit = 10 }: { userId: string; limit?: number },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const chats = await AIChat.find({ userId })
          .sort({ updatedAt: -1 })
          .limit(limit);
        
        return chats;
      } catch (error) {
        logger.error('Failed to fetch AI chats:', error);
        throw error;
      }
    },

    // Project queries
    projects: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const projects = await Project.find({ userId })
          .sort({ updatedAt: -1 });
        
        return projects;
      } catch (error) {
        logger.error('Failed to fetch projects:', error);
        throw error;
      }
    },

    project: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        const project = await Project.findById(id);
        if (!project) {
          throw new Error('Project not found');
        }
        
        requireOwnership(context, project.userId);
        return project;
      } catch (error) {
        logger.error('Failed to fetch project:', error);
        throw error;
      }
    },

    // Resume queries
    resume: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const resume = await Resume.findOne({ userId });
        return resume;
      } catch (error) {
        logger.error('Failed to fetch resume:', error);
        throw error;
      }
    },

    // Challenge queries
    codeChallenges: async (
      _: any,
      { difficulty, tags }: { difficulty?: string; tags?: string[] }
    ) => {
      try {
        const filter: any = {};
        if (difficulty) filter.difficulty = difficulty;
        if (tags && tags.length > 0) filter.tags = { $in: tags };
        
        const challenges = await CodeChallenge.find(filter)
          .sort({ createdAt: -1 })
          .limit(20);
        
        return challenges;
      } catch (error) {
        logger.error('Failed to fetch code challenges:', error);
        throw error;
      }
    },

    codeChallenge: async (
      _: any,
      { id }: { id: string }
    ) => {
      try {
        const challenge = await CodeChallenge.findById(id);
        if (!challenge) {
          throw new Error('Code challenge not found');
        }
        
        return challenge;
      } catch (error) {
        logger.error('Failed to fetch code challenge:', error);
        throw error;
      }
    },

    // Notification queries
    notifications: async (
      _: any,
      { userId, read }: { userId: string; read?: boolean },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      // This would fetch user's notifications
      // For now, return empty array
      return [];
    },

    // Achievement queries
    achievements: async () => {
      // This would fetch all available achievements
      // For now, return empty array
      return [];
    },

    userAchievements: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      // This would fetch user's achievements
      // For now, return empty array
      return [];
    },

    // Stats queries
    userStats: async (
      _: any,
      { userId, period = 'month' }: { userId: string; period?: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const dataAnalyticsService = new DataAnalyticsService();
        const stats = await dataAnalyticsService.getActivitySummary(userId, period as any);
        
        return stats;
      } catch (error) {
        logger.error('Failed to fetch user stats:', error);
        throw error;
      }
    },

    productivityMetrics: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const dataAnalyticsService = new DataAnalyticsService();
        const metrics = await dataAnalyticsService.getProductivityMetrics(userId);
        
        return metrics;
      } catch (error) {
        logger.error('Failed to fetch productivity metrics:', error);
        throw error;
      }
    },

    weeklyReport: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      requireOwnership(context, userId);
      
      try {
        const dataAnalyticsService = new DataAnalyticsService();
        const report = await dataAnalyticsService.generateWeeklyReport(userId);
        
        return report;
      } catch (error) {
        logger.error('Failed to fetch weekly report:', error);
        throw error;
      }
    },

    leaderboard: async (
      _: any,
      { period = 'month' }: { period?: string }
    ) => {
      try {
        // Simple leaderboard based on activity scores
        const users = await User.find({ isActive: true })
          .select('username avatarUrl')
          .limit(10);
        
        // TODO: Implement proper leaderboard calculation
        return users.map((user: any, index: number) => ({
          user,
          rank: index + 1,
          score: Math.floor(Math.random() * 1000), // Placeholder
          activities: Math.floor(Math.random() * 100) // Placeholder
        }));
      } catch (error) {
        logger.error('Failed to fetch leaderboard:', error);
        throw error;
      }
    },

    // LeetCode queries
    leetcodeProfile: async (
      _: any,
      { username }: { username: string },
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const profile = await leetcodeService.getUserProfile(username);
        
        if (!profile) {
          throw new Error('LeetCode profile not found');
        }
        
        return profile;
      } catch (error) {
        logger.error('Failed to fetch LeetCode profile:', error);
        throw error;
      }
    },

    leetcodeStats: async (
      _: any,
      { username }: { username: string },
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const stats = await leetcodeService.getUserStats(username);
        
        if (!stats) {
          throw new Error('LeetCode stats not found');
        }
        
        return stats;
      } catch (error) {
        logger.error('Failed to fetch LeetCode stats:', error);
        throw error;
      }
    },

    leetcodeSubmissions: async (
      _: any,
      { username, limit = 20 }: { username: string; limit?: number },
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const submissions = await leetcodeService.getRecentSubmissions(username, limit);
        
        return submissions;
      } catch (error) {
        logger.error('Failed to fetch LeetCode submissions:', error);
        throw error;
      }
    },

    leetcodeProblem: async (
      _: any,
      { titleSlug }: { titleSlug: string },
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const problem = await leetcodeService.getProblemDetails(titleSlug);
        
        if (!problem) {
          throw new Error('LeetCode problem not found');
        }
        
        return problem;
      } catch (error) {
        logger.error('Failed to fetch LeetCode problem:', error);
        throw error;
      }
    },

    leetcodeProblems: async (
      _: any,
      { skip = 0, limit = 50, filters }: { skip?: number; limit?: number; filters?: any },
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const result = await leetcodeService.getAllProblems(skip, limit, filters);
        
        return {
          problems: result.questions,
          total: result.total,
          hasMore: skip + limit < result.total,
        };
      } catch (error) {
        logger.error('Failed to fetch LeetCode problems:', error);
        throw error;
      }
    },

    leetcodeDailyChallenge: async (
      _: any,
      __: any,
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const challenge = await leetcodeService.getDailyChallenge();
        
        if (!challenge) {
          throw new Error('Daily challenge not found');
        }
        
        return challenge;
      } catch (error) {
        logger.error('Failed to fetch daily challenge:', error);
        throw error;
      }
    },

    searchLeetcodeProblems: async (
      _: any,
      { keyword, limit = 20 }: { keyword: string; limit?: number },
      context: GraphQLContext
    ) => {
      try {
        const leetcodeService = new LeetCodeService();
        const problems = await leetcodeService.searchProblems(keyword, limit);
        
        return problems;
      } catch (error) {
        logger.error('Failed to search LeetCode problems:', error);
        throw error;
      }
    },
  },

  Mutation: {
    // Auth mutations
    register: async (
      _: any,
      { input }: { input: { username: string; email: string; password: string; githubUsername?: string } }
    ) => {
      try {
        // Validate input
        if (!input.username || !input.email || !input.password) {
          throw new ValidationError('Username, email, and password are required');
        }

        if (input.password.length < 6) {
          throw new ValidationError('Password must be at least 6 characters long');
        }

        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { email: input.email.toLowerCase() },
            { username: input.username },
          ],
        });

        if (existingUser) {
          throw new ConflictError('User already exists with this email or username');
        }

        // Create new user
        const user = new User({
          username: input.username,
          email: input.email.toLowerCase(),
          password: input.password,
          githubUsername: input.githubUsername,
        });

        await user.save();

        // Generate token
        const token = generateToken({
          userId: user._id,
          email: user.email,
          role: user.role,
        });

        logger.info('User registered successfully', {
          userId: user._id,
          email: user.email,
          username: user.username,
        });

        return {
          token,
          user,
        };
      } catch (error) {
        logger.error('Registration failed:', error);
        throw error;
      }
    },

    login: async (
      _: any,
      { input }: { input: { email: string; password: string } }
    ) => {
      try {
        // Validate input
        if (!input.email || !input.password) {
          throw new ValidationError('Email and password are required');
        }

        // Find user
        const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');

        if (!user) {
          throw new AuthenticationError('Invalid credentials');
        }

        // Check if account is active
        if (!user.isActive) {
          throw new AuthenticationError('Account is deactivated');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(input.password);

        if (!isPasswordValid) {
          throw new AuthenticationError('Invalid credentials');
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate token
        const token = generateToken({
          userId: user._id,
          email: user.email,
          role: user.role,
        });

        logger.info('User logged in successfully', {
          userId: user._id,
          email: user.email,
        });

        return {
          token,
          user,
        };
      } catch (error) {
        logger.error('Login failed:', error);
        throw error;
      }
    },

    logout: async (_: any, __: any, context: GraphQLContext) => {
      // For JWT, logout is handled client-side by removing the token
      // Here we could implement token blacklisting if needed
      
      logger.info('User logged out', {
        userId: context.user?._id,
      });

      return true;
    },

    // User mutations
    updateProfile: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);

      try {
        // Update user fields
        if (input.bio !== undefined) user.bio = input.bio;
        if (input.location !== undefined) user.location = input.location;
        if (input.website !== undefined) user.website = input.website;
        if (input.company !== undefined) user.company = input.company;
        if (input.githubUsername !== undefined) user.githubUsername = input.githubUsername;
        if (input.stackoverflowId !== undefined) user.stackoverflowId = input.stackoverflowId;

        // Update profile
        if (input.profile) {
          user.profile = { ...user.profile, ...input.profile };
        }

        await user.save();

        logger.info('User profile updated', {
          userId: user._id,
        });

        return user;
      } catch (error) {
        logger.error('Profile update failed:', error);
        throw error;
      }
    },

    updateSettings: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);

      try {
        // Update settings
        if (input.theme) user.settings.theme = input.theme;
        if (input.notifications) {
          user.settings.notifications = { ...user.settings.notifications, ...input.notifications };
        }
        if (input.privacy) {
          user.settings.privacy = { ...user.settings.privacy, ...input.privacy };
        }
        if (input.integrations) {
          user.settings.integrations = { ...user.settings.integrations, ...input.integrations };
        }

        await user.save();

        logger.info('User settings updated', {
          userId: user._id,
        });

        return user;
      } catch (error) {
        logger.error('Settings update failed:', error);
        throw error;
      }
    },

    deleteAccount: async (_: any, __: any, context: GraphQLContext) => {
      const user = requireAuth(context);

      try {
        // Soft delete - mark as inactive
        user.isActive = false;
        await user.save();

        logger.info('User account deleted', {
          userId: user._id,
          email: user.email,
        });

        return true;
      } catch (error) {
        logger.error('Account deletion failed:', error);
        throw error;
      }
    },

    // Integration mutations
    syncGitHubData: async (_: any, __: any, context: GraphQLContext) => {
      const user = requireAuth(context);
      
      try {
        if (!user.githubUsername) {
          throw new Error('GitHub username not configured');
        }
        
        const githubService = new GitHubService();
        await githubService.syncUserActivity(user._id.toString(), user.githubUsername);
        
        logger.info('GitHub data synced', { userId: user._id });
        return true;
      } catch (error) {
        logger.error('GitHub sync failed:', error);
        throw error;
      }
    },

    connectGitHub: async (_: any, { token }: { token: string }, context: GraphQLContext) => {
      const user = requireAuth(context);
      
      try {
        // TODO: Validate GitHub token and get username
        // For now, just enable GitHub integration
        user.settings.integrations.github = true;
        await user.save();
        
        logger.info('GitHub connected', { userId: user._id });
        return true;
      } catch (error) {
        logger.error('GitHub connection failed:', error);
        throw error;
      }
    },

    disconnectGitHub: async (_: any, __: any, context: GraphQLContext) => {
      const user = requireAuth(context);
      
      try {
        user.settings.integrations.github = false;
        await user.save();
        
        logger.info('GitHub disconnected', { userId: user._id });
        return true;
      } catch (error) {
        logger.error('GitHub disconnection failed:', error);
        throw error;
      }
    },

    syncStackOverflowData: async (_: any, __: any, context: GraphQLContext) => {
      const user = requireAuth(context);
      
      try {
        if (!user.stackoverflowId) {
          throw new Error('StackOverflow ID not configured');
        }
        
        const stackOverflowService = new StackOverflowService();
        await stackOverflowService.syncUserActivity(user._id.toString(), user.stackoverflowId);
        
        logger.info('StackOverflow data synced', { userId: user._id });
        return true;
      } catch (error) {
        logger.error('StackOverflow sync failed:', error);
        throw error;
      }
    },

    // Journal mutations
    createJournal: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const journal = new DeveloperJournal({
          userId: user._id,
          date: input.date || new Date(),
          title: input.title,
          content: input.content,
          mood: input.mood,
          productivity: input.productivity,
          challenges: input.challenges || [],
          achievements: input.achievements || [],
          learnings: input.learnings || [],
          goals: input.goals || [],
          technologies: input.technologies || [],
          tags: input.tags || [],
          isPublic: input.isPublic || false,
          aiGenerated: false
        });
        
        await journal.save();
        
        logger.info('Journal created', { userId: user._id, journalId: journal._id });
        return journal;
      } catch (error) {
        logger.error('Journal creation failed:', error);
        throw error;
      }
    },

    updateJournal: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const journal = await DeveloperJournal.findById(id);
        if (!journal) {
          throw new Error('Journal not found');
        }
        
        requireOwnership(context, journal.userId);
        
        // Update fields
        Object.keys(input).forEach(key => {
          if (input[key] !== undefined) {
            (journal as any)[key] = input[key];
          }
        });
        
        await journal.save();
        
        logger.info('Journal updated', { userId: user._id, journalId: journal._id });
        return journal;
      } catch (error) {
        logger.error('Journal update failed:', error);
        throw error;
      }
    },

    deleteJournal: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const journal = await DeveloperJournal.findById(id);
        if (!journal) {
          throw new Error('Journal not found');
        }
        
        requireOwnership(context, journal.userId);
        
        await DeveloperJournal.findByIdAndDelete(id);
        
        logger.info('Journal deleted', { userId: user._id, journalId: id });
        return true;
      } catch (error) {
        logger.error('Journal deletion failed:', error);
        throw error;
      }
    },

    generateAIJournal: async (
      _: any,
      { prompt }: { prompt?: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const openAIService = new OpenAIService();
        // Get recent activities for context
        const activities = await GitHubActivity.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(10);
        
        const journal = await openAIService.generateJournalEntry(user._id.toString(), activities);
        
        logger.info('AI journal generated', { userId: user._id });
        return journal;
      } catch (error) {
        logger.error('AI journal generation failed:', error);
        throw error;
      }
    },

    // Project mutations
    createProject: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const project = new Project({
          userId: user._id,
          name: input.name,
          description: input.description,
          repository: input.repository,
          repositoryUrl: input.repositoryUrl,
          status: input.status || 'planning',
          priority: input.priority || 'medium',
          progress: 0,
          startDate: input.startDate || new Date(),
          endDate: input.endDate,
          estimatedHours: input.estimatedHours,
          actualHours: 0,
          technologies: input.technologies || [],
          tags: input.tags || [],
          goals: input.goals || [],
          challenges: input.challenges || [],
          learnings: input.learnings || [],
          tasks: [],
          milestones: [],
          collaborators: input.collaborators || [],
          isPublic: input.isPublic || false
        });
        
        await project.save();
        
        logger.info('Project created', { userId: user._id, projectId: project._id });
        return project;
      } catch (error) {
        logger.error('Project creation failed:', error);
        throw error;
      }
    },

    updateProject: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const project = await Project.findById(id);
        if (!project) {
          throw new Error('Project not found');
        }
        
        requireOwnership(context, project.userId);
        
        // Update fields
        Object.keys(input).forEach(key => {
          if (input[key] !== undefined) {
            (project as any)[key] = input[key];
          }
        });
        
        await project.save();
        
        logger.info('Project updated', { userId: user._id, projectId: project._id });
        return project;
      } catch (error) {
        logger.error('Project update failed:', error);
        throw error;
      }
    },

    deleteProject: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const project = await Project.findById(id);
        if (!project) {
          throw new Error('Project not found');
        }
        
        requireOwnership(context, project.userId);
        
        await Project.findByIdAndDelete(id);
        
        logger.info('Project deleted', { userId: user._id, projectId: id });
        return true;
      } catch (error) {
        logger.error('Project deletion failed:', error);
        throw error;
      }
    },

    // Resume mutations
    createResume: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        // Delete existing resume if any
        await Resume.deleteMany({ userId: user._id });
        
        const resume = new Resume({
          userId: user._id,
          personalInfo: input.personalInfo,
          summary: input.summary,
          experience: input.experience || [],
          education: input.education || [],
          skills: input.skills || [],
          projects: input.projects || [],
          certifications: input.certifications || [],
          achievements: input.achievements || [],
          customSections: input.customSections || [],
          template: input.template || 'modern',
          isPublic: input.isPublic || false
        });
        
        await resume.save();
        
        logger.info('Resume created', { userId: user._id, resumeId: resume._id });
        return resume;
      } catch (error) {
        logger.error('Resume creation failed:', error);
        throw error;
      }
    },

    updateResume: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const resume = await Resume.findOne({ userId: user._id });
        if (!resume) {
          throw new Error('Resume not found');
        }
        
        // Update fields
        Object.keys(input).forEach(key => {
          if (input[key] !== undefined) {
            (resume as any)[key] = input[key];
          }
        });
        
        await resume.save();
        
        logger.info('Resume updated', { userId: user._id, resumeId: resume._id });
        return resume;
      } catch (error) {
        logger.error('Resume update failed:', error);
        throw error;
      }
    },

    generateResumeSection: async (
      _: any,
      { section, context: sectionContext }: { section: string; context?: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const openAIService = new OpenAIService();
        const content = await openAIService.generateResumeSection(user._id.toString(), section, sectionContext);
        
        logger.info('Resume section generated', { userId: user._id, section });
        return content;
      } catch (error) {
        logger.error('Resume section generation failed:', error);
        throw error;
      }
    },

    // AI mutations
    createAIChat: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const aiChat = new AIChat({
          userId: user._id,
          title: input.title,
          type: input.type || 'general',
          messages: [],
          context: input.context || {}
        });
        
        await aiChat.save();
        
        logger.info('AI chat created', { userId: user._id, chatId: aiChat._id });
        return aiChat;
      } catch (error) {
        logger.error('AI chat creation failed:', error);
        throw error;
      }
    },

    sendAIMessage: async (
      _: any,
      { chatId, message }: { chatId: string; message: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const aiChat = await AIChat.findById(chatId);
        if (!aiChat) {
          throw new Error('AI chat not found');
        }
        
        requireOwnership(context, aiChat.userId);
        
        const openAIService = new OpenAIService();
        const response = await openAIService.startChatSession(user._id.toString(), aiChat.type, message);
        
        logger.info('AI message sent', { userId: user._id, chatId });
        return response;
      } catch (error) {
        logger.error('AI message failed:', error);
        throw error;
      }
    },

    // Content generation mutations
    generateBlogPost: async (
      _: any,
      { topic, style }: { topic: string; style?: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const openAIService = new OpenAIService();
        const content = await openAIService.generateBlogPost(user._id.toString(), topic, style as any);
        
        logger.info('Blog post generated', { userId: user._id, topic });
        return content;
      } catch (error) {
        logger.error('Blog post generation failed:', error);
        throw error;
      }
    },

    generateTweet: async (
      _: any,
      { topic, style }: { topic: string; style?: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const openAIService = new OpenAIService();
        const content = await openAIService.generateTweet(user._id.toString(), topic, style as any);
        
        logger.info('Tweet generated', { userId: user._id, topic });
        return content;
      } catch (error) {
        logger.error('Tweet generation failed:', error);
        throw error;
      }
    },

    // LeetCode mutations
    connectLeetCode: async (
      _: any,
      { username }: { username: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const leetcodeService = new LeetCodeService();
        const isValid = await leetcodeService.validateUsername(username);
        
        if (!isValid) {
          throw new Error('LeetCode username not found');
        }
        
        // Update user with LeetCode username
        await User.findByIdAndUpdate(user._id, {
          leetcodeUsername: username,
          'settings.integrations.leetcode.connected': true,
          'settings.integrations.leetcode.username': username,
          'settings.integrations.leetcode.connectedAt': new Date(),
        });
        
        logger.info('LeetCode connected', { userId: user._id, leetcodeUsername: username });
        
        return {
          success: true,
          message: 'LeetCode account connected successfully',
          username,
        };
      } catch (error) {
        logger.error('LeetCode connection failed:', error);
        throw error;
      }
    },

    syncLeetCodeData: async (
      _: any,
      { username }: { username: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        const leetcodeService = new LeetCodeService();
        const data = await leetcodeService.getComprehensiveUserData(username);
        
        if (!data.success) {
          throw new Error('Failed to sync LeetCode data');
        }
        
        // Update user's LeetCode data
        await User.findByIdAndUpdate(user._id, {
          'settings.integrations.leetcode.lastSyncAt': new Date(),
          'settings.integrations.leetcode.stats': data.stats,
          'settings.integrations.leetcode.profile': data.profile,
        });
        
        logger.info('LeetCode data synced', { userId: user._id, leetcodeUsername: username });
        
        return {
          success: true,
          message: 'LeetCode data synced successfully',
          data,
        };
      } catch (error) {
        logger.error('LeetCode sync failed:', error);
        throw error;
      }
    },

    disconnectLeetCode: async (
      _: any,
      __: any,
      context: GraphQLContext
    ) => {
      const user = requireAuth(context);
      
      try {
        // Remove LeetCode connection
        await User.findByIdAndUpdate(user._id, {
          $unset: {
            leetcodeUsername: '',
            'settings.integrations.leetcode.connected': '',
            'settings.integrations.leetcode.username': '',
            'settings.integrations.leetcode.stats': '',
            'settings.integrations.leetcode.profile': '',
          },
        });
        
        logger.info('LeetCode disconnected', { userId: user._id });
        
        return {
          success: true,
          message: 'LeetCode account disconnected successfully',
        };
      } catch (error) {
        logger.error('LeetCode disconnection failed:', error);
        throw error;
      }
    },
  },
};
