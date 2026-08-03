import { create } from 'zustand';

interface ToastState {
  toast: { message: string; icon: string } | null;
  setToast: (toast: { message: string; icon: string } | null) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  setToast: (toast) => set({ toast }),
}));
