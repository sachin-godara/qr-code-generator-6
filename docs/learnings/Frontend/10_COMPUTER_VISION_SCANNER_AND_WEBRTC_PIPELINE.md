# 📷 10 - Computer Vision Scanner & WebRTC Camera Pipeline

> **Exhaustive architectural breakdown of the client-side QR scanner application (`frontend/src/react/scanner/QRScannerApp.tsx`), WebRTC camera streaming, dual-engine decoding, 3-tier fallback escalation, multi-format payload parser, audio/haptic feedback, and local history management.**

---

## 🏗️ 1. Scanner System Architecture

`QRScannerApp.tsx` (85.9 KB) is a standalone, client-side progressive web application providing real-time camera scanning, drag-and-drop file decoding, clipboard image extraction, and deep neural network escalation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       QRScannerApp.tsx Master Hub                           │
│                                                                             │
│  [File Upload & Drag-and-Drop Tab]     │     [Live WebRTC Camera Stream]    │
│  • Drag-and-drop zone with visual ring │     • HTML5 Video Viewfinder       │
│  • Clipboard paste (`Ctrl+V`) listener │     • Multi-camera switcher        │
│  • Inverted canvas pre-processing      │     • Hardware torch toggle        │
│  • Multi-tier fallback pipeline        │     • 15 FPS frame capture loop    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        3-Tier Decoding Escalation Pipeline                  │
│                                                                             │
│  Tier 1: Standard Client Scan (`html5-qrcode` / `jsQR`)                     │
│          └─► [Success] ──► Decode text payload                              │
│          └─► [Failure] ──► Escalate to Tier 2                               │
│                                                                             │
│  Tier 2: Offscreen Inverted Canvas Scan (White-on-Black Dark Mode QR)        │
│          └─► Pixel inversion: `data[i] = 255 - data[i]`                     │
│          └─► [Success] ──► Decode text payload                              │
│          └─► [Failure] ──► Escalate to Tier 3                               │
│                                                                             │
│  Tier 3: Backend Deep-Scan Escalation (`POST /api/generator/scan`)          │
│          └─► OpenCV Waterfall Filtering & WeChat QR Caffe CNN               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Multi-Format Payload Parser (`parseQRContent`)           │
│                                                                             │
│  • WiFi Credentials    • vCard Contact Card   • HTTPS URLs & Domains        │
│  • Email (mailto/MATMSG)• Phone Calls (tel:)   • SMS Messages (smsto:)       │
│  • Geolocation (geo:)  • iCalendar Events     • UPI & Plain Text            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌──────────────────────────────────┐       ┌──────────────────────────────────┐
│         Sensory Feedback         │       │     Local Storage History        │
│  • Web Audio API Chime (880Hz)   │       │  • Max 15 deduplicated scans     │
│  • Haptic Vibration (80ms pulse) │       │  • Timestamp, type, thumbnail    │
│  • Animated Result Card Modal    │       │  • Export to JSON & CSV          │
└──────────────────────────────────┘       └──────────────────────────────────┘
```

---

## 📹 2. WebRTC Camera Streaming & Hardware Control

### 1. Viewfinder Initialization & Constraints:
The live camera stream is managed via `Html5Qrcode` with custom resolution and aspect ratio constraints:

```typescript
const scanConfig = {
  fps: 15,
  qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
    const minDim = Math.min(viewfinderWidth, viewfinderHeight);
    return {
      width: Math.round(minDim * 0.75),
      height: Math.round(minDim * 0.75)
    };
  },
  aspectRatio: 1.0,
};
```

### 2. Multi-Camera Enumeration & 1-Tap Switching (`switchCamera`):
On multi-camera smartphones (e.g. iPhone, Samsung Galaxy), the app enumerates available hardware lenses (Ultra-Wide, Wide, Telephoto, Front-Facing):

```typescript
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
```

### 3. Hardware Torch / Flashlight Control:
Uses the WebRTC `MediaTrackConstraints` advanced capabilities API to toggle the smartphone's physical LED torch:

```typescript
const toggleTorch = async () => {
  if (!scannerRef.current || !isScannerRunning()) return;
  try {
    await (scannerRef.current as any).applyVideoConstraints({
      advanced: [{ torch: !torchOn }]
    });
    setTorchOn(!torchOn);
  } catch (e) {
    console.warn("Torch toggle not supported on this device:", e);
  }
};
```

### 4. Memory Safety & Hardware Track Cleanup (`hardStopMediaTracks`):
To avoid locking the camera hardware after page navigation or tab switching, the scanner implements rigorous stream cleanup:

```typescript
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
```

---

## ⚡ 3. The 3-Tier Fallback Escalation Pipeline

Standard QR decoders frequently fail when scanning dark-mode QR codes (white modules on dark background), heavily stylized custom QR codes, or low-resolution images.

`QRScannerApp.tsx` resolves this with a 3-stage escalation pipeline:

```typescript
const processImageFile = async (file: File) => {
  // --- LEVEL 1: Standard Client Scan ---
  try {
    const decodedText = await scannerRef.current.scanFile(file, true);
    return handleScanSuccess(decodedText);
  } catch (err) {
    console.log("Client scan pass 1 failed, trying inverted canvas scan...");
  }

  // --- LEVEL 2: Inverted Canvas Pre-Processing ---
  try {
    const invertedBlob = await createInvertedCanvasBlob(file);
    const invertedFile = new File([invertedBlob], "inverted.png", { type: "image/png" });
    const decodedText = await scannerRef.current.scanFile(invertedFile, true);
    return handleScanSuccess(decodedText);
  } catch (invertErr) {
    console.log("Inverted scan failed, escalating to backend AI model...");
  }

  // --- LEVEL 3: Backend AI WeChat QR Neural Model ---
  setIsDeepScanning(true);
  try {
    const decodedText = await scanQRImageBackend(file);
    handleScanSuccess(decodedText);
  } catch (backendErr) {
    setError("scanner.decodeFailed");
  } finally {
    setIsDeepScanning(false);
  }
};
```

### Inverted Canvas Algorithm:
```typescript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
ctx.drawImage(img, 0, 0, w, h);

