import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date
  scalar JSON

  type User {
    id: ID!
    username: String!
    email: String!
    githubUsername: String
    stackoverflowId: String
    avatarUrl: String
    bio: String
    location: String
    website: String
    company: String
    role: UserRole!
    isActive: Boolean!
    emailVerified: Boolean!
    lastLoginAt: Date
    createdAt: Date!
    updatedAt: Date!
    settings: UserSettings!
    profile: UserProfile!
  }

  enum UserRole {
    USER
    ADMIN
  }

  type UserSettings {
    theme: Theme!
    notifications: NotificationSettings!
    privacy: PrivacySettings!
    integrations: IntegrationSettings!
  }

  enum Theme {
    LIGHT
    DARK
    SYSTEM
  }

  type NotificationSettings {
    email: Boolean!
    push: Boolean!
    dailyDigest: Boolean!
    weeklyReport: Boolean!
    aiNudges: Boolean!
  }

  type PrivacySettings {
    publicProfile: Boolean!
    showActivity: Boolean!
    showStats: Boolean!
  }

  type IntegrationSettings {
    github: Boolean!
    stackoverflow: Boolean!
    reddit: Boolean!
    vscode: Boolean!
  }

  type UserProfile {
    goals: [String!]!
    skills: [String!]!
    interests: [String!]!
    experience: ExperienceLevel!
    focusAreas: [String!]!
    careerGoals: [String!]!
  }

  enum ExperienceLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  type GitHubActivity {
    id: ID!
    userId: String!
    type: GitHubActivityType!
    repository: String!
    repositoryUrl: String!
    title: String!
    description: String
    createdAt: Date!
    updatedAt: Date!
    metadata: JSON
    processed: Boolean!
    score: Int!
  }

  enum GitHubActivityType {
    COMMIT
    PR
    ISSUE
    RELEASE
    FORK
    STAR
  }

  type DeveloperJournal {
    id: ID!
    userId: String!
    date: Date!
    title: String!
    content: String!
    mood: Mood!
    productivity: Int!
    challenges: [String!]!
    achievements: [String!]!
    learnings: [String!]!
    goals: [String!]!
    technologies: [String!]!
    aiGenerated: Boolean!
    aiPrompt: String
    tags: [String!]!
    isPublic: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  enum Mood {
    FRUSTRATED
    CONFUSED
    MOTIVATED
    ACCOMPLISHED
    EXCITED
    TIRED
  }

  type Project {
    id: ID!
    userId: String!
    name: String!
    description: String!
    repository: String
    repositoryUrl: String
    status: ProjectStatus!
    priority: Priority!
    progress: Int!
    startDate: Date!
    endDate: Date
    estimatedHours: Int
    actualHours: Int!
    technologies: [String!]!
    tags: [String!]!
    goals: [String!]!
    challenges: [String!]!
    learnings: [String!]!
    tasks: [ProjectTask!]!
    milestones: [ProjectMilestone!]!
    collaborators: [String!]!
    isPublic: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  enum ProjectStatus {
    PLANNING
    IN_PROGRESS
    COMPLETED
    ON_HOLD
    CANCELLED
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  type ProjectTask {
    id: String!
    title: String!
    description: String
    status: TaskStatus!
    priority: Priority!
    estimatedHours: Int
    actualHours: Int!
    createdAt: Date!
    completedAt: Date
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    COMPLETED
  }

  type ProjectMilestone {
    id: String!
    title: String!
    description: String
    targetDate: Date!
    completedDate: Date
    status: MilestoneStatus!
  }

  enum MilestoneStatus {
    PENDING
    COMPLETED
  }

  type Resume {
    id: ID!
    userId: String!
    name: String!
    isDefault: Boolean!
    template: ResumeTemplate!
    personalInfo: PersonalInfo!
    summary: String!
    experience: [Experience!]!
    education: [Education!]!
    projects: [ResumeProject!]!
    skills: [SkillCategory!]!
    certifications: [Certification!]!
    languages: [Language!]!
    achievements: [Achievement!]!
    customSections: [CustomSection!]!
    aiGenerated: Boolean!
    lastExported: Date
    exportCount: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  enum ResumeTemplate {
    MODERN
    CLASSIC
    MINIMAL
    CREATIVE
  }

  type PersonalInfo {
    fullName: String!
    email: String!
    phone: String
    location: String
    website: String
    linkedin: String
    github: String
    portfolio: String
  }

  type Experience {
    id: String!
    company: String!
    position: String!
    startDate: Date!
    endDate: Date
    current: Boolean!
    description: String!
    achievements: [String!]!
    technologies: [String!]!
  }

  type Education {
    id: String!
    institution: String!
    degree: String!
    field: String!
    startDate: Date!
    endDate: Date
    current: Boolean!
    gpa: String
    description: String
  }

  type ResumeProject {
    id: String!
    name: String!
    description: String!
    technologies: [String!]!
    url: String
    github: String
    achievements: [String!]!
    featured: Boolean!
  }

  type SkillCategory {
    category: String!
    items: [SkillItem!]!
  }

  type SkillItem {
    name: String!
    level: SkillLevel!
  }

  enum SkillLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  type Certification {
    id: String!
    name: String!
    issuer: String!
    date: Date!
    expiryDate: Date
    credentialId: String
    url: String
  }

  type Language {
    name: String!
    proficiency: LanguageProficiency!
  }

  enum LanguageProficiency {
    BASIC
    CONVERSATIONAL
    FLUENT
    NATIVE
  }

  type Achievement {
    id: String!
    title: String!
    description: String!
    date: Date!
    type: AchievementType!
  }

  enum AchievementType {
    AWARD
    RECOGNITION
    PUBLICATION
    COMPETITION
    OTHER
  }

  type CustomSection {
    id: String!
    title: String!
    content: String!
    order: Int!
  }

  type StackOverflowActivity {
    id: ID!
    userId: String!
    stackoverflowId: String!
    type: StackOverflowActivityType!
    title: String!
    content: String
    url: String!
    score: Int!
    tags: [String!]!
    accepted: Boolean!
    createdAt: Date!
    updatedAt: Date!
    metadata: JSON
  }

  enum StackOverflowActivityType {
    QUESTION
    ANSWER
    COMMENT
    BADGE
    REPUTATION
  }

  type OpenIssue {
    id: ID!
    userId: String
    repository: String!
    repositoryUrl: String!
    issueNumber: Int!
    title: String!
    description: String!
    labels: [String!]!
    language: String!
    difficulty: Difficulty!
    estimatedTime: String!
    goodFirstIssue: Boolean!
    helpWanted: Boolean!
    createdAt: Date!
    updatedAt: Date!
    lastChecked: Date!
    isActive: Boolean!
    author: String!
    assignees: [String!]!
    comments: Int!
    reactions: Reactions!
    matchScore: Int
    matchReasons: [String!]
  }

  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  type Reactions {
    thumbsUp: Int!
    thumbsDown: Int!
    laugh: Int!
    hooray: Int!
    confused: Int!
    heart: Int!
    rocket: Int!
    eyes: Int!
  }

  type AIChat {
    id: ID!
    userId: String!
    sessionId: String!
    type: AIChatType!
    title: String!
    messages: [ChatMessage!]!
    context: ChatContext!
    tags: [String!]!
    isBookmarked: Boolean!
    rating: Int
    feedback: String
    createdAt: Date!
    updatedAt: Date!
  }

  enum AIChatType {
    MENTOR
    DEBUG
    CODE_REVIEW
    GENERAL
  }

  type ChatMessage {
    id: String!
    role: MessageRole!
    content: String!
    timestamp: Date!
    metadata: JSON
  }

  enum MessageRole {
    USER
    ASSISTANT
    SYSTEM
  }

  type ChatContext {
    codeSnippet: String
    language: String
    framework: String
    errorMessage: String
    repository: String
    filePath: String
  }

  # Analytics Types
  type ActivitySummary {
    totalActivities: Int!
    activitiesByType: JSON!
    activitiesByRepository: JSON!
    activitiesByLanguage: JSON!
    productivityScore: Float!
    streakDays: Int!
    avgActivitiesPerDay: Float!
    mostActiveDay: String!
    topRepositories: [String!]!
    topLanguages: [String!]!
  }

  type ProductivityMetrics {
    daily: DailyMetrics!
    weekly: WeeklyMetrics!
    monthly: MonthlyMetrics!
  }

  type DailyMetrics {
    commits: Int!
    prs: Int!
    issues: Int!
    codeReviews: Int!
    score: Float!
  }

  type WeeklyMetrics {
    totalCommits: Int!
    totalPRs: Int!
    totalIssues: Int!
    avgDailyScore: Float!
    trend: Trend!
  }

  enum Trend {
    UP
    DOWN
    STABLE
  }

  type MonthlyMetrics {
    totalActivities: Int!
    completedProjects: Int!
    journalEntries: Int!
    avgMood: Float!
    avgProductivity: Float!
  }

  type LearningInsights {
    newTechnologies: [String!]!
    skillProgression: [SkillProgression!]!
    learningGoals: [LearningGoal!]!
    recommendedResources: [RecommendedResource!]!
  }

  type SkillProgression {
    technology: String!
    level: SkillLevel!
    confidence: Float!
    recentUsage: Int!
  }

  type LearningGoal {
    goal: String!
    progress: Float!
    dueDate: Date
    status: GoalStatus!
  }

  enum GoalStatus {
    ON_TRACK
    BEHIND
    COMPLETED
  }

  type RecommendedResource {
    title: String!
    type: ResourceType!
    url: String!
    relevance: Float!
  }

  enum ResourceType {
    COURSE
    BOOK
    TUTORIAL
    DOCUMENTATION
  }

  type WeeklyReport {
    summary: String!
    achievements: [String!]!
    challenges: [String!]!
    recommendations: [String!]!
    metrics: ProductivityMetrics!
  }

  type BlogPost {
    title: String!
    content: String!
    tags: [String!]!
  }

  # Auth Types
  type AuthPayload {
    token: String!
    user: User!
  }

  # Input Types
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    githubUsername: String
    stackoverflowId: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    bio: String
    location: String
    website: String
    company: String
    githubUsername: String
    stackoverflowId: String
    avatarUrl: String
    profile: UserProfileInput
  }

  input UserProfileInput {
    goals: [String!]
    skills: [String!]
    interests: [String!]
    experience: ExperienceLevel
    focusAreas: [String!]
    careerGoals: [String!]
  }

  input UpdateSettingsInput {
    theme: Theme
    notifications: NotificationSettingsInput
    privacy: PrivacySettingsInput
    integrations: IntegrationSettingsInput
  }

  input NotificationSettingsInput {
    email: Boolean
    push: Boolean
    dailyDigest: Boolean
    weeklyReport: Boolean
    aiNudges: Boolean
  }

  input PrivacySettingsInput {
    publicProfile: Boolean
    showActivity: Boolean
    showStats: Boolean
  }

  input IntegrationSettingsInput {
    github: Boolean
    stackoverflow: Boolean
    reddit: Boolean
    vscode: Boolean
  }

  input CreateJournalInput {
    date: Date!
    title: String!
    content: String!
    mood: Mood!
    productivity: Int!
    challenges: [String!]
    achievements: [String!]
    learnings: [String!]
    goals: [String!]
    technologies: [String!]
    tags: [String!]
    isPublic: Boolean
  }

  input UpdateJournalInput {
    title: String
    content: String
    mood: Mood
    productivity: Int
    challenges: [String!]
    achievements: [String!]
    learnings: [String!]
    goals: [String!]
    technologies: [String!]
    tags: [String!]
    isPublic: Boolean
  }

  input CreateProjectInput {
    name: String!
    description: String!
    repository: String
    repositoryUrl: String
    status: ProjectStatus
    priority: Priority
    progress: Int
    startDate: Date!
    endDate: Date
    estimatedHours: Int
    technologies: [String!]
    tags: [String!]
    goals: [String!]
    isPublic: Boolean
  }

  input UpdateProjectInput {
    name: String
    description: String
    repository: String
    repositoryUrl: String
    status: ProjectStatus
    priority: Priority
    progress: Int
    startDate: Date
    endDate: Date
    estimatedHours: Int
    actualHours: Int
    technologies: [String!]
    tags: [String!]
    goals: [String!]
    challenges: [String!]
    learnings: [String!]
    isPublic: Boolean
  }

  input CreateResumeInput {
    name: String!
    template: ResumeTemplate
    personalInfo: PersonalInfoInput!
    summary: String!
  }

  input PersonalInfoInput {
    fullName: String!
    email: String!
    phone: String
    location: String
    website: String
    linkedin: String
    github: String
    portfolio: String
  }

  input UpdateResumeInput {
    name: String
    isDefault: Boolean
    template: ResumeTemplate
    personalInfo: PersonalInfoInput
    summary: String
    experience: [ExperienceInput!]
    education: [EducationInput!]
    projects: [ResumeProjectInput!]
    skills: [SkillCategoryInput!]
    certifications: [CertificationInput!]
    languages: [LanguageInput!]
    achievements: [AchievementInput!]
    customSections: [CustomSectionInput!]
  }

  input ExperienceInput {
    id: String
    company: String!
    position: String!
    startDate: Date!
    endDate: Date
    current: Boolean!
    description: String!
    achievements: [String!]
    technologies: [String!]
  }

  input EducationInput {
    id: String
    institution: String!
    degree: String!
    field: String!
    startDate: Date!
    endDate: Date
    current: Boolean!
    gpa: String
    description: String
  }

  input ResumeProjectInput {
    id: String
    name: String!
    description: String!
    technologies: [String!]
    url: String
    github: String
    achievements: [String!]
    featured: Boolean
  }

  input SkillCategoryInput {
    category: String!
    items: [SkillItemInput!]!
  }

  input SkillItemInput {
    name: String!
    level: SkillLevel!
  }

  input CertificationInput {
    id: String
    name: String!
    issuer: String!
    date: Date!
    expiryDate: Date
    credentialId: String
    url: String
  }

  input LanguageInput {
    name: String!
    proficiency: LanguageProficiency!
  }

  input AchievementInput {
    id: String
    title: String!
    description: String!
    date: Date!
    type: AchievementType!
  }

  input CustomSectionInput {
    id: String
    title: String!
    content: String!
    order: Int!
  }

  input ChatContextInput {
    codeSnippet: String
    language: String
    framework: String
    errorMessage: String
    repository: String
    filePath: String
  }

  enum TimeRange {
    DAY
    WEEK
    MONTH
    YEAR
  }

  enum ContentTone {
    TECHNICAL
    CASUAL
    PROFESSIONAL
  }

  enum ContentLength {
    SHORT
    MEDIUM
    LONG
  }

  enum TweetStyle {
    INFORMATIVE
    HUMOROUS
    INSPIRATIONAL
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!

    # GitHub Activity queries
    githubActivities(limit: Int, offset: Int): [GitHubActivity!]!
    githubActivity(id: ID!): GitHubActivity

    # Journal queries
    journalEntries(limit: Int, offset: Int): [DeveloperJournal!]!
    journalEntry(id: ID!): DeveloperJournal

    # Project queries
    projects(status: ProjectStatus): [Project!]!
    project(id: ID!): Project

    # Resume queries
    resumes: [Resume!]!
    resume(id: ID!): Resume

    # StackOverflow queries
    stackoverflowActivities(limit: Int): [StackOverflowActivity!]!

    # Open Issues queries
    openIssues(difficulty: Difficulty, language: String, limit: Int): [OpenIssue!]!
    recommendedIssues(limit: Int): [OpenIssue!]!

    # AI Chat queries
    aiChats(type: AIChatType, limit: Int): [AIChat!]!
    aiChat(id: ID!): AIChat

    # Analytics queries
    activitySummary(timeRange: TimeRange): ActivitySummary!
    productivityMetrics: ProductivityMetrics!
    learningInsights: LearningInsights!
    weeklyReport: WeeklyReport!
  }

  type Mutation {
    # Authentication mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!

    # User profile mutations
    updateProfile(input: UpdateProfileInput!): User!
    updateSettings(input: UpdateSettingsInput!): User!
    deleteAccount: Boolean!

    # Integration mutations
    syncGitHubActivity(githubUsername: String!): [GitHubActivity!]!
    syncStackOverflowActivity(stackoverflowId: String!): [StackOverflowActivity!]!

    # Journal mutations
    createJournalEntry(input: CreateJournalInput!): DeveloperJournal!
    updateJournalEntry(id: ID!, input: UpdateJournalInput!): DeveloperJournal!
    deleteJournalEntry(id: ID!): Boolean!
    generateAIJournalEntry: DeveloperJournal!

    # Project mutations
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!

    # Resume mutations
    createResume(input: CreateResumeInput!): Resume!
    updateResume(id: ID!, input: UpdateResumeInput!): Resume!
    deleteResume(id: ID!): Boolean!
    generateResumeSection(sectionType: String!, context: JSON): String!

    # AI Chat mutations
    startAIChat(type: AIChatType!, message: String!, context: ChatContextInput): AIChat!

    # Content generation mutations
    generateBlogPost(topic: String!, tone: ContentTone, length: ContentLength): BlogPost!
    generateTweet(topic: String!, style: TweetStyle): [String!]!
  }
`;
