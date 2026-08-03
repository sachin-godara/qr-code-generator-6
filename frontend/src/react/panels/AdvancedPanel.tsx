import { useQRStore } from "@/store/useQRStore";
import { Slider } from "@/components/ui/Slider";
import { ScannabilityAlert } from "@/components/ui/ScannabilityAlert";

export function AdvancedPanel() {
  const { settings, updateSettings } = useQRStore();

  return (
    <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-8">
      <div>
        <h3 className="font-headline-sm text-on-surface font-bold">Advanced QR Engine Controls</h3>
        <p className="text-on-surface-variant font-label-md text-label-md mt-1">
          Fine-tune redundancy, error recovery, and structural spacing for precision scanning.
        </p>
      </div>

      {/* Error Correction Level */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
            Error Correction Level
          </label>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {settings.error_correction === "L" && "Low (7% Recovery)"}
            {settings.error_correction === "M" && "Medium (15% Recovery)"}
            {settings.error_correction === "Q" && "Quartile (25% Recovery)"}
            {settings.error_correction === "H" && "High (30% Recovery)"}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          Determines how much data can be damaged or hidden (by logos) while retaining scannability.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { id: "L", name: "Low", desc: "~7%" },
            { id: "M", name: "Medium", desc: "~15%" },
            { id: "Q", name: "Quartile", desc: "~25%" },
            { id: "H", name: "High", desc: "~30%" },
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => updateSettings({ error_correction: level.id as any })}
              className={`p-3 sm:p-3.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${settings.error_correction === level.id
                ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                }`}
            >
              <span className="text-xs sm:text-sm md:text-base font-bold whitespace-nowrap">{level.id} - {level.name}</span>
              <span className="text-[10px] sm:text-[11px] text-on-surface-variant mt-0.5">{level.desc}</span>
            </button>
          ))}
        </div>
        <ScannabilityAlert
          show={settings.error_correction !== "H"}
          message="Test scan recommended"
          compact={true}
        />
      </div>

      {/* Quiet Zone (Border Width) */}
      <div className="space-y-3 border-t border-outline-variant pt-6">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">margin</span>
            Quiet Zone (Border Width)
          </label>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {settings.quiet_zone} Modules
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          The blank padding around the QR matrix. Standard specification requires at least 4 modules.
        </p>
        <Slider min="0"
          max="10"
          value={settings.quiet_zone}
          onChange={(val) => updateSettings({ quiet_zone: val })}
        />
        <ScannabilityAlert
          show={settings.quiet_zone > 4}
          message="Test scan recommended"
          compact={true}
        />
        <div className="flex justify-between text-[11px] text-on-surface-variant font-semibold px-1">
          <span>0 (No Border)</span>
          <span>4 (Standard)</span>
          <span>10 (Spacious)</span>
        </div>
      </div>

      {/* Background Image Controls */}
      <div className="space-y-3 border-t border-outline-variant pt-6">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">image</span>
            Background Image
          </label>
          {settings.bg_image && (
            <button
              type="button"
              onClick={() => updateSettings({ bg_image: null, bg_image_opacity: 100 })}
              className="text-xs font-semibold text-error hover:bg-error/10 px-2 py-0.5 rounded transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-xs text-on-surface-variant">
          Overlay your QR code onto a custom background image with adjustable transparency.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-outline-variant rounded-xl bg-surface hover:bg-surface-variant transition-colors relative h-12 flex items-center justify-center overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    updateSettings({ bg_image: ev.target?.result as string, bg_image_opacity: 100 });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              {settings.bg_image ? "Change Background" : "Upload Background"}
            </span>
          </div>
        </div>
        {settings.bg_image && (
          <div className="mt-3 bg-surface-container rounded-xl p-3 border border-outline-variant/30 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-on-surface">Opacity</label>
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{settings.bg_image_opacity ?? 100}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={settings.bg_image_opacity ?? 100}
              onChange={(e) => updateSettings({ bg_image_opacity: parseInt(e.target.value) })}
              className="w-full accent-primary h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
