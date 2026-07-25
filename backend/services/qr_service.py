import io
import base64
from PIL import Image, ImageDraw, ImageFilter
from qr_engine import generate_styled_qr, generate_svg_qr, hex_to_rgb
from frame_engine import apply_layout_frame, apply_text_frame

def apply_canvas_effects(img: Image.Image, params: dict) -> Image.Image:
    canvas_radius = params.get("canvas_radius", 0)
    canvas_border_width = params.get("canvas_border_width", 0)
    canvas_border_color = params.get("canvas_border_color", "#000000")
    canvas_border_radius = params.get("canvas_border_radius", 16)
    effect_shadow = params.get("effect_shadow", "none")
    effect_shadow_color = params.get("effect_shadow_color", "rgba(0,0,0,0.15)")

    if canvas_radius <= 0 and canvas_border_width <= 0 and effect_shadow == "none":
        return img

    w, h = img.size
    b_width = canvas_border_width
    base_img = img.convert("RGBA")
    
    if b_width > 0:
        border_r = int(canvas_border_radius * (w / 300.0))
        inner_r = max(0, border_r - b_width)
    else:
        border_r = int(canvas_radius * (w / 300.0))
        inner_r = border_r
        
    inner_w = w + b_width * 2
    inner_h = h + b_width * 2
    
    frame_layer = Image.new("RGBA", (inner_w, inner_h), (0, 0, 0, 0))
    f_draw = ImageDraw.Draw(frame_layer)
    
    if b_width > 0:
        border_rgb = hex_to_rgb(canvas_border_color) if str(canvas_border_color).startswith("#") else (0, 0, 0)
        f_draw.rounded_rectangle([0, 0, inner_w - 1, inner_h - 1], radius=border_r, fill=border_rgb + (255,))
        
        # Concentric inner rounded mask for pasting the QR code
        inner_mask = Image.new("L", (w, h), 0)
        im_draw = ImageDraw.Draw(inner_mask)
        im_draw.rounded_rectangle([0, 0, w - 1, h - 1], radius=inner_r, fill=255)
        frame_layer.paste(base_img, (b_width, b_width), inner_mask)
    else:
        frame_layer.paste(base_img, (b_width, b_width))
        
    mask = Image.new("L", (inner_w, inner_h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, inner_w - 1, inner_h - 1], radius=border_r, fill=255)
    
    canvas_result = Image.new("RGBA", (inner_w, inner_h), (0, 0, 0, 0))
    canvas_result.paste(frame_layer, (0, 0), mask)

    if effect_shadow == "none":
        return canvas_result
        
    blur_r = 25 if effect_shadow == "soft" else (35 if effect_shadow == "elevated" else 30)
    offset_y = 12 if effect_shadow == "elevated" else (6 if effect_shadow == "soft" else 0)
    margin = blur_r * 2
    
    full_w = inner_w + margin * 2
    full_h = inner_h + margin * 2 + offset_y
    
    shadow_canvas = Image.new("RGBA", (full_w, full_h), (0, 0, 0, 0))
    
    s_color = str(effect_shadow_color)
    shadow_rgb = hex_to_rgb(s_color[:7]) if s_color.startswith("#") else (0, 80, 203)
    s_alpha = 100 if effect_shadow == "soft" else (170 if effect_shadow == "elevated" else 220)
    
    s_mask = Image.new("L", (inner_w, inner_h), 0)
    sm_draw = ImageDraw.Draw(s_mask)
    sm_draw.rounded_rectangle([0, 0, inner_w - 1, inner_h - 1], radius=total_r, fill=s_alpha)
    
    s_block = Image.new("RGBA", (inner_w, inner_h), shadow_rgb + (255,))
    
    shadow_canvas.paste(s_block, (margin, margin + offset_y), s_mask)
    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(blur_r))
    
    shadow_canvas.paste(canvas_result, (margin, margin), canvas_result)
    return shadow_canvas

