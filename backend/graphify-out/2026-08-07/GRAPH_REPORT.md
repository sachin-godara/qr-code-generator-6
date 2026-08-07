# Graph Report - backend  (2026-08-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 224 nodes · 427 edges · 38 communities (13 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `567aa7c4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- generator.py
- test_engines.py
- test_api_routes.py
- draw_eye_frame
- .initialize
- DiagonalGradiantColorMask
- custom_drawers.py
- dots/__init__.py
- StyledPilQRModuleDrawer
- HeartModuleDrawer
- BevelModuleDrawer
- ArrowModuleDrawer
- DiagonalStripeModuleDrawer
- DottedCrossModuleDrawer
- HexagonModuleDrawer
- HollowDotsModuleDrawer
- HorizontalSlashModuleDrawer
- HourglassModuleDrawer
- LeafDropletModuleDrawer
- LotusPetalModuleDrawer
- MedicalCrossModuleDrawer
- MinimalDotsModuleDrawer
- MoonCrescentModuleDrawer
- OctagonModuleDrawer
- PillowModuleDrawer
- PlusModuleDrawer
- RingModuleDrawer
- RoundedPlusModuleDrawer
- ShearedModuleDrawer
- SleekDashModuleDrawer
- SparkleModuleDrawer
- StarModuleDrawer
- TargetBullseyeModuleDrawer
- TechChevronModuleDrawer
- VerticalSlashModuleDrawer

## God Nodes (most connected - your core abstractions)
1. `generate_qr_image()` - 15 edges
2. `hex_to_rgb()` - 12 edges
3. `draw_eye_frame()` - 9 edges
4. `draw_eyeball()` - 8 edges
5. `generate_qr_svg()` - 8 edges
6. `generate_deckled_rect()` - 6 edges
7. `BevelModuleDrawer` - 6 edges
8. `apply_layout_frame()` - 6 edges
9. `make_color_transparent()` - 6 edges
10. `generate_qr_pdf()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `generate_qr_image()` --calls--> `hex_to_rgb()`  [INFERRED]
  services/qr_service.py → engines/core/utils.py
- `apply_canvas_effects()` --calls--> `hex_to_rgb()`  [INFERRED]
  services/qr_service.py → engines/core/utils.py
- `test_hex_to_rgb()` --calls--> `hex_to_rgb()`  [EXTRACTED]
  tests/test_engines.py → engines/core/utils.py
- `test_layout_frames()` --calls--> `apply_layout_frame()`  [EXTRACTED]
  tests/test_engines.py → engines/frames/text_frames.py
- `test_logo_utilities()` --calls--> `make_color_transparent()`  [EXTRACTED]
  tests/test_engines.py → engines/logo/processor.py

## Import Cycles
- None detected.

## Communities (38 total, 25 thin omitted)

### Community 0 - "generator.py"
Cohesion: 0.12
Nodes (28): BytesIO, generate_styled_qr(), generate_svg_qr(), Generates a raw SVG QR code (without custom styled dots or frames), BatchItem, BatchQRRequest, generate_batch(), generate_pdf() (+20 more)

### Community 1 - "test_engines.py"
Cohesion: 0.17
Nodes (17): fractal_noise_1d(), value_noise_1d(), hex_to_rgb(), Converts a hex color string (e.g. '#FF0000' or 'FF0000') to an RGB tuple (255, 0, apply_frame(), apply_layout_frame(), apply_text_frame(), apply_logo_overlay() (+9 more)

### Community 2 - "test_api_routes.py"
Cohesion: 0.13
Nodes (7): health_check(), Request, ContactForm, BaseModel, Request, Handle contact form submissions.     Currently, this just simulates sending an e, submit_contact_form()

### Community 3 - "draw_eye_frame"
Cohesion: 0.32
Nodes (10): draw_crystal_frame_func(), generate_deckled_rect(), draw_eye_frame(), find_coeffs(), make_sharp_corner(), Renders outer eye frame onto draw canvas at (px, py) position with module size s, draw_eyeball(), make_eyeball_sharp_corner() (+2 more)

### Community 4 - ".initialize"
Cohesion: 0.18
Nodes (3): CloverModuleDrawer, LiquidDropModuleDrawer, NetworkNodesModuleDrawer

### Community 5 - "DiagonalGradiantColorMask"
Cohesion: 0.20
Nodes (6): CustomStyledPilImage, DiagonalGradiantColorMask, Fills in the foreground with a gradient sweeping diagonally from corner to corne, Subclass of StyledPilImage that fixes the python qrcode library bug on dark back, QRColorMask, StyledPilImage

### Community 6 - "custom_drawers.py"
Cohesion: 0.22
Nodes (3): DiamondModuleDrawer, GearDotModuleDrawer, TriangleMosaicModuleDrawer

### Community 7 - "dots/__init__.py"
Cohesion: 0.22
Nodes (3): FishtailModuleDrawer, PixelArtModuleDrawer, QuadDotsModuleDrawer

### Community 8 - "StyledPilQRModuleDrawer"
Cohesion: 0.22
Nodes (4): CrossstitchModuleDrawer, DiamondTargetModuleDrawer, FlowerCutModuleDrawer, StyledPilQRModuleDrawer

### Community 9 - "HeartModuleDrawer"
Cohesion: 0.17
Nodes (3): HeartModuleDrawer, PinwheelModuleDrawer, SquircleModuleDrawer

## Knowledge Gaps
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `generate_qr_image()` connect `generator.py` to `test_engines.py`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `hex_to_rgb()` connect `test_engines.py` to `generator.py`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `generate_qr_image()` (e.g. with `generate_qr()` and `hex_to_rgb()`) actually correct?**
  _`generate_qr_image()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `hex_to_rgb()` (e.g. with `apply_canvas_effects()` and `generate_qr_image()`) actually correct?**
  _`hex_to_rgb()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `generator.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._
- **Should `test_api_routes.py` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._