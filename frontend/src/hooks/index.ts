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
  StackOverflowActivity,
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
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_OPEN_ISSUES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  return {
    issues: data?.openIssues as OpenIssue[],
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

// Code Challenges Hook
export const useCodeChallenges = () => {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_CODE_CHALLENGES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  return {
    challenges: data?.codeChallenges as CodeChallenge[],
    loading,
    error,
    refetch
  };
};

// Resume Hook
export const useResume = () => {
  const { data, loading, error, refetch } = useQuery(GET_RESUME);

  return {
    resume: data?.resume as Resume,
    loading,
    error,
    refetch
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
