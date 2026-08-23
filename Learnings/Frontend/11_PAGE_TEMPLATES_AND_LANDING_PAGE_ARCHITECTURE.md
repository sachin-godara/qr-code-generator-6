# 📄 11 - Page Templates & Landing Page Architecture

> **Comprehensive reference for all 16 modular page templates (`frontend/src/page-templates/`), localized route delegation, structured JSON-LD schema injection, protocol-specific landing hubs, and interactive SEO content systems.**

---

## 🏛️ 1. Modular Template Architecture

To eliminate code duplication across 4 supported languages (`en`, `es`, `de`, `pt`), QR Code Maker 6 implements a **Template-Delegation Architecture**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Astro Route Dispatchers                            │
│                                                                             │
│  • src/pages/wifi-qr-code.astro       ──► <WifiQrPage locale="en" />        │
│  • src/pages/es/wifi-qr-code.astro    ──► <WifiQrPage locale="es" />        │
│  • src/pages/de/wifi-qr-code.astro    ──► <WifiQrPage locale="de" />        │
│  • src/pages/pt/wifi-qr-code.astro    ──► <WifiQrPage locale="pt" />        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│               src/page-templates/WifiQrPage.astro (Single Source of Truth)   │
│                                                                             │
│  1. Ingests `locale` prop.                                                  │
│  2. Resolves localized SEO metadata from `src/i18n/seo/{locale}.json`.      │
│  3. Pulls UI strings and FAQs from `src/i18n/locales/{locale}.json`.        │
│  4. Injects localized JSON-LD schemas (FAQPage, SoftwareApplication).       │
│  5. Pre-configures React Studio Island with WiFi preset settings.           │
│  6. Renders marketing features, physical signage guides, and print tips.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ 2. The 16 Page Templates Catalog

The complete application interface is composed of 16 dedicated templates inside `frontend/src/page-templates/`:

```
frontend/src/page-templates/
├── HomePage.astro          # Master interactive studio, hero section, format hub, blog teasers
├── FreeGenPage.astro       # High-intent organic search landing page for general QR queries
├── UrlQrPage.astro         # Dedicated URL generator page with UTM parameter guide
├── WifiQrPage.astro        # WiFi network generator with WPA3/WPA2 security and signage guide
├── VCardQrPage.astro       # Digital contact card generator with vCard 3.0 protocol
├── EmailQrPage.astro       # Pre-filled email & newsletter lead generation generator
├── EventQrPage.astro       # iCalendar VEVENT generator for tickets, webinars, and conferences
├── LogoQrPage.astro        # Dedicated brand vector logo overlay generator page
├── ScannerPage.astro       # WebRTC camera video stream & image file upload scanner tool
├── HowToUsePage.astro      # 72 KB interactive visual documentation & 6-step deep tutorial
├── BlogIndexPage.astro     # SEO blog index with category filter tabs and search bar
├── BlogPostPage.astro      # Markdown article renderer with table of contents & author card
├── AboutPage.astro         # Platform mission, technology stack, and privacy commitments
├── ContactPage.astro       # Interactive contact form with honeypot spam protection
├── PrivacyPage.astro       # GDPR & CCPA privacy policy and data governance statement
└── TermsPage.astro         # Terms of service and intellectual property agreement
```

---

## 🔍 3. Template Deep-Dives

### 1. `HomePage.astro` (Master Studio & SEO Hub)
- **Interactive Studio Mount**: Mounts `<QRGeneratorApp client:load locale={locale} />`.
- **Protocol Selector Grid**: 10 interactive cards (URL, WiFi, vCard, Email, SMS, Phone, Event, Text, Maps) linking to dedicated landing routes.
- **Structured Schemas**: Injects `SoftwareApplication` ($4.9/5$ rating), `FAQPage` (6 localized questions), and `BreadcrumbList`.
- **Dynamic Blog Showcase**: Displays the 3 latest localized Markdown articles with publication dates and reading time badges.

### 2. `WifiQrPage.astro` (WiFi Network Protocol Hub)
- **Protocol Pre-activation**: Pre-sets the studio to WiFi mode with WPA encryption defaults.
- **Educational Content**: Visual guide explaining WPA/WPA2/WPA3 security standards and hidden SSIDs.
- **Physical Signage Tips**: Best practices for printing QR codes on table tents, acrylic stands, and café menus.

### 3. `VCardQrPage.astro` (Digital Business Card Hub)
- **Protocol Pre-activation**: Pre-sets the studio to vCard 3.0 format.
- **Field Matrix**: Complete guide covering First/Last Name, Organization, Job Title, Multiple Phones, Email, URL, Physical Address, and Notes.
- **Networking Advantages**: Highlights 1-tap "Save Contact" benefits over traditional paper cards.

### 4. `HowToUsePage.astro` (72 KB Visual Guide)
- **6-Step Interactive Walkthrough**:
  1. Content Protocol Selection.
  2. Module & Eye Shape Customization.
  3. Color Palette & Gradient Harmony.
  4. Brand Logo Vector Overlay.
  5. Frame & Call-To-Action (CTA) Labeling.
  6. High-Resolution Vector/Bitmap Export.
- **Scannability Matrix**: Detailed contrast guidelines, quiet zone rules, and minimum print size calculations.

### 5. `BlogPostPage.astro` (Dynamic Content Collections Renderer)
- **Astro Content Collection**: Renders Markdown with custom CSS typography (`frontend/src/styles/blog.css`).
- **Table of Contents (TOC)**: Automatically extracts `<h2>` and `<h3>` headings.
- **Author & Date Metadata**: Localized author card, publication timestamp, and estimated reading time.
- **JSON-LD `BlogPosting`**: Complete schema markup with author attribution and publisher metadata.

---

## ⚙️ 4. Template Integration Pattern

Every `.astro` page in `src/pages/` is a 4-line lightweight proxy delegating to its template:

```astro
---
// Example: src/pages/es/wifi-qr-code.astro
import WifiQrPage from '../../page-templates/WifiQrPage.astro';
---
<WifiQrPage locale="es" />
```

### Benefits of this Pattern:
1. **Zero Code Duplication**: Any update to HTML markup, Tailwind classes, or layout structure instantly applies across all 4 languages.
2. **Type-Safe Localization**: The `locale: Locale` prop ensures only valid locales (`'en'`, `'es'`, `'de'`, `'pt'`) are accepted.
3. **Independent Route Optimization**: Astro compiles every localized path (`/`, `/es/...`, `/de/...`, `/pt/...`) into high-speed static HTML files.

---

## 🏷️ 5. Structured Data Schema Injection per Template

Every template injects specialized JSON-LD schemas via `SEOHead.astro`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "WiFi QR Code Generator",
      "url": "https://generatecustomqr.com/wifi-qr-code",
      "description": "Create free custom WiFi QR codes with password..."
    },
    {
      "@type": "SoftwareApplication",
      "name": "QR Code Maker 6",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does a WiFi QR code work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When scanned by a smartphone camera, the device automatically parses the SSID and password..."
          }
        }
      ]
    }
  ]
}
</script>
```
