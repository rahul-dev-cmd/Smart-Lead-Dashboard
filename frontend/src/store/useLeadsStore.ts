import { create } from "zustand";
import { getApiErrorMessage } from "../services/api";
import { leadsService } from "../services/leads";
import type { Lead, LeadFilters, LeadFormValues, LeadStatus, Pagination } from "../types";
import { useToastStore } from "./useToastStore";

const defaultPagination: Pagination = {
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10
};

const defaultFilters: LeadFilters = {
  search: "",
  sort: "Latest",
  page: 1
};

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  filters: LeadFilters;
  pagination: Pagination;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  setFilters: (filters: Partial<LeadFilters>) => void;
  fetchLeads: () => Promise<void>;
  fetchLead: (id: string) => Promise<void>;
  createLead: (values: LeadFormValues) => Promise<void>;
  updateLead: (id: string, values: Partial<LeadFormValues>) => Promise<void>;
  updateStatusOptimistic: (id: string, status: LeadStatus) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  exportCsv: () => Promise<Blob>;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  selectedLead: null,
  filters: defaultFilters,
  pagination: defaultPagination,
  isLoading: false,
  isMutating: false,
  error: null,

  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
        page: filters.page ?? 1
      }
    })),

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await leadsService.list(get().filters);
      set({ leads: response.data, pagination: response.pagination });
    } catch (error) {
      set({ error: getApiErrorMessage(error), leads: [], pagination: defaultPagination });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLead: async (id) => {
    set({ isLoading: true, error: null, selectedLead: null });
    try {
      const lead = await leadsService.get(id);
      set({ selectedLead: lead });
    } catch (error) {
      set({ error: getApiErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  createLead: async (values) => {
    set({ isMutating: true, error: null });
    try {
      await leadsService.create(values);
      useToastStore.getState().pushToast({ title: "Lead created", variant: "success" });
      await get().fetchLeads();
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      useToastStore.getState().pushToast({ title: "Create failed", description: message, variant: "error" });
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  updateLead: async (id, values) => {
    set({ isMutating: true, error: null });
    try {
      const updated = await leadsService.update(id, values);
      set((state) => ({
        leads: state.leads.map((lead) => (lead.id === id ? updated : lead)),
        selectedLead: state.selectedLead?.id === id ? updated : state.selectedLead
      }));
      useToastStore.getState().pushToast({ title: "Lead updated", variant: "success" });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      useToastStore.getState().pushToast({ title: "Update failed", description: message, variant: "error" });
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  updateStatusOptimistic: async (id, status) => {
    const previousLeads = get().leads;
    const previousSelected = get().selectedLead;
    const timestamp = new Date().toISOString();

    set((state) => ({
      leads: state.leads.map((lead) => (lead.id === id ? { ...lead, status, updatedAt: timestamp } : lead)),
      selectedLead: state.selectedLead?.id === id ? { ...state.selectedLead, status, updatedAt: timestamp } : state.selectedLead
    }));

    try {
      const updated = await leadsService.updateStatus(id, status);
      set((state) => ({
        leads: state.leads.map((lead) => (lead.id === id ? updated : lead)),
        selectedLead: state.selectedLead?.id === id ? updated : state.selectedLead
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ leads: previousLeads, selectedLead: previousSelected, error: message });
      useToastStore.getState().pushToast({ title: "Status reverted", description: message, variant: "error" });
      throw error;
    }
  },

  deleteLead: async (id) => {
    set({ isMutating: true, error: null });
    try {
      await leadsService.remove(id);
      set((state) => ({ leads: state.leads.filter((lead) => lead.id !== id) }));
      useToastStore.getState().pushToast({ title: "Lead deleted", variant: "success" });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      useToastStore.getState().pushToast({ title: "Delete failed", description: message, variant: "error" });
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  exportCsv: async () => leadsService.exportCsv(get().filters)
}));
