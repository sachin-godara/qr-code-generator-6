import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`Found ${htmlFiles.length} HTML pages in dist/ to analyze.\n`);

const report = {
  totalPages: htmlFiles.length,
  languages: { en: 0, es: 0, pt: 0, de: 0 },
  pageTypes: {
    home: 0,
    tools: 0,
    scanner: 0,
    howToUse: 0,
    blogIndex: 0,
    blogPost: 0,
    legalAndInfo: 0,
    errors: 0
  },
  wordCounts: [],
  issues: [],
  warnings: [],
  internalLinksAudited: 0,
  imagesAudited: 0,
  schemasAudited: 0,
  hreflangAudited: 0
};

// Build an inventory of all existing route paths
const existingRoutes = new Set();
for (const file of htmlFiles) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (route === '/index') route = '/';
  existingRoutes.add(route);
}

for (const file of htmlFiles) {
  const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + relPath.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (route === '/index') route = '/';

  const html = fs.readFileSync(file, 'utf8');

  // Detect language
  let lang = 'en';
  if (route.startsWith('/es/') || route === '/es') lang = 'es';
  else if (route.startsWith('/pt/') || route === '/pt') lang = 'pt';
  else if (route.startsWith('/de/') || route === '/de') lang = 'de';
  report.languages[lang]++;

  // Categorize Page Type
  if (route === '/' || route === '/es' || route === '/pt' || route === '/de') {
    report.pageTypes.home++;
  } else if (route.includes('/qr-code-scanner')) {
    report.pageTypes.scanner++;
  } else if (route.includes('/how-to-use')) {
    report.pageTypes.howToUse++;
  } else if (route.endsWith('/blog')) {
    report.pageTypes.blogIndex++;
  } else if (route.includes('/blog/')) {
    report.pageTypes.blogPost++;
  } else if (['/404', '/500'].includes(route)) {
    report.pageTypes.errors++;
  } else if (['/about', '/contact', '/privacy-policy', '/terms', '/es/about', '/es/contact', '/es/privacy-policy', '/es/terms', '/pt/about', '/pt/contact', '/pt/privacy-policy', '/pt/terms', '/de/about', '/de/contact', '/de/privacy-policy', '/de/terms'].includes(route)) {
    report.pageTypes.legalAndInfo++;
  } else {
    report.pageTypes.tools++;
  }

  // 1. Title Check
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    report.issues.push(`[${route}] Missing <title> tag`);
  } else {
    const title = titleMatch[1].trim();
    if (title.length < 25) {
      report.warnings.push(`[${route}] Short <title> (${title.length} chars): "${title}"`);
    }
  }

  // 2. Meta Description Check
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    if (!['/404', '/500'].includes(route)) {
      report.issues.push(`[${route}] Missing meta description`);
    }
  }

  // 3. Canonical Check
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canonMatch) {
    if (!['/404', '/500'].includes(route)) {
      report.issues.push(`[${route}] Missing canonical link`);
    }
  }

  // 4. Hreflang Check
  const hreflangs = [...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi)];
  if (!['/404', '/500'].includes(route)) {
    if (hreflangs.length < 5) {
      report.warnings.push(`[${route}] Found only ${hreflangs.length} hreflang tags (expected 5: en, es, pt, de, x-default)`);
    }
    report.hreflangAudited += hreflangs.length;
  }

  // 5. OpenGraph Tags
  const ogTitle = html.match(/<meta\s+property=["']og:title["']/i);
  const ogDesc = html.match(/<meta\s+property=["']og:description["']/i);
  const ogImg = html.match(/<meta\s+property=["']og:image["']/i);
  if (!ogTitle || !ogDesc || !ogImg) {
    if (!['/404', '/500'].includes(route)) {
      report.warnings.push(`[${route}] Incomplete OpenGraph tags (title: ${!!ogTitle}, desc: ${!!ogDesc}, img: ${!!ogImg})`);
    }
  }

  // 6. JSON-LD Schemas
  const jsonLds = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([^<]*)<\/script>/gi)];
  if (jsonLds.length > 0) {
    for (const jMatch of jsonLds) {
      try {
        JSON.parse(jMatch[1]);
        report.schemasAudited++;
      } catch (err) {
        report.issues.push(`[${route}] Corrupt JSON-LD schema: ${err.message}`);
      }
    }
  }

  // 7. Heading Hierarchy
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length === 0 && !['/404', '/500'].includes(route)) {
    report.issues.push(`[${route}] Missing <h1> tag`);
  } else if (h1s.length > 1) {
    report.warnings.push(`[${route}] Multiple <h1> tags found (${h1s.length})`);
  }

  // 8. Translation Key Leakage
  const leaks = html.match(/(studio\.[a-zA-Z0-9_.]+|nav\.[a-zA-Z0-9_.]+|footer\.[a-zA-Z0-9_.]+|seo\.[a-zA-Z0-9_.]+)/g);
  if (leaks) {
    // Filter out false positives in script bundles if in pure HTML text
    // Check if leak is in visible text (outside script/style)
    const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    const visibleLeaks = textOnly.match(/(studio\.[a-zA-Z0-9_.]+|nav\.[a-zA-Z0-9_.]+|footer\.[a-zA-Z0-9_.]+|seo\.[a-zA-Z0-9_.]+)/g);
    if (visibleLeaks) {
      report.issues.push(`[${route}] Leaked translation keys in HTML: ${visibleLeaks.slice(0, 3).join(', ')}`);
    }
  }

  // 9. Word Count
  const plainText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText.split(/\s+/).length;
  report.wordCounts.push({ route, lang, wordCount });

  // 10. Image Alt Text
  const imgs = [...html.matchAll(/<img\s+([^>]*?)>/gi)];
  for (const img of imgs) {
    report.imagesAudited++;
    const attrs = img[1];
    if (!attrs.includes('alt=') || /alt=["']\s*["']/.test(attrs)) {
      // Ignore aria-hidden or purely decorative if marked
      if (!attrs.includes('aria-hidden="true"')) {
        report.warnings.push(`[${route}] <img> missing alt attribute: ${attrs.slice(0, 50)}...`);
      }
    }
  }

  // 11. Internal Links Validation
  const links = [...html.matchAll(/<a\s+[^>]*?href=["']([^"'#?]+)["']/gi)];
  for (const link of links) {
    const href = link[1];
    report.internalLinksAudited++;
    if (href.startsWith('/') && !href.startsWith('//')) {
      let cleanTarget = href.replace(/\/$/, '');
      if (cleanTarget === '') cleanTarget = '/';
      // If target has an extension like .xml or .svg or .png, check in dist directly
      if (cleanTarget.includes('.')) {
        const directFile = path.join(DIST_DIR, cleanTarget.replace(/^\//, ''));
        if (!fs.existsSync(directFile)) {
          report.warnings.push(`[${route}] Broken internal file link: "${href}"`);
        }
      } else {
        if (!existingRoutes.has(cleanTarget)) {
          report.warnings.push(`[${route}] Broken internal route link: "${href}"`);
        }
      }
    }
  }
}

// Summary calculation
report.wordCounts.sort((a, b) => a.wordCount - b.wordCount);
const shortestPages = report.wordCounts.slice(0, 10);
const longestPages = report.wordCounts.slice(-10).reverse();

console.log('====================================================');
console.log('   DEEP MULTILINGUAL SITE ANALYSIS SUMMARY          ');
console.log('====================================================');
console.log(`Total Pages Audited: ${report.totalPages}`);
console.log(`Language Breakdown:`);
console.log(`  - English (EN):    ${report.languages.en}`);
console.log(`  - Spanish (ES):    ${report.languages.es}`);
console.log(`  - Portuguese (PT): ${report.languages.pt}`);
console.log(`  - German (DE):     ${report.languages.de}`);
console.log(`\nPage Types Breakdown:`);
Object.entries(report.pageTypes).forEach(([type, count]) => {
  console.log(`  - ${type.padEnd(16)}: ${count}`);
});
console.log(`\nAudited Elements:`);
console.log(`  - Internal Links:   ${report.internalLinksAudited}`);
console.log(`  - Hreflang Tags:    ${report.hreflangAudited}`);
console.log(`  - JSON-LD Schemas:  ${report.schemasAudited}`);
console.log(`  - Images Audited:   ${report.imagesAudited}`);
console.log(`\nIssues Found (${report.issues.length}):`);
if (report.issues.length === 0) {
  console.log('  ✅ ZERO CRITICAL ISSUES!');
} else {
  report.issues.forEach(i => console.log('  ❌ ' + i));
}
console.log(`\nWarnings Found (${report.warnings.length}):`);
if (report.warnings.length === 0) {
  console.log('  ✅ ZERO WARNINGS!');
} else {
  report.warnings.slice(0, 15).forEach(w => console.log('  ⚠️  ' + w));
  if (report.warnings.length > 15) {
    console.log(`  ... and ${report.warnings.length - 15} more warnings`);
  }
}

console.log(`\nShortest Pages (by visible word count):`);
shortestPages.forEach(p => console.log(`  - ${p.route.padEnd(35)} (${p.lang}): ${p.wordCount} words`));

console.log(`\nLongest Pages (by visible word count):`);
longestPages.forEach(p => console.log(`  - ${p.route.padEnd(35)} (${p.lang}): ${p.wordCount} words`));

fs.writeFileSync('scripts/analysis_results.json', JSON.stringify({ report, shortestPages, longestPages }, null, 2));
console.log('\nResults saved to scripts/analysis_results.json');
