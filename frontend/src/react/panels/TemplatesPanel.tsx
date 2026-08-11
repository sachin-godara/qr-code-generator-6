import { useState } from "react";
import { motion } from "framer-motion";
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
      <div className="hidden sm:flex overflow-x-auto gap-1 p-1 bg-surface-container-low rounded-xl custom-scrollbar snap-x mb-2 border border-outline-variant/30">
        {TEMPLATE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTemplateCategory(cat.id)}
            className={`relative px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors duration-200 flex items-center justify-center snap-start outline-none ${activeTemplateCategory === cat.id
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
              }`}
          >
            {activeTemplateCategory === cat.id && (
              <motion.div
                layoutId="templates-active-tab"
                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
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
