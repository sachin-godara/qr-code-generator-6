import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { 
  Camera, 
  Image as ImageIcon, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Loader2, 
  Wifi, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Check, 
  ArrowRight, 
  History, 
  Trash2, 
  Zap, 
  ZapOff, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  Download,
  QrCode
} from 'lucide-react';
import { scanQRImageBackend } from '../../services/qrApi';

// --- Type Definitions ---
export type ParsedQRType = 'url' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms' | 'geo' | 'event' | 'text';

export interface ParsedQRData {
  type: ParsedQRType;
  title: string;
  raw: string;
  url?: string;
  domain?: string;
  isHttps?: boolean;
  wifi?: {
    ssid: string;
    password?: string;
    authType: string;
    hidden?: boolean;
  };
  vcard?: {
    name?: string;
    phone?: string;
    email?: string;
    org?: string;
    title?: string;
    url?: string;
    address?: string;
    notes?: string;
  };
  email?: {
    to: string;
    subject?: string;
    body?: string;
  };
  phone?: {
    number: string;
  };
  sms?: {
    number: string;
    message?: string;
  };
  geo?: {
    lat: string;
    lng: string;
    mapsUrl: string;
  };
  event?: {
    summary: string;
    location?: string;
    description?: string;
    dtstart?: string;
    dtend?: string;
  };
}

export interface ScanHistoryItem {
  id: string;
  raw: string;
  type: ParsedQRType;
  title: string;
  timestamp: number;
}

// --- Helper: Play subtle confirmation chime ---
function playScanSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // A6
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // AudioContext blocked or not supported, ignore silently
  }
}

