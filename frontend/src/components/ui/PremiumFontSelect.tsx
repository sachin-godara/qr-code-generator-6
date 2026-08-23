import { useState, useRef, useEffect } from "react";

interface PremiumFontSelectProps {
  value: string;
  onChange: (font: string) => void;
  fonts: string[];
}

const GOOGLE_FRAME_FONTS = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Courier+Prime:wght@400;700&family=Dancing+Script:wght@400;700&family=Fira+Code:wght@400;700&family=Geist:wght@400;600&family=Lora:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Outfit:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;700&family=Roboto:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap";

function loadFrameFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("frame-custom-fonts")) return;
  const link = document.createElement("link");
  link.id = "frame-custom-fonts";
  link.rel = "stylesheet";
  link.href = GOOGLE_FRAME_FONTS;
  document.head.appendChild(link);
}

export function PremiumFontSelect({ value, onChange, fonts }: PremiumFontSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFrameFonts();
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedFontFamily = value.split(" (")[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 border-2 border-outline-variant bg-white rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none group hover:border-primary/50"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-lg shadow-inner border border-primary/10"
            style={{ fontFamily: selectedFontFamily }}
          >
            Ag
          </div>
          <span 
            className="font-semibold text-on-surface text-sm"
            style={{ fontFamily: selectedFontFamily }}
          >
            {value}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "group-hover:text-primary/70"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_12px_40px_-10px_rgb(0,0,0,0.15)] rounded-2xl overflow-hidden max-h-72 flex flex-col custom-scrollbar ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 flex flex-col gap-1 overflow-y-auto">
            {fonts.map((font) => {
              const fontFamily = font.split(" (")[0];
              const isSelected = value === font;
              return (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    onChange(font);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-primary text-white shadow-md shadow-primary/30" 
                      : "hover:bg-primary/5 text-on-surface hover:translate-x-1"
                  }`}
                >
                  <span 
                    className={`text-2xl leading-none w-10 text-center ${isSelected ? "text-white" : "text-primary/70"}`}
                    style={{ fontFamily }}
                  >
                    Ag
                  </span>
                  <span 
                    className="text-sm font-semibold tracking-wide"
                    style={{ fontFamily }}
                  >
                    {font}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
