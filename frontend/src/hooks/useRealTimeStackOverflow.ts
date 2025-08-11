import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
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
}

export const useRealTimeStackOverflow = (stackOverflowUserId?: string): UseRealTimeStackOverflowReturn => {
  const { data: session, status } = useSession();
  
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

  // Check if user has Stack Overflow connection
  const isStackOverflowUser = Boolean(
    session?.user && (
      stackOverflowUserId ||
      (session.user as any)?.stackOverflowId ||
      (session.user as any)?.stackOverflowUserId
    )
  );

  // Check if we can fetch data
  const canFetch = Boolean(
    session?.user && 
    status === 'authenticated' && 
    (stackOverflowUserId || (session.user as any)?.stackOverflowId || (session.user as any)?.stackOverflowUserId)
  );

  // Get the actual user ID to use
  const userId = stackOverflowUserId || (session?.user as any)?.stackOverflowId || (session?.user as any)?.stackOverflowUserId;

  const fetchStackOverflowData = useCallback(async () => {
    if (!canFetch || !userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        profileData,
        questionsData,
        answersData,
        commentsData,
        badgesData,
        activitiesData,
        statsData
      ] = await Promise.allSettled([
        stackOverflowAPI.getUserProfile(userId),
        stackOverflowAPI.getUserQuestions(userId, 1, 50),
        stackOverflowAPI.getUserAnswers(userId, 1, 50),
        stackOverflowAPI.getUserComments(userId, 1, 50),
        stackOverflowAPI.getUserBadges(userId),
        stackOverflowAPI.getRecentActivity(userId),
        stackOverflowAPI.getUserStats(userId)
      ]);

      // Update state with successful results
      if (profileData.status === 'fulfilled') {
        setProfile(profileData.value);
      }

      if (questionsData.status === 'fulfilled') {
        setQuestions(questionsData.value);
      }

      if (answersData.status === 'fulfilled') {
        setAnswers(answersData.value);
      }

      if (commentsData.status === 'fulfilled') {
        setComments(commentsData.value);
      }

      if (badgesData.status === 'fulfilled') {
        setBadges(badgesData.value);
      }

      if (activitiesData.status === 'fulfilled') {
        setActivities(activitiesData.value);
      }

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }

      // Log any failures for debugging
      const failures = [profileData, questionsData, answersData, commentsData, badgesData, activitiesData, statsData]
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason);

      if (failures.length > 0) {
        console.warn('Some Stack Overflow data requests failed:', failures);
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
      return await stackOverflowAPI.searchUserByDisplayName(displayName);
    } catch (error) {
      console.error('Error searching Stack Overflow users:', error);
      return [];
    }
  }, []);

  // Connect user function (for future use with backend integration)
  const connectUser = useCallback(async (userId: string): Promise<void> => {
    try {
      // This would typically update the user's profile with Stack Overflow ID
      // For now, we'll just refetch data
      await fetchStackOverflowData();
    } catch (error) {
      console.error('Error connecting Stack Overflow user:', error);
      throw error;
    }
  }, [fetchStackOverflowData]);

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
    connectUser
  };
};
