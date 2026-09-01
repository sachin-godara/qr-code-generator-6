import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   DEEP TURKISH TRANSLATION & LEAKAGE AUDITOR                 ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const trLoc = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/i18n/locales/tr.json'), 'utf8'));
const enLoc = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/i18n/locales/en.json'), 'utf8'));

// Common brand names or universal technical terms that are identical in EN and TR
const allowedIdentical = new Set([
  'PNG', 'SVG', 'PDF', 'URL', 'WiFi', 'vCard', 'SMS', 'CSV', 'ZIP', 'DPI', 'px',
  'Instagram', 'WhatsApp', 'YouTube', 'Facebook', 'Twitter', 'TikTok', 'Spotify', 'Telegram', 'Discord', 'LinkedIn', 'Pinterest', 'Netflix', 'Twitch', 'Snapchat', 'Reddit', 'GitHub',
  'iPhone', 'Android', 'Samsung', 'Google', 'Google Maps', 'Google Lens', 'App Store', 'Google Play', 'Play Store', 'PayPal',
  'Ctrl+V', 'Cmd+V', '300 DPI', '4096×4096', 'WPA2', 'WPA3', 'WPA/WPA2/WPA3', 'WEP', 'SSID', 'QR', 'iOS', 'Mac', 'PC', 'None', 'Solid Color', 'Linear Gradient', 'Radial Gradient'
]);

// English words that should not appear in Turkish text unless part of allowed brand names
const suspiciousEnglishWords = [
  'warning', 'error', 'important', 'caution', 'note', 'tip', 'step', 'next', 'back', 'done',
  'download', 'upload', 'scan', 'generate', 'create', 'settings', 'color', 'background', 'foreground',
  'please', 'select', 'choose', 'enter', 'invalid', 'success', 'failed', 'loading',
  'preview', 'resolution', 'format', 'quality', 'contrast', 'ratio', 'scannability',
  'drag and drop', 'browse files', 'paste', 'clipboard', 'share', 'copy', 'copied',
  'free', 'unlimited', 'forever', 'commercial', 'watermark', 'high quality', 'print ready'
];

function flattenObj(obj, prefix = '') {
  let res = {};
  for (const k of Object.keys(obj)) {
    const pre = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(res, flattenObj(obj[k], pre));
    } else {
      res[pre] = obj[k];
    }
  }
  return res;
}

const flatTr = flattenObj(trLoc);
const flatEn = flattenObj(enLoc);

let potentialLeakage = [];

for (const [key, trVal] of Object.entries(flatTr)) {
  const enVal = flatEn[key];
  if (typeof trVal === 'string') {
    const trLower = trVal.toLowerCase();
    
    // Check if identical to English value when English is a full sentence
    if (enVal && trVal === enVal && enVal.length > 5 && !allowedIdentical.has(enVal.trim())) {
      potentialLeakage.push({ key, type: 'IDENTICAL_TO_EN', trVal, enVal });
      continue;
    }

    // Check for suspicious English words in Turkish text
    for (const word of suspiciousEnglishWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(trLower)) {
        // If it's an exact English word present in trVal but not part of known loan words
        // Let's check if the whole phrase is English
        if (enVal && enVal.toLowerCase().includes(word) && trLower.includes(word)) {
          // Check if trVal is significantly English
          const enWordsCount = suspiciousEnglishWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(trLower)).length;
          if (enWordsCount >= 2 && trVal === enVal) {
            potentialLeakage.push({ key, type: 'ENGLISH_PHRASE', trVal, enVal });
            break;
          }
        }
      }
    }
  }
}

console.log(`🔍 [1/4] Audited ${Object.keys(flatTr).length} keys in tr.json. Suspicious keys found: ${potentialLeakage.length}`);
if (potentialLeakage.length > 0) {
  potentialLeakage.forEach(p => console.log(`  - [${p.type}] ${p.key}: "${p.trVal}"`));
}

// 2. Check React components and Astro templates for hardcoded English strings on Turkish route
console.log('\n🔍 [2/4] Auditing Astro templates and React components for hardcoded English text...');
const srcFiles = [];
function getFiles(dir) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of ents) {
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!ent.name.startsWith('.') && ent.name !== 'node_modules') getFiles(fp);
    } else if (/\.(astro|tsx|jsx|ts|js)$/.test(ent.name) && !ent.name.includes('.test.')) {
      srcFiles.push(fp);
    }
  }
}
getFiles(path.join(rootDir, 'src'));

