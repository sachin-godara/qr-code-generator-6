import { describe, it, expect, vi } from 'vitest';
import { resolveLogoPayload, revokePreviewUrl } from '../services/qrApi';
import { defaultSettings } from '../types/qr';

vi.mock('@/components/previews/SvgIcons', () => ({
  getReactLogoPngDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,mockPngData'),
  PRESET_LOGO_BRAND_COLORS: {
    WiFi: '#0284C7',
    Location: '#EA4335',
  },
}));

describe('qrApi service', () => {
  describe('resolveLogoPayload', () => {
    it('handles settings with no logo cleanly', async () => {
      const payload = await resolveLogoPayload(defaultSettings);
      expect(payload.data).toBe(defaultSettings.contentData);
      expect(payload.logo_image).toBeNull();
      expect(payload.preset_logo).toBe('None');
    });

    it('falls back to placeholder data if contentData is empty', async () => {
      const payload = await resolveLogoPayload({
        ...defaultSettings,
        contentData: '',
      });
      expect(payload.data).toBe('Your text here...');
    });

    it('preserves user uploaded logo image if provided', async () => {
      const mockBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const payload = await resolveLogoPayload({
        ...defaultSettings,
        logo_image: mockBase64,
        preset_logo: 'None',
      });
      expect(payload.logo_image).toBe(mockBase64);
    });

    it('resolves preset logo into PNG data and brand color', async () => {
      const payload = await resolveLogoPayload({
        ...defaultSettings,
        preset_logo: 'WiFi',
        logo_image: null,
      });
      expect(payload.preset_logo).toBe('None'); // Replaced by rasterized logo_image
      expect(payload.preset_logo_color).toBeDefined();
    });

    it('uses custom logo color when logo_color_mode is custom', async () => {
      const payload = await resolveLogoPayload({
        ...defaultSettings,
        preset_logo: 'WiFi',
        logo_image: null,
        logo_color_mode: 'custom',
        logo_custom_color: '#ff5500',
      });
      expect(payload.preset_logo_color).toBe('#ff5500');
    });
  });

  describe('blobToDataUrl', () => {
    it('converts a blob into a data URL successfully', async () => {
      const blob = new Blob(['mock-image-data'], { type: 'image/png' });
      const { blobToDataUrl } = await import('../services/qrApi');
      const dataUrl = await blobToDataUrl(blob);
      expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    });
  });

  describe('revokePreviewUrl', () => {
    it('revokes blob URLs', () => {
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      revokePreviewUrl('blob:http://localhost:3000/123-abc');
      expect(revokeSpy).toHaveBeenCalledWith('blob:http://localhost:3000/123-abc');
      revokeSpy.mockRestore();
    });

    it('ignores non-blob or undefined URLs', () => {
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      revokePreviewUrl('data:image/png;base64,abc123');
      revokePreviewUrl('https://example.com/qr.png');
      revokePreviewUrl(undefined);
      expect(revokeSpy).not.toHaveBeenCalled();
      revokeSpy.mockRestore();
    });
  });
});
