// utils/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { STORAGE_KEYS } from '../constants/config';
import storageService from '../services/storage/storage.service';
import authApi from '../services/api/auth.api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedToken = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = await storageService.getObject<User>(STORAGE_KEYS.USER_DATA);

      if (savedToken) {
        setToken(savedToken);
        
        // Try to fetch fresh profile data from API
        try {
          const profileResponse = await authApi.getProfile();
          const freshUserData = profileResponse.data;
          
          console.log('🔍 Profile API Response:', profileResponse);
          console.log('🔍 Fresh User Data:', freshUserData);
          console.log('🔍 Avatar field:', freshUserData?.avatar);
          
          // Update stored user data with fresh data from API
          await storageService.setObject(STORAGE_KEYS.USER_DATA, freshUserData);
          setUser(freshUserData);
          console.log('✅ Fresh profile data fetched from API');
        } catch (profileError) {
          console.warn('Failed to fetch fresh profile, using cached data:', profileError);
          // Fallback to cached user data if API call fails
          setUser(savedUser);
        }
        
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (authToken: string, userData?: User) => {
    try {
      await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      
      if (userData) {
        await storageService.setObject(STORAGE_KEYS.USER_DATA, userData);
        setUser(userData);
      } else {
        // If no userData provided, fetch fresh profile data
        try {
          const profileResponse = await authApi.getProfile();
          const freshUserData = profileResponse.data;
          
          console.log('🔍 Login Profile API Response:', profileResponse);
          console.log('🔍 Login Fresh User Data:', freshUserData);
          console.log('🔍 Login Avatar field:', freshUserData?.avatar);
          
          await storageService.setObject(STORAGE_KEYS.USER_DATA, freshUserData);
          setUser(freshUserData);
          console.log('✅ Fresh profile data fetched after login');
        } catch (profileError) {
          console.warn('Failed to fetch profile after login:', profileError);
        }
      }

      setToken(authToken);
      setIsLoggedIn(true);
      console.log('✅ User logged in successfully');
    } catch (error) {
      console.error('Login storage error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API first
      try {
        await authApi.logout();
        console.log('✅ Logout API called successfully');
      } catch (apiError) {
        console.warn('Logout API call failed, continuing with local logout:', apiError);
      }
      
      // Clear local storage and state
      await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storageService.removeItem(STORAGE_KEYS.USER_DATA);
      
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await storageService.setObject(STORAGE_KEYS.USER_DATA, userData);
      setUser(userData);
      console.log('✅ User data updated successfully');
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};