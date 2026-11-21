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

const files = getAllHtmlFiles(DIST_DIR);
const routeSet = new Set();
for (const file of files) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (route === '/index/') route = '/';
  routeSet.add(route);
}

// Read redirects to find redirected targets
const redirectsFile = path.resolve('frontend/public/_redirects');
const redirectRules = new Map();
if (fs.existsSync(redirectsFile)) {
  const lines = fs.readFileSync(redirectsFile, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 3 && parts[2] === '301') {
      redirectRules.set(parts[0], parts[1]);
    }
  }
}

let totalLinks = 0;
let internalLinksToRedirects = [];
let internalBrokenLinks = [];

const hrefRegex = /href=["']([^"'#?]+)["']/g;

for (const file of files) {
  const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    let href = match[1];
    if (href.startsWith('https://generatecustomqr.com')) {
      href = href.replace('https://generatecustomqr.com', '');
    }
    if (href.startsWith('/') && !href.startsWith('//')) {
      totalLinks++;
      // check if it links to a static asset (.css, .png, .svg, .xml, .ico, .json)
      if (href.includes('.')) {
        const assetPath = path.join(DIST_DIR, href.replace(/^\//, ''));
        if (!fs.existsSync(assetPath)) {
          internalBrokenLinks.push({ from: relPath, href, type: 'missing asset' });
        }
        continue;
      }

      // Format route
      let clean = href.endsWith('/') ? href : href + '/';
      if (clean === '/index/') clean = '/';

      if (!routeSet.has(clean)) {
        internalBrokenLinks.push({ from: relPath, href, type: 'missing route' });
      }

      // Check if href is a 301 redirect source
      if (redirectRules.has(href) || redirectRules.has(clean)) {
        const dest = redirectRules.get(href) || redirectRules.get(clean);
        internalLinksToRedirects.push({ from: relPath, href, redirectTo: dest });
      }
    }
  }
}

console.log(`Audited ${totalLinks} internal links across ${files.length} pages.`);
console.log(`Broken internal links: ${internalBrokenLinks.length}`);
internalBrokenLinks.forEach(b => console.log(`  [BROKEN] in ${b.from} -> ${b.href} (${b.type})`));

console.log(`Internal links pointing to 301 redirects: ${internalLinksToRedirects.length}`);
internalLinksToRedirects.forEach(r => console.log(`  [REDIRECT] in ${r.from} -> ${r.href} redirects to ${r.redirectTo}`));
