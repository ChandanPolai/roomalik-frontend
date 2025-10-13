// services/api/rooms.api.ts
import { ApiResponse, Room } from '../../types';
import apiClient from './apiClient';

class RoomsApiService {
  async getAllRooms(params?: { status?: string; plotId?: string }): Promise<ApiResponse<Room[]>> {
    return apiClient.get<ApiResponse<Room[]>>('/rooms', { params });
  }

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    return apiClient.get<ApiResponse<Room>>(`/rooms/${id}`);
  }

  async createRoom(formData: FormData): Promise<ApiResponse<Room>> {
    return apiClient.post<ApiResponse<Room>>('/rooms', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async updateRoom(id: string, formData: FormData): Promise<ApiResponse<Room>> {
    return apiClient.put<ApiResponse<Room>>(`/rooms/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteRoom(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/rooms/${id}`);
  }
}

export default new RoomsApiService();


