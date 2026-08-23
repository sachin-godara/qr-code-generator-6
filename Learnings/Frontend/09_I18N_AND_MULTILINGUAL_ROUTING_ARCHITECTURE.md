# 🌍 09 - Internationalization (i18n) & Multilingual Routing Architecture

> **Comprehensive architectural breakdown of the 4-language internationalization system (`en`, `es`, `de`, `pt`), localized Astro SSG routing, JSON dictionary structures, React translation context, hreflang SEO tags, and parity validation test suites.**

---

## 🏛️ 1. Internationalization Architecture Overview

QR Code Maker 6 features an end-to-end multi-language architecture supporting **English (en)**, **Spanish (es)**, **German (de)**, and **Portuguese (pt)**. The system is designed with zero runtime overhead in Astro static generation, full client reactivity in React islands, and strict multi-region SEO compliance.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          i18n Configuration Layer                           │
│                      (frontend/src/i18n/config.ts)                          │
│                                                                             │
│  • Locales: ['en', 'es', 'pt', 'de']                                        │
│  • Default Locale: 'en' (unprefixed URL routing)                            │
│  • Metadata: Native Name, Flag Emoji, Direction (ltr), OpenGraph, hreflang  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────────┐
│      Astro SSG Static Routing        │   │    React 19 Interactive Island   │
│   • Root: / (English)                │   │ • TranslationProvider Context    │
│   • Spanish: /es/...                 │   │ • useTranslation() Hook          │
│   • German: /de/...                  │   │ • ReactLanguageSwitcher.tsx      │
│   • Portuguese: /pt/...              │   │ • Dynamic Parameter Interpolation│
│   • Page Templates Composition       │   │ • Localized Form Labels & Errors │
└──────────────────┬───────────────────┘   └──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SEO & Alternate URL Resolution                        │
│                         (SEOHead.astro & utils.ts)                          │
│                                                                             │
│  • <link rel="alternate" hreflang="en" href="https://.../" />               │
│  • <link rel="alternate" hreflang="es" href="https://.../es" />             │
│  • <link rel="alternate" hreflang="pt" href="https://.../pt" />             │
│  • <link rel="alternate" hreflang="de" href="https://.../de" />             │
│  • <link rel="alternate" hreflang="x-default" href="https://.../" />        │
│  • Localized JSON-LD FAQPage & SoftwareApplication schemas per locale        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 2. Core Configuration (`frontend/src/i18n/config.ts`)

The locale manifest defines the language matrix and strict type guards:

```typescript
export const defaultLocale = 'en' as const;
export const locales = ['en', 'es', 'pt', 'de'] as const;
export type Locale = (typeof locales)[number];

export interface LocaleInfo {
  code: Locale;
  name: string;          // Native name: English, Español, Português, Deutsch
  nameEn: string;        // English name
  flag: string;          // Country flag emoji / icon identifier
  dir: 'ltr' | 'rtl';
  ogLocale: string;      // OpenGraph locale: en_US, es_ES, pt_BR, de_DE
  hreflang: string;      // Hreflang code: en, es, pt, de
  label: string;         // Short uppercase badge: EN, ES, PT, DE
}

export const localeConfig: Record<Locale, LocaleInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nameEn: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    ogLocale: 'en_US',
    hreflang: 'en',
    label: 'EN',
  },
  es: {
    code: 'es',
    name: 'Español',
    nameEn: 'Spanish',
    flag: '🇪🇸',
    dir: 'ltr',
    ogLocale: 'es_ES',
    hreflang: 'es',
    label: 'ES',
  },
  pt: {
    code: 'pt',
    name: 'Português',
    nameEn: 'Portuguese',
    flag: '🇧🇷',
    dir: 'ltr',
    ogLocale: 'pt_BR',
    hreflang: 'pt',
    label: 'PT',
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    nameEn: 'German',
    flag: '🇩🇪',
    dir: 'ltr',
    ogLocale: 'de_DE',
    hreflang: 'de',
    label: 'DE',
  },
};

export function isValidLocale(code: string): code is Locale {
  return (locales as readonly string[]).includes(code);
}
```

---

## 📚 3. Dictionary Topology & Content Volume

Translations are divided into two primary subdirectories inside `frontend/src/i18n/`:

