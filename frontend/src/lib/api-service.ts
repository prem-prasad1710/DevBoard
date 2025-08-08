interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface OAuthRequest {
  provider: string;
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    image?: string;
    [key: string]: any;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: string;
  githubUsername?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  joinedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('authToken') || localStorage.getItem('token')
        : null;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // Temporarily return mock data to avoid backend dependency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              id: '1',
              name: credentials.email.split('@')[0],
              email: credentials.email,
              avatar: '',
              provider: 'email',
              joinedAt: new Date().toISOString()
            },
            token: 'mock-jwt-token'
          }
        });
      }, 1000);
    });
    
    // Uncomment this when your backend is ready:
    // return this.request<AuthResponse>('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials),
    // });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    // Temporarily return mock data to avoid backend dependency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              id: '1',
              name: userData.name,
              email: userData.email,
              avatar: '',
              provider: 'email',
              joinedAt: new Date().toISOString()
            },
            token: 'mock-jwt-token'
          }
        });
      }, 1000);
    });
    
    // Uncomment this when your backend is ready:
    // return this.request<AuthResponse>('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify(userData),
    // });
  }

  async oauth(data: OAuthRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/oauth', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // GitHub integration
  async getGitHubRepos(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/integrations/github/repos');
  }

  async getGitHubActivity(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/integrations/github/activity');
  }

  // Projects endpoints
  async getProjects(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/projects');
  }

  async createProject(projectData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export type { User, AuthResponse, LoginRequest, RegisterRequest, OAuthRequest };
