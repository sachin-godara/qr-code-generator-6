import type { QRSettings } from '../types/qr';

export interface Template {
  name: string;
  description?: string;
  settings: Partial<QRSettings>;
}

export const PRESET_TEMPLATES: Template[] = [
  {
    "name": "Blue Speech Bubble",
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
    "settings": {
      "dots_style": "circle",
      "eye_frame_style": "circle",
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
    "settings": {
      "dots_style": "circle",
      "eye_frame_style": "circle",
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
    "settings": {
      "dots_style": "circle",
      "eye_frame_style": "circle",
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
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "circle",
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
    "settings": {
      "dots_style": "diamond",
      "eye_frame_style": "diamond",
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
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "circle",
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
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "circle",
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
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "circle",
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
  }
];
