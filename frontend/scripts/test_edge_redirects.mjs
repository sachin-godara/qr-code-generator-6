import fs from 'node:fs';

const content = fs.readFileSync('frontend/public/_redirects', 'utf-8');
const requiredRules = [
  '/tr/qr-code-scanner/ /tr/qr-kod-okuyucu/ 301!',
  '/tr/qr-code-scanner /tr/qr-kod-okuyucu/ 301!',
  '/de/qr-code-scanner/ /de/qr-code-scannen/ 301!',
  '/de/qr-code-scanner /de/qr-code-scannen/ 301!',
  '/es/qr-code-scanner/ /es/escanear-codigo-qr/ 301!',
  '/es/qr-code-scanner /es/escanear-codigo-qr/ 301!',
  '/pt/qr-code-scanner/ /pt/escanear-qr-code/ 301!',
  '/pt/qr-code-scanner /pt/escanear-qr-code/ 301!',
];

const normalizedLines = content.split('\n').map(l => l.trim().replace(/\s+/g, ' '));
const missing = requiredRules.filter(r => !normalizedLines.includes(r));

if (missing.length > 0) {
  console.error('FAIL: Missing required 301! forced rules in frontend/public/_redirects:', missing);
  process.exit(1);
} else {
  console.log('PASS: All localized scanner rules properly forced with 301!');
  process.exit(0);
}
