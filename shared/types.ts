export interface User {
  id: string;
  username: string;
  email: string;
  githubUsername?: string;
  stackoverflowId?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
  profile: UserProfile;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
    aiNudges: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showActivity: boolean;
    showStats: boolean;
  };
  integrations: {
    github: boolean;
    stackoverflow: boolean;
    reddit: boolean;
    vscode: boolean;
  };
}

export interface UserProfile {
  goals: string[];
  skills: string[];
  interests: string[];
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  focusAreas: string[];
  careerGoals: string[];
}

export interface GitHubActivity {
  id: string;
  userId: string;
  type: 'commit' | 'pr' | 'issue' | 'release' | 'fork' | 'star';
  repository: string;
  repositoryUrl: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface CommitData {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
  };
  url: string;
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: FileChange[];
}

export interface FileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  mergedAt?: Date;
  repository: string;
  url: string;
  labels: string[];
  reviewers: string[];
  commits: number;
  additions: number;
  deletions: number;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author: string;
  assignees: string[];
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  repository: string;
  url: string;
  comments: number;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  fork: boolean;
  url: string;
  homepage?: string;
  language: string;
  languages: Record<string, number>;
  stars: number;
  watchers: number;
  forks: number;
  openIssues: number;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  topics: string[];
  license?: string;
  readmeScore: number;
  hasDocumentation: boolean;
  hasTests: boolean;
  hasCI: boolean;
}

export interface DeveloperJournal {
  id: string;
  userId: string;
  date: Date;
  title: string;
  content: string;
  aiGenerated: boolean;
  activities: GitHubActivity[];
  insights: string[];
  mood?: 'productive' | 'frustrated' | 'learning' | 'excited' | 'tired';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'weekly_summary' | 'recommendation' | 'nudge' | 'skill_gap' | 'project_idea';
  title: string;
  content: string;
  data: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  status: 'planning' | 'in_progress' | 'completed' | 'archived';
  startDate: Date;
  endDate?: Date;
  metrics: {
    stars: number;
    forks: number;
    contributors: number;
    commits: number;
    issues: number;
    pullRequests: number;
  };
  features: string[];
  screenshots: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  template: 'modern' | 'classic' | 'minimal' | 'creative';
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  achievements: string[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  lastUpdated: Date;
  autoSync: boolean;
}

export interface ResumeExperience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string[];
  technologies: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  achievements: string[];
}

export interface ResumeSkill {
  category: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  highlights: string[];
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialUrl?: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  languages: string[];
  timeEstimate: number; // in minutes
  testCases: TestCase[];
  solution?: string;
  hints: string[];
  createdAt: Date;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  solution?: string;
  language?: string;
  timeTaken?: number; // in minutes
  completedAt?: Date;
  createdAt: Date;
}

export interface ActivityStats {
  userId: string;
  date: Date;
  commits: number;
  linesAdded: number;
  linesRemoved: number;
  pullRequests: number;
  issuesOpened: number;
  issuesClosed: number;
  repositories: number;
  languages: Record<string, number>;
  timeSpent: number; // in minutes
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ai_nudge' | 'reminder' | 'achievement' | 'update' | 'recommendation';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'coding' | 'social' | 'learning' | 'productivity';
  requirements: Record<string, any>;
  points: number;
  rare: boolean;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GraphQLContext {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
  dataSources: {
    github: any;
    stackoverflow: any;
    openai: any;
  };
}

export interface CacheData {
  key: string;
  value: any;
  ttl: number;
  createdAt: Date;
}

export interface EventData {
  type: string;
  payload: any;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
