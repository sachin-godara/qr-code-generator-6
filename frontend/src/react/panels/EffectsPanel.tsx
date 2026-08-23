import { useState } from "react";
import { useQRStore } from "@/store/useQRStore";
import { Slider } from "@/components/ui/Slider";
import { type QRSettings } from "@/types/qr";
import { useTranslation } from "@/i18n/useTranslation";

const GRADIENT_PRESETS = [
  { name: "Sunset", start: "#ff7e5f", end: "#feb47b" },
  { name: "Ocean", start: "#2b5876", end: "#4e4376" },
  { name: "Cyberpunk", start: "#ff0844", end: "#ffb199" },
  { name: "Forest", start: "#11998e", end: "#38ef7d" },
  { name: "Amethyst", start: "#9D50BB", end: "#6E48AA" },
  { name: "Monochrome", start: "#000000", end: "#71717a" },
];

export function EffectsPanel() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const [showCustomGradient, setShowCustomGradient] = useState(false);
  const [showCustomShadow, setShowCustomShadow] = useState(false);

  const effectsGradientOptions: Array<{ label: string; value: QRSettings['gradient_type']; icon: string }> = [
    { label: t("studio.effects.solid", {}, "Solid (No Effect)"), value: "Solid Color", icon: "format_color_fill" },
    { label: t("studio.effects.verticalBlend", {}, "Vertical Blend"), value: "Vertical Gradient", icon: "gradient" },
    { label: t("studio.effects.horizontalBlend", {}, "Horizontal Blend"), value: "Horizontal Gradient", icon: "linear_scale" },
    { label: t("studio.effects.diagonalTlBr", {}, "Diagonal (TL ↘ BR)"), value: "Diagonal (TL to BR)", icon: "trending_down" },
    { label: t("studio.effects.diagonalTrBl", {}, "Diagonal (TR ↙ BL)"), value: "Diagonal (TR to BL)", icon: "call_received" },
    { label: t("studio.effects.radialGlow", {}, "Radial Glow"), value: "Radial Gradient", icon: "blur_circular" },
  ];
  const isEffectsGradient = settings.gradient_type !== "Solid Color";

  return (
    <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-6">
      <div>
        <h3 className="font-headline-sm text-on-surface font-bold">{t("studio.effects.title", {}, "Visual Effects & Finishing")}</h3>
      </div>

      {/* Module Color Gradient Effect */}
      <div className="space-y-4 p-5 bg-surface-container-low/60 rounded-2xl border border-outline-variant/80 shadow-inner-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">gradient</span>
            {t("studio.effects.gradientTitle", {}, "Module Color Gradient Effect")}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {isEffectsGradient ? t("studio.effects.activeGradient", {}, "Active Gradient") : t("studio.effects.solidFill", {}, "Solid Fill")}
          </span>
        </div>

        <select name="input_field_73355cd0" aria-label="Input Field"
          value={settings.gradient_type}
          onChange={(e) => updateSettings({
            gradient_type: e.target.value as any,
            dots_color_end: e.target.value !== "Solid Color" && settings.dots_color_end === "#000000" && settings.dots_color === "#000000" ? "#52525b" : settings.dots_color_end
          })}
          className="w-full p-3 bg-white border border-outline-variant rounded-xl text-sm font-medium text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='m7 10 5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          {effectsGradientOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label.replace('\n', ' ')}
            </option>
          ))}
        </select>

        {/* Gradient Color Pickers & Live Preview */}
        {isEffectsGradient && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/60">
            {/* Presets */}
            <div>
              <div className="text-xs font-bold text-on-surface-variant mb-2 block">{t("studio.effects.quickBlends", {}, "Quick Blends")}</div>
              <div className="flex flex-wrap gap-2">
                {GRADIENT_PRESETS.map(preset => {
                  const isSelected = settings.dots_color === preset.start && settings.dots_color_end === preset.end;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => updateSettings({ dots_color: preset.start, dots_color_end: preset.end })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${isSelected ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                      style={{ background: `linear-gradient(135deg, ${preset.start}, ${preset.end})` }}
                      title={preset.name}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomGradient(!showCustomGradient)}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              {showCustomGradient ? t("studio.effects.hideCustom", {}, "Hide Custom Colors") : t("studio.effects.showCustom", {}, "Custom Colors...")}
            </button>

            {showCustomGradient && (
              <div className="space-y-4 p-3 bg-white rounded-xl border border-outline-variant">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">palette</span>
                    {t("studio.effects.livePreview", {}, "Live Preview:")}
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
                    <div className="text-xs font-bold text-on-surface-variant">{t("studio.effects.startColor", {}, "Start Color")}</div>
                    <div className="flex items-center gap-2.5">
                      <input name="input_field_1a5c92e3" aria-label="Input Field"
                        type="color"
                        value={settings.dots_color}
                        onChange={(e) => updateSettings({ dots_color: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-surface"
                      />
                      <input name="input_field_deb3720a" aria-label="Input Field"
                        type="text"
                        value={settings.dots_color}
                        onChange={(e) => updateSettings({ dots_color: e.target.value })}
                        className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-surface text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-on-surface-variant">{t("studio.effects.endColor", {}, "End Color")}</div>
                    <div className="flex items-center gap-2.5">
                      <input name="input_field_405045f2" aria-label="Input Field"
                        type="color"
                        value={settings.dots_color_end}
                        onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-surface"
                      />
                      <input name="input_field_ad5c7082" aria-label="Input Field"
                        type="text"
                        value={settings.dots_color_end}
                        onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                        className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-surface text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invert Colors Toggle */}
      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant">
        <div>
          <div className="text-sm font-bold text-on-surface block">{t("studio.effects.invertColors", {}, "Invert Colors")}</div>
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
        <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">auto_fix_high</span>
          {t("studio.effects.shadowTitle", {}, "Drop Shadow & Glow Effect")}
        </div>
        {settings.bg_transparent && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">info</span>
            <span>{t("studio.effects.disabledTransparent", {}, "Disabled when background is transparent.")}</span>
          </div>
        )}
        <div className={`grid grid-cols-4 gap-3 transition-opacity duration-200 ${settings.bg_transparent ? "opacity-40 pointer-events-none" : ""}`}>
          {[
            { id: "none", name: t("studio.effects.noShadow", {}, "None") },
            { id: "soft", name: t("studio.effects.softShadow", {}, "Soft Ambient") },
            { id: "elevated", name: t("studio.effects.elevated", {}, "3D Shadow") },
            { id: "neon", name: t("studio.effects.neonGlow", {}, "Neon Glow") },
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
            <button
              type="button"
              onClick={() => setShowCustomShadow(!showCustomShadow)}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              {showCustomShadow ? t("studio.effects.hideCustomShadow", {}, "Hide Custom Shadow") : t("studio.effects.showCustomShadow", {}, "Custom Shadow...")}
            </button>
            {showCustomShadow && (
              <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant">
                <div className="text-xs font-semibold text-on-surface-variant w-24">
                  {settings.effect_shadow === "neon" ? t("studio.effects.glowColor", {}, "Glow Color:") : t("studio.effects.shadowColor", {}, "Shadow Color:")}
                </div>
                <input name="input_field_e1179904" aria-label="Input Field"
                  type="color"
                  value={settings.effect_shadow_color.slice(0, 7)}
                  onChange={(e) => updateSettings({ effect_shadow_color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white"
                />
                <input name="input_field_7b78d95e" aria-label="Input Field"
                  type="text"
                  value={settings.effect_shadow_color}
                  onChange={(e) => updateSettings({ effect_shadow_color: e.target.value })}
                  className="flex-1 p-2 text-xs border border-outline-variant rounded-lg bg-white font-mono"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Canvas Outer Corner Radius */}
      <div className="space-y-3 border-t border-outline-variant pt-6">
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold text-on-surface flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-primary text-[20px]">rounded_corner</span>
            <span>{t("studio.effects.cornerRounding", {}, "Canvas Corner Rounding")}</span>
            {settings.canvas_border_width > 0 && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20">
                {t("studio.effects.syncAccent", {}, "Syncs with Accent Border")}
              </span>
            )}
          </div>
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
          <span>{t("studio.effects.sharp", {}, "0px (Sharp)")}</span>
          <span>{t("studio.effects.standard", {}, "16px (Standard)")}</span>
          <span>{t("studio.effects.maxRound", {}, "40px (Max Round)")}</span>
        </div>
      </div>

      {/* Canvas Outer Border */}
      <div className="space-y-4 border-t border-outline-variant pt-6">
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">crop_free</span>
            {t("studio.effects.outerBorder", {}, "Outer Accent Border")}
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {t("studio.effects.widthPx", { width: settings.canvas_border_width }, `${settings.canvas_border_width}px Width`)}
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
              <div className="text-xs font-semibold text-on-surface-variant w-24">{t("studio.effects.borderColor", {}, "Border Color:")}</div>
              <input name="input_field_1d4677bf" aria-label="Input Field"
                type="color"
                value={settings.canvas_border_color}
                onChange={(e) => updateSettings({ canvas_border_color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white shrink-0"
              />
              <input name="input_field_e493e74d" aria-label="Input Field"
                type="text"
                value={settings.canvas_border_color}
                onChange={(e) => updateSettings({ canvas_border_color: e.target.value })}
                className="flex-1 p-2 text-xs border border-outline-variant rounded-lg bg-white font-mono uppercase"
              />
            </div>
            <p className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/60 flex items-center gap-2 shadow-2xs">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0">info</span>
              <span>{t("studio.effects.borderInfo", {}, "Curves match your Canvas Corner Rounding.")}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
