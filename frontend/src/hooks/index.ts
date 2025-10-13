import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { 
  GET_DASHBOARD_DATA, 
  GET_USER_PROFILE, 
  GET_GITHUB_ACTIVITIES,
  GET_STACKOVERFLOW_ACTIVITIES,
  GET_JOURNAL_ENTRIES,
  GET_PROJECTS,
  GET_OPEN_ISSUES,
  GET_AI_CHAT_HISTORY,
  GET_CODE_CHALLENGES,
  GET_RESUME,
  CONNECT_GITHUB,
  CONNECT_STACKOVERFLOW,
  CREATE_JOURNAL_ENTRY,
  UPDATE_JOURNAL_ENTRY,
  DELETE_JOURNAL_ENTRY,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  SEND_AI_MESSAGE,
  UPDATE_USER_PROFILE,
  SYNC_GITHUB_DATA,
  SYNC_STACKOVERFLOW_DATA
} from '@/lib/graphql/queries';
import { 
  DashboardStats, 
  RecentActivity, 
  User, 
  GitHubActivity,
  GitHubProfile, 
  StackOverflowActivity,
  StackOverflowProfile,
  JournalEntry,
  JournalEntryInput,
  Project,
  ProjectInput,
  OpenIssue,
  AIChat,
  AIMessageInput,
  CodeChallenge,
  Resume,
  LoadingState
} from '@/types';

// Dashboard Hook
export const useDashboard = () => {
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_DATA, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  return {
    dashboardStats: data?.dashboardStats as DashboardStats,
    recentActivities: data?.recentActivities as RecentActivity[],
    githubProfile: data?.githubProfile,
    stackOverflowProfile: data?.stackOverflowProfile,
    loading,
    error,
    refetch
  };
};

// User Profile Hook
export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (input: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Error updating profile');
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    updateUserProfile,
    refetch: fetchUser
  };
};

// GitHub Integration Hook
export const useGitHub = () => {
  const [connectGitHub] = useMutation(CONNECT_GITHUB, {
    onCompleted: (data) => {
      if (data.connectGitHub.success) {
        toast.success('GitHub connected successfully');
      } else {
        toast.error(data.connectGitHub.message);
      }
    },
    onError: (error) => {
      toast.error(`Error connecting GitHub: ${error.message}`);
    }
  });

  const [syncGitHubData] = useMutation(SYNC_GITHUB_DATA, {
    onCompleted: (data) => {
      if (data.syncGitHubData.success) {
        toast.success(`Synced ${data.syncGitHubData.activitiesAdded} activities`);
      } else {
        toast.error(data.syncGitHubData.message);
      }
    },
    onError: (error) => {
      toast.error(`Error syncing GitHub data: ${error.message}`);
    }
  });

  const connectToGitHub = useCallback((code: string) => {
    connectGitHub({ variables: { code } });
  }, [connectGitHub]);

  const syncData = useCallback(() => {
    syncGitHubData();
  }, [syncGitHubData]);

  return {
    connectToGitHub,
    syncData
  };
};

