import { create } from 'zustand'
import { type QRSettings, defaultSettings } from '../types/qr'

interface QRState {
  settings: QRSettings;
  updateSettings: (newSettings: Partial<QRSettings>) => void;
  resetSettings: () => void;
  applyTemplate: (templateSettings: Partial<QRSettings>) => void;
}

export const useQRStore = create<QRState>((set) => ({
  settings: defaultSettings,
  updateSettings: (newSettings) => set((state) => {
    const updated = { ...newSettings };
    if (updated.canvas_radius !== undefined && updated.canvas_border_radius === undefined) {
      updated.canvas_border_radius = updated.canvas_radius;
    } else if (updated.canvas_border_radius !== undefined && updated.canvas_radius === undefined) {
      updated.canvas_radius = updated.canvas_border_radius;
    }
    return {
      settings: { ...state.settings, ...updated }
    };
  }),
  resetSettings: () => set({ settings: defaultSettings }),
  applyTemplate: (templateSettings) => set((state) => {
    const merged = { ...templateSettings };
    if (merged.canvas_border_radius !== undefined && merged.canvas_radius === undefined) {
      merged.canvas_radius = merged.canvas_border_radius;
    } else if (merged.canvas_radius !== undefined && merged.canvas_border_radius === undefined) {
      merged.canvas_border_radius = merged.canvas_radius;
    }
    return {
      settings: {
        ...defaultSettings,
        contentType: state.settings.contentType,
        contentData: state.settings.contentData,
        ...merged
      }
    };
  })
}));
