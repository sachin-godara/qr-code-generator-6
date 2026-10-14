import fs from 'node:fs';

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
  process.exit(0);
}
