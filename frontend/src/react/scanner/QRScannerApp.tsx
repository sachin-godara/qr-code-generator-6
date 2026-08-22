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
  QrCode,
  Calendar,
  FileText,
  CheckCircle2,
  ScanLine,
  FileCode,
  FileDown,
  SwitchCamera
} from 'lucide-react';
import { scanQRImageBackend, API_BASE } from '../../services/qrApi';

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
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
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
const TAB_PREF_KEY = 'genqr_scanner_tab';

export default function QRScannerApp() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedQRData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'file' | 'camera'>('file');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [deepScanStep, setDeepScanStep] = useState<string>('Analyzing image...');
  const [isGeneratingDownloadQR, setIsGeneratingDownloadQR] = useState(false);

  // Extra UX features
  const [isDragging, setIsDragging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Camera advanced features
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef(false);
  const readerElementId = 'qr-reader';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  }, []);

  // Restore active tab & history on initial mount / reload
  useEffect(() => {
    try {
      // 1. Check URL query or hash first (e.g. ?tab=camera or #camera)
      const urlParams = new URLSearchParams(window.location.search);
      const queryTab = urlParams.get('tab');
      const hash = window.location.hash.replace('#', '');
      
      if (queryTab === 'camera' || hash === 'camera') {
        setActiveTab('camera');
      } else {
        const savedTab = sessionStorage.getItem(TAB_PREF_KEY);
        if (savedTab === 'camera' || savedTab === 'file') {
          setActiveTab(savedTab as any);
        }
      }

      // 2. Load scan history
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }

      // 3. Detect available cameras early (to know if device has 2+ cameras)
      Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length > 0) {
          setAvailableCameras(cameras.map(c => ({ id: c.id, label: c.label || `Camera ${c.id.substring(0, 5)}` })));
        }
      }).catch(() => {});
    } catch (e) {
      console.warn('Initial hydration load warning:', e);
    }
  }, []);

  // Sync tab changes with sessionStorage
  const handleTabChange = (newTab: 'file' | 'camera') => {
    setError(null);
    setActiveTab(newTab);
    try {
      sessionStorage.setItem(TAB_PREF_KEY, newTab);
    } catch (e) {}
  };

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
      showToast('Scan history cleared');
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

  // Hardware video track cleaner
  const hardStopMediaTracks = () => {
    try {
      const videoEl = document.querySelector(`#${readerElementId} video`) as HTMLVideoElement | null;
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          try { track.stop(); } catch (e) {}
        });
        videoEl.srcObject = null;
      }
    } catch (e) {}
  };

  // Stop Camera cleanly with hardware track cleanup
  const stopCamera = async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        if (state === 2) { // 2 = SCANNING
          await scannerRef.current.stop();
        }
      }
    } catch (e) {
      console.warn("Could not gracefully stop Html5Qrcode:", e);
    } finally {
      hardStopMediaTracks();
      setIsScanning(false);
      setTorchOn(false);
      isTransitioningRef.current = false;
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
    showToast('QR Code decoded successfully!');
  }, [soundEnabled, saveToHistory, showToast]);

  // Robust Camera start with automatic device & facingMode fallbacks
  const startCamera = async (cameraId?: string, customFacingMode?: 'environment' | 'user') => {
    if (isTransitioningRef.current) return;
    if (isScannerRunning()) return;
    
    try {
      isTransitioningRef.current = true;
      setError(null);
      
      const container = document.getElementById(readerElementId);
      if (!container) {
        throw new Error("Camera container not found in DOM");
      }

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

      const targetFacing = customFacingMode || facingMode;

      try {
        // Attempt 1: Specific camera or requested facingMode (Rear "environment" or Front "user")
        await scannerRef.current.start(
          cameraId ? { deviceId: { exact: cameraId } } : { facingMode: targetFacing },
          scanConfig,
          (decodedText) => handleScanSuccess(decodedText),
          () => {}
        );
      } catch (firstErr: any) {
        console.warn("First camera start attempt failed, trying fallback:", firstErr);
        // Attempt 2: Fallback to opposite facingMode
        const fallbackFacing = targetFacing === 'environment' ? 'user' : 'environment';
        await scannerRef.current.start(
          { facingMode: fallbackFacing },
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
      isTransitioningRef.current = false;
    }
  };

  // 1-Tap Camera Switcher (Front/Back) designed for Android & iOS
  const switchCamera = async () => {
    if (isTransitioningRef.current) return;
    
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex(c => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      const nextCam = availableCameras[nextIndex];
      setSelectedCameraId(nextCam.id);
      await stopCamera();
      setTimeout(() => startCamera(nextCam.id), 120);
      showToast(`Switched to ${nextCam.label || 'Camera'}`);
    } else {
      const nextMode = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(nextMode);
      setSelectedCameraId(null);
      await stopCamera();
      setTimeout(() => startCamera(undefined, nextMode), 120);
      showToast(`Flipped to ${nextMode === 'environment' ? 'Rear' : 'Front'} Camera`);
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

  // Switch camera tab lifecycle & page unload cleanup
  useEffect(() => {
    if (activeTab === 'camera' && !scanResult) {
      const timer = setTimeout(() => {
        startCamera(selectedCameraId || undefined);
      }, 50);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [activeTab, scanResult, selectedCameraId]);

  // Page reload / unload listener to immediately release camera hardware
  useEffect(() => {
    const handleUnload = () => {
      hardStopMediaTracks();
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      hardStopMediaTracks();
    };
  }, []);

  // Fallback scan pipeline
  const scanWithFallback = async (file: File): Promise<string> => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(readerElementId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false
      });
    }
    
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
      setError("Please upload a valid image file (PNG, JPG, WebP, GIF, SVG, BMP)");
      return;
    }

    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);
    setError(null);

    try {
      const decodedText = await scanWithFallback(file);
      handleScanSuccess(decodedText);
    } catch (err) {
      // Level 3: Backend Deep Scan
      setIsDeepScanning(true);
      setDeepScanStep('Applying AI contrast & computer vision...');
      setError(null);
      
      const stepTimer = setTimeout(() => {
        setDeepScanStep('Running neural QR model...');
      }, 1200);

      try {
        const decodedText = await scanQRImageBackend(file);
        clearTimeout(stepTimer);
        handleScanSuccess(decodedText);
      } catch (backendErr: any) {
        clearTimeout(stepTimer);
        setError(backendErr.message || "Could not detect a clear QR code. Please try a higher contrast image or adjust lighting.");
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
            handleTabChange('file');
            showToast('Pasted image from clipboard');
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [showToast]);

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

  const copyToClipboard = (text?: string, label: string = 'Copied to clipboard!') => {
    const target = text || scanResult;
    if (target) {
      navigator.clipboard.writeText(target);
      showToast(label);
    }
  };

  // 1. Generate & Download clean PNG QR code image directly from scanned result
  const downloadCleanQRImage = async () => {
    if (!scanResult) return;
    try {
      setIsGeneratingDownloadQR(true);
      showToast('Generating high-resolution QR image...');
      
      const payload = {
        data: scanResult,
        box_size: 10,
        target_size: 1024,
        dots_style: "square",
        eye_frame_shape: "Square",
        eyeball_shape: "Square",
        dots_color: "#000000",
        bg_color: "#ffffff"
      };

      const res = await fetch(`${API_BASE}/api/generator/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Could not generate QR image");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scanned_qr_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('QR Code PNG downloaded (1024px)');
    } catch (e) {
      showToast('Could not download QR image');
    } finally {
      setIsGeneratingDownloadQR(false);
    }
  };

  // Download Vector SVG from scanned result
  const downloadSvgQR = async () => {
    if (!scanResult) return;
    try {
      showToast('Generating SVG vector QR Code...');
      const payload = {
        data: scanResult,
        dots_style: "square",
        dots_color: "#000000",
        bg_color: "#ffffff"
      };

      const res = await fetch(`${API_BASE}/api/generator/generate/svg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("SVG generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scanned_qr_vector_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded SVG Vector QR Code');
    } catch (e) {
      showToast('Could not download SVG');
    }
  };

  // 2. Generate vCard download
  const downloadVCardFile = () => {
    if (!scanResult) return;
    const blob = new Blob([scanResult], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedData?.vcard?.name?.replace(/\s+/g, '_') || 'contact'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Contact card (.vcf) downloaded');
  };

  // 3. Download Decoded Plain Text (.txt)
  const downloadTextFile = () => {
    if (!scanResult) return;
    const blob = new Blob([scanResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scanned_content_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Decoded text (.txt) downloaded');
  };

  // 4. Download Decoded JSON (.json)
  const downloadJsonFile = () => {
    if (!scanResult || !parsedData) return;
    const jsonData = {
      scanned_at: new Date().toISOString(),
      type: parsedData.type,
      title: parsedData.title,
      raw_content: scanResult,
      details: parsedData
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scanned_payload_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Payload details (.json) downloaded');
  };

  // Link to QR Creator to generate styled QR from scanned content
  const getCreatorUrl = () => {
    if (!scanResult) return '/';
    return `/?text=${encodeURIComponent(scanResult)}`;
  };

  // Format type icon helper
  const getTypeBadge = (type?: ParsedQRType) => {
    switch (type) {
      case 'url':
        return { label: 'Website Link', icon: <ExternalLink size={15} />, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'wifi':
        return { label: 'WiFi Credentials', icon: <Wifi size={15} />, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      case 'vcard':
        return { label: 'Contact Card', icon: <User size={15} />, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' };
      case 'email':
        return { label: 'Email Address', icon: <Mail size={15} />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'phone':
        return { label: 'Phone Number', icon: <Phone size={15} />, color: 'bg-green-500/10 text-green-600 border-green-500/20' };
      case 'sms':
        return { label: 'SMS Message', icon: <MessageSquare size={15} />, color: 'bg-teal-500/10 text-teal-600 border-teal-500/20' };
      case 'geo':
        return { label: 'Map Location', icon: <MapPin size={15} />, color: 'bg-red-500/10 text-red-600 border-red-500/20' };
      case 'event':
        return { label: 'Calendar Event', icon: <Calendar size={15} />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
      default:
        return { label: 'Plain Text', icon: <FileText size={15} />, color: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20' };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest rounded-2xl sm:rounded-3xl border border-outline-variant/60 shadow-2xl overflow-hidden transition-all duration-300 relative">
      
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-neutral-900/95 backdrop-blur-md text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl border border-white/15 text-[11px] sm:text-xs font-semibold tracking-wide max-w-[90vw] truncate"
          >
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & 2-Mode Segmented Tabs (Upload Image | Scan with Camera) */}
      <div className="p-3.5 sm:p-5 md:p-6 border-b border-outline-variant/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-surface-container-low/40">
        
        {/* Main Segmented Mode Toggle */}
        <div className="flex bg-surface-container rounded-xl sm:rounded-2xl p-1 border border-outline-variant/60 w-full sm:w-auto shadow-inner">
          
          <button
            onClick={() => handleTabChange('file')}
            className={`relative flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm outline-none cursor-pointer select-none ${
              activeTab === 'file' ? 'text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {activeTab === 'file' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white rounded-lg sm:rounded-xl shadow-xs ring-1 ring-black/5"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <ImageIcon size={16} /> <span>Upload Image</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('camera')}
            className={`relative flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm outline-none cursor-pointer select-none ${
              activeTab === 'camera' ? 'text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {activeTab === 'camera' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white rounded-lg sm:rounded-xl shadow-xs ring-1 ring-black/5"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <Camera size={16} /> <span>Scan Camera</span>
            </span>
          </button>

        </div>

        {/* Action Controls (Sound, History) */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showToast(!soundEnabled ? 'Audio feedback enabled' : 'Audio feedback muted');
            }}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
              soundEnabled 
                ? 'bg-primary/10 text-primary border-primary/30 shadow-xs' 
                : 'bg-surface-container text-on-surface-variant border-outline-variant/60 hover:text-on-surface'
            }`}
            title={soundEnabled ? 'Mute sound on scan' : 'Enable audio chime on scan'}
            aria-label="Toggle scan sound"
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
              showHistory 
                ? 'bg-primary text-white border-primary shadow-md' 
                : 'bg-surface-container text-on-surface border-outline-variant/60 hover:bg-surface-container-high'
            }`}
            title="View scan history"
          >
            <History size={15} />
            <span>History</span>
            {scanHistory.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                showHistory ? 'bg-white/25 text-white' : 'bg-primary/15 text-primary'
              }`}>
                {scanHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-6 md:p-8">
        
        {/* Error Alert Box */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-4 sm:mb-6 p-3.5 sm:p-4 bg-error-container text-on-error-container rounded-2xl flex items-start gap-2.5 sm:gap-3 border border-error/20 shadow-xs"
          >
            <AlertCircle className="shrink-0 mt-0.5 text-error" size={18} />
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              <p className="font-bold mb-0.5">Scan Notice</p>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* SCANNER MODES (CAMERA & FILE UPLOAD)               */}
        {/* ═══════════════════════════════════════════════════ */}
        {!scanResult && (
          <div className="flex flex-col items-center">

            {/* --- Camera Scanner View (Permanently anchored DOM container to prevent stream leaks) --- */}
            <div className={`w-full flex-col items-center ${activeTab === 'camera' ? 'flex' : 'hidden'}`}>
              
              {/* Camera Viewfinder Box */}
              <div 
                className="w-full max-w-[420px] aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-950 shadow-2xl relative border-2 border-primary/30 flex items-center justify-center group"
              >
                {/* Dedicated stable element for Html5Qrcode */}
                <div id={readerElementId} className="w-full h-full object-cover"></div>
                
                {/* Viewfinder Idle / Permission / Error Overlay */}
                {!isScanning && (
                  <div className="absolute inset-0 bg-surface-container-lowest/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center z-20">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4 border border-primary/20 shadow-inner">
                      <Camera size={28} />
                    </div>
                    
                    <h4 className="text-sm sm:text-base font-bold text-on-surface mb-1">
                      {error ? 'Camera Access Required' : 'Live Camera Scanner'}
                    </h4>
                    
                    <p className="text-[11px] sm:text-xs text-on-surface-variant max-w-[260px] leading-relaxed mb-4 sm:mb-5">
                      {error 
                        ? 'Camera was blocked or unavailable. Check browser permissions or switch to file upload.' 
                        : 'Scan any QR code instantly in real-time using your phone or laptop camera.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full max-w-[280px]">
                      <button
                        onClick={() => startCamera(selectedCameraId || undefined)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 px-4 rounded-xl font-bold hover:bg-primary/90 text-xs shadow-md transition-all cursor-pointer btn-spring"
                      >
                        <RefreshCw size={13} />
                        <span>{error ? 'Retry Camera' : 'Start Camera'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleTabChange('file')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-container text-on-surface py-2.5 px-4 rounded-xl font-bold text-xs border border-outline-variant/60 transition-colors cursor-pointer"
                      >
                        <ImageIcon size={13} />
                        <span>Upload File</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Scanning Targeting Overlay */}
                {isScanning && (
                  <>
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 sm:p-8 z-10">
                      <div className="w-44 h-44 sm:w-56 sm:h-56 relative rounded-2xl border border-white/20">
                        {/* 4 Precision Corner Markers */}
                        <span className="absolute -top-1 -left-1 w-6 h-6 sm:w-7 sm:h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
                        <span className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
                        <span className="absolute -bottom-1 -left-1 w-6 h-6 sm:w-7 sm:h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
                        
                        {/* Animated Laser Scanning Beam */}
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#34d399] animate-pulse absolute top-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>

                    {/* Camera Controls Floating Bar */}
                    <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center gap-2.5 px-3 sm:px-4 pointer-events-auto z-10">
                      {/* 1. Flashlight / Torch Toggle */}
                      {hasTorch && (
                        <button
                          onClick={toggleTorch}
                          className={`p-2.5 sm:p-3 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                            torchOn 
                              ? 'bg-amber-400 text-neutral-950 scale-110 shadow-amber-400/30' 
                              : 'bg-black/60 text-white hover:bg-black/80 hover:scale-105 active:scale-95'
                          }`}
                          title={torchOn ? "Turn flashlight off" : "Turn flashlight on"}
                          aria-label="Toggle flashlight"
                        >
                          {torchOn ? <Zap size={16} /> : <ZapOff size={16} />}
                        </button>
                      )}

                      {/* 2. Instant 1-Tap Camera Flip / Switch Button (Only shown when device has 2+ cameras) */}
                      {availableCameras.length > 1 && (
                        <button
                          onClick={switchCamera}
                          className="p-2.5 sm:p-3 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer bg-black/60 text-white hover:bg-black/80 hover:scale-105 active:scale-95 flex items-center justify-center border border-white/10"
                          title="Switch Camera (Front / Back)"
                          aria-label="Switch camera"
                        >
                          <SwitchCamera size={16} />
                        </button>
                      )}

                      {/* 3. Multi-Lens Camera Dropdown (Only shown if 3+ lenses exist) */}
                      {availableCameras.length > 2 && (
                        <select
                          value={selectedCameraId || ''}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedCameraId(id);
                            stopCamera();
                            setTimeout(() => startCamera(id), 150);
                          }}
                          className="bg-black/75 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 outline-none cursor-pointer max-w-[150px] sm:max-w-[180px] truncate shadow-lg"
                          aria-label="Select camera lens"
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

              <p className="mt-4 sm:mt-5 text-center text-xs font-medium text-on-surface-variant max-w-sm flex items-center justify-center gap-1.5 px-2">
                <ScanLine size={15} className="text-primary shrink-0" />
                <span>Point your camera viewfinder directly at any QR code.</span>
              </p>
            </div>

            {/* --- File Upload / Drag-and-Drop View --- */}
            <div className={`w-full flex-col items-center ${activeTab === 'file' ? 'flex' : 'hidden'}`}>
              
              {/* Uploaded Preview (if deep scanning in progress) */}
              {uploadedImagePreview && isDeepScanning && (
                <div className="w-full max-w-[280px] mb-4 sm:mb-6 rounded-2xl overflow-hidden border border-outline-variant shadow-lg relative bg-surface-container-highest">
                  <img 
                    src={uploadedImagePreview} 
                    alt="Uploaded preview" 
                    className="w-full h-auto object-contain opacity-50" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 text-white text-center backdrop-blur-xs">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin mb-2 sm:mb-3" />
                    <p className="text-xs font-bold uppercase tracking-wider text-white">Deep Scanning...</p>
                    <p className="text-[11px] text-white/80 mt-1 font-medium">{deepScanStep}</p>
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
                className={`w-full max-w-[420px] aspect-square rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer p-4 sm:p-6 text-center select-none relative overflow-hidden group ${
                  isDragging 
                    ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl' 
                    : 'border-outline-variant/80 hover:border-primary bg-surface-container/40 hover:bg-surface-container/70 shadow-xs'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-primary/20">
                  <ImageIcon size={30} className="sm:w-9 sm:h-9" />
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-black text-on-surface mb-1">
                  {isDragging ? 'Drop QR image here' : 'Tap or Drag QR image here'}
                </h3>
                
                <p className="text-[11px] sm:text-xs text-on-surface-variant max-w-[240px] sm:max-w-[260px] leading-relaxed mb-3 sm:mb-4">
                  Supports PNG, JPG, WebP, SVG, and screenshot files.
                </p>

                {/* Format chips */}
                <div className="flex flex-wrap items-center justify-center gap-1 max-w-[280px]">
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-outline-variant/60 text-[10px] font-bold text-on-surface-variant">PNG</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-outline-variant/60 text-[10px] font-bold text-on-surface-variant">JPG</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-outline-variant/60 text-[10px] font-bold text-on-surface-variant">WebP</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-outline-variant/60 text-[10px] font-bold text-on-surface-variant">SVG</span>
                </div>

                {/* Ctrl+V helper badge */}
                <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/60 text-[10px] sm:text-[11px] font-semibold text-on-surface-variant">
                  <Sparkles size={11} className="text-primary" />
                  <span>Tip: Press <kbd className="font-mono font-bold text-on-surface bg-surface px-1 py-0.5 rounded border border-outline-variant">Ctrl+V</kbd> to paste</span>
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

              <p className="mt-4 sm:mt-5 text-center text-xs font-medium text-on-surface-variant px-2">
                Upload a saved image or screenshot to decode full contents.
              </p>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* SCAN RESULT VIEW (RICH SMART ACTIONS & EXPORT HUB)  */}
        {/* ═══════════════════════════════════════════════════ */}
        {scanResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Header Badge with Celebration Glow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5 shadow-xs">
              <Check size={14} className="stroke-[3]" />
              <span>Decoded Successfully</span>
            </div>

            {/* Smart Parsed Content Display Card */}
            <div className="w-full bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-outline-variant/70 shadow-xs relative overflow-hidden">
              
              {/* Type Badge */}
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-outline-variant/40">
                {(() => {
                  const badge = getTypeBadge(parsedData?.type);
                  return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}

                {parsedData?.type === 'url' && parsedData.isHttps && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck size={12} /> Secure HTTPS
                  </span>
                )}
              </div>

              {/* Type 1: URL / Website */}
              {parsedData?.type === 'url' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <h4 className="font-black text-on-surface text-base sm:text-lg break-all">{parsedData.domain || 'Website'}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">Click Open Website below or copy URL.</p>
                  </div>

                  <div className="p-3 bg-surface rounded-xl border border-outline-variant/60 break-all font-mono text-xs sm:text-sm text-on-surface select-all shadow-inner">
                    {scanResult}
                  </div>
                </div>
              )}

              {/* Type 2: WiFi Network */}
              {parsedData?.type === 'wifi' && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Network Name (SSID)</p>
                    <h4 className="text-lg sm:text-xl font-black text-on-surface mt-0.5 break-all">{parsedData.wifi?.ssid}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/50">
                      <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase">Security Mode</p>
                      <p className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">{parsedData.wifi?.authType || 'WPA/WPA2'}</p>
                    </div>

                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/50 relative">
                      <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase">Network Password</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs sm:text-sm font-mono font-bold text-on-surface break-all pr-2">
                          {parsedData.wifi?.password ? (showPassword ? parsedData.wifi.password : '••••••••••••') : 'Open (No Password)'}
                        </p>
                        {parsedData.wifi?.password && (
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors cursor-pointer shrink-0"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Type 3: Contact Card (vCard) */}
              {parsedData?.type === 'vcard' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-on-surface">{parsedData.vcard?.name || 'Contact Info'}</h4>

                  <div className="space-y-2 bg-surface p-3.5 sm:p-4 rounded-xl border border-outline-variant/50 text-xs sm:text-sm">
                    {parsedData.vcard?.phone && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <Phone size={14} className="text-on-surface-variant shrink-0" />
                        <span className="font-semibold">{parsedData.vcard.phone}</span>
                      </div>
                    )}
                    {parsedData.vcard?.email && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <Mail size={14} className="text-on-surface-variant shrink-0" />
                        <span className="font-semibold break-all">{parsedData.vcard.email}</span>
                      </div>
                    )}
                    {parsedData.vcard?.org && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase shrink-0">Org:</span>
                        <span className="truncate">{parsedData.vcard.org} {parsedData.vcard.title ? `(${parsedData.vcard.title})` : ''}</span>
                      </div>
                    )}
                    {parsedData.vcard?.address && (
                      <div className="flex items-center gap-2 text-on-surface">
                        <MapPin size={14} className="text-on-surface-variant shrink-0" />
                        <span className="truncate">{parsedData.vcard.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Type 4: Email */}
              {parsedData?.type === 'email' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Recipient</p>
                    <h4 className="text-base sm:text-lg font-black text-on-surface break-all">{parsedData.email?.to}</h4>
                  </div>

                  {(parsedData.email?.subject || parsedData.email?.body) && (
                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/40 text-xs sm:text-sm space-y-1">
                      {parsedData.email.subject && <p className="font-bold">Subject: {parsedData.email.subject}</p>}
                      {parsedData.email.body && <p className="text-on-surface-variant break-words">{parsedData.email.body}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Type 5: Phone Call */}
              {parsedData?.type === 'phone' && (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center font-bold shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telephone Number</p>
                    <h4 className="text-lg sm:text-xl font-mono font-black text-on-surface truncate">{parsedData.phone?.number}</h4>
                  </div>
                </div>
              )}

              {/* Type 6: SMS */}
              {parsedData?.type === 'sms' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Send SMS To</p>
                    <h4 className="text-base sm:text-lg font-black text-on-surface">{parsedData.sms?.number}</h4>
                  </div>
                  {parsedData.sms?.message && (
                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/40 text-xs sm:text-sm text-on-surface break-words">
                      {parsedData.sms.message}
                    </div>
                  )}
                </div>
              )}

              {/* Type 7: Location / Map */}
              {parsedData?.type === 'geo' && (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Geographic Coordinates</p>
                    <h4 className="text-sm sm:text-base font-mono font-bold text-on-surface truncate">{parsedData.geo?.lat}, {parsedData.geo?.lng}</h4>
                  </div>
                </div>
              )}

              {/* Type 8: Calendar Event */}
              {parsedData?.type === 'event' && (
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-black text-on-surface">{parsedData.event?.summary}</h4>
                  {parsedData.event?.location && (
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 truncate">
                      <MapPin size={13} /> {parsedData.event.location}
                    </p>
                  )}
                  {parsedData.event?.description && (
                    <p className="text-xs text-on-surface mt-2 bg-surface p-3 rounded-xl border border-outline-variant/40 break-words">
                      {parsedData.event.description}
                    </p>
                  )}
                </div>
              )}

              {/* Type 9: Plain Text / Other */}
              {parsedData?.type === 'text' && (
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Decoded Content</p>
                  <div className="p-3 sm:p-4 bg-surface rounded-xl border border-outline-variant/60 text-xs sm:text-sm font-mono text-on-surface whitespace-pre-wrap break-all max-h-52 overflow-y-auto shadow-inner">
                    {scanResult}
                  </div>
                </div>
              )}

            </div>

            {/* Smart Context Primary Action Buttons Row (Responsive 1/2 col grid on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-6 w-full">
              
              {/* Context Action 1: Open URL */}
              {parsedData?.type === 'url' && (
                <a
                  href={parsedData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <ExternalLink size={16} />
                  <span>Open Website</span>
                </a>
              )}

              {/* Context Action 2: Copy WiFi Password */}
              {parsedData?.type === 'wifi' && parsedData.wifi?.password && (
                <button
                  onClick={() => copyToClipboard(parsedData.wifi?.password, 'WiFi password copied!')}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all cursor-pointer btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Copy size={16} />
                  <span>Copy Password</span>
                </button>
              )}

              {/* Context Action 3: Save vCard */}
              {parsedData?.type === 'vcard' && (
                <button
                  onClick={downloadVCardFile}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all cursor-pointer btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Download size={16} />
                  <span>Save Contact (.vcf)</span>
                </button>
              )}

              {/* Context Action 4: Compose Email */}
              {parsedData?.type === 'email' && (
                <a
                  href={`mailto:${parsedData.email?.to}${parsedData.email?.subject ? `?subject=${encodeURIComponent(parsedData.email.subject)}` : ''}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Mail size={16} />
                  <span>Compose Email</span>
                </a>
              )}

              {/* Context Action 5: Call Phone */}
              {parsedData?.type === 'phone' && (
                <a
                  href={`tel:${parsedData.phone?.number}`}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-700 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Phone size={16} />
                  <span>Call Number</span>
                </a>
              )}

              {/* Context Action 6: Open Maps */}
              {parsedData?.type === 'geo' && (
                <a
                  href={parsedData.geo?.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <MapPin size={16} />
                  <span>Open in Maps</span>
                </a>
              )}

              {/* Universal Action: Copy Raw Text */}
              <button
                onClick={() => copyToClipboard()}
                className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold border border-outline-variant/60 transition-all cursor-pointer text-xs sm:text-sm min-h-[44px]"
              >
                <Copy size={16} />
                <span>Copy Raw Text</span>
              </button>

              {/* Universal Action: Scan Another */}
              <button
                onClick={resetScanner}
                className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold border border-outline-variant/60 transition-all cursor-pointer text-xs sm:text-sm min-h-[44px]"
              >
                <RefreshCw size={16} />
                <span>Scan Another</span>
              </button>
            </div>

            {/* ╔══════════════════════════════════════════╗ */}
            {/* ║  DEDICATED DOWNLOAD & EXPORT HUB          ║ */}
            {/* ╚══════════════════════════════════════════╝ */}
            <div className="w-full mt-5 sm:mt-6 bg-surface-container-lowest rounded-2xl p-3.5 sm:p-5 border border-outline-variant/60 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/30">
                <span className="text-[11px] sm:text-xs font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                  <Download size={14} className="text-emerald-600" />
                  <span>Download & Export Hub</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium">1-Click Downloads</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Download Option 1: Clean QR PNG */}
                <button
                  onClick={downloadCleanQRImage}
                  disabled={isGeneratingDownloadQR}
                  className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    {isGeneratingDownloadQR ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface">QR Image</span>
                  <span className="text-[9px] sm:text-[10px] text-on-surface-variant">PNG 1024px</span>
                </button>

                {/* Download Option 2: Plain Text */}
                <button
                  onClick={downloadTextFile}
                  className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <FileText size={14} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface">Raw Text</span>
                  <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.TXT File</span>
                </button>

                {/* Download Option 3: Structured JSON */}
                <button
                  onClick={downloadJsonFile}
                  className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <FileCode size={14} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface">Metadata</span>
                  <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.JSON Object</span>
                </button>

                {/* Download Option 4: vCard / Contact Card */}
                {parsedData?.type === 'vcard' ? (
                  <button
                    onClick={downloadVCardFile}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <User size={14} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-on-surface">vCard File</span>
                    <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.VCF Contact</span>
                  </button>
                ) : (
                  <button
                    onClick={downloadSvgQR}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <FileDown size={14} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-on-surface">Vector SVG</span>
                    <span className="text-[9px] sm:text-[10px] text-on-surface-variant">Infinite Scale</span>
                  </button>
                )}

              </div>
            </div>

            {/* Bottom Bridge Action: Customize in Generator */}
            <div className="w-full mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-outline-variant/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
              <span className="text-xs font-semibold text-on-surface-variant">Want custom frames, gradient colors, or company logos?</span>
              <a
                href={getCreatorUrl()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0 py-1"
              >
                <QrCode size={14} />
                <span>Open in QR Studio</span>
                <ArrowRight size={13} />
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
            className="border-t border-outline-variant/60 bg-surface-container/70 p-4 sm:p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h4 className="font-bold text-on-surface text-xs sm:text-sm flex items-center gap-1.5">
                <History size={15} className="text-primary" />
                <span>Recent Scan History</span>
              </h4>
              {scanHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs font-bold text-error hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <Trash2 size={12} />
                  <span>Clear All</span>
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
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-surface rounded-xl border border-outline-variant/50 hover:border-primary/50 transition-colors text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-on-surface truncate">{item.title}</p>
                      <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-mono truncate">{item.raw}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => copyToClipboard(item.raw, 'Item copied from history')}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title="Copy"
                        aria-label="Copy item"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title="Delete"
                        aria-label="Delete item"
                      >
                        <Trash2 size={13} />
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
