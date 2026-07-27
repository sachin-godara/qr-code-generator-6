import { create } from 'zustand'
import { type QRSettings, defaultSettings } from '../types/qr'

interface QRState {
  settings: QRSettings;
  history: QRSettings[];
  historyIndex: number;
  updateSettings: (newSettings: Partial<QRSettings>) => void;
  resetSettings: () => void;
  applyTemplate: (templateSettings: Partial<QRSettings>) => void;
  undo: () => void;
  redo: () => void;
}

export const useQRStore = create<QRState>((set) => ({
  settings: defaultSettings,
  history: [defaultSettings],
  historyIndex: 0,

  updateSettings: (newSettings) => set((state) => {
    const updated = { ...newSettings };
    if (updated.canvas_radius !== undefined && updated.canvas_border_radius === undefined) {
      updated.canvas_border_radius = updated.canvas_radius;
    } else if (updated.canvas_border_radius !== undefined && updated.canvas_radius === undefined) {
      updated.canvas_radius = updated.canvas_border_radius;
    }
    const nextSettings = { ...state.settings, ...updated };

    // Check if contentType or contentData changed
    const contentChanged = nextSettings.contentType !== state.settings.contentType ||
                          nextSettings.contentData !== state.settings.contentData;

    let currentHistory = state.history;
    if (contentChanged) {
      currentHistory = state.history.map(item => ({
        ...item,
        contentType: nextSettings.contentType,
        contentData: nextSettings.contentData
      }));
    }

    // Check if aesthetic (design) settings changed
    const stripAesthetics = (s: QRSettings) => {
      const { contentType, contentData, ...rest } = s;
      return JSON.stringify(rest);
    };

    const aestheticsChanged = stripAesthetics(nextSettings) !== stripAesthetics(state.settings);

    if (!aestheticsChanged) {
      // Just update text content without adding a history snapshot
      return {
        settings: nextSettings,
        history: currentHistory
      };
    }

    // Aesthetic modification: push to history
    const slicedHistory = currentHistory.slice(0, state.historyIndex + 1);
    const newHistory = [...slicedHistory, nextSettings].slice(-30);
    return {
      settings: nextSettings,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  resetSettings: () => set((state) => {
    const pristineSettings = {
      ...defaultSettings,
      contentType: state.settings.contentType,
      contentData: state.settings.contentData,
    };

    if (JSON.stringify(pristineSettings) === JSON.stringify(state.settings)) {
      return state;
    }

    const slicedHistory = state.history.slice(0, state.historyIndex + 1);
    const newHistory = [...slicedHistory, pristineSettings].slice(-30);
    return {
      settings: pristineSettings,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  applyTemplate: (templateSettings) => set((state) => {
    const merged = { ...templateSettings };
    if (merged.canvas_border_radius !== undefined && merged.canvas_radius === undefined) {
      merged.canvas_radius = merged.canvas_border_radius;
    } else if (merged.canvas_radius !== undefined && merged.canvas_border_radius === undefined) {
      merged.canvas_border_radius = merged.canvas_radius;
    }
    const nextSettings = {
      ...defaultSettings,
      contentType: state.settings.contentType,
      contentData: state.settings.contentData,
      ...merged
    };

    if (JSON.stringify(nextSettings) === JSON.stringify(state.settings)) {
      return state;
    }

    const slicedHistory = state.history.slice(0, state.historyIndex + 1);
    const newHistory = [...slicedHistory, nextSettings].slice(-30);
    return {
      settings: nextSettings,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    const prevIndex = state.historyIndex - 1;
    return {
      historyIndex: prevIndex,
      settings: state.history[prevIndex]
    };
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state;
    const nextIndex = state.historyIndex + 1;
    return {
      historyIndex: nextIndex,
      settings: state.history[nextIndex]
    };
  })
}));

