import sys
import os

# Add the backend dir to path
sys.path.append(r"f:\Project 001\qr code generator 6\backend")

from services.qr_service import generate_qr_image

templates = [
  {
    "name": "Special Delivery",
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
