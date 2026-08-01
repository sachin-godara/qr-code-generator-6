---
name: qr-code-expert
description: Activate this skill when generating, styling, or troubleshooting QR codes in this project. Provides expert rules for error correction, PIL image processing, logo overlays, color contrast, and scannability best practices tailored for the QR Code Maker app.
---

# QR Code Expert Skill

This skill provides expert-level rules and best practices for the QR Code Maker project.
Apply these rules whenever generating, modifying, or debugging QR code outputs.

---

## 1. Error Correction Levels

Always choose the correct error correction level based on the use case:

| Level | Recovery | When to Use |
|-------|----------|-------------|
| `ERROR_CORRECT_L` | ~7%  | Clean, simple codes with no logo |
| `ERROR_CORRECT_M` | ~15% | Default — good balance |
| `ERROR_CORRECT_Q` | ~25% | Codes with moderate styling |
| `ERROR_CORRECT_H` | ~30% | **Required when adding logos or heavy styling** |

> ⚠️ RULE: If a logo/watermark is embedded, ALWAYS use `ERROR_CORRECT_H`.

---

## 2. QR Code Size & Border Rules

- Always use `version=None` and `fit=True` to auto-select the smallest matrix.
- Default `box_size=10` for standard output; increase to 20 for high-res exports.
- Minimum border (quiet zone) = 4 modules. Never go below 2.
- Output resolution: minimum 300x300px for print quality.

---

## 3. Color & Contrast Guidelines

- **Minimum contrast ratio**: fill_color vs back_color must have contrast ratio ≥ 4.5:1.
- Dark fill on light background is most reliable. Avoid light-on-dark if possible.
- Never use pure red (`#FF0000`) as fill — scanners may misread it.
- Gradient QR codes must maintain contrast across the entire gradient range.
- Test all custom color combinations with at least 2 scanner apps.

---

## 4. PIL Image Processing Rules

- Use `StyledPilImage` with custom module drawers for all styled outputs.
- For logo overlays:
  1. Set `ERROR_CORRECT_H` first.
  2. Resize logo to max 30% of QR width/height.
  3. Use `Image.paste()` at the exact center: `((qr_w - logo_w) // 2, (qr_h - logo_h) // 2)`.
  4. Apply rounded mask to logo for aesthetic consistency.
- Never scale down QR images after generation — always generate at target size.
- Use `LANCZOS` resampling if any resize is absolutely necessary.

---

## 5. Dot & Eye Styles

Supported dot styles in this project:
- `square`, `rounded`, `circle`, `diamond`, `star`, `heart`, `arrow`, `cross`

Eye (finder pattern) rules:
- Eye frame and eyeball styles must be visually compatible.
- Leaf eyes pair best with rounded dots.
- Square eyes pair best with square or diamond dots.
- Never mix `heart` eyeball with `square` eye frame — visual clash.

---

## 6. SVG vs PNG Output

- Use **SVG** when output will be used for print or large-format display.
- Use **PNG** for web, app, and sharing use cases.
- SVG exports must include `viewBox` for proper scaling.
- PNG exports should default to `optimize=True` in PIL save.

---

## 7. Scannability Checklist

Before finalizing any QR output, verify:
- [ ] Quiet zone (border) is at least 4 modules wide.
- [ ] Contrast ratio passes the 4.5:1 minimum.
- [ ] If logo is embedded, it covers ≤ 30% of the QR area.
- [ ] Code has been tested with at least one real scanner.
- [ ] Error correction level is appropriate for the style complexity.

---

## 8. Common Mistakes to Avoid

- ❌ Using `ERROR_CORRECT_L` with styled/colored QR codes.
- ❌ Saving QR as JPEG (lossy compression breaks scannability).
- ❌ Logo larger than 30% of QR area.
- ❌ Low contrast color combinations (e.g., yellow on white).
- ❌ Scaling up a small QR image instead of regenerating at larger size.

---

## References

- PIL/Pillow docs: https://pillow.readthedocs.io/
- qrcode library: https://pypi.org/project/qrcode/
- QR Code standard: ISO/IEC 18004
