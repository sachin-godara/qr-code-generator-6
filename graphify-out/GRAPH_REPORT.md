# Graph Report - F:\Project 001\qr code generator 6\backend  (2026-08-13)

## Corpus Check
- Corpus is ~49,956 words - fits in a single context window. You may not need a graph.

## Summary
- 279 nodes · 535 edges · 44 communities (12 shown, 32 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38

## God Nodes (most connected - your core abstractions)
1. `generate_qr_image()` - 17 edges
2. `hex_to_rgb()` - 14 edges
3. `draw_eye_frame()` - 11 edges
4. `generate_styled_qr()` - 11 edges
5. `draw_eyeball()` - 10 edges
6. `make_color_transparent()` - 9 edges
7. `generate_qr_svg()` - 8 edges
8. `generate_deckled_rect()` - 7 edges
9. `DiagonalGradiantColorMask` - 7 edges
10. `remove_qr_background()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `apply_canvas_effects()` --calls--> `hex_to_rgb()`  [INFERRED]
  services/qr_service.py → engines/core/utils.py
- `generate_qr_image()` --calls--> `hex_to_rgb()`  [INFERRED]
  services/qr_service.py → engines/core/utils.py
- `test_hex_to_rgb()` --calls--> `hex_to_rgb()`  [EXTRACTED]
  tests/test_engines.py → engines/core/utils.py
- `generate_styled_qr()` --indirect_call--> `CustomStyledPilImage`  [INFERRED]
  qr_engine.py → engines/dots/gradient.py
- `test_layout_frames()` --calls--> `apply_layout_frame()`  [EXTRACTED]
  tests/test_engines.py → engines/frames/text_frames.py

## Import Cycles
- None detected.

## Communities (44 total, 32 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (35): draw_crystal_frame_func(), fractal_noise_1d(), generate_deckled_rect(), value_noise_1d(), hex_to_rgb(), Converts a hex color string (e.g. '#FF0000' or 'FF0000') to an RGB tuple (255, 0, CustomStyledPilImage, DiagonalGradiantColorMask (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (38): BytesIO, generate_svg_qr(), Generates a raw SVG QR code (without custom styled dots or frames), BatchItem, BatchQRRequest, generate_batch(), generate_pdf(), generate_qr() (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (6): BevelModuleDrawer, LeafConnectModuleDrawer, ScallopedModuleDrawer, ShieldConnectModuleDrawer, SteppedModuleDrawer, SwallowtailModuleDrawer

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (9): BaseHTTPMiddleware, health_check(), LimitRequestBodyMiddleware, Request, ContactForm, BaseModel, Request, Handle contact form submissions.     Currently, this just simulates sending an e (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (3): BlockBridgeModuleDrawer, DiagonalStripeModuleDrawer, QuadDotsModuleDrawer

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (3): DottedCrossModuleDrawer, LotusPetalModuleDrawer, TargetBullseyeModuleDrawer

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (4): FishtailModuleDrawer, LeafDropletModuleDrawer, ShearedModuleDrawer, StyledPilQRModuleDrawer

## Knowledge Gaps
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `generate_qr_image()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `hex_to_rgb()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `generate_styled_qr()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `generate_qr_image()` (e.g. with `generate_qr()` and `hex_to_rgb()`) actually correct?**
  _`generate_qr_image()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `hex_to_rgb()` (e.g. with `apply_canvas_effects()` and `generate_qr_image()`) actually correct?**
  _`hex_to_rgb()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09125188536953242 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08484848484848485 - nodes in this community are weakly interconnected._