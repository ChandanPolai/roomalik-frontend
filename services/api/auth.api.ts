// services/api/auth.api.ts
import { AuthResponse, LoginCredentials, SignupCredentials, ResetPasswordCredentials } from '../../types';
import logger from '../logger/logger.service';
import apiClient from './apiClient';

class AuthApi {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      logger.authAction('Login attempt', { email: credentials.email });
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      logger.authAction('Login successful', { email: credentials.email });
      return response;
    } catch (error: any) {
      logger.authError(error, 'Login');
      throw this.handleError(error);
    }
  }

  /**
   * Register new user
   */
  async register(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      logger.authAction('Registration attempt', { email: credentials.email });
      const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
      logger.authAction('Registration successful', { email: credentials.email });
      return response;
    } catch (error: any) {
      logger.authError(error, 'Registration');
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      logger.authAction('Logout attempt');
      await apiClient.post('/auth/logout');
      logger.authAction('Logout successful');
    } catch (error: any) {
      logger.authError(error, 'Logout');
      // Don't throw error on logout failure, just log it
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    try {
      logger.authAction('Get profile attempt');
      const response = await apiClient.get('/auth/profile');
      logger.authAction('Get profile successful');
      return response;
    } catch (error: any) {
      logger.authError(error, 'Get Profile');
      throw this.handleError(error);
    }
  }


  /**
 * Reset password
 */
async resetPassword(credentials: ResetPasswordCredentials): Promise<AuthResponse> {
  try {
    logger.authAction('Reset password attempt', { email: credentials.email });
    const response = await apiClient.post<AuthResponse>('/auth/reset-password', credentials);
    logger.authAction('Reset password successful', { email: credentials.email });
    return response;
  } catch (error: any) {
    logger.authError(error, 'Reset Password');
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