// GitHub Activities Hook (Mock Implementation)
export const useGitHubActivities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock data for GitHub activities
  const mockActivities: GitHubActivity[] = [
    {
      id: '1',
      type: 'push',
      repository: 'DevBoard',
      branch: 'main',
      commitMessage: 'Add Stack Overflow page implementation',
      additions: 245,
      deletions: 12,
      createdAt: new Date('2024-08-07T10:30:00Z'),
      metadata: { files: 3, commitsCount: 2 }
    },
    {
      id: '2',
      type: 'pull_request',
      repository: 'react-components',
      branch: 'feature/dark-mode',
      commitMessage: 'Implement dark mode toggle functionality',
      additions: 89,
      deletions: 15,
      createdAt: new Date('2024-08-06T15:45:00Z'),
      metadata: { status: 'merged', reviewers: 2 }
    },
    {
      id: '3',
      type: 'push',
      repository: 'api-server',
      branch: 'develop',
      commitMessage: 'Fix authentication middleware bug',
      additions: 23,
      deletions: 8,
      createdAt: new Date('2024-08-05T09:20:00Z'),
      metadata: { files: 2, commitsCount: 1 }
    },
    {
      id: '4',
      type: 'create',
      repository: 'portfolio-website',
      branch: 'main',
      commitMessage: 'Initial commit - Setup Next.js project',
      additions: 156,
      deletions: 0,
      createdAt: new Date('2024-08-04T14:10:00Z'),
      metadata: { type: 'repository' }
    },
    {
      id: '5',
      type: 'pull_request',
      repository: 'data-visualization',
      branch: 'feature/charts',
      commitMessage: 'Add interactive chart components',
      additions: 334,
      deletions: 45,
      createdAt: new Date('2024-08-03T11:30:00Z'),
      metadata: { status: 'open', reviewers: 1 }
    },
    {
      id: '6',
      type: 'push',
      repository: 'mobile-app',
      branch: 'feature/notifications',
      commitMessage: 'Implement push notification system',
      additions: 178,
      deletions: 22,
      createdAt: new Date('2024-08-02T16:45:00Z'),
      metadata: { files: 4, commitsCount: 3 }
    }
  ];

  const mockProfile: GitHubProfile = {
    id: 'user123',
    username: 'prem-prasad1710',
    avatarUrl: 'https://github.com/prem-prasad1710.png',
    isConnected: true,
    stats: {
      totalCommits: 1247,
      totalRepos: 23,
      totalStars: 156,
      totalPullRequests: 89
    }
  };

  const mockRepositories = [
    {
      id: 'repo1',
      name: 'DevBoard',
      description: 'Personal developer dashboard for tracking GitHub activity and Stack Overflow contributions',
      language: 'TypeScript',
      stars: 45,
      forks: 12,
      isPrivate: false,
      updatedAt: new Date('2024-08-07T10:30:00Z'),
      url: 'https://github.com/prem-prasad1710/DevBoard'
    },
    {
      id: 'repo2',
      name: 'react-components',
      description: 'Reusable React components library with TypeScript support',
      language: 'JavaScript',
      stars: 23,
      forks: 7,
      isPrivate: false,
      updatedAt: new Date('2024-08-06T15:45:00Z'),
      url: 'https://github.com/prem-prasad1710/react-components'
    },
    {
      id: 'repo3',
      name: 'api-server',
      description: 'RESTful API server built with Node.js and Express',
      language: 'JavaScript',
      stars: 18,
      forks: 5,
      isPrivate: false,
      updatedAt: new Date('2024-08-05T09:20:00Z'),
      url: 'https://github.com/prem-prasad1710/api-server'
    },
    {
      id: 'repo4',
      name: 'portfolio-website',
      description: 'Personal portfolio website built with Next.js',
      language: 'TypeScript',
      stars: 8,
      forks: 2,
      isPrivate: false,
      updatedAt: new Date('2024-08-04T14:10:00Z'),
      url: 'https://github.com/prem-prasad1710/portfolio-website'
    },
    {
      id: 'repo5',
      name: 'data-visualization',
      description: 'Interactive data visualization dashboard using D3.js',
      language: 'JavaScript',
      stars: 31,
      forks: 9,
      isPrivate: false,
      updatedAt: new Date('2024-08-03T11:30:00Z'),
      url: 'https://github.com/prem-prasad1710/data-visualization'
    },
    {
      id: 'repo6',
      name: 'mobile-app',
      description: 'Cross-platform mobile app built with React Native',
      language: 'TypeScript',
      stars: 14,
      forks: 3,
      isPrivate: true,
      updatedAt: new Date('2024-08-02T16:45:00Z'),
      url: 'https://github.com/prem-prasad1710/mobile-app'
    }
  ];

  const refetch = useCallback(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return {
    activities: mockActivities,
    profile: mockProfile,
    repositories: mockRepositories,
    loading,
    error,
    refetch
  };
};

