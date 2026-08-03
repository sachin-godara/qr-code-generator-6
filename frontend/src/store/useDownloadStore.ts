import { create } from 'zustand';

interface DownloadState {
  batchFormat: string;
  batchSize: string;
  downloadFormat: "PNG" | "SVG" | "PDF";
  downloadSize: number;
  noStretching: boolean;
  customFilename: string;
  isDownloading: boolean;
  downloadSuccess: boolean;
  isCopying: boolean;
  copySuccess: boolean;
  isBatchGenerating: boolean;

  setBatchFormat: (val: string) => void;
  setBatchSize: (val: string) => void;
  setDownloadFormat: (val: "PNG" | "SVG" | "PDF") => void;
  setDownloadSize: (val: number) => void;
  setNoStretching: (val: boolean) => void;
  setCustomFilename: (val: string) => void;
  setIsDownloading: (val: boolean) => void;
  setDownloadSuccess: (val: boolean) => void;
  setIsCopying: (val: boolean) => void;
  setCopySuccess: (val: boolean) => void;
  setIsBatchGenerating: (val: boolean) => void;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  batchFormat: "PNG",
  batchSize: "1024",
  downloadFormat: "PNG",
  downloadSize: 1024,
  noStretching: true,
  customFilename: "",
  isDownloading: false,
  downloadSuccess: false,
  isCopying: false,
  copySuccess: false,
  isBatchGenerating: false,

  setBatchFormat: (val) => set({ batchFormat: val }),
  setBatchSize: (val) => set({ batchSize: val }),
  setDownloadFormat: (val) => set({ downloadFormat: val }),
  setDownloadSize: (val) => set({ downloadSize: val }),
  setNoStretching: (val) => set({ noStretching: val }),
  setCustomFilename: (val) => set({ customFilename: val }),
  setIsDownloading: (val) => set({ isDownloading: val }),
  setDownloadSuccess: (val) => set({ downloadSuccess: val }),
  setIsCopying: (val) => set({ isCopying: val }),
  setCopySuccess: (val) => set({ copySuccess: val }),
  setIsBatchGenerating: (val) => set({ isBatchGenerating: val }),
}));
