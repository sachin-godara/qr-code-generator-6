import fs from 'fs';
import path from 'path';

console.log('╔═══════════════════════════════════════════════════╗');
console.log('║   GENERATECUSTOMQR — MULTILINGUAL SEO AUDITOR     ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

const locales = ['en', 'es', 'pt', 'de'];
const pagesDir = path.resolve('src/pages');
const templatesDir = path.resolve('src/page-templates');
const blogBaseDir = path.resolve('src/content/blog');

let totalChecks = 0;
let errors = [];
let warnings = [];

// 1. Audit Page Templates
console.log('🔍 Auditing Reusable Page Templates (src/page-templates)...');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.astro'));
templateFiles.forEach(file => {
  const content = fs.readFileSync(path.join(templatesDir, file), 'utf8');
  totalChecks += 2;

  // Check if BaseLayout or LegalLayout is used
  if (!content.includes('BaseLayout') && !content.includes('LegalLayout')) {
    errors.push(`[template/${file}] Missing BaseLayout or LegalLayout wrapper`);
  }

  // Check if all 4 locales are handled or if i18n utils are imported
  if (!content.includes('Locale') && !content.includes('locale')) {
    warnings.push(`[template/${file}] Locale prop might not be utilized`);
  }
});

// 2. Audit All Localized Route Pages
console.log('🔍 Auditing Localized Routes (src/pages)...');
const scanPages = (dir, prefix = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'api') {
        scanPages(fullPath, relPath);
      }
    } else if (entry.name.endsWith('.astro')) {
      totalChecks += 1;
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.trim().length === 0) {
        errors.push(`[page/${relPath}] Empty Astro page file`);
      }
    }
  }
};
scanPages(pagesDir);

// 3. Audit Blog Posts across EN, ES, PT, DE
console.log('🔍 Auditing Multilingual Blog Posts (48 articles across EN, ES, PT, DE)...');
const blogDirs = [
  { locale: 'en', dir: blogBaseDir },
  { locale: 'es', dir: path.join(blogBaseDir, 'es') },
  { locale: 'pt', dir: path.join(blogBaseDir, 'pt') },
  { locale: 'de', dir: path.join(blogBaseDir, 'de') }
];

blogDirs.forEach(({ locale, dir }) => {
  if (!fs.existsSync(dir)) {
    errors.push(`[blog] Missing directory for locale ${locale}: ${dir}`);
    return;
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    
    totalChecks += 3;

    if (!fmMatch) {
      errors.push(`[blog/${locale}/${file}] Missing YAML frontmatter`);
      return;
    }

    const fm = fmMatch[1];
    const titleMatch = fm.match(/title:\s*["']?([^"'\r\n]+)["']?/);
    const descMatch = fm.match(/description:\s*["']?([^"'\r\n]+)["']?/);

    const title = titleMatch ? titleMatch[1] : null;
    const desc = descMatch ? descMatch[1] : null;

    if (!title) errors.push(`[blog/${locale}/${file}] Missing frontmatter title`);
    if (!desc) errors.push(`[blog/${locale}/${file}] Missing frontmatter description`);

    const hasInternalLink = content.includes('](/') || content.includes('href="/');
    if (!hasInternalLink) {
      warnings.push(`[blog/${locale}/${file}] Recommended internal link to QR generator tool pages`);
    }
  });
});

// 4. Audit i18n Translation Files & Keys
console.log('🔍 Auditing Translation Dictionaries (EN, ES, PT, DE)...');
const localesDir = path.resolve('src/i18n/locales');
const seoDir = path.resolve('src/i18n/seo');

locales.forEach(loc => {
  totalChecks += 2;
  const localeFile = path.join(localesDir, `${loc}.json`);
  const seoFile = path.join(seoDir, `${loc}.json`);

  if (!fs.existsSync(localeFile)) {
    errors.push(`[i18n] Missing locale dictionary: ${loc}.json`);
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
      if (!data.studio || !data.nav || !data.footer) {
        errors.push(`[i18n] Incomplete top-level keys in ${loc}.json`);
      }
    } catch (e) {
      errors.push(`[i18n] Syntax error in ${loc}.json: ${e.message}`);
    }
  }

  if (!fs.existsSync(seoFile)) {
    errors.push(`[seo] Missing SEO metadata: ${loc}.json`);
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(seoFile, 'utf8'));
      if (!data.home || !data.scanner) {
        errors.push(`[seo] Missing home or scanner SEO in ${loc}.json`);
      }
    } catch (e) {
      errors.push(`[seo] Syntax error in seo/${loc}.json: ${e.message}`);
    }
  }
});

// 5. Audit Google Search Console Technical Files
console.log('🔍 Auditing Search Console Technical Configuration (robots.txt, _redirects, _headers)...');
const robotsFile = path.resolve('public/robots.txt');
const redirectsFile = path.resolve('public/_redirects');
const headersFile = path.resolve('public/_headers');

totalChecks += 3;
if (!fs.existsSync(robotsFile)) {
  errors.push('[gsc] Missing public/robots.txt');
} else {
  const robotsContent = fs.readFileSync(robotsFile, 'utf8');
  if (!robotsContent.includes('Sitemap: https://generatecustomqr.com/sitemap-index.xml')) {
    errors.push('[gsc/robots.txt] Missing primary sitemap-index.xml directive');
  }
}

if (!fs.existsSync(redirectsFile)) {
  errors.push('[gsc] Missing public/_redirects');
} else {
  const redContent = fs.readFileSync(redirectsFile, 'utf8');
  if (!redContent.includes('www.generatecustomqr.com')) {
    warnings.push('[gsc/_redirects] Recommended WWW to non-WWW canonical redirect');
  }
}

if (!fs.existsSync(headersFile)) {
  warnings.push('[gsc] Missing public/_headers for staging noindex');
} else {
  const hdrContent = fs.readFileSync(headersFile, 'utf8');
  if (!hdrContent.includes('noindex')) {
    warnings.push('[gsc/_headers] Recommended X-Robots-Tag: noindex for preview deployments');
  }
}

console.log('\n===================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalChecks}`);
console.log(`ERRORS: ${errors.length}`);
console.log(`WARNINGS: ${warnings.length}`);
console.log('===================================================\n');

if (errors.length > 0) {
  console.error('❌ CRITICAL SEO / I18N ERRORS:');
  errors.forEach(e => console.error('  - ' + e));
}

if (warnings.length > 0) {
  console.warn('⚠️ SEO OPTIMIZATION NOTICES:');
  warnings.forEach(w => console.warn('  - ' + w));
}

if (errors.length === 0) {
  console.log('✅ 100% PASS: ALL MULTILINGUAL SEO & I18N CHECKS PASSED WITH 0 ERRORS!');
  process.exit(0);
} else {
  process.exit(1);
}
