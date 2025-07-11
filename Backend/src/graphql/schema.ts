import { gql } from 'graphql-tag';

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

  type AuthPayload {
    token: String!
    user: User!
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

  type GitHubRepository {
    id: String!
    name: String!
    fullName: String!
    description: String
    url: String!
    language: String
    stars: Int!
    forks: Int!
    isPrivate: Boolean!
    updatedAt: Date!
  }

  type GitHubStats {
    totalCommits: Int!
    totalPRs: Int!
    totalIssues: Int!
    totalStars: Int!
    languages: [LanguageStats!]!
    period: String!
  }

  type LanguageStats {
    name: String!
    count: Int!
    percentage: Float!
  }

  type OpenIssue {
    id: ID!
    title: String!
    description: String!
    repository: String!
    repositoryUrl: String!
    labels: [String!]!
    difficulty: Difficulty!
    technologies: [String!]!
    url: String!
    createdAt: Date!
    updatedAt: Date!
  }

  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  type StackOverflowActivity {
    id: ID!
    userId: String!
    type: StackOverflowActivityType!
    title: String!
    url: String!
    score: Int!
    tags: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }

  enum StackOverflowActivityType {
    QUESTION
    ANSWER
    COMMENT
  }

  type StackOverflowProfile {
    userId: String!
    reputation: Int!
    badges: StackOverflowBadges!
    questionCount: Int!
    answerCount: Int!
    profileUrl: String!
    topTags: [String!]!
  }

  type StackOverflowBadges {
    gold: Int!
    silver: Int!
    bronze: Int!
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
    IN_PROGRESS
    COMPLETED
    OVERDUE
  }

  type Resume {
    id: ID!
    userId: String!
    personalInfo: PersonalInfo!
    summary: String!
    experience: [WorkExperience!]!
    education: [Education!]!
    skills: [SkillCategory!]!
    projects: [ResumeProject!]!
    certifications: [Certification!]!
    achievements: [Achievement!]!
    customSections: [CustomSection!]!
    template: String!
    isPublic: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type PersonalInfo {
    fullName: String!
    email: String!
    phone: String
    location: String
    website: String
    linkedin: String
    github: String
  }

  type WorkExperience {
    id: String!
    company: String!
    position: String!
    startDate: Date!
    endDate: Date
    description: String!
    technologies: [String!]!
    achievements: [String!]!
    location: String
    isCurrentRole: Boolean!
  }

  type Education {
    id: String!
    institution: String!
    degree: String!
    field: String!
    startDate: Date!
    endDate: Date
    gpa: Float
    honors: [String!]!
    coursework: [String!]!
  }

  type SkillCategory {
    category: String!
    skills: [Skill!]!
  }

  type Skill {
    name: String!
    level: SkillLevel!
    yearsOfExperience: Int
  }

  enum SkillLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  type ResumeProject {
    id: String!
    name: String!
    description: String!
    technologies: [String!]!
    url: String
    github: String
    achievements: [String!]!
  }

  type Certification {
    id: String!
    name: String!
    issuer: String!
    date: Date!
    expiryDate: Date
    url: String
    credentialId: String
  }

  type Achievement {
    id: String!
    title: String!
    description: String!
    date: Date!
    category: String!
  }

  type CustomSection {
    id: String!
    title: String!
    content: String!
    type: CustomSectionType!
  }

  enum CustomSectionType {
    TEXT
    LIST
    LINKS
  }

  type AIChat {
    id: ID!
    userId: String!
    title: String!
    type: ChatType!
    messages: [ChatMessage!]!
    context: JSON!
    createdAt: Date!
    updatedAt: Date!
  }

  enum ChatType {
    GENERAL
    CODE_REVIEW
    DEBUGGING
    LEARNING
    CAREER
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

  type CodeChallenge {
    id: ID!
    title: String!
    description: String!
    difficulty: Difficulty!
    category: String!
    tags: [String!]!
    examples: [ChallengeExample!]!
    constraints: [String!]!
    hints: [String!]!
    solution: String
    testCases: [TestCase!]!
    isPublic: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type ChallengeExample {
    input: String!
    output: String!
    explanation: String
  }

  type TestCase {
    input: String!
    expectedOutput: String!
    isHidden: Boolean!
  }

  type ActivitySummary {
    totalActivities: Int!
    githubActivities: Int!
    stackoverflowActivities: Int!
    journalEntries: Int!
    projectUpdates: Int!
    timeRange: String!
    mostActiveDay: Date
    averageProductivity: Float
    totalScore: Int!
  }

  type ProductivityMetrics {
    focusTime: Float!
    deepWorkSessions: Int!
    distractionEvents: Int!
    codeQuality: Float!
    bugFixRatio: Float!
    featureCompletionRate: Float!
    learningProgress: Float!
    collaborationScore: Float!
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
    week: String!
    summary: String!
    achievements: [String!]!
    challenges: [String!]!
    learnings: [String!]!
    goals: [String!]!
    metrics: WeeklyMetrics!
    recommendations: [String!]!
  }

  type WeeklyMetrics {
    totalActivities: Int!
    codeCommits: Int!
    problemsSolved: Int!
    articlesRead: Int!
    projectsWorked: Int!
    productivity: Float!
    learningTime: Float!
  }

  type LeaderboardEntry {
    user: User!
    rank: Int!
    score: Int!
    activities: Int!
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!

    # GitHub queries
    githubActivity(userId: ID!, limit: Int, offset: Int): [GitHubActivity!]!
    githubRepos(userId: ID!): [GitHubRepository!]!
    githubStats(userId: ID!, period: String): GitHubStats
    openIssues(userId: ID!, technologies: [String!], difficulty: Difficulty, limit: Int): [OpenIssue!]!

    # StackOverflow queries
    stackoverflowActivity(userId: ID!, limit: Int, offset: Int): [StackOverflowActivity!]!
    stackoverflowProfile(userId: ID!): StackOverflowProfile

    # Journal queries
    journals(userId: ID!, limit: Int, offset: Int): [DeveloperJournal!]!
    journal(id: ID!): DeveloperJournal

    # AI queries
    aiInsights(userId: ID!, type: String, limit: Int): LearningInsights!
    aiChats(userId: ID!, limit: Int): [AIChat!]!

    # Project queries
    projects(userId: ID!): [Project!]!
    project(id: ID!): Project

    # Resume queries
    resume(userId: ID!): Resume

    # Challenge queries
    codeChallenges(difficulty: Difficulty, tags: [String!]): [CodeChallenge!]!
    codeChallenge(id: ID!): CodeChallenge

    # Analytics queries
    userStats(userId: ID!, period: String): ActivitySummary!
    productivityMetrics(userId: ID!): ProductivityMetrics!
    weeklyReport(userId: ID!): WeeklyReport!
    leaderboard(period: String): [LeaderboardEntry!]!
  }

  type Mutation {
    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!

    # User mutations
    updateProfile(input: UpdateProfileInput!): User!
    updateSettings(input: UpdateSettingsInput!): User!
    deleteAccount: Boolean!

    # Integration mutations
    syncGitHubData: Boolean!
    connectGitHub(token: String!): Boolean!
    disconnectGitHub: Boolean!
    syncStackOverflowData: Boolean!

    # Journal mutations
    createJournal(input: CreateJournalInput!): DeveloperJournal!
    updateJournal(id: ID!, input: UpdateJournalInput!): DeveloperJournal!
    deleteJournal(id: ID!): Boolean!
    generateAIJournal(prompt: String): String!

    # Project mutations
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!

    # Resume mutations
    createResume(input: CreateResumeInput!): Resume!
    updateResume(input: UpdateResumeInput!): Resume!
    generateResumeSection(section: String!, context: String): String!

    # AI mutations
    createAIChat(input: CreateAIChatInput!): AIChat!
    sendAIMessage(chatId: ID!, message: String!): String!
    generateBlogPost(topic: String!, style: String): String!
    generateTweet(topic: String!, style: String): String!
  }

  # Input types
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    githubUsername: String
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
    date: Date
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
    startDate: Date
    endDate: Date
    estimatedHours: Int
    technologies: [String!]
    tags: [String!]
    goals: [String!]
    challenges: [String!]
    learnings: [String!]
    collaborators: [String!]
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
    collaborators: [String!]
    isPublic: Boolean
  }

  input CreateResumeInput {
    personalInfo: PersonalInfoInput!
    summary: String!
    experience: [WorkExperienceInput!]
    education: [EducationInput!]
    skills: [SkillCategoryInput!]
    projects: [ResumeProjectInput!]
    certifications: [CertificationInput!]
    achievements: [AchievementInput!]
    customSections: [CustomSectionInput!]
    template: String
    isPublic: Boolean
  }

  input UpdateResumeInput {
    personalInfo: PersonalInfoInput
    summary: String
    experience: [WorkExperienceInput!]
    education: [EducationInput!]
    skills: [SkillCategoryInput!]
    projects: [ResumeProjectInput!]
    certifications: [CertificationInput!]
    achievements: [AchievementInput!]
    customSections: [CustomSectionInput!]
    template: String
    isPublic: Boolean
  }

  input PersonalInfoInput {
    fullName: String!
    email: String!
    phone: String
    location: String
    website: String
    linkedin: String
    github: String
  }

  input WorkExperienceInput {
    company: String!
    position: String!
    startDate: Date!
    endDate: Date
    description: String!
    technologies: [String!]
    achievements: [String!]
    location: String
    isCurrentRole: Boolean
  }

  input EducationInput {
    institution: String!
    degree: String!
    field: String!
    startDate: Date!
    endDate: Date
    gpa: Float
    honors: [String!]
    coursework: [String!]
  }

  input SkillCategoryInput {
    category: String!
    skills: [SkillInput!]!
  }

  input SkillInput {
    name: String!
    level: SkillLevel!
    yearsOfExperience: Int
  }

  input ResumeProjectInput {
    name: String!
    description: String!
    technologies: [String!]!
    url: String
    github: String
    achievements: [String!]
  }

  input CertificationInput {
    name: String!
    issuer: String!
    date: Date!
    expiryDate: Date
    url: String
    credentialId: String
  }

  input AchievementInput {
    title: String!
    description: String!
    date: Date!
    category: String!
  }

  input CustomSectionInput {
    title: String!
    content: String!
    type: CustomSectionType!
  }

  input CreateAIChatInput {
    title: String!
    type: ChatType
    context: JSON
  }
`;
