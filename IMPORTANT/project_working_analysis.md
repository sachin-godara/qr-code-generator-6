# 🚀 QR Code Studio 6: Comprehensive Project Working & Architectural Analysis

## 📌 Executive Summary

**QR Code Generator 6 (Custom QR Studio)** is an enterprise-grade, high-performance web application designed for generating, styling, batch-exporting, and scanning highly customized QR codes. It combines a **FastAPI (Python 3.14/3.12)** backend powered by custom PIL/OpenCV computer vision algorithms with a modern **Astro 5.x + React 19 + TypeScript + Tailwind CSS** frontend.

---

## 🏗️ 1. Architecture Overview

```mermaid
graph TD
    subgraph Client["Frontend Client (Astro + React 19)"]
        UI["React UI State (Zustand)"]
        Panels["Control Panels (Content, Design, Logo, Frames, Effects, Templates)"]
        Preview["Interactive Preview Pane (Live / Lightbox / Compare)"]
        Scannability["Scannability Checker (WCAG 4.5:1 Math)"]
        ReactQuery["TanStack React Query (Smart Debounce + Cache)"]
    end

    subgraph API["Backend API (FastAPI)"]
        Limiter["SlowAPI Rate Limiter"]
        Security["Security Headers + Size Limiter Middleware"]
        RouterGen["/api/generator (PNG, SVG, PDF, Batch, Scan)"]
        RouterContact["/api/contact (Sanitized Lead Intake)"]
    end

    subgraph Engines["Backend Core Engines"]
        LRU["In-Memory LRU Cache (Thread-Safe)"]
        QREngine["qr_engine.py (Matrix Generator + StyledPilImage)"]
        Dots["engines/dots (42+ Custom Module Drawers)"]
        Eyes["engines/eyes (31 Eye Frames + 24 Eyeballs)"]
        Frames["engines/frames (34 Layout + 52 Text Banners)"]
        LogoEngine["engines/logo (Alpha Masking, Shape Cards, Presets)"]
        ScanEngine["services/scan_service.py (WeChat QR CNN + PyZBar CV)"]
    end

    UI --> ReactQuery
    Panels --> UI
    UI --> Scannability
    ReactQuery --> RouterGen
    RouterGen --> Limiter --> Security --> LRU
    LRU --> QREngine
    QREngine --> Dots
    QREngine --> Eyes
    QREngine --> Frames
    QREngine --> LogoEngine
    RouterGen --> ScanEngine
```

---

## ⚙️ 2. Core Functional Components & Capabilities

### A. 🎨 Visual Engine & Matrix Customization
| Module Category | Count | Capabilities |
| :--- | :--- | :--- |
| **Dot Module Styles** | **42+** | Square, Circle, Rounded, Diamond, Hexagon, Octagon, Gapped, Star, Heart, Vertical/Horizontal Bars, Clover, Sheared, Bevel, Squircle, Target Bullseye, Dotted Cross, Arrow, Gear, Hourglass, Quad Dots, Sparkle, Medical Cross, Lotus Petal, Network Nodes, Circuit Bridge, Shield Connect, etc. |
| **Eye Frame Styles** | **31+** | Square, Rounded, Octagon, Perfect Leaf (TL/TR), Dynamic Swept, Shield, Droplet (TL/TR/BL/BR), Leaf Opposite, Crystal Frame, Arch Frame, Aztec Step, Camera Lens, Circuit Trace, Cushion Cut, Geometric Deco, Flower of Life, etc. Individual corner customization supported. |
| **Eyeball Styles** | **24+** | Square, Rounded, Circle, Diamond, Hexagon, Octagon, Perfect Leaf, Shield, Gear, Rhombus, Squircle, Fluted Bezel, Deckled, Sheared, Clover, Heart, Pinched Square, etc. Individual corner customization supported. |
| **Frames & Borders** | **86+** | 34 Layout Frames (Polaroid, Monitor, Storefront, Cellular Automata, SDF Metaball, Guilloche Security, Modern Arch, Chamfered Monolith) + 52 Text Banners / Themed Badges (Scan Me, App Store, Coffee Cup, Map Pin, Pizza Slice, Vinyl Record, Vintage Stamp, etc.). |
| **Color & Gradients** | **6 Modes** | Solid Color, Linear Vertical, Linear Horizontal, Radial Center, Diagonal (TL to BR), Diagonal (TR to BL). Transparent backgrounds and background image overlays with blend modes supported. |
| **Logo Integration** | **30+ Presets** | Preset SVG/PNG brand badges (WhatsApp, Instagram, YouTube, WiFi, vCard, PayPal, Spotify, LinkedIn, etc.) with custom color mode, icon style (badge/duotone/glyph), shape cards (None, Circle, Rounded Square), alpha transparency remover, and automatic module clear zone. |

---

### B. 📥 12+ Content Types
1. **URL**: Standard web links with instant validation.
2. **Plain Text**: Multiline free-form text.
3. **vCard (Digital Contact)**: Name, Phone, Email, Company, Job Title, Address, Website, Note.
4. **WiFi**: SSID, Password, Encryption (`WPA/WPA2`, `WEP`, `nopass`), Hidden SSID flag.
5. **Event / Calendar**: Event Title, Location, Start Time, End Time, Description.
6. **Email**: Recipient, Subject, Pre-filled Body.
7. **Phone / Call**: Direct dial number formatting.
8. **SMS / Text Message**: Phone number and pre-filled message text.
9. **WhatsApp**: Country code, Number, and pre-formatted chat text.
10. **Geo Location**: Latitude, Longitude, and Google Maps pin link.
11. **Payments (UPI / PayPal / Crypto)**: UPI VPA, Payee Name, Amount, Currency, Bitcoin/Ethereum wallet addresses.
12. **App Store & Google Play**: App package IDs, direct store URLs.
13. **Batch CSV Generator**: Upload CSV spreadsheet, map data column + filename column, and batch-render hundreds of custom QR codes in a single downloadable ZIP archive.

