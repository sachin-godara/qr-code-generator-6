import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('frontend/dist');

function getAllHtmlFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
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
console.log('Total HTML files in dist:', htmlFiles.length);

const titles = new Map();
const descs = new Map();
let canonicalIssues = [];
let hreflangIssues = [];
let ogImageIssues = [];
let headingIssues = [];
let schemaStats = { total: 0, byType: {} };

// Index of all routes
const routeSet = new Set();
for (const file of htmlFiles) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (route === '/index/') route = '/';
  routeSet.add(route);
}

for (const file of htmlFiles) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (route === '/index/') route = '/';

  const html = fs.readFileSync(file, 'utf8');

  if (route === '/404/' || route === '/500/') continue;

  // Title check
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    headingIssues.push({ route, issue: 'Missing <title>' });
  } else {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(route);
  }

  // Meta description check
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  if (!desc) {
    canonicalIssues.push({ route, issue: 'Missing meta description' });
  } else {
    if (!descs.has(desc)) descs.set(desc, []);
    descs.get(desc).push(route);
  }

  // Canonical check
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canon = canonMatch ? canonMatch[1] : '';
  const expectedCanon = 'https://generatecustomqr.com' + route;
  if (!canon) {
    canonicalIssues.push({ route, issue: 'Missing canonical link' });
  } else if (canon !== expectedCanon) {
    canonicalIssues.push({ route, issue: `Canonical mismatch: got ${canon}, expected ${expectedCanon}` });
  }

  // OG Image check
  const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  if (ogImgMatch) {
    const ogImgUrl = ogImgMatch[1];
    let localPath = ogImgUrl.replace('https://generatecustomqr.com/', '');
    if (!fs.existsSync(path.join(DIST_DIR, localPath))) {
      ogImageIssues.push({ route, ogImage: ogImgUrl, issue: 'OG image file not found in dist' });
    }
  } else {
    ogImageIssues.push({ route, issue: 'Missing og:image' });
  }

  // Heading check
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length === 0) {
    headingIssues.push({ route, issue: 'No <h1> found' });
  } else if (h1s.length > 1) {
    headingIssues.push({ route, issue: `Multiple <h1> found (${h1s.length})` });
  }

  // JSON-LD
  const schemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([^<]*)<\/script>/gi)];
  for (const s of schemas) {
    try {
      const parsed = JSON.parse(s[1]);
      const t = parsed['@type'] || 'Unknown';
      schemaStats.total++;
      schemaStats.byType[t] = (schemaStats.byType[t] || 0) + 1;
    } catch (e) {
      console.log('Malformed JSON-LD on', route, e.message);
    }
  }

  // Hreflang reciprocity
  const hreflangs = [...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi)];
  if (hreflangs.length === 0) {
    hreflangIssues.push({ route, issue: 'No hreflang tags found' });
  } else {
    for (const h of hreflangs) {
      const targetUrl = h[2];
      const targetPath = targetUrl.replace('https://generatecustomqr.com', '');
      if (!routeSet.has(targetPath)) {
        hreflangIssues.push({ route, issue: `Hreflang target does not exist: ${targetUrl}` });
      }
    }
  }
}

// Find duplicate titles
const dupTitles = [...titles.entries()].filter(([k, v]) => v.length > 1);
// Find duplicate descriptions
const dupDescs = [...descs.entries()].filter(([k, v]) => v.length > 1);

console.log('\n--- AUDIT SUMMARY ---');
console.log('Total non-error pages audited:', htmlFiles.length - 2);
console.log('Duplicate titles across pages:', dupTitles.length);
if (dupTitles.length > 0) {
  dupTitles.forEach(([t, urls]) => console.log('  Dup Title:', t, 'on:', urls));
}
console.log('Duplicate descriptions across pages:', dupDescs.length);
if (dupDescs.length > 0) {
  dupDescs.forEach(([d, urls]) => console.log('  Dup Desc:', d, 'on:', urls));
}
console.log('Canonical issues:', canonicalIssues.length);
canonicalIssues.forEach(i => console.log('  ', i));

console.log('OG Image issues:', ogImageIssues.length);
ogImageIssues.forEach(i => console.log('  ', i));

console.log('Heading issues:', headingIssues.length);
headingIssues.forEach(i => console.log('  ', i));

console.log('Hreflang target issues:', hreflangIssues.length);
hreflangIssues.forEach(i => console.log('  ', i));

console.log('\nSchema Statistics:', schemaStats);
