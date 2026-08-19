# 📄 06 - Astro SSG Routes, SEO Engine & Content Collections

> **Comprehensive reference for Astro 5 static site generation, route topologies, automated JSON-LD schema generation (`SEOHead.astro`), Zod-validated Markdown content collections, and multi-file CSS architecture.**

---

## 🗺️ 1. Static Route Topology (21+ Pre-Rendered Pages)

Astro 5 builds all public-facing pages at compile time into static HTML/CSS with zero server runtime overhead:

| Route Path | Page File | Primary Purpose & Features |
| :--- | :--- | :--- |
| `/` | `index.astro` | Main QR Studio generator application, hero section, feature matrix. |
| `/free-qr-code-generator` | `free-qr-code-generator.astro` | High-intent SEO landing page targeting general search queries. |
| `/url-qr-code-generator` | `url-qr-code-generator.astro` | Deep-linked landing page pre-configured for Web Links. |
| `/wifi-qr-code` | `wifi-qr-code.astro` | Deep-linked landing page pre-configured for WiFi network credentials. |
| `/vcard-qr-code` | `vcard-qr-code.astro` | Deep-linked landing page pre-configured for VCard 3.0 business cards. |
| `/email-qr-code` | `email-qr-code.astro` | Pre-configured Email template generator page. |
| `/event-qr-code` | `event-qr-code.astro` | Pre-configured iCalendar VEVENT generator page. |
| `/qr-code-with-logo` | `qr-code-with-logo.astro` | Dedicated landing page showcasing vector logo overlays. |
| `/qr-code-scanner` | `qr-code-scanner.astro` | WebRTC camera video stream & image file upload scanner tool. |
| `/how-to-use` | `how-to-use.astro` | Interactive step-by-step documentation and tutorials. |
| `/about` | `about.astro` | Company background, security standards, and mission statement. |
| `/contact` | `contact.astro` | Interactive contact form connected to `/api/contact`. |
| `/privacy-policy` | `privacy-policy.astro` | GDPR & CCPA privacy policy and data governance statement. |
| `/terms` | `terms.astro` | Terms of service and intellectual property agreement. |
| `/blog` | `blog/index.astro` | SEO content marketing blog index with search and tag filters. |
| `/blog/[...slug]` | `blog/[...slug].astro` | Dynamic Markdown article route rendered via Content Collections. |
| `/404` & `/500` | `404.astro` / `500.astro` | Custom branded error recovery pages. |

---

## 🔍 2. Automated SEO Engine (`SEOHead.astro`)

`frontend/src/components/SEOHead.astro` injects search engine metadata and structured microdata schemas into every page:

### 1. Canonical URLs & Social Meta Tags:
- Automated canonical URL normalization.
- High-resolution OpenGraph cards (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
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
      "url": "https://qrcodemaker.com"
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

### Dynamic Slug Resolution (`[...slug].astro`):
```astro
---
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}
const post = Astro.props;
const { Content } = await post.render();
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="prose prose-invert max-w-4xl mx-auto py-12">
    <Content />
  </article>
</BaseLayout>
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
