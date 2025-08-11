import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
// import { useMutation } from '@apollo/client';
// import { UPDATE_PROFILE } from '@/lib/graphql/queries';
import { 
  stackOverflowAPI, 
  StackOverflowUser, 
  StackOverflowQuestion,
  StackOverflowAnswer,
  StackOverflowComment,
  StackOverflowBadge,
  StackOverflowStats,
  StackOverflowActivity 
} from '@/services/stackOverflowAPI';

interface UseRealTimeStackOverflowReturn {
  profile: StackOverflowUser | null;
  questions: StackOverflowQuestion[];
  answers: StackOverflowAnswer[];
  comments: StackOverflowComment[];
  badges: StackOverflowBadge[];
  activities: StackOverflowActivity[];
  stats: StackOverflowStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStackOverflowUser: boolean;
  canFetch: boolean;
  searchUsers: (displayName: string) => Promise<StackOverflowUser[]>;
  connectUser: (userId: string) => Promise<void>;
  disconnectUser: () => void;
}

export const useRealTimeStackOverflow = (stackOverflowUserId?: string): UseRealTimeStackOverflowReturn => {
  const { data: session, status } = useSession();
  // const [updateProfile] = useMutation(UPDATE_PROFILE);
  
  // State management
  const [profile, setProfile] = useState<StackOverflowUser | null>(null);
  const [questions, setQuestions] = useState<StackOverflowQuestion[]>([]);
  const [answers, setAnswers] = useState<StackOverflowAnswer[]>([]);
  const [comments, setComments] = useState<StackOverflowComment[]>([]);
  const [badges, setBadges] = useState<StackOverflowBadge[]>([]);
  const [activities, setActivities] = useState<StackOverflowActivity[]>([]);
  const [stats, setStats] = useState<StackOverflowStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get Stack Overflow ID from localStorage or prop
  const getStoredStackOverflowId = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`stackoverflow_id_${session?.user?.email}`);
      return stored;
    }
    return null;
  }, [session?.user?.email]);

  const currentStackOverflowId = stackOverflowUserId || getStoredStackOverflowId();

  // Check if user has Stack Overflow connection
  const isStackOverflowUser = Boolean(
    session?.user && currentStackOverflowId
  );

  // Check if we can fetch data
  const canFetch = Boolean(
    session?.user && 
    status === 'authenticated' && 
    currentStackOverflowId
  );

  // Get the actual user ID to use
  const userId = currentStackOverflowId;

  const fetchStackOverflowData = useCallback(async () => {
    if (!canFetch || !userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Stack Overflow API request timed out')), ms)
      );

      // Fetch all data in parallel with timeout
      const [
        profileData,
        questionsData,
        answersData,
        commentsData,
        badgesData,
        activitiesData,
        statsData
      ] = await Promise.allSettled([
        Promise.race([stackOverflowAPI.getUserProfile(userId), timeoutPromise(30000)]),
        Promise.race([stackOverflowAPI.getUserQuestions(userId, 1, 50), timeoutPromise(30000)]),
        Promise.race([stackOverflowAPI.getUserAnswers(userId, 1, 50), timeoutPromise(30000)]),
        Promise.race([stackOverflowAPI.getUserComments(userId, 1, 50), timeoutPromise(30000)]),
        Promise.race([stackOverflowAPI.getUserBadges(userId), timeoutPromise(30000)]),
        Promise.race([stackOverflowAPI.getRecentActivity(userId), timeoutPromise(30000)]),
        Promise.race([stackOverflowAPI.getUserStats(userId), timeoutPromise(30000)])
      ]);

      // Count successful requests
      let successCount = 0;

      // Update state with successful results
      if (profileData.status === 'fulfilled') {
        setProfile(profileData.value as StackOverflowUser);
        successCount++;
      }

      if (questionsData.status === 'fulfilled') {
        setQuestions(questionsData.value as StackOverflowQuestion[]);
        successCount++;
      }

      if (answersData.status === 'fulfilled') {
        setAnswers(answersData.value as StackOverflowAnswer[]);
        successCount++;
      }

      if (commentsData.status === 'fulfilled') {
        setComments(commentsData.value as StackOverflowComment[]);
        successCount++;
      }

      if (badgesData.status === 'fulfilled') {
        setBadges(badgesData.value as StackOverflowBadge[]);
        successCount++;
      }

      if (activitiesData.status === 'fulfilled') {
        setActivities(activitiesData.value as StackOverflowActivity[]);
        successCount++;
      }

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value as StackOverflowStats);
        successCount++;
      }

      // Log any failures for debugging
      const failures = [profileData, questionsData, answersData, commentsData, badgesData, activitiesData, statsData]
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason);

      if (failures.length > 0) {
        console.warn('Some Stack Overflow data requests failed:', failures);
      }

      // If no requests succeeded, set an error
      if (successCount === 0) {
        setError(new Error('Unable to fetch any Stack Overflow data. Please check your connection and try again.'));
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch Stack Overflow data');
      setError(error);
      console.error('Error fetching Stack Overflow data:', error);
    } finally {
      setLoading(false);
    }
  }, [canFetch, userId]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchStackOverflowData();
  }, [fetchStackOverflowData]);

  // Search users function
  const searchUsers = useCallback(async (displayName: string): Promise<StackOverflowUser[]> => {
    try {
      if (!displayName.trim()) {
        return [];
      }
      
      const results = await stackOverflowAPI.searchUserByDisplayName(displayName);
      return results || [];
    } catch (error) {
      console.error('Error searching Stack Overflow users:', error);
      // Return empty array on error to prevent UI crashes
      return [];
    }
  }, []);

  // Connect user function - saves Stack Overflow ID to localStorage
  const connectUser = useCallback(async (userId: string): Promise<void> => {
    try {
      // Store Stack Overflow ID in localStorage
      if (typeof window !== 'undefined' && session?.user?.email) {
        localStorage.setItem(`stackoverflow_id_${session.user.email}`, userId);
        
        // Store additional metadata
        localStorage.setItem(`stackoverflow_connected_at_${session.user.email}`, new Date().toISOString());
      }

      // Give a small delay to ensure storage is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Fetch Stack Overflow data with the new user ID
      // fetchStackOverflowData handles its own loading state
      await fetchStackOverflowData();
    } catch (error) {
      console.error('Error connecting Stack Overflow user:', error);
      throw error;
    }
  }, [session?.user?.email, fetchStackOverflowData]);

  // Disconnect user function - removes Stack Overflow ID from localStorage
  const disconnectUser = useCallback(() => {
    if (typeof window !== 'undefined' && session?.user?.email) {
      localStorage.removeItem(`stackoverflow_id_${session.user.email}`);
      localStorage.removeItem(`stackoverflow_connected_at_${session.user.email}`);
      
      // Clear all state
      setProfile(null);
      setQuestions([]);
      setAnswers([]);
      setComments([]);
      setBadges([]);
      setActivities([]);
      setStats(null);
      setError(null);
    }
  }, [session?.user?.email]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (canFetch && userId) {
      fetchStackOverflowData();
    }
  }, [canFetch, userId, fetchStackOverflowData]);

  // Auto-refresh data every 5 minutes when user is active
  useEffect(() => {
    if (!canFetch || !userId) return;

    const interval = setInterval(() => {
      // Only refresh if document is visible and user is active
      if (document.visibilityState === 'visible') {
        fetchStackOverflowData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [canFetch, userId, fetchStackOverflowData]);

  return {
    profile,
    questions,
    answers,
    comments,
    badges,
    activities,
    stats,
    loading,
    error,
    refetch,
    isStackOverflowUser,
    canFetch,
    searchUsers,
    connectUser,
    disconnectUser
  };
};
