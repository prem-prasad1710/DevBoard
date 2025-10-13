import axios, { AxiosResponse } from 'axios';
import { logger } from '../utils/logger';

// LeetCode API interfaces
export interface LeetCodeUserProfile {
  username: string;
  avatar: string;
  realName: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  ranking: number;
  reputation: number;
  gitHub: string;
  twitter: string;
  school: string;
  skillTags: string[];
  aboutMe: string;
}

export interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
}

export interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  runtime: string;
  memory: string;
  code: string;
  question: {
    questionId: string;
    title: string;
    difficulty: string;
    categoryTitle: string;
    topicTags: Array<{
      name: string;
      slug: string;
    }>;
  };
}

export interface LeetCodeProblem {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  categoryTitle: string;
  likes: number;
  dislikes: number;
  acRate: number;
  isPaidOnly: boolean;
  topicTags: Array<{
    name: string;
    slug: string;
  }>;
  content: string;
  codeSnippets: Array<{
    lang: string;
    langSlug: string;
    code: string;
  }>;
  sampleTestCase: string;
  metaData: string;
}

export interface LeetCodeContestInfo {
  contestId: number;
  title: string;
  startTime: number;
  duration: number;
  originStartTime: number;
  isVirtual: boolean;
  questions: Array<{
    questionId: string;
    title: string;
    difficulty: string;
  }>;
}

class LeetCodeService {
  private baseURL = 'https://leetcode.com';
  private graphqlURL = 'https://leetcode.com/graphql';
  private apiURL = 'https://leetcode.com/api';
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  private axiosInstance = axios.create({
    timeout: 30000,
    headers: {
      'User-Agent': this.userAgent,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://leetcode.com',
    },
  });

