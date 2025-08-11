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
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE);
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: () => {
      toast.success('Profile updated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating profile: ${error.message}`);
    }
  });

  const updateUserProfile = useCallback((input: any) => {
    updateProfile({ variables: { input } });
  }, [updateProfile]);

  return {
    user: data?.user as User,
    loading,
    error,
    updateUserProfile,
    refetch
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

// Code Challenges Hook (Mock Implementation)
export const useCodeChallenges = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', description: 'Basic test case' },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]', description: 'Different indices' }
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
      createdAt: new Date('2024-01-02'),
      testCases: [
        { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', description: 'Basic string reverse' }
      ]
    },
    {
      id: '3',
      title: 'Binary Tree Traversal',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
      difficulty: 'medium',
      language: 'Java',
      category: 'Trees',
      completed: true,
      completedAt: new Date('2024-01-20'),
      createdAt: new Date('2024-01-03'),
      testCases: [
        { input: '[1,null,2,3]', expectedOutput: '[1,3,2]', description: 'Standard tree traversal' }
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
      createdAt: new Date('2024-01-04'),
      testCases: [
        { input: '"abcabcbb"', expectedOutput: '3', description: 'Substring "abc" has length 3' },
        { input: '"bbbbb"', expectedOutput: '1', description: 'All same characters' }
      ]
    },
    {
      id: '5',
      title: 'Merge K Sorted Lists',
      description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
      difficulty: 'hard',
      language: 'JavaScript',
      category: 'Linked Lists',
      completed: false,
      createdAt: new Date('2024-01-05'),
      testCases: [
        { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', description: 'Merge multiple sorted lists' }
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
      createdAt: new Date('2024-01-06'),
      testCases: [
        { input: '"()"', expectedOutput: 'true', description: 'Simple valid parentheses' },
        { input: '"()[]{}"', expectedOutput: 'true', description: 'Mixed valid parentheses' },
        { input: '"(]"', expectedOutput: 'false', description: 'Invalid parentheses' }
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
      createdAt: new Date('2024-01-07'),
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', description: 'Subarray [4,-1,2,1] has sum 6' }
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
      createdAt: new Date('2024-01-08'),
      testCases: [
        { input: 's = "aa", p = "a"', expectedOutput: 'false', description: 'Pattern does not match entire string' },
        { input: 's = "aa", p = "a*"', expectedOutput: 'true', description: 'Pattern matches with wildcard' }
      ]
    }
  ];

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
    loading,
    error,
    refetch
  };
};

// Resume Hook
export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadResume = async () => {
      try {
        setLoading(true);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockResume: Resume = {
          id: '1',
          personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            website: 'https://johndoe.dev',
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            summary: 'Passionate Full Stack Developer with 5+ years of experience building scalable web applications using modern technologies. Expertise in React, Node.js, TypeScript, and cloud platforms. Strong advocate for clean code, test-driven development, and agile methodologies.'
          },
          experience: [
            {
              id: '1',
              company: 'TechCorp Inc.',
              position: 'Senior Software Engineer',
              startDate: new Date('2022-01-01'),
              endDate: undefined,
              current: true,
              description: 'Lead development of customer-facing web applications serving 100K+ users. Architected microservices infrastructure and implemented CI/CD pipelines.',
              achievements: [
                'Improved application performance by 40% through code optimization',
                'Led a team of 4 developers in agile environment',
                'Implemented automated testing reducing bugs by 60%'
              ],
              technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL']
            },
            {
              id: '2',
              company: 'StartupXYZ',
              position: 'Full Stack Developer',
              startDate: new Date('2020-03-01'),
              endDate: new Date('2021-12-31'),
              current: false,
              description: 'Developed and maintained e-commerce platform from concept to production. Collaborated with design and product teams to deliver user-centric solutions.',
              achievements: [
                'Built responsive e-commerce platform handling 10K+ transactions',
                'Integrated payment systems and third-party APIs',
                'Mentored junior developers and conducted code reviews'
              ],
              technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe API', 'Jest']
            },
            {
              id: '3',
              company: 'WebDev Agency',
              position: 'Frontend Developer',
              startDate: new Date('2019-06-01'),
              endDate: new Date('2020-02-28'),
              current: false,
              description: 'Created responsive websites and web applications for various clients. Focused on performance optimization and cross-browser compatibility.',
              achievements: [
                'Delivered 15+ client projects on time and within budget',
                'Improved website loading speeds by average of 50%',
                'Implemented modern JavaScript frameworks and build tools'
              ],
              technologies: ['JavaScript', 'React', 'Vue.js', 'Sass', 'Webpack', 'Git']
            }
          ],
          education: [
            {
              id: '1',
              institution: 'University of California, Berkeley',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: new Date('2015-09-01'),
              endDate: new Date('2019-05-15'),
              gpa: 3.8,
              achievements: [
                'Magna Cum Laude',
                'Dean\'s List (6 semesters)',
                'Computer Science Student of the Year 2019'
              ]
            }
          ],
          skills: [
            {
              category: 'Frontend Development',
              items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
              proficiencyLevel: 'expert'
            },
            {
              category: 'Backend Development',
              items: ['Node.js', 'Express', 'Python', 'Django', 'PostgreSQL', 'MongoDB'],
              proficiencyLevel: 'advanced'
            },
            {
              category: 'DevOps & Cloud',
              items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions'],
              proficiencyLevel: 'intermediate'
            },
            {
              category: 'Tools & Others',
              items: ['Git', 'Jest', 'Cypress', 'Figma', 'Jira', 'Agile/Scrum'],
              proficiencyLevel: 'advanced'
            }
          ],
          projects: [
            {
              id: '1',
              name: 'E-Commerce Platform',
              description: 'Full-stack e-commerce solution with payment processing, inventory management, and admin dashboard.',
              technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
              url: 'https://demo-ecommerce.com',
              githubUrl: 'https://github.com/johndoe/ecommerce-platform',
              highlights: [
                'Built from scratch with modern tech stack',
                'Handles 10K+ products and user accounts',
                'Integrated payment gateway and shipping APIs'
              ]
            },
            {
              id: '2',
              name: 'Task Management App',
              description: 'Collaborative project management tool with real-time updates, file sharing, and team communication.',
              technologies: ['React', 'Socket.io', 'Express', 'MongoDB'],
              url: 'https://taskflow-app.com',
              githubUrl: 'https://github.com/johndoe/taskflow',
              highlights: [
                'Real-time collaboration features',
                'Drag-and-drop interface',
                'File upload and sharing system'
              ]
            }
          ],
          certifications: [
            {
              id: '1',
              name: 'AWS Certified Solutions Architect',
              issuer: 'Amazon Web Services',
              date: new Date('2023-03-15'),
              expiryDate: new Date('2026-03-15'),
              url: 'https://aws.amazon.com/certification/'
            },
            {
              id: '2',
              name: 'React Developer Certification',
              issuer: 'Meta',
              date: new Date('2022-08-20'),
              expiryDate: undefined,
              url: 'https://developers.facebook.com/docs/react/'
            }
          ],
          languages: [
            {
              language: 'English',
              proficiency: 'native'
            },
            {
              language: 'Spanish',
              proficiency: 'conversational'
            },
            {
              language: 'French',
              proficiency: 'basic'
            }
          ],
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date()
        };

        setResume(mockResume);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Simulate refetch
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const updateResume = (updatedResume: Partial<Resume>) => {
    if (resume) {
      setResume({ ...resume, ...updatedResume });
    }
  };

  return {
    resume,
    loading,
    error,
    refetch,
    updateResume
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
