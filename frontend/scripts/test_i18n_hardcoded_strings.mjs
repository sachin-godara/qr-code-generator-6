import fs from 'node:fs';

const scannerPage = fs.readFileSync('frontend/src/page-templates/ScannerPage.astro', 'utf-8');
const termsPage = fs.readFileSync('frontend/src/page-templates/TermsPage.astro', 'utf-8');
const privacyPage = fs.readFileSync('frontend/src/page-templates/PrivacyPage.astro', 'utf-8');

let failed = false;

if (scannerPage.includes('>Built-in Camera<') || scannerPage.includes('Built-in Camera\n')) {
  console.error('FAIL: ScannerPage.astro contains hardcoded "Built-in Camera"');
  failed = true;
}

if (termsPage.includes('Pre-Press Verification Requirement:</strong> Always test-scan')) {
  console.error('FAIL: TermsPage.astro contains hardcoded English pre-press callout');
  failed = true;
}

if (privacyPage.includes('>Privacy Policy</a>')) {
  console.error('FAIL: PrivacyPage.astro contains hardcoded "Privacy Policy" link text');
  failed = true;
}

if (failed) {
  process.exit(1);
} else {
  console.log('PASS: All template strings properly localized.');
  process.exit(0);
}
