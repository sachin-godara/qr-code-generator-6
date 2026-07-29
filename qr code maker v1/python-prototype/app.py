import streamlit as st
import io
import os
import requests
import base64
import random
from PIL import Image
import importlib
import qr_engine
import frame_engine
importlib.reload(qr_engine)
importlib.reload(frame_engine)
from qr_engine import generate_styled_qr, generate_svg_qr
from frame_engine import apply_frame

# Download premium Google Fonts at startup
def download_font_file(filename, url):
    if not os.path.exists(filename):
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                with open(filename, "wb") as f:
                    f.write(r.content)
        except:
            pass

download_font_file("Outfit-Bold.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/Outfit%5Bwght%5D.ttf")
download_font_file("PlayfairDisplay-Bold.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf")
download_font_file("CourierPrime-Bold.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/courierprime/CourierPrime-Bold.ttf")


TEMPLATES = {
    "Custom / None": {},
    "Blue Speech Bubble": {
        "dot_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "fill_color": "#0F52BA",
        "back_color": "#FFFFFF",
        "eye_color": "#0F52BA",
        "layout_frame": "none",
        "text_frame": "speech_bubble",
        "frame_text_val": "DOWNLOAD",
        "frame_color": "#0F52BA",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 70,
        "frame_padding": 20,
        "frame_radius": 20,
        "frame_border": 10,
    },
    "Green Leaf": {
        "dot_style": "rounded",
        "eye_frame_style": "leaf",
        "eyeball_style": "leaf",
        "fill_color": "#2E3B3E",
        "back_color": "#FFFFFF",
        "eye_color": "#2E8B57",
        "layout_frame": "border",
        "text_frame": "bottom_tab",
        "frame_text_val": "SCAN ME",
        "frame_color": "#2E8B57",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 60,
        "frame_padding": 30,
        "frame_radius": 25,
        "frame_border": 15,
    },
    "Pink Dotted": {
        "dot_style": "circle",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#FF69B4",
        "back_color": "#FFFFFF",
        "eye_color": "#FF1493",
        "layout_frame": "border",
        "text_frame": "bottom_tab",
        "frame_text_val": "VISIT US",
        "frame_color": "#FF1493",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 60,
        "frame_padding": 25,
        "frame_radius": 20,
        "frame_border": 12,
    },
    "Blue Circle Sprinkles": {
        "dot_style": "circle",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#007FFF",
        "back_color": "#FFFFFF",
        "eye_color": "#007FFF",
        "layout_frame": "circle_sprinkles",
        "text_frame": "none",
        "frame_text_val": "HELLO",
        "frame_color": "#007FFF",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 40,
        "frame_padding": 40,
        "frame_radius": 15,
        "frame_border": 15,
    },
    "Purple Rate Us Tab": {
        "dot_style": "rounded",
        "eye_frame_style": "leaf",
        "eyeball_style": "leaf",
        "fill_color": "#4B0082",
        "back_color": "#FFFFFF",
        "eye_color": "#8A2BE2",
        "layout_frame": "border",
        "text_frame": "bottom_tab",
        "frame_text_val": "RATE US",
        "frame_color": "#8A2BE2",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 65,
        "frame_padding": 30,
        "frame_radius": 25,
        "frame_border": 15,
    },
    "Blue Juice Cup": {
        "dot_style": "circle",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#1E90FF",
        "back_color": "#FFFFFF",
        "eye_color": "#0052CC",
        "layout_frame": "none",
        "text_frame": "drink_cup",
        "frame_text_val": "FRESH JUICE",
        "frame_color": "#1E90FF",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 55,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Red Ribbon Banner": {
        "dot_style": "rounded",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "fill_color": "#B22222",
        "back_color": "#FFFFFF",
        "eye_color": "#B22222",
        "layout_frame": "none",
        "text_frame": "ribbon_banner",
        "frame_text_val": "APPROVED",
        "frame_color": "#B22222",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 50,
        "frame_padding": 20,
        "frame_radius": 20,
        "frame_border": 8,
    },
    "Warm Coffee Cup": {
        "dot_style": "rounded",
        "eye_frame_style": "leaf",
        "eyeball_style": "leaf",
        "fill_color": "#6F4E37",
        "back_color": "#FFFFFF",
        "eye_color": "#5C4033",
        "layout_frame": "none",
        "text_frame": "coffee_cup",
        "frame_text_val": "COFFEE TIME",
        "frame_color": "#6F4E37",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 48,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Food Cloche Dome": {
        "dot_style": "rounded",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#2C3E50",
        "back_color": "#FFFFFF",
        "eye_color": "#16A085",
        "layout_frame": "none",
        "text_frame": "food_dome",
        "frame_text_val": "VIEW MENU",
        "frame_color": "#16A085",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 55,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Orange Shopping Bag": {
        "dot_style": "rounded",
        "eye_frame_style": "shield",
        "eyeball_style": "shield",
        "fill_color": "#FF4500",
        "back_color": "#FFFFFF",
        "eye_color": "#FF4500",
        "layout_frame": "none",
        "text_frame": "shopping_bag",
        "frame_text_val": "SHOP NOW",
        "frame_color": "#FF4500",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 55,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "VIP Ticket Stub": {
        "dot_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "fill_color": "#D4AF37",
        "back_color": "#FFFFFF",
        "eye_color": "#111111",
        "layout_frame": "none",
        "text_frame": "ticket_stub",
        "frame_text_val": "VIP PASS",
        "frame_color": "#111111",
        "frame_text_color": "#D4AF37",
        "frame_text_size": 55,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Retro Polaroid": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#2C3E50",
        "back_color": "#FFFFFF",
        "eye_color": "#2C3E50",
        "layout_frame": "none",
        "text_frame": "polaroid_photo",
        "frame_text_val": "SAY CHEESE",
        "frame_color": "#E74C3C",
        "frame_text_color": "#2C3E50",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Vantage Price Tag": {
        "dot_style": "diamond",
        "eye_frame_style": "diamond",
        "eyeball_style": "diamond",
        "fill_color": "#8B4513",
        "back_color": "#FFFFFF",
        "eye_color": "#8B4513",
        "layout_frame": "none",
        "text_frame": "price_tag",
        "frame_text_val": "ONLY $29.99",
        "frame_color": "#8B4513",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 60,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Web Browser": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#3F51B5",
        "back_color": "#FFFFFF",
        "eye_color": "#3F51B5",
        "layout_frame": "none",
        "text_frame": "browser_window",
        "frame_text_val": "VISIT WEBSITE",
        "frame_color": "#3F51B5",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 50,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Coffee Mug Frame": {
        "dot_style": "rounded",
        "eye_frame_style": "leaf",
        "eyeball_style": "leaf",
        "fill_color": "#5D4037",
        "back_color": "#FFFFFF",
        "eye_color": "#5D4037",
        "layout_frame": "none",
        "text_frame": "coffee_mug",
        "frame_text_val": "ORDER NOW",
        "frame_color": "#5D4037",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 50,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Best Seller Badge": {
        "dot_style": "rounded",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#D4AF37",
        "back_color": "#FFFFFF",
        "eye_color": "#D4AF37",
        "layout_frame": "none",
        "text_frame": "award_badge",
        "frame_text_val": "#1 BEST SELLER",
        "frame_color": "#D4AF37",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Postage Stamp": {
        "dot_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "fill_color": "#8E44AD",
        "back_color": "#FFFFFF",
        "eye_color": "#8E44AD",
        "layout_frame": "none",
        "text_frame": "vintage_stamp",
        "frame_text_val": "FIRST CLASS",
        "frame_color": "#8E44AD",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 50,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Support Chat": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#27AE60",
        "back_color": "#FFFFFF",
        "eye_color": "#27AE60",
        "layout_frame": "none",
        "text_frame": "chat_bubble",
        "frame_text_val": "CHAT WITH US",
        "frame_color": "#27AE60",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Vinyl Soundtrack": {
        "dot_style": "rounded",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#E67E22",
        "back_color": "#FFFFFF",
        "eye_color": "#E67E22",
        "layout_frame": "none",
        "text_frame": "vinyl_record",
        "frame_text_val": "PLAY SOUNDTRACK",
        "frame_color": "#E67E22",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Verified Shield": {
        "dot_style": "rounded",
        "eye_frame_style": "shield",
        "eyeball_style": "shield",
        "fill_color": "#2980B9",
        "back_color": "#FFFFFF",
        "eye_color": "#2980B9",
        "layout_frame": "none",
        "text_frame": "security_shield",
        "frame_text_val": "VERIFIED ACCESS",
        "frame_color": "#2980B9",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Laptop Workspace": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#2C3E50",
        "back_color": "#FFFFFF",
        "eye_color": "#2C3E50",
        "layout_frame": "none",
        "text_frame": "laptop_mockup",
        "frame_text_val": "OPEN WORKSPACE",
        "frame_color": "#7F8C8D",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Recipe Chef": {
        "dot_style": "rounded",
        "eye_frame_style": "leaf",
        "eyeball_style": "leaf",
        "fill_color": "#D35400",
        "back_color": "#FFFFFF",
        "eye_color": "#D35400",
        "layout_frame": "none",
        "text_frame": "chef_hat",
        "frame_text_val": "BON APPETIT",
        "frame_color": "#D35400",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Retro Console": {
        "dot_style": "square",
        "eye_frame_style": "square",
        "eyeball_style": "square",
        "fill_color": "#4A4A4A",
        "back_color": "#FFFFFF",
        "eye_color": "#4A4A4A",
        "layout_frame": "none",
        "text_frame": "game_console",
        "frame_text_val": "START GAME",
        "frame_color": "#4A4A4A",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Destination Pin": {
        "dot_style": "rounded",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#E74C3C",
        "back_color": "#FFFFFF",
        "eye_color": "#E74C3C",
        "layout_frame": "none",
        "text_frame": "map_pin",
        "frame_text_val": "VIEW LOCATION",
        "frame_color": "#E74C3C",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Envelope RSVP": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#8B6508",
        "back_color": "#FFFFFF",
        "eye_color": "#8B6508",
        "layout_frame": "none",
        "text_frame": "rsvp_envelope",
        "frame_text_val": "RSVP HERE",
        "frame_color": "#8B6508",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Academic Diploma": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#0F2027",
        "back_color": "#FFFFFF",
        "eye_color": "#0F2027",
        "layout_frame": "none",
        "text_frame": "diploma_scroll",
        "frame_text_val": "VIEW CERTIFICATE",
        "frame_color": "#0F2027",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 40,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Pizza Crust": {
        "dot_style": "rounded",
        "eye_frame_style": "circle",
        "eyeball_style": "circle",
        "fill_color": "#E67E22",
        "back_color": "#FFFFFF",
        "eye_color": "#E67E22",
        "layout_frame": "none",
        "text_frame": "pizza_slice",
        "frame_text_val": "ORDER PIZZA",
        "frame_color": "#E67E22",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    },
    "Thought Cloud": {
        "dot_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "rounded",
        "fill_color": "#2980B9",
        "back_color": "#FFFFFF",
        "eye_color": "#2980B9",
        "layout_frame": "none",
        "text_frame": "thought_cloud",
        "frame_text_val": "DREAM BIG",
        "frame_color": "#2980B9",
        "frame_text_color": "#FFFFFF",
        "frame_text_size": 45,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 8,
    }
}

# Initialize session state keys
default_values = {
    "data_val": "https://example.com",
    "dot_style": "square",
    "eye_frame_style": "square",
    "eyeball_style": "square",
    "fill_color": "#000000",
    "back_color": "#FFFFFF",
    "eye_color": "#000000",
    "layout_frame": "none",
    "text_frame": "none",
    "frame_text_val": "VISIT OUR MENU",
    "top_text_val": "SCAN ME",
    "frame_color": "#000000",
    "frame_text_color": "#FFFFFF",
    "frame_text_size": 60,
    "frame_padding": 30,
    "frame_radius": 25,
    "frame_border": 15,
    "gradient_type": "Solid Color",
    "fill_color_end": "#000000",
    "preset_logo": "None",
    "logo_card_shape": "None",
    "logo_card_padding": 10,
    "logo_size_ratio": 0.22,
    "resolution": 30,
    "resolution_width": 1024,
    "font_style": "Outfit (Modern)",
    "prev_preset": "Custom / None"
}

for k, v in default_values.items():
    if k not in st.session_state:
        st.session_state[k] = v

st.set_page_config(page_title="Premium QR Code Maker", page_icon="🔳", layout="wide")

# Maps for human-readable dropdown labels
DOT_SHAPE_OPTIONS = {
    "Square": "square",
    "Rounded": "rounded",
    "Circle": "circle",
    "Gapped": "gapped",
    "Vertical Bars": "vertical_bars",
    "Horizontal Bars": "horizontal_bars",
    "Diamond": "diamond",
    "Ring": "ring",
    "Star": "star",
    "Flower Cut": "flower_cut",
    "Clover": "clover",
    "Plus / Cross": "plus",
    "Rounded Plus": "rounded_plus",
    "Heart": "heart",
    "Sheared": "sheared",
    "Bevel": "bevel",
    "Fishtail": "fishtail",
    "Squircle": "squircle",
    "Hexagon": "hexagon",
    "Target Bullseye": "target_bullseye",
    "Diamond Target": "diamond_target",
    "Octagon": "octagon",
    "Dotted Cross": "dotted_cross",
    "Arrow": "arrow",
    "Gear": "gear_dot",
    "Hourglass": "hourglass",
    "Pinwheel": "pinwheel",
}

EYE_FRAME_OPTIONS = {
    "Square": "square",
    "Rounded Square": "rounded",
    "Circle": "circle",
    "Leaf (Top-Left)": "leaf",
    "Leaf (Top-Right)": "leaf_opposite",
    "Droplet (Top-Left)": "droplet_tl",
    "Droplet (Top-Right)": "droplet_tr",
    "Droplet (Bottom-Left)": "droplet_bl",
    "Droplet (Bottom-Right)": "droplet_br",
    "Shield": "shield",
    "Shield Flipped": "shield_opposite",
    "Left Rounded": "left_rounded",
    "Right Rounded": "right_rounded",
    "Square with Circle Cut": "solid_square_circle_cut",
    "Sheared": "sheared",
    "Octagon": "octagon",
    "Corner Brackets": "corner_brackets",
    "Double Ring": "double_ring",
    "Dotted Circle": "dotted_circle",
    "Hexagon": "hexagon",
    "Diamond": "diamond",
    "Star": "star",
    "Gear": "gear",
}

EYEBALL_OPTIONS = {
    "Square": "square",
    "Rounded Square": "rounded",
    "Circle": "circle",
    "Leaf (Top-Left)": "leaf",
    "Leaf (Top-Right)": "leaf_opposite",
    "Droplet (Top-Left)": "droplet_tl",
    "Droplet (Top-Right)": "droplet_tr",
    "Droplet (Bottom-Left)": "droplet_bl",
    "Droplet (Bottom-Right)": "droplet_br",
    "Shield": "shield",
    "Shield Flipped": "shield_opposite",
    "Left Rounded": "left_rounded",
    "Right Rounded": "right_rounded",
    "Sheared": "sheared",
    "Gear": "gear",
    "Star": "star",
    "Diamond": "diamond",
    "Flower Cut": "flower_cut",
    "Clover": "clover",
    "Plus / Cross": "plus",
    "Flower": "flower",
    "Heart": "heart",
    "Octagon": "octagon",
    "Corner Brackets": "corner_brackets",
    "Target Bullseye": "target_bullseye",
    "Hexagon": "hexagon",
}

LAYOUT_FRAME_OPTIONS = {
    "None": "none",
    "Simple Border": "border",
    "Double Border": "double_border",
    "Circle Frame": "circle",
    "Circle with Sunburst": "circle_sunburst",
    "Circle with Sprinkles": "circle_sprinkles",
    "Dotted Border": "dotted_border",
    "Corner Brackets": "brackets",
    "Retro Stamp": "retro_stamp",
    "Phone Frame": "phone_frame",
    "Hexagon Frame": "hexagon",
}

TEXT_FRAME_OPTIONS = {
    "None": "none",
    "Text — Top": "top_text",
    "Text — Bottom": "bottom_text",
    "Text — Top & Bottom": "top_bottom_text",
    "Speech Bubble (Bottom)": "speech_bubble",
    "Speech Bubble (Top)": "speech_bubble_top",
    "Bottom Tab": "bottom_tab",
    "Side Tab (Left)": "side_tab",
    "Side Tab (Right)": "right_tab",
    "Floating Badge": "floating_badge",
    "Drink Cup": "drink_cup",
    "Ribbon Banner": "ribbon_banner",
    "Coffee Cup": "coffee_cup",
    "Food Dome / Cloche": "food_dome",
    "Shopping Bag": "shopping_bag",
    "Ticket Stub": "ticket_stub",
    "Polaroid Photo": "polaroid_photo",
    "Price Tag": "price_tag",
    "Browser Window": "browser_window",
    "Coffee Mug": "coffee_mug",
    "Award Badge": "award_badge",
    "Vintage Stamp": "vintage_stamp",
    "Chat Bubble": "chat_bubble",
    "Vinyl Record": "vinyl_record",
    "Security Shield": "security_shield",
    "Laptop Mockup": "laptop_mockup",
    "Chef Hat": "chef_hat",
    "Game Console": "game_console",
    "Map Pin": "map_pin",
    "RSVP Envelope": "rsvp_envelope",
    "Diploma Scroll": "diploma_scroll",
    "Pizza Slice": "pizza_slice",
    "Thought Cloud": "thought_cloud",
}

# Reverse maps: internal value → human label
DOT_SHAPE_REVERSE = {v: k for k, v in DOT_SHAPE_OPTIONS.items()}
EYE_FRAME_REVERSE = {v: k for k, v in EYE_FRAME_OPTIONS.items()}
EYEBALL_REVERSE = {v: k for k, v in EYEBALL_OPTIONS.items()}
LAYOUT_FRAME_REVERSE = {v: k for k, v in LAYOUT_FRAME_OPTIONS.items()}
TEXT_FRAME_REVERSE = {v: k for k, v in TEXT_FRAME_OPTIONS.items()}

# Custom CSS — Premium dark glassmorphism design system
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

    /* ── Base ────────────────────────────────────────────────── */
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif !important;
    }

    /* Aurora animated background */
    .stApp {
        background: radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at 60% 80%, rgba(99,102,241,0.06) 0%, transparent 50%);
        background-attachment: fixed;
    }

    /* ── Hero Banner ─────────────────────────────────────────── */
    .qr-hero {
        position: relative;
        background: linear-gradient(135deg, #1e1040 0%, #2d1b69 40%, #1a1040 100%);
        border-radius: 20px;
        padding: 32px 36px 28px;
        margin-bottom: 28px;
        overflow: hidden;
        border: 1px solid rgba(168,85,247,0.25);
        box-shadow: 0 0 60px rgba(124,58,237,0.15), 0 4px 24px rgba(0,0,0,0.4);
    }
    .qr-hero::before {
        content: "";
        position: absolute;
        top: -80px; right: -80px;
        width: 320px; height: 320px;
        background: radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%);
        animation: aurora-drift 6s ease-in-out infinite alternate;
        border-radius: 50%;
        pointer-events: none;
    }
    .qr-hero::after {
        content: "";
        position: absolute;
        bottom: -60px; left: 30%;
        width: 220px; height: 220px;
        background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
        animation: aurora-drift 9s ease-in-out infinite alternate-reverse;
        border-radius: 50%;
        pointer-events: none;
    }
    @keyframes aurora-drift {
        0%   { transform: translate(0px, 0px) scale(1); }
        100% { transform: translate(30px, -20px) scale(1.15); }
    }
    .qr-hero-inner { position: relative; z-index: 1; }
    .qr-hero .badge-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
    .qr-hero .badge {
        display: inline-flex; align-items: center; gap: 5px;
        background: rgba(168,85,247,0.2);
        border: 1px solid rgba(168,85,247,0.4);
        border-radius: 20px;
        padding: 4px 13px;
        font-size: 0.72rem;
        font-weight: 700;
        color: #d8b4fe;
        letter-spacing: 0.8px;
        text-transform: uppercase;
    }
    .qr-hero .badge-green {
        background: rgba(34,197,94,0.15);
        border-color: rgba(34,197,94,0.35);
        color: #86efac;
    }
    .qr-hero h1 {
        color: #ffffff !important;
        font-size: 2.4rem !important;
        font-weight: 800 !important;
        margin: 0 0 8px 0 !important;
        letter-spacing: -1px;
        line-height: 1.15 !important;
    }
    .qr-hero h1 span {
        background: linear-gradient(90deg, #c084fc, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .qr-hero .subtitle {
        color: rgba(255,255,255,0.65) !important;
        font-size: 1rem !important;
        margin: 0 0 18px 0 !important;
        font-weight: 400;
    }
    .hero-stats { display: flex; gap: 28px; flex-wrap: wrap; }
    .hero-stat { text-align: left; }
    .hero-stat .stat-value {
        color: #e9d5ff;
        font-size: 1.3rem;
        font-weight: 800;
        line-height: 1;
        display: block;
    }
    .hero-stat .stat-label {
        color: rgba(255,255,255,0.45);
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    .hero-divider {
        width: 1px; height: 36px;
        background: rgba(255,255,255,0.12);
        align-self: center;
    }

    /* ── Tabs ────────────────────────────────────────────────── */
    .stTabs [data-baseweb="tab-list"] {
        gap: 4px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        padding: 5px;
        border-radius: 14px;
        margin-bottom: 1.2rem;
    }
    .stTabs [data-baseweb="tab"] {
        height: 40px;
        background: transparent;
        border-radius: 10px;
        color: rgba(255,255,255,0.55);
        font-weight: 600;
        font-size: 0.85rem;
        border: none;
        padding: 0 16px;
        transition: all 0.2s ease;
    }
    .stTabs [data-baseweb="tab"]:hover {
        color: rgba(255,255,255,0.9);
        background: rgba(255,255,255,0.07);
    }
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, rgba(124,58,237,0.6), rgba(99,102,241,0.5)) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 12px rgba(124,58,237,0.4) !important;
    }
    .stTabs [data-baseweb="tab-highlight"] { display: none !important; }
    .stTabs [data-baseweb="tab-border"] { display: none !important; }

    /* ── Section Cards ───────────────────────────────────────── */
    .section-card {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 18px 20px;
        margin-bottom: 16px;
    }
    .section-card-title {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: #a78bfa;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .section-card-title::after {
        content: "";
        flex: 1;
        height: 1px;
        background: rgba(167,139,250,0.2);
    }

    /* ── Buttons ─────────────────────────────────────────────── */
    div.stButton > button {
        background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%) !important;
        color: #ffffff !important;
        border-radius: 12px !important;
        border: none !important;
        padding: 0.75rem 1.4rem !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
        letter-spacing: 0.2px !important;
        box-shadow: 0 4px 16px rgba(124,58,237,0.35) !important;
        transition: all 0.2s ease !important;
        width: 100% !important;
    }
    div.stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(124,58,237,0.5) !important;
        background: linear-gradient(135deg, #8b5cf6 0%, #818cf8 100%) !important;
        color: #ffffff !important;
    }
    div.stButton > button:active {
        transform: translateY(0px) !important;
        box-shadow: 0 2px 8px rgba(124,58,237,0.3) !important;
    }
    div[data-testid="stDownloadButton"] > button {
        background: rgba(255,255,255,0.07) !important;
        border: 1px solid rgba(255,255,255,0.12) !important;
        color: rgba(255,255,255,0.88) !important;
        border-radius: 12px !important;
        padding: 0.7rem 1rem !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        box-shadow: none !important;
        transition: all 0.2s ease !important;
        width: 100% !important;
    }
    div[data-testid="stDownloadButton"] > button:hover {
        background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(99,102,241,0.3)) !important;
        border-color: rgba(168,85,247,0.5) !important;
        color: #ffffff !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 16px rgba(124,58,237,0.25) !important;
    }

    /* ── Preview Panel ───────────────────────────────────────── */
    .preview-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
    }
    .preview-header h3 {
        margin: 0 !important;
        font-size: 1.1rem !important;
        font-weight: 700 !important;
        color: #f3f4f6 !important;
    }
    .preview-live-dot {
        width: 8px; height: 8px;
        background: #22c55e;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(34,197,94,0.7);
        animation: pulse-dot 2s ease infinite;
        flex-shrink: 0;
    }
    @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
    }
    .preview-subtitle {
        font-size: 0.78rem;
        color: rgba(255,255,255,0.38);
        margin-bottom: 16px;
        padding-left: 18px;
    }
    .qr-canvas-wrap {
        background-color: #ffffff;
        background-image:
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
        background-size: 16px 16px;
        background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        border-radius: 16px;
        padding: 10px;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .qr-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        background: rgba(255,255,255,0.03);
        border: 2px dashed rgba(167,139,250,0.25);
        border-radius: 20px;
        text-align: center;
    }
    .qr-empty-icon {
        font-size: 3.5rem;
        margin-bottom: 16px;
        animation: float-icon 3s ease-in-out infinite;
    }
    @keyframes float-icon {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    .qr-empty-title {
        color: rgba(255,255,255,0.65);
        font-size: 1.05rem;
        font-weight: 600;
        margin-bottom: 6px;
    }
    .qr-empty-sub { color: rgba(255,255,255,0.35); font-size: 0.82rem; }

    /* ── Download section ────────────────────────────────────── */
    .download-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 20px 0 12px;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #a78bfa;
    }
    .download-header::before, .download-header::after {
        content: "";
        flex: 1;
        height: 1px;
        background: rgba(167,139,250,0.2);
    }

    /* ── Inputs ──────────────────────────────────────────────── */
    [data-baseweb="select"] > div,
    [data-baseweb="input"] > div {
        border-radius: 10px !important;
        border-color: rgba(255,255,255,0.1) !important;
        transition: border-color 0.2s ease !important;
    }
    [data-baseweb="select"] > div:focus-within,
    [data-baseweb="input"] > div:focus-within {
        border-color: rgba(168,85,247,0.6) !important;
        box-shadow: 0 0 0 3px rgba(168,85,247,0.12) !important;
    }

    /* ── Misc ────────────────────────────────────────────────── */
    .section-label {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #a78bfa;
        margin-bottom: 6px;
        margin-top: 4px;
    }
    h2, h3 { font-weight: 700 !important; letter-spacing: -0.3px; }
    .stCaption { color: rgba(255,255,255,0.4) !important; font-size: 0.75rem !important; text-align: center; }
