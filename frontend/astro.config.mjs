// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // This affects sitemap generation, canonical URLs, and OG meta tags
  site: 'https://generatecustomqr.com',
  
  devToolbar: {
    enabled: false,
  },
  
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404') && !page.includes('/500'),
      serialize: (item) => {
        // Boost homepage
        if (item.url === 'https://generatecustomqr.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // High-traffic landing pages
        else if (
          item.url.includes('/free-qr-code-generator') ||
          item.url.includes('/qr-code-scanner')
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Blog posts (not the index)
        else if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        // Legal / utility pages
        else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
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
