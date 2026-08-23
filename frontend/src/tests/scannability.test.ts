import { describe, it, expect } from 'vitest';
import { calculateScannability } from '../utils/scannability';
import { defaultSettings } from '../types/qr';

describe('calculateScannability', () => {
  it('returns Excellent (100) for standard default settings', () => {
    const result = calculateScannability(defaultSettings);
    expect(result.score).toBe(100);
    expect(result.label).toBe('Excellent');
    expect(result.color).toBe('text-emerald-500');
    expect(result.issues).toHaveLength(0);
  });

  it('penalizes very low contrast colors', () => {
    const lowContrastSettings = {
      ...defaultSettings,
      dots_color: '#eeeeee',
      bg_color: '#ffffff',
    };
    const result = calculateScannability(lowContrastSettings);
    expect(result.score).toBeLessThan(70);
    expect(result.issues.some((i) => i.toLowerCase().includes('contrast'))).toBe(true);
  });

  it('handles short 3-character hex codes properly', () => {
    const result = calculateScannability({
      ...defaultSettings,
      dots_color: '#000',
      bg_color: '#fff',
    });
    expect(result.score).toBe(100);
    expect(result.label).toBe('Excellent');
  });

  it('penalizes complex/experimental dot styles', () => {
    const result = calculateScannability({
      ...defaultSettings,
      dots_style: 'network_nodes',
    });
    expect(result.score).toBeLessThan(100);
    expect(result.issues.some((i) => i.includes('network nodes'))).toBe(true);
  });

  it('penalizes risky dot styles like star or heart', () => {
    const result = calculateScannability({
      ...defaultSettings,
      dots_style: 'star',
    });
    expect(result.score).toBe(90);
    expect(result.issues.some((i) => i.includes('star'))).toBe(true);
  });

  it('penalizes complex eye frames and eyeballs', () => {
    const result = calculateScannability({
      ...defaultSettings,
      eye_frame_style: 'flower_of_life',
      eyeball_style: 'heart',
    });
    expect(result.score).toBeLessThanOrEqual(80);
    expect(result.issues.length).toBeGreaterThanOrEqual(2);
  });

  it('penalizes logo with weak error correction L', () => {
    const result = calculateScannability({
      ...defaultSettings,
      preset_logo: 'WiFi',
      error_correction: 'L',
    });
    expect(result.score).toBeLessThan(80);
    expect(result.issues.some((i) => i.includes('Error Correction'))).toBe(true);
  });

  it('does not penalize logo when error correction is H', () => {
    const result = calculateScannability({
      ...defaultSettings,
      preset_logo: 'WiFi',
      error_correction: 'H',
    });
    expect(result.score).toBe(100);
    expect(result.issues).toHaveLength(0);
  });
});
