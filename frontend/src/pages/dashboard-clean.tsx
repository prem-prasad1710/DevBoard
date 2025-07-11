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

const CleanDashboard = () => {
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
              <span className="text-gray-900 dark:text-white font-medium">John Doe</span>
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
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* AI Summary Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                    You authored 5 commits and opened 2 pull requests across 3 repositories this week, 
                    including bug fixes and documentation improvements.
                  </p>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                      Sequest <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">example-repo</p>
                          <p className="text-xs text-gray-500">3 days ago</p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Added input validation</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">example-repo</p>
                          <p className="text-xs text-gray-500">5 days ago</p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Refactor authentication logic #42</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">example-repo</p>
                          <p className="text-xs text-gray-500">1 week ago</p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Update README</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Journal Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Today autosuggest</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Worked on adding input validation to project, ensuring data integrity and improving security.
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">1 day ago</span>
                      <span className="text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Blog/Tweet Generator */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-900 dark:text-green-100">Blog / Tweet Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                    Generate a blog post or tweet
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Generate
                  </Button>
                </CardContent>
              </Card>

              {/* Resume Builder */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-900 dark:text-purple-100">Resume Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2"></div>
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Developed scalable web applications, enhancing user experience
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2"></div>
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Experience with JavaScript, React, and Node.js
                      </p>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Duplicate Resume Builder Card */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-900 dark:text-orange-100">Resume Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2"></div>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Developed scalable web applications, enhancing user experience
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2"></div>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Experience with JavaScript, React, and Node.js
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CleanDashboard;
