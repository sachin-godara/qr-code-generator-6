import fs from 'fs';
import path from 'path';

const distDir = path.resolve('frontend/dist');
const files = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) files.push(p);
  }
}
walk(distDir);

const broken = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relFile = path.relative(distDir, file).replace(/\\/g, '/');
  
  const matches = content.matchAll(/href=["']([^"'#?]+)/g);
  for (const m of matches) {
    let target = m[1];
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:')) {
      if (target.startsWith('https://generatecustomqr.com')) {
        target = target.replace('https://generatecustomqr.com', '') || '/';
      } else {
        continue;
      }
    }
    if (!target.startsWith('/')) continue;
    
    // Check if target exists in dist
    let checkPath1 = path.join(distDir, target, 'index.html');
    let checkPath2 = path.join(distDir, target);
    let checkPath3 = path.join(distDir, target + '.html');
    if (!fs.existsSync(checkPath1) && !fs.existsSync(checkPath2) && !fs.existsSync(checkPath3)) {
      broken.push({ from: relFile, to: target });
    }
  }
}

console.log('Total broken links found:', broken.length);
broken.forEach(b => console.log(`${b.from} -> ${b.to}`));
