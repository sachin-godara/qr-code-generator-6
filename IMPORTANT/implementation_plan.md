# Detailed Backend Engine Refactoring Plan

> [!IMPORTANT]
> **Zero logic changes. Zero API changes. Zero UI changes.**
> We are ONLY reorganizing code into smaller files. Every QR code will look and work exactly the same.

---

## Current vs Target Architecture

```
BEFORE (2 giant files)             AFTER (modular structure)
─────────────────────              ────────────────────────────────
backend/                           backend/
├── qr_engine.py  ← 2,442 lines   ├── engines/
├── frame_engine.py ← 4,076 lines │   ├── core/
├── qr_service.py  ← untouched    │   │   ├── utils.py         (20 lines)
├── routers/        ← untouched   │   │   └── noise.py         (25 lines)
└── main.py         ← untouched   │   │
                                   │   ├── dots/
                                   │   │   ├── __init__.py      (registry)
                                   │   │   ├── custom_drawers.py (all 41 custom dot classes)
                                   │   │   └── gradient.py      (DiagonalGradiant class)
                                   │   │
                                   │   ├── eyes/
                                   │   │   ├── __init__.py      (registry)
                                   │   │   ├── eye_frames.py    (60 eye frame styles)
                                   │   │   └── eyeballs.py      (55 eyeball styles)
                                   │   │
                                   │   ├── logo/
                                   │   │   └── logo_engine.py   (logo overlay + bg removal)
                                   │   │
                                   │   └── frames/
                                   │       ├── __init__.py      (registry)
                                   │       ├── layout_frames.py (41 layout frames)
                                   │       └── text_frames.py   (all text/banner frames)
                                   │
                                   ├── qr_engine.py  ← slim orchestrator (~200 lines)
                                   ├── frame_engine.py ← slim orchestrator (~50 lines)
                                   ├── qr_service.py  ← UNCHANGED
                                   ├── routers/        ← UNCHANGED
                                   └── main.py         ← UNCHANGED
```

---

## What Exists Today (Full Inventory)

### In `qr_engine.py` (2,442 lines)

#### Module Drawer Classes (Dot Styles) — 41 custom classes
All classes currently defined inline in `qr_engine.py` around lines 249–1236:

| Class | Style Name |
|---|---|
| `DiamondModuleDrawer` | `diamond` |
| `RingModuleDrawer` | `ring` |
| `StarModuleDrawer` | `star` |
| `FlowerCutModuleDrawer` | `flower_cut` |
| `CloverModuleDrawer` | `clover` |
| `PlusModuleDrawer` | `plus` |
| `RoundedPlusModuleDrawer` | `rounded_plus` |
| `HeartModuleDrawer` | `heart` |
| `ShearedModuleDrawer` | `sheared` |
| `BevelModuleDrawer` | `bevel` |
| `FishtailModuleDrawer` | `fishtail` |
| `SquircleModuleDrawer` | `squircle` |
| `HexagonModuleDrawer` | `hexagon` |
| `TargetBullseyeModuleDrawer` | `target_bullseye` |
| `DiamondTargetModuleDrawer` | `diamond_target` |
| `OctagonModuleDrawer` | `octagon` |
| `DottedCrossModuleDrawer` | `dotted_cross` |
| `ArrowModuleDrawer` | `arrow` |
| `GearDotModuleDrawer` | `gear_dot` |
| `HourglassModuleDrawer` | `hourglass` |
| `PinwheelModuleDrawer` | `pinwheel` |
| `LeafDropletModuleDrawer` | `leaf_droplet` |
| `PillowModuleDrawer` | `pillow` |
| `QuadDotsModuleDrawer` | `quad_dots` |
| `TechChevronModuleDrawer` | `tech_chevron` |
| `SparkleModuleDrawer` | `sparkle` |
| `MedicalCrossModuleDrawer` | `medical_cross` |
| `LotusPetalModuleDrawer` | `lotus_petal` |
| `NetworkNodesModuleDrawer` | `network_nodes` |
| `SleekDashModuleDrawer` | `sleek_dash` |
| `MinimalDotsModuleDrawer` | `minimal_dots` |
| `HollowDotsModuleDrawer` | `hollow_dots` |
| `CrossstitchModuleDrawer` | `crossstitch` |
| `PixelArtModuleDrawer` | `pixel_art` |
| `DiagonalStripeModuleDrawer` | `diagonal_stripe` |
| `HorizontalSlashModuleDrawer` | `horizontal_slash` |
| `VerticalSlashModuleDrawer` | `vertical_slash` |
| `TriangleMosaicModuleDrawer` | `triangle_mosaic` |
| `MoonCrescentModuleDrawer` | `moon_crescent` |
| `LiquidDropModuleDrawer` | `liquid_drop` |

