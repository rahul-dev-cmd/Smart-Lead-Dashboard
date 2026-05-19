import { create } from "zustand";
import { authService } from "../services/auth";
import { getApiErrorMessage } from "../services/api";
import { sessionStorageService } from "../services/session";
import type { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isBootstrapping: boolean;
  isSubmitting: boolean;
  error: string | null;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: sessionStorageService.readUser(),
  accessToken: sessionStorageService.readAccessToken(),
  isBootstrapping: true,
  isSubmitting: false,
  error: null,

  setSession: (user, accessToken) => {
    sessionStorageService.writeSession(user, accessToken);
    set({ user, accessToken, error: null });
  },

  clearSession: () => {
    sessionStorageService.clearSession();
    set({ user: null, accessToken: null });
  },

  bootstrap: async () => {
    if (!get().accessToken) {
      set({ isBootstrapping: false });
      return;
    }

    try {
      const user = await authService.me();
      const token = get().accessToken;
      if (token) {
        sessionStorageService.writeSession(user, token);
      }
      set({ user, error: null });
    } catch (error) {
      get().clearSession();
      set({ error: getApiErrorMessage(error) });
    } finally {
      set({ isBootstrapping: false });
    }
  },

  login: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await authService.login(email, password);
      get().setSession(response.user, response.accessToken);
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  register: async (name, email, password, role) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await authService.register(name, email, password, role);
      get().setSession(response.user, response.accessToken);
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      get().clearSession();
    }
  }
}));
