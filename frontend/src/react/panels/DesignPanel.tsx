import { useState, useRef, type RefObject } from "react";
import { useQRStore } from "@/store/useQRStore";
import { StylePreviewCard } from "@/components/previews/StylePreviewCard";
import { DOT_STYLES, EYE_FRAME_STYLES, EYEBALL_STYLES } from "@/data/options";
import { useTranslation } from "@/i18n/useTranslation";

export function DesignPanel() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  
  const [activeCorner, setActiveCorner] = useState<"all" | "tl" | "tr" | "bl">("all");
  const dotsScrollRef = useRef<HTMLDivElement>(null);
  const eyeFrameScrollRef = useRef<HTMLDivElement>(null);
  const eyeballScrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (ref: RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isGradientActive = settings.gradient_type && settings.gradient_type !== "Solid Color";

  return (
    <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
      {isGradientActive && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/15 rounded-lg text-xs font-medium text-primary">
          <span className="material-symbols-outlined text-base">palette</span>
          <span>{t("studio.design.gradient")}: <strong>{settings.gradient_type}</strong></span>
        </div>
      )}
      <div className={`grid grid-cols-1 ${isGradientActive ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2'} gap-6`}>
        <div className="flex flex-col h-full">
          <div className="section-label block mb-2">
            {isGradientActive ? `${t("studio.design.foreground")} (Start)` : t("studio.design.foreground")}
          </div>
          <div className="flex items-center gap-2 h-11 px-1 mt-auto border border-outline-variant rounded-lg bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
            <input name="input_field_d14b1075" aria-label="Input Field"
              type="color"
              value={settings.dots_color}
              onChange={(e) => updateSettings({ dots_color: e.target.value })}
              className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
            />
            <input name="input_field_105dc5a1" aria-label="Input Field"
              type="text"
              value={settings.dots_color}
              onChange={(e) => updateSettings({ dots_color: e.target.value })}
              className="flex-1 w-full bg-transparent text-sm font-mono tracking-wider border-none outline-none focus:ring-0 px-2 text-on-surface"
            />
          </div>
        </div>

        {isGradientActive && (
          <div className="flex flex-col h-full">
            <div className="section-label block mb-2">{t("studio.design.fgColorEnd", {}, `${t("studio.design.foreground", {}, "Foreground")} (End)`)}</div>
            <div className="flex items-center gap-2 h-11 px-1 mt-auto border border-outline-variant rounded-lg bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
              <input name="input_field_1441b836" aria-label="Input Field"
                type="color"
                value={settings.dots_color_end || "#52525b"}
                onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
              />
              <input name="input_field_6a0a90b1" aria-label="Input Field"
                type="text"
                value={settings.dots_color_end || "#52525b"}
                onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                className="flex-1 w-full bg-transparent text-sm font-mono tracking-wider border-none outline-none focus:ring-0 px-2 text-on-surface"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center gap-1 mb-2">
            <div className="section-label block truncate">{t("studio.design.background")}</div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline-variant/30 transition-colors shrink-0">
              <input name="input_field_f5329e44" aria-label="Input Field"
                type="checkbox"
                checked={settings.bg_transparent || false}
                onChange={(e) => updateSettings({ bg_transparent: e.target.checked, ...(e.target.checked ? { effect_shadow: "none" } as any : {}) })}
                className="w-3.5 h-3.5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <span>{t("studio.design.transparent")}</span>
            </label>
          </div>
          <div className={`flex items-center gap-2 h-11 px-1 mt-auto border border-outline-variant rounded-lg bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow ${settings.bg_transparent ? 'opacity-40 pointer-events-none' : ''}`}>
            <input name="input_field_34191f8c" aria-label="Input Field"
              type="color"
              value={settings.bg_color}
              onChange={(e) => updateSettings({ bg_color: e.target.value })}
              className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
            />
            <input name="input_field_e03fd4bb" aria-label="Input Field"
              type="text"
              value={settings.bg_color}
              onChange={(e) => updateSettings({ bg_color: e.target.value })}
              className="flex-1 w-full bg-transparent text-sm font-mono tracking-wider border-none outline-none focus:ring-0 px-2 text-on-surface"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-outline-variant/30 pt-4 mt-4">
        <div className="section-label block mb-1">{t("studio.design.dotPattern")}</div>
        <div className="relative group">
          <button
            type="button"
            onClick={() => handleScroll(dotsScrollRef, "left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_back_ios_new</span>
          </button>
          <div ref={dotsScrollRef} className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
            {DOT_STYLES.map((style) => (
              <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
                <StylePreviewCard
                  title={style}
                  isSelected={settings.dots_style === style}
                  onClick={() => updateSettings({ dots_style: style as any })}
                >
                  <img src={`/previews/dots/${style}.png?v=4`} alt={`${style.replace(/_/g, ' ')} dot pattern`} loading="lazy" width={64} height={64} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
                </StylePreviewCard>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleScroll(dotsScrollRef, "right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_forward_ios</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 border-t border-outline-variant/30 pt-4 mt-4">
        <div className="flex justify-between items-center mb-1">
          <div className="section-label block">{t("studio.design.customEyes") || "Eyes Customization"}</div>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline-variant/30 transition-colors">
            <input name="input_field_dfafa1b6" aria-label="Input Field"
              type="checkbox"
              checked={settings.link_eyes !== false}
              onChange={(e) => {
                updateSettings({ link_eyes: e.target.checked });
                if (e.target.checked) setActiveCorner("all");
              }}
              className="w-3.5 h-3.5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span>{t("studio.design.linkEyes") || "Link Eyes"}</span>
          </label>
        </div>

        {settings.link_eyes === false && (
          <div className="flex gap-2 mb-3">
            {['tl', 'tr', 'bl'].map(corner => (
              <button
                key={corner}
                type="button"
                onClick={() => setActiveCorner(corner as any)}
                className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-medium transition-colors ${activeCorner === corner
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                    : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                  }`}
              >
                {corner === 'tl' ? (t("studio.design.cornerTL") || 'Top Left') : corner === 'tr' ? (t("studio.design.cornerTR") || 'Top Right') : (t("studio.design.cornerBL") || 'Bottom Left')}
              </button>
            ))}
          </div>
        )}

        <div className="text-xs font-semibold text-on-surface-variant mb-1 block">{t("studio.design.eyeFrameStyle") || "Frame Style"}</div>
        <div className="relative group mb-4">
          <button
            type="button"
            onClick={() => handleScroll(eyeFrameScrollRef, "left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_back_ios_new</span>
          </button>
          <div ref={eyeFrameScrollRef} className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
            {EYE_FRAME_STYLES.map((style) => {
              const isActiveStyle = (settings.link_eyes !== false || activeCorner === "all")
                ? settings.eye_frame_style === style
                : (settings[`eye_frame_style_${activeCorner}` as keyof typeof settings] === style) || (!settings[`eye_frame_style_${activeCorner}` as keyof typeof settings] && settings.eye_frame_style === style);

              return (
                <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
                  <StylePreviewCard
                    title={style}
                    isSelected={isActiveStyle}
                    onClick={() => {
                      if (settings.link_eyes !== false || activeCorner === "all") {
                        updateSettings({ eye_frame_style: style });
                      } else {
                        updateSettings({ [`eye_frame_style_${activeCorner}`]: style });
                      }
                    }}
                  >
                    <img src={`/previews/eye_frames/${style}.png?v=4`} alt={`${style.replace(/_/g, ' ')} eye frame`} loading="lazy" width={64} height={64} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
                  </StylePreviewCard>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => handleScroll(eyeFrameScrollRef, "right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_forward_ios</span>
          </button>
        </div>

        <div className="text-xs font-semibold text-on-surface-variant mb-1 block">{t("studio.design.eyeballStyle") || "Eyeball Style"}</div>
        <div className="relative group mb-4">
          <button
            type="button"
            onClick={() => handleScroll(eyeballScrollRef, "left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_back_ios_new</span>
          </button>
          <div ref={eyeballScrollRef} className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
            {EYEBALL_STYLES.map((style) => {
              const isActiveStyle = (settings.link_eyes !== false || activeCorner === "all")
                ? settings.eyeball_style === style
                : (settings[`eyeball_style_${activeCorner}` as keyof typeof settings] === style) || (!settings[`eyeball_style_${activeCorner}` as keyof typeof settings] && settings.eyeball_style === style);

              return (
                <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
                  <StylePreviewCard
                    title={style}
                    isSelected={isActiveStyle}
                    onClick={() => {
                      if (settings.link_eyes !== false || activeCorner === "all") {
                        updateSettings({ eyeball_style: style });
                      } else {
                        updateSettings({ [`eyeball_style_${activeCorner}`]: style });
                      }
                    }}
                  >
                    <img src={`/previews/eyeballs/${style}.png?v=4`} alt={`${style.replace(/_/g, ' ')} eyeball style`} loading="lazy" width={64} height={64} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
                  </StylePreviewCard>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => handleScroll(eyeballScrollRef, "right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_forward_ios</span>
          </button>
        </div>

        {/* Dual-Tone Marker Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="section-label flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full border-2 border-primary inline-block"></span>
              {t("studio.design.eyeFrameColor") || "Eye Frame Color"}
            </div>
            <div className="flex items-center gap-2">
              <input name="input_field_3890e682" aria-label="Input Field"
                type="color"
                value={
                  (settings.link_eyes !== false || activeCorner === "all")
                    ? settings.eye_color
                    : ((settings[`eye_color_${activeCorner}` as keyof typeof settings] as string) || settings.eye_color)
                }
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (settings.link_eyes !== false || activeCorner === "all") {
                    updateSettings({
                      eye_color: newColor,
                      eyeball_color: settings.eyeball_color === settings.eye_color ? newColor : settings.eyeball_color
                    });
                  } else {
                    const currentEyeball = (settings[`eyeball_color_${activeCorner}` as keyof typeof settings] as string) || settings.eyeball_color;
                    const currentEye = (settings[`eye_color_${activeCorner}` as keyof typeof settings] as string) || settings.eye_color;
                    updateSettings({
                      [`eye_color_${activeCorner}`]: newColor,
                      [`eyeball_color_${activeCorner}`]: currentEyeball === currentEye ? newColor : currentEyeball
                    });
                  }
                }}
                className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
              />
              <input name="input_field_8f818c0c" aria-label="Input Field"
                type="text"
                value={
                  (settings.link_eyes !== false || activeCorner === "all")
                    ? settings.eye_color
                    : ((settings[`eye_color_${activeCorner}` as keyof typeof settings] as string) || settings.eye_color)
                }
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (settings.link_eyes !== false || activeCorner === "all") {
                    updateSettings({ eye_color: newColor });
                  } else {
                    updateSettings({ [`eye_color_${activeCorner}`]: newColor });
                  }
                }}
                className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="section-label flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              {t("studio.design.eyeballColor") || "Eyeball Color"}
            </div>
            <div className="flex items-center gap-2">
              <input name="input_field_697bbf88" aria-label="Input Field"
                type="color"
                value={
                  (settings.link_eyes !== false || activeCorner === "all")
                    ? (settings.eyeball_color || settings.eye_color)
                    : ((settings[`eyeball_color_${activeCorner}` as keyof typeof settings] as string) || (settings[`eye_color_${activeCorner}` as keyof typeof settings] as string) || settings.eyeball_color || settings.eye_color)
                }
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (settings.link_eyes !== false || activeCorner === "all") {
                    updateSettings({ eyeball_color: newColor });
                  } else {
                    updateSettings({ [`eyeball_color_${activeCorner}`]: newColor });
                  }
                }}
                className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
              />
              <input name="input_field_4806d1ca" aria-label="Input Field"
                type="text"
                value={
                  (settings.link_eyes !== false || activeCorner === "all")
                    ? (settings.eyeball_color || settings.eye_color)
                    : ((settings[`eyeball_color_${activeCorner}` as keyof typeof settings] as string) || (settings[`eye_color_${activeCorner}` as keyof typeof settings] as string) || settings.eyeball_color || settings.eye_color)
                }
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (settings.link_eyes !== false || activeCorner === "all") {
                    updateSettings({ eyeball_color: newColor });
                  } else {
                    updateSettings({ [`eyeball_color_${activeCorner}`]: newColor });
                  }
                }}
                className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
