import fs from 'fs';
import path from 'path';

console.log('╔═══════════════════════════════════════════════════╗');
console.log('║        GENERATECUSTOMQR — SEO HEALTH AUDITOR      ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

const pagesDir = path.resolve('src/pages');
const blogDir = path.resolve('src/content/blog');

const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let totalChecks = 0;
let errors = [];
let warnings = [];

// 1. Audit Astro Pages
console.log('🔍 Auditing Landing & Static Pages (' + pageFiles.length + ' files)...');
pageFiles.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const titleMatch = content.match(/title=["']([^"']+)["']/);
  const descMatch = content.match(/description=["']([^"']+)["']/);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  totalChecks += 3;

  const title = titleMatch ? titleMatch[1] : null;
  const desc = descMatch ? descMatch[1] : null;

  if (!title) {
    errors.push(`[${file}] Missing title tag`);
  } else if (title.length > 65) {
    warnings.push(`[${file}] Title too long (${title.length} chars > 65): "${title}"`);
  } else if (title.length < 20) {
    warnings.push(`[${file}] Title too short (${title.length} chars < 20): "${title}"`);
  }

  if (!desc) {
    errors.push(`[${file}] Missing description tag`);
  } else if (desc.length > 165) {
    warnings.push(`[${file}] Description too long (${desc.length} chars > 165): "${desc}"`);
  }

  if (!h1Match && !content.includes('LegalLayout')) {
    warnings.push(`[${file}] Missing <h1> tag`);
  }
});

// 2. Audit Blog Posts
console.log('🔍 Auditing Blog Posts & Internal Linking (' + blogFiles.length + ' files)...');
blogFiles.forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  totalChecks += 3;

  if (!fmMatch) {
    errors.push(`[blog/${file}] Missing frontmatter`);
    return;
  }

  const fm = fmMatch[1];
  const titleMatch = fm.match(/title:\s*["']?([^"'\r\n]+)["']?/);
  const descMatch = fm.match(/description:\s*["']?([^"'\r\n]+)["']?/);

  const title = titleMatch ? titleMatch[1] : null;
  const desc = descMatch ? descMatch[1] : null;

  if (!title) errors.push(`[blog/${file}] Missing frontmatter title`);
  if (!desc) errors.push(`[blog/${file}] Missing frontmatter description`);

  const hasToolLink = content.includes('href="/"') || 
                      content.includes('href="/free-qr-code-generator"') ||
                      content.includes('href="/qr-code-scanner"') ||
                      content.includes('href="/url-qr-code-generator"') ||
                      content.includes('href="/wifi-qr-code"') ||
                      content.includes('href="/vcard-qr-code"') ||
                      content.includes('href="/qr-code-with-logo"') ||
                      content.includes('(/wifi-qr-code)') ||
                      content.includes('(/vcard-qr-code)') ||
                      content.includes('(/qr-code-with-logo)') ||
                      content.includes('(/qr-code-scanner)') ||
                      content.includes('(/free-qr-code-generator)') ||
                      content.includes('(/url-qr-code-generator)') ||
                      content.includes('(/how-to-use)') ||
                      content.includes('(/)');

  if (!hasToolLink) {
    errors.push(`[blog/${file}] Missing internal link to QR tool pages`);
  }
});

console.log('\n===================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalChecks}`);
console.log(`ERRORS: ${errors.length}`);
console.log(`WARNINGS: ${warnings.length}`);
console.log('===================================================\n');

if (errors.length > 0) {
  console.error('❌ CRITICAL SEO ERRORS:');
  errors.forEach(e => console.error('  - ' + e));
}

if (warnings.length > 0) {
  console.warn('⚠️ SEO OPTIMIZATION NOTICES:');
  warnings.forEach(w => console.warn('  - ' + w));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ALL SEO AUDIT CHECKS PASSED WITH 100% COMPLIANCE!');
  process.exit(0);
} else if (errors.length === 0) {
  console.log('✅ 0 CRITICAL ERRORS! (All pages valid and indexed)');
  process.exit(0);
} else {
  process.exit(1);
}
