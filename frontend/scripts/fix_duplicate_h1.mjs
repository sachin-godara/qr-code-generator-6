import fs from 'fs';
import path from 'path';

const blogBaseDir = path.resolve('src/content/blog');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Match frontmatter and body
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (fmMatch) {
        const fm = fmMatch[1];
        let body = fmMatch[2].trimStart();
        
        // If body starts with # Title, remove that line
        if (body.startsWith('# ')) {
          const lines = body.split('\n');
          const firstLine = lines[0];
          console.log(`[REMOVING DUPLICATE H1] in ${path.relative(blogBaseDir, fullPath)}: "${firstLine.trim()}"`);
          lines.shift(); // remove first line
          // Also remove leading empty lines
          while (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
          }
          const newContent = `---\n${fm}\n---\n\n${lines.join('\n')}\n`;
          fs.writeFileSync(fullPath, newContent, 'utf8');
        }
      }
    }
  }
}

processDir(blogBaseDir);
console.log('✅ Duplicate H1 removal complete.');
