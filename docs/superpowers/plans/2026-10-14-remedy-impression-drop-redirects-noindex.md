# Priority 1: Eliminate Search Indexing Drop & Enforce 301 Edge Redirects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore Google search engine indexing and rankings by eliminating static `<meta name="robots" content="noindex">` stubs, enforcing Cloudflare edge `301!` redirects, updating 41 internal markdown links across all localized blog posts, stabilizing sitemap generation, and verifying zero unintended noindex tags in the production build.

**Architecture:** Remove Astro SSG redirect stubs (`src/pages/{de,es,pt,tr}/qr-code-scanner.astro`) that generate static HTML containing `<meta name="robots" content="noindex">` served with `HTTP 200 OK` on Cloudflare Pages. Enforce genuine HTTP 301 responses using Cloudflare Pages `301!` forced redirect syntax in `frontend/public/_redirects`. Update all localized blog posts to point directly to canonical localized scanner URLs (`/de/qr-code-scannen/`, `/es/escanear-codigo-qr/`, `/pt/escanear-qr-code/`, `/tr/qr-kod-okuyucu/`). Remove `lastmod: new Date()` from `astro.config.mjs` to stop artificial mass re-crawling.

**Tech Stack:** Astro 5, Cloudflare Pages, Node.js, Markdown, Bash/PowerShell.

**Spec:** Forensic Root-Cause Analysis of October 3, 2026 Search Impression Drop (GSC Diagnostic Report).

## Global Constraints

- Never hardcode static review or aggregateRating schemas (AGENTS.md Rule 5).
- Maintain 100% full content and feature parity across all 5 locales (`en`, `es`, `pt`, `de`, `tr`) (AGENTS.md Rules 6 & 7).
- No broken links or redirect chains in internal blog markdown links.
- Every modified file must pass validation and the Astro build (`npm run build`) must succeed with zero errors.

## Review Focus

1. **Static HTML Override on Cloudflare:** If a physical directory exists in `dist/` (e.g. `dist/de/qr-code-scanner/index.html`), Cloudflare Pages serves the file as `200 OK` ignoring standard `301` rules unless forced with `301!`. Deleting the source `.astro` stubs prevents the directory from being generated.
2. **Trailing vs Non-Trailing Slashes:** Both `/de/qr-code-scanner/` and `/de/qr-code-scanner` must redirect to the canonical trailing slash `/de/qr-code-scannen/`.
3. **Noindex Bleed:** Confirm no non-404 page in `dist/` contains `<meta name="robots" content="noindex">`.
4. **Blog Link Parity:** Blog links must point to exact localized routes without triggering 301 redirects or pointing to deleted stubs.
5. **Hreflang & Canonical Integrity:** The live localized scanner pages (`/de/qr-code-scannen/`, etc.) must maintain correct self-referencing canonical URLs and cross-referencing hreflang tags for all 5 languages.

---

### Task 1: Remove Astro SSG Redirect Stubs

**Files:**
- Delete: `frontend/src/pages/de/qr-code-scanner.astro`
- Delete: `frontend/src/pages/es/qr-code-scanner.astro`
- Delete: `frontend/src/pages/pt/qr-code-scanner.astro`
- Delete: `frontend/src/pages/tr/qr-code-scanner.astro`
- Test: `frontend/scripts/test_no_scanner_stubs.mjs`

**Interfaces:**
- Consumes: Existing files in `frontend/src/pages/{de,es,pt,tr}/`
- Produces: Clean Astro routing tree without static redirect stubs

- [ ] **Step 1: Write test script checking for forbidden Astro redirect stubs**

