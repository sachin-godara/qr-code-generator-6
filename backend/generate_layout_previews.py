import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.qr_service import generate_qr_image

styles = [
    'film_strip', 'ticket_cutout', 'drop_shadow_card', 'coupon_dashed', 'hanging_sign', 'monitor_screen', 'storefront_awning', 'modern_polaroid'
]

output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'public', 'previews', 'frames')
os.makedirs(output_dir, exist_ok=True)

for style in styles:
    print(f"Generating preview for {style}...")
    params = {
        "text_style": "none",
        "frame_style": style,
        "frame_text": "SCAN ME",
        "frame_color": "#0050cb",
        "frame_text_color": "#ffffff",
        "frame_text_size": 60,
        "frame_padding": 30,
        "frame_radius": 25,
        "frame_border": 15,
        "font_name": "Outfit-Bold.ttf",
        
        "dots_color": "#000000",
        "bg_color": "#ffffff",
        "bg_transparent": False,
        "dots_style": "square",
        "eye_color": "#000000",
        "eyeball_color": "#000000",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "logo_image": None,
        "preset_logo": "None",
        "error_correction": "H",
        "quiet_zone": 4,
        "effect_shadow": "none"
    }
    
    img_io = generate_qr_image("https://example.com", params)
    output_path = os.path.join(output_dir, f"{style}.png")
    with open(output_path, "wb") as f:
        f.write(img_io.getvalue())

print("Previews generated successfully!")
