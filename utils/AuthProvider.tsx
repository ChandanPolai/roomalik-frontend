// utils/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { STORAGE_KEYS } from '../constants/config';
import storageService from '../services/storage/storage.service';

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
        setUser(savedUser);
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

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        token,
        login,
        logout,
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