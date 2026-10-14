# Fix Secondary Backend Bugs, i18n Hardcoded Strings & Master Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all remaining code quality, backend cache collision, payload limit, and multi-language localization discrepancies, then cleanly merge all fixes into `master`.

**Architecture:**
1. Fix `_compute_cache_key` in `backend/services/qr_service.py` to hash image bytes for PIL logo images, preventing cross-user cache collisions.
2. Update `MAX_BODY_SIZE` in `backend/main.py` from 5MB to 10MB to align with `backend/routers/generator.py`.
3. Extract hardcoded English strings in `ScannerPage.astro`, `TermsPage.astro`, and `PrivacyPage.astro` into all 5 language dictionaries (`en`, `es`, `de`, `pt`, `tr`) per `AGENTS.md` Rule 6.
4. Merge branch `fix/seo-301-redirects-noindex-removal` into `master` after verifying both backend pytest (140+ tests) and frontend test suites (vitest + SEO audit + production build).

**Tech Stack:** Python 3.14 (FastAPI, PIL, Pytest), Astro 5, React 19, TypeScript/JavaScript.

**Spec:** Codebase audit findings and `AGENTS.md` multi-language compliance rules.

## Global Constraints

- Never hardcode static review or aggregateRating schemas (AGENTS.md Rule 5).
- Maintain 100% full content and feature parity across all 5 locales (`en`, `es`, `pt`, `de`, `tr`) (AGENTS.md Rules 6 & 7).
- Scannability assurance: minimum contrast ratio of 4.5:1 (AGENTS.md Rule 1).
- Every modified file must pass validation and automated tests.

## Review Focus

1. **PIL Image Hashing Performance:** Hashing `v.tobytes()` must be fast and not fail on paletted or non-standard image modes.
2. **Payload Size Consistency:** Ensure both middleware (413 response) and router endpoint (400 response) agree on 10MB limit.
3. **i18n Dictionary Parity:** All 5 locales (`en`, `es`, `de`, `pt`, `tr`) must have matching keys so `t(locale, 'key')` never falls back or throws missing key errors.
4. **Clean Merge:** Ensure fast-forward or clean merge into `master` with zero regressions.

---

### Task 1: Fix Logo Image Cache Key Collision in QR Service

**Files:**
- Modify: `backend/services/qr_service.py:50-56`
- Test: `backend/tests/test_qr_cache_collision.py`

**Interfaces:**
- Consumes: PIL `Image.Image` objects passed into `_compute_cache_key`
- Produces: Unique SHA256/MD5 hash per distinct image content

- [ ] **Step 1: Write failing test reproducing cache collision for two distinct images of same dimensions**

Create `backend/tests/test_qr_cache_collision.py`:
```python
from PIL import Image
from services.qr_service import _compute_cache_key

def test_different_images_same_dimensions_produce_distinct_cache_keys():
    # Two distinct 100x100 RGBA images (one red, one blue)
    img1 = Image.new("RGBA", (100, 100), (255, 0, 0, 255))
    img2 = Image.new("RGBA", (100, 100), (0, 0, 255, 255))

    key1 = _compute_cache_key("https://example.com", {"logo_image": img1})
    key2 = _compute_cache_key("https://example.com", {"logo_image": img2})

    assert key1 != key2, "Cache keys collided for different images of identical size and mode!"
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `powershell -NoProfile -Command ".\.venv\Scripts\pytest backend\tests\test_qr_cache_collision.py"`
Expected: `FAIL: AssertionError: Cache keys collided for different images of identical size and mode!`

- [ ] **Step 3: Implement image byte hashing in `_compute_cache_key`**

In `backend/services/qr_service.py`:
```python
        if k == "logo_image":
            if isinstance(v, Image.Image):
                img_hash = hashlib.md5(v.tobytes()).hexdigest()
                clean_params[k] = f"pil_{v.size}_{v.mode}_{img_hash}"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `powershell -NoProfile -Command ".\.venv\Scripts\pytest backend\tests\test_qr_cache_collision.py"`
Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add backend/services/qr_service.py backend/tests/test_qr_cache_collision.py
git commit -m "fix(backend): hash image bytes in _compute_cache_key to prevent logo cache collisions"
```

---

### Task 2: Harmonize Request Body Size Limits

**Files:**
- Modify: `backend/main.py:12`
- Test: `backend/tests/test_body_size_limit.py`

**Interfaces:**
- Consumes: HTTP request content-length header
- Produces: 10MB limit enforcement consistent across middleware and generator router

- [ ] **Step 1: Write test checking `MAX_BODY_SIZE` is 10MB**

Create `backend/tests/test_body_size_limit.py`:
```python
from main import MAX_BODY_SIZE

def test_max_body_size_is_10mb():
    assert MAX_BODY_SIZE == 10 * 1024 * 1024, f"MAX_BODY_SIZE should be 10MB, but is {MAX_BODY_SIZE}"
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `powershell -NoProfile -Command ".\.venv\Scripts\pytest backend\tests\test_body_size_limit.py"`
Expected: `FAIL: AssertionError: MAX_BODY_SIZE should be 10MB, but is 5242880`

