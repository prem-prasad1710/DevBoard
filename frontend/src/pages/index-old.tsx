import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Code, 
  GitBranch, 
  MessageCircle, 
  BookOpen, 
  Target,
  TrendingUp,
  Users,
  ArrowUpRight,
  Clock,
  Star,
  Calendar,
  ExternalLink,
  Zap,
  Award,
  BarChart3,
  Plus,
  Brain,
  FileText,
  Settings,
  User,
  Bell,
  Search,
  Download,
  Edit3,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { formatNumber, formatTimeAgo } from '@/lib/utils';

// Simple test query that we know works
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    hello
    health
  }
`;

const DashboardPage = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">DevBoard</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 dark:text-white px-3 py-2 rounded-md text-sm font-medium">Activity</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Journal</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Resume</a>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {data?.health || 'Connecting...'}
              </Badge>
              <span className="text-gray-900 dark:text-white font-medium">Developer</span>
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Dev Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back! Here's your development activity overview.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 personal, 1 work</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">+5 hours this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Connect your GitHub account to track commits, PRs, and repository activity.
                </p>
                <Button className="w-full">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Connect GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Stack Overflow Integration
              {stackOverflowProfile?.isConnected && (
                <Badge variant="success" className="ml-2">Connected</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stackOverflowProfile?.isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">@{stackOverflowProfile.username}</p>
                    <p className="text-sm text-gray-500">
                      {formatNumber(stackOverflowProfile.reputation)} reputation
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNumber(stackOverflowProfile.stats?.totalQuestions || 0)}</p>
                    <p className="text-sm text-gray-500">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNumber(stackOverflowProfile.stats?.totalAnswers || 0)}</p>
                    <p className="text-sm text-gray-500">Answers</p>
                  </div>
                </div>
                
                <Button 
                  onClick={syncStackOverflowData} 
                  className="w-full" 
                  variant="outline"
                  size="sm"
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Sync Data
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Connect your Stack Overflow account to track questions, answers, and reputation.
                </p>
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Connect Stack Overflow
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Journal Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Record your daily learning
            </p>
            <Button size="sm" className="w-full">
              <Plus className="h-3 w-3 mr-1" />
              New Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Target className="h-4 w-4 mr-2" />
              Add Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Track a new project
            </p>
            <Button size="sm" className="w-full" variant="outline">
              <Plus className="h-3 w-3 mr-1" />
              New Project
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Code className="h-4 w-4 mr-2" />
              Code Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Practice coding skills
            </p>
            <Button size="sm" className="w-full" variant="outline">
              <Zap className="h-3 w-3 mr-1" />
              Start Challenge
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Brain className="h-4 w-4 mr-2" />
              AI Mentor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Get AI-powered help
            </p>
            <Button size="sm" className="w-full" variant="outline">
              <MessageCircle className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </span>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities && recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(activity.createdAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No recent activity to display.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Connect your accounts to start tracking your developer journey!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DashboardPage;
