import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`Auditing ${htmlFiles.length} HTML files in dist/...`);

let violations = [];
let totalSchemas = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');

  // Check for forbidden schema terms
  if (/aggregateRating/i.test(content)) {
    violations.push(`[${relPath}] Contains 'aggregateRating'`);
  }
  if (/ratingValue/i.test(content)) {
    violations.push(`[${relPath}] Contains 'ratingValue'`);
  }
  if (/ratingCount/i.test(content)) {
    violations.push(`[${relPath}] Contains 'ratingCount'`);
  }
  if (/reviewCount/i.test(content)) {
    violations.push(`[${relPath}] Contains 'reviewCount'`);
  }

  // Check for fake rating text
  if (/4\.9\s*\/\s*5|4\.8\s*\/\s*5|5\.0\s*\/\s*5/i.test(content)) {
    violations.push(`[${relPath}] Contains fake rating score (e.g. 4.9/5)`);
  }
  if (/2[,.]840/i.test(content)) {
    violations.push(`[${relPath}] Contains fake review count 2,840`);
  }

  // Parse all JSON-LD schemas
  const schemas = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([^<]*)<\/script>/gi)];
  for (const match of schemas) {
    totalSchemas++;
    try {
      const data = JSON.parse(match[1]);
      if (data.aggregateRating) {
        violations.push(`[${relPath}] JSON-LD contains aggregateRating in @type=${data['@type']}`);
      }
      if (data.review) {
        violations.push(`[${relPath}] JSON-LD contains review in @type=${data['@type']}`);
      }
    } catch (e) {
      violations.push(`[${relPath}] Invalid JSON-LD schema syntax: ${e.message}`);
    }
  }
}

console.log('====================================================');
console.log(`Total HTML files audited: ${htmlFiles.length}`);
console.log(`Total JSON-LD schemas verified: ${totalSchemas}`);
console.log(`Total violations: ${violations.length}`);
console.log('====================================================');

if (violations.length === 0) {
  console.log('✅ PASS: All 142 pages and all JSON-LD structured data are 100% free of fake ratings!');
  process.exit(0);
} else {
  console.error('❌ FAIL: Prohibited ratings found:');
  violations.forEach(v => console.error('  - ' + v));
  process.exit(1);
}
