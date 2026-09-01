import fs from 'fs';
import path from 'path';

const trDir = path.resolve('src/content/blog/tr');
const files = fs.readdirSync(trDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(trDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix faqs indentation:
  // Replace:
  //   - q: "..."
  //   - a: "..."
  // With:
  //   - q: "..."
  //     a: "..."
  content = content.replace(/^(\s*)-\s*a:/gm, '    a:');

  // Fix howToSteps indentation:
  // Replace:
  //   - name: "..."
  //   - text: "..."
  // With:
  //   - name: "..."
  //     text: "..."
  content = content.replace(/^(\s*)-\s*text:/gm, '    text:');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed YAML in ${file}`);
});