const imageData = ctx.getImageData(0, 0, w, h);
const data = imageData.data;

// Invert RGB channels: 255 - current
for (let i = 0; i < data.length; i += 4) {
  data[i] = 255 - data[i];         // Red
  data[i + 1] = 255 - data[i + 1]; // Green
  data[i + 2] = 255 - data[i + 2]; // Blue
}
ctx.putImageData(imageData, 0, 0);
```

---

## 🧩 4. Multi-Format Payload Parser (`parseQRContent`)

The parser analyzes decoded strings and extracts structured data objects across 9 major protocols:

| Protocol | Identification Signature | Extracted Metadata Fields |
| :--- | :--- | :--- |
| **WiFi** | `WIFI:S:...;T:...;P:...;;` | `ssid`, `password`, `authType` (WPA/WEP/nopass), `hidden` |
| **vCard** | `BEGIN:VCARD ... END:VCARD` | `name`, `phone`, `email`, `org`, `title`, `url`, `address`, `notes` |
| **URL** | `https://...` or `http://...` | `url`, `domain`, `isHttps` |
| **Email** | `mailto:...` or `MATMSG:TO:...;` | `to`, `subject`, `body` |
| **Phone** | `tel:...` | `number` |
| **SMS** | `smsto:...` or `sms:...` | `number`, `message` |
| **Geo** | `geo:lat,lng` | `lat`, `lng`, `mapsUrl` (Google Maps query) |
| **Event** | `BEGIN:VEVENT ... END:VEVENT` | `summary`, `location`, `description`, `dtstart`, `dtend` |
| **Text** | Fallback generic string | `raw` |

---

## 🔔 5. Sensory Feedback Systems

To provide immediate tactile and auditory confirmation upon successful decoding:

### 1. Web Audio API Synthesizer (`playScanSound`):
Generates a crisp 880Hz to 1760Hz harmonic chime using native browser oscillators with zero external audio assets:
```typescript
function playScanSound() {
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
}
```

### 2. Haptic Vibration Pulse:
```typescript
if (typeof navigator !== 'undefined' && navigator.vibrate) {
  try { navigator.vibrate(80); } catch (e) {}
}
```

---

## 📜 6. Scan History & Export Engine

Scanned items are persisted in `localStorage` under `genqr_scan_history_v1`:

### 1. Deduplication & Ring Buffer:
- Stores up to **15 recent items**.
- Deduplicates identical payloads, moving the most recent scan to the top of the history list.

### 2. Export to CSV & JSON:
- **JSON Export**: Serializes the entire structured history array with ISO timestamps.
- **CSV Export**: Formats items into spreadsheet-ready rows (`ID, Timestamp, Type, Title, Raw Payload`).

---

## 🧪 7. Automated Test Verification (`QRScannerApp.test.ts`)

The parser logic is covered by 8 automated unit tests in `frontend/src/tests/QRScannerApp.test.ts`:
- Parsing WPA/WEP/hidden WiFi strings.
- Parsing vCard 3.0 multi-field contacts.
- Parsing HTTPS URLs with domain sanitization.
- Parsing `mailto:` and `MATMSG:` email formats.
- Parsing `tel:`, `smsto:`, `geo:`, and `BEGIN:VEVENT` events.
- Fallback handling for arbitrary plain text and serial numbers.
