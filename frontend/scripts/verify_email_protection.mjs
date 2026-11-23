import fs from 'fs';

const pp = fs.readFileSync('frontend/dist/privacy-policy/index.html', 'utf8');
console.log('privacy-policy contains <!--email_off-->:', pp.includes('<!--email_off-->'));
console.log('privacy-policy contains legal@generatecustomqr.com:', pp.includes('legal@generatecustomqr.com'));

const terms = fs.readFileSync('frontend/dist/terms/index.html', 'utf8');
console.log('terms contains <!--email_off-->:', terms.includes('<!--email_off-->'));
console.log('terms contains legal@generatecustomqr.com:', terms.includes('legal@generatecustomqr.com'));

const robots = fs.readFileSync('frontend/dist/robots.txt', 'utf8');
console.log('robots.txt contains Disallow: /cdn-cgi/:', robots.includes('Disallow: /cdn-cgi/'));

const red = fs.readFileSync('frontend/dist/_redirects', 'utf8');
console.log('_redirects contains /cdn-cgi/l/email-protection:', red.includes('/cdn-cgi/l/email-protection'));
