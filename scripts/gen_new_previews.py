import sys
import os

# Add the backend dir to path
sys.path.append(r"f:\Project 001\qr code generator 6\backend")

from services.qr_service import generate_qr_image

templates = [
  {
    "name": "Cyberpunk Matrix",
    "settings": {
      "dots_style": "pixel_art",
      "eye_frame_style": "circuit_trace",
      "eyeball_style": "circuit_trace",
      "dots_color": "#00FF41",
      "dots_color_end": "#008F11",
      "bg_color": "#0D0208",
      "gradient_type": "Diagonal (TL to BR)",
      "eye_color": "#00FF41",
      "eyeball_color": "#00FF41",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None",
      "effect_shadow": "neon",
      "effect_shadow_color": "#00FF41",
      "canvas_radius": 12
    }
  },
  {
    "name": "Soft Mint Wellness",
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
    "name": "Fintech Cyber Neon",
    "settings": {
      "dots_style": "network_nodes",
      "eye_frame_style": "hex_nut",
      "eyeball_style": "gear",
      "dots_color": "#00E5FF",
      "dots_color_end": "#2979FF",
      "bg_color": "#0A0A0A",
      "gradient_type": "Radial",
      "eye_color": "#FF007F",
      "eyeball_color": "#FF007F",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Elegant Wedding RSVP",
    "settings": {
      "dots_style": "crossstitch",
      "eye_frame_style": "crystal_frame",
      "eyeball_style": "deckled",
      "dots_color": "#8B7355",
      "dots_color_end": "#CDBA96",
      "bg_color": "#FFFAFA",
      "gradient_type": "Solid Color",
      "eye_color": "#8B7355",
      "eyeball_color": "#8B7355",
      "frame_style": "none",
      "text_style": "none",
      "preset_logo": "None"
    }
  },
  {
    "name": "Monochic Studio",
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
  }
]

out_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews\templates"
os.makedirs(out_dir, exist_ok=True)

for t in templates:
    name = t["name"].lower().replace(" ", "_")
    settings = t["settings"]
    settings["data"] = "https://example.com"
    try:
        io_bytes = generate_qr_image("https://example.com", settings)
        out_path = os.path.join(out_dir, f"{name}.png")
        with open(out_path, "wb") as f:
            f.write(io_bytes.getvalue())
        print(f"Generated {out_path}")
    except Exception as e:
        print(f"Failed to generate {name}: {e}")
