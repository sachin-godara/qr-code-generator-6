import { useState } from "react";
import { motion } from "framer-motion";
import { useQRStore } from "@/store/useQRStore";
import { useDownloadStore } from "@/store/useDownloadStore";
import { useDownloadHandlers } from "@/hooks/useDownloadHandlers";

interface MobileBottomBarProps {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  imageUrl?: string;
  handleFullscreen: () => void;
  mobileMainTab: 'content' | 'design' | 'logo' | 'more' | 'download';
  setMobileMainTab: (tab: 'content' | 'design' | 'logo' | 'more' | 'download') => void;
  showMiniPreview: boolean;
}

export function MobileBottomBar({
  isLoading,
  isFetching,
  isError,
  imageUrl,
  handleFullscreen,
  mobileMainTab,
  setMobileMainTab,
  showMiniPreview
}: MobileBottomBarProps) {
  const { undo, redo, resetSettings, history, historyIndex } = useQRStore();
  const { downloadFormat, isDownloading, downloadSuccess } = useDownloadStore();
  const { handleDownloadCustom } = useDownloadHandlers();
  const [previewExpanded, setPreviewExpanded] = useState(true);

  return (
    <>
      {/* ── STICKY TOP PREVIEW AREA (Collapsible) ── */}
      <div className="lg:hidden w-full max-w-[100vw] z-40 sticky top-14 sm:top-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm transition-all duration-300">
        
        {previewExpanded ? (
          /* ── EXPANDED: Large preview with controls ── */
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-3 max-w-sm mx-auto">
              {/* Left side: History Controls */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container-high border border-outline-variant/50 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none shadow-sm touch-press active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">undo</span>
                </button>
                <button
                  onClick={resetSettings}
                  className="w-9 h-9 rounded-full bg-error-container/20 text-error hover:bg-error-container/40 border border-error/20 flex items-center justify-center shadow-sm touch-press active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">restart_alt</span>
                </button>
              </div>

              {/* Center: Large Preview */}
              <div 
                className="relative w-32 h-32 shrink-0 bg-white rounded-2xl border-2 border-outline-variant/60 shadow-md p-1.5 flex items-center justify-center group cursor-pointer touch-press active:scale-[0.98] transition-transform"
                onClick={handleFullscreen}
              >
                {(isLoading || isFetching) && !isError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl">
                    <span className="material-symbols-outlined animate-spin text-primary text-2xl">autorenew</span>
                  </div>
                )}
                {isError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-error/90 backdrop-blur-[2px] z-10 text-white rounded-2xl">
                    <span className="material-symbols-outlined text-2xl">wifi_off</span>
                  </div>
                )}
                <img 
                  src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"} 
                  alt="QR Preview" 
                  className={`w-full h-full object-contain ${isError ? 'opacity-40 grayscale' : ''}`} 
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20 rounded-2xl">
                  <span className="material-symbols-outlined text-black drop-shadow-sm text-3xl">open_in_full</span>
                </div>
              </div>

              {/* Right side: Redo & Expand */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container-high border border-outline-variant/50 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none shadow-sm touch-press active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">redo</span>
                </button>
                <button
                  onClick={handleFullscreen}
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 flex items-center justify-center shadow-sm touch-press active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">open_in_full</span>
                </button>
              </div>
            </div>
            {/* Collapse button */}
            <button
              onClick={() => setPreviewExpanded(false)}
              className="mx-auto mt-2 flex items-center gap-1 text-[10px] font-bold text-on-surface-variant/70 hover:text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">keyboard_arrow_up</span>
              Hide preview
            </button>
          </div>
        ) : (
          /* ── COLLAPSED: Thin bar with mini QR ── */
          <button
            onClick={() => setPreviewExpanded(true)}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 touch-press active:bg-surface-container-low transition-colors"
          >
            <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-outline-variant/60 p-0.5 flex items-center justify-center shadow-sm overflow-hidden relative">
              {(isLoading || isFetching) && !isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                  <span className="material-symbols-outlined animate-spin text-primary text-sm">autorenew</span>
                </div>
              )}
              <img 
                src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"} 
                alt="QR" 
                className={`w-full h-full object-contain ${isError ? 'opacity-40 grayscale' : ''}`} 
              />
            </div>
            <span className="text-xs font-bold text-on-surface-variant">Tap to show preview</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/60">keyboard_arrow_down</span>
          </button>
        )}
      </div>

      {/* ── FIXED BOTTOM NAVIGATION BAR ── */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16 sm:h-18 max-w-md mx-auto">
          
          <button
            onClick={() => setMobileMainTab('content')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 touch-press ${
              mobileMainTab === 'content' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="relative px-3 py-1 rounded-full flex items-center justify-center">
              {mobileMainTab === 'content' && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 material-symbols-outlined text-[20px] ${mobileMainTab === 'content' ? 'text-primary font-bold' : ''}`}>edit_document</span>
            </div>
            <span className="text-[10px] font-bold">Content</span>
          </button>

          <button
            onClick={() => setMobileMainTab('design')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 touch-press ${
              mobileMainTab === 'design' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="relative px-3 py-1 rounded-full flex items-center justify-center">
              {mobileMainTab === 'design' && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 material-symbols-outlined text-[20px] ${mobileMainTab === 'design' ? 'text-primary font-bold' : ''}`}>palette</span>
            </div>
            <span className="text-[10px] font-bold">Design</span>
          </button>

          <button
            onClick={() => setMobileMainTab('logo')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 touch-press ${
              mobileMainTab === 'logo' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="relative px-3 py-1 rounded-full flex items-center justify-center">
              {mobileMainTab === 'logo' && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 material-symbols-outlined text-[20px] ${mobileMainTab === 'logo' ? 'text-primary font-bold' : ''}`}>add_photo_alternate</span>
            </div>
            <span className="text-[10px] font-bold">Logo</span>
          </button>

          <button
            onClick={() => setMobileMainTab('more')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 touch-press ${
              mobileMainTab === 'more' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="relative px-3 py-1 rounded-full flex items-center justify-center">
              {mobileMainTab === 'more' && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 material-symbols-outlined text-[20px] ${mobileMainTab === 'more' ? 'text-primary font-bold' : ''}`}>more_horiz</span>
            </div>
            <span className="text-[10px] font-bold">More</span>
          </button>

          <button
            onClick={() => setMobileMainTab('download')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 touch-press ${
              mobileMainTab === 'download' ? 'text-emerald-600' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
             <div className="relative px-3 py-1 rounded-full flex items-center justify-center">
              {mobileMainTab === 'download' && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-emerald-600/15 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 material-symbols-outlined text-[20px] ${mobileMainTab === 'download' ? 'text-emerald-600 font-bold' : ''}`}>download</span>
            </div>
            <span className="text-[10px] font-bold">Download</span>
          </button>

        </div>
      </div>

    </>
  );
}