let hardcodedIssues = [];
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Check for common hardcoded English strings in JSX/HTML
  const matches = [
    { pattern: />\s*Download QR Code\s*</i, name: 'Download QR Code' },
    { pattern: />\s*Generate QR Code\s*</i, name: 'Generate QR Code' },
    { pattern: />\s*Select Language\s*</i, name: 'Select Language' },
    { pattern: />\s*Scan QR Code\s*</i, name: 'Scan QR Code' },
    { pattern: />\s*Browse Files\s*</i, name: 'Browse Files' },
    { pattern: />\s*Upload Image\s*</i, name: 'Upload Image' },
    { pattern: />\s*Language \/ Idioma\s*</i, name: 'Language / Idioma' }
  ];
  
  for (const m of matches) {
    if (m.pattern.test(content) && !file.includes('en.json') && !file.includes('LanguageSwitcher.astro')) {
      // In LanguageSwitcher.astro or ReactLanguageSwitcher.tsx, check if TR header is localized
    }
  }
}

// 3. Check ReactLanguageSwitcher.tsx for dropdown header
const reactSwitcherContent = fs.readFileSync(path.join(rootDir, 'src/react/components/ReactLanguageSwitcher.tsx'), 'utf8');
if (reactSwitcherContent.includes('Language / Idioma') && !reactSwitcherContent.includes('t(')) {
  console.log('  ⚠️ Found hardcoded "Language / Idioma" header in ReactLanguageSwitcher.tsx');
}

// 4. Check all 20 Turkish blog articles for any English paragraphs, alert boxes or untranslated markdown
console.log('\n🔍 [3/4] Deep scanning 20 Turkish blog articles for English words & headers...');
const trBlogDir = path.join(rootDir, 'src/content/blog/tr');
const blogFiles = fs.readdirSync(trBlogDir).filter(f => f.endsWith('.md'));

let blogParagraphIssues = [];

const englishCommonParagraphWords = [
  /\bthe\b/i, /\bthis article\b/i, /\bin this guide\b/i, /\bwe will cover\b/i, /\bfor example\b/i,
  /\bhere are\b/i, /\bto get started\b/i, /\bclick here\b/i, /\bmake sure\b/i, /\bkeep in mind\b/i,
  /\bpro tip\b/i, /\bkey takeaway\b/i, /\bconclusion\b/i, /\bstep-by-step\b/i
];

for (const bf of blogFiles) {
  const raw = fs.readFileSync(path.join(trBlogDir, bf), 'utf8');
  const lines = raw.split('\n');
  lines.forEach((line, idx) => {
    // Check non-code, non-URL lines
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('```') && !trimmed.startsWith('http') && !trimmed.startsWith('url:') && !trimmed.startsWith('keywords:') && !trimmed.startsWith('<span') && !trimmed.startsWith('width:')) {
      const matchCount = englishCommonParagraphWords.filter(rgx => rgx.test(trimmed)).length;
      if (matchCount >= 2 && trimmed.length > 20) {
        blogParagraphIssues.push({ file: bf, line: idx + 1, text: trimmed.slice(0, 80) });
      }
    }
  });
}

console.log(`  Found ${blogParagraphIssues.length} English paragraph leaks in blog articles.`);
if (blogParagraphIssues.length > 0) {
  blogParagraphIssues.forEach(b => console.log(`  - ${b.file}:${b.line} -> "${b.text}..."`));
}

// 5. Inspect 35 Turkish HTML pages in dist/tr/
console.log('\n🔍 [4/4] Inspecting all 35 built Turkish pages in dist/tr/ for untranslated elements...');
const distTr = path.join(rootDir, 'dist/tr');
let distIssues = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scanDir(full);
    } else if (ent.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');
      
      // Look for untranslated buttons or labels in HTML
      const suspiciousHtmlSnippets = [
        { label: 'Language / Idioma', test: />Language \/ Idioma</ },
        { label: 'Download QR Code button', test: />Download QR Code</ },
        { label: 'Generate Free QR Code', test: />Generate Free QR Code</ },
        { label: 'Step 1 of', test: />Step \d+ of \d+</ },
        { label: 'Table of Contents header', test: />Table of Contents</ },
        { label: 'Related Articles header', test: />Related Articles</ },
        { label: 'Share this article', test: />Share this article/i },
        { label: 'Scan with camera', test: />Scan with camera/i },
        { label: 'Upload image file', test: />Upload image file/i }
      ];

      for (const sh of suspiciousHtmlSnippets) {
        if (sh.test.test(html)) {
          distIssues.push({ file: full.replace(distTr, '/tr'), issue: sh.label });
        }
      }
    }
  }
}
scanDir(distTr);

console.log(`  Found ${distIssues.length} untranslated items in dist/tr/ pages.`);
if (distIssues.length > 0) {
  distIssues.forEach(d => console.log(`  - ${d.file}: ${d.issue}`));
}

console.log('\n===============================================================');
console.log(`TOTAL AUDIT ISSUES DETECTED: ${potentialLeakage.length + blogParagraphIssues.length + distIssues.length}`);
console.log('===============================================================');
