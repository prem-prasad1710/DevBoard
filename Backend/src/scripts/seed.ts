import mongoose from 'mongoose';
import { User } from '../models/User';
import { GitHubActivity } from '../models/GitHubActivity';
import { DeveloperJournal } from '../models/DeveloperJournal';
import { Project } from '../models/Project';
import { Resume } from '../models/Resume';
import { StackOverflowActivity } from '../models/StackOverflowActivity';
import { OpenIssue } from '../models/OpenIssue';
import { AIChat } from '../models/AIChat';
import { CodeChallenge } from '../models/CodeChallenge';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devboard');
    logger.info('Connected to MongoDB');

    // Clear existing data (optional - comment out for production)
    await User.deleteMany({});
    await GitHubActivity.deleteMany({});
    await DeveloperJournal.deleteMany({});
    await Project.deleteMany({});
    await Resume.deleteMany({});
    await StackOverflowActivity.deleteMany({});
    await OpenIssue.deleteMany({});
    await AIChat.deleteMany({});
    await CodeChallenge.deleteMany({});
    logger.info('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        githubUsername: 'johndoe',
        bio: 'Full-stack developer passionate about React and Node.js',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        company: 'Tech Corp',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        settings: {
          theme: 'dark',
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
            github: true,
            stackoverflow: true,
            reddit: false,
            vscode: true,
          },
        },
        profile: {
          goals: ['Learn GraphQL', 'Build a SaaS product', 'Contribute to open source'],
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL'],
          interests: ['Web Development', 'AI/ML', 'DevOps', 'Open Source'],
          experience: 'advanced',
          focusAreas: ['Full-stack Development', 'System Architecture', 'Team Leadership'],
          careerGoals: ['Senior Engineer', 'Tech Lead', 'Engineering Manager'],
        },
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        githubUsername: 'janesmith',
        bio: 'Frontend developer specializing in React and Vue.js',
        location: 'New York, NY',
        website: 'https://janesmith.io',
        company: 'Startup Inc',
        role: 'user',
        isActive: true,
        emailVerified: true,
        settings: {
          theme: 'light',
          notifications: {
            email: true,
            push: false,
            dailyDigest: true,
            weeklyReport: true,
            aiNudges: false,
          },
          privacy: {
            publicProfile: true,
            showActivity: true,
            showStats: false,
          },
          integrations: {
            github: true,
            stackoverflow: false,
            reddit: false,
            vscode: true,
          },
        },
        profile: {
          goals: ['Master React', 'Learn TypeScript', 'Build a portfolio'],
          skills: ['JavaScript', 'React', 'Vue.js', 'CSS', 'HTML', 'Git'],
          interests: ['Frontend Development', 'UI/UX Design', 'Performance Optimization'],
          experience: 'intermediate',
          focusAreas: ['React Development', 'Component Libraries', 'Testing'],
          careerGoals: ['Senior Frontend Developer', 'Lead Developer'],
        },
      },
    ]);

    logger.info(`Created ${users.length} users`);
    
    if (users.length === 0) {
      throw new Error('No users created');
    }

    // Create sample GitHub activities
    const githubActivities = await GitHubActivity.create([
      {
        userId: users[0]!._id.toString(),
        type: 'commit',
        repository: 'johndoe/awesome-project',
        repositoryUrl: 'https://github.com/johndoe/awesome-project',
        title: 'Add authentication middleware',
        description: 'Implemented JWT authentication with refresh tokens',
        score: 15,
        processed: true,
        metadata: {
          language: 'TypeScript',
          commitSha: 'a1b2c3d4',
          files: ['src/middleware/auth.ts', 'src/utils/jwt.ts'],
        },
      },
      {
        userId: users[0]?._id?.toString() || '',
        type: 'pr',
        repository: 'opensource/react-library',
        repositoryUrl: 'https://github.com/opensource/react-library',
        title: 'Fix memory leak in useEffect hook',
        description: 'Added cleanup function to prevent memory leaks',
        score: 25,
        processed: true,
        metadata: {
          language: 'JavaScript',
          prNumber: 123,
          status: 'merged',
        },
      },
      {
        userId: users[1]?._id?.toString() || '',
        type: 'fork',
        repository: 'facebook/react',
        repositoryUrl: 'https://github.com/facebook/react',
        title: 'Forked facebook/react',
        description: 'Forked React repository for learning purposes',
        score: 5,
        processed: true,
        metadata: {
          language: 'JavaScript',
          originalRepo: 'facebook/react',
        },
      },
    ]);

    logger.info(`Created ${githubActivities.length} GitHub activities`);

    // Create sample journal entries
    const journalEntries = await DeveloperJournal.create([
      {
        userId: users[0]?._id?.toString() || '',
        date: new Date(),
        title: 'Great Progress on Authentication',
        content: 'Today I successfully implemented JWT authentication with refresh tokens. The middleware is working perfectly and I learned a lot about security best practices. Tomorrow I plan to add rate limiting and improve error handling.',
        mood: 'accomplished',
        productivity: 8,
        challenges: ['Understanding JWT refresh token flow', 'Implementing secure cookie handling'],
        achievements: ['Completed authentication middleware', 'Added comprehensive tests'],
        learnings: ['JWT best practices', 'Secure cookie configuration', 'Rate limiting strategies'],
        goals: ['Add rate limiting', 'Improve error handling', 'Deploy to staging'],
        technologies: ['TypeScript', 'Express.js', 'JWT', 'MongoDB'],
        aiGenerated: false,
        tags: ['authentication', 'security', 'backend'],
        isPublic: true,
      },
      {
        userId: users[1]?._id?.toString() || '',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        title: 'Struggling with React Performance',
        content: 'Spent most of the day debugging performance issues in our React app. The component was re-rendering too frequently, causing lag. Finally found the issue was with improper dependency arrays in useEffect hooks.',
        mood: 'frustrated',
        productivity: 5,
        challenges: ['Identifying performance bottlenecks', 'Understanding React rendering behavior'],
        achievements: ['Fixed performance issue', 'Added React DevTools profiling'],
        learnings: ['React rendering optimization', 'useEffect dependency arrays', 'Performance profiling'],
        goals: ['Learn more about React performance', 'Implement memoization strategies'],
        technologies: ['React', 'JavaScript', 'React DevTools'],
        aiGenerated: false,
        tags: ['react', 'performance', 'debugging'],
        isPublic: false,
      },
    ]);

    logger.info(`Created ${journalEntries.length} journal entries`);

    // Create sample projects
    const projects = await Project.create([
      {
        userId: users[0]?._id?.toString() || '',
        name: 'DevBoard - Developer Dashboard',
        description: 'A comprehensive developer dashboard that integrates GitHub, StackOverflow, and AI features to provide insights into coding activities and career growth.',
        repository: 'johndoe/devboard',
        repositoryUrl: 'https://github.com/johndoe/devboard',
        status: 'in-progress',
        priority: 'high',
        progress: 65,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        estimatedHours: 200,
        actualHours: 130,
        technologies: ['React', 'Node.js', 'GraphQL', 'MongoDB', 'TypeScript'],
        tags: ['dashboard', 'analytics', 'ai', 'portfolio'],
        goals: ['Build MVP', 'Add AI features', 'Deploy to production'],
        challenges: ['GraphQL schema design', 'Real-time updates', 'AI integration'],
        learnings: ['GraphQL subscriptions', 'MongoDB aggregation', 'OpenAI API'],
        tasks: [
          {
            id: 'task-1',
            title: 'Set up GraphQL schema',
            description: 'Define comprehensive GraphQL schema for all entities',
            status: 'completed',
            priority: 'high',
            estimatedHours: 8,
            actualHours: 10,
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'task-2',
            title: 'Implement GitHub integration',
            description: 'Connect to GitHub API and sync user activities',
            status: 'in-progress',
            priority: 'high',
            estimatedHours: 12,
            actualHours: 8,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'task-3',
            title: 'Add AI journaling feature',
            description: 'Implement AI-powered journal entry generation',
            status: 'todo',
            priority: 'medium',
            estimatedHours: 16,
            actualHours: 0,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        ],
        milestones: [
          {
            id: 'milestone-1',
            title: 'MVP Release',
            description: 'Basic dashboard with GitHub integration',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'pending',
          },
          {
            id: 'milestone-2',
            title: 'AI Features',
            description: 'AI-powered insights and recommendations',
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            status: 'pending',
          },
        ],
        collaborators: [],
        isPublic: true,
      },
      {
        userId: users[1]?._id?.toString() || '',
        name: 'Personal Portfolio Website',
        description: 'A modern, responsive portfolio website showcasing my projects and skills.',
        repository: 'janesmith/portfolio',
        repositoryUrl: 'https://github.com/janesmith/portfolio',
        status: 'completed',
        priority: 'medium',
        progress: 100,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        estimatedHours: 80,
        actualHours: 95,
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        tags: ['portfolio', 'frontend', 'responsive'],
        goals: ['Build professional portfolio', 'Showcase projects', 'SEO optimization'],
        challenges: ['Responsive design', 'Performance optimization', 'SEO setup'],
        learnings: ['Next.js SSG', 'Tailwind CSS utilities', 'Performance best practices'],
        tasks: [
          {
            id: 'task-p1',
            title: 'Design homepage',
            description: 'Create hero section and about me section',
            status: 'completed',
            priority: 'high',
            estimatedHours: 15,
            actualHours: 18,
            createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'task-p2',
            title: 'Build projects gallery',
            description: 'Showcase all major projects with details',
            status: 'completed',
            priority: 'high',
            estimatedHours: 20,
            actualHours: 25,
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        ],
        milestones: [
          {
            id: 'milestone-p1',
            title: 'Launch Portfolio',
            description: 'Deploy portfolio to production',
            targetDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            status: 'completed',
          },
        ],
        collaborators: [],
        isPublic: true,
      },
    ]);

    logger.info(`Created ${projects.length} projects`);

    // Create sample open issues
    const openIssues = await OpenIssue.create([
      {
        repository: 'facebook/react',
        repositoryUrl: 'https://github.com/facebook/react',
        issueNumber: 12345,
        title: 'Add support for async components',
        description: 'We need to add support for async components to improve performance with code splitting.',
        labels: ['enhancement', 'good first issue'],
        language: 'JavaScript',
        difficulty: 'intermediate',
        estimatedTime: '4-6 hours',
        goodFirstIssue: true,
        helpWanted: true,
        isActive: true,
        author: 'facebook-team',
        assignees: [],
        comments: 15,
        reactions: {
          thumbsUp: 25,
          thumbsDown: 2,
          laugh: 0,
          hooray: 5,
          confused: 1,
          heart: 8,
          rocket: 12,
          eyes: 20,
        },
        lastChecked: new Date(),
      },
      {
        repository: 'microsoft/vscode',
        repositoryUrl: 'https://github.com/microsoft/vscode',
        issueNumber: 67890,
        title: 'Improve TypeScript error reporting',
        description: 'TypeScript error messages could be more helpful for beginners.',
        labels: ['typescript', 'beginner-friendly'],
        language: 'TypeScript',
        difficulty: 'beginner',
        estimatedTime: '2-3 hours',
        goodFirstIssue: true,
        helpWanted: true,
        isActive: true,
        author: 'vscode-team',
        assignees: [],
        comments: 8,
        reactions: {
          thumbsUp: 15,
          thumbsDown: 0,
          laugh: 0,
          hooray: 3,
          confused: 0,
          heart: 5,
          rocket: 7,
          eyes: 12,
        },
        lastChecked: new Date(),
      },
    ]);

    logger.info(`Created ${openIssues.length} open issues`);

    // Create sample code challenges
    const codeChallenges = await CodeChallenge.create([
      {
        title: 'Two Sum',
        description: 'Given an array of integers and a target sum, return indices of the two numbers that add up to the target.',
        difficulty: 'easy',
        category: 'Array',
        tags: ['array', 'hash-table', 'two-pointers'],
        language: 'JavaScript',
        timeLimit: 60,
        memoryLimit: 256,
        examples: [
          {
            input: '[2, 7, 11, 15], target = 9',
            output: '[0, 1]',
            explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
          },
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
        ],
        hints: [
          'Use a hash table to store values and their indices',
          'For each number, check if target - number exists in the hash table',
        ],
        solution: {
          code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
          explanation: 'Use a hash map to store each number and its index. For each number, check if its complement exists in the map.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
        },
        testCases: [
          {
            input: '[2, 7, 11, 15], 9',
            expectedOutput: '[0, 1]',
            isHidden: false,
          },
          {
            input: '[3, 2, 4], 6',
            expectedOutput: '[1, 2]',
            isHidden: false,
          },
          {
            input: '[3, 3], 6',
            expectedOutput: '[0, 1]',
            isHidden: true,
          },
        ],
        submissions: [],
        stats: {
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          acceptanceRate: 0,
          averageRuntime: 0,
          averageMemory: 0,
        },
        source: 'LeetCode',
        sourceUrl: 'https://leetcode.com/problems/two-sum/',
        isActive: true,
        featured: true,
      },
    ]);

    logger.info(`Created ${codeChallenges.length} code challenges`);

    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
