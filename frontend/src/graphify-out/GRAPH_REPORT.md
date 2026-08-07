# Graph Report - frontend\src  (2026-08-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 174 nodes · 373 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `567aa7c4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BaseLayout.astro
- panels/index.ts
- App.tsx
- useQRStore
- SvgIcons.tsx
- useQRStore.ts
- ErrorBoundary
- useKeyboardShortcuts.ts
- brandIcons.ts
- setupTests.ts
- qrRenderWorker.ts

## God Nodes (most connected - your core abstractions)
1. `useQRStore` - 45 edges
2. `useDownloadHandlers()` - 12 edges
3. `useDownloadStore` - 11 edges
4. `QRSettings` - 7 edges
5. `useToast()` - 6 edges
6. `App()` - 6 edges
7. `DownloadPanel()` - 6 edges
8. `MobileBottomBar()` - 6 edges
9. `resolveLogoPayload()` - 6 edges
10. `getReactLogoPngDataUrl()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `useDownloadHandlers()` --calls--> `getReactLogoPngDataUrl()`  [EXTRACTED]
  hooks/useDownloadHandlers.ts → components/previews/SvgIcons.tsx
- `Template` --references--> `QRSettings`  [EXTRACTED]
  data/templates.ts → types/qr.ts
- `useDownloadHandlers()` --calls--> `useQRStore`  [EXTRACTED]
  hooks/useDownloadHandlers.ts → store/useQRStore.ts
- `App()` --calls--> `fetchQRPreview()`  [EXTRACTED]
  react/App.tsx → services/qrApi.ts
- `App()` --calls--> `useQRStore`  [EXTRACTED]
  react/App.tsx → store/useQRStore.ts

## Import Cycles
- None detected.

## Communities (16 total, 4 thin omitted)

### Community 0 - "BaseLayout.astro"
Cohesion: 0.09
Nodes (15): ../react/QRGeneratorApp, ../react/scanner/QRScannerApp, revealObserver, breadcrumbs, breadcrumbs, howTo, breadcrumbs, howTo (+7 more)

### Community 1 - "panels/index.ts"
Cohesion: 0.13
Nodes (19): StylePreviewCard(), StylePreviewCardProps, LOGO_CATEGORIES, ScannabilityAlert(), Slider(), SliderProps, DOT_STYLES, EYE_FRAME_STYLES (+11 more)

### Community 2 - "App.tsx"
Cohesion: 0.17
Nodes (17): useDownloadHandlers(), useToast(), App(), DownloadPanel(), DownloadPanelProps, DesktopPreviewPane(), DesktopPreviewPaneProps, FullscreenLightbox() (+9 more)

### Community 3 - "useQRStore"
Cohesion: 0.21
Nodes (19): AppStoreForm(), CryptoForm(), EmailForm(), EventForm(), GooglePlayForm(), LocationForm(), PaypalForm(), PhoneForm() (+11 more)

### Community 4 - "SvgIcons.tsx"
Cohesion: 0.19
Nodes (12): getReactLogoPngDataUrl(), LOGO_ITEMS, LogoMetadata, PRESET_LOGO_BRAND_COLORS, PresetLogoPreview(), PresetLogoPreviewProps, BatchItem, copyQRToClipboard() (+4 more)

### Community 5 - "useQRStore.ts"
Cohesion: 0.30
Nodes (7): PRESET_TEMPLATES, Template, TEMPLATE_CATEGORIES, QRState, ContentType, defaultSettings, QRSettings

### Community 6 - "ErrorBoundary"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

## Knowledge Gaps
- **36 isolated node(s):** `PRESET_LOGO_BRAND_COLORS`, `StylePreviewCardProps`, `LogoMetadata`, `PresetLogoPreviewProps`, `SliderProps` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useQRStore` connect `useQRStore` to `panels/index.ts`, `App.tsx`, `useQRStore.ts`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **Why does `ErrorBoundary` connect `ErrorBoundary` to `BaseLayout.astro`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `QRSettings` connect `useQRStore.ts` to `panels/index.ts`, `SvgIcons.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `PRESET_LOGO_BRAND_COLORS`, `StylePreviewCardProps`, `LogoMetadata` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BaseLayout.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._
- **Should `panels/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._