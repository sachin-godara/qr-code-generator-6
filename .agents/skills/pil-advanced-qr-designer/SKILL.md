---
name: pil-advanced-qr-designer
description: Activate this skill when using Python's Pillow (PIL) library to create highly advanced, stylized, and aesthetically premium QR codes. Provides techniques for gradient blending, custom shape rendering, typography badges, shadow application, alpha compositing, logo background removal, and anti-aliasing.
---

# PIL Advanced QR Designer Skill

This skill provides comprehensive, production-grade techniques for leveraging Python's Pillow (PIL) library to generate stunning, high-quality, and highly stylized QR codes and badge frames.

---

## 1. High-Resolution & Anti-Aliasing (Supersampling)

To ensure custom shapes, rounded edges, text fonts, and circular modules look crisp without jagged pixelation:
- **Supersampling (Draw Large, Scale Down):** Always render the base QR image and badges at 2x to 4x the target resolution. 
- **Resampling Filter:** When scaling down to the final target size, ALWAYS use `Image.Resampling.LANCZOS`.
  ```python
  from PIL import Image

  # 1. Render canvas at 4x target size (e.g. 2000x2000)
  high_res_canvas = Image.new("RGBA", (2000, 2000), (255, 255, 255, 0))
  # ... perform all ImageDraw operations ...
  
  # 2. Downsample with Lanczos for silky smooth anti-aliased curves & text
  target_size = (500, 500)
  final_img = high_res_canvas.resize(target_size, Image.Resampling.LANCZOS)
  ```

---

## 2. Dynamic Typography & Text Badge Rendering

Rendering crisp text with exact centering and custom badge shapes:

### A. Font Loading & Fallbacks
Always handle font loading defensively to prevent crashes if a font is missing.
```python
import os
from PIL import ImageFont

def load_font(font_path: str, size: int):
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        # Fallback to PIL default font if truetype fails
        return ImageFont.load_default()
```

### B. Precise Text Measurement & Centering
Use `ImageDraw.textbbox()` to calculate exact text dimensions rather than outdated `textsize()` methods.
```python
from PIL import ImageDraw

def draw_centered_text(draw: ImageDraw.ImageDraw, box: tuple, text: str, font, fill):
    """
    box: (x0, y0, x1, y1) bounding region to center the text within
    """
    x0, y0, x1, y1 = box
    box_w = x1 - x0
    box_h = y1 - y0

    # Get exact text bounding box
    t_left, t_top, t_right, t_bottom = draw.textbbox((0, 0), text, font=font)
    t_w = t_right - t_left
    t_h = t_bottom - t_top

    # Calculate exact top-left position to center
    tx = x0 + (box_w - t_w) // 2 - t_left
    ty = y0 + (box_h - t_h) // 2 - t_top

    draw.text((tx, ty), text, font=font, fill=fill)
```

### C. Speech Bubble & Banner Pointer Shapes
Draw speech bubble callouts using combined `rounded_rectangle` and `polygon`:
```python
def draw_speech_bubble(draw: ImageDraw.ImageDraw, x0, y0, w, h, bg_color, radius=15):
    # 1. Main bubble body
    draw.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=radius, fill=bg_color)
    
    # 2. Downward triangle pointer
    cx = x0 + w // 2
    ptr_w = 20
    ptr_h = 12
    draw.polygon([
        (cx - ptr_w // 2, y0 + h),
        (cx + ptr_w // 2, y0 + h),
        (cx, y0 + h + ptr_h)
    ], fill=bg_color)
```

---

## 3. Advanced Gradients & Color Blending

Apply vibrant gradients across the QR code matrix without leaking into the background or quiet zone:

### A. Generating Gradient Layers
- **Linear Gradient (Vertical/Horizontal/45-Degree)**:
  ```python
  import numpy as np
  from PIL import Image

  def create_linear_gradient(w: int, h: int, color1_rgb: tuple, color2_rgb: tuple, direction="vertical") -> Image.Image:
      if direction == "vertical":
          arr = np.linspace(0, 1, h)[:, None]
          arr = np.repeat(arr, w, axis=1)
      elif direction == "horizontal":
          arr = np.linspace(0, 1, w)[None, :]
          arr = np.repeat(arr, h, axis=0)
      else: # 45-degree diagonal
          x, y = np.meshgrid(np.linspace(0, 1, w), np.linspace(0, 1, h))
          arr = (x + y) / 2.0

      r = color1_rgb[0] + arr * (color2_rgb[0] - color1_rgb[0])
      g = color1_rgb[1] + arr * (color2_rgb[1] - color1_rgb[1])
      b = color1_rgb[2] + arr * (color2_rgb[2] - color1_rgb[2])
      
      rgb = np.stack([r, g, b, np.full_like(r, 255)], axis=-1).astype(np.uint8)
      return Image.fromarray(rgb, "RGBA")
  ```

