import { useState, useEffect, useRef, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useQRStore } from "@/store/useQRStore"
import { useToast } from "@/hooks/useToast"
import { useDownloadHandlers } from "@/hooks/useDownloadHandlers"
import { useDownloadStore } from "@/store/useDownloadStore"
import { fetchQRPreview } from "@/services/qrApi"
import { ContentPanel } from "./panels"

const TemplatesPanel = lazy(() => import("./panels").then(module => ({ default: module.TemplatesPanel })));
const DesignPanel = lazy(() => import("./panels").then(module => ({ default: module.DesignPanel })));
const LogoPanel = lazy(() => import("./panels").then(module => ({ default: module.LogoPanel })));
const FramesPanel = lazy(() => import("./panels").then(module => ({ default: module.FramesPanel })));
const EffectsPanel = lazy(() => import("./panels").then(module => ({ default: module.EffectsPanel })));
const AdvancedPanel = lazy(() => import("./panels").then(module => ({ default: module.AdvancedPanel })));
const DownloadPanel = lazy(() => import("./panels").then(module => ({ default: module.DownloadPanel })));
import { DesktopPreviewPane, MobileBottomBar, FullscreenLightbox } from "./preview"

function App() {
  const { settings, undo, redo, resetSettings, history, historyIndex } = useQRStore()
  const { hasComplexStyling } = useDownloadHandlers()
  const { isDownloading, isBatchGenerating, downloadSize, downloadFormat, copySuccess } = useDownloadStore()
  const { toast, setToast } = useToast()

  const [activeTab, setActiveTab] = useState<string>("Content")
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [mobileMainTab, setMobileMainTab] = useState<'content' | 'design' | 'logo' | 'more' | 'download'>('content')

  const handleMobileTabChange = (tab: 'content' | 'design' | 'logo' | 'more' | 'download') => {
    setMobileMainTab(tab)
    if (tab === 'content') setActiveTab('Content')
    else if (tab === 'design') {
       if (!['Templates', 'Design', 'Frames'].includes(activeTab)) setActiveTab('Design')
    }
    else if (tab === 'logo') setActiveTab('Logo')
    else if (tab === 'more') {
       if (!['Effects', 'Advanced'].includes(activeTab)) setActiveTab('Effects')
    }
    else if (tab === 'download') setActiveTab('Download')
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMiniPreview, setShowMiniPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

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
  useEffect(() => {
    // Automatically select the correct content type based on the landing page URL
    const path = window.location.pathname;
    let expectedType = null;
    if (path.includes("wifi")) expectedType = "wifi";
    else if (path.includes("vcard") || path.includes("contact")) expectedType = "vcard";
    else if (path.includes("event") || path.includes("calendar")) expectedType = "event";
    else if (path.includes("email")) expectedType = "email";
    
    if (expectedType && useQRStore.getState().settings.contentType !== expectedType) {
      useQRStore.getState().updateSettings({ contentType: expectedType as any, contentData: "" });
    }
  }, []);

  // Listen for custom content-type selection events from the lower landing section
  useEffect(() => {
    const handleSelectContentType = (e: CustomEvent<{ type: string }>) => {
      if (e.detail?.type) {
        useQRStore.getState().updateSettings({ contentType: e.detail.type as any, contentData: "" });
        setActiveTab("Content");
        handleMobileTabChange("content");
        const generatorEl = document.getElementById("generator");
        if (generatorEl) {
          generatorEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("select-qr-content-type", handleSelectContentType as EventListener);
    return () => {
      window.removeEventListener("select-qr-content-type", handleSelectContentType as EventListener);
    };
  }, []);

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

  const [previewBg, setPreviewBg] = useState<"white" | "light" | "dark" | "transparent">("white");
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(1);
  const [lastTap, setLastTap] = useState<number>(0);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab, mobileMainTab]);

  const { data: qrData, isLoading, isError, isFetching } = useQuery({
    queryKey: ["qr-code", settings],
    queryFn: () => fetchQRPreview(settings),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  })
  const imageUrl = qrData?.url

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

  const goToNextTab = (currentTabName: string) => {
    const currentIndex = sidebarTabs.findIndex(t => t.name === currentTabName);
    if (currentIndex >= 0 && currentIndex < sidebarTabs.length - 1) {
      const nextTab = sidebarTabs[currentIndex + 1];
      setActiveTab(nextTab.name);
      
      // Sync mobile main tab if on mobile
      if (['Templates', 'Design', 'Frames'].includes(nextTab.name)) setMobileMainTab('design');
      else if (['Effects', 'Advanced'].includes(nextTab.name)) setMobileMainTab('more');
      else if (nextTab.name === 'Logo') setMobileMainTab('logo');
      else if (nextTab.name === 'Download') setMobileMainTab('download');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderNextStepButton = (currentTabName: string) => {
    const currentIndex = sidebarTabs.findIndex(t => t.name === currentTabName);
    if (currentIndex >= 0 && currentIndex < sidebarTabs.length - 1) {
      const nextTab = sidebarTabs[currentIndex + 1];
      return (
        <div className="mt-8 pt-6 border-t border-outline-variant/30 flex justify-between items-center animate-in fade-in duration-500">
          <div className="text-sm text-on-surface-variant font-medium hidden sm:block">
            Done with {currentTabName}?
          </div>
          <button
            onClick={() => goToNextTab(currentTabName)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <span>Continue to {nextTab.name}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      );
    }
    return null;
  };

  const renderPanelContent = (tabName: string) => {
    let PanelComponent;
    switch (tabName) {
      case "Content": PanelComponent = <ContentPanel />; break;
      case "Templates": PanelComponent = <TemplatesPanel />; break;
      case "Design": PanelComponent = <DesignPanel />; break;
      case "Logo": PanelComponent = <LogoPanel />; break;
      case "Frames": PanelComponent = <FramesPanel />; break;
      case "Effects": PanelComponent = <EffectsPanel />; break;
      case "Advanced": PanelComponent = <AdvancedPanel />; break;
      case "Download": 
        PanelComponent = <DownloadPanel onNavigateToContent={() => {
          setActiveTab("Content");
          setMobileMainTab("content");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />; 
        break;
      default: PanelComponent = null;
    }
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-12 text-outline-variant">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      }>
        {PanelComponent}
      </Suspense>
    );
  }

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setToast]);

  const sidebarTabs = [
    { name: "Content", icon: "qr_code_scanner" },
    { name: "Templates", icon: "style" },
    { name: "Design", icon: "palette" },
    { name: "Logo", icon: "image" },
    { name: "Frames", icon: "crop_free" },
    { name: "Effects", icon: "auto_awesome" },
    { name: "Advanced", icon: "tune" },
    { name: "Download", icon: "download" },
  ]

  // Tab-aware context metadata for dynamic headlines
  const TAB_META: Record<string, { headline: string; sub: string; step: number }> = {
    Content:   { headline: "What would you like to encode?",  sub: "Choose a content type and enter your data.",              step: 1 },
    Templates: { headline: "Pick a Style Template",            sub: "One-click presets for every use case.",                   step: 2 },
    Design:    { headline: "Customize Your QR Design",         sub: "Dots, eyes, colors, gradients — make it yours.",          step: 3 },
    Logo:      { headline: "Add Your Brand Logo",              sub: "Upload a custom logo or choose a preset icon.",           step: 4 },
    Frames:    { headline: "Apply Text Frames",                sub: "Add a label or call-to-action around your QR code.",      step: 5 },
    Effects:   { headline: "Add Visual Effects",               sub: "Shadows, glows, and canvas decorations.",                 step: 6 },
    Advanced:  { headline: "Advanced Settings",                sub: "Error correction, quiet zone, and canvas fine-tuning.",   step: 7 },
    Download:  { headline: "Export Your QR Code",              sub: "Choose format, resolution, and download.",                step: 8 },
  }
  const meta = TAB_META[activeTab] ?? TAB_META["Content"]

  return (
    <div className="lg:min-h-screen flex flex-col font-body-md text-on-surface bg-background antialiased pt-14 sm:pt-16">
      
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed w-full top-14 sm:top-16 z-[45] bg-red-600 text-white text-center py-2 px-4 shadow-md flex items-center justify-center gap-2 text-sm font-semibold animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-lg">wifi_off</span>
          You are currently offline. Features that require the server are disabled.
        </div>
      )}

      {/* TopNavBar with mobile hamburger */}
      <nav className="fixed w-full top-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm backdrop-blur-md bg-opacity-95 safe-top">
        <div className="flex justify-between items-center h-14 sm:h-16 px-4 sm:px-gutter w-full">
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Premium Brand Wordmark */}
            <a href="/" className="flex items-center gap-2.5 group shrink-0" title="GenerateCustomQR — Home">
              <div className="w-8 h-8 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm group-hover:drop-shadow-md transition-all">
                  <defs>
                    <mask id="app-logo-mask">
                      <rect width="100" height="100" fill="white"/>
                      <rect x="21" y="21" width="14" height="14" rx="4" fill="black"/>
                      <rect x="65" y="21" width="14" height="14" rx="4" fill="black"/>
                      <rect x="21" y="65" width="14" height="14" rx="4" fill="black"/>
                    </mask>
                  </defs>
                  <g mask="url(#app-logo-mask)" fill="#18181b">
                    <rect x="8" y="8" width="40" height="40" rx="12"/>
                    <rect x="52" y="8" width="40" height="40" rx="12"/>
                    <rect x="8" y="52" width="40" height="40" rx="12"/>
                  </g>
                  <g>
                    <rect x="54" y="54" width="18" height="18" rx="6" fill="#18181b"/>
                    <rect x="54" y="76" width="12" height="12" rx="4" fill="#71717a"/>
                    <rect x="70" y="76" width="12" height="12" rx="4" fill="#18181b"/>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[14px] font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap">GenerateCustomQR</span>
                <span className="text-[9px] font-medium text-on-surface-variant tracking-wider hidden sm:block whitespace-nowrap">39 styles · 100% free</span>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab("Content")}
                className={`text-sm font-semibold transition-colors duration-200 ${activeTab === "Content" && settings.contentType !== "batch" ? "text-on-surface border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Generator
              </button>
              <a
                href="/how-to-use"
                className="text-sm font-semibold transition-colors duration-200 text-on-surface-variant hover:text-on-surface flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">help_outline</span>
                How to Use
              </a>
              <a
                href="/qr-code-scanner"
                className="text-sm font-semibold transition-colors duration-200 text-on-surface-variant hover:text-on-surface flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                Scan
              </a>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors touch-press"
          >
            <span className="material-symbols-outlined text-on-surface">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-4 py-3 space-y-1 shadow-lg">
            <button
              onClick={() => { setActiveTab("Content"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl min-h-[48px] font-bold ${activeTab === "Content" && settings.contentType !== "batch" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container"}`}
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
              Generator
            </button>
            <a
              href="/how-to-use"
              className="w-full flex items-center gap-3 p-3 rounded-xl min-h-[48px] font-bold text-on-surface-variant hover:bg-surface-container"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
              How to Use
            </a>
            <a
              href="/qr-code-scanner"
              className="w-full flex items-center gap-3 p-3 rounded-xl min-h-[48px] font-bold text-primary bg-primary/5 border border-primary/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              Scan QR Code
            </a>
          </div>
        )}

      </nav>

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
                className={`w-full flex items-center justify-center xl:justify-start gap-3 px-0 xl:px-3 py-2.5 rounded-lg text-[13px] font-medium tab-spring relative sidebar-item ${activeTab === tab.name
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
                  <div className="min-w-0">
                    {/* Step progress pills */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      {sidebarTabs.map((tab, i) => (
                        <button
                          key={tab.name}
                          onClick={() => setActiveTab(tab.name)}
                          title={tab.name}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            tab.name === activeTab
                              ? 'w-6 bg-primary'
                              : i < sidebarTabs.findIndex(t => t.name === activeTab)
                                ? 'w-3 bg-primary/40'
                                : 'w-3 bg-outline-variant'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
                        Step {meta.step} / {sidebarTabs.length}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-on-surface tracking-tight panel-enter" key={`h-${activeTab}`}>{meta.headline}</h2>
                    <p className="text-sm text-on-surface-variant mt-1 panel-enter" key={`s-${activeTab}`}>
                      {meta.sub}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/50 shadow-2xs shrink-0 select-none">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                      title="Undo"
                    >
                      <span className="material-symbols-outlined text-[18px] group-active:-rotate-45 transition-transform duration-200">undo</span>
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center border border-outline-variant/30 shadow-2xs group"
                      title="Redo"
                    >
                      <span className="material-symbols-outlined text-[18px] group-active:rotate-45 transition-transform duration-200">redo</span>
                    </button>
                    <div className="w-[1px] h-5 bg-outline-variant/50 mx-1"></div>
                    <button
                      onClick={resetSettings}
                      className="py-1.5 px-3 rounded-lg bg-error-container/20 hover:bg-error-container/40 text-error font-semibold text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-2xs group"
                      title="Reset Design"
                    >
                      <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">restart_alt</span>
                      <span>Reset Design</span>
                    </button>
                  </div>
                </header>

                <div className="bg-white rounded-2xl p-6 md:p-8 surface-ring-vercel max-w-full panel-enter" key={activeTab}>
                  {renderPanelContent(activeTab)}
                  {renderNextStepButton(activeTab)}
                </div>
              </div>

              {/* Right Column: Sticky Live Preview */}
              <DesktopPreviewPane
                previewRef={previewRef}
                previewBg={previewBg}
                setPreviewBg={setPreviewBg}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                imageUrl={imageUrl}
                isComparing={isComparing}
                setIsComparing={setIsComparing}
                handleFullscreen={handleFullscreen}
                handleShare={handleShare}
              />
            </div>
            
            <MobileBottomBar 
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              imageUrl={imageUrl}
              handleFullscreen={() => setIsFullscreen(true)}
              mobileMainTab={mobileMainTab}
              setMobileMainTab={handleMobileTabChange}
              showMiniPreview={showMiniPreview}
            />
            {/* The Mobile Content area follows underneath the sticky header */}
            <div className="lg:hidden p-4 sm:p-5 pb-24 sm:pb-28 bg-surface-container-lowest min-h-[50vh] relative z-0">
                {mobileMainTab === 'content' ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 pb-1">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary flex items-center justify-center text-xs font-black shrink-0">1</div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Enter your content</p>
                        <p className="text-[11px] text-on-surface-variant">Pick a type below, then fill in your data</p>
                      </div>
                    </div>
                    {renderPanelContent('Content')}
                    {renderNextStepButton('Content')}
                  </motion.div>
                ) : mobileMainTab === 'download' ? (
                  <motion.div 
                    key="download"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 pb-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-400 flex items-center justify-center text-xs font-black shrink-0">✓</div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Save your QR code</p>
                        <p className="text-[11px] text-on-surface-variant">Choose a format and download</p>
                      </div>
                    </div>
                    {renderPanelContent('Download')}
                    {renderNextStepButton('Download')}
                  </motion.div>
                ) : mobileMainTab === 'logo' ? (
                  <motion.div 
                    key="logo"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    {renderPanelContent('Logo')}
                    {renderNextStepButton('Logo')}
                  </motion.div>
                ) : mobileMainTab === 'design' ? (
                  <motion.div 
                    key="design"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50">
                      {([
                        { name: "Templates", icon: "dashboard" },
                        { name: "Design",    icon: "palette" },
                        { name: "Frames",    icon: "crop_free" }
                      ] as const).map(tab => (
                        <button
                          key={tab.name}
                          onClick={() => setActiveTab(tab.name)}
                          className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-bold transition-colors text-xs outline-none ${
                            activeTab === tab.name
                              ? 'text-primary'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {activeTab === tab.name && (
                            <motion.div
                              layoutId="mobile-design-subnav"
                              className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-md"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                            {tab.name === "Design" ? "Style" : tab.name}
                          </div>
                        </button>
                      ))}
                    </div>
                    {renderPanelContent(activeTab)}
                    {renderNextStepButton(activeTab)}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="more"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50 relative">
                      {([
                        { name: "Effects",   icon: "auto_awesome" },
                        { name: "Advanced",  icon: "tune" },
                      ] as const).map(tab => (
                        <button
                          key={tab.name}
                          onClick={() => setActiveTab(tab.name)}
                          className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-bold transition-colors text-xs z-10 ${
                            activeTab === tab.name
                              ? 'text-primary'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {activeTab === tab.name && (
                            <motion.div
                              layoutId="activeSubTabIndicator"
                              className="absolute inset-0 bg-white shadow-sm rounded-md"
                              style={{ zIndex: -1 }}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                          <span>{tab.name}</span>
                        </button>
                      ))}
                    </div>
                    {renderPanelContent(activeTab)}
                    {renderNextStepButton(activeTab)}
                  </motion.div>
                )}
            </div>

          </div>
        </div>
      </div>

      <FullscreenLightbox
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        previewBg={previewBg}
        setPreviewBg={setPreviewBg}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel as any}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        imageUrl={imageUrl}
        isComparing={isComparing}
        setIsComparing={setIsComparing}
        touchDistance={touchDistance}
        setTouchDistance={setTouchDistance}
        initialZoom={initialZoom}
        setInitialZoom={setInitialZoom}
        lastTap={lastTap}
        setLastTap={setLastTap}
      />
      
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined">{toast.icon}</span>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
export default App;
