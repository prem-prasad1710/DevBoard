import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';
import { apiService, type User as ApiUser, type AuthResponse } from '@/lib/api-service';

interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'email' | 'github' | 'google';
  githubUsername?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  joinedAt?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: 'github' | 'google') => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/error'];

  const isLoading = status === 'loading';

  useEffect(() => {
    if (session?.user) {
      // Convert NextAuth session to our User format
      const userData: User = {
        id: (session.user as any).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || '',
        provider: ((session as any).provider as 'email' | 'github' | 'google') || 'email',
        githubUsername: (session.user as any).username,
        bio: (session.user as any).bio,
        location: (session.user as any).location,
        website: (session.user as any).website,
        skills: (session.user as any).skills || [],
        joinedAt: (session.user as any).joinedAt || new Date().toISOString(),
      };
      setUser(userData);
      setToken((session as any).accessToken || 'session-token');
    } else {
      setUser(null);
      setToken(null);
    }
  }, [session]);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(router.pathname);
      
      if (!user && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        router.push('/auth/login');
      } else if (user && isPublicRoute) {
        // User is authenticated but on auth page, redirect to home
        router.push('/');
      }
    }
  }, [user, isLoading, router.pathname]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithProvider = async (provider: 'github' | 'google'): Promise<void> => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('OAuth login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await apiService.register({ name, email, password });
      
      if (response.error) {
        throw new Error(response.error);
      }

      // After successful registration, log in the user
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still sign out even if API call fails
      await signOut({ callbackUrl: '/auth/login' });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const response = await apiService.updateProfile(userData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data && user) {
        const updatedUser: User = { 
          ...user, 
          ...response.data,
          provider: (response.data.provider as 'email' | 'github' | 'google') || user.provider
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    loginWithProvider,
    register,
    logout,
    updateUser
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
          </div>
          <p className="text-white text-lg">Loading DevBoard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Wrapper component that includes SessionProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};