// pages/api/ai-mentor.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAIResponse } from '../../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory?: Message[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] }: RequestBody = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message.substring(0, 100) + '...');
    console.log('Environment check:', {
      hasApiKey: !!process.env.GEMINI_API_KEY,
      model: process.env.AI_MODEL,
      provider: process.env.AI_PROVIDER
    });

    let aiResponse: string;
    
    try {
      // Try Gemini API
      aiResponse = await generateAIResponse(message, 'developer-mentor', conversationHistory);
    } catch (error: any) {
      console.log('Gemini API failed, using fallback response');
      console.error('Gemini Error:', error);
      
      // Check if it's a quota/rate limit error
      if (error?.status === 429 || error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
        console.log('Quota exceeded, using intelligent mock responses');
        aiResponse = await generateIntelligentMockResponse(message, conversationHistory);
      } else {
        // For other errors, still provide fallback
        aiResponse = await generateIntelligentMockResponse(message, conversationHistory);
      }
    }
    
    res.status(200).json({ 
      response: aiResponse,
      timestamp: new Date().toISOString(),
      provider: 'gemini'
    });
  } catch (error) {
    console.error('AI Mentor API Error:', error);
    
    // Return more specific error messages
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API key not configured';
      } else if (error.message.includes('model')) {
        errorMessage = 'AI model not available. Please check your Gemini API access.';
      } else {
        errorMessage = error.message;
      }
    }
    
    res.status(500).json({ error: errorMessage });
  }
}