// Stack Overflow Integration Hook
export const useStackOverflow = () => {
  const [connectStackOverflow] = useMutation(CONNECT_STACKOVERFLOW, {
    onCompleted: (data) => {
      if (data.connectStackOverflow.success) {
        toast.success('Stack Overflow connected successfully');
      } else {
        toast.error(data.connectStackOverflow.message);
      }
    },
    onError: (error) => {
      toast.error(`Error connecting Stack Overflow: ${error.message}`);
    }
  });

  const [syncStackOverflowData] = useMutation(SYNC_STACKOVERFLOW_DATA, {
    onCompleted: (data) => {
      if (data.syncStackOverflowData.success) {
        toast.success(`Synced ${data.syncStackOverflowData.activitiesAdded} activities`);
      } else {
        toast.error(data.syncStackOverflowData.message);
      }
    },
    onError: (error) => {
      toast.error(`Error syncing Stack Overflow data: ${error.message}`);
    }
  });

  const connectToStackOverflow = useCallback((accessToken: string) => {
    connectStackOverflow({ variables: { accessToken } });
  }, [connectStackOverflow]);

  const syncData = useCallback(() => {
    syncStackOverflowData();
  }, [syncStackOverflowData]);

  return {
    connectToStackOverflow,
    syncData
  };
};

// Stack Overflow Activities Hook (Mock Implementation)
export const useStackOverflowActivities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock data for Stack Overflow activities
  const mockActivities: StackOverflowActivity[] = [
    {
      id: '1',
      type: 'question',
      title: 'How to optimize React component re-renders with useMemo?',
      tags: ['react', 'performance', 'usememo', 'optimization'],
      score: 15,
      viewCount: 1250,
      answerCount: 3,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      url: 'https://stackoverflow.com/questions/1/react-usememo-optimization'
    },
    {
      id: '2',
      type: 'answer',
      title: 'Why is my async/await not working properly in JavaScript?',
      tags: ['javascript', 'async-await', 'promises'],
      score: 8,
      viewCount: 890,
      answerCount: 0,
      createdAt: new Date('2024-01-14T15:45:00Z'),
      url: 'https://stackoverflow.com/questions/2/async-await-javascript/answer/2'
    },
    {
      id: '3',
      type: 'question',
      title: 'TypeScript generic constraints with conditional types',
      tags: ['typescript', 'generics', 'conditional-types'],
      score: 22,
      viewCount: 2100,
      answerCount: 5,
      createdAt: new Date('2024-01-13T09:20:00Z'),
      url: 'https://stackoverflow.com/questions/3/typescript-generic-constraints'
    },
    {
      id: '4',
      type: 'answer',
      title: 'Best practices for error handling in Node.js Express applications',
      tags: ['node.js', 'express', 'error-handling'],
      score: 12,
      viewCount: 750,
      answerCount: 0,
      createdAt: new Date('2024-01-12T14:10:00Z'),
      url: 'https://stackoverflow.com/questions/4/nodejs-error-handling/answer/4'
    },
    {
      id: '5',
      type: 'question',
      title: 'MongoDB aggregation pipeline performance optimization',
      tags: ['mongodb', 'aggregation', 'performance'],
      score: 18,
      viewCount: 1567,
      answerCount: 2,
      createdAt: new Date('2024-01-11T11:30:00Z'),
      url: 'https://stackoverflow.com/questions/5/mongodb-aggregation-performance'
    },
    {
      id: '6',
      type: 'answer',
      title: 'How to properly test React hooks with Jest and React Testing Library',
      tags: ['react', 'testing', 'jest', 'react-testing-library'],
      score: 25,
      viewCount: 3200,
      answerCount: 0,
      createdAt: new Date('2024-01-10T16:45:00Z'),
      url: 'https://stackoverflow.com/questions/6/react-hooks-testing/answer/6'
    }
  ];

  const mockProfile: StackOverflowProfile = {
    id: 'user123',
    username: 'developer_pro',
    reputation: 2547,
    isConnected: true,
    stats: {
      totalQuestions: 15,
      totalAnswers: 42,
      totalViews: 18750,
      badgeCounts: {
        gold: 2,
        silver: 8,
        bronze: 25
      }
    }
  };

  const refetch = useCallback(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return {
    activities: mockActivities,
    profile: mockProfile,
    loading,
    error,
    refetch
  };
};

