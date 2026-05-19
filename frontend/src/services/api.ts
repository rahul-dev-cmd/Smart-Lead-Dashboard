import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { ApiErrorResponse, ApiItemResponse, AuthResponse } from "../types";
import { sessionStorageService } from "./session";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is required");
}

interface RetriableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = sessionStorageService.readAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<ApiItemResponse<AuthResponse>>(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        sessionStorageService.writeSession(response.data.data.user, response.data.data.accessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${response.data.data.accessToken}`
        };
        return api(originalRequest);
      } catch {
        sessionStorageService.clearSession();
        window.dispatchEvent(new Event("smart-leads-session-expired"));
      }
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.error.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Unexpected request failure";
};