def generate_qr_image(data: str, params: dict) -> io.BytesIO:
    """
    Generates a QR code image based on the provided parameters.
    """
    logo_image = params.get("logo_image")
    logo_pil = None
    if logo_image:
        if isinstance(logo_image, str) and logo_image.startswith("data:image"):
            try:
                header, encoded = logo_image.split(",", 1)
                image_data = base64.b64decode(encoded)
                logo_pil = Image.open(io.BytesIO(image_data))
            except Exception as e:
                print(f"Error decoding base64 logo: {e}")
        elif isinstance(logo_image, str):
            try:
                image_data = base64.b64decode(logo_image)
                logo_pil = Image.open(io.BytesIO(image_data))
            except Exception as e:
                print(f"Error decoding raw base64 logo: {e}")
        elif isinstance(logo_image, Image.Image):
            logo_pil = logo_image

    fill_color = params.get("dots_color", "#000000")
    back_color = params.get("bg_color", "#ffffff")
    if params.get("invert_colors", False):
        fill_color, back_color = back_color, fill_color

    # 1. Generate base styled QR
    base_qr = generate_styled_qr(
        data=data,
        fill_color=fill_color,
        back_color=back_color,
        dot_style=params.get("dots_style", "square"),
        logo_image=logo_pil,
        box_size=params.get("box_size", 10),
        eye_color=params.get("eye_color", "#000000"),
        eyeball_color=params.get("eyeball_color", "#000000"),
        eye_frame_style=params.get("eye_frame_style", "square"),
        eyeball_style=params.get("eyeball_style", "square"),
        remove_logo_bg=params.get("remove_logo_bg", False),
        gradient_type=params.get("gradient_type", "Solid Color"),
        fill_color_end=params.get("dots_color_end", "#000000"),
        preset_logo=params.get("preset_logo", "None"),
        preset_logo_color=params.get("preset_logo_color"),
        logo_card_shape=params.get("logo_card_shape", "None"),
        logo_card_padding=params.get("logo_card_padding", 10),
        logo_size_ratio=params.get("logo_size_ratio", 0.22),
        logo_clear_size=params.get("logo_clear_size", 2),
        logo_bg_color=params.get("logo_bg_color", "#ffffff"),
        logo_bg_tolerance=params.get("logo_bg_tolerance", 30),
        error_correction=params.get("error_correction", "H"),
        quiet_zone=params.get("quiet_zone", 4),
    )
    
    # 2. Apply Layout Frame
    if params.get("frame_style") and params.get("frame_style") != "none":
        base_qr = apply_layout_frame(
            base_qr,
            layout_template=params.get("frame_style"),
            frame_color=params.get("frame_color", "#000000"),
            padding=params.get("frame_padding", 20),
            corner_radius=params.get("frame_radius", 15),
            border_thickness=params.get("frame_border", 10),
        )
        
    # 3. Apply Text Frame
    if params.get("text_style") and params.get("text_style") != "none":
        base_qr = apply_text_frame(
            base_qr,
            text_template=params.get("text_style"),
            frame_color=params.get("frame_color", "#000000"),
            text=params.get("frame_text", "SCAN ME"),
            text_color=params.get("frame_text_color", "#ffffff"),
            text_size=params.get("frame_text_size", 40),
            padding=params.get("frame_padding", 20),
            corner_radius=params.get("frame_radius", 15),
            border_thickness=params.get("frame_border", 10),
            top_text=params.get("top_text", "SCAN ME"),
            font_name=params.get("font_name", "Outfit-Bold.ttf"),
        )

    # 4. Apply Canvas Effects (Shadow, Corner Radius, Outer Border)
    base_qr = apply_canvas_effects(base_qr, params)
        
    # 5. Target Resolution Scaling (preserving aspect ratio)
    target_size = params.get("target_size")
    if target_size and isinstance(target_size, (int, float)) and target_size > 0:
        w, h = base_qr.size
        scale = float(target_size) / float(max(w, h))
        if scale > 0 and abs(scale - 1.0) > 0.01:
            new_w = max(1, int(round(w * scale)))
            new_h = max(1, int(round(h * scale)))
            base_qr = base_qr.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
    # Convert PIL Image to BytesIO
    img_byte_arr = io.BytesIO()
    base_qr.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return img_byte_arr

def generate_qr_svg(data: str, params: dict) -> bytes:
    """
    Generates a raw SVG QR code or embeds a rasterized version if advanced styling is used.
    """
    has_complex_styling = (
        params.get("frame_style", "none") != "none" or
        params.get("text_style", "none") != "none" or
        params.get("dots_style", "square") != "square" or
        params.get("eye_frame_style", "square") != "square" or
        params.get("eyeball_style", "square") != "square" or
        params.get("gradient_type", "Solid Color") != "Solid Color" or
        params.get("preset_logo", "None") != "None" or
        params.get("effect_shadow", "none") != "none" or
        params.get("canvas_radius", 0) > 0 or
        params.get("canvas_border_width", 0) > 0
    )

    if has_complex_styling:
        # Generate high-fidelity PNG and embed in SVG
        png_io = generate_qr_image(data, params)
        img = Image.open(png_io)
        w, h = img.size
        b64_str = base64.b64encode(png_io.getvalue()).decode('utf-8')
        svg_str = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}"><image href="data:image/png;base64,{b64_str}" width="{w}" height="{h}" /></svg>'
        return svg_str.encode('utf-8')
    else:
        svg_data = generate_svg_qr(
            data=data,
            fill_color=params.get("dots_color", "#000000"),
            back_color=params.get("bg_color", "#ffffff"),
            box_size=params.get("box_size", 10)
        )
        return svg_data

def generate_qr_pdf(data: str, params: dict) -> io.BytesIO:
    """
    Generates a PDF file containing the QR code.
    """
    png_io = generate_qr_image(data, params)
    img = Image.open(png_io).convert("RGB")
    pdf_io = io.BytesIO()
    img.save(pdf_io, format="PDF", resolution=300.0)
    pdf_io.seek(0)
    return pdf_io

from functools import lru_cache

@lru_cache(maxsize=128)
def get_frame_preview(frame_style: str) -> bytes:
    """Generates a cached preview image for a frame style."""
    params = {
        "dots_color": "#000000",
        "bg_color": "#ffffff",
        "frame_style": frame_style,
        "frame_color": "#0050cb",
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 10
    }
    png_io = generate_qr_image("PREVIEW", params)
    return png_io.getvalue()

@lru_cache(maxsize=128)
def get_text_frame_preview(text_style: str) -> bytes:
    """Generates a cached preview image for a text frame style."""
    params = {
        "dots_color": "#000000",
        "bg_color": "#ffffff",
        "text_style": text_style,
        "frame_color": "#0050cb",
        "frame_text": "PREVIEW",
        "frame_text_color": "#ffffff",
        "frame_text_size": 40,
        "frame_padding": 20,
        "frame_radius": 15,
        "frame_border": 10
    }
    png_io = generate_qr_image("PREVIEW", params)
    return png_io.getvalue()

