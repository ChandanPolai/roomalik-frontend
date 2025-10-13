// services/api/plots.api.ts
import { ApiResponse, Plot } from '../../types';
import apiClient from './apiClient';

class PlotsApiService {
  // Get all plots
  async getAllPlots(): Promise<ApiResponse<Plot[]>> {
    return apiClient.get<ApiResponse<Plot[]>>('/plots');
  }

  // Get plot by ID
  async getPlotById(id: string): Promise<ApiResponse<Plot>> {
    return apiClient.get<ApiResponse<Plot>>(`/plots/${id}`);
  }

  // Create new plot (multipart)
  async createPlot(formData: FormData): Promise<ApiResponse<Plot>> {
    return apiClient.post<ApiResponse<Plot>>('/plots', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Update plot (multipart)
  async updatePlot(id: string, formData: FormData): Promise<ApiResponse<Plot>> {
    return apiClient.put<ApiResponse<Plot>>(`/plots/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Delete plot
  async deletePlot(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/plots/${id}`);
  }

  // Upload plot images
  async uploadPlotImages(id: string, images: FormData): Promise<ApiResponse<Plot['images']>> {
    return apiClient.post<ApiResponse<Plot['images']>>(`/plots/${id}/images`, images, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new PlotsApiService();
