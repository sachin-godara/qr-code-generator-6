import fs from 'fs';
import path from 'path';

function getAllFiles(dir, exts = ['.astro', '.md', '.tsx', '.ts', '.html']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.astro') {
        files = files.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const distFiles = getAllFiles('dist', ['.html']);
console.log(`Auditing ${distFiles.length} HTML files in dist/...`);

const nonTrailingSlashLinks = new Set();
const wwwLinks = new Set();
const httpLinks = new Set();
const malformedLinks = new Set();

// Regular expression to match internal hrefs
const hrefRegex = /href=["']([^"']+)["']/g;

for (const file of distFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    
    // Ignore external domains (except our own domain with issues)
    if (href.startsWith('http://generatecustomqr.com')) {
      httpLinks.add(`${file}: ${href}`);
    } else if (href.includes('www.generatecustomqr.com')) {
      wwwLinks.add(`${file}: ${href}`);
    } else if (href.startsWith('/') || href.startsWith('https://generatecustomqr.com')) {
      // Internal link
      let urlPath = href.replace('https://generatecustomqr.com', '');
      
      // Skip assets, api, and data
      if (
        urlPath === '/' ||
        urlPath.startsWith('/_astro') ||
        urlPath.startsWith('/favicon') ||
        urlPath.startsWith('/apple-touch-icon') ||
        urlPath.startsWith('/manifest') ||
        urlPath.startsWith('/rss') ||
        urlPath.startsWith('data:')
      ) {
        continue;
      }

      // Remove query and hash before checking trailing slash on path
      let cleanPath = urlPath.split('?')[0].split('#')[0];

      if (cleanPath.includes('.')) {
        // file asset like .css, .png
        continue;
      }
      
      if (cleanPath && !cleanPath.endsWith('/')) {
        nonTrailingSlashLinks.add(`${href} (cleanPath: "${cleanPath}" found in ${path.relative(process.cwd(), file)})`);
      }
      
      if (urlPath === '/&' || urlPath.endsWith('/&')) {
        malformedLinks.add(`${file}: ${href}`);
      }
    }
  }
}

console.log('\n--- AUDIT RESULTS ---');
console.log(`HTTP links (should be 0): ${httpLinks.size}`);
httpLinks.forEach(l => console.log('  ⚠️ ' + l));

console.log(`WWW links (should be 0): ${wwwLinks.size}`);
wwwLinks.forEach(l => console.log('  ⚠️ ' + l));

console.log(`Malformed /& links (should be 0): ${malformedLinks.size}`);
malformedLinks.forEach(l => console.log('  ⚠️ ' + l));

console.log(`Internal Links Missing Trailing Slash: ${nonTrailingSlashLinks.size}`);
nonTrailingSlashLinks.forEach(l => console.log('  ⚠️ ' + l));