// Activities Hook
export const useActivities = () => {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { 
    data: githubData, 
    loading: githubLoading, 
    error: githubError,
    fetchMore: fetchMoreGitHub
  } = useQuery(GET_GITHUB_ACTIVITIES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: stackOverflowData,
    loading: stackOverflowLoading,
    error: stackOverflowError,
    fetchMore: fetchMoreStackOverflow
  } = useQuery(GET_STACKOVERFLOW_ACTIVITIES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    
    fetchMoreGitHub({
      variables: { offset: newOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          githubActivities: [
            ...prev.githubActivities,
            ...fetchMoreResult.githubActivities
          ]
        };
      }
    });

    fetchMoreStackOverflow({
      variables: { offset: newOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          stackOverflowActivities: [
            ...prev.stackOverflowActivities,
            ...fetchMoreResult.stackOverflowActivities
          ]
        };
      }
    });
  }, [offset, limit, fetchMoreGitHub, fetchMoreStackOverflow]);

  return {
    githubActivities: githubData?.githubActivities as GitHubActivity[],
    stackOverflowActivities: stackOverflowData?.stackOverflowActivities as StackOverflowActivity[],
    loading: githubLoading || stackOverflowLoading,
    error: githubError || stackOverflowError,
    loadMore,
    hasMore: true // This should be calculated based on the total count
  };
};

// Journal Hook
export const useJournal = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  const [createEntry] = useMutation(CREATE_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast.success('Journal entry created successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error creating entry: ${error.message}`);
    }
  });

  const [updateEntry] = useMutation(UPDATE_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast.success('Journal entry updated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating entry: ${error.message}`);
    }
  });

  const [deleteEntry] = useMutation(DELETE_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast.success('Journal entry deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting entry: ${error.message}`);
    }
  });

  const createJournalEntry = useCallback((input: JournalEntryInput) => {
    createEntry({ variables: { input } });
  }, [createEntry]);

  const updateJournalEntry = useCallback((id: string, input: JournalEntryInput) => {
    updateEntry({ variables: { id, input } });
  }, [updateEntry]);

  const deleteJournalEntry = useCallback((id: string) => {
    deleteEntry({ variables: { id } });
  }, [deleteEntry]);

  return {
    entries: data?.journalEntries as JournalEntry[],
    loading,
    error,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    refetch
  };
};

// Projects Hook
export const useProjects = () => {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  const [createProject] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      toast.success('Project created successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error creating project: ${error.message}`);
    }
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      toast.success('Project updated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating project: ${error.message}`);
    }
  });

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      toast.success('Project deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting project: ${error.message}`);
    }
  });

  const createNewProject = useCallback((input: ProjectInput) => {
    createProject({ variables: { input } });
  }, [createProject]);

  const updateExistingProject = useCallback((id: string, input: ProjectInput) => {
    updateProject({ variables: { id, input } });
  }, [updateProject]);

  const deleteExistingProject = useCallback((id: string) => {
    deleteProject({ variables: { id } });
  }, [deleteProject]);

  return {
    projects: data?.projects as Project[],
    loading,
    error,
    createProject: createNewProject,
    updateProject: updateExistingProject,
    deleteProject: deleteExistingProject,
    refetch
  };
};

