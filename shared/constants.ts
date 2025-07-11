export const API_ENDPOINTS = {
  GITHUB: {
    BASE_URL: 'https://api.github.com',
    USER: '/user',
    REPOS: '/user/repos',
    COMMITS: '/repos/{owner}/{repo}/commits',
    ISSUES: '/repos/{owner}/{repo}/issues',
    PULLS: '/repos/{owner}/{repo}/pulls',
    EVENTS: '/users/{username}/events',
    ACTIVITY: '/users/{username}/events/public',
    SEARCH_REPOS: '/search/repositories',
    SEARCH_ISSUES: '/search/issues',
    RATE_LIMIT: '/rate_limit',
  },
  STACKOVERFLOW: {
    BASE_URL: 'https://api.stackexchange.com/2.3',
    USERS: '/users',
    QUESTIONS: '/questions',
    ANSWERS: '/answers',
    TAGS: '/tags',
    SEARCH: '/search',
  },
  REDDIT: {
    BASE_URL: 'https://www.reddit.com',
    SEARCH: '/r/{subreddit}/search.json',
    HOT: '/r/{subreddit}/hot.json',
    NEW: '/r/{subreddit}/new.json',
  },
  OPENAI: {
    BASE_URL: 'https://api.openai.com/v1',
    CHAT: '/chat/completions',
    COMPLETIONS: '/completions',
    EMBEDDINGS: '/embeddings',
    MODELS: '/models',
  },
} as const;

export const CACHE_KEYS = {
  GITHUB_USER: 'github:user:',
  GITHUB_REPOS: 'github:repos:',
  GITHUB_COMMITS: 'github:commits:',
  GITHUB_ACTIVITY: 'github:activity:',
  STACKOVERFLOW_USER: 'stackoverflow:user:',
  STACKOVERFLOW_QUESTIONS: 'stackoverflow:questions:',
  USER_STATS: 'user:stats:',
  AI_INSIGHTS: 'ai:insights:',
  DAILY_JOURNAL: 'journal:daily:',
  WEEKLY_SUMMARY: 'summary:weekly:',
} as const;

export const CACHE_TTL = {
  GITHUB_USER: 3600, // 1 hour
  GITHUB_REPOS: 1800, // 30 minutes
  GITHUB_COMMITS: 900, // 15 minutes
  GITHUB_ACTIVITY: 600, // 10 minutes
  STACKOVERFLOW_DATA: 3600, // 1 hour
  USER_STATS: 300, // 5 minutes
  AI_INSIGHTS: 7200, // 2 hours
  DAILY_JOURNAL: 86400, // 24 hours
  WEEKLY_SUMMARY: 604800, // 7 days
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
} as const;

export const RATE_LIMITS = {
  GITHUB_API: 5000, // requests per hour
  STACKOVERFLOW_API: 10000, // requests per day
  OPENAI_API: 100, // requests per minute
  DEFAULT_API: 1000, // requests per hour
} as const;

