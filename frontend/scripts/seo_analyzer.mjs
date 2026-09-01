import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('dist/ directory not found. Run npm run build first.');
  process.exit(1);
}

function getHtmlFiles(dir, baseDir = dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_astro') {
        results = results.concat(getHtmlFiles(fullPath, baseDir));
      }
    } else if (entry.name.endsWith('.html')) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(distDir);
const pages = [];
const allKeywords = new Map();

function addKeyword(kw, pageUrl, pageTitle) {
  const clean = kw.trim().toLowerCase();
  if (!clean) return;
  if (!allKeywords.has(clean)) {
    allKeywords.set(clean, { keyword: clean, count: 0, pages: [] });
  }
  const entry = allKeywords.get(clean);
  entry.count++;
  entry.pages.push({ url: pageUrl, title: pageTitle });
}

htmlFiles.forEach(({ fullPath, relPath }) => {
  const html = fs.readFileSync(fullPath, 'utf8');

  let url = '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (url !== '/' && url.endsWith('/')) url = url.slice(0, -1);
  if (url === '') url = '/';

  // Extract Metadata
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const kwMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/i) ||
                  html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']keywords["']/i);
  const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

  const hasFaqSchema = html.includes('"@type":"FAQPage"');
  const hasHowToSchema = html.includes('"@type":"HowTo"');
  const hasBreadcrumbSchema = html.includes('"@type":"BreadcrumbList"');
  const hasWebAppSchema = html.includes('"@type":"WebApplication"');
  const hasArticleSchema = html.includes('"@type":"Article"') || html.includes('"@type":"BlogPosting"');

  const title = titleMatch ? titleMatch[1].trim() : 'N/A';
  const description = descMatch ? descMatch[1].trim() : 'N/A';
  const keywords = kwMatch ? kwMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A';
  const ogImage = ogImgMatch ? ogImgMatch[1] : '/og-image.png';

  keywords.forEach(kw => addKeyword(kw, url, title));

  let locale = 'en';
  if (url.startsWith('/de/') || url === '/de') locale = 'de';
  else if (url.startsWith('/es/') || url === '/es') locale = 'es';
  else if (url.startsWith('/pt/') || url === '/pt') locale = 'pt';

  let type = 'Tool / Landing Page';
  if (url.includes('/blog/')) type = 'Blog Article';
  else if (url.includes('privacy') || url.includes('terms') || url.includes('about') || url.includes('contact')) type = 'Legal / Info';
  else if (url === '/404' || url === '/500') type = 'System';

  pages.push({
    file: relPath,
    url,
    locale,
    type,
    title,
    titleLength: title.length,
    description,
    descLength: description.length,
    keywords,
    keywordsCount: keywords.length,
    h1,
    h2Count: h2Matches.length,
    h2s: h2Matches,
    ogImage,
    hasWebAppSchema,
    hasArticleSchema,
    hasFaqSchema,
    hasHowToSchema,
    hasBreadcrumbSchema
  });
});

const output = {
  totalPages: pages.length,
  totalUniqueKeywords: allKeywords.size,
  locales: ['en', 'es', 'pt', 'de', 'tr'],
  pages,
  keywords: Array.from(allKeywords.values()).sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
};

fs.writeFileSync('../seo_audit_report.json', JSON.stringify(output, null, 2), 'utf8');
console.log(`Successfully generated seo_audit_report.json with ${pages.length} pages and ${allKeywords.size} unique keywords across 5 languages.`);
