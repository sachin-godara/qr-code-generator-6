# 🎨 12 - Template Presets & Visual Style Catalog System

> **Exhaustive breakdown of the 100+ curated designer preset templates (`frontend/src/data/templates.ts`), the options catalog (`frontend/src/data/options.ts`), the 80 KB vector SVG icon library (`SvgIcons.tsx`), and the 1-click template application pipeline.**

---

## 🏛️ 1. Visual Catalog Architecture

QR Code Maker 6 provides an expansive visual design system with over **100+ curated templates**, **50+ custom dot styles**, **25+ eye frame shapes**, **20+ eyeball pupils**, and **40+ brand logos**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Curated Template Catalog                           │
│                      (frontend/src/data/templates.ts)                       │
│                                                                             │
│  • 100+ Designer Presets categorized by style & industry                    │
│  • Categories: Business, Cyberpunk, Social, Luxury, Nature, Pastel, Tech     │
│  • Comprehensive styling tokens: dots, eyes, frames, gradients, logos       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌──────────────────────────────────┐       ┌──────────────────────────────────┐
│      Options Catalog & Enums     │       │    80 KB+ Vector SVG Library     │
│  (frontend/src/data/options.ts)  │       │(components/previews/SvgIcons.tsx)│
│                                  │       │                                  │
│  • DOT_STYLES (50+ variants)     │       │  • 40+ Brand SVG Path2D Vectors  │
│  • EYE_FRAME_STYLES (25+)        │       │  • Dot Style SVG Shape Renderers │
│  • EYEBALL_STYLES (20+)          │       │  • Offscreen Canvas Rasterizer   │
│  • FRAME_STYLES (40+ frames)     │       │  • Badge, Glass Duotone, & Glyph │
│  • GRADIENT_TYPES (5 directions) │       │  • Instant Base64 PNG Data URLs  │
└──────────────────────────────────┘       └──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1-Click Template Mutation Engine                      │
│                          (useQRStore.applyTemplate)                         │
│                                                                             │
│  1. Ingests `Partial<QRSettings>` from chosen template.                     │
│  2. Preserves user's active `contentType` and `contentData`.                │
│  3. Overwrites visual styling (dots, eyes, colors, gradients, frames).      │
│  4. Pushes new undo/redo snapshot to history ring buffer.                   │
│  5. Fires immediate 0ms preview re-fetch via TanStack Query.                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 2. Preset Categories & Design Tokens (`templates.ts`)

Presets are defined using the `Template` interface:

```typescript
export interface Template {
  name: string;
  description?: string;
  category?: string;
  settings: Partial<QRSettings>;
}
```

### Major Style Categories:

#### 1. Business & Corporate:
- **`LinkedIn Network`**: Deep corporate blue (`#0A66C2`), bevel dots, squircle finder eyes, clean typography.
- **`Emerald Corporate`**: Dark emerald green (`#047857`), rounded dots, luxury header banner.
- **`Royal Sapphire`**: Deep navy and royal sapphire gradient with subtle drop shadow.

#### 2. Cyberpunk & Neon:
- **`Electric Violet`**: Radiant violet-to-cyan gradient (`#8B5CF6` $\rightarrow$ `#06B6D4`), circuit bridge dots.
- **`TikTok Pulse`**: High-contrast glitch aesthetic, vertical bar dots, offset leaf eyes.
- **`Matrix Terminal`**: Glowing phosphor green on deep obsidian canvas with network node modules.

#### 3. Social & Creator:
- **`Instagram Sunset`**: Multi-stop diagonal gradient (`#833AB4` $\rightarrow$ `#FD1D1D` $\rightarrow$ `#FCB045`), circular eyeball pupils.
- **`WhatsApp Direct`**: Approachable emerald (`#25D366`), squircle frames, droplet eyes.
- **`Spotify Neon`**: Vibrant electric green (`#1DB954`) on deep dark surface card.

#### 4. Luxury & Premium:
- **`Gold Noir`**: Pure black background (`#000000`) with metallic gold dots (`#D4AF37`) and radial gradient.
- **`Champagne Luxe`**: Soft warm gold, cushion cut finder frames, elegant serif typography.

---

## 🎛️ 3. Options Matrix (`frontend/src/data/options.ts`)

### 1. Dot Styles (50+ Custom Geometries):
- **Standard**: `square`, `circle`, `rounded`, `diamond`, `hexagon`, `octagon`.
- **Artistic & Modern**: `clover`, `rounded_plus`, `sheared`, `bevel`, `scalloped`, `stepped`, `squircle`.
- **Target & Anchor**: `target_bullseye`, `diamond_target`, `dotted_cross`, `arrow`, `gear_dot`.
- **Organic & Nature**: `leaf_droplet`, `pillow`, `sparkle`, `lotus_petal`, `leaf_connect`.
- **Connective & Digital**: `network_nodes`, `circuit_bridge`, `block_bridge`, `crossstitch`, `pixel_art`.

### 2. Finder Eye Outer Frames (25+ Geometries):
- `square`, `rounded`, `octagon`, `perfect_leaf_tl`, `perfect_leaf_tr`, `dynamic_swept`, `shield`, `droplet_tl`, `droplet_tr`, `droplet_bl`, `droplet_br`, `crystal_frame`, `arch_frame`, `aztec_step_frame`, `camera_lens`, `squircle`, `notched_ring`, `circuit_trace`, `cushion_cut`.

### 3. Finder Eye Inner Eyeballs (20+ Geometries):
- `square`, `rounded`, `circle`, `diamond`, `hexagon`, `octagon`, `perfect_leaf`, `shield`, `gear`, `rhombus`, `squircle`, `circuit_trace`, `fluted_bezel`, `cushion_cut`.

---

## 🖼️ 4. The 80 KB Vector SVG & Rasterization Engine (`SvgIcons.tsx`)

`frontend/src/components/previews/SvgIcons.tsx` houses an extensive catalog of official brand vector paths:

### 1. Supported Brand Vector Logos:
- **Social & Messaging**: WhatsApp, Instagram, Facebook, Messenger, Twitter/X, TikTok, Telegram, Discord, WeChat, Reddit, Pinterest, Snapchat, LinkedIn, YouTube.
- **Developer & Tech**: GitHub, GitLab, Docker, Android, Apple, Windows, Chrome, Linux, Python, React.
- **Music & Media**: Spotify, Apple Music, SoundCloud, Netflix, Twitch.
- **Finance & Crypto**: PayPal, Stripe, Visa, Mastercard, Bitcoin, Ethereum.

### 2. Multi-Mode Vector Rendering:
- **`Badge`**: Monochromatic white icon rendered onto a solid brand-colored circular or squircle card.
- **`Soft Glass (Duotone)`**: Brand-colored icon on an 18% opacity tinted glassmorphism card.
- **`Pure Glyph`**: Clean standalone vector icon with no surrounding card.

---

## ⚡ 5. 1-Click Application Mechanics

When a user clicks a template card in `TemplatesPanel.tsx`, the store action executes with zero user disruption:

```typescript
applyTemplate: (templateSettings) => set((state) => {
  // 1. Preserve active user content payload & protocol type
  const mergedSettings: QRSettings = {
    ...state.settings,
    ...templateSettings,
    contentType: state.settings.contentType,
    contentData: state.settings.contentData,
  };

  // 2. Append new history snapshot
  const sliced = state.history.slice(0, state.historyIndex + 1);
  const newHistory = [...sliced, mergedSettings].slice(-30);

  return {
    settings: mergedSettings,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
});
```
