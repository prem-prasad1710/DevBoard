import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { useRealTimeGitHub } from '@/hooks';

// Dynamically import icons to prevent hydration issues
const GitBranch = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitBranch })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const GitFork = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitFork })), { ssr: false });
const GitCommit = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitCommit })), { ssr: false });
const GitPullRequest = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitPullRequest })), { ssr: false });
const GitMerge = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitMerge })), { ssr: false });
const Plus = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Plus })), { ssr: false });
const Minus = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Minus })), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
const Filter = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Filter })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });
const RefreshCw = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false });
const Link2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Link2 })), { ssr: false });
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Activity })), { ssr: false });
const Lock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Lock })), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false });

const GitHubPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'repositories' | 'activity'>('overview');
  const [isClient, setIsClient] = useState(false);

  const { 
    profile, 
    repositories, 
    activities, 
    stats, 
    loading, 
    error, 
    refetch, 
    isGitHubUser, 
    canFetch 
  } = useRealTimeGitHub();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is authenticated with GitHub
  const isAuthenticated = status === 'authenticated';

  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, status, router]);

  // Ensure activities is always an array to prevent filter errors
  const safeActivities = activities || [];
  const safeRepositories = repositories || [];

  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.commitMessage && activity.commitMessage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !selectedType || activity.type === selectedType;
    const matchesRepo = !selectedRepo || activity.repository === selectedRepo;
    
    return matchesSearch && matchesType && matchesRepo;
  });

  // Filter repositories
  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = !searchTerm || 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Get unique values for filters
  const activityTypes = [...new Set(activities.map(activity => activity.type))];
  const repositoryNames = [...new Set(activities.map(activity => activity.repository))];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'push':
        return <GitCommit className="h-4 w-4" />;
      case 'pull_request':
        return <GitPullRequest className="h-4 w-4" />;
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'merge':
        return <GitMerge className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'push':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pull_request':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'create':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'merge':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-500';
    
    switch (language) {
      case 'TypeScript':
        return 'bg-blue-500';
      case 'JavaScript':
        return 'bg-yellow-500';
      case 'Python':
        return 'bg-green-500';
      case 'Java':
        return 'bg-red-500';
      case 'Go':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // GitHub Sign-In Component for non-GitHub users
  const GitHubSignInPrompt = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-card rounded-lg shadow-sm border p-8">
        <div className="mb-6">
          {isClient && <Github className="h-16 w-16 text-muted-foreground mx-auto mb-4" />}
          <h2 className="text-2xl font-semibold text-card-foreground mb-2">
            Connect Your GitHub Account
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in with GitHub to access your repositories, commits, and detailed analytics
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            {isClient && <Activity className="h-4 w-4 mr-2 text-green-600" />}
            Track your commits and contributions automatically
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {isClient && <Code className="h-4 w-4 mr-2 text-blue-600" />}
            View all your repositories with detailed analytics
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {isClient && <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />}
            Analyze your coding patterns and productivity
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {isClient && <Star className="h-4 w-4 mr-2 text-yellow-600" />}
            Monitor stars, forks, and repository performance
          </div>
        </div>

        <div className="bg-accent/30 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-foreground mb-2">What you'll get:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Real-time repository data and statistics</li>
            <li>• Commit history and contribution graphs</li>
            <li>• Pull request and issue tracking</li>
            <li>• Language usage and project insights</li>
            <li>• Automated syncing with your GitHub profile</li>
          </ul>
        </div>

        <button
          onClick={() => {
            // Use NextAuth to sign in with GitHub
            import('next-auth/react').then(({ signIn }) => {
              signIn('github', { callbackUrl: '/github' });
            });
          }}
          className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
        >
          {isClient && <Github className="h-5 w-5 mr-2" />}
          Sign in with GitHub
        </button>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            You're currently signed in as: <strong>{session?.user?.email}</strong>
          </p>
          <p className="mt-2">
            To access GitHub analytics, please connect your GitHub account
          </p>
        </div>
      </div>
    </div>
  );

  // If user is not a GitHub user, show sign-in prompt
  if (isAuthenticated && !isGitHubUser) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                {isClient && <Github className="h-6 w-6 mr-2" />}
                GitHub Dashboard
              </h1>
              <p className="text-muted-foreground">Track your repositories, commits, and contributions</p>
            </div>
          </div>

          <GitHubSignInPrompt />
        </div>
      </Layout>
    );
  }

  // If loading or not authenticated, show loading
  if (status === 'loading' || !isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              {isClient && <Github className="h-6 w-6 mr-2" />}
              GitHub Dashboard
              {isGitHubUser && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Connected
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">
              {isGitHubUser 
                ? `Showing data for ${session?.user?.name || 'your GitHub account'}`
                : 'Track your repositories, commits, and contributions'
              }
            </p>
          </div>
          {isGitHubUser && (
            <button
              onClick={refetch}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isClient && <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />}
              Sync Data
            </button>
          )}
        </div>

        {/* Profile Stats */}
        {(profile || session?.user) && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={session?.user?.image || profile?.avatar_url || '/placeholder-avatar.png'}
                  alt={session?.user?.name || profile?.login || 'User'}
                  className="h-16 w-16 rounded-full border-2 border-border mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {session?.user?.name || profile?.name || profile?.login || 'GitHub User'}
                  </h2>
                  <div className="flex items-center text-muted-foreground">
                    {isClient && <Github className="h-4 w-4 mr-1" />}
                    <span>GitHub Profile - Connected via OAuth</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`https://github.com/${(session?.user as any)?.login || profile?.login || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {isClient && <ExternalLink className="h-4 w-4 mr-1" />}
                  View Profile
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(stats?.totalCommits || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Commits</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {stats?.totalRepos || profile?.public_repos || 0}
                </div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(stats?.totalStars || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Stars</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {stats?.totalFollowers || profile?.followers || 0}
                </div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </div>

            {/* GitHub User Info */}
            {(profile || (session?.user as any)?.login) && (
              <div className="mt-4 p-4 bg-background rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Username: </span>
                    <span className="text-muted-foreground">@{profile?.login || (session?.user as any)?.login}</span>
                  </div>
                  {(profile?.company || (session?.user as any)?.company) && (
                    <div>
                      <span className="font-medium text-foreground">Company: </span>
                      <span className="text-muted-foreground">{profile?.company || (session?.user as any)?.company}</span>
                    </div>
                  )}
                  {(profile?.location || (session?.user as any)?.location) && (
                    <div>
                      <span className="font-medium text-foreground">Location: </span>
                      <span className="text-muted-foreground">{profile?.location || (session?.user as any)?.location}</span>
                    </div>
                  )}
                </div>
                {(profile?.bio || (session?.user as any)?.bio) && (
                  <div className="mt-3">
                    <span className="font-medium text-foreground">Bio: </span>
                    <span className="text-muted-foreground">{profile?.bio || (session?.user as any)?.bio}</span>
                  </div>
                )}
                {canFetch && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date().toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Real-time data from GitHub API
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'repositories', label: 'Repositories', icon: Code },
              { id: 'activity', label: 'Activity', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {isClient && <tab.icon className="h-4 w-4 mr-2" />}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            {isClient && <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <input
              type="text"
              placeholder={activeTab === 'repositories' ? 'Search repositories...' : 'Search activities...'}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'activity' && (
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
              >
                <option value="">All Repositories</option>
                {repositoryNames.map(repo => (
                  <option key={repo} value={repo}>{repo}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className={`p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
                      {isClient && getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">
                        {activity.type === 'push' && 'Pushed to'}
                        {activity.type === 'pull_request' && 'Pull request in'}
                        {activity.type === 'create' && 'Created'}
                        {activity.type === 'merge' && 'Merged in'}
                        <span className="ml-1 text-primary">{activity.repository}</span>
                      </p>
                      {activity.commitMessage && (
                        <p className="text-sm text-muted-foreground truncate">{activity.commitMessage}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {isClient ? formatDate(activity.createdAt) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Repositories */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Top Repositories</h3>
              <div className="space-y-3">
                {repositories.slice(0, 5).map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-card-foreground truncate">{repo.name}</h4>
                        {repo.private && isClient && <Lock className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{repo.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`}></div>
                          <span className="text-xs text-muted-foreground">{repo.language || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {isClient && <Star className="h-3 w-3 text-muted-foreground" />}
                          <span className="text-xs text-muted-foreground">{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {isClient && <GitFork className="h-3 w-3 text-muted-foreground" />}
                          <span className="text-xs text-muted-foreground">{repo.forks_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'repositories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading repositories...</p>
              </div>
            ) : filteredRepositories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {isClient && <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                <h3 className="text-lg font-medium text-foreground mb-2">No repositories found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search' : 'Connect your GitHub account to see repositories'}
                </p>
              </div>
            ) : (
              filteredRepositories.map((repo) => (
                <div key={repo.id} className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-card-foreground truncate">{repo.name}</h3>
                        {repo.private && isClient && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{repo.description}</p>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      {isClient && <ExternalLink className="h-4 w-4" />}
                    </a>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                      <span>{repo.language || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isClient && <Star className="h-4 w-4" />}
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isClient && <GitFork className="h-4 w-4" />}
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground">
                    {isClient && <Calendar className="h-3 w-3 mr-1" />}
                    Updated {isClient ? formatDate(new Date(repo.updated_at)) : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading GitHub activities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-destructive mb-4">Error loading activities</div>
                <p className="text-muted-foreground">{error.message}</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                {isClient && <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedType || selectedRepo 
                    ? 'Try adjusting your filters' 
                    : 'Connect your GitHub account to see your activities'}
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90">
                  {isClient && <Link2 className="h-4 w-4 mr-2" />}
                  Connect Account
                </button>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {isClient && getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                          <span className="text-sm font-medium text-primary">{activity.repository}</span>
                          {activity.branch && (
                            <span className="text-sm text-muted-foreground">
                              on <span className="font-mono">{activity.branch}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          {isClient && <Calendar className="h-4 w-4 mr-1" />}
                          {isClient ? formatDate(activity.createdAt) : ''}
                        </div>
                      </div>

                      {activity.commitMessage && (
                        <p className="text-sm text-card-foreground mb-3">{activity.commitMessage}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {activity.additions !== undefined && (
                          <div className="flex items-center space-x-1">
                            {isClient && <Plus className="h-4 w-4 text-green-600" />}
                            <span className="text-green-600">{activity.additions}</span>
                          </div>
                        )}
                        {activity.deletions !== undefined && (
                          <div className="flex items-center space-x-1">
                            {isClient && <Minus className="h-4 w-4 text-red-600" />}
                            <span className="text-red-600">{activity.deletions}</span>
                          </div>
                        )}
                        {activity.metadata?.files && (
                          <span>{activity.metadata.files} files changed</span>
                        )}
                        {activity.metadata?.commitsCount && (
                          <span>{activity.metadata.commitsCount} commits</span>
                        )}
                        {activity.metadata?.status && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            activity.metadata.status === 'merged' ? 'bg-purple-100 text-purple-800' :
                            activity.metadata.status === 'open' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.metadata.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GitHubPage;
