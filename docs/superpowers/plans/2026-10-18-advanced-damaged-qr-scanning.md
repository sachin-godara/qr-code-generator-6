# Advanced Damaged QR Code Scanning Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substantially maximize scan success rate for physically damaged, degraded, blurry, shadowed, tight-cropped, and angled QR codes across both the Python backend computer vision engine and the React live camera interface.

**Architecture:** 
1. **Backend:** Upgrade `scan_service.py` into a multi-engine ensemble (`cv2.wechat_qrcode`, `cv2.QRCodeDetectorAruco`, `cv2.QRCodeDetector`, and `pyzbar`) equipped with quiet-zone padding injection, CLAHE local contrast equalization, unsharp masking, bilateral paper-texture suppression, morphological ink-bleed erosion/dilation, and multi-angle rotation sweeps.
2. **Frontend:** Implement a zero-friction "Capture & Deep Scan" snapshot bridge in `QRScannerApp.tsx` allowing camera users to grab native uncompressed video frames and deep-scan them on the backend, plus native `window.BarcodeDetector` (Apple Vision / Android ML Kit) acceleration for high-framerate hardware decoding.
3. **i18n:** Add 100% key parity across all 5 locales (`en`, `es`, `de`, `pt`, `tr`) for new scanner actions.

**Tech Stack:** Python 3.14, OpenCV 4.14 (`opencv-contrib-python-headless`), PyZbar, FastAPI, React 19, Astro 7, TypeScript 5.7, Web APIs (`BarcodeDetector`, HTML5 Canvas).

**Spec:** Discussion in conversation 7ed2e7d1-5010-4bb9-9099-758152c39400.

---

## Global Constraints

- **Strict Multi-Language Localization (Rule 6):** Zero hardcoded user-facing English strings in UI labels, tooltips, or toast notifications. Every new key must be added to all 5 locale dictionaries (`en.json`, `es.json`, `de.json`, `pt.json`, `tr.json`).
- **No Breaking Changes (Rule 3):** Signature of `deep_scan_qr(file_bytes: bytes) -> str` must remain intact so existing API routes, tests, and callers continue working seamlessly.
- **Privacy Preservation:** Video camera frames stay 100% in local memory during live view; Deep Scan backend transmission only occurs on explicit user action ("Capture & Deep Scan" or file upload).
- **Automated Verification:** All tests must pass before declaring completion (`test_damaged_scans.py`, `test_security.py`, `test_template_scannability.py`, `node scripts/verify_i18n_keys.mjs`, `node scripts/audit_seo.mjs`, and `npm run build`).

---

## Review Focus

1. **Tight Crop Recovery:** Screenshots cropped with 0px white margin must decode cleanly after quiet-zone auto-padding.
2. **Heavy Shadow & Glare:** Images with strong gradient shadows or center glare hotspots must be rescued via CLAHE.
3. **Out-of-Focus / Motion Blur:** Blurry camera shots must recover via unsharp masking and morphological operations.
4. **Angled / Skewed QR Codes:** Codes rotated diagonally (e.g. 45°) must decode reliably via rotation sweeps and ArUco edge detection.
5. **Camera Snapshot Deep Scan:** Tapping "Deep Scan Current View" in the camera tab must grab the native frame, route it to `/api/generator/scan`, display localized progress feedback, and show results cleanly.

---

## Task Decomposition

### Task 1: Backend Multi-Engine Decoder Ensemble & Quiet-Zone Padding

**Files:**
- Modify: `backend/services/scan_service.py`
- Test: `backend/tests/test_damaged_scans.py`

**Interfaces:**
- `attempt_decode_all_engines(image_matrix) -> str | None`: Runs WeChat, OpenCV ArUco, OpenCV Standard, and PyZbar on a given matrix.
- `pad_quiet_zone(img: np.ndarray, pad: int = 32) -> np.ndarray`: Adds synthetic white borders to save tightly cropped inputs.

- [x] **Step 1: Write test suite `backend/tests/test_damaged_scans.py` covering zero-margin, shadows, blur, scratches, and rotations**
- [x] **Step 2: Initialize `QRCodeDetectorAruco` and `QRCodeDetector` in `scan_service.py`**
- [x] **Step 3: Implement `pad_quiet_zone` helper to guarantee quiet-zone margin on all inputs**
- [x] **Step 4: Implement unified `try_decode(img)` that waterfalls through WeChat -> Aruco -> OpenCV Std -> PyZbar**
- [x] **Step 5: Run `pytest backend/tests/test_damaged_scans.py` to confirm baseline passes**

---

### Task 2: Advanced Computer Vision Pre-Processing Filters in `scan_service.py`

