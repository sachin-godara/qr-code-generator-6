import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const FRONTEND_DIR = path.resolve('.');

if (!fs.existsSync(DIST_DIR)) {
  console.error(`Dist dir not found at ${DIST_DIR}`);
  process.exit(1);
}

function getAllHtmlFiles(dir, list = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== '_astro') getAllHtmlFiles(full, list);
    } else if (item.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);

const audit = {
  timestamp: new Date().toISOString(),
  totalPages: htmlFiles.length,
  summary: {
    indexablePages: 0,
    noindexPages: 0,
    byLocale: { en: 0, es: 0, pt: 0, de: 0, tr: 0 },
    byType: {
      homepage: 0,
      tool: 0,
      guide: 0,
      blogIndex: 0,
      blogPost: 0,
      info: 0,
      legal: 0,
      system: 0
    }
  },
  technical: {
    canonical: { totalValid: 0, issues: [] },
    hreflang: { totalWithHreflang: 0, totalHreflangTags: 0, issues: [] },
    robotsMeta: { indexFollow: 0, noindexNofollow: 0, other: 0, issues: [] },
    trailingSlash: { compliant: 0, issues: [] },
    securityHeaders: { hasCsp: 0, hasXcto: 0, hasReferrer: 0, issues: [] },
    htmlLang: { matches: 0, mismatches: [] }
  },
  onPage: {
    titles: {
      total: 0,
      minLen: 999,
      maxLen: 0,
      avgLen: 0,
      under30: [],
      over65: [],
      over70: [],
      duplicates: []
    },
    descriptions: {
      total: 0,
      minLen: 999,
      maxLen: 0,
      avgLen: 0,
      under70: [],
      over160: [],
      duplicates: []
    },
    headings: {
      singleH1: 0,
      zeroH1: [],
      multiH1: []
    },
    untranslatedKeys: [],
    thinPages: []
  },
  images: {
    totalImages: 0,
    missingAlt: [],
    missingDimensions: [],
    byExtension: {}
  },
  openGraph: {
    validOg: 0,
    missingOgTitle: [],
    missingOgDesc: [],
    missingOgImage: [],
    missingOgUrl: [],
    missingTwitterCard: [],
    nonExistentImages: []
  },
  structuredData: {
    totalSchemas: 0,
    byType: {},
    rule5Violations: [], // Prohibited ratings
    validationErrors: []
  },
  links: {
    totalInternalLinks: 0,
    brokenLinks: [],
    linksTo301s: []
  }
};

// Build route map
const routeMap = new Set();
for (const file of htmlFiles) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (route === '/index/') route = '/';
  routeMap.add(route);
}

// Load 301 redirects
const redirectsPath = path.join(FRONTEND_DIR, 'public/_redirects');
const redirectRules = new Map();
if (fs.existsSync(redirectsPath)) {
  const lines = fs.readFileSync(redirectsPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 3 && parts[2] === '301') {
      redirectRules.set(parts[0], parts[1]);
    }
  }
}

// Map for duplicate detection
const titlesSeen = new Map();
const descsSeen = new Map();
let totalTitleLen = 0;
let totalDescLen = 0;