Create `frontend/scripts/test_no_scanner_stubs.mjs`:
```javascript
import fs from 'node:fs';
import path from 'node:path';

const forbidden = [
  'frontend/src/pages/de/qr-code-scanner.astro',
  'frontend/src/pages/es/qr-code-scanner.astro',
  'frontend/src/pages/pt/qr-code-scanner.astro',
  'frontend/src/pages/tr/qr-code-scanner.astro',
];

const existing = forbidden.filter(p => fs.existsSync(p));
if (existing.length > 0) {
  console.error('FAIL: Found forbidden redirect stubs:', existing);
  process.exit(1);
} else {
  console.log('PASS: All forbidden redirect stubs have been removed.');
}
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `node frontend/scripts/test_no_scanner_stubs.mjs`
Expected: `FAIL: Found forbidden redirect stubs: [ ... ]`

- [ ] **Step 3: Delete the 4 Astro stub files**

Remove:
- `frontend/src/pages/de/qr-code-scanner.astro`
- `frontend/src/pages/es/qr-code-scanner.astro`
- `frontend/src/pages/pt/qr-code-scanner.astro`
- `frontend/src/pages/tr/qr-code-scanner.astro`

- [ ] **Step 4: Run test to verify it passes**

Run: `node frontend/scripts/test_no_scanner_stubs.mjs`
Expected: `PASS: All forbidden redirect stubs have been removed.`

- [ ] **Step 5: Commit**

```bash
git add frontend/scripts/test_no_scanner_stubs.mjs frontend/src/pages/
git commit -m "fix(seo): remove Astro SSG redirect stubs causing static noindex HTML"
```

---

### Task 2: Configure Cloudflare Edge Forced 301 Redirects (`301!`)

**Files:**
- Modify: `frontend/public/_redirects:15-24`
- Test: `frontend/scripts/test_edge_redirects.mjs`

**Interfaces:**
- Consumes: Target localized scanner routes (`/de/qr-code-scannen/`, `/es/escanear-codigo-qr/`, `/pt/escanear-qr-code/`, `/tr/qr-kod-okuyucu/`)
- Produces: Validated `_redirects` file ready for Cloudflare Pages deployment with `301!` forced status

- [ ] **Step 1: Write test to verify `_redirects` contains forced `301!` rules for localized scanners**

Create `frontend/scripts/test_edge_redirects.mjs`:
```javascript
import fs from 'node:fs';

const content = fs.readFileSync('frontend/public/_redirects', 'utf-8');
const requiredRules = [
  '/tr/qr-code-scanner/        /tr/qr-kod-okuyucu/       301!',
  '/tr/qr-code-scanner         /tr/qr-kod-okuyucu/       301!',
  '/de/qr-code-scanner/        /de/qr-code-scannen/      301!',
  '/de/qr-code-scanner         /de/qr-code-scannen/      301!',
  '/es/qr-code-scanner/        /es/escanear-codigo-qr/   301!',
  '/es/qr-code-scanner         /es/escanear-codigo-qr/   301!',
  '/pt/qr-code-scanner/        /pt/escanear-qr-code/     301!',
  '/pt/qr-code-scanner         /pt/escanear-qr-code/     301!',
];

const missing = requiredRules.filter(r => !content.includes(r.replace(/\s+/g, ' ')));
// Check normalized spaces
const normalizedLines = content.split('\n').map(l => l.trim().replace(/\s+/g, ' '));
const normalizedRequired = requiredRules.map(r => r.trim().replace(/\s+/g, ' '));
const stillMissing = normalizedRequired.filter(r => !normalizedLines.includes(r));

if (stillMissing.length > 0) {
  console.error('FAIL: Missing required 301! forced rules in frontend/public/_redirects:', stillMissing);
  process.exit(1);
} else {
  console.log('PASS: All localized scanner rules properly forced with 301!');
}
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `node frontend/scripts/test_edge_redirects.mjs`
Expected: `FAIL: Missing required 301! forced rules`

- [ ] **Step 3: Update `frontend/public/_redirects`**

Update lines 15-24 to use `301!` instead of `301`:
```text
# Localized Scanner 301 Redirects (Force Edge 301 Header & Prevent 200 Static Stubs)
/tr/qr-code-scanner/        /tr/qr-kod-okuyucu/       301!
/tr/qr-code-scanner         /tr/qr-kod-okuyucu/       301!
/de/qr-code-scanner/        /de/qr-code-scannen/      301!
/de/qr-code-scanner         /de/qr-code-scannen/      301!
/es/qr-code-scanner/        /es/escanear-codigo-qr/   301!
/es/qr-code-scanner         /es/escanear-codigo-qr/   301!
/pt/qr-code-scanner/        /pt/escanear-qr-code/     301!
/pt/qr-code-scanner         /pt/escanear-qr-code/     301!
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node frontend/scripts/test_edge_redirects.mjs`
Expected: `PASS: All localized scanner rules properly forced with 301!`

