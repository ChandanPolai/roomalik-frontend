// types/index.ts

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

// Navigation Types
export type RootStackParamList = {
  'auth/login': undefined;
  'auth/signup': undefined;
  '(tabs)': undefined;
  profile: undefined;
};

// Tab Navigator Types
export type TabParamList = {
  Home: undefined;
  Rooms: undefined;
  Payment: undefined;
  Tenants: undefined;
};

// Auth Context Types
export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
}