export const USER_ROLES = ["Admin", "Sales User"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ["Website", "Instagram", "Referral"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type SortOrder = "Latest" | "Oldest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search: string;
  sort: SortOrder;
  page: number;
}

export interface Pagination {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: 10;
}

export interface ApiItemResponse<TData> {
  data: TData;
}

export interface ApiListResponse<TData> {
  data: TData[];
  pagination: Pagination;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "error" | "info";
}
