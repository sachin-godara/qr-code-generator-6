import os
import logging
from PIL import Image, ImageDraw

logger = logging.getLogger(__name__)
from engines.core.utils import hex_to_rgb

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

PRESET_LOGO_BRAND_COLORS = {
    "link": "#6d28d9",
    "location": "#dc2626",
    "wifi": "#0f766e",
    "vcard": "#1d4ed8",
    "email": "#d97706",
    "scan": "#be185d",
    "whatsapp": "#25d366",
    "instagram": "#e1306c",
    "facebook": "#1877f2",
    "youtube": "#ff0000",
    "phone": "#10b981",
    "coffee": "#d97706",
    "heart": "#f43f5e",
    "star": "#f59e0b",
    "calendar": "#0ea5e9",
    "payment": "#10b981",
    "store": "#f97316",
    "chat": "#3b82f6",
    "app": "#8b5cf6",
    "discord": "#5865f2",
    "amazon": "#FF9900",
    "tiktok": "#000000",
    "x": "#000000",
    "linkedin": "#0a66c2",
    "telegram": "#24a1de",
    "paypal": "#003087",
    "spotify": "#1db954",
    "pinterest": "#E60023",
    "snapchat": "#FFFC00",
    "maps": "#4285F4",
    "play": "#3BCCFF",
    "gmail": "#EA4335",
    "forms": "#7248B9",
    "scanme": "#ef4444",
    "vimeo": "#1AB7EA",
    "wechat": "#07C160",
    "yelp": "#FF1A1A",
    "pdf": "#F40F02",
    "docs": "#4285F4"
}

def make_color_transparent(img: Image.Image, color_rgb: tuple, tolerance: int = 0) -> Image.Image:
    """Make a specific color (or close to it) transparent in a PIL Image."""
    import numpy as np
    if img is None:
        return None
    img = img.convert("RGBA")
    data = np.array(img)
    r, g, b, a = data.T
    tr, tg, tb = color_rgb
    distance = np.sqrt((r.astype(int) - tr)**2 + (g.astype(int) - tg)**2 + (b.astype(int) - tb)**2)
    transparent_mask = distance <= tolerance
    data[..., 3][transparent_mask.T] = 0
    return Image.fromarray(data)

def remove_qr_background(img, back_color):
    if img is None:
        return None
    bg_rgb = hex_to_rgb(back_color) if str(back_color).startswith('#') else (255, 255, 255)
    return make_color_transparent(img, bg_rgb, tolerance=10)

def generate_preset_logo(name, color=(0, 0, 0)):
    asset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "assets", "preset_logos"))
    svg_path = os.path.join(asset_dir, f"{name.lower()}.svg")
    
    if not os.path.exists(svg_path) or fitz is None:
        return None
        
    try:
        with open(svg_path, "r", encoding="utf-8") as f:
            svg_content = f.read()
            
        hex_color = "#{:02x}{:02x}{:02x}".format(*color)
        svg_content = svg_content.replace('currentColor', hex_color)
        
        doc = fitz.open("svg", svg_content.encode('utf-8'))
        page = doc[0]
        
        rect = page.rect
        svg_w = rect.width if rect.width > 0 else 24.0
        svg_h = rect.height if rect.height > 0 else 24.0
        mat = fitz.Matrix(200.0 / svg_w, 200.0 / svg_h)
        pix = page.get_pixmap(matrix=mat, alpha=True)
        img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
        
        out_img = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
        offset = ((200 - img.width) // 2, (200 - img.height) // 2)
        out_img.paste(img, offset, img)
        return out_img
    except Exception as e:
        logger.warning(f"Error generating preset logo: {e}")
        return None

def apply_logo_overlay(img, logo_image, remove_logo_bg=False, logo_bg_color="#ffffff", logo_bg_tolerance=30, logo_size_ratio=0.18, logo_card_shape="None", logo_card_padding=10, bg=(255,255,255)):
    if not logo_image:
        return img
    try:
        if isinstance(logo_image, Image.Image):
            logo = logo_image
        else:
            logo = Image.open(logo_image)
        
        if remove_logo_bg:
            target_rgb = hex_to_rgb(logo_bg_color)
            logo = make_color_transparent(logo, target_rgb, logo_bg_tolerance)
            
        basewidth = int(img.size[0] * logo_size_ratio)
        wpercent = (basewidth / float(logo.size[0]))
        hsize = int((float(logo.size[1]) * float(wpercent)))
        logo = logo.resize((basewidth, hsize), Image.Resampling.LANCZOS)
        
        pos = ((img.size[0] - logo.size[0]) // 2, (img.size[1] - logo.size[1]) // 2)
        
        if logo_card_shape != "None":
            card_draw = ImageDraw.Draw(img)
            card_w = logo.size[0] + logo_card_padding * 2
            card_h = logo.size[1] + logo_card_padding * 2
            cx_img = img.size[0] // 2
            cy_img = img.size[1] // 2
            card_box = [cx_img - card_w//2, cy_img - card_h//2, cx_img + card_w//2, cy_img + card_h//2]
            
            if logo_bg_color and str(logo_bg_color).startswith('#'):
                card_rgb = hex_to_rgb(logo_bg_color) + (255,)
            else:
                card_rgb = bg + (255,)
            if logo_card_shape == "Circle":
                card_draw.ellipse(card_box, fill=card_rgb)
            elif logo_card_shape == "Rounded Square":
                card_radius = max(8, int(min(card_w, card_h) * 0.2))
                card_draw.rounded_rectangle(card_box, radius=card_radius, fill=card_rgb)
                
        if logo.mode == 'RGBA':
            img.paste(logo, pos, logo)
        else:
            img.paste(logo, pos)
    except Exception as e:
        logger.warning(f"Error applying logo: {e}")
    return img
