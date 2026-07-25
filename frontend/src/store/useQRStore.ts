import { create } from 'zustand'
import { type QRSettings, defaultSettings } from '../types/qr'

interface QRState {
  settings: QRSettings;
  updateSettings: (newSettings: Partial<QRSettings>) => void;
  resetSettings: () => void;
}

export const useQRStore = create<QRState>((set) => ({
  settings: defaultSettings,
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  resetSettings: () => set({ settings: defaultSettings })
}));