for (const file of htmlFiles) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (route === '/index/') route = '/';

  const html = fs.readFileSync(file, 'utf8');

  // Determine locale
  let locale = 'en';
  if (route.startsWith('/es/')) locale = 'es';
  else if (route.startsWith('/pt/')) locale = 'pt';
  else if (route.startsWith('/de/')) locale = 'de';
  else if (route.startsWith('/tr/')) locale = 'tr';
  audit.summary.byLocale[locale]++;

  // Determine page type
  const is404 = route === '/404/' || rel === '404.html';
  const is500 = route === '/500/' || rel === '500.html';
  let pageType = 'tool';
  if (is404 || is500) pageType = 'system';
  else if (route === '/' || route === '/es/' || route === '/pt/' || route === '/de/' || route === '/tr/') pageType = 'homepage';
  else if (route.endsWith('/blog/')) pageType = 'blogIndex';
  else if (route.includes('/blog/')) pageType = 'blogPost';
  else if (route.includes('/how-to-use/')) pageType = 'guide';
  else if (route.includes('/about/') || route.includes('/contact/')) pageType = 'info';
  else if (route.includes('/privacy-policy/') || route.includes('/terms/')) pageType = 'legal';
  audit.summary.byType[pageType]++;

  // 1. Robots Meta
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const robotsContent = robotsMatch ? robotsMatch[1].toLowerCase() : '';
  if (robotsContent.includes('noindex')) {
    audit.summary.noindexPages++;
    audit.technical.robotsMeta.noindexNofollow++;
    if (!is404 && !is500) {
      audit.technical.robotsMeta.issues.push({ route, issue: `Accidental noindex on live page: ${robotsContent}` });
    }
  } else {
    audit.summary.indexablePages++;
    audit.technical.robotsMeta.indexFollow++;
    if (is404 || is500) {
      audit.technical.robotsMeta.issues.push({ route, issue: `Missing noindex on error page!` });
    }
  }

  // 2. HTML lang check
  const htmlLangMatch = html.match(/<html\s+lang=["']([^"']*)["']/i);
  const htmlLang = htmlLangMatch ? htmlLangMatch[1] : '';
  if (htmlLang === locale) {
    audit.technical.htmlLang.matches++;
  } else {
    audit.technical.htmlLang.mismatches.push({ route, htmlLang, expected: locale });
  }

  // 3. Security headers in meta (CSP, XCTO, Referrer)
  if (html.includes('http-equiv="Content-Security-Policy"') || html.includes("http-equiv='Content-Security-Policy'")) {
    audit.technical.securityHeaders.hasCsp++;
  }
  if (html.includes('http-equiv="X-Content-Type-Options"')) {
    audit.technical.securityHeaders.hasXcto++;
  }
  if (html.includes('http-equiv="Referrer-Policy"')) {
    audit.technical.securityHeaders.hasReferrer++;
  }

  // 4. Canonical
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canon = canonMatch ? canonMatch[1] : '';
  if (is404 || is500) {
    if (canon) {
      audit.technical.canonical.issues.push({ route, issue: `Error page should not have canonical: ${canon}` });
    }
  } else {
    const expectedCanon = 'https://generatecustomqr.com' + route;
    if (!canon) {
      audit.technical.canonical.issues.push({ route, issue: 'Missing canonical' });
    } else if (canon !== expectedCanon) {
      audit.technical.canonical.issues.push({ route, issue: `Canonical mismatch: got ${canon}, expected ${expectedCanon}` });
    } else {
      audit.technical.canonical.totalValid++;
    }
  }

  // 5. Hreflang
  const hreflangs = [...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi)];
  if (is404 || is500) {
    if (hreflangs.length > 0) {
      audit.technical.hreflang.issues.push({ route, issue: 'Error page should not have hreflang tags' });
    }
  } else {
    audit.technical.hreflang.totalWithHreflang++;
    audit.technical.hreflang.totalHreflangTags += hreflangs.length;
    // Expected 6 tags: en, es, pt, de, tr, x-default
    if (hreflangs.length !== 6) {
      audit.technical.hreflang.issues.push({ route, issue: `Expected 6 hreflang tags, found ${hreflangs.length}` });
    }
    const hasXDefault = hreflangs.some(h => h[1] === 'x-default');
    if (!hasXDefault) {
      audit.technical.hreflang.issues.push({ route, issue: 'Missing x-default hreflang tag' });
    }
  }

  // 6. Titles
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (title) {
    audit.onPage.titles.total++;
    const tLen = title.length;
    totalTitleLen += tLen;
    if (tLen < audit.onPage.titles.minLen) audit.onPage.titles.minLen = tLen;
    if (tLen > audit.onPage.titles.maxLen) audit.onPage.titles.maxLen = tLen;
    if (tLen < 30) audit.onPage.titles.under30.push({ route, len: tLen, title });
    if (tLen > 65) audit.onPage.titles.over65.push({ route, len: tLen, title });
    if (tLen > 70) audit.onPage.titles.over70.push({ route, len: tLen, title });

    if (!titlesSeen.has(title)) titlesSeen.set(title, []);
    titlesSeen.get(title).push(route);
  } else {
    audit.onPage.titles.under30.push({ route, len: 0, title: '[MISSING]' });
  }

  // 7. Descriptions
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  if (desc) {
    audit.onPage.descriptions.total++;
    const dLen = desc.length;
    totalDescLen += dLen;
    if (dLen < audit.onPage.descriptions.minLen) audit.onPage.descriptions.minLen = dLen;
    if (dLen > audit.onPage.descriptions.maxLen) audit.onPage.descriptions.maxLen = dLen;
    if (dLen < 70) audit.onPage.descriptions.under70.push({ route, len: dLen, desc });
    if (dLen > 160) audit.onPage.descriptions.over160.push({ route, len: dLen, desc });

    if (!descsSeen.has(desc)) descsSeen.set(desc, []);
    descsSeen.get(desc).push(route);
  } else {
    audit.onPage.descriptions.under70.push({ route, len: 0, desc: '[MISSING]' });
  }

  // 8. Headings
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length === 1) {
    audit.onPage.headings.singleH1++;
  } else if (h1Matches.length === 0) {
    audit.onPage.headings.zeroH1.push(route);
  } else {
    audit.onPage.headings.multiH1.push({ route, count: h1Matches.length });
  }

  // 9. Raw untranslated tokens check (e.g. "errors.", "nav.", "studio.")
  const rawKeyMatches = [...html.matchAll(/>\s*(errors\.[a-zA-Z0-9_]+|nav\.[a-zA-Z0-9_]+|footer\.[a-zA-Z0-9_]+|studio\.[a-zA-Z0-9_]+)\s*</gi)];
  for (const rk of rawKeyMatches) {
    audit.onPage.untranslatedKeys.push({ route, rawKey: rk[1] });
  }

  // 10. Word count & thin content
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<svg[\s\S]*?<\/svg>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  const wordCount = textOnly.split(' ').filter(Boolean).length;
  if (!is404 && !is500 && wordCount < 200) {
    audit.onPage.thinPages.push({ route, wordCount });
  }

  // 11. Images
  const imgTags = [...html.matchAll(/<img\s+([^>]+)>/gi)];
  for (const img of imgTags) {
    audit.images.totalImages++;
    const attrs = img[1];
    const srcMatch = attrs.match(/src=["']([^"']*)["']/i);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
    const widthMatch = attrs.match(/width=["']([^"']*)["']/i);
    const heightMatch = attrs.match(/height=["']([^"']*)["']/i);

    const src = srcMatch ? srcMatch[1] : '';
    const ext = src ? path.extname(src.split('?')[0]).toLowerCase() || 'inline/data' : 'unknown';
    audit.images.byExtension[ext] = (audit.images.byExtension[ext] || 0) + 1;

    if (!altMatch || (altMatch[1].trim() === '' && !attrs.includes('aria-hidden="true"'))) {
      audit.images.missingAlt.push({ route, src });
    }
    if (!widthMatch || !heightMatch) {
      // SVGs or CSS-sized images might omit, record for analysis
      audit.images.missingDimensions.push({ route, src });
    }
  }

  // 12. Open Graph & Twitter Cards
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
  const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i);
  const twCard = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i);

  if (!ogTitle) audit.openGraph.missingOgTitle.push(route);
  if (!ogDesc) audit.openGraph.missingOgDesc.push(route);
  if (!ogImg) audit.openGraph.missingOgImage.push(route);
  else {
    const imgUrl = ogImg[1];
    const localRel = imgUrl.replace('https://generatecustomqr.com/', '');
    if (!fs.existsSync(path.join(DIST_DIR, localRel))) {
      audit.openGraph.nonExistentImages.push({ route, imgUrl });
    }
  }
  if (!ogUrl) audit.openGraph.missingOgUrl.push(route);
  if (!twCard) audit.openGraph.missingTwitterCard.push(route);
  if (ogTitle && ogDesc && ogImg && ogUrl && twCard) audit.openGraph.validOg++;

  // 13. Structured Data JSON-LD
  const schemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  for (const s of schemas) {
    audit.structuredData.totalSchemas++;
    try {
      const data = JSON.parse(s[1]);
      const sType = data['@type'] || 'Unknown';
      audit.structuredData.byType[sType] = (audit.structuredData.byType[sType] || 0) + 1;

      // Check Rule 5: fake ratings
      if (data.aggregateRating || data.review) {
        audit.structuredData.rule5Violations.push({ route, sType, issue: 'Illegal aggregateRating/review found!' });
      }
      if (sType === 'Article') {
        if (!data.headline || !data.author || !data.publisher || !data.datePublished || !data.image) {
          audit.structuredData.validationErrors.push({ route, sType, issue: 'Missing required article fields' });
        }
      } else if (sType === 'BreadcrumbList') {
        if (!data.itemListElement || !Array.isArray(data.itemListElement) || data.itemListElement.length < 2) {
          audit.structuredData.validationErrors.push({ route, sType, issue: 'BreadcrumbList has less than 2 items' });
        }
      } else if (sType === 'HowTo') {
        if (!data.name || !data.step || !Array.isArray(data.step) || data.step.length === 0) {
          audit.structuredData.validationErrors.push({ route, sType, issue: 'HowTo missing name or step array' });
        }
      } else if (sType === 'FAQPage') {
        if (!data.mainEntity || !Array.isArray(data.mainEntity) || data.mainEntity.length === 0) {
          audit.structuredData.validationErrors.push({ route, sType, issue: 'FAQPage empty mainEntity' });
        }
      }
    } catch (e) {
      audit.structuredData.validationErrors.push({ route, issue: `JSON-LD parse error: ${e.message}` });
    }
  }

  // 14. Internal Links
  const linkMatches = [...html.matchAll(/href=["']([^"'#?]+)["']/g)];
  for (const lm of linkMatches) {
    const href = lm[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }
    audit.links.totalInternalLinks++;
    let target = href;
    if (!target.startsWith('/')) target = '/' + target;
    if (!target.endsWith('/') && !path.extname(target)) target = target + '/';

    // Check if target is in 301 rules
    if (redirectRules.has(target) || redirectRules.has(href)) {
      audit.links.linksTo301s.push({ from: route, href, redirectsTo: redirectRules.get(target) || redirectRules.get(href) });
    } else if (!target.startsWith('/_astro/') && !target.startsWith('/previews/') && !target.startsWith('/preset_logos/') && !target.match(/\.(png|jpg|svg|ico|xml|txt|json|webmanifest)$/i)) {
      if (!routeMap.has(target)) {
        audit.links.brokenLinks.push({ from: route, href, target });
      }
    }
  }
}