  constructor() {
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('LeetCode API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get user profile information
   */
  async getUserProfile(username: string): Promise<LeetCodeUserProfile | null> {
    try {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
              aboutMe
              userAvatar
              location
              skillTags
              websites
              school
              ranking
              reputation
            }
            socialAccounts {
              provider
              profileUrl
            }
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: { username },
      });

      const userData = response.data?.data?.matchedUser;
      if (!userData) {
        logger.warn(`User ${username} not found on LeetCode`);
        return null;
      }

      const profile = userData.profile;
      const socialAccounts = userData.socialAccounts || [];

      const github = socialAccounts.find((acc: any) => acc.provider === 'github')?.profileUrl || '';
      const linkedin = socialAccounts.find((acc: any) => acc.provider === 'linkedin')?.profileUrl || '';

      return {
        username: userData.username,
        avatar: profile.userAvatar || '',
        realName: profile.realName || '',
        location: profile.location || '',
        website: profile.websites?.[0] || '',
        github,
        linkedin,
        ranking: profile.ranking || 0,
        reputation: profile.reputation || 0,
        gitHub: github,
        twitter: '',
        school: profile.school || '',
        skillTags: profile.skillTags || [],
        aboutMe: profile.aboutMe || '',
      };
    } catch (error) {
      logger.error(`Error fetching user profile for ${username}:`, error);
      return null;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(username: string): Promise<LeetCodeStats | null> {
    try {
      const query = `
        query getUserStats($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              reputation
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: { username },
      });

      const data = response.data?.data;
      if (!data?.matchedUser) {
        logger.warn(`Stats for user ${username} not found`);
        return null;
      }

      const submitStats = data.matchedUser.submitStats.acSubmissionNum;
      const allQuestions = data.allQuestionsCount;

      // Parse submission stats
      const easyStats = submitStats.find((stat: any) => stat.difficulty === 'Easy') || { count: 0, submissions: 0 };
      const mediumStats = submitStats.find((stat: any) => stat.difficulty === 'Medium') || { count: 0, submissions: 0 };
      const hardStats = submitStats.find((stat: any) => stat.difficulty === 'Hard') || { count: 0, submissions: 0 };

      // Parse total questions
      const totalEasy = allQuestions.find((q: any) => q.difficulty === 'Easy')?.count || 0;
      const totalMedium = allQuestions.find((q: any) => q.difficulty === 'Medium')?.count || 0;
      const totalHard = allQuestions.find((q: any) => q.difficulty === 'Hard')?.count || 0;

      const totalSolved = easyStats.count + mediumStats.count + hardStats.count;
      const totalSubmissions = easyStats.submissions + mediumStats.submissions + hardStats.submissions;
      const totalQuestions = totalEasy + totalMedium + totalHard;

      return {
        totalSolved,
        totalQuestions,
        easySolved: easyStats.count,
        totalEasy,
        mediumSolved: mediumStats.count,
        totalMedium,
        hardSolved: hardStats.count,
        totalHard,
        acceptanceRate: totalSubmissions > 0 ? (totalSolved / totalSubmissions) * 100 : 0,
        ranking: data.matchedUser.profile?.ranking || 0,
        contributionPoints: 0, // Not available in public API
        reputation: data.matchedUser.profile?.reputation || 0,
      };
    } catch (error) {
      logger.error(`Error fetching user stats for ${username}:`, error);
      return null;
    }
  }

  /**
   * Get recent submissions
   */
  async getRecentSubmissions(username: string, limit: number = 20): Promise<LeetCodeSubmission[]> {
    try {
      const query = `
        query getRecentSubmissions($username: String!, $limit: Int) {
          recentSubmissionList(username: $username, limit: $limit) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
            runtime
            memory
            code
            question {
              questionId
              title
              difficulty
              categoryTitle
              topicTags {
                name
                slug
              }
            }
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: { username, limit },
      });

      const submissions = response.data?.data?.recentSubmissionList || [];

      return submissions.map((submission: any, index: number) => ({
        id: `${username}_${submission.timestamp}_${index}`,
        title: submission.title,
        titleSlug: submission.titleSlug,
        timestamp: new Date(parseInt(submission.timestamp) * 1000).toISOString(),
        statusDisplay: submission.statusDisplay,
        lang: submission.lang,
        runtime: submission.runtime || 'N/A',
        memory: submission.memory || 'N/A',
        code: submission.code || '',
        question: {
          questionId: submission.question?.questionId || '',
          title: submission.question?.title || submission.title,
          difficulty: submission.question?.difficulty || 'Unknown',
          categoryTitle: submission.question?.categoryTitle || 'Unknown',
          topicTags: submission.question?.topicTags || [],
        },
      }));
    } catch (error) {
      logger.error(`Error fetching recent submissions for ${username}:`, error);
      return [];
    }
  }

  /**
   * Get problem details by slug
   */
  async getProblemDetails(titleSlug: string): Promise<LeetCodeProblem | null> {
    try {
      const query = `
        query getProblemDetails($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            title
            titleSlug
            difficulty
            categoryTitle
            likes
            dislikes
            acRate
            isPaidOnly
            topicTags {
              name
              slug
            }
            content
            codeSnippets {
              lang
              langSlug
              code
            }
            sampleTestCase
            metaData
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: { titleSlug },
      });

      const question = response.data?.data?.question;
      if (!question) {
        logger.warn(`Problem ${titleSlug} not found`);
        return null;
      }

      return {
        questionId: question.questionId,
        title: question.title,
        titleSlug: question.titleSlug,
        difficulty: question.difficulty,
        categoryTitle: question.categoryTitle,
        likes: question.likes || 0,
        dislikes: question.dislikes || 0,
        acRate: question.acRate || 0,
        isPaidOnly: question.isPaidOnly || false,
        topicTags: question.topicTags || [],
        content: question.content || '',
        codeSnippets: question.codeSnippets || [],
        sampleTestCase: question.sampleTestCase || '',
        metaData: question.metaData || '',
      };
    } catch (error) {
      logger.error(`Error fetching problem details for ${titleSlug}:`, error);
      return null;
    }
  }

  /**
   * Get all problems with pagination
   */
  async getAllProblems(skip: number = 0, limit: number = 50, filters?: any): Promise<any> {
    try {
      const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
              hasSolution
              hasVideoSolution
            }
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: {
          categorySlug: '',
          limit,
          skip,
          filters: filters || {},
        },
      });

      return response.data?.data?.problemsetQuestionList || { total: 0, questions: [] };
    } catch (error) {
      logger.error('Error fetching all problems:', error);
      return { total: 0, questions: [] };
    }
  }

  /**
   * Get contest information
   */
  async getContestInfo(contestSlug: string): Promise<LeetCodeContestInfo | null> {
    try {
      const query = `
        query getContestInfo($contestSlug: String!) {
          contest(titleSlug: $contestSlug) {
            id
            title
            startTime
            duration
            originStartTime
            isVirtual
            questions {
              questionId
              title
              difficulty
            }
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: { contestSlug },
      });

      const contest = response.data?.data?.contest;
      if (!contest) {
        logger.warn(`Contest ${contestSlug} not found`);
        return null;
      }

      return {
        contestId: parseInt(contest.id),
        title: contest.title,
        startTime: contest.startTime,
        duration: contest.duration,
        originStartTime: contest.originStartTime,
        isVirtual: contest.isVirtual,
        questions: contest.questions || [],
      };
    } catch (error) {
      logger.error(`Error fetching contest info for ${contestSlug}:`, error);
      return null;
    }
  }

