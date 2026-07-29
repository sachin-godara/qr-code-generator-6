---
name: frame-template-designer
description: Activate this skill when creating, editing, or troubleshooting QR code frames, templates, or layout styles in the frame_engine.py. Provides design rules for frame aesthetics, color harmony, font sizing, text placement, and template structure standards.
---

# Frame & Template Designer Skill

This skill provides design standards and rules for building beautiful, scannable QR code frames
and templates in the QR Code Maker project. Apply when working with `frame_engine.py` or defining
new entries in the `TEMPLATES` dictionary in `app.py`.

---

## 1. Frame Types Overview

The project supports these frame styles:

| Frame Type | Description | Best For |
|------------|-------------|----------|
| `none` | No layout frame | Clean, minimal look |
| `border` | Simple rectangular border | Professional/corporate |
| `shadow` | Drop-shadow card | Premium/modern feel |
| `speech_bubble` | Bubble with pointer | Social/marketing |
| `bottom_tab` | Tab below QR | Retail/signage |
| `rounded_card` | Fully rounded card | App/digital use |

---

## 2. Color Harmony Rules

When designing a frame+QR color combination, follow these harmony models:

### Monochromatic (Safest)
- Frame color = QR fill color at same hue.
- Background = white or very light tint of same hue.
- Example: Blue QR (`#0F52BA`) + Blue frame (`#0F52BA`) + White background.

### Complementary (High Impact)
- Frame color = complementary of QR fill on color wheel.
- Works best for marketing/promotional QR codes.
- Example: Green QR (`#2E8B57`) + Dark frame (`#2E3B3E`).

### Neutral (Versatile)
- Frame = dark gray or black.
- QR fill = any brand color.
- Never fails for scannability.

> ⚠️ RULE: Frame color must NEVER clash with QR fill. Test contrast between frame background and QR back_color.

---

## 3. Frame Text Rules

- **Font size range**: 40px (minimum) to 100px (maximum).
- **Recommended**: 60–80px for most frame types.
- **Text content**: Keep short — max 12 characters. Examples: `SCAN ME`, `DOWNLOAD`, `VISIT US`, `GET OFFER`.
- **ALL CAPS** always — frame text should never be lowercase.
- Text color must contrast with frame_color at ratio ≥ 4.5:1.

```python
# ✅ Good frame text settings
"frame_text_val": "SCAN ME",
"frame_text_size": 70,
"frame_text_color": "#FFFFFF",  # White on dark frame
"frame_color": "#2E8B57",        # Dark green frame
```

---

## 4. Padding & Radius Standards

| Property | Minimum | Recommended | Maximum |
|----------|---------|-------------|---------|
| `frame_padding` | 10 | 20 | 40 |
| `frame_radius` | 0 | 16–20 | 40 |
| `frame_border` | 2 | 8–10 | 20 |

- `frame_radius=0` for sharp/corporate look.
- `frame_radius=20` for modern/friendly look.
- `frame_radius=40` for pill/bubble style.

---

## 5. Template Structure Standard

Every new template in `TEMPLATES` dict must include ALL of these keys:

```python
"Template Name": {
    # QR Dot Style
    "dot_style": "rounded",          # square | rounded | circle | diamond | star | heart | arrow | cross
    
    # Eye Styles
    "eye_frame_style": "square",     # square | rounded | leaf | circle | diamond
    "eyeball_style": "square",       # must be compatible with eye_frame_style
    
    # QR Colors
    "fill_color": "#000000",         # QR dot color — dark recommended
    "back_color": "#FFFFFF",         # QR background — light recommended
    "eye_color": "#000000",          # Eye color — can differ from fill
    
    # Frame Settings
    "layout_frame": "border",        # none | border | shadow | rounded_card
    "text_frame": "bottom_tab",      # none | bottom_tab | speech_bubble | top_label
    "frame_text_val": "SCAN ME",     # ALL CAPS, max 12 chars
    "frame_color": "#000000",        # Frame background/border color
    "frame_text_color": "#FFFFFF",   # Text color on frame
    "frame_text_size": 70,           # 40–100 range
    "frame_padding": 20,             # 10–40 range
    "frame_radius": 16,              # 0–40 range
    "frame_border": 8,               # 2–20 range
}
```

> ⚠️ Never add a partial template. All keys must be present or the frame engine may crash.

---

## 6. Eye Style Compatibility Matrix

| Eye Frame | Compatible Eyeballs | Avoid |
|-----------|---------------------|-------|
| `square` | `square`, `circle`, `diamond` | `leaf`, `heart` |
| `rounded` | `rounded`, `circle`, `square` | `leaf` |
| `leaf` | `leaf`, `rounded` | `square`, `heart` |
| `circle` | `circle`, `rounded` | `diamond`, `leaf` |
| `diamond` | `diamond`, `square` | `leaf`, `heart` |

---

## 7. Template Naming Convention

- Use **Title Case**: `"Blue Speech Bubble"`, `"Green Leaf"`, `"Red Diamond Card"`
- Format: `"[Color] [Style/Shape] [Frame Type]"` (optional)
- Never use abbreviations: ❌ `"Blu SB"` → ✅ `"Blue Speech Bubble"`
- Keep names ≤ 30 characters for clean sidebar display.

---

## 8. New Frame Style Checklist

When adding a brand new frame type to `frame_engine.py`:

- [ ] Frame renders without cropping the QR quiet zone.
- [ ] Text is legible at frame_text_size=60 and frame_text_size=80.
- [ ] Frame works in both portrait and square QR aspect ratios.
- [ ] Output PNG has no white edge artifacts.
- [ ] Frame tested with at least 3 different QR fill colors.
- [ ] Added corresponding template entry in `TEMPLATES` dict.

---

## References

- PIL ImageDraw docs: https://pillow.readthedocs.io/en/stable/reference/ImageDraw.html
- Color contrast checker: https://webaim.org/resources/contrastchecker/
- HSL color picker: https://hslpicker.com/
