# 🚀 QR Code Maker 6 - Master System Learnings & Architectural Reference

> **Comprehensive deep-dive into the design, subsystems, styling engines, client-server workflows, and quality gates of QR Code Maker 6.**

---

## 📌 1. Project Overview & Mission

**QR Code Maker 6** is a production-grade, full-stack QR Code generator and computer vision scanning platform. Unlike typical barebones QR tools that produce flat black-and-white grids, QR Code Maker 6 delivers:

- **State-of-the-Art Visual Styling**: 50+ custom module dot styles, 25+ eye frames, 20+ eyeball styles, 40+ decorative text & layout frames, and multi-directional gradients (Vertical, Horizontal, Radial, Diagonal).
- **High-Precision Vector Logo Engine**: PyMuPDF-powered vector rasterization, custom file dropzone, automatic background removal with color tolerance, and custom brand badges.
- **Enterprise-Grade Resolution & Formats**: Instant client-side preview with server-side exports in PNG, lossless SVG, and vector PDF up to **8K (8192px)** with DPI scaling and aspect ratio preservation.
- **Batch Processing**: Ingests CSV files, maps dynamic columns, and batches up to 50 customized QR codes into a structured ZIP archive.
- **Dual-Engine Computer Vision Scanner**: Combines deep learning (WeChat QR Caffe CNN) with an OpenCV + PyZBar waterfall filter pipeline capable of decoding inverted, blurred, low-contrast, or stylized QR codes.
- **Hybrid SSR/SSG & Interactive Island Architecture**: Astro 5 static pages (28 pre-rendered routes, 12 SEO blog guides, 150+ keyword catalog, automated JSON-LD schemas, sitemaps, RSS feed) seamlessly hosting React 19 interactive visual studios.

---

## 🏛️ 2. Technology Stack

| Layer | Technologies Used | Primary Responsibilities |
| :--- | :--- | :--- |
| **Frontend Framework** | **Astro 5.x** + **React 19** | Static site generation, SEO routing, dynamic blog collections, and reactive UI islands. |
| **Styling & Animation** | **Tailwind CSS 3.4** + **Framer Motion** | Glassmorphism, dark mode tokens, micro-interactions, responsive design systems. |
| **State Management** | **Zustand 5** | Reactive, unopinionated client stores (`useQRStore`, `useDownloadStore`). |
| **Backend API** | **FastAPI** + **Uvicorn** + **Pydantic V2** | High-concurrency async endpoints, strict payload validation, security middlewares. |
| **QR Generation Engine** | **qrcode (Python)** + **PIL (Pillow)** + **NumPy** | Low-level matrix generation, custom module drawers, color mask blending. |
| **Vector Engine** | **PyMuPDF (fitz)** | High-fidelity vector SVG rendering, font glyph parsing, PDF generation. |
| **Computer Vision** | **OpenCV (cv2)** + **PyZBar** + **WeChat QR CNN** | Multi-pass image thresholding, contour extraction, stubborn QR decoding. |
| **Reliability & Rate Limiting** | **SlowAPI** + In-Memory **LRU Cache** | Rate limits (120 req/min for PNG, 60 req/min for SVG/PDF, 10 req/min for Batch), thread-safe caching. |
| **MCP Integration** | **mcp-server-qrcode-enhanced** | Model Context Protocol server exposing QR generation, styling, and validation tools. |

---

## 🗺️ 3. Navigation to Learning Modules

Explore the in-depth documentation modules inside this folder:

1. [**01_BACKEND_QR_ENGINE_AND_MODULE_MATRIX.md**](./01_BACKEND_QR_ENGINE_AND_MODULE_MATRIX.md)
   - Low-level matrix construction and error correction mechanics (L, M, Q, H).
   - Quiet zone and center clearing geometry.
   - Comprehensive breakdown of all 50+ custom dot drawer algorithms.
   - Gradient masks & color blending math.