  /**
   * Validate if username exists
   */
  async validateUsername(username: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(username);
      return profile !== null;
    } catch (error) {
      logger.error(`Error validating username ${username}:`, error);
      return false;
    }
  }

  /**
   * Get comprehensive user data (profile + stats + recent submissions)
   */
  async getComprehensiveUserData(username: string): Promise<any> {
    try {
      logger.info(`Fetching comprehensive data for LeetCode user: ${username}`);

      const [profile, stats, submissions] = await Promise.allSettled([
        this.getUserProfile(username),
        this.getUserStats(username),
        this.getRecentSubmissions(username, 10),
      ]);

      const result = {
        username,
        profile: profile.status === 'fulfilled' ? profile.value : null,
        stats: stats.status === 'fulfilled' ? stats.value : null,
        recentSubmissions: submissions.status === 'fulfilled' ? submissions.value : [],
        lastSyncAt: new Date().toISOString(),
        success: true,
      };

      // Log any failures
      if (profile.status === 'rejected') {
        logger.error(`Failed to fetch profile for ${username}:`, profile.reason);
      }
      if (stats.status === 'rejected') {
        logger.error(`Failed to fetch stats for ${username}:`, stats.reason);
      }
      if (submissions.status === 'rejected') {
        logger.error(`Failed to fetch submissions for ${username}:`, submissions.reason);
      }

      return result;
    } catch (error) {
      logger.error(`Error fetching comprehensive data for ${username}:`, error);
      return {
        username,
        profile: null,
        stats: null,
        recentSubmissions: [],
        lastSyncAt: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get daily challenge
   */
  async getDailyChallenge(): Promise<any> {
    try {
      const query = `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              hasVideoSolution
              hasSolution
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
      });

      return response.data?.data?.activeDailyCodingChallengeQuestion || null;
    } catch (error) {
      logger.error('Error fetching daily challenge:', error);
      return null;
    }
  }

  /**
   * Search problems by keyword
   */
  async searchProblems(keyword: string, limit: number = 20): Promise<any[]> {
    try {
      const query = `
        query searchProblems($searchKeywords: String!, $limit: Int) {
          problemsetQuestionList: questionList(
            categorySlug: ""
            limit: $limit
            skip: 0
            filters: {
              searchKeywords: $searchKeywords
            }
          ) {
            questions: data {
              acRate
              difficulty
              frontendQuestionId: questionFrontendId
              paidOnly: isPaidOnly
              title
              titleSlug
              topicTags {
                name
                slug
              }
            }
          }
        }
      `;

      const response: AxiosResponse = await this.axiosInstance.post(this.graphqlURL, {
        query,
        variables: { searchKeywords: keyword, limit },
      });

      return response.data?.data?.problemsetQuestionList?.questions || [];
    } catch (error) {
      logger.error(`Error searching problems with keyword "${keyword}":`, error);
      return [];
    }
  }
}

// Export singleton instance
export const leetCodeService = new LeetCodeService();
export { LeetCodeService };
export default LeetCodeService;
