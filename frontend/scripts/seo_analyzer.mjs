import fs from 'fs';
import path from 'path';

const pagesDir = path.resolve('src/pages');
const blogDir = path.resolve('src/content/blog');

const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

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

// 1. Scan Pages
pageFiles.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  
  const titleMatch = content.match(/title=["']([^"']+)["']/);
  const descMatch = content.match(/description=["']([^"']+)["']/);
  const kwMatch = content.match(/keywords=["']([^"']+)["']/);
  const ogImgMatch = content.match(/ogImage=["']([^"']+)["']/);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2Matches = [...content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const faqMatches = content.includes('faqs={faqs}');
  const howToMatches = content.includes('howTo={howTo}');
  const breadcrumbsMatches = content.includes('breadcrumbs={breadcrumbs}');
  
  const title = titleMatch ? titleMatch[1] : 'N/A';
  const description = descMatch ? descMatch[1] : 'N/A';
  const keywords = kwMatch ? kwMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A';
  const ogImage = ogImgMatch ? ogImgMatch[1] : '/og-image.png';

  const slug = file.replace('.astro', '');
  const url = slug === 'index' ? '/' : `/${slug}`;

  keywords.forEach(kw => addKeyword(kw, url, title));

  pages.push({
    file,
    url,
    type: 'Landing Page / Tool',
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
    hasFaqSchema: faqMatches,
    hasHowToSchema: howToMatches,
    hasBreadcrumbSchema: breadcrumbsMatches
  });
});

// 2. Scan Blog Posts
blogFiles.forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return;
  
  const fm = fmMatch[1];
  const title = (fm.match(/title:\s*["']?([^"'\r\n]+)["']?/) || [])[1] || 'N/A';
  const description = (fm.match(/description:\s*["']?([^"'\r\n]+)["']?/) || [])[1] || 'N/A';
  const rawKeywords = (fm.match(/keywords:\s*["']?([^"'\r\n]+)["']?/) || [])[1] || '';
  const category = (fm.match(/category:\s*["']?([^"'\r\n]+)["']?/) || [])[1] || 'general';
  const pubDate = (fm.match(/pubDate:\s*([^\r\n]+)/) || [])[1] || '';
  const readingTime = (fm.match(/readingTime:\s*([^\r\n]+)/) || [])[1] || '';
  const featured = fm.includes('featured: true');

  const keywords = rawKeywords.split(',').map(s => s.trim()).filter(Boolean);
  const slug = file.replace('.md', '');
  const url = `/blog/${slug}`;

  keywords.forEach(kw => addKeyword(kw, url, title));

  // Extract H2s from markdown
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  const h2Matches = [...body.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim());

  pages.push({
    file: `blog/${file}`,
    url,
    type: `Blog (${category})`,
    title,
    titleLength: title.length,
    description,
    descLength: description.length,
    keywords,
    keywordsCount: keywords.length,
    h1: title,
    h2Count: h2Matches.length,
    h2s: h2Matches,
    ogImage: '/og-image.png',
    hasFaqSchema: false,
    hasHowToSchema: false,
    hasBreadcrumbSchema: true,
    category,
    pubDate,
    readingTime,
    featured
  });
});

const output = {
  totalPages: pages.length,
  totalUniqueKeywords: allKeywords.size,
  pages,
  keywords: Array.from(allKeywords.values()).sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
};

fs.writeFileSync('../seo_audit_report.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Successfully written UTF-8 seo_audit_report.json with', pages.length, 'pages and', allKeywords.size, 'unique keywords.');
