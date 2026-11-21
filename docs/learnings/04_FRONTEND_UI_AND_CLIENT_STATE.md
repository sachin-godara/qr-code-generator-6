# 🖥️ 04 - Frontend UI, Client Architecture & Reactive State

> **Complete architectural analysis of the Astro 5 SSG structure, dynamic SEO engine, 4-language i18n system, 16 page templates, React 19 visual studio, Zustand reactive stores, WebRTC computer vision scanner, and interactive panel subsystems.**

---

## 🏛️ 1. Architecture Overview: Astro 5 + React 19 Islands

QR Code Maker 6 uses an **Island Architecture**:
- **Astro 5 SSG Outer Shell**: Serves ultra-fast static HTML pages, meta tags, hreflang alternates, and structured schemas with zero initial JavaScript overhead across 4 languages (`en`, `es`, `de`, `pt`).
- **React 19 Interactive Studio Island (`client:load`)**: Mounts the reactive QR Studio generator inside `frontend/src/react/QRGeneratorApp.tsx`.
- **React 19 Scanner Island (`client:load`)**: Mounts the standalone computer vision scanner inside `frontend/src/react/scanner/QRScannerApp.tsx`.

```
                    ┌──────────────────────────────────────────────┐
                    │            Astro 5 SSG Base Shell            │
                    │   (SEOHead, Navigation, Footer, Blog, MDX)   │
                    │     16 Page Templates & 4 Localized Trees    │
                    └──────────────────────┬───────────────────────┘
                                           │ mounts
                    ┌──────────────────────▼───────────────────────┐
                    │      React 19 Interactive Islands (React)    │
                    │  • QRGeneratorApp.tsx (Visual Studio)        │
                    │  • QRScannerApp.tsx (Computer Vision)        │
                    └──────────────┬───────────────────────────────┘
                                   │
        ┌──────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────┐                                       ┌───────────────┐
│ Left Column:  │                                       │ Right Column: │
│ Tabbed Studio │                                       │ Sticky Live   │
│ Editor Panels │                                       │ Visual Canvas │
└───────────────┘                                       └───────────────┘
```

---

## 🗃️ 2. Reactive State Management (Zustand 5)

Client state is decoupled into lightweight, performant Zustand stores:

### 1. `useQRStore.ts` (Core QR State)
Manages the visual specification dictionary `settings` conforming to `QRSettings`:
- `contentData` & `contentType` (URL, WiFi, VCard, SMS, etc.)
- `dots_style`, `dots_color`, `dots_color_end`, `gradient_type`
- `eye_frame_style`, `eyeball_style`, `eye_color`, `eyeball_color`, `link_eyes`
- `frame_style`, `frame_text`, `frame_color`, `font_name`, `frame_padding`, `frame_radius`
- `preset_logo`, `logo_image`, `logo_icon_style`, `logo_card_shape`, `logo_clear_size`
- `effect_shadow`, `effect_shadow_color`, `canvas_radius`, `canvas_border_width`
- `error_correction`, `quiet_zone`
- 30-level aesthetic vs text mutation undo/redo history stack
- Batch CSV dataset state (`batchCsvRows`, `batchDataColumn`, `batchFilenameColumn`)

### 2. `useDownloadStore.ts` (Export Engine State)
Manages output resolution, formats, and progress states:
- `downloadFormat`: `"PNG" | "SVG" | "PDF"`
- `downloadSize`: `512 | 1024 | 2048 (2K) | 4096 (4K) | 8192 (8K)`
- `noStretching`: boolean enforcing true mathematical aspect ratio
- `customFilename`: Custom string label
- Progress lifecycle flags: `isDownloading`, `downloadSuccess`, `isBatchGenerating`

---

## 📝 3. Content Protocol Parsers (`ContentForms.tsx`)

The studio includes dedicated form controls that format raw input into standardized URI protocols:

