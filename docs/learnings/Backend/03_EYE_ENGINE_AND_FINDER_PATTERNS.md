# 👁️ 03 - Eye Engine, Finder Patterns & Geometry Calculations

> **Algorithmic deep-dive into QR position detection patterns, asymmetrical 3-corner unlinking, the 25+ outer eye frames in `eye_frames.py`, and the 20+ inner eyeball center algorithms in `eyeballs.py`.**

---

## 🎯 1. Finder Pattern Mathematics & Anchor Offsets

A QR code contains three finder patterns located in the **Top-Left (TL)**, **Top-Right (TR)**, and **Bottom-Left (BL)** corners. Each pattern is mathematically defined within a $7s \times 7s$ pixel bounding box:

```
   y0 ┌───────────────────────┐
      │  ███████████████████  │ ── Outer Frame (7x7 modules)
      │  ██               ██  │ ── 1-Module Quiet Ring
      │  ██   █████████   ██  │
      │  ██   █████████   ██  │ ── Inner Eyeball (3x3 modules) at (px+2s, py+2s)
      │  ██   █████████   ██  │
      │  ██               ██  │
   y1 └───────────────────────┘
      x0                     x1 (px + 7s - 1, py + 7s - 1)
```

### Module Coordinate Offsets in `qr_engine.py`:
```python
border_modules = quiet_zone
s = box_size
modules_count = len(qr.modules)

eye_positions = [
    (border_modules, border_modules),                      # TL: (quiet_zone, quiet_zone)
    (modules_count + border_modules - 7, border_modules),  # TR: (cols + quiet_zone - 7, quiet_zone)
    (border_modules, modules_count + border_modules - 7)   # BL: (quiet_zone, rows + quiet_zone - 7)
]
```

---

## 🔀 2. Synchronized vs. Asymmetrical Corner Unlinking

When `link_eyes: true`, all three corners render symmetrically. When `link_eyes: false`, `qr_engine.py` passes per-corner parameters to `draw_eye_frame` and `draw_eyeball`:

```python
for idx, (ex, ey) in enumerate(eye_positions):
    px = ex * s
    py = ey * s
    ebx = px + 2 * s
    eby = py + 2 * s
    
    # Resolve per-corner styles and colors
    if idx == 0 and not link_eyes:   # Top-Left
        ef_style, eb_style = eye_frame_style_tl, eyeball_style_tl
        ef_color, eb_color = eye_color_tl, eyeball_color_tl
    elif idx == 1 and not link_eyes: # Top-Right
        ef_style, eb_style = eye_frame_style_tr, eyeball_style_tr
        ef_color, eb_color = eye_color_tr, eyeball_color_tr
    elif idx == 2 and not link_eyes: # Bottom-Left
        ef_style, eb_style = eye_frame_style_bl, eyeball_style_bl
        ef_color, eb_color = eye_color_bl, eyeball_color_bl
    else:                            # Linked Master
        ef_style, eb_style = eye_frame_style, eyeball_style
        ef_color, eb_color = eye_color, eyeball_color
        
    draw_eye_frame(draw, px, py, s, ef_style, ef_color, bg, img=img)
    draw_eyeball(draw, ebx, eby, px, py, s, eb_style, eb_color, bg, img=img)
```

---

## 🖼️ 3. Outer Eye Frame Algorithms (`eye_frames.py`)

`backend/engines/eyes/eye_frames.py` implements 25+ geometric rendering routines:

| Eye Frame Style | Implementation Technique | Geometry / Math |
| :--- | :--- | :--- |
| `rounded` | PIL `rounded_rectangle` | Smooth corner radius $r = 1.5s$. |
| `circle` | PIL `ellipse` outline | Circular outer ring of thickness $s$. |
| `double_ring` | Dual concentric `ellipse` calls | Two concentric thin rings of width $s/2$. |
| `dotted_circle` | 12 radial dots calculated via trigonometric offsets | $x = cx + r \cos(i \frac{2\pi}{12}), \; y = cy + r \sin(i \frac{2\pi}{12})$. |
| `octagon` | 8-point outer and inner polygons | 45° chamfered vertices with offset $d = 2s$. |
| `hexagon` | 6-point regular hexagon polygon | Flat-topped hexagonal honeycomb ring. |
| `diamond` | 4-point rhombus polygon | Rotated diamond frame connecting edge midpoints. |
| `corner_brackets`| 8 discrete L-shaped corner bars | Futuristic HUD target brackets. |
| `leaf` | Teardrop with 3 rounded corners, 1 pointed vertex | Organic leaf contour. |
| `droplet_tl/tr/bl` | Asymmetrical directional corner rounding | 1 sharp corner pointing towards its respective outer corner. |
| `shield` | Pentagonal shield polygon with pointed bottom | Heraldic security crest frame. |
| `squircle` | High-radius continuous superellipse | $r = 2.2s$ Apple iOS-style squircle. |
| `deckled` | Procedural value noise displacement (`noise.py`) | Hand-torn deckled edge paper frame. |
| `crystal` | Stochastic branching crystal lines (`draw_crystal_frame_func`) | Faceted mineral gem contour. |

---

## 👁️ 4. Inner Eyeball Center Algorithms (`eyeballs.py`)

`backend/engines/eyes/eyeballs.py` renders the central $3s \times 3s$ pupil core:

| Eyeball Style | Implementation Technique | Visual Description |
| :--- | :--- | :--- |
| `square` | Solid rectangle $[ebx, eby, ebx+3s-1, eby+3s-1]$ | Classic solid square pupil. |
| `rounded` | Rounded rectangle ($r = 0.75s$) | Smooth pebble center. |
| `circle` | Solid ellipse | Perfect solid circular dot. |
| `diamond` | 4-point rhombus polygon | Rotated 45° solid rhombus. |
| `target_bullseye` | Outer ellipse ring + inner $1s$ solid circle | Concentric archery target pupil. |
| `notched_ring` | Solid outer disk with centered background punch | Hollow doughnut pupil. |
| `circuit_trace` | 6-point asymmetric PCB polygon | Tech circuit copper trace pad. |
| `cushion_cut` | 60-step sinusoidal edge-bowing polygon | Parametric curve: $\text{bow} = \sin(t\pi) \times 0.25s$. |
| `hex_nut` | 30° rotated 6-point polygon | Industrial mechanical bolt nut. |
| `star` / `flower` | Multi-point parametric starburst | 8-petal blooming floral center. |
| `cross` / `plus` | 12-vertex orthogonal plus polygon | Symmetrical plus emblem. |
| `heart` | Dual parametric Bézier curves | Centered sweet heart icon. |
