export type ContentType = "url" | "vcard" | "text" | "email" | "wifi" | "sms" | "event";

export interface QRSettings {
  // Content
  contentType: ContentType;
  contentData: string; // The raw data or JSON string containing specific fields
  
  // Design Options
  dots_color: string;
  dots_color_end: string;
  bg_color: string;
  gradient_type: "Solid Color" | "Vertical Gradient" | "Horizontal Gradient" | "Radial Gradient";
  dots_style: string;
  
  // Markers
  eye_color: string;
  eyeball_color: string;
  eye_frame_style: string;
  eyeball_style: string;
  
  // Logo
  logo_image?: string | null;
  preset_logo: "None" | "Link" | "Location" | "WiFi" | "Vcard" | "Email" | "Scan" | "WhatsApp" | "Instagram" | "Facebook" | "YouTube" | "Phone" | "Coffee" | "Shopping" | "Music" | "Globe" | "Heart" | "Star" | "Calendar" | "Payment" | "Store" | "Chat" | "App" | "Discord";
  logo_color_mode?: "default" | "custom";
  logo_custom_color?: string;
  remove_logo_bg: boolean;
  logo_card_shape: "None" | "Circle" | "Rounded Square";
  logo_size_ratio: number;
  logo_card_padding: number;
  logo_clear_size: number;
  logo_bg_color: string;
  logo_bg_tolerance: number;
  
  // Frames
  frame_style: string;
  frame_color: string;
  text_style: string;
  frame_text: string;
  frame_text_color: string;
  frame_text_size: number;
  frame_padding: number;
  frame_radius: number;
  frame_border: number;
  font_name: string;
  
  // Advanced
  error_correction: "L" | "M" | "Q" | "H";
  quiet_zone: number;
  
  // Effects
  effect_shadow: "none" | "soft" | "elevated" | "neon";
  effect_shadow_color: string;
  effect_shadow_blur: number;
  canvas_radius: number;
  canvas_border_width: number;
  canvas_border_color: string;
  canvas_border_radius: number;
  invert_colors: boolean;
}

export const defaultSettings: QRSettings = {
  contentType: "url",
  contentData: "https://example.com",
  dots_color: "#000000",
  dots_color_end: "#000000",
  bg_color: "#ffffff",
  gradient_type: "Solid Color",
  dots_style: "square",
  eye_color: "#000000",
  eyeball_color: "#000000",
  eye_frame_style: "square",
  eyeball_style: "square",
  logo_image: null,
  preset_logo: "None",
  logo_color_mode: "default",
  logo_custom_color: "#3b82f6",
  remove_logo_bg: false,
  logo_card_shape: "None",
  logo_size_ratio: 0.22,
  logo_card_padding: 10,
  logo_clear_size: 2,
  logo_bg_color: "#ffffff",
  logo_bg_tolerance: 30,
  frame_style: "none",
  frame_color: "#0050cb",
  text_style: "none",
  frame_text: "SCAN ME",
  frame_text_color: "#ffffff",
  frame_text_size: 60,
  frame_padding: 30,
  frame_radius: 25,
  frame_border: 15,
  font_name: "Outfit (Modern)",
  error_correction: "H",
  quiet_zone: 4,
  effect_shadow: "none",
  effect_shadow_color: "#00000033",
  effect_shadow_blur: 12,
  canvas_radius: 16,
  canvas_border_width: 0,
  canvas_border_color: "#0050cb",
  canvas_border_radius: 16,
  invert_colors: false
};
