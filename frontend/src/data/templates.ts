import type { QRSettings } from '../types/qr';

export interface Template {
  name: string;
  description?: string;
  category?: string;
  settings: Partial<QRSettings>;
}

export const PRESET_TEMPLATES: Template[] = [
  {
    "name": "Special Delivery",
    "category": "Premium",
    "description": "A stylish open mail envelope with the QR code tucked inside.",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#2C3E50",
      "dots_color_end": "#2C3E50",
      "bg_color": "#3498DB",
      "gradient_type": "None",
      "eye_color": "#2C3E50",
      "eyeball_color": "#2C3E50",
      "frame_style": "none",
      "text_style": "mail_envelope",
      "frame_text": "OPEN ME",
      "frame_color": "#2980B9",
      "frame_text_color": "#ffffff",
      "preset_logo": "None"
    }
  },
  {
    "name": "Video Link",
    "category": "Premium",
    "description": "A clean layout with a floating play button for video links.",
    "settings": {
      "dots_style": "classy",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#000000",
      "dots_color_end": "#000000",
      "bg_color": "#ffffff",
      "gradient_type": "None",
      "eye_color": "#000000",
      "eyeball_color": "#000000",
      "frame_style": "none",
      "text_style": "video_play_pill",
      "frame_text": "WATCH VIDEO",
      "frame_color": "#FF0000",
      "frame_text_color": "#ffffff",
      "preset_logo": "None"
    }
  },
  {
    "name": "At Your Service",
    "category": "Premium",
    "description": "A classic waiter serving tray holding your QR code.",
    "settings": {
      "dots_style": "diamond",
      "eye_frame_style": "leaf",
      "eyeball_style": "diamond",
      "dots_color": "#111111",
      "dots_color_end": "#111111",
      "bg_color": "#f8f9fa",
      "gradient_type": "None",
      "eye_color": "#111111",
      "eyeball_color": "#111111",
      "frame_style": "none",
      "text_style": "waiter_tray",
      "frame_text": "SCAN TO ORDER",
      "frame_color": "#333333",
      "frame_text_color": "#333333",
      "preset_logo": "None"
    }
  },
  {
    "name": "Sunset Gradient Glow",
    "category": "Premium",
    "description": "A highly saturated, warm gradient code over a deep, dark background.",
    "settings": {
      "dots_style": "liquid_drop",
      "eye_frame_style": "squircle",
      "eyeball_style": "circle",
      "dots_color": "#FF007F",
      "dots_color_end": "#FF8C00",
      "bg_color": "#FFF0F5",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#FF007F",
      "eyeball_color": "#FF8C00",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Deep Ocean Bioluminescence",
    "category": "Premium",
    "description": "A rich, deep aquatic theme with glowing, saturated cyan highlights.",
    "settings": {
      "dots_style": "leaf_droplet",
      "eye_frame_style": "droplet_tl",
      "eyeball_style": "circle",
      "dots_color": "#00E5FF",
      "dots_color_end": "#2962FF",
      "bg_color": "#F0F8FF",
      "gradient_type": "Vertical",
      "eye_color": "#00E5FF",
      "eyeball_color": "#00E5FF",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Electric Amethyst",
    "category": "Premium",
    "description": "A luxurious and extremely saturated purple/violet theme.",
    "settings": {
      "dots_style": "diamond",
      "eye_frame_style": "crystal_frame",
      "eyeball_style": "diamond",
      "dots_color": "#7000FF",
      "dots_color_end": "#FF00FF",
      "bg_color": "#F3E5F5",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#7000FF",
      "eyeball_color": "#FF00FF",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Tropical Mango",
    "category": "Premium",
    "description": "A bright, high-energy, sun-drenched palette with max saturation.",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "leaf",
      "eyeball_style": "sheared",
      "dots_color": "#FFEA00",
      "dots_color_end": "#FF3D00",
      "bg_color": "#FFF8E1",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#FF3D00",
      "eyeball_color": "#FFEA00",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Vaporwave Dream",
    "category": "Premium",
    "description": "A highly saturated, retro-futuristic aesthetic.",
    "settings": {
      "dots_style": "pixel_art",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#FF00AA",
      "dots_color_end": "#00FFFF",
      "bg_color": "#F8F8FF",
      "gradient_type": "Radial",
      "eye_color": "#FF00AA",
      "eyeball_color": "#00FFFF",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Soft Mint Wellness",
    "category": "Retail",
    "description": "A soothing, organic design perfect for health and wellness brands.",
    "settings": {
      "dots_style": "liquid_drop",
      "eye_frame_style": "leaf",
      "eyeball_style": "flower_cut",
      "dots_color": "#2D6A4F",
      "dots_color_end": "#40916C",
      "bg_color": "#E8F5E9",
      "gradient_type": "Vertical",
      "eye_color": "#1B4332",
      "eyeball_color": "#2D6A4F",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None",
      "canvas_radius": 24
    }
  },
  {
    "name": "Monochic Studio",
    "category": "Business",
    "description": "Ultra-minimalist dots with sleek camera lens frames.",
    "settings": {
      "dots_style": "minimal_dots",
      "eye_frame_style": "camera_lens",
      "eyeball_style": "circle",
      "dots_color": "#111111",
      "dots_color_end": "#333333",
      "bg_color": "#FFFFFF",
      "gradient_type": "Solid Color",
      "eye_color": "#000000",
      "eyeball_color": "#000000",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Sunset Bistro",
    "category": "Restaurant",
    "description": "Warm gradient flower cuts with soft squircle eyes.",
    "settings": {
      "dots_style": "flower_cut",
      "eye_frame_style": "squircle",
      "eyeball_style": "sheared",
      "dots_color": "#FF512F",
      "dots_color_end": "#DD2476",
      "bg_color": "#FFF3E0",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#DD2476",
      "eyeball_color": "#FF512F",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Retro Console",
    "category": "Social",
    "description": "8-bit inspired pixel art within a monitor screen frame.",
    "settings": {
      "dots_style": "pixel_art",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#FFFFFF",
      "dots_color_end": "#CCCCCC",
      "bg_color": "#222222",
      "gradient_type": "Solid Color",
      "eye_color": "#FFFFFF",
      "eyeball_color": "#FFFFFF",
      "frame_style": "monitor_screen",
      "text_style": "none",
      "preset_logo": "None",
      "frame_color": "#444444"
    }
  },
  {
    "name": "Organic Salad Bowl",
    "category": "Restaurant",
    "description": "Leaf droplet dots with matching opposite leaf frames.",
    "settings": {
      "dots_style": "leaf_droplet",
      "eye_frame_style": "leaf_opposite",
      "eyeball_style": "leaf_opposite",
      "dots_color": "#4CAF50",
      "dots_color_end": "#8BC34A",
      "bg_color": "#F1F8E9",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#388E3C",
      "eyeball_color": "#4CAF50",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Gold Foil Luxury",
    "category": "Premium",
    "description": "A matte dark background with QR dots that have a metallic gold gradient and a faux-embossed texture.",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "dot",
      "dots_color": "#D4AF37",
      "dots_color_end": "#AA8222",
      "bg_color": "#1A1A1A",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#D4AF37",
      "eyeball_color": "#D4AF37",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None",
      "effect_shadow": "elevated",
      "effect_shadow_color": "#00000088",
      "effect_shadow_blur": 6,
      "canvas_radius": 16,
      "canvas_border_width": 0,
      "canvas_border_color": "#18181b",
      "canvas_border_radius": 16
    }
  },  {
    "name": "None",
    "category": "Business",
    "description": "Standard black and white square QR code with no decorations",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#000000",
      "dots_color_end": "#000000",
      "bg_color": "#ffffff",
      "gradient_type": "Solid Color",
      "eye_color": "#000000",
      "eyeball_color": "#000000",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None",
      "logo_image": null
    }
  },  {
    "name": "Artisan Cafe Menu",
    "category": "Restaurant",
    "description": "Perfect for coffee shops and cafes featuring our unique coffee cup frame.",
    "settings": {
      "dots_style": "pillow",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf_opposite",
      "dots_color": "#5C4033",
      "dots_color_end": "#8B5A2B",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#5C4033",
      "eyeball_color": "#8B5A2B",
      "bg_color": "#FFF8DC",
      "frame_style": "none",
      "text_style": "coffee_cup",
      "frame_text": "COFFEE TIME",
      "frame_color": "#5C4033",
      "frame_text_color": "#ffffff",
      "effect_shadow": "none",
      "font_name": "Playfair Display (Elegant)"
    }
  },
  {
    "name": "Premium Real Estate",
    "category": "Business",
    "description": "Elegant design for property tours and agent contacts with house-shaped markers.",
    "settings": {
      "dots_style": "diamond_target",
      "eye_frame_style": "pointed_top_frame",
      "eyeball_style": "diamond",
      "dots_color": "#0F172A",
      "dots_color_end": "#1E293B",
      "gradient_type": "Solid Color",
      "eye_color": "#D4AF37",
      "eyeball_color": "#D4AF37",
      "bg_color": "#ffffff",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "VIEW PROPERTY",
      "frame_color": "#0F172A",
      "frame_text_color": "#D4AF37",
      "effect_shadow": "none",
      "font_name": "Montserrat (Geometric)"
    }
  },
  {
    "name": "Tech App Download",
    "category": "Marketing",
    "description": "A sleek phone frame design mimicking an app store download button.",
    "settings": {
      "dots_style": "network_nodes",
      "eye_frame_style": "camera_lens",
      "eyeball_style": "circle",
      "dots_color": "#6366f1",
      "dots_color_end": "#a855f7",
      "gradient_type": "Vertical Gradient",
      "eye_color": "#6366f1",
      "eyeball_color": "#a855f7",
      "bg_color": "#ffffff",
      "frame_style": "phone_frame",
      "text_style": "app_store_badge",
      "frame_text": "GET THE APP",
      "frame_color": "#111827",
      "frame_text_color": "#ffffff",
      "effect_shadow": "none",
      "font_name": "Roboto (Clean)"
    }
  },
  {
    "name": "Heavy Lifter Gym Pass",
    "category": "Business",
    "description": "Aggressive styling for gyms and personal trainers with dumbbell markers.",
    "settings": {
      "dots_style": "medical_cross",
      "eye_frame_style": "square",
      "eyeball_style": "rounded",
      "dots_color": "#dc2626",
      "dots_color_end": "#991b1b",
      "gradient_type": "Solid Color",
      "eye_color": "#000000",
      "eyeball_color": "#dc2626",
      "bg_color": "#ffffff",
      "frame_style": "border",
      "text_style": "award_badge",
      "frame_text": "FREE TRIAL",
      "frame_color": "#000000",
      "frame_text_color": "#dc2626",
      "effect_shadow": "none",
      "font_name": "Outfit (Modern)"
    }
  },
  {
    "name": "Slice Pizzeria",
    "category": "Restaurant",
    "description": "A fun, eye-catching pizza slice frame for pizzerias and fast food.",
    "settings": {
      "dots_style": "rounded_plus",
      "eye_frame_style": "droplet_tl",
      "eyeball_style": "circle",
      "dots_color": "#E74C3C",
      "dots_color_end": "#C0392B",
      "gradient_type": "Solid Color",
      "eye_color": "#E74C3C",
      "eyeball_color": "#F1C40F",
      "bg_color": "#ffffff",
      "frame_style": "none",
      "text_style": "pizza_slice",
      "frame_text": "ORDER PIZZA",
      "frame_color": "#E74C3C",
      "frame_text_color": "#ffffff",
      "effect_shadow": "none",
      "font_name": "Outfit (Modern)"
    }
  },
  {
    "name": "Instagram Sunset Dots",
    "category": "Social",
    "description": "Vibrant Instagram gradient dots with centered logo",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#f09433",
      "dots_color_end": "#bc1888",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#bc1888",
      "eyeball_color": "#e1306c",
      "bg_color": "#ffffff",
      "preset_logo": "Instagram",
      "preset_logo_color": "#e1306c"
    }
  },
  {
    "name": "Instagram Sunset Card",
    "category": "Social",
    "description": "Full sunset gradient rounded card background",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#bc1888",
      "dots_color_end": "#e1306c",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#bc1888",
      "eyeball_color": "#e1306c",
      "bg_color": "#ffffff",
      "canvas_border_width": 10,
      "canvas_border_color": "#f09433",
      "canvas_border_radius": 24,
      "preset_logo": "Instagram",
      "preset_logo_color": "#e1306c"
    }
  },
  {
    "name": "Instagram Banner Poster",
    "category": "Social",
    "description": "Instagram branded poster banner card",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#bc1888",
      "eye_color": "#bc1888",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "INSTAGRAM",
      "frame_color": "#e1306c",
      "frame_text_color": "#ffffff",
      "preset_logo": "Instagram",
      "preset_logo_color": "#e1306c"
    }
  },
  {
    "name": "Facebook Royal Blue Frame",
    "category": "Social",
    "description": "Royal blue Facebook rounded accent frame",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#1877f2",
      "eye_color": "#1877f2",
      "eyeball_color": "#1877f2",
      "canvas_border_width": 8,
      "canvas_border_color": "#1877f2",
      "canvas_border_radius": 20,
      "preset_logo": "Facebook",
      "preset_logo_color": "#1877f2"
    }
  },
  {
    "name": "Facebook Blue Banner Card",
    "category": "Social",
    "description": "Official Facebook banner card with Follow Us On CTA",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#1877f2",
      "eye_color": "#1877f2",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "FOLLOW US ON",
      "frame_color": "#1877f2",
      "frame_text_color": "#ffffff",
      "preset_logo": "Facebook",
      "preset_logo_color": "#1877f2"
    }
  },
  {
    "name": "Discord Dark Mode",
    "category": "Social",
    "description": "Discord dark mode theme with brand logo",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#ffffff",
      "dots_color_end": "#ffffff",
      "gradient_type": "Solid Color",
      "bg_color": "#1e1f22",
      "eye_color": "#ffffff",
      "eyeball_color": "#5865F2",
      "preset_logo": "Discord",
      "preset_logo_color": "#5865F2"
    }
  },
  {
    "name": "Discord Soft Blue Gradient",
    "category": "Social",
    "description": "Light blue Discord community accent card",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#5865F2",
      "dots_color_end": "#5865F2",
      "gradient_type": "Solid Color",
      "eye_color": "#5865F2",
      "canvas_border_width": 8,
      "canvas_border_color": "#5865F2",
      "canvas_border_radius": 20,
      "preset_logo": "Discord",
      "preset_logo_color": "#5865F2"
    }
  },
  {
    "name": "Black Pill Badge",
    "category": "Marketing",
    "description": "Sleek black frame with solid SCAN ME pill badge",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#000000",
      "eye_color": "#000000",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "SCAN ME",
      "frame_color": "#000000",
      "frame_text_color": "#ffffff",
      "frame_radius": 15
    }
  },
  {
    "name": "Blue Header Tab",
    "category": "Marketing",
    "description": "Blue accent card with top SCAN ME tab",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#1d4ed8",
      "eye_color": "#1d4ed8",
      "frame_style": "border",
      "text_style": "speech_bubble_top",
      "frame_text": "SCAN ME",
      "frame_color": "#1d4ed8",
      "frame_text_color": "#ffffff"
    }
  },
  {
    "name": "Orange Outline Card",
    "category": "Marketing",
    "description": "Bright orange outline border with bottom text label",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#000000",
      "eye_color": "#000000",
      "canvas_border_width": 6,
      "canvas_border_color": "#ff7a00",
      "canvas_border_radius": 16,
      "text_style": "bottom_text",
      "frame_text": "SCAN ME",
      "frame_text_color": "#ff7a00"
    }
  },
  {
    "name": "Red Phone Footer Card",
    "category": "Marketing",
    "description": "Red phone contact card with bottom action badge",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#000000",
      "eye_color": "#000000",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "SCAN ME",
      "frame_color": "#dc2626",
      "frame_text_color": "#ffffff",
      "preset_logo": "Phone",
      "preset_logo_color": "#dc2626"
    }
  },
  {
    "name": "Black Glossy Header Card",
    "category": "Marketing",
    "description": "Monochrome glossy card with top SCAN ME header",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#000000",
      "eye_color": "#000000",
      "canvas_border_width": 4,
      "canvas_border_color": "#000000",
      "canvas_border_radius": 12,
      "text_style": "speech_bubble_top",
      "frame_text": "SCAN ME",
      "frame_color": "#000000",
      "frame_text_color": "#ffffff"
    }
  },
  {
    "name": "Black Canvas Dark Mode",
    "category": "Social",
    "description": "Inverted dark theme canvas with white modules",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#ffffff",
      "dots_color_end": "#ffffff",
      "gradient_type": "Solid Color",
      "bg_color": "#000000",
      "eye_color": "#ffffff",
      "eyeball_color": "#ffffff",
      "canvas_border_width": 8,
      "canvas_border_color": "#222222",
      "canvas_border_radius": 20,
      "preset_logo": "Link",
      "preset_logo_color": "#ffffff"
    }
  },
  {
    "name": "LinkedIn Banner Card",
    "category": "Social",
    "description": "Professional LinkedIn blue brand card",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#0a66c2",
      "eye_color": "#0a66c2",
      "canvas_border_width": 8,
      "canvas_border_color": "#0a66c2",
      "canvas_border_radius": 16,
      "preset_logo": "App",
      "preset_logo_color": "#0a66c2"
    }
  },
  {
    "name": "Threads Black Canvas",
    "category": "Social",
    "description": "Ultra dark Threads edition with crisp white elements",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#ffffff",
      "dots_color_end": "#ffffff",
      "gradient_type": "Solid Color",
      "bg_color": "#000000",
      "eye_color": "#ffffff",
      "eyeball_color": "#ffffff",
      "preset_logo": "Chat",
      "preset_logo_color": "#ffffff"
    }
  },
  {
    "name": "Google 4-Color Brand Card",
    "category": "Social",
    "description": "Multi-colored Google brand style card",
    "settings": {
      "dots_style": "rounded",
      "eye_color": "#4285f4",
      "eyeball_color": "#ea4335",
      "dots_color": "#34a853",
      "bg_color": "#ffffff",
      "canvas_border_width": 8,
      "canvas_border_color": "#4285f4",
      "canvas_border_radius": 16,
      "preset_logo": "Globe",
      "preset_logo_color": "#4285f4"
    }
  },
  {
    "name": "Blue Speech Bubble",
    "category": "Marketing",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#0F52BA",
      "bg_color": "#FFFFFF",
      "eye_color": "#0F52BA",
      "frame_style": "none",
      "text_style": "speech_bubble",
      "frame_text": "DOWNLOAD",
      "frame_color": "#0F52BA",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 70,
      "frame_padding": 20,
      "frame_radius": 20,
      "frame_border": 10
    }
  },
  {
    "name": "Green Leaf",
    "category": "Retail",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf",
      "dots_color": "#2E3B3E",
      "bg_color": "#FFFFFF",
      "eye_color": "#2E8B57",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "SCAN ME",
      "frame_color": "#2E8B57",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 60,
      "frame_padding": 30,
      "frame_radius": 25,
      "frame_border": 15
    }
  },
  {
    "name": "Pink Dotted",
    "category": "Social",
    "settings": {
      "dots_style": "circle",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#FF69B4",
      "bg_color": "#FFFFFF",
      "eye_color": "#FF1493",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "VISIT US",
      "frame_color": "#FF1493",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 60,
      "frame_padding": 25,
      "frame_radius": 20,
      "frame_border": 12
    }
  },
  {
    "name": "Blue Circle Sprinkles",
    "category": "Social",
    "settings": {
      "dots_style": "circle",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#007FFF",
      "bg_color": "#FFFFFF",
      "eye_color": "#007FFF",
      "frame_style": "circle_sprinkles",
      "text_style": "none",
      "frame_text": "HELLO",
      "frame_color": "#007FFF",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 40,
      "frame_padding": 40,
      "frame_radius": 15,
      "frame_border": 15
    }
  },
  {
    "name": "Purple Rate Us Tab",
    "category": "Marketing",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf",
      "dots_color": "#4B0082",
      "bg_color": "#FFFFFF",
      "eye_color": "#8A2BE2",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "RATE US",
      "frame_color": "#8A2BE2",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 65,
      "frame_padding": 30,
      "frame_radius": 25,
      "frame_border": 15
    }
  },
  {
    "name": "Blue Juice Cup",
    "category": "Restaurant",
    "settings": {
      "dots_style": "circle",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#1E90FF",
      "bg_color": "#FFFFFF",
      "eye_color": "#0052CC",
      "frame_style": "none",
      "text_style": "drink_cup",
      "frame_text": "FRESH JUICE",
      "frame_color": "#1E90FF",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 55,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Red Ribbon Banner",
    "category": "Events",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#B22222",
      "bg_color": "#FFFFFF",
      "eye_color": "#B22222",
      "frame_style": "none",
      "text_style": "ribbon_banner",
      "frame_text": "APPROVED",
      "frame_color": "#B22222",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 50,
      "frame_padding": 20,
      "frame_radius": 20,
      "frame_border": 8
    }
  },
  {
    "name": "Warm Coffee Cup",
    "category": "Restaurant",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf",
      "dots_color": "#6F4E37",
      "bg_color": "#FFFFFF",
      "eye_color": "#5C4033",
      "frame_style": "none",
      "text_style": "coffee_cup",
      "frame_text": "COFFEE TIME",
      "frame_color": "#6F4E37",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 48,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Food Cloche Dome",
    "category": "Restaurant",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#2C3E50",
      "bg_color": "#FFFFFF",
      "eye_color": "#16A085",
      "frame_style": "none",
      "text_style": "food_dome",
      "frame_text": "VIEW MENU",
      "frame_color": "#16A085",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 55,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Orange Shopping Bag",
    "category": "Retail",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "shield",
      "eyeball_style": "shield",
      "dots_color": "#FF4500",
      "bg_color": "#FFFFFF",
      "eye_color": "#FF4500",
      "frame_style": "none",
      "text_style": "shopping_bag",
      "frame_text": "SHOP NOW",
      "frame_color": "#FF4500",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 55,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "VIP Ticket Stub",
    "category": "Events",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#D4AF37",
      "bg_color": "#FFFFFF",
      "eye_color": "#111111",
      "frame_style": "none",
      "text_style": "ticket_stub",
      "frame_text": "VIP PASS",
      "frame_color": "#111111",
      "frame_text_color": "#D4AF37",
      "frame_text_size": 55,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Retro Polaroid",
    "category": "Business",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#2C3E50",
      "bg_color": "#FFFFFF",
      "eye_color": "#2C3E50",
      "frame_style": "none",
      "text_style": "polaroid_photo",
      "frame_text": "SAY CHEESE",
      "frame_color": "#E74C3C",
      "frame_text_color": "#2C3E50",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Vantage Price Tag",
    "category": "Retail",
    "settings": {
      "dots_style": "diamond",
      "eye_frame_style": "octagon",
      "eyeball_style": "diamond",
      "dots_color": "#8B4513",
      "bg_color": "#FFFFFF",
      "eye_color": "#8B4513",
      "frame_style": "none",
      "text_style": "price_tag",
      "frame_text": "ONLY $29.99",
      "frame_color": "#8B4513",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 60,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Web Browser",
    "category": "Marketing",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#3F51B5",
      "bg_color": "#FFFFFF",
      "eye_color": "#3F51B5",
      "frame_style": "none",
      "text_style": "browser_window",
      "frame_text": "VISIT WEBSITE",
      "frame_color": "#3F51B5",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 50,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Coffee Mug Frame",
    "category": "Restaurant",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf",
      "dots_color": "#5D4037",
      "bg_color": "#FFFFFF",
      "eye_color": "#5D4037",
      "frame_style": "none",
      "text_style": "coffee_mug",
      "frame_text": "ORDER NOW",
      "frame_color": "#5D4037",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 50,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Best Seller Badge",
    "category": "Retail",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#D4AF37",
      "bg_color": "#FFFFFF",
      "eye_color": "#D4AF37",
      "frame_style": "none",
      "text_style": "award_badge",
      "frame_text": "#1 BEST SELLER",
      "frame_color": "#D4AF37",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Postage Stamp",
    "category": "Marketing",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#8E44AD",
      "bg_color": "#FFFFFF",
      "eye_color": "#8E44AD",
      "frame_style": "none",
      "text_style": "vintage_stamp",
      "frame_text": "FIRST CLASS",
      "frame_color": "#8E44AD",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 50,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Support Chat",
    "category": "Business",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#27AE60",
      "bg_color": "#FFFFFF",
      "eye_color": "#27AE60",
      "frame_style": "none",
      "text_style": "chat_bubble",
      "frame_text": "CHAT WITH US",
      "frame_color": "#27AE60",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Vinyl Soundtrack",
    "category": "Social",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#E67E22",
      "bg_color": "#FFFFFF",
      "eye_color": "#E67E22",
      "frame_style": "none",
      "text_style": "vinyl_record",
      "frame_text": "PLAY SOUNDTRACK",
      "frame_color": "#E67E22",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Verified Shield",
    "category": "Social",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "shield",
      "eyeball_style": "shield",
      "dots_color": "#2980B9",
      "bg_color": "#FFFFFF",
      "eye_color": "#2980B9",
      "frame_style": "none",
      "text_style": "security_shield",
      "frame_text": "VERIFIED ACCESS",
      "frame_color": "#2980B9",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Laptop Workspace",
    "category": "Education",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#2C3E50",
      "bg_color": "#FFFFFF",
      "eye_color": "#2C3E50",
      "frame_style": "none",
      "text_style": "laptop_mockup",
      "frame_text": "OPEN WORKSPACE",
      "frame_color": "#7F8C8D",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Recipe Chef",
    "category": "Restaurant",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf",
      "dots_color": "#D35400",
      "bg_color": "#FFFFFF",
      "eye_color": "#D35400",
      "frame_style": "none",
      "text_style": "chef_hat",
      "frame_text": "BON APPETIT",
      "frame_color": "#D35400",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Retro Console",
    "category": "Social",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#4A4A4A",
      "bg_color": "#FFFFFF",
      "eye_color": "#4A4A4A",
      "frame_style": "none",
      "text_style": "game_console",
      "frame_text": "START GAME",
      "frame_color": "#4A4A4A",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Destination Pin",
    "category": "Events",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "circle",
      "dots_color": "#E74C3C",
      "bg_color": "#FFFFFF",
      "eye_color": "#E74C3C",
      "frame_style": "none",
      "text_style": "map_pin",
      "frame_text": "VIEW LOCATION",
      "frame_color": "#E74C3C",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Envelope RSVP",
    "category": "Events",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#8B6508",
      "bg_color": "#FFFFFF",
      "eye_color": "#8B6508",
      "frame_style": "none",
      "text_style": "rsvp_envelope",
      "frame_text": "RSVP HERE",
      "frame_color": "#8B6508",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 45,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Academic Diploma",
    "category": "Education",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#0F2027",
      "bg_color": "#FFFFFF",
      "eye_color": "#0F2027",
      "frame_style": "none",
      "text_style": "diploma_scroll",
      "frame_text": "VIEW CERTIFICATE",
      "frame_color": "#0F2027",
      "frame_text_color": "#FFFFFF",
      "frame_text_size": 40,
      "frame_padding": 20,
      "frame_radius": 15,
      "frame_border": 8
    }
  },
  {
    "name": "Amazon Gold Leaf",
    "category": "Retail",
    "description": "Official Amazon brand template with gold leaf corner eyes",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "leaf",
      "eyeball_style": "leaf",
      "dots_color": "#000000",
      "dots_color_end": "#000000",
      "bg_color": "#ffffff",
      "gradient_type": "Solid Color",
      "eye_color": "#FF9900",
      "eyeball_color": "#FF9900",
      "preset_logo": "Amazon",
      "preset_logo_color": "#FF9900"
    }
  },
  {
    "name": "Red Hexagon Badge Card",
    "category": "Marketing",
    "description": "Bold red hexagon eyes template with SCAN ME badge",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "octagon",
      "eyeball_style": "octagon",
      "dots_color": "#000000",
      "bg_color": "#ffffff",
      "eye_color": "#e50914",
      "eyeball_color": "#e50914",
      "frame_style": "border",
      "text_style": "bottom_tab",
      "frame_text": "SCAN ME",
      "frame_color": "#e50914",
      "frame_text_color": "#ffffff",
      "frame_radius": 20
    }
  },
  {
    "name": "Pink Pixel Hearts",
    "category": "Social",
    "description": "Romantic pink heart dots theme with vibrant magenta accents",
    "settings": {
      "dots_style": "heart",
      "eye_frame_style": "rounded",
      "eyeball_style": "heart",
      "dots_color": "#e91e63",
      "dots_color_end": "#e91e63",
      "bg_color": "#ffffff",
      "gradient_type": "Solid Color",
      "eye_color": "#e91e63",
      "eyeball_color": "#e91e63"
    }
  },
  {
    "name": "Pink Heart Header Pill Card",
    "category": "Social",
    "description": "Cute pink pill header card with ♥ SCAN ME banner",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#ec4899",
      "bg_color": "#ffffff",
      "eye_color": "#ec4899",
      "eyeball_color": "#ec4899",
      "frame_style": "card",
      "text_style": "top_pill",
      "frame_text": "♥ SCAN ME",
      "frame_color": "#f472b6",
      "frame_text_color": "#ffffff",
      "frame_radius": 20
    }
  },
  {
    "name": "Red Double Hearts Valentine Card",
    "category": "Social",
    "description": "Romantic red card with double interlocking hearts header",
    "settings": {
      "dots_style": "square",
      "eye_frame_style": "square",
      "eyeball_style": "square",
      "dots_color": "#e50914",
      "bg_color": "#ffffff",
      "eye_color": "#e50914",
      "eyeball_color": "#e50914",
      "frame_style": "card",
      "text_style": "bottom_tab",
      "frame_text": "for you...",
      "frame_color": "#e50914",
      "frame_text_color": "#ffffff",
      "frame_radius": 15
    }
  }
