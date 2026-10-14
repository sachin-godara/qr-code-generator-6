import fs from 'node:fs';

const content = fs.readFileSync('frontend/astro.config.mjs', 'utf-8');
if (content.includes('lastmod: new Date()')) {
  console.error('FAIL: astro.config.mjs contains volatile lastmod: new Date()');
  process.exit(1);
} else {
  console.log('PASS: Sitemap lastmod configuration is clean.');
  process.exit(0);
}
