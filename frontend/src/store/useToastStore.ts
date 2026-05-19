import { create } from "zustand";
import type { ToastMessage } from "../types";

interface ToastState {
  toasts: ToastMessage[];
  pushToast: (message: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const createId = (): string => crypto.randomUUID();

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (message) => {
    const toast: ToastMessage = {
      id: createId(),
      ...message
    };
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
    window.setTimeout(() => {
      useToastStore.getState().removeToast(toast.id);
    }, 4200);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}));
