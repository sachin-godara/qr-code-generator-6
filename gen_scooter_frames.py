import sys
import os

# Add the backend dir to path
sys.path.append(r"f:\Project 001\qr code generator 6\backend")

from services.qr_service import generate_qr_image

templates = [
  {
    "name": "Dynamic Pop",
    "settings": {
      "dots_style": "classy",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#2962FF",
      "dots_color_end": "#2962FF",
      "bg_color": "#F0F4FF",
      "gradient_type": "None",
      "eye_color": "#2962FF",
      "eyeball_color": "#2962FF",
      "frame_style": "none",
      "text_style": "speed_lines_frame",
      "frame_text": "¡Escaneame!",
      "frame_color": "#2962FF",
      "frame_text_color": "#ffffff",
      "preset_logo": "None"
    }
  },
  {
    "name": "Cheers Pint",
    "settings": {
      "dots_style": "rounded",
      "eye_frame_style": "rounded",
      "eyeball_style": "rounded",
      "dots_color": "#8b8b8b",
      "dots_color_end": "#8b8b8b",
      "bg_color": "#e6e6fa",
      "gradient_type": "None",
      "eye_color": "#8b8b8b",
      "eyeball_color": "#8b8b8b",
      "frame_style": "none",
      "text_style": "beer_mug",
      "frame_text": "¡Escaneame!",
      "frame_color": "#8b8b8b",
      "frame_text_color": "#ffffff",
      "preset_logo": "None"
    }
  },
  {
    "name": "Speedy Delivery",
    "settings": {
      "dots_style": "diamond",
      "eye_frame_style": "rounded",
      "eyeball_style": "diamond",
      "dots_color": "#8b8b8b",
      "dots_color_end": "#8b8b8b",
      "bg_color": "#e6e6fa",
      "gradient_type": "None",
      "eye_color": "#8b8b8b",
      "eyeball_color": "#8b8b8b",
      "frame_style": "none",
      "text_style": "delivery_scooter",
      "frame_text": "¡Escaneame!",
      "frame_color": "#8b8b8b",
      "frame_text_color": "#ffffff",
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