// --- Helper: Parse Scanned Payload ---
export function parseQRContent(rawText: string): ParsedQRData {
  const raw = rawText.trim();

  // 1. WiFi Format: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
  if (raw.startsWith('WIFI:') || raw.startsWith('wifi:')) {
    const getField = (tag: string) => {
      const match = raw.match(new RegExp(`${tag}:([^;]*)`));
      return match ? match[1] : '';
    };
    const ssid = getField('S') || 'Unknown WiFi';
    const password = getField('P');
    const authType = getField('T') || 'WPA';
    const hidden = getField('H') === 'true';

    return {
      type: 'wifi',
      title: `WiFi: ${ssid}`,
      raw,
      wifi: { ssid, password, authType, hidden }
    };
  }

  // 2. vCard Format: BEGIN:VCARD ... END:VCARD
  if (raw.includes('BEGIN:VCARD')) {
    const lines = raw.split(/\r\n|\r|\n/);
    let name = '';
    let phone = '';
    let email = '';
    let org = '';
    let title = '';
    let url = '';
    let address = '';
    let notes = '';

    for (const line of lines) {
      if (line.startsWith('FN:')) name = line.substring(3).trim();
      else if (!name && line.startsWith('N:')) {
        const parts = line.substring(2).split(';');
        name = parts.filter(Boolean).reverse().join(' ').trim();
      } else if (line.match(/^TEL(;[^:]+)?:/i)) {
        if (!phone) phone = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.match(/^EMAIL(;[^:]+)?:/i)) {
        if (!email) email = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.startsWith('ORG:')) {
        org = line.substring(4).replace(/;/g, ' ').trim();
      } else if (line.startsWith('TITLE:')) {
        title = line.substring(6).trim();
      } else if (line.startsWith('URL:')) {
        url = line.substring(4).trim();
      } else if (line.match(/^ADR(;[^:]+)?:/i)) {
        address = line.substring(line.indexOf(':') + 1).replace(/;/g, ', ').trim();
      } else if (line.startsWith('NOTE:')) {
        notes = line.substring(5).trim();
      }
    }

    return {
      type: 'vcard',
      title: name ? `Contact: ${name}` : 'Contact Card (vCard)',
      raw,
      vcard: { name, phone, email, org, title, url, address, notes }
    };
  }

  // 3. Email format: mailto:... or MATMSG:...
  if (raw.startsWith('mailto:') || raw.startsWith('MAILTO:')) {
    try {
      const emailUrl = new URL(raw);
      const to = emailUrl.pathname;
      const subject = emailUrl.searchParams.get('subject') || undefined;
      const body = emailUrl.searchParams.get('body') || undefined;
      return {
        type: 'email',
        title: `Email to ${to}`,
        raw,
        email: { to, subject, body }
      };
    } catch (e) {
      const to = raw.replace(/^mailto:/i, '').split('?')[0];
      return {
        type: 'email',
        title: `Email to ${to}`,
        raw,
        email: { to }
      };
    }
  }
  if (raw.startsWith('MATMSG:')) {
    const to = raw.match(/TO:([^;]+)/)?.[1] || '';
    const subject = raw.match(/SUB:([^;]+)/)?.[1];
    const body = raw.match(/BODY:([^;]+)/)?.[1];
    return {
      type: 'email',
      title: `Email to ${to}`,
      raw,
      email: { to, subject, body }
    };
  }

  // 4. Phone format: tel:...
  if (raw.startsWith('tel:') || raw.startsWith('TEL:')) {
    const number = raw.substring(4).trim();
    return {
      type: 'phone',
      title: `Phone: ${number}`,
      raw,
      phone: { number }
    };
  }

  // 5. SMS format: smsto:... or sms:...
  if (raw.startsWith('smsto:') || raw.startsWith('SMSTO:') || raw.startsWith('sms:') || raw.startsWith('SMS:')) {
    const parts = raw.substring(raw.indexOf(':') + 1).split(':');
    const number = parts[0] || '';
    const message = parts.slice(1).join(':');
    return {
      type: 'sms',
      title: `SMS to ${number}`,
      raw,
      sms: { number, message }
    };
  }

  // 6. Geo format: geo:lat,lng or Google Maps URL
  if (raw.startsWith('geo:')) {
    const coords = raw.substring(4).split('?')[0].split(',');
    const lat = coords[0]?.trim() || '';
    const lng = coords[1]?.trim() || '';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    return {
      type: 'geo',
      title: `Location: ${lat}, ${lng}`,
      raw,
      geo: { lat, lng, mapsUrl }
    };
  }

  // 7. Event format: BEGIN:VEVENT ... END:VEVENT
  if (raw.includes('BEGIN:VEVENT')) {
    const summary = raw.match(/SUMMARY:([^\r\n]+)/)?.[1] || 'Calendar Event';
    const location = raw.match(/LOCATION:([^\r\n]+)/)?.[1];
    const description = raw.match(/DESCRIPTION:([^\r\n]+)/)?.[1];
    const dtstart = raw.match(/DTSTART:([^\r\n]+)/)?.[1];
    const dtend = raw.match(/DTEND:([^\r\n]+)/)?.[1];
    return {
      type: 'event',
      title: summary,
      raw,
      event: { summary, location, description, dtstart, dtend }
    };
  }

  // 8. Standard URL / Website
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsedUrl = new URL(raw);
      return {
        type: 'url',
        title: parsedUrl.hostname.replace(/^www\./, ''),
        raw,
        url: raw,
        domain: parsedUrl.hostname,
        isHttps: parsedUrl.protocol === 'https:'
      };
    } catch (e) {
      return {
        type: 'url',
        title: raw,
        raw,
        url: raw,
        isHttps: raw.startsWith('https://')
      };
    }
  }

  // 9. Plain Text / JSON / Other
  return {
    type: 'text',
    title: raw.length > 40 ? `${raw.substring(0, 40)}...` : raw,
    raw
  };
}

const STORAGE_KEY = 'genqr_scan_history_v1';

