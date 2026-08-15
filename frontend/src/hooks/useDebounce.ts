import { useState, useEffect, useRef } from "react";
import type { QRSettings } from "../types/qr";

/**
 * Generic debounce hook for simple primitive values.
 */
export function useDebounce<T>(value: T, delay: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const DISCRETE_KEYS: (keyof QRSettings)[] = [
  "contentType",
  "dots_style",
  "eye_frame_style",
  "eyeball_style",
  "eye_frame_style_tl",
  "eye_frame_style_tr",
  "eye_frame_style_bl",
  "eyeball_style_tl",
  "eyeball_style_tr",
  "eyeball_style_bl",
  "link_eyes",
  "dots_color",
  "dots_color_end",
  "gradient_type",
  "bg_color",
  "eye_color",
  "eyeball_color",
  "frame_style",
  "text_style",
  "frame_color",
  "frame_text_color",
  "preset_logo",
  "logo_type",
  "logo_style",
  "logo_card_shape",
  "logo_color_mode",
  "logo_custom_color",
  "error_correction",
  "bg_transparent",
  "remove_logo_bg",
  "effect_shadow",
  "canvas_border_color",
];

/**
 * High-performance smart debounce hook specifically for QR Settings:
 * - Discrete customization clicks (dot styles, eye shapes, templates, color chips, toggles, logo presets)
 *   trigger an INSTANT update (0ms delay) for immediate preview response.
 * - Continuous stream events (typing URLs/text, dragging continuous sliders) are throttled smoothly.
 */
export function useSmartQRSettingsDebounce(settings: QRSettings, typingDelay: number = 150): QRSettings {
  const [debouncedSettings, setDebouncedSettings] = useState<QRSettings>(settings);
  const lastDiscreteRef = useRef<string>("");

  const currentDiscreteStr = DISCRETE_KEYS.map((k) => `${k}:${settings[k]}`).join("|");

  useEffect(() => {
    // If any discrete customization changed (e.g. style clicked, color chip selected, toggle switched)
    if (lastDiscreteRef.current !== currentDiscreteStr) {
      lastDiscreteRef.current = currentDiscreteStr;
      setDebouncedSettings(settings);
      return;
    }

    // Only continuous inputs changed (typing contentData or dragging continuous sliders)
    const handler = setTimeout(() => {
      setDebouncedSettings(settings);
    }, typingDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [settings, currentDiscreteStr, typingDelay]);

  return debouncedSettings;
}

