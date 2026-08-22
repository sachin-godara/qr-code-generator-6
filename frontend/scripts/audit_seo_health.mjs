import fs from 'fs';

const report = JSON.parse(fs.readFileSync('../seo_audit_report.json', 'utf8'));

console.log('========================================');
console.log('📊 SEO TITLE & DESCRIPTION LENGTH AUDIT');
console.log('========================================\n');

let titleIssues = 0;
let descIssues = 0;

report.pages.forEach(p => {
  const isTitleLong = p.titleLength > 65;
  const isTitleShort = p.titleLength < 30;
  const isDescLong = p.descLength > 165;
  const isDescShort = p.descLength < 100;

  if (isTitleLong || isTitleShort) {
    titleIssues++;
    console.log(`⚠️ TITLE [${p.titleLength} ch] ${p.url}: "${p.title}"`);
  }
  if (isDescLong || isDescShort) {
    descIssues++;
    console.log(`⚠️ DESC [${p.descLength} ch] ${p.url}: "${p.description}"`);
  }
});

console.log(`\nTitle warnings: ${titleIssues}`);
console.log(`Description warnings: ${descIssues}`);

console.log('\n========================================');
console.log('🔗 INTERNAL LINKING & TOPIC SILO AUDIT');
console.log('========================================\n');

const blogDir = 'src/content/blog';
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let articlesWithoutToolLinks = [];

blogFiles.forEach(file => {
  const content = fs.readFileSync(`${blogDir}/${file}`, 'utf8');
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
                      content.includes('(/)');
                      
  if (!hasToolLink) {
    articlesWithoutToolLinks.push(file);
  }
});

console.log(`Blog articles without direct contextual links to tool pages: ${articlesWithoutToolLinks.length}`);
articlesWithoutToolLinks.forEach(f => console.log(`- ${f}`));
