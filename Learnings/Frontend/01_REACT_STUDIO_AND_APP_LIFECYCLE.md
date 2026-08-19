# ⚡ 01 - React Studio & App Lifecycle Orchestration

> **In-depth breakdown of `frontend/src/react/App.tsx`, TanStack Query preview caching, smart debouncing algorithms, responsive viewport adaptations, and comparison modes.**

---

## 🏗️ 1. Studio Layout Architecture (`App.tsx`)

`frontend/src/react/App.tsx` serves as the central hub of the interactive studio, structuring the workspace into a high-efficiency two-column responsive interface:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header Bar: Title, Undo/Redo, Reset to Default, Compare Toggle, Status Icon │
├────────────────────────────────────────┬────────────────────────────────────┤
│ Left Column (Editor Panels)            │ Right Column (Sticky Preview Pane) │
│                                        │                                    │
│ [Content] [Templates] [Design] [Frames]│  ┌──────────────────────────────┐  │
│ [Logo]    [Effects]   [Adv]   [Download]│  │                              │  │
│                                        │  │   Live QR Preview Canvas    │  │
│ Active Panel Component                 │  │                              │  │
│ • ContentForms                         │  └──────────────────────────────┘  │
│ • Dot Grid Selector                    │  [Scannability Contrast Meter]     │
│ • Color Pickers & Gradients            │  [Copy Image]   [Quick Download]   │
│ • Preset Brand Logos                   │  [Zoom In/Out]  [Fullscreen View]  │
├────────────────────────────────────────┴────────────────────────────────────┤
│ Mobile View: Floating Thumb-Friendly Navigation Bar + Slide-up Preview Sheet │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ 2. The Smart Debounce Engine (`useSmartQRSettingsDebounce`)

A common bottleneck in visual QR editors is lag caused by debouncing instant button clicks or overloading the API during fast typing.

To solve this, `frontend/src/hooks/useDebounce.ts` implements a **dual-speed smart debounce**:

```typescript
const DISCRETE_KEYS: (keyof QRSettings)[] = [
  "contentType", "dots_style", "eye_frame_style", "eyeball_style",
  "link_eyes", "dots_color", "dots_color_end", "gradient_type",
  "bg_color", "eye_color", "eyeball_color", "frame_style",
  "preset_logo", "logo_icon_style", "logo_card_shape",
  "error_correction", "bg_transparent", "effect_shadow",
  "canvas_border_color"
];

export function useSmartQRSettingsDebounce(settings: QRSettings, typingDelay: number = 150): QRSettings {
  const [debouncedSettings, setDebouncedSettings] = useState<QRSettings>(settings);
  const lastDiscreteRef = useRef<string>("");

  const currentDiscreteStr = DISCRETE_KEYS.map((k) => `${k}:${settings[k]}`).join("|");

  useEffect(() => {
    // 1. DISCRETE CHANGE: User clicked a dot style, eye frame, template, or toggle
    if (lastDiscreteRef.current !== currentDiscreteStr) {
      lastDiscreteRef.current = currentDiscreteStr;
      setDebouncedSettings(settings); // 0ms INSTANT UPDATE
      return;
    }

    // 2. CONTINUOUS CHANGE: User is typing text or dragging a continuous slider
    const handler = setTimeout(() => {
      setDebouncedSettings(settings); // 150ms SMOOTH THROTTLE
    }, typingDelay);

    return () => clearTimeout(handler);
  }, [settings, currentDiscreteStr, typingDelay]);

  return debouncedSettings;
}
```

### Key Performance Benefits:
- **Instantaneous Feedback (0ms)** when exploring styles, clicking presets, or changing colors.
- **Network Thriftiness (150ms)** when typing long URLs or dragging padding/radius sliders.

---

## 🔄 3. Preview Generation with TanStack Query

Preview image fetching is managed via **TanStack React Query 5** (`@tanstack/react-query`):

```typescript
const { data: previewData, isFetching, isError, error } = useQuery({
  queryKey: ['qr-preview', debouncedSettings],
  queryFn: ({ signal }) => fetchQRPreview(debouncedSettings, signal),
  placeholderData: keepPreviousData, // Prevents white flash during re-render
  staleTime: 1000 * 60 * 5,          // 5 minutes in-memory caching
  retry: 1,
});
```

### Mechanics:
1. **`placeholderData: keepPreviousData`**: The previous QR code image remains visible on screen while the new one renders in the background, eliminating layout flicker.
2. **`AbortSignal` Integration**: When a user modifies settings rapidly, previous pending HTTP requests are automatically cancelled, saving server bandwidth.
3. **Memory Safety**: `URL.createObjectURL` creates object URLs for image blobs, which are revoked when updated to prevent browser memory leaks.

---

## 🔀 4. Advanced Studio Modes

### 1. Split-View Compare Mode (`isComparing`)
Renders a side-by-side comparison between the raw, standard black-and-white QR code and the user's customized design. This allows creators to verify that visual styling has not obscured critical matrix components.

### 2. Fullscreen Lightbox (`isFullscreen`)
Locks viewport scrolling (`document.body.style.overflow = "hidden"`) and mounts `FullscreenLightbox.tsx` with high-resolution inspection, mouse wheel zooming, and canvas panning.

### 3. Smart Landing Page Synchronization
When loaded on dedicated landing routes (e.g., `/wifi-qr-code`, `/vcard-qr-code`, `/email-qr-code`), `App.tsx` reads `window.location.pathname` and pre-activates the corresponding form tab with zero user clicks.

### 4. Custom Event Bus (`select-qr-content-type`)
Landing page marketing cards dispatch custom window events:
```typescript
window.dispatchEvent(new CustomEvent("select-qr-content-type", { detail: { type: "wifi" } }));
```
`App.tsx` captures this event, switches the active content tab, and smoothly scrolls the user directly to the `#generator` studio anchor.
