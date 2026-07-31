import { Slider } from "@/components/ui/Slider"
import { useState, useEffect, useRef, useCallback } from "react"
import { useQRStore } from "@/store/useQRStore"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { type ContentType, type QRSettings } from "@/types/qr"
import { PRESET_TEMPLATES } from "@/data/templates"
import { DOT_STYLES, EYE_FRAME_STYLES, EYEBALL_STYLES, FRAME_STYLES, TEXT_STYLES } from "@/data/options"
import { StylePreviewCard } from "@/components/previews/StylePreviewCard"
import { PresetLogoPreview, getReactLogoPngDataUrl, PRESET_LOGO_BRAND_COLORS, LOGO_ITEMS, LOGO_CATEGORIES } from "@/components/previews/SvgIcons"
import {
  UrlForm, TextForm, PhoneForm, SmsForm, WhatsAppForm, EmailForm, VCardForm,
  WifiForm, LocationForm, EventForm, UpiForm, CryptoForm, PaypalForm,
  AppStoreForm, GooglePlayForm, SocialForm
} from "@/components/generator/forms/ContentForms"

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

async function fetchQRCode(settings: any) {
  const { contentData, ...rest } = settings

  let finalLogo = rest.logo_image;
  const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
  if (isPresetLogo) {
    finalLogo = await getReactLogoPngDataUrl(
      rest.preset_logo,
      rest.logo_color_mode || "default",
      rest.logo_custom_color || "#000000",
      rest.dots_color || "#000000",
      rest.logo_icon_style || "badge",
      rest.logo_card_shape || "Rounded Square"
    );
  }

  const color = rest.logo_color_mode === "custom"
    ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
    : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

  const payload = {
    ...rest,
    data: contentData || "Your text here...",
    logo_image: finalLogo,
    preset_logo: isPresetLogo ? "None" : rest.preset_logo,
    logo_card_shape: rest.logo_card_shape,
    preset_logo_color: color,
    box_size: 10
  }

  const response = await fetch("/api/generator/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Failed to generate QR code")
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  return {
    url,
    previewSize: blob.size
  }
}



