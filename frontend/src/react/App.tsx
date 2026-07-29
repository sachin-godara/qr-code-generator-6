import { Slider } from "@/components/ui/Slider"
import { useState, useEffect, useRef, useCallback } from "react"
import { useQRStore } from "@/store/useQRStore"
import { useQuery } from "@tanstack/react-query"
import { type ContentType, type QRSettings } from "@/types/qr"
import { PRESET_TEMPLATES } from "@/data/templates"
import { DOT_STYLES, EYE_FRAME_STYLES, EYEBALL_STYLES, FRAME_STYLES, TEXT_STYLES } from "@/data/options"
import { StylePreviewCard } from "@/components/previews/StylePreviewCard"
import { PresetLogoPreview, getReactLogoPngDataUrl, PRESET_LOGO_BRAND_COLORS, LOGO_ITEMS, LOGO_CATEGORIES } from "@/components/previews/SvgIcons"

const TEMPLATE_CATEGORIES = [
  { id: "All", name: "All", icon: "apps" },
  { id: "Business", name: "Business", icon: "business_center" },
  { id: "Marketing", name: "Marketing", icon: "campaign" },
  { id: "Restaurant", name: "Restaurant", icon: "restaurant" },
  { id: "Events", name: "Events", icon: "event" },
  { id: "Social", name: "Social", icon: "share" },
  { id: "Retail", name: "Retail", icon: "storefront" },
  { id: "Education", name: "Education", icon: "school" },
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
    data: contentData,
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



function App() {
  const { settings, updateSettings, applyTemplate, undo, redo, resetSettings, history, historyIndex } = useQRStore()
  const [activeTab, setActiveTab] = useState<string>("Content")
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>("All")
  const [logoSearchQuery, setLogoSearchQuery] = useState<string>("")
  const [activeLogoCategory, setActiveLogoCategory] = useState<string>("All")
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const [vcard, setVcard] = useState({ fn: '', ln: '', org: '', title: '', tel: '', email: '', url: '' })
  const [event, setEvent] = useState({ title: '', desc: '', loc: '', start: '', end: '' })
  const [sms, setSms] = useState({ phone: '', msg: '' })
  const [wifi, setWifi] = useState({ ssid: '', type: 'WPA/WPA2', pass: '' })
  const [phone, setPhone] = useState({ number: '' })
  const [crypto, setCrypto] = useState({ currency: 'bitcoin', address: '', amount: '' })
  const [location, setLocation] = useState({ type: 'coords', lat: '', lng: '', query: '' })
  const [paypal, setPaypal] = useState({ username: '', amount: '', currency: 'USD' })
  const [appstore, setAppstore] = useState({ store: 'apple', url: '' })

  // Batch Generation State
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [dataColumn, setDataColumn] = useState<string>("")
  const [filenameColumn, setFilenameColumn] = useState<string>("")
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false)
  const [batchFormat, setBatchFormat] = useState<string>("PNG")
  const [batchSize, setBatchSize] = useState<string>("1024")

  // Mobile UI state
  const [mobileMainTab, setMobileMainTab] = useState<'content' | 'design'>('content')
  const [mobileDesignSubTab, setMobileDesignSubTab] = useState<string>('Shape')
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
  const [isScanning, setIsScanning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [downloadFormat, setDownloadFormat] = useState<"PNG" | "SVG" | "PDF">("PNG");
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [customFilename, setCustomFilename] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string, icon: string } | null>(null);

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
  const { data: qrData, isLoading, isError } = useQuery({
    queryKey: ["qr-code", settings],
    queryFn: () => fetchQRCode(settings),
    staleTime: 1000 * 60, // 1 minute
  })
  const imageUrl = qrData?.url

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

  const contentTypes: { id: ContentType; label: string; icon: string }[] = [
    { id: "url", label: "URL", icon: "link" },
    { id: "vcard", label: "V-Card", icon: "contact_page" },
    { id: "text", label: "Text", icon: "subject" },
    { id: "email", label: "Email", icon: "mail" },
    { id: "wifi", label: "WiFi", icon: "wifi" },
    { id: "sms", label: "SMS", icon: "sms" },
    { id: "event", label: "Event", icon: "event" },
    { id: "phone", label: "Phone", icon: "phone" },
    { id: "crypto", label: "Crypto", icon: "currency_bitcoin" },
    { id: "location", label: "Location", icon: "location_on" },
    { id: "paypal", label: "PayPal", icon: "payments" },
    { id: "appstore", label: "App Store", icon: "apps" },
    { id: "batch", label: "Batch CSV", icon: "dataset" },
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color }
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color }
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color, box_size: 20, target_size: downloadSize };

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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: rest.logo_card_shape, preset_logo_color: color, box_size: 20, target_size: downloadSize };
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

  const handleScanTest = async () => {
    setIsScanning(true);
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

      const payload = {
        ...rest,
        data: contentData,
        logo_image: finalLogo,
        preset_logo: isPresetLogo ? "None" : rest.preset_logo,
        logo_card_shape: rest.logo_card_shape,
        preset_logo_color: color,
        box_size: 10
      };

      const res = await fetch("/api/generator/scan-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Scan test failed");
      const data = await res.json();
      
      if (data.scannable) {
        setToast({ message: `Scannable! Score: ${data.readability_score}%`, icon: "check_circle" });
      } else {
        setToast({ message: "Unreadable! Try changing styles.", icon: "error" });
      }
    } catch (e) {
      setToast({ message: "Error during scan test", icon: "error" });
    } finally {
      setIsScanning(false);
    }
  }

  // Unified Renderer for tab contents (renders either as active desktop panel or accordion content)
  const renderPanelContent = (tabName: string) => {
    switch (tabName) {
      case "Content":
        return (
          <div className="space-y-6">
            {/* Type Tabs */}
            <div className="glass-panel p-1.5 sm:p-2 rounded-2xl grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1 border border-outline-variant shadow-sm">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateSettings({ contentType: type.id })}
                  className={`flex flex-col items-center gap-1 sm:gap-1.5 p-2.5 sm:p-3 rounded-xl duration-200 border min-h-[44px] touch-press transition-all ${settings.contentType === type.id
                      ? "bg-primary text-white border-primary font-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container border-transparent active:scale-95"
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{type.icon}</span>
                  <span className="text-[10px] sm:text-[11px] leading-tight font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-6">
              {settings.contentType === "url" && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold">Website URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://yourwebsite.com"
                      value={settings.contentData}
                      onChange={(e) => updateSettings({ contentData: e.target.value })}
                      className="w-full p-4 pr-12 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined">captive_portal</span>
                  </div>
                  <p className="mt-2 text-on-surface-variant font-label-sm text-label-sm">
                    Enter the destination where your QR code will redirect users.
                  </p>
                </div>
              )}

              {settings.contentType === "text" && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold">Plain Text</label>
                  <textarea
                    placeholder="Type your text content here..."
                    value={settings.contentData}
                    onChange={(e) => updateSettings({ contentData: e.target.value })}
                    rows={4}
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md resize-none"
                  />
                  <p className="mt-2 text-on-surface-variant font-label-sm text-label-sm">
                    Raw text embedded directly in the QR code. Keep it brief.
                  </p>
                </div>
              )}

              {settings.contentType === "wifi" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">WiFi Connection</label>
                  <input
                    type="text"
                    placeholder="SSID / Network Name"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={wifi.ssid}
                    onChange={(e) => {
                      const newWifi = { ...wifi, ssid: e.target.value }
                      setWifi(newWifi)
                      updateSettings({ contentData: `WIFI:T:${newWifi.type};S:${newWifi.ssid};P:${newWifi.pass};;` })
                    }}
                  />
                  <select
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={wifi.type}
                    onChange={(e) => {
                      const newWifi = { ...wifi, type: e.target.value }
                      setWifi(newWifi)
                      updateSettings({ contentData: `WIFI:T:${newWifi.type};S:${newWifi.ssid};P:${newWifi.pass};;` })
                    }}
                  >
                    <option value="WPA/WPA2">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Unsecured</option>
                  </select>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={wifi.pass}
                    onChange={(e) => {
                      const newWifi = { ...wifi, pass: e.target.value }
                      setWifi(newWifi)
                      updateSettings({ contentData: `WIFI:T:${newWifi.type};S:${newWifi.ssid};P:${newWifi.pass};;` })
                    }}
                  />
                </div>
              )}

              {settings.contentType === "vcard" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">V-Card Information</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text" placeholder="First Name" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      value={vcard.fn}
                      onChange={(e) => {
                        const newV = { ...vcard, fn: e.target.value }
                        setVcard(newV)
                        updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                      }}
                    />
                    <input
                      type="text" placeholder="Last Name" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      value={vcard.ln}
                      onChange={(e) => {
                        const newV = { ...vcard, ln: e.target.value }
                        setVcard(newV)
                        updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                      }}
                    />
                  </div>
                  <input
                    type="text" placeholder="Company" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={vcard.org}
                    onChange={(e) => {
                      const newV = { ...vcard, org: e.target.value }
                      setVcard(newV)
                      updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                    }}
                  />
                  <input
                    type="text" placeholder="Job Title" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={vcard.title}
                    onChange={(e) => {
                      const newV = { ...vcard, title: e.target.value }
                      setVcard(newV)
                      updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                    }}
                  />
                  <input
                    type="tel" placeholder="Phone Number" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={vcard.tel}
                    onChange={(e) => {
                      const newV = { ...vcard, tel: e.target.value }
                      setVcard(newV)
                      updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                    }}
                  />
                  <input
                    type="email" placeholder="Email Address" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={vcard.email}
                    onChange={(e) => {
                      const newV = { ...vcard, email: e.target.value }
                      setVcard(newV)
                      updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                    }}
                  />
                  <input
                    type="url" placeholder="Website" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={vcard.url}
                    onChange={(e) => {
                      const newV = { ...vcard, url: e.target.value }
                      setVcard(newV)
                      updateSettings({ contentData: `BEGIN:VCARD\nVERSION:3.0\nN:${newV.ln};${newV.fn};;;\nFN:${newV.fn} ${newV.ln}\nORG:${newV.org}\nTITLE:${newV.title}\nTEL:${newV.tel}\nEMAIL:${newV.email}\nURL:${newV.url}\nEND:VCARD` })
                    }}
                  />
                </div>
              )}

              {settings.contentType === "email" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Email Address</label>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    onChange={(e) => updateSettings({ contentData: `mailto:${e.target.value}` })}
                  />
                </div>
              )}

              {settings.contentType === "sms" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">SMS Message</label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={sms.phone}
                    onChange={(e) => {
                      const newSms = { ...sms, phone: e.target.value }
                      setSms(newSms)
                      updateSettings({ contentData: `SMSTO:${newSms.phone}:${newSms.msg}` })
                    }}
                  />
                  <textarea
                    placeholder="Message"
                    rows={3}
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                    value={sms.msg}
                    onChange={(e) => {
                      const newSms = { ...sms, msg: e.target.value }
                      setSms(newSms)
                      updateSettings({ contentData: `SMSTO:${newSms.phone}:${newSms.msg}` })
                    }}
                  />
                </div>
              )}

              {settings.contentType === "event" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Event Information</label>
                  <input
                    type="text" placeholder="Event Title" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={event.title}
                    onChange={(e) => {
                      const newE = { ...event, title: e.target.value }
                      setEvent(newE)
                      updateSettings({ contentData: `BEGIN:VEVENT\nSUMMARY:${newE.title}\nDESCRIPTION:${newE.desc}\nLOCATION:${newE.loc}\nDTSTART:${newE.start.replace(/[-:]/g, '')}\nDTEND:${newE.end.replace(/[-:]/g, '')}\nEND:VEVENT` })
                    }}
                  />
                  <textarea
                    placeholder="Description" rows={2} className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                    value={event.desc}
                    onChange={(e) => {
                      const newE = { ...event, desc: e.target.value }
                      setEvent(newE)
                      updateSettings({ contentData: `BEGIN:VEVENT\nSUMMARY:${newE.title}\nDESCRIPTION:${newE.desc}\nLOCATION:${newE.loc}\nDTSTART:${newE.start.replace(/[-:]/g, '')}\nDTEND:${newE.end.replace(/[-:]/g, '')}\nEND:VEVENT` })
                    }}
                  />
                  <input
                    type="text" placeholder="Location" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={event.loc}
                    onChange={(e) => {
                      const newE = { ...event, loc: e.target.value }
                      setEvent(newE)
                      updateSettings({ contentData: `BEGIN:VEVENT\nSUMMARY:${newE.title}\nDESCRIPTION:${newE.desc}\nLOCATION:${newE.loc}\nDTSTART:${newE.start.replace(/[-:]/g, '')}\nDTEND:${newE.end.replace(/[-:]/g, '')}\nEND:VEVENT` })
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Start Time</label>
                      <input type="datetime-local" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={event.start}
                        onChange={(e) => {
                          const newE = { ...event, start: e.target.value }
                          setEvent(newE)
                          updateSettings({ contentData: `BEGIN:VEVENT\nSUMMARY:${newE.title}\nDESCRIPTION:${newE.desc}\nLOCATION:${newE.loc}\nDTSTART:${newE.start.replace(/[-:]/g, '')}\nDTEND:${newE.end.replace(/[-:]/g, '')}\nEND:VEVENT` })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">End Time</label>
                      <input type="datetime-local" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={event.end}
                        onChange={(e) => {
                          const newE = { ...event, end: e.target.value }
                          setEvent(newE)
                          updateSettings({ contentData: `BEGIN:VEVENT\nSUMMARY:${newE.title}\nDESCRIPTION:${newE.desc}\nLOCATION:${newE.loc}\nDTSTART:${newE.start.replace(/[-:]/g, '')}\nDTEND:${newE.end.replace(/[-:]/g, '')}\nEND:VEVENT` })
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {settings.contentType === "phone" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (234) 567-8900"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={phone.number}
                    onChange={(e) => {
                      const newPhone = { ...phone, number: e.target.value }
                      setPhone(newPhone)
                      updateSettings({ contentData: `tel:${newPhone.number.replace(/\s+/g, '')}` })
                    }}
                  />
                </div>
              )}

              {settings.contentType === "crypto" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Crypto Wallet</label>
                  <select
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={crypto.currency}
                    onChange={(e) => {
                      const newC = { ...crypto, currency: e.target.value }
                      setCrypto(newC)
                      updateSettings({ contentData: `${newC.currency}:${newC.address}${newC.amount ? '?amount='+newC.amount : ''}` })
                    }}
                  >
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="bitcoincash">Bitcoin Cash (BCH)</option>
                    <option value="litecoin">Litecoin (LTC)</option>
                    <option value="dash">Dash (DASH)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Wallet Address"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={crypto.address}
                    onChange={(e) => {
                      const newC = { ...crypto, address: e.target.value }
                      setCrypto(newC)
                      updateSettings({ contentData: `${newC.currency}:${newC.address}${newC.amount ? '?amount='+newC.amount : ''}` })
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Amount (optional)"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={crypto.amount}
                    onChange={(e) => {
                      const newC = { ...crypto, amount: e.target.value }
                      setCrypto(newC)
                      updateSettings({ contentData: `${newC.currency}:${newC.address}${newC.amount ? '?amount='+newC.amount : ''}` })
                    }}
                  />
                </div>
              )}

              {settings.contentType === "location" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Location</label>
                  <select
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={location.type}
                    onChange={(e) => {
                      const newL = { ...location, type: e.target.value }
                      setLocation(newL)
                      if (newL.type === 'coords') {
                        updateSettings({ contentData: `geo:${newL.lat},${newL.lng}` })
                      } else {
                        updateSettings({ contentData: `https://maps.google.com/maps?q=${encodeURIComponent(newL.query)}` })
                      }
                    }}
                  >
                    <option value="coords">Latitude / Longitude</option>
                    <option value="query">Address / Place Name</option>
                  </select>
                  
                  {location.type === 'coords' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text" placeholder="Latitude (e.g. 40.7128)" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={location.lat}
                        onChange={(e) => {
                          const newL = { ...location, lat: e.target.value }
                          setLocation(newL)
                          updateSettings({ contentData: `geo:${newL.lat},${newL.lng}` })
                        }}
                      />
                      <input
                        type="text" placeholder="Longitude (e.g. -74.0060)" className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={location.lng}
                        onChange={(e) => {
                          const newL = { ...location, lng: e.target.value }
                          setLocation(newL)
                          updateSettings({ contentData: `geo:${newL.lat},${newL.lng}` })
                        }}
                      />
                    </div>
                  ) : (
                    <textarea
                      placeholder="Enter full address or place name..."
                      rows={3}
                      className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                      value={location.query}
                      onChange={(e) => {
                        const newL = { ...location, query: e.target.value }
                        setLocation(newL)
                        updateSettings({ contentData: `https://maps.google.com/maps?q=${encodeURIComponent(newL.query)}` })
                      }}
                    />
                  )}
                </div>
              )}

              {settings.contentType === "paypal" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">PayPal Payment</label>
                  <input
                    type="text"
                    placeholder="PayPal.Me Username"
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={paypal.username}
                    onChange={(e) => {
                      const newP = { ...paypal, username: e.target.value }
                      setPaypal(newP)
                      updateSettings({ contentData: `https://paypal.me/${newP.username}${newP.amount ? '/'+newP.amount : ''}${newP.amount ? newP.currency : ''}` })
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Amount (optional)"
                      className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                      value={paypal.amount}
                      onChange={(e) => {
                        const newP = { ...paypal, amount: e.target.value }
                        setPaypal(newP)
                        updateSettings({ contentData: `https://paypal.me/${newP.username}${newP.amount ? '/'+newP.amount : ''}${newP.amount ? newP.currency : ''}` })
                      }}
                    />
                    <select
                      className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                      value={paypal.currency}
                      onChange={(e) => {
                        const newP = { ...paypal, currency: e.target.value }
                        setPaypal(newP)
                        updateSettings({ contentData: `https://paypal.me/${newP.username}${newP.amount ? '/'+newP.amount : ''}${newP.amount ? newP.currency : ''}` })
                      }}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>
              )}

              {settings.contentType === "appstore" && (
                <div className="space-y-4">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">App Store Link</label>
                  <select
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={appstore.store}
                    onChange={(e) => {
                      const newA = { ...appstore, store: e.target.value }
                      setAppstore(newA)
                    }}
                  >
                    <option value="apple">Apple App Store</option>
                    <option value="google">Google Play Store</option>
                  </select>
                  <input
                    type="url"
                    placeholder={appstore.store === 'apple' ? "https://apps.apple.com/..." : "https://play.google.com/..."}
                    className="w-full p-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                    value={appstore.url}
                    onChange={(e) => {
                      const newA = { ...appstore, url: e.target.value }
                      setAppstore(newA)
                      updateSettings({ contentData: newA.url })
                    }}
                  />
                </div>
              )}

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 max-h-[600px] overflow-y-auto px-3.5 pt-3.5 pb-6 custom-scrollbar">
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
                        src={`/previews/templates/${cleanName}.png?v=4`}
                        alt={template.name}
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

            <div className="space-y-3">
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
                        <img src={`/previews/dots/${style}.png?v=4`} alt={style} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
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

            <div className="space-y-3">
              <label className="section-label block mb-1">Eye Frame</label>
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => handleScroll(eyeFrameScrollRef, "left")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_back_ios_new</span>
                </button>
                <div ref={eyeFrameScrollRef} className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
                  {eyeFrameStyles.map((style) => (
                    <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
                      <StylePreviewCard
                        title={style}
                        isSelected={settings.eye_frame_style === style}
                        onClick={() => updateSettings({ eye_frame_style: style as any })}
                      >
                        <img src={`/previews/eye_frames/${style}.png?v=4`} alt={style} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
                      </StylePreviewCard>
                    </div>
                  ))}
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
            </div>

            <div className="space-y-3">
              <label className="section-label block mb-1">Eyeball</label>
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => handleScroll(eyeballScrollRef, "left")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-outline-variant/65 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined text-xs leading-none font-bold text-on-surface">arrow_back_ios_new</span>
                </button>
                <div ref={eyeballScrollRef} className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
                  {eyeballStyles.map((style) => (
                    <div key={style} className="w-[88px] sm:w-[98px] shrink-0 snap-start p-0.5">
                      <StylePreviewCard
                        title={style}
                        isSelected={settings.eyeball_style === style}
                        onClick={() => updateSettings({ eyeball_style: style as any })}
                      >
                        <img src={`/previews/eyeballs/${style}.png?v=4`} alt={style} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
                      </StylePreviewCard>
                    </div>
                  ))}
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
            </div>

            {/* Dual-Tone Marker Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="section-label flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full border-2 border-primary inline-block"></span>
                  Eye Frame (Outer)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.eye_color}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      updateSettings({
                        eye_color: newColor,
                        eyeball_color: settings.eyeball_color === settings.eye_color ? newColor : settings.eyeball_color
                      });
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.eye_color}
                    onChange={(e) => updateSettings({ eye_color: e.target.value })}
                    className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="section-label flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                  Eyeball (Inner Core)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.eyeball_color || settings.eye_color}
                    onChange={(e) => updateSettings({ eyeball_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.eyeball_color || settings.eye_color}
                    onChange={(e) => updateSettings({ eyeball_color: e.target.value })}
                    className="flex-1 p-2.5 border border-outline-variant rounded-xl bg-white text-xs font-mono"
                  />
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
                      <img src={settings.logo_image} className="w-full h-full object-contain rounded-xl" />
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
                      onClick={() => updateSettings({ logo_icon_style: style.id as any })}
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
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-2.5 max-h-[340px] overflow-y-auto p-2 sm:p-3.5 border border-outline-variant/40 rounded-2xl bg-surface/20">
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
                    max="5"
                    step="0.1"
                    value={settings.logo_clear_size}
                    onChange={(val) => updateSettings({ logo_clear_size: val })}
                    
                   />
                  {settings.logo_clear_size > 3.0 && (
                    <div className="flex items-center gap-2 p-2 bg-error/10 border border-error/20 text-error rounded-lg text-[10px] font-medium mt-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      <span>High clearance might affect scannability. Test before sharing.</span>
                    </div>
                  )}
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
                      <img src={`/previews/frames/${style}.png?v=4`} alt={style} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
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
                      <img src={`/previews/text_styles/${style}.png?v=4`} alt={style} className="w-[70%] h-[70%] object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
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
              {(settings.preset_logo !== "None" || !!settings.logo_image) &&
                (settings.error_correction === "L" || settings.error_correction === "M") && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 mt-2">
                    <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5 shrink-0">
                      warning
                    </span>
                    <div className="text-xs leading-relaxed">
                      <strong className="font-semibold">Logo Active Recommendation:</strong> Covering center dots with a logo reduces redundancy. For optimum camera scanning performance with logos, we strongly suggest switching to <span className="font-bold underline">Quartile (Q)</span> or <span className="font-bold underline">High (H)</span>.
                    </div>
                  </div>
                )}
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
              <div className="flex justify-between text-[11px] text-on-surface-variant font-semibold px-1">
                <span>0 (No Border)</span>
                <span>4 (Standard)</span>
                <span>10 (Spacious)</span>
              </div>
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
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all text-base"
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

            {/* Resolution Selector (only for PNG) */}
            {downloadFormat === "PNG" && (
              <div className="space-y-3 border-t border-outline-variant pt-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface block">2. Output Resolution</label>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {downloadSize} x {downloadSize} px
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[512, 1024, 2048, 4096].map((size) => (
                    <button
                      key={size}
                      onClick={() => setDownloadSize(size)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${downloadSize === size
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                        }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
                {/* Engine pipeline status card */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex items-start gap-3 mt-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">verified</span>
                  <div className="space-y-1 text-xs text-left">
                    <p className="font-bold text-on-surface">Lanczos Resampling Active ({downloadSize}px)</p>
                    <p className="text-on-surface-variant leading-relaxed">
                      To ensure ultra-sharp output, the QR matrix is generated at a high-resolution grid and downscaled to {downloadSize}px using premium Lanczos filtering. This guarantees zero pixelation, smooth gradients, and clear borders.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Filename */}
            <div className="space-y-3 border-t border-outline-variant pt-6">
              <label className="text-sm font-semibold text-on-surface block">
                {downloadFormat === "PNG" ? "3." : "2."} File Name
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
            <div className="border-t border-outline-variant pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadCustom}
                disabled={isLoading || isError || isDownloading || isCopying}
                className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 btn-spring shadow-lg text-base ${downloadSuccess
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 animate-celebrate"
                    : isDownloading
                      ? "bg-primary/80 text-on-primary cursor-wait shadow-sm animate-pulse"
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
      <div className="flex flex-1 w-full relative">

        {/* Desktop Sidebar */}
        <aside className="w-72 border-r border-outline-variant bg-surface-container-lowest hidden lg:flex flex-col py-6 px-4 gap-2 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="mb-3 px-2">
            <h2 className="text-sm font-semibold text-on-surface tracking-tight">Customization</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Personalize your QR code</p>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium tab-spring relative sidebar-item ${
                  activeTab === tab.name
                    ? "sidebar-item-active"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] transition-colors ${activeTab === tab.name ? "text-primary" : "text-on-surface-variant"}`}>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Workspace panel */}
        <div className="flex-1 min-w-0 max-w-full lg:p-margin-desktop bg-surface lg:pb-margin-desktop">

          <div className="max-w-container-max mx-auto w-full max-w-full">

            {/* DESKTOP LAYOUT (lg and above) */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start p-margin-desktop max-w-full">

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
                    className="aspect-square flex items-center justify-center relative overflow-hidden group p-8 rounded-2xl surface-ring-vercel"
                    style={{
                      backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
                      backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <div className="absolute inset-0 canvas-aura pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#18181b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                    {isError ? (
                      <div className="relative z-10 text-error p-4 bg-error-container text-on-error-container rounded-xl text-center text-xs">
                        <span className="material-symbols-outlined text-2xl mb-1">error</span>
                        <p className="font-bold">Failed to load preview</p>
                      </div>
                    ) : (
                      <div
                        className={`relative z-10 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${zoomLevel === 1 && !isLoading ? 'group-hover:scale-[1.06]' : ''}`}
                        style={{ transform: `scale(${zoomLevel})` }}
                      >
                        <img
                          src={imageUrl}
                          alt="QR Code Preview"
                          className={`w-full max-w-[240px] max-h-[240px] object-contain transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isComparing ? 'grayscale contrast-125 opacity-90' : ''}`}
                          style={settings.bg_transparent ? {
                            backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                            backgroundSize: "16px 16px",
                            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "12px",
                            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)"
                          } : {}}
                        />
                        {/* Shimmer Overlay for Loading State */}
                        {isLoading && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden backdrop-blur-[4px] bg-white/40 flex items-center justify-center transition-opacity duration-300">
                            <div className="absolute inset-0 skeleton-shimmer"></div>
                            <span className="material-symbols-outlined animate-spin text-primary text-3xl relative z-10">autorenew</span>
                          </div>
                        )}
                        {isScanning && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                            <div className="w-full h-1 bg-green-500 absolute top-0 animate-bounce shadow-[0_0_12px_rgba(34,197,94,1)]"></div>
                            <div className="absolute inset-0 bg-green-500/15 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    )}
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
                        onClick={handleScanTest}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isScanning ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                        title="Scan Test"
                      >
                        <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                      </button>
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
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="bg-white rounded-xl border border-outline-variant/60 p-1 w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] shrink-0 aspect-square flex items-center justify-center shadow-2xs">
                        {isLoading ? (
                          <span className="material-symbols-outlined animate-spin text-primary text-xl">autorenew</span>
                        ) : isError ? (
                          <span className="material-symbols-outlined text-error text-lg">error</span>
                        ) : (
                          <img src={imageUrl} alt="QR Preview" className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary truncate">Live Engine</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-on-surface truncate">{settings.contentType} QR Code</p>
                        <p className="text-[10px] sm:text-[11px] text-on-surface-variant truncate">Level {settings.error_correction} • {downloadFormat}</p>
                      </div>
                    </div>

                    {/* Compact Quick Tools */}
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={handleFullscreen} className="p-2 bg-surface hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-xl border border-outline-variant/40 flex items-center justify-center text-xs font-bold gap-1 shadow-2xs min-w-[36px] min-h-[36px] touch-press" title="View Fullscreen">
                        <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                        <span className="hidden sm:inline text-xs">Expand</span>
                      </button>
                      <button onClick={handleScanTest} className="p-2 bg-primary/10 hover:bg-primary/20 transition-colors text-primary rounded-xl border border-primary/20 flex items-center justify-center text-xs font-bold gap-1 min-w-[36px] min-h-[36px] touch-press" title="Scan Test">
                        <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                        <span className="hidden sm:inline text-xs">Test</span>
                      </button>
                    </div>
                  </div>

                  {/* Slim Main Segment Tabs: Content | Design & Undo/Redo/Reset */}
                  <div className="px-3 py-1.5 border-b border-outline-variant/20 flex items-center justify-between gap-2.5">
                    <div className="bg-surface border border-outline-variant/70 rounded-xl p-1 grid grid-cols-2 gap-1 flex-1 max-w-[200px] sm:max-w-[240px]">
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
                  <div className="panel-enter" key={mobileMainTab === 'content' ? 'content' : mobileDesignSubTab}>
                    {mobileMainTab === 'content'
                      ? renderPanelContent('Content')
                      : renderPanelContent(mobileDesignSubTab === 'Shape' ? 'Design' : mobileDesignSubTab)
                    }
                  </div>
                </div>

                {/* ── ACTION FOOTER: DOWNLOAD & COPY (In-Flow directly above SEO section) ── */}
                <div className="border-t border-outline-variant/40 bg-surface-container-lowest p-4 sm:p-6 flex gap-3 shadow-2xs rounded-b-3xl">
                  <button
                    onClick={handleDownloadPNG}
                    disabled={isLoading || isError || isDownloading}
                    className="flex-1 py-3.5 px-4 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 btn-spring min-h-[48px]"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Download {downloadFormat}
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

      {/* ── IN-APP FULLSCREEN / EXPANDED PREVIEW MODAL LIGHTBOX ── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn" onClick={() => setIsFullscreen(false)}>
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-[90vw] max-h-[80vh] flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden" onClick={(e) => e.stopPropagation()} onWheel={(e) => {
            const delta = e.deltaY * -0.003;
            setZoomLevel(prev => Math.min(5, Math.max(0.5, prev + delta)));
          }}>
            <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-surface hover:bg-surface-container-high rounded-full flex items-center justify-center text-on-surface transition-colors shadow-sm touch-press" title="Close">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {isLoading ? (
              <div className="flex flex-col items-center text-on-surface-variant gap-2 p-12">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                <span className="text-sm font-semibold">Generating...</span>
              </div>
            ) : isError ? (
              <div className="text-error p-8 bg-error-container text-on-error-container rounded-2xl text-center text-sm">
                <span className="material-symbols-outlined text-3xl mb-2">error</span>
                <p className="font-bold">Failed to load preview</p>
              </div>
            ) : (
              <div className="transition-transform duration-200" style={{ transform: `scale(${zoomLevel})` }}>
                <img
                  src={imageUrl}
                  alt="Expanded QR Preview"
                  className={`w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] object-contain ${isComparing ? 'grayscale contrast-125 opacity-90' : ''}`}
                  style={settings.bg_transparent ? {
                    backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "12px",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)"
                  } : {}}
                />
              </div>
            )}
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
            <button onClick={handleScanTest} className={`h-10 px-3 flex items-center justify-center gap-1.5 transition-colors rounded-xl duration-200 text-xs font-bold touch-press ${isScanning ? 'bg-primary text-white shadow-md' : 'hover:bg-black/5 text-on-surface'}`} title="Scan Test">
              <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              <span className="hidden sm:inline">Test</span>
            </button>
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
