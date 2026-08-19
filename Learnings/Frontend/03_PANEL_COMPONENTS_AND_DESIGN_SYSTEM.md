# 🎛️ 03 - Studio Panels & Reusable UI Component System

> **Comprehensive reference for all 8 studio editor panels (`frontend/src/react/panels/`), protocol forms, 100+ designer templates, typography selectors, and reusable UI primitives.**

---

## 🏛️ 1. Studio Panels Topology

The studio editor is organized into 8 tabbed panel modules inside `frontend/src/react/panels/`:

```
frontend/src/react/panels/
├── ContentPanel.tsx      # Ingests & formats 15+ payload protocols (URL, WiFi, VCard, etc.)
├── TemplatesPanel.tsx    # 100+ one-click curated designer preset templates
├── DesignPanel.tsx       # 50+ dot styles, 25+ eye frames, 20+ eyeballs, gradients, colors
├── FramesPanel.tsx       # 40+ decorative frames, CTA text, 12 TrueType Google fonts
├── LogoPanel.tsx         # File dropzone, 40+ brand logos, visual style modes (Badge/Glass/Glyph)
├── EffectsPanel.tsx      # Shadows (Soft/Elevated/Neon), canvas borders, squircle radius
├── AdvancedPanel.tsx     # Reed-Solomon error correction (L/M/Q/H), quiet zones, box size
└── DownloadPanel.tsx     # High-res exports (PNG/SVG/PDF up to 8K), CSV batch generator
```

---

## 📝 2. Panel Deep-Dives

### 1. `ContentPanel.tsx` & `ContentForms.tsx`
Handles input validation and protocol encoding for 15 content types:
- **Website URL**: Enforces valid URL structure (`https://...`).
- **WiFi Network**: Generates standard MeCard strings (`WIFI:T:WPA;S:SSID;P:Key;H:false;;`).
- **Electronic Business Card (VCard 3.0)**: Form fields for Name, Org, Phone, Email, Address, Website, and Title.
- **WhatsApp & SMS**: Click-to-chat links with pre-filled text.
- **UPI & Crypto**: Digital currency addresses and payment amount parameters.
- **Calendar Event (VEVENT)**: Event title, start/end timestamps, location, and description.

### 2. `TemplatesPanel.tsx`
Loads **100+ curated presets** from `frontend/src/data/templates.ts` grouped into categories:
- `Minimalist`: Clean monochrome, high-density layouts.
- `Neon Cyberpunk`: Radiant glows, dark canvases, and fluorescent accents.
- `Corporate & Business`: Elegant navy, slate, and gold palettes with rounded squircle framing.
- `Social & Creator`: Official brand color schemes for Instagram, YouTube, TikTok, Spotify.
- `Retro & Vintage`: Polaroid frames, serif typography, and warm parchment tones.

### 3. `DesignPanel.tsx`
- **Dot Styles Matrix**: 50+ custom dot styles displayed in a responsive grid using `StylePreviewCard.tsx`.
- **Finder Eye Studio**: Independent selection of outer frame and inner eyeball pupil shapes. Includes the **Unlink Corners Toggle** to customize Top-Left, Top-Right, and Bottom-Left eyes separately.
- **Color & Gradient Engine**: Solid color pickers + Linear (Vertical, Horizontal, Diagonal TL-BR, Diagonal TR-BL) and Radial gradient controls.
- **Invert Colors Switch**: One-click dark mode inversion.

### 4. `FramesPanel.tsx`
- **Frame Style Selector**: 40+ layout frames (Polaroid, Speech Bubble, Heraldic Ribbon, Art Deco, Cyberpunk, Coupon).
- **CTA Text Inputs**: Top banner and bottom banner label editors.
- **Typography Dropdown (`PremiumFontSelect.tsx`)**: Custom select menu rendering 12 Google TrueType fonts in their actual visual typography.
- **Geometry Sliders**: Live adjustments for frame padding, border width, and corner radius.

### 5. `LogoPanel.tsx`
- **Custom Image Dropzone**: Drag-and-drop file uploader supporting PNG, JPG, WebP. Includes an automatic background removal toggle (`remove_logo_bg`) powered by NumPy Euclidean color distance.
- **Preset Brand Vector Gallery**: 40+ brand logos filtered by categories (Social, Tech, Business, Media) with live search.
- **Visual Style Switcher**:
  * `Brand Badge`: Brand-colored background card.
  * `Soft Glass (Duotone)`: 18% translucent glass card.
  * `Pure Glyph`: Clean standalone vector icon.
- **Card Shape & Size**: Badge shape (`None`, `Circle`, `Rounded Square`), logo size ratio ($0.05 \text{ to } 0.50$), and center clear margin slider.

### 6. `EffectsPanel.tsx`
- **Shadow Presets**: `none`, `soft` (gentle shadow), `elevated` (deep 3D elevation), `neon` (radiant colored glow).
- **Canvas Border & Radius**: Adds outer card borders with customizable width, color, and smooth squircle corner radius.

### 7. `AdvancedPanel.tsx`
- **Error Correction**: Level L (~7%), Level M (~15%), Level Q (~25%), Level H (~30%).
- **Quiet Zone**: Margin width adjustment (0 to 10 modules).
- **Box Size**: Module pixel resolution ($1 \text{ to } 30\text{ px/module}$).

### 8. `DownloadPanel.tsx`
- **Export Resolution**: 512px, 1024px (HD), 2048px (2K), 4096px (4K), 8192px (8K).
- **Format Selection**: PNG, lossless SVG, vector PDF.
- **No Stretching Option**: Enforces integer module grid scaling.
- **CSV Batch Generator**: Ingests spreadsheets, binds payload and filename columns, and streams zipped archives.

---

## 🧩 3. Reusable UI Primitives (`frontend/src/components/ui/`)

| Component | Responsibility |
| :--- | :--- |
| `Slider.tsx` | Custom range slider with continuous value display, min/max bounds, and responsive touch handling. |
| `PremiumFontSelect.tsx` | Custom dropdown menu rendering Google Fonts with live typographic previews. |
| `ScannabilityAlert.tsx` | Dynamic warning banner that alerts users when color contrast or complex shapes reduce scannability. |
| `StylePreviewCard.tsx` | Interactive thumbnail button rendering live SVG dot/eye previews with active selection rings. |