// Calculate averages and duplicates
audit.onPage.titles.avgLen = Math.round(totalTitleLen / (audit.onPage.titles.total || 1));
audit.onPage.descriptions.avgLen = Math.round(totalDescLen / (audit.onPage.descriptions.total || 1));

for (const [t, routes] of titlesSeen.entries()) {
  if (routes.length > 1) {
    audit.onPage.titles.duplicates.push({ title: t, count: routes.length, routes });
  }
}
for (const [d, routes] of descsSeen.entries()) {
  if (routes.length > 1) {
    audit.onPage.descriptions.duplicates.push({ desc: d, count: routes.length, routes });
  }
}

fs.writeFileSync(path.join(FRONTEND_DIR, 'scripts/deep_audit_results.json'), JSON.stringify(audit, null, 2), 'utf8');

console.log('=== DEEP SEO AUDIT RESULTS ===');
console.log(`Total Pages Audited: ${audit.totalPages}`);
console.log(`Indexable: ${audit.summary.indexablePages}, Noindex: ${audit.summary.noindexPages}`);
console.log(`Locales: EN: ${audit.summary.byLocale.en}, ES: ${audit.summary.byLocale.es}, PT: ${audit.summary.byLocale.pt}, DE: ${audit.summary.byLocale.de}, TR: ${audit.summary.byLocale.tr}`);
console.log(`Page Types:`, audit.summary.byType);
console.log('\n--- TECHNICAL SEO ---');
console.log(`Canonical Valid: ${audit.technical.canonical.totalValid}/${audit.summary.indexablePages}, Issues: ${audit.technical.canonical.issues.length}`);
console.log(`Hreflang Tags: ${audit.technical.hreflang.totalHreflangTags} across ${audit.technical.hreflang.totalWithHreflang} pages, Issues: ${audit.technical.hreflang.issues.length}`);
console.log(`HTML Lang Matches: ${audit.technical.htmlLang.matches}, Mismatches: ${audit.technical.htmlLang.mismatches.length}`);
console.log(`Robots Meta Issues: ${audit.technical.robotsMeta.issues.length}`);

