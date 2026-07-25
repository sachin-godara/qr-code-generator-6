// Common color for previews
const COLOR = "currentColor";

/** Helper to draw a 3x3 grid of dots */
export function DotPreview({ styleName }: { styleName: string }) {
  // We map the style to an SVG representation.
  // For complex styles, we fall back to a generic rounded box if we don't have an exact match.
  
  const renderDot = (cx: number, cy: number) => {
    switch (styleName) {
      case 'square':
        return <rect x={cx - 10} y={cy - 10} width="20" height="20" fill={COLOR} />;
      case 'circle':
        return <circle cx={cx} cy={cy} r="10" fill={COLOR} />;
      case 'rounded':
      case 'rounded_plus':
      case 'squircle':
        return <rect x={cx - 10} y={cy - 10} width="20" height="20" rx="6" ry="6" fill={COLOR} />;
      case 'diamond':
      case 'rhombus':
        return <polygon points={`${cx},${cy - 10} ${cx + 10},${cy} ${cx},${cy + 10} ${cx - 10},${cy}`} fill={COLOR} />;
      case 'star':
        return (
          <polygon 
            points={`${cx},${cy - 10} ${cx + 3},${cy - 3} ${cx + 10},${cy - 3} ${cx + 4},${cy + 2} ${cx + 6},${cy + 9} ${cx},${cy + 5} ${cx - 6},${cy + 9} ${cx - 4},${cy + 2} ${cx - 10},${cy - 3} ${cx - 3},${cy - 3}`}
            fill={COLOR} 
          />
        );
      case 'cross':
      case 'plus':
      case 'medical_cross':
        return (
          <path d={`M ${cx - 3} ${cy - 10} L ${cx + 3} ${cy - 10} L ${cx + 3} ${cy - 3} L ${cx + 10} ${cy - 3} L ${cx + 10} ${cy + 3} L ${cx + 3} ${cy + 3} L ${cx + 3} ${cy + 10} L ${cx - 3} ${cy + 10} L ${cx - 3} ${cy + 3} L ${cx - 10} ${cy + 3} L ${cx - 10} ${cy - 3} L ${cx - 3} ${cy - 3} Z`} fill={COLOR} />
        );
      case 'hexagon':
        return <polygon points={`${cx},${cy - 10} ${cx + 9},${cy - 5} ${cx + 9},${cy + 5} ${cx},${cy + 10} ${cx - 9},${cy + 5} ${cx - 9},${cy - 5}`} fill={COLOR} />;
      case 'octagon':
        return <polygon points={`${cx - 4},${cy - 10} ${cx + 4},${cy - 10} ${cx + 10},${cy - 4} ${cx + 10},${cy + 4} ${cx + 4},${cy + 10} ${cx - 4},${cy + 10} ${cx - 10},${cy + 4} ${cx - 10},${cy - 4}`} fill={COLOR} />;
      case 'heart':
        return <path d={`M ${cx} ${cy+5} C ${cx} ${cy+5} ${cx-12} ${cy-2} ${cx-10} ${cy-8} C ${cx-8} ${cy-14} ${cx} ${cy-10} ${cx} ${cy-6} C ${cx} ${cy-10} ${cx+8} ${cy-14} ${cx+10} ${cy-8} C ${cx+12} ${cy-2} ${cx} ${cy+5} ${cx} ${cy+5} Z`} fill={COLOR} />;
      case 'vertical_bars':
        return <rect x={cx - 4} y={cy - 12} width="8" height="24" rx="2" fill={COLOR} />;
      case 'horizontal_bars':
        return <rect x={cx - 12} y={cy - 4} width="24" height="8" rx="2" fill={COLOR} />;
      default:
        // Generic fallback shape
        return <circle cx={cx} cy={cy} r="8" fill={COLOR} className="opacity-80" />;
    }
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-primary max-w-[60px] max-h-[60px]">
      {/* 3x3 Grid */}
      {[20, 50, 80].map((cy) => 
        [20, 50, 80].map((cx) => (
          <g key={`${cx}-${cy}`}>
            {renderDot(cx, cy)}
          </g>
        ))
      )}
    </svg>
  );
}

