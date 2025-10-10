// services/api/plots.api.ts
import { ApiResponse, CreatePlotData, Plot, UpdatePlotData } from '../../types';
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

  // Create new plot
  async createPlot(plotData: CreatePlotData): Promise<ApiResponse<Plot>> {
    return apiClient.post<ApiResponse<Plot>>('/plots', plotData);
  }

  // Update plot
  async updatePlot(id: string, plotData: UpdatePlotData): Promise<ApiResponse<Plot>> {
    return apiClient.put<ApiResponse<Plot>>(`/plots/${id}`, plotData);
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