Plus these come from `qrcode` library directly (not our code):
`SquareModuleDrawer`, `GappedSquareModuleDrawer`, `CircleModuleDrawer`, `RoundedModuleDrawer`, `VerticalBarsDrawer`, `HorizontalBarsDrawer`

#### Special Functions in `qr_engine.py`
- `hex_to_rgb()` — utility, used everywhere
- `make_color_transparent()` — logo background removal
- `remove_qr_background()` — logo bg removal
- `value_noise_1d()`, `fractal_noise_1d()`, `generate_deckled_rect()` — math noise for deckled eye style
- `draw_topographic_frame_func()`, `draw_crystal_frame_func()` — drawing helpers for special eye frames
- `CustomStyledPilImage` — PIL image factory class (required by qrcode library)
- `DiagonalGradiantColorMask` — custom gradient class
- `generate_preset_logo()` — preset logo builder (WiFi icon, Camera, etc.)
- `generate_styled_qr()` — **main QR generation function** (L1238–L2392)
- `generate_svg_qr()` — SVG generation (L2395–L2442)

#### Eye Frame Styles (60 styles inside `generate_styled_qr`)
`square`, `rounded`, `octagon`, `corner_brackets`, `double_ring`, `dotted_circle`, `hexagon`, `diamond`, `star`, `circle`, `leaf`, `leaf_opposite`, `droplet`, `droplet_tl/tr/bl/br`, `shield`, `shield_opposite`, `squircle`, `pill_frame`, `pointed_top_frame`, `capsule_horizontal`, `left_rounded`, `right_rounded`, `minimal_ring`, `target_minimal`, `crystal`, `crystal_frame`, `house_frame`, `gear`, `arc_frame`, `brackets_square`, `brackets_curly`, `minimal_corners`, `corner_dots`, `hollow_diamond`, `tv_frame`, `deckled`, `topographic`, `split_crosshairs`, `particle_swarm`, `fluted_bezel`, `aztec_step_frame`, `circuit_trace`, `hex_nut`, `cross_notch_frame`, `camera_lens`, `ultra_thin_circle`, `ultra_thin_square`, `notched_ring`, `aerodynamic_slant`, `dynamic_swept`, `dynamic_swept_opposite`, `sheared`, `steering_wheel`, `dashed_square`, `cushion_cut`

#### Eyeball Styles (55 styles inside `generate_styled_qr`)
`square`, `circle`, `rounded`, `left_rounded`, `right_rounded`, `bottom_rounded`, `top_rounded`, `diamond`, `leaf`, `leaf_opposite`, `droplet`, `droplet_tl/tr/bl/br`, `heart`, `star`, `hexagon`, `octagon`, `squircle`, `shield`, `shield_opposite`, `cross`, `plus`, `clover`, `hollow`, `hollow_circle`, `hollow_square`, `flower`, `flower_cut`, `gear`, `rhombus`, `pinched_square`, `rounded_triangle`, `starburst`, `horizontal_pill`, `vertical_pill`, `dumbbell_eyeball`, `minimal_cross`, `minimal_x`, `tiny_dot`, `tiny_square`, `none`, `corner_brackets`, `split_crosshairs`, `notched_ring`, `fluted_bezel`, `deckled`, `circuit_trace`, `hex_nut`, `aerodynamic_slant`, `dynamic_swept`, `dynamic_swept_opposite`, `sheared`, `cushion_cut`, `target_bullseye`

