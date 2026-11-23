import fs from 'fs';
import path from 'path';

const dir = 'frontend/src/page-templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

console.log('Inspecting page-templates:');
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  // Match title: "..." in pageData or BaseLayout
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('title:') && (trimmed.includes('"') || trimmed.includes("'"))) {
      const match = trimmed.match(/title:\s*["']([^"']+)["']/);
      if (match) {
        const title = match[1];
        if (title.length > 55) {
          console.log(`[${title.length} chars] ${f}:${idx + 1} -> "${title}"`);
        }
      }
    }
  });
});
