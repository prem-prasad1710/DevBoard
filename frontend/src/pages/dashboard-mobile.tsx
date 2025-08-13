import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { ResponsiveHeader } from '@/components/ui/responsive-header';
import { MobileCardGrid, MobileStatsCard, MobileCard, MobileCardHeader, MobileCardTitle, MobileCardContent } from '@/components/ui/mobile-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import icons
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const BookOpen = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BookOpen })), { ssr: false });
const Brain = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })), { ssr: false });
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const CheckCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });
const Users = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), { ssr: false });

export default function MobileDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    repositories: 0,
    commits: 0,
    problems: 0,
    projects: 0
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Animate stats counter on load
    const animateStats = () => {
      const targets = { repositories: 45, commits: 1250, problems: 89, projects: 12 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setCurrentStats({
          repositories: Math.floor(targets.repositories * easeOut),
          commits: Math.floor(targets.commits * easeOut),
          problems: Math.floor(targets.problems * easeOut),
          projects: Math.floor(targets.projects * easeOut)
        });
        
        if (step >= steps) {
          clearInterval(timer);
          setCurrentStats(targets);
        }
      }, stepDuration);
    };
    
    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <Layout contentPadding="md">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const quickActions = [
    {
      name: 'Start Coding',
      description: 'Jump into a new coding session',
      icon: Code,
      action: () => router.push('/code-challenges'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'GitHub Sync',
      description: 'Sync your latest repositories',
      icon: Github,
      action: () => router.push('/github'),
      color: 'from-gray-700 to-gray-800'
    },
    {
      name: 'AI Mentor',
      description: 'Get personalized guidance',
      icon: Brain,
      action: () => router.push('/ai-mentor'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Update Journal',
      description: 'Log your daily progress',
      icon: BookOpen,
      action: () => router.push('/journal'),
      color: 'from-green-500 to-green-600'
    }
  ];

  const recentActivities = [
    {
      type: 'commit',
      title: 'Pushed to main branch',
      description: 'Updated mobile responsive design',
      time: '2 hours ago',
      icon: Github
    },
    {
      type: 'problem',
      title: 'Solved: Two Sum Problem',
      description: 'Completed in 15 minutes',
      time: '4 hours ago',
      icon: CheckCircle
    },
    {
      type: 'journal',
      title: 'Daily reflection added',
      description: 'Documented learning progress',
      time: '1 day ago',
      icon: BookOpen
    }
  ];

  return (
    <Layout contentPadding="sm">
      {/* Welcome Header */}
      <div className="mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username || 'Developer'}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Here's what's happening with your development journey today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <MobileCardGrid cols={2} gap="md" className="mb-6">
        <MobileStatsCard
          title="Repositories"
          value={currentStats.repositories}
          description="Active projects"
          icon={<Github className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />}
          variant="glassmorphism"
          trend={{ value: "+5 this month", isPositive: true }}
        />
        <MobileStatsCard
          title="Commits"
          value={currentStats.commits.toLocaleString()}
          description="Total contributions"
          icon={<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />}
          variant="glassmorphism"
          trend={{ value: "+12% from last month", isPositive: true }}
        />
        <MobileStatsCard
          title="Problems Solved"
          value={currentStats.problems}
          description="Coding challenges"
          icon={<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />}
          variant="glassmorphism"
          trend={{ value: "+3 this week", isPositive: true }}
        />
        <MobileStatsCard
          title="Projects"
          value={currentStats.projects}
          description="In progress"
          icon={<Target className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />}
          variant="glassmorphism"
          trend={{ value: "2 completed", isPositive: true }}
        />
      </MobileCardGrid>

      {/* Quick Actions */}
      <MobileCard variant="glassmorphism" className="mb-6">
        <MobileCardHeader>
          <MobileCardTitle size="lg">Quick Actions</MobileCardTitle>
        </MobileCardHeader>
        <MobileCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gradient-to-br hover:from-white/50 hover:to-white/30 dark:hover:from-gray-800/50 dark:hover:to-gray-800/30 transition-all duration-300 group"
                onClick={action.action}
              >
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </MobileCardContent>
      </MobileCard>

      {/* Recent Activity */}
      <MobileCard variant="glassmorphism" className="mb-6">
        <MobileCardHeader>
          <div className="flex items-center justify-between">
            <MobileCardTitle size="lg">Recent Activity</MobileCardTitle>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              Live
            </Badge>
          </div>
        </MobileCardHeader>
        <MobileCardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors duration-200">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 dark:border-gray-700/20">
            <Button variant="outline" className="w-full" onClick={() => router.push('/activity')}>
              View All Activity
            </Button>
          </div>
        </MobileCardContent>
      </MobileCard>

      {/* Today's Focus */}
      <MobileCard variant="glassmorphism">
        <MobileCardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-600" />
            <MobileCardTitle size="lg">Today's Focus</MobileCardTitle>
          </div>
        </MobileCardHeader>
        <MobileCardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Complete React Native tutorial
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 of 5 chapters completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  40% done
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-800/50">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Review pull requests
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3 PRs pending review
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  High priority
                </p>
              </div>
            </div>
          </div>
        </MobileCardContent>
      </MobileCard>
    </Layout>
  );
}
