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
- **Layout Pattern**: You must use this exact 5x5 boolean matrix to ensure styles that connect adjacent modules (like *Quad Dots* or *Tech Chevron*) render their characteristic L-shapes and horizontal lines:
  ```python
  pattern = [
      [True,  False, True,  False, False],
      [False, False, True,  False, False],
      [True,  False, False, True,  False],
      [False, False, False, True,  True],
      [True,  True,  True,  True,  True]
  ]
  ```

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

## 4. Reference Implementation
Always use a `MockImg` class that safely mimics `qrcode.image.styles.colormasks.StyledPilImage` to isolate the drawing logic from the heavy QR encoding engine.

### Example Mock Class for Dots:
```python
from PIL import Image

class MockImg:
    def __init__(self):
        self._img = Image.new("RGBA", (150, 150), (255, 255, 255, 0))
        self.paint_color = (0, 80, 203, 255)
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
```

### Generation Loop:
```python
from qr_engine import module_drawers

drawer_cls = module_drawers.get("your_dot_style")
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

mock._img.save("output_path.png")
```
