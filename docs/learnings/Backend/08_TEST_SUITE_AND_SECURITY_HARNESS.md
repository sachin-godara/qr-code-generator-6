# 🧪 08 - Backend Test Suite & Security Harness

> **Exhaustive breakdown of the backend test suites, security regression tests, performance benchmarks, template scannability validation, and defensive attack mitigations in QR Code Maker 6.**

---

## 🏛️ 1. Test Architecture & Harness Overview

The backend testing suite is built on **Pytest** and **FastAPI TestClient** (backed by `httpx`), providing deterministic, sub-second execution across unit, integration, scannability, performance, and security testing layers.

```
backend/tests/
├── conftest.py                  # Pytest configuration & path resolution
├── test_api_routes.py           # REST endpoint validation, status codes, payload bounds
├── test_engines.py              # Dot drawers, eye engines, frame engines, noise math
├── test_qr_service.py           # Multi-format rendering (PNG/SVG/PDF), resolution strategies
├── test_performance_cache.py    # LRU cache hit/miss benchmarks & latency measurement
├── test_security.py             # Security headers, path traversal, XSS color sanitization
└── test_template_scannability.py # Automated CV2/WeChat QR scannability across all 40+ templates
```

---

## 🔍 2. Test Module Breakdown & Line-by-Line Analysis

### 1. `test_api_routes.py` (REST Endpoint & Schema Validation)
- **`test_health_check_endpoint()`**: Validates `GET /api/health` returns `200 OK` and `{"status": "ok", "message": "API is running"}`.
- **`test_generate_qr_endpoint_post()`**: Verifies `POST /api/generator/generate` with custom styling (`dots_style="star"`, `eye_frame_style="circle"`, `eyeball_style="gear"`) produces a valid binary `image/png` response with byte size > 0.
- **`test_generate_svg_endpoint_post()`**: Verifies `POST /api/generator/generate/svg` returns `image/svg+xml` and contains standard `<svg` root tags.
- **`test_generate_qr_max_length_validation()`**: Injects 4,001 characters into `data` field to trigger Pydantic V2 max-length validation error (`422 Unprocessable Entity`).
- **`test_generate_qr_target_size_bounds_validation()`**: Validates upper bound (9,000px > 8,192px max) and lower bound (5px < 64px min) rejection with `422 Unprocessable Entity`.

---

### 2. `test_security.py` (Defensive Security & Attack Hardening)
- **`test_security_headers_present()`**: Verifies every HTTP response contains enterprise headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **`test_font_path_traversal_resilience()`**: Injects directory traversal strings (`../../../../etc/passwd`) and absolute Windows paths (`C:\Windows\System32\drivers\etc\hosts`) into `resolve_font_path()`. Confirms the resolver strips illegal characters and securely falls back to `Outfit-Bold.ttf`.
- **`test_svg_color_xss_sanitization()`**: Tests `sanitize_svg_color()` against XML/script injection attacks:
  ```python
  malicious_color = 'black"><script>alert(1)</script><path style="fill:black'
  sanitized = sanitize_svg_color(malicious_color, default="#000000")
  assert sanitized == "#000000"
  assert "<script>" not in sanitized
  ```
- **`test_scan_file_type_validation()`**: Uploads executable binary data (`application/x-msdownload`) to `POST /api/generator/scan` and verifies immediate rejection (`HTTP 400 Bad Request: Invalid file type`).
- **`test_contact_form_bounds_validation()`**: Asserts that oversized string inputs (>100 chars in name/subject) are blocked by Pydantic validators.

---

### 3. `test_engines.py` (Low-Level Engine Math & Registries)
- **`test_hex_to_rgb()`**: Tests 6-character hex (`#FF0000` -> `(255, 0, 0)`), short hex, un-prefixed hex, and malformed strings (defaulting safely to `(0, 0, 0)`).
- **`test_noise_functions()`**: Verifies `value_noise_1d` and `fractal_noise_1d` return continuous 1D float arrays for deckled frame borders and crystal geometric styling.
- **`test_module_drawers_registry()`**: Verifies `MODULE_DRAWER_REGISTRY` contains at least 30+ registered styling classes, including `diamond`, `star`, `clover`, `heart`, `leaf_droplet`, and `circuit`.
- **`test_eye_frames_and_eyeballs_rendering()`**: Renders standalone outer eye frames (`octagon`, `star`) and inner eyeballs (`diamond`, `gear`) directly onto a PIL RGBA canvas without exceptions.
- **`test_logo_utilities()`**: Tests brand color lookup (`PRESET_LOGO_BRAND_COLORS`) and NumPy Euclidean background color extraction (`make_color_transparent`).
- **`test_layout_frames()`**: Applies `apply_layout_frame(layout_template="border", padding=20)` to a 200x200 canvas and asserts output size expands to 240x240.

---

### 4. `test_performance_cache.py` (LRU Caching & Latency Benchmarks)
- Benchmarks Cold request vs. Warm cached request for `POST /api/generator/generate`:
  - **Cold Request**: Matrix generation + custom module drawing + color gradient mask + shadow filter (~50ms–150ms).
  - **Warm Request**: MD5 cache key hit in `SimpleLRUCache` (~0.8ms–2.5ms).
  - **Speedup Ratio**: Validates a **20x to 100x speedup** on warm hits and checks `Cache-Control: public, max-age=31536000, immutable` headers.

---

### 5. `test_qr_service.py` (Rendering Pipeline & Scaling Strategies)
- **`test_generate_qr_image_default()`**: Validates base QR image rendering with empty params dictionary.
- **`test_generate_qr_image_styled()`**: Validates combined styling: custom dot, custom eye frame, custom eyeball, and custom colors.
- **`test_no_stretching_resolution_strategy()`**:
  - `no_stretching=True`: Snaps `box_size` to integer multiples of the QR matrix dimension, generating a crisp 1:1 pixel grid without anti-aliasing interpolation artifacts.
  - `no_stretching=False`: Smoothly upscales to the exact pixel target using PIL high-quality Lanczos/Bicubic resampling.
- **`test_generate_qr_svg()`**: Tests SVG string generation and validates pure XML markup output.

---

### 6. `test_template_scannability.py` (Automated Scannability Quality Gate)
- Dynamically parses `frontend/src/data/templates.ts` using a Node.js AST sub-process to extract all 40+ production design presets.
- Parametrizes a Pytest test case for every template (`@pytest.mark.parametrize("template", templates_data)`).
- For each template:
  1. Generates the styled QR code at 400x400px using `generate_qr_image()`.
  2. Runs WeChat QR Deep Learning CNN decoder (`deep_scan_qr()`).
  3. If CNN fails, falls back to multi-pass OpenCV / PyZBar waterfall decoder.
  4. Asserts decoded payload matches original string (`https://example.com`), guaranteeing **100% template scannability**.

---

## ⚡ 3. Execution Commands

```bash
# Run entire test suite
pytest -v

# Run only security tests
pytest backend/tests/test_security.py -v

# Run scannability validation on all preset templates
pytest backend/tests/test_template_scannability.py -v

# Run cache and latency benchmarks with printed speedup metrics
pytest backend/tests/test_performance_cache.py -s
```
