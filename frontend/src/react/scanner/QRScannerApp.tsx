import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, Image as ImageIcon, Copy, ExternalLink, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { scanQRImageBackend } from '../../services/qrApi';

export default function QRScannerApp() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'file' | 'camera'>('file');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);
  const readerElementId = 'qr-reader';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safe check for scanning state
  const isScannerRunning = () => {
    if (!scannerRef.current) return false;
    try {
      // 2 is the enum value for SCANNING in html5-qrcode
      return scannerRef.current.getState() === 2;
    } catch (e) {
      return (scannerRef.current as any).isScanning === true;
    }
  };

  // Initialize and cleanup camera scanner
  useEffect(() => {
    if (activeTab === 'camera' && !scanResult) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab, scanResult]);

  const startCamera = async () => {
    if (isStartingRef.current) return;
    if (isScannerRunning()) return;
    
    try {
      isStartingRef.current = true;
      setError(null);
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        });
      }

      const hasCameras = await Html5Qrcode.getCameras();
      if (hasCameras && hasCameras.length > 0) {
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignore normal scanning errors (like "no QR code found in frame")
          }
        );
        setIsScanning(true);
      } else {
        setError("No cameras found on your device.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Camera access denied or unavailable. Please check your browser permissions.");
    } finally {
      isStartingRef.current = false;
    }
  };

  const stopCamera = () => {
    if (isScannerRunning()) {
      scannerRef.current?.stop().then(() => {
        setIsScanning(false);
      }).catch(console.error);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    stopCamera();
    setScanResult(decodedText);
  };

  const scanWithFallback = async (file: File): Promise<string> => {
    if (!scannerRef.current) throw new Error("Scanner not initialized");
    
    // 1. Standard scan
    try {
      const decodedText = await scannerRef.current.scanFile(file, true);
      return decodedText;
    } catch (err) {
      console.log("Standard scan failed, trying inverted/enhanced scan...");
    }

    // 2. Inverted scan fallback (for dark mode or transparent QR codes)
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = async () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("Canvas not supported");

        // Scale down huge images to improve scanning performance and reliability
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

        // Fill white background in case of transparency
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        
        // Invert colors to turn white-on-black into black-on-white
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B
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
      
      img.onerror = () => reject("Image load failed");
      img.src = url;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a local preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);

    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        });
      }
      
      const decodedText = await scanWithFallback(file);
      handleScanSuccess(decodedText);
    } catch (err) {
      // 3. Ultimate Fallback: Deep Scan on Backend
      console.log("Frontend scanning failed, initiating backend deep scan...");
      setIsDeepScanning(true);
      setError(null);
      try {
        const decodedText = await scanQRImageBackend(file);
        handleScanSuccess(decodedText);
      } catch (backendErr: any) {
        setError(backendErr.message || "Could not find a valid QR code in that image. Please try another one.");
      } finally {
        setIsDeepScanning(false);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
      setUploadedImagePreview(null);
    }
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      // Optional: Add a small toast or visual feedback here
    }
  };

  const isUrl = scanResult && (scanResult.startsWith('http://') || scanResult.startsWith('https://'));

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest rounded-3xl border border-outline-variant/50 shadow-xl overflow-hidden">
      
      {/* Tabs */}
      <div className="p-4 sm:p-6 border-b border-outline-variant/30">
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('file')}
            className={`relative flex-1 py-2.5 flex items-center justify-center gap-2 rounded-md font-bold transition-colors text-sm outline-none ${activeTab === 'file' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {activeTab === 'file' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2"><ImageIcon size={18} /> Upload Image</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`relative flex-1 py-2.5 flex items-center justify-center gap-2 rounded-md font-bold transition-colors text-sm outline-none ${activeTab === 'camera' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {activeTab === 'camera' && (
              <motion.div
                layoutId="scanner-mode-tab"
                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2"><Camera size={18} /> Scan with Camera</span>
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {!scanResult ? (
          <div className="flex flex-col items-center">
            {error && (
              <div className="w-full mb-6 p-4 bg-error-container text-on-error-container rounded-xl flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div 
              id={readerElementId} 
              className={`w-full max-w-[400px] overflow-hidden rounded-2xl bg-black ${activeTab === 'camera' ? 'block' : 'hidden'}`}
              style={{ minHeight: '300px' }}
            >
              {/* html5-qrcode injects video here */}
            </div>

            {activeTab === 'file' && (
              <div className="w-full flex flex-col items-center">
                {uploadedImagePreview && (
                  <div className="w-full max-w-[250px] mb-6 rounded-2xl overflow-hidden border border-outline-variant shadow-sm relative bg-surface-container-highest">
                    <img 
                      src={uploadedImagePreview} 
                      alt="Uploaded preview" 
                      className="w-full h-auto object-contain" 
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); resetScanner(); }}
                      className="absolute top-2 right-2 bg-surface/90 backdrop-blur p-2 rounded-full shadow hover:bg-surface-container transition-colors text-on-surface-variant hover:text-error"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">close</span>
                    </button>
                  </div>
                )}
                
                <div 
                  className={`w-full max-w-[400px] border-2 border-dashed border-outline hover:border-primary transition-colors rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-surface-container/50 ${uploadedImagePreview ? 'py-4' : 'aspect-square'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!uploadedImagePreview ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <ImageIcon size={32} />
                      </div>
                      <p className="text-on-surface font-semibold">Click to upload QR image</p>
                      <p className="text-on-surface-variant text-sm mt-2">PNG, JPG, WebP supported</p>
                    </>
                  ) : isDeepScanning ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                      <p className="text-on-surface font-semibold">Performing Deep Scan...</p>
                      <p className="text-on-surface-variant text-sm mt-2 text-center max-w-[250px]">Using server-side computer vision to extract stubbon QR codes</p>
                    </div>
                  ) : (
                    <p className="text-on-surface font-semibold flex items-center gap-2">
                      <ImageIcon size={18} /> Try a different image
                    </p>
                  )}
                  <input name="input_field_4115423d" aria-label="Input Field" 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isDeepScanning}
                  />
                </div>
              </div>
            )}
            
            <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
              {activeTab === 'camera' ? 'Point your camera at a QR code to instantly scan it.' : 'Upload an image containing a QR code to decode its contents.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            {uploadedImagePreview ? (
              <div className="w-full max-w-[200px] rounded-2xl overflow-hidden mb-6 border border-outline-variant shadow-md relative group">
                <img 
                  src={uploadedImagePreview} 
                  alt="Scanned QR Code" 
                  className="w-full h-auto max-h-[200px] object-contain bg-surface-container-highest" 
                />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl font-bold">check</span>
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-on-surface mb-2">Scan Successful!</h3>
            
            <div className="w-full mt-6 bg-surface-container rounded-2xl p-6 border border-outline-variant/50 break-words relative group">
              <p className="text-on-surface font-medium whitespace-pre-wrap">{scanResult}</p>
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={copyToClipboard}
                  className="p-2 bg-surface-container-lowest hover:bg-outline-variant/30 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8 w-full">
              {isUrl && (
                <a 
                  href={scanResult} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl font-bold hover:bg-primary-hover transition-colors"
                >
                  <ExternalLink size={18} />
                  Open Link
                </a>
              )}
              <button 
                onClick={resetScanner}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3 px-6 rounded-xl font-bold transition-colors border border-outline-variant/30"
              >
                <RefreshCw size={18} />
                Scan Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
