import { create } from 'zustand';

export interface ToastItem {
  message: string;
  icon: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastState {
  toast: ToastItem | null;
  setToast: (toast: ToastItem | null) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  setToast: (toast) => set({ toast }),
}));
