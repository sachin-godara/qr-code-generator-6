import os
import sys
from PIL import Image

sys.path.append(r'f:\Project 001\qr code generator 6\backend')
from engines.dots import MODULE_DRAWER_REGISTRY

class MockActive:
    def __init__(self, n, e, s, w):
        self.N = n
        self.E = e
        self.S = s
        self.W = w
    def __bool__(self):
        return True

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
        self.paint_color = (0, 0, 0) # Base black
        
    def is_dark(self, row, col):
        if 0 <= row < self.width and 0 <= col < self.width:
            return self.modules[row][col]
        return False

styles_to_generate = [
    "scalloped", "stepped", "swallowtail", "shield_connect", 
    "leaf_connect", "circuit_bridge", "block_bridge"
]

output_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews\dots"
os.makedirs(output_dir, exist_ok=True)

for style_name in styles_to_generate:
    print(f"Generating {style_name}...")
    drawer_cls = MODULE_DRAWER_REGISTRY.get(style_name)
    if not drawer_cls:
        print(f"ERROR: {style_name} not found in registry.")
        continue
        
    mock = MockImg()
    drawer = drawer_cls()
    drawer.initialize(mock)
    
    for row in range(5):
        for col in range(5):
            if mock.modules[row][col]:
                x = col * mock.box_size
                y = row * mock.box_size
                box = [(x, y), (x + mock.box_size, y + mock.box_size)]
                
                if getattr(drawer, "needs_neighbors", False):
                    n = mock.is_dark(row-1, col)
                    s = mock.is_dark(row+1, col)
                    e = mock.is_dark(row, col+1)
                    w = mock.is_dark(row, col-1)
                    is_active = MockActive(n, e, s, w)
                else:
                    is_active = True
                    
                drawer.drawrect(box, is_active)
                
    # RECOLOR TO ZINC-900 THEME
    target_color = (24, 24, 27)
    new_data = []
    # Use getdata() to keep compatibility for now
    for p in mock._img.getdata():
        if p[3] > 0: # If pixel is not fully transparent
            new_data.append(target_color + (p[3],))
        else:
            new_data.append(p)
    mock._img.putdata(new_data)
    
    out_path = os.path.join(output_dir, f"{style_name}.png")
    mock._img.save(out_path)
    print(f"Saved {out_path}")