```
frontend/src/i18n/
├── config.ts               # Core locale definitions & type guards
├── utils.ts                # URL parsers, path generators, t() resolver
├── useTranslation.tsx      # React Context & translation hook
├── blogTranslations.ts     # Localized blog metadata, tags, and reading times
├── locales/                # Main UI translation dictionaries (~160 KB total)
│   ├── en.json             # English UI dictionary (37.3 KB, ~1,200 keys)
│   ├── es.json             # Spanish UI dictionary (40.0 KB, ~1,200 keys)
│   ├── de.json             # German UI dictionary (39.5 KB, ~1,200 keys)
│   └── pt.json             # Portuguese UI dictionary (39.6 KB, ~1,200 keys)
└── seo/                    # SEO metadata dictionaries (~19 KB total)
    ├── en.json             # English meta titles, descriptions, keywords & FAQs
    ├── es.json             # Spanish meta titles, descriptions, keywords & FAQs
    ├── de.json             # German meta titles, descriptions, keywords & FAQs
    └── pt.json             # Portuguese meta titles, descriptions, keywords & FAQs
```

### Key Dictionary Namespaces:
- **`nav`**: Header navigation links, CTA buttons, and language switcher labels.
- **`landing`**: Hero headlines, subtitles, feature cards, protocol selectors, and trust badges.
- **`studio`**: Editor tabs, form field labels, placeholder text, sliders, color presets, tooltips.
- **`scanner`**: Camera permissions, deep scan status messages, payload modal tabs, export actions.
- **`templates`**: Category names (Minimalist, Business, Cyberpunk, Nature, Social, etc.).
- **`howToUse`**: Interactive guide step titles, instructions, tips, and FAQ accordions.
- **`footer`**: Footer columns, copyright notice, legal links, and social links.

---

## 🛠️ 4. URL & Path Resolution Utilities (`frontend/src/i18n/utils.ts`)

The utility layer handles URL analysis, locale extraction, route cleanup, and parameter interpolation:

### 1. Locale Extraction from URL (`getLocaleFromUrl`):
```typescript
export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0];
  }
  return defaultLocale; // Unprefixed paths default to 'en'
}
```

### 2. Clean Path Normalization (`getCleanPathname`):
Strips language prefixes so paths can be safely recombined into other languages:
- `/es/wifi-qr-code` $\rightarrow$ `/wifi-qr-code`
- `/de/how-to-use` $\rightarrow$ `/how-to-use`
- `/vcard-qr-code` $\rightarrow$ `/vcard-qr-code`

### 3. Localized URL Generator (`getLocalizedUrl`):
Generates canonical URLs following the rule: **English is at the root `/`, all other languages are prefixed `/{locale}/`**:
```typescript
export function getLocalizedUrl(targetLocale: Locale, pathname: string): string {
  let cleanPath = getCleanPathname(pathname).replace(/^\//, '');
  if (cleanPath === '404' || cleanPath === '500') {
    cleanPath = '';
  }
  if (targetLocale === defaultLocale) {
    return cleanPath ? `/${cleanPath}` : '/';
  }
  return cleanPath ? `/${targetLocale}/${cleanPath}` : `/${targetLocale}`;
}
```

### 4. Translation Lookup Engine with Parameter Interpolation (`t`):
Implements nested key traversal with automatic English fallback and template variable substitution:
```typescript
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
  fallback?: string
): string {
  const dict = dictionaries[locale] || dictionaries[defaultLocale];
  const keys = key.split('.');

  let current: any = dict;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      current = undefined;
      break;
    }
  }

  // Automatic fallback to English if missing in target locale
  if (current === undefined && locale !== defaultLocale) {
    let fallbackDict: any = dictionaries[defaultLocale];
    for (const k of keys) {
      if (fallbackDict && typeof fallbackDict === 'object' && k in fallbackDict) {
        fallbackDict = fallbackDict[k];
      } else {
        fallbackDict = undefined;
        break;
      }
    }
    current = fallbackDict;
  }

  if (typeof current !== 'string') {
    return fallback !== undefined ? fallback : key;
  }

  let result = current;
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    });
  }

  return result;
}
```

---

## ⚛️ 5. React Integration (`useTranslation.tsx` & Island Components)

