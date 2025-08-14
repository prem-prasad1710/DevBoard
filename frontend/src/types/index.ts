// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  githubUsername?: string;
  stackOverflowUsername?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  personalWebsite?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface PrivacySettings {
  profilePublic: boolean;
  activityPublic: boolean;
  statsPublic: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalActivities: number;
  totalCommits: number;
  learningHours: number;
  productivityScore: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  metadata?: any;
}

// GitHub Types
export interface GitHubProfile {
  id: string;
  username: string;
  avatarUrl: string;
  isConnected: boolean;
  stats: GitHubStats;
}

export interface GitHubStats {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalPullRequests: number;
}

export interface GitHubActivity {
  id: string;
  type: string;
  repository: string;
  branch?: string;
  commitMessage?: string;
  additions?: number;
  deletions?: number;
  createdAt: Date;
  metadata?: any;
}

// Stack Overflow Types
export interface StackOverflowProfile {
  id: string;
  username: string;
  reputation: number;
  isConnected: boolean;
  stats: StackOverflowStats;
}

export interface StackOverflowStats {
  totalQuestions: number;
  totalAnswers: number;
  totalViews: number;
  badgeCounts: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export interface StackOverflowActivity {
  id: string;
  type: string;
  title: string;
  tags: string[];
  score: number;
  viewCount: number;
  answerCount: number;
  createdAt: Date;
  url: string;
}

// Journal Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags: string[];
  learnings: string[];
  challenges: string[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntryInput {
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags: string[];
  learnings: string[];
  challenges: string[];
  achievements: string[];
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  progress: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectInput {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  progress: number;
  startDate: Date;
  endDate?: Date;
}

// Open Issues Types
export interface OpenIssue {
  id: string;
  title: string;
  description: string;
  repository: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  labels: string[];
  createdAt: Date;
  url: string;
  githubUrl: string;
}

// AI Chat Types
export interface AIChat {
  id: string;
  sessionId: string;
  messages: AIMessage[];
  context?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIMessageInput {
  sessionId?: string;
  message: string;
  context?: string;
}

// Code Challenge Types
export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  category: string;
  solution?: string;
  testCases: TestCase[];
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface CodeChallengeResult {
  passed: boolean;
  testResults: TestResult[];
  executionTime: number;
  feedback: string;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

// Resume Types
export interface Resume {
  id: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: ResumeProject[];
  certifications: Certification[];
  languages: Language[];
  createdAt: Date;
  updatedAt: Date;
  uploadedResume?: UploadedFile;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  achievements: string[];
}

export interface Skill {
  category: string;
  items: string[];
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  url?: string;
}

export interface Language {
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface ResumeInput {
  personalInfo: PersonalInfoInput;
  experience: ExperienceInput[];
  education: EducationInput[];
  skills: SkillInput[];
  projects: ResumeProjectInput[];
  certifications: CertificationInput[];
  languages: LanguageInput[];
}

export interface PersonalInfoInput {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface ExperienceInput {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationInput {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  achievements: string[];
}

export interface SkillInput {
  category: string;
  items: string[];
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeProjectInput {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface CertificationInput {
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  url?: string;
}

export interface LanguageInput {
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

// Content Generation Types
export interface BlogPostInput {
  topic: string;
  tone: 'professional' | 'casual' | 'technical' | 'friendly';
  length: 'short' | 'medium' | 'long';
  keywords: string[];
  context?: string;
}

export interface TweetInput {
  topic: string;
  tone: 'professional' | 'casual' | 'humorous' | 'informative';
  hashtags: string[];
  context?: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface UserProfileForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  githubUsername: string;
  stackOverflowUsername: string;
  linkedinUrl: string;
  twitterUrl: string;
  personalWebsite: string;
}

// State Management Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Component Props Types
export interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  value?: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  children?: React.ReactNode;
}

export interface ChartProps {
  data: any[];
  width?: number;
  height?: number;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
