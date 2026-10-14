import fs from 'node:fs';
import path from 'node:path';

const mapping = {
  de: { from: '/de/qr-code-scanner', to: '/de/qr-code-scannen' },
  es: { from: '/es/qr-code-scanner', to: '/es/escanear-codigo-qr' },
  pt: { from: '/pt/qr-code-scanner', to: '/pt/escanear-qr-code' },
  tr: { from: '/tr/qr-code-scanner', to: '/tr/qr-kod-okuyucu' },
};

for (const [loc, rule] of Object.entries(mapping)) {
  const dir = path.join('frontend/src/content/blog', loc);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const original = fs.readFileSync(fullPath, 'utf-8');
    const regex = new RegExp(rule.from, 'g');
    if (regex.test(original)) {
      const updated = original.replace(regex, rule.to);
      fs.writeFileSync(fullPath, updated, 'utf-8');
      console.log(`Updated ${fullPath}`);
    }
  }
}
