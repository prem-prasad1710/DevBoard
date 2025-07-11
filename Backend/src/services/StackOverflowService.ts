import axios from 'axios';
import { StackOverflowActivity, IStackOverflowActivity } from '../models/StackOverflowActivity';
import { logger } from '../utils/logger';

export class StackOverflowService {
  private readonly BASE_URL = 'https://api.stackexchange.com/2.3';
  private readonly SITE = 'stackoverflow';

  async syncUserActivity(userId: string, stackoverflowId: string): Promise<IStackOverflowActivity[]> {
    try {
      const activities: Partial<IStackOverflowActivity>[] = [];
      
      // Get user questions
      const questions = await this.getUserQuestions(stackoverflowId);
      activities.push(...questions);
      
      // Get user answers
      const answers = await this.getUserAnswers(stackoverflowId);
      activities.push(...answers);
      
      // Get user comments
      const comments = await this.getUserComments(stackoverflowId);
      activities.push(...comments);
      
      // Save to database
      const savedActivities = await Promise.all(
        activities.map(async (activity) => {
          const existing = await StackOverflowActivity.findOne({
            userId,
            stackoverflowId,
            url: activity.url,
          });

          if (!existing) {
            return await StackOverflowActivity.create(activity);
          }
          return existing;
        })
      );

      logger.info(`Synced ${savedActivities.length} StackOverflow activities for user ${userId}`);
      return savedActivities;
    } catch (error) {
      logger.error('Error syncing StackOverflow activity:', error);
      throw error;
    }
  }

  private async getUserQuestions(stackoverflowId: string): Promise<Partial<IStackOverflowActivity>[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/${stackoverflowId}/questions`, {
        params: {
          site: this.SITE,
          sort: 'creation',
          order: 'desc',
          pagesize: 100,
          filter: 'default',
        },
      });

      return response.data.items.map((question: any) => ({
        stackoverflowId,
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
        },
      }));
    } catch (error) {
      logger.error('Error fetching user questions:', error);
      return [];
    }
  }

  private async getUserAnswers(stackoverflowId: string): Promise<Partial<IStackOverflowActivity>[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/${stackoverflowId}/answers`, {
        params: {
          site: this.SITE,
          sort: 'creation',
          order: 'desc',
          pagesize: 100,
          filter: 'default',
        },
      });

      return response.data.items.map((answer: any) => ({
        stackoverflowId,
        type: 'answer',
        title: `Answer to: ${answer.title || 'Question'}`,
        content: answer.body,
        url: answer.link,
        score: answer.score,
        tags: answer.tags || [],
        accepted: answer.is_accepted,
        createdAt: new Date(answer.creation_date * 1000),
        updatedAt: new Date(answer.last_activity_date * 1000),
        metadata: {
          answerId: answer.answer_id,
          questionId: answer.question_id,
          commentCount: answer.comment_count,
        },
      }));
    } catch (error) {
      logger.error('Error fetching user answers:', error);
      return [];
    }
  }

  private async getUserComments(stackoverflowId: string): Promise<Partial<IStackOverflowActivity>[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/${stackoverflowId}/comments`, {
        params: {
          site: this.SITE,
          sort: 'creation',
          order: 'desc',
          pagesize: 100,
          filter: 'default',
        },
      });

      return response.data.items.map((comment: any) => ({
        stackoverflowId,
        type: 'comment',
        title: `Comment on: ${comment.post_type}`,
        content: comment.body,
        url: comment.link,
        score: comment.score,
        tags: [],
        accepted: false,
        createdAt: new Date(comment.creation_date * 1000),
        updatedAt: new Date(comment.creation_date * 1000),
        metadata: {
          commentId: comment.comment_id,
          postId: comment.post_id,
          postType: comment.post_type,
        },
      }));
    } catch (error) {
      logger.error('Error fetching user comments:', error);
      return [];
    }
  }

  async getUserProfile(stackoverflowId: string) {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/${stackoverflowId}`, {
        params: {
          site: this.SITE,
          filter: 'default',
        },
      });

      const user = response.data.items[0];
      if (!user) {
        throw new Error('User not found');
      }

      return {
        userId: user.user_id,
        displayName: user.display_name,
        reputation: user.reputation,
        profileImage: user.profile_image,
        websiteUrl: user.website_url,
        location: user.location,
        aboutMe: user.about_me,
        createdAt: new Date(user.creation_date * 1000),
        lastAccessDate: new Date(user.last_access_date * 1000),
        badgeCounts: user.badge_counts,
        questionCount: user.question_count,
        answerCount: user.answer_count,
        upVoteCount: user.up_vote_count,
        downVoteCount: user.down_vote_count,
        viewCount: user.view_count,
      };
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async searchQuestions(query: string, tags: string[] = []) {
    try {
      const response = await axios.get(`${this.BASE_URL}/search/advanced`, {
        params: {
          site: this.SITE,
          q: query,
          tagged: tags.join(';'),
          sort: 'relevance',
          order: 'desc',
          pagesize: 50,
          filter: 'default',
        },
      });

      return response.data.items.map((question: any) => ({
        questionId: question.question_id,
        title: question.title,
        body: question.body,
        url: question.link,
        score: question.score,
        tags: question.tags,
        isAnswered: question.is_answered,
        answerCount: question.answer_count,
        viewCount: question.view_count,
        createdAt: new Date(question.creation_date * 1000),
        lastActivityDate: new Date(question.last_activity_date * 1000),
        author: question.owner.display_name,
      }));
    } catch (error) {
      logger.error('Error searching questions:', error);
      throw error;
    }
  }

  async getPopularTags() {
    try {
      const response = await axios.get(`${this.BASE_URL}/tags`, {
        params: {
          site: this.SITE,
          sort: 'popular',
          order: 'desc',
          pagesize: 100,
          filter: 'default',
        },
      });

      return response.data.items.map((tag: any) => ({
        name: tag.name,
        count: tag.count,
        synonyms: tag.synonyms,
        description: tag.excerpt,
        wikiUrl: tag.wiki_url,
      }));
    } catch (error) {
      logger.error('Error fetching popular tags:', error);
      throw error;
    }
  }

  async getRelatedTags(tag: string) {
    try {
      const response = await axios.get(`${this.BASE_URL}/tags/${tag}/related`, {
        params: {
          site: this.SITE,
          filter: 'default',
        },
      });

      return response.data.items.map((relatedTag: any) => ({
        name: relatedTag.name,
        count: relatedTag.count,
        synonyms: relatedTag.synonyms,
      }));
    } catch (error) {
      logger.error('Error fetching related tags:', error);
      throw error;
    }
  }
}

export const stackOverflowService = new StackOverflowService();
