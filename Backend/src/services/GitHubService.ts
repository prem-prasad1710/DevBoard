import { Octokit } from '@octokit/rest';
import { GitHubActivity, IGitHubActivity } from '../models/GitHubActivity';
import { logger } from '../utils/logger';

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken?: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  async syncUserActivity(userId: string, githubUsername: string): Promise<IGitHubActivity[]> {
    try {
      const activities: IGitHubActivity[] = [];
      
      // Get user events
      const events = await this.octokit.activity.listPublicEventsForUser({
        username: githubUsername,
        per_page: 100,
      });

      for (const event of events.data) {
        const activity = await this.processEvent(userId, event);
        if (activity) {
          activities.push(activity as IGitHubActivity);
        }
      }

      // Save to database
      const savedActivities = await Promise.all(
        activities.map(async (activity) => {
          const existing = await GitHubActivity.findOne({
            userId,
            repository: activity.repository,
            title: activity.title,
            createdAt: activity.createdAt,
          });

          if (!existing) {
            return await GitHubActivity.create(activity);
          }
          return existing;
        })
      );

      logger.info(`Synced ${savedActivities.length} GitHub activities for user ${userId}`);
      return savedActivities;
    } catch (error) {
      logger.error('Error syncing GitHub activity:', error);
      throw error;
    }
  }

  private async processEvent(userId: string, event: any): Promise<Partial<IGitHubActivity> | null> {
    const baseActivity = {
      userId,
      repository: event.repo.name,
      repositoryUrl: `https://github.com/${event.repo.name}`,
      createdAt: new Date(event.created_at),
      metadata: {
        eventId: event.id,
        actor: event.actor.login,
      },
    };

    switch (event.type) {
      case 'PushEvent':
        return {
          ...baseActivity,
          type: 'commit',
          title: `Pushed ${event.payload.commits.length} commit(s)`,
          description: event.payload.commits.map((c: any) => c.message).join(', '),
          score: event.payload.commits.length * 10,
          metadata: {
            ...baseActivity.metadata,
            commits: event.payload.commits,
            branch: event.payload.ref.replace('refs/heads/', ''),
          },
        };

      case 'PullRequestEvent':
        return {
          ...baseActivity,
          type: 'pr',
          title: `${event.payload.action} pull request: ${event.payload.pull_request.title}`,
          description: event.payload.pull_request.body,
          score: event.payload.action === 'opened' ? 20 : 10,
          metadata: {
            ...baseActivity.metadata,
            action: event.payload.action,
            pullRequest: event.payload.pull_request,
          },
        };

      case 'IssuesEvent':
        return {
          ...baseActivity,
          type: 'issue',
          title: `${event.payload.action} issue: ${event.payload.issue.title}`,
          description: event.payload.issue.body,
          score: event.payload.action === 'opened' ? 15 : 5,
          metadata: {
            ...baseActivity.metadata,
            action: event.payload.action,
            issue: event.payload.issue,
          },
        };

      case 'ReleaseEvent':
        return {
          ...baseActivity,
          type: 'release',
          title: `${event.payload.action} release: ${event.payload.release.name}`,
          description: event.payload.release.body,
          score: 50,
          metadata: {
            ...baseActivity.metadata,
            action: event.payload.action,
            release: event.payload.release,
          },
        };

      case 'ForkEvent':
        return {
          ...baseActivity,
          type: 'fork',
          title: `Forked ${event.repo.name}`,
          score: 5,
          metadata: {
            ...baseActivity.metadata,
            forkee: event.payload.forkee,
          },
        };

      case 'WatchEvent':
        return {
          ...baseActivity,
          type: 'star',
          title: `Starred ${event.repo.name}`,
          score: 2,
          metadata: {
            ...baseActivity.metadata,
            action: event.payload.action,
          },
        };

      default:
        return null;
    }
  }

  async getUserRepositories(githubUsername: string) {
    try {
      const repos = await this.octokit.repos.listForUser({
        username: githubUsername,
        sort: 'updated',
        per_page: 100,
      });

      return repos.data.map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isPrivate: repo.private,
        createdAt: new Date(repo.created_at || Date.now()),
        updatedAt: new Date(repo.updated_at || Date.now()),
      }));
    } catch (error) {
      logger.error('Error fetching repositories:', error);
      throw error;
    }
  }

  async getRepositoryStats(owner: string, repo: string) {
    try {
      const [repoData, commits, contributors] = await Promise.all([
        this.octokit.repos.get({ owner, repo }),
        this.octokit.repos.listCommits({ owner, repo, per_page: 100 }),
        this.octokit.repos.listContributors({ owner, repo, per_page: 100 }),
      ]);

      return {
        repository: repoData.data,
        commitCount: commits.data.length,
        contributors: contributors.data.length,
        recentCommits: commits.data.slice(0, 10),
      };
    } catch (error) {
      logger.error('Error fetching repository stats:', error);
      throw error;
    }
  }

  async searchIssues(query: string, filters: {
    language?: string;
    label?: string;
    state?: 'open' | 'closed';
    sort?: 'created' | 'updated' | 'comments';
  } = {}) {
    try {
      let searchQuery = query;
      
      if (filters.language) {
        searchQuery += ` language:${filters.language}`;
      }
      
      if (filters.label) {
        searchQuery += ` label:${filters.label}`;
      }
      
      if (filters.state) {
        searchQuery += ` state:${filters.state}`;
      }

      const issues = await this.octokit.search.issuesAndPullRequests({
        q: searchQuery,
        sort: filters.sort || 'updated',
        per_page: 50,
      });

      return issues.data.items.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        url: issue.html_url,
        repository: issue.repository_url.split('/').slice(-2).join('/'),
        labels: issue.labels.map((label: any) => label.name),
        createdAt: new Date(issue.created_at),
        updatedAt: new Date(issue.updated_at),
        author: issue.user?.login || 'Unknown',
        assignees: issue.assignees?.map((assignee: any) => assignee.login) || [],
        comments: issue.comments,
        state: issue.state,
      }));
    } catch (error) {
      logger.error('Error searching issues:', error);
      throw error;
    }
  }

  async getOpenIssuesForRecommendation(userSkills: string[] = [], difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner') {
    try {
      const queries = [
        'is:issue is:open label:"good first issue"',
        'is:issue is:open label:"help wanted"',
        'is:issue is:open label:"beginner"',
        'is:issue is:open label:"easy"',
      ];

      if (userSkills.length > 0) {
        queries.push(`is:issue is:open language:${userSkills.join(' language:')}`);
      }

      const allIssues = [];
      
      for (const query of queries) {
        const issues = await this.searchIssues(query, { state: 'open' });
        allIssues.push(...issues);
      }

      // Remove duplicates and sort by relevance
      const uniqueIssues = allIssues.filter((issue, index, self) =>
        index === self.findIndex(i => i.id === issue.id)
      );

      return uniqueIssues.slice(0, 20);
    } catch (error) {
      logger.error('Error getting open issues for recommendation:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();
