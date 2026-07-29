---
name: streamlit-ui-builder
description: Activate this skill when building, modifying, or improving any Streamlit UI component in this QR Code Maker project. Provides design system rules, layout patterns, typography guidelines, and component standards for a premium user experience.
---

# Streamlit UI Builder Skill

This skill enforces consistent, premium UI standards across the QR Code Maker Streamlit app.
Apply these rules whenever adding, editing, or reviewing any UI component.

---

## 1. Typography Rules

This project uses premium Google Fonts. Always follow these font pairings:

| Font | Use Case |
|------|----------|
| `Outfit Bold` | Headings, titles, CTA buttons |
| `Playfair Display Bold` | Decorative headings, premium labels |
| `Courier Prime Bold` | Code-style labels, technical values |

- Default body font size: `16px`
- Heading hierarchy: h1 > h2 > h3, never skip levels
- Never use browser default fonts (serif/sans-serif) — always specify font family

---

## 2. Color Palette

Use this curated palette for consistency:

```
Primary:    #6C63FF  (vibrant indigo-violet)
Secondary:  #FF6584  (coral accent)
Success:    #2E8B57  (forest green)
Dark BG:    #0E0E1A  (deep dark navy)
Card BG:    #1A1A2E  (dark card surface)
Border:     #2D2D4E  (subtle border)
Text:       #E8E8FF  (soft white)
Muted:      #8888AA  (muted label text)
```

- Always use dark mode as default — the QR preview stands out better.
- Use `rgba` for glassmorphism effects: `rgba(255,255,255,0.05)`
- Avoid plain red, plain blue, plain green — always use curated palette above.

---

## 3. Layout Rules

- **Sidebar**: Use for all controls (dot style, colors, error correction, templates).
- **Main area**: Use exclusively for QR preview and download options.
- Always use `st.columns()` — never stack controls and preview vertically.
- Standard sidebar width: do not override — keep Streamlit default.
- Use `st.container()` to group related settings with a visual boundary.
- Add `st.divider()` between major section groups.

```python
# ✅ Correct layout pattern
with st.sidebar:
    st.header("⚙️ QR Settings")
    with st.container():
        # Controls group
        
col1, col2 = st.columns([1, 1])
with col1:
    # QR Preview
with col2:
    # Download & share options
```

---

## 4. Component Standards

### Buttons
- Use `st.button()` with emoji prefix for action buttons: `"📥 Download PNG"`
- Primary action buttons: full-width (`use_container_width=True`)
- Destructive actions: prefix with ⚠️ emoji

### Sliders
- Always provide `help=` parameter with a clear description.
- Use integer steps for size/pixel values.
- Range for QR box_size: min=5, max=30, default=10.

### Color Pickers
- Always pair color pickers with a small preview swatch.
- Label clearly: `"Fill Color (QR Dots)"`, `"Background Color"`.

### File Uploader
- Accept only: `["png", "jpg", "jpeg", "svg", "webp"]`
- Show image preview immediately after upload.

### Expanders
- Use `st.expander()` for advanced settings (collapsed by default).
- Label: `"🔧 Advanced Options"`, `"🎨 Custom Colors"`.

---

## 5. Feedback & State Messages

- Use `st.success()` for successful QR generation.
- Use `st.warning()` for scannability concerns.
- Use `st.error()` for invalid inputs.
- Use `st.info()` for tips and guidance.
- Use `st.spinner()` for all generation operations:

```python
with st.spinner("✨ Generating your QR code..."):
    result = generate_styled_qr(...)
```

---

## 6. Micro-Animation & Premium Feel

- Add `st.balloons()` or `st.snow()` as a reward after first QR generation (once per session).
- Use `st.progress()` for batch generation operations.
- Wrap QR preview in a styled container with subtle border glow using CSS injection:

```python
st.markdown("""
<style>
.qr-preview-card {
    border: 1px solid rgba(108, 99, 255, 0.4);
    border-radius: 16px;
    padding: 20px;
    background: rgba(255,255,255,0.03);
    box-shadow: 0 0 20px rgba(108, 99, 255, 0.15);
}
</style>
""", unsafe_allow_html=True)
```

---

## 7. Performance Rules

- Always use `@st.cache_data` for font loading and static resource loading.
- Use `@st.cache_resource` for model/engine initialization.
- Avoid re-running heavy QR generation on every widget interaction — use `st.session_state`.
- Debounce live preview updates to avoid thrashing.

---

## 8. Accessibility

- Always provide `label` for every widget (never use empty strings).
- Add `help=` tooltips for complex settings.
- Ensure download buttons have descriptive filenames (not `qr.png` — use `qr_wifi_office.png`).

---

## References

- Streamlit docs: https://docs.streamlit.io/
- Streamlit layout guide: https://docs.streamlit.io/library/api-reference/layout
