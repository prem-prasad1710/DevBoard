import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { useRealTimeStackOverflow } from '@/hooks';

// Dynamically import icons to prevent hydration issues
const MessageCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageCircle })), { ssr: false });
const Trophy = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trophy })), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false });
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })), { ssr: false });
const ThumbsUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ThumbsUp })), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
const Tag = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Tag })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Award = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Award })), { ssr: false });
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });
const RefreshCw = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false });
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { ssr: false });
const HelpCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.HelpCircle })), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Activity })), { ssr: false });

const StackOverflowPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string>('');

  const { 
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
  } = useRealTimeStackOverflow();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated';

  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, status, router]);

  // Ensure arrays are always defined to prevent filter errors
  const safeActivities = activities || [];

  // Filter activities based on search and filters
  const filteredActivities = safeActivities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = !selectedType || activity.type === selectedType;
    const matchesTag = !selectedTag || (activity.tags && activity.tags.includes(selectedTag));
    
    return matchesSearch && matchesType && matchesTag;
  });

  // Get unique values for filters
  const activityTypes = [...new Set(safeActivities.map(activity => activity.type))];
  const allTags = [...new Set(safeActivities.flatMap(activity => activity.tags || []))];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-4 w-4" />;
      case 'answer':
        return <MessageCircle className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'badge':
        return <Award className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'answer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'comment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'badge':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
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

  const handleUserSearch = useCallback(async () => {
    if (!userSearchQuery.trim()) return;
    
    try {
      const results = await searchUsers(userSearchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }, [userSearchQuery, searchUsers]);

    const handleConnectUser = useCallback(async (userId: string) => {
    setConnectionStatus('connecting');
    setConnectionError('');
    
    try {
      await connectUser(userId);
      setConnectionStatus('success');
      setSearchResults([]);
      setUserSearchQuery('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setConnectionStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error connecting user:', error);
      setConnectionStatus('error');
      setConnectionError('Failed to connect Stack Overflow account. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setConnectionStatus('idle');
        setConnectionError('');
      }, 5000);
    }
  }, [connectUser]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchQuery(e.target.value);
  }, []);

  const handleSearchInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUserSearch();
    }
  }, [handleUserSearch]);

  // Stack Overflow Connection Component for non-connected users
  const StackOverflowConnectionPrompt = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 -m-8 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12 mb-8">
          <div className="mb-8">
            {isClient && <BarChart3 className="h-20 w-20 text-orange-500 mx-auto mb-6" />}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Connect Your Stack Overflow Account
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock powerful analytics and insights from your Stack Overflow activity. 
              Track your progress, monitor your impact, and grow your developer reputation.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              {isClient && <HelpCircle className="h-10 w-10 text-blue-600 mx-auto mb-4" />}
              <h3 className="font-semibold text-foreground mb-2">Track Questions</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your questions, views, votes, and answer rates automatically
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              {isClient && <MessageCircle className="h-10 w-10 text-green-600 mx-auto mb-4" />}
              <h3 className="font-semibold text-foreground mb-2">Answer Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track acceptance rates, upvotes, and community engagement
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              {isClient && <Trophy className="h-10 w-10 text-orange-600 mx-auto mb-4" />}
              <h3 className="font-semibold text-foreground mb-2">Reputation Growth</h3>
              <p className="text-sm text-muted-foreground">
                Monitor badges, reputation changes, and achievement milestones
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              {isClient && <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-4" />}
              <h3 className="font-semibold text-foreground mb-2">Impact Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Analyze contribution patterns and community influence over time
              </p>
            </div>
          </div>
        </div>

        {/* Connection Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Get Started in 2 Easy Steps
            </h2>
            <p className="text-muted-foreground">
              Find and connect your Stack Overflow profile to start tracking
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Search Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Enter your Stack Overflow display name to find your profile
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Connect & Analyze</h3>
              <p className="text-sm text-muted-foreground">
                Select your profile and start tracking your Stack Overflow activity
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Stack Overflow Display Name
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g., Jon Skeet, Gordon Linoff, or your display name..."
                  className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground text-lg"
                  value={userSearchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchInputKeyPress}
                  disabled={connectionStatus === 'connecting'}
                />
                <button
                  onClick={handleUserSearch}
                  disabled={!userSearchQuery.trim() || connectionStatus === 'connecting'}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-lg"
                >
                  {connectionStatus === 'connecting' ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Try popular users like "Jon Skeet" or "Gordon Linoff" to see how it works
              </p>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-background rounded-lg border p-6 mb-6">
                <h4 className="font-semibold text-foreground mb-4 flex items-center">
                  {isClient && <Search className="h-5 w-5 mr-2" />}
                  Found {searchResults.length} profiles - Select yours:
                </h4>
                <div className="space-y-3">
                  {searchResults.slice(0, 5).map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 cursor-pointer border transition-all hover:shadow-md"
                      onClick={() => connectionStatus !== 'connecting' && handleConnectUser(user.user_id.toString())}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.profile_image}
                          alt={user.display_name}
                          className="h-12 w-12 rounded-full border-2 border-orange-200"
                        />
                        <div>
                          <div className="font-semibold text-foreground text-lg">{user.display_name}</div>
                          <div className="text-muted-foreground flex items-center">
                            {isClient && <Trophy className="h-4 w-4 mr-1 text-orange-500" />}
                            <span className="font-medium text-orange-600">{formatNumber(user.reputation)}</span>
                            <span className="ml-1">reputation</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          connectionStatus === 'connecting' 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md'
                        }`}
                        disabled={connectionStatus === 'connecting'}
                      >
                        {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Account'}
                      </button>
                    </div>
                  ))}
                </div>
                {searchResults.length > 5 && (
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Showing top 5 results. Refine your search for more specific results.
                  </p>
                )}
              </div>
            )}

            {/* Status Messages */}
            {connectionStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6">
                <div className="flex items-center">
                  {isClient && <Trophy className="h-6 w-6 text-green-600 mr-3" />}
                  <div>
                    <div className="font-semibold text-green-700 dark:text-green-300">
                      Successfully Connected!
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Your Stack Overflow account is now connected. Loading your dashboard...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {connectionStatus === 'error' && connectionError && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-6">
                <div className="flex items-center">
                  {isClient && <ExternalLink className="h-6 w-6 text-red-600 mr-3" />}
                  <div>
                    <div className="font-semibold text-red-700 dark:text-red-300">
                      Connection Failed
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {connectionError}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-8">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            What You'll See After Connecting
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                {isClient && <BarChart3 className="h-12 w-12 text-blue-600 mx-auto" />}
              </div>
              <h4 className="font-semibold text-foreground mb-2">Activity Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Real-time view of your questions, answers, and community interactions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                {isClient && <TrendingUp className="h-12 w-12 text-green-600 mx-auto" />}
              </div>
              <h4 className="font-semibold text-foreground mb-2">Performance Metrics</h4>
              <p className="text-sm text-muted-foreground">
                Track your reputation growth, answer acceptance rates, and impact
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                {isClient && <Award className="h-12 w-12 text-purple-600 mx-auto" />}
              </div>
              <h4 className="font-semibold text-foreground mb-2">Badge & Achievement Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Monitor your badges, milestones, and community recognition
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6">
          <p className="text-muted-foreground mb-2">
            Currently signed in as: <strong>{session?.user?.email}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Your connection is stored securely and privately. Only you can see your Stack Overflow analytics.
          </p>
        </div>
      </div>
    </div>
  );

  // If user is not connected to Stack Overflow, show connection prompt
  if (isAuthenticated && !isStackOverflowUser) {
    return (
      <Layout>
        <StackOverflowConnectionPrompt />
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
              {isClient && <BarChart3 className="h-6 w-6 mr-2 text-orange-500" />}
              Stack Overflow Dashboard
            </h1>
            <p className="text-muted-foreground">Track your questions, answers, and reputation</p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isClient && <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />}
            Sync Data
          </button>
        </div>

        {/* Profile Stats */}
        {profile && (
          <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={profile.profile_image}
                  alt={profile.display_name}
                  className="h-12 w-12 rounded-lg mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">{profile.display_name}</h2>
                  <div className="flex items-center text-muted-foreground">
                    {isClient && <Trophy className="h-4 w-4 mr-1" />}
                    <span className="font-medium text-orange-600">{formatNumber(profile.reputation)}</span>
                    <span className="ml-1">reputation</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`https://stackoverflow.com/users/${profile.user_id}/${profile.display_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {isClient && <ExternalLink className="h-4 w-4 mr-1" />}
                  View Profile
                </a>
                <button
                  onClick={disconnectUser}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive/20 rounded-lg hover:bg-destructive/10"
                >
                  Disconnect
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">{profile.question_count}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">{profile.answer_count}</div>
                <div className="text-sm text-muted-foreground">Answers</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatNumber(profile.view_count)}</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="flex justify-center items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium">{profile.badge_counts.gold}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    <span className="text-sm font-medium">{profile.badge_counts.silver}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-1"></div>
                    <span className="text-sm font-medium">{profile.badge_counts.bronze}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>

            {/* Real-time sync indicator */}
            {canFetch && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Real-time data sync active
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            {isClient && <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <input
              type="text"
              placeholder="Search activities and tags..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading Stack Overflow activities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-4">Error loading activities</div>
              <p className="text-muted-foreground">{error.message}</p>
              <button
                onClick={refetch}
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90"
              >
                {isClient && <RefreshCw className="h-4 w-4 mr-2" />}
                Try Again
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              {isClient && <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
              <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedType || selectedTag 
                  ? 'Try adjusting your filters' 
                  : 'Your Stack Overflow activities will appear here once they are synced'}
              </p>
              {!searchTerm && !selectedType && !selectedTag && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 Make sure you've connected your Stack Overflow account and have some activity on the platform.
                  </p>
                </div>
              )}
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                        {isClient && getActivityIcon(activity.type)}
                        <span className="ml-1">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                      </span>
                      <div className="flex items-center ml-4 text-sm text-muted-foreground">
                        {isClient && <Calendar className="h-4 w-4 mr-1" />}
                        {isClient ? formatDate(activity.createdAt) : ''}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground hover:text-primary cursor-pointer">
                      <a href={activity.url} target="_blank" rel="noopener noreferrer">
                        {activity.title}
                      </a>
                    </h3>
                    {activity.content && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {activity.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    )}
                  </div>
                  <a
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {isClient && <ExternalLink className="h-4 w-4" />}
                  </a>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      {isClient && <ThumbsUp className="h-4 w-4 mr-1" />}
                      <span className="font-medium text-foreground">{activity.score}</span>
                      <span className="ml-1">score</span>
                    </div>
                    {activity.metadata?.viewCount && (
                      <div className="flex items-center">
                        {isClient && <Eye className="h-4 w-4 mr-1" />}
                        <span className="font-medium text-foreground">{formatNumber(activity.metadata.viewCount)}</span>
                        <span className="ml-1">views</span>
                      </div>
                    )}
                    {activity.type === 'question' && activity.metadata?.answerCount !== undefined && (
                      <div className="flex items-center">
                        {isClient && <MessageSquare className="h-4 w-4 mr-1" />}
                        <span className="font-medium text-foreground">{activity.metadata.answerCount}</span>
                        <span className="ml-1">answers</span>
                      </div>
                    )}
                    {activity.accepted && (
                      <div className="flex items-center">
                        {isClient && <Trophy className="h-4 w-4 mr-1 text-green-600" />}
                        <span className="text-green-600 font-medium">Accepted</span>
                      </div>
                    )}
                  </div>
                </div>

                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {isClient && <Tag className="h-3 w-3 mr-1" />}
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="mt-8 bg-card rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Stack Overflow Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatNumber(stats.totalReputation)}</div>
                <div className="text-sm text-muted-foreground">Total Reputation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions Asked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalAnswers}</div>
                <div className="text-sm text-muted-foreground">Answers Given</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.acceptedAnswers}</div>
                <div className="text-sm text-muted-foreground">Accepted Answers</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StackOverflowPage;