export const AI_PROMPTS = {
  WEEKLY_SUMMARY: `
    Analyze the following GitHub activity data and create a personalized weekly summary:
    
    Data: {data}
    
    Create a summary that includes:
    1. Total commits and lines of code changed
    2. Languages used and their distribution
    3. Repositories worked on
    4. Key accomplishments and patterns
    5. Areas for improvement
    6. Motivational message
    
    Keep it concise, positive, and actionable.
  `,
  
  DAILY_JOURNAL: `
    Generate a daily developer journal entry based on the following activity:
    
    GitHub Activity: {githubActivity}
    StackOverflow Activity: {stackoverflowActivity}
    VS Code Activity: {vscodeActivity}
    
    Create a journal entry that:
    1. Summarizes the day's coding activities
    2. Highlights key achievements or learning moments
    3. Mentions challenges faced and solutions found
    4. Reflects on progress toward goals
    5. Sets intentions for tomorrow
    
    Write in first person, keep it personal and reflective.
  `,
  
  CAREER_ADVICE: `
    Based on the user's profile and recent activity, provide personalized career advice:
    
    Profile: {profile}
    Recent Activity: {activity}
    Goals: {goals}
    
    Provide advice on:
    1. Skills to develop based on current trajectory
    2. Projects to build for portfolio
    3. Open source contributions to consider
    4. Learning resources and next steps
    5. Networking and community involvement
    
    Keep advice practical and actionable.
  `,
  
  ISSUE_RECOMMENDATION: `
    Recommend open source issues for the user to work on:
    
    User Skills: {skills}
    Languages: {languages}
    Experience Level: {experience}
    Interests: {interests}
    
    Find issues that:
    1. Match their skill level
    2. Use technologies they know
    3. Align with their interests
    4. Are good for learning and growth
    5. Have clear descriptions and are beginner-friendly
    
    Explain why each issue is a good fit.
  `,
  
  BLOG_POST_IDEA: `
    Generate blog post ideas based on recent coding activity:
    
    Recent Commits: {commits}
    Technologies Used: {technologies}
    Problems Solved: {problems}
    
    Suggest blog post ideas that:
    1. Share knowledge gained
    2. Explain solutions to common problems
    3. Review tools and technologies
    4. Provide tutorials or guides
    5. Reflect on learning journey
    
    Include catchy titles and brief outlines.
  `,
  
  RESUME_IMPROVEMENT: `
    Analyze the user's resume and suggest improvements:
    
    Current Resume: {resume}
    GitHub Profile: {github}
    Skills: {skills}
    Projects: {projects}
    
    Suggest improvements for:
    1. Technical skills section
    2. Project descriptions
    3. Experience highlights
    4. Achievement quantification
    5. Keywords and formatting
    
    Provide specific, actionable suggestions.
  `,
} as const;

export const ACHIEVEMENT_CATEGORIES = {
  CODING: 'coding',
  SOCIAL: 'social',
  LEARNING: 'learning',
  PRODUCTIVITY: 'productivity',
} as const;

export const ACHIEVEMENTS = [
  {
    id: 'first-commit',
    name: 'First Steps',
    description: 'Made your first commit',
    icon: '🎯',
    category: ACHIEVEMENT_CATEGORIES.CODING,
    requirements: { commits: 1 },
    points: 10,
    rare: false,
  },
  {
    id: 'commit-streak-7',
    name: 'Week Warrior',
    description: 'Committed code for 7 days straight',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.CODING,
    requirements: { commitStreak: 7 },
    points: 50,
    rare: false,
  },
  {
    id: 'commit-streak-30',
    name: 'Monthly Master',
    description: 'Committed code for 30 days straight',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.CODING,
    requirements: { commitStreak: 30 },
    points: 200,
    rare: true,
  },
  {
    id: 'lines-1000',
    name: 'Code Crusher',
    description: 'Wrote 1,000 lines of code',
    icon: '💻',
    category: ACHIEVEMENT_CATEGORIES.CODING,
    requirements: { linesOfCode: 1000 },
    points: 30,
    rare: false,
  },
  {
    id: 'lines-10000',
    name: 'Code Master',
    description: 'Wrote 10,000 lines of code',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.CODING,
    requirements: { linesOfCode: 10000 },
    points: 100,
    rare: true,
  },
  {
    id: 'first-pr',
    name: 'Collaborator',
    description: 'Created your first pull request',
    icon: '🤝',
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    requirements: { pullRequests: 1 },
    points: 20,
    rare: false,
  },
  {
    id: 'first-issue',
    name: 'Problem Solver',
    description: 'Opened your first issue',
    icon: '🐛',
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    requirements: { issues: 1 },
    points: 15,
    rare: false,
  },
  {
    id: 'languages-5',
    name: 'Polyglot',
    description: 'Used 5 different programming languages',
    icon: '🌐',
    category: ACHIEVEMENT_CATEGORIES.LEARNING,
    requirements: { languages: 5 },
    points: 40,
    rare: false,
  },
  {
    id: 'languages-10',
    name: 'Language Master',
    description: 'Used 10 different programming languages',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.LEARNING,
    requirements: { languages: 10 },
    points: 100,
    rare: true,
  },
  {
    id: 'daily-coder',
    name: 'Daily Coder',
    description: 'Coded every day this week',
    icon: '📅',
    category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
    requirements: { dailyCoding: 7 },
    points: 25,
    rare: false,
  },
] as const;