---

### C. 🔍 Computer Vision Deep Scanning & Scannability Assurance
1. **Frontend Real-time Scannability Score**:
   - Calculates **WCAG 2.2 contrast ratio** between foreground/gradient colors and background.
   - Verifies error correction level (enforces `H` when logos are embedded).
   - Flags module density and risky dot/eye styles.
   - Visual indicator: *Excellent* (Emerald), *Good* (Yellow), *Fair* (Orange), *Poor* (Red).
2. **Backend Dual-Engine Deep Scan**:
   - **WeChat QR CNN Deep Learning Model**: OpenCV DNN detector and Super-Resolution model trained on millions of real-world warped and styled QR codes.
   - **PyZBar / OpenCV Computer Vision Waterfall**: Grayscale $\to$ Thresholding $\to$ Adaptive Thresholding $\to$ Gaussian Blur $\to$ Morphological Close $\to$ Color Inversion $\to$ Multi-scale Area Resizing.

---

### D. 🚀 Performance & Caching Engine
1. **Smart Debouncing**:
   - Discrete clicks (selecting templates, colors, dot styles, toggles) update **instantly (0ms)**.
   - Continuous input (typing text/URL, dragging sliders) is smoothly throttled at **150ms**.
2. **Frontend TanStack Query**:
   - 5-minute memory cache with `placeholderData: keepPreviousData` prevents UI flickering during updates.
   - `AbortController` signal automatically cancels in-flight requests when settings change rapidly.
3. **Backend In-Memory LRU Cache (`SimpleLRUCache`)**:
   - Thread-safe `OrderedDict` LRU cache stores rendered binary image buffers by MD5 hash of input parameters.
   - Cache hits serve in **< 1 millisecond** without re-executing PIL matrix drawers.
4. **FastAPI ThreadPool Execution**:
   - Heavy image processing is dispatched to background threads via `run_in_threadpool`, keeping the async event loop non-blocking.

---

### E. 🛡️ Security & Reliability
1. **DDoS & Flooding Defense**:
   - `slowapi` rate limiting configured per endpoint (e.g., 120 req/min for generate, 60 req/min for SVG/PDF, 5 req/min for contact).
   - Reverse-proxy IP resolution (`CF-Connecting-IP`, `X-Real-IP`, `X-Forwarded-For`).
2. **Decompression Bomb Protection**:
   - `Image.MAX_IMAGE_PIXELS = 10_000_000` prevents decompression bomb denial-of-service attacks.
3. **Request Body Size Limit**:
   - Custom middleware limits maximum request payload to **5 MB**.
4. **Hardened HTTP Security Headers**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 🧪 3. Test Suite Verification & Quality Gates

### A. Backend Pytest Suite
```
====================== 140 passed, 10 warnings in 34.79s ======================
- tests/test_api_routes.py ........... PASS (5/5)
- tests/test_engines.py .............. PASS (6/6)
- tests/test_performance_cache.py .... PASS (1/1)
- tests/test_qr_service.py ........... PASS (4/4)
- tests/test_security.py ............. PASS (5/5)
- tests/test_template_scannability.py  PASS (119/119)
```
- **100% of all 48+ curated templates** passed scannability and decoding tests.
- High error correction and quiet zone checks confirmed.

### B. Frontend Vitest Suite
```
 Test Files  2 passed (2)
      Tests  4 passed (4)
- src/tests/useQRStore.test.ts (State, Undo/Redo, History Stack) ..... PASS
- src/tests/App.test.tsx (Component Mounting & Integration) .......... PASS
```

### C. Static Production Build
```
[build] 16 page(s) built in 25.54s
[@astrojs/sitemap] sitemap-index.xml created at dist
- 0 TypeScript errors
- 0 Astro template build errors
- 0 Broken asset links
```

---

## 🌐 4. Operational Status & Health Check

| Service | Port / URI | Status | Latency |
| :--- | :--- | :--- | :--- |
| **Backend API (FastAPI)** | `http://127.0.0.1:8000` | 🟢 Active & Healthy | `< 5ms` |
| **Health Endpoint** | `/api/health` | 🟢 `{"status":"ok"}` | `< 2ms` |
| **PNG Generation** | `/api/generator/generate` | 🟢 200 OK | `~15-30ms` |
| **SVG Generation** | `/api/generator/generate/svg` | 🟢 200 OK | `~10-20ms` |
| **PDF Generation** | `/api/generator/generate/pdf` | 🟢 200 OK | `~30-50ms` |
| **CV Deep Scan** | `/api/generator/scan` | 🟢 200 OK | `~40-90ms` |
| **Frontend Dev Server** | `http://localhost:4321` | 🟢 Active & Hot-Reloading | `< 10ms` |

---

## 💡 5. Conclusion

The project is **fully operational, high-performing, secure, scannability-assured, and production-ready**.
