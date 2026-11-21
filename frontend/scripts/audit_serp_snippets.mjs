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
const longTitles = [];
const shortTitles = [];
const longDescs = [];
const shortDescs = [];

for (const file of files) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  if (rel.includes('404') || rel.includes('500')) continue;
  const html = fs.readFileSync(file, 'utf8');

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';

  if (title.length > 70) {
    longTitles.push({ rel, len: title.length, title });
  } else if (title.length < 30) {
    shortTitles.push({ rel, len: title.length, title });
  }

  if (desc.length > 165) {
    longDescs.push({ rel, len: desc.length, desc });
  } else if (desc.length < 100) {
    shortDescs.push({ rel, len: desc.length, desc });
  }
}

console.log(`=== SERP TITLES AUDIT ===`);
console.log(`Titles > 70 chars: ${longTitles.length}`);
longTitles.slice(0, 10).forEach(t => console.log(`  [${t.len}] ${t.rel} -> "${t.title}"`));

console.log(`Titles < 30 chars: ${shortTitles.length}`);
shortTitles.forEach(t => console.log(`  [${t.len}] ${t.rel} -> "${t.title}"`));

console.log(`\n=== SERP DESCRIPTIONS AUDIT ===`);
console.log(`Descriptions > 165 chars: ${longDescs.length}`);
longDescs.forEach(d => console.log(`  [${d.len}] ${d.rel} -> "${d.desc}"`));

console.log(`Descriptions < 100 chars: ${shortDescs.length}`);
shortDescs.forEach(d => console.log(`  [${d.len}] ${d.rel} -> "${d.desc}"`));