/** Helper to draw an eye frame and eye center together */
export function EyePreview({ frameStyle, eyeballStyle }: { frameStyle: string, eyeballStyle: string }) {
  
  const renderOuter = () => {
    switch (frameStyle) {
      case 'square':
      case 'corner_brackets':
        return (
          <path d="M 10 10 h 80 v 80 h -80 z M 25 25 v 50 h 50 v -50 z" fill={COLOR} fillRule="evenodd" />
        );
      case 'circle':
      case 'double_ring':
      case 'dotted_circle':
        return (
          <path d="M 50 10 a 40 40 0 1 0 0 80 a 40 40 0 1 0 0 -80 M 50 25 a 25 25 0 1 1 0 50 a 25 25 0 1 1 0 -50" fill={COLOR} fillRule="evenodd" />
        );
      case 'rounded':
      case 'left_rounded':
      case 'right_rounded':
        return (
          <path d="M 30 10 h 40 a 20 20 0 0 1 20 20 v 40 a 20 20 0 0 1 -20 20 h -40 a 20 20 0 0 1 -20 -20 v -40 a 20 20 0 0 1 20 -20 z M 35 25 h 30 a 10 10 0 0 1 10 10 v 30 a 10 10 0 0 1 -10 10 h -30 a 10 10 0 0 1 -10 -10 v -30 a 10 10 0 0 1 10 -10 z" fill={COLOR} fillRule="evenodd" />
        );
      case 'leaf':
      case 'droplet_tl':
      case 'droplet_tr':
      case 'droplet_bl':
        return (
          <path d="M 10 10 h 40 a 40 40 0 0 1 40 40 v 40 h -40 a 40 40 0 0 1 -40 -40 z M 25 25 h 25 a 25 25 0 0 1 25 25 v 25 h -25 a 25 25 0 0 1 -25 -25 z" fill={COLOR} fillRule="evenodd" />
        );
      case 'diamond':
        return (
          <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z M 50 25 L 75 50 L 50 75 L 25 50 Z" fill={COLOR} fillRule="evenodd" />
        );
      case 'hexagon':
        return (
          <path d="M 30 10 L 70 10 L 90 50 L 70 90 L 30 90 L 10 50 Z M 37 25 L 63 25 L 75 50 L 63 75 L 37 75 L 25 50 Z" fill={COLOR} fillRule="evenodd" />
        );
      case 'octagon':
        return (
          <path d="M 30 10 L 70 10 L 90 30 L 90 70 L 70 90 L 30 90 L 10 70 L 10 30 Z M 35 25 L 65 25 L 75 35 L 75 65 L 65 75 L 35 75 L 25 65 L 25 35 Z" fill={COLOR} fillRule="evenodd" />
        );
      case 'star':
        return (
          <path d="M 50 5 L 62 35 L 95 35 L 68 55 L 78 85 L 50 65 L 22 85 L 32 55 L 5 35 L 38 35 Z M 50 25 L 57 40 L 75 40 L 60 52 L 65 68 L 50 58 L 35 68 L 40 52 L 25 40 L 43 40 Z" fill={COLOR} fillRule="evenodd" />
        );
      default:
        // Generic square fallback
        return (
          <path d="M 15 15 h 70 v 70 h -70 z M 25 25 v 50 h 50 v -50 z" fill={COLOR} fillRule="evenodd" opacity="0.8" />
        );
    }
  };

  const renderInner = () => {
    switch (eyeballStyle) {
      case 'square':
        return <rect x="35" y="35" width="30" height="30" fill={COLOR} />;
      case 'circle':
        return <circle cx="50" cy="50" r="15" fill={COLOR} />;
      case 'rounded':
      case 'rounded_triangle':
      case 'pinched_square':
        return <rect x="35" y="35" width="30" height="30" rx="8" ry="8" fill={COLOR} />;
      case 'diamond':
      case 'rhombus':
        return <polygon points="50,30 70,50 50,70 30,50" fill={COLOR} />;
      case 'star':
      case 'flower':
        return <polygon points="50,32 55,42 66,44 58,52 60,63 50,58 40,63 42,52 34,44 45,42" fill={COLOR} />;
      case 'cross':
      case 'plus':
        return <path d="M 43 32 h 14 v 11 h 11 v 14 h -11 v 11 h -14 v -11 h -11 v -14 h 11 z" fill={COLOR} />;
      case 'leaf':
      case 'droplet_tl':
      case 'droplet_tr':
      case 'droplet_bl':
        return <path d="M 35 35 h 15 a 15 15 0 0 1 15 15 v 15 h -15 a 15 15 0 0 1 -15 -15 z" fill={COLOR} />;
      case 'hexagon':
        return <polygon points="40,35 60,35 70,50 60,65 40,65 30,50" fill={COLOR} />;
      case 'octagon':
        return <polygon points="40,32 60,32 68,40 68,60 60,68 40,68 32,60 32,40" fill={COLOR} />;
      case 'heart':
        return <path d="M 50 60 C 50 60 30 48 35 38 C 38 30 50 35 50 42 C 50 35 62 30 65 38 C 70 48 50 60 50 60 Z" fill={COLOR} />;
      default:
        return <rect x="38" y="38" width="24" height="24" fill={COLOR} opacity="0.8" />;
    }
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-primary max-w-[60px] max-h-[60px]">
      {renderOuter()}
      {renderInner()}
    </svg>
  );
}

