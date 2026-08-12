# Graph Report - frontend  (2026-08-12)

## Corpus Check
- 489 files · ~346,303 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 157 nodes · 154 edges · 29 communities (7 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- React Dependencies
- Astro Pages and Layouts
- Testing Dependencies
- Package Scripts & Metadata
- Web App Manifest
- TypeScript Configuration
- Legal Pages and Layouts
- QR Data Types
- Navbar Component
- Sidebar Component
- Premium Font Component
- Download Hooks
- Keyboard Hooks
- Preview Hooks
- Online Status Hooks
- Toast Hooks
- Tailwind Utils
- QR App Entrypoint
- API Batch Items
- API Copy Service
- API Download Service
- API Preview Service
- API Generate Service
- API Logo Service
- API Scanner Service
- Toast Store Types
- QR Content Types
- Scannability Logic
- Scannability Types

## God Nodes (most connected - your core abstractions)
1. `../layouts/BaseLayout.astro` - 14 edges
2. `../components/layout/Footer.astro` - 13 edges
3. `../layouts/LegalLayout.astro` - 8 edges
4. `scripts` - 6 edges
5. `../components/layout/Header.astro` - 5 edges
6. `categories` - 4 edges
7. `compilerOptions` - 4 edges
8. `include` - 3 edges
9. `engines` - 2 edges
10. `@astrojs/react` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Template` --references--> `QRSettings`  [EXTRACTED]
  src/data/templates.ts → src/types/qr.ts

## Import Cycles
- None detected.

## Communities (29 total, 22 thin omitted)

### Community 0 - "React Dependencies"
Cohesion: 0.05
Nodes (39): astro, @astrojs/react, @astrojs/sitemap, class-variance-authority, clsx, @emnapi/core, @emnapi/runtime, framer-motion (+31 more)

### Community 1 - "Astro Pages and Layouts"
Cohesion: 0.14
Nodes (14): ../react/QRGeneratorApp, ../react/scanner/QRScannerApp, ../components/layout/Footer.astro, ../components/layout/Header.astro, ../components/SEOHead.astro, ../layouts/BaseLayout.astro, breadcrumbs, howTo (+6 more)

### Community 2 - "Testing Dependencies"
Cohesion: 0.10
Nodes (21): jsdom, devDependencies, jsdom, @testing-library/dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/react (+13 more)

### Community 3 - "Package Scripts & Metadata"
Cohesion: 0.14
Nodes (13): engines, node, name, overrides, nanoid, scripts, astro, build (+5 more)

### Community 4 - "Web App Manifest"
Cohesion: 0.14
Nodes (13): background_color, categories, description, display, icons, name, orientation, short_name (+5 more)

### Community 5 - "TypeScript Configuration"
Cohesion: 0.17
Nodes (11): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, compilerOptions, jsx, jsxImportSource, paths (+3 more)

### Community 6 - "Legal Pages and Layouts"
Cohesion: 0.25
Nodes (4): ../layouts/LegalLayout.astro, revealObserver, breadcrumbs, breadcrumbs

## Knowledge Gaps
- **94 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `React Dependencies` to `Package Scripts & Metadata`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Testing Dependencies` to `Package Scripts & Metadata`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Astro Pages and Layouts` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Should `Testing Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Package Scripts & Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._