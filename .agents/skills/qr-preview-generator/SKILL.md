---
name: qr-preview-generator
description: Expert rules and exact specifications for generating programmatic preview thumbnails (dots, eye frames, eyeballs) in the QR Code Maker app without breaking the UI theme.
---

# QR Code Maker: Preview Generation Guidelines

When generating or regenerating preview thumbnails for new styles (Dots, Eye Frames, Eyeballs) in the `frontend/public/previews/` directory, you **must** strictly adhere to the following specifications to ensure visual parity with the legacy icons. 

Failure to follow these rules will result in previews that look messy, misaligned, or out-of-theme in the React UI dropdowns.

## 1. Dots Previews (`frontend/public/previews/dots/`)
Dots previews are **not** full QR codes. They are isolated instances of the dot drawer rendered on a specific 5x5 matrix.

- **Canvas Size**: `150x150` pixels
- **Background**: Transparent `(255, 255, 255, 0)`
- **Color**: Blue `(0, 80, 203)` or Hex `#0050CB`
- **Box Size**: `30` pixels per module
- **Layout Pattern**: You must use this exact 5x5 boolean matrix to ensure styles that connect adjacent modules (like *Quad Dots* or *Tech Chevron*) render their characteristic L-shapes and horizontal lines.

## 2. Eye Frame Previews (`frontend/public/previews/eye_frames/`)
Eye Frame previews are isolated 7x7 outer corners without any inner eyeball or data dots.

- **Canvas Size**: `200x200` pixels
- **Background**: Transparent `(255, 255, 255, 0)`
- **Color**: Black `(0, 0, 0)`
- **Module Scale (s)**: `24`
- **Placement (px, py)**: `16, 16`
- **Bounding Box**: The 7x7 frame is drawn starting at `px, py` with a total width/height of `7 * s` (168px).

## 3. Eyeball Previews (`frontend/public/previews/eyeballs/`)
Eyeball previews are isolated 3x3 inner blocks, scaled up for visibility.

- **Canvas Size**: `200x200` pixels
- **Background**: Transparent `(255, 255, 255, 0)`
- **Color**: Black `(0, 0, 0)`
- **Module Scale (s)**: `48`
- **Eyeball Top-Left (ebx, eby)**: `28, 28`
- **Bounding Box**: The 3x3 eyeball is drawn starting at `ebx, eby` with a total width/height of `3 * s` (144px).
  *(Note: If using backend code that calculates eyeball position via the eye frame's `px, py`, you must set `px = ebx - 2*s` and `py = eby - 2*s`)*.

## 4. Reference Implementations

Below are the EXACT Python scripts to successfully generate these elements perfectly.

### A. Generating and Recoloring Dots
Because `qrcode` drawers draw in black by default (and rely on `StyledPilImage` masks for color), you **must** manually recolor the resulting images to the theme's blue `(0, 80, 203)` after generating them.

```python
import os
import sys
from PIL import Image

sys.path.append(r'f:\Project 001\qr code generator 6\backend')
from qr_engine import module_drawers

class MockImg:
    def __init__(self):
        self._img = Image.new("RGBA", (150, 150), (255, 255, 255, 0))
        self.box_size = 30
        self.mode = "RGBA"
        self.color_mask = type("MockColorMask", (), {"back_color": (255, 255, 255, 0)})()
        self.width = 5
        self.modules = [
            [True, False, True, False, False],
            [False, False, True, False, False],
            [True, False, False, True, False],
            [False, False, False, True, True],
            [True, True, True, True, True]
        ]
        
    def is_dark(self, row, col):
        if 0 <= row < self.width and 0 <= col < self.width:
            return self.modules[row][col]
        return False

# Generate Dots
drawer_cls = module_drawers.get("minimal_dots") # Replace with target style
mock = MockImg()
drawer = drawer_cls()
drawer.initialize(mock)

for row in range(5):
    for col in range(5):
        if mock.modules[row][col]:
            x = col * mock.box_size
            y = row * mock.box_size
            box = [(x, y), (x + mock.box_size, y + mock.box_size)]
            drawer.drawrect(box, True)

# RECOLOR TO BLUE THEME
target_color = (0, 80, 203)
new_data = []
for p in mock._img.getdata():
    if p[3] > 0: # If pixel is not fully transparent
        new_data.append(target_color + (p[3],))
    else:
        new_data.append(p)
mock._img.putdata(new_data)
mock._img.save("dot_output.png")
```

### B. Generating Isolated Eye Frames & Eyeballs
Do not use `fix_all_previews.py` or full QR codes for these thumbnails! You must draw them directly onto the canvas.

```python
from PIL import Image, ImageDraw

# 1. Generating an Eye Frame
img_frame = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
draw_frame = ImageDraw.Draw(img_frame)
s = 24
px, py = 16, 16
eye_rgb = (0, 0, 0)

# Example: Ultra Thin Square
draw_frame.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=max(1, s // 6))
img_frame.save("eye_frame_output.png")


# 2. Generating an Eyeball
img_ball = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
draw_ball = ImageDraw.Draw(img_ball)
s = 48
ebx, eby = 28, 28
eyeball_rgb = (0, 0, 0)

# Example: Tiny Dot
draw_ball.ellipse([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
img_ball.save("eyeball_output.png")
```
