# Project Guidelines & Skill Rules: QR Code Maker 6

This document defines the high-priority skills, coding standards, and quality gates for the **QR Code Maker** project.

---

## 🚀 High-Priority Skills Matrix

### 1. 🖼️ QR Engine & Visual Styling (Core Priority)
* **`qr-code-expert`**: Primary skill for all PIL image processing, error correction selection (M/H/Q), matrix module styling (dots, eyes, eyeballs), and logo overlay math.
* **`qr-preview-generator`**: Rulebook for generating fast programmatic preview thumbnails (`dots/`, `eye_frames/`, `eyeballs/`).
* **`qr-tester`**: Quality gate skill. Always run QR decoding (`decode_qr_image`) and quality analysis (`analyze_qr_quality`) before declaring any rendering feature complete.

### 2. ⚡ Backend & API Performance
* **`fastapi-pro`**: Enforce async FastAPI patterns, Pydantic V2 schemas, structured error handling, and fast binary array buffers.
* **`python-performance-optimization`**: Optimize PIL image buffer operations, matrix drawing loops, and color mask blending.

### 3. 🎨 Frontend UI & Aesthetics
* **`frontend-ui-engineering`**: Enforce rich, premium aesthetics (glassmorphism, vibrant dark mode, micro-animations).
* **`tailwind-design-system`**: Unified color palettes, consistent spacing, and responsive layout guidelines.

### 4. 🔍 Codebase Architecture & Debugging
* **`graphify`**: Use for visual dependency mapping, tracing call stacks, and impact analysis during refactoring.
* **`diagnosing-bugs`**: Systematic empirical log extraction and root-cause analysis before editing code.
* **`tdd`**: Test-driven development loop for new feature additions.

---

## 🛡️ Mandatory Quality Rules

1. **Scannability Assurance**: Every generated QR code must maintain a minimum contrast ratio of 4.5:1 between foreground and background.
2. **Logo Padding**: Logo cards must include clean white or background-matched padding to keep quiet zones intact.
3. **No Breaking Changes**: Use `graphify` to verify API route dependencies before modifying core signatures in `qr_engine.py` or `qr_service.py`.
4. **Empirical Verification**: Never declare a feature or fix done without running automated test suites (`pytest`, preview generators) to verify clean execution.
5. **No Fake/Static AggregateRating Schema**: Never hardcode static `aggregateRating` or unverified review schemas in JSON-LD structured data. All structured markup must strictly follow Google Search Central guidelines (only authentic, visually present, user-accessible reviews are permitted) to prevent Spammy Structured Markup manual penalties.
