// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
      lastmod: new Date('2026-10-25T00:00:00.000Z'),
      filter: (page) => 
        !page.includes('/404') && 
        !page.includes('/500') &&
        !page.includes('/free-qr-code-generator') &&
        !page.includes('/url-qr-code-generator'),
      serialize: (item) => {
        const url = item.url.replace(/\/$/, '');
        // Boost homepages (all 5 languages)
        if (
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
          item.url.includes('/qr-code-scanner') ||
          item.url.includes('/wifi-qr-code') ||
          item.url.includes('/vcard-qr-code') ||
          item.url.includes('/qr-code-with-logo') ||
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
        // Blog post articles
        else if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          item.priority = 0.7;
          item.changefreq = /** @type {any} */ ('monthly');
        }
        // Informational pages
        else if (item.url.includes('/about') || item.url.includes('/contact')) {
          item.priority = 0.5;
          item.changefreq = /** @type {any} */ ('monthly');
        }
        // Legal / utility pages
        else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = /** @type {any} */ ('yearly');
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
