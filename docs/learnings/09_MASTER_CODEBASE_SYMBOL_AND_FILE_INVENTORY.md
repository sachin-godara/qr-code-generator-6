# 📚 09 - Master Codebase File & Symbol Inventory

> **Exhaustive file-by-file, directory-by-directory inventory mapping every single file, line count, architectural purpose, exported classes, functions, types, and dependencies across the entire repository.**

---

## 🏛️ 1. Complete Codebase Directory & File Catalog

```
QR Code Maker 6 Repository Topology
├── .agents/                                # AI Agent rules, skills, and execution manifests
│   ├── AGENTS.md                           # Master project guidelines & mandatory quality gates
│   └── skills.json                         # Skill registry definitions
├── backend/                                # Python FastAPI async API server & rendering engines
│   ├── main.py                             # FastAPI entrypoint, middlewares, routers
│   ├── limiter.py                          # SlowAPI rate limiting configuration
│   ├── qr_engine.py                        # Low-level QR matrix, drawer dispatch, gradient masks
│   ├── frame_engine.py                     # Backward-compatibility frame proxy
│   ├── download_models.py                  # OpenCV WeChat QR CNN model downloader
│   ├── conftest.py                         # Pytest environment setup
│   ├── requirements.txt                    # Python package dependencies
│   ├── Dockerfile                          # Multi-stage Python backend Dockerfile
│   ├── .env.production.example             # Production environment variable template
│   ├── assets/
│   │   ├── fonts/                          # 12 Google TrueType font files (.ttf)
│   │   └── preset_logos/                   # 46 Brand vector SVG files
│   ├── engines/
│   │   ├── core/noise.py                   # 1D/2D value & fractal noise algorithms
│   │   ├── core/utils.py                   # Color math, hex_to_rgb converter
│   │   ├── dots/custom_drawers.py          # 50+ PIL module drawer class implementations
│   │   ├── dots/gradient.py                # Diagonal/Radial/Vertical PIL gradient color masks
│   │   ├── dots/__init__.py                # MODULE_DRAWER_REGISTRY dictionary
│   │   ├── eyes/eye_frames.py              # 25+ outer eye finder frame drawers
│   │   ├── eyes/eyeballs.py                # 20+ inner eyeball pupil drawers
│   │   ├── eyes/__init__.py                # draw_eye_frame & draw_eyeball dispatchers
│   │   ├── frames/text_frames.py           # 4,400+ lines of layout framing templates & Google Fonts
│   │   ├── frames/__init__.py              # apply_layout_frame export
│   │   ├── logo/processor.py               # PyMuPDF vector SVG rasterizer & Euclidean bg removal
│   │   └── logo/__init__.py                # PRESET_LOGO_BRAND_COLORS & processor exports
│   ├── models/wechat_qr/                   # WeChat QR Caffe CNN architecture & weights
│   ├── routers/
│   │   ├── generator.py                    # REST endpoints: /generate, /generate/svg, /generate/pdf, /batch, /scan
│   │   └── contact.py                      # REST endpoint: /api/contact
│   ├── services/
│   │   ├── qr_service.py                   # Cache hashing, multi-format renderers, canvas post-processing
│   │   └── scan_service.py                 # WeChat QR CNN + OpenCV + PyZBar waterfall decoder
│   └── tests/
│       ├── test_api_routes.py              # REST API endpoint tests & validation bounds
│       ├── test_engines.py                 # Low-level drawer & frame unit tests
│       ├── test_performance_cache.py       # LRU cache benchmarks & latency measurement
│       ├── test_qr_service.py              # Image/SVG generation & crisp 1:1 scaling tests
│       ├── test_security.py                # Defensive headers, path traversal, XSS sanitization tests
│       └── test_template_scannability.py   # 100% automated scannability gate across all presets
├── frontend/                               # Astro 5 SSG + React 19 Interactive Studio & Scanner
│   ├── astro.config.mjs                    # Astro configuration & React/Tailwind integrations
│   ├── vitest.config.ts                    # Vitest configuration for client testing
│   ├── package.json                        # Frontend dependencies & scripts
│   ├── tsconfig.json                       # TypeScript compiler configuration
│   ├── generate_previews.mjs               # Node.js/Sharp batch preview PNG generator
│   ├── nginx.conf                          # Production Nginx reverse proxy configuration
│   ├── Dockerfile                          # Frontend static build Dockerfile
│   ├── public/                             # Static assets, favicon, preview thumbnails
│   ├── scripts/                            # SEO & i18n analysis scripts (7 audit scripts)
│   │   ├── audit_seo.mjs                   # Crawls build output for title/description/canonical
│   │   ├── audit_seo_health.mjs            # H1 tag and image alt attribute health checker
│   │   ├── compare_seo_commits.mjs         # Git commit diff analysis for SEO regressions
│   │   ├── deep_analysis_all_pages.mjs     # Readability & keyword density auditor
│   │   ├── fix_duplicate_h1.mjs            # AST transform script for H1 deduplication
│   │   ├── seo_analyzer.mjs                # JSON-LD Schema.org microdata validator
│   │   └── verify_i18n_keys.mjs            # Parity auditor ensuring 100% key symmetry (en/es/de/pt)
│   └── src/
│       ├── content.config.ts               # Astro Content Collection schema definitions
│       ├── content/blog/                   # Multilingual Markdown articles (en, es, de, pt)
│       ├── data/
│       │   ├── options.ts                  # Dropdown choices (50+ dots, 25+ eyes, 40+ frames, gradients)
│       │   └── templates.ts                # 100+ curated designer preset templates (80 KB)
│       ├── hooks/
│       │   ├── useDebounce.ts              # Smart 0ms discrete / 150ms continuous debounce hook
│       │   ├── useDownloadHandlers.ts      # Multi-format download, clipboard copy, batch ZIP generation
│       │   ├── useKeyboardShortcuts.ts     # Studio hotkeys (Ctrl+Z, Ctrl+Y, Ctrl+D, Escape)
│       │   ├── useMiniPreview.ts           # IntersectionObserver for sticky floating preview trigger
│       │   ├── useOnlineStatus.ts          # Window online/offline connectivity listener
│       │   └── useToast.ts                 # Ephemeral toast notification hook
│       ├── i18n/
│       │   ├── config.ts                   # Locale definitions (en, es, pt, de), flags, hreflangs
│       │   ├── utils.ts                    # URL parsers, clean pathname stripper, t() translation lookup
│       │   ├── useTranslation.tsx          # React TranslationContext & useTranslation() hook
│       │   ├── blogTranslations.ts         # Localized blog metadata, author cards, reading times
│       │   ├── locales/                    # Master UI dictionaries (~160 KB total)
│       │   │   ├── en.json / es.json / de.json / pt.json
│       │   └── seo/                        # Localized page meta titles, descriptions & FAQs
│       │       └── en.json / es.json / de.json / pt.json
│       ├── layouts/
│       │   ├── BaseLayout.astro            # Master HTML layout with fonts, theme scripts, SEOHead
│       │   └── LegalLayout.astro           # Markdown article wrapper for Privacy, Terms, Disclaimer
│       ├── page-templates/                 # 16 Reusable Page Templates
│       │   ├── HomePage.astro / FreeGenPage.astro / UrlQrPage.astro / WifiQrPage.astro
│       │   ├── VCardQrPage.astro / EmailQrPage.astro / EventQrPage.astro / LogoQrPage.astro
│       │   ├── ScannerPage.astro / HowToUsePage.astro / BlogIndexPage.astro / BlogPostPage.astro
│       │   └── AboutPage.astro / ContactPage.astro / PrivacyPage.astro / TermsPage.astro
│       ├── pages/                          # Astro Static File Routing
│       │   ├── index.astro                 # Root English Homepage
│       │   ├── free-qr-code-generator.astro / url-qr-code-generator.astro / wifi-qr-code.astro ...
│       │   ├── es/                         # Spanish Route Tree (14 localized pages)
│       │   ├── de/                         # German Route Tree (14 localized pages)
│       │   ├── pt/                         # Portuguese Route Tree (14 localized pages)
│       │   ├── blog/[...slug].astro        # Dynamic Multilingual Blog Route
│       │   └── 404.astro / 500.astro       # Branded error recovery pages
│       ├── components/
│       │   ├── SEOHead.astro               # Automated SEO meta tags, hreflang alternates, JSON-LD
│       │   ├── generator/forms/            # Content protocol input forms (ContentForms.tsx)
│       │   ├── layout/                     # Header.astro, Footer.astro, LanguageSwitcher.astro
│       │   ├── previews/                   # SvgIcons.tsx (80 KB vector catalog), StylePreviewCard.tsx
│       │   └── ui/                         # PremiumFontSelect.tsx, ScannabilityAlert.tsx, Slider.tsx
│       ├── react/
│       │   ├── App.tsx                     # React root orchestrator & state debouncing
│       │   ├── QRGeneratorApp.tsx          # Studio container with responsive layout
│       │   ├── ErrorBoundary.tsx           # React UI crash containment boundary
│       │   ├── components/                 # ReactLanguageSwitcher.tsx
│       │   ├── panels/*.tsx                # 8 Studio tab panels (Content, Design, Frames, Logo, etc.)
│       │   ├── preview/*.tsx               # DesktopPreviewPane, MobileBottomBar, FullscreenLightbox
│       │   └── scanner/QRScannerApp.tsx    # 85 KB WebRTC Camera & File Computer Vision Scanner
│       ├── services/qrApi.ts               # Typed fetch client, abort controller, batch endpoint
│       ├── store/
│       │   ├── useQRStore.ts               # Primary Zustand store (settings, 30-level undo/redo history)
│       │   ├── useDownloadStore.ts         # Export format, resolution, batch settings store
│       │   └── useToastStore.ts            # Ephemeral toast alert queue
│       ├── styles/                         # global.css, blog.css, how-to-use.css, legal.css
│       ├── types/qr.ts                     # TypeScript interfaces and default state tokens
│       ├── utils/scannability.ts           # Relative luminance, WCAG contrast, scannability math
│       └── tests/                          # 7 Vitest Unit & Integration Test Suites
│           ├── setupTests.ts / App.test.tsx / QRScannerApp.test.ts / i18n.test.ts
│           └── qrApi.test.ts / scannability.test.ts / useQRStore.test.ts
├── mcp-server-qrcode-enhanced/             # Model Context Protocol (MCP) server
│   ├── package.json                        # MCP server manifest & dependencies
│   ├── tsconfig.json                       # MCP TypeScript configuration
│   ├── README.md & EXAMPLES.md             # MCP tool documentation & sample payloads
│   └── src/
│       ├── index.ts                        # MCP Server entrypoint & 13 registered tool handlers
│       ├── qr-utils.ts                     # Node QR generation, sharp rasterization, telemetry
│       └── types.ts                        # Zod schemas (QRStyleSchema, VCardSchema, etc.)
└── scripts/                                # Offline automation & asset generators
    ├── add_docs_pdf.py                     # Programmatic SVG icon injection
    ├── gen_all_templates.js                # Headless template rasterizer
    ├── gen_custom_frames.py                # Frame thumbnail generator
    ├── gen_new_previews.py                 # Module style preview thumbnail generator
    ├── gen_saturated_previews.py           # Gradient template generator
    └── gen_scooter_frames.py               # Scooter/Beer frame generator
```