- [ ] **Step 5: Commit**

```bash
git add frontend/public/_redirects frontend/scripts/test_edge_redirects.mjs
git commit -m "fix(seo): enforce 301! edge redirects in Cloudflare _redirects"
```

---

### Task 3: Update 41 Localized Blog Post Internal Links

**Files:**
- Modify: `frontend/src/content/blog/de/*.md`
- Modify: `frontend/src/content/blog/es/*.md`
- Modify: `frontend/src/content/blog/pt/*.md`
- Modify: `frontend/src/content/blog/tr/*.md`
- Test: `frontend/scripts/test_blog_scanner_links.mjs`

**Interfaces:**
- Consumes: Target canonical URLs:
  - German: `/de/qr-code-scannen/` (and `generatecustomqr.com/de/qr-code-scannen/`)
  - Spanish: `/es/escanear-codigo-qr/` (and `generatecustomqr.com/es/escanear-codigo-qr/`)
  - Portuguese: `/pt/escanear-qr-code/` (and `generatecustomqr.com/pt/escanear-qr-code/`)
  - Turkish: `/tr/qr-kod-okuyucu/` (and `generatecustomqr.com/tr/qr-kod-okuyucu/`)
- Produces: Markdown files containing zero legacy redirect links

- [ ] **Step 1: Write test to verify zero legacy localized scanner links exist in blog posts**

Create `frontend/scripts/test_blog_scanner_links.mjs`:
```javascript
import fs from 'node:fs';
import path from 'node:path';

const locales = ['de', 'es', 'pt', 'tr'];
let failed = false;

for (const loc of locales) {
  const dir = path.join('frontend/src/content/blog', loc);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const regex = new RegExp(`/${loc}/qr-code-scanner`, 'g');
    if (regex.test(content)) {
      console.error(`FAIL: Found legacy link /${loc}/qr-code-scanner in ${fullPath}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('PASS: All localized blog posts use canonical scanner links.');
}
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `node frontend/scripts/test_blog_scanner_links.mjs`
Expected: `FAIL: Found legacy link /.../qr-code-scanner in ...`

- [ ] **Step 3: Write and run replacement script to update links across all 4 locales**

Execute node script to update:
- In `de/*.md`: replace `/de/qr-code-scanner/` and `/de/qr-code-scanner` with `/de/qr-code-scannen/`
- In `es/*.md`: replace `/es/qr-code-scanner/` and `/es/qr-code-scanner` with `/es/escanear-codigo-qr/`
- In `pt/*.md`: replace `/pt/qr-code-scanner/` and `/pt/qr-code-scanner` with `/pt/escanear-qr-code/`
- In `tr/*.md`: replace `/tr/qr-code-scanner/` and `/tr/qr-code-scanner` with `/tr/qr-kod-okuyucu/`

- [ ] **Step 4: Run test to verify it passes**

Run: `node frontend/scripts/test_blog_scanner_links.mjs`
Expected: `PASS: All localized blog posts use canonical scanner links.`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/content/blog/ frontend/scripts/test_blog_scanner_links.mjs
git commit -m "fix(seo): update 41 internal blog links to direct canonical scanner URLs"
```

---

### Task 4: Stabilize Sitemap Generation in `astro.config.mjs`

**Files:**
- Modify: `frontend/astro.config.mjs:30-41`
- Test: `frontend/scripts/test_sitemap_config.mjs`

**Interfaces:**
- Consumes: Astro sitemap configuration
- Produces: Stable sitemap without volatile `lastmod: new Date()`

- [ ] **Step 1: Write test checking that `lastmod: new Date()` is not present in `astro.config.mjs`**

Create `frontend/scripts/test_sitemap_config.mjs`:
```javascript
import fs from 'node:fs';

