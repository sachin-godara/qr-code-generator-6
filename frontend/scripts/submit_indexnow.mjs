import fs from 'node:fs';
import path from 'node:path';

const INDEXNOW_KEY = 'a67e891c3d4f2b5a7e891c3d4f2b5a7e';
const HOST = 'generatecustomqr.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const DIST_DIR = fs.existsSync(path.resolve('frontend/dist')) ? path.resolve('frontend/dist') : path.resolve('dist');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   GENERATECUSTOMQR — FAST INDEXING PIPELINE (INDEXNOW)        ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// 1. Gather all canonical production URLs
function getAllHtmlFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== '_astro') getAllHtmlFiles(full, list);
    } else if (item.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
if (htmlFiles.length === 0) {
  console.error('❌ dist/ not found or empty. Please run "npm run build" first.');
  process.exit(1);
}

const urlList = [];
for (const file of htmlFiles) {
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  if (rel.includes('404') || rel.includes('500')) continue;
  let route = '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (route === '/index/') route = '/';
  urlList.push(`https://${HOST}${route}`);
}

console.log(`📦 Discovered ${urlList.length} canonical URLs across 5 languages to submit.`);

// 2. Prepare IndexNow payload
const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList,
};

// 3. Endpoints to notify (IndexNow central API + Bing)
const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

async function submitToIndexNow() {
  for (const endpoint of endpoints) {
    try {
      console.log(`🚀 Submitting ${urlList.length} URLs to: ${endpoint} ...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 202) {
        console.log(`✅ Success (${response.status} ${response.statusText}): URLs accepted for high-priority indexing!`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ Endpoint returned status ${response.status}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Network error submitting to ${endpoint}: ${err.message}`);
    }
  }
  console.log('\n🎯 IndexNow submission complete.');
}

submitToIndexNow();