---

## 🔍 2. File-by-File Detailed Specification

### Backend Core (`backend/`)
| File | Lines | Primary Export / Symbol | Dependencies | Architectural Role |
| :--- | :--- | :--- | :--- | :--- |
| `main.py` | 110 | `app: FastAPI` | FastAPI, SlowAPI, PIL, Routers | Configures middleware pipeline, CORS, rate limits, exception handlers. |
| `limiter.py` | 24 | `limiter: Limiter` | slowapi | In-memory IP rate limiter (120/min PNG, 60/min SVG/PDF, 10/min Batch). |
| `qr_engine.py` | 380 | `generate_qr_matrix`, `apply_color_mask` | qrcode, PIL, NumPy | Builds raw Boolean matrix, clears finder centers, applies gradient masks. |
| `frame_engine.py` | 8 | `apply_layout_frame` | `engines.frames` | Backward-compatibility facade for layout framing. |
| `routers/generator.py` | 310 | `router: APIRouter` | FastAPI, Pydantic V2, qr_service | Endpoints for `/generate`, `/generate/svg`, `/generate/pdf`, `/batch`, `/scan`. |
| `routers/contact.py` | 35 | `contact_router: APIRouter` | FastAPI, Pydantic V2 | Endpoint for contact form submission and validation. |
| `services/qr_service.py` | 580 | `generate_qr_image`, `generate_qr_svg`, `generate_qr_pdf` | PIL, PyMuPDF, fitz | Caching with MD5 hash, multi-format rendering, canvas shadow/border post-processing. |
| `services/scan_service.py` | 180 | `deep_scan_qr` | OpenCV (cv2), PyZBar, NumPy | Dual-engine computer vision decoder (WeChat QR CNN + OpenCV filter waterfall). |
| `engines/dots/custom_drawers.py` | 1,450 | `CustomDrawerBase`, 50+ Drawer Classes | PIL (ImageDraw, ImagePath) | Custom dot drawing geometry (diamonds, stars, clovers, liquid drops, circuit). |
| `engines/eyes/eye_frames.py` | 980 | `draw_eye_frame` | PIL (ImageDraw) | 25+ outer eye finder pattern frames (squircle, leaf, crystal, droplet, etc.). |
| `engines/eyes/eyeballs.py` | 580 | `draw_eyeball` | PIL (ImageDraw) | 20+ inner eyeball pupil shapes (gear, diamond, circle, sheared, flower, etc.). |
| `engines/frames/text_frames.py` | 4,400 | `apply_layout_frame`, `FONT_REGISTRY` | PIL, ImageFont | 40+ layout & text frames (call-to-action badges, banners, delivery scooter, etc.). |
| `engines/logo/processor.py` | 160 | `process_logo_overlay`, `make_color_transparent` | PyMuPDF (fitz), PIL, NumPy | Vector SVG rasterization, Euclidean background removal, badge card masks. |