const content = fs.readFileSync('frontend/astro.config.mjs', 'utf-8');
if (content.includes('lastmod: new Date()')) {
  console.error('FAIL: astro.config.mjs contains volatile lastmod: new Date()');
  process.exit(1);
}
console.log('PASS: Sitemap lastmod configuration is clean.');
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `node frontend/scripts/test_sitemap_config.mjs`
Expected: `FAIL: astro.config.mjs contains volatile lastmod: new Date()`

- [ ] **Step 3: Modify `frontend/astro.config.mjs`**

Remove line 33 `lastmod: new Date(),` so sitemap entries do not falsely claim to have been updated on every single deployment.

- [ ] **Step 4: Run test to verify it passes**

Run: `node frontend/scripts/test_sitemap_config.mjs`
Expected: `PASS: Sitemap lastmod configuration is clean.`

- [ ] **Step 5: Commit**

```bash
git add frontend/astro.config.mjs frontend/scripts/test_sitemap_config.mjs
git commit -m "fix(seo): remove volatile lastmod: new Date() from sitemap integration"
```

---

### Task 5: End-to-End Build and Verification Audit

**Files:**
- Create: `frontend/scripts/verify_production_seo.mjs`
- Test: Built production artifacts in `frontend/dist/`

**Interfaces:**
- Consumes: Built `frontend/dist/`
- Produces: Comprehensive exit-code-verified SEO audit report

- [ ] **Step 1: Write `verify_production_seo.mjs`**

```javascript
import fs from 'node:fs';
import path from 'node:path';

const distDir = 'frontend/dist';
if (!fs.existsSync(distDir)) {
  console.error('FAIL: frontend/dist does not exist. Run npm run build first.');
  process.exit(1);
}

// 1. Assert no static redirect folders exist
const forbiddenDirs = [
  'frontend/dist/de/qr-code-scanner',
  'frontend/dist/es/qr-code-scanner',
  'frontend/dist/pt/qr-code-scanner',
  'frontend/dist/tr/qr-code-scanner',
];

for (const d of forbiddenDirs) {
  if (fs.existsSync(d)) {
    console.error(`FAIL: Forbidden static folder exists: ${d}`);
    process.exit(1);
  }
}

// 2. Assert canonical scanner pages exist
const requiredPages = [
  'frontend/dist/qr-code-scanner/index.html',
  'frontend/dist/de/qr-code-scannen/index.html',
  'frontend/dist/es/escanear-codigo-qr/index.html',
  'frontend/dist/pt/escanear-qr-code/index.html',
  'frontend/dist/tr/qr-kod-okuyucu/index.html',
];

for (const p of requiredPages) {
  if (!fs.existsSync(p)) {
    console.error(`FAIL: Required canonical page missing: ${p}`);
    process.exit(1);
  }
  const content = fs.readFileSync(p, 'utf-8');
  if (content.includes('<meta name="robots" content="noindex"')) {
    console.error(`FAIL: Canonical page ${p} contains noindex!`);
    process.exit(1);
  }
}

// 3. Assert _redirects was copied into dist/_redirects with 301!
const distRedirects = fs.readFileSync('frontend/dist/_redirects', 'utf-8');
if (!distRedirects.includes('/de/qr-code-scanner/ /de/qr-code-scannen/ 301!')) {
  console.error('FAIL: dist/_redirects missing forced 301! rules');
  process.exit(1);
}

console.log('PASS: All production SEO checks passed successfully!');
```

- [ ] **Step 2: Run Astro build**

Run: `npm run build` in `frontend/`
Expected: Build succeeds generating static output in `dist/`.

- [ ] **Step 3: Run verification audit script**

Run: `node frontend/scripts/verify_production_seo.mjs`
Expected: `PASS: All production SEO checks passed successfully!`

- [ ] **Step 4: Commit**

```bash
git add frontend/scripts/verify_production_seo.mjs
git commit -m "test(seo): add production verification audit script"
```
