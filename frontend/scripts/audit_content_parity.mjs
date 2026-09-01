import fs from 'fs';
import path from 'path';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   GENERATECUSTOMQR — 100% TRANSLATION PARITY AUDITOR          ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const locales = ['es', 'pt', 'de', 'tr'];
const blogDir = path.resolve('src/content/blog');
const enFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let blogDiscrepancies = [];

console.log(`🔍 Auditing ${enFiles.length} English blog posts against 4 localized versions (ES, PT, DE, TR)...`);

function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = fmMatch ? content.slice(fmMatch[0].length).trim() : content.trim();
  
  let faqs = [];
  let howToSteps = [];
  if (fmMatch) {
    const fm = fmMatch[1];
    // count faqs
    const faqMatches = fm.match(/q:\s*["']/g);
    if (faqMatches) faqs = faqMatches;
    // count howToSteps
    const howToMatches = fm.match(/name:\s*["']/g);
    if (howToMatches) howToSteps = howToMatches;
  }

  // Count headings
  const h2Count = (body.match(/^##\s+/gm) || []).length;
  const h3Count = (body.match(/^###\s+/gm) || []).length;
  const tableCount = (body.match(/\|[\s\S]*?\|[\s\S]*?\r?\n\|[-:\s|]+\|/g) || []).length;
  const flowGridCount = (body.match(/class="blog-flow-grid"/g) || []).length;
  const wordCount = body.split(/\s+/).filter(Boolean).length;

  return {
    raw: content,
    body,
    wordCount,
    faqsCount: faqs.length,
    howToCount: howToSteps.length,
    h2Count,
    h3Count,
    tableCount,
    flowGridCount
  };
}

for (const file of enFiles) {
  const enPath = path.join(blogDir, file);
  const enData = parseMarkdown(enPath);

  for (const loc of locales) {
    const locPath = path.join(blogDir, loc, file);
    if (!fs.existsSync(locPath)) {
      blogDiscrepancies.push({
        file,
        locale: loc,
        type: 'MISSING_FILE',
        detail: `File does not exist at ${locPath}`
      });
      continue;
    }

    const locData = parseMarkdown(locPath);

    // 1. Check FAQ count parity
    if (enData.faqsCount > 0 && locData.faqsCount < enData.faqsCount) {
      blogDiscrepancies.push({
        file,
        locale: loc,
        type: 'FAQ_DEFICIT',
        detail: `EN has ${enData.faqsCount} FAQs, but ${loc} has only ${locData.faqsCount} FAQs`
      });
    }

    // 2. Check HowTo step count parity
    if (enData.howToCount > 0 && locData.howToCount < enData.howToCount) {
      blogDiscrepancies.push({
        file,
        locale: loc,
        type: 'HOWTO_DEFICIT',
        detail: `EN has ${enData.howToCount} HowTo steps, but ${loc} has only ${locData.howToCount} steps`
      });
    }

    // 3. Check Heading 2 parity
    if (enData.h2Count > 0 && locData.h2Count < enData.h2Count) {
      blogDiscrepancies.push({
        file,
        locale: loc,
        type: 'H2_DEFICIT',
        detail: `EN has ${enData.h2Count} H2 headings, but ${loc} has only ${locData.h2Count} H2 headings`
      });
    }

    // 4. Check Word count ratio (warn if translation body is under 60% of English)
    const ratio = locData.wordCount / enData.wordCount;
    if (ratio < 0.60) {
      blogDiscrepancies.push({
        file,
        locale: loc,
        type: 'CONTENT_TRUNCATION',
        detail: `EN has ${enData.wordCount} words, but ${loc} has only ${locData.wordCount} words (${Math.round(ratio * 100)}% of EN)`
      });
    }

    // 5. Check Table parity
    if (enData.tableCount > 0 && locData.tableCount < enData.tableCount) {
      blogDiscrepancies.push({
        file,
        locale: loc,
        type: 'TABLE_DEFICIT',
        detail: `EN has ${enData.tableCount} tables, but ${loc} has only ${locData.tableCount} tables`
      });
    }
  }
}

// 6. Audit SEO Dictionaries
console.log('\n🔍 Auditing SEO Dictionaries (src/i18n/seo/)...');
const seoDir = path.resolve('src/i18n/seo');
const enSeo = JSON.parse(fs.readFileSync(path.join(seoDir, 'en.json'), 'utf8'));

let seoDiscrepancies = [];

for (const loc of locales) {
  const locSeo = JSON.parse(fs.readFileSync(path.join(seoDir, `${loc}.json`), 'utf8'));
  
  for (const [pageKey, pageData] of Object.entries(enSeo)) {
    if (!locSeo[pageKey]) {
      seoDiscrepancies.push({
        locale: loc,
        pageKey,
        type: 'MISSING_PAGE_SEO',
        detail: `Page key "${pageKey}" is missing in ${loc}.json`
      });
      continue;
    }

    const locPageData = locSeo[pageKey];

    // Check faqs count in SEO schema
    if (pageData.faqs && Array.isArray(pageData.faqs)) {
      if (!locPageData.faqs || locPageData.faqs.length < pageData.faqs.length) {
        seoDiscrepancies.push({
          locale: loc,
          pageKey,
          type: 'SEO_FAQS_DEFICIT',
          detail: `EN has ${pageData.faqs.length} schema FAQs, but ${loc} has ${locPageData.faqs ? locPageData.faqs.length : 0}`
        });
      }
    }

    // Check howTo steps count in SEO schema
    if (pageData.howTo && Array.isArray(pageData.howTo)) {
      if (!locPageData.howTo || locPageData.howTo.length < pageData.howTo.length) {
        seoDiscrepancies.push({
          locale: loc,
          pageKey,
          type: 'SEO_HOWTO_DEFICIT',
          detail: `EN has ${pageData.howTo.length} schema HowTo steps, but ${loc} has ${locPageData.howTo ? locPageData.howTo.length : 0}`
        });
      }
    }
  }
}

console.log('\n===============================================================');
console.log(`📊 CONTENT PARITY AUDIT RESULTS`);
console.log('===============================================================');
console.log(`Total Blog Discrepancies Found: ${blogDiscrepancies.length}`);
console.log(`Total SEO Schema Discrepancies Found: ${seoDiscrepancies.length}`);

if (blogDiscrepancies.length > 0) {
  console.log('\n📋 BLOG DISCREPANCIES BREAKDOWN BY LOCALE:');
  for (const loc of locales) {
    const locIssues = blogDiscrepancies.filter(d => d.locale === loc);
    console.log(`\n================== [${loc.toUpperCase()}] (${locIssues.length} issues) ==================`);
    locIssues.forEach(iss => {
      console.log(`  • [${iss.type}] ${iss.file}: ${iss.detail}`);
    });
  }
}

if (seoDiscrepancies.length > 0) {
  console.log('\n📋 SEO DISCREPANCIES:');
  seoDiscrepancies.forEach(iss => {
    console.log(`  • [${iss.locale}] [${iss.pageKey}]: ${iss.detail}`);
  });
}

if (blogDiscrepancies.length === 0 && seoDiscrepancies.length === 0) {
  console.log('\n✅ 100% PARITY CONFIRMED ACROSS ALL LANGUAGES!');
}
