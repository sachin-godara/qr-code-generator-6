import os
import sys
from PIL import Image

sys.path.insert(0, os.path.abspath('backend'))
from services.qr_service import generate_qr_image

def generate_frame_previews():
    frame_styles = [
        'border', 'brackets', 'chalkboard', 'circle', 'circle_sprinkles',
        'circle_sunburst', 'dotted_border', 'double_border', 'hexagon', 'none', 'phone_frame'
    ]
    
    text_styles = [
        'app_store_badge', 'award_badge', 'bottom_tab', 'bottom_text', 'browser_window',
        'chat_bubble', 'chef_hat', 'coffee_cup', 'coffee_mug', 'diploma_scroll',
        'drink_cup', 'floating_badge', 'food_dome', 'game_console', 'laptop_mockup',
        'magic_mirror', 'map_pin', 'none', 'open_book', 'padlock', 'pizza_slice', 'polaroid_photo', 'price_tag',
        'retro_tv_set', 'ribbon_banner', 'rsvp_envelope', 'security_shield', 'shipping_label', 'shopping_bag',
        'speech_bubble', 'speech_bubble_top', 'thought_cloud', 'ticket_stub', 'ufo_abduction', 'vertical_card_badge', 'vertical_ribbon_left', 'vertical_ribbon_right', 'vertical_side_badge_left', 'vertical_side_badge_right', 'vintage_stamp', 'vinyl_record'
    ]
    
    out_dir_frames = "frontend/public/previews/frames"
    os.makedirs(out_dir_frames, exist_ok=True)
    
    out_dir_text = "frontend/public/previews/text_styles"
    os.makedirs(out_dir_text, exist_ok=True)
    
    print("Generating layout frame previews...")
    for style in frame_styles:
        try:
            req_data = {
                "dots_color": "#000000",
                "bg_color": "#ffffff",
                "frame_style": style,
                "frame_color": "#0050cb",
                "frame_padding": 20,
                "frame_radius": 15,
                "frame_border": 10
            }
            buf = generate_qr_image("https://github.com", req_data)
            img = Image.open(buf)
            img = img.resize((200, 200), Image.Resampling.LANCZOS)
            img.save(os.path.join(out_dir_frames, f"{style}.png"))
            print(f"Generated Frame: {style}.png")
        except Exception as e:
            print(f"Error generating frame {style}: {e}")

    print("\nGenerating text style previews...")
    for style in text_styles:
        try:
            req_data = {
                "dots_color": "#000000",
                "bg_color": "#ffffff",
                "text_style": style,
                "frame_color": "#0050cb",
                "frame_text": "SCAN ME",
                "frame_text_color": "#ffffff",
                "frame_text_size": 40,
                "frame_padding": 20,
                "frame_radius": 15,
                "frame_border": 10
            }
            buf = generate_qr_image("https://github.com", req_data)
            img = Image.open(buf)
            img = img.resize((200, 200), Image.Resampling.LANCZOS)
            img.save(os.path.join(out_dir_text, f"{style}.png"))
            print(f"Generated Text Style: {style}.png")
        except Exception as e:
            print(f"Error generating text style {style}: {e}")

if __name__ == "__main__":
    generate_frame_previews()