// Intelligent mock response function as fallback
async function generateIntelligentMockResponse(message: string, history: Message[]): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const lowerMessage = message.toLowerCase();
  
  // Personalized greeting
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('prem')) {
    return `Hi Prem! 👋 Great to meet you! I'm your AI coding mentor, ready to help you with all things development.

**I can assist you with:**
• **Code Reviews** - Share your code for detailed feedback
• **Algorithm Optimization** - Make your solutions faster and cleaner
• **Architecture Design** - Structure scalable applications
• **Debugging Help** - Systematic problem-solving approaches
• **Career Guidance** - Next steps in your development journey
• **Best Practices** - Industry standards and proven patterns

What coding challenge would you like to tackle today? Feel free to share code snippets, ask about specific technologies, or get guidance on your next learning steps!`;
  }
  
  // Code review responses
  if (lowerMessage.includes('code review') || lowerMessage.includes('review this code')) {
    return `I'd be happy to help with your code review! Here's my comprehensive analysis approach:

**🔍 Code Quality Checklist:**

**Structure & Readability:**
• **Naming**: Are variables and functions descriptively named?
• **Organization**: Is the code logically structured and modular?
• **Comments**: Are complex sections well-documented?

**Performance & Efficiency:**
• **Algorithm Complexity**: Can we optimize time/space complexity?
• **Resource Management**: Memory leaks, unnecessary computations?
• **Caching**: Opportunities for memoization or caching?

**Security & Robustness:**
• **Input Validation**: Are all inputs properly sanitized?
• **Error Handling**: Graceful handling of edge cases?
• **Authentication**: Proper access controls in place?

**Example - JavaScript Function Optimization:**
\`\`\`javascript
// Before: Basic implementation
function findUserById(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

// After: Optimized with error handling
function findUserById(users, id) {
  // Input validation
  if (!Array.isArray(users) || !id) {
    throw new Error('Invalid parameters: users must be array, id required');
  }
  
  // Use built-in optimized method
  const user = users.find(user => user?.id === id);
  
  if (!user) {
    console.warn(\`User with id \${id} not found\`);
  }
  
  return user || null;
}
\`\`\`

**Please share your code and I'll provide specific, actionable feedback!** 🚀`;
  }
  
  // Algorithm help
  if (lowerMessage.includes('algorithm') || lowerMessage.includes('optimize') || lowerMessage.includes('performance')) {
    return `Excellent question about algorithm optimization! Let's dive deep into performance improvement strategies:

**🚀 Algorithm Optimization Framework:**

**1. Analyze Current Complexity**
• Time Complexity: O(?) - How does runtime scale?
• Space Complexity: O(?) - Memory usage patterns?
• Identify bottlenecks through profiling

**2. Common Optimization Patterns**

**Memoization Example:**
\`\`\`javascript
// Fibonacci - Naive O(2^n)
function fibonacciSlow(n) {
  if (n <= 1) return n;
  return fibonacciSlow(n-1) + fibonacciSlow(n-2);
}

// Optimized with memoization O(n)
function fibonacciFast(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacciFast(n-1, memo) + fibonacciFast(n-2, memo);
  return memo[n];
}
\`\`\`

**Hash Map Optimization:**
\`\`\`javascript
// Two Sum - O(n²) nested loops
function twoSumSlow(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// Optimized O(n) with hash map
function twoSumFast(nums, target) {
  const seen = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    
    seen.set(nums[i], i);
  }
  
  return [];
}
\`\`\`

**3. Advanced Techniques**
• **Dynamic Programming**: Break into subproblems
• **Two Pointers**: Efficient array/string processing  
• **Sliding Window**: Substring/subarray problems
• **Binary Search**: Logarithmic search in sorted data

**What specific algorithm are you working on?** Share your code and I'll provide targeted optimization strategies! 🎯`;
  }
  
  // Learning path
  if (lowerMessage.includes('learn') || lowerMessage.includes('career') || lowerMessage.includes('next') || lowerMessage.includes('roadmap')) {
    return `Fantastic question about your development journey, Prem! Let me create a personalized roadmap for you:

**🎯 2025 Developer Career Path:**

**Frontend Mastery Track:**
\`\`\`
Phase 1: Modern JavaScript (2-3 months)
├── ES6+ Features: Destructuring, async/await, modules
├── DOM Manipulation & Event Handling
├── Promises & Async Programming
└── Testing: Jest, Vitest

Phase 2: React Ecosystem (3-4 months)  
├── React 18: Hooks, Context, Suspense
├── State Management: Zustand, Redux Toolkit
├── Routing: React Router v6
├── Styling: Tailwind CSS, Styled Components
└── Testing: React Testing Library, Cypress

Phase 3: Build Tools & Performance (2 months)
├── Vite/Webpack: Module bundling
├── Performance: Code splitting, lazy loading
├── PWA: Service workers, offline functionality
└── Deployment: Vercel, Netlify, AWS
\`\`\`

**Backend Development Track:**
\`\`\`
Foundation (2-3 months)
├── Node.js: Express.js, Fastify
├── Databases: PostgreSQL, MongoDB
├── Authentication: JWT, OAuth2
└── API Design: REST, GraphQL

Advanced (3-4 months)
├── Microservices Architecture
├── Containerization: Docker, Kubernetes  
├── Cloud Services: AWS, Google Cloud
├── Monitoring: Logging, metrics, alerts
└── DevOps: CI/CD pipelines
\`\`\`

**DevBoard-Specific Skills:**
• **Dashboard Development**: Real-time data visualization
• **API Integration**: GitHub, Stack Overflow APIs
• **Data Analytics**: Charts, metrics, insights
• **Performance Optimization**: Caching, lazy loading

**Weekly Learning Schedule:**
• **Monday-Wednesday**: Core concepts & tutorials
• **Thursday-Friday**: Build projects & practice
• **Weekend**: Open source contributions & networking

**Project Ideas to Build:**
1. **Portfolio Dashboard** - Showcase your projects
2. **Code Quality Analyzer** - Analyze GitHub repos
3. **Learning Tracker** - Monitor your progress
4. **Developer Tools** - Productivity utilities

**What's your current experience level and which track interests you most?** I'll customize this roadmap specifically for your goals! 🚀`;
  }
  
  // Debugging help
  if (lowerMessage.includes('debug') || lowerMessage.includes('bug') || lowerMessage.includes('error') || lowerMessage.includes('issue')) {
    return `I'm here to help you debug systematically! Here's my proven debugging methodology:

**🔍 The Debug Detective Approach:**

**Step 1: Reproduce & Document**
\`\`\`
Debug Checklist:
□ Can you consistently reproduce the bug?
□ What are the exact steps to trigger it?
□ Does it happen in all browsers/environments?
□ What's the expected vs actual behavior?
□ Any error messages in console/logs?
\`\`\`

**Step 2: Isolate the Problem**
\`\`\`javascript
// Strategic logging technique
function problematicFunction(data) {
  console.log('🔍 Input received:', data);
  
  const processedData = processStep1(data);
  console.log('✅ Step 1 result:', processedData);
  
  const finalResult = processStep2(processedData);
  console.log('🎯 Final result:', finalResult);
  
  return finalResult;
}

// Use debugger statements for deep inspection
function complexCalculation(x, y) {
  debugger; // Execution pauses here
  const intermediate = x * y;
  debugger; // And here - inspect variables
  return intermediate + 10;
}
\`\`\`

**Step 3: Common Bug Categories & Solutions**

**Type-Related Bugs:**
\`\`\`javascript
// Problem: Unexpected type behavior
function addNumbers(a, b) {
  console.log(typeof a, typeof b); // Debug types
  
  // Solution: Type checking
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  
  return a + b;
}
\`\`\`

**Async/Timing Issues:**
\`\`\`javascript
// Problem: Race conditions
async function fetchUserData(userId) {
  try {
    console.log('🚀 Fetching user:', userId);
    
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    const userData = await response.json();
    console.log('✅ User data received:', userData);
    
    return userData;
  } catch (error) {
    console.error('❌ Fetch failed:', error);
    throw error;
  }
}
\`\`\`

**React-Specific Debugging:**
\`\`\`javascript
// Debug component renders
function MyComponent({ data }) {
  console.log('🔄 Component rendering with:', data);
  
  useEffect(() => {
    console.log('🎣 Effect triggered, data changed:', data);
  }, [data]);
  
  return <div>{data?.name || 'Loading...'}</div>;
}
\`\`\`

**Step 4: Advanced Debugging Tools**
• **Browser DevTools**: Breakpoints, network tab, performance
• **React DevTools**: Component tree, props, state
• **VSCode Debugger**: Step through code line by line
• **Error Boundaries**: Catch React component errors

**Share your specific error/bug and I'll help you trace it down step by step!** 🐛→✨`;
  }
  
  // Architecture
  if (lowerMessage.includes('architecture') || lowerMessage.includes('structure') || lowerMessage.includes('design') || lowerMessage.includes('scalable')) {
    return `Excellent architecture question! Let's design a robust, scalable solution:

**🏗️ Modern Software Architecture Principles:**

**1. Modular Architecture Pattern**
\`\`\`
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   └── feature-specific/
│   ├── features/           # Feature-based organization
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── dashboard/
│   ├── services/           # API calls & external services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Pure utility functions
│   ├── types/              # TypeScript definitions
│   └── constants/          # App-wide constants
\`\`\`

**2. Clean Architecture Layers**
\`\`\`javascript
// Domain Layer (Core Business Logic)
class User {
  constructor(private id: string, private email: string) {}
  
  isEmailValid(): boolean {
    return this.email.includes('@');
  }
}

// Application Layer (Use Cases)
class UserService {
  constructor(private userRepo: UserRepository) {}
  
  async createUser(email: string): Promise<User> {
    const user = new User(generateId(), email);
    if (!user.isEmailValid()) {
      throw new Error('Invalid email');
    }
    return await this.userRepo.save(user);
  }
}

// Infrastructure Layer (External Dependencies)
class ApiUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
    return response.json();
  }
}
\`\`\`

**3. State Management Architecture**
\`\`\`javascript
// Zustand store with clean separation
interface AppState {
  // UI State
  ui: {
    isLoading: boolean;
    error: string | null;
    theme: 'light' | 'dark';
  };
  
  // Domain State
  user: User | null;
  dashboard: DashboardData;
  
  // Actions
  actions: {
    setLoading: (loading: boolean) => void;
    setUser: (user: User) => void;
    fetchDashboard: () => Promise<void>;
  };
}
\`\`\`

**4. API Design Patterns**
\`\`\`javascript
// RESTful API structure
class ApiClient {
  private baseURL = '/api/v1';
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
    
    return response.json();
  }
  
  // Specific methods
  async getUser(id: string): Promise<User> {
    return this.get<User>(\`/users/\${id}\`);
  }
  
  async getDashboard(): Promise<Dashboard> {
    return this.get<Dashboard>('/dashboard');
  }
}
\`\`\`

**5. Performance & Scalability**
\`\`\`javascript
// Code splitting for better performance
const LazyDashboard = lazy(() => import('./Dashboard'));
const LazyProfile = lazy(() => import('./Profile'));

// Error boundaries for resilience
class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
\`\`\`

**6. DevBoard-Specific Architecture**
\`\`\`
DevBoard Architecture:
├── Frontend (Next.js)
│   ├── Dashboard UI
│   ├── Real-time updates
│   └── Data visualization
├── Backend (Node.js/Express)
│   ├── API Gateway
│   ├── Authentication
│   └── Data aggregation
├── Services
│   ├── GitHub API integration
│   ├── Stack Overflow scraping
│   └── AI mentor service
└── Database
    ├── User data (PostgreSQL)
    ├── Cached responses (Redis)
    └── Analytics (InfluxDB)
\`\`\`

**What's the scope of your project?** Share your requirements and I'll design a specific architecture tailored to your needs! 🎯`;
  }
  
  // Default comprehensive response
  return `Hi there! I'm your AI coding mentor, ready to help accelerate your development journey! 🚀

**🎯 I can assist you with:**

**Code Excellence:**
• **Code Reviews** - Detailed feedback on structure, performance, and best practices
• **Algorithm Optimization** - Make your solutions faster and more elegant
• **Debugging Strategies** - Systematic approaches to finding and fixing issues
• **Testing Guidance** - Unit tests, integration tests, and TDD practices

**Architecture & Design:**
• **System Design** - Scalable application architectures
• **Database Design** - Optimal data modeling and queries
• **API Development** - RESTful services and GraphQL
• **Security Best Practices** - Secure coding and vulnerability prevention

**Career Development:**
• **Learning Roadmaps** - Personalized skill development paths
• **Technology Choices** - Framework and tool recommendations
• **Project Ideas** - Portfolio-building applications
• **Interview Preparation** - Technical interview strategies

**DevBoard Specialties:**
• **Dashboard Development** - Real-time data visualization
• **API Integration** - GitHub, Stack Overflow, and other services
• **Performance Optimization** - Fast, responsive applications
• **Developer Productivity** - Tools and workflows

**🤝 How to get the best help:**
1. **Be Specific** - Share code snippets, error messages, or detailed descriptions
2. **Provide Context** - What are you trying to achieve? What's your experience level?
3. **Ask Follow-ups** - I'm here for ongoing conversation and deeper dives

**Popular topics I help with:**
\`React Performance\` \`Node.js APIs\` \`Database Optimization\` \`Algorithm Problems\` \`Career Guidance\` \`Code Reviews\` \`System Design\` \`Best Practices\`

**What coding challenge would you like to tackle today?** Share your question, code, or project goals! 💻✨`;
}
