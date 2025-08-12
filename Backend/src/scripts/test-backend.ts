#!/usr/bin/env node

/**
 * DevBoard Backend Test Script
 * Tests the core functionality of the backend server
 */

import axios from 'axios';
import { logger } from '../utils/logger';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const API_URL = `${BASE_URL}/api`;

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration?: number;
}

class BackendTester {
  private results: TestResult[] = [];
  private accessToken: string = '';

  async runAllTests(): Promise<void> {
    logger.info('🧪 Starting DevBoard Backend Tests...');
    
    try {
      // Basic connectivity tests
      await this.testHealthCheck();
      await this.testGraphQLEndpoint();
      
      // Authentication tests
      await this.testUserRegistration();
      await this.testUserLogin();
      await this.testTokenRefresh();
      
      // User management tests
      await this.testUserProfile();
      await this.testUpdateProfile();
      await this.testUpdateSettings();
      
      // Authorization tests
      await this.testProtectedRoutes();
      
      // Error handling tests
      await this.testErrorHandling();
      
      this.printResults();
      
    } catch (error) {
      logger.error('Test suite failed:', error);
      process.exit(1);
    }
  }

  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ name, success: true, duration });
      logger.info(`✅ ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({ 
        name, 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        duration 
      });
      logger.error(`❌ ${name} (${duration}ms):`, error);
    }
  }

  private async testHealthCheck(): Promise<void> {
    await this.runTest('Health Check', async () => {
      const response = await axios.get(`${BASE_URL}/health`);
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Health check returned success: false');
      }
    });
  }

  private async testGraphQLEndpoint(): Promise<void> {
    await this.runTest('GraphQL Endpoint', async () => {
      const query = `
        query {
          __schema {
            types {
              name
            }
          }
        }
      `;
      
      const response = await axios.post(`${BASE_URL}/graphql`, {
        query
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (response.data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
      }
    });
  }

  private async testUserRegistration(): Promise<void> {
    await this.runTest('User Registration', async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!'
      };

      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Registration failed');
      }
      
      if (!response.data.data.tokens.accessToken) {
        throw new Error('No access token received');
      }

      this.accessToken = response.data.data.tokens.accessToken;
    });
  }

  private async testUserLogin(): Promise<void> {
    await this.runTest('User Login', async () => {
      // First create a test user
      const userData = {
        username: `logintest_${Date.now()}`,
        email: `logintest_${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!'
      };

      await axios.post(`${API_URL}/auth/register`, userData);

      // Then test login
      const loginData = {
        email: userData.email,
        password: userData.password
      };

      const response = await axios.post(`${API_URL}/auth/login`, loginData);
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Login failed');
      }
      
      if (!response.data.data.tokens.accessToken) {
        throw new Error('No access token received');
      }
    });
  }

  private async testTokenRefresh(): Promise<void> {
    await this.runTest('Token Refresh', async () => {
      // First create a test user to get tokens
      const userData = {
        username: `refreshtest_${Date.now()}`,
        email: `refreshtest_${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!'
      };

      const registerResponse = await axios.post(`${API_URL}/auth/register`, userData);
      const refreshToken = registerResponse.data.data.tokens.refreshToken;

      // Test token refresh
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken
      });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Token refresh failed');
      }
      
      if (!response.data.data.accessToken) {
        throw new Error('No new access token received');
      }
    });
  }

  private async testUserProfile(): Promise<void> {
    await this.runTest('Get User Profile', async () => {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Get profile failed');
      }
      
      if (!response.data.data.user) {
        throw new Error('No user data received');
      }
    });
  }

  private async testUpdateProfile(): Promise<void> {
    await this.runTest('Update Profile', async () => {
      const updateData = {
        bio: 'Updated test bio',
        location: 'Test City',
        website: 'https://example.com'
      };

      const response = await axios.put(`${API_URL}/users/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Profile update failed');
      }
    });
  }

  private async testUpdateSettings(): Promise<void> {
    await this.runTest('Update Settings', async () => {
      const settingsData = {
        theme: 'dark',
        notifications: {
          email: false,
          push: true
        }
      };

      const response = await axios.put(`${API_URL}/users/settings`, settingsData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Settings update failed');
      }
    });
  }

  private async testProtectedRoutes(): Promise<void> {
    await this.runTest('Protected Routes', async () => {
      // Test without token
      try {
        await axios.get(`${API_URL}/users/profile`);
        throw new Error('Protected route allowed access without token');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Expected behavior
        } else {
          throw error;
        }
      }

      // Test with invalid token
      try {
        await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: 'Bearer invalid-token'
          }
        });
        throw new Error('Protected route allowed access with invalid token');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Expected behavior
        } else {
          throw error;
        }
      }
    });
  }

  private async testErrorHandling(): Promise<void> {
    await this.runTest('Error Handling', async () => {
      // Test validation errors
      try {
        await axios.post(`${API_URL}/auth/register`, {
          username: 'ab', // Too short
          email: 'invalid-email',
          password: '123' // Too weak
        });
        throw new Error('Should have failed validation');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          // Expected behavior
        } else {
          throw error;
        }
      }

      // Test 404 for non-existent endpoint
      try {
        await axios.get(`${API_URL}/non-existent-endpoint`);
        throw new Error('Should have returned 404');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Expected behavior
        } else {
          throw error;
        }
      }
    });
  }

  private printResults(): void {
    logger.info('\n📊 Test Results Summary:');
    logger.info('='.repeat(50));
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration ? `(${result.duration}ms)` : '';
      logger.info(`${status} ${result.name} ${duration}`);
      
      if (!result.success && result.error) {
        logger.info(`   Error: ${result.error}`);
      }
    });
    
    logger.info('='.repeat(50));
    logger.info(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
    logger.info(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      logger.error('❌ Some tests failed!');
      process.exit(1);
    } else {
      logger.info('✅ All tests passed!');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new BackendTester();
  tester.runAllTests().catch(error => {
    logger.error('Test runner failed:', error);
    process.exit(1);
  });
}

export default BackendTester;
