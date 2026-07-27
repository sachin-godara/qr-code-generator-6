import { Slider } from "@/components/ui/Slider"
import { useState, useEffect, useRef, useCallback } from "react"
import { useQRStore } from "@/store/useQRStore"
import { useQuery } from "@tanstack/react-query"
import { type ContentType, type QRSettings } from "@/types/qr"
import { PRESET_TEMPLATES } from "@/data/templates"
import { DOT_STYLES, EYE_FRAME_STYLES, EYEBALL_STYLES, FRAME_STYLES, TEXT_STYLES } from "@/data/options"
import { StylePreviewCard } from "@/components/previews/StylePreviewCard"
import { PresetLogoPreview, getReactLogoPngDataUrl, PRESET_LOGO_BRAND_COLORS, LOGO_ITEMS, LOGO_CATEGORIES } from "@/components/previews/SvgIcons"

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
    logo_card_shape: isPresetLogo ? "None" : rest.logo_card_shape,
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
  const { settings, updateSettings, applyTemplate } = useQRStore()
  const [activeTab, setActiveTab] = useState<string>("Content")
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>("All")
  const [logoSearchQuery, setLogoSearchQuery] = useState<string>("")
  const [activeLogoCategory, setActiveLogoCategory] = useState<string>("All")
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const [vcard, setVcard] = useState({ fn: '', ln: '', org: '', title: '', tel: '', email: '', url: '' })
  const [event, setEvent] = useState({ title: '', desc: '', loc: '', start: '', end: '' })
  const [sms, setSms] = useState({ phone: '', msg: '' })
  const [wifi, setWifi] = useState({ ssid: '', type: 'WPA/WPA2', pass: '' })

  // Mobile UI state
  const [mobileMainTab, setMobileMainTab] = useState<'content' | 'design'>('content')
  const [mobileDesignSubTab, setMobileDesignSubTab] = useState<string>('Shape')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMiniPreview, setShowMiniPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  const contentTypes: { id: ContentType; label: string; icon: string }[] = [
    { id: "url", label: "URL", icon: "link" },
    { id: "vcard", label: "V-Card", icon: "contact_page" },
    { id: "text", label: "Text", icon: "subject" },
    { id: "email", label: "Email", icon: "mail" },
    { id: "wifi", label: "WiFi", icon: "wifi" },
    { id: "sms", label: "SMS", icon: "sms" },
    { id: "event", label: "Event", icon: "event" },
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
      a.download = `QRStream-${settings.contentType}.png`
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: isPresetLogo ? "None" : rest.logo_card_shape, preset_logo_color: color }
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
      a.download = `QRStream-${settings.contentType}.svg`
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: isPresetLogo ? "None" : rest.logo_card_shape, preset_logo_color: color }
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
      a.download = `QRStream-${settings.contentType}.pdf`
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: isPresetLogo ? "None" : rest.logo_card_shape, preset_logo_color: color, box_size: 20, target_size: downloadSize };

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
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
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

      const payload = { ...rest, data: contentData, logo_image: finalLogo, preset_logo: isPresetLogo ? "None" : rest.preset_logo, logo_card_shape: isPresetLogo ? "None" : rest.logo_card_shape, preset_logo_color: color, box_size: 20, target_size: downloadSize };
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
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    } finally {
      setIsCopying(false);
    }
  };

  const handleFullscreen = () => {
    const el = document.getElementById("qr-preview-container");
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen();
      }
    }
  }

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
      alert("Image URL copied to clipboard!");
    }
  }

  const handleScanTest = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert(`✅ Scan Successful!\n\nType: ${settings.contentType.toUpperCase()}\nData: ${settings.contentData}`);
    }, 1500);
  }

  // Unified Renderer for tab contents (renders either as active desktop panel or accordion content)
  const renderPanelContent = (tabName: string) => {
    switch (tabName) {
      case "Content":
        return (
          <div className="space-y-6">
            {/* Type Tabs */}
            <div className="glass-panel p-1.5 sm:p-2 rounded-2xl grid grid-cols-4 sm:grid-cols-7 gap-1 border border-outline-variant shadow-sm">
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
            </div>
          </div>
        )
      case "Templates":
        const categories = ["All", ...Array.from(new Set(PRESET_TEMPLATES.map(t => t.category).filter(Boolean)))];
        const filteredTemplates = PRESET_TEMPLATES.filter(t => 
          activeTemplateCategory === "All" || t.category === activeTemplateCategory
        );

        return (
          <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <div className="flex overflow-x-auto gap-2 px-3 pb-3 mb-1 custom-scrollbar snap-x">
              {categories.map(cat => (
                <button
                  key={cat as string}
                  onClick={() => setActiveTemplateCategory(cat as string)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium tab-spring snap-start ${
                    activeTemplateCategory === cat
                      ? "bg-on-surface text-white border border-on-surface shadow-sm scale-[1.02]"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant"
                  }`}
                >
                  {cat as string}
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
                      value={settings.dots_color_end || "#0050cb"}
                      onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                      className="w-9 h-9 shrink-0 rounded-md cursor-pointer border border-outline-variant/30 bg-white p-0"
                    />
                    <input
                      type="text"
                      value={settings.dots_color_end || "#0050cb"}
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
              <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
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
            </div>

            <div className="space-y-3">
              <label className="section-label block mb-1">Eye Frame</label>
              <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
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
            </div>

            <div className="space-y-3">
              <label className="section-label block mb-1">Eyeball</label>
              <div className="flex overflow-x-auto gap-3.5 px-3.5 pt-3.5 pb-5 custom-scrollbar snap-x scroll-smooth scroll-pl-3.5">
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
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-2xl p-6 bg-surface/30 hover:bg-surface/70 transition-all duration-200 cursor-pointer relative group">
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
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-outline-variant shadow-md bg-white p-1.5 relative group/thumb">
                      <img src={settings.logo_image} className="w-full h-full object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-20">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateSettings({ logo_image: null });
                          }}
                          className="p-1.5 bg-error text-white rounded-full hover:bg-error/95 transition-transform hover:scale-110"
                        >
                          <span className="material-symbols-outlined text-sm leading-none">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-on-surface">Custom Logo Loaded</p>
                      <p className="text-[10px] text-on-surface-variant">Hover to remove / Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center z-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <span className="material-symbols-outlined text-lg">cloud_upload</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">Upload your logo</p>
                      <p className="text-[10px] text-on-surface-variant">Drag & drop or click to browse (PNG, JPG)</p>
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
                  <div className="flex flex-wrap sm:grid sm:grid-cols-3 gap-2">
                    {logoCardShapes.map((shape) => {
                      const isSelected = settings.logo_card_shape === shape;
                      return (
                        <button
                          key={shape}
                          onClick={() => updateSettings({ logo_card_shape: shape as any })}
                          className={`flex-1 min-w-[90px] py-2.5 px-2 sm:p-3 border rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 ${isSelected
                              ? "bg-primary text-white border-primary font-bold shadow-md ring-2 ring-primary/15"
                              : "bg-white hover:bg-muted border-outline-variant text-on-surface"
                            }`}
                        >
                          {shape === "None" && <span className="material-symbols-outlined text-sm shrink-0">block</span>}
                          {shape === "Circle" && <span className="material-symbols-outlined text-sm shrink-0">circle</span>}
                          {shape === "Rounded Square" && <span className="material-symbols-outlined text-sm shrink-0">crop_square</span>}
                          <span className="whitespace-nowrap">{shape}</span>
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
                        dots_color_end: opt.value !== "Solid Color" && settings.dots_color_end === "#000000" && settings.dots_color === "#000000" ? "#0050cb" : settings.dots_color_end
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
                        newColor = "#0050cbee";
                      } else if ((newId === "soft" || newId === "elevated") && newColor === "#0050cbee") {
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
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">rounded_corner</span>
                  Canvas Corner Rounding
                </label>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {settings.canvas_radius}px
                </span>
              </div>
              <Slider min="0"
                max="40"
                value={settings.canvas_radius}
                onChange={(val) => updateSettings({ canvas_radius: val })}
                
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
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-on-surface-variant w-24">Border Color:</label>
                    <input
                      type="color"
                      value={settings.canvas_border_color}
                      onChange={(e) => updateSettings({ canvas_border_color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-outline-variant p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={settings.canvas_border_color}
                      onChange={(e) => updateSettings({ canvas_border_color: e.target.value })}
                      className="flex-1 p-2 text-xs border border-outline-variant rounded-lg bg-white"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary/80">rounded_corner</span>
                        Border Corner Rounding
                      </label>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {settings.canvas_border_radius}px
                      </span>
                    </div>
                    <Slider min="0"
                      max="40"
                      value={settings.canvas_border_radius}
                      onChange={(val) => updateSettings({ canvas_border_radius: val })}
                      
                     />
                    <div className="flex justify-between text-[10px] text-on-surface-variant/80 font-medium px-1">
                      <span>0px (Sharp)</span>
                      <span>16px (Concentric)</span>
                      <span>40px (Max Round)</span>
                    </div>
                  </div>
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

            {/* Engine pipeline status card */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">verified</span>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-on-surface">Lanczos Anti-Aliasing Active</p>
                <p className="text-on-surface-variant leading-relaxed">
                  Every QR matrix is generated at a super-sampled 1000x1000 canvas resolution and downscaled using high-precision Lanczos filtering to guarantee crisp curves and zero jagged edges.
                </p>
              </div>
            </div>
          </div>
        )
      case "Download":
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
                <header>
                  <h1 className="text-xl font-semibold text-on-surface tracking-tight">Generate New QR Code</h1>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Choose your data type and customize the appearance.
                  </p>
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
                    className={`aspect-square flex items-center justify-center relative overflow-hidden group p-8 ${isFullscreen ? 'bg-white rounded-none border-none h-screen w-screen' : 'rounded-2xl surface-ring-vercel'}`}
                    style={
                      isFullscreen
                        ? { backgroundColor: '#ffffff' }
                        : {
                          backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
                          backgroundSize: "16px 16px",
                          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                          backgroundColor: "#f9fafb"
                        }
                    }
                    onWheel={(e) => {
                      if (isFullscreen) {
                        const delta = e.deltaY * -0.003;
                        setZoomLevel(prev => Math.min(5, Math.max(0.5, prev + delta)));
                      }
                    }}
                  >
                    {isFullscreen && (
                      <div className="absolute bottom-8 right-8 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-outline-variant">
                        <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))} className="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors hover:bg-black/5 text-on-surface touch-press">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="text-xs font-bold w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                        <button onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.25))} className="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-colors hover:bg-black/5 text-on-surface touch-press">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                        <div className="w-px h-8 bg-outline-variant my-1 mx-1"></div>
                        <button onClick={handleScanTest} className={`w-10 h-10 flex items-center justify-center transition-colors rounded-xl duration-200 touch-press ${isScanning ? 'bg-primary text-white shadow-md' : 'hover:bg-black/5 text-on-surface'}`} title="Scan Test">
                          <span className="material-symbols-outlined">qr_code_scanner</span>
                        </button>
                        <button onClick={() => setIsComparing(!isComparing)} className={`w-10 h-10 flex items-center justify-center transition-colors rounded-xl duration-200 touch-press ${isComparing ? 'bg-primary text-white shadow-md' : 'hover:bg-black/5 text-on-surface'}`} title="Compare Raw">
                          <span className="material-symbols-outlined">compare</span>
                        </button>
                        <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors text-on-surface rounded-xl duration-200 touch-press" title="Share">
                          <span className="material-symbols-outlined">share</span>
                        </button>
                        <div className="w-px h-8 bg-outline-variant my-1 mx-1"></div>
                        <button onClick={() => document.exitFullscreen()} className="w-10 h-10 font-bold rounded-xl text-error hover:bg-error/10 flex items-center justify-center transition-colors touch-press">
                          <span className="material-symbols-outlined">fullscreen_exit</span>
                        </button>
                      </div>
                    )}
                    <div className="absolute inset-0 canvas-aura pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#0050cb 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                    {isLoading ? (
                      <div className="relative z-10 flex flex-col items-center text-on-surface-variant gap-2">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                        <span className="text-sm font-semibold">Generating...</span>
                      </div>
                    ) : isError ? (
                      <div className="relative z-10 text-error p-4 bg-error-container text-on-error-container rounded-xl text-center text-xs">
                        <span className="material-symbols-outlined text-2xl mb-1">error</span>
                        <p className="font-bold">Failed to load preview</p>
                      </div>
                    ) : (
                      <div
                        className={`relative z-10 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${zoomLevel === 1 ? 'group-hover:scale-[1.06]' : ''}`}
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
                        {isScanning && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                            <div className="w-full h-1 bg-green-500 absolute top-0 animate-bounce shadow-[0_0_12px_rgba(34,197,94,1)]"></div>
                            <div className="absolute inset-0 bg-green-500/15 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Export Toolbar */}
                  <div className="space-y-6">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <span className="section-label mb-1">Zoom</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setZoomLevel(1)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-sm font-semibold tab-spring min-h-[40px] touch-press ${zoomLevel === 1
                                ? 'bg-primary border-primary text-white shadow-md'
                                : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-highest'
                              }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                            100%
                          </button>
                          <button
                            onClick={() => setZoomLevel(2)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-sm font-semibold tab-spring min-h-[40px] touch-press ${zoomLevel === 2
                                ? 'bg-primary border-primary text-white shadow-md'
                                : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-highest'
                              }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                            200%
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="section-label mb-1">Tools</span>
                        <div className="flex gap-2">
                          <button onClick={handleScanTest} className={`flex-1 flex items-center justify-center transition-colors rounded-xl duration-200 min-w-[40px] min-h-[40px] touch-press ${isScanning ? 'bg-primary text-white shadow-md' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant active:scale-95'}`} title="Scan Test">
                            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                          </button>
                          <button onClick={handleFullscreen} className="flex-1 flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-xl duration-200 min-w-[40px] min-h-[40px] touch-press active:scale-95" title="Full Screen">
                            <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                          </button>
                          <button onClick={() => setIsComparing(!isComparing)} className={`flex-1 flex items-center justify-center transition-colors rounded-xl duration-200 min-w-[40px] min-h-[40px] touch-press ${isComparing ? 'bg-primary text-white shadow-md' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant active:scale-95'}`} title="Compare Raw">
                            <span className="material-symbols-outlined text-[20px]">compare</span>
                          </button>
                          <button onClick={handleShare} className="flex-1 flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-xl duration-200 min-w-[40px] min-h-[40px] touch-press active:scale-95" title="Share">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="pt-6 border-t border-outline-variant grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="section-label mb-1">Resolution</p>
                      <p className="text-sm font-semibold text-on-surface">{targetResolution}</p>
                    </div>
                    <div className="text-center border-l border-outline-variant">
                      <p className="section-label mb-1">Error Recovery</p>
                      <p className="text-sm font-semibold text-on-surface">Level {settings.error_correction}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE LAYOUT (below lg breakpoint) — Sleek Single-Scroll Architecture */}
            <div className="lg:hidden w-full max-w-[100vw] bg-surface min-h-screen">
              <div className="bg-white flex flex-col max-w-full relative pb-28">

                {/* ── STICKY ULTRA-COMPACT HEADER: Mini-Preview + Navigation ── */}
                <div className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm transition-all duration-200">

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

                  {/* Slim Main Segment Tabs: Content | Design */}
                  <div className="px-3 py-1.5 border-b border-outline-variant/20">
                    <div className="bg-surface border border-outline-variant/70 rounded-xl p-1 grid grid-cols-2 gap-1">
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
                <div className="p-4 sm:p-5 bg-white">
                  {mobileMainTab === 'content'
                    ? renderPanelContent('Content')
                    : renderPanelContent(mobileDesignSubTab === 'Shape' ? 'Design' : mobileDesignSubTab)
                  }
                </div>

                {/* ── FIXED FLOATING BOTTOM CTA BAR ── */}
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-outline-variant/50 bg-surface-container-lowest/95 backdrop-blur-md p-3 sm:p-4 flex gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                  <button
                    onClick={handleDownloadPNG}
                    disabled={isLoading || isError || isDownloading}
                    className="flex-1 py-3 px-3 sm:px-4 bg-primary text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 btn-spring min-h-[44px]"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download {downloadFormat}
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    disabled={isLoading || isError || isCopying}
                    className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border shadow-sm btn-spring min-h-[44px] ${
                      copySuccess ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/25 animate-celebrate' : 'bg-surface border-outline-variant text-on-surface'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${copySuccess ? 'animate-[spin_350ms_ease-out_1]' : ''}`}>{copySuccess ? 'check' : 'content_copy'}</span>
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App

