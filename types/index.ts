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
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar?: string;
    address?: any;
    token: string;
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

// Plot Types
export interface PlotAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface PlotImage {
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface PlotLocation {
  lat?: number;
  lng?: number;
}

export interface Plot {
  _id: string;
  name: string;
  address: PlotAddress;
  totalArea: number;
  constructionYear?: number;
  images: PlotImage[];
  facilities: string[];
  location?: PlotLocation;
  ownerId: string;
  createdAt: string;
}

export interface CreatePlotData {
  name: string;
  address: PlotAddress;
  totalArea: number;
  constructionYear?: number;
  facilities?: string[];
  location?: PlotLocation;
}

export interface UpdatePlotData {
  name?: string;
  address?: Partial<PlotAddress>;
  totalArea?: number;
  constructionYear?: number;
  facilities?: string[];
  location?: PlotLocation;
}

export interface PlotFormData {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  totalArea: string;
  constructionYear: string;
  facilities: string[];
  location?: PlotLocation;
}

// Room Types
export type RoomFurnished = 'furnished' | 'semi-furnished' | 'unfurnished';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface RoomImage {
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface Room {
  _id: string;
  number: string;
  size: number;
  type: string;
  rent: number;
  deposit: number;
  furnished: RoomFurnished;
  floor?: number;
  facing?: string;
  images: RoomImage[];
  amenities: string[];
  status: RoomStatus;
  plotId: string | Plot; // can be populated
  createdAt: string;
}

export interface CreateRoomData {
  number: string;
  size: number;
  type: string;
  rent: number;
  deposit: number;
  furnished: RoomFurnished;
  floor?: number;
  facing?: string;
  amenities?: string[];
  status?: RoomStatus;
  plotId: string;
}

export interface UpdateRoomData {
  number?: string;
  size?: number;
  type?: string;
  rent?: number;
  deposit?: number;
  furnished?: RoomFurnished;
  floor?: number;
  facing?: string;
  amenities?: string[];
  status?: RoomStatus;
}

export interface RoomFormData {
  number: string;
  size: string;
  type: string;
  rent: string;
  deposit: string;
  furnished: RoomFurnished;
  floor: string;
  facing: string;
  amenities: string[];
  status: RoomStatus;
  plotId: string;
}