Interactive React islands access the active locale via `TranslationProvider` and the `useTranslation()` custom hook:

```tsx
import React, { createContext, useContext, useMemo } from 'react';
import { defaultLocale, type Locale, isValidLocale } from './config';
import { dictionaries, t as translateFunction } from './utils';

const TranslationContext = createContext<TranslationContextType>({ ... });

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  locale = defaultLocale,
  children,
}) => {
  const currentLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;

  const value = useMemo(() => ({
    locale: currentLocale,
    t: (key: string, params?: Record<string, string | number>, fallback?: string) =>
      translateFunction(currentLocale, key, params, fallback),
    dict: dictionaries[currentLocale] || dictionaries[defaultLocale],
  }), [currentLocale]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation() {
  return useContext(TranslationContext);
}
```

### In Astro Pages:
```astro
---
import QRGeneratorApp from '../react/QRGeneratorApp';
const { locale } = Astro.props;
---
<QRGeneratorApp client:load locale={locale} />
```

### In React Components:
```tsx
import { useTranslation } from '../i18n/useTranslation';

export function ContentPanel() {
  const { t, locale } = useTranslation();
  return (
    <div>
      <h3>{t('studio.content.urlLabel')}</h3>
      <input placeholder={t('studio.content.urlPlaceholder')} />
      <span>{t('studio.labels.step', { current: 1, total: 8 })}</span>
    </div>
  );
}
```

---

## 🌐 6. UI Language Switcher Architecture

Language switching is accessible via two coordinated components:

### 1. `LanguageSwitcher.astro` (Static Navbar Dropdown):
- Renders in the primary navigation header with country flags and native language names.
- Computes the active clean path and maps each dropdown option to the exact matching page in the target language.
- Includes a desktop hover/click dropdown and a mobile sheet selector.

### 2. `ReactLanguageSwitcher.tsx` (Client Studio & Scanner Switcher):
- Allows users to switch languages inside full-page interactive tools without losing unsaved editor state or scan history.
- Mutates the window URL with client-side history navigation (`window.location.assign`).

---

## 🔍 7. Multi-Region SEO & Hreflang Tags (`SEOHead.astro`)

`SEOHead.astro` automatically generates bidirectional `hreflang` link tags for every pre-rendered page:

```astro
---
import { getAllLocaleUrls, localeConfig } from '../i18n/utils';
const { locale, canonicalUrl, pathname } = Astro.props;
const alternateUrls = getAllLocaleUrls(pathname);
---
<!-- Hreflang Multi-Region Meta Tags -->
{alternateUrls.map(({ hreflang, url }) => (
  <link rel="alternate" hreflang={hreflang} href={url} />
))}
<link rel="alternate" hreflang="x-default" href={alternateUrls.find(a => a.locale === 'en')?.url} />
```

### Generated HTML Output Example:
```html
<link rel="alternate" hreflang="en" href="https://generatecustomqr.com/wifi-qr-code" />
<link rel="alternate" hreflang="es" href="https://generatecustomqr.com/es/wifi-qr-code" />
<link rel="alternate" hreflang="pt" href="https://generatecustomqr.com/pt/wifi-qr-code" />
<link rel="alternate" hreflang="de" href="https://generatecustomqr.com/de/wifi-qr-code" />
<link rel="alternate" hreflang="x-default" href="https://generatecustomqr.com/wifi-qr-code" />
```

---

## 🧪 8. Quality Assurance & Key Parity Verification

To prevent runtime errors or untranslated placeholder text in production, the codebase includes automated verification tools:

### 1. Node.js Verification Script (`frontend/scripts/verify_i18n_keys.mjs`):
```bash
node frontend/scripts/verify_i18n_keys.mjs
```
- Recursively flattens all keys in `en.json` (the master key reference).
- Verifies that `es.json`, `de.json`, and `pt.json` contain **100% of the master keys**.
- Flags missing keys, empty strings, and untranslated English copies.

### 2. Vitest Test Suite (`frontend/src/tests/i18n.test.ts`):
- Tests `t()` key lookups across all 4 locales.
- Tests dynamic parameter interpolation (`{current}`, `{total}`).
- Tests `getLocaleFromUrl()`, `getCleanPathname()`, `getLocalizedUrl()`, and `getAllLocaleUrls()`.
