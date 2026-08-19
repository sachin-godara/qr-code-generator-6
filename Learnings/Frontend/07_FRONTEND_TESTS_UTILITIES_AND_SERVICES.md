# 💻 07 - Frontend Tests, Utilities, Hooks & Services

> **Exhaustive breakdown of the frontend client architecture, Vitest testing suite, custom React hooks, API service layer, brand icon registry, scannability math, and clipboard/download handlers.**

---

## 🏛️ 1. Architecture Overview

The frontend utility, hook, and testing infrastructure is organized to support zero-latency client-side previews, state persistence, responsive interactions, and accessible keyboard workflows.

```
frontend/src/
├── hooks/
│   ├── useDebounce.ts           # Configurable timer debounce for rapid inputs
│   ├── useDownloadHandlers.ts   # PNG/SVG/PDF export, blob streaming, clipboard copy
│   ├── useKeyboardShortcuts.ts  # Global hotkeys (Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+C)
│   ├── useMiniPreview.ts        # Fast offscreen mini preview generation
│   ├── useOnlineStatus.ts       # Network online/offline event listener
│   └── useToast.ts              # Simple toast notification hook
├── services/
│   └── qrApi.ts                 # Typed fetch client, logo payload builder, batch endpoint
├── utils/
│   └── scannability.ts          # Relative luminance math, contrast ratios, and scannability scores
├── components/
│   └── icons/brandIcons.ts      # Social and tech brand SVG path definitions
├── data/
│   ├── options.ts               # Dropdown choices (shapes, frames, gradients, error correction)
│   └── templates.ts             # 40+ curated visual presets with full color/style tokens
└── tests/
    ├── setupTests.ts            # Vitest + Jest-DOM test environment setup
    ├── App.test.tsx             # Studio root render & query client integration test
    └── useQRStore.test.ts       # Zustand store unit tests (state transitions, undo/redo stack)
```

---

## 🔍 2. Core Modules & Implementation Details

### 1. `qrApi.ts` (API Service Layer & Logo Resolution)
- **`API_BASE`**: Switches dynamically between `http://localhost:8000` in Vite development and the production Render domain.
- **`resolveLogoPayload(settings: QRSettings)`**:
  - Checks if a preset logo (`Amazon`, `GitHub`, `WhatsApp`, etc.) is selected without a custom uploaded image.
  - Calls `getReactLogoPngDataUrl()` in `SvgIcons.tsx` to rasterize the SVG icon into a base64 PNG data URL with matching brand or custom colors.
  - Automatically attaches brand colors from `PRESET_LOGO_BRAND_COLORS` or custom overrides.
- **`fetchQRPreview(settings, signal)`**:
  - Dispatches `POST /api/generator/generate` with `box_size: 10` for fast preview rendering.
  - Uses `AbortSignal.timeout(15000)` to cancel hung requests and returns `URL.createObjectURL(blob)`.
- **`downloadQR(settings, format, size, noStretching)`**:
  - Handles multi-format routing (`/api/generator/generate` for PNG, `/generate/svg` for SVG, `/generate/pdf` for PDF).
  - Supplies high-res `target_size` (up to 8192px) and crisp 1:1 `no_stretching` flag.
- **`copyQRToClipboard(settings, size, noStretching)`**:
  - Requests a PNG blob from backend and writes directly to system clipboard via `navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])`.
- **`generateBatch(settings, items, format, size)`**:
  - Posts batch payload containing CSV-derived items and unified design settings to `/api/generator/generate/batch`, receiving a ZIP archive blob.
- **`scanQRImageBackend(file: File)`**:
  - Multi-part form upload to `/api/generator/scan` for server-side WeChat QR deep learning decoding.

---

### 2. `scannability.ts` (Relative Luminance & WCAG Contrast Scoring)
- Implements the **W3C WCAG 2.1** standard relative luminance calculation for sRGB:
  $$\text{channel}_{\text{lin}} = \begin{cases} \frac{c}{12.92} & \text{if } c \le 0.04045 \\ \left(\frac{c + 0.055}{1.055}\right)^{2.4} & \text{if } c > 0.04045 \end{cases}$$
  $$L = 0.2126 \cdot R_{\text{lin}} + 0.7152 \cdot G_{\text{lin}} + 0.0722 \cdot B_{\text{lin}}$$
- **Contrast Ratio Math**:
  $$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 > L_2)$$
- **Scannability Score Algorithm (0–100%)**:
  1. Base score derived from contrast ratio (ideal $\ge 7:1$, acceptable $\ge 4.5:1$).
  2. Penalties applied for:
     - Negative contrast / inverted colors (-20%).
     - Low error correction level 'L' with high-density modules (-10%).
     - High module complexity styles (`dots`, `circuit`, `liquid_drop`) on low contrast (-15%).
     - Large logo overlays taking $>25\%$ of QR area (-15%).
  3. Outputs score, badge level (`Excellent`, `Good`, `Warning`, `Critical`), and actionable advisory messages.

---

### 3. Custom Hooks
- **`useDebounce<T>(value: T, delay: number): T`**: Delays state updates (150ms for text input, 0ms for dropdown clicks) to prevent network flooding while maintaining instant UI responsiveness.
- **`useKeyboardShortcuts()`**: Binds global window listeners:
  - `Ctrl + Z` / `Cmd + Z`: Trigger `undo()` in `useQRStore`.
  - `Ctrl + Y` / `Cmd + Shift + Z`: Trigger `redo()`.
  - `Ctrl + S` / `Cmd + S`: Trigger primary file download.
  - `Ctrl + C` / `Cmd + Shift + C`: Copy QR image to clipboard.
- **`useDownloadHandlers()`**: Encapsulates export business logic, triggers file download via temporary `<a>` elements, handles clipboard exceptions, and publishes toast feedback.
- **`useOnlineStatus()`**: Tracks `navigator.onLine` with `window.addEventListener('online')` and `offline` events to warn users if cloud exports become unreachable.

---

### 4. Vitest Testing Suite
- **`setupTests.ts`**: Imports `@testing-library/jest-dom/vitest` matchers and mocks `window.matchMedia` and `HTMLCanvasElement.prototype.getContext`.
- **`App.test.tsx`**: Renders the complete `App` component inside `QueryClientProvider` and asserts presence of the main studio header.
- **`useQRStore.test.ts`**:
  - Tests default state initialization (`contentData: "https://example.com"`, `error_correction: "H"`).
  - Tests state mutations (`updateSettings()`) and automatic history snapshots.
  - Tests 30-level `undo()` and `redo()` stack operations, verifying state reverts and advances correctly.

---

## ⚡ 3. Execution Commands

```bash
# Run Vitest test suite
npm test

# Run tests in watch mode
npm run test:watch

# Run test coverage report
npm run test:coverage
```
