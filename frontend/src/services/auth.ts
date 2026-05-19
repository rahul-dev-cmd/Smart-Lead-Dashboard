import { api } from "./api";
import type { ApiItemResponse, AuthResponse, UserRole } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiItemResponse<AuthResponse>>("/auth/login", { email, password });
    return response.data.data;
  },

  async register(name: string, email: string, password: string, role: UserRole): Promise<AuthResponse> {
    const response = await api.post<ApiItemResponse<AuthResponse>>("/auth/register", { name, email, password, role });
    return response.data.data;
  },

  async me(): Promise<AuthResponse["user"]> {
    const response = await api.get<ApiItemResponse<{ user: AuthResponse["user"] }>>("/auth/me");
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
};
