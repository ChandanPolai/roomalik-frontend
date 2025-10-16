// types/room.types.ts

import { Plot } from './plot.types';

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
  availableFrom?: string;
  availableUntil?: string;
}
