import { api } from "./api";
import type { ApiItemResponse, ApiListResponse, Lead, LeadFilters, LeadFormValues, LeadStatus } from "../types";

const buildParams = (filters: LeadFilters): URLSearchParams => {
  const params = new URLSearchParams({
    sort: filters.sort,
    page: String(filters.page)
  });

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.source) {
    params.set("source", filters.source);
  }

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  return params;
};

export const leadsService = {
  async list(filters: LeadFilters): Promise<ApiListResponse<Lead>> {
    const response = await api.get<ApiListResponse<Lead>>(`/leads?${buildParams(filters).toString()}`);
    return response.data;
  },

  async get(id: string): Promise<Lead> {
    const response = await api.get<ApiItemResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  async create(values: LeadFormValues): Promise<Lead> {
    const response = await api.post<ApiItemResponse<Lead>>("/leads", values);
    return response.data.data;
  },

  async update(id: string, values: Partial<LeadFormValues>): Promise<Lead> {
    const response = await api.patch<ApiItemResponse<Lead>>(`/leads/${id}`, values);
    return response.data.data;
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.update(id, { status });
  },

  async remove(id: string): Promise<Lead> {
    const response = await api.delete<ApiItemResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  async exportCsv(filters: LeadFilters): Promise<Blob> {
    const response = await api.get<Blob>(`/leads/export?${buildParams(filters).toString()}`, {
      responseType: "blob"
    });
    return response.data;
  }
};
