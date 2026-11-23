import fs from 'fs';
import path from 'path';

const blogBaseDir = path.resolve('src/content/blog');
const locales = [
  { code: 'en', dir: blogBaseDir },
  { code: 'es', dir: path.join(blogBaseDir, 'es') },
  { code: 'pt', dir: path.join(blogBaseDir, 'pt') },
  { code: 'de', dir: path.join(blogBaseDir, 'de') },
  { code: 'tr', dir: path.join(blogBaseDir, 'tr') },
];

const enFiles = fs.readdirSync(blogBaseDir).filter(f => f.endsWith('.md'));
console.log(`Auditing ${enFiles.length} blog posts across 5 locales (100 total articles)...`);

const articles = [];
let asciiViolations = [];
let thinArticles = [];
let internalLinkStats = { totalLinks: 0, articlesWithoutLinks: [] };

for (const file of enFiles) {
  const slug = file.replace(/\.md$/, '');
  const entry = { slug, locales: {} };

  for (const loc of locales) {
    const filePath = path.join(loc.dir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing localized article: [${loc.code}] ${file}`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const words = content.replace(/---[\s\S]*?---/, '').replace(/<[^>]+>/g, ' ').replace(/[#*`_\[\]()]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const h2Count = (content.match(/^##\s+/gm) || []).length;
    const h3Count = (content.match(/^###\s+/gm) || []).length;
    const tablesCount = (content.match(/\|[\s-]+\|/g) || []).length;
    const internalLinks = (content.match(/\]\(\/[^)]+\)/g) || []).length;

    // Check Rule 8: ASCII diagrams
    if (/(\+[-+]+\+|┌[─┬]+┐|\|[\s]+[A-Za-z0-9]+[\s]+\|)/.test(content) && !/\|[\s]*[-]+[\s]*\|/.test(content)) {
      // Check if it's a code block with ascii art
      const codeBlocks = [...content.matchAll(/```[\s\S]*?```/g)];
      for (const cb of codeBlocks) {
        if (/[┌┐└┘├┤─│]|\+[-+]+\+/.test(cb[0])) {
          asciiViolations.push({ slug, locale: loc.code, issue: 'ASCII art in code block' });
        }
      }
    }

    if (words < 800) {
      thinArticles.push({ slug, locale: loc.code, words });
    }

    if (internalLinks === 0) {
      internalLinkStats.articlesWithoutLinks.push({ slug, locale: loc.code });
    }
    internalLinkStats.totalLinks += internalLinks;

    entry.locales[loc.code] = {
      words,
      h2Count,
      h3Count,
      tablesCount,
      internalLinks
    };
  }
  articles.push(entry);
}

console.log('\n--- BLOG AUDIT SUMMARY ---');
console.log(`Total Articles Verified: ${articles.length * 5} (20 per locale x 5)`);
console.log(`Rule 8 (ASCII Diagram) Violations: ${asciiViolations.length}`);
console.log(`Articles under 800 words: ${thinArticles.length}`);
console.log(`Total In-Content Internal Links: ${internalLinkStats.totalLinks}`);
console.log(`Articles without Internal Links: ${internalLinkStats.articlesWithoutLinks.length}`);
if (internalLinkStats.articlesWithoutLinks.length > 0) {
  console.log('Articles without internal links:', internalLinkStats.articlesWithoutLinks);
}

// Calculate averages
const avgWordsByLocale = {};
for (const loc of locales) {
  const total = articles.reduce((sum, a) => sum + (a.locales[loc.code]?.words || 0), 0);
  avgWordsByLocale[loc.code] = Math.round(total / articles.length);
}
console.log('Average Word Counts by Locale:', avgWordsByLocale);

// Sample articles breakdown
console.log('\nSample Articles (Top 3):');
for (const a of articles.slice(0, 3)) {
  console.log(`- ${a.slug}:`);
  for (const loc of locales) {
    console.log(`   [${loc.code.toUpperCase()}] Words: ${a.locales[loc.code]?.words}, H2s: ${a.locales[loc.code]?.h2Count}, Links: ${a.locales[loc.code]?.internalLinks}`);
  }
}
