# 🎨 02 - Backend QR Engine & Module Drawer Algorithms

> **In-depth algorithmic analysis of matrix creation, center module clearing, the 50+ custom dot drawer classes (`MODULE_DRAWER_REGISTRY`), orthogonal neighbor-sampling bridged drawers, and gradient color masks in `backend/qr_engine.py` and `backend/engines/dots/`.**

---

## 📐 1. Matrix Construction & Center Clearing Math

`backend/qr_engine.py` orchestrates matrix construction via the `qrcode` library before applying custom PIL pixel manipulations:

```python
qr = qrcode.QRCode(
    error_correction=ec_level,
    box_size=box_size,
    border=quiet_zone,
)
qr.add_data(data)
qr.make(fit=True)
```

### Center Module Radial Clearing:
When a logo is embedded, center modules are cleared to prevent dots from bleeding through transparent logo areas:

$$\text{Distance}^2 = (x - cx)^2 + (y - cy)^2 < r_{\text{clear}}^2$$

```python
if has_logo and logo_clear_size >= 0:
    modules_count = len(qr.modules)
    cx = (modules_count - 1) / 2.0
    cy = (modules_count - 1) / 2.0
    
    logo_module_width = (modules_count + 8) * logo_size_ratio
    clear_radius = (logo_module_width / 2.0) + logo_clear_size
    clear_radius_sq = clear_radius * clear_radius
    
    for y in range(modules_count):
        dy_sq = (y - cy) ** 2
        for x in range(modules_count):
            dx = x - cx
            if dx * dx + dy_sq < clear_radius_sq:
                # MANDATORY: Never clear the three 7x7 corner finder patterns!
                if not (x < 8 and y < 8) and not (x > modules_count - 9 and y < 8) and not (x < 8 and y > modules_count - 9):
                    qr.modules[y][x] = False
```

---

## 🧩 2. Complete Catalog of 50+ Module Drawer Classes

Located in `backend/engines/dots/custom_drawers.py`, all drawers inherit from PIL's `QRModuleDrawer`:

### 1. Geometric Shapes:
- **`DiamondModuleDrawer`**: Draws a 45° rotated polygon connecting the edge midpoints $(cx, y_0), (x_1, cy), (cx, y_1), (x_0, cy)$.
- **`RingModuleDrawer`**: Renders concentric outer ellipse and hollows out the inner 40% radius.
- **`StarModuleDrawer`**: 8-point parametric star calculated via alternate inner and outer radial offsets:
  $$x = cx + r \cos(i \pi / 4), \quad y = cy + r \sin(i \pi / 4)$$
- **`FlowerCutModuleDrawer`**: 4-lobed petal shape with concave quadrant cutouts.
- **`CloverModuleDrawer`**: 4-leaf clover rosette formed by 4 overlapping sub-circles.
- **`PlusModuleDrawer` / `RoundedPlusModuleDrawer`**: 12-vertex orthogonal plus sign with sharp or rounded vertices.
- **`HexagonModuleDrawer`**: 6-sided flat-topped polygon.
- **`OctagonModuleDrawer`**: 8-sided polygon with 45° corner chamfers.
- **`TargetBullseyeModuleDrawer`**: Outer circle ring + inner concentric solid dot.
- **`DiamondTargetModuleDrawer`**: Diamond-shaped concentric target.

### 2. Modern & Organic Shapes:
- **`HeartModuleDrawer`**: Dual cubic Bézier curves forming a symmetrical heart icon.
- **`ShearedModuleDrawer`**: 18° sheared parallelogram.
- **`BevelModuleDrawer`**: 3D-chiseled faux-embossed square.
- **`SquircleModuleDrawer`**: Superellipse ($x^4 + y^4 = r^4$) blending square area with rounded aesthetics.
- **`LeafDropletModuleDrawer`**: 3 rounded corners and 1 sharp top-left corner.
- **`PillowModuleDrawer`**: Inwardly curved concave square edges.
- **`QuadDotsModuleDrawer`**: 2x2 cluster of 4 distinct micro-dots inside each module.
- **`TechChevronModuleDrawer`**: Directional futuristic cyber-bracket.
- **`SparkleModuleDrawer`**: 4-pointed radiant star with concave arms.
- **`LotusPetalModuleDrawer`**: Elegant tapered bud petal contour.
- **`MoonCrescentModuleDrawer`**: Slender lunar crescent with circular cutout punch.
- **`LiquidDropModuleDrawer`**: Organic teardrop with fluid dripping tension.

### 3. Orthogonal Neighbor-Sampling Connected Drawers:
These advanced drawers inspect adjacent cells in `self.img.modules` to draw seamless, continuous circuit board traces or organic ribbon bridges:

```python
class ShieldConnectModuleDrawer(QRModuleDrawer):
    def draw(self, box, is_active):
        if not is_active: return
        # Inspect 4-way orthogonal connectivity
        n = self.is_module_active(self.x, self.y - 1)
        s = self.is_module_active(self.x, self.y + 1)
        e = self.is_module_active(self.x + 1, self.y)
        w = self.is_module_active(self.x - 1, self.y)
        # Dynamically round unconnected corners while bridging connected edges
```
- **`ShieldConnectModuleDrawer`**: Continuous rounded shields.
- **`LeafConnectModuleDrawer`**: Organic flowing foliage ribbons.
- **`CircuitBridgeModuleDrawer`**: PCB copper trace routes with 45° chamfered junctions.
- **`BlockBridgeModuleDrawer`**: Thick industrial cross-beam connections.
- **`NetworkNodesModuleDrawer`**: Graph theory circular nodes with thin interconnected edges.

---

## 🌈 3. Gradient Color Mask Architecture (`gradient.py`)

`backend/engines/dots/gradient.py` subclasses PIL `StyledPilImage` and `QRColorMask` to calculate exact per-pixel RGB interpolations during matrix rendering:

```python
class DiagonalGradiantColorMask(QRColorMask):
    """Interpolates color along 45° diagonal vectors (TL->BR or TR->BL)"""
    def __init__(self, back_color=(255,255,255), start_color=(0,0,0), end_color=(0,0,0), direction="TL_BR"):
        self.back_color = back_color
        self.start_color = start_color
        self.end_color = end_color
        self.direction = direction

    def get_fg_color(self, image, x, y):
        w, h = image.size
        if self.direction == "TL_BR":
            factor = (x + y) / float(w + h)
        else: # TR_BL
            factor = ((w - x) + y) / float(w + h)
        factor = max(0.0, min(1.0, factor))
        r = int(self.start_color[0] + factor * (self.end_color[0] - self.start_color[0]))
        g = int(self.start_color[1] + factor * (self.end_color[1] - self.start_color[1]))
        b = int(self.start_color[2] + factor * (self.end_color[2] - self.start_color[2]))
        return (r, g, b, 255)
```