// Open Issues Hook
export const useOpenIssues = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock data for open issues
  const mockIssues: OpenIssue[] = [
    {
      id: '1',
      title: 'Add TypeScript support for React components',
      description: 'Need to add proper TypeScript definitions for all React components in the library.',
      repository: 'awesome-react-lib',
      language: 'TypeScript',
      difficulty: 'intermediate',
      labels: ['typescript', 'react', 'good-first-issue'],
      createdAt: new Date('2024-01-15T10:30:00Z'),
      url: 'https://github.com/facebook/awesome-react-lib/issues/123',
      githubUrl: 'https://github.com/facebook/awesome-react-lib'
    },
    {
      id: '2',
      title: 'Fix memory leak in data processing',
      description: 'There is a memory leak when processing large datasets. Need to optimize the algorithm.',
      repository: 'data-processor',
      language: 'Python',
      difficulty: 'advanced',
      labels: ['bug', 'performance', 'memory'],
      createdAt: new Date('2024-01-14T15:45:00Z'),
      url: 'https://github.com/google/data-processor/issues/456',
      githubUrl: 'https://github.com/google/data-processor'
    },
    {
      id: '3',
      title: 'Add dark mode support',
      description: 'Users have requested dark mode support for better user experience.',
      repository: 'ui-components',
      language: 'JavaScript',
      difficulty: 'beginner',
      labels: ['enhancement', 'ui', 'good-first-issue'],
      createdAt: new Date('2024-01-13T09:20:00Z'),
      url: 'https://github.com/microsoft/ui-components/issues/789',
      githubUrl: 'https://github.com/microsoft/ui-components'
    },
    {
      id: '4',
      title: 'Improve documentation for API endpoints',
      description: 'The current API documentation is incomplete and needs better examples.',
      repository: 'api-docs',
      language: 'Markdown',
      difficulty: 'beginner',
      labels: ['documentation', 'api', 'help-wanted'],
      createdAt: new Date('2024-01-12T14:10:00Z'),
      url: 'https://github.com/vercel/api-docs/issues/321',
      githubUrl: 'https://github.com/vercel/api-docs'
    },
    {
      id: '5',
      title: 'Optimize database queries',
      description: 'Several database queries are running slow and need optimization.',
      repository: 'backend-service',
      language: 'Go',
      difficulty: 'advanced',
      labels: ['performance', 'database', 'optimization'],
      createdAt: new Date('2024-01-11T11:30:00Z'),
      url: 'https://github.com/netflix/backend-service/issues/654',
      githubUrl: 'https://github.com/netflix/backend-service'
    },
    {
      id: '6',
      title: 'Add unit tests for utility functions',
      description: 'Need to add comprehensive unit tests for all utility functions.',
      repository: 'utils-library',
      language: 'JavaScript',
      difficulty: 'intermediate',
      labels: ['testing', 'quality', 'good-first-issue'],
      createdAt: new Date('2024-01-10T16:45:00Z'),
      url: 'https://github.com/airbnb/utils-library/issues/987',
      githubUrl: 'https://github.com/airbnb/utils-library'
    }
  ];

  const refetch = useCallback(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return {
    issues: mockIssues,
    loading,
    error,
    refetch
  };
};

// AI Chat Hook
export const useAIChat = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_AI_CHAT_HISTORY, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  const [sendMessage] = useMutation(SEND_AI_MESSAGE, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(`Error sending message: ${error.message}`);
    }
  });

  const sendAIMessage = useCallback((input: AIMessageInput) => {
    return sendMessage({ variables: { input } });
  }, [sendMessage]);

  return {
    chatHistory: data?.aiChatHistory as AIChat[],
    loading,
    error,
    sendAIMessage,
    refetch
  };
};

