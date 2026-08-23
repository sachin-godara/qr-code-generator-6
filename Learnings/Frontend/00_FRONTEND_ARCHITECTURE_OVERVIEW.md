# 🌐 00 - Frontend Architecture Overview

> **Executive architectural breakdown of the Astro 5 SSG / SSR shell, React 19 interactive visual studio island, 4-language i18n system, Tailwind CSS 3.4 design token system, Zustand 5 state stores, and end-to-end directory topology.**

---

## 🏛️ 1. Architecture Paradigm: Island Hydration & Static Multi-Region Routing

QR Code Maker 6 implements a high-performance **Island Hydration Architecture** using **Astro 5** as the static application shell and **React 19** as the reactive visual studio engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Astro 5 SSG Static Multi-Region Shell                 │
│                                                                             │
│  • 16 Reusable Page Templates (HomePage, Wifi, VCard, Url, Scanner, etc.)   │
│  • 4 Fully Localized Language Trees (English root `/`, `/es/`, `/de/`, `/pt/`)│
│  • Multilingual Content Collections (Markdown Blog with Zod validation)     │
│  • Dynamic SEO Engine (Canonical URLs, OpenGraph, Twitter, JSON-LD Schemas) │
│  • Static Header, Navigation Dropdowns, Footer, and Legal Layouts           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Hydrates via `client:load`
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        React 19 Interactive Island                          │
│                   (frontend/src/react/QRGeneratorApp.tsx)                   │
│                                                                             │
│  • Two-Column Responsive Layout (Editor Panels Left, Sticky Preview Right)  │
│  • Zustand 5 Reactive Stores (`useQRStore`, `useDownloadStore`)             │
│  • TanStack React Query Preview Caching & Smart Debouncing                  │
│  • Client-Side Offscreen Canvas Vector Rasterization (`SvgIcons.tsx`)       │
│  • Real-time Scannability Contrast Meter & Quality Validation               │
│  • WebRTC Computer Vision Scanner Island (`QRScannerApp.tsx`)              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 2. Complete Frontend Directory Map

