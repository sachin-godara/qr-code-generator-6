# Priority 1: Restore Search Indexing, Fix Cloudflare Redirect Syntax & Canonical Deduplication Plan

**Goal:** Restore Google search impressions, eliminate the "Duplicate, Google chose different canonical than user" warning, and ensure immediate `301 Moved Permanently` edge responses on Cloudflare Pages for all legacy scanner routes (`/es/qr-code-scanner/`, `/de/qr-code-scanner/`, `/pt/qr-code-scanner/`, `/tr/qr-code-scanner/`).

---

## 1. Root Cause Summary

1. **Cloudflare `301!` Syntax Incompatibility:**
   Cloudflare Pages only accepts integer status codes (`301`, `302`, `200`). The exclamation mark syntax (`301!`) is a Netlify-specific feature. When Cloudflare Pages parsed `301!`, it rejected the rules as invalid, resulting in `404 Not Found` responses on production for all localized scanner legacy URLs.
2. **Google De-duplication of Legacy Spanish Scanner (Oct 1):**
   Prior to the localized slug migration on Oct 2, `/es/qr-code-scanner/` shared identical English-heavy UI components and an English slug with `/qr-code-scanner/`. Google determined that the content was an unindexed duplicate of the primary English scanner and overrode the user-declared canonical.
3. **Broken Redirect Trail:**
   Because `/es/qr-code-scanner/` currently returns `404 Not Found` instead of `301 Moved Permanently` to `/es/escanear-codigo-qr/`, Googlebot has been unable to follow the redirect and retire the legacy duplicate.

---

## 2. Implementation Tasks

### Task 1: Fix Cloudflare `_redirects` Syntax
- Update `frontend/public/_redirects`:
  - Convert `301!` to `301` for the root canonical redirect and all 8 localized scanner redirect rules.
  - Retain all other valid aliases (`/scanner/`, `/vcard/`, `/wifi/`, `/sitemap.xml`, etc.).

### Task 2: Update Edge Redirect Test & Production SEO Audit
- Update `frontend/scripts/test_edge_redirects.mjs`:
  - Assert that all 8 localized scanner redirect rules specify valid Cloudflare `301` status codes.
- Update `frontend/scripts/verify_production_seo.mjs`:
  - Verify that `frontend/dist/_redirects` contains the valid `301` rules.

### Task 3: Comprehensive Audit of Scanner Localization & Canonical Integrity
- Verify that `frontend/src/i18n/locales/*.json` contain complete Spanish, German, Portuguese, and Turkish translations for `scanner.*` with zero missing keys or English fallbacks.
- Verify that `frontend/src/i18n/seo/*.json` contain unique, optimized localized metadata (title, description, keywords, FAQs) for all 5 languages.
- Verify that `frontend/src/page-templates/ScannerPage.astro` renders reciprocal hreflang tags for all 5 locales plus `x-default`.

### Task 4: Full Quality Gate Execution
- Run frontend vitest suite (`npx vitest run`).
- Run backend pytest suite (`pytest`).
- Run Astro production build (`npm run build`).
- Run `verify_production_seo.mjs` against the generated `frontend/dist`.

### Task 5: Search Console Recovery Protocol
- Provide precise, step-by-step instructions for submitting re-crawl and re-indexing requests in Google Search Console to clear the duplicate status and recover search impressions.
