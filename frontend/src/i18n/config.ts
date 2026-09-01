export const defaultLocale = 'en' as const;

export const locales = ['en', 'es', 'pt', 'de', 'tr'] as const;
export type Locale = (typeof locales)[number];

export interface LocaleInfo {
  code: Locale;
  name: string;          // Native name: English, Español, Português, Deutsch, Türkçe
  nameEn: string;        // English name
  flag: string;          // Country flag emoji / icon identifier
  dir: 'ltr' | 'rtl';
  ogLocale: string;      // OpenGraph locale format: en_US, es_ES, pt_BR, de_DE, tr_TR
  hreflang: string;      // Hreflang code: en, es, pt, de, tr
  label: string;         // Short label: EN, ES, PT, DE, TR
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
  tr: {
    code: 'tr',
    name: 'Türkçe',
    nameEn: 'Turkish',
    flag: '🇹🇷',
    dir: 'ltr',
    ogLocale: 'tr_TR',
    hreflang: 'tr',
    label: 'TR',
  },
};

export function isValidLocale(code: string): code is Locale {
  return (locales as readonly string[]).includes(code);
}