- **Radial Gradient**:
  ```python
  def create_radial_gradient(w: int, h: int, center_color_rgb: tuple, outer_color_rgb: tuple) -> Image.Image:
      cx, cy = w / 2.0, h / 2.0
      max_dist = np.sqrt(cx**2 + cy**2)
      
      y, x = np.ogrid[:h, :w]
      dist = np.sqrt((x - cx)**2 + (y - cy)**2)
      norm_dist = np.clip(dist / max_dist, 0, 1)

      r = center_color_rgb[0] + norm_dist * (outer_color_rgb[0] - center_color_rgb[0])
      g = center_color_rgb[1] + norm_dist * (outer_color_rgb[1] - center_color_rgb[1])
      b = center_color_rgb[2] + norm_dist * (outer_color_rgb[2] - center_color_rgb[2])
      
      rgb = np.stack([r, g, b, np.full_like(r, 255)], axis=-1).astype(np.uint8)
      return Image.fromarray(rgb, "RGBA")
  ```

### B. Masking Technique for QR Modules
1. Generate the styled QR code modules in pure black (`#000000`) on a transparent background (`RGBA`).
2. Generate the gradient image of identical width and height.
3. Extract the alpha channel of the QR code layer to use as an alpha mask.
4. Composite the gradient image onto the final canvas using the QR alpha mask.
   ```python
   qr_mask = black_qr_layer.split()[3] # Extract alpha channel
   gradient_qr = Image.new("RGBA", (width, height), (0, 0, 0, 0))
   gradient_qr.paste(gradient_layer, (0, 0), mask=qr_mask)
   ```

---

## 4. Logo Background Removal (Chroma Keying)

When users upload logos with white/solid backgrounds, automatically remove the background color using tolerance matching:
```python
def remove_logo_background(logo_img: Image.Image, bg_color_hex="#ffffff", tolerance=30) -> Image.Image:
    logo_rgba = logo_img.convert("RGBA")
    data = np.array(logo_rgba)
    
    bg_r, bg_g, bg_b = hex_to_rgb(bg_color_hex)
    
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Calculate distance from target background color
    color_diff = np.sqrt((r.astype(int) - bg_r)**2 + (g.astype(int) - bg_g)**2 + (b.astype(int) - bg_b)**2)
    
    # Set alpha to 0 for matching pixels within tolerance
    mask = color_diff <= tolerance
    data[:, :, 3][mask] = 0
    
    return Image.fromarray(data, "RGBA")
```

---

## 5. Outer Canvas Soft Shadows (Elevated UI)

Create realistic, multi-layered Gaussian drop shadows for a "floating card" UI look:
```python
from PIL import ImageFilter

def apply_soft_drop_shadow(card_img: Image.Image, blur_radius=30, offset_y=12, shadow_color=(0, 0, 0, 100)) -> Image.Image:
    cw, ch = card_img.size
    margin = blur_radius * 2
    
    full_w = cw + margin * 2
    full_h = ch + margin * 2 + offset_y
    
    shadow_canvas = Image.new("RGBA", (full_w, full_h), (0, 0, 0, 0))
    
    # 1. Create solid shape of card for shadow mask
    card_alpha = card_img.split()[3]
    shadow_mask = Image.new("L", (cw, ch), 0)
    shadow_mask.paste(shadow_color[3], mask=card_alpha)
    
    shadow_block = Image.new("RGBA", (cw, ch), shadow_color[:3] + (255,))
    
    # 2. Paste offset shadow mask and apply Gaussian blur
    shadow_canvas.paste(shadow_block, (margin, margin + offset_y), shadow_mask)
    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(blur_radius))
    
    # 3. Paste actual card on top
    shadow_canvas.paste(card_img, (margin, margin), card_img)
    return shadow_canvas
```

---

## 6. Performance & Optimization Best Practices

- **Array Vectorization**: Use NumPy for pixel math (gradients, color keying) instead of slow nested Python `for y in range(h): for x in range(w):` loops.
- **LRU Caching**: Use `@lru_cache(maxsize=128)` for re-usable preview thumbnails or static badge templates.
- **BytesIO Streaming**: Avoid saving intermediate frames to disk; stream binary PNG bytes directly into memory using `io.BytesIO()`.
