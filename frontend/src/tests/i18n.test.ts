import { describe, it, expect } from 'vitest';
import { t, getLocaleFromUrl, getCleanPathname, getLocalizedUrl, getAllLocaleUrls } from '../i18n/utils';

describe('i18n utils', () => {
  describe('t (translation lookup)', () => {
    it('translates simple keys in English', () => {
      expect(t('en', 'nav.generator')).toBe('Generator');
      expect(t('en', 'nav.guide')).toBe('Guide');
    });

    it('translates keys in Spanish', () => {
      expect(t('es', 'nav.generator')).toBe('Generador');
      expect(t('es', 'nav.guide')).toBe('Guía');
    });

    it('translates keys in Portuguese', () => {
      expect(t('pt', 'nav.generator')).toBe('Gerador');
    });

    it('translates keys in German', () => {
      expect(t('de', 'nav.generator')).toBe('Generator');
    });

    it('interpolates parameters correctly', () => {
      expect(t('en', 'studio.labels.step', { current: 1, total: 8 })).toBe('Step 1 / 8');
      expect(t('es', 'studio.labels.step', { current: 2, total: 8 })).toBe('Paso 2 / 8');
      expect(t('de', 'studio.labels.step', { current: 3, total: 8 })).toBe('Schritt 3 / 8');
    });

    it('translates scanner keys across all 4 locales without fallback', () => {
      // English
      expect(t('en', 'scanner.dropSubtitle')).toBe('Drop your saved QR code, barcode, or screenshot file');
      expect(t('en', 'scanner.browseFiles')).toBe('Browse Files');
      expect(t('en', 'scanner.pasteButton')).toBe('Paste (Ctrl+V)');
      expect(t('en', 'scanner.tryLiveSample')).toBe('Try Live Sample:');

      // Spanish
      expect(t('es', 'scanner.dropSubtitle')).toBe('Arrastra tu código QR, código de barras o captura de pantalla');
      expect(t('es', 'scanner.browseFiles')).toBe('Buscar Archivos');
      expect(t('es', 'scanner.pasteButton')).toBe('Pegar (Ctrl+V)');
      expect(t('es', 'scanner.tryLiveSample')).toBe('Probar Ejemplo en Vivo:');

      // German
      expect(t('de', 'scanner.dropSubtitle')).toBe('Ziehe dein QR-Code-Bild, Barcode oder Screenshot hierher');
      expect(t('de', 'scanner.browseFiles')).toBe('Dateien Durchsuchen');
      expect(t('de', 'scanner.pasteButton')).toBe('Einfügen (Strg+V)');
      expect(t('de', 'scanner.tryLiveSample')).toBe('Live-Beispiel Testen:');

      // Portuguese
      expect(t('pt', 'scanner.dropSubtitle')).toBe('Arraste sua imagem de QR code, código de barras ou captura');
      expect(t('pt', 'scanner.browseFiles')).toBe('Procurar Arquivos');
      expect(t('pt', 'scanner.pasteButton')).toBe('Colar (Ctrl+V)');
      expect(t('pt', 'scanner.tryLiveSample')).toBe('Testar Exemplo:');
    });

    it('translates blog keys across all 4 locales without fallback', () => {
      // English
      expect(t('en', 'blog.tableOfContents')).toBe('Table of Contents');
      expect(t('en', 'blog.onThisPage')).toBe('On This Page');
      expect(t('en', 'blog.shareArticle')).toBe('Share Article');
      expect(t('en', 'blog.copyLink')).toBe('Copy Link');
      expect(t('en', 'blog.factChecked')).toBe('Fact-Checked & Verified');
      expect(t('en', 'blog.allCategories')).toBe('All');

      // Spanish
      expect(t('es', 'blog.tableOfContents')).toBe('Tabla de Contenidos');
      expect(t('es', 'blog.onThisPage')).toBe('En Esta Página');
      expect(t('es', 'blog.shareArticle')).toBe('Compartir Artículo');
      expect(t('es', 'blog.copyLink')).toBe('Copiar Enlace');
      expect(t('es', 'blog.factChecked')).toBe('Verificado y Comprobado');
      expect(t('es', 'blog.allCategories')).toBe('Todos');

      // German
      expect(t('de', 'blog.tableOfContents')).toBe('Inhaltsverzeichnis');
      expect(t('de', 'blog.onThisPage')).toBe('Auf Dieser Seite');
      expect(t('de', 'blog.shareArticle')).toBe('Artikel Teilen');
      expect(t('de', 'blog.copyLink')).toBe('Link Kopieren');
      expect(t('de', 'blog.factChecked')).toBe('Geprüft & Verifiziert');
      expect(t('de', 'blog.allCategories')).toBe('Alle');

      // Portuguese
      expect(t('pt', 'blog.tableOfContents')).toBe('Índice do Artigo');
      expect(t('pt', 'blog.onThisPage')).toBe('Nesta Página');
      expect(t('pt', 'blog.shareArticle')).toBe('Compartilhar Artigo');
      expect(t('pt', 'blog.copyLink')).toBe('Copiar Link');
      expect(t('pt', 'blog.factChecked')).toBe('Revisado e Verificado');
      expect(t('pt', 'blog.allCategories')).toBe('Todos');
    });

    it('falls back to English when key is missing in other languages', () => {
      // Non-existent key in sub-object falls back to fallback or key name
      expect(t('es', 'non.existent.key.xyz', undefined, 'Fallback Text')).toBe('Fallback Text');
    });
  });

  describe('getLocaleFromUrl', () => {
    it('detects default English locale from root or unprefixed URLs', () => {
      expect(getLocaleFromUrl('/')).toBe('en');
      expect(getLocaleFromUrl('/qr-code-scanner')).toBe('en');
      expect(getLocaleFromUrl(new URL('https://generatecustomqr.com/how-to-use'))).toBe('en');
    });

    it('detects Spanish, Portuguese, German locale from pathname', () => {
      expect(getLocaleFromUrl('/es/qr-code-scanner')).toBe('es');
      expect(getLocaleFromUrl('/pt/how-to-use')).toBe('pt');
      expect(getLocaleFromUrl('/de/blog')).toBe('de');
    });
  });

  describe('getCleanPathname', () => {
    it('strips locale prefixes cleanly', () => {
      expect(getCleanPathname('/es/how-to-use')).toBe('/how-to-use');
      expect(getCleanPathname('/pt/wifi-qr-code')).toBe('/wifi-qr-code');
      expect(getCleanPathname('/de/blog')).toBe('/blog');
      expect(getCleanPathname('/how-to-use')).toBe('/how-to-use');
      expect(getCleanPathname('/')).toBe('/');
    });
  });

  describe('getLocalizedUrl', () => {
    it('generates correct URLs for default English locale without prefix', () => {
      expect(getLocalizedUrl('en', '/how-to-use')).toBe('/how-to-use');
      expect(getLocalizedUrl('en', '/')).toBe('/');
    });

    it('generates correct URLs with locale prefix for other locales', () => {
      expect(getLocalizedUrl('es', '/how-to-use')).toBe('/es/how-to-use');
      expect(getLocalizedUrl('pt', '/wifi-qr-code')).toBe('/pt/wifi-qr-code');
      expect(getLocalizedUrl('de', '/')).toBe('/de');
    });
  });

  describe('getAllLocaleUrls', () => {
    it('returns alternate URLs for all 4 supported locales', () => {
      const alternates = getAllLocaleUrls('/how-to-use', 'https://generatecustomqr.com');
      expect(alternates).toHaveLength(4);
      expect(alternates.find((a) => a.locale === 'en')?.url).toBe('https://generatecustomqr.com/how-to-use');
      expect(alternates.find((a) => a.locale === 'es')?.url).toBe('https://generatecustomqr.com/es/how-to-use');
      expect(alternates.find((a) => a.locale === 'pt')?.url).toBe('https://generatecustomqr.com/pt/how-to-use');
      expect(alternates.find((a) => a.locale === 'de')?.url).toBe('https://generatecustomqr.com/de/how-to-use');
    });

    it('returns exact matching canonical homepage URLs for root path', () => {
      const alternates = getAllLocaleUrls('/', 'https://generatecustomqr.com');
      expect(alternates).toHaveLength(4);
      expect(alternates.find((a) => a.locale === 'en')?.url).toBe('https://generatecustomqr.com/');
      expect(alternates.find((a) => a.locale === 'es')?.url).toBe('https://generatecustomqr.com/es');
      expect(alternates.find((a) => a.locale === 'pt')?.url).toBe('https://generatecustomqr.com/pt');
      expect(alternates.find((a) => a.locale === 'de')?.url).toBe('https://generatecustomqr.com/de');
    });
  });
});
