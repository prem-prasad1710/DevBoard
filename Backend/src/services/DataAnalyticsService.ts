import { GitHubActivity } from '../models/GitHubActivity';
import { DeveloperJournal } from '../models/DeveloperJournal';
import { Project } from '../models/Project';
import { StackOverflowActivity } from '../models/StackOverflowActivity';
import { logger } from '../utils/logger';

export interface ActivitySummary {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByRepository: Record<string, number>;
  activitiesByLanguage: Record<string, number>;
  productivityScore: number;
  streakDays: number;
  avgActivitiesPerDay: number;
  mostActiveDay: string;
  topRepositories: string[];
  topLanguages: string[];
}

export interface ProductivityMetrics {
  daily: {
    commits: number;
    prs: number;
    issues: number;
    codeReviews: number;
    score: number;
  };
  weekly: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    avgDailyScore: number;
    trend: 'up' | 'down' | 'stable';
  };
  monthly: {
    totalActivities: number;
    completedProjects: number;
    journalEntries: number;
    avgMood: number;
    avgProductivity: number;
  };
}

export interface LearningInsights {
  newTechnologies: string[];
  skillProgression: {
    technology: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number;
    recentUsage: number;
  }[];
  learningGoals: {
    goal: string;
    progress: number;
    dueDate?: Date;
    status: 'on-track' | 'behind' | 'completed';
  }[];
  recommendedResources: {
    title: string;
    type: 'course' | 'book' | 'tutorial' | 'documentation';
    url: string;
    relevance: number;
  }[];
}

export class DataAnalyticsService {
  async getActivitySummary(userId: string, timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ActivitySummary> {
    try {
      const dateRange = this.getDateRange(timeRange);
      
      const activities = await GitHubActivity.find({
        userId,
        createdAt: { $gte: dateRange.start, $lte: dateRange.end }
      });

      const activitiesByType = this.groupBy(activities, 'type');
      const activitiesByRepository = this.groupBy(activities, 'repository');
      const activitiesByLanguage = this.extractLanguageStats(activities);
      
      const productivityScore = this.calculateProductivityScore(activities);
      const streakDays = await this.calculateStreakDays(userId);
      const avgActivitiesPerDay = activities.length / this.getDaysInRange(timeRange);
      const mostActiveDay = this.getMostActiveDay(activities);
      
      return {
        totalActivities: activities.length,
        activitiesByType,
        activitiesByRepository,
        activitiesByLanguage,
        productivityScore,
        streakDays,
        avgActivitiesPerDay,
        mostActiveDay,
        topRepositories: Object.keys(activitiesByRepository).slice(0, 5),
        topLanguages: Object.keys(activitiesByLanguage).slice(0, 5),
      };
    } catch (error) {
      logger.error('Error getting activity summary:', error);
      throw error;
    }
  }

  async getProductivityMetrics(userId: string): Promise<ProductivityMetrics> {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Daily metrics
      const dailyActivities = await GitHubActivity.find({
        userId,
        createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
      });

      const daily = {
        commits: dailyActivities.filter(a => a.type === 'commit').length,
        prs: dailyActivities.filter(a => a.type === 'pr').length,
        issues: dailyActivities.filter(a => a.type === 'issue').length,
        codeReviews: dailyActivities.filter(a => a.type === 'pr').length,
        score: this.calculateProductivityScore(dailyActivities),
      };

      // Weekly metrics
      const weeklyActivities = await GitHubActivity.find({
        userId,
        createdAt: { $gte: weekAgo }
      });

      const weekly = {
        totalCommits: weeklyActivities.filter(a => a.type === 'commit').length,
        totalPRs: weeklyActivities.filter(a => a.type === 'pr').length,
        totalIssues: weeklyActivities.filter(a => a.type === 'issue').length,
        avgDailyScore: this.calculateProductivityScore(weeklyActivities) / 7,
        trend: await this.calculateTrend(userId, 'week') as 'up' | 'down' | 'stable',
      };

      // Monthly metrics
      const monthlyActivities = await GitHubActivity.find({
        userId,
        createdAt: { $gte: monthAgo }
      });

      const completedProjects = await Project.countDocuments({
        userId,
        status: 'completed',
        updatedAt: { $gte: monthAgo }
      });

      const journalEntries = await DeveloperJournal.find({
        userId,
        createdAt: { $gte: monthAgo }
      });

      const monthly = {
        totalActivities: monthlyActivities.length,
        completedProjects,
        journalEntries: journalEntries.length,
        avgMood: this.calculateAverageMood(journalEntries),
        avgProductivity: this.calculateAverageProductivity(journalEntries),
      };

      return { daily, weekly, monthly };
    } catch (error) {
      logger.error('Error getting productivity metrics:', error);
      throw error;
    }
  }

