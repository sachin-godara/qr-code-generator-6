import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const distDir = path.resolve('frontend/dist');
const files = findHtmlFiles(distDir);
console.log(`Auditing ${files.length} HTML files in ${distDir}`);

const longTitles = [];
const allTitles = [];

files.forEach(f => {
  const relPath = path.relative(distDir, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/<title>([^<]*)<\/title>/i);
  if (match) {
    const title = match[1].trim();
    allTitles.push({ relPath, len: title.length, title });
    if (title.length > 65) {
      longTitles.push({ relPath, len: title.length, title });
    }
  } else {
    console.warn(`No <title> found in: ${relPath}`);
  }
});

console.log(`\nFound ${longTitles.length} titles longer than 65 characters:`);
longTitles.sort((a, b) => b.len - a.len).forEach(item => {
  console.log(`[${item.len} chars] ${item.relPath} -> "${item.title}"`);
});

const over70 = longTitles.filter(t => t.len > 70);
console.log(`\nTitles strictly > 70 characters (Bing warnings): ${over70.length}`);
over70.forEach(item => {
  console.log(`[${item.len} chars] ${item.relPath} -> "${item.title}"`);
});
