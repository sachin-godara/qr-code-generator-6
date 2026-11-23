import fs from 'fs';

const blogs = [
  'how-to-scan-a-qr-code.md',
  'how-to-scan-qr-code-from-screenshot.md'
];

const locales = ['de', 'es', 'pt', 'tr'];

for (const blog of blogs) {
  const enPath = `frontend/src/content/blog/${blog}`;
  const enContent = fs.readFileSync(enPath, 'utf8');
  const enLines = enContent.split('\n').length;
  console.log(`\n=== Blog: ${blog} ===`);
  console.log(`EN lines: ${enLines}`);

  for (const loc of locales) {
    const locPath = `frontend/src/content/blog/${loc}/${blog}`;
    if (!fs.existsSync(locPath)) {
      console.error(`MISSING: ${locPath}`);
      continue;
    }
    const locContent = fs.readFileSync(locPath, 'utf8');
    const locLines = locContent.split('\n').length;
    console.log(`[${loc}] lines: ${locLines} (ratio: ${(locLines/enLines).toFixed(2)})`);
  }
}
