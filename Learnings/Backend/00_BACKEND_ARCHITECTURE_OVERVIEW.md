# ⚙️ 00 - Backend Architecture Overview

> **Executive architectural breakdown of the FastAPI async API server, Uvicorn worker process, Pydantic V2 data validation schemas, SlowAPI rate limiting, security middleware layers, and low-level subsystem topology.**

---

## 🏛️ 1. Architecture Paradigm & Server Pipeline

The backend of QR Code Maker 6 is built as a high-throughput, asynchronous RESTful microservice powered by **FastAPI** and **Python 3.11+ / 3.12+**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Incoming HTTP Request                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         Security & Limit Middlewares                         │
│  • LimitRequestBodyMiddleware (Enforces 5 MB Max Payload)                   │
│  • SecurityHeadersMiddleware (nosniff, SAMEORIGIN, XSS-Protection, CSP)     │
│  • SlowAPI Rate Limiter (120/min PNG, 60/min SVG/PDF, 10/min Batch)        │
│  • CORSMiddleware (Configurable origins)                                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    FastAPI Routers (Pydantic V2 Schemas)                    │
│  • routers/generator.py (/api/generator/*)                                  │
│  • routers/contact.py   (/api/contact)                                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       FastAPI Concurrency Delegation                         │
│                  `await run_in_threadpool(cpu_bound_func)`                  │
│       (Prevents CPU-intensive PIL/CV2 math from blocking async event loop)   │
└───────────────────┬─────────────────────────────────────┬───────────────────┘
                    │                                     │
┌───────────────────▼──────────────────┐   ┌──────────────▼──────────────────┐
│         Services Layer               │   │      Computer Vision Layer      │
│  • services/qr_service.py            │   │  • services/scan_service.py     │
│  • In-Memory Thread-Safe LRU Cache   │   │  • WeChat QR Deep Learning CNN  │
│  • High-Res Rendering & PDF/SVG      │   │  • OpenCV Filter Waterfall      │
└───────────────────┬──────────────────┘   └─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────────────────────┐
│                           Styling Engines Package                           │
│  • engines/dots/   (50+ custom module drawer algorithms)                    │
│  • engines/eyes/   (25+ outer eye frames, 20+ inner eyeballs)               │
│  • engines/frames/ (4,400+ lines of layout & text frames + Google Fonts)    │
│  • engines/logo/   (PyMuPDF vector rasterization, NumPy color masks)        │
│  • engines/core/   (Noise displacement math, deckled edges, crystal frames) │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 2. Backend Directory Topology

```
backend/
├── main.py                         # Application entrypoint, FastAPI instance, middleware chain
├── limiter.py                      # SlowAPI rate limiter configuration
├── qr_engine.py                    # Core matrix creation, module clearing math, gradient masks
├── frame_engine.py                 # Backward-compatibility proxy for layout & text framing
├── assets/
│   ├── fonts/                      # 12 TrueType Google Fonts (Outfit, Roboto, Poppins, etc.)
│   └── preset_logos/               # 46 official brand vector SVGs (Amazon, WhatsApp, X, etc.)
├── engines/
│   ├── core/
│   │   ├── noise.py                # Value noise, fractal octaves, deckled geometry, crystal lines
│   │   └── utils.py                # hex_to_rgb, color converters
│   ├── dots/
│   │   ├── custom_drawers.py       # 50+ PIL module drawer class implementations
│   │   ├── gradient.py             # CustomStyledPilImage & DiagonalGradiantColorMask
│   │   └── __init__.py             # MODULE_DRAWER_REGISTRY dictionary
│   ├── eyes/
│   │   ├── eye_frames.py           # 25+ outer eye frame drawing algorithms
│   │   ├── eyeballs.py             # 20+ inner eyeball pupil drawing algorithms
│   │   └── __init__.py             # draw_eye_frame & draw_eyeball exports
│   ├── frames/
│   │   ├── text_frames.py          # 4,400+ line layout framing engine & FONT_REGISTRY
│   │   └── __init__.py             # Framing engine exports
│   └── logo/
│       ├── processor.py            # PyMuPDF vector rasterizer, NumPy color distance, badges
│       └── __init__.py             # Logo processor exports & PRESET_LOGO_BRAND_COLORS
├── models/
│   └── wechat_qr/                  # OpenCV WeChat QR Caffe CNN Weights & Architecture
│       ├── detect.prototxt         # CNN Detection layer definition
│       ├── detect.caffemodel       # CNN Detection pre-trained weights (965 KB)
│       ├── sr.prototxt             # Super-Resolution layer definition
│       └── sr.caffemodel           # Super-Resolution pre-trained weights (24 KB)
├── routers/
│   ├── generator.py                # Endpoints: /generate, /generate/svg, /generate/pdf, /batch, /scan
│   └── contact.py                  # Endpoint: /api/contact
└── services/
    ├── qr_service.py               # Cache hashing, multi-format renderers, canvas shadows/borders
    └── scan_service.py             # WeChat QR CNN + PyZBar waterfall computer vision decoder
```

---

## 🛡️ 3. Security & Resilience Middleware Chain

### 1. Request Body Size Limit (`LimitRequestBodyMiddleware`):
Rejects payloads larger than **5 MB** (`HTTP 413 Payload Too Large`), preventing memory exhaustion denial-of-service attacks from oversized base64 uploads.

### 2. Defensive Security Headers (`SecurityHeadersMiddleware`):
Automatically attaches standard enterprise defense headers to all HTTP responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 3. Decompression Bomb Guard:
```python
Image.MAX_IMAGE_PIXELS = 10_000_000
```
Limits Pillow image allocations to 10 Megapixels, preventing malicious ZIP-bomb or image-bomb exploits from exhausting server RAM.
