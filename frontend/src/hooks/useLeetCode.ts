import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// TypeScript interfaces
export interface CodeChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  testCases: TestCase[];
  status: 'Not Attempted' | 'Attempted' | 'Solved';
  acceptanceRate?: number;
  tags?: string[];
  leetcodeUrl?: string;
  solutionUrl?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface UserStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
}

export interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  runtime: string;
  memory: string;
  question: {
    questionId: string;
    title: string;
    difficulty: string;
    categoryTitle: string;
    topicTags: Array<{
      name: string;
      slug: string;
    }>;
  };
}

export interface UseCodeChallengesReturn {
  challenges: CodeChallenge[];
  loading: boolean;
  error: string | null;
  userStats: UserStats | null;
  recentSubmissions: RecentSubmission[];
  isConnected: boolean;
  syncLeetCode: (username: string) => Promise<boolean>;
  connectLeetCode: (username: string) => Promise<boolean>;
  disconnectLeetCode: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const useCodeChallenges = (): UseCodeChallengesReturn => {
  const [challenges, setChallenges] = useState<CodeChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  // Connect LeetCode account
  const connectLeetCode = useCallback(async (username: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // First validate the username
      const validationResponse = await apiCall(`/leetcode/validate/${username}`);
      
      if (!validationResponse.success || !validationResponse.data.exists) {
        throw new Error('LeetCode username not found. Please check your username and try again.');
      }

      // If valid, connect the account
      const connectResponse = await apiCall('/leetcode/connect', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });

      if (connectResponse.success) {
        setIsConnected(true);
        localStorage.setItem('leetcodeUsername', username);
        toast.success('LeetCode account connected successfully!');
        
        // Automatically sync data after connection
        await syncLeetCode(username);
        return true;
      } else {
        throw new Error(connectResponse.error || 'Failed to connect LeetCode account');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect LeetCode account';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync LeetCode data
  const syncLeetCode = useCallback(async (username: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const syncResponse = await apiCall(`/leetcode/sync/${username}`);

      if (syncResponse.success && syncResponse.data) {
        const { profile, stats, recentSubmissions: submissions } = syncResponse.data;

        // Update user stats
        if (stats) {
          setUserStats(stats);
        }

        // Update recent submissions
        if (submissions && submissions.length > 0) {
          setRecentSubmissions(submissions);
        }

        // Update challenges based on recent submissions
        const updatedChallenges = submissions.map((submission: RecentSubmission, index: number) => ({
          id: submission.id,
          title: submission.question.title,
          difficulty: submission.question.difficulty as 'Easy' | 'Medium' | 'Hard',
          description: `Problem from LeetCode: ${submission.question.title}`,
          testCases: [
            {
              id: `${submission.id}_test_1`,
              input: 'Sample input will be loaded from LeetCode API',
              expectedOutput: 'Expected output will be loaded from LeetCode API',
            },
          ],
          status: submission.statusDisplay.includes('Accepted') ? 'Solved' : 'Attempted' as 'Not Attempted' | 'Attempted' | 'Solved',
          acceptanceRate: 75 + Math.random() * 20, // This would come from problem details API
          tags: submission.question.topicTags.map(tag => tag.name),
          leetcodeUrl: `https://leetcode.com/problems/${submission.titleSlug}/`,
          solutionUrl: `https://leetcode.com/problems/${submission.titleSlug}/solution/`,
        }));

        setChallenges(updatedChallenges);
        setIsConnected(true);
        toast.success('LeetCode data synced successfully!');
        return true;
      } else {
        throw new Error(syncResponse.error || 'Failed to sync LeetCode data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync LeetCode data';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect LeetCode account
  const disconnectLeetCode = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall('/leetcode/disconnect', {
        method: 'POST',
      });

      if (response.success) {
        setIsConnected(false);
        setUserStats(null);
        setRecentSubmissions([]);
        setChallenges([]);
        localStorage.removeItem('leetcodeUsername');
        toast.success('LeetCode account disconnected successfully!');
        return true;
      } else {
        throw new Error(response.error || 'Failed to disconnect LeetCode account');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect LeetCode account';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    const username = localStorage.getItem('leetcodeUsername');
    if (username && isConnected) {
      await syncLeetCode(username);
    }
  }, [isConnected, syncLeetCode]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Check if user has connected LeetCode account
        const storedUsername = localStorage.getItem('leetcodeUsername');
        if (storedUsername) {
          setIsConnected(true);
          await syncLeetCode(storedUsername);
        } else {
          // Load default mock data if no connection
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load initial data');
        setLoading(false);
      }
    };

    loadInitialData();
  }, [syncLeetCode]);

  return {
    challenges,
    loading,
    error,
    userStats,
    recentSubmissions,
    isConnected,
    syncLeetCode,
    connectLeetCode,
    disconnectLeetCode,
    refreshData,
  };
};
