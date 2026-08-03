import { useQRStore } from "@/store/useQRStore";
import { Slider } from "@/components/ui/Slider";
import { type QRSettings } from "@/types/qr";

export function EffectsPanel() {
  const { settings, updateSettings } = useQRStore();

  const effectsGradientOptions: Array<{ label: string; value: QRSettings['gradient_type']; icon: string }> = [
    { label: "Solid\n(No Effect)", value: "Solid Color", icon: "format_color_fill" },
    { label: "Vertical\nBlend", value: "Vertical Gradient", icon: "gradient" },
    { label: "Horizontal\nBlend", value: "Horizontal Gradient", icon: "linear_scale" },
    { label: "Diagonal\n(TL ↘ BR)", value: "Diagonal (TL to BR)", icon: "trending_down" },
    { label: "Diagonal\n(TR ↙ BL)", value: "Diagonal (TR to BL)", icon: "call_received" },
    { label: "Radial\nGlow", value: "Radial Gradient", icon: "blur_circular" },
  ];
  const isEffectsGradient = settings.gradient_type !== "Solid Color";

  return (
    <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-6">
      <div>
        <h3 className="font-headline-sm text-on-surface font-bold">Visual Effects & Finishing</h3>
        <p className="text-on-surface-variant font-label-md text-label-md mt-1">
          Enhance your QR code with color gradients, drop shadows, outer canvas borders, corner rounding, and dark-mode color inversion.
        </p>
      </div>

      {/* Module Color Gradient Effect */}
      <div className="space-y-4 p-5 bg-surface-container-low/60 rounded-2xl border border-outline-variant/80 shadow-inner-sm">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">gradient</span>
            Module Color Gradient Effect
          </label>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {isEffectsGradient ? "Active Gradient" : "Solid Fill"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {effectsGradientOptions.map((opt) => {
            const selected = settings.gradient_type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateSettings({
                  gradient_type: opt.value,
                  dots_color_end: opt.value !== "Solid Color" && settings.dots_color_end === "#000000" && settings.dots_color === "#000000" ? "#52525b" : settings.dots_color_end
                })}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 sm:p-3 rounded-xl border text-[11px] sm:text-xs leading-tight font-bold transition-all duration-200 ${selected
                  ? 'bg-primary/15 border-primary text-primary shadow-sm scale-[1.02]'
                  : 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface hover:border-outline'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                <span className="whitespace-pre-line text-center">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gradient Color Pickers & Live Preview */}
        {isEffectsGradient && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/60">
            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">palette</span>
                Live Blend Preview:
              </span>
              <div
                className="w-full sm:w-64 h-6 rounded-lg border border-outline-variant shadow-inner transition-all duration-300"
                style={{
                  background: settings.gradient_type === "Radial Gradient"
                    ? `radial-gradient(circle, ${settings.dots_color}, ${settings.dots_color_end})`
                    : settings.gradient_type === "Horizontal Gradient"
                      ? `linear-gradient(to right, ${settings.dots_color}, ${settings.dots_color_end})`
                      : settings.gradient_type === "Diagonal (TL to BR)"
                        ? `linear-gradient(135deg, ${settings.dots_color}, ${settings.dots_color_end})`
                        : settings.gradient_type === "Diagonal (TR to BL)"
                          ? `linear-gradient(225deg, ${settings.dots_color}, ${settings.dots_color_end})`
                          : `linear-gradient(to bottom, ${settings.dots_color}, ${settings.dots_color_end})`
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Start Color (Foreground)</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={settings.dots_color}
                    onChange={(e) => updateSettings({ dots_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.dots_color}
                    onChange={(e) => updateSettings({ dots_color: e.target.value })}
                    className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-white text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">End Color (Gradient Destination)</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={settings.dots_color_end}
                    onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.dots_color_end}
                    onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                    className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-white text-xs font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invert Colors Toggle */}
      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant">
        <div>
          <label className="text-sm font-bold text-on-surface block">Invert QR Colors (Dark Mode)</label>
          <span className="text-xs text-on-surface-variant">Swaps background and dot colors for high-contrast dark themes</span>
        </div>
        <button
          type="button"
          onClick={() => updateSettings({ invert_colors: !settings.invert_colors })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.invert_colors ? "bg-primary" : "bg-on-surface-variant/30"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.invert_colors ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      </div>

      {/* Drop Shadow & Glow */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">auto_fix_high</span>
          Drop Shadow & Glow Effect
        </label>
        {settings.bg_transparent && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">info</span>
            <span>
              Drop Shadow & Glow effects are disabled while <strong className="font-semibold text-amber-950">Transparent Background</strong> is active in Design settings.
            </span>
          </div>
        )}
        <div className={`grid grid-cols-4 gap-3 transition-opacity duration-200 ${settings.bg_transparent ? "opacity-40 pointer-events-none" : ""}`}>
          {[
            { id: "none", name: "None" },
            { id: "soft", name: "Soft Ambient" },
            { id: "elevated", name: "3D Shadow" },
            { id: "neon", name: "Neon Glow" },
          ].map((s) => (
            <button
              key={s.id}
              disabled={settings.bg_transparent}
              onClick={() => {
                const newId = s.id as any;
                let newColor = settings.effect_shadow_color;
                if (newId === "neon" && (newColor.startsWith("#000000") || newColor.startsWith("rgba(0,0,0"))) {
                  newColor = "#18181bee";
                } else if ((newId === "soft" || newId === "elevated") && newColor === "#18181bee") {
                  newColor = "#00000066";
                }
                updateSettings({ effect_shadow: newId, effect_shadow_color: newColor });
              }}
              className={`p-3 rounded-xl border flex flex-col items-center text-center tab-spring ${settings.effect_shadow === s.id
                ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                }`}
            >
              <span className="text-xs font-bold">{s.name}</span>
            </button>
          ))}
        </div>

        {settings.effect_shadow !== "none" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-on-surface-variant w-24">
                {settings.effect_shadow === "neon" ? "Glow Color:" : "Shadow Color:"}
              </label>
              <input
                type="color"
                value={settings.effect_shadow_color.slice(0, 7)}
                onChange={(e) => updateSettings({ effect_shadow_color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white"
              />
              <input
                type="text"
                value={settings.effect_shadow_color}
                onChange={(e) => updateSettings({ effect_shadow_color: e.target.value })}
                className="flex-1 p-2 text-xs border border-outline-variant rounded-lg bg-white font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Canvas Outer Corner Radius */}
      <div className="space-y-3 border-t border-outline-variant pt-6">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-primary text-[20px]">rounded_corner</span>
            <span>Canvas Corner Rounding</span>
            {settings.canvas_border_width > 0 && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20">
                Syncs with Accent Border
              </span>
            )}
          </label>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg shrink-0">
            {settings.canvas_radius}px
          </span>
        </div>
        <Slider min="0"
          max="40"
          value={settings.canvas_radius}
          onChange={(val) => updateSettings({ canvas_radius: val, canvas_border_radius: val })}
        />
        <div className="flex justify-between text-[11px] text-on-surface-variant font-semibold px-1">
          <span>0px (Sharp)</span>
          <span>16px (Standard)</span>
          <span>40px (Max Round)</span>
        </div>
      </div>

      {/* Canvas Outer Border */}
      <div className="space-y-4 border-t border-outline-variant pt-6">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">crop_free</span>
            Outer Accent Border
          </label>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {settings.canvas_border_width}px Width
          </span>
        </div>
        <Slider min="0"
          max="10"
          value={settings.canvas_border_width}
          onChange={(val) => updateSettings({ canvas_border_width: val })}
        />
        {settings.canvas_border_width > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-on-surface-variant w-24">Border Color:</label>
              <input
                type="color"
                value={settings.canvas_border_color}
                onChange={(e) => updateSettings({ canvas_border_color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={settings.canvas_border_color}
                onChange={(e) => updateSettings({ canvas_border_color: e.target.value })}
                className="flex-1 p-2 text-xs border border-outline-variant rounded-lg bg-white font-mono uppercase"
              />
            </div>
            <p className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/60 flex items-center gap-2 shadow-2xs">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0">info</span>
              <span>Border corner curvature dynamically aligns with your <b>Canvas Corner Rounding</b> above.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