</style>
""", unsafe_allow_html=True)


# Hero header
st.markdown("""
<div class="qr-hero">
  <div class="qr-hero-inner">
    <div class="badge-row">
      <span class="badge">✦ Premium QR Maker</span>
      <span class="badge badge-green">⬡ v3.0</span>
    </div>
    <h1>QR Code <span>Studio</span></h1>
    <p class="subtitle">Design stunning QR codes — custom shapes, gradients, brand logos &amp; premium frames.</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="stat-value">30+</span>
        <span class="stat-label">Dot Styles</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-stat">
        <span class="stat-value">25+</span>
        <span class="stat-label">Frame Templates</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-stat">
        <span class="stat-value">4K</span>
        <span class="stat-label">Export Quality</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-stat">
        <span class="stat-value">6</span>
        <span class="stat-label">QR Types</span>
      </div>
    </div>
  </div>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns([1.1, 1])

with col1:
    st.markdown('<div class="section-card-title">⬡ Quick Presets</div>', unsafe_allow_html=True)
    preset_col, surprise_col, reset_col = st.columns([5, 1.5, 1.5])
    with preset_col:
        preset = st.selectbox("🗂️ Template", list(TEMPLATES.keys()), label_visibility="collapsed")
    with surprise_col:
        st.markdown("<div style='height:4px'></div>", unsafe_allow_html=True)
        if st.button("🎲", help="Surprise Me — apply a random preset!"):
            non_custom = [k for k in TEMPLATES.keys() if k != "Custom / None"]
            random_preset = random.choice(non_custom)
            st.session_state["prev_preset"] = ""
            for k, v in TEMPLATES[random_preset].items():
                st.session_state[k] = v
            st.rerun()
    with reset_col:
        st.markdown("<div style='height:4px'></div>", unsafe_allow_html=True)
        if st.button("↺", help="Reset all settings to defaults"):
            for k, v in default_values.items():
                st.session_state[k] = v
            st.rerun()

    if preset != st.session_state["prev_preset"]:
        st.session_state["prev_preset"] = preset
        if preset != "Custom / None":
            for k, v in TEMPLATES[preset].items():
                if k == "resolution":
                    st.session_state["resolution_width"] = max(256, min(4096, int(v * 34)))
                else:
                    st.session_state[k] = v
                
    tab_content, tab_style, tab_logo, tab_frame = st.tabs([
        "📝 Content", 
        "🎨 Style", 
        "🏷️ Logo", 
        "🖼️ Frame"
    ])
    
    with tab_content:
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">📝 QR Content Type</div>', unsafe_allow_html=True)
        content_type = st.selectbox("Content Type", ["Link / Text", "WiFi Network", "vCard (Contact)", "Event", "Email", "SMS"])
        st.markdown('</div>', unsafe_allow_html=True)
        
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">✍️ Content Details</div>', unsafe_allow_html=True)
        qr_data = ""
        if content_type == "Link / Text":
            qr_data = st.text_input("URL or Text", key="data_val")
        elif content_type == "WiFi Network":
            ssid = st.text_input("WiFi Name (SSID)", "MyHomeWiFi")
            password = st.text_input("Password", "SecretPass123", type="password")
            security = st.selectbox("Security Type", ["WPA/WPA2", "WEP", "Unsecured"])
            sec_type = "WPA" if security == "WPA/WPA2" else ("WEP" if security == "WEP" else "nopass")
            qr_data = f"WIFI:S:{ssid};T:{sec_type};P:{password};;"
        elif content_type == "vCard (Contact)":
            col_n1, col_n2 = st.columns(2)
            with col_n1:
                fn = st.text_input("First Name", "John")
            with col_n2:
                ln = st.text_input("Last Name", "Doe")
            org = st.text_input("Company", "Acme Corp")
            title = st.text_input("Job Title", "Manager")
            phone = st.text_input("Phone Number", "+1234567890")
            email = st.text_input("Email", "john.doe@example.com")
            url = st.text_input("Website", "https://example.com")
            qr_data = f"BEGIN:VCARD\nVERSION:3.0\nN:{ln};{fn};;;\nFN:{fn} {ln}\n"
            if org: qr_data += f"ORG:{org}\n"
            if title: qr_data += f"TITLE:{title}\n"
            if phone: qr_data += f"TEL;TYPE=CELL:{phone}\n"
            if email: qr_data += f"EMAIL:{email}\n"
            if url: qr_data += f"URL:{url}\n"
            qr_data += "END:VCARD"
        elif content_type == "Event":
            import datetime
            title = st.text_input("Event Title", "Grand Opening")
            desc = st.text_area("Description", "Welcome to our grand opening event!")
            loc = st.text_input("Location", "123 Main St, New York")
            col_d1, col_d2 = st.columns(2)
            with col_d1:
                start_date = st.date_input("Start Date", datetime.date.today())
                start_time = st.time_input("Start Time", datetime.time(9, 0))
            with col_d2:
                end_date = st.date_input("End Date", datetime.date.today())
                end_time = st.time_input("End Time", datetime.time(17, 0))
            dt_start = datetime.datetime.combine(start_date, start_time).strftime("%Y%m%dT%H%M%S")
            dt_end = datetime.datetime.combine(end_date, end_time).strftime("%Y%m%dT%H%M%S")
            qr_data = f"BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:{title}\n"
            if desc: qr_data += f"DESCRIPTION:{desc}\n"
            if loc: qr_data += f"LOCATION:{loc}\n"
            qr_data += f"DTSTART:{dt_start}\nDTEND:{dt_end}\nEND:VEVENT\nEND:VCALENDAR"
        elif content_type == "Email":
            import urllib.parse
            to = st.text_input("Send To (Email Address)", "contact@example.com")
            subject = st.text_input("Subject", "Inquiry")
            body = st.text_area("Message Body", "Hello, I am interested in your services.")
            subject_encoded = urllib.parse.quote(subject)
            body_encoded = urllib.parse.quote(body)
            qr_data = f"mailto:{to}?subject={subject_encoded}&body={body_encoded}"
        elif content_type == "SMS":
            phone = st.text_input("Phone Number", "+1234567890")
            msg = st.text_area("Message Text", "Hello, please contact me.")
            qr_data = f"SMSTO:{phone}:{msg}"
        st.markdown('</div>', unsafe_allow_html=True)
            
    with tab_style:
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">📐 Dot & Eye Shapes</div>', unsafe_allow_html=True)
        
        dot_label = st.selectbox(
            "Dot Shape",
            list(DOT_SHAPE_OPTIONS.keys()),
            index=list(DOT_SHAPE_OPTIONS.keys()).index(DOT_SHAPE_REVERSE.get(st.session_state.get("dot_style", "square"), "Square"))
        )
        dot_style = DOT_SHAPE_OPTIONS[dot_label]
        st.session_state["dot_style"] = dot_style
        
        col_es1, col_es2 = st.columns(2)
        with col_es1:
            eye_frame_label = st.selectbox(
                "Outer Eye Shape",
                list(EYE_FRAME_OPTIONS.keys()),
                index=list(EYE_FRAME_OPTIONS.keys()).index(EYE_FRAME_REVERSE.get(st.session_state.get("eye_frame_style", "square"), "Square"))
            )
            eye_frame_style = EYE_FRAME_OPTIONS[eye_frame_label]
            st.session_state["eye_frame_style"] = eye_frame_style
        with col_es2:
            eyeball_label = st.selectbox(
                "Inner Eye Style",
                list(EYEBALL_OPTIONS.keys()),
                index=list(EYEBALL_OPTIONS.keys()).index(EYEBALL_REVERSE.get(st.session_state.get("eyeball_style", "square"), "Square"))
            )
            eyeball_style = EYEBALL_OPTIONS[eyeball_label]
            st.session_state["eyeball_style"] = eyeball_style
        st.markdown('</div>', unsafe_allow_html=True)
            
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">🎨 Colors & Gradient</div>', unsafe_allow_html=True)
        gradient_type = st.selectbox("Color Fill Type", ["Solid Color", "Vertical Gradient", "Horizontal Gradient", "Radial Gradient"], key="gradient_type")
        
        col_c1, col_c2 = st.columns(2)
        with col_c1:
            fill_color = st.color_picker("QR Dot Color" + (" (Start)" if gradient_type != "Solid Color" else ""), key="fill_color")
        with col_c2:
            back_color = st.color_picker("Background Color", key="back_color")
            
        if gradient_type != "Solid Color":
            fill_color_end = st.color_picker("QR Dot Color (End)", key="fill_color_end")
        else:
            fill_color_end = st.session_state["fill_color_end"]
            
        eye_color = st.color_picker("Corner Eye Color", key="eye_color")
        st.markdown('</div>', unsafe_allow_html=True)
        
    with tab_logo:
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">🏷️ Brand Logo Settings</div>', unsafe_allow_html=True)
        preset_logo = st.selectbox("Built-in Logo", ["None", "Link", "Location", "WiFi", "Vcard", "Email", "Scan"], key="preset_logo", help="Choose a preset icon to embed in the center of your QR code.")
        logo_size_ratio = st.slider("Logo Size", min_value=0.10, max_value=0.30, value=0.22, step=0.01, key="logo_size_ratio", format="%.0f%%", help="Logo size as a percentage of the QR code width. Keep below 30% to ensure scannability.")
        logo_file = st.file_uploader("Custom Logo (PNG / JPG)", type=["png", "jpg", "jpeg"], help="Upload your own logo to embed in the center of the QR code.")
        
        logo_clear_size = 0
        remove_logo_bg = False
        logo_bg_color = "#ffffff"
        logo_bg_tolerance = 30
        
        has_any_logo = logo_file is not None or preset_logo != "None"
        if has_any_logo:
            logo_clear_size = st.slider("Dot Clearance Around Logo", min_value=-1, max_value=5, value=2, key="logo_clear_size", help="Number of extra dot rows cleared around the logo for visual clarity. Use -1 to keep all dots.")
            col_cshape, col_cpad = st.columns(2)
            with col_cshape:
                logo_card_shape = st.selectbox("Logo Card Shape", ["None", "Circle", "Rounded Square"], key="logo_card_shape", help="Draw a background card behind the logo for better contrast.")
            with col_cpad:
                logo_card_padding = st.slider("Card Padding", min_value=0, max_value=30, key="logo_card_padding", help="Padding (px) around the logo inside the card.")
        else:
            logo_card_shape = "None"
            logo_card_padding = 10
            
        if logo_file:
            remove_logo_bg = st.checkbox("Remove Logo Background Color", help="Makes a solid background color transparent so the logo blends into the QR code.")
            if remove_logo_bg:
                col_l1, col_l2 = st.columns(2)
                with col_l1:
                    logo_bg_color = st.color_picker("Color to Remove", "#FFFFFF")
                with col_l2:
                    logo_bg_tolerance = st.slider("Color Tolerance", min_value=0, max_value=150, value=30, help="Higher tolerance removes more shades of the selected background color.")
        st.markdown('</div>', unsafe_allow_html=True)
                    
    with tab_frame:
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">🖼️ Layout & Text Frames</div>', unsafe_allow_html=True)
        layout_frame_label = st.selectbox(
            "Layout Frame Style",
            list(LAYOUT_FRAME_OPTIONS.keys()),
            index=list(LAYOUT_FRAME_OPTIONS.keys()).index(LAYOUT_FRAME_REVERSE.get(st.session_state.get("layout_frame", "none"), "None"))
        )
        layout_frame = LAYOUT_FRAME_OPTIONS[layout_frame_label]
        st.session_state["layout_frame"] = layout_frame
        
        text_frame_label = st.selectbox(
            "Frame Template",
            list(TEXT_FRAME_OPTIONS.keys()),
            index=list(TEXT_FRAME_OPTIONS.keys()).index(TEXT_FRAME_REVERSE.get(st.session_state.get("text_frame", "none"), "None"))
        )
        text_frame = TEXT_FRAME_OPTIONS[text_frame_label]
        st.session_state["text_frame"] = text_frame
        
        selected_font_label = st.selectbox("Label Font", ["Outfit (Modern)", "Playfair (Serif)", "Courier (Monospace)", "Arial (Default)"], key="font_style")
        font_map = {
            "Outfit (Modern)": "Outfit-Bold.ttf",
            "Playfair (Serif)": "PlayfairDisplay-Bold.ttf",
            "Courier (Monospace)": "CourierPrime-Bold.ttf",
            "Arial (Default)": "arialbd.ttf"
        }
        selected_font_file = font_map[selected_font_label]
        
        if text_frame == "top_bottom_text":
            col_t1, col_t2 = st.columns(2)
            with col_t1:
                top_text_val = st.text_input("Top Label Text", key="top_text_val")
            with col_t2:
                frame_text_val = st.text_input("Bottom Label Text", key="frame_text_val")
        elif text_frame != "none":
            frame_text_val = st.text_input("Label Text", key="frame_text_val")
            top_text_val = st.session_state.get("top_text_val", "SCAN ME")
        else:
            frame_text_val = ""
            top_text_val = ""
        
        col_f1, col_f2 = st.columns(2)
        with col_f1:
            frame_color = st.color_picker("Frame Color", key="frame_color")
        with col_f2:
            frame_text_color = st.color_picker("Label Text Color", key="frame_text_color")
        st.markdown('</div>', unsafe_allow_html=True)
            
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">📐 Geometry & Dimensions</div>', unsafe_allow_html=True)
        col_l1, col_l2 = st.columns(2)
        with col_l1:
            frame_text_size = st.slider("Label Font Size", min_value=20, max_value=200, key="frame_text_size", help="Font size in pixels for the frame label.")
            frame_padding = st.slider("Inner Padding", min_value=0, max_value=150, key="frame_padding", help="Space (px) between the QR code and the frame edge.")
        with col_l2:
            frame_radius = st.slider("Corner Roundness", min_value=0, max_value=100, key="frame_radius", help="Radius of rounded corners. 0 = sharp, 100 = very round.")
            frame_border = st.slider("Border Thickness", min_value=0, max_value=50, key="frame_border", help="Thickness (px) of the frame border line.")
        st.markdown('</div>', unsafe_allow_html=True)
            
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        st.markdown('<div class="section-card-title">💾 Export Settings</div>', unsafe_allow_html=True)
        resolution_width = st.slider("Export Resolution", min_value=256, max_value=4096, value=1024, step=256, key="resolution_width", format="%d px", help="Output width in pixels. Height adjusts automatically to preserve the aspect ratio.")
        st.markdown('</div>', unsafe_allow_html=True)

