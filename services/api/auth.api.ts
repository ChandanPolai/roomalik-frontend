// services/api/auth.api.ts
import apiClient from './apiClient';
import { AuthResponse, LoginCredentials, SignupCredentials } from '../../types';

class AuthApi {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Register new user
   */
  async register(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Don't throw error on logout failure, just log it
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    try {
      const response = await apiClient.get('/auth/profile');
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response?.data) {
      const { error: errorMsg, message } = error.response.data;
      return new Error(errorMsg || message || 'An error occurred');
    }
    
    if (error.message === 'Network Error') {
      return new Error('Network error. Please check your internet connection.');
    }

    return new Error(error.message || 'Something went wrong');
  }
}

export default new AuthApi();