export const NOTIFICATION_TYPES = {
  AI_NUDGE: 'ai_nudge',
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  UPDATE: 'update',
  RECOMMENDATION: 'recommendation',
} as const;

export const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'Scala',
  'R',
  'MATLAB',
  'Perl',
  'Haskell',
  'Erlang',
  'Clojure',
  'F#',
  'OCaml',
  'Lua',
  'Shell',
  'PowerShell',
  'SQL',
  'HTML',
  'CSS',
  'SCSS',
  'Less',
  'Stylus',
] as const;

export const FRAMEWORKS_AND_LIBRARIES = [
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'Express.js',
  'Node.js',
  'Django',
  'Flask',
  'FastAPI',
  'Spring Boot',
  'Laravel',
  'Ruby on Rails',
  'ASP.NET',
  'Gin',
  'Fiber',
  'Actix',
  'Rocket',
  'jQuery',
  'Bootstrap',
  'Tailwind CSS',
  'Material-UI',
  'Chakra UI',
  'Ant Design',
  'Semantic UI',
  'Bulma',
  'Foundation',
  'Materialize',
] as const;

export const DATABASES = [
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'Microsoft SQL Server',
  'Oracle Database',
  'CouchDB',
  'DynamoDB',
  'Firebase Firestore',
  'Cassandra',
  'Neo4j',
  'InfluxDB',
  'TimescaleDB',
  'MariaDB',
] as const;

export const CLOUD_PLATFORMS = [
  'AWS',
  'Azure',
  'Google Cloud',
  'Heroku',
  'Vercel',
  'Netlify',
  'Digital Ocean',
  'Linode',
  'Railway',
  'Render',
  'PlanetScale',
  'Supabase',
  'Firebase',
  'Cloudflare',
] as const;

export const TOOLS_AND_TECHNOLOGIES = [
  'Git',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitHub Actions',
  'GitLab CI',
  'CircleCI',
  'Travis CI',
  'Webpack',
  'Vite',
  'Rollup',
  'Parcel',
  'Babel',
  'ESLint',
  'Prettier',
  'Jest',
  'Cypress',
  'Playwright',
  'Storybook',
  'Figma',
  'Sketch',
  'Adobe XD',
  'Postman',
  'Insomnia',
  'VS Code',
  'IntelliJ IDEA',
  'WebStorm',
  'Sublime Text',
  'Atom',
  'Vim',
  'Emacs',
] as const;

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const RESUME_TEMPLATES = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  MINIMAL: 'minimal',
  CREATIVE: 'creative',
} as const;

export const ACTIVITY_PERIODS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
] as const;

export const DEFAULT_SETTINGS = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    dailyDigest: true,
    weeklyReport: true,
    aiNudges: true,
  },
  privacy: {
    publicProfile: false,
    showActivity: true,
    showStats: true,
  },
  integrations: {
    github: false,
    stackoverflow: false,
    reddit: false,
    vscode: false,
  },
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INVALID_TOKEN: 'Invalid or expired token',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  DUPLICATE_ENTRY: 'Duplicate entry',
  EXTERNAL_API_ERROR: 'External API error',
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_SYNCED: 'Data synchronized successfully',
  SETTINGS_UPDATED: 'Settings updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  RESUME_GENERATED: 'Resume generated successfully',
  JOURNAL_CREATED: 'Journal entry created successfully',
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  GITHUB_USERNAME: /^[a-zA-Z0-9]([a-zA-Z0-9]|-){0,38}$/,
  GITHUB_REPO_URL: /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'md'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
  CODE: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb'],
} as const;

export const MAX_FILE_SIZES = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  RESUME: 2 * 1024 * 1024, // 2MB
} as const;