- [ ] **Step 3: Update `MAX_BODY_SIZE` in `backend/main.py`**

In `backend/main.py:12`:
```python
MAX_BODY_SIZE = 10 * 1024 * 1024  # 10 MB
```

- [ ] **Step 4: Run test to verify it passes**

Run: `powershell -NoProfile -Command ".\.venv\Scripts\pytest backend\tests\test_body_size_limit.py"`
Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add backend/main.py backend/tests/test_body_size_limit.py
git commit -m "fix(backend): harmonize MAX_BODY_SIZE limit to 10MB across middleware and routes"
```

---

### Task 3: Localize Hardcoded UI Strings in Astro Templates

**Files:**
- Modify: `frontend/src/i18n/locales/*.json` (add `scanner.builtinCamera`, `legal.privacyPolicyLink`)
- Modify: `frontend/src/page-templates/ScannerPage.astro:206`
- Modify: `frontend/src/page-templates/TermsPage.astro:1439-1442`
- Modify: `frontend/src/page-templates/PrivacyPage.astro:1593`
- Test: `frontend/scripts/test_i18n_hardcoded_strings.mjs`

**Interfaces:**
- Consumes: Translation keys from all 5 locale dictionaries (`en`, `es`, `de`, `pt`, `tr`)
- Produces: 100% localized user-facing UI in compliance with `AGENTS.md` Rule 6

- [ ] **Step 1: Write test script checking for forbidden hardcoded English strings**

Create `frontend/scripts/test_i18n_hardcoded_strings.mjs`:
```javascript
import fs from 'node:fs';

const scannerPage = fs.readFileSync('frontend/src/page-templates/ScannerPage.astro', 'utf-8');
const termsPage = fs.readFileSync('frontend/src/page-templates/TermsPage.astro', 'utf-8');
const privacyPage = fs.readFileSync('frontend/src/page-templates/PrivacyPage.astro', 'utf-8');

let failed = false;

if (scannerPage.includes('>Built-in Camera<')) {
  console.error('FAIL: ScannerPage.astro contains hardcoded "Built-in Camera"');
  failed = true;
}

if (termsPage.includes('Pre-Press Verification Requirement:</strong> Always test-scan')) {
  console.error('FAIL: TermsPage.astro contains hardcoded English pre-press callout');
  failed = true;
}

if (privacyPage.includes('>Privacy Policy</a>')) {
  console.error('FAIL: PrivacyPage.astro contains hardcoded "Privacy Policy" link text');
  failed = true;
}

if (failed) {
  process.exit(1);
} else {
  console.log('PASS: All template strings properly localized.');
  process.exit(0);
}
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `node frontend/scripts/test_i18n_hardcoded_strings.mjs`
Expected: `FAIL: ScannerPage.astro contains hardcoded "Built-in Camera"` etc.

- [ ] **Step 3: Localize strings in dictionaries and templates**

1. Add `scanner.builtinCamera`:
   - `en`: `"Built-in Camera"`
   - `es`: `"Cámara integrada"`
   - `de`: `"Integrierte Kamera"`
   - `pt`: `"Câmera integrada"`
   - `tr`: `"Dahili Kamera"`
2. Update `ScannerPage.astro:206`: `{t(locale, 'scanner.builtinCamera')}`
3. Add `prePressCallout` localized strings to each locale block in `TermsPage.astro`.
4. Update `PrivacyPage.astro:1593` to use localized privacy policy link text.

- [ ] **Step 4: Run test to verify it passes**

Run: `node frontend/scripts/test_i18n_hardcoded_strings.mjs`
Expected: `PASS: All template strings properly localized.`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/i18n/locales/ frontend/src/page-templates/ frontend/scripts/test_i18n_hardcoded_strings.mjs
git commit -m "fix(i18n): localize hardcoded UI strings in Scanner, Terms, and Privacy templates"
```

---

### Task 4: Full Suite Validation & Merge to `master`

**Files:**
- Merge: `fix/seo-301-redirects-noindex-removal` into `master`

- [ ] **Step 1: Run all test suites on branch**
  - Backend pytest: `powershell -NoProfile -Command ".\.venv\Scripts\pytest backend\tests"`
  - Frontend vitest: `npm run test`
  - Multilingual SEO audit: `npm run test:seo`
  - Production build: `npm run build`
  - Production SEO audit: `node frontend/scripts/verify_production_seo.mjs`

- [ ] **Step 2: Checkout `master` and merge `fix/seo-301-redirects-noindex-removal`**
  ```bash
  git checkout master
  git merge fix/seo-301-redirects-noindex-removal
  ```

- [ ] **Step 3: Verify tests on merged `master`**
  Run all verification commands.

- [ ] **Step 4: Confirm clean git status**
  Ensure working tree is clean and ready to deploy.
