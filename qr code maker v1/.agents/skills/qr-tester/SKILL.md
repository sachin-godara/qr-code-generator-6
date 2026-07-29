---
name: qr-tester
description: Activate this skill when testing, validating, or debugging QR code outputs in this project. Provides a systematic testing checklist, uses the decode_qr_image and analyze_qr_quality MCP tools, and defines quality gates before any QR output is considered complete.
---

# QR Tester Skill

This skill defines the quality assurance process for all QR code outputs in the QR Code Maker project.
Always apply these checks before marking any QR generation feature as complete or delivering output to the user.

---

## 1. Quality Gates (Must Pass All)

Every QR code output must pass these quality gates before approval:

| Gate | Check | Tool |
|------|-------|------|
| ✅ Scannability | Decoded successfully by scanner | `decode_qr_image` MCP |
| ✅ Quality Score | Score ≥ 80/100 | `analyze_qr_quality` MCP |
| ✅ Contrast | fill vs back contrast ≥ 4.5:1 | `validate_qr_content` MCP |
| ✅ Format | Output is PNG (not JPEG) | File extension check |
| ✅ Resolution | Width & Height ≥ 300px | PIL Image.size check |
| ✅ Quiet Zone | Border ≥ 4 modules | Visual inspection |
| ✅ Logo Coverage | Logo ≤ 30% of QR area | Pixel area calculation |

---

## 2. MCP Tool Usage

### `decode_qr_image` — Scannability Test
Use this to verify the QR code can be decoded:

```python
# After generating a QR, save it temporarily and decode
# to confirm the encoded data matches the input
decode_qr_image(image_path="output_qr.png")
# Expected: decoded content matches original input URL/text
```

### `analyze_qr_quality` — Quality Score
Use this for a comprehensive quality report:

```python
analyze_qr_quality(image_path="output_qr.png")
# Check: score >= 80, contrast OK, module clarity OK
```

### `validate_qr_content` — Input Validation
Always validate content BEFORE encoding:

```python
validate_qr_content(content="https://example.com", content_type="url")
# Run before calling generate_styled_qr()
```

---

## 3. Testing Workflow

Follow this exact order when testing a QR output:

```
Step 1: validate_qr_content()   → Validate input data
Step 2: generate_styled_qr()    → Generate the QR
Step 3: analyze_qr_quality()    → Check quality score
Step 4: decode_qr_image()       → Verify decodability
Step 5: Visual inspection       → Confirm no artifacts
Step 6: ✅ Approve or 🔄 Retry  → Pass/fail decision
```

---

## 4. Common Failure Scenarios & Fixes

| Failure | Likely Cause | Fix |
|---------|-------------|-----|
| Cannot decode | Low contrast colors | Increase contrast ratio |
| Cannot decode | Logo too large | Reduce logo to ≤ 25% |
| Cannot decode | Low error correction | Upgrade to `ERROR_CORRECT_H` |
| Low quality score | Small box_size | Increase `box_size` to ≥ 10 |
| Low quality score | Aggressive dot style | Switch to `rounded` or `square` |
| Artifacts in output | JPEG save used | Always save as PNG |
| Blurry output | Image upscaled | Regenerate at target size |

---

## 5. Color Contrast Quick Reference

For pass/fail contrast testing without external tools:

```python
def check_contrast(color1_hex, color2_hex):
    """Quick luminance contrast ratio checker."""
    def luminance(hex_color):
        r, g, b = int(hex_color[1:3], 16), int(hex_color[3:5], 16), int(hex_color[5:7], 16)
        rgb = [c/255 for c in (r, g, b)]
        rgb = [c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4 for c in rgb]
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    
    l1 = luminance(color1_hex)
    l2 = luminance(color2_hex)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    ratio = (lighter + 0.05) / (darker + 0.05)
    return ratio  # Must be >= 4.5 to pass

# Example
ratio = check_contrast("#0F52BA", "#FFFFFF")  # Should return ~8.5 ✅
```

---

## 6. Batch Testing Rules

When testing batch QR generation:
- Test first item in batch individually before running full batch.
- Stop batch if any item fails decode test.
- Report failure count and positions at end of batch.
- Save failed items separately for retry.

---

## 7. Regression Testing Checklist

After any change to `qr_engine.py` or `frame_engine.py`, run regression tests:

- [ ] URL QR code — basic scannability test.
- [ ] WiFi QR code — field encoding test.
- [ ] vCard QR code — special character handling test.
- [ ] Logo overlay QR — coverage and decodability test.
- [ ] All dot styles — generate and decode one of each.
- [ ] All frame types — visual rendering check.
- [ ] Min/max box_size — resolution boundary test.

---

## 8. Reporting

When reporting test results, always include:

```
QR Test Report
==============
Input:        [URL/data]
Style:        [dot_style + eye_style + colors]
Frame:        [layout_frame + text_frame]
Resolution:   [width x height px]
Quality Score: [0-100]
Contrast Ratio: [value]:1
Decode Status: ✅ PASS / ❌ FAIL
Decoded Data: [what was decoded]
Issues Found: [list any warnings]
Verdict:      ✅ APPROVED / 🔄 RETRY NEEDED
```

---

## References

- MCP Tool: `decode_qr_image` — qrcode-enhanced server
- MCP Tool: `analyze_qr_quality` — qrcode-enhanced server
- MCP Tool: `validate_qr_content` — qrcode-enhanced server
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- QR Code spec: ISO/IEC 18004:2015