---

### Frontend Core (`frontend/src/`)
| File | Lines | Primary Export / Symbol | Dependencies | Architectural Role |
| :--- | :--- | :--- | :--- | :--- |
| `react/App.tsx` | 240 | `App: React.FC` | React, Zustand, TanStack Query | Root orchestrator, 150ms/0ms debounced preview fetching, responsive state. |
| `react/QRGeneratorApp.tsx` | 160 | `QRGeneratorApp: React.FC` | React, Framer Motion | Main studio split-view container (left tabs panel, right preview pane). |
| `react/scanner/QRScannerApp.tsx` | 1,946 | `QRScannerApp`, `parseQRContent` | html5-qrcode, Lucide, qrApi | 85 KB WebRTC camera scanner, 3-tier fallback decoding, multi-format parser, history. |
| `i18n/config.ts` | 63 | `locales`, `localeConfig`, `isValidLocale` | TypeScript | Core 4-locale configuration (en, es, pt, de), flags, OpenGraph locales. |
| `i18n/utils.ts` | 145 | `getLocaleFromUrl`, `getLocalizedUrl`, `t` | i18n locales & seo JSON | URL parsers, clean pathname stripper, t() translation engine with parameter interpolation. |
| `i18n/useTranslation.tsx` | 48 | `TranslationProvider`, `useTranslation` | React | Context provider and custom translation hook for React islands. |
| `data/templates.ts` | 2,682 | `PRESET_TEMPLATES: Template[]` | qr.ts | 100+ curated designer preset templates across 8 style categories (80 KB). |
| `data/options.ts` | 206 | `DOT_STYLES`, `EYE_FRAME_STYLES`, etc. | TypeScript | Dropdown enum options (50+ dots, 25+ eyes, 20+ eyeballs, 40+ frames). |
| `store/useQRStore.ts` | 180 | `useQRStore` | Zustand | Primary state store, 30-level undo/redo history, reset/update actions. |
| `store/useDownloadStore.ts` | 60 | `useDownloadStore` | Zustand | Export format (PNG/SVG/PDF), resolution (64–8192px), batch items state. |
| `services/qrApi.ts` | 190 | `fetchQRPreview`, `downloadQR`, `generateBatch` | Fetch API, SvgIcons | Typed API service communicating with FastAPI backend. |
| `components/previews/SvgIcons.tsx` | 2,100 | `getReactLogoPngDataUrl`, `PRESET_LOGO_BRAND_COLORS` | React, Canvas API | 80KB master vector engine for instant client preview and logo rasterization. |
| `utils/scannability.ts` | 140 | `calculateScannabilityScore` | Pure Math | Relative luminance calculation, WCAG contrast ratio, scannability scoring. |
| `hooks/useKeyboardShortcuts.ts` | 50 | `useKeyboardShortcuts` | React | Global keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+D, Escape). |
| `hooks/useDownloadHandlers.ts` | 90 | `useDownloadHandlers` | React, qrApi | Handles file download triggers, clipboard copies, and toast notifications. |
| `tests/QRScannerApp.test.ts` | 102 | Vitest Test Suite | parseQRContent | Unit tests validating WiFi, vCard, HTTPS, mailto, tel, sms, geo, and event decoding. |
| `tests/i18n.test.ts` | 93 | Vitest Test Suite | i18n/utils.ts | Unit tests validating translation lookup, interpolation, and multi-region hreflang URLs. |

---

### MCP Server Core (`mcp-server-qrcode-enhanced/`)
| File | Lines | Primary Export / Symbol | Dependencies | Architectural Role |
| :--- | :--- | :--- | :--- | :--- |
| `src/index.ts` | 902 | `EnhancedQRCodeMCPServer` | @modelcontextprotocol/sdk | MCP server with 13 registered tool handlers, JSON-RPC stdio transport. |
| `src/qr-utils.ts` | 581 | `QRCodeEnhanced` | qrcode, sharp, jimp, jsqr | Node.js QR generation, Sharp image processing, telemetry statistics. |
| `src/types.ts` | 164 | `QRConfigSchema`, `QRStyleSchema`, etc. | zod | Strict runtime type validation schemas and custom error classes. |
