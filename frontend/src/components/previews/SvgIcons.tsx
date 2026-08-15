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

export interface LogoMetadata {
  id: string;
  label: string;
  category: string;
  tags: string[];
  gradient: string;
  keywords?: string[];
}

export const LOGO_CATEGORIES = ["All", "Social & Apps", "Tech & Contact", "Business & Pay", "Media & More"];

export const LOGO_ITEMS: LogoMetadata[] = [
  { id: "None", label: "None", category: "All", tags: ["none", "empty", "clear", "no logo"], gradient: "" },
  // Social & Apps
  { id: "WhatsApp", label: "WhatsApp", category: "Social & Apps", tags: ["chat", "msg", "message", "social", "phone", "whatsapp"], gradient: "from-[#25D366] to-[#128C7E]" },
  { id: "Instagram", label: "Instagram", category: "Social & Apps", tags: ["insta", "ig", "social", "photo", "meta", "instagram"], gradient: "from-[#833AB4] via-[#FD1D1D] to-[#FCB045]" },
  { id: "Facebook", label: "Facebook", category: "Social & Apps", tags: ["fb", "social", "meta", "facebook"], gradient: "from-[#1877F2] to-[#0A52BE]" },
  { id: "YouTube", label: "YouTube", category: "Social & Apps", tags: ["yt", "video", "stream", "social", "youtube"], gradient: "from-[#FF0000] to-[#C40000]" },
  { id: "Pinterest", label: "Pinterest", category: "Social & Apps", tags: ["pin", "social", "board", "pinterest"], gradient: "from-[#E60023] to-[#B5001C]" },
  { id: "Snapchat", label: "Snapchat", category: "Social & Apps", tags: ["snap", "social", "ghost", "snapchat"], gradient: "from-[#FFFC00] to-[#E5E200]" },
  { id: "TikTok", label: "TikTok", category: "Social & Apps", tags: ["tk", "video", "social", "reels", "tiktok"], gradient: "from-[#111111] to-[#000000]" },
  { id: "X", label: "X (Twitter)", category: "Social & Apps", tags: ["twitter", "tweet", "x", "social", "news"], gradient: "from-[#14171a] to-[#000000]" },
  { id: "LinkedIn", label: "LinkedIn", category: "Social & Apps", tags: ["work", "job", "business", "social", "network", "pro", "linkedin"], gradient: "from-[#0077b5] to-[#0a66c2]" },
  { id: "Telegram", label: "Telegram", category: "Social & Apps", tags: ["tg", "chat", "send", "message", "social", "telegram"], gradient: "from-[#2AABEE] to-[#2291C3]" },
  { id: "Spotify", label: "Spotify", category: "Social & Apps", tags: ["music", "audio", "listen", "podcast", "spotify"], gradient: "from-[#1ED760] to-[#128C3D]" },
  { id: "Netflix", label: "Netflix", category: "Social & Apps", tags: ["movie", "video", "stream", "watch", "netflix"], gradient: "from-[#E50914] to-[#B00710]" },
  { id: "Twitch", label: "Twitch", category: "Social & Apps", tags: ["game", "stream", "live", "gaming", "twitch"], gradient: "from-[#9146FF] to-[#602AC4]" },
  { id: "GitHub", label: "GitHub", category: "Tech & Contact", tags: ["code", "dev", "git", "repo", "github"], gradient: "from-[#181717] to-[#000000]" },
  { id: "Reddit", label: "Reddit", category: "Social & Apps", tags: ["social", "forum", "news", "reddit"], gradient: "from-[#FF4500] to-[#CC3700]" },
  { id: "Discord", label: "Discord", category: "Social & Apps", tags: ["chat", "gaming", "talk", "server", "discord"], gradient: "from-[#5865F2] to-[#404EED]" },
  { id: "Chat", label: "Chat", category: "Social & Apps", tags: ["message", "sms", "text", "support", "chat", "talk"], gradient: "from-[#3b82f6] to-[#1d4ed8]" },
  { id: "App", label: "Mobile App", category: "Social & Apps", tags: ["store", "mobile", "ios", "android", "software", "app"], gradient: "from-[#8b5cf6] to-[#6d28d9]" },
  // Tech & Contact
  { id: "Link", label: "Link", category: "Tech & Contact", tags: ["url", "website", "web", "browser", "share", "link", "http"], gradient: "from-[#8b5cf6] to-[#6d28d9]" },
  { id: "Location", label: "Location", category: "Tech & Contact", tags: ["map", "pin", "place", "gps", "address", "location"], gradient: "from-[#ef4444] to-[#dc2626]" },
  { id: "WiFi", label: "WiFi", category: "Tech & Contact", tags: ["internet", "network", "wireless", "connect", "wifi"], gradient: "from-[#0d9488] to-[#0f766e]" },
  { id: "Vcard", label: "VCard", category: "Tech & Contact", tags: ["contact", "person", "card", "id", "phonebook", "vcard", "business card"], gradient: "from-[#3b82f6] to-[#1d4ed8]" },
  { id: "Email", label: "Email", category: "Tech & Contact", tags: ["mail", "send", "letter", "inbox", "email", "gmail"], gradient: "from-[#f59e0b] to-[#d97706]" },
  { id: "Phone", label: "Phone", category: "Tech & Contact", tags: ["call", "mobile", "number", "tel", "phone", "contact"], gradient: "from-[#10B981] to-[#059669]" },
  { id: "Scan", label: "Scan QR", category: "Tech & Contact", tags: ["qr", "barcode", "camera", "detect", "scan"], gradient: "from-[#ec4899] to-[#be185d]" },
  { id: "Calendar", label: "Calendar", category: "Tech & Contact", tags: ["date", "event", "schedule", "time", "meet", "calendar"], gradient: "from-[#38bdf8] to-[#0284c7]" },
  { id: "Maps", label: "Google Maps", category: "Tech & Contact", tags: ["map", "location", "google", "maps"], gradient: "from-[#4285F4] to-[#34A853]" },
  { id: "Play", label: "Google Play", category: "Tech & Contact", tags: ["store", "app", "google", "play"], gradient: "from-[#3BCCFF] to-[#0496FF]" },
  { id: "Gmail", label: "Gmail", category: "Tech & Contact", tags: ["email", "mail", "google", "gmail"], gradient: "from-[#EA4335] to-[#C5221F]" },
  { id: "Forms", label: "Google Forms", category: "Tech & Contact", tags: ["doc", "form", "google", "forms"], gradient: "from-[#7248B9] to-[#5C3A95]" },
  { id: "Docs", label: "Google Docs", category: "Tech & Contact", tags: ["doc", "document", "google", "docs"], gradient: "from-[#4285F4] to-[#2B60CE]" },
  { id: "ScanMe", label: "Scan Me", category: "Tech & Contact", tags: ["scan", "me", "qrcode", "badge"], gradient: "from-[#ef4444] to-[#dc2626]" },
  { id: "PDF", label: "PDF", category: "Tech & Contact", tags: ["document", "file", "pdf", "acrobat"], gradient: "from-[#F40F02] to-[#B30B00]" },

  // Business & Pay
  { id: "Shopping", label: "Shopping", category: "Business & Pay", tags: ["bag", "cart", "store", "ecommerce", "buy", "shopping", "retail"], gradient: "from-[#8B5CF6] to-[#6D28D9]" },
  { id: "Amazon", label: "Amazon", category: "Business & Pay", tags: ["shop", "store", "buy", "package", "delivery", "amazon", "prime"], gradient: "from-[#FF9900] to-[#E67E00]" },
  { id: "PayPal", label: "PayPal", category: "Business & Pay", tags: ["pay", "money", "transfer", "wallet", "cash", "paypal"], gradient: "from-[#003087] to-[#0079c1]" },
  { id: "Payment", label: "Payment", category: "Business & Pay", tags: ["credit", "card", "bank", "pay", "checkout", "payment"], gradient: "from-[#34d399] to-[#059669]" },
  { id: "Store", label: "Storefront", category: "Business & Pay", tags: ["shop", "retail", "business", "building", "market", "store"], gradient: "from-[#fb923c] to-[#ea580c]" },
  { id: "Coffee", label: "Coffee", category: "Business & Pay", tags: ["cafe", "drink", "food", "restaurant", "tea", "cup", "coffee"], gradient: "from-[#D97706] to-[#78350F]" },

  // Media & More
  { id: "Music", label: "Music", category: "Media & More", tags: ["song", "audio", "sound", "play", "listen", "music"], gradient: "from-[#06B6D4] to-[#0891B2]" },
  { id: "Vimeo", label: "Vimeo", category: "Media & More", tags: ["video", "stream", "vimeo"], gradient: "from-[#1AB7EA] to-[#169CB8]" },
  { id: "WeChat", label: "WeChat", category: "Media & More", tags: ["chat", "social", "wechat"], gradient: "from-[#07C160] to-[#06AD56]" },
  { id: "Yelp", label: "Yelp", category: "Media & More", tags: ["review", "food", "yelp"], gradient: "from-[#FF1A1A] to-[#D91616]" },
  { id: "Globe", label: "Globe", category: "Media & More", tags: ["earth", "world", "international", "planet", "web", "globe"], gradient: "from-[#3B82F6] to-[#1D4ED8]" },
  { id: "Heart", label: "Heart", category: "Media & More", tags: ["love", "favorite", "like", "health", "heart"], gradient: "from-[#F43F5E] to-[#BE123C]" },
  { id: "Star", label: "Star", category: "Media & More", tags: ["rating", "favorite", "review", "special", "top", "star"], gradient: "from-[#F59E0B] to-[#D97706]" }
];

