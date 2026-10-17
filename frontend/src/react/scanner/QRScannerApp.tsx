import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { 
  Camera, 
  Lock,
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
  Download,
  QrCode,
  Calendar,
  FileText,
  CheckCircle2,
  ScanLine,
  FileCode,
  FileDown,
  SwitchCamera,
  XCircle,
  AlertTriangle,
  UploadCloud,
  Clipboard,
  Globe
} from 'lucide-react';
import { scanQRImageBackend, API_BASE } from '../../services/qrApi';

import {
  type ParsedQRType,
  type URLSafetyReport,
  evaluateURLSafety,
  type ParsedQRData,
  type ScanHistoryItem,
  parseQRContent,
  getCreatorUrl,
  svgFileToPngFile,
  playScanSound
} from './scannerUtils';

export {
  type ParsedQRType,
  type URLSafetyReport,
  evaluateURLSafety,
  type ParsedQRData,
  type ScanHistoryItem,
  parseQRContent,
  getCreatorUrl,
  svgFileToPngFile,
  playScanSound
};


import { TranslationProvider, useTranslation } from '../../i18n/useTranslation';

const STORAGE_KEY = 'genqr_scan_history_v1';
const TAB_PREF_KEY = 'genqr_scanner_tab';

function QRScannerAppContent() {
  const { t, locale } = useTranslation();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedQRData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'file' | 'camera'>('file');
  const [cameraRequested, setCameraRequested] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [deepScanStep, setDeepScanStep] = useState<string>('Analyzing image...');
  const [isGeneratingDownloadQR, setIsGeneratingDownloadQR] = useState(false);

  // Extra UX features
  const [isDragging, setIsDragging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Camera advanced features
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [permissionBrowserTab, setPermissionBrowserTab] = useState<'chrome' | 'safari' | 'android' | 'firefox'>('chrome');

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
      // 0. Auto-detect browser for camera permission guidance
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('iphone') || ua.includes('ipad') || (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android'))) {
          setPermissionBrowserTab('safari');
        } else if (ua.includes('android')) {
          setPermissionBrowserTab('android');
        } else if (ua.includes('firefox')) {
          setPermissionBrowserTab('firefox');
        } else {
          setPermissionBrowserTab('chrome');
        }
      }

      // 1. Check URL query or hash first (e.g. ?tab=camera or #camera)
      const urlParams = new URLSearchParams(window.location.search);
      const queryTab = urlParams.get('tab');
      const hash = window.location.hash.replace('#', '');
      
      if (queryTab === 'camera' || hash === 'camera') {
        setActiveTab('camera');
      }

      // 2. Load scan history
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Initial hydration load warning:', e);
    }
  }, []);

  // Sync tab changes with sessionStorage & reset scan result
  const handleTabChange = (newTab: 'file' | 'camera') => {
    setError(null);
    setScanResult(null);
    setParsedData(null);
    setShowPassword(false);
    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
      setUploadedImagePreview(null);
    }
    if (newTab === 'camera') {
      setCameraRequested(true);
    } else {
      setCameraRequested(false);
      stopCamera();
    }
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
      showToast(t('scanner.toasts.scanHistoryCleared'));
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
    playScanSound();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(80); } catch (e) {}
    }
    showToast(t('scanner.toasts.qrDecodedSuccess'));
  }, [saveToHistory, showToast, t]);

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
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.AZTEC,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39
          ],
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
        setError("scanner.cameraPermissionDenied");
      } else if (err?.name === "NotFoundError" || errMsg.includes("device not found") || errMsg.includes("Requested device not found")) {
        setError("scanner.cameraNotFound");
      } else if (typeof location !== 'undefined' && location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setError("scanner.cameraHttpsRequired");
      } else {
        setError("scanner.cameraUnavailable");
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
      showToast(t('scanner.toasts.switchedCamera'));
    } else {
      const nextMode = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(nextMode);
      setSelectedCameraId(null);
      await stopCamera();
      setTimeout(() => startCamera(undefined, nextMode), 120);
      showToast(t('scanner.toasts.flippedCamera'));
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
    if (activeTab === 'camera' && cameraRequested && !scanResult) {
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
  }, [activeTab, cameraRequested, scanResult, selectedCameraId]);

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
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.AZTEC,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39
        ],
        verbose: false
      });
    }
    
    // Level 1: Standard client scan
    try {
      return await scannerRef.current.scanFile(file, false);
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
            const decodedText = await scannerRef.current!.scanFile(invertedFile, false);
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
        const fileToProcess = await svgFileToPngFile(file);
        const decodedText = await scanQRImageBackend(fileToProcess);
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

  // 1-Click Clipboard Image Reader (with Async Clipboard API)
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find(t => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], "clipboard_pasted.png", { type: imageType });
            processImageFile(file);
            showToast(t('scanner.toasts.pastedClipboard'));
            return;
          }
        }
      }
      showToast(t('scanner.toasts.ctrlVTip'));
    } catch (e) {
      showToast(t('scanner.toasts.ctrlVTip'));
    }
  };

  // 1-Click Instant Demo Sample QR Loader
  const loadSampleQR = (type: 'url' | 'whatsapp' | 'wifi' | 'vcard') => {
    let sample = '';
    if (type === 'url') sample = 'https://generatecustomqr.com';
    else if (type === 'whatsapp') sample = 'https://wa.me/15551234567?text=Hello%20from%20GenerateCustomQR!';
    else if (type === 'wifi') sample = 'WIFI:S:GenerateCustomQR_Guest;T:WPA;P:SuperSecretPass2026;H:false;;';
    else if (type === 'vcard') sample = 'BEGIN:VCARD\nVERSION:3.0\nFN:Alex Morgan\nTEL:+1-555-0199\nEMAIL:alex.morgan@example.com\nORG:Creative Tech Studio\nTITLE:Lead Designer\nURL:https://generatecustomqr.com\nEND:VCARD';
    
    handleScanSuccess(sample);
    showToast(t('scanner.toasts.loadedSample'));
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
            showToast(t('scanner.toasts.pastedClipboard'));
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [showToast, t]);

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

  const copyToClipboard = (text?: string, label?: string) => {
    const target = text || scanResult;
    if (target) {
      navigator.clipboard.writeText(target);
      showToast(label || t('studio.buttons.copied'));
    }
  };

  // 1. Generate & Download clean PNG QR code image directly from scanned result
  const downloadCleanQRImage = async () => {
    if (!scanResult) return;
    try {
      setIsGeneratingDownloadQR(true);
      showToast(t('scanner.toasts.generatingPng'));
      
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

      const timeoutSignal = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
        ? AbortSignal.timeout(15000)
        : undefined;

      const res = await fetch(`${API_BASE}/api/generator/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: timeoutSignal
      });

      if (!res.ok) throw new Error("Could not generate QR image");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scanned_qr_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t('scanner.toasts.pngDownloaded'));
    } catch (e) {
      showToast(t('scanner.toasts.pngDownloadFailed'));
    } finally {
      setIsGeneratingDownloadQR(false);
    }
  };

  // Download Vector SVG from scanned result
  const downloadSvgQR = async () => {
    if (!scanResult) return;
    try {
      showToast(t('scanner.toasts.generatingSvg'));
      const payload = {
        data: scanResult,
        dots_style: "square",
        dots_color: "#000000",
        bg_color: "#ffffff"
      };

      const timeoutSignal = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
        ? AbortSignal.timeout(15000)
        : undefined;

      const res = await fetch(`${API_BASE}/api/generator/generate/svg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: timeoutSignal
      });

      if (!res.ok) throw new Error("SVG generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scanned_qr_vector_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t('scanner.toasts.svgDownloaded'));
    } catch (e) {
      showToast(t('scanner.toasts.svgDownloadFailed'));
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
    showToast(t('scanner.toasts.vcfDownloaded'));
  };

  // 2b. Generate Calendar Event (.ics) download
  const downloadIcsFile = () => {
    if (!scanResult) return;
    const blob = new Blob([scanResult], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedData?.event?.summary?.replace(/\s+/g, '_') || 'event'}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('scanner.toasts.icsDownloaded'));
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
    showToast(t('scanner.toasts.txtDownloaded'));
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
    showToast(t('scanner.toasts.jsonDownloaded'));
  };

  // Link to QR Creator to generate styled QR from scanned content
  const getStudioUrl = () => {
    return getCreatorUrl(scanResult, locale);
  };

  // Format type icon helper
  const getTypeBadge = (type?: ParsedQRType) => {
    switch (type) {
      case 'url':
        return { label: t('scanner.badges.websiteLink'), icon: <ExternalLink size={15} />, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'whatsapp':
        return { label: t('scanner.badges.whatsappChat'), icon: <MessageSquare size={15} />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'wifi':
        return { label: t('scanner.badges.wifiCredentials'), icon: <Wifi size={15} />, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      case 'vcard':
        return { label: t('scanner.badges.contactCard'), icon: <User size={15} />, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' };
      case 'email':
        return { label: t('scanner.badges.emailAddress'), icon: <Mail size={15} />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'phone':
        return { label: t('scanner.badges.phoneNumber'), icon: <Phone size={15} />, color: 'bg-green-500/10 text-green-600 border-green-500/20' };
      case 'sms':
        return { label: t('scanner.badges.smsMessage'), icon: <MessageSquare size={15} />, color: 'bg-teal-500/10 text-teal-600 border-teal-500/20' };
      case 'geo':
        return { label: t('scanner.badges.mapLocation'), icon: <MapPin size={15} />, color: 'bg-red-500/10 text-red-600 border-red-500/20' };
      case 'event':
        return { label: t('scanner.badges.calendarEvent'), icon: <Calendar size={15} />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
      default:
        return { label: t('scanner.badges.plainText'), icon: <FileText size={15} />, color: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20' };
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl sm:rounded-4xl border border-zinc-200/80 shadow-xl shadow-zinc-200/50 overflow-hidden transition-all duration-300 relative">
        
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
      <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-zinc-100 flex items-center justify-between gap-2 sm:gap-3 bg-white">
        
        {/* Main Segmented Mode Toggle */}
        <div className="flex bg-zinc-100/90 rounded-2xl p-1 border border-zinc-200/50 shadow-2xs">
          
          <button
            onClick={() => handleTabChange('file')}
            className={`relative px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl font-bold transition-all text-xs sm:text-sm outline-none cursor-pointer select-none ${
              activeTab === 'file' ? 'text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {activeTab === 'file' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white rounded-xl shadow-xs border border-zinc-200/60"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <ImageIcon size={16} /> <span>{t("scanner.uploadTab")}</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('camera')}
            className={`relative px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl font-semibold transition-all text-xs sm:text-sm outline-none cursor-pointer select-none ${
              activeTab === 'camera' ? 'text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {activeTab === 'camera' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white rounded-xl shadow-xs border border-zinc-200/60"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <Camera size={16} /> <span>{t("scanner.cameraTab")}</span>
            </span>
          </button>

        </div>

        {/* Action Controls (History Drawer Toggle) */}
        <div className="flex items-center justify-end shrink-0">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              showHistory 
                ? 'bg-primary text-white border-primary shadow-md' 
                : 'bg-zinc-100/90 text-zinc-700 border-zinc-200/50 hover:bg-zinc-200/70'
            }`}
            title={t("scanner.historyTab")}
          >
            <History size={15} />
            <span className="hidden sm:inline">{t("scanner.historyTab")}</span>
            {scanHistory.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                showHistory ? 'bg-white/25 text-white' : 'bg-zinc-200/90 text-zinc-700'
              }`}>
                {scanHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-3.5 sm:p-6 md:p-8">
        
        {/* Error Alert Box (Only shown for general non-camera errors) */}
        {error && (!uploadedImagePreview && activeTab !== 'camera') && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-4 sm:mb-6 p-3.5 sm:p-4 bg-amber-500/10 text-amber-900 rounded-2xl flex items-start gap-2.5 sm:gap-3 border border-amber-500/25 shadow-xs"
          >
            <AlertCircle className="shrink-0 mt-0.5 text-amber-600" size={18} />
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              <p className="font-bold mb-0.5">{t("scanner.scanNotice")}</p>
              <p>{error.startsWith("scanner.") ? t(error) : error}</p>
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
                className="w-full max-w-[420px] aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-950 shadow-2xl relative ring-2 ring-primary/30 flex items-center justify-center group"
              >
                {/* Dedicated stable element for Html5Qrcode */}
                <div id={readerElementId} className="w-full h-full object-cover"></div>
                
                {/* Viewfinder Idle / Permission / Error Overlay */}
                {!isScanning && (
                  <div className="absolute inset-0 bg-surface-container-lowest/98 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-5 text-center z-20 overflow-y-auto">
                    
                    {error ? (
                      /* Permission Blocked Guidance Mode */
                      <div className="w-full max-w-[340px] flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2.5 border border-amber-500/20 shadow-inner">
                          <Lock size={22} />
                        </div>
                        
                        <h4 className="text-sm sm:text-base font-black text-on-surface mb-0.5">
                          {t("scanner.permBlockedTitle")}
                        </h4>
                        
                        <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">
                          {t("scanner.permBlockedSubtitle")}
                        </p>

                        {/* Interactive Browser Selector Tabs */}
                        <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/60 mb-3 w-full justify-center gap-1">
                          <button
                            onClick={() => setPermissionBrowserTab('chrome')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              permissionBrowserTab === 'chrome' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                          >
                            Chrome / Edge
                          </button>
                          <button
                            onClick={() => setPermissionBrowserTab('safari')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              permissionBrowserTab === 'safari' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                          >
                            Safari (iOS)
                          </button>
                          <button
                            onClick={() => setPermissionBrowserTab('android')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              permissionBrowserTab === 'android' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                          >
                            Android
                          </button>
                        </div>

                        {/* Step-by-Step Instructions Card */}
                        <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 text-left text-[11px] text-zinc-700 space-y-1.5 mb-3 shadow-2xs">
                          {permissionBrowserTab === 'chrome' && (
                            <>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">1</span>
                                <span>{t("scanner.permChromeStep1")}</span>
                              </p>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">2</span>
                                <span>{t("scanner.permChromeStep2")}</span>
                              </p>
                            </>
                          )}

                          {permissionBrowserTab === 'safari' && (
                            <>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">1</span>
                                <span>{t("scanner.permSafariStep1")}</span>
                              </p>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">2</span>
                                <span>{t("scanner.permSafariStep2")}</span>
                              </p>
                            </>
                          )}

                          {permissionBrowserTab === 'android' && (
                            <>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">1</span>
                                <span>{t("scanner.permAndroidStep1")}</span>
                              </p>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">2</span>
                                <span>{t("scanner.permAndroidStep2")}</span>
                              </p>
                            </>
                          )}

                          {permissionBrowserTab === 'firefox' && (
                            <>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">1</span>
                                <span>{t("scanner.permFirefoxStep1")}</span>
                              </p>
                              <p className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">2</span>
                                <span>{t("scanner.permFirefoxStep2")}</span>
                              </p>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <button
                            onClick={() => window.location.reload()}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-black text-white py-2 px-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer min-h-[38px]"
                          >
                            <RefreshCw size={13} />
                            <span>{t("scanner.reloadAndEnable")}</span>
                          </button>
                          
                          <button
                            onClick={() => handleTabChange('file')}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 text-zinc-800 py-2 px-3 rounded-xl font-bold text-xs border border-zinc-300 transition-colors cursor-pointer min-h-[38px]"
                          >
                            <ImageIcon size={13} />
                            <span>{t("scanner.uploadFile")}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Clean Idle Mode */
                      <div className="w-full max-w-[280px] flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 border border-primary/20 shadow-inner">
                          <Camera size={28} />
                        </div>
                        
                        <h4 className="text-base font-bold text-on-surface mb-1">
                          {t("scanner.liveCameraScanner")}
                        </h4>
                        
                        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                          {t("scanner.cameraScanDesc")}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <button
                            onClick={() => {
                              setCameraRequested(true);
                              startCamera(selectedCameraId || undefined);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 px-4 rounded-xl font-bold hover:bg-primary/90 text-xs shadow-md transition-all cursor-pointer btn-spring"
                          >
                            <RefreshCw size={13} />
                            <span>{t("scanner.startCamera")}</span>
                          </button>
                          
                          <button
                            onClick={() => handleTabChange('file')}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-container text-on-surface py-2.5 px-4 rounded-xl font-bold text-xs border border-outline-variant/60 transition-colors cursor-pointer"
                          >
                            <ImageIcon size={13} />
                            <span>{t("scanner.uploadFile")}</span>
                          </button>
                        </div>
                      </div>
                    )}

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
                          title={torchOn ? t('scanner.aria.flashlightOff') : t('scanner.aria.flashlightOn')}
                          aria-label={t('scanner.aria.toggleFlashlight')}
                        >
                          {torchOn ? <Zap size={16} /> : <ZapOff size={16} />}
                        </button>
                      )}

                      {/* 2. Instant 1-Tap Camera Flip / Switch Button */}
                      {availableCameras.length > 1 && (
                        <button
                          onClick={switchCamera}
                          className="p-2.5 sm:p-3 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer bg-black/60 text-white hover:bg-black/80 hover:scale-105 active:scale-95 flex items-center justify-center border border-white/10"
                          title={t('scanner.aria.switchCameraAria')}
                          aria-label={t('scanner.aria.switchCameraAria')}
                        >
                          <SwitchCamera size={16} />
                        </button>
                      )}

                      {/* 3. Multi-Lens Camera Dropdown */}
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
                          aria-label={t('scanner.aria.selectLensAria')}
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
                <span>{t("scanner.cameraHint")}</span>
              </p>
            </div>

            {/* --- File Upload / Drag-and-Drop View --- */}
            <div className={`w-full flex-col items-center ${activeTab === 'file' ? 'flex' : 'hidden'}`}>
              
              {/* STATE 1: Deep scanning in progress */}
              {uploadedImagePreview && isDeepScanning && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-[420px] aspect-square rounded-2xl sm:rounded-3xl border border-outline-variant shadow-xl relative bg-surface-container p-6 flex flex-col items-center justify-center text-center overflow-hidden"
                >
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden relative mb-4 border border-outline-variant/60 bg-neutral-950 flex items-center justify-center shadow-inner">
                    <img 
                      src={uploadedImagePreview} 
                      alt="Uploaded QR preview" 
                      className="w-full h-full object-contain opacity-50" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 text-white backdrop-blur-xs">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    </div>
                    {/* Animated Scanning Beam */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_var(--color-primary)] animate-pulse absolute top-1/2 -translate-y-1/2"></div>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-on-surface uppercase tracking-wider">{t("scanner.aiDeepScan")}...</h4>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-[280px] font-medium">{deepScanStep}</p>
                </motion.div>
              )}

              {/* STATE 2: Upload Failed / Invalid QR Code Card */}
              {uploadedImagePreview && !isDeepScanning && error && !scanResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full max-w-[420px] bg-surface-container rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-error/30 shadow-lg flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Thumbnail preview with failure badge */}
                  <div className="relative mb-3.5">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-error/40 shadow-inner bg-surface flex items-center justify-center">
                      <img 
                        src={uploadedImagePreview} 
                        alt="Uploaded attempt" 
                        className="w-full h-full object-contain p-1 opacity-75" 
                      />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 bg-error text-white p-1 rounded-full shadow-md">
                      <XCircle size={18} />
                    </div>
                  </div>

                  {/* Failure Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold mb-2">
                    <AlertTriangle size={13} className="text-error" />
                    <span>{t("scanner.noQrFound")}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-on-surface mb-1">
                    {t("scanner.couldNotRead")}
                  </h3>

                  <p className="text-xs text-on-surface-variant max-w-[280px] leading-relaxed mb-5">
                    {t("scanner.couldNotReadDesc")}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-primary/90 text-xs shadow-md transition-all cursor-pointer btn-spring min-h-[44px]"
                    >
                      <UploadCloud size={16} />
                      <span>{t("scanner.tryAnotherImage")}</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('camera')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-container text-on-surface py-3 px-4 rounded-xl font-bold text-xs border border-outline-variant/60 transition-colors cursor-pointer min-h-[44px]"
                    >
                      <Camera size={16} />
                      <span>{t("scanner.scanWithCamera")}</span>
                    </button>
                  </div>

                  <button
                    onClick={resetScanner}
                    className="mt-3.5 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:underline cursor-pointer py-1"
                  >
                    {t("scanner.clearAndReturn")}
                  </button>

                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                </motion.div>
              )}

              {/* STATE 3: Ultra-Luminous Viewfinder Dropzone with High-Tech Animations */}
              {(!uploadedImagePreview || (!isDeepScanning && !error)) && (
                <div className="w-full max-w-[540px] flex flex-col items-center">
                  <motion.div 
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isDeepScanning && fileInputRef.current?.click()}
                    whileHover={{ scale: 1.008, transition: { duration: 0.25, ease: "easeOut" } }}
                    whileTap={{ scale: 0.992 }}
                    className={`w-full rounded-3xl sm:rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-5 sm:p-8 md:p-11 text-center select-none relative overflow-hidden group shadow-sm ${
                      isDragging 
                        ? 'border-primary bg-primary/10 scale-[1.015] shadow-2xl ring-4 ring-primary/20 border-solid' 
                        : 'border-dashed border-zinc-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/5 bg-gradient-to-b from-zinc-50/80 via-white to-zinc-50/50'
                    }`}
                  >
                    {/* 4 Optical Corner Viewfinder Brackets with Spring Hover Movement */}
                    <span className="absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-zinc-400 group-hover:border-primary group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 rounded-tl-lg pointer-events-none"></span>
                    <span className="absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-zinc-400 group-hover:border-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 rounded-tr-lg pointer-events-none"></span>
                    <span className="absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-zinc-400 group-hover:border-primary group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-300 rounded-bl-lg pointer-events-none"></span>
                    <span className="absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-zinc-400 group-hover:border-primary group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-300 rounded-br-lg pointer-events-none"></span>

                    {/* Central Animated Scanner Icon with Breathing Halo */}
                    <div className="relative mb-3.5 sm:mb-4">
                      <motion.div 
                        className="absolute -inset-2.5 rounded-2xl bg-primary/10 border border-primary/20 pointer-events-none"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.75, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/90 text-zinc-900 flex items-center justify-center shadow-md relative z-10 group-hover:border-primary/50 group-hover:text-primary transition-colors"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        whileHover={{ scale: 1.12, rotate: [0, -5, 5, 0], transition: { duration: 0.3 } }}
                      >
                        <ImageIcon size={30} strokeWidth={1.75} />
                      </motion.div>
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-zinc-900 mb-1 tracking-tight group-hover:text-black transition-colors">
                      {t("scanner.dropImage")}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-zinc-500 max-w-[320px] leading-relaxed mb-4 sm:mb-5">
                      {t("scanner.dropSubtitle")}
                    </p>

                    {/* Dual Action Primary CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 w-full max-w-[340px] mb-4 sm:mb-5 pointer-events-auto z-20" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[42px]"
                      >
                        <UploadCloud size={15} />
                        <span>{t("scanner.browseFiles")}</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={handlePasteClipboard}
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[42px]"
                      >
                        <Clipboard size={14} className="text-zinc-600" />
                        <span>{t("scanner.pasteButton")}</span>
                      </motion.button>
                    </div>

                    {/* Format badges with springy hover */}
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
                      {['PNG', 'JPG', 'WebP', 'SVG'].map((fmt) => (
                        <motion.span 
                          key={fmt}
                          whileHover={{ scale: 1.08, y: -1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="px-2 sm:px-2.5 py-0.5 rounded-md bg-zinc-100/90 border border-zinc-200/80 text-[10px] sm:text-[11px] font-semibold text-zinc-600 cursor-default"
                        >
                          {fmt}
                        </motion.span>
                      ))}
                      <motion.span 
                        whileHover={{ scale: 1.08, y: -1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="px-2 sm:px-2.5 py-0.5 rounded-md bg-zinc-100/90 border border-zinc-200/80 text-[10px] sm:text-[11px] font-semibold text-zinc-600 cursor-default"
                      >
                        {t("scanner.barcodesBadge")}
                      </motion.span>
                    </div>

                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload}
                      disabled={isDeepScanning}
                    />
                  </motion.div>

                  {/* 🧪 Instant Demo Sample QR Code Bar with Tactile Pop */}
                  <div className="w-full mt-3.5 sm:mt-4 p-2.5 sm:p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      >
                        <Sparkles size={14} className="text-amber-500 shrink-0" />
                      </motion.div>
                      <span>{t("scanner.tryLiveSample")}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={() => loadSampleQR('url')}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-zinc-200/80 hover:border-blue-300 text-[11px] font-bold text-blue-700 transition-all cursor-pointer shadow-2xs hover:shadow-blue-500/20 hover:shadow-sm min-h-[30px] flex items-center justify-center"
                      >
                        🌐 {t("scanner.sampleWebsite")}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={() => loadSampleQR('whatsapp')}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-zinc-200/80 hover:border-emerald-300 text-[11px] font-bold text-emerald-700 transition-all cursor-pointer shadow-2xs hover:shadow-emerald-500/20 hover:shadow-sm min-h-[30px] flex items-center justify-center"
                      >
                        💬 {t("scanner.sampleWhatsApp")}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={() => loadSampleQR('wifi')}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-zinc-200/80 hover:border-amber-300 text-[11px] font-bold text-amber-700 transition-all cursor-pointer shadow-2xs hover:shadow-amber-500/20 hover:shadow-sm min-h-[30px] flex items-center justify-center"
                      >
                        📶 {t("scanner.sampleWifi")}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={() => loadSampleQR('vcard')}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-zinc-200/80 hover:border-indigo-300 text-[11px] font-bold text-indigo-700 transition-all cursor-pointer shadow-2xs hover:shadow-indigo-500/20 hover:shadow-sm"
                      >
                        📇 {t("scanner.sampleVCard")}
                      </motion.button>
                    </div>
                  </div>

                  <p className="mt-3.5 text-center text-xs text-zinc-500 max-w-sm">
                    {t("scanner.uploadSavedImageDesc")}
                  </p>
                </div>
              )}
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
              <span>{t("scanner.decodedSuccessfully")}</span>
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

                {/* Security Badge on Top Right */}
                {parsedData?.type === 'url' && parsedData.safety && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${parsedData.safety.badgeColor}`}>
                    <ShieldCheck size={12} /> {parsedData.safety.badgeLabelKey ? t(parsedData.safety.badgeLabelKey) : parsedData.safety.badgeLabel}
                  </span>
                )}
                {parsedData?.type === 'whatsapp' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <MessageSquare size={12} /> {t('scanner.directChatReady')}
                  </span>
                )}
              </div>

              {/* Type 1: URL / Website */}
              {parsedData?.type === 'url' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <h4 className="font-black text-on-surface text-base sm:text-lg break-all">{parsedData.domain || 'Website'}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{t('scanner.results.clickOpenWebsite')}</p>
                  </div>

                  {parsedData.safety && parsedData.safety.status !== 'safe' && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <p className="font-bold">{t('scanner.results.securityNotice')}</p>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                          {parsedData.safety.reasonKeys && parsedData.safety.reasonKeys.length > 0
                            ? parsedData.safety.reasonKeys.map((k, i) => (
                                <li key={i}>{t(k)}</li>
                              ))
                            : parsedData.safety.reasons.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-surface rounded-xl border border-outline-variant/60 break-all font-mono text-xs sm:text-sm text-on-surface select-all shadow-inner">
                    {scanResult}
                  </div>
                </div>
              )}

              {/* Type 1b: WhatsApp Direct Chat */}
              {parsedData?.type === 'whatsapp' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">{t('scanner.results.whatsappContact')}</p>
                    <h4 className="font-black text-on-surface text-base sm:text-lg">{parsedData.whatsapp?.phone || 'Direct Chat'}</h4>
                  </div>

                  {parsedData.whatsapp?.message && (
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80 text-xs sm:text-sm space-y-1">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">{t('scanner.results.prefilledMessage')}</p>
                      <p className="text-emerald-900 break-words font-medium">"{parsedData.whatsapp.message}"</p>
                    </div>
                  )}

                  <div className="p-3 bg-surface rounded-xl border border-outline-variant/60 break-all font-mono text-xs sm:text-sm text-on-surface select-all shadow-inner">
                    {scanResult}
                  </div>
                </div>
              )}

              {/* Type 2: WiFi Network */}
              {parsedData?.type === 'wifi' && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('scanner.results.networkSsid')}</p>
                    <h4 className="text-lg sm:text-xl font-black text-on-surface mt-0.5 break-all">{parsedData.wifi?.ssid}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/50">
                      <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase">{t('scanner.results.securityMode')}</p>
                      <p className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">{parsedData.wifi?.authType || 'WPA/WPA2'}</p>
                    </div>

                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/50 relative">
                      <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase">{t('scanner.results.networkPassword')}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs sm:text-sm font-mono font-bold text-on-surface break-all pr-2">
                          {parsedData.wifi?.password ? (showPassword ? parsedData.wifi.password : '••••••••••••') : t('scanner.results.openNoPassword')}
                        </p>
                        {parsedData.wifi?.password && (
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors cursor-pointer shrink-0"
                            title={showPassword ? t('scanner.results.hidePassword') : t('scanner.results.showPassword')}
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
                  <h4 className="text-base sm:text-lg font-black text-on-surface">{parsedData.vcard?.name || t('scanner.results.contactInfo')}</h4>

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
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('scanner.results.recipient')}</p>
                    <h4 className="text-base sm:text-lg font-black text-on-surface break-all">{parsedData.email?.to}</h4>
                  </div>

                  {(parsedData.email?.subject || parsedData.email?.body) && (
                    <div className="bg-surface p-3 rounded-xl border border-outline-variant/40 text-xs sm:text-sm space-y-1">
                      {parsedData.email.subject && <p className="font-bold">{t('scanner.results.subject')} {parsedData.email.subject}</p>}
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
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('scanner.results.telephoneNumber')}</p>
                    <h4 className="text-lg sm:text-xl font-mono font-black text-on-surface truncate">{parsedData.phone?.number}</h4>
                  </div>
                </div>
              )}

              {/* Type 6: SMS */}
              {parsedData?.type === 'sms' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('scanner.results.sendSmsTo')}</p>
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
                    <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('scanner.results.geoCoordinates')}</p>
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
                  <p className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('scanner.results.decodedContent')}</p>
                  <div className="p-3 sm:p-4 bg-surface rounded-xl border border-outline-variant/60 text-xs sm:text-sm font-mono text-on-surface whitespace-pre-wrap break-all max-h-52 overflow-y-auto shadow-inner">
                    {scanResult}
                  </div>
                </div>
              )}

            </div>

            {/* Smart Context Primary Action Buttons Row (Responsive 1/2 col grid on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-6 w-full">
              
              {/* Context Action 0: Chat on WhatsApp */}
              {parsedData?.type === 'whatsapp' && (
                <a
                  href={parsedData.whatsapp?.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-[#20ba59] shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <MessageSquare size={16} />
                  <span>{t('scanner.results.chatWhatsApp')}</span>
                </a>
              )}

              {/* Context Action 1: Open URL */}
              {parsedData?.type === 'url' && (
                <a
                  href={parsedData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <ExternalLink size={16} />
                  <span>{t("scanner.openLink")}</span>
                </a>
              )}

              {/* Context Action 2: Copy WiFi Password */}
              {parsedData?.type === 'wifi' && parsedData.wifi?.password && (
                <button
                  onClick={() => copyToClipboard(parsedData.wifi?.password, t('scanner.results.wifiCopied'))}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all cursor-pointer btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Copy size={16} />
                  <span>{t("scanner.connectWifi")}</span>
                </button>
              )}

              {/* Context Action 3: Save vCard */}
              {parsedData?.type === 'vcard' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={downloadVCardFile}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all cursor-pointer btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Download size={16} />
                  <span>{t("scanner.saveVCard")}</span>
                </motion.button>
              )}

              {/* Context Action 3b: Save Calendar Event */}
              {parsedData?.type === 'event' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={downloadIcsFile}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-purple-700 shadow-md transition-all cursor-pointer btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Calendar size={16} />
                  <span>{t("scanner.downloads.addCalendar")}</span>
                </motion.button>
              )}

              {/* Context Action 4: Compose Email */}
              {parsedData?.type === 'email' && (
                <motion.a
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href={`mailto:${parsedData.email?.to}${parsedData.email?.subject ? `?subject=${encodeURIComponent(parsedData.email.subject)}` : ''}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Mail size={16} />
                  <span>{t("scanner.sendEmail")}</span>
                </motion.a>
              )}

              {/* Context Action 5: Call Phone */}
              {parsedData?.type === 'phone' && (
                <motion.a
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href={`tel:${parsedData.phone?.number}`}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-700 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <Phone size={16} />
                  <span>{t("scanner.callPhone")}</span>
                </motion.a>
              )}

              {/* Context Action 6: Open Maps */}
              {parsedData?.type === 'geo' && (
                <motion.a
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href={parsedData.geo?.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 shadow-md transition-all btn-spring text-xs sm:text-sm min-h-[44px]"
                >
                  <MapPin size={16} />
                  <span>{t("scanner.openMap")}</span>
                </motion.a>
              )}

              {/* Universal Action: Copy Raw Text */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => copyToClipboard()}
                className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold border border-outline-variant/60 transition-all cursor-pointer text-xs sm:text-sm min-h-[44px]"
              >
                <Copy size={16} />
                <span>{t("scanner.copyContent")}</span>
              </motion.button>

              {/* Universal Action: Scan Another */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={resetScanner}
                className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold border border-outline-variant/60 transition-all cursor-pointer text-xs sm:text-sm min-h-[44px]"
              >
                <RefreshCw size={16} />
                <span>{t("scanner.tryAnotherImage")}</span>
              </motion.button>
            </div>

            {/* ╔══════════════════════════════════════════╗ */}
            {/* ║  DEDICATED DOWNLOAD & EXPORT HUB          ║ */}
            {/* ╚══════════════════════════════════════════╝ */}
            <div className="w-full mt-5 sm:mt-6 bg-surface-container-lowest rounded-2xl p-3.5 sm:p-5 border border-outline-variant/60 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/30">
                <span className="text-[11px] sm:text-xs font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                  <Download size={14} className="text-emerald-600" />
                  <span>{t("scanner.downloadHub")}</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium">{t("scanner.downloads.oneClickDownloads")}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Download Option 1: Clean QR PNG */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={downloadCleanQRImage}
                  disabled={isGeneratingDownloadQR}
                  className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    {isGeneratingDownloadQR ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t("scanner.downloads.qrImage")}</span>
                  <span className="text-[9px] sm:text-[10px] text-on-surface-variant">PNG 1024px</span>
                </motion.button>

                {/* Download Option 2: Plain Text */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={downloadTextFile}
                  className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <FileText size={14} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t("scanner.downloads.rawText")}</span>
                  <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.TXT File</span>
                </motion.button>

                {/* Download Option 3: Structured JSON */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={downloadJsonFile}
                  className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <FileCode size={14} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t("scanner.downloads.metadata")}</span>
                  <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.JSON Object</span>
                </motion.button>

                {/* Download Option 4: Dynamic (vCard / Event / Vector SVG) */}
                {parsedData?.type === 'vcard' ? (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={downloadVCardFile}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <User size={14} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t("scanner.downloads.vcard")}</span>
                    <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.VCF Contact</span>
                  </motion.button>
                ) : parsedData?.type === 'event' ? (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={downloadIcsFile}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Calendar size={14} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t("scanner.downloads.calendar")}</span>
                    <span className="text-[9px] sm:text-[10px] text-on-surface-variant">.ICS Event</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={downloadSvgQR}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 transition-all text-center cursor-pointer group min-h-[72px]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <FileDown size={14} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t("scanner.downloads.vectorSvg")}</span>
                    <span className="text-[9px] sm:text-[10px] text-on-surface-variant">{t("scanner.downloads.scalable")}</span>
                  </motion.button>
                )}

              </div>
            </div>

            {/* Bottom Bridge Action: Customize in Generator */}
            <div className="w-full mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-outline-variant/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
              <span className="text-xs font-semibold text-on-surface-variant">{t("scanner.wantCustomFrames")}</span>
              <a
                href={getStudioUrl()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0 py-1"
              >
                <QrCode size={14} />
                <span>{t("scanner.openInStudio")}</span>
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
                <span>{t("scanner.scanHistory")}</span>
              </h4>
              {scanHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs font-bold text-error hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <Trash2 size={12} />
                  <span>{t("scanner.clearAll")}</span>
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">{t("scanner.noHistory")}</p>
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
                        onClick={() => copyToClipboard(item.raw, t('scanner.toasts.itemCopiedFromHistory'))}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title={t('scanner.aria.copyItemAria')}
                        aria-label={t('scanner.aria.copyItemAria')}
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title={t('scanner.aria.deleteItemAria')}
                        aria-label={t('scanner.aria.deleteItemAria')}
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

      {/* 4-Feature Trust Badges Row (with interactive animations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-10 w-full max-w-4xl">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="bg-white border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-default group"
        >
          <motion.div 
            whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
            className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100/80 transition-colors"
          >
            <Lock size={19} strokeWidth={2.2} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{t("scanner.features.privateTitle")}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500 truncate">{t("scanner.features.privateDesc")}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="bg-white border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-blue-200 transition-all cursor-default group"
        >
          <motion.div 
            whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100/80 transition-colors"
          >
            <Zap size={19} strokeWidth={2.2} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{t("scanner.features.instantTitle")}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500 truncate">{t("scanner.features.instantDesc")}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="bg-white border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-default group"
        >
          <motion.div 
            whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
            className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100/80 transition-colors"
          >
            <Sparkles size={19} strokeWidth={2.2} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{t("scanner.features.aiTitle")}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500 truncate">{t("scanner.features.aiDesc")}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="bg-white border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-amber-200 transition-all cursor-default group"
        >
          <motion.div 
            whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
            className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100/80 transition-colors"
          >
            <ShieldCheck size={19} strokeWidth={2.2} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{t("scanner.features.freeTitle")}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500 truncate">{t("scanner.features.freeDesc")}</p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function QRScannerApp({ locale = 'en' }: { locale?: string }) {
  return (
    <TranslationProvider locale={locale}>
      <QRScannerAppContent />
    </TranslationProvider>
  );
}
