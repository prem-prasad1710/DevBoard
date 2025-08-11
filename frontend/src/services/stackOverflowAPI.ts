import { getSession } from 'next-auth/react';

// Stack Overflow API Types
export interface StackOverflowUser {
  user_id: number;
  display_name: string;
  profile_image: string;
  reputation: number;
  badge_counts: {
    bronze: number;
    silver: number;
    gold: number;
  };
  creation_date: number;
  last_access_date: number;
  location?: string;
  website_url?: string;
  about_me?: string;
  view_count: number;
  up_vote_count: number;
  down_vote_count: number;
  answer_count: number;
  question_count: number;
}

export interface StackOverflowQuestion {
  question_id: number;
  title: string;
  body?: string;
  score: number;
  view_count: number;
  answer_count: number;
  comment_count: number;
  favorite_count: number;
  tags: string[];
  creation_date: number;
  last_activity_date: number;
  last_edit_date?: number;
  is_answered: boolean;
  accepted_answer_id?: number;
  link: string;
  owner: {
    user_id: number;
    display_name: string;
    profile_image: string;
    reputation: number;
  };
}

export interface StackOverflowAnswer {
  answer_id: number;
  question_id: number;
  body?: string;
  score: number;
  is_accepted: boolean;
  creation_date: number;
  last_activity_date: number;
  last_edit_date?: number;
  comment_count: number;
  link: string;
  owner: {
    user_id: number;
    display_name: string;
    profile_image: string;
    reputation: number;
  };
}

export interface StackOverflowComment {
  comment_id: number;
  post_id: number;
  score: number;
  body: string;
  creation_date: number;
  edited: boolean;
  link: string;
  owner: {
    user_id: number;
    display_name: string;
    profile_image: string;
    reputation: number;
  };
}

export interface StackOverflowBadge {
  badge_id: number;
  name: string;
  description: string;
  award_count: number;
  badge_type: 'named' | 'tag_based';
  rank: 'bronze' | 'silver' | 'gold';
  link: string;
}

export interface StackOverflowReputationHistory {
  reputation_history_type: string;
  reputation_change: number;
  post_id?: number;
  creation_date: number;
  user_id: number;
}

export interface StackOverflowStats {
  totalReputation: number;
  totalQuestions: number;
  totalAnswers: number;
  totalComments: number;
  acceptedAnswers: number;
  totalBadges: number;
  goldBadges: number;
  silverBadges: number;
  bronzeBadges: number;
  totalViews: number;
  upVotes: number;
  downVotes: number;
}

