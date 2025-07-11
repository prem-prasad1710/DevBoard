import { gql } from '@apollo/client';

// Dashboard Overview Query
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    hello
    health
    dashboardStats {
      totalActivities
      totalCommits
      learningHours
      productivityScore
    }
    recentActivities {
      id
      type
      description
      createdAt
      metadata
    }
    githubProfile {
      id
      username
      avatarUrl
      isConnected
      stats {
        totalCommits
        totalRepos
        totalStars
        totalPullRequests
      }
    }
    stackOverflowProfile {
      id
      username
      reputation
      isConnected
      stats {
        totalQuestions
        totalAnswers
        totalViews
        badgeCounts
      }
    }
  }
`;

// Authentication Queries
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        avatarUrl
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        avatarUrl
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      token
      user {
        id
        email
        username
        firstName
        lastName
        avatarUrl
      }
    }
  }
`;

// User Profile Query
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    user {
      id
      email
      username
      firstName
      lastName
      bio
      avatarUrl
      githubUsername
      stackOverflowUsername
      linkedinUrl
      twitterUrl
      personalWebsite
      preferences {
        theme
        notifications {
          email
          push
          inApp
        }
        privacy {
          profilePublic
          activityPublic
          statsPublic
        }
      }
      createdAt
      lastActive
    }
  }
`;

// GitHub Activities Query
export const GET_GITHUB_ACTIVITIES = gql`
  query GetGitHubActivities($limit: Int, $offset: Int) {
    githubActivities(limit: $limit, offset: $offset) {
      id
      type
      repository
      branch
      commitMessage
      additions
      deletions
      createdAt
      metadata
    }
  }
`;

// Stack Overflow Activities Query
export const GET_STACKOVERFLOW_ACTIVITIES = gql`
  query GetStackOverflowActivities($limit: Int, $offset: Int) {
    stackOverflowActivities(limit: $limit, offset: $offset) {
      id
      type
      title
      tags
      score
      viewCount
      answerCount
      createdAt
      url
    }
  }
`;

// Developer Journal Entries Query
export const GET_JOURNAL_ENTRIES = gql`
  query GetJournalEntries($limit: Int, $offset: Int) {
    journalEntries(limit: $limit, offset: $offset) {
      id
      title
      content
      mood
      tags
      learnings
      challenges
      achievements
      createdAt
      updatedAt
    }
  }
