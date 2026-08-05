import { useQRStore } from "@/store/useQRStore";
import { useDownloadStore } from "@/store/useDownloadStore";
import { useDownloadHandlers } from "@/hooks/useDownloadHandlers";

interface DesktopPreviewPaneProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  previewBg: "white" | "light" | "dark" | "transparent";
  setPreviewBg: (bg: "white" | "light" | "dark" | "transparent") => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  imageUrl?: string;
  isComparing: boolean;
  setIsComparing: (comparing: boolean) => void;
  handleFullscreen: () => void;
  handleShare: () => void;
}

export function DesktopPreviewPane({
  previewRef,
  previewBg,
  setPreviewBg,
  zoomLevel,
  setZoomLevel,
  isLoading,
  isFetching,
  isError,
  imageUrl,
  isComparing,
  setIsComparing,
  handleFullscreen,
  handleShare
}: DesktopPreviewPaneProps) {
  const { settings } = useQRStore();
  const { downloadFormat, downloadSize } = useDownloadStore();

  let targetResolution = `${downloadSize}x${downloadSize}`;
  if (downloadFormat === "SVG") targetResolution = "Vector (SVG)";
  else if (downloadFormat === "PDF") targetResolution = "Print (PDF)";

  // Compute approximate print size at 300 DPI
  const printSizeCm = downloadFormat === "PNG" ? ((downloadSize / 300) * 2.54).toFixed(1) : null;

  // Derive a subtle ambient glow color from the dots color
  const dotsColor = settings.dots_color || "#18181b";
  const r = parseInt(dotsColor.slice(1, 3), 16) || 24;
  const g = parseInt(dotsColor.slice(3, 5), 16) || 24;
  const b = parseInt(dotsColor.slice(5, 7), 16) || 27;
  const glowColor = `rgba(${r}, ${g}, ${b}, 0.18)`;

  return (
    <div className="lg:col-span-5 lg:sticky lg:top-24 relative" ref={previewRef}>
      {/* Framer-style Ambient Hero Glow */}
      <div className="absolute -inset-4 sm:-inset-6 ambient-hero-glow -z-10 pointer-events-none rounded-[40px]" />

      <div className="bg-white rounded-3xl p-6 md:p-8 surface-ring-vercel space-y-6 sm:space-y-8 relative z-10">

        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-on-surface">Live Preview</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-medium rounded-full flex items-center gap-1.5 tracking-wider uppercase">
              <span className="pulse-dot"></span>
              Live
            </span>
          </div>
        </div>

        {/* QR Preview Surface */}
        <div
          id="qr-preview-container"
          className={`aspect-square flex items-center justify-center relative overflow-hidden group p-8 rounded-2xl surface-ring-vercel qr-ambient-ring transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[#18181b]' : previewBg === 'transparent' ? 'bg-[#f3f4f6]' : previewBg === 'white' ? 'bg-[#f4f4f5]' : 'bg-[#f9fafb]'}`}
          style={{ 
            "--qr-glow-color": glowColor,
            ...(previewBg === 'transparent' ? {
              backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            } : previewBg === 'light' ? {
              backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            } : {})
          } as any}
        >
          {/* Background Tester Toggle */}
          <div className={`absolute top-3 left-3 z-30 flex backdrop-blur-md rounded-full p-1 shadow-sm border gap-0.5 ${previewBg === 'dark' ? 'bg-[#27272a]/90 border-white/10' : 'bg-white/90 border-outline-variant/30'}`}>
            <button onClick={() => setPreviewBg("white")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "white" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Solid Light Background">
              <span className="w-4 h-4 rounded-full bg-[#f4f4f5] border border-outline-variant/60 shadow-inner"></span>
            </button>
            <button onClick={() => setPreviewBg("light")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "light" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Light Background">
              <span className="w-4 h-4 rounded-full bg-[#f9fafb] border border-outline-variant/60 shadow-inner"></span>
            </button>
            <button onClick={() => setPreviewBg("dark")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "dark" ? "bg-[#3f3f46] shadow-sm ring-1 ring-black/50" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Dark Background">
              <span className="w-4 h-4 rounded-full bg-[#18181b] border border-black shadow-inner"></span>
            </button>
            <button onClick={() => setPreviewBg("transparent")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "transparent" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Transparent (Checkerboard) Background">
              <span className="w-4 h-4 rounded-full border border-outline-variant/60 shadow-inner" style={{ backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px" }}></span>
            </button>
          </div>

          <div className="absolute inset-0 canvas-aura pointer-events-none"></div>
          <div className={`absolute inset-0 opacity-5 ${previewBg === 'dark' ? 'invert' : ''} ${previewBg === 'white' ? 'hidden' : ''}`} style={{ backgroundImage: "radial-gradient(#18181b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

          <div
            className={`relative z-10 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${zoomLevel === 1 && !isLoading && !isFetching ? 'group-hover:scale-[1.06]' : ''}`}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"}
              alt="QR Code Preview"
              className={`w-full aspect-square max-w-[300px] max-h-[300px] xl:max-w-[320px] xl:max-h-[320px] object-contain transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isComparing ? 'grayscale contrast-125 opacity-90' : ''} ${isError ? 'opacity-40 grayscale' : ''}`}
              style={settings.bg_transparent ? {
                backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)"
              } : {}}
            />

            {/* Offline / Error Overlay */}
            {isError && (
              <div className="absolute inset-0 rounded-xl overflow-hidden flex items-center justify-center pointer-events-none">
                <div className="bg-error/90 text-white px-3 py-2 rounded-lg flex flex-col items-center shadow-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xl mb-0.5">wifi_off</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Offline</span>
                </div>
              </div>
            )}

            {/* Shimmer Overlay for Loading State */}
            {((isLoading || isFetching) && !isError) && (
              <div className="absolute inset-0 rounded-xl overflow-hidden backdrop-blur-[4px] bg-white/40 flex items-center justify-center transition-opacity duration-300 delay-150">
                <div className="absolute inset-0 skeleton-shimmer"></div>
                <span className="material-symbols-outlined animate-spin text-primary text-3xl relative z-10">autorenew</span>
              </div>
            )}

          </div>
        </div>

        {/* Segmented Controls (Zoom & Tools) */}
        <div className="flex items-center justify-between gap-1 bg-surface-container-low p-1.5 rounded-full border border-outline-variant/60 shadow-inner">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${zoomLevel === 1 ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
              title="Zoom 100%"
            >
              <span className="material-symbols-outlined text-[18px]">fit_screen</span>
            </button>
            <button
              onClick={() => setZoomLevel(2)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${zoomLevel === 2 ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
              title="Zoom 200%"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_in</span>
            </button>
          </div>

          <div className="w-[1px] h-5 bg-outline-variant/50 mx-1"></div>

          <div className="flex items-center gap-1">

            <button
              onClick={handleFullscreen}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-200"
              title="Full Screen"
            >
              <span className="material-symbols-outlined text-[18px]">fullscreen</span>
            </button>
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isComparing ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
              title="Compare Raw"
            >
              <span className="material-symbols-outlined text-[18px]">compare</span>
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-200"
              title="Share"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        {/* Premium Metadata Badges + Print Size */}
        <div className="pt-5 border-t border-outline-variant/50 flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-[14px] text-primary">aspect_ratio</span>
            <span className="text-xs font-bold text-on-surface">{targetResolution}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-[14px] text-primary">shield_locked</span>
            <span className="text-xs font-bold text-on-surface">Level {settings.error_correction}</span>
          </div>
          {printSizeCm && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all" title="Approximate print size at 300 DPI">
              <span className="material-symbols-outlined text-[14px] text-primary">print</span>
              <span className="text-xs font-bold text-on-surface">~{printSizeCm}cm print</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
