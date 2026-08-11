import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQRStore } from "@/store/useQRStore";
import { Slider } from "@/components/ui/Slider";
import { ScannabilityAlert } from "@/components/ui/ScannabilityAlert";
import { PresetLogoPreview, LOGO_ITEMS, LOGO_CATEGORIES } from "@/components/previews/SvgIcons";

const logoCardShapes = ["None", "Circle", "Rounded Square"];

export function LogoPanel() {
  const { settings, updateSettings } = useQRStore();
  const [logoSearchQuery, setLogoSearchQuery] = useState("");
  const [activeLogoCategory, setActiveLogoCategory] = useState("All");

  const filteredLogos = useMemo(() => {
    let result = LOGO_ITEMS.filter(l => l.id !== "None"); // Exclude "None" from grid
    
    if (activeLogoCategory !== "All") {
      result = result.filter(l => l.category === activeLogoCategory);
    }
    
    if (logoSearchQuery) {
      const q = logoSearchQuery.toLowerCase();
      result = result.filter(l => 
        l.label.toLowerCase().includes(q) || 
        l.keywords?.some((k: string) => k.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeLogoCategory, logoSearchQuery]);

  const hasLogo = settings.preset_logo !== "None" || !!settings.logo_image;

  return (
    <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
      {/* Custom Premium Drag-and-Drop Zone */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/40 rounded-2xl p-4 sm:p-5 bg-surface/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer relative group overflow-hidden gap-3">
          <input name="input_field_795cd72c" aria-label="Input Field"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateSettings({
                    logo_image: reader.result as string,
                    preset_logo: "None"
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />

          {settings.logo_image ? (
            <div className="flex flex-row items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm bg-white p-1 relative group/thumb transition-transform group-hover:scale-105 shrink-0">
                <img src={settings.logo_image} alt="Uploaded logo preview" className="w-full h-full object-contain rounded-lg" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg z-20 backdrop-blur-[1px]">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateSettings({ logo_image: null });
                    }}
                    className="p-1.5 bg-error text-white rounded-full hover:bg-error/90 transition-transform hover:scale-110 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[14px] leading-none">delete_forever</span>
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-bold text-on-surface">Custom Logo Loaded</p>
                <p className="text-[10px] text-on-surface-variant/80 font-medium">Click or drag to replace</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-3 text-left z-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm border border-primary/10 shrink-0">
                <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-on-surface">Upload your logo</p>
                <p className="text-[10px] text-on-surface-variant font-medium">PNG, JPG, WEBP</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-outline-variant/50"></div>
        <span className="flex-shrink-0 mx-4 text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">OR CHOOSE PRESET ICON</span>
        <div className="flex-grow border-t border-outline-variant/50"></div>
      </div>
      
      {/* Visual Theme Style Selector (Inspired by Phosphor Icons & iOS 18) */}
      <div className="space-y-2 p-3.5 bg-gradient-to-br from-surface-container-lowest via-surface/60 to-surface-container-low rounded-2xl border border-outline-variant/60 shadow-2xs">
        <div className="text-xs font-bold text-on-surface flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
            Icon Visual Style
          </span>
        </div>
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50">
          {[
            { id: "badge", label: "Brand Badge" },
            { id: "duotone", label: "Soft Glass" },
            { id: "glyph", label: "Pure Glyph" },
          ].map((style) => {
            const isSelected = (settings.logo_icon_style || "badge") === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  const updates: any = { logo_icon_style: style.id };
                  if (style.id === "glyph") {
                    updates.logo_clear_size = 0;
                  }
                  updateSettings(updates);
                }}
                className={`relative flex-1 py-1.5 px-2 rounded-md font-bold transition-colors text-xs outline-none ${
                  isSelected ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="logo-icon-style-tab"
                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{style.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Icon Studio: Search & Category Filter Pills */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="section-label flex items-center gap-1.5 font-bold text-on-surface">
            <span className="material-symbols-outlined text-sm text-primary">grid_view</span>
            Preset Icon Gallery ({filteredLogos.length})
            {settings.preset_logo !== "None" && !settings.logo_image && (
              <button
                type="button"
                onClick={() => updateSettings({ preset_logo: "None" })}
                className="ml-1 text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-full hover:bg-error/20 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">search</span>
            <input name="input_field_b532f4d3" aria-label="Search icons..."
              type="text"
              placeholder="Search icons..."
              value={logoSearchQuery}
              onChange={(e) => setLogoSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-surface/50 border border-outline-variant rounded-xl text-xs placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {logoSearchQuery && (
              <button
                type="button"
                onClick={() => setLogoSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5 rounded-full"
              >
                <span className="material-symbols-outlined text-sm leading-none">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex overflow-x-auto gap-1 p-1 bg-surface-container-low rounded-xl custom-scrollbar snap-x mb-2 border border-outline-variant/30">
          {LOGO_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveLogoCategory(category)}
              className={`relative px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors duration-200 flex items-center justify-center snap-start outline-none ${activeLogoCategory === category
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
                }`}
            >
              {activeLogoCategory === category && (
                <motion.div
                  layoutId="logo-category-active-tab"
                  className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-1.5">
                {category === "All" && <span className="material-symbols-outlined text-[16px]">apps</span>}
                {category === "Social & Apps" && <span className="material-symbols-outlined text-[16px]">share</span>}
                {category === "Tech & Contact" && <span className="material-symbols-outlined text-[16px]">contact_page</span>}
                {category === "Business & Pay" && <span className="material-symbols-outlined text-[16px]">payments</span>}
                {category === "Media & More" && <span className="material-symbols-outlined text-[16px]">play_circle</span>}
                {category}
              </div>
            </button>
          ))}
        </div>

        {/* Reactive Icon Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-2.5 max-h-[340px] overflow-y-auto p-2 sm:p-3.5 border border-outline-variant/40 rounded-2xl bg-surface/20">
          {filteredLogos.length > 0 ? (
            filteredLogos.map((item) => {
              const isSelected = settings.preset_logo === item.id && !settings.logo_image;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateSettings({ preset_logo: item.id as any, logo_image: null })}
                  className={`p-2 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 border transition-all duration-200 group relative ${isSelected
                      ? "bg-primary/10 text-primary border-primary border-2 ring-2 ring-primary/15 shadow-sm font-semibold"
                      : "bg-white hover:bg-surface-container-lowest border-outline-variant hover:border-primary/40 text-on-surface shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                    }`}
                >
                  <PresetLogoPreview
                    name={item.id}
                    colorMode={settings.logo_color_mode || "default"}
                    customColor={settings.logo_custom_color || "#000000"}
                    cardShape={settings.logo_card_shape || "Rounded Square"}
                    iconStyle={settings.logo_icon_style || "badge"}
                  />
                  <span className="text-[10px] sm:text-[11px] line-clamp-2 sm:truncate max-w-full font-medium tracking-tight text-center leading-tight">{item.label}</span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white"></div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl opacity-40 block mb-1">search_off</span>
              <p className="text-xs font-semibold">No icons match "{logoSearchQuery}"</p>
              <button
                type="button"
                onClick={() => { setLogoSearchQuery(""); setActiveLogoCategory("All"); }}
                className="mt-2 text-[11px] text-primary hover:underline font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preset Logo Color Mode & Color Picker */}
      {settings.preset_logo !== "None" && !settings.logo_image && (
        <div className="space-y-3 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant">
          <div className="block text-xs font-bold text-on-surface flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">palette</span>
              Preset Logo Color
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono uppercase">
              {settings.logo_color_mode === "default" ? "Default Brand Color" : settings.logo_custom_color}
            </span>
          </div>
          <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 mb-2">
            <button
              type="button"
              onClick={() => updateSettings({ logo_color_mode: "default" })}
              className={`relative flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center transition-colors outline-none ${settings.logo_color_mode === "default"
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
                }`}
            >
              {settings.logo_color_mode === "default" && (
                <motion.div
                  layoutId="logo-color-mode-active-tab"
                  className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">color_lens</span>
                Default Brand
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ logo_color_mode: "custom" })}
              className={`relative flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center transition-colors outline-none ${settings.logo_color_mode === "custom"
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
                }`}
            >
              {settings.logo_color_mode === "custom" && (
                <motion.div
                  layoutId="logo-color-mode-active-tab"
                  className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">colorize</span>
                Custom Color
              </div>
            </button>
          </div>

          {settings.logo_color_mode === "custom" && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <div className="text-[11px] font-semibold text-on-surface-variant block">Pick Custom Icon Color:</div>
              <div className="flex items-center gap-3">
                <input name="input_field_eb60c408" aria-label="Input Field"
                  type="color"
                  value={settings.logo_custom_color || "#000000"}
                  onChange={(e) => updateSettings({ logo_custom_color: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white"
                />
                <input name="input_field_5aff6080" aria-label="Input Field"
                  type="text"
                  value={settings.logo_custom_color || "#000000"}
                  onChange={(e) => updateSettings({ logo_custom_color: e.target.value })}
                  className="flex-1 p-2 text-xs font-mono border border-outline-variant rounded-lg bg-white uppercase"
                />
              </div>
              {/* Preset Color Swatches */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["#000000", "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ffffff"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateSettings({ logo_custom_color: c })}
                    className={`w-6 h-6 rounded-full border border-outline-variant/60 shadow-xs transition-transform hover:scale-110 ${(settings.logo_custom_color || "#000000").toLowerCase() === c ? "ring-2 ring-primary ring-offset-1" : ""
                      }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hasLogo && (
        <div className="space-y-6 pt-4 border-t border-outline-variant/30">
          {/* Logo Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm opacity-70">aspect_ratio</span>
                Logo Size
              </div>
              <span className="text-xs text-on-surface-variant font-medium">{Math.round(settings.logo_size_ratio * 100)}%</span>
            </div>
            <Slider min="0.10"
              max="0.30"
              step="0.01"
              value={settings.logo_size_ratio}
              onChange={(val) => updateSettings({ logo_size_ratio: val })}
            />
            <ScannabilityAlert
              show={settings.logo_size_ratio > 0.18}
              message="Test scan recommended"
              compact={true}
            />
          </div>

          {/* Dot Clearance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm opacity-70">grid_off</span>
                Dot Clearance Around Logo
              </div>
              <span className="text-xs text-on-surface-variant font-medium">
                {settings.logo_clear_size === -1
                  ? "None (Overlap)"
                  : settings.logo_clear_size === 0
                    ? "Tight (0 dots)"
                    : `${settings.logo_clear_size.toFixed(1)} dots`}
              </span>
            </div>
            <Slider min="-1"
              max="2"
              step="0.1"
              value={settings.logo_clear_size}
              onChange={(val) => updateSettings({ logo_clear_size: val })}
            />
            <ScannabilityAlert
              show={settings.logo_clear_size > 0.5}
              message="Test scan recommended"
              compact={true}
            />
            <p className="text-[10px] text-on-surface-variant/80">
              Fine-tune the circular spacing around the logo to clear individual dots smoothly.
            </p>
          </div>

          {/* Logo Card Shape */}
          <div className="space-y-3">
            <div className="block text-xs font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm opacity-70">layers</span>
              Logo Card Shape
            </div>
            <div className="grid grid-cols-3 gap-2">
              {logoCardShapes.map((shape) => {
                const isSelected = settings.logo_card_shape === shape;
                return (
                  <button
                    key={shape}
                    onClick={() => updateSettings({ logo_card_shape: shape as any })}
                    className={`py-2.5 px-1 sm:p-3 border rounded-xl text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-200 overflow-hidden text-center touch-press ${isSelected
                      ? "bg-primary/10 text-primary border-primary font-bold shadow-sm ring-2 ring-primary/15"
                      : "bg-white hover:bg-muted border-outline-variant text-on-surface"
                      }`}
                  >
                    {shape === "None" && <span className="material-symbols-outlined text-base sm:text-sm shrink-0">block</span>}
                    {shape === "Circle" && <span className="material-symbols-outlined text-base sm:text-sm shrink-0">circle</span>}
                    {shape === "Rounded Square" && <span className="material-symbols-outlined text-base sm:text-sm shrink-0">crop_square</span>}
                    <span className="truncate max-w-full text-[11px] sm:text-xs leading-tight">
                      {shape === "Rounded Square" ? (
                        <>
                          <span className="sm:hidden">Square</span>
                          <span className="hidden sm:inline">Rounded Square</span>
                        </>
                      ) : shape}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Padding (only if Card Shape !== "None") */}
          {settings.logo_card_shape !== "None" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm opacity-70">space_bar</span>
                  Card Padding
                </div>
                <span className="text-xs text-on-surface-variant">{settings.logo_card_padding}px</span>
              </div>
              <Slider min="0"
                max="30"
                step="1"
                value={settings.logo_card_padding}
                onChange={(val) => updateSettings({ logo_card_padding: val })}
              />
            </div>
          )}

          {/* Remove Logo Background Color (only for custom uploaded logo) */}
          {!!settings.logo_image && (
            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remove_logo_bg"
                  checked={settings.remove_logo_bg}
                  onChange={(e) => updateSettings({ remove_logo_bg: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
                />
                <label htmlFor="remove_logo_bg" className="text-sm font-semibold cursor-pointer">
                  Remove Logo Background Color
                </label>
              </div>

              {settings.remove_logo_bg && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="block text-xs font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm opacity-70">palette</span>
                      Color to Remove
                    </div>
                    <div className="flex items-center gap-3">
                      <input name="input_field_0e4aa9f5" aria-label="Input Field"
                        type="color"
                        value={settings.logo_bg_color}
                        onChange={(e) => updateSettings({ logo_bg_color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant"
                      />
                      <span className="text-sm font-mono text-on-surface-variant uppercase">{settings.logo_bg_color}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm opacity-70">tune</span>
                        Color Tolerance
                      </div>
                      <span className="text-xs text-on-surface-variant">{settings.logo_bg_tolerance}</span>
                    </div>
                    <Slider min="0"
                      max="150"
                      step="1"
                      value={settings.logo_bg_tolerance}
                      onChange={(val) => updateSettings({ logo_bg_tolerance: val })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