---

### In `frame_engine.py` (4,076 lines)

#### Layout Frames — 41 styles inside `apply_layout_frame()` (L11–L769)
`border`, `double_border`, `dotted_border`, `brackets`, `circle`, `hexagon`, `drop_shadow_card`, `scalloped_edge`, `minimal_border`, `minimal_rounded`, `sharp_minimal`, `cut_corners`, `wireframe`, `modern_polaroid`, `polaroid_frame`, `polaroid_minimal`, `retro_stamp`, `museum_mat`, `glassmorphism_frame`, `hanging_sign`, `neon_glow_frame`, `phone_frame`, `monitor_screen`, `film_strip`, `beer_coaster`, `pizza_box`, `boba_cup`, `ramen_bowl`, `chalkboard`, `storefront_awning`, `takeout_box`, `circle_sunburst`, `circle_sprinkles`, `floating_shadow`, `coupon_dashed`, `gold_foil_menu`, `wine_label`, `art_deco`, `wooden_peel`, `tickets_cutout`

#### Text Frame Styles — inside `apply_text_frame()` (L771–L4007)
`banner_bottom`, `banner_top`, `tab_bottom`, `tab_top`, `speech_bubble`, `speech_bubble_top`, `bottom_tab`, `rounded_tab`, `cta_bar`, `floating_label`, `pill_badge`, `gradient_banner`, + dozens more banner and overlay types

#### Helper Functions
- `apply_frame()` — router function that calls layout or text frame
- `get_fitted_font()` — text sizing helper
- `render_clean_text()` — anti-aliased text drawing
- `hex_to_rgb()` — duplicate utility (exists in both files currently)

---

## Execution Plan (5 Phases)

### ✅ Phase 1 — Create Core Utilities (RISK: Zero)

**What:** Extract shared utility functions used across both files.

**Files to create:**
- `engines/__init__.py` — empty
- `engines/core/__init__.py` — empty
- `engines/core/utils.py`:
  - Move `hex_to_rgb()` here (remove duplicates in qr_engine/frame_engine)
- `engines/core/noise.py`:
  - Move `value_noise_1d()`, `fractal_noise_1d()`, `generate_deckled_rect()` here

**Changes to existing files:**
- `qr_engine.py`: Replace the 3 function definitions with `from engines.core.utils import hex_to_rgb`
- `frame_engine.py`: Same import replacement

**Test:** Run pytest → all 4 tests must pass.

---

### ✅ Phase 2 — Extract Dot Style Classes (RISK: Low)

**What:** Move all 41 custom module drawer classes out of `qr_engine.py` into their own file.

**Files to create:**
- `engines/dots/__init__.py` — contains the `MODULE_DRAWER_REGISTRY` dict
- `engines/dots/custom_drawers.py` — all 41 classes (L249–L1236 of qr_engine.py, copied verbatim)
- `engines/dots/gradient.py` — `DiagonalGradiantColorMask` class + `CustomStyledPilImage`

**Changes to `qr_engine.py`:**
```python
# BEFORE (41 class definitions inline)
class DiamondModuleDrawer(BaseModuleDrawer):
    # 30 lines of code
class RingModuleDrawer(BaseModuleDrawer):
    # 30 lines of code
# ... 39 more classes

# AFTER (2 clean import lines)
from engines.dots.custom_drawers import *
from engines.dots.gradient import DiagonalGradiantColorMask, CustomStyledPilImage
```

**Test:** Run pytest → all 4 tests must pass.

---

### ✅ Phase 3 — Extract Eye & Eyeball Drawing Logic (RISK: Medium)

**What:** The eye frame and eyeball drawing code (L1450–L2390 of `generate_styled_qr`) is currently a single enormous block of 157 `if/elif` branches. We will extract this into two dedicated modules.

**Files to create:**
- `engines/eyes/__init__.py`
- `engines/eyes/eye_frames.py`:
  - One function `draw_eye_frame(draw, px, py, s, style, color, bg_color)` that contains the exact same if/elif logic — just moved to a new file
