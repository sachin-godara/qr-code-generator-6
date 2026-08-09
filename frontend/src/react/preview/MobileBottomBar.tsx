import { useQRStore } from "@/store/useQRStore";
import { useDownloadStore } from "@/store/useDownloadStore";
import { useDownloadHandlers } from "@/hooks/useDownloadHandlers";

interface MobileBottomBarProps {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  imageUrl?: string;
  handleFullscreen: () => void;
  mobileMainTab: 'content' | 'design' | 'download';
  setMobileMainTab: (tab: 'content' | 'design' | 'download') => void;
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
  const { settings, undo, redo, resetSettings, history, historyIndex } = useQRStore();
  const { downloadFormat, isDownloading, downloadSuccess, copySuccess, isCopying } = useDownloadStore();
  const { handleDownloadCustom, handleCopyToClipboard, hasComplexStyling } = useDownloadHandlers();

  return (
    <>
      <div className="lg:hidden w-full max-w-[100vw] z-40 sticky top-14 sm:top-16">
        {/* ── STICKY ULTRA-COMPACT HEADER: Mini-Preview + Navigation ── */}
        <div className={`w-full flex flex-col bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm transition-all duration-200 ${!showMiniPreview ? '-translate-y-full opacity-0 pointer-events-none absolute' : 'translate-y-0 opacity-100'}`}>

          {/* Compact Bar with Live QR Engine */}
          <div className="px-3.5 py-2 flex items-center justify-between gap-2.5 border-b border-outline-variant/30">
            <div
              className="flex items-center gap-2.5 min-w-0 cursor-pointer active:scale-[0.98] transition-transform group touch-press"
              onClick={handleFullscreen}
              title="Tap to view fullscreen"
            >
              <div className="bg-white rounded-xl border border-outline-variant/60 p-1 w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] shrink-0 aspect-square flex items-center justify-center shadow-2xs relative overflow-hidden">
                {(isLoading || isFetching) && !isError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-10 delay-150">
                    <span className="material-symbols-outlined animate-spin text-primary text-xl">autorenew</span>
                  </div>
                ) : null}
                {isError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-error/90 backdrop-blur-[2px] z-10 text-white">
                    <span className="material-symbols-outlined text-lg">wifi_off</span>
                  </div>
                )}

                <img src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"} alt="QR Preview" className={`w-full h-full object-contain ${isError ? 'opacity-40 grayscale' : ''}`} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                  <span className="material-symbols-outlined text-white drop-shadow-md text-[20px]">fullscreen</span>
                </div>
              </div>
              <div className="min-w-0 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary truncate">Live Engine</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-on-surface truncate group-active:text-primary transition-colors">{settings.contentType} QR Code</p>
                <p className="text-[10px] sm:text-[11px] text-on-surface-variant truncate flex items-center gap-1">
                  Level {settings.error_correction} • {downloadFormat}
                  <span className="material-symbols-outlined text-[10px] opacity-70">open_in_full</span>
                </p>
              </div>
            </div>

            {/* Compact Quick Tools */}
            <div className="flex gap-1.5 shrink-0 items-center">

              <button onClick={handleFullscreen} className="p-2 bg-surface hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-xl border border-outline-variant/40 flex items-center justify-center text-xs font-bold gap-1 shadow-2xs min-w-[36px] min-h-[36px] touch-press" title="View Fullscreen">
                <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                <span className="hidden sm:inline text-xs">Expand</span>
              </button>
            </div>
          </div>

          {/* Slim Main Segment Tabs: Content | Design | Download & Undo/Redo/Reset */}
          <div className="px-3 py-1.5 border-b border-outline-variant/20 flex items-center justify-between gap-2.5 overflow-x-auto custom-scrollbar">
            <div className="bg-surface border border-outline-variant/70 rounded-xl p-1 grid grid-cols-3 gap-1 flex-1 min-w-[240px] max-w-[300px] sm:max-w-[340px] shrink-0">
              <button
                onClick={() => setMobileMainTab('content')}
                className={`flex items-center justify-center py-1.5 px-3 rounded-lg font-bold transition-all text-xs sm:text-[13px] touch-press ${mobileMainTab === 'content'
                  ? 'bg-white text-on-surface border border-outline-variant/60 shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                Content
              </button>

              <button
                onClick={() => setMobileMainTab('design')}
                className={`flex items-center justify-center py-1.5 px-3 rounded-lg font-bold transition-all text-xs sm:text-[13px] touch-press ${mobileMainTab === 'design'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                Design
              </button>

              <button
                onClick={() => setMobileMainTab('download')}
                className={`flex items-center justify-center py-1.5 px-3 rounded-lg font-bold transition-all text-xs sm:text-[13px] touch-press ${mobileMainTab === 'download'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                Download
              </button>
            </div>

            {/* Mobile Time-Travel Controls */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/50 shadow-2xs shrink-0 select-none">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-90 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                title="Undo"
              >
                <span className="material-symbols-outlined text-[15px] group-active:-rotate-45 transition-transform duration-200">undo</span>
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-90 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                title="Redo"
              >
                <span className="material-symbols-outlined text-[15px] group-active:rotate-45 transition-transform duration-200">redo</span>
              </button>
              <div className="w-[1px] h-4 bg-outline-variant/50 mx-0.5"></div>
              <button
                onClick={resetSettings}
                className="p-1.5 rounded-lg bg-error-container/20 hover:bg-error-container/40 text-error transition-all duration-200 active:scale-90 flex items-center justify-center border border-error/20 shadow-2xs group"
                title="Reset Design"
              >
                <span className="material-symbols-outlined text-[15px] group-active:scale-95">restart_alt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save QR FAB — appears when preview is scrolled out of view */}
      <div
        className={`fixed bottom-6 right-4 z-50 transition-all duration-300 ${
          showMiniPreview && mobileMainTab !== 'download'
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ filter: 'drop-shadow(0 4px 16px rgba(5,150,105,0.35))' }}
      >
        <button
          onClick={handleDownloadCustom}
          disabled={isDownloading || isError || !imageUrl}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-sm text-white transition-all touch-press disabled:opacity-50 ${
            downloadSuccess
              ? 'bg-emerald-600'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95'
          }`}
          title="Quick download PNG"
        >
          {isDownloading ? (
            <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
          ) : downloadSuccess ? (
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">download</span>
          )}
          <span>{downloadSuccess ? 'Saved!' : 'Save QR'}</span>
        </button>
      </div>
    </>
  );
}