| Content Type | Protocol / Format | Generated URI Example |
| :--- | :--- | :--- |
| **Website URL** | HTTP/HTTPS | `https://generatecustomqr.com` |
| **Plain Text** | Raw string | `Hello from QR Code Maker!` |
| **Phone** | `tel:` URI | `tel:+1234567890` |
| **SMS** | `smsto:` URI | `smsto:+1234567890:Hello there` |
| **WhatsApp** | WhatsApp Click-to-Chat | `https://wa.me/1234567890?text=Hi` |
| **Email** | `mailto:` RFC 6068 | `mailto:contact@domain.com?subject=Inquiry` |
| **VCard 3.0** | Electronic Business Card | `BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\nFN:John Doe\nTEL:+123\nEND:VCARD` |
| **WiFi Network** | MeCard WiFi Standard | `WIFI:T:WPA;S:OfficeNet;P:SecretKey;H:false;;` |
| **Location** | Google Maps Search URI | `https://www.google.com/maps/search/?api=1&query=37.7749,-122.4194` |
| **Calendar Event**| iCalendar VEVENT standard | `BEGIN:VEVENT\nSUMMARY:Conference\nDTSTART:20260901T090000Z\nEND:VEVENT` |
| **UPI Payment** | NPCI UPI Protocol | `upi://pay?pa=merchant@upi&pn=Store&am=250.00&cu=INR` |
| **Crypto** | BIP-21 URI scheme | `bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.05` |
| **PayPal** | PayPal.me URI | `https://paypal.me/username/50` |
| **Social Links** | Direct Profile URLs | `https://instagram.com/user`, `https://x.com/user`, `https://github.com/user` |

---

## 🎛️ 4. Studio Panels Breakdown

### 1. `DesignPanel.tsx`
- **Dot Styles Grid**: Interactive visual cards with reactive SVG micro-previews (`DotPreview`).
- **Eye Corner Studio**: Outer frame and inner pupil selectors with independent corner unlinking toggle.
- **Color Engine**: Color pickers with hex inputs for solid color, vertical gradient, horizontal gradient, radial gradient, and diagonal gradients.
- **Invert Mode**: One-click dark mode inversion.

### 2. `FramesPanel.tsx`
- **Layout & Text Frames**: 40+ decorative frames (Polaroid, Speech Bubble, Ribbon, Art Deco, Cyberpunk, etc.).
- **Typography Selector**: 12 TrueType Google fonts loaded from registry (`PremiumFontSelect.tsx`).
- **Geometry Controls**: Live sliders for frame padding, border thickness, corner radius, and font size.

### 3. `LogoPanel.tsx`
- **File Dropzone**: Drag-and-drop custom PNG/JPG/WebP images with one-click background remover.
- **Preset Icon Gallery**: Searchable grid of 40+ brand logos filtered by categories (Social, Tech, Business, Media).
- **Visual Style Switcher**: `Brand Badge`, `Soft Glass (Duotone)`, `Pure Glyph`.

### 4. `EffectsPanel.tsx`
- **Shadow Presets**: None, Soft (subtle elevation), Elevated (deep 3D shadow), Neon Glow (vibrant multi-pass colored aura).
- **Canvas Border & Radius**: Outer rounded border and corner squircle radius adjustments.

### 5. `TemplatesPanel.tsx`
- 100+ one-click curated designer templates categorized by style (Minimal, Neon, Social, Corporate, Retro, Cyberpunk, Luxury).

### 6. `DownloadPanel.tsx`
- Format tabs: PNG, SVG, PDF.
- Resolution presets: 512px, 1024px (HD), 2048px (2K), 4096px (4K), 8192px (8K).
- Batch CSV processor with column mapping and auto-generated zipped archives.

---

## 📷 5. Standalone Scanner Application (`QRScannerApp.tsx`)

`QRScannerApp.tsx` provides a 3-tier decoding escalation pipeline:
1. **Tier 1**: Standard Client Scan via `html5-qrcode`.
2. **Tier 2**: Inverted Canvas Pre-processing for white-on-dark/dark-mode QR codes.
3. **Tier 3**: Backend Deep Scan escalation via FastAPI WeChat QR Caffe CNN neural network.
- Hardware flashlight/torch control, multi-camera switching, audio synthesized chime, haptic feedback pulse, and `localStorage` scan history with CSV/JSON export.

---

## 🌍 6. Internationalization & Multi-Region Routing

- **4 Locales**: English (`en`), Spanish (`es`), German (`de`), Portuguese (`pt`).
- **Clean Path Routing**: English at root `/`, others at `/{locale}/...`.
- **Hreflang Generation**: Automated `hreflang` tags across all 4 locales + `x-default` in `SEOHead.astro`.
- **Key Parity Verification**: Automated testing via `verify_i18n_keys.mjs` and `i18n.test.ts`.
