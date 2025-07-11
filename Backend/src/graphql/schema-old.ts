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
    theme: String!
    notifications: NotificationSettings!
    privacy: PrivacySettings!
    integrations: IntegrationSettings!
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
    experience: String!
    focusAreas: [String!]!
    careerGoals: [String!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type GitHubActivity {
    id: ID!
    userId: ID!
    type: String!
    repository: String!
    repositoryUrl: String!
    title: String!
    description: String
    createdAt: Date!
    updatedAt: Date!
    metadata: JSON
  }

  type CommitData {
    sha: String!
    message: String!
    author: CommitAuthor!
    url: String!
    stats: CommitStats!
    files: [FileChange!]!
  }

  type CommitAuthor {
    name: String!
    email: String!
  }

  type CommitStats {
    additions: Int!
    deletions: Int!
    total: Int!
  }

  type FileChange {
    filename: String!
    status: String!
    additions: Int!
    deletions: Int!
    changes: Int!
    patch: String
  }

  type Repository {
    id: ID!
    name: String!
    fullName: String!
    description: String
    private: Boolean!
    fork: Boolean!
    url: String!
    homepage: String
    language: String
    languages: JSON
    stars: Int!
    watchers: Int!
    forks: Int!
    openIssues: Int!
    size: Int!
    createdAt: Date!
    updatedAt: Date!
    pushedAt: Date!
    topics: [String!]!
    license: String
    readmeScore: Int!
    hasDocumentation: Boolean!
    hasTests: Boolean!
    hasCI: Boolean!
  }

  type DeveloperJournal {
    id: ID!
    userId: ID!
    date: Date!
    title: String!
    content: String!
    aiGenerated: Boolean!
    activities: [GitHubActivity!]!
    insights: [String!]!
    mood: String
    tags: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type AIInsight {
    id: ID!
    userId: ID!
    type: String!
    title: String!
    content: String!
    data: JSON
    priority: String!
    read: Boolean!
    createdAt: Date!
    expiresAt: Date
  }

  type Project {
    id: ID!
    userId: ID!
    name: String!
    description: String!
    githubUrl: String
    liveUrl: String
    technologies: [String!]!
    status: String!
    startDate: Date!
    endDate: Date
    metrics: ProjectMetrics!
    features: [String!]!
    screenshots: [String!]!
    tags: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type ProjectMetrics {
    stars: Int!
    forks: Int!
    contributors: Int!
    commits: Int!
    issues: Int!
    pullRequests: Int!
  }

  type Resume {
    id: ID!
    userId: ID!
    template: String!
    personalInfo: PersonalInfo!
    summary: String!
    experience: [Experience!]!
    education: [Education!]!
    skills: [Skill!]!
    projects: [ResumeProject!]!
    achievements: [String!]!
    certifications: [Certification!]!
    languages: [Language!]!
    lastUpdated: Date!
    autoSync: Boolean!
  }

  type PersonalInfo {
    name: String!
    email: String!
    phone: String
    location: String
    website: String
    linkedin: String
    github: String
  }

  type Experience {
    title: String!
    company: String!
    location: String
    startDate: Date!
    endDate: Date
    current: Boolean!
    description: [String!]!
    technologies: [String!]!
  }

  type Education {
    degree: String!
    institution: String!
    location: String
    startDate: Date!
    endDate: Date
    gpa: String
    achievements: [String!]!
  }

  type Skill {
    category: String!
    skills: [String!]!
    level: String!
  }

  type ResumeProject {
    name: String!
    description: String!
    technologies: [String!]!
    url: String
    github: String
    highlights: [String!]!
  }

  type Certification {
    name: String!
    issuer: String!
    date: Date!
    expiryDate: Date
    credentialUrl: String
  }

  type Language {
    language: String!
    proficiency: String!
  }

  type CodeChallenge {
    id: ID!
    title: String!
    description: String!
    difficulty: String!
    tags: [String!]!
    languages: [String!]!
    timeEstimate: Int!
    testCases: [TestCase!]!
    solution: String
    hints: [String!]!
    createdAt: Date!
  }

  type TestCase {
    input: String!
    expectedOutput: String!
    explanation: String
  }

  type ActivityStats {
    userId: ID!
    date: Date!
    commits: Int!
    linesAdded: Int!
    linesRemoved: Int!
    pullRequests: Int!
    issuesOpened: Int!
    issuesClosed: Int!
    repositories: Int!
    languages: JSON!
    timeSpent: Int!
  }

  type Notification {
    id: ID!
    userId: ID!
    type: String!
    title: String!
    message: String!
    read: Boolean!
    actionUrl: String
    createdAt: Date!
  }

  type Achievement {
    id: ID!
    name: String!
    description: String!
    icon: String!
    category: String!
    requirements: JSON!
    points: Int!
    rare: Boolean!
  }

  type UserAchievement {
    id: ID!
    userId: ID!
    achievementId: ID!
    achievement: Achievement!
    unlockedAt: Date!
    progress: Int!
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!
    
    # GitHub queries
    githubActivity(userId: ID!, limit: Int, offset: Int): [GitHubActivity!]!
    githubRepos(userId: ID!): [Repository!]!
    githubStats(userId: ID!, period: String!): ActivityStats
    
    # Journal queries
    journals(userId: ID!, limit: Int, offset: Int): [DeveloperJournal!]!
    journal(id: ID!): DeveloperJournal
    
    # AI queries
    aiInsights(userId: ID!, type: String, limit: Int): [AIInsight!]!
    
    # Project queries
    projects(userId: ID!): [Project!]!
    project(id: ID!): Project
    
    # Resume queries
    resume(userId: ID!): Resume
    
    # Challenge queries
    codeChallenges(difficulty: String, tags: [String!]): [CodeChallenge!]!
    codeChallenge(id: ID!): CodeChallenge
    
    # Notification queries
    notifications(userId: ID!, read: Boolean): [Notification!]!
    
    # Achievement queries
    achievements: [Achievement!]!
    userAchievements(userId: ID!): [UserAchievement!]!
    
    # Stats queries
    userStats(userId: ID!, period: String!): JSON
    leaderboard(period: String!): [User!]!
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
    
    # GitHub mutations
    syncGitHubData: Boolean!
    connectGitHub(token: String!): Boolean!
    disconnectGitHub: Boolean!
    
    # Journal mutations
    createJournal(input: CreateJournalInput!): DeveloperJournal!
    updateJournal(id: ID!, input: UpdateJournalInput!): DeveloperJournal!
    deleteJournal(id: ID!): Boolean!
    generateAIJournal(date: Date!): DeveloperJournal!
    
    # AI mutations
    generateAIInsight(type: String!, data: JSON): AIInsight!
    markInsightAsRead(id: ID!): AIInsight!
    
    # Project mutations
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    
    # Resume mutations
    generateResume(template: String!): Resume!
    updateResume(input: UpdateResumeInput!): Resume!
    exportResume(format: String!): String!
    
    # Challenge mutations
    startChallenge(challengeId: ID!): Boolean!
    submitChallengeSolution(challengeId: ID!, solution: String!, language: String!): Boolean!
    
    # Notification mutations
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
    
    # Achievement mutations
    checkAchievements(userId: ID!): [UserAchievement!]!
  }

  type Subscription {
    # Real-time updates
    activityUpdated(userId: ID!): GitHubActivity!
    notificationAdded(userId: ID!): Notification!
    achievementUnlocked(userId: ID!): UserAchievement!
    aiInsightGenerated(userId: ID!): AIInsight!
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
    profile: UpdateUserProfileInput
  }

  input UpdateUserProfileInput {
    goals: [String!]
    skills: [String!]
    interests: [String!]
    experience: String
    focusAreas: [String!]
    careerGoals: [String!]
  }

  input UpdateSettingsInput {
    theme: String
    notifications: UpdateNotificationSettingsInput
    privacy: UpdatePrivacySettingsInput
    integrations: UpdateIntegrationSettingsInput
  }

  input UpdateNotificationSettingsInput {
    email: Boolean
    push: Boolean
    dailyDigest: Boolean
    weeklyReport: Boolean
    aiNudges: Boolean
  }

  input UpdatePrivacySettingsInput {
    publicProfile: Boolean
    showActivity: Boolean
    showStats: Boolean
  }

  input UpdateIntegrationSettingsInput {
    github: Boolean
    stackoverflow: Boolean
    reddit: Boolean
    vscode: Boolean
  }

  input CreateJournalInput {
    title: String!
    content: String!
    mood: String
    tags: [String!]
  }

  input UpdateJournalInput {
    title: String
    content: String
    mood: String
    tags: [String!]
  }

  input CreateProjectInput {
    name: String!
    description: String!
    githubUrl: String
    liveUrl: String
    technologies: [String!]!
    status: String!
    startDate: Date!
    features: [String!]
    screenshots: [String!]
    tags: [String!]
  }

  input UpdateProjectInput {
    name: String
    description: String
    githubUrl: String
    liveUrl: String
    technologies: [String!]
    status: String
    endDate: Date
    features: [String!]
    screenshots: [String!]
    tags: [String!]
  }

  input UpdateResumeInput {
    template: String
    personalInfo: PersonalInfoInput
    summary: String
    experience: [ExperienceInput!]
    education: [EducationInput!]
    skills: [SkillInput!]
    projects: [ResumeProjectInput!]
    achievements: [String!]
    certifications: [CertificationInput!]
    languages: [LanguageInput!]
    autoSync: Boolean
  }

  input PersonalInfoInput {
    name: String!
    email: String!
    phone: String
    location: String
    website: String
    linkedin: String
    github: String
  }

  input ExperienceInput {
    title: String!
    company: String!
    location: String
    startDate: Date!
    endDate: Date
    current: Boolean!
    description: [String!]!
    technologies: [String!]!
  }

  input EducationInput {
    degree: String!
    institution: String!
    location: String
    startDate: Date!
    endDate: Date
    gpa: String
    achievements: [String!]!
  }

  input SkillInput {
    category: String!
    skills: [String!]!
    level: String!
  }

  input ResumeProjectInput {
    name: String!
    description: String!
    technologies: [String!]!
    url: String
    github: String
    highlights: [String!]!
  }

  input CertificationInput {
    name: String!
    issuer: String!
    date: Date!
    expiryDate: Date
    credentialUrl: String
  }

  input LanguageInput {
    language: String!
    proficiency: String!
  }
`;
