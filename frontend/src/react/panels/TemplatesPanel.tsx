import { useState } from "react";
import { useQRStore } from "@/store/useQRStore";
import { PRESET_TEMPLATES } from "@/data/templates";
import { StylePreviewCard } from "@/components/previews/StylePreviewCard";

const TEMPLATE_CATEGORIES = [
  { id: "All", name: "All", icon: "apps" },
  { id: "WiFi", name: "WiFi", icon: "wifi" },
  { id: "Business", name: "Business", icon: "business_center" },
  { id: "Marketing", name: "Marketing", icon: "campaign" },
  { id: "Restaurant", name: "Restaurant", icon: "restaurant" },
  { id: "Events", name: "Events", icon: "event" },
  { id: "Social", name: "Social", icon: "share" },
  { id: "Retail", name: "Retail", icon: "storefront" },
  { id: "Education", name: "Education", icon: "school" },
  { id: "Premium", name: "Premium", icon: "workspace_premium" },
];

export function TemplatesPanel() {
  const { settings, applyTemplate } = useQRStore();
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>("All");

  const filteredTemplates = PRESET_TEMPLATES.filter(t =>
    t.name === "None" || activeTemplateCategory === "All" || t.category === activeTemplateCategory
  );

  return (
    <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-4">
      <div className="hidden sm:flex overflow-x-auto gap-1.5 px-3 pb-3 mb-1 custom-scrollbar snap-x">
        {TEMPLATE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTemplateCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 tab-spring snap-start ${activeTemplateCategory === cat.id
                ? "bg-primary/10 text-primary shadow-xs border border-primary"
                : "bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant border border-outline-variant/60"
              }`}
          >
            <span className="material-symbols-outlined text-xs">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 max-h-[600px] overflow-y-auto px-3.5 pt-3.5 pb-6 custom-scrollbar">
        {filteredTemplates.map((template) => {
          const cleanName = template.name.toLowerCase().replace(/\s+/g, "_");
          const isSelected = Object.keys(template.settings).every(
            (key) => settings[key as keyof typeof settings] === template.settings[key as keyof typeof template.settings]
          );

          return (
            <StylePreviewCard
              key={template.name}
              title={template.name}
              isSelected={isSelected}
              onClick={() => applyTemplate(template.settings)}
            >
              <div className="relative w-full h-full group/template">
                <img
                  src={`/previews/templates/${cleanName}.png?v=5`}
                  alt={`${template.name} QR code template`}
                  loading="lazy"
                  width={120}
                  height={120}
                  className="w-full h-full object-contain p-2.5 transition-transform duration-300 group-hover/template:scale-[1.03]"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))" }}
                />
                {/* Overlay dots for primary colors */}
                <div className="absolute bottom-1 right-1 flex gap-0.5 bg-white/90 backdrop-blur-[2px] p-0.5 rounded-full shadow-sm border border-outline-variant/30 opacity-80 group-hover/template:opacity-100 transition-opacity">
                  <span
                    className="w-2 h-2 rounded-full border border-black/10"
                    style={{ backgroundColor: template.settings.dots_color || "#000" }}
                    title={`Foreground: ${template.settings.dots_color}`}
                  />
                  <span
                    className="w-2 h-2 rounded-full border border-black/10"
                    style={{ backgroundColor: template.settings.bg_color || "#fff" }}
                    title={`Background: ${template.settings.bg_color}`}
                  />
                </div>
              </div>
            </StylePreviewCard>
          );
        })}
      </div>
    </div>
  );
}
