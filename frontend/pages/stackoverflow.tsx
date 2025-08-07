import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { useStackOverflowActivities } from '@/hooks';

// Dynamically import icons to prevent hydration issues
const MessageCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageCircle })), { ssr: false });
const Trophy = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trophy })), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false });
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })), { ssr: false });
const ThumbsUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ThumbsUp })), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
const Filter = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Filter })), { ssr: false });
const Tag = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Tag })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Award = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Award })), { ssr: false });
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });
const RefreshCw = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false });
const Link2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Link2 })), { ssr: false });
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { ssr: false });

const StackOverflowPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isClient, setIsClient] = useState(false);

  const { activities, profile, loading, error, refetch } = useStackOverflowActivities();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure activities is always an array to prevent filter errors
  const safeActivities = activities || [];

  // Filter activities based on search and filters
  const filteredActivities = safeActivities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !selectedType || activity.type === selectedType;
    const matchesTag = !selectedTag || activity.tags.includes(selectedTag);
    
    return matchesSearch && matchesType && matchesTag;
  });

  // Get unique values for filters
  const activityTypes = [...new Set(safeActivities.map(activity => activity.type))];
  const allTags = [...new Set(safeActivities.flatMap(activity => activity.tags))];

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <MessageCircle className="h-4 w-4" />;
      case 'answer':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'answer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    // Use a consistent format to prevent hydration errors
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              {isClient && <MessageCircle className="h-6 w-6 mr-2" />}
              Stack Overflow
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
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">{profile.username}</h2>
                  <div className="flex items-center text-muted-foreground">
                    {isClient && <Trophy className="h-4 w-4 mr-1" />}
                    <span className="font-medium text-orange-600">{formatNumber(profile.reputation)}</span>
                    <span className="ml-1">reputation</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`https://stackoverflow.com/users/${profile.id}/${profile.username}`}
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
                <div className="text-2xl font-bold text-foreground">{profile.stats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">{profile.stats.totalAnswers}</div>
                <div className="text-sm text-muted-foreground">Answers</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatNumber(profile.stats.totalViews)}</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="flex justify-center items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium">{profile.stats.badgeCounts.gold}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    <span className="text-sm font-medium">{profile.stats.badgeCounts.silver}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-1"></div>
                    <span className="text-sm font-medium">{profile.stats.badgeCounts.bronze}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>
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
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              {isClient && <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
              <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedType || selectedTag 
                  ? 'Try adjusting your filters' 
                  : 'Connect your Stack Overflow account to see your activities'}
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90">
                {isClient && <Link2 className="h-4 w-4 mr-2" />}
                Connect Account
              </button>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                        {isClient && getActivityTypeIcon(activity.type)}
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
                    <div className="flex items-center">
                      {isClient && <Eye className="h-4 w-4 mr-1" />}
                      <span className="font-medium text-foreground">{formatNumber(activity.viewCount)}</span>
                      <span className="ml-1">views</span>
                    </div>
                    {activity.type === 'question' && (
                      <div className="flex items-center">
                        {isClient && <MessageSquare className="h-4 w-4 mr-1" />}
                        <span className="font-medium text-foreground">{activity.answerCount}</span>
                        <span className="ml-1">answers</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {isClient && <Tag className="h-3 w-3 mr-1" />}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StackOverflowPage;