console.log('\n--- ON-PAGE METADATA ---');
console.log(`Title Lengths: Min ${audit.onPage.titles.minLen}, Max ${audit.onPage.titles.maxLen}, Avg ${audit.onPage.titles.avgLen}`);
console.log(`Titles > 65 chars: ${audit.onPage.titles.over65.length}, Titles > 70 chars: ${audit.onPage.titles.over70.length}`);
console.log(`Duplicate Titles: ${audit.onPage.titles.duplicates.length}`);
console.log(`Description Lengths: Min ${audit.onPage.descriptions.minLen}, Max ${audit.onPage.descriptions.maxLen}, Avg ${audit.onPage.descriptions.avgLen}`);
console.log(`Descriptions > 160 chars: ${audit.onPage.descriptions.over160.length}`);
console.log(`Duplicate Descriptions: ${audit.onPage.descriptions.duplicates.length}`);
console.log(`Single H1 Pages: ${audit.onPage.headings.singleH1}, Zero H1: ${audit.onPage.headings.zeroH1.length}, Multi H1: ${audit.onPage.headings.multiH1.length}`);
console.log(`Untranslated Raw Keys Found: ${audit.onPage.untranslatedKeys.length}`);
if (audit.onPage.untranslatedKeys.length > 0) {
  console.log('Sample untranslated keys:', audit.onPage.untranslatedKeys.slice(0, 10));
}

console.log('\n--- STRUCTURED DATA (JSON-LD) ---');
console.log(`Total Schemas: ${audit.structuredData.totalSchemas}`);
console.log(`By Type:`, audit.structuredData.byType);
console.log(`Rule 5 Violations (Prohibited Fake Ratings): ${audit.structuredData.rule5Violations.length}`);
console.log(`Validation Errors: ${audit.structuredData.validationErrors.length}`);

console.log('\n--- INTERNAL LINKING ---');
console.log(`Total Internal Links Audited: ${audit.links.totalInternalLinks}`);
console.log(`Broken Internal Links: ${audit.links.brokenLinks.length}`);
console.log(`Links pointing to 301 redirects: ${audit.links.linksTo301s.length}`);

console.log('\n--- OPEN GRAPH & SOCIAL ---');
console.log(`Valid OG Pages: ${audit.openGraph.validOg}`);
console.log(`Non-existent OG Images: ${audit.openGraph.nonExistentImages.length}`);
console.log(`Missing Twitter Card: ${audit.openGraph.missingTwitterCard.length}`);