export interface StackOverflowActivity {
  id: string;
  type: 'question' | 'answer' | 'comment' | 'badge' | 'reputation';
  title: string;
  content?: string;
  url: string;
  score: number;
  tags?: string[];
  accepted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export class StackOverflowAPIService {
  private readonly BASE_URL = 'https://api.stackexchange.com/2.3';
  private readonly SITE = 'stackoverflow';
  private readonly KEY = process.env.NEXT_PUBLIC_STACKOVERFLOW_API_KEY;

  private async fetchWithAuth(endpoint: string, params: Record<string, any> = {}) {
    const session = await getSession();
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const defaultParams = {
      site: this.SITE,
      key: this.KEY,
      ...params
    };

    const searchParams = new URLSearchParams();
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}?${searchParams.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Stack Overflow API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Stack Overflow API request timed out');
      }
      
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<StackOverflowUser | null> {
    try {
      const data = await this.fetchWithAuth(`/users/${userId}`, {
        filter: 'default'
      });

      if (data.items && data.items.length > 0) {
        return data.items[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching Stack Overflow user profile:', error);
      throw error;
    }
  }

  async getUserQuestions(userId: string, page: number = 1, pageSize: number = 50): Promise<StackOverflowQuestion[]> {
    try {
      const data = await this.fetchWithAuth(`/users/${userId}/questions`, {
        sort: 'creation',
        order: 'desc',
        page,
        pagesize: pageSize,
        filter: 'withbody'
      });

      return data.items || [];
    } catch (error) {
      console.error('Error fetching Stack Overflow questions:', error);
      return [];
    }
  }

  async getUserAnswers(userId: string, page: number = 1, pageSize: number = 50): Promise<StackOverflowAnswer[]> {
    try {
      const data = await this.fetchWithAuth(`/users/${userId}/answers`, {
        sort: 'creation',
        order: 'desc',
        page,
        pagesize: pageSize,
        filter: 'withbody'
      });

      return data.items || [];
    } catch (error) {
      console.error('Error fetching Stack Overflow answers:', error);
      return [];
    }
  }

  async getUserComments(userId: string, page: number = 1, pageSize: number = 50): Promise<StackOverflowComment[]> {
    try {
      const data = await this.fetchWithAuth(`/users/${userId}/comments`, {
        sort: 'creation',
        order: 'desc',
        page,
        pagesize: pageSize,
        filter: 'default'
      });

      return data.items || [];
    } catch (error) {
      console.error('Error fetching Stack Overflow comments:', error);
      return [];
    }
  }

  async getUserBadges(userId: string): Promise<StackOverflowBadge[]> {
    try {
      const data = await this.fetchWithAuth(`/users/${userId}/badges`, {
        sort: 'rank',
        order: 'desc',
        pagesize: 100,
        filter: 'default'
      });

      return data.items || [];
    } catch (error) {
      console.error('Error fetching Stack Overflow badges:', error);
      return [];
    }
  }

  async getUserReputationHistory(userId: string): Promise<StackOverflowReputationHistory[]> {
    try {
      const data = await this.fetchWithAuth(`/users/${userId}/reputation-history`, {
        pagesize: 100,
        filter: 'default'
      });

      return data.items || [];
    } catch (error) {
      console.error('Error fetching Stack Overflow reputation history:', error);
      return [];
    }
  }

  async getUserStats(userId: string): Promise<StackOverflowStats> {
    try {
      const profile = await this.getUserProfile(userId);
      const questions = await this.getUserQuestions(userId, 1, 1);
      const answers = await this.getUserAnswers(userId, 1, 1);
      const comments = await this.getUserComments(userId, 1, 1);
      const badges = await this.getUserBadges(userId);

      if (!profile) {
        throw new Error('User profile not found');
      }

      const acceptedAnswers = answers.filter(answer => answer.is_accepted).length;

      return {
        totalReputation: profile.reputation,
        totalQuestions: profile.question_count,
        totalAnswers: profile.answer_count,
        totalComments: comments.length,
        acceptedAnswers,
        totalBadges: profile.badge_counts.bronze + profile.badge_counts.silver + profile.badge_counts.gold,
        goldBadges: profile.badge_counts.gold,
        silverBadges: profile.badge_counts.silver,
        bronzeBadges: profile.badge_counts.bronze,
        totalViews: profile.view_count,
        upVotes: profile.up_vote_count,
        downVotes: profile.down_vote_count,
      };
    } catch (error) {
      console.error('Error fetching Stack Overflow stats:', error);
      throw error;
    }
  }

  async getRecentActivity(userId: string): Promise<StackOverflowActivity[]> {
    try {
      const [questions, answers, comments] = await Promise.all([
        this.getUserQuestions(userId, 1, 20),
        this.getUserAnswers(userId, 1, 20),
        this.getUserComments(userId, 1, 20)
      ]);

      const activities: StackOverflowActivity[] = [];

      // Add questions
      questions.forEach(question => {
        activities.push({
          id: `question-${question.question_id}`,
          type: 'question',
          title: question.title,
          content: question.body,
          url: question.link,
          score: question.score,
          tags: question.tags,
          accepted: question.is_answered,
          createdAt: new Date(question.creation_date * 1000),
          updatedAt: new Date(question.last_activity_date * 1000),
          metadata: {
            questionId: question.question_id,
            viewCount: question.view_count,
            answerCount: question.answer_count,
            commentCount: question.comment_count,
            favoriteCount: question.favorite_count,
          }
        });
      });

      // Add answers
      answers.forEach(answer => {
        activities.push({
          id: `answer-${answer.answer_id}`,
          type: 'answer',
          title: `Answer to question ${answer.question_id}`,
          content: answer.body,
          url: answer.link,
          score: answer.score,
          accepted: answer.is_accepted,
          createdAt: new Date(answer.creation_date * 1000),
          updatedAt: new Date(answer.last_activity_date * 1000),
          metadata: {
            answerId: answer.answer_id,
            questionId: answer.question_id,
            commentCount: answer.comment_count,
            isAccepted: answer.is_accepted,
          }
        });
      });

      // Add comments
      comments.forEach(comment => {
        activities.push({
          id: `comment-${comment.comment_id}`,
          type: 'comment',
          title: `Comment on post ${comment.post_id}`,
          content: comment.body,
          url: comment.link,
          score: comment.score,
          createdAt: new Date(comment.creation_date * 1000),
          updatedAt: new Date(comment.creation_date * 1000),
          metadata: {
            commentId: comment.comment_id,
            postId: comment.post_id,
            edited: comment.edited,
          }
        });
      });

      // Sort by creation date (newest first)
      return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching Stack Overflow recent activity:', error);
      throw error;
    }
  }

  async searchUserByDisplayName(displayName: string): Promise<StackOverflowUser[]> {
    try {
      const data = await this.fetchWithAuth('/users', {
        inname: displayName,
        sort: 'reputation',
        order: 'desc',
        pagesize: 10,
        filter: 'default'
      });

      return data.items || [];
    } catch (error) {
      console.error('Error searching Stack Overflow users:', error);
      return [];
    }
  }
}

export const stackOverflowAPI = new StackOverflowAPIService();
