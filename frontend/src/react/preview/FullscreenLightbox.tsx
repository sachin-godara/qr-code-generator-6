import { useQRStore } from "@/store/useQRStore";

interface FullscreenLightboxProps {
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  previewBg: "white" | "light" | "dark" | "transparent";
  setPreviewBg: (bg: "white" | "light" | "dark" | "transparent") => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  imageUrl?: string;
  isComparing: boolean;
  setIsComparing: (comparing: boolean) => void;
  touchDistance: number | null;
  setTouchDistance: (dist: number | null) => void;
  initialZoom: number;
  setInitialZoom: (zoom: number) => void;
  lastTap: number;
  setLastTap: (time: number) => void;
}

export function FullscreenLightbox({
  isFullscreen,
  setIsFullscreen,
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
  touchDistance,
  setTouchDistance,
  initialZoom,
  setInitialZoom,
  lastTap,
  setLastTap
}: FullscreenLightboxProps) {
  const { settings } = useQRStore();

  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn" onClick={() => setIsFullscreen(false)}>
      <div
        className={`relative rounded-3xl p-8 sm:p-12 max-w-[90vw] max-h-[80vh] flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden touch-none transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[#18181b]' : previewBg === 'transparent' ? 'bg-[#f3f4f6]' : previewBg === 'white' ? 'bg-[#f4f4f5]' : 'bg-[#f9fafb]'}`}
        style={previewBg === 'transparent' ? {
          backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
        } : previewBg === 'light' ? {
          backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
        } : {}}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          const delta = e.deltaY * -0.003;
          setZoomLevel(prev => Math.min(5, Math.max(0.5, prev + delta)));
        }}
        onDoubleClick={() => setZoomLevel(1)}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            setTouchDistance(dist);
            setInitialZoom(zoomLevel);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && touchDistance !== null) {
            const currentDist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            const scale = currentDist / touchDistance;
            setZoomLevel(Math.min(5, Math.max(0.5, initialZoom * scale)));
          }
        }}
        onTouchEnd={(e) => {
          setTouchDistance(null);
          if (e.changedTouches.length === 1) {
            const now = Date.now();
            if (now - lastTap < 300) {
              setZoomLevel(1);
            }
            setLastTap(now);
          }
        }}
      >
        {/* Background Tester Toggle in Fullscreen */}
        <div className={`absolute top-4 left-4 z-50 flex backdrop-blur-md rounded-full p-1 shadow-sm border gap-0.5 ${previewBg === 'dark' ? 'bg-[#27272a]/90 border-white/10' : 'bg-white/90 border-outline-variant/30'}`}>
          <button onClick={(e) => { e.stopPropagation(); setPreviewBg("white"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "white" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Solid Light Background">
            <span className="w-5 h-5 rounded-full bg-[#f4f4f5] border border-outline-variant/60 shadow-inner pointer-events-none"></span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setPreviewBg("light"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "light" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Light Background">
            <span className="w-5 h-5 rounded-full bg-[#f9fafb] border border-outline-variant/60 shadow-inner pointer-events-none"></span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setPreviewBg("dark"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "dark" ? "bg-[#3f3f46] shadow-sm ring-1 ring-black/50" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Dark Background">
            <span className="w-5 h-5 rounded-full bg-[#18181b] border border-black shadow-inner pointer-events-none"></span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setPreviewBg("transparent"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "transparent" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Transparent Background">
            <span className="w-5 h-5 rounded-full border border-outline-variant/60 shadow-inner pointer-events-none" style={{ backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px" }}></span>
          </button>
        </div>

        <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-50 w-12 h-12 sm:w-10 sm:h-10 bg-surface hover:bg-surface-container-high rounded-full flex items-center justify-center text-on-surface transition-colors shadow-sm touch-press" title="Close">
          <span className="material-symbols-outlined text-xl pointer-events-none">close</span>
        </button>

        <div style={{ transform: `scale(${zoomLevel})` }} className="relative">
          <img
            src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"}
            alt="Expanded QR Preview"
            className={`w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] object-contain ${isComparing ? 'grayscale contrast-125 opacity-90' : ''} ${isError ? 'opacity-40 grayscale' : ''}`}
            style={settings.bg_transparent ? {
              backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
              backgroundColor: "#f3f4f6",
              borderRadius: "12px",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)"
            } : {}}
          />

          {isError && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center pointer-events-none">
              <div className="bg-error/90 text-white px-6 py-4 rounded-xl flex flex-col items-center shadow-2xl backdrop-blur-md">
                <span className="material-symbols-outlined text-4xl mb-2">wifi_off</span>
                <span className="text-sm font-bold uppercase tracking-widest">Offline</span>
                <span className="text-xs opacity-90 mt-1">Cannot fetch new preview</span>
              </div>
            </div>
          )}

          {((isLoading || isFetching) && !isError) && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden backdrop-blur-[4px] bg-white/40 flex flex-col items-center justify-center transition-opacity duration-300 delay-150">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl relative z-10 mb-3">autorenew</span>
              <span className="text-sm font-semibold text-primary">Generating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Controls Bar in Lightbox */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-outline-variant/60 z-10" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setZoomLevel(prev => Math.max(0.5, typeof prev === 'number' ? prev - 0.25 : prev))} className="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors hover:bg-black/5 text-on-surface touch-press" title="Zoom Out">
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <span className="text-xs font-bold w-12 text-center text-on-surface">{Math.round(zoomLevel * 100)}%</span>
        <button onClick={() => setZoomLevel(prev => Math.min(5, typeof prev === 'number' ? prev + 0.25 : prev))} className="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors hover:bg-black/5 text-on-surface touch-press" title="Zoom In">
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
        <div className="w-[1px] h-6 bg-outline-variant/50 mx-1"></div>
        <button onClick={() => setIsComparing(!isComparing)} className={`w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors touch-press ${isComparing ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 text-on-surface'}`} title="Compare Raw">
          <span className="material-symbols-outlined text-sm">compare</span>
        </button>
      </div>
    </div>
  );
}
