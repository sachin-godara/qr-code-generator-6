# 🏷️ 05 - Logo Processor & Vector Overlay Engine

> **Algorithmic analysis of PyMuPDF vector SVG rasterization, NumPy 3D Euclidean color distance transparency removal, badge card geometry, and the 46-brand preset catalog in `backend/engines/logo/processor.py`.**

---

## 🎨 1. PyMuPDF (fitz) Vector SVG Super-Sampling

In `backend/engines/logo/processor.py`, preset brand icons are stored as pure vector SVG files in `backend/assets/preset_logos/`. During generation, they are super-sampled into high-resolution transparent pixmaps using **PyMuPDF**:

```python
def generate_preset_logo(name: str, color: tuple = (0, 0, 0)) -> Image.Image:
    asset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "assets", "preset_logos"))
    svg_path = os.path.join(asset_dir, f"{name.lower()}.svg")
    
    if not os.path.exists(svg_path) or fitz is None:
        return None
        
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
        
    # Replace currentColor with desired brand or custom hex color
    hex_color = "#{:02x}{:02x}{:02x}".format(*color)
    svg_content = svg_content.replace('currentColor', hex_color)
    
    doc = fitz.open("svg", svg_content.encode('utf-8'))
    page = doc[0]
    rect = page.rect
    svg_w = rect.width if rect.width > 0 else 24.0
    svg_h = rect.height if rect.height > 0 else 24.0
    
    # Super-sample exactly into 200x200 bounding box
    mat = fitz.Matrix(200.0 / svg_w, 200.0 / svg_h)
    pix = page.get_pixmap(matrix=mat, alpha=True)
    img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
    
    # Center into transparent 200x200 canvas
    out_img = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
    offset = ((200 - img.width) // 2, (200 - img.height) // 2)
    out_img.paste(img, offset, img)
    return out_img
```

---

## 🪄 2. NumPy 3D Euclidean Color Distance Background Removal

When user logos contain solid white or black background boxes, `make_color_transparent` strips the background using vectorized Euclidean distance in 3D RGB color space:

$$\Delta E = \sqrt{(R - T_r)^2 + (G - T_g)^2 + (B - T_b)^2} \le \text{tolerance}$$

```python
def make_color_transparent(img: Image.Image, color_rgb: tuple, tolerance: int = 0) -> Image.Image:
    import numpy as np
    img = img.convert("RGBA")
    data = np.array(img)
    r, g, b, a = data.T
    tr, tg, tb = color_rgb
    
    # Vectorized 3D Euclidean distance calculation
    distance = np.sqrt(
        (r.astype(int) - tr) ** 2 + 
        (g.astype(int) - tg) ** 2 + 
        (b.astype(int) - tb) ** 2
    )
    transparent_mask = distance <= tolerance
    data[..., 3][transparent_mask.T] = 0 # Zero out alpha channel for matching pixels
    return Image.fromarray(data)
```

---

## 🛡️ 3. Badge Card Shapes & Anti-Aliasing (`apply_logo_overlay`)

1. **Lanczos Downsampling**: Resizes the logo relative to the QR image size (`logo_size_ratio`, default `0.18`) using Pillow's highest-quality filter (`Image.Resampling.LANCZOS`).
2. **Card Badge Shapes**:
   - **`None`**: Logo floats directly over cleared QR center modules.
   - **`Circle`**: Draws an anti-aliased circular disk behind the logo with `card_draw.ellipse(card_box, fill=card_rgb)`.
   - **`Rounded Square`**: Draws an adaptive squircle card with smooth radius:
     $$\text{Radius} = \max(8, \text{int}(\min(card\_w, card\_h) \times 0.2))$$

---

## 🌐 4. Catalog of 46 Preset Brand Logos

All 46 SVGs in `backend/assets/preset_logos/` are paired with their official brand hex codes in `PRESET_LOGO_BRAND_COLORS`:
- **Social & Media**: WhatsApp (`#25D366`), Instagram (`#E4405F`), Facebook (`#1877F2`), YouTube (`#FF0000`), Pinterest (`#E60023`), Snapchat (`#FFFC00`), TikTok (`#000000`), X/Twitter (`#000000`), LinkedIn (`#0A66C2`), Telegram (`#24A1DE`), Spotify (`#1DB954`), Netflix (`#E50914`), Twitch (`#9146FF`), Reddit (`#FF4500`), Discord (`#5865F2`), WeChat (`#07C160`), Threads.
- **Tech & Contact**: Link, Location, WiFi, VCard, Email, Phone, Scan, Calendar, Maps (`#4285F4`), Play (`#3BCCFF`), Gmail (`#EA4335`), Forms (`#7248B9`), Docs (`#4285F4`), ScanMe, PDF (`#F40F02`), GitHub (`#181717`).
- **Business & Commerce**: Shopping, Amazon (`#FF9900`), PayPal (`#003087`), Payment, Storefront, Coffee, Yelp (`#FF1A1A`).
- **Media & Icons**: Music, Vimeo (`#1AB7EA`), Globe, Heart, Star.