export interface PresetLogoPreviewProps {
  name: string;
  colorMode?: "default" | "custom";
  customColor?: string;
  cardShape?: "None" | "Circle" | "Rounded Square";
  iconStyle?: "badge" | "duotone" | "glyph";
}

/** Previews for Preset Logos resembling modern UI style guides with reactive styling */
export function PresetLogoPreview({ name, colorMode = "default", customColor, cardShape = "Rounded Square", iconStyle = "badge" }: PresetLogoPreviewProps) {
  const size = "w-10 h-10";
  
  if (name === "None") {
    return (
      <svg viewBox="0 0 24 24" className={`${size} text-on-surface-variant/60`}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M7.5 7.5 L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  const meta = LOGO_ITEMS.find(item => item.id === name);

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
          <g fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
      case 'Calendar':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </g>
        );
      case 'Payment':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </g>
        );
      case 'Store':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </g>
        );
      case 'Chat':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </g>
        );
      case 'PDF':
        return (
          <g fill="currentColor">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM14 11h1V8.5h-1V11zM6 20V6H4v14c0 1.1.9 2 2 2h14v-2H6z"/>
          </g>
        );
      case 'App':
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </g>
        );
      case 'Discord':
        return (
          <g fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </g>
        );
      case 'Amazon':
        return (
          <g fill="currentColor">
            <path d="M337.8 304.5c-42.5 31.4-104.2 47.7-157.4 47.7-74.4 0-141.6-27.7-192-74-4-3.7-.4-8.8 4.3-5.9 54.4 33.3 124 53.4 194.5 53.4 47.2 0 102.3-12.2 152.1-37.4 7.6-3.8 14.1 3.9 8.5 16.2z"/>
            <path d="M352.5 287.4c-4.2-5.4-27.8-2.6-38.4-1.3-3.2.4-3.7-2.3-.8-4.4 18.7-13.4 49.3-9.5 52.8-5.1 3.5 4.5-1 35.3-18.4 49.9-2.7 2.3-5.4.8-4.2-2.3 3.9-10.4 13.2-31.4 8.9-36.8z"/>
            <path d="M211.8 142.1c0 30.1-2.3 54.9-27.8 75.8-13.7 11.2-31 16.8-48.4 16.8-31 0-54.8-18.4-54.8-49.3 0-41.2 36.3-64.8 102.6-64.8v-3.7c0-12.7-7.2-22.1-23.7-22.1-15.1 0-29.4 5.9-37.5 11.7-2.3 1.7-4.7.7-5.9-1.9l-7.7-18.8c-1-2.5.2-4.9 2.7-6.7 13.7-10.1 36-16.7 64-16.7 41.5 0 66.5 22.8 66.5 69.7v10.2zm-28.5 35.2v-24.5c-43.5 0-72.2 11.7-72.2 38.6 0 16.1 11.7 25.5 27.8 25.5 19.8 0 35.7-13.8 44.4-39.6z"/>
          </g>
        );
      case 'TikTok':
        return (
          <g fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
          </g>
        );
      case 'X':
        return (
          <g fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </g>
        );
      case 'LinkedIn':
        return (
          <g fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.46a1.64 1.64 0 0 0-1.64 1.64 1.64 1.64 0 0 0 1.64 1.65 1.64 1.64 0 0 0 1.64-1.65 1.64 1.64 0 0 0-1.64-1.64Z"/>
          </g>
        );
      case 'Telegram':
        return (
          <g fill="currentColor">
            <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
          </g>
        );
      case 'PayPal':
        return (
          <g fill="currentColor">
            <path d="M10.15 3.337h4.88c2.91 0 5.16 1.41 5.16 4.3 0 3.37-2.67 5.76-5.83 5.76h-1.95l-1.12 7.15H7.72l2.43-17.21zm2.34 3.01l-.78 5.02h1.69c1.69 0 3.01-.98 3.01-2.61 0-1.61-1.27-2.41-2.73-2.41h-1.19z"/>
          </g>
        );
      case 'Spotify':
        return (
          <g fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.335.132-.67.468-.746 3.808-.87 7.076-.5 9.713 1.114.294.18.386.563.208.857zm1.223-2.723c-.226.367-.7.482-1.066.257-2.686-1.65-6.78-2.13-9.965-1.166-.412.125-.848-.106-.973-.517-.125-.412.106-.848.517-.973 3.654-1.106 8.163-.572 11.23 1.332.366.225.481.698.257 1.067zm.104-2.831C14.692 8.95 8.525 8.75 4.965 9.832c-.493.15-.1019-.126-1.167-.62-.15-.494.126-1.019.62-1.167 4.086-1.24 10.87-1.015 14.484 1.13.442.262.588.832.326 1.274-.262.443-.832.588-1.325.326z"/>
          </g>
        );
      case 'Pinterest':
        return (
          <g fill="currentColor">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
          </g>
        );
      case 'Snapchat':
        return (
          <g fill="currentColor">
            <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
          </g>
        );
      case 'Maps':
        return (
          <g fill="currentColor">
            <path d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z"/>
          </g>
        );
      case 'Play':
        return (
          <g fill="currentColor">
            <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
          </g>
        );
      case 'Gmail':
        return (
          <g fill="currentColor">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
          </g>
        );
      case 'WeChat':
        return (
          <g fill="currentColor">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
          </g>
        );
      case 'Vimeo':
        return (
          <g fill="currentColor">
            <path d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457a315.06 315.06 0 003.501-3.1279c1.579-1.368 2.765-2.085 3.5539-2.159 1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.5069.5389 2.45 1.1309 3.674 1.7759 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.8679 3.434-5.7568 6.7619-5.6368 2.4729.06 3.6279 1.664 3.4929 4.7969z"/>
          </g>
        );
      case 'Yelp':
        return (
          <g fill="currentColor">
            <path d="m7.6885 15.1415-3.6715.8483c-.3769.0871-.755.183-1.1452.155-.2611-.0188-.5122-.0414-.7606-.213a1.179 1.179 0 0 1-.331-.3594c-.3486-.5519-.3656-1.3661-.3697-2.0004a6.2874 6.2874 0 0 1 .3314-2.0642 1.857 1.857 0 0 1 .1073-.2474 2.3426 2.3426 0 0 1 .1255-.2165 2.4572 2.4572 0 0 1 .1563-.1975 1.1736 1.1736 0 0 1 .399-.2831 1.082 1.082 0 0 1 .4592-.0837c.2355.0016.5139.052.91.1734.0555.0191.1237.0382.1856.0572.3277.1013.7048.2404 1.1499.3987.6863.2404 1.3663.487 2.0463.7397l1.2117.4423c.2217.0807.4363.18.6412.297.174.0984.3273.2298.4512.387a1.217 1.217 0 0 1 .192.4309 1.2205 1.2205 0 0 1-.872 1.4522c-.0468.0151-.0852.0239-.1085.0293l-1.105.2553-.0031-.001zM18.8208 7.565a1.8506 1.8506 0 0 0-.2042-.1754 2.4082 2.4082 0 0 0-.2077-.1394 2.3607 2.3607 0 0 0-.2269-.109 1.1705 1.1705 0 0 0-.482-.0796 1.0862 1.0862 0 0 0-.4498.1263c-.2107.1048-.4388.2732-.742.5551-.042.0417-.0947.0886-.142.133-.2502.2351-.5286.5252-.8599.863a114.6363 114.6363 0 0 0-1.5166 1.5629l-.8962.9293a4.1897 4.1897 0 0 0-.4466.5483 1.541 1.541 0 0 0-.2364.5459 1.2199 1.2199 0 0 0 .0107.4518l.0046.02a1.218 1.218 0 0 0 1.4184.923 1.162 1.162 0 0 0 .1105-.0213l4.7781-1.104c.3766-.087.7587-.1667 1.097-.3631.2269-.1316.4428-.262.5909-.5252a1.1793 1.1793 0 0 0 .1405-.4683c.0733-.6512-.2668-1.3908-.5403-1.963a6.2792 6.2792 0 0 0-1.2001-1.7103zM8.9703.0754a8.6724 8.6724 0 0 0-.83.1564c-.2754.066-.548.1383-.8146.2236-.868.2844-2.0884.8063-2.295 1.8065-.1165.5655.1595 1.1439.3737 1.66.2595.6254.614 1.1889.9373 1.7777.8543 1.5545 1.7245 3.0993 2.5922 4.6457.259.4617.5416 1.0464 1.043 1.2856a1.058 1.058 0 0 0 .1013.0383c.2248.0851.4699.1016.7041.0471a4.3015 4.3015 0 0 0 .0418-.0097 1.2136 1.2136 0 0 0 .5658-.3397 1.1033 1.1033 0 0 0 .079-.0822c.3463-.435.3454-1.0833.3764-1.6134.1042-1.771.2139-3.5423.3009-5.3142.0332-.6712.1055-1.3333.0655-2.0096-.0328-.5579-.0368-1.1984-.3891-1.6563-.6218-.8073-1.9476-.741-2.8523-.6158zm2.084 15.9505a1.1053 1.1053 0 0 0-1.2306-.4145 1.1398 1.1398 0 0 0-.1526.0633 1.4806 1.4806 0 0 0-.2171.1354c-.1992.1475-.3668.3392-.5196.5315-.0386.049-.074.1143-.12.1562l-.7686 1.0573a113.9168 113.9168 0 0 0-1.2913 1.789c-.278.3895-.5184.7184-.7083 1.0094-.036.0547-.0734.116-.1075.1647-.2277.3522-.3566.6092-.4228.8381a1.0945 1.0945 0 0 0-.046.4721c.0211.1655.0768.3246.1635.467.046.0715.0957.1406.1487.207a2.334 2.334 0 0 0 .1754.1825 1.843 1.843 0 0 0 .2108.1732c.5304.369 1.1112.6342 1.722.8391a6.0958 6.0958 0 0 0 1.5716.3004c.091.0046.1821.0025.2728-.006a2.3878 2.3878 0 0 0 .2506-.0351 2.3862 2.3862 0 0 0 .2447-.071 1.1927 1.1927 0 0 0 .4175-.2658c.1127-.113.1994-.249.2541-.3989.0889-.2214.1473-.5026.1857-.92.0034-.0593.0118-.1305.0177-.1958.0304-.3463.0443-.7531.0666-1.2315.0375-.7357.067-1.4681.0903-2.2026 0 0 .0495-1.3053.0494-1.306.0113-.3008.002-.6342-.0814-.9336a1.396 1.396 0 0 0-.1756-.4054zm8.6754 2.0439c-.1605-.176-.3878-.3514-.7462-.5682-.0518-.0288-.1124-.0674-.1684-.1009-.2985-.1795-.658-.3684-1.078-.5965a120.7615 120.7615 0 0 0-1.9427-1.042l-1.1515-.6107c-.0597-.0175-.1203-.0607-.1766-.0878-.2212-.1058-.4558-.2045-.6992-.2498a1.4915 1.4915 0 0 0-.2545-.0265 1.1527 1.1527 0 0 0-.1648.01 1.1077 1.1077 0 0 0-.9227.9133 1.4186 1.4186 0 0 0 .0159.439c.0563.3065.1932.6096.3346.875l.615 1.1526c.3422.65.6884 1.2963 1.0435 1.9406.229.4202.4196.7799.5982 1.078.0338.056.0721.1163.1011.1682.2173.3584.392.584.569.7458.1146.1107.252.195.4026.247.1583.0525.326.071.4919.0546a2.368 2.368 0 0 0 .251-.0435c.0817-.022.1622-.048.241-.0784a1.863 1.863 0 0 0 .2475-.1143 6.1018 6.1018 0 0 0 1.2818-.9597c.4596-.4522.8659-.9454 1.182-1.51.044-.08.0819-.163.1138-.2483a2.49 2.49 0 0 0 .0773-.2411c.0186-.083.033-.1669.0429-.2513a1.188 1.188 0 0 0-.0565-.491 1.0933 1.0933 0 0 0-.248-.4041zm2.86 3.742a.8523.8523 0 0 1-.111.4236c-.074.132-.178.2377-.3115.3172a.8428.8428 0 0 1-.4385.119.847.847 0 0 1-.4373-.1179.8526.8526 0 0 1-.3125-.3171.8548.8548 0 0 1-.111-.4248c0-.1526.038-.2958.1143-.4294a.8405.8405 0 0 1 .315-.3159.849.849 0 0 1 .4315-.1156.8514.8514 0 0 1 .4294.1144.84.84 0 0 1 .316.3148.8494.8494 0 0 1 .1156.4317zm-.1202 0c0-.1328-.0332-.256-.0996-.3698s-.1564-.2038-.2702-.2702a.7125.7125 0 0 0-.371-.1007.7204.7204 0 0 0-.3698.0996.7487.7487 0 0 0-.2713.2702.7181.7181 0 0 0-.0996.3709c0 .132.0332.2557.0996.371a.7355.7355 0 0 0 .2713.2713.7354.7354 0 0 0 .3698.0985.7205.7205 0 0 0 .3698-.0996.7423.7423 0 0 0 .2702-.2691.7186.7186 0 0 0 .1008-.3721zm-.577.0584.2724.4522h-.1922l-.237-.4052h-.1546v.4052h-.1695v-1.02h.2988c.1268 0 .2195.0247.2783.0744.0595.0496.0892.1252.0892.2267a.2785.2785 0 0 1-.0492.1625c-.032.0466-.0775.0813-.1362.1042zm-.0412-.1408a.1532.1532 0 0 0 .056-.1214c0-.0573-.0164-.0981-.0491-.1225-.0329-.0251-.0847-.0377-.1557-.0377h-.1214v.3285h.1237c.061 0 .1098-.0157.1465-.047z"/>
          </g>
        );
      case 'Forms':
        return (
          <g fill="currentColor">
            <path d="M14.727 6h6l-6-6v6zm0 .727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zM7.91 17.318a.819.819 0 1 1 .001-1.638.819.819 0 0 1 0 1.638zm0-3.273a.819.819 0 1 1 .001-1.637.819.819 0 0 1 0 1.637zm0-3.272a.819.819 0 1 1 .001-1.638.819.819 0 0 1 0 1.638zm9 6.409h-6.818v-1.364h6.818v1.364zm0-3.273h-6.818v-1.364h6.818v1.364zm0-3.273h-6.818V9.273h6.818v1.363z"/>
          </g>
        );
      case 'ScanMe':
        return (
          <g>
            <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="12" y="11.5" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">SCAN</text>
            <text x="12" y="17" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">ME</text>
          </g>
        );
      case 'Docs':
        return (
          <g fill="currentColor">
            <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z"/>
          </g>
        );
      case 'PDF':
        return (
          <g fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5v3H8v-3h1.5zm3.5 1.5c0 1.1-.9 2-2 2h-1.5v-5H11c1.1 0 2 .9 2 2v1zm3 0h-2.5v1.5H16v1.5h-1.5v-1.5h-1v-4.5H16v1.5h-1.5v1.5zM9 10.5H7.5v4H9c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5zm1 1.5v1h-1v-1h1zm2-1.5h-1v4h1c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1zm-.5 1h.5v2h-.5v-2z"/>
          </g>
        );
      case 'Netflix':
        return (
          <g fill="currentColor">
            <path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z" />
          </g>
        );
      case 'Twitch':
        return (
          <g fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
          </g>
        );
      case 'GitHub':
        return (
          <g fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </g>
        );
      case 'Reddit':
        return (
          <g fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
          </g>
        );
      default:
        return null;
    }
  };

  const activeColor = colorMode === "custom" && customColor ? customColor : (PRESET_LOGO_BRAND_COLORS[name] || "#000000");

  if (iconStyle === "glyph" || (!iconStyle && cardShape === "None")) {
    return (
      <div className={`${size} p-1.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
        <svg viewBox={name === "Amazon" ? "0 0 400 400" : "0 0 24 24"} className="w-full h-full" style={{ color: activeColor }}>
          {renderIcon()}
        </svg>
      </div>
    );
  }

  const effectiveCardShape = (cardShape === "None" || !cardShape) ? "Rounded Square" : cardShape;
  const shapeClass = effectiveCardShape === "Circle" ? "rounded-full" : "rounded-xl";

  if (iconStyle === "duotone") {
    const duotoneBg = activeColor.startsWith("#") && activeColor.length === 7 ? `${activeColor}26` : "rgba(0, 0, 0, 0.15)";
    return (
      <div 
        className={`${size} ${shapeClass} p-2 flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-110 group-hover:shadow-md border border-black/5`}
        style={{ backgroundColor: duotoneBg, color: activeColor }}
      >
        <svg viewBox={name === "Amazon" ? "0 0 400 400" : "0 0 24 24"} className="w-full h-full">
          {renderIcon()}
        </svg>
      </div>
    );
  }

  const bgStyle = colorMode === "custom" && customColor ? { backgroundColor: customColor } : undefined;
  const bgClass = bgStyle ? "" : `bg-gradient-to-br ${meta?.gradient || "from-gray-400 to-gray-600"}`;

  return (
    <div 
      className={`${size} ${shapeClass} ${bgClass} p-2 flex items-center justify-center text-white shadow-xs transition-all duration-200 group-hover:scale-110 group-hover:shadow-md`}
      style={bgStyle}
    >
      <svg viewBox={name === "Amazon" ? "0 0 400 400" : "0 0 24 24"} className="w-full h-full">
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
  Amazon: "#FF9900",
  TikTok: "#000000",
  X: "#000000",
  LinkedIn: "#0a66c2",
  Telegram: "#24a1de",
  PayPal: "#003087",
  Spotify: "#1db954",
  Pinterest: "#E60023",
  Snapchat: "#FFFC00",
  Maps: "#4285F4",
  Netflix: "#E50914",
  Twitch: "#9146FF",
  GitHub: "#181717",
  Reddit: "#FF4500",
  Play: "#3BCCFF",
  Gmail: "#EA4335",
  Forms: "#7248B9",
  ScanMe: "#ef4444",
  Vimeo: "#1AB7EA",
  WeChat: "#07C160",
  Yelp: "#FF1A1A",
  PDF: "#F40F02",
  Netflix: "#E50914",
  Docs: "#4285F4"
};

const logoDataUrlCache = new Map<string, string>();

/** Generates crisp PNG data URLs directly in React for preset logos via HTML5 Canvas (memoized) */
export function getReactLogoPngDataUrl(
  name: string, 
  colorMode: "default" | "custom" | "match_dots" | string = "default", 
  customColorHex: string = "#000000", 
  fallbackDotsColor: string = "#000000",
  iconStyle: "badge" | "duotone" | "glyph" | string = "badge",
  cardShape: "None" | "Circle" | "Rounded Square" | string = "Rounded Square"
): Promise<string | null> {
  if (!name || name === "None") return Promise.resolve(null);

  const cacheKey = `${name}:${colorMode}:${customColorHex}:${fallbackDotsColor}:${iconStyle}:${cardShape}`;
  const cached = logoDataUrlCache.get(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  const brandOrCustomColor = colorMode === "custom" 
    ? (customColorHex.startsWith("#") ? customColorHex : "#000000")
    : (colorMode === "match_dots" 
        ? (fallbackDotsColor.startsWith("#") ? fallbackDotsColor : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[name] || (fallbackDotsColor.startsWith("#") ? fallbackDotsColor : "#000000")));
  
  const isGlyph = iconStyle === "glyph" || (!iconStyle && cardShape === "None");
  const color = (iconStyle === "badge" && !isGlyph) ? "#ffffff" : brandOrCustomColor;
  const effectiveCardShape = (cardShape === "None" || !cardShape) ? "Rounded Square" : cardShape;
  
  const iconSvgs: Record<string, string> = {
    Link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    Location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    WiFi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    Vcard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M11 15h6M7 11h0M11 11h6"/><circle cx="12" cy="8" r="2"/></svg>`,
    Email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    Scan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>`,
    Phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    WhatsApp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
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
    Amazon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path fill="${color}" d="M337.8 304.5c-42.5 31.4-104.2 47.7-157.4 47.7-74.4 0-141.6-27.7-192-74-4-3.7-.4-8.8 4.3-5.9 54.4 33.3 124 53.4 194.5 53.4 47.2 0 102.3-12.2 152.1-37.4 7.6-3.8 14.1 3.9 8.5 16.2z"/><path fill="${color}" d="M352.5 287.4c-4.2-5.4-27.8-2.6-38.4-1.3-3.2.4-3.7-2.3-.8-4.4 18.7-13.4 49.3-9.5 52.8-5.1 3.5 4.5-1 35.3-18.4 49.9-2.7 2.3-5.4.8-4.2-2.3 3.9-10.4 13.2-31.4 8.9-36.8z"/><path fill="${(iconStyle === 'badge' && !isGlyph) ? '#ffffff' : '#000000'}" d="M211.8 142.1c0 30.1-2.3 54.9-27.8 75.8-13.7 11.2-31 16.8-48.4 16.8-31 0-54.8-18.4-54.8-49.3 0-41.2 36.3-64.8 102.6-64.8v-3.7c0-12.7-7.2-22.1-23.7-22.1-15.1 0-29.4 5.9-37.5 11.7-2.3 1.7-4.7.7-5.9-1.9l-7.7-18.8c-1-2.5.2-4.9 2.7-6.7 13.7-10.1 36-16.7 64-16.7 41.5 0 66.5 22.8 66.5 69.7v10.2zm-28.5 35.2v-24.5c-43.5 0-72.2 11.7-72.2 38.6 0 16.1 11.7 25.5 27.8 25.5 19.8 0 35.7-13.8 44.4-39.6z"/></svg>`,
    TikTok: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.46a1.64 1.64 0 0 0-1.64 1.64 1.64 1.64 0 0 0 1.64 1.65 1.64 1.64 0 0 0 1.64-1.65 1.64 1.64 0 0 0-1.64-1.64Z"/></svg>`,
    Telegram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/></svg>`,
    PayPal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M10.15 3.337h4.88c2.91 0 5.16 1.41 5.16 4.3 0 3.37-2.67 5.76-5.83 5.76h-1.95l-1.12 7.15H7.72l2.43-17.21zm2.34 3.01l-.78 5.02h1.69c1.69 0 3.01-.98 3.01-2.61 0-1.61-1.27-2.41-2.73-2.41h-1.19z"/></svg>`,
    Spotify: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.335.132-.67.468-.746 3.808-.87 7.076-.5 9.713 1.114.294.18.386.563.208.857zm1.223-2.723c-.226.367-.7.482-1.066.257-2.686-1.65-6.78-2.13-9.965-1.166-.412.125-.848-.106-.973-.517-.125-.412.106-.848.517-.973 3.654-1.106 8.163-.572 11.23 1.332.366.225.481.698.257 1.067zm.104-2.831C14.692 8.95 8.525 8.75 4.965 9.832c-.493.15-.1019-.126-1.167-.62-.15-.494.126-1.019.62-1.167 4.086-1.24 10.87-1.015 14.484 1.13.442.262.588.832.326 1.274-.262.443-.832.588-1.325.326z"/></svg>`,
    Pinterest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`,
    Snapchat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg>`,
    Maps: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z"/></svg>`,
    Play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/></svg>`,
    Gmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>`,
    WeChat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>`,
    Vimeo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457a315.06 315.06 0 003.501-3.1279c1.579-1.368 2.765-2.085 3.5539-2.159 1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.5069.5389 2.45 1.1309 3.674 1.7759 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.8679 3.434-5.7568 6.7619-5.6368 2.4729.06 3.6279 1.664 3.4929 4.7969z"/></svg>`,
    Yelp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="m7.6885 15.1415-3.6715.8483c-.3769.0871-.755.183-1.1452.155-.2611-.0188-.5122-.0414-.7606-.213a1.179 1.179 0 0 1-.331-.3594c-.3486-.5519-.3656-1.3661-.3697-2.0004a6.2874 6.2874 0 0 1 .3314-2.0642 1.857 1.857 0 0 1 .1073-.2474 2.3426 2.3426 0 0 1 .1255-.2165 2.4572 2.4572 0 0 1 .1563-.1975 1.1736 1.1736 0 0 1 .399-.2831 1.082 1.082 0 0 1 .4592-.0837c.2355.0016.5139.052.91.1734.0555.0191.1237.0382.1856.0572.3277.1013.7048.2404 1.1499.3987.6863.2404 1.3663.487 2.0463.7397l1.2117.4423c.2217.0807.4363.18.6412.297.174.0984.3273.2298.4512.387a1.217 1.217 0 0 1 .192.4309 1.2205 1.2205 0 0 1-.872 1.4522c-.0468.0151-.0852.0239-.1085.0293l-1.105.2553-.0031-.001zM18.8208 7.565a1.8506 1.8506 0 0 0-.2042-.1754 2.4082 2.4082 0 0 0-.2077-.1394 2.3607 2.3607 0 0 0-.2269-.109 1.1705 1.1705 0 0 0-.482-.0796 1.0862 1.0862 0 0 0-.4498.1263c-.2107.1048-.4388.2732-.742.5551-.042.0417-.0947.0886-.142.133-.2502.2351-.5286.5252-.8599.863a114.6363 114.6363 0 0 0-1.5166 1.5629l-.8962.9293a4.1897 4.1897 0 0 0-.4466.5483 1.541 1.541 0 0 0-.2364.5459 1.2199 1.2199 0 0 0 .0107.4518l.0046.02a1.218 1.218 0 0 0 1.4184.923 1.162 1.162 0 0 0 .1105-.0213l4.7781-1.104c.3766-.087.7587-.1667 1.097-.3631.2269-.1316.4428-.262.5909-.5252a1.1793 1.1793 0 0 0 .1405-.4683c.0733-.6512-.2668-1.3908-.5403-1.963a6.2792 6.2792 0 0 0-1.2001-1.7103zM8.9703.0754a8.6724 8.6724 0 0 0-.83.1564c-.2754.066-.548.1383-.8146.2236-.868.2844-2.0884.8063-2.295 1.8065-.1165.5655.1595 1.1439.3737 1.66.2595.6254.614 1.1889.9373 1.7777.8543 1.5545 1.7245 3.0993 2.5922 4.6457.259.4617.5416 1.0464 1.043 1.2856a1.058 1.058 0 0 0 .1013.0383c.2248.0851.4699.1016.7041.0471a4.3015 4.3015 0 0 0 .0418-.0097 1.2136 1.2136 0 0 0 .5658-.3397 1.1033 1.1033 0 0 0 .079-.0822c.3463-.435.3454-1.0833.3764-1.6134.1042-1.771.2139-3.5423.3009-5.3142.0332-.6712.1055-1.3333.0655-2.0096-.0328-.5579-.0368-1.1984-.3891-1.6563-.6218-.8073-1.9476-.741-2.8523-.6158zm2.084 15.9505a1.1053 1.1053 0 0 0-1.2306-.4145 1.1398 1.1398 0 0 0-.1526.0633 1.4806 1.4806 0 0 0-.2171.1354c-.1992.1475-.3668.3392-.5196.5315-.0386.049-.074.1143-.12.1562l-.7686 1.0573a113.9168 113.9168 0 0 0-1.2913 1.789c-.278.3895-.5184.7184-.7083 1.0094-.036.0547-.0734.116-.1075.1647-.2277.3522-.3566.6092-.4228.8381a1.0945 1.0945 0 0 0-.046.4721c.0211.1655.0768.3246.1635.467.046.0715.0957.1406.1487.207a2.334 2.334 0 0 0 .1754.1825 1.843 1.843 0 0 0 .2108.1732c.5304.369 1.1112.6342 1.722.8391a6.0958 6.0958 0 0 0 1.5716.3004c.091.0046.1821.0025.2728-.006a2.3878 2.3878 0 0 0 .2506-.0351 2.3862 2.3862 0 0 0 .2447-.071 1.1927 1.1927 0 0 0 .4175-.2658c.1127-.113.1994-.249.2541-.3989.0889-.2214.1473-.5026.1857-.92.0034-.0593.0118-.1305.0177-.1958.0304-.3463.0443-.7531.0666-1.2315.0375-.7357.067-1.4681.0903-2.2026 0 0 .0495-1.3053.0494-1.306.0113-.3008.002-.6342-.0814-.9336a1.396 1.396 0 0 0-.1756-.4054zm8.6754 2.0439c-.1605-.176-.3878-.3514-.7462-.5682-.0518-.0288-.1124-.0674-.1684-.1009-.2985-.1795-.658-.3684-1.078-.5965a120.7615 120.7615 0 0 0-1.9427-1.042l-1.1515-.6107c-.0597-.0175-.1203-.0607-.1766-.0878-.2212-.1058-.4558-.2045-.6992-.2498a1.4915 1.4915 0 0 0-.2545-.0265 1.1527 1.1527 0 0 0-.1648.01 1.1077 1.1077 0 0 0-.9227.9133 1.4186 1.4186 0 0 0 .0159.439c.0563.3065.1932.6096.3346.875l.615 1.1526c.3422.65.6884 1.2963 1.0435 1.9406.229.4202.4196.7799.5982 1.078.0338.056.0721.1163.1011.1682.2173.3584.392.584.569.7458.1146.1107.252.195.4026.247.1583.0525.326.071.4919.0546a2.368 2.368 0 0 0 .251-.0435c.0817-.022.1622-.048.241-.0784a1.863 1.863 0 0 0 .2475-.1143 6.1018 6.1018 0 0 0 1.2818-.9597c.4596-.4522.8659-.9454 1.182-1.51.044-.08.0819-.163.1138-.2483a2.49 2.49 0 0 0 .0773-.2411c.0186-.083.033-.1669.0429-.2513a1.188 1.188 0 0 0-.0565-.491 1.0933 1.0933 0 0 0-.248-.4041zm2.86 3.742a.8523.8523 0 0 1-.111.4236c-.074.132-.178.2377-.3115.3172a.8428.8428 0 0 1-.4385.119.847.847 0 0 1-.4373-.1179.8526.8526 0 0 1-.3125-.3171.8548.8548 0 0 1-.111-.4248c0-.1526.038-.2958.1143-.4294a.8405.8405 0 0 1 .315-.3159.849.849 0 0 1 .4315-.1156.8514.8514 0 0 1 .4294.1144.84.84 0 0 1 .316.3148.8494.8494 0 0 1 .1156.4317zm-.1202 0c0-.1328-.0332-.256-.0996-.3698s-.1564-.2038-.2702-.2702a.7125.7125 0 0 0-.371-.1007.7204.7204 0 0 0-.3698.0996.7487.7487 0 0 0-.2713.2702.7181.7181 0 0 0-.0996.3709c0 .132.0332.2557.0996.371a.7355.7355 0 0 0 .2713.2713.7354.7354 0 0 0 .3698.0985.7205.7205 0 0 0 .3698-.0996.7423.7423 0 0 0 .2702-.2691.7186.7186 0 0 0 .1008-.3721zm-.577.0584.2724.4522h-.1922l-.237-.4052h-.1546v.4052h-.1695v-1.02h.2988c.1268 0 .2195.0247.2783.0744.0595.0496.0892.1252.0892.2267a.2785.2785 0 0 1-.0492.1625c-.032.0466-.0775.0813-.1362.1042zm-.0412-.1408a.1532.1532 0 0 0 .056-.1214c0-.0573-.0164-.0981-.0491-.1225-.0329-.0251-.0847-.0377-.1557-.0377h-.1214v.3285h.1237c.061 0 .1098-.0157.1465-.047z"/></svg>`,
    Forms: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M14.727 6h6l-6-6v6zm0 .727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zM7.91 17.318a.819.819 0 1 1 .001-1.638.819.819 0 0 1 0 1.638zm0-3.273a.819.819 0 1 1 .001-1.637.819.819 0 0 1 0 1.637zm0-3.272a.819.819 0 1 1 .001-1.638.819.819 0 0 1 0 1.638zm9 6.409h-6.818v-1.364h6.818v1.364zm0-3.273h-6.818v-1.364h6.818v1.364zm0-3.273h-6.818V9.273h6.818v1.363z"/></svg>`,
    Docs: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z"/></svg>`,
    ScanMe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" stroke="${color}" stroke-width="2" fill="none" /><text x="12" y="11.5" font-size="4.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">SCAN</text><text x="12" y="17" font-size="4.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">ME</text></svg>`,
    PDF: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM14 11h1V8.5h-1V11zM6 20V6H4v14c0 1.1.9 2 2 2h14v-2H6z"/></svg>`,
    Netflix: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z"/></svg>`,
    Twitch: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`,
    GitHub: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    Reddit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/></svg>`
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
        if (!isGlyph) {
          ctx.save();
          if (iconStyle === "duotone") {
            ctx.globalAlpha = 0.18;
          }
          ctx.fillStyle = brandOrCustomColor;
          if (effectiveCardShape === "Circle") {
            ctx.beginPath();
            ctx.arc(200, 200, 180, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            if (typeof ctx.roundRect === "function") {
              ctx.roundRect(20, 20, 360, 360, 80);
            } else {
              const x = 20, y = 20, w = 360, h = 360, r = 80;
              ctx.moveTo(x + r, y);
              ctx.arcTo(x + w, y, x + w, y + h, r);
              ctx.arcTo(x + w, y + h, x, y + h, r);
              ctx.arcTo(x, y + h, x, y, r);
              ctx.arcTo(x, y, x + w, y, r);
            }
            ctx.fill();
          }
          ctx.restore();
          ctx.drawImage(img, 75, 75, 250, 250);
        } else {
          ctx.drawImage(img, 20, 20, 360, 360);
        }
        const pngUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        logoDataUrlCache.set(cacheKey, pngUrl);
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
