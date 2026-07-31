import sys
import os

# Add the backend dir to path
sys.path.append(r"f:\Project 001\qr code generator 6\backend")

from services.qr_service import generate_qr_image

templates = [
  {
    "name": "Sunset Gradient Glow",
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