```
frontend/src/
├── components/
│   ├── SEOHead.astro               # Automated SEO meta tags, hreflang alternates, JSON-LD
│   ├── generator/forms/            # Content protocol input forms (ContentForms.tsx)
│   ├── layout/                     # Header.astro, Footer.astro, LanguageSwitcher.astro
│   ├── previews/
│   │   ├── SvgIcons.tsx            # 80 KB+ SVG vector catalog & offscreen canvas rasterizer
│   │   └── StylePreviewCard.tsx    # Interactive thumbnail card for dots & eye styles
│   └── ui/
│       ├── PremiumFontSelect.tsx   # Custom dropdown with live Google Font typography
│       ├── ScannabilityAlert.tsx   # Live WCAG contrast & quality warning bar
│       └── Slider.tsx              # Customized range slider with continuous indicators
├── content/
│   └── blog/                       # Multilingual Markdown articles (en, es, de, pt)
├── content.config.ts               # Astro Content Collection definitions & Zod schemas
├── data/
│   ├── options.ts                  # Dropdown options (50+ dots, 25+ eyes, 40+ frames, gradients)
│   └── templates.ts                # 100+ curated designer preset templates (80 KB)
├── hooks/
│   ├── useDebounce.ts              # Smart 0ms discrete / 150ms continuous debounce hook
│   ├── useDownloadHandlers.ts      # Multi-format download, clipboard copy, batch ZIP generation
│   ├── useKeyboardShortcuts.ts     # Studio hotkeys (Ctrl+Z, Ctrl+Y, Ctrl+D, Escape)
│   ├── useMiniPreview.ts           # IntersectionObserver for sticky floating preview trigger
│   ├── useOnlineStatus.ts          # Window online/offline connectivity listener
│   └── useToast.ts / useToastStore # Ephemeral notification system
├── i18n/
│   ├── config.ts                   # Locale definitions (en, es, pt, de), flags, hreflangs
│   ├── utils.ts                    # URL parsers, clean pathname stripper, t() translation lookup
│   ├── useTranslation.tsx          # React TranslationContext & useTranslation() hook
│   ├── blogTranslations.ts         # Localized blog metadata, author cards, reading times
│   ├── locales/                    # Master UI dictionaries (~160 KB total)
│   │   ├── en.json / es.json / de.json / pt.json
│   └── seo/                        # Localized page meta titles, descriptions & FAQs
│       └── en.json / es.json / de.json / pt.json
├── layouts/
│   ├── BaseLayout.astro            # Master HTML layout with fonts, theme scripts, SEOHead
│   └── LegalLayout.astro           # Markdown article wrapper for Privacy, Terms, Disclaimer
├── page-templates/                 # 16 Reusable Page Templates
│   ├── HomePage.astro              # Master Studio & Format Hub
│   ├── FreeGenPage.astro           # Free QR Generator High-Intent Landing Page
│   ├── UrlQrPage.astro             # Dedicated Website URL Landing Page
│   ├── WifiQrPage.astro            # Dedicated WiFi Network Landing Page
│   ├── VCardQrPage.astro           # Dedicated Digital Business Card Page
│   ├── EmailQrPage.astro           # Dedicated Email Generator Page
│   ├── EventQrPage.astro           # Dedicated iCalendar Event Generator Page
│   ├── LogoQrPage.astro            # Dedicated Brand Logo Overlay Page
│   ├── ScannerPage.astro           # Dedicated Camera & File QR Scanner Page
│   ├── HowToUsePage.astro          # 72 KB Comprehensive Visual Step-by-Step Guide
│   ├── BlogIndexPage.astro         # SEO Blog Hub with Search & Category Filters
│   ├── BlogPostPage.astro          # Markdown Article Layout with TOC & Author Card
│   ├── AboutPage.astro             # Platform Mission & Technology Architecture
│   ├── ContactPage.astro           # Contact Form with Honeypot Spam Defense
│   ├── PrivacyPage.astro           # GDPR & CCPA Data Governance Statement
│   └── TermsPage.astro             # Terms of Service Agreement
├── pages/                          # Astro Static File Routing
│   ├── index.astro                 # Root English Homepage
│   ├── free-qr-code-generator.astro# English Landing Pages
│   ├── url-qr-code-generator.astro / wifi-qr-code.astro / vcard-qr-code.astro ...
│   ├── es/                         # Spanish Route Tree (14 localized pages)
│   ├── de/                         # German Route Tree (14 localized pages)
│   ├── pt/                         # Portuguese Route Tree (14 localized pages)
│   ├── blog/[...slug].astro        # Dynamic Multilingual Blog Route
│   └── 404.astro / 500.astro       # Branded error recovery pages
├── react/
│   ├── App.tsx                     # Main Studio Orchestrator Component
│   ├── QRGeneratorApp.tsx          # React 19 Client Entrypoint with TranslationProvider
│   ├── ErrorBoundary.tsx           # UI Crash Protection & Graceful Recovery
│   ├── components/                 # ReactLanguageSwitcher.tsx
│   ├── panels/                     # Content, Design, Frames, Logo, Effects, Templates, Advanced, Download
│   ├── preview/                    # DesktopPreviewPane, MobileBottomBar, FullscreenLightbox
│   └── scanner/QRScannerApp.tsx    # 85 KB WebRTC Camera & File Computer Vision Scanner
├── services/
│   └── qrApi.ts                    # Typed Fetch client for FastAPI backend endpoints
├── store/
│   ├── useQRStore.ts               # Core QR styling state & 30-level undo/redo history
│   ├── useDownloadStore.ts         # Export formats, resolution scaling, batch progress
│   └── useToastStore.ts            # Ephemeral toast alert queue
├── styles/
│   ├── global.css                  # Tailwind directives, CSS variables, glassmorphism tokens
│   ├── blog.css                    # Prose typography styling for blog content
│   ├── how-to-use.css              # Custom interactive guide styling
│   └── legal.css                   # High-legibility legal terms typography
├── tests/
│   ├── setupTests.ts               # Vitest + Jest-DOM test environment setup
│   ├── App.test.tsx                # Studio root render & query client integration test
│   ├── QRScannerApp.test.ts        # Scanner payload parser unit tests (8 test cases)
│   ├── i18n.test.ts                # Translation lookup & URL utility tests
│   ├── qrApi.test.ts               # API service layer integration tests
│   ├── scannability.test.ts        # Contrast & scannability math unit tests
│   └── useQRStore.test.ts          # Zustand state transitions & undo/redo stack tests
├── types/
│   └── qr.ts                       # TypeScript interfaces for QRSettings, templates, history
└── utils/
    └── scannability.ts             # sRGB luminance math, contrast calculator, penalty evaluator
```

---

## 🎨 3. Design System & CSS Tokens

