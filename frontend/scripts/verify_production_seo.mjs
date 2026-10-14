import fs from 'node:fs';
import path from 'node:path';

console.log('--- Verifying Production SEO Artifacts ---');

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
console.log('✓ 1. Zero forbidden static noindex redirect folders exist in dist/');

// 2. Assert canonical scanner pages exist and lack noindex
const requiredPages = [
  { path: 'frontend/dist/qr-code-scanner/index.html', canonical: 'https://generatecustomqr.com/qr-code-scanner/' },
  { path: 'frontend/dist/de/qr-code-scannen/index.html', canonical: 'https://generatecustomqr.com/de/qr-code-scannen/' },
  { path: 'frontend/dist/es/escanear-codigo-qr/index.html', canonical: 'https://generatecustomqr.com/es/escanear-codigo-qr/' },
  { path: 'frontend/dist/pt/escanear-qr-code/index.html', canonical: 'https://generatecustomqr.com/pt/escanear-qr-code/' },
  { path: 'frontend/dist/tr/qr-kod-okuyucu/index.html', canonical: 'https://generatecustomqr.com/tr/qr-kod-okuyucu/' },
];

for (const p of requiredPages) {
  if (!fs.existsSync(p.path)) {
    console.error(`FAIL: Required canonical page missing: ${p.path}`);
    process.exit(1);
  }
  const content = fs.readFileSync(p.path, 'utf-8');
  if (content.includes('content="noindex"') || content.includes("content='noindex'")) {
    console.error(`FAIL: Canonical page ${p.path} contains noindex!`);
    process.exit(1);
  }
  if (!content.includes(`href="${p.canonical}"`)) {
    console.error(`FAIL: Canonical tag mismatch in ${p.path}, expected ${p.canonical}`);
    process.exit(1);
  }
}
console.log('✓ 2. All 5 canonical scanner pages exist, have valid canonical tags, and zero noindex tags.');

// 3. Assert _redirects in dist contains forced 301!
const distRedirectsPath = 'frontend/dist/_redirects';
if (!fs.existsSync(distRedirectsPath)) {
  console.error('FAIL: frontend/dist/_redirects does not exist');
  process.exit(1);
}
const distRedirects = fs.readFileSync(distRedirectsPath, 'utf-8');
const requiredRedirectRules = [
  '/de/qr-code-scanner/ /de/qr-code-scannen/ 301!',
  '/de/qr-code-scanner /de/qr-code-scannen/ 301!',
  '/es/qr-code-scanner/ /es/escanear-codigo-qr/ 301!',
  '/es/qr-code-scanner /es/escanear-codigo-qr/ 301!',
  '/pt/qr-code-scanner/ /pt/escanear-qr-code/ 301!',
  '/pt/qr-code-scanner /pt/escanear-qr-code/ 301!',
  '/tr/qr-code-scanner/ /tr/qr-kod-okuyucu/ 301!',
  '/tr/qr-code-scanner /tr/qr-kod-okuyucu/ 301!',
];

const normalizedDistLines = distRedirects.split('\n').map(l => l.trim().replace(/\s+/g, ' '));
for (const rule of requiredRedirectRules) {
  if (!normalizedDistLines.includes(rule)) {
    console.error(`FAIL: dist/_redirects missing required rule: ${rule}`);
    process.exit(1);
  }
}
console.log('✓ 3. frontend/dist/_redirects includes all 8 forced 301! rules.');

// 4. Assert all HTML files in dist (excluding 404/500) do NOT contain accidental noindex
function checkDirForNoindex(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirForNoindex(full);
    } else if (entry.name.endsWith('.html')) {
      if (full.includes('404') || full.includes('500')) continue;
      const html = fs.readFileSync(full, 'utf-8');
      if (html.includes('content="noindex"') || html.includes("content='noindex'")) {
        console.error(`FAIL: Non-error page contains noindex: ${full}`);
        process.exit(1);
      }
    }
  }
}
checkDirForNoindex('frontend/dist');
console.log('✓ 4. Zero accidental noindex tags across all production HTML pages.');

console.log('\n========================================');
console.log('PASS: ALL PRODUCTION SEO AUDITS PASSED!');
console.log('========================================');
process.exit(0);