  async getLearningInsights(userId: string): Promise<LearningInsights> {
    try {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const activities = await GitHubActivity.find({
        userId,
        createdAt: { $gte: monthAgo }
      });

      const journals = await DeveloperJournal.find({
        userId,
        createdAt: { $gte: monthAgo }
      });

      const projects = await Project.find({
        userId,
        updatedAt: { $gte: monthAgo }
      });

      // Extract technologies from activities and projects
      const technologies = new Set<string>();
      activities.forEach(activity => {
        if (activity.metadata?.language) {
          technologies.add(activity.metadata.language);
        }
      });

      projects.forEach(project => {
        project.technologies.forEach(tech => technologies.add(tech));
      });

      const newTechnologies = Array.from(technologies).slice(0, 5);

      // Calculate skill progression
      const skillProgression = this.calculateSkillProgression(Array.from(technologies), activities);

      // Extract learning goals from journals
      const learningGoals = this.extractLearningGoals(journals);

      // Generate recommended resources
      const recommendedResources = this.generateRecommendedResources(Array.from(technologies));

      return {
        newTechnologies,
        skillProgression,
        learningGoals,
        recommendedResources,
      };
    } catch (error) {
      logger.error('Error getting learning insights:', error);
      throw error;
    }
  }

  async generateWeeklyReport(userId: string): Promise<{
    summary: string;
    achievements: string[];
    challenges: string[];
    recommendations: string[];
    metrics: ProductivityMetrics;
  }> {
    try {
      const metrics = await this.getProductivityMetrics(userId);
      const activitySummary = await this.getActivitySummary(userId, 'week');
      
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const journals = await DeveloperJournal.find({
        userId,
        createdAt: { $gte: weekAgo }
      });

      const achievements = this.extractAchievements(journals);
      const challenges = this.extractChallenges(journals);
      const recommendations = this.generateRecommendations(metrics, activitySummary);

      const summary = `
        This week you completed ${metrics.weekly.totalCommits} commits, 
        ${metrics.weekly.totalPRs} pull requests, and worked on ${activitySummary.topRepositories.length} repositories. 
        Your productivity score was ${metrics.weekly.avgDailyScore.toFixed(1)}/10.
      `;

      return {
        summary,
        achievements,
        challenges,
        recommendations,
        metrics,
      };
    } catch (error) {
      logger.error('Error generating weekly report:', error);
      throw error;
    }
  }