The design system is defined in `frontend/src/styles/global.css` with dark-mode first glassmorphism:

### Core Visual Tokens:
- **Surface Dark**: `#0a0b10` (Master canvas background).
- **Surface Card**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(255, 255, 255, 0.08)`.
- **Primary Gradient**: Linear gradient from `#6366f1` (Indigo) to `#8b5cf6` (Purple) to `#ec4899` (Pink).
- **Accent Glow**: `rgba(99, 102, 241, 0.25)` drop shadows.
- **Typography Stack**: `Outfit` (Primary UI), `Inter` (Body prose), `Space Grotesk` (Technical accents).

---

## 📚 4. Navigation to Frontend Learning Chapters

1. [**`00_FRONTEND_ARCHITECTURE_OVERVIEW.md`**](./00_FRONTEND_ARCHITECTURE_OVERVIEW.md) — Astro 5 SSG + React 19 island hydration & directory topology.
2. [**`01_REACT_STUDIO_AND_APP_LIFECYCLE.md`**](./01_REACT_STUDIO_AND_APP_LIFECYCLE.md) — App.tsx orchestration, smart 0ms/150ms debouncing, and TanStack Query caching.
3. [**`02_STATE_MANAGEMENT_AND_CUSTOM_HOOKS.md`**](./02_STATE_MANAGEMENT_AND_CUSTOM_HOOKS.md) — Zustand stores (`useQRStore`, `useDownloadStore`), 30-level undo/redo, and keyboard shortcuts.
4. [**`03_PANEL_COMPONENTS_AND_DESIGN_SYSTEM.md`**](./03_PANEL_COMPONENTS_AND_DESIGN_SYSTEM.md) — Breakdown of all 8 studio panels and reusable UI primitives.
5. [**`04_CLIENT_CANVAS_AND_SVG_PREVIEW_PIPELINE.md`**](./04_CLIENT_CANVAS_AND_SVG_PREVIEW_PIPELINE.md) — Offscreen canvas rasterization (`SvgIcons.tsx`), desktop sticky preview, and mobile drawer.
6. [**`05_SCANNABILITY_CALCULATOR_AND_VALIDATION.md`**](./05_SCANNABILITY_CALCULATOR_AND_VALIDATION.md) — sRGB relative luminance math, contrast ratios, and penalty algorithms.
7. [**`06_ASTRO_PAGES_SEO_AND_CONTENT_COLLECTIONS.md`**](./06_ASTRO_PAGES_SEO_AND_CONTENT_COLLECTIONS.md) — 16 Page Templates, multi-region routing, `SEOHead.astro`, and Markdown collections.
8. [**`07_FRONTEND_TESTS_UTILITIES_AND_SERVICES.md`**](./07_FRONTEND_TESTS_UTILITIES_AND_SERVICES.md) — Vitest testing suite, custom React hooks, `qrApi.ts`, `brandIcons.ts`, and clipboard/download handlers.
9. [**`08_SEO_AND_SEARCH_ENGINE_OPTIMIZATION.md`**](./08_SEO_AND_SEARCH_ENGINE_OPTIMIZATION.md) — Master SEO reference, Core Web Vitals, Schema.org rich snippets, keyword intent matrix, and blog clustering.
10. [**`09_I18N_AND_MULTILINGUAL_ROUTING_ARCHITECTURE.md`**](./09_I18N_AND_MULTILINGUAL_ROUTING_ARCHITECTURE.md) — 4-language i18n system, dictionaries, translation hooks, and parity validation.
11. [**`10_COMPUTER_VISION_SCANNER_AND_WEBRTC_PIPELINE.md`**](./10_COMPUTER_VISION_SCANNER_AND_WEBRTC_PIPELINE.md) — 85 KB WebRTC camera scanner, 3-tier fallback decoding, multi-format payload parser, audio/vibration feedback.
12. [**`11_PAGE_TEMPLATES_AND_LANDING_PAGE_ARCHITECTURE.md`**](./11_PAGE_TEMPLATES_AND_LANDING_PAGE_ARCHITECTURE.md) — 16 Page Templates, template-delegation architecture, and structured schema injection.
13. [**`12_TEMPLATE_PRESETS_AND_STYLE_CATALOG_SYSTEM.md`**](./12_TEMPLATE_PRESETS_AND_STYLE_CATALOG_SYSTEM.md) — 100+ curated designer templates, options enums, 80 KB vector SVG icon library, and 1-click apply mechanics.
