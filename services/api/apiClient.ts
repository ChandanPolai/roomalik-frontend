// services/api/apiClient.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../../constants/config';
import logger from '../logger/logger.service';
import storageService from '../storage/storage.service';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const startTime = Date.now();
        config.metadata = { startTime };
        
        try {
          const token = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            logger.debug('Token added to request headers', { hasToken: true });
          }

          logger.apiRequest(
            config.method?.toUpperCase() || 'UNKNOWN',
            config.url || 'UNKNOWN',
            config.data,
            config.headers
          );

          return config;
        } catch (error) {
          logger.error('Request interceptor error', error, 'ApiClient');
          return config;
        }
      },
      (error) => {
        logger.error('Request error', error, 'ApiClient');
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration = response.config.metadata?.startTime 
          ? Date.now() - response.config.metadata.startTime 
          : undefined;
          
        logger.apiResponse(
          response.status,
          response.config.url || 'UNKNOWN',
          response.data,
          duration
        );
        
        return response;
      },
      async (error: AxiosError) => {
        const duration = error.config?.metadata?.startTime 
          ? Date.now() - error.config.metadata.startTime 
          : undefined;

        logger.apiError(error, error.config?.url, error.config?.method);

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
          logger.authError(new Error('Token expired or invalid'), 'Token Refresh');
          await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          await storageService.removeItem(STORAGE_KEYS.USER_DATA);
          // You can add navigation to login here if needed
        }

        return Promise.reject(error);
      }
    );
  }

  // GET Request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  // POST Request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  // PUT Request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  // PATCH Request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE Request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Get Axios Instance (if needed for advanced usage)
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export default new ApiClient();