# 📄 06 - Astro SSG Routes, SEO Engine & Content Collections

> **Comprehensive reference for Astro 5 static site generation, multi-region route topologies across 4 languages, automated JSON-LD schema generation (`SEOHead.astro`), Zod-validated Markdown content collections, and multi-file CSS architecture.**

---

## 🗺️ 1. Multi-Region Static Route Topology (60+ Pre-Rendered Pages)

Astro 5 builds all public-facing pages at compile time into static HTML/CSS across **English (en)**, **Spanish (es)**, **German (de)**, and **Portuguese (pt)**:

| English (Root `/`) | Spanish (`/es/`) | German (`/de/`) | Portuguese (`/pt/`) | Underlying Template |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `/es` | `/de` | `/pt` | `HomePage.astro` |
| `/free-qr-code-generator` | `/es/free-qr-code-generator` | `/de/free-qr-code-generator` | `/pt/free-qr-code-generator` | `FreeGenPage.astro` |
| `/url-qr-code-generator` | `/es/url-qr-code-generator` | `/de/url-qr-code-generator` | `/pt/url-qr-code-generator` | `UrlQrPage.astro` |
| `/wifi-qr-code` | `/es/wifi-qr-code` | `/de/wifi-qr-code` | `/pt/wifi-qr-code` | `WifiQrPage.astro` |
| `/vcard-qr-code` | `/es/vcard-qr-code` | `/de/vcard-qr-code` | `/pt/vcard-qr-code` | `VCardQrPage.astro` |
| `/email-qr-code` | `/es/email-qr-code` | `/de/email-qr-code` | `/pt/email-qr-code` | `EmailQrPage.astro` |
| `/event-qr-code` | `/es/event-qr-code` | `/de/event-qr-code` | `/pt/event-qr-code` | `EventQrPage.astro` |
| `/qr-code-with-logo` | `/es/qr-code-with-logo` | `/de/qr-code-with-logo` | `/pt/qr-code-with-logo` | `LogoQrPage.astro` |
| `/qr-code-scanner` | `/es/qr-code-scanner` | `/de/qr-code-scanner` | `/pt/qr-code-scanner` | `ScannerPage.astro` |
| `/how-to-use` | `/es/how-to-use` | `/de/how-to-use` | `/pt/how-to-use` | `HowToUsePage.astro` |
| `/about` | `/es/about` | `/de/about` | `/pt/about` | `AboutPage.astro` |
| `/contact` | `/es/contact` | `/de/contact` | `/pt/contact` | `ContactPage.astro` |
| `/privacy-policy` | `/es/privacy-policy` | `/de/privacy-policy` | `/pt/privacy-policy` | `PrivacyPage.astro` |
| `/terms` | `/es/terms` | `/de/terms` | `/pt/terms` | `TermsPage.astro` |
| `/blog` | `/es/blog` | `/de/blog` | `/pt/blog` | `BlogIndexPage.astro` |
| `/blog/[...slug]` | `/es/blog/[...slug]` | `/de/blog/[...slug]` | `/pt/blog/[...slug]` | `BlogPostPage.astro` |
| `/404` & `/500` | `/es/404` / `/es/500` | `/de/404` / `/de/500` | `/pt/404` / `/pt/500` | Dedicated error pages |

---

## 🔍 2. Automated SEO Engine (`SEOHead.astro`)

`frontend/src/components/SEOHead.astro` injects search engine metadata, multi-region hreflangs, and structured microdata schemas into every page:

### 1. Canonical URLs & Hreflang Tags:
- Canonical URL normalization (ensures no trailing slash duplication).
- Bidirectional `hreflang` tags across all 4 locales plus `x-default`.
- OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`).
- Twitter `summary_large_image` cards.

### 2. Structured JSON-LD Schemas:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "QR Code Maker 6",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250"
      }
    },
    {
      "@type": "WebSite",
      "name": "QR Code Maker 6",
      "url": "https://generatecustomqr.com"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [...]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [...]
    }
  ]
}
</script>
```

---

## 📚 3. Markdown Content Collections (`content.config.ts`)

Articles in `frontend/src/content/blog/` are validated at build-time using **Astro Content Collections** and **Zod**:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    author: z.string().default("QR Studio Team"),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false)
  })
});

export const collections = { blog };
```

---

## 🎨 4. Multi-File Styling Architecture

The frontend styling is modularized across four targeted stylesheets in `frontend/src/styles/`:

| Stylesheet | Responsibility |
| :--- | :--- |
| `global.css` | Tailwind directives, dark mode color tokens, glassmorphism cards, ambient background radial gradients, and custom scrollbars. |
| `blog.css` | Markdown typography styles, syntax highlighting, callout alert cards, and table layouts. |
| `how-to-use.css` | Numbered visual step indicators, feature comparison grids, and interactive mockup wrappers. |
| `legal.css` | Clean, high-legibility legal terms typography and navigation headers. |