export default function QRScannerApp() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedQRData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'file' | 'camera'>('file');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  
  // Extra UX features
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  
  // Camera advanced features
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);
  const readerElementId = 'qr-reader';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setScanHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load scan history from localStorage');
    }
  }, []);

  const saveToHistory = useCallback((parsed: ParsedQRData) => {
    try {
      const newItem: ScanHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        raw: parsed.raw,
        type: parsed.type,
        title: parsed.title,
        timestamp: Date.now()
      };
      setScanHistory(prev => {
        const filtered = prev.filter(item => item.raw !== parsed.raw);
        const updated = [newItem, ...filtered].slice(0, 15);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      // Storage quota or error, ignore
    }
  }, []);

  const clearHistory = () => {
    setScanHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const deleteHistoryItem = (id: string) => {
    setScanHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Safe check for scanning state
  const isScannerRunning = () => {
    if (!scannerRef.current) return false;
    try {
      return scannerRef.current.getState() === 2;
    } catch (e) {
      return (scannerRef.current as any).isScanning === true;
    }
  };

  const handleScanSuccess = useCallback((decodedText: string) => {
    stopCamera();
    setScanResult(decodedText);
    const parsed = parseQRContent(decodedText);
    setParsedData(parsed);
    saveToHistory(parsed);
    if (soundEnabled) {
      playScanSound();
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(80); } catch (e) {}
    }
  }, [soundEnabled, saveToHistory]);

  // Robust Camera start with automatic device & facingMode fallbacks
  const startCamera = async (cameraId?: string) => {
    if (isStartingRef.current) return;
    if (isScannerRunning()) return;
    
    try {
      isStartingRef.current = true;
      setError(null);
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        });
      }

      const scanConfig = {
        fps: 15,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minDim = Math.min(viewfinderWidth, viewfinderHeight);
          return { width: Math.round(minDim * 0.75), height: Math.round(minDim * 0.75) };
        },
        aspectRatio: 1.0,
      };

      try {
        // Attempt 1: Environment facing (Rear camera on mobile) or specific cameraId
        await scannerRef.current.start(
          cameraId ? { deviceId: { exact: cameraId } } : { facingMode: "environment" },
          scanConfig,
          (decodedText) => handleScanSuccess(decodedText),
          () => {}
        );
      } catch (firstErr: any) {
        console.warn("First camera start attempt failed, trying fallback to front/default webcam:", firstErr);
        // Attempt 2: Fallback for laptops/desktops where "environment" is unsupported/overconstrained
        await scannerRef.current.start(
          { facingMode: "user" },
          scanConfig,
          (decodedText) => handleScanSuccess(decodedText),
          () => {}
        );
      }

      setIsScanning(true);

      // Enumerate cameras in background
      Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length > 0) {
          setAvailableCameras(cameras.map(c => ({ id: c.id, label: c.label || `Camera ${c.id.substring(0, 5)}` })));
        }
      }).catch(() => {});

      // Check torch support
      try {
        const capabilities = (scannerRef.current as any).getRunningTrackCameraCapabilities?.();
        setHasTorch(Boolean(capabilities?.torchFeature?.()?.isSupported?.()));
      } catch (e) {
        setHasTorch(false);
      }
    } catch (err: any) {
      console.error("Camera start error:", err);
      setIsScanning(false);
      const errMsg = String(err);
      if (err?.name === "NotAllowedError" || errMsg.includes("Permission") || errMsg.includes("denied")) {
        setError("Camera permission denied. Please allow camera access in your browser settings and click Retry.");
      } else if (err?.name === "NotFoundError" || errMsg.includes("device not found") || errMsg.includes("Requested device not found")) {
        setError("No webcam or camera device detected on this computer. You can upload an image or press Ctrl+V to paste.");
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setError("Camera access requires HTTPS. Please ensure you are browsing on a secure connection.");
      } else {
        setError("Camera is currently unavailable. Please verify browser permissions or upload an image instead.");
      }
    } finally {
      isStartingRef.current = false;
    }
  };

  const stopCamera = () => {
    if (isScannerRunning()) {
      scannerRef.current?.stop().then(() => {
        setIsScanning(false);
        setTorchOn(false);
      }).catch(console.error);
    }
  };

  const toggleTorch = async () => {
    if (!scannerRef.current || !isScannerRunning()) return;
    try {
      await (scannerRef.current as any).applyVideoConstraints({
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch (e) {
      console.warn("Could not toggle torch:", e);
    }
  };

  // Switch camera tab lifecycle
  useEffect(() => {
    if (activeTab === 'camera' && !scanResult) {
      startCamera(selectedCameraId || undefined);
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab, scanResult, selectedCameraId]);

  // Fallback scan pipeline
  const scanWithFallback = async (file: File): Promise<string> => {
    if (!scannerRef.current) throw new Error("Scanner not initialized");
    
    // Level 1: Standard client scan
    try {
      return await scannerRef.current.scanFile(file, true);
    } catch (err) {
      console.log("Client scan pass 1 failed, trying inverted canvas scan...");
    }

    // Level 2: Inverted canvas scan (handles dark mode / white on black QR codes)
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = async () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("Canvas not supported");

        const MAX_DIM = 1200;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(async (blob) => {
          if (!blob) return reject("Blob creation failed");
          const invertedFile = new File([blob], "inverted.png", { type: "image/png" });
          
          try {
            const decodedText = await scannerRef.current!.scanFile(invertedFile, true);
            resolve(decodedText);
          } catch (invertErr) {
            reject(invertErr);
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject("Image load failed");
      };
      img.src = url;
    });
  };

  // Process any File (from input, drop, or clipboard paste)
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (PNG, JPG, WebP, etc.)");
      return;
    }

    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);
    setError(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        });
      }
      
      const decodedText = await scanWithFallback(file);
      handleScanSuccess(decodedText);
    } catch (err) {
      // Level 3: Backend Deep Scan
      setIsDeepScanning(true);
      setError(null);
      try {
        const decodedText = await scanQRImageBackend(file);
        handleScanSuccess(decodedText);
      } catch (backendErr: any) {
        setError(backendErr.message || "Could not detect a valid QR code in that image. Please try a clearer or higher contrast image.");
      } finally {
        setIsDeepScanning(false);
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processImageFile(file);
  };

  // Clipboard Paste listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setActiveTab('file');
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setParsedData(null);
    setError(null);
    setShowPassword(false);
    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
      setUploadedImagePreview(null);
    }
  };

  const copyToClipboard = (text?: string) => {
    const target = text || scanResult;
    if (target) {
      navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate vCard download
  const downloadVCardFile = () => {
    if (!scanResult) return;
    const blob = new Blob([scanResult], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedData?.vcard?.name?.replace(/\s+/g, '_') || 'contact'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Link to QR Creator to generate styled QR from scanned content
  const getCreatorUrl = () => {
    if (!scanResult) return '/';
    return `/?text=${encodeURIComponent(scanResult)}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest rounded-3xl border border-outline-variant/50 shadow-2xl overflow-hidden transition-all">
      
      {/* Top Header & Mode Tabs */}
      <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Main Segmented Toggle */}
        <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant/50 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('file')}
            className={`relative flex-1 sm:flex-initial px-5 py-2.5 flex items-center justify-center gap-2 rounded-lg font-bold transition-all text-sm outline-none ${activeTab === 'file' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {activeTab === 'file' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <ImageIcon size={18} /> Upload Image
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('camera')}
            className={`relative flex-1 sm:flex-initial px-5 py-2.5 flex items-center justify-center gap-2 rounded-lg font-bold transition-all text-sm outline-none ${activeTab === 'camera' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {activeTab === 'camera' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Camera size={18} /> Scan with Camera
            </span>
          </button>
        </div>

        {/* Action Controls (Sound, History) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${soundEnabled ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/50'}`}
            title={soundEnabled ? 'Mute sound on scan' : 'Enable audio chime on scan'}
            aria-label="Toggle scan sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${showHistory ? 'bg-primary text-white border-primary' : 'bg-surface-container text-on-surface border-outline-variant/50 hover:bg-surface-container-high'}`}
            title="View scan history"
          >
            <History size={16} />
            <span>History</span>
            {scanHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px] font-black">
                {scanHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Scanner Body */}
      <div className="p-6 md:p-8">
        
        {/* Error Alert Box */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6 p-4 bg-error-container text-on-error-container rounded-2xl flex items-start gap-3 border border-error/20 shadow-sm"
          >
            <AlertCircle className="shrink-0 mt-0.5 text-error" size={20} />
            <div className="text-sm font-medium leading-relaxed">
              <p className="font-bold mb-0.5">Scan Notice</p>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {!scanResult ? (
          <div className="flex flex-col items-center">

            {/* --- Camera Scanner View --- */}
            {activeTab === 'camera' && (
              <div className="w-full flex flex-col items-center">
                
                {/* Camera Viewfinder Box */}
                <div 
                  className="w-full max-w-[420px] aspect-square overflow-hidden rounded-3xl bg-neutral-950 shadow-inner relative border-2 border-primary/30 flex items-center justify-center"
                >
                  <div id={readerElementId} className="w-full h-full object-cover"></div>
                  
                  {/* Viewfinder Idle / Permission / Error Overlay */}
                  {!isScanning && (
                    <div className="absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
                        <Camera size={32} />
                      </div>
                      
                      <h4 className="text-base font-bold text-on-surface mb-1">
                        {error ? 'Camera Access Required' : 'Live Camera Scanner'}
                      </h4>
                      
                      <p className="text-xs text-on-surface-variant max-w-[260px] leading-relaxed mb-5">
                        {error ? 'Camera was blocked or unavailable. Click below to retry or upload a file.' : 'Scan QR codes in real-time with your smartphone or computer camera.'}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[280px]">
                        <button
                          onClick={() => startCamera(selectedCameraId || undefined)}
                          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-xl font-bold hover:bg-primary/90 text-xs shadow-md transition-all cursor-pointer"
                        >
                          <RefreshCw size={14} />
                          {error ? 'Retry Camera' : 'Start Camera'}
                        </button>
                        
                        <button
                          onClick={() => setActiveTab('file')}
                          className="flex-1 flex items-center justify-center gap-2 bg-surface hover:bg-surface-container text-on-surface py-2.5 px-4 rounded-xl font-bold text-xs border border-outline-variant/60 transition-colors cursor-pointer"
                        >
                          <ImageIcon size={14} />
                          Upload File
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Live Scanning Targeting Overlay */}
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 z-10">
                        <div className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-2xl border border-white/20">
                          {/* 4 Corner Markers */}
                          <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></span>
                          <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></span>
                          <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></span>
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></span>
                          
                          {/* Animated Laser Scanning Line */}
                          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_#863bff] animate-pulse absolute top-1/2 -translate-y-1/2"></div>
                        </div>
                      </div>

                      {/* Camera Controls Floating Bar */}
                      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 px-4 pointer-events-auto z-10">
                        {hasTorch && (
                          <button
                            onClick={toggleTorch}
                            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${torchOn ? 'bg-amber-400 text-neutral-950 scale-110' : 'bg-black/60 text-white hover:bg-black/80'}`}
                            title={torchOn ? "Turn flashlight off" : "Turn flashlight on"}
                          >
                            {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
                          </button>
                        )}

                        {availableCameras.length > 1 && (
                          <select
                            value={selectedCameraId || ''}
                            onChange={(e) => {
                              const id = e.target.value;
                              setSelectedCameraId(id);
                              stopCamera();
                              setTimeout(() => startCamera(id), 200);
                            }}
                            className="bg-black/70 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 outline-none cursor-pointer max-w-[180px] truncate"
                          >
                            {availableCameras.map(cam => (
                              <option key={cam.id} value={cam.id} className="bg-neutral-900 text-white">
                                {cam.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <p className="mt-6 text-center text-sm font-medium text-on-surface-variant max-w-sm">
                  Point your camera viewfinder directly at any QR code to instantly scan and decode.
                </p>
              </div>
            )}

            {/* --- File Upload / Drag-and-Drop View --- */}
            {activeTab === 'file' && (
              <div className="w-full flex flex-col items-center">
                
                {/* Uploaded Preview (if scanning in progress) */}
                {uploadedImagePreview && isDeepScanning && (
                  <div className="w-full max-w-[240px] mb-6 rounded-2xl overflow-hidden border border-outline-variant shadow-md relative bg-surface-container-highest">
                    <img 
                      src={uploadedImagePreview} 
                      alt="Uploaded preview" 
                      className="w-full h-auto object-contain opacity-60" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 text-white text-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                      <p className="text-xs font-bold uppercase tracking-wider">Deep Scanning...</p>
                      <p className="text-[11px] text-white/80 mt-1">Computer vision multi-pass decoding</p>
                    </div>
                  </div>
                )}

                {/* Dropzone Box */}
                <div 
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isDeepScanning && fileInputRef.current?.click()}
                  className={`w-full max-w-[420px] aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer p-6 text-center select-none relative overflow-hidden group ${
                    isDragging 
                      ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl' 
                      : 'border-outline-variant hover:border-primary bg-surface-container/40 hover:bg-surface-container/70'
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner border border-primary/20">
                    <ImageIcon size={38} />
                  </div>

                  <h3 className="text-lg font-bold text-on-surface mb-1">
                    {isDragging ? 'Drop QR Code image here' : 'Click or Drag QR image here'}
                  </h3>
                  
                  <p className="text-xs text-on-surface-variant max-w-[260px] leading-relaxed">
                    Supports PNG, JPG, WebP, SVG, and screenshot formats.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/60 text-xs font-semibold text-on-surface-variant">
                    <Sparkles size={13} className="text-primary" />
                    <span>Tip: Press <strong>Ctrl + V</strong> to paste screenshot</span>
                  </div>

                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isDeepScanning}
                  />
                </div>

                <p className="mt-6 text-center text-sm font-medium text-on-surface-variant">
                  Upload a saved image or screenshot containing any QR code to decode its full contents.
                </p>
              </div>
            )}

          </div>
        ) : (
          
          /* --- Scan Result View (Rich Smart Actions) --- */
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Check size={14} className="stroke-[3]" />
              Scan Decoded Successfully
            </div>

            {/* Smart Parsed Content Display Card */}
            <div className="w-full bg-surface-container rounded-3xl p-6 sm:p-7 border border-outline-variant/60 shadow-sm relative overflow-hidden">
              
              {/* Type 1: URL / Website */}
              {parsedData?.type === 'url' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                        <ExternalLink size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Website Link</p>
                        <p className="font-bold text-on-surface text-base">{parsedData.domain || 'URL'}</p>
                      </div>
                    </div>

                    {parsedData.isHttps && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck size={12} /> Secure HTTPS
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 bg-surface rounded-xl border border-outline-variant/50 break-all font-mono text-sm text-on-surface select-all">
                    {scanResult}
                  </div>
                </div>
              )}

              {/* Type 2: WiFi Network */}
              {parsedData?.type === 'wifi' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <Wifi size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">WiFi Network</p>
                      <h4 className="text-lg font-black text-on-surface">{parsedData.wifi?.ssid}</h4>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/40">
                      <p className="text-xs text-on-surface-variant font-bold">Security</p>
                      <p className="text-sm font-semibold text-on-surface mt-0.5">{parsedData.wifi?.authType || 'WPA/WPA2'}</p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/40 relative">
                      <p className="text-xs text-on-surface-variant font-bold">Password</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-sm font-mono font-semibold text-on-surface">
                          {parsedData.wifi?.password ? (showPassword ? parsedData.wifi.password : '••••••••••••') : 'No Password (Open)'}
                        </p>
                        {parsedData.wifi?.password && (
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-on-surface-variant hover:text-on-surface text-xs font-bold"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Type 3: Contact Card (vCard) */}
              {parsedData?.type === 'vcard' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Card (vCard)</p>
                      <h4 className="text-lg font-black text-on-surface">{parsedData.vcard?.name || 'Contact Info'}</h4>
                    </div>
                  </div>

                  <div className="space-y-2 bg-surface p-4 rounded-xl border border-outline-variant/50 text-sm">
                    {parsedData.vcard?.phone && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <Phone size={15} className="text-on-surface-variant shrink-0" />
                        <span className="font-semibold">{parsedData.vcard.phone}</span>
                      </div>
                    )}
                    {parsedData.vcard?.email && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <Mail size={15} className="text-on-surface-variant shrink-0" />
                        <span className="font-semibold">{parsedData.vcard.email}</span>
                      </div>
                    )}
                    {parsedData.vcard?.org && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="text-xs font-bold text-on-surface-variant uppercase">Org:</span>
                        <span>{parsedData.vcard.org} {parsedData.vcard.title ? `(${parsedData.vcard.title})` : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Type 4: Email */}
              {parsedData?.type === 'email' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</p>
                      <h4 className="text-lg font-black text-on-surface">{parsedData.email?.to}</h4>
                    </div>
                  </div>

                  {(parsedData.email?.subject || parsedData.email?.body) && (
                    <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/40 text-sm">
                      {parsedData.email.subject && <p className="font-bold mb-1">Subj: {parsedData.email.subject}</p>}
                      {parsedData.email.body && <p className="text-on-surface-variant">{parsedData.email.body}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Type 5: Phone Call */}
              {parsedData?.type === 'phone' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center font-bold">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Call</p>
                    <h4 className="text-xl font-mono font-black text-on-surface">{parsedData.phone?.number}</h4>
                  </div>
                </div>
              )}

              {/* Type 6: SMS */}
              {parsedData?.type === 'sms' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">SMS Message</p>
                      <h4 className="text-lg font-black text-on-surface">{parsedData.sms?.number}</h4>
                    </div>
                  </div>
                  {parsedData.sms?.message && (
                    <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/40 text-sm text-on-surface">
                      {parsedData.sms.message}
                    </div>
                  )}
                </div>
              )}

              {/* Type 7: Location / Map */}
              {parsedData?.type === 'geo' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Geographic Coordinates</p>
                    <h4 className="text-base font-mono font-bold text-on-surface">{parsedData.geo?.lat}, {parsedData.geo?.lng}</h4>
                  </div>
                </div>
              )}

              {/* Type 8: Plain Text / Other */}
              {parsedData?.type === 'text' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Decoded Text Data</p>
                  <div className="p-4 bg-surface rounded-xl border border-outline-variant/50 text-sm font-mono text-on-surface whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                    {scanResult}
                  </div>
                </div>
              )}

            </div>

            {/* Smart Action Buttons Row */}
            <div className="flex flex-wrap gap-3 mt-6 w-full">
              
              {/* Context Action 1: Open URL */}
              {parsedData?.type === 'url' && (
                <a
                  href={parsedData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all"
                >
                  <ExternalLink size={18} />
                  Open Website
                </a>
              )}

              {/* Context Action 2: Copy WiFi Password */}
              {parsedData?.type === 'wifi' && parsedData.wifi?.password && (
                <button
                  onClick={() => copyToClipboard(parsedData.wifi?.password)}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all"
                >
                  <Copy size={18} />
                  Copy Password
                </button>
              )}

              {/* Context Action 3: Save vCard */}
              {parsedData?.type === 'vcard' && (
                <button
                  onClick={downloadVCardFile}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all"
                >
                  <Download size={18} />
                  Save Contact (.vcf)
                </button>
              )}

              {/* Context Action 4: Compose Email */}
              {parsedData?.type === 'email' && (
                <a
                  href={`mailto:${parsedData.email?.to}${parsedData.email?.subject ? `?subject=${encodeURIComponent(parsedData.email.subject)}` : ''}`}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all"
                >
                  <Mail size={18} />
                  Compose Email
                </a>
              )}

              {/* Context Action 5: Call Phone */}
              {parsedData?.type === 'phone' && (
                <a
                  href={`tel:${parsedData.phone?.number}`}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-emerald-700 shadow-md transition-all"
                >
                  <Phone size={18} />
                  Call Number
                </a>
              )}

              {/* Context Action 6: Open Maps */}
              {parsedData?.type === 'geo' && (
                <a
                  href={parsedData.geo?.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all"
                >
                  <MapPin size={18} />
                  Open in Maps
                </a>
              )}

              {/* Universal Action: Copy Raw Text */}
              <button
                onClick={() => copyToClipboard()}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3.5 px-5 rounded-2xl font-bold border border-outline-variant/50 transition-colors cursor-pointer"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              {/* Universal Action: Scan Another */}
              <button
                onClick={resetScanner}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3.5 px-5 rounded-2xl font-bold border border-outline-variant/50 transition-colors cursor-pointer"
              >
                <RefreshCw size={18} />
                Scan Another
              </button>
            </div>

            {/* Bottom Bridge Action: Customize in Generator */}
            <div className="w-full mt-6 pt-6 border-t border-outline-variant/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Want to generate your own code for this content?</span>
              <a
                href={getCreatorUrl()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <QrCode size={14} />
                <span>Customize in Generator</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </motion.div>
        )}

      </div>

      {/* --- Scan History Drawer --- */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-outline-variant/50 bg-surface-container/60 p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
                <History size={16} className="text-primary" />
                Recent Scan History
              </h4>
              {scanHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs font-bold text-error hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Clear All
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">No scans in history yet.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {scanHistory.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-colors text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-bold text-on-surface truncate">{item.title}</p>
                      <p className="text-[11px] text-on-surface-variant font-mono truncate">{item.raw}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyToClipboard(item.raw)}
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
