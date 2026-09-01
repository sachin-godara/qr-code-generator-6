import fs from 'fs';
import path from 'path';

function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const colorPairs = [
  // High Contrast
  { name: 'Black on White', fg: '#000000', bg: '#FFFFFF', stated: '21.0:1' },
  { name: 'Navy on White', fg: '#1A237E', bg: '#FFFFFF', stated: '13.2:1' },
  { name: 'Dark Green on White', fg: '#1B5E20', bg: '#FFFFFF', stated: '7.9:1' },
  { name: 'Burgundy on White', fg: '#880E4F', bg: '#FFFFFF', stated: '9.4:1' },
  { name: 'Dark Purple on White', fg: '#4A148C', bg: '#FFFFFF', stated: '11.9:1' },
  { name: 'Charcoal on Light Gray', fg: '#212121', bg: '#F5F5F5', stated: '14.8:1' },
  
  // Medium Contrast
  { name: 'Steel Blue on White', fg: '#1565C0', bg: '#FFFFFF', stated: '5.7:1' },
  { name: 'Forest Green on White', fg: '#2E7D32', bg: '#FFFFFF', stated: '5.1:1' },
  { name: 'Crimson on White', fg: '#C62828', bg: '#FFFFFF', stated: '5.6:1' },
  { name: 'Burnt Orange on White', fg: '#BF360C', bg: '#FFFFFF', stated: '5.6:1' },
  { name: 'Teal on White', fg: '#00695C', bg: '#FFFFFF', stated: '6.6:1' },

  // Dangerous (Avoid)
  { name: 'Yellow on White', fg: '#FFEB3B', bg: '#FFFFFF', stated: '1.2:1' },
  { name: 'Light Blue on White', fg: '#81D4FA', bg: '#FFFFFF', stated: '1.6:1' },
  { name: 'Light Green on White', fg: '#A5D6A7', bg: '#FFFFFF', stated: '1.6:1' },
  { name: 'Pink on White', fg: '#F48FB1', bg: '#FFFFFF', stated: '2.2:1' },
  { name: 'Gray on White', fg: '#BDBDBD', bg: '#FFFFFF', stated: '1.9:1' },

  // Dark Mode Pairs
  { name: 'White on Dark Navy', fg: '#FFFFFF', bg: '#0D1117', stated: '18.9:1' },
  { name: 'Light Yellow on Dark Charcoal', fg: '#FFF9C4', bg: '#1A1A1A', stated: '16.2:1' },
  { name: 'Light Cyan on Dark Teal', fg: '#B2EBF2', bg: '#004D40', stated: '7.5:1' },
  { name: 'Cream Background', bg: '#FFF8E1' }
];

console.log('====================================================');
console.log('🔬 WCAG 2.1 MATHEMATICAL COLOR CONTRAST AUDIT');
console.log('====================================================\n');

for (const pair of colorPairs) {
  if (pair.fg && pair.bg) {
    const calculated = getContrast(pair.fg, pair.bg);
    const formatted = calculated.toFixed(1) + ':1';
    const matchesStated = pair.stated ? Math.abs(calculated - parseFloat(pair.stated)) < 0.8 : true;
    console.log(`${pair.name.padEnd(30)} | FG: ${pair.fg} BG: ${pair.bg} | Calculated: ${formatted.padEnd(7)} | Stated: ${(pair.stated || 'N/A').padEnd(6)} | ${matchesStated ? '✅ PASS' : '⚠️ MISMATCH'}`);
  }
}

// Check all 5 files
const files = [
  { lang: 'EN', path: 'src/content/blog/qr-code-color-guide.md' },
  { lang: 'ES', path: 'src/content/blog/es/qr-code-color-guide.md' },
  { lang: 'PT', path: 'src/content/blog/pt/qr-code-color-guide.md' },
  { lang: 'DE', path: 'src/content/blog/de/qr-code-color-guide.md' },
  { lang: 'TR', path: 'src/content/blog/tr/qr-code-color-guide.md' }
];

console.log('\n====================================================');
console.log('📄 5-LANGUAGE ARTICLE FILE PARITY & INTEGRITY AUDIT');
console.log('====================================================\n');

for (const f of files) {
  if (!fs.existsSync(f.path)) {
    console.log(`❌ Missing file: ${f.path}`);
    continue;
  }
  const content = fs.readFileSync(f.path, 'utf8');
  const wordCount = content.split(/\s+/).length;
  const hexes = content.match(/#[0-9A-Fa-f]{6}/g) || [];
  const links = [...content.matchAll(/\]\(([^)]+)\)/g)].map(m => m[1]);
  const nonTrailingSlashLinks = links.filter(l => l.startsWith('/') && !l.endsWith('/') && !l.includes('#') && !l.includes('.'));
  
  console.log(`[${f.lang}] ${f.path}`);
  console.log(`  - Word count: ${wordCount}`);
  console.log(`  - Unique Hex codes found: ${[...new Set(hexes)].length}`);
  console.log(`  - Links missing trailing slash: ${nonTrailingSlashLinks.length}`);
  if (nonTrailingSlashLinks.length > 0) {
    console.log(`    ⚠️ ${nonTrailingSlashLinks.join(', ')}`);
  }
}
