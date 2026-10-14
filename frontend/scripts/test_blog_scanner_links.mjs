import fs from 'node:fs';
import path from 'node:path';

const locales = ['de', 'es', 'pt', 'tr'];
let failed = false;
let occurrences = 0;

for (const loc of locales) {
  const dir = path.join('frontend/src/content/blog', loc);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const regex = new RegExp(`/${loc}/qr-code-scanner`, 'g');
    const matches = content.match(regex);
    if (matches) {
      console.error(`FAIL: Found ${matches.length} legacy link(s) /${loc}/qr-code-scanner in ${fullPath}`);
      occurrences += matches.length;
      failed = true;
    }
  }
}

if (failed) {
  console.error(`Total legacy link occurrences found: ${occurrences}`);
  process.exit(1);
} else {
  console.log('PASS: All localized blog posts use canonical scanner links.');
  process.exit(0);
}
