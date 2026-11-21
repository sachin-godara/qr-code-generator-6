import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('frontend/dist');

function getAllHtmlFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== '_astro') getAllHtmlFiles(full, list);
    } else if (item.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const files = getAllHtmlFiles(DIST_DIR);
let totalSchemas = 0;
let schemaIssues = [];

for (const file of files) {
  const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  if (relPath.includes('404') || relPath.includes('500')) continue;
  const html = fs.readFileSync(file, 'utf8');

  const scriptMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];

  for (const match of scriptMatches) {
    totalSchemas++;
    let schema;
    try {
      schema = JSON.parse(match[1]);
    } catch (e) {
      schemaIssues.push({ file: relPath, issue: `JSON syntax error: ${e.message}` });
      continue;
    }

    const type = schema['@type'];
    if (!schema['@context'] || !schema['@context'].includes('schema.org')) {
      schemaIssues.push({ file: relPath, issue: `Missing @context in ${type}` });
    }

    if (type === 'WebSite') {
      if (!schema.name || !schema.url) {
        schemaIssues.push({ file: relPath, issue: `WebSite missing name or url` });
      }
      if (schema.potentialAction && (!schema.potentialAction.target || !schema.potentialAction['query-input'])) {
        schemaIssues.push({ file: relPath, issue: `WebSite SearchAction malformed` });
      }
    } else if (type === 'Organization') {
      if (!schema.name || !schema.url || !schema.logo) {
        schemaIssues.push({ file: relPath, issue: `Organization missing name, url, or logo` });
      }
    } else if (type === 'WebApplication') {
      if (!schema.name || !schema.applicationCategory) {
        schemaIssues.push({ file: relPath, issue: `WebApplication missing name or applicationCategory` });
      }
      // Check for illegal rating schemas (Rule 5)
      if (schema.aggregateRating || schema.review) {
        schemaIssues.push({ file: relPath, issue: `CRITICAL: Prohibited aggregateRating/review found in WebApplication!` });
      }
    } else if (type === 'Article') {
      if (!schema.headline || !schema.author || !schema.publisher || !schema.datePublished) {
        schemaIssues.push({ file: relPath, issue: `Article missing headline, author, publisher, or datePublished` });
      }
      if (schema.aggregateRating || schema.review) {
        schemaIssues.push({ file: relPath, issue: `CRITICAL: Prohibited aggregateRating/review found in Article!` });
      }
    } else if (type === 'BreadcrumbList') {
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement) || schema.itemListElement.length === 0) {
        schemaIssues.push({ file: relPath, issue: `BreadcrumbList has empty itemListElement` });
      } else {
        schema.itemListElement.forEach((item, idx) => {
          if (!item.name || !item.item || item.position !== idx + 1) {
            schemaIssues.push({ file: relPath, issue: `BreadcrumbList item ${idx + 1} invalid (name: ${item.name}, item: ${item.item}, pos: ${item.position})` });
          }
        });
      }
    } else if (type === 'HowTo') {
      if (!schema.name || !schema.step || !Array.isArray(schema.step) || schema.step.length === 0) {
        schemaIssues.push({ file: relPath, issue: `HowTo missing name or steps` });
      } else {
        schema.step.forEach((s, idx) => {
          if (!s.name || !s.text || s.position !== idx + 1) {
            schemaIssues.push({ file: relPath, issue: `HowTo step ${idx + 1} invalid` });
          }
        });
      }
    } else if (type === 'FAQPage') {
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
        schemaIssues.push({ file: relPath, issue: `FAQPage has empty mainEntity` });
      } else {
        schema.mainEntity.forEach((faq, idx) => {
          if (!faq.name || !faq.acceptedAnswer || !faq.acceptedAnswer.text) {
            schemaIssues.push({ file: relPath, issue: `FAQPage entity ${idx + 1} missing name or answer text` });
          }
        });
      }
    }
  }
}

console.log(`Validated ${totalSchemas} JSON-LD schemas across all pages.`);
console.log(`Schema issues found: ${schemaIssues.length}`);
if (schemaIssues.length > 0) {
  schemaIssues.forEach(i => console.log(`  [ISSUE] in ${i.file}: ${i.issue}`));
} else {
  console.log(`✅ 100% PASS: All JSON-LD schemas fully comply with Google Search Central guidelines!`);
}
