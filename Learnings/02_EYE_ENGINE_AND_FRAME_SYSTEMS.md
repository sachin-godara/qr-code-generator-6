# 👁️ 02 - Eye Engine, Finder Patterns & Decorative Frame Systems

> **Comprehensive reference for QR finder pattern geometry, independent corner eye rendering, the 25+ eye frame and 20+ eyeball algorithms, and the 4,400+ line decorative text & layout framing engine (`backend/engines/eyes/` & `backend/engines/frames/text_frames.py`).**

---

## 🎯 1. QR Finder Pattern Anatomy & Geometry

Standard QR codes rely on three position detection patterns ("eyes") located in the **Top-Left (TL)**, **Top-Right (TR)**, and **Bottom-Left (BL)** corners. Each eye consists of:
1. **Outer Frame**: $7 \times 7$ modules.
2. **Separator Quiet Zone**: $1$-module thick transparent or background-colored ring.
3. **Inner Eyeball**: $3 \times 3$ solid modules centered at offset $(px + 2s, py + 2s)$.

```
   ┌───────────────────────┐ ── y0 (px, py)
   │  ███████████████████  │
   │  ██               ██  │
   │  ██   █████████   ██  │ ── Eyeball (px+2s, py+2s) [3x3 modules]
   │  ██   █████████   ██  │
   │  ██   █████████   ██  │
   │  ██               ██  │
   │  ███████████████████  │
   └───────────────────────┘ ── y0 + 7s [7x7 modules]
```

### Corner Calculation in `backend/qr_engine.py`:
```python
border_modules = quiet_zone
s = box_size
modules_count = len(qr.modules)

eye_positions = [
    (border_modules, border_modules),                      # Top-Left (TL)
    (modules_count + border_modules - 7, border_modules),  # Top-Right (TR)
    (border_modules, modules_count + border_modules - 7)   # Bottom-Left (BL)
]
```

---

## 🔀 2. Linked vs. Independent Corner Eye Styling

QR Code Maker 6 supports both synchronized eye styling and **asymmetrical per-corner customization**:

- **Linked Mode (`link_eyes: true`)**: All three corners share unified `eye_color`, `eyeball_color`, `eye_frame_style`, and `eyeball_style`.
- **Unlinked Mode (`link_eyes: false`)**: Allows distinct styles and colors for each individual corner:
  * `eye_frame_style_tl`, `eyeball_style_tl`, `eye_color_tl`, `eyeball_color_tl`
  * `eye_frame_style_tr`, `eyeball_style_tr`, `eye_color_tr`, `eyeball_color_tr`
  * `eye_frame_style_bl`, `eyeball_style_bl`, `eye_color_bl`, `eyeball_color_bl`

### Contrast Safety Guard:
If an eye color matches the background color (or is black on a dark background), the engine dynamically falls back to the foreground color to prevent rendering invisible finder patterns.

---

## 🖼️ 3. Outer Eye Frame Algorithms (`eye_frames.py`)

All outer eye frames are drawn within a $7s \times 7s$ pixel bounding box with specialized corner clipping, polygon drawing, or parametric curves:

| Eye Frame Style | Implementation Technique | Visual Description |
| :--- | :--- | :--- |
| `square` | PIL `draw.rectangle` outline | Classical strict square border. |
| `rounded` | PIL `draw.rounded_rectangle` ($r = 1.5s$) | Smooth rounded outer square. |
| `circle` | PIL `draw.ellipse` outline | Perfect circular outer ring. |
| `double_ring` | Dual concentric `draw.ellipse` calls | Double concentric thin rings. |
| `dotted_circle` | 12 radial dots calculated via $(\cos \theta, \sin \theta)$ | Orbital pearl ring of 12 micro-dots. |
| `octagon` | 8-point outer and inner polygons | 45° chamfered industrial octagon. |
| `hexagon` | 6-point outer and inner polygons | Honeycomb hexagonal outer cell. |
| `diamond` | Rhombus 4-point polygon | Rotated diamond frame. |
| `corner_brackets`| 8 discrete L-shaped corner bars | Futuristic HUD target reticle. |
| `leaf` | Teardrop with 3 rounded corners, 1 sharp corner | Organic botanical leaf contour. |
| `droplet_tl` | Sharp Top-Left, rounded TR, BL, BR | Directional teardrop pointing Top-Left. |
| `droplet_tr` | Sharp Top-Right, rounded TL, BL, BR | Directional teardrop pointing Top-Right. |
| `droplet_bl` | Sharp Bottom-Left, rounded TL, TR, BR | Directional teardrop pointing Bottom-Left. |
| `shield` | Pentagonal shield polygon with pointed bottom | Heraldic security crest frame. |
| `squircle` | High-radius superellipse ($r = 2.2s$) | Apple iOS continuous curvature squircle. |
| `star` | 8-pointed star polygon with outer and inner punch | Celestial starburst frame. |
| `deckled` | Perlin/value noise displacement function | Hand-torn deckled edge paper frame. |
| `crystal` | Multi-faceted geometric crystal polygons | Faceted mineral gem contour. |

