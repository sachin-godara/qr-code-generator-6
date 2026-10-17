# Scanner Subsystem Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all bugs, edge cases, and compliance gaps uncovered in the comprehensive QR Scanner audit — including locale-aware generator redirection, complete multi-language localization (en, es, de, pt, tr), hidden container DOM render suppression, escaped WiFi parsing, client-side SVG rasterization for deep scan, and resilient export downloads.

**Architecture:** Enhances the existing React island ([`QRScannerApp.tsx`](file:///f:/Project%20001/qr%20code%20generator%206/frontend/src/react/scanner/QRScannerApp.tsx)) and translation dictionaries ([`en.json`](file:///f:/Project%20001/qr%20code%20generator%206/frontend/src/i18n/locales/en.json), [`es.json`](file:///f:/Project%20001/qr%20code%20generator%206/frontend/src/i18n/locales/es.json), [`de.json`](file:///f:/Project%20001/qr%20code%20generator%206/frontend/src/i18n/locales/de.json), [`pt.json`](file:///f:/Project%20001/qr%20code%20generator%206/frontend/src/i18n/locales/pt.json), [`tr.json`](file:///f:/Project%20001/qr%20code%20generator%206/frontend/src/i18n/locales/tr.json)). Preserves zero-data-leak client privacy and leverages the existing `useTranslation()` context for locale resolution and localized strings.

**Tech Stack:** React 19, Astro 7, TypeScript 5.7, `html5-qrcode`, Vitest, FastAPI, OpenCV.

**Spec:** [`scanner_comprehensive_analysis.md`](file:///C:/Users/DELL/.gemini/antigravity-ide/brain/7ed2e7d1-5010-4bb9-9099-758152c39400/scanner_comprehensive_analysis.md)

---

## Global Constraints

- **Strict Multi-Language Localization (Rule 6):** Zero hardcoded user-facing English strings in UI labels, badges, safety reasons, tooltips, or toast notifications. Every new key must be added to all 5 locale dictionaries (`en.json`, `es.json`, `de.json`, `pt.json`, `tr.json`).
- **No Breaking Changes (Rule 3):** All public signatures and parser outputs (`ParsedQRData`, `parseQRContent`) must remain backward-compatible with existing consumers and unit tests.
- **Privacy Preservation:** Video camera frames must never leave the browser. Backend fallback is strictly reserved for user-initiated file uploads that fail client decode.
- **Automated Verification:** All tests must pass before declaring completion (`vitest`, `node scripts/audit_seo.mjs`, `node frontend/scripts/test_i18n_hardcoded_strings.mjs`, and `pytest tests/test_security.py`).

---

## Review Focus

1. **Non-English Locale Redirection:** Clicking "Open in QR Studio" from `/de/qr-code-scanner` must navigate to `/de/?text=...`, not `/`.
2. **Escaped WiFi Semicolons:** A WiFi QR containing `WIFI:S:Home\;Net;P:P\@ss\;word123;;` must parse `ssid` as `Home;Net` and `password` as `P@ss;word123` without truncation.
3. **Hidden Container DOM Safety:** When `activeTab === 'file'`, calling `scanFile(file, false)` must not mutate `#qr-reader` DOM elements or cause 0x0 canvas errors.
4. **SVG File Fallback:** If an SVG image fails client decode, it must be cleanly rasterized on canvas into a PNG blob before transmitting to `/api/generator/scan`.
5. **Cold-Start Export Resiliency:** Download buttons must abort after a 15-second timeout instead of spinning indefinitely if the backend cold-starts.

---

## Task Decomposition

### Task 1: Locale-Aware Studio Redirection & Hidden Container Fix

**Files:**
- Modify: `frontend/src/react/scanner/QRScannerApp.tsx:L394-L1123`
- Test: `frontend/src/tests/QRScannerApp.test.ts`

**Interfaces:**
- Consumes: `useTranslation().locale` from `frontend/src/i18n/useTranslation.tsx`.
- Produces: `getCreatorUrl(rawText: string, locale?: string) -> string`.

- [x] **Step 1: Write test for `getCreatorUrl` in `frontend/src/tests/QRScannerApp.test.ts`**

```ts
it('generates localized creator URLs for non-English locales', () => {
  expect(getCreatorUrl('https://example.com', 'en')).toBe('/?text=https%3A%2F%2Fexample.com');
  expect(getCreatorUrl('https://example.com', 'de')).toBe('/de/?text=https%3A%2F%2Fexample.com');
  expect(getCreatorUrl('https://example.com', 'es')).toBe('/es/?text=https%3A%2F%2Fexample.com');
  expect(getCreatorUrl('https://example.com', 'pt')).toBe('/pt/?text=https%3A%2F%2Fexample.com');
  expect(getCreatorUrl('https://example.com', 'tr')).toBe('/tr/?text=https%3A%2F%2Fexample.com');
});
```

- [x] **Step 2: Export helper `getCreatorUrl(raw: string, locale?: string): string` and use in `QRScannerAppContent`**

Extract `getCreatorUrl` as a standalone exported pure function, and inside `QRScannerAppContent` read `const { t, locale } = useTranslation();` and call `getCreatorUrl(scanResult, locale)`.

- [x] **Step 3: Update `scanFile(file, false)` in `scanWithFallback`**

In `QRScannerApp.tsx` lines 773 & 820, change `scanFile(file, true)` to `scanFile(file, false)` to avoid hidden container DOM rendering issues.

- [x] **Step 4: Verify test passes**

Run: `node --import tsx --test frontend/src/tests/QRScannerApp.test.ts` or vitest.

---

### Task 2: Escaped Character Support in WiFi QR Parser

**Files:**
- Modify: `frontend/src/react/scanner/QRScannerApp.tsx:L201-L218`
- Test: `frontend/src/tests/QRScannerApp.test.ts`

**Interfaces:**
- Consumes: `raw: string` in ZXing WiFi format `WIFI:...;;`.
- Produces: Correctly unescaped `ssid` and `password` properties in `ParsedQRData.wifi`.

- [x] **Step 1: Write failing test for escaped WiFi parsing**

```ts
it('correctly parses WiFi payloads with escaped colons and semicolons', () => {
  const raw = 'WIFI:S:Guest\\;Office\\:Main;T:WPA;P:Super\\;Secret\\:2026;H:true;;';
  const parsed = parseQRContent(raw);
  expect(parsed.type).toBe('wifi');
  expect(parsed.wifi?.ssid).toBe('Guest;Office:Main');
  expect(parsed.wifi?.password).toBe('Super;Secret:2026');
  expect(parsed.wifi?.authType).toBe('WPA');
  expect(parsed.wifi?.hidden).toBe(true);
});
```

- [x] **Step 2: Implement escape-aware field extractor in `parseQRContent`**

In `QRScannerApp.tsx`, update WiFi parsing logic:
```ts
const getField = (tag: string) => {
  const match = raw.match(new RegExp(`${tag}:((?:[^;\\\\]|\\\\.)*)`));
  if (!match) return '';
  return match[1].replace(/\\([;:,\\])/g, '$1');
};
```

- [x] **Step 3: Run test to verify it passes**

Expected: PASS with full unescaped characters.

---

### Task 3: SVG Upload Rasterization Preprocessor for Backend Deep Scan

**Files:**
- Modify: `frontend/src/react/scanner/QRScannerApp.tsx:L836-L878`
- Test: `frontend/src/tests/QRScannerApp.test.ts`

**Interfaces:**
- Consumes: Uploaded `File` of type `image/svg+xml`.
- Produces: Rasterized PNG `File` before invoking `scanQRImageBackend`.

- [x] **Step 1: Implement SVG-to-PNG canvas converter helper `svgFileToPngFile(file: File): Promise<File>`**

If `file.type === 'image/svg+xml'` or `file.name.endsWith('.svg')`, render the SVG to an offscreen `Image`, draw it onto a 1024x1024 canvas with a white background, and export as a PNG `File` before sending to the backend deep scan service.

- [x] **Step 2: Wire helper into `processImageFile` catch-block**

Before calling `scanQRImageBackend(file)`, pass through rasterization if the file is SVG.

- [x] **Step 3: Verify backend compatibility**

Verify with `test_security.py` that PNG rasterization guarantees OpenCV `imdecode` compatibility.

---

### Task 4: Multi-Language Dictionary Additions across All 5 Locales

**Files:**
- Modify: `frontend/src/i18n/locales/en.json`
- Modify: `frontend/src/i18n/locales/es.json`
- Modify: `frontend/src/i18n/locales/de.json`
- Modify: `frontend/src/i18n/locales/pt.json`
- Modify: `frontend/src/i18n/locales/tr.json`

**Interfaces:**
- Keys added under `"scanner"` namespace in all 5 files:
  - `badges`: format labels (`websiteLink`, `whatsappChat`, `wifiCredentials`, `contactCard`, `emailAddress`, `phoneNumber`, `smsMessage`, `mapLocation`, `calendarEvent`, `plainText`).
  - `safety`: URL safety labels & reasons (`unencryptedHttp`, `directIp`, `hiddenShortener`, `cautionUnverified`, `urlShortener`, `httpUnencrypted`, `secureHttps`, `verifiedSsl`, `textContent`).
  - `downloads`: (`addCalendar`, `oneClickDownloads`, `qrImagePng`, `rawTextTxt`, `metadataJson`, `vcardVcf`, `calendarIcs`, `vectorSvg`, `scalable`).
  - `toasts`: (`scanHistoryCleared`, `qrDecodedSuccess`, `switchedCamera`, `flippedCamera`, `pastedClipboard`, `ctrlVTip`, `loadedSample`, `generatingPng`, `pngDownloaded`, `pngDownloadFailed`, `generatingSvg`, `svgDownloaded`, `svgDownloadFailed`, `vcfDownloaded`, `icsDownloaded`, `txtDownloaded`, `jsonDownloaded`, `wifiPasswordCopied`, `itemCopiedFromHistory`).
  - `aria`: (`toggleFlashlight`, `flashlightOn`, `flashlightOff`, `switchCameraAria`, `selectLensAria`, `copyItemAria`, `deleteItemAria`).

- [x] **Step 1: Add new key structure to `en.json`**
- [x] **Step 2: Add Spanish translations to `es.json` with 100% key parity**
- [x] **Step 3: Add German translations to `de.json` with 100% key parity**
- [x] **Step 4: Add Portuguese translations to `pt.json` with 100% key parity**
- [x] **Step 5: Add Turkish translations to `tr.json` with 100% key parity**
- [x] **Step 6: Run parity script to guarantee 0 missing keys**

Run: `node -e "const locs=['en','es','de','pt','tr']; const d=locs.map(l=>JSON.parse(require('fs').readFileSync('frontend/src/i18n/locales/'+l+'.json')).scanner); const k=Object.keys(d[0]); for(let i=1;i<5;i++){ const m=k.filter(x=>!(x in d[i])); if(m.length) throw new Error(locs[i]+' missing: '+m); } console.log('Parity OK');"`

---

### Task 5: Dynamic Localization Integration in `QRScannerApp.tsx`

**Files:**
- Modify: `frontend/src/react/scanner/QRScannerApp.tsx`

**Interfaces:**
- Replaces all hardcoded strings identified in Audit Item 4 with dynamic calls to `t(...)`.

- [x] **Step 1: Refactor `getTypeBadge` to use `t()` dynamically**
- [x] **Step 2: Refactor `evaluateURLSafety` to return translation keys rather than static English strings**
- [x] **Step 3: Replace hardcoded strings in JSX badges and Download & Export Hub**
- [x] **Step 4: Replace raw strings in `showToast(...)` with `t(...)` lookups**
- [x] **Step 5: Replace ARIA and tooltip strings with `t(...)`**
- [x] **Step 6: Run `node frontend/scripts/test_i18n_hardcoded_strings.mjs` and verify zero violations**

---

### Task 6: Export Hub Download Hardening & `qrApi.ts` Service Reuse

**Files:**
- Modify: `frontend/src/react/scanner/QRScannerApp.tsx:L985-L1058`

**Interfaces:**
- Consumes: `downloadQR` from `frontend/src/services/qrApi.ts`.
- Produces: Protected download handlers with 15-second AbortSignal timeouts and standardized error alerts.

- [x] **Step 1: Replace raw `fetch` in `downloadCleanQRImage` with `downloadQR` from `qrApi.ts`**
- [x] **Step 2: Replace raw `fetch` in `downloadSvgQR` with `downloadQR` from `qrApi.ts`**
- [x] **Step 3: Ensure UI loading states reset cleanly in `finally` blocks on timeout**

---

### Task 7: Comprehensive Regression & Build Verification

**Files:**
- Verify: Full codebase

- [x] **Step 1: Run frontend unit tests (`npm test` or Vitest)**
- [x] **Step 2: Run backend test suite (`pytest tests/test_security.py`)**
- [x] **Step 3: Run SEO & Schema verification (`npm run test:seo`)**
- [x] **Step 4: Run hardcoded string verification (`node frontend/scripts/test_i18n_hardcoded_strings.mjs`)**
- [x] **Step 5: Run production build (`npm run build`) and confirm 0 errors**

---
