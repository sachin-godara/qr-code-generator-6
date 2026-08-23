import { defaultLocale, locales, localeConfig, isValidLocale, type Locale } from './config';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';

import enSeo from './seo/en.json';
import esSeo from './seo/es.json';
import ptSeo from './seo/pt.json';
import deSeo from './seo/de.json';

export const dictionaries: Record<Locale, typeof en> = {
  en,
  es,
  pt,
  de,
};

export const seoDictionaries: Record<Locale, typeof enSeo> = {
  en: enSeo,
  es: esSeo,
  pt: ptSeo,
  de: deSeo,
};

/**
 * Extract locale from URL pathname.
 * E.g. /es/qr-code-scanner -> 'es'
 *      /qr-code-scanner    -> 'en'
 */
export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0];
  }
  return defaultLocale;
}

/**
 * Strip locale prefix from path.
 * E.g. /es/how-to-use -> /how-to-use
 *      /how-to-use    -> /how-to-use
 */
export function getCleanPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    segments.shift();
  }
  return `/${segments.join('/')}`;
}

/**
 * Generate localized URL for a target locale and clean path.
 * E.g. ('es', '/wifi-qr-code') -> '/es/wifi-qr-code'
 *      ('en', '/wifi-qr-code') -> '/wifi-qr-code'
 */
export function getLocalizedUrl(targetLocale: Locale, pathname: string): string {
  const cleanPath = getCleanPathname(pathname).replace(/^\//, '');
  if (targetLocale === defaultLocale) {
    return cleanPath ? `/${cleanPath}` : '/';
  }
  return cleanPath ? `/${targetLocale}/${cleanPath}` : `/${targetLocale}`;
}

/**
 * Return all alternate URLs for a given pathname for hreflang tag rendering.
 */
export function getAllLocaleUrls(pathname: string, siteUrl = 'https://generatecustomqr.com') {
  const cleanSite = siteUrl.replace(/\/$/, '');
  const cleanPath = getCleanPathname(pathname);

  return locales.map((locale) => {
    const locPath = getLocalizedUrl(locale, cleanPath);
    return {
      locale,
      hreflang: localeConfig[locale].hreflang,
      url: `${cleanSite}${locPath === '/' ? '' : locPath}`,
    };
  });
}

/**
 * Nested key lookup helper for typed or string keys.
 * E.g. t(locale, 'nav.generator') -> 'Generador'
 */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] || dictionaries[defaultLocale];
  const keys = key.split('.');

  let current: any = dict;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English dictionary
      current = undefined;
      break;
    }
  }

  // Fallback check
  if (current === undefined && locale !== defaultLocale) {
    let fallback: any = dictionaries[defaultLocale];
    for (const k of keys) {
      if (fallback && typeof fallback === 'object' && k in fallback) {
        fallback = fallback[k];
      } else {
        fallback = undefined;
        break;
      }
    }
    current = fallback;
  }

  if (typeof current !== 'string') {
    return key;
  }

  let result = current;
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    });
  }

  return result;
}

/**
 * Get SEO metadata for a specific page and locale
 */
export function getPageSeo(locale: Locale, pageKey: keyof typeof enSeo) {
  const seoDict = seoDictionaries[locale] || seoDictionaries[defaultLocale];
  return (seoDict[pageKey] || seoDictionaries[defaultLocale][pageKey]) as any;
}