,
  {
    "name": "Artisan Menu Scan",
    "category": "Restaurant",
    "description": "Sleek dashes and coffee frame for premium cafes.",
    "settings": {
        "dots_style": "sleek_dash",
        "eye_frame_style": "rounded",
        "eyeball_style": "plus",
        "dots_color": "#3E2723",
        "dots_color_end": "#4E342E",
        "gradient_type": "Vertical Gradient",
        "eye_color": "#3E2723",
        "eyeball_color": "#3E2723",
        "bg_color": "#EFEBE9",
        "frame_style": "none",
        "text_style": "coffee_cup",
        "frame_text": "VIEW MENU",
        "frame_color": "#3E2723",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Table Check Out",
    "category": "Restaurant",
    "description": "High contrast ticket style for paying at the table.",
    "settings": {
        "dots_style": "sleek_dash",
        "eye_frame_style": "rounded",
        "eyeball_style": "plus",
        "dots_color": "#212121",
        "dots_color_end": "#212121",
        "gradient_type": "Solid Color",
        "eye_color": "#212121",
        "eyeball_color": "#212121",
        "bg_color": "#FAFAFA",
        "frame_style": "ticket_cutout",
        "text_style": "none",
        "frame_text": "PAY BILL",
        "frame_color": "#212121",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Cocktail Lounge",
    "category": "Restaurant",
    "description": "Dark mode with gold accents and a floating pill badge.",
    "settings": {
        "dots_style": "diamond",
        "eye_frame_style": "rounded",
        "eyeball_style": "diamond",
        "dots_color": "#FFD700",
        "dots_color_end": "#FFC107",
        "gradient_type": "Diagonal (TL to BR)",
        "eye_color": "#FFD700",
        "eyeball_color": "#FFD700",
        "bg_color": "#121212",
        "frame_style": "none",
        "text_style": "floating_pill",
        "frame_text": "DRINKS",
        "frame_color": "#FFD700",
        "frame_text_color": "#121212"
    }
},
  {
    "name": "Food Delivery Promo",
    "category": "Restaurant",
    "description": "Vibrant colors with a storefront awning layout.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "dots_color": "#E53935",
        "dots_color_end": "#FF5252",
        "gradient_type": "Horizontal Gradient",
        "eye_color": "#E53935",
        "eyeball_color": "#E53935",
        "bg_color": "#ffffff",
        "frame_style": "storefront_awning",
        "text_style": "none",
        "frame_text": "ORDER NOW",
        "frame_color": "#E53935",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Flash Sale Tag",
    "category": "Retail",
    "description": "Bright red coupon style for retail flash sales.",
    "settings": {
        "dots_style": "sleek_dash",
        "eye_frame_style": "pointed_top_frame",
        "eyeball_style": "plus",
        "dots_color": "#D50000",
        "dots_color_end": "#D50000",
        "gradient_type": "Solid Color",
        "eye_color": "#D50000",
        "eyeball_color": "#D50000",
        "bg_color": "#ffffff",
        "frame_style": "coupon_dashed",
        "text_style": "none",
        "frame_text": "SALE 50% OFF",
        "frame_color": "#D50000",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Boutique Shop",
    "category": "Retail",
    "description": "Pastel gradients with a minimal shopping bag.",
    "settings": {
        "dots_style": "lotus_petal",
        "eye_frame_style": "rounded",
        "eyeball_style": "flower_cut",
        "dots_color": "#EC407A",
        "dots_color_end": "#AB47BC",
        "gradient_type": "Diagonal (TL to BR)",
        "eye_color": "#EC407A",
        "eyeball_color": "#AB47BC",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "shopping_bag",
        "frame_text": "SHOP NOW",
        "frame_color": "#AB47BC",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Product Authenticity",
    "category": "Retail",
    "description": "Solid black and gold with shield eye frames.",
    "settings": {
        "dots_style": "arrow",
        "eye_frame_style": "shield_opposite",
        "eyeball_style": "plus",
        "dots_color": "#000000",
        "dots_color_end": "#333333",
        "gradient_type": "Vertical Gradient",
        "eye_color": "#D4AF37",
        "eyeball_color": "#D4AF37",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "floating_pill",
        "frame_text": "VERIFY",
        "frame_color": "#000000",
        "frame_text_color": "#D4AF37"
    }
},
  {
    "name": "App Download Promo",
    "category": "Marketing",
    "description": "Tech chevron dots with a monitor screen layout.",
    "settings": {
        "dots_style": "arrow",
        "eye_frame_style": "rounded",
        "eyeball_style": "plus",
        "dots_color": "#2962FF",
        "dots_color_end": "#00B0FF",
        "gradient_type": "Horizontal Gradient",
        "eye_color": "#2962FF",
        "eyeball_color": "#2962FF",
        "bg_color": "#ffffff",
        "frame_style": "monitor_screen",
        "text_style": "none",
        "frame_text": "DOWNLOAD APP",
        "frame_color": "#2962FF",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Agent vCard",
    "category": "Business",
    "description": "Professional blue with modern polaroid frame for agent contacts.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "dots_color": "#1565C0",
        "dots_color_end": "#1E88E5",
        "gradient_type": "Vertical Gradient",
        "eye_color": "#1565C0",
        "eyeball_color": "#1565C0",
        "bg_color": "#ffffff",
        "frame_style": "modern_polaroid",
        "text_style": "none",
        "frame_text": "SAVE CONTACT",
        "frame_color": "#1565C0",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Virtual Tour",
    "category": "Business",
    "description": "Green gradient target bullseye for real estate virtual tours.",
    "settings": {
        "dots_style": "target_bullseye",
        "eye_frame_style": "camera_lens",
        "eyeball_style": "circle",
        "dots_color": "#2E7D32",
        "dots_color_end": "#43A047",
        "gradient_type": "Horizontal Gradient",
        "eye_color": "#2E7D32",
        "eyeball_color": "#2E7D32",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "floating_pill",
        "frame_text": "START TOUR",
        "frame_color": "#2E7D32",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Wedding RSVP",
    "category": "Events",
    "description": "Rose gold gradient with heart dots for elegant weddings.",
    "settings": {
        "dots_style": "heart",
        "eye_frame_style": "rounded",
        "eyeball_style": "heart",
        "dots_color": "#B76E79",
        "dots_color_end": "#E0BFB8",
        "gradient_type": "Vertical Gradient",
        "eye_color": "#B76E79",
        "eyeball_color": "#B76E79",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "rsvp_envelope",
        "frame_text": "RSVP",
        "frame_color": "#B76E79",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Conference Badge",
    "category": "Events",
    "description": "Lanyard style monitor screen frame for conferences.",
    "settings": {
        "dots_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "dots_color": "#424242",
        "dots_color_end": "#424242",
        "gradient_type": "Solid Color",
        "eye_color": "#424242",
        "eyeball_color": "#424242",
        "bg_color": "#ffffff",
        "frame_style": "hanging_sign",
        "text_style": "none",
        "frame_text": "ATTENDEE",
        "frame_color": "#424242",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Patient Portal",
    "category": "Business",
    "description": "Medical cross dots with clean blue minimal ring eyes.",
    "settings": {
        "dots_style": "medical_cross",
        "eye_frame_style": "rounded",
        "eyeball_style": "plus",
        "dots_color": "#0277BD",
        "dots_color_end": "#0288D1",
        "gradient_type": "Horizontal Gradient",
        "eye_color": "#0277BD",
        "eyeball_color": "#0277BD",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "floating_pill",
        "frame_text": "PATIENT PORTAL",
        "frame_color": "#0277BD",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Telehealth Link",
    "category": "Business",
    "description": "Soft green rounded dots with a floating pill.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "dots_color": "#00897B",
        "dots_color_end": "#00897B",
        "gradient_type": "Solid Color",
        "eye_color": "#00897B",
        "eyeball_color": "#00897B",
        "bg_color": "#ffffff",
        "frame_style": "drop_shadow_card",
        "text_style": "none",
        "frame_text": "JOIN CALL",
        "frame_color": "#00897B",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Prescription Info",
    "category": "Business",
    "description": "High contrast black and white with pill frame eyes.",
    "settings": {
        "dots_style": "sleek_dash",
        "eye_frame_style": "rounded",
        "eyeball_style": "plus",
        "dots_color": "#000000",
        "dots_color_end": "#000000",
        "gradient_type": "Solid Color",
        "eye_color": "#000000",
        "eyeball_color": "#000000",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "floating_pill",
        "frame_text": "REFILL INFO",
        "frame_color": "#000000",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Billboard Scalable",
    "category": "Marketing",
    "description": "Extreme contrast thick bracket eyes for outdoor advertising.",
    "settings": {
        "dots_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "dots_color": "#000000",
        "dots_color_end": "#000000",
        "gradient_type": "Solid Color",
        "eye_color": "#000000",
        "eyeball_color": "#000000",
        "bg_color": "#ffffff",
        "frame_style": "none",
        "text_style": "floating_pill",
        "frame_text": "SCAN TO WIN",
        "frame_color": "#FFEB3B",
        "frame_text_color": "#000000"
    }
},
  {
    "name": "Social Media Link",
    "category": "Social",
    "description": "Phone frame for Instagram/TikTok style marketing.",
    "settings": {
        "dots_style": "sleek_dash",
        "eye_frame_style": "rounded",
        "eyeball_style": "plus",
        "dots_color": "#E1306C",
        "dots_color_end": "#405DE6",
        "gradient_type": "Diagonal (TL to BR)",
        "eye_color": "#E1306C",
        "eyeball_color": "#405DE6",
        "bg_color": "#ffffff",
        "frame_style": "phone_frame",
        "text_style": "none",
        "frame_text": "FOLLOW US",
        "frame_color": "#E1306C",
        "frame_text_color": "#ffffff"
    }
},
  {
    "name": "Direct Mail CTA",
    "category": "Marketing",
    "description": "Drop shadow card with dashed edge and loud gradient.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "dots_color": "#FF5722",
        "dots_color_end": "#FF9800",
        "gradient_type": "Horizontal Gradient",
        "eye_color": "#FF5722",
        "eyeball_color": "#FF5722",
        "bg_color": "#ffffff",
        "frame_style": "drop_shadow_card",
        "text_style": "none",
        "frame_text": "CLAIM OFFER",
        "frame_color": "#FF5722",
        "frame_text_color": "#ffffff"
    }
}, {
    "name": "Pizza Delivery Box",
    "category": "Restaurant",
    "description": "A realistic pizza delivery box viewed from the top with the lid slightly open.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "dots_color": "#D35400",
        "bg_color": "#ffffff",
        "frame_style": "pizza_box",
        "text_style": "none"
    }
}, {
    "name": "Chinese Takeout Box",
    "category": "Restaurant",
    "description": "A classic white Chinese takeout box with folded flaps.",
    "settings": {
        "dots_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "dots_color": "#C0392B",
        "bg_color": "#ffffff",
        "frame_style": "takeout_box",
        "text_style": "none"
    }
}, {
    "name": "Bubble Tea Cup",
    "category": "Restaurant",
    "description": "A transparent bubble tea cup filled with colorful pearls.",
    "settings": {
        "dots_style": "circle",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "dots_color": "#8E44AD",
        "bg_color": "#ffffff",
        "frame_style": "boba_cup",
        "text_style": "none",
        "preset_logo": "Coffee",
        "preset_logo_color": "#8E44AD"
    }
}, {
    "name": "Wine Bottle Label",
    "category": "Premium",
    "description": "An elegant wine bottle with a premium paper label featuring gold details.",
    "settings": {
        "dots_style": "diamond",
        "eye_frame_style": "diamond",
        "eyeball_style": "diamond",
        "dots_color": "#4A235A",
        "bg_color": "#FAF5EB",
        "frame_style": "wine_label",
        "text_style": "none"
    }
}, {
    "name": "Beer Mug Coaster",
    "category": "Restaurant",
    "description": "A frosted beer mug placed on a circular wooden coaster.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "dots_color": "#5D4037",
        "bg_color": "#ffffff",
        "frame_style": "beer_coaster",
        "text_style": "none"
    }
}, {
    "name": "Wooden Pizza Peel",
    "category": "Restaurant",
    "description": "A traditional wooden pizza paddle.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "dots_color": "#3E2723",
        "bg_color": "#ffffff",
        "bg_blend_mode": "multiply",
        "bg_transparent": true,
        "frame_style": "wooden_peel",
        "text_style": "none"
    }
}, {
    "name": "Ramen Bowl",
    "category": "Restaurant",
    "description": "A steaming ramen bowl with noodles and chopsticks.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "droplet_tl",
        "eyeball_style": "circle",
        "dots_color": "#E74C3C",
        "bg_color": "#ffffff",
        "frame_style": "ramen_bowl",
        "text_style": "none"
    }
}, {
    "name": "Gold Foil Menu",
    "category": "Premium",
    "description": "A premium black menu featuring metallic gold foil borders.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "dots_color": "#D4AF37",
        "bg_color": "#1A1A1A",
        "frame_style": "gold_foil_menu",
        "text_style": "none"
    }
}, {
    "name": "Neon Restaurant Sign",
    "category": "Signage",
    "description": "A modern neon sign mounted on a dark brick wall.",
    "settings": {
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "dots_color": "#00FFFF",
        "bg_color": "#0a0a0a",
        "frame_style": "neon_glow_frame",
        "frame_color": "#00FFFF",
        "text_style": "none",
        "effect_shadow": "neon",
        "effect_shadow_color": "#00FFFF"
    }
}, {
    "name": "Hanging Wooden Sign",
    "category": "Signage",
    "description": "A rustic wooden sign suspended by metal chains.",
    "settings": {
        "dots_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "dots_color": "#3E2723",
        "bg_color": "#ffffff",
        "frame_style": "hanging_sign",
        "frame_color": "#8B5A2B",
        "text_style": "none"
    }
}
];
