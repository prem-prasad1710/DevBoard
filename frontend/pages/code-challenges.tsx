import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// Dynamically import icons to prevent hydration issues
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const Play = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Play })), { ssr: false });
const CheckCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false });
const XCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.XCircle })), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), { ssr: false });
const Trophy = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trophy })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
const BookOpen = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BookOpen })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });
const Award = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Award })), { ssr: false });
const Sun = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), { ssr: false });
const Moon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), { ssr: false });

import { useCodeChallenges } from '@/hooks';
import { color } from 'html2canvas/dist/types/css/types/color';

const CodeChallengesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useTheme();

  const { challenges, loading, error, refetch } = useCodeChallenges();

  // Toggle between light and dark theme for cards
  const toggleCardTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // Ensure consistent rendering between server and client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Consistent date formatting function
  const formatDate = (date: Date | string) => {
    if (!isClient) return ''; // Return empty string on server to avoid hydration mismatch
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Ensure challenges is always an array
  const safeChallenges = challenges || [];

  // Filter challenges
  const filteredChallenges = safeChallenges.filter(challenge => {
    const matchesSearch = !searchTerm || 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = !selectedDifficulty || challenge.difficulty === selectedDifficulty;
    const matchesLanguage = !selectedLanguage || challenge.language === selectedLanguage;
    const matchesCategory = !selectedCategory || challenge.category === selectedCategory;
    const matchesCompleted = !showCompleted || challenge.completed;
    
    return matchesSearch && matchesDifficulty && matchesLanguage && matchesCategory && matchesCompleted;
  });

  // Get unique values for filters
  const difficulties = [...new Set(safeChallenges.map(challenge => challenge.difficulty))];
  const languages = [...new Set(safeChallenges.map(challenge => challenge.language))];
  const categories = [...new Set(safeChallenges.map(challenge => challenge.category))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Target className="h-4 w-4" />;
      case 'medium': return <Zap className="h-4 w-4" />;
      case 'hard': return <Trophy className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const completedChallenges = safeChallenges.filter(c => c.completed).length;
  const totalChallenges = safeChallenges.length;
  const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

  // Theme-aware card styling
  const getCardStyles = () => {
    if (!isClient) {
      // Default for SSR
      return {
        card: 'bg-white border border-gray-200 text-gray-900',
        title: 'text-gray-900',
        description: 'text-gray-600',
        metadata: 'text-gray-500',
        icons: 'text-gray-500'
      };
    }
    
    if (theme === 'dark') {
      return {
        card: 'bg-black border border-gray-300 text-white-900',
        title: 'text-white-900',
        description: 'text-white-600',
        metadata: 'text-white-500',
        icons: 'text-white-500'
      };
    } else {
      return {
        card: 'bg-white-900 border border-gray-600 text-black',
        title: 'text-black',
        description: 'text-black-300',
        metadata: 'text-black-400',
        icons: 'text-black-400'
      };
    }
  };

  const cardStyles = getCardStyles();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <Code className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isClient && theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Code Challenges</h1>
              <p className={`${isClient && theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Practice and improve your coding skills</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {completedChallenges}/{totalChallenges} completed ({completionRate}%)
            </div>
            {isClient && (
              <button
                onClick={toggleCardTheme}
                className="flex items-center px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                title="Toggle card theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Cards
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Cards
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={`${isClient && theme === 'dark' ? 'bg-black border border-gray-300' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedChallenges}</p>
              </div>
            </div>
          </div>
          
          <div className={`${isClient && theme === 'dark' ? 'bg-black border border-gray-300' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalChallenges}</p>
              </div>
            </div>
          </div>
          
          <div className={`${isClient && theme === 'dark' ? 'bg-black border border-gray-300' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          <Award className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Success Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
            </div>
          </div>
          
          <div className={`${isClient && theme === 'dark' ? 'bg-black border border-gray-300' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
          <Star className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Categories</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          className={`rounded-lg shadow-sm p-6 mb-6 ${
            isClient
              ? theme === 'dark'
          ? 'bg-black'
          : 'bg-white'
              : 'bg-white'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Show Completed Toggle */}
            <div className="flex items-center">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Completed only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading challenges...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Error loading challenges</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Code className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No challenges found matching your criteria</p>
            </div>
          ) : (
            filteredChallenges.map((challenge) => (
              <div key={challenge.id} className={`${cardStyles.card} rounded-lg shadow-sm hover:shadow-md transition-shadow`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${
                        challenge.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {challenge.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          getDifficultyIcon(challenge.difficulty)
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    {challenge.completed && (
                      <div className="flex items-center text-green-600">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Completed</span>
                      </div>
                    )}
                  </div>

                  <h3 className={`text-lg font-semibold ${cardStyles.title} mb-2`}>
                    {challenge.title}
                  </h3>
                  
                  <p className={`${cardStyles.description} text-sm mb-4 line-clamp-3`}>
                    {challenge.description}
                  </p>

                  <div className={`flex items-center justify-between text-sm ${cardStyles.metadata} mb-4`}>
                    <div className="flex items-center">
                      <Code className={`h-4 w-4 mr-1 ${cardStyles.icons}`} />
                      <span>{challenge.language}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className={`h-4 w-4 mr-1 ${cardStyles.icons}`} />
                      <span>{challenge.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`text-xs ${cardStyles.metadata}`}>
                      {challenge.testCases.length} test cases
                    </div>
                    <div className="flex items-center space-x-2">
                      {challenge.completed && challenge.completedAt && (
                        <div className={`flex items-center text-xs ${cardStyles.metadata}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(challenge.completedAt)}
                        </div>
                      )}
                      <button
                        onClick={() => router.push(`/challenge/${challenge.id}`)}
                        className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {challenge.completed ? 'Review' : 'Start'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CodeChallengesPage;
