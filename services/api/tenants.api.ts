// services/api/tenants.api.ts
import { ApiResponse, Tenant } from '../../types';
import apiClient from './apiClient';

class TenantsApiService {
  async getAllTenants(): Promise<ApiResponse<Tenant[]>> {
    return apiClient.get<ApiResponse<Tenant[]>>('/tenants');
  }

  async getTenantById(id: string): Promise<ApiResponse<Tenant>> {
    return apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`);
  }

  async createTenant(formData: FormData): Promise<ApiResponse<Tenant>> {
    return apiClient.post<ApiResponse<Tenant>>('/tenants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async updateTenant(id: string, formData: FormData): Promise<ApiResponse<Tenant>> {
    return apiClient.put<ApiResponse<Tenant>>(`/tenants/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteTenant(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/tenants/${id}`);
  }
}

export default new TenantsApiService();