2. [**02_EYE_ENGINE_AND_FRAME_SYSTEMS.md**](./02_EYE_ENGINE_AND_FRAME_SYSTEMS.md)
   - Eye positioning matrix mathematics (Top-Left, Top-Right, Bottom-Left).
   - Independent vs. linked corner eye styling.
   - 25+ outer eye frames and 20+ inner eyeball center algorithms.
   - 40+ layout & text frame templates in `text_frames.py`.
   - Dynamic typography engine and font resolution.

3. [**03_LOGO_PROCESSING_AND_VECTOR_OVERLAYS.md**](./03_LOGO_PROCESSING_AND_VECTOR_OVERLAYS.md)
   - PyMuPDF SVG parsing pipeline.
   - Transparent background extraction using Euclidean color distance.
   - Badge card geometry (None, Circle, Rounded Square) and padding.
   - Preset icon gallery (40+ social, tech, business, and media brands).

4. [**04_FRONTEND_UI_AND_CLIENT_STATE.md**](./04_FRONTEND_UI_AND_CLIENT_STATE.md)
   - Astro SSG structure, static pages, and Content Collections.
   - React application architecture & Zustand state stores.
   - Panel components breakdown (Content, Design, Frames, Logo, Effects, Templates, Download).
   - Real-time client-side preview rendering and canvas fallback.

5. [**05_BATCH_PROCESSING_AND_EXPORT_PIPELINES.md**](./05_BATCH_PROCESSING_AND_EXPORT_PIPELINES.md)
   - High-resolution exports (PNG, SVG, PDF up to 8K resolution).
   - Aspect ratio preservation and DPI handling.
   - CSV batch ingestion, dynamic naming, and in-memory ZIP streaming.
   - Thread-safe LRU caching with MD5 hashing.

6. [**06_COMPUTER_VISION_SCANNER_AND_QUALITY_ASSURANCE.md**](./06_COMPUTER_VISION_SCANNER_AND_QUALITY_ASSURANCE.md)
   - AI CNN WeChat QR Caffe model architecture.
   - Computer vision waterfall filter pipeline (Adaptive thresholding, Gaussian blur, Morphological close, Inversion).
   - Scannability assurance rules and 4.5:1 contrast gates.

7. [**07_QR_CODE_STANDARDS_AND_SPECIFICATIONS.md**](./07_QR_CODE_STANDARDS_AND_SPECIFICATIONS.md)
   - ISO/IEC 18004:2024 formal specification & standardization history (1994–2024).
   - Symbol anatomy (Finder, Separators, Timing, Alignment, Format, Version).
   - Version dimension math (Versions 1–40, 21x21 to 177x177).
   - Encoding modes (Numeric, Alphanumeric, Byte, Kanji) & bit-packing algorithms.
   - The 7-step mathematical encoding & data masking evaluation pipeline.

8. [**08_GRAPHIFY_TOPOLOGY_AND_DEPENDENCY_ANALYSIS.md**](./08_GRAPHIFY_TOPOLOGY_AND_DEPENDENCY_ANALYSIS.md)
   - 279-node and 535-edge codebase dependency graph analysis.
   - Core abstraction hubs ("God Nodes": `generate_qr_image`, `hex_to_rgb`, `draw_eye_frame`, `generate_styled_qr`).
   - 44 functional community clusters and call-graph boundaries.
   - Cross-module dependency tracing and zero circular import verification.

9. [**09_MASTER_CODEBASE_SYMBOL_AND_FILE_INVENTORY.md**](./09_MASTER_CODEBASE_SYMBOL_AND_FILE_INVENTORY.md)
   - Complete directory topology mapping every single file across backend, frontend, MCP, and scripts.
   - Line counts, exported classes, functions, interfaces, dependencies, and architectural layer matrix.

---

## 🎨 4. Dedicated Frontend Codebase Modules (`Learnings/Frontend/`)

For a comprehensive breakdown of the frontend layers, inspect the [`Learnings/Frontend/`](./Frontend/) directory:

- [**`00_FRONTEND_ARCHITECTURE_OVERVIEW.md`**](./Frontend/00_FRONTEND_ARCHITECTURE_OVERVIEW.md) — Astro 5 SSG + React 19 island hydration, directory topology, and design tokens.
- [**`01_REACT_STUDIO_AND_APP_LIFECYCLE.md`**](./Frontend/01_REACT_STUDIO_AND_APP_LIFECYCLE.md) — App.tsx orchestration, smart 0ms/150ms debouncing, and TanStack Query caching.
- [**`02_STATE_MANAGEMENT_AND_CUSTOM_HOOKS.md`**](./Frontend/02_STATE_MANAGEMENT_AND_CUSTOM_HOOKS.md) — Zustand stores (`useQRStore`, `useDownloadStore`), 30-level undo/redo, and keyboard shortcuts.
- [**`03_PANEL_COMPONENTS_AND_DESIGN_SYSTEM.md`**](./Frontend/03_PANEL_COMPONENTS_AND_DESIGN_SYSTEM.md) — Breakdown of all 8 studio panels and reusable UI primitives.
- [**`04_CLIENT_CANVAS_AND_SVG_PREVIEW_PIPELINE.md`**](./Frontend/04_CLIENT_CANVAS_AND_SVG_PREVIEW_PIPELINE.md) — Offscreen canvas rasterization (`SvgIcons.tsx`), desktop sticky preview, and mobile drawer.
- [**`05_SCANNABILITY_CALCULATOR_AND_VALIDATION.md`**](./Frontend/05_SCANNABILITY_CALCULATOR_AND_VALIDATION.md) — sRGB relative luminance math, contrast ratios, and penalty algorithms.
- [**`06_ASTRO_PAGES_SEO_AND_CONTENT_COLLECTIONS.md`**](./Frontend/06_ASTRO_PAGES_SEO_AND_CONTENT_COLLECTIONS.md) — 21+ static routes, `SEOHead.astro`, JSON-LD schemas, and Markdown collections.
- [**`07_FRONTEND_TESTS_UTILITIES_AND_SERVICES.md`**](./Frontend/07_FRONTEND_TESTS_UTILITIES_AND_SERVICES.md) — Vitest testing suite, custom React hooks, `qrApi.ts`, `brandIcons.ts`, and clipboard/download handlers.
- [**`08_SEO_AND_SEARCH_ENGINE_OPTIMIZATION.md`**](./Frontend/08_SEO_AND_SEARCH_ENGINE_OPTIMIZATION.md) — Master SEO reference, Core Web Vitals, Schema.org rich snippets (WebApplication, HowTo, FAQPage, BreadcrumbList), keyword intent matrix, and blog clustering.

---

## ⚙️ 5. Dedicated Backend Codebase Modules (`Learnings/Backend/`)

For a comprehensive breakdown of the backend layers, inspect the [`Learnings/Backend/`](./Backend/) directory:

- [**`00_BACKEND_ARCHITECTURE_OVERVIEW.md`**](./Backend/00_BACKEND_ARCHITECTURE_OVERVIEW.md) — FastAPI async server, middleware pipeline, SlowAPI limits, and topology.
- [**`01_FASTAPI_ROUTERS_AND_API_ENDPOINTS.md`**](./Backend/01_FASTAPI_ROUTERS_AND_API_ENDPOINTS.md) — Endpoint specifications, Pydantic V2 schemas, and HTTP caching.
- [**`02_QR_ENGINE_AND_MODULE_DRAWERS.md`**](./Backend/02_QR_ENGINE_AND_MODULE_DRAWERS.md) — 50+ custom dot drawer classes, module clearing math, and gradient masks.
- [**`03_EYE_ENGINE_AND_FINDER_PATTERNS.md`**](./Backend/03_EYE_ENGINE_AND_FINDER_PATTERNS.md) — 25+ eye frames, 20+ eyeballs, and independent corner unlinking math.
- [**`04_DECORATIVE_TEXT_AND_LAYOUT_FRAMES.md`**](./Backend/04_DECORATIVE_TEXT_AND_LAYOUT_FRAMES.md) — 4,400+ lines of text & layout framing, dynamic canvas geometry, and Google Fonts.
- [**`05_LOGO_PROCESSOR_AND_TRANSPARENCY_REMOVAL.md`**](./Backend/05_LOGO_PROCESSOR_AND_TRANSPARENCY_REMOVAL.md) — PyMuPDF vector SVG rasterization, NumPy 3D color distance, and 46 presets.
- [**`06_COMPUTER_VISION_SCANNER_AND_CAFFE_CNN.md`**](./Backend/06_COMPUTER_VISION_SCANNER_AND_CAFFE_CNN.md) — AI WeChat QR CNN, Caffe weights, and OpenCV waterfall filter pipeline.
- [**`07_CACHING_CONCURRENCY_AND_PERFORMANCE.md`**](./Backend/07_CACHING_CONCURRENCY_AND_PERFORMANCE.md) — Thread-safe `SimpleLRUCache`, threadpool offloading, lazy imports, and memory safety.
- [**`08_TEST_SUITE_AND_SECURITY_HARNESS.md`**](./Backend/08_TEST_SUITE_AND_SECURITY_HARNESS.md) — Pytest test runner, security hardening tests, latency benchmarks, and 100% automated template scannability validation.

---

## 🔌 6. Dedicated MCP Server & Automation Modules

- [**`Learnings/MCP/00_MCP_SERVER_ARCHITECTURE_AND_TOOLS.md`**](./MCP/00_MCP_SERVER_ARCHITECTURE_AND_TOOLS.md) — Model Context Protocol SDK integration, JSON-RPC stdio transport, Zod schemas, and complete reference for all 13 autonomous tools.
- [**`Learnings/Scripts/00_AUTOMATION_SCRIPTS_AND_OFFLINE_PIPELINES.md`**](./Scripts/00_AUTOMATION_SCRIPTS_AND_OFFLINE_PIPELINES.md) — Python and Node.js headless scripts, Sharp preview generation, template thumbnail generation, and AST injectors.

---

## 🕸️ 7. Dedicated Graphify Intelligence Modules (`Learnings/Graphify/`)

For a comprehensive breakdown of the Graphify static analysis engine and code graph tools, inspect the [`Learnings/Graphify/`](./Graphify/) directory:

- [**`00_GRAPHIFY_SYSTEM_OVERVIEW.md`**](./Graphify/00_GRAPHIFY_SYSTEM_OVERVIEW.md) — Graphify architecture, 6-phase pipeline, and AST network graph topology.
- [**`01_PIPELINE_STAGES_AND_EXECUTION_SCRIPTS.md`**](./Graphify/01_PIPELINE_STAGES_AND_EXECUTION_SCRIPTS.md) — Step-by-step breakdown of `build.py`, `ast_extract.py`, `merge.py`, `query.py`, `vocab.py`, etc.
- [**`02_INTERMEDIATE_DATA_SCHEMAS_AND_MANIFEST.md`**](./Graphify/02_INTERMEDIATE_DATA_SCHEMAS_AND_MANIFEST.md) — JSON schema specifications for `.graphify_ast.json`, `.graphify_analysis.json`, `graph.json`, and `manifest.json`.
- [**`03_CENTRALITY_COMMUNITIES_AND_ARCHITECTURAL_INSIGHTS.md`**](./Graphify/03_CENTRALITY_COMMUNITIES_AND_ARCHITECTURAL_INSIGHTS.md) — 279 nodes, 535 edges, the 10 "God Nodes", 44 community clusters, and zero circular cycles.
- [**`04_QUERY_ENGINE_AND_AI_AGENT_INTEGRATION.md`**](./Graphify/04_QUERY_ENGINE_AND_AI_AGENT_INTEGRATION.md) — Token-budgeted BFS/DFS graph traversal query engine (`query.py`) and agent refactoring workflows.