const ScannabilityAlert = ({ show, message, compact = false }: { show: boolean, message: React.ReactNode, compact?: boolean }) => {
  if (!show) return null;
  
  if (compact) {
    return (
      <div className="flex items-center gap-1 mt-1">
        <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0"></div>
        <p className="text-[9px] font-medium text-amber-600 dark:text-amber-500">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start bg-primary/5 border border-primary/20 rounded-xl gap-3 p-4 mt-3 shadow-sm">
      <div className="bg-primary/10 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[18px]">
          tune
        </span>
      </div>
      <div className="pt-0.5">
        <h4 className="font-bold text-primary text-[11px] mb-0.5 uppercase tracking-wide">Custom Settings Active</h4>
        <p className="font-medium text-on-surface-variant leading-relaxed text-[11px]">
          {message}
        </p>
      </div>
    </div>
  );
};

function App() {
  const { settings, updateSettings, applyTemplate, undo, redo, resetSettings, history, historyIndex } = useQRStore()
  const [activeTab, setActiveTab] = useState<string>("Content")
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>("All")
  const [logoSearchQuery, setLogoSearchQuery] = useState<string>("")
  const [activeLogoCategory, setActiveLogoCategory] = useState<string>("All")
  const [zoomLevel, setZoomLevel] = useState<number>(1)



  // Batch Generation State
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [dataColumn, setDataColumn] = useState<string>("")
  const [filenameColumn, setFilenameColumn] = useState<string>("")
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false)
  const [batchFormat, setBatchFormat] = useState<string>("PNG")
  const [batchSize, setBatchSize] = useState<string>("1024")

  // Mobile UI state
  const [mobileMainTab, setMobileMainTab] = useState<'content' | 'design' | 'download'>('content')
  const [mobileDesignSubTab, setMobileDesignSubTab] = useState<string>('Shape')
  const [contentCategoryTab, setContentCategoryTab] = useState<string>('Basic')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMiniPreview, setShowMiniPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Refs for style horizontal scroll containers
  const dotsScrollRef = useRef<HTMLDivElement>(null)
  const eyeFrameScrollRef = useRef<HTMLDivElement>(null)
  const eyeballScrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 250;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const [isComparing, setIsComparing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync content category tab when contentType changes (e.g. from undo/redo)
  useEffect(() => {
    const activeCategory = contentCategories.find(c => c.items.some(i => i.id === settings.contentType));
    if (activeCategory && contentCategoryTab !== activeCategory.title) {
      setContentCategoryTab(activeCategory.title);
    }
  }, [settings.contentType]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const [downloadFormat, setDownloadFormat] = useState<"PNG" | "SVG" | "PDF">("PNG");
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [noStretching, setNoStretching] = useState<boolean>(true);
  const [customFilename, setCustomFilename] = useState<string>("");
  const [activeCorner, setActiveCorner] = useState<"all" | "tl" | "tr" | "bl">("all");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string, icon: string } | null>(null);
  
  const [previewBg, setPreviewBg] = useState<"white" | "light" | "dark" | "transparent">("white");
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(1);
  const [lastTap, setLastTap] = useState<number>(0);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sticky mini preview observer — shows floating QR thumbnail when main preview scrolls out of view on mobile
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniPreview(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset page scroll position to top when switching active configuration tabs (desktop)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeTab]);

  // Fetch fast light QR preview using react-query
  const { data: qrData, isLoading, isError, isFetching } = useQuery({
    queryKey: ["qr-code", settings],
    queryFn: () => fetchQRCode(settings),
    staleTime: 1000 * 60, // 1 minute
    placeholderData: keepPreviousData,
  })
  const imageUrl = qrData?.url

  const hasComplexStyling = (
    settings.frame_style !== "none" ||
    settings.text_style !== "none" ||
    settings.dots_style !== "square" ||
    settings.eye_frame_style !== "square" ||
    settings.eyeball_style !== "square" ||
    settings.gradient_type !== "Solid Color" ||
    (settings.preset_logo && settings.preset_logo !== "None") ||
    settings.effect_shadow !== "none" ||
    settings.canvas_border_width > 0
  );

  const showResolutionSelector = downloadFormat === "PNG" || hasComplexStyling;

  const targetResolution = downloadFormat === "SVG" ? "Vector SVG" : (downloadFormat === "PDF" ? "300 DPI PDF" : `${downloadSize}×${downloadSize} px`);

  // List of sidebar tabs
  const sidebarTabs = [
    { name: "Content", icon: "edit_note" },
    { name: "Templates", icon: "grid_view" },
    { name: "Design", icon: "palette" },
    { name: "Logo", icon: "image" },
    { name: "Frames", icon: "branding_watermark" },
    { name: "Effects", icon: "auto_fix_high" },
    { name: "Advanced", icon: "settings" },
    { name: "Download", icon: "download" },
  ]

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim() !== '')
    if (lines.length < 2) return
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const rows: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })
      rows.push(row)
    }
    setCsvHeaders(headers)
    setCsvRows(rows)
    setDataColumn(headers.includes('Data') ? 'Data' : (headers.includes('URL') ? 'URL' : headers[0]))
    setFilenameColumn(headers.includes('Filename') ? 'Filename' : (headers.includes('Name') ? 'Name' : ''))
  }

  const downloadSampleCSV = () => {
    const csvContent = "Filename,Data\nSKU_1001,https://example.com/sku/1001\nSKU_1002,https://example.com/sku/1002\nSKU_1003,https://example.com/sku/1003"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_qr_batch.csv"
    a.click()
  }

  const handleBatchDownload = async () => {
    if (!dataColumn || csvRows.length === 0) return;
    setIsBatchGenerating(true);
    try {
      const { contentData, ...rest } = settings;
      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }
      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));
      
      const payloadSettings = { 
        ...rest, 
        logo_image: finalLogo, 
        preset_logo: isPresetLogo ? "None" : rest.preset_logo, 
        preset_logo_color: color 
      };

      const items = csvRows.map(row => ({
        data: row[dataColumn],
        filename: filenameColumn ? row[filenameColumn] : undefined
      }));

      const payload = {
        items: items.slice(0, 500),
        settings: payloadSettings,
        format: batchFormat.toLowerCase(),
        target_size: parseInt(batchSize)
      };

      const response = await fetch("/api/generator/generate/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
         const errorText = await response.text();
         throw new Error("Batch generation failed: " + errorText);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "batch_qrcodes.zip";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Error generating batch ZIP. Please check console for details.");
    } finally {
      setIsBatchGenerating(false);
    }
  }

  const contentCategories = [
    {
      title: "Basic",
      items: [
        { id: "url", label: "URL", icon: "link" },
        { id: "text", label: "Text", icon: "subject" },
        { id: "phone", label: "Phone", icon: "phone" },
        { id: "sms", label: "SMS", icon: "sms" },
        { id: "whatsapp", label: "WhatsApp", icon: "chat" },
        { id: "email", label: "Email", icon: "mail" },
        { id: "vcard", label: "vCard", icon: "contact_page" },
      ]
    },
    {
      title: "Network",
      items: [
        { id: "wifi", label: "Wi-Fi", icon: "wifi" },
      ]
    },
    {
      title: "Location & Events",
      items: [
        { id: "location", label: "Location", icon: "location_on" },
        { id: "event", label: "Event", icon: "event" },
      ]
    },
    {
      title: "Payments",
      items: [
        { id: "upi", label: "UPI", icon: "account_balance" },
        { id: "crypto", label: "Crypto", icon: "currency_bitcoin" },
        { id: "paypal", label: "PayPal", icon: "payments" },
      ]
    },
    {
      title: "Apps & Social",
      items: [
        { id: "appstore", label: "App Store", icon: "apps" },
        { id: "googleplay", label: "Google Play", icon: "play_arrow" },
        { id: "social", label: "Social", icon: "share" },
      ]
    },
    {
      title: "Advanced",
      items: [
        { id: "batch", label: "Batch CSV", icon: "dataset" },
      ]
    }
  ]

  const dotStyles = DOT_STYLES
  const eyeFrameStyles = EYE_FRAME_STYLES
  const eyeballStyles = EYEBALL_STYLES
  const frameStyles = FRAME_STYLES
  const textStyles = TEXT_STYLES
  const fontStyles = [
    "Outfit (Modern)",
    "Playfair Display (Elegant)",
    "Courier Prime (Retro)",
    "Montserrat (Geometric)",
    "Roboto (Clean)",
    "Lora (Serif)"
  ]
  const filteredLogos = LOGO_ITEMS.filter(item => {
    const matchesCategory = activeLogoCategory === "All" || item.category === activeLogoCategory;
    const searchLower = logoSearchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      item.label.toLowerCase().includes(searchLower) || 
      item.tags.some(t => t.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });
  const logoCardShapes = ["None", "Circle", "Rounded Square"]

  const handleDownloadPNG = () => {
    if (imageUrl) {
      const a = document.createElement("a")
      a.href = imageUrl
      a.download = getEffectiveFilename("png")
      a.click()
    }
  }

  const handleDownloadSVG = async () => {
    try {
      const { contentData, ...rest } = settings
      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }
      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payload = { ...rest, data: contentData || "Your text here...", logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color }
      const response = await fetch("/api/generator/generate/svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Failed to generate SVG")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getEffectiveFilename("svg")
      a.click()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const { contentData, ...rest } = settings
      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }
      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payload = { ...rest, data: contentData || "Your text here...", logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color }
      const response = await fetch("/api/generator/generate/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Failed to generate PDF")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getEffectiveFilename("pdf")
      a.click()
    } catch (e) {
      console.error(e)
    }
  }

  const getEffectiveFilename = (ext: string) => {
    const base = customFilename.trim() || `QRStream-${settings.contentType}`;
    return base.endsWith(`.${ext.toLowerCase()}`) ? base : `${base}.${ext.toLowerCase()}`;
  };

  const handleDownloadCustom = async () => {
    try {
      setIsDownloading(true);
      const { contentData, ...rest } = settings;

      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }

      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payload = { ...rest, data: contentData || "Your text here...", logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color, box_size: 20, target_size: downloadSize, no_stretching: noStretching };

      let endpoint = "/api/generator/generate";
      let ext = "png";
      if (downloadFormat === "SVG") {
        endpoint = "/api/generator/generate/svg";
        ext = "svg";
      } else if (downloadFormat === "PDF") {
        endpoint = "/api/generator/generate/pdf";
        ext = "pdf";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Failed to generate ${downloadFormat}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getEffectiveFilename(ext);
      a.click();
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setToast({ message: `Downloaded as ${ext.toUpperCase()}`, icon: "download_done" });
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      setToast({ message: "Download Failed", icon: "error" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsCopying(true);
      const { contentData, ...rest } = settings;
      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }
      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payload = { ...rest, data: contentData || "Your text here...", logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color, box_size: 20, target_size: downloadSize, no_stretching: noStretching };
      const response = await fetch("/api/generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to generate PNG for clipboard");
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopySuccess(true);
      setToast({ message: "Copied to Clipboard!", icon: "content_copy" });
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
      setToast({ message: "Failed to Copy", icon: "error" });
    } finally {
      setIsCopying(false);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleShare = async () => {
    if (navigator.share && imageUrl) {
      try {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        await navigator.share({
          title: 'QR Code',
          text: 'Check out my custom QR code!',
          files: [file]
        });
      } catch (e) {
        console.error(e);
      }
    } else if (imageUrl) {
      navigator.clipboard.writeText(imageUrl);
      setToast({ message: "Image URL Copied!", icon: "link" });
    }
  }

  // Unified Renderer for tab contents (renders either as active desktop panel or accordion content)
  const renderPanelContent = (tabName: string) => {
    switch (tabName) {
      case "Content":
        return (
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 custom-scrollbar scroll-smooth">
              {contentCategories.map((category) => (
                <button
                  key={category.title}
                  onClick={() => setContentCategoryTab(category.title)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-press ${
                    contentCategoryTab === category.title
                      ? 'bg-primary/10 text-primary shadow-2xs'
                      : 'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Type Grid for Active Category */}
            <div className="glass-panel p-1.5 sm:p-2 rounded-2xl grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-1 border border-outline-variant shadow-sm">
              {contentCategories.find(c => c.title === contentCategoryTab)?.items.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    if (settings.contentType !== type.id) {
                      updateSettings({ contentType: type.id as any, contentData: "" })
                    }
                  }}
                  className={`flex flex-col items-center gap-1 sm:gap-1.5 p-2.5 sm:p-3 rounded-xl duration-200 border min-h-[44px] touch-press transition-all ${settings.contentType === type.id
                      ? "bg-primary text-white border-primary font-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container border-transparent active:scale-95"
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{type.icon}</span>
                  <span className="text-[10px] sm:text-[11px] leading-tight font-medium text-center">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
              {settings.contentType === "url" && <UrlForm />}
              {settings.contentType === "text" && <TextForm />}
              {settings.contentType === "phone" && <PhoneForm />}
              {settings.contentType === "sms" && <SmsForm />}
              {settings.contentType === "whatsapp" && <WhatsAppForm />}
              {settings.contentType === "email" && <EmailForm />}
              {settings.contentType === "vcard" && <VCardForm />}
              {settings.contentType === "wifi" && <WifiForm />}
              {settings.contentType === "location" && <LocationForm />}
              {settings.contentType === "event" && <EventForm />}
              {settings.contentType === "upi" && <UpiForm />}
              {settings.contentType === "crypto" && <CryptoForm />}
              {settings.contentType === "paypal" && <PaypalForm />}
              {settings.contentType === "appstore" && <AppStoreForm />}
              {settings.contentType === "googleplay" && <GooglePlayForm />}
              {settings.contentType === "social" && <SocialForm />}

              {settings.contentType === "batch" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-headline-sm text-on-surface font-bold">Batch ZIP Generation</h3>
                    <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                      Upload a CSV file to generate up to 500 QR codes in a single ZIP file.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="section-label flex justify-between items-center mb-1">
                      <span className="font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-sm">upload_file</span>Upload CSV</span>
                      <button type="button" onClick={downloadSampleCSV} className="text-xs text-primary font-bold hover:underline">Download Sample CSV</button>
                    </label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/40 rounded-3xl p-8 bg-surface/40 hover:bg-primary/5 transition-all cursor-pointer relative group overflow-hidden">
                      <input type="file" accept=".csv" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => parseCSV(e.target?.result as string);
                          reader.readAsText(file);
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-2xl">dataset</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{csvRows.length > 0 ? `${csvRows.length} rows loaded` : "Select or drag CSV file"}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{csvRows.length > 0 ? "Click or drag to replace" : "Max 500 rows supported"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {csvRows.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-outline-variant">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-on-surface-variant">QR Data Column (Required)</label>
                          <select value={dataColumn} onChange={(e) => setDataColumn(e.target.value)} className="w-full p-2.5 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:border-primary">
                            <option value="">Select column...</option>
                            {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-on-surface-variant">File Name Column (Optional)</label>
                          <select value={filenameColumn} onChange={(e) => setFilenameColumn(e.target.value)} className="w-full p-2.5 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:border-primary">
                            <option value="">Auto-generate names (QR_Item_001)</option>
                            {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="rounded-xl border border-outline-variant overflow-hidden">
                        <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant text-xs font-bold flex justify-between">
                          <span>Data Preview (First 5 rows)</span>
                          <span className="text-primary">{csvRows.length} total rows</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-surface">
                                {csvHeaders.map(h => (
                                  <th key={h} className="p-2 border-b border-outline-variant font-semibold text-on-surface-variant whitespace-nowrap">
                                    {h}
                                    {h === dataColumn && <span className="ml-1 text-primary material-symbols-outlined text-[10px]">qr_code</span>}
                                    {h === filenameColumn && <span className="ml-1 text-primary material-symbols-outlined text-[10px]">description</span>}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {csvRows.slice(0, 5).map((row, i) => (
                                <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container-lowest">
                                  {csvHeaders.map(h => (
                                    <td key={h} className="p-2 truncate max-w-[150px]" title={row[h]}>{row[h]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      case "Templates":
        const filteredTemplates = PRESET_TEMPLATES.filter(t => 
          activeTemplateCategory === "All" || t.category === activeTemplateCategory
        );

        return (
          <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <div className="flex overflow-x-auto gap-1.5 px-3 pb-3 mb-1 custom-scrollbar snap-x">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTemplateCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 tab-spring snap-start ${
                    activeTemplateCategory === cat.id
                      ? "bg-primary text-white shadow-xs scale-[1.02]"
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
        )
      case "Design": {
        const isGradientActive = settings.gradient_type && settings.gradient_type !== "Solid Color";
        return (
          <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
            {isGradientActive && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/15 rounded-lg text-xs font-medium text-primary">
                <span className="material-symbols-outlined text-base">palette</span>
                <span>Gradient Effect Active (<strong>{settings.gradient_type}</strong>). Showing both foreground start and end colors below:</span>
              </div>
            )}
            <div className={`grid grid-cols-1 ${isGradientActive ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2'} gap-6`}>
              <div className="flex flex-col h-full">
                <label className="section-label block mb-2">
                  {isGradientActive ? "Foreground (Start)" : "Foreground Color"}
                </label>
                <div className="flex items-center gap-2 h-11 px-1 mt-auto border border-outline-variant rounded-lg bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
                  <input
                    type="color"
                    value={settings.dots_color}
                    onChange={(e) => updateSettings({ dots_color: e.target.value })}
                    className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
                  />
                  <input
                    type="text"
                    value={settings.dots_color}
                    onChange={(e) => updateSettings({ dots_color: e.target.value })}
                    className="flex-1 w-full bg-transparent text-sm font-mono tracking-wider border-none outline-none focus:ring-0 px-2 text-on-surface"
                  />
                </div>
              </div>

              {isGradientActive && (
                <div className="flex flex-col h-full">
                  <label className="section-label block mb-2">Foreground (End)</label>
                  <div className="flex items-center gap-2 h-11 px-1 mt-auto border border-outline-variant rounded-lg bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
                    <input
                      type="color"
                      value={settings.dots_color_end || "#52525b"}
                      onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                      className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
                    />
                    <input
                      type="text"
                      value={settings.dots_color_end || "#52525b"}
                      onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                      className="flex-1 w-full bg-transparent text-sm font-mono tracking-wider border-none outline-none focus:ring-0 px-2 text-on-surface"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <label className="section-label block">Background Color</label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline-variant/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.bg_transparent || false}
                      onChange={(e) => updateSettings({ bg_transparent: e.target.checked, ...(e.target.checked ? { effect_shadow: "none" } : {}) })}
                      className="w-3.5 h-3.5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span>Transparent</span>
                  </label>
                </div>
                <div className={`flex items-center gap-2 h-11 px-1 mt-auto border border-outline-variant rounded-lg bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow ${settings.bg_transparent ? 'opacity-40 pointer-events-none' : ''}`}>
                  <input
                    type="color"
                    value={settings.bg_color}
                    onChange={(e) => updateSettings({ bg_color: e.target.value })}
                    className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
                  />
                  <input
                    type="text"
                    value={settings.bg_color}
                    onChange={(e) => updateSettings({ bg_color: e.target.value })}
                    className="flex-1 w-full bg-transparent text-sm font-mono tracking-wider border-none outline-none focus:ring-0 px-2 text-on-surface"
                  />
                </div>
              </div>
            </div>



            <div className="space-y-3 border-t border-outline-variant/30 pt-4 mt-4">
              <label className="section-label block mb-1">Dot Style</label>
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
                  {dotStyles.map((style) => (
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
                <label className="section-label block">Eyes Customization</label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline-variant/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.link_eyes !== false}
                    onChange={(e) => {
                      updateSettings({ link_eyes: e.target.checked });
                      if (e.target.checked) setActiveCorner("all");
                    }}
                    className="w-3.5 h-3.5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <span>Link Eyes</span>
                </label>
              </div>
              
              {settings.link_eyes === false && (
                <div className="flex gap-2 mb-3">
                  {['tl', 'tr', 'bl'].map(corner => (
                    <button
                      key={corner}
                      type="button"
                      onClick={() => setActiveCorner(corner as any)}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-medium transition-colors ${
                        activeCorner === corner 
                          ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
                          : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                      }`}
                    >
                      {corner === 'tl' ? 'Top Left' : corner === 'tr' ? 'Top Right' : 'Bottom Left'}
                    </button>
                  ))}
                </div>
              )}

              <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Frame Style</label>
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
                  {eyeFrameStyles.map((style) => {
                    const isActiveStyle = (settings.link_eyes !== false || activeCorner === "all") 
                      ? settings.eye_frame_style === style
                      : settings[`eye_frame_style_${activeCorner}` as keyof typeof settings] === style || (!settings[`eye_frame_style_${activeCorner}` as keyof typeof settings] && settings.eye_frame_style === style);
                      
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

              <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Eyeball Style</label>
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
                  {eyeballStyles.map((style) => {
                    const isActiveStyle = (settings.link_eyes !== false || activeCorner === "all") 
                      ? settings.eyeball_style === style
                      : settings[`eyeball_style_${activeCorner}` as keyof typeof settings] === style || (!settings[`eyeball_style_${activeCorner}` as keyof typeof settings] && settings.eyeball_style === style);
                      
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
                  <label className="section-label flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full border-2 border-primary inline-block"></span>
                    Eye Frame Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        (settings.link_eyes !== false || activeCorner === "all")
                          ? settings.eye_color
                          : (settings[`eye_color_${activeCorner}` as keyof typeof settings] as string || settings.eye_color)
                      }
                      onChange={(e) => {
                        const newColor = e.target.value;
                        if (settings.link_eyes !== false || activeCorner === "all") {
                           updateSettings({
                             eye_color: newColor,
                             eyeball_color: settings.eyeball_color === settings.eye_color ? newColor : settings.eyeball_color
                           });
                        } else {
                           const currentEyeball = settings[`eyeball_color_${activeCorner}` as keyof typeof settings] as string || settings.eyeball_color;
                           const currentEye = settings[`eye_color_${activeCorner}` as keyof typeof settings] as string || settings.eye_color;
                           updateSettings({
                             [`eye_color_${activeCorner}`]: newColor,
                             [`eyeball_color_${activeCorner}`]: currentEyeball === currentEye ? newColor : currentEyeball
                           });
                        }
                      }}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={
                        (settings.link_eyes !== false || activeCorner === "all")
                          ? settings.eye_color
                          : (settings[`eye_color_${activeCorner}` as keyof typeof settings] as string || settings.eye_color)
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
                  <label className="section-label flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    Eyeball Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
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
                    <input
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
      case "Logo":
        const hasLogo = settings.preset_logo !== "None" || !!settings.logo_image;
        return (
          <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
            {/* Custom Premium Drag-and-Drop Zone */}
            <div className="space-y-3">
              <label className="section-label flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
                  Custom Brand Upload
                </span>
                <span className="text-[10px] uppercase font-mono text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">PNG / JPG / WEBP</span>
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/40 rounded-3xl p-8 bg-surface/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer relative group overflow-hidden">
                <input
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
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-outline-variant/60 shadow-md bg-white p-2 relative group/thumb transition-transform group-hover:scale-105">
                      <img src={settings.logo_image} alt="Uploaded logo preview" className="w-full h-full object-contain rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-xl z-20 backdrop-blur-[2px]">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateSettings({ logo_image: null });
                          }}
                          className="p-2 bg-error text-white rounded-full hover:bg-error/90 transition-transform hover:scale-110 shadow-lg"
                        >
                          <span className="material-symbols-outlined text-[18px] leading-none">delete_forever</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-on-surface">Custom Logo Loaded</p>
                      <p className="text-[11px] text-on-surface-variant/80 font-medium mt-0.5">Hover to remove or click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center z-0">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-sm border border-primary/10">
                      <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-on-surface">Upload your logo</p>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-1">Drag & drop or click to browse (PNG, JPG)</p>
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
              <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  Icon Visual Style
                </span>

              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "badge",
                    label: "Brand Badge",
                    desc: "Vibrant solid cards",
                    icon: (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white shadow-xs">
                        <span className="material-symbols-outlined text-base">style</span>
                      </div>
                    ),
                  },
                  {
                    id: "duotone",
                    label: "Soft Glass",
                    desc: "Pastel translucent",
                    icon: (
                      <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-base">blur_on</span>
                      </div>
                    ),
                  },
                  {
                    id: "glyph",
                    label: "Pure Glyph",
                    desc: "Bare vector icon",
                    icon: (
                      <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center text-primary border border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-base">token</span>
                      </div>
                    ),
                  },
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
                      className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all duration-200 border relative ${
                        isSelected
                          ? "bg-white border-primary ring-2 ring-primary/20 text-primary shadow-sm scale-[1.02]"
                          : "bg-surface-container-lowest/60 hover:bg-white border-outline-variant/60 hover:border-primary/40 text-on-surface hover:shadow-2xs"
                      }`}
                    >
                      {style.icon}
                      <div>
                        <div className="text-[11px] font-bold tracking-tight">{style.label}</div>
                        <div className="text-[9px] text-on-surface-variant/80 font-normal">{style.desc}</div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-white"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icon Studio: Search & Category Filter Pills */}
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="section-label flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-primary">grid_view</span>
                  Preset Icon Gallery ({filteredLogos.length})
                </label>
                <div className="relative flex-1 max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">search</span>
                  <input
                    type="text"
                    placeholder="Search 30+ icons (e.g., WhatsApp, TikTok)..."
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
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {LOGO_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveLogoCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                      activeLogoCategory === category
                        ? "bg-primary text-white shadow-xs scale-[1.02]"
                        : "bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant border border-outline-variant/60"
                    }`}
                  >
                    {category === "All" && <span className="material-symbols-outlined text-xs">apps</span>}
                    {category === "Social & Apps" && <span className="material-symbols-outlined text-xs">share</span>}
                    {category === "Tech & Contact" && <span className="material-symbols-outlined text-xs">contact_page</span>}
                    {category === "Business & Pay" && <span className="material-symbols-outlined text-xs">payments</span>}
                    {category === "Media & More" && <span className="material-symbols-outlined text-xs">play_circle</span>}
                    {category}
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
                        className={`p-2 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 border transition-all duration-200 group relative ${
                          isSelected
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
                <label className="block text-xs font-bold text-on-surface flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">palette</span>
                    Preset Logo Color
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase">
                    {settings.logo_color_mode === "default" ? "Default Brand Color" : settings.logo_custom_color}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ logo_color_mode: "default" })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${settings.logo_color_mode === "default"
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-on-surface border-outline-variant hover:bg-surface-container-highest"
                      }`}
                  >
                    <span className="material-symbols-outlined text-sm">color_lens</span>
                    Default Brand
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSettings({ logo_color_mode: "custom" })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${settings.logo_color_mode === "custom"
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-on-surface border-outline-variant hover:bg-surface-container-highest"
                      }`}
                  >
                    <span className="material-symbols-outlined text-sm">colorize</span>
                    Custom Color
                  </button>
                </div>

                {settings.logo_color_mode === "custom" && (
                  <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                    <label className="text-[11px] font-semibold text-on-surface-variant block">Pick Custom Icon Color:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.logo_custom_color || "#000000"}
                        onChange={(e) => updateSettings({ logo_custom_color: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white"
                      />
                      <input
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
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm opacity-70">aspect_ratio</span>
                      Logo Size
                    </label>
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
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm opacity-70">grid_off</span>
                      Dot Clearance Around Logo
                    </label>
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
                  <label className="block text-xs font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm opacity-70">layers</span>
                    Logo Card Shape
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {logoCardShapes.map((shape) => {
                      const isSelected = settings.logo_card_shape === shape;
                      return (
                        <button
                          key={shape}
                          onClick={() => updateSettings({ logo_card_shape: shape as any })}
                          className={`py-2.5 px-1 sm:p-3 border rounded-xl text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-200 overflow-hidden text-center touch-press ${isSelected
                              ? "bg-primary text-white border-primary font-bold shadow-md ring-2 ring-primary/15"
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
                      <label className="text-xs font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm opacity-70">space_bar</span>
                        Card Padding
                      </label>
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
                          <label className="block text-xs font-semibold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm opacity-70">palette</span>
                            Color to Remove
                          </label>
                          <div className="flex items-center gap-3">
                            <input
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
                            <label className="text-xs font-semibold flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm opacity-70">tune</span>
                              Color Tolerance
                            </label>
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
        )
      case "Frames":
        return (
          <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
            <div className="space-y-3">
              <label className="section-label block mb-1">Layout Frame Style</label>
              <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
                {frameStyles.map((style) => (
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
                    <label className="block text-xs font-semibold">Frame Color</label>
                    <div className="flex items-center gap-3">
                      <input
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
                    <label className="text-xs font-semibold">Frame Padding</label>
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
                    <label className="text-xs font-semibold">Corner Radius</label>
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
                    <label className="text-xs font-semibold">Border Thickness</label>
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
              <label className="section-label block mb-1">Text Style</label>
              <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
                {textStyles.map((style) => (
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
                  <label className="block text-sm font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    Customize Frame Text
                  </label>
                  <p className="text-xs text-on-surface-variant mb-2">This text appears directly on your selected custom frame shape.</p>
                  <input
                    type="text"
                    value={settings.frame_text}
                    onChange={(e) => updateSettings({ frame_text: e.target.value })}
                    className="w-full p-4 border-2 border-primary/30 rounded-xl bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-bold text-lg text-center shadow-inner"
                    placeholder="e.g. SCAN ME"
                  />
                </div>

                <div className="space-y-3">
                  <label className="section-label block mb-1">Font Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {fontStyles.map((font) => (
                      <button
                        key={font}
                        onClick={() => updateSettings({ font_name: font as any })}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${settings.font_name === font
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-white hover:bg-muted border-outline-variant text-on-surface"
                          }`}
                      >
                        <span style={{ fontFamily: font.split(" (")[0] }} className="text-2xl leading-none">Ag</span>
                        <span className="text-[10px] font-body-md opacity-80">{font.split(" (")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold">Frame Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.frame_color}
                        onChange={(e) => updateSettings({ frame_color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant"
                      />
                      <span className="text-sm font-mono text-on-surface-variant uppercase">{settings.frame_color}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold">Text Color</label>
                    <div className="flex items-center gap-3">
                      <input
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
                      <label className="text-xs font-semibold">Text Size</label>
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
        )
      case "Effects": {
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
      case "Advanced":
        return (
          <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-8">
            <div>
              <h3 className="font-headline-sm text-on-surface font-bold">Advanced QR Engine Controls</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                Fine-tune redundancy, error recovery, and structural spacing for precision scanning.
              </p>
            </div>

            {/* Error Correction Level */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                  Error Correction Level
                </label>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {settings.error_correction === "L" && "Low (7% Recovery)"}
                  {settings.error_correction === "M" && "Medium (15% Recovery)"}
                  {settings.error_correction === "Q" && "Quartile (25% Recovery)"}
                  {settings.error_correction === "H" && "High (30% Recovery)"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Determines how much data can be damaged or hidden (by logos) while retaining scannability.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { id: "L", name: "Low", desc: "~7%" },
                  { id: "M", name: "Medium", desc: "~15%" },
                  { id: "Q", name: "Quartile", desc: "~25%" },
                  { id: "H", name: "High", desc: "~30%" },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateSettings({ error_correction: level.id as any })}
                    className={`p-3 sm:p-3.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${settings.error_correction === level.id
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                        : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                      }`}
                  >
                    <span className="text-xs sm:text-sm md:text-base font-bold whitespace-nowrap">{level.id} - {level.name}</span>
                    <span className="text-[10px] sm:text-[11px] text-on-surface-variant mt-0.5">{level.desc}</span>
                  </button>
                ))}
              </div>
              <ScannabilityAlert
                show={settings.error_correction !== "H"}
                message="Test scan recommended"
                compact={true}
              />
            </div>

            {/* Quiet Zone (Border Width) */}
            <div className="space-y-3 border-t border-outline-variant pt-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">margin</span>
                  Quiet Zone (Border Width)
                </label>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {settings.quiet_zone} Modules
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                The blank padding around the QR matrix. Standard specification requires at least 4 modules.
              </p>
              <Slider min="0"
                max="10"
                value={settings.quiet_zone}
                onChange={(val) => updateSettings({ quiet_zone: val })}
                
               />
              <ScannabilityAlert
                show={settings.quiet_zone > 4}
                message="Test scan recommended"
                compact={true}
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant font-semibold px-1">
                <span>0 (No Border)</span>
                <span>4 (Standard)</span>
                <span>10 (Spacious)</span>
              </div>
            </div>

            {/* Background Image Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">image</span>
                  Background Image
                </label>
                {settings.bg_image && (
                  <button 
                    type="button"
                    onClick={() => updateSettings({ bg_image: null, bg_image_opacity: 100 })}
                    className="text-xs font-semibold text-error hover:bg-error/10 px-2 py-0.5 rounded transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">
                Overlay your QR code onto a custom background image with adjustable transparency.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 border border-outline-variant rounded-xl bg-surface hover:bg-surface-variant transition-colors relative h-12 flex items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          updateSettings({ bg_image: ev.target?.result as string, bg_image_opacity: 100 });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                    {settings.bg_image ? "Change Background" : "Upload Background"}
                  </span>
                </div>
              </div>
              {settings.bg_image && (
                <div className="mt-3 bg-surface-container rounded-xl p-3 border border-outline-variant/30 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-on-surface">Opacity</label>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{settings.bg_image_opacity ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={settings.bg_image_opacity ?? 100}
                    onChange={(e) => updateSettings({ bg_image_opacity: parseInt(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )
      case "Download":
        if (settings.contentType === "batch") {
          return (
            <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-8">
              <div>
                <h3 className="font-headline-sm text-on-surface font-bold">Batch ZIP Export</h3>
                <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                  Choose your preferred file format, custom resolution, and generate your ZIP archive.
                </p>
              </div>

              {csvRows.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">upload_file</span>
                  <p className="font-bold text-on-surface">No CSV Data</p>
                  <p className="text-sm text-on-surface-variant mt-1">Please upload a CSV file in the Content tab first.</p>
                  <button onClick={() => setActiveTab("Content")} className="mt-4 text-primary font-bold hover:underline text-sm bg-primary/10 px-4 py-2 rounded-lg">Go to Content</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Format and Size */}
                  <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-on-surface">Export Format</label>
                      <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50">
                        {["PNG", "SVG", "PDF"].map(fmt => (
                          <button key={fmt} type="button" onClick={() => setBatchFormat(fmt)} className={`flex-1 py-2.5 rounded-md font-bold transition-all text-sm ${batchFormat === fmt ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>{fmt}</button>
                        ))}
                      </div>
                    </div>
                    {batchFormat === "PNG" && (
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-on-surface">Size (px)</label>
                        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50">
                          {["512", "1024", "2048"].map(s => (
                            <button key={s} type="button" onClick={() => setBatchSize(s)} className={`flex-1 py-2.5 rounded-md font-bold transition-all text-sm ${batchSize === s ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleBatchDownload}
                    disabled={isBatchGenerating || !dataColumn}
                    className="hidden lg:flex w-full py-4 rounded-xl font-bold items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all text-base"
                  >
                    {isBatchGenerating ? (
                      <><span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span> Generating Batch Archive...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[24px]">bolt</span> Generate & Download ZIP ({csvRows.length > 500 ? 500 : csvRows.length} items)</>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-8">
            <div>
              <h3 className="font-headline-sm text-on-surface font-bold">Export & Download</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                Choose your preferred file format, custom resolution, and filename before exporting.
              </p>
            </div>

            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-on-surface block">1. Select Format</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "PNG", icon: "image", desc: "Best for web, social & apps" },
                  { id: "SVG", icon: "polyline", desc: "Infinite scaling for print & vectors" },
                  { id: "PDF", icon: "picture_as_pdf", desc: "Print-ready document format" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setDownloadFormat(fmt.id as any)}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-200 ${downloadFormat === fmt.id
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                        : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                      }`}
                  >
                    <span className="material-symbols-outlined text-2xl mb-1">{fmt.icon}</span>
                    <span className="text-base font-bold">{fmt.id}</span>
                    <span className="text-[11px] text-on-surface-variant mt-1 leading-tight">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector (for formats with raster elements) */}
            {showResolutionSelector && (
              <div className="space-y-3 border-t border-outline-variant pt-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface block">
                    2. Output Resolution {downloadFormat !== "PNG" && <span className="text-on-surface-variant font-normal">(applies to embedded graphics)</span>}
                  </label>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {downloadSize} x {downloadSize} px
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[512, 1024, 2048, 4096, 8192].map((size) => (
                  <button
                    key={size}
                    onClick={() => setDownloadSize(size)}
                    className={`flex-1 min-w-[50px] py-2.5 px-1 rounded-xl border text-[11px] sm:text-xs font-bold transition-all ${downloadSize === size
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                      }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
              {/* Scaling Options */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex flex-col gap-3 mt-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input type="checkbox" checked={noStretching} onChange={(e) => setNoStretching(e.target.checked)} className="peer sr-only" />
                      <div className="w-5 h-5 rounded border-2 border-primary/50 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface">Native Resolution (No Stretching)</p>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Generates the exact target size natively. Perfect for sharp pixel-art squares, but may distort complex shapes. Uncheck to use Lanczos upscaling for smooth curves.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Custom Filename */}
            <div className="space-y-3 border-t border-outline-variant pt-6">
              <label className="text-sm font-semibold text-on-surface block">
                {showResolutionSelector ? "3." : "2."} File Name
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={`QRStream-${settings.contentType}`}
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all"
                />
                <span className="absolute right-4 text-xs font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-1 rounded-md">
                  .{downloadFormat.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 mt-2">
              <ScannabilityAlert
                show={settings.logo_size_ratio > 0.18 || settings.logo_clear_size > 0.5 || settings.quiet_zone > 4 || settings.error_correction !== "H"}
                message="You have modified scannability settings from their defaults. Please test the QR scan first to ensure it scans reliably."
              />
            </div>
            <div className="hidden lg:flex border-t border-outline-variant pt-6 flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadCustom}
                disabled={isLoading || isError || isDownloading || isCopying}
                className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 btn-spring shadow-lg text-base ${downloadSuccess
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 animate-celebrate"
                    : isDownloading
                      ? "bg-primary/80 text-white cursor-wait shadow-sm animate-pulse"
                      : "bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white shadow-md hover:shadow-lg hover:scale-[1.015]"
                  } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isDownloading ? (
                  <>
                    <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                    <span>Rendering High-Res {downloadFormat}...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-2xl animate-[spin_400ms_ease-out_1]">check_circle</span>
                    <span>Downloaded Successfully!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl">download</span>
                    <span>
                      Download {downloadFormat} {downloadFormat === "PNG" ? `(${downloadSize}px)` : ""}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyToClipboard}
                disabled={isLoading || isError || isDownloading || isCopying}
                className={`py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 border btn-spring shadow-sm ${copySuccess
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 animate-celebrate"
                    : isCopying
                      ? "bg-surface-container-highest text-on-surface cursor-wait border-outline-variant"
                      : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-highest hover:border-zinc-300 hover:shadow-md hover:scale-[1.015]"
                  } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isCopying ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                    <span>Copying...</span>
                  </>
                ) : copySuccess ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-[spin_400ms_ease-out_1]">check_circle</span>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">content_copy</span>
                    <span>Copy PNG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }
  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard clause: Don't trigger if typing in an input
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
        return;
      }
      
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
            setToast({ message: "Redone", icon: "redo" });
          } else {
            undo();
            setToast({ message: "Undone", icon: "undo" });
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
          setToast({ message: "Redone", icon: "redo" });
        } else if (e.key === 's') {
          e.preventDefault();
          handleDownloadCustom();
        } else if (e.key === 'c') {
          const selection = window.getSelection();
          if (selection && selection.toString().length === 0) {
            e.preventDefault();
            handleCopyToClipboard();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleDownloadCustom, handleCopyToClipboard]);

  return (
    <div className="lg:min-h-screen flex flex-col font-body-md text-on-surface bg-background antialiased pt-14 sm:pt-16">

      {/* TopNavBar with mobile hamburger */}
      <nav className="fixed w-full top-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm backdrop-blur-md bg-opacity-95 safe-top">
        <div className="flex justify-between items-center h-14 sm:h-16 px-4 sm:px-gutter w-full">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="text-sm font-semibold text-on-surface tracking-tight flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-[11px] font-bold">QR</span>
              QRStream
            </span>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-on-surface font-semibold text-sm border-b-2 border-primary pb-1">Generator</a>
              <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors duration-200">My Codes</a>
              <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors duration-200">Resources</a>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors touch-press"
          >
            <span className="material-symbols-outlined text-on-surface">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-4 py-3 space-y-1 shadow-lg">
            <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary font-bold min-h-[48px]">
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
              Generator
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors min-h-[48px]">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              My Codes
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors min-h-[48px]">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              Resources
            </a>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      {isOffline && (
        <div className="bg-error text-error-on-container px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md z-40 animate-in slide-in-from-top-2 duration-300">
          <span className="material-symbols-outlined text-[18px]">wifi_off</span>
          You are offline. QR code updates are paused until connection is restored.
        </div>
      )}
      <div className="flex flex-1 w-full relative">

        {/* Desktop Sidebar */}
        <aside className="w-20 xl:w-72 border-r border-outline-variant bg-surface-container-lowest hidden lg:flex flex-col py-6 px-2 xl:px-4 gap-2 sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300">
          <div className="mb-3 px-1 xl:px-2 flex flex-col items-center xl:items-start text-center xl:text-left overflow-hidden">
            <h2 className="text-xs xl:text-sm font-semibold text-on-surface tracking-tight truncate w-full">
              <span className="xl:hidden">Tools</span>
              <span className="hidden xl:inline">Customization</span>
            </h2>
            <p className="hidden xl:block text-xs text-on-surface-variant mt-0.5">Personalize your QR code</p>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                title={tab.name}
                className={`w-full flex items-center justify-center xl:justify-start gap-3 px-0 xl:px-3 py-2.5 rounded-lg text-[13px] font-medium tab-spring relative sidebar-item ${
                  activeTab === tab.name
                    ? "sidebar-item-active"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] xl:text-[18px] transition-colors ${activeTab === tab.name ? "text-primary" : "text-on-surface-variant"}`}>{tab.icon}</span>
                <span className="hidden xl:inline whitespace-nowrap">{tab.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Workspace panel */}
        <div className="flex-1 min-w-0 max-w-full lg:p-margin-desktop bg-surface lg:pb-margin-desktop">

          <div className="max-w-container-max mx-auto w-full max-w-full">

            {/* DESKTOP LAYOUT (lg and above) */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8 items-start p-margin-desktop max-w-full">

              {/* Left Column: Desktop Config Forms */}
              <div className="lg:col-span-7 space-y-8 max-w-full">
                <header className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
                  <div>
                    <h1 className="text-xl font-semibold text-on-surface tracking-tight">Generate New QR Code</h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Choose your data type and customize the appearance.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/50 shadow-2xs shrink-0 select-none">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                      title="Undo (Step Back in Time)"
                    >
                      <span className="material-symbols-outlined text-[18px] group-active:-rotate-45 transition-transform duration-200">undo</span>
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                      title="Redo (Step Forward)"
                    >
                      <span className="material-symbols-outlined text-[18px] group-active:rotate-45 transition-transform duration-200">redo</span>
                    </button>
                    <div className="w-[1px] h-5 bg-outline-variant/50 mx-1"></div>
                    <button
                      onClick={resetSettings}
                      className="py-1.5 px-3 rounded-lg bg-error-container/20 hover:bg-error-container/40 text-error font-semibold text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-2xs group"
                      title="Reset Design to Default (Safely Preserves Your Content)"
                    >
                      <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">restart_alt</span>
                      <span>Reset Design</span>
                    </button>
                  </div>
                </header>

                <div className="bg-white rounded-2xl p-6 md:p-8 surface-ring-vercel max-w-full panel-enter" key={activeTab}>
                  {renderPanelContent(activeTab)}
                </div>
              </div>

              {/* Right Column: Sticky Live Preview */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 relative" ref={previewRef}>
                {/* Framer-style Ambient Hero Glow */}
                <div className="absolute -inset-4 sm:-inset-6 ambient-hero-glow -z-10 pointer-events-none rounded-[40px]" />

                <div className="bg-white rounded-3xl p-6 md:p-8 surface-ring-vercel space-y-6 sm:space-y-8 relative z-10">

                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-on-surface">Live Preview</h3>
                    <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-medium rounded-full flex items-center gap-1.5 tracking-wider uppercase">
                      <span className="pulse-dot"></span>
                      Live
                    </span>
                  </div>

                  {/* QR Preview Surface */}
                  <div
                    id="qr-preview-container"
                    className={`aspect-square flex items-center justify-center relative overflow-hidden group p-8 rounded-2xl surface-ring-vercel transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[#18181b]' : previewBg === 'transparent' ? 'bg-[#f3f4f6]' : previewBg === 'white' ? 'bg-[#f4f4f5]' : 'bg-[#f9fafb]'}`}
                    style={previewBg === 'transparent' ? {
                      backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    } : previewBg === 'light' ? {
                      backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    } : {}}
                  >
                    {/* Background Tester Toggle */}
                    <div className={`absolute top-3 left-3 z-30 flex backdrop-blur-md rounded-full p-1 shadow-sm border gap-0.5 ${previewBg === 'dark' ? 'bg-[#27272a]/90 border-white/10' : 'bg-white/90 border-outline-variant/30'}`}>
                      <button onClick={() => setPreviewBg("white")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "white" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Solid Light Background">
                        <span className="w-4 h-4 rounded-full bg-[#f4f4f5] border border-outline-variant/60 shadow-inner"></span>
                      </button>
                      <button onClick={() => setPreviewBg("light")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "light" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Light Background">
                        <span className="w-4 h-4 rounded-full bg-[#f9fafb] border border-outline-variant/60 shadow-inner"></span>
                      </button>
                      <button onClick={() => setPreviewBg("dark")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "dark" ? "bg-[#3f3f46] shadow-sm ring-1 ring-black/50" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Dark Background">
                        <span className="w-4 h-4 rounded-full bg-[#18181b] border border-black shadow-inner"></span>
                      </button>
                      <button onClick={() => setPreviewBg("transparent")} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${previewBg === "transparent" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Transparent (Checkerboard) Background">
                        <span className="w-4 h-4 rounded-full border border-outline-variant/60 shadow-inner" style={{ backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px" }}></span>
                      </button>
                    </div>

                    <div className="absolute inset-0 canvas-aura pointer-events-none"></div>
                    <div className={`absolute inset-0 opacity-5 ${previewBg === 'dark' ? 'invert' : ''} ${previewBg === 'white' ? 'hidden' : ''}`} style={{ backgroundImage: "radial-gradient(#18181b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                    <div
                      className={`relative z-10 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${zoomLevel === 1 && !isLoading && !isFetching ? 'group-hover:scale-[1.06]' : ''}`}
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      <img
                        src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"}
                        alt="QR Code Preview"
                        className={`w-full aspect-square max-w-[240px] max-h-[240px] object-contain transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isComparing ? 'grayscale contrast-125 opacity-90' : ''} ${isError ? 'opacity-40 grayscale' : ''}`}
                        style={settings.bg_transparent ? {
                          backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                          backgroundSize: "16px 16px",
                          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "12px",
                          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)"
                        } : {}}
                      />
                      
                      {/* Offline / Error Overlay */}
                      {isError && (
                        <div className="absolute inset-0 rounded-xl overflow-hidden flex items-center justify-center pointer-events-none">
                          <div className="bg-error/90 text-white px-3 py-2 rounded-lg flex flex-col items-center shadow-lg backdrop-blur-sm">
                            <span className="material-symbols-outlined text-xl mb-0.5">wifi_off</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Offline</span>
                          </div>
                        </div>
                      )}

                      {/* Shimmer Overlay for Loading State */}
                      {((isLoading || isFetching) && !isError) && (
                        <div className="absolute inset-0 rounded-xl overflow-hidden backdrop-blur-[4px] bg-white/40 flex items-center justify-center transition-opacity duration-300 delay-150">
                          <div className="absolute inset-0 skeleton-shimmer"></div>
                          <span className="material-symbols-outlined animate-spin text-primary text-3xl relative z-10">autorenew</span>
                        </div>
                      )}
                      
                    </div>
                  </div>

                  {/* Segmented Controls (Zoom & Tools) */}
                  <div className="flex items-center justify-between gap-1 bg-surface-container-low p-1.5 rounded-full border border-outline-variant/60 shadow-inner">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setZoomLevel(1)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${zoomLevel === 1 ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                        title="Zoom 100%"
                      >
                        <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                      </button>
                      <button
                        onClick={() => setZoomLevel(2)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${zoomLevel === 2 ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                        title="Zoom 200%"
                      >
                        <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                      </button>
                    </div>
                    
                    <div className="w-[1px] h-5 bg-outline-variant/50 mx-1"></div>
                    
                    <div className="flex items-center gap-1">
                      
                      <button
                        onClick={handleFullscreen}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-200"
                        title="Full Screen"
                      >
                        <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                      </button>
                      <button
                        onClick={() => setIsComparing(!isComparing)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isComparing ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                        title="Compare Raw"
                      >
                        <span className="material-symbols-outlined text-[18px]">compare</span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-200"
                        title="Share"
                      >
                        <span className="material-symbols-outlined text-[18px]">share</span>
                      </button>
                    </div>
                  </div>

                  {/* Premium Metadata Badges */}
                  <div className="pt-5 border-t border-outline-variant/50 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all">
                      <span className="material-symbols-outlined text-[14px] text-primary">aspect_ratio</span>
                      <span className="text-xs font-bold text-on-surface">{targetResolution}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all">
                      <span className="material-symbols-outlined text-[14px] text-primary">shield_locked</span>
                      <span className="text-xs font-bold text-on-surface">Level {settings.error_correction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE LAYOUT (below lg breakpoint) — Sleek Single-Scroll Architecture */}
            <div className="lg:hidden w-full max-w-[100vw] bg-surface min-h-screen">
              <div className="bg-white flex flex-col max-w-full relative">

                {/* ── STICKY ULTRA-COMPACT HEADER: Mini-Preview + Navigation ── */}
                <div className="sticky top-14 sm:top-16 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm transition-all duration-200">

                  {/* Compact Bar with Live QR Engine */}
                  <div className="px-3.5 py-2 flex items-center justify-between gap-2.5 border-b border-outline-variant/30">
                    <div 
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer active:scale-[0.98] transition-transform group touch-press"
                      onClick={handleFullscreen}
                      title="Tap to view fullscreen"
                    >
                      <div className="bg-white rounded-xl border border-outline-variant/60 p-1 w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] shrink-0 aspect-square flex items-center justify-center shadow-2xs relative overflow-hidden">
                        {(isLoading || isFetching) && !isError ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-10 delay-150">
                            <span className="material-symbols-outlined animate-spin text-primary text-xl">autorenew</span>
                          </div>
                        ) : null}
                        {isError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-error/90 backdrop-blur-[2px] z-10 text-white">
                            <span className="material-symbols-outlined text-lg">wifi_off</span>
                          </div>
                        )}
                        
                        <img src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"} alt="QR Preview" className={`w-full h-full object-contain ${isError ? 'opacity-40 grayscale' : ''}`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                          <span className="material-symbols-outlined text-white drop-shadow-md text-[20px]">fullscreen</span>
                        </div>
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary truncate">Live Engine</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-on-surface truncate group-active:text-primary transition-colors">{settings.contentType} QR Code</p>
                        <p className="text-[10px] sm:text-[11px] text-on-surface-variant truncate flex items-center gap-1">
                          Level {settings.error_correction} • {downloadFormat}
                          <span className="material-symbols-outlined text-[10px] opacity-70">open_in_full</span>
                        </p>
                      </div>
                    </div>

                    {/* Compact Quick Tools */}
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={handleFullscreen} className="p-2 bg-surface hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-xl border border-outline-variant/40 flex items-center justify-center text-xs font-bold gap-1 shadow-2xs min-w-[36px] min-h-[36px] touch-press" title="View Fullscreen">
                        <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                        <span className="hidden sm:inline text-xs">Expand</span>
                      </button>
                      
                    </div>
                  </div>

                  {/* Slim Main Segment Tabs: Content | Design | Download & Undo/Redo/Reset */}
                  <div className="px-3 py-1.5 border-b border-outline-variant/20 flex items-center justify-between gap-2.5 overflow-x-auto custom-scrollbar">
                    <div className="bg-surface border border-outline-variant/70 rounded-xl p-1 grid grid-cols-3 gap-1 flex-1 min-w-[240px] max-w-[300px] sm:max-w-[340px] shrink-0">
                      <button
                        onClick={() => setMobileMainTab('content')}
                        className={`flex items-center justify-center py-1.5 px-3 rounded-lg font-bold transition-all text-xs sm:text-[13px] touch-press ${mobileMainTab === 'content'
                            ? 'bg-white text-on-surface border border-outline-variant/60 shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                      >
                        Content
                      </button>

                      <button
                        onClick={() => setMobileMainTab('design')}
                        className={`flex items-center justify-center py-1.5 px-3 rounded-lg font-bold transition-all text-xs sm:text-[13px] touch-press ${mobileMainTab === 'design'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                      >
                        Design
                      </button>

                      <button
                        onClick={() => setMobileMainTab('download')}
                        className={`flex items-center justify-center py-1.5 px-3 rounded-lg font-bold transition-all text-xs sm:text-[13px] touch-press ${mobileMainTab === 'download'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                      >
                        Download
                      </button>
                    </div>

                    {/* Mobile Time-Travel Controls */}
                    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/50 shadow-2xs shrink-0 select-none">
                      <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-90 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                        title="Undo"
                      >
                        <span className="material-symbols-outlined text-[15px] group-active:-rotate-45 transition-transform duration-200">undo</span>
                      </button>
                      <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-90 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                        title="Redo"
                      >
                        <span className="material-symbols-outlined text-[15px] group-active:rotate-45 transition-transform duration-200">redo</span>
                      </button>
                      <div className="w-[1px] h-4 bg-outline-variant/50 mx-0.5"></div>
                      <button
                        onClick={resetSettings}
                        className="p-1.5 rounded-lg bg-error-container/20 hover:bg-error-container/40 text-error transition-all duration-200 active:scale-90 flex items-center justify-center border border-error/20 shadow-2xs group"
                        title="Reset Design"
                      >
                        <span className="material-symbols-outlined text-[15px] group-active:scale-95">restart_alt</span>
                      </button>
                    </div>
                  </div>

                  {/* Compact Sub-Tabs Row (Visible when Design main tab is selected) */}
                  {mobileMainTab === 'design' && (
                    <div className="w-full min-w-0 max-w-full overflow-x-auto custom-scrollbar flex gap-1.5 px-3 py-1.5 select-none bg-surface-container-lowest scroll-smooth scroll-pl-3">
                      {[
                        { name: "Templates", label: "Templates" },
                        { name: "Shape", label: "Shape" },
                        { name: "Logo", label: "Logo" },
                        { name: "Frames", label: "Frames" },
                        { name: "Effects", label: "Effects" },
                        { name: "Advanced", label: "Advanced" },
                      ].map((tab) => {
                        const isSelected = mobileDesignSubTab === tab.name;
                        return (
                          <button
                            key={tab.name}
                            onClick={() => setMobileDesignSubTab(tab.name)}
                            className={`py-1 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap touch-press ${isSelected
                                ? 'bg-primary/10 text-primary shadow-2xs'
                                : 'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                              }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── PANEL CONTENT (Single native scroll flow without double scrollbars!) ── */}
                <div className="p-4 sm:p-5 bg-white overflow-hidden">
                  <div className="panel-enter" key={mobileMainTab === 'content' ? 'content' : mobileMainTab === 'download' ? 'download' : mobileDesignSubTab}>
                    {mobileMainTab === 'content'
                      ? renderPanelContent('Content')
                      : mobileMainTab === 'download'
                      ? renderPanelContent('Download')
                      : renderPanelContent(mobileDesignSubTab === 'Shape' ? 'Design' : mobileDesignSubTab)
                    }
                  </div>
                </div>

                {/* ── ACTION FOOTER: DOWNLOAD & COPY (In-Flow directly above SEO section) ── */}
                <div className="border-t border-outline-variant/40 bg-surface-container-lowest p-4 sm:p-6 flex flex-col gap-3 shadow-2xs rounded-b-3xl">
                  <div className="-mt-2 mb-1">
                    <ScannabilityAlert
                      show={settings.logo_size_ratio > 0.18 || settings.logo_clear_size > 0.5 || settings.quiet_zone > 4 || settings.error_correction !== "H"}
                      message="You have modified scannability settings from their defaults. Please test the QR scan first to ensure it scans reliably."
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={settings.contentType === 'batch' ? handleBatchDownload : handleDownloadCustom}
                      disabled={isLoading || isError || isDownloading || (settings.contentType === 'batch' && isBatchGenerating)}
                      className="flex-1 py-3.5 px-4 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 btn-spring min-h-[48px]"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isDownloading || isBatchGenerating ? 'animate-spin' : ''}`}>
                        {isDownloading || isBatchGenerating ? 'progress_activity' : 'download'}
                      </span>
                      {isDownloading || isBatchGenerating 
                        ? 'Generating...' 
                        : settings.contentType === 'batch' 
                          ? 'Download ZIP' 
                          : `Download ${downloadFormat}`
                      }
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      disabled={isLoading || isError || isCopying}
                      className={`py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border shadow-sm btn-spring min-h-[48px] ${
                        copySuccess ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/25 animate-celebrate' : 'bg-white border-outline-variant/80 text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${copySuccess ? 'animate-[spin_350ms_ease-out_1]' : ''}`}>{copySuccess ? 'check' : 'content_copy'}</span>
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── IN-APP FULLSCREEN / EXPANDED PREVIEW MODAL LIGHTBOX ── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn" onClick={() => setIsFullscreen(false)}>
          <div 
            className={`relative rounded-3xl p-8 sm:p-12 max-w-[90vw] max-h-[80vh] flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden touch-none transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[#18181b]' : previewBg === 'transparent' ? 'bg-[#f3f4f6]' : previewBg === 'white' ? 'bg-[#f4f4f5]' : 'bg-[#f9fafb]'}`}
            style={previewBg === 'transparent' ? {
              backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            } : previewBg === 'light' ? {
              backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            } : {}} 
            onClick={(e) => e.stopPropagation()} 
            onWheel={(e) => {
              const delta = e.deltaY * -0.003;
              setZoomLevel(prev => Math.min(5, Math.max(0.5, prev + delta)));
            }}
            onDoubleClick={() => setZoomLevel(1)}
            onTouchStart={(e) => {
              if (e.touches.length === 2) {
                const dist = Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                );
                setTouchDistance(dist);
                setInitialZoom(zoomLevel);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 2 && touchDistance !== null) {
                const currentDist = Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                );
                const scale = currentDist / touchDistance;
                setZoomLevel(Math.min(5, Math.max(0.5, initialZoom * scale)));
              }
            }}
            onTouchEnd={(e) => {
              setTouchDistance(null);
              if (e.changedTouches.length === 1) {
                const now = Date.now();
                if (now - lastTap < 300) {
                  setZoomLevel(1);
                }
                setLastTap(now);
              }
            }}
          >
            {/* Background Tester Toggle in Fullscreen */}
            <div className={`absolute top-4 left-4 z-50 flex backdrop-blur-md rounded-full p-1 shadow-sm border gap-0.5 ${previewBg === 'dark' ? 'bg-[#27272a]/90 border-white/10' : 'bg-white/90 border-outline-variant/30'}`}>
              <button onClick={(e) => { e.stopPropagation(); setPreviewBg("white"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "white" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Solid Light Background">
                <span className="w-5 h-5 rounded-full bg-[#f4f4f5] border border-outline-variant/60 shadow-inner pointer-events-none"></span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setPreviewBg("light"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "light" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Light Background">
                <span className="w-5 h-5 rounded-full bg-[#f9fafb] border border-outline-variant/60 shadow-inner pointer-events-none"></span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setPreviewBg("dark"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "dark" ? "bg-[#3f3f46] shadow-sm ring-1 ring-black/50" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Dark Background">
                <span className="w-5 h-5 rounded-full bg-[#18181b] border border-black shadow-inner pointer-events-none"></span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setPreviewBg("transparent"); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${previewBg === "transparent" ? "bg-white shadow-sm ring-1 ring-outline-variant/30" : "hover:bg-black/5 dark:hover:bg-white/10"}`} title="Transparent Background">
                <span className="w-5 h-5 rounded-full border border-outline-variant/60 shadow-inner pointer-events-none" style={{ backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px" }}></span>
              </button>
            </div>

            <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-50 w-12 h-12 sm:w-10 sm:h-10 bg-surface hover:bg-surface-container-high rounded-full flex items-center justify-center text-on-surface transition-colors shadow-sm touch-press" title="Close">
              <span className="material-symbols-outlined text-xl pointer-events-none">close</span>
            </button>

            <div style={{ transform: `scale(${zoomLevel})` }} className="relative">
              <img
                src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"}
                alt="Expanded QR Preview"
                className={`w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] object-contain ${isComparing ? 'grayscale contrast-125 opacity-90' : ''} ${isError ? 'opacity-40 grayscale' : ''}`}
                style={settings.bg_transparent ? {
                  backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)"
                } : {}}
              />
              
              {isError && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center pointer-events-none">
                  <div className="bg-error/90 text-white px-6 py-4 rounded-xl flex flex-col items-center shadow-2xl backdrop-blur-md">
                    <span className="material-symbols-outlined text-4xl mb-2">wifi_off</span>
                    <span className="text-sm font-bold uppercase tracking-widest">Offline</span>
                    <span className="text-xs opacity-90 mt-1">Cannot fetch new preview</span>
                  </div>
                </div>
              )}

              {((isLoading || isFetching) && !isError) && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden backdrop-blur-[4px] bg-white/40 flex flex-col items-center justify-center transition-opacity duration-300 delay-150">
                  <span className="material-symbols-outlined animate-spin text-primary text-5xl relative z-10 mb-3">autorenew</span>
                  <span className="text-sm font-semibold text-primary">Generating...</span>
                </div>
              )}
            </div>
          </div>

          {/* Floating Controls Bar in Lightbox */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-outline-variant/60 z-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))} className="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors hover:bg-black/5 text-on-surface touch-press" title="Zoom Out">
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="text-xs font-bold w-12 text-center text-on-surface">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.25))} className="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors hover:bg-black/5 text-on-surface touch-press" title="Zoom In">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
            <div className="w-px h-7 bg-outline-variant/60 my-1 mx-0.5"></div>
            
            <button onClick={() => setIsComparing(!isComparing)} className={`h-10 px-3 flex items-center justify-center gap-1.5 transition-colors rounded-xl duration-200 text-xs font-bold touch-press ${isComparing ? 'bg-primary text-white shadow-md' : 'hover:bg-black/5 text-on-surface'}`} title="Compare Raw">
              <span className="material-symbols-outlined text-[18px]">compare</span>
              <span className="hidden sm:inline">Compare</span>
            </button>
            <button onClick={handleShare} className="h-10 px-3 flex items-center justify-center gap-1.5 hover:bg-black/5 transition-colors text-on-surface text-xs font-bold rounded-xl duration-200 touch-press" title="Share">
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span className="hidden sm:inline">Share</span>
            </button>
            <div className="w-px h-7 bg-outline-variant/60 my-1 mx-0.5"></div>
            <button onClick={() => setIsFullscreen(false)} className="h-10 px-3 font-bold rounded-xl text-error hover:bg-error/10 flex items-center justify-center gap-1 text-xs transition-colors touch-press">
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>Close</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-[slide-up_0.3s_ease-out_forwards]">
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-highest/90 backdrop-blur-md border border-outline-variant/60 shadow-lg rounded-full text-on-surface font-semibold text-sm">
            <span className={`material-symbols-outlined text-[20px] ${toast.icon === 'error' ? 'text-error' : 'text-primary'}`}>{toast.icon}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