/** Previews for Preset Logos resembling modern UI style guides */
export function PresetLogoPreview({ name }: { name: string }) {
  const size = "w-10 h-10";
  
  if (name === "None") {
    return (
      <svg viewBox="0 0 24 24" className={`${size} text-on-surface-variant/60`}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M7.5 7.5 L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  const gradientClass = {
    Link: "from-[#8b5cf6] to-[#6d28d9]",
    Location: "from-[#ef4444] to-[#dc2626]",
    WiFi: "from-[#0d9488] to-[#0f766e]",
    Vcard: "from-[#3b82f6] to-[#1d4ed8]",
    Email: "from-[#f59e0b] to-[#d97706]",
    Scan: "from-[#ec4899] to-[#be185d]",
    WhatsApp: "from-[#25D366] to-[#128C7E]",
    Instagram: "from-[#833AB4] via-[#FD1D1D] to-[#FCB045]",
    Facebook: "from-[#1877F2] to-[#0A52BE]",
    YouTube: "from-[#FF0000] to-[#C40000]",
    Phone: "from-[#10B981] to-[#059669]",
    Coffee: "from-[#D97706] to-[#78350F]",
    Shopping: "from-[#8B5CF6] to-[#6D28D9]",
    Music: "from-[#06B6D4] to-[#0891B2]",
    Globe: "from-[#3B82F6] to-[#1D4ED8]",
    Heart: "from-[#F43F5E] to-[#BE123C]",
    Star: "from-[#F59E0B] to-[#D97706]"
  }[name] || "from-gray-400 to-gray-600";

  const renderIcon = () => {
    switch (name) {
      case 'Link':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </g>
        );
      case 'Location':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </g>
        );
      case 'WiFi':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </g>
        );
      case 'Vcard':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </g>
        );
      case 'Email':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </g>
        );
      case 'Scan':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M3 17v2a2 2 0 0 1 2 2h2" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </g>
        );
      case 'WhatsApp':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </g>
        );
      case 'Instagram':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </g>
        );
      case 'Facebook':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </g>
        );
      case 'YouTube':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </g>
        );
      case 'Phone':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </g>
        );
      case 'Coffee':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </g>
        );
      case 'Shopping':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </g>
        );
      case 'Music':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </g>
        );
      case 'Globe':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </g>
        );
      case 'Heart':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </g>
        );
      case 'Star':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </g>
        );
      case 'Discord':
        return (
          <g fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${size} rounded-xl bg-gradient-to-br ${gradientClass} p-2 flex items-center justify-center text-white shadow-sm`}>
      <svg viewBox="0 0 24 24" className="w-full h-full">
        {renderIcon()}
      </svg>
    </div>
  );
}

/** Default brand colors for preset icons */
export const PRESET_LOGO_BRAND_COLORS: Record<string, string> = {
  Link: "#6d28d9",
  Location: "#dc2626",
  WiFi: "#0f766e",
  Vcard: "#1d4ed8",
  Email: "#d97706",
  Scan: "#be185d",
  WhatsApp: "#25d366",
  Instagram: "#e1306c",
  Facebook: "#1877f2",
  YouTube: "#ff0000",
  Phone: "#10b981",
  Coffee: "#d97706",
  Shopping: "#8b5cf6",
  Music: "#06b6d4",
  Globe: "#3b82f6",
  Heart: "#f43f5e",
  Star: "#f59e0b",
  Calendar: "#0ea5e9",
  Payment: "#10b981",
  Store: "#f97316",
  Chat: "#3b82f6",
  App: "#8b5cf6",
  Discord: "#5865f2",
  Amazon: "#FF9900"
};

/** Generates crisp PNG data URLs directly in React for preset logos via HTML5 Canvas */
export function getReactLogoPngDataUrl(
  name: string, 
  colorMode: "default" | "custom" = "default", 
  customColorHex: string = "#3b82f6", 
  fallbackDotsColor: string = "#000000"
): Promise<string | null> {
  if (!name || name === "None") return Promise.resolve(null);

  const color = colorMode === "custom" 
    ? (customColorHex.startsWith("#") ? customColorHex : "#3b82f6")
    : (PRESET_LOGO_BRAND_COLORS[name] || (fallbackDotsColor.startsWith("#") ? fallbackDotsColor : "#000000"));
  
  const iconSvgs: Record<string, string> = {
    Link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    Location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    WiFi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    Vcard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M11 15h6M7 11h0M11 11h6"/><circle cx="12" cy="8" r="2"/></svg>`,
    Email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    Scan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>`,
    Phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    WhatsApp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    Instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    Facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    YouTube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>`,
    Coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
    Shopping: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.04-4.04a2 2 0 0 1 2.83 0L13 7"/><path d="M2 7h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M16 11a4 4 0 0 1-8 0"/></svg>`,
    Music: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    Globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
    Heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    Star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    Calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>`,
    Payment: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    Store: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    Chat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    App: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
    Discord: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    Amazon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path fill="${color}" d="M337.8 304.5c-42.5 31.4-104.2 47.7-157.4 47.7-74.4 0-141.6-27.7-192-74-4-3.7-.4-8.8 4.3-5.9 54.4 33.3 124 53.4 194.5 53.4 47.2 0 102.3-12.2 152.1-37.4 7.6-3.8 14.1 3.9 8.5 16.2z"/><path fill="${color}" d="M352.5 287.4c-4.2-5.4-27.8-2.6-38.4-1.3-3.2.4-3.7-2.3-.8-4.4 18.7-13.4 49.3-9.5 52.8-5.1 3.5 4.5-1 35.3-18.4 49.9-2.7 2.3-5.4.8-4.2-2.3 3.9-10.4 13.2-31.4 8.9-36.8z"/><path fill="#000000" d="M211.8 142.1c0 30.1-2.3 54.9-27.8 75.8-13.7 11.2-31 16.8-48.4 16.8-31 0-54.8-18.4-54.8-49.3 0-41.2 36.3-64.8 102.6-64.8v-3.7c0-12.7-7.2-22.1-23.7-22.1-15.1 0-29.4 5.9-37.5 11.7-2.3 1.7-4.7.7-5.9-1.9l-7.7-18.8c-1-2.5.2-4.9 2.7-6.7 13.7-10.1 36-16.7 64-16.7 41.5 0 66.5 22.8 66.5 69.7v10.2zm-28.5 35.2v-24.5c-43.5 0-72.2 11.7-72.2 38.6 0 16.1 11.7 25.5 27.8 25.5 19.8 0 35.7-13.8 44.4-39.6z"/></svg>`
  };

  const svgStr = iconSvgs[name];
  if (!svgStr) return Promise.resolve(null);

  return new Promise((resolve) => {
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 400, 400);
        const pngUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(pngUrl);
      } else {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