// Code Challenges Hook with LeetCode Integration
export const useCodeChallenges = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userStats, setUserStats] = useState({
    totalSolved: 250,
    totalQuestions: 2500,
    easySolved: 120,
    easyTotal: 600,
    mediumSolved: 100,
    mediumTotal: 1300,
    hardSolved: 30,
    hardTotal: 600,
    leetcodeConnected: false,
    username: '',
    lastSyncAt: null as Date | null
  });

  const [recentSubmissions, setRecentSubmissions] = useState([
    {
      problemTitle: 'Two Sum',
      difficulty: 'Easy',
      accepted: true,
      timestamp: new Date().toISOString(),
      language: 'JavaScript'
    },
    {
      problemTitle: 'Binary Tree Inorder Traversal',
      difficulty: 'Medium',
      accepted: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      language: 'Python'
    },
    {
      problemTitle: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      accepted: false,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      language: 'C++'
    }
  ]);

  // Mock data for code challenges
  const mockChallenges: CodeChallenge[] = [
    {
      id: '1',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'easy',
      language: 'JavaScript',
      category: 'Arrays',
      completed: true,
      completedAt: new Date('2024-01-15'),
      createdAt: new Date('2024-01-01'),
      status: 'solved',
      acceptanceRate: 49.2,
      tags: ['Array', 'Hash Table'],
      leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
      solutionUrl: 'https://github.com/yourusername/leetcode-solutions/blob/main/two-sum.js',
      testCases: [
        { id: '1', input: '[2,7,11,15], 9', expectedOutput: '[0,1]', description: 'Basic test case' },
        { id: '2', input: '[3,2,4], 6', expectedOutput: '[1,2]', description: 'Different indices' }
      ]
    },
    {
      id: '2',
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      difficulty: 'easy',
      language: 'Python',
      category: 'Strings',
      completed: true,
      status: 'solved',
      acceptanceRate: 76.8,
      tags: ['Two Pointers', 'String'],
      leetcodeUrl: 'https://leetcode.com/problems/reverse-string/',
      createdAt: new Date('2024-01-02'),
      testCases: [
        { id: '3', input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', description: 'Basic string reverse' }
      ]
    },
    {
      id: '3',
      title: 'Binary Tree Inorder Traversal',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
      difficulty: 'medium',
      language: 'Java',
      category: 'Trees',
      completed: true,
      completedAt: new Date('2024-01-20'),
      status: 'solved',
      acceptanceRate: 67.4,
      tags: ['Stack', 'Tree', 'Depth-First Search'],
      leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
      solutionUrl: 'https://github.com/yourusername/leetcode-solutions/blob/main/binary-tree-inorder.java',
      createdAt: new Date('2024-01-03'),
      testCases: [
        { id: '4', input: '[1,null,2,3]', expectedOutput: '[1,3,2]', description: 'Standard tree traversal' }
      ]
    },
    {
      id: '4',
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      difficulty: 'medium',
      language: 'C++',
      category: 'Strings',
      completed: false,
      status: 'attempted',
      acceptanceRate: 33.8,
      tags: ['Hash Table', 'String', 'Sliding Window'],
      leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      createdAt: new Date('2024-01-04'),
      testCases: [
        { id: '5', input: '"abcabcbb"', expectedOutput: '3', description: 'Substring "abc" has length 3' },
        { id: '6', input: '"bbbbb"', expectedOutput: '1', description: 'All same characters' }
      ]
    },
    {
      id: '5',
      title: 'Merge k Sorted Lists',
      description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
      difficulty: 'hard',
      language: 'JavaScript',
      category: 'Linked Lists',
      completed: false,
      status: 'todo',
      acceptanceRate: 47.1,
      tags: ['Linked List', 'Divide and Conquer', 'Heap'],
      leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      createdAt: new Date('2024-01-05'),
      testCases: [
        { id: '7', input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', description: 'Merge multiple sorted lists' }
      ]
    },
    {
      id: '6',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      difficulty: 'easy',
      language: 'Python',
      category: 'Stack',
      completed: true,
      completedAt: new Date('2024-01-10'),
      status: 'solved',
      acceptanceRate: 40.9,
      tags: ['String', 'Stack'],
      leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
      solutionUrl: 'https://github.com/yourusername/leetcode-solutions/blob/main/valid-parentheses.py',
      createdAt: new Date('2024-01-06'),
      testCases: [
        { id: '8', input: '"()"', expectedOutput: 'true', description: 'Simple valid parentheses' },
        { id: '9', input: '"()[]{}"', expectedOutput: 'true', description: 'Mixed valid parentheses' },
        { id: '10', input: '"(]"', expectedOutput: 'false', description: 'Invalid parentheses' }
      ]
    },
    {
      id: '7',
      title: 'Maximum Subarray',
      description: 'Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.',
      difficulty: 'medium',
      language: 'Java',
      category: 'Dynamic Programming',
      completed: false,
      status: 'attempted',
      acceptanceRate: 49.7,
      tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
      leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
      createdAt: new Date('2024-01-07'),
      testCases: [
        { id: '11', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', description: 'Subarray [4,-1,2,1] has sum 6' }
      ]
    },
    {
      id: '8',
      title: 'Regular Expression Matching',
      description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*".',
      difficulty: 'hard',
      language: 'C++',
      category: 'Dynamic Programming',
      completed: false,
      status: 'todo',
      acceptanceRate: 27.8,
      tags: ['String', 'Dynamic Programming', 'Recursion'],
      leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/',
      createdAt: new Date('2024-01-08'),
      testCases: [
        { id: '12', input: 's = "aa", p = "a"', expectedOutput: 'false', description: 'Pattern does not match entire string' },
        { id: '13', input: 's = "aa", p = "a*"', expectedOutput: 'true', description: 'Pattern matches with wildcard' }
      ]
    }
  ];

  const connectLeetCode = useCallback(async (username: string) => {
    try {
      setLoading(true);
      // Simulate API call to connect LeetCode account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserStats(prev => ({
        ...prev,
        leetcodeConnected: true,
        username: username,
        lastSyncAt: new Date()
      }));
      
      console.log(`Connected to LeetCode account: ${username}`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncLeetCode = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call to sync LeetCode data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update stats with fresh data
      setUserStats(prev => ({
        ...prev,
        totalSolved: prev.totalSolved + Math.floor(Math.random() * 5),
        lastSyncAt: new Date()
      }));

      // Add new recent submission
      const newSubmission = {
        problemTitle: 'Climbing Stairs',
        difficulty: 'Easy',
        accepted: Math.random() > 0.3,
        timestamp: new Date().toISOString(),
        language: 'Python'
      };

      setRecentSubmissions(prev => [newSubmission, ...prev.slice(0, 4)]);
      
      console.log('LeetCode data synced successfully');
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Code challenges refreshed');
    }, 500);
  }, []);

  return {
    challenges: mockChallenges || [],
    userStats,
    recentSubmissions,
    loading,
    error,
    refetch,
    syncLeetCode,
    connectLeetCode
  };
};

