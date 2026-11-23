import fs from 'fs';

const locales = ['en', 'es', 'de', 'pt', 'tr'];
const dicts = {};

for (const loc of locales) {
  dicts[loc] = JSON.parse(fs.readFileSync(`frontend/src/i18n/locales/${loc}.json`, 'utf8'));
}

// Flatten an object to key paths
function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(flattenKeys(obj[k], fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

const scannerKeysByLoc = {};
locales.forEach(loc => {
  const allKeys = flattenKeys(dicts[loc]);
  scannerKeysByLoc[loc] = new Set(allKeys.filter(k => k.startsWith('scanner.')));
  console.log(`Locale ${loc}: ${scannerKeysByLoc[loc].size} scanner.* keys`);
});

// Check if any key is in en but missing in others
const enKeys = [...scannerKeysByLoc['en']];
locales.forEach(loc => {
  if (loc === 'en') return;
  const missing = enKeys.filter(k => !scannerKeysByLoc[loc].has(k));
  if (missing.length > 0) {
    console.error(`Keys in EN but missing in ${loc}:`, missing);
  } else {
    console.log(`✓ All ${enKeys.length} EN keys present in ${loc}`);
  }
  const extra = [...scannerKeysByLoc[loc]].filter(k => !scannerKeysByLoc['en'].has(k));
  if (extra.length > 0) {
    console.warn(`Keys in ${loc} but missing in EN:`, extra);
  }
});