**Files:**
- Modify: `backend/services/scan_service.py`
- Test: `backend/tests/test_damaged_scans.py`

**Interfaces:**
- Adds passes for:
  - **CLAHE Pass**: High dynamic range contrast equalization.
  - **Unsharp Mask Pass**: Sharpening for defocused / motion-blurred shots.
  - **Bilateral Filter Pass**: Paper texture & noise suppression.
  - **Morphological Erosion & Dilation Passes**: For over-inked bleeding or starved faint modules.
  - **Rotation Sweep Pass**: Multi-angle 45°, 90°, 135°, 180°, 270° rotations.

- [x] **Step 1: Implement CLAHE pass on grayscale and inverted images**
- [x] **Step 2: Implement Unsharp Mask sharpening filter pass**
- [x] **Step 3: Implement Bilateral filter and Morphological erosion/dilation passes**
- [x] **Step 4: Implement step-rotation sweep pass for diagonal orientations**
- [x] **Step 5: Verify all damaged QR test cases in `backend/tests/test_damaged_scans.py` pass cleanly**

---

### Task 3: Multi-Language Dictionary Keys for Scanner Features

**Files:**
- Modify: `frontend/src/i18n/locales/en.json`
- Modify: `frontend/src/i18n/locales/es.json`
- Modify: `frontend/src/i18n/locales/de.json`
- Modify: `frontend/src/i18n/locales/pt.json`
- Modify: `frontend/src/i18n/locales/tr.json`

**Interfaces:**
- Keys added under `"scanner"` in all 5 files:
  - `deepScanCameraBtn`: "Deep Scan Viewfinder"
  - `deepScanAnalyzing`: "AI Deep Scanning Viewfinder..."
  - `deepScanFrameFailed`: "Deep scan could not find a readable QR code. Try moving closer or adjusting lighting."
  - `resumeCamera`: "Resume Live Camera"
  - `snapshotAria`: "Capture snapshot and run AI deep scan"

- [x] **Step 1: Add new keys to `en.json`**
- [x] **Step 2: Add Spanish translations to `es.json` with 100% key parity**
- [x] **Step 3: Add German translations to `de.json` with 100% key parity**
- [x] **Step 4: Add Portuguese translations to `pt.json` with 100% key parity**
- [x] **Step 5: Add Turkish translations to `tr.json` with 100% key parity**
- [x] **Step 6: Run `node scripts/verify_i18n_keys.mjs` to guarantee 0 missing keys**

---

### Task 4: Camera Viewfinder "Capture & Deep Scan" & Native `BarcodeDetector` Support

**Files:**
- Modify: `frontend/src/react/scanner/QRScannerApp.tsx`
- Modify: `frontend/src/react/scanner/scannerUtils.ts`

**Interfaces:**
- `captureVideoFrame(videoElement: HTMLVideoElement): Promise<File | null>` in `scannerUtils.ts`.
- `handleDeepScanCameraFrame()` in `QRScannerApp.tsx`.
- Floating "Deep Scan Viewfinder" button overlay inside the live camera viewfinder.

- [x] **Step 1: Implement `captureVideoFrame` in `scannerUtils.ts` to convert `<video>` frame into a high-res PNG file**
- [x] **Step 2: Add `handleDeepScanCameraFrame` in `QRScannerApp.tsx` that triggers backend Deep Scan on the snapshot**
- [x] **Step 3: Render the "Deep Scan Viewfinder" action button inside the camera viewfinder overlay**
- [x] **Step 4: Add freeze-frame preview and error state with "Resume Camera" button on failed snapshot**
- [x] **Step 5: Add native `window.BarcodeDetector` integration in `scannerUtils.ts` for instant hardware decoding**
- [x] **Step 6: Run `node frontend/scripts/test_i18n_hardcoded_strings.mjs` to verify zero hardcoded strings**

---

### Task 5: End-to-End Regression Verification & Quality Gates

**Files:**
- Full codebase

- [x] **Step 1: Run damaged scan test suite (`pytest backend/tests/test_damaged_scans.py`)**
- [x] **Step 2: Run template scannability test suite (`pytest backend/tests/test_template_scannability.py`)**
- [x] **Step 3: Run backend security test suite (`pytest backend/tests/test_security.py`)**
- [x] **Step 4: Run scanner utils test suite (`node --experimental-strip-types frontend/scripts/test_scanner_utils.mjs`)**
- [x] **Step 5: Run i18n key parity audit (`node scripts/verify_i18n_keys.mjs`)**
- [x] **Step 6: Run SEO audit (`node scripts/audit_seo.mjs`)**
- [x] **Step 7: Run production Astro build (`npm run build`) and confirm 0 errors**

---