  private getDateRange(timeRange: string): { start: Date; end: Date } {
    const end = new Date();
    let start: Date;

    switch (timeRange) {
      case 'day':
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start, end };
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private extractLanguageStats(activities: any[]): Record<string, number> {
    const languages: Record<string, number> = {};
    
    activities.forEach(activity => {
      if (activity.metadata?.language) {
        const lang = activity.metadata.language;
        languages[lang] = (languages[lang] || 0) + 1;
      }
    });

    return languages;
  }

  private calculateProductivityScore(activities: any[]): number {
    const weights = {
      commit: 10,
      pr: 20,
      issue: 15,
      release: 50,
      fork: 5,
      star: 2,
    };

    const score = activities.reduce((total, activity) => {
      return total + (weights[activity.type as keyof typeof weights] || 0);
    }, 0);

    return Math.min(score / 10, 10); // Normalize to 0-10 scale
  }

  private async calculateStreakDays(userId: string): Promise<number> {
    const activities = await GitHubActivity.find({ userId }).sort({ createdAt: -1 });
    
    if (activities.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const activity of activities) {
      const activityDate = new Date(activity.createdAt);
      activityDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (activityDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  private getDaysInRange(timeRange: string): number {
    switch (timeRange) {
      case 'day': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 365;
      default: return 30;
    }
  }

  private getMostActiveDay(activities: any[]): string {
    const dayCount: Record<string, number> = {};
    
    activities.forEach(activity => {
      const day = new Date(activity.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    return Object.keys(dayCount).reduce((a, b) => (dayCount[a] || 0) > (dayCount[b] || 0) ? a : b, 'Monday');
  }

  private async calculateTrend(userId: string, period: 'week' | 'month'): Promise<string> {
    const daysBack = period === 'week' ? 14 : 60;
    const midPoint = period === 'week' ? 7 : 30;

    const recentActivities = await GitHubActivity.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - midPoint * 24 * 60 * 60 * 1000) }
    });

    const olderActivities = await GitHubActivity.countDocuments({
      userId,
      createdAt: { 
        $gte: new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - midPoint * 24 * 60 * 60 * 1000)
      }
    });

    const threshold = olderActivities * 0.1; // 10% change threshold

    if (recentActivities > olderActivities + threshold) return 'up';
    if (recentActivities < olderActivities - threshold) return 'down';
    return 'stable';
  }

  private calculateAverageMood(journals: any[]): number {
    if (journals.length === 0) return 5;

    const moodValues = { frustrated: 2, confused: 3, tired: 4, motivated: 7, accomplished: 8, excited: 9 };
    const totalMood = journals.reduce((sum, journal) => {
      return sum + (moodValues[journal.mood as keyof typeof moodValues] || 5);
    }, 0);

    return totalMood / journals.length;
  }

  private calculateAverageProductivity(journals: any[]): number {
    if (journals.length === 0) return 5;

    const totalProductivity = journals.reduce((sum, journal) => sum + journal.productivity, 0);
    return totalProductivity / journals.length;
  }

  private calculateSkillProgression(technologies: string[], activities: any[]): LearningInsights['skillProgression'] {
    return technologies.map(tech => {
      const techActivities = activities.filter(a => 
        a.metadata?.language === tech || 
        a.repository?.toLowerCase().includes(tech.toLowerCase())
      );

      return {
        technology: tech,
        level: this.estimateSkillLevel(techActivities.length),
        confidence: Math.min(techActivities.length * 10, 100),
        recentUsage: techActivities.length,
      };
    });
  }

  private estimateSkillLevel(usageCount: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (usageCount < 5) return 'beginner';
    if (usageCount < 15) return 'intermediate';
    if (usageCount < 30) return 'advanced';
    return 'expert';
  }

  private extractLearningGoals(journals: any[]): LearningInsights['learningGoals'] {
    const goals: LearningInsights['learningGoals'] = [];
    
    journals.forEach(journal => {
      journal.goals.forEach((goal: string) => {
        if (!goals.find(g => g.goal === goal)) {
          goals.push({
            goal,
            progress: Math.random() * 100, // TODO: Implement actual progress tracking
            status: 'on-track',
          });
        }
      });
    });

    return goals;
  }

  private generateRecommendedResources(technologies: string[]): LearningInsights['recommendedResources'] {
    const resources: LearningInsights['recommendedResources'] = [];
    
    technologies.forEach(tech => {
      resources.push({
        title: `Advanced ${tech} Patterns`,
        type: 'course',
        url: `https://example.com/courses/${tech.toLowerCase()}`,
        relevance: Math.random() * 100,
      });
    });

    return resources;
  }

  private extractAchievements(journals: any[]): string[] {
    const achievements: string[] = [];
    
    journals.forEach(journal => {
      achievements.push(...journal.achievements);
    });

    return [...new Set(achievements)];
  }

  private extractChallenges(journals: any[]): string[] {
    const challenges: string[] = [];
    
    journals.forEach(journal => {
      challenges.push(...journal.challenges);
    });

    return [...new Set(challenges)];
  }

  private generateRecommendations(metrics: ProductivityMetrics, activitySummary: ActivitySummary): string[] {
    const recommendations: string[] = [];

    if (metrics.daily.score < 5) {
      recommendations.push('Consider setting smaller, achievable daily goals to improve productivity.');
    }

    if (activitySummary.streakDays < 3) {
      recommendations.push('Try to code consistently every day to build momentum.');
    }

    if (metrics.weekly.trend === 'down') {
      recommendations.push('Your activity has decreased this week. Consider reviewing your goals and priorities.');
    }

    return recommendations;
  }
}

export const dataAnalyticsService = new DataAnalyticsService();
