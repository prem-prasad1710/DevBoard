import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { githubAPI, GitHubUser, GitHubRepository, GitHubStats } from '@/services/githubAPI';

interface GitHubData {
  profile: GitHubUser | null;
  repositories: GitHubRepository[];
  activities: any[];
  stats: GitHubStats | null;
  loading: boolean;
  error: Error | null;
}

export const useRealTimeGitHub = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<GitHubData>({
    profile: null,
    repositories: [],
    activities: [],
    stats: null,
    loading: false,
    error: null
  });

  const isGitHubUser = session?.user && (session as any).provider === 'github';
  const accessToken = (session as any)?.accessToken;
  const username = (session?.user as any)?.login;

  const fetchGitHubData = useCallback(async () => {
    if (!isGitHubUser || !accessToken || !username) {
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch all data in parallel
      const [profile, repositories, activities, stats] = await Promise.all([
        githubAPI.getUserProfile(accessToken),
        githubAPI.getAllUserRepositories(accessToken),
        githubAPI.getRecentActivity(accessToken, username),
        githubAPI.getUserStats(accessToken, username)
      ]);

      setData({
        profile,
        repositories: repositories.sort((a, b) => b.stargazers_count - a.stargazers_count), // Sort by stars
        activities,
        stats,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }));
    }
  }, [isGitHubUser, accessToken, username]);

  const refetch = useCallback(() => {
    if (isGitHubUser && accessToken && username) {
      fetchGitHubData();
    }
  }, [fetchGitHubData, isGitHubUser, accessToken, username]);

  useEffect(() => {
    if (isGitHubUser && accessToken && username) {
      fetchGitHubData();
    }
  }, [fetchGitHubData]);

  return {
    ...data,
    refetch,
    isGitHubUser,
    canFetch: isGitHubUser && accessToken && username
  };
};
