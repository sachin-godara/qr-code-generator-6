# 📜 00 - Automation Scripts & Offline Generation Pipelines

> **Exhaustive documentation of the offline Python & Node.js automation scripts, batch asset rendering pipelines, preview thumbnail generators, and AST manipulation utilities in QR Code Maker 6.**

---

## 🏛️ 1. Offline Automation Architecture

The `scripts/` directory and root build scripts automate pre-rendering of thumbnail assets, batch generation of styled QR templates, synchronization of brand icons, and static preview cache generation.

```
scripts/
├── add_docs_pdf.py              # Injects new brand SVG paths and color tokens into SvgIcons.tsx
├── gen_all_templates.js         # Headless browser / canvas batch generator for template previews
├── gen_custom_frames.py         # Batch generator for custom decorative layout frame previews
├── gen_new_previews.py          # Regenerates standard dot, eye frame, and eyeball preview PNGs
├── gen_saturated_previews.py    # Generates vibrant saturated gradient template previews
└── gen_scooter_frames.py        # Generates delivery scooter and beer mug layout frame previews

frontend/
└── generate_previews.mjs        # Fast Node.js / Sharp script generating 90+ UI thumbnail PNGs
```

---

## 🔍 2. Script-by-Script Technical Breakdown

### 1. `scripts/add_docs_pdf.py` (AST & String Insertion Pipeline)
- **Objective**: Programmatically adds `Docs` (Google Docs) and `PDF` (Adobe Acrobat) brand icons across 4 key registries in `frontend/src/components/previews/SvgIcons.tsx`.
- **Target Updates**:
  1. `LOGO_ITEMS`: Appends category entries and CSS gradient classes (`from-[#4285F4] to-[#2B60CE]` for Docs, `from-[#F40F02] to-[#B30B00]` for PDF).
  2. Switch statement JSX generator in `renderPresetLogoSvg()`.
  3. `PRESET_LOGO_BRAND_COLORS` dictionary (Docs: `#4285F4`, PDF: `#F40F02`).
  4. Raw SVG string registry for client-side canvas rasterization.

---

### 2. `scripts/gen_saturated_previews.py` & `scripts/gen_scooter_frames.py`
- **Objective**: Direct headless Python batch rendering using the backend's native `generate_qr_image()` service.
- **Workflow**:
  - Dynamically injects `backend/` to `sys.path`.
  - Loops through target templates (e.g. *Sunset Gradient Glow*, *Deep Ocean Bioluminescence*, *Electric Amethyst*, *Tropical Mango*, *Vaporwave Dream*, *Speedy Delivery*).
  - Encodes `https://example.com` into high-contrast RGBA buffers.
  - Streams output PNGs directly into `frontend/public/previews/templates/*.png`.

---

### 3. `scripts/gen_new_previews.py` & `scripts/gen_custom_frames.py`
- **Objective**: Batch generates preview thumbnails for all newly added module dot styles (`liquid_drop`, `leaf_droplet`, `circuit`, `pixel_art`, `sparkle`), eye frames (`crystal_frame`, `droplet_tl`, `leaf`), and layout text frames (`delivery_scooter`, `beer_mug`, `speed_lines_frame`).
- **Safety**: Uses standard PIL RGBA buffers and enforces 100x100px thumbnail bounding boxes.

---

### 4. `frontend/generate_previews.mjs` (Node.js & Sharp Batch Pipeline)
- **Objective**: Ultra-fast Node.js pre-render script executed during static build or CI.
- **Performance**: Uses **Sharp** (libvips C++ library) to render SVG vectors into crisp PNG thumbnails in `< 500ms` for all 90+ preview assets (`dots/`, `eye_frames/`, `eyeballs/`).
- **Zero-Dependency Fallback**: Writes PNGs directly to `frontend/public/previews/` so the client UI loads instantly without making runtime backend requests for static UI selection icons.

---

## ⚡ 3. How to Execute Automation Scripts

```bash
# Regenerate all template previews via Python
python scripts/gen_saturated_previews.py
python scripts/gen_scooter_frames.py

# Regenerate all dot and eye UI preview thumbnails via Node.js
cd frontend
node generate_previews.mjs
```
