import { type Locale } from './config';

/**
 * Route IDs for specialized tool pages that support localized slugs.
 */
export type LocalizedRouteId = 'scanner';

/**
 * Localized slug map: Route ID -> Locale -> Slug (without leading/trailing slashes).
 */
export const localizedSlugMap: Record<LocalizedRouteId, Record<Locale, string>> = {
  scanner: {
    en: 'qr-code-scanner',
    de: 'qr-code-scannen',
    tr: 'qr-kod-okuyucu',
    es: 'escanear-codigo-qr',
    pt: 'escanear-qr-code',
  },
};

/**
 * Reverse mapping: Any recognized localized or legacy slug -> Route ID
 */
export const slugToRouteId: Record<string, LocalizedRouteId> = {
  // Canonical localized slugs
  'qr-code-scanner': 'scanner',
  'qr-code-scannen': 'scanner',
  'qr-kod-okuyucu': 'scanner',
  'escanear-codigo-qr': 'scanner',
  'escanear-qr-code': 'scanner',
  // Legacy / alias slugs
  'scanner': 'scanner',
};

/**
 * Given a pathname (e.g. '/tr/qr-kod-okuyucu', '/qr-code-scanner', '/de/qr-code-scanner'),
 * detect if it corresponds to a localized route ID.
 */
export function getRouteIdFromPath(pathname: string): LocalizedRouteId | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  // The last or first segment could be the slug
  for (const seg of segments) {
    const cleanSeg = seg.replace(/^\/|\/$/g, '');
    if (slugToRouteId[cleanSeg]) {
      return slugToRouteId[cleanSeg];
    }
  }
  return null;
}

/**
 * Get the localized slug for a given route ID and target locale.
 */
export function getLocalizedSlug(routeId: LocalizedRouteId, targetLocale: Locale): string {
  return localizedSlugMap[routeId]?.[targetLocale] || localizedSlugMap[routeId]?.en;
}
