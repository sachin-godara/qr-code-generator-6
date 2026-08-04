# Graph Report - .  (2026-08-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 571 nodes · 924 edges · 51 communities (22 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5345ffa5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- QRCodeEnhanced
- mcp-server-qrcode-enhanced/package.json
- qr_service.py
- dependencies
- dependencies
- compilerOptions
- devDependencies
- qr_engine.py
- QRGeneratorApp.tsx
- EnhancedQRCodeMCPServer
- StyledPilQRModuleDrawer
- .initialize
- frontend/package.json
- manifest.json
- frontend/tsconfig.json
- DiagonalGradiantColorMask
- BevelModuleDrawer
- ArrowModuleDrawer
- CloverModuleDrawer
- DiagonalStripeModuleDrawer
- DiamondTargetModuleDrawer
- DottedCrossModuleDrawer
- FlowerCutModuleDrawer
- HeartModuleDrawer
- HexagonModuleDrawer
- HollowDotsModuleDrawer
- HorizontalSlashModuleDrawer
- HourglassModuleDrawer
- LeafDropletModuleDrawer
- MedicalCrossModuleDrawer
- PillowModuleDrawer
- PinwheelModuleDrawer
- PixelArtModuleDrawer
- PlusModuleDrawer
- QuadDotsModuleDrawer
- RingModuleDrawer
- ShearedModuleDrawer
- SleekDashModuleDrawer
- SquircleModuleDrawer
- StarModuleDrawer
- TargetBullseyeModuleDrawer
- TriangleMosaicModuleDrawer
- VerticalSlashModuleDrawer
- astro.config.mjs

## God Nodes (most connected - your core abstractions)
1. `generate_styled_qr()` - 53 edges
2. `QRCodeEnhanced` - 28 edges
3. `useQRStore` - 24 edges
4. `EnhancedQRCodeMCPServer` - 20 edges
5. `compilerOptions` - 19 edges
6. `QRGenerationResult` - 12 edges
7. `QRConfig` - 11 edges
8. `scripts` - 10 edges
9. `generate_qr_image()` - 9 edges
10. `keywords` - 9 edges

## Surprising Connections (you probably didn't know these)
- `generate_qr_svg()` --calls--> `generate_svg_qr()`  [INFERRED]
  backend/services/qr_service.py → backend/qr_engine.py
- `generate_qr()` --calls--> `generate_qr_image()`  [INFERRED]
  backend/routers/generator.py → backend/services/qr_service.py
- `generate_svg()` --calls--> `generate_qr_svg()`  [INFERRED]
  backend/routers/generator.py → backend/services/qr_service.py
- `generate_pdf()` --calls--> `generate_qr_pdf()`  [INFERRED]
  backend/routers/generator.py → backend/services/qr_service.py
- `get_frame_thumbnail()` --calls--> `get_frame_preview()`  [INFERRED]
  backend/routers/generator.py → backend/services/qr_service.py

## Import Cycles
- None detected.

## Communities (51 total, 29 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.07
Nodes (46): OUTPUT_DIR, AppStoreForm(), CryptoForm(), EmailForm(), EventForm(), GooglePlayForm(), LocationForm(), PaypalForm() (+38 more)

### Community 1 - "QRCodeEnhanced"
Cohesion: 0.08
Nodes (29): qrcode, server, createCanvas(), loadImage(), QRCodeEnhanced, BatchQR, BatchQRSchema, Event (+21 more)

### Community 2 - "mcp-server-qrcode-enhanced/package.json"
Cohesion: 0.05
Nodes (43): author, bin, mcp-qrcode-enhanced, bugs, url, description, engines, node (+35 more)

### Community 3 - "qr_service.py"
Cohesion: 0.10
Nodes (29): apply_frame(), apply_layout_frame(), apply_text_frame(), hex_to_rgb(), generate_svg_qr(), Generates a raw SVG QR code (without custom styled dots or frames), BatchItem, BatchQRRequest (+21 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (35): astro, @astrojs/react, @astrojs/sitemap, axios, class-variance-authority, clsx, framer-motion, dependencies (+27 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (34): chalk, commander, fs-extra, jimp, jsqr, dependencies, chalk, commander (+26 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, allowSyntheticDefaultImports, declaration, declarationMap, emitDecoratorMetadata, esModuleInterop, experimentalDecorators (+19 more)

### Community 7 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint, jest, devDependencies, eslint, jest, ts-jest, tsx, @types/fs-extra (+19 more)

### Community 8 - "qr_engine.py"
Cohesion: 0.15
Nodes (19): CustomStyledPilImage, DiamondModuleDrawer, draw_crystal_frame_func(), draw_topographic_frame_func(), find_coeffs(), fractal_noise_1d(), generate_deckled_rect(), generate_preset_logo() (+11 more)

### Community 9 - "QRGeneratorApp.tsx"
Cohesion: 0.15
Nodes (10): ../react/QRGeneratorApp, breadcrumbs, howTo, breadcrumbs, howTo, breadcrumbs, howTo, breadcrumbs (+2 more)

### Community 11 - "StyledPilQRModuleDrawer"
Cohesion: 0.11
Nodes (7): CrossstitchModuleDrawer, FishtailModuleDrawer, GearDotModuleDrawer, MoonCrescentModuleDrawer, NetworkNodesModuleDrawer, SparkleModuleDrawer, StyledPilQRModuleDrawer

### Community 12 - ".initialize"
Cohesion: 0.11
Nodes (6): LiquidDropModuleDrawer, LotusPetalModuleDrawer, MinimalDotsModuleDrawer, OctagonModuleDrawer, RoundedPlusModuleDrawer, TechChevronModuleDrawer

### Community 13 - "frontend/package.json"
Cohesion: 0.11
Nodes (17): devDependencies, @types/react, @types/react-dom, typescript, engines, node, typescript, name (+9 more)

### Community 14 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, display, icons, name, orientation, short_name (+5 more)

### Community 15 - "frontend/tsconfig.json"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, jsxImportSource, paths, exclude, extends, include, dist (+3 more)

### Community 16 - "DiagonalGradiantColorMask"
Cohesion: 0.40
Nodes (3): DiagonalGradiantColorMask, Fills in the foreground with a gradient sweeping diagonally from corner to corne, QRColorMask

## Knowledge Gaps
- **155 isolated node(s):** `OUTPUT_DIR`, `name`, `type`, `version`, `node` (+150 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qrcode` connect `QRCodeEnhanced` to `qr_engine.py`, `dependencies`?**
  _High betweenness centrality (0.229) - this node is a cross-community bridge._
- **Why does `keywords` connect `dependencies` to `QRCodeEnhanced`, `mcp-server-qrcode-enhanced/package.json`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `QRCodeEnhanced`, `mcp-server-qrcode-enhanced/package.json`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `OUTPUT_DIR`, `name`, `type` to the rest of the system?**
  _155 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07163461538461538 - nodes in this community are weakly interconnected._
- **Should `QRCodeEnhanced` be split into smaller, more focused modules?**
  _Cohesion score 0.08022598870056497 - nodes in this community are weakly interconnected._
- **Should `mcp-server-qrcode-enhanced/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._