- `engines/eyes/eyeballs.py`:
  - One function `draw_eyeball(draw, px, py, s, style, color, bg_color)` containing the same eyeball if/elif logic

**Changes to `qr_engine.py`'s `generate_styled_qr`:**
```python
# BEFORE: 900 lines of inline if/elif drawing code
if eye_frame_style == "rounded":
    draw.rounded_rectangle(...)
elif eye_frame_style == "octagon":
    ...
# 57 more branches

# AFTER: clean 3-line call
from engines.eyes.eye_frames import draw_eye_frame
from engines.eyes.eyeballs import draw_eyeball

draw_eye_frame(draw, px, py, s, current_eye_frame_style, current_eye_rgb, bg)
draw_eyeball(draw, px, py, s, current_eyeball_style, current_eyeball_rgb, bg)
```

> [!IMPORTANT]
> The **logic inside the functions is 100% identical** — we are only moving the code into separate files. No coordinate math changes.

**Test:** Generate QR codes with 5+ different eye styles to visually verify.

---

### ✅ Phase 4 — Extract Logo Engine (RISK: Low)

**What:** Move all logo-related functions out of `qr_engine.py`.

**Files to create:**
- `engines/logo/__init__.py`
- `engines/logo/logo_engine.py`:
  - `make_color_transparent()`
  - `remove_qr_background()`
  - `generate_preset_logo()`
  - All logo overlay/card-drawing code from inside `generate_styled_qr`

**Changes to `qr_engine.py`:**
```python
from engines.logo.logo_engine import generate_preset_logo, remove_qr_background, make_color_transparent
```

**Test:** Generate QR code with a preset logo (WiFi, Camera) and with a custom uploaded logo.

---

### ✅ Phase 5 — Extract Frame Engine (RISK: Low)

**What:** Move the contents of `apply_layout_frame()` and `apply_text_frame()` into their own module files. The *functions themselves stay in `frame_engine.py`* — only their internal if/elif branches are extracted.

**Files to create:**
- `engines/frames/__init__.py`
- `engines/frames/layout_frames.py`:
  - One function per layout frame (e.g., `draw_border_frame()`, `draw_polaroid_frame()`)
  - Each function takes `(qr_img, frame_color, padding, corner_radius, border_thickness)` arguments
- `engines/frames/text_frames.py`:
  - One function per text frame template

**Changes to `frame_engine.py`:**
```python
# BEFORE: apply_layout_frame() is 760 lines of if/elif
def apply_layout_frame(qr_img, layout_template, ...):
    if layout_template == "border":
        # 20 lines
    elif layout_template == "double_border":
        # 25 lines
    # ... 39 more elif blocks

# AFTER: clean dispatch table (no logic change)
from engines.frames.layout_frames import LAYOUT_FRAME_REGISTRY

def apply_layout_frame(qr_img, layout_template, ...):
    if layout_template == "none":
        return qr_img
    handler = LAYOUT_FRAME_REGISTRY.get(layout_template)
    if handler:
        return handler(qr_img, frame_color, padding, corner_radius, border_thickness)
    return qr_img
```

**Test:** Run pytest + test 5 different frame styles manually.

---

## Safety Guarantees

| Rule | How it's enforced |
|---|---|
| No API changes | `qr_service.py`, `routers/`, and `main.py` are never touched |
| No logic changes | Code is **moved**, never rewritten |
| Tests pass after each phase | `pytest` must show `4 passed` before next phase begins |
| Rollback possible anytime | Each phase is one git commit — one `git revert` undoes it |

---

## After Refactoring — Benefits

| Metric | Before | After |
|---|---|---|
| Largest single file | 4,076 lines | ~400 lines (layout_frames.py) |
| Adding a new dot style | Edit 2,442-line file | Add one class to custom_drawers.py |
| Adding a new frame | Edit 4,076-line file | Add one function to layout_frames.py |
| Finding a bug in "hexagon eye" | Search 2,442-line file | Open eye_frames.py → search "hexagon" |

---

**Ready to begin Phase 1?** I will start immediately once you approve.
