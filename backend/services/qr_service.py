import io
import gc
import base64
import logging
import hashlib
import json
import threading
from collections import OrderedDict
from functools import lru_cache

logger = logging.getLogger(__name__)
from PIL import Image, ImageDraw, ImageFilter
# Guard against Decompression Bomb Denial of Service (limit to safe max pixel count)
Image.MAX_IMAGE_PIXELS = 10_000_000
from qr_engine import generate_styled_qr, generate_svg_qr, hex_to_rgb
from frame_engine import apply_layout_frame, apply_text_frame

class SimpleLRUCache:
    """Thread-safe in-memory LRU cache for rendered QR binaries."""
    def __init__(self, maxsize: int = 1024):
        self.maxsize = maxsize
        self.cache = OrderedDict()
        self.lock = threading.Lock()

    def get(self, key: str):
        with self.lock:
            if key in self.cache:
                self.cache.move_to_end(key)
                return self.cache[key]
            return None

    def set(self, key: str, value: bytes):
        with self.lock:
            if key in self.cache:
                self.cache.move_to_end(key)
            self.cache[key] = value
            if len(self.cache) > self.maxsize:
                self.cache.popitem(last=False)

    def clear(self):
        with self.lock:
            self.cache.clear()

_qr_image_cache = SimpleLRUCache(maxsize=1024)
_qr_svg_cache = SimpleLRUCache(maxsize=1024)

def _compute_cache_key(data: str, params: dict, prefix: str = "img") -> str:
    clean_params = {}
    for k, v in params.items():
        if k == "logo_image":
            if isinstance(v, Image.Image):
                img_hash = hashlib.md5(v.tobytes()).hexdigest()
                clean_params[k] = f"pil_{v.size}_{v.mode}_{img_hash}"
            elif isinstance(v, str):
                clean_params[k] = hashlib.md5(v.encode('utf-8')).hexdigest() if len(v) > 64 else v
            else:
                clean_params[k] = str(v)
        elif isinstance(v, (str, int, float, bool)) or v is None:
            clean_params[k] = v
        elif isinstance(v, (list, tuple)):
            clean_params[k] = list(v)
        elif isinstance(v, dict):
            clean_params[k] = {str(dk): str(dv) for dk, dv in sorted(v.items())}
    serialized = json.dumps({"d": data, "p": clean_params}, sort_keys=True)
    return f"{prefix}:{hashlib.md5(serialized.encode('utf-8')).hexdigest()}"

