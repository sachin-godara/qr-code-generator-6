import fs from 'fs';

const html = fs.readFileSync('dist/index.html', 'utf8');
const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);

console.log(`Total hrefs found in dist/index.html: ${hrefMatches.length}`);
const uniqueHrefs = [...new Set(hrefMatches)];

console.log('\nAll unique hrefs:');
uniqueHrefs.forEach(h => {
  const isAmp = h.includes('&') || h.endsWith('&');
  console.log(` - ${h} ${isAmp ? '⚠️ HAS AMPERSAND' : ''}`);
});

const allTokens = html.match(/https?:\/\/[^\s"'<>]+/g) || [];
console.log(`\nTotal URLs in index.html: ${allTokens.length}`);
allTokens.forEach(u => {
  if (u.includes('&') || u.endsWith('&')) {
    console.log(` ⚠️ URL with ampersand: ${u}`);
  }
});