// Resume Hook
export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/resume');
      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }
      const resumeData = await response.json();
      
      // Convert date strings back to Date objects
      const processedResume = {
        ...resumeData,
        createdAt: new Date(resumeData.createdAt),
        updatedAt: new Date(resumeData.updatedAt),
        experience: resumeData.experience?.map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined
        })) || [],
        education: resumeData.education?.map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined
        })) || [],
        certifications: resumeData.certifications?.map((cert: any) => ({
          ...cert,
          date: new Date(cert.date),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined
        })) || []
      };
      
      setResume(processedResume);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resume');
      console.error('Error fetching resume:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResume = useCallback(async (input: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update resume');
      }
      
      const updatedResume = await response.json();
      setResume(updatedResume);
      return updatedResume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume');
      throw err;
    }
  }, []);

  const uploadResumeFile = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resumeFile', file);

      const response = await fetch('http://localhost:4000/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload resume');
      }

      const result = await response.json();
      
      // Update the resume state with the new file info
      if (result.resume) {
        const processedResume = {
          ...result.resume,
          createdAt: new Date(result.resume.createdAt),
          updatedAt: new Date(result.resume.updatedAt),
          experience: result.resume.experience?.map((exp: any) => ({
            ...exp,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : undefined
          })) || [],
          education: result.resume.education?.map((edu: any) => ({
            ...edu,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : undefined
          })) || [],
          certifications: result.resume.certifications?.map((cert: any) => ({
            ...cert,
            date: new Date(cert.date),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined
          })) || []
        };
        setResume(processedResume);
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resume');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const refetch = () => {
    fetchResume();
  };

  return {
    resume,
    loading,
    error,
    refetch,
    updateResume,
    uploadResumeFile
  };
};

// Local Storage Hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Debounce Hook
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Loading State Hook
export const useLoadingState = (): LoadingState & {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: any) => void;
} => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    data: null
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data, isLoading: false, error: null }));
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData
  };
};

// Previous Hook (for tracking previous values)
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Intersection Observer Hook
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Copy to Clipboard Hook
export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  return { isCopied, copyToClipboard };
};

// Window Size Hook
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Theme Hook
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('theme', 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return { theme, setTheme };
};

// Export real-time GitHub hook
export { useRealTimeGitHub } from './useRealTimeGitHub';

// Export real-time Stack Overflow hook
export { useRealTimeStackOverflow } from './useRealTimeStackOverflow';