def apply_canvas_effects(img: Image.Image, params: dict) -> Image.Image:
    canvas_radius = params.get("canvas_radius", 0)
    canvas_border_width = params.get("canvas_border_width", 0)
    canvas_border_color = params.get("canvas_border_color", "#000000")
    canvas_border_radius = params.get("canvas_border_radius", 16)
    effect_shadow = params.get("effect_shadow", "none")
    if params.get("bg_transparent", False):
        effect_shadow = "none"
    effect_shadow_color = params.get("effect_shadow_color", "rgba(0,0,0,0.15)")

    if canvas_radius <= 0 and canvas_border_width <= 0 and effect_shadow == "none":
        return img

    w, h = img.size
    b_width = canvas_border_width
    base_img = img.convert("RGBA")
    
    active_radius = canvas_radius if ("canvas_radius" in params) else canvas_border_radius
    if b_width > 0:
        border_r = int(active_radius * (w / 300.0))
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
        
    scale = w / 300.0
    blur_r = int((25 if effect_shadow == "soft" else (35 if effect_shadow == "elevated" else 30)) * scale)
    offset_y = int((12 if effect_shadow == "elevated" else (6 if effect_shadow == "soft" else 0)) * scale)
    margin = blur_r * 2
    
    full_w = inner_w + margin * 2
    full_h = inner_h + margin * 2 + offset_y
    
    s_color = str(effect_shadow_color).strip()
    if s_color.startswith("#"):
        clean_hex = s_color.lstrip("#")[:6]
        if len(clean_hex) == 6 and all(c in "0123456789abcdefABCDEF" for c in clean_hex):
            shadow_rgb = hex_to_rgb(clean_hex)
        else:
            shadow_rgb = (0, 102, 255) if effect_shadow == "neon" else (0, 0, 0)
    elif s_color.startswith("rgb"):
        try:
            parts = s_color.split("(")[1].split(")")[0].split(",")
            shadow_rgb = tuple(int(float(p.strip())) for p in parts[:3])
        except Exception:
            shadow_rgb = (0, 102, 255) if effect_shadow == "neon" else (0, 0, 0)
    else:
        shadow_rgb = (0, 102, 255) if effect_shadow == "neon" else (0, 0, 0)
        
    s_alpha = 100 if effect_shadow == "soft" else (170 if effect_shadow == "elevated" else 220)
    
    s_mask = Image.new("L", (inner_w, inner_h), 0)
    sm_draw = ImageDraw.Draw(s_mask)
    sm_draw.rounded_rectangle([0, 0, inner_w - 1, inner_h - 1], radius=border_r, fill=s_alpha)
    
    s_block = Image.new("RGBA", (inner_w, inner_h), shadow_rgb + (255,))
    
    # Fast shadow optimization: for large canvases, downscale the shadow block before Gaussian blur
    down_factor = max(1, min(4, int(scale)))
    if down_factor > 1 and blur_r >= 8:
        small_w = max(1, full_w // down_factor)
        small_h = max(1, full_h // down_factor)
        small_inner_w = max(1, inner_w // down_factor)
        small_inner_h = max(1, inner_h // down_factor)
        small_margin = margin // down_factor
        small_offset_y = offset_y // down_factor
        small_blur_r = max(1, blur_r // down_factor)

        small_s_mask = s_mask.resize((small_inner_w, small_inner_h), Image.Resampling.BILINEAR)
        small_s_block = Image.new("RGBA", (small_inner_w, small_inner_h), shadow_rgb + (255,))
        small_shadow_canvas = Image.new("RGBA", (small_w, small_h), (0, 0, 0, 0))
        small_shadow_canvas.paste(small_s_block, (small_margin, small_margin + small_offset_y), small_s_mask)
        small_shadow_canvas = small_shadow_canvas.filter(ImageFilter.GaussianBlur(small_blur_r))
        shadow_canvas = small_shadow_canvas.resize((full_w, full_h), Image.Resampling.BILINEAR)
    else:
        shadow_canvas = Image.new("RGBA", (full_w, full_h), (0, 0, 0, 0))
        shadow_canvas.paste(s_block, (margin, margin + offset_y), s_mask)
        shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(blur_r))
    
    shadow_canvas.paste(canvas_result, (margin, margin), canvas_result)
    return shadow_canvas

def generate_qr_image(data: str, params: dict) -> io.BytesIO:
    """
    Generates a QR code image based on the provided parameters.
    Utilizes an in-memory LRU cache to return cached byte buffers instantly.
    """
    cache_key = _compute_cache_key(data, params, prefix="img")
    cached_bytes = _qr_image_cache.get(cache_key)
    if cached_bytes is not None:
        return io.BytesIO(cached_bytes)

    logo_image = params.get("logo_image")
    logo_pil = None
    if logo_image:
        if isinstance(logo_image, str) and logo_image.startswith("data:image"):
            try:
                header, encoded = logo_image.split(",", 1)
                image_data = base64.b64decode(encoded)
                logo_pil = Image.open(io.BytesIO(image_data))
            except Exception as e:
                logger.warning(f"Error decoding base64 logo: {e}")
        elif isinstance(logo_image, str):
            try:
                image_data = base64.b64decode(logo_image)
                logo_pil = Image.open(io.BytesIO(image_data))
            except Exception as e:
                logger.warning(f"Error decoding raw base64 logo: {e}")
        elif isinstance(logo_image, Image.Image):
            logo_pil = logo_image

    if logo_pil is not None:
        if logo_pil.width > 2048 or logo_pil.height > 2048:
            logo_pil.thumbnail((2048, 2048), Image.Resampling.LANCZOS)

    fill_color = params.get("dots_color", "#000000")
    back_color = params.get("bg_color", "#ffffff")
    if params.get("invert_colors", False):
        fill_color, back_color = back_color, fill_color

    eye_col = params.get("eye_color", fill_color)
    eyeball_col = params.get("eyeball_color", eye_col)
    
    # Contrast fallback for dark themes
    if back_color.lower() in ["#000000", "#1e1f22", "#111111", "#000", "#111"] and fill_color.lower() in ["#ffffff", "#fff"]:
        if eye_col == "#000000":
            eye_col = fill_color
        if eyeball_col == "#000000":
            eyeball_col = eye_col

    def _build_image(p: dict) -> Image.Image:
        # 1. Generate base styled QR
        base_qr = generate_styled_qr(
            data=data,
            fill_color=fill_color,
            back_color=back_color,
            dot_style=p.get("dots_style", "square"),
            logo_image=logo_pil,
            box_size=p.get("box_size", 10),
            eye_color=eye_col,
            eyeball_color=eyeball_col,
            eye_frame_style=p.get("eye_frame_style", "square"),
            eyeball_style=p.get("eyeball_style", "square"),
            remove_logo_bg=p.get("remove_logo_bg", False),
            gradient_type=p.get("gradient_type", "Solid Color"),
            fill_color_end=p.get("dots_color_end", fill_color),
            preset_logo=p.get("preset_logo", "None"),
            preset_logo_color=p.get("preset_logo_color"),
            logo_card_shape=p.get("logo_card_shape", "None"),
            logo_card_padding=p.get("logo_card_padding", 10),
            logo_size_ratio=p.get("logo_size_ratio", 0.18),
            logo_clear_size=p.get("logo_clear_size", 0.5),
            logo_bg_color=p.get("logo_bg_color", "#ffffff"),
            logo_bg_tolerance=p.get("logo_bg_tolerance", 30),
            error_correction=p.get("error_correction", "H"),
            quiet_zone=p.get("quiet_zone", 4),
            bg_transparent=True if p.get("bg_image") else p.get("bg_transparent", False),
            params=p,
        )
        
        # 2. Apply Background Image Overlay (Option A - Pillow Blending)
        if p.get("bg_image"):
            try:
                from PIL import ImageEnhance
                
                # Load background image
                bg_data = base64.b64decode(p["bg_image"].split(",")[1]) if "," in p["bg_image"] else base64.b64decode(p["bg_image"])
                bg_img = Image.open(io.BytesIO(bg_data)).convert("RGBA")
                if bg_img.width > 2048 or bg_img.height > 2048:
                    bg_img.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
                
                # Resize bg image to match QR code size
                bg_img = bg_img.resize(base_qr.size, Image.Resampling.LANCZOS)
                
                # Adjust opacity of background if provided (percentage 0-100)
                opacity_val = p.get("bg_image_opacity", 100)
                opacity = float(opacity_val) / 100.0
                
                if opacity < 1.0:
                    alpha = bg_img.split()[3]
                    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
                    bg_img.putalpha(alpha)
                
                # Blend mode handling
                blend_mode = p.get("bg_image_blend_mode", "normal")
                
                comp = Image.new("RGBA", base_qr.size)
                comp.paste(bg_img, (0, 0), bg_img)
                comp.paste(base_qr, (0, 0), base_qr)
                base_qr = comp
                    
            except Exception as e:
                logger.warning(f"Error applying background image: {e}")

        # 3. Apply Layout Frame
        if p.get("frame_style") and p.get("frame_style") != "none":
            base_qr = apply_layout_frame(
                base_qr,
                layout_template=p.get("frame_style"),
                frame_color=p.get("frame_color", "#000000"),
                padding=p.get("frame_padding", 20),
                corner_radius=p.get("frame_radius", 15),
                border_thickness=p.get("frame_border", 10),
            )
            
        # 3. Apply Text Frame
        if p.get("text_style") and p.get("text_style") != "none":
            base_qr = apply_text_frame(
                base_qr,
                text_template=p.get("text_style"),
                frame_color=p.get("frame_color", "#000000"),
                text=p.get("frame_text", "SCAN ME"),
                text_color=p.get("frame_text_color", "#ffffff"),
                text_size=p.get("frame_text_size", 40),
                padding=p.get("frame_padding", 20),
                corner_radius=p.get("frame_radius", 15),
                border_thickness=p.get("frame_border", 10),
                top_text=p.get("top_text", "SCAN ME"),
                font_name=p.get("font_name", "Outfit-Bold.ttf"),
            )

        # 4. Apply Canvas Effects (Shadow, Corner Radius, Outer Border)
        base_qr = apply_canvas_effects(base_qr, p)
        return base_qr

    # Determine resolution strategy
    target_size = params.get("target_size")
    if target_size and isinstance(target_size, (int, float)) and target_size > 0:
        target_size = int(target_size)
        no_stretching = params.get("no_stretching", False)
        
        if no_stretching:
            import copy
            import qrcode
            
            # Fast width calculation to avoid expensive dummy image build if no complex frames
            has_complex_frames = (
                (params.get("frame_style") and params.get("frame_style") != "none") or
                (params.get("text_style") and params.get("text_style") != "none") or
                params.get("canvas_border_width", 0) > 0 or
                params.get("effect_shadow", "none") != "none"
            )

            original_box_size = params.get("box_size", 10)

            if not has_complex_frames:
                _ec_map = {
                    "L": qrcode.constants.ERROR_CORRECT_L,
                    "M": qrcode.constants.ERROR_CORRECT_M,
                    "Q": qrcode.constants.ERROR_CORRECT_Q,
                    "H": qrcode.constants.ERROR_CORRECT_H,
                }
                ec_level = _ec_map.get(params.get("error_correction", "H"), qrcode.constants.ERROR_CORRECT_H)
                q_est = qrcode.QRCode(
                    error_correction=ec_level,
                    box_size=original_box_size,
                    border=params.get("quiet_zone", 4),
                )
                q_est.add_data(data)
                q_est.make(fit=True)
                orig_w = (len(q_est.modules) + 2 * params.get("quiet_zone", 4)) * original_box_size
            else:
                dummy_params = copy.deepcopy(params)
                dummy_params["target_size"] = 0
                dummy_img = _build_image(dummy_params)
                orig_w = dummy_img.size[0]
                dummy_img.close()
                del dummy_img
            
            if orig_w > 0:
                scale_factor = float(target_size) / float(orig_w)
                params["box_size"] = max(1, int(round(original_box_size * scale_factor)))
                for key in ["logo_card_padding", "canvas_border_width", "frame_padding", "frame_radius", "frame_border", "frame_text_size"]:
                    if key in params and isinstance(params[key], (int, float)):
                        params[key] = max(1, int(round(params[key] * scale_factor)))
                        
            base_qr = _build_image(params)
            
            # Place natively rendered QR onto target_size canvas without any Lanczos pixel stretching
            w, h = base_qr.size
            if w > 0 and (w != target_size or h != target_size):
                bg_trans = params.get("bg_transparent", False)
                has_canvas_effects = (params.get("canvas_radius", 0) > 0 or params.get("canvas_border_width", 0) > 0 or params.get("effect_shadow", "none") != "none")
                bg_hex = params.get("bg_color", "#ffffff")
                bg_color = (0, 0, 0, 0) if (bg_trans or has_canvas_effects) else (hex_to_rgb(bg_hex) + (255,) if str(bg_hex).startswith('#') else (255, 255, 255, 255))
                
                canvas_w = max(target_size, w)
                canvas_h = max(target_size, h)
                canvas = Image.new("RGBA", (canvas_w, canvas_h), bg_color)
                pos_x = (canvas_w - w) // 2
                pos_y = (canvas_h - h) // 2
                canvas.paste(base_qr, (pos_x, pos_y), base_qr if base_qr.mode == "RGBA" else None)
                base_qr.close()
                base_qr = canvas
        else:
            base_qr = _build_image(params)
            w, h = base_qr.size
            if w > 0:
                aspect = h / w
                new_w = target_size
                new_h = int(new_w * aspect)
                resized = base_qr.resize((new_w, new_h), Image.Resampling.LANCZOS)
                base_qr.close()
                base_qr = resized
    else:
        base_qr = _build_image(params)

    # Free logo PIL image
    if logo_pil is not None:
        logo_pil.close()
        del logo_pil
        
    img_byte_arr = io.BytesIO()
    base_qr.save(img_byte_arr, format='PNG')
    base_qr.close()
    del base_qr

    raw_bytes = img_byte_arr.getvalue()
    _qr_image_cache.set(cache_key, raw_bytes)

    img_byte_arr.seek(0)
    return img_byte_arr

def generate_qr_svg(data: str, params: dict) -> bytes:
    """
    Generates a raw SVG QR code or embeds a rasterized version if advanced styling is used.
    Utilizes an in-memory LRU cache to return cached SVG byte buffers instantly.
    """
    cache_key = _compute_cache_key(data, params, prefix="svg")
    cached_svg = _qr_svg_cache.get(cache_key)
    if cached_svg is not None:
        return cached_svg

    has_complex_styling = (
        params.get("frame_style", "none") != "none" or
        params.get("text_style", "none") != "none" or
        params.get("dots_style", "square") != "square" or
        params.get("eye_frame_style", "square") != "square" or
        params.get("eyeball_style", "square") != "square" or
        params.get("gradient_type", "Solid Color") != "Solid Color" or
        params.get("preset_logo", "None") != "None" or
        params.get("effect_shadow", "none") != "none" or
        params.get("canvas_border_width", 0) > 0
    )

    if has_complex_styling:
        # Generate high-fidelity PNG and embed in SVG
        png_io = generate_qr_image(data, params)
        img = Image.open(png_io)
        w, h = img.size
        b64_str = base64.b64encode(png_io.getvalue()).decode('utf-8')
        svg_str = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%" style="max-width: 100%; max-height: 100vh; height: auto;"><image href="data:image/png;base64,{b64_str}" width="{w}" height="{h}" /></svg>'
        svg_bytes = svg_str.encode('utf-8')
    else:
        svg_bytes = generate_svg_qr(
            data=data,
            fill_color=params.get("dots_color", "#000000"),
            back_color=params.get("bg_color", "#ffffff"),
            box_size=params.get("box_size", 10),
            bg_transparent=params.get("bg_transparent", False),
            error_correction=params.get("error_correction", "H"),
            quiet_zone=params.get("quiet_zone", 4),
            canvas_radius=params.get("canvas_radius", 0)
        )
        
    _qr_svg_cache.set(cache_key, svg_bytes)
    return svg_bytes

def generate_qr_pdf(data: str, params: dict) -> io.BytesIO:
    """
    Generates a PDF file containing the QR code.
    """
    png_io = generate_qr_image(data, params)
    img = Image.open(png_io)
    if img.mode == 'RGBA':
        white_bg = Image.new("RGB", img.size, (255, 255, 255))
        white_bg.paste(img, mask=img.split()[3])
        img = white_bg
    else:
        img = img.convert("RGB")
    pdf_io = io.BytesIO()
    img.save(pdf_io, format="PDF", resolution=300.0)
    pdf_io.seek(0)
    return pdf_io

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