`;

// Projects Query
export const GET_PROJECTS = gql`
  query GetProjects($limit: Int, $offset: Int) {
    projects(limit: $limit, offset: $offset) {
      id
      name
      description
      status
      priority
      technologies
      githubUrl
      liveUrl
      progress
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

// Open Issues Query
export const GET_OPEN_ISSUES = gql`
  query GetOpenIssues($limit: Int, $offset: Int) {
    openIssues(limit: $limit, offset: $offset) {
      id
      title
      description
      repository
      language
      difficulty
      labels
      createdAt
      url
      githubUrl
    }
  }
`;

// AI Chat History Query
export const GET_AI_CHAT_HISTORY = gql`
  query GetAIChatHistory($limit: Int, $offset: Int) {
    aiChatHistory(limit: $limit, offset: $offset) {
      id
      sessionId
      messages {
        role
        content
        timestamp
      }
      context
      createdAt
      updatedAt
    }
  }
`;

// Code Challenges Query
export const GET_CODE_CHALLENGES = gql`
  query GetCodeChallenges($limit: Int, $offset: Int) {
    codeChallenges(limit: $limit, offset: $offset) {
      id
      title
      description
      difficulty
      language
      category
      solution
      testCases
      completed
      completedAt
      createdAt
    }
  }
`;

// Resume Query
export const GET_RESUME = gql`
  query GetResume {
    resume {
      id
      personalInfo {
        fullName
        email
        phone
        location
        website
        linkedin
        github
        summary
      }
      experience {
        id
        company
        position
        startDate
        endDate
        current
        description
        achievements
        technologies
      }
      education {
        id
        institution
        degree
        field
        startDate
        endDate
        gpa
        achievements
      }
      skills {
        category
        items
        proficiencyLevel
      }
      projects {
        id
        name
        description
        technologies
        url
        githubUrl
        highlights
      }
      certifications {
        id
        name
        issuer
        date
        expiryDate
        url
      }
      languages {
        language
        proficiency
      }
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const CONNECT_GITHUB = gql`
  mutation ConnectGitHub($code: String!) {
    connectGitHub(code: $code) {
      success
      message
      user {
        id
        githubUsername
      }
    }
  }
`;

export const CONNECT_STACKOVERFLOW = gql`
  mutation ConnectStackOverflow($accessToken: String!) {
    connectStackOverflow(accessToken: $accessToken) {
      success
      message
      user {
        id
        stackOverflowUsername
      }
    }
  }
`;

export const CREATE_JOURNAL_ENTRY = gql`
  mutation CreateJournalEntry($input: JournalEntryInput!) {
    createJournalEntry(input: $input) {
      id
      title
      content
      mood
      tags
      learnings
      challenges
      achievements
      createdAt
    }
  }
`;

export const UPDATE_JOURNAL_ENTRY = gql`
  mutation UpdateJournalEntry($id: ID!, $input: JournalEntryInput!) {
    updateJournalEntry(id: $id, input: $input) {
      id
      title
      content
      mood
      tags
      learnings
      challenges
      achievements
      updatedAt
    }
  }
`;

export const DELETE_JOURNAL_ENTRY = gql`
  mutation DeleteJournalEntry($id: ID!) {
    deleteJournalEntry(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      status
      priority
      technologies
      githubUrl
      liveUrl
      progress
      startDate
      endDate
      createdAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      status
      priority
      technologies
      githubUrl
      liveUrl
      progress
      startDate
      endDate
      updatedAt
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      message
    }
  }
`;

export const SEND_AI_MESSAGE = gql`
  mutation SendAIMessage($input: AIMessageInput!) {
    sendAIMessage(input: $input) {
      id
      sessionId
      messages {
        role
        content
        timestamp
      }
      response
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      email
      username
      firstName
      lastName
      bio
      avatarUrl
      githubUsername
      stackOverflowUsername
      linkedinUrl
      twitterUrl
      personalWebsite
      updatedAt
    }
  }
`;

export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($input: UserPreferencesInput!) {
    updateUserPreferences(input: $input) {
      theme
      notifications {
        email
        push
        inApp
      }
      privacy {
        profilePublic
        activityPublic
        statsPublic
      }
    }
  }
`;

export const CREATE_RESUME = gql`
  mutation CreateResume($input: ResumeInput!) {
    createResume(input: $input) {
      id
      personalInfo {
        fullName
        email
        phone
        location
        website
        linkedin
        github
        summary
      }
      createdAt
    }
  }
`;

export const UPDATE_RESUME = gql`
  mutation UpdateResume($input: ResumeInput!) {
    updateResume(input: $input) {
      id
      personalInfo {
        fullName
        email
        phone
        location
        website
        linkedin
        github
        summary
      }
      updatedAt
    }
  }
`;

export const SUBMIT_CODE_CHALLENGE = gql`
  mutation SubmitCodeChallenge($id: ID!, $solution: String!) {
    submitCodeChallenge(id: $id, solution: $solution) {
      id
      solution
      completed
      completedAt
      result {
        passed
        testResults
        executionTime
        feedback
      }
    }
  }
`;

export const SYNC_GITHUB_DATA = gql`
  mutation SyncGitHubData {
    syncGitHubData {
      success
      message
      activitiesAdded
      lastSyncAt
    }
  }
`;

export const SYNC_STACKOVERFLOW_DATA = gql`
  mutation SyncStackOverflowData {
    syncStackOverflowData {
      success
      message
      activitiesAdded
      lastSyncAt
    }
  }
`;

export const GENERATE_RESUME_PDF = gql`
  mutation GenerateResumePDF($template: String!) {
    generateResumePDF(template: $template) {
      success
      url
      filename
    }
  }
`;

export const GENERATE_BLOG_POST = gql`
  mutation GenerateBlogPost($input: BlogPostInput!) {
    generateBlogPost(input: $input) {
      title
      content
      tags
      publishReady
      suggestions
    }
  }
`;

export const GENERATE_TWEET = gql`
  mutation GenerateTweet($input: TweetInput!) {
    generateTweet(input: $input) {
      content
      hashtags
      characterCount
      suggestions
    }
  }
`;