---

## 👁️ 4. Inner Eyeball Center Algorithms (`eyeballs.py`)

Eyeballs are centered inside the $3s \times 3s$ core ($px + 2s \le x < px + 5s$):

| Eyeball Style | Implementation Technique | Visual Description |
| :--- | :--- | :--- |
| `square` | Solid rectangle $[ebx, eby, ebx+3s, eby+3s]$ | Classic solid square pupil. |
| `rounded` | Rounded rectangle ($r = 0.75s$) | Smooth pebble center. |
| `circle` | Solid ellipse | Perfect solid circular dot. |
| `diamond` | 4-point polygon connecting edge midpoints | Rotated 45° solid rhombus. |
| `octagon` | 8-point polygon with chamfered vertices | Cut-corner octagon core. |
| `hexagon` | 6-point polygon | Hexagonal honeycomb core. |
| `target_bullseye` | Outer ellipse ring + inner $1s$ solid circle | Concentric archery target pupil. |
| `corner_brackets`| 4 corner tick squares + center dot | Minimalist crosshair cluster. |
| `notched_ring` | Solid outer disk with centered background punch | Hollow doughnut pupil. |
| `circuit_trace` | 6-point asymmetric PCB polygon | Tech circuit copper trace pad. |
| `cushion_cut` | 60-step sinusoidal curved edge polygon | Diamond cushion-cut jewel facet. |
| `hex_nut` | 30° rotated 6-point polygon | Industrial mechanical bolt nut. |
| `star` / `flower` | Multi-point parametric starburst | 8-petal blooming floral center. |
| `cross` / `plus` | 12-vertex orthogonal plus polygon | Symmetrical plus emblem. |
| `leaf` | 3 rounded vertices + 1 pointed corner | Botanical droplet center. |
| `heart` | Dual parametric Bézier curves | Centered sweet heart icon. |

---

## 🪧 5. The Decorative Text & Layout Frame Engine (`text_frames.py`)

Spanning over **4,400 lines of Python**, `backend/engines/frames/text_frames.py` is one of the most advanced programmatic QR frame generators in existence.

### Architecture:
1. **Dynamic Resizing**: Calculates extended canvas dimensions $(new\_w, new\_h)$ to accommodate banners, headers, speech bubbles, and margins.
2. **Layer Compositing**:
   - Creates a transparent RGBA master canvas.
   - Draws decorative vector shapes (shadows, ribbons, gradients, badges, borders).
   - Pastes the rendered QR code with anti-aliased clipping masks.
   - Renders typography labels with centered metrics.

### Featured Frame Styles:
- `polaroid`: Classic vintage instant camera film card with thick bottom label.
- `drop_shadow_card`: Elevated luxury product card with soft Gaussian drop shadow.
- `balloon` / `speech_bubble`: Dynamic comic speech bubble with directional tail.
- `badge_ribbon`: Heraldic achievement badge with folded ribbon banner.
- `art_deco`: 1920s Gatsby gilded geometric luxury border with stepped corners.
- `cyberpunk`: Neon cyber-HUD frame with warning chevrons and scan lines.
- `browser_window`: Modern macOS/Chrome browser chrome with traffic light dots.
- `coupon_cutout`: E-commerce voucher ticket with dashed perforated scissor cut lines.
- `phone_mockup`: Realistic mobile smartphone bezel with top camera notch.
- `cellular_automata_frame`: Generative Conway's Game of Life micro-pattern border.
- `neon_glow_frame`: Vibrant multi-pass Gaussian blurred neon tube illumination.
- `crypto_wallet_badge`: Web3 ledger card with verified security badge accents.

---

## ✍️ 6. Typography & Font Registry

`FONT_REGISTRY` in `text_frames.py` manages 12 curated TrueType Google Fonts loaded from `backend/assets/fonts/`:

```python
FONT_REGISTRY = {
    "Outfit (Modern)": "Outfit-Bold.ttf",
    "Montserrat (Geometric)": "Montserrat-Bold.ttf",
    "Roboto (Clean)": "Roboto-Bold.ttf",
    "Poppins (Friendly)": "Poppins-Bold.ttf",
    "Space Grotesk (Tech)": "SpaceGrotesk-Bold.ttf",
    "Oswald (Bold Condensed)": "Oswald-Bold.ttf",
    "Fira Code (Monospace)": "FiraCode-Bold.ttf",
    "Playfair Display (Elegant)": "PlayfairDisplay-Bold.ttf",
    "Lora (Serif)": "Lora-Bold.ttf",
    "Cinzel (Classic)": "Cinzel-Bold.ttf",
    "Dancing Script (Cursive)": "DancingScript-Bold.ttf",
    "Courier Prime (Retro)": "CourierPrime-Bold.ttf",
}
```

### Font Metrics Resolution:
```python
def resolve_font(font_name, size):
    font_path = resolve_font_path(font_name)
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()
```
The engine automatically calculates bounding box widths (`font.getbbox(text)`) and reduces font point size dynamically if text exceeds the available frame banner width.
