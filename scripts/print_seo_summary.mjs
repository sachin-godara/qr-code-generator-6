import fs from 'fs';

const report = JSON.parse(fs.readFileSync('seo_audit_report.json', 'utf8'));
console.log('Total Pages Audited:', report.totalPages);
console.log('Total Unique Keywords Tracked in Meta:', report.totalUniqueKeywords);

console.log('\n--- PAGES BREAKDOWN ---');
report.pages.forEach(p => {
  console.log(`\nURL: ${p.url} (${p.type})`);
  console.log(`  Title [${p.titleLength} chars]: ${p.title}`);
  console.log(`  Description [${p.descLength} chars]: ${p.description}`);
  console.log(`  Keywords Count [${p.keywordsCount}]: ${p.keywords.join(', ')}`);
  console.log(`  H1: ${p.h1}`);
  console.log(`  H2 Count: ${p.h2Count}`);
  console.log(`  Schemas: FAQ=${p.hasFaqSchema}, HowTo=${p.hasHowToSchema}, Breadcrumbs=${p.hasBreadcrumbSchema}`);
});

console.log('\n--- KEYWORDS BY FREQUENCY ---');
report.keywords.forEach(k => {
  console.log(`- "${k.keyword}" (${k.count} page${k.count > 1 ? 's' : ''}): ${k.pages.map(x => x.url).join(', ')}`);
});
