import { useQRStore } from "@/store/useQRStore";
import { Slider } from "@/components/ui/Slider";
import { StylePreviewCard } from "@/components/previews/StylePreviewCard";
import { FRAME_STYLES, TEXT_STYLES } from "@/data/options";
import { PremiumFontSelect } from "@/components/ui/PremiumFontSelect";
import { useTranslation } from "@/i18n/useTranslation";

const fontStyles = [
  "Outfit (Modern)",
  "Playfair Display (Elegant)",
  "Courier Prime (Retro)",
  "Montserrat (Geometric)",
  "Roboto (Clean)",
  "Lora (Serif)",
  "Poppins (Friendly)",
  "Space Grotesk (Tech)",
  "Cinzel (Classic)",
  "Dancing Script (Cursive)",
  "Fira Code (Monospace)",
  "Oswald (Bold Condensed)"
];

export function FramesPanel() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();

  return (
    <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
      <div className="space-y-3">
        <div className="section-label block mb-1">{t("studio.frames.frameStyle") || "Layout Frame Style"}</div>
        <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
          {FRAME_STYLES.map((style) => (
            <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
              <StylePreviewCard
                title={style}
                isSelected={settings.frame_style === style}
                onClick={() => updateSettings({ frame_style: style as any })}
              >
                <img src={`/previews/frames/${style}.png?v=4`} alt={`${style.replace(/_/g, ' ')} layout frame`} loading="lazy" width={64} height={64} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
              </StylePreviewCard>
            </div>
          ))}
        </div>
      </div>

      {settings.frame_style !== "none" && (
        <div className="space-y-4 pt-4 border-t border-outline-variant/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="block text-xs font-semibold">{t("studio.frames.frameColor") || "Frame Color"}</div>
              <div className="flex items-center gap-3">
                <input name="input_field_9af21930" aria-label="Input Field"
                  type="color"
                  value={settings.frame_color}
                  onChange={(e) => updateSettings({ frame_color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant"
                />
                <span className="text-sm font-mono text-on-surface-variant uppercase">{settings.frame_color}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs font-semibold">{t("studio.logo.padding") || "Frame Padding"}</div>
              <span className="text-xs text-on-surface-variant">{settings.frame_padding}px</span>
            </div>
            <Slider min="0"
              max="100"
              step="1"
              value={settings.frame_padding}
              onChange={(val) => updateSettings({ frame_padding: val })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs font-semibold">{t("studio.logo.cardShape") || "Corner Radius"}</div>
              <span className="text-xs text-on-surface-variant">{settings.frame_radius}px</span>
            </div>
            <Slider min="0"
              max="50"
              step="1"
              value={settings.frame_radius}
              onChange={(val) => updateSettings({ frame_radius: val })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs font-semibold">{t("studio.advanced.quietZone") || "Border Thickness"}</div>
              <span className="text-xs text-on-surface-variant">{settings.frame_border}px</span>
            </div>
            <Slider min="0"
              max="50"
              step="1"
              value={settings.frame_border}
              onChange={(val) => updateSettings({ frame_border: val })}
            />
          </div>
        </div>
      )}

      <div className="space-y-3 pt-4 border-t border-outline-variant/30">
        <div className="section-label block mb-1">{t("studio.frames.frameStyle") || "Text Style"}</div>
        <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
          {TEXT_STYLES.map((style) => (
            <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
              <StylePreviewCard
                title={style}
                isSelected={settings.text_style === style}
                onClick={() => updateSettings({ text_style: style as any })}
              >
                <img src={`/previews/text_styles/${style}.png?v=4`} alt={`${style.replace(/_/g, ' ')} text frame`} loading="lazy" width={64} height={64} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
              </StylePreviewCard>
            </div>
          ))}
        </div>
      </div>

      {settings.text_style !== "none" && (
        <div className="space-y-6">
          <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="block text-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              {t("studio.frames.frameText") || "Customize Frame Text"}
            </div>
            <input name="input_field_0013c25a" aria-label="Input Field"
              type="text"
              value={settings.frame_text}
              onChange={(e) => updateSettings({ frame_text: e.target.value })}
              className="w-full p-4 border-2 border-primary/30 rounded-xl bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-bold text-lg text-center shadow-inner"
              placeholder="e.g. SCAN ME"
            />
          </div>

          <div className="space-y-3">
            <div className="section-label block mb-1">{t("studio.frames.fontFamily") || "Font Style"}</div>
            <PremiumFontSelect
              value={settings.font_name}
              onChange={(font) => updateSettings({ font_name: font as any })}
              fonts={fontStyles}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="block text-xs font-semibold">{t("studio.frames.frameColor") || "Frame Color"}</div>
              <div className="flex items-center gap-3">
                <input name="input_field_367550c4" aria-label="Input Field"
                  type="color"
                  value={settings.frame_color}
                  onChange={(e) => updateSettings({ frame_color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant"
                />
                <span className="text-sm font-mono text-on-surface-variant uppercase">{settings.frame_color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="block text-xs font-semibold">{t("studio.frames.textColor") || "Text Color"}</div>
              <div className="flex items-center gap-3">
                <input name="input_field_265dbdf4" aria-label="Input Field"
                  type="color"
                  value={settings.frame_text_color}
                  onChange={(e) => updateSettings({ frame_text_color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant"
                />
                <span className="text-sm font-mono text-on-surface-variant uppercase">{settings.frame_text_color}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-outline-variant/30">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-semibold">{t("studio.download.resolution") || "Text Size"}</div>
                <span className="text-xs text-on-surface-variant">{settings.frame_text_size}px</span>
              </div>
              <Slider min="20"
                max="120"
                step="1"
                value={settings.frame_text_size}
                onChange={(val) => updateSettings({ frame_text_size: val })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
