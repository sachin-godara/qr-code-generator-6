// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pre-compute blog post authentic lastmod dates from markdown frontmatter
const blogLastmodMap = new Map();
try {
  const blogDirs = [
    { lang: '', dir: path.join(__dirname, 'src/content/blog') },
    { lang: 'es', dir: path.join(__dirname, 'src/content/blog/es') },
    { lang: 'pt', dir: path.join(__dirname, 'src/content/blog/pt') },
    { lang: 'de', dir: path.join(__dirname, 'src/content/blog/de') },
    { lang: 'tr', dir: path.join(__dirname, 'src/content/blog/tr') },
  ];
  for (const { lang, dir } of blogDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const pubMatch = content.match(/pubDate:\s*([^\r\n]+)/);
        const upMatch = content.match(/updatedDate:\s*([^\r\n]+)/);
        const rawDate = upMatch ? upMatch[1].trim() : (pubMatch ? pubMatch[1].trim() : null);
        if (rawDate) {
          const slug = file.replace(/\.md$/, '');
          const postUrl = lang
            ? `https://generatecustomqr.com/${lang}/blog/${slug}/`
            : `https://generatecustomqr.com/blog/${slug}/`;
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            blogLastmodMap.set(postUrl, d.toISOString());
            blogLastmodMap.set(postUrl.replace(/\/$/, ''), d.toISOString());
          }
        }
      }
    }
  }
} catch (e) {
  console.warn('Could not precompute blog dates for sitemap:', e);
}

// https://astro.build/config
export default defineConfig({
  // This affects sitemap generation, canonical URLs, and OG meta tags
  site: 'https://generatecustomqr.com',

  // Directory-based Internationalization (i18n)
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'de', 'tr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  
  // Enforce consistent trailing slashes across all routes, links, and sitemaps
  trailingSlash: 'always',

  devToolbar: {
    enabled: false,
  },
  
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/500') &&
        !page.includes('/tr/qr-code-scanner') &&
        !page.includes('/de/qr-code-scanner') &&
        !page.includes('/es/qr-code-scanner') &&
        !page.includes('/pt/qr-code-scanner'),
      serialize: (item) => {
        const url = item.url.replace(/\/$/, '');
        // Blog post articles - inject authentic content lastmod
        if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          item.priority = 0.8;
          item.changefreq = /** @type {any} */ ('weekly');
          const lastmod = blogLastmodMap.get(item.url) || blogLastmodMap.get(item.url.replace(/\/$/, '')) || blogLastmodMap.get(`${item.url}/`);
          if (lastmod) {
            item.lastmod = lastmod;
          }
        }
        // Boost homepages (all 5 languages)
        else if (
          url === 'https://generatecustomqr.com' ||
          url === 'https://generatecustomqr.com/es' ||
          url === 'https://generatecustomqr.com/pt' ||
          url === 'https://generatecustomqr.com/de' ||
          url === 'https://generatecustomqr.com/tr'
        ) {
          item.priority = 1.0;
          item.changefreq = /** @type {any} */ ('daily');
        }
        // Core tools and high-traffic landing pages
        else if (
          item.url.includes('/free-qr-code-generator') ||
          item.url.includes('/qr-code-scanner') ||
          item.url.includes('/qr-kod-okuyucu') ||
          item.url.includes('/qr-code-scannen') ||
          item.url.includes('/escanear-codigo-qr') ||
          item.url.includes('/escanear-qr-code') ||
          item.url.includes('/wifi-qr-code') ||
          item.url.includes('/vcard-qr-code') ||
          item.url.includes('/qr-code-with-logo') ||
          item.url.includes('/url-qr-code-generator') ||
          item.url.includes('/email-qr-code') ||
          item.url.includes('/event-qr-code') ||
          item.url.includes('/how-to-use')
        ) {
          item.priority = 0.9;
          item.changefreq = /** @type {any} */ ('weekly');
        }
        // Blog indexes
        else if (
          url.endsWith('/blog')
        ) {
          item.priority = 0.8;
          item.changefreq = /** @type {any} */ ('weekly');
        }
        // Informational pages
        else if (item.url.includes('/about') || item.url.includes('/contact')) {
          item.priority = 0.7;
          item.changefreq = /** @type {any} */ ('monthly');
        }
        // Legal / utility pages
        else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.5;
          item.changefreq = /** @type {any} */ ('monthly');
        }
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['html5-qrcode'],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  },
});
