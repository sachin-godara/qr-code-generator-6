# 🌐 00 - Frontend Architecture Overview

> **Executive architectural breakdown of the Astro 5 SSG / SSR shell, React 19 interactive visual studio island, Tailwind CSS 3.4 design token system, Zustand 5 state stores, and end-to-end directory topology.**

---

## 🏛️ 1. Architecture Paradigm: Island Hydration

QR Code Maker 6 implements a modern **Island Hydration Architecture** using **Astro 5** as the static application shell and **React 19** as the high-performance reactive studio engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Astro 5 SSG Shell                              │
│                                                                             │
│  • 21+ Pre-rendered Static Pages (Landing Pages, Category Pages, SEO Hub)    │
│  • Content Collections (Markdown Blog with Zod Schema Validation)           │
│  • Dynamic SEO Metadata (OpenGraph, Twitter Cards, JSON-LD Schemas, Sitemap)│
│  • Static Header, Navigation, Footer, and Legal Layouts                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Hydrates via `client:load`
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        React 19 Interactive Island                          │
│                       (frontend/src/react/App.tsx)                          │
│                                                                             │
│  • Two-Column Responsive Layout (Editor Panels Left, Sticky Preview Right)  │
│  • Zustand 5 Reactive Stores (`useQRStore`, `useDownloadStore`)             │
│  • TanStack React Query Preview Caching & Smart Debouncing                  │
│  • Client-Side Offscreen Canvas Vector Rasterization (`SvgIcons.tsx`)       │
│  • Real-time Scannability Contrast Meter & Quality Validation               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 2. Complete Frontend Directory Map

```
frontend/src/
├── components/
│   ├── SEOHead.astro               # Automated SEO meta tags, OpenGraph, JSON-LD schemas
│   ├── generator/forms/            # Content protocol input forms (URL, WiFi, VCard, UPI, etc.)
│   ├── icons/brandIcons.ts         # Brand metadata, official colors, and preset logo keywords
│   ├── layout/                     # Header.astro, Footer.astro, Navbar.tsx, Sidebar.tsx
│   ├── previews/
│   │   ├── SvgIcons.tsx            # 80KB+ SVG vector catalog & offscreen canvas rasterizer
│   │   └── StylePreviewCard.tsx    # Interactive thumbnail card for dots & eye styles
│   └── ui/
│       ├── PremiumFontSelect.tsx   # Custom dropdown with live Google Font preview typography
│       ├── ScannabilityAlert.tsx   # Live WCAG contrast warning bar
│       └── Slider.tsx              # Customized range slider with value indicators
├── content/
│   └── blog/                       # Markdown articles for SEO content marketing
├── content.config.ts               # Astro Content Collection definitions & Zod schemas
├── data/
│   ├── options.ts                  # Dropdown options, frame types, error correction levels
│   └── templates.ts                # 100+ curated designer preset templates
├── hooks/
│   ├── useDebounce.ts              # Smart 0ms discrete / 150ms continuous debounce hook
│   ├── useDownloadHandlers.ts      # Multi-format download, clipboard copy, batch ZIP generation
│   ├── useKeyboardShortcuts.ts     # Studio keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+D)
│   ├── useMiniPreview.ts           # IntersectionObserver for sticky floating preview trigger
│   ├── useOnlineStatus.ts          # Window online/offline connectivity listener
│   └── useToast.ts / useToastStore # Ephemeral notification system
├── layouts/
│   ├── BaseLayout.astro            # Master HTML layout with fonts, theme scripts, SEOHead
│   └── LegalLayout.astro           # Markdown article wrapper for Privacy, Terms, Disclaimer
├── pages/
│   ├── index.astro                 # Primary Studio Home Page
│   ├── free-qr-code-generator.astro# SEO Target Page
│   ├── url-qr-code-generator.astro # Dedicated URL QR Generator Page
│   ├── wifi-qr-code.astro          # Dedicated WiFi QR Generator Page
│   ├── vcard-qr-code.astro         # Dedicated Contact Card Page
│   ├── qr-code-with-logo.astro     # Dedicated Brand Logo Page
│   ├── qr-code-scanner.astro       # Client Camera & File Scanner Page
│   ├── blog/[...slug].astro        # Dynamic Markdown Blog Article Route
│   └── 404.astro / 500.astro       # Error recovery pages
├── react/
│   ├── App.tsx                     # Main Studio Orchestrator Component
│   ├── panels/                     # Content, Design, Frames, Logo, Effects, Templates, Download
│   ├── preview/                    # DesktopPreviewPane, MobileBottomBar, FullscreenLightbox
│   └── scanner/QRScannerApp.tsx    # WebRTC Camera & File Computer Vision Scanner
├── services/
│   └── qrApi.ts                    # Axios/Fetch API client for FastAPI backend endpoints
├── store/
│   ├── useQRStore.ts               # Core QR styling state & 30-level undo/redo history
│   └── useDownloadStore.ts         # Export formats, resolution scaling, batch progress
├── styles/
│   ├── global.css                  # Tailwind directives, CSS variables, glassmorphism tokens
│   ├── blog.css                    # Prose typography styling for blog content
│   └── how-to-use.css              # Custom interactive guide styling
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