with col2:
    # Studio Canvas header
    st.markdown("""
<div class="preview-header">
  <div class="preview-live-dot"></div>
  <h3>Studio Preview</h3>
</div>
<p class="preview-subtitle">Updates automatically as you customize</p>
""", unsafe_allow_html=True)

    if not qr_data:
        st.markdown("""
<div class="qr-empty-state">
  <div class="qr-empty-icon">⬡</div>
  <div class="qr-empty-title">Your QR code will appear here</div>
  <div class="qr-empty-sub">Enter content in the Content tab to get started</div>
</div>
""", unsafe_allow_html=True)
    else:
        with st.spinner("Generating..."):
            try:
                import re
                # Calculate internal generation box size based on target width
                box_size = max(10, resolution_width // 30)

                # Generate QR
                qr_img = generate_styled_qr(qr_data, fill_color, back_color, dot_style, logo_file, box_size=box_size, eye_color=eye_color,
                                             eye_frame_style=eye_frame_style, eyeball_style=eyeball_style,
                                             remove_logo_bg=remove_logo_bg, logo_bg_color=logo_bg_color, logo_bg_tolerance=logo_bg_tolerance,
                                             logo_clear_size=logo_clear_size, gradient_type=gradient_type, fill_color_end=fill_color_end,
                                             preset_logo=preset_logo, logo_card_shape=logo_card_shape, logo_card_padding=logo_card_padding,
                                             logo_size_ratio=logo_size_ratio)

                # Apply Frame
                final_img = apply_frame(qr_img, layout_template=layout_frame, text_template=text_frame,
                                        frame_color=frame_color, text=frame_text_val, text_color=frame_text_color,
                                        text_size=frame_text_size, padding=frame_padding, corner_radius=frame_radius, border_thickness=frame_border,
                                        top_text=top_text_val, font_name=selected_font_file)

                # Resize to target resolution preserving aspect ratio
                orig_w, orig_h = final_img.size
                aspect_ratio = orig_h / orig_w
                new_w = resolution_width
                new_h = int(new_w * aspect_ratio)
                final_img = final_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

                # Display in checkerboard canvas
                st.markdown('<div class="qr-canvas-wrap">', unsafe_allow_html=True)
                st.image(final_img, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
                st.caption(f"✦ {new_w} × {new_h} px  •  {content_type}")

                # File naming
                base_name_clean = re.sub(r'[^a-zA-Z0-9]', '_', content_type).lower()
                base_name_clean = re.sub(r'_+', '_', base_name_clean).strip('_')
                file_prefix = f"qr_code_{base_name_clean}"

                # Prepare download data
                buf = io.BytesIO()
                final_img.save(buf, format="PNG")
                byte_im = buf.getvalue()

                svg_data = generate_svg_qr(qr_data, fill_color, back_color, box_size=box_size)

                try:
                    png_buf = io.BytesIO()
                    final_img.save(png_buf, format="PNG")
                    png_bytes = png_buf.getvalue()
                    b64_png = base64.b64encode(png_bytes).decode("utf-8")
                    width, height = final_img.size
                    svg_styled = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {width} {height}" width="100%" height="100%">\n'
                    svg_styled += f'  <image width="{width}" height="{height}" xlink:href="data:image/png;base64,{b64_png}"/>\n'
                    svg_styled += '</svg>'
                    has_styled_svg = True
                except Exception:
                    has_styled_svg = False

                pdf_buf = io.BytesIO()
                final_img.convert("RGB").save(pdf_buf, format="PDF")
                pdf_im = pdf_buf.getvalue()

                # Download section
                st.markdown('<div class="download-header">⬇ Export</div>', unsafe_allow_html=True)

                dl_col1, dl_col2 = st.columns(2)
                with dl_col1:
                    st.download_button(
                        label="🖼️ PNG Image",
                        data=byte_im,
                        file_name=f"{file_prefix}.png",
                        mime="image/png",
                        use_container_width=True
                    )
                    st.download_button(
                        label="📄 PDF Document",
                        data=pdf_im,
                        file_name=f"{file_prefix}.pdf",
                        mime="application/pdf",
                        help="Exports the fully customized styled QR code in PDF format.",
                        use_container_width=True
                    )

                with dl_col2:
                    st.download_button(
                        label="✏️ SVG — Base Vector",
                        data=svg_data,
                        file_name=f"{file_prefix}_base.svg",
                        mime="image/svg+xml",
                        help="Mathematical vector SVG — dots only. Logos & frames not included.",
                        use_container_width=True
                    )
                    if has_styled_svg:
                        st.download_button(
                            label="🎨 SVG — Styled Full",
                            data=svg_styled,
                            file_name=f"{file_prefix}_styled.svg",
                            mime="image/svg+xml",
                            help="Full design with frames & logos embedded as high-fidelity SVG.",
                            use_container_width=True
                        )
                    else:
                        st.button("🎨 SVG (Styled)", disabled=True, use_container_width=True)
                        
            except Exception as e:
                st.error(f"Error generating QR code: {e}")
