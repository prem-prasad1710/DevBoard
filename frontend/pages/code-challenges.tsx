import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { useCodeChallenges } from '@/hooks/useLeetCode';
import { toast } from 'react-hot-toast';
import { CodeChallenge } from '@/hooks/useLeetCode';

// Dynamic icon imports
const TrophyIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trophy })), { ssr: false });
const TargetIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false });
const GitBranchIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitBranch })), { ssr: false });
const CodeIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const SearchIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
const RefreshCwIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false });
const ExternalLinkIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });
const PlayIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Play })), { ssr: false });
const BookmarkIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Bookmark })), { ssr: false });
const StarIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const ChevronDownIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronDown })), { ssr: false });
const ThumbsUpIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ThumbsUp })), { ssr: false });
const HashIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Hash })), { ssr: false });

const CodeChallengesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLeetCodeModal, setShowLeetCodeModal] = useState(false);

  const { 
    challenges, 
    userStats, 
    recentSubmissions, 
    loading, 
    error, 
    isConnected,
    totalProblems,
    hasMore,
    syncLeetCode,
    connectLeetCode,
    disconnectLeetCode,
    refreshData,
    loadMoreProblems
  } = useCodeChallenges();

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const username = localStorage.getItem('leetcodeUsername');
      if (username) {
        await syncLeetCode(username);
        toast.success('LeetCode data synced successfully!');
      } else {
        toast.error('No LeetCode username found');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync LeetCode data');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connectLeetCode('sample-username');
      toast.success('LeetCode account connected successfully!');
      setShowLeetCodeModal(false);
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect LeetCode account');
    }
  };

  // Filter challenges based on search and filters
  const filteredChallenges = challenges.filter((challenge: CodeChallenge) => {
    const matchesSearch = !searchTerm || 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (challenge.tags && challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesDifficulty = !selectedDifficulty || challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesCategory = !selectedCategory || (challenge.tags && challenge.tags.includes(selectedCategory));
    const matchesStatus = !selectedStatus || challenge.status === selectedStatus;
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(challenges?.flatMap((c: CodeChallenge) => c.tags || []) || []));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved': return 'text-green-600 bg-green-100';
      case 'attempted': return 'text-yellow-600 bg-yellow-100';
      case 'todo': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading code challenges...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading challenges: {error}</p>
            <button 
              onClick={refreshData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Code Challenges</h1>
                <p className="text-gray-600">
                  Browse {totalProblems.toLocaleString()} LeetCode problems and track your progress
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Showing</p>
                <p className="text-2xl font-bold text-blue-600">{filteredChallenges.length}</p>
                <p className="text-sm text-gray-500">problems</p>
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Solved</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.totalSolved || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">of {totalProblems.toLocaleString()}</p>
                </div>
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Easy Problems</p>
                  <p className="text-2xl font-bold text-green-600">{userStats?.easySolved || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">of {userStats?.totalEasy || 0}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Medium Problems</p>
                  <p className="text-2xl font-bold text-yellow-600">{userStats?.mediumSolved || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">of {userStats?.totalMedium || 0}</p>
                </div>
                <TargetIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hard Problems</p>
                  <p className="text-2xl font-bold text-red-600">{userStats?.hardSolved || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">of {userStats?.totalHard || 0}</p>
                </div>
                <StarIcon className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* LeetCode Sync Section */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">LeetCode Integration</h3>
                <p className="text-gray-600">
                  {isConnected 
                    ? `Connected to LeetCode` 
                    : 'Connect your LeetCode account for real-time sync'}
                </p>
              </div>
              <div className="flex gap-3">
                {isConnected ? (
                  <button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <RefreshCwIcon className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowLeetCodeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <GitBranchIcon className="h-4 w-4" />
                    Connect LeetCode
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search and Filters */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search challenges..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category: string) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Challenges List */}
              <div className="space-y-4">
                {filteredChallenges?.map((challenge: CodeChallenge, index: number) => (
                  <div key={challenge.id} className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:border-blue-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-500">
                            <HashIcon className="h-4 w-4" />
                            {challenge.id}
                          </span>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {challenge.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          {challenge.status !== 'Not Attempted' && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                              {challenge.status}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {challenge.tags?.slice(0, 5).map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                              {tag}
                            </span>
                          ))}
                          {challenge.tags && challenge.tags.length > 5 && (
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                              +{challenge.tags.length - 5} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-green-600">
                            <ThumbsUpIcon className="h-4 w-4" />
                            <span className="font-medium">{challenge.acceptanceRate?.toFixed(1)}%</span>
                            <span className="text-gray-500">Acceptance</span>
                          </div>
                          {challenge.tags && challenge.tags.length > 0 && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <span className="text-xs">{challenge.tags.length} topics</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-6">
                        <a
                          href={challenge.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                          Open in LeetCode
                        </a>
                        {challenge.solutionUrl && (
                          <a
                            href={challenge.solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                          >
                            <CodeIcon className="h-4 w-4" />
                            View Solution
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && !loading && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMoreProblems}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                      Load More Problems
                    </button>
                  </div>
                )}

                {/* No results message */}
                {filteredChallenges.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No problems found matching your filters</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDifficulty('');
                        setSelectedCategory('');
                        setSelectedStatus('');
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Submissions */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Submissions</h3>
                <div className="space-y-3">
                  {recentSubmissions?.slice(0, 5).map((submission: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{submission.problemTitle}</p>
                        <p className="text-xs text-gray-500">{submission.language}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          submission.accepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {submission.accepted ? 'Accepted' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700">
                    <PlayIcon className="h-5 w-5" />
                    Practice Random Problem
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700">
                    <TargetIcon className="h-5 w-5" />
                    Daily Challenge
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700">
                    <BookmarkIcon className="h-5 w-5" />
                    Saved Problems
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LeetCode Connection Modal */}
      {showLeetCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Connect LeetCode Account</h3>
            <p className="text-gray-600 mb-6">
              Connect your LeetCode account to automatically sync your progress and submissions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConnect}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Connect Account
              </button>
              <button
                onClick={() => setShowLeetCodeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CodeChallengesPage;