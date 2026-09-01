import fs from 'fs';
import path from 'path';

const locales = ['en', 'es', 'pt', 'de', 'tr'];
const dicts = {};

locales.forEach(loc => {
  dicts[loc] = JSON.parse(fs.readFileSync(`src/i18n/locales/${loc}.json`, 'utf8'));
});

function getVal(dict, key) {
  const parts = key.split('.');
  let curr = dict;
  for (const p of parts) {
    if (curr && typeof curr === 'object' && p in curr) {
      curr = curr[p];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

const reactDir = path.resolve('src/react');
const allKeys = new Set();

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const matches = code.matchAll(/\bt\(\s*["']([^"'\r\n]+)["']/g);
      for (const m of matches) {
        allKeys.add(m[1]);
      }
    }
  }
}

scanDir(reactDir);

console.log(`Found ${allKeys.size} unique translation keys across React components.`);

let missingCount = 0;

for (const key of allKeys) {
  for (const loc of locales) {
    const val = getVal(dicts[loc], key);
    if (val === undefined) {
      console.warn(`[MISSING KEY] [${loc}] "${key}"`);
      missingCount++;
    }
  }
}

if (missingCount === 0) {
  console.log('✅ ALL React translation keys exist across ALL 5 locales (en, es, pt, de, tr)!');
} else {
  console.error(`❌ Total missing keys: ${missingCount}`);
  process.exit(1);
}
