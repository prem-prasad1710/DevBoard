// GitHub API service for fetching real-time data
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  size: number;
  default_branch: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  repository?: {
    name: string;
    full_name: string;
  };
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  payload: any;
  created_at: string;
}

export interface GitHubStats {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalFollowers: number;
  totalFollowing: number;
  publicRepos: number;
  totalPullRequests: number;
}

class GitHubAPIService {
  private baseURL = 'https://api.github.com';

  async fetchWithAuth(endpoint: string, accessToken: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevBoard-App'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserProfile(accessToken: string): Promise<GitHubUser> {
    return this.fetchWithAuth('/user', accessToken);
  }

  async getUserRepositories(accessToken: string, page = 1, per_page = 100): Promise<GitHubRepository[]> {
    return this.fetchWithAuth(`/user/repos?page=${page}&per_page=${per_page}&sort=updated&type=all`, accessToken);
  }

  async getAllUserRepositories(accessToken: string): Promise<GitHubRepository[]> {
    let allRepos: GitHubRepository[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const repos = await this.getUserRepositories(accessToken, page, 100);
      allRepos = [...allRepos, ...repos];
      hasMore = repos.length === 100;
      page++;
    }

    return allRepos;
  }

  async getUserEvents(accessToken: string, username: string, page = 1, per_page = 100): Promise<GitHubEvent[]> {
    return this.fetchWithAuth(`/users/${username}/events?page=${page}&per_page=${per_page}`, accessToken);
  }

  async getRepositoryCommits(accessToken: string, owner: string, repo: string, page = 1, per_page = 100): Promise<GitHubCommit[]> {
    return this.fetchWithAuth(`/repos/${owner}/${repo}/commits?page=${page}&per_page=${per_page}`, accessToken);
  }

  async getUserStats(accessToken: string, username: string): Promise<GitHubStats> {
    try {
      // Get user profile
      const user = await this.getUserProfile(accessToken);
      
      // Get all repositories
      const repos = await this.getAllUserRepositories(accessToken);
      
      // Calculate stats from repositories
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      // Get recent events to estimate commits and PRs
      const events = await this.getUserEvents(accessToken, username, 1, 300);
      
      const pushEvents = events.filter(event => event.type === 'PushEvent');
      const prEvents = events.filter(event => event.type === 'PullRequestEvent');
      
      // Estimate total commits from recent push events
      let totalCommits = 0;
      for (const event of pushEvents) {
        if (event.payload && event.payload.commits) {
          totalCommits += event.payload.commits.length;
        }
      }

      return {
        totalCommits,
        totalRepos: user.public_repos,
        totalStars,
        totalForks,
        totalFollowers: user.followers,
        totalFollowing: user.following,
        publicRepos: user.public_repos,
        totalPullRequests: prEvents.length
      };
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      throw error;
    }
  }

  async getRecentActivity(accessToken: string, username: string): Promise<any[]> {
    try {
      const events = await this.getUserEvents(accessToken, username, 1, 50);
      
      return events.map(event => ({
        id: event.id,
        type: this.mapEventType(event.type),
        repository: event.repo.name,
        createdAt: new Date(event.created_at),
        commitMessage: this.extractCommitMessage(event),
        branch: this.extractBranch(event),
        additions: this.extractAdditions(event),
        deletions: this.extractDeletions(event),
        metadata: this.extractMetadata(event)
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  private mapEventType(githubEventType: string): string {
    switch (githubEventType) {
      case 'PushEvent':
        return 'push';
      case 'PullRequestEvent':
        return 'pull_request';
      case 'CreateEvent':
        return 'create';
      case 'ForkEvent':
        return 'fork';
      case 'WatchEvent':
        return 'star';
      case 'IssuesEvent':
        return 'issue';
      default:
        return 'activity';
    }
  }

  private extractCommitMessage(event: GitHubEvent): string | null {
    if (event.type === 'PushEvent' && event.payload.commits && event.payload.commits.length > 0) {
      return event.payload.commits[0].message;
    }
    if (event.type === 'PullRequestEvent') {
      return event.payload.pull_request?.title || null;
    }
    return null;
  }

  private extractBranch(event: GitHubEvent): string | null {
    if (event.type === 'PushEvent') {
      const ref = event.payload.ref;
      return ref ? ref.replace('refs/heads/', '') : null;
    }
    return null;
  }

  private extractAdditions(event: GitHubEvent): number | undefined {
    if (event.type === 'PushEvent' && event.payload.commits) {
      // GitHub doesn't provide additions/deletions in push events
      // This would need to be fetched separately for each commit
      return undefined;
    }
    return undefined;
  }

  private extractDeletions(event: GitHubEvent): number | undefined {
    if (event.type === 'PushEvent' && event.payload.commits) {
      // GitHub doesn't provide additions/deletions in push events
      return undefined;
    }
    return undefined;
  }

  private extractMetadata(event: GitHubEvent): any {
    const metadata: any = {};
    
    if (event.type === 'PushEvent') {
      metadata.commitsCount = event.payload.commits?.length || 0;
      metadata.ref = event.payload.ref;
    }
    
    if (event.type === 'PullRequestEvent') {
      metadata.action = event.payload.action;
      metadata.status = event.payload.pull_request?.state;
      metadata.number = event.payload.pull_request?.number;
    }
    
    if (event.type === 'CreateEvent') {
      metadata.refType = event.payload.ref_type;
      metadata.ref = event.payload.ref;
    }
    
    return metadata;
  }
}

export const githubAPI = new GitHubAPIService();
