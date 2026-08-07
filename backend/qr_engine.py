import qrcode
import math
import numpy as np
import random

from engines.core.utils import hex_to_rgb
from engines.core.noise import (
    value_noise_1d,
    fractal_noise_1d,
    generate_deckled_rect,
    draw_crystal_frame_func
)
        

from engines.dots.gradient import CustomStyledPilImage, DiagonalGradiantColorMask
from engines.eyes import draw_eye_frame, draw_eyeball
from engines.logo import (
    PRESET_LOGO_BRAND_COLORS,
    generate_preset_logo,
    make_color_transparent,
    remove_qr_background,
    apply_logo_overlay
)
from qrcode.image.styles.moduledrawers import (
    SquareModuleDrawer, GappedSquareModuleDrawer, CircleModuleDrawer,
    RoundedModuleDrawer, VerticalBarsDrawer, HorizontalBarsDrawer
)
from qrcode.image.styles.colormasks import (
    SolidFillColorMask, VerticalGradiantColorMask, HorizontalGradiantColorMask, 
    RadialGradiantColorMask, QRColorMask
)
from PIL import Image, ImageDraw

import os
try:
    import fitz
except ImportError:
    fitz = None


from engines.dots.custom_drawers import *
from engines.dots import MODULE_DRAWER_REGISTRY

def generate_styled_qr(data, fill_color="#000000", back_color="#ffffff", dot_style="square", logo_image=None, box_size=30, eye_color=None, eyeball_color=None, eye_frame_style=None, eyeball_style=None, remove_logo_bg=False, logo_bg_color="#ffffff", logo_bg_tolerance=30, logo_clear_size=0.5, gradient_type="Solid Color", fill_color_end="#000000", preset_logo="None", preset_logo_color=None, logo_card_shape="None", logo_card_padding=10, logo_size_ratio=0.18, error_correction="H", quiet_zone=4, bg_transparent=False, params=None):
    if params is None:
        params = {}
    if eye_frame_style is None: eye_frame_style = "square"
    if eyeball_style is None: eyeball_style = "square"
    
    # Generate preset logo if requested and no explicit image was provided
    has_logo = logo_image is not None or preset_logo != "None"
    if logo_image is None and preset_logo != "None":
        brand_color = PRESET_LOGO_BRAND_COLORS.get(preset_logo.lower())
        color_to_use = preset_logo_color if preset_logo_color else (brand_color if brand_color else fill_color)
        logo_image = generate_preset_logo(preset_logo, hex_to_rgb(color_to_use))
        
    # Map error correction level string to qrcode constant
    _ec_map = {
        "L": qrcode.constants.ERROR_CORRECT_L,
        "M": qrcode.constants.ERROR_CORRECT_M,
        "Q": qrcode.constants.ERROR_CORRECT_Q,
        "H": qrcode.constants.ERROR_CORRECT_H,
    }
    ec_level = _ec_map.get(error_correction, qrcode.constants.ERROR_CORRECT_H)

    qr = qrcode.QRCode(
        error_correction=ec_level,
        box_size=box_size,
        border=quiet_zone,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Clear modules under the logo to prevent dots showing through
    if has_logo and logo_clear_size >= 0:
        modules_count = len(qr.modules)
        cx = (modules_count - 1) / 2.0
        cy = (modules_count - 1) / 2.0
        
        # The logo is scaled to logo_size_ratio of the total image width
        logo_module_width = (modules_count + 8) * logo_size_ratio
        
        # We clear a circular area based on L2 distance
        clear_radius = (logo_module_width / 2.0) + logo_clear_size
        
        for y in range(modules_count):
            for x in range(modules_count):
                dx = x - cx
                dy = y - cy
                dist = math.sqrt(dx*dx + dy*dy)
                
                if dist < clear_radius:
                    # Do not clear the corner eyes
                    if not (x < 8 and y < 8) and not (x > modules_count - 9 and y < 8) and not (x < 8 and y > modules_count - 9):
                        qr.modules[y][x] = False

    module_drawers = {
        "sleek_dash": SleekDashModuleDrawer,
        "square": SquareModuleDrawer,
        "gapped": GappedSquareModuleDrawer,
        "circle": CircleModuleDrawer,
        "rounded": RoundedModuleDrawer,
        "vertical_bars": VerticalBarsDrawer,
        "horizontal_bars": HorizontalBarsDrawer,
        "diamond": DiamondModuleDrawer,
        "ring": RingModuleDrawer,
        "star": StarModuleDrawer,
        "flower_cut": FlowerCutModuleDrawer,
        "clover": CloverModuleDrawer,
        "plus": PlusModuleDrawer,
        "rounded_plus": RoundedPlusModuleDrawer,
        "heart": HeartModuleDrawer,
        "sheared": ShearedModuleDrawer,
        "bevel": BevelModuleDrawer,
        "fishtail": FishtailModuleDrawer,
        "squircle": SquircleModuleDrawer,
        "hexagon": HexagonModuleDrawer,
        "target_bullseye": TargetBullseyeModuleDrawer,
        "diamond_target": DiamondTargetModuleDrawer,
        "octagon": OctagonModuleDrawer,
        "dotted_cross": DottedCrossModuleDrawer,
        "arrow": ArrowModuleDrawer,
        "gear_dot": GearDotModuleDrawer,
        "hourglass": HourglassModuleDrawer,
        "pinwheel": PinwheelModuleDrawer,
        "leaf_droplet": LeafDropletModuleDrawer,
        "pillow": PillowModuleDrawer,
        "quad_dots": QuadDotsModuleDrawer,
        "tech_chevron": TechChevronModuleDrawer,
        "sparkle": SparkleModuleDrawer,
        "medical_cross": MedicalCrossModuleDrawer,
        "lotus_petal": LotusPetalModuleDrawer,
        "network_nodes": NetworkNodesModuleDrawer,

        "minimal_dots": MinimalDotsModuleDrawer,
        "hollow_dots": HollowDotsModuleDrawer,
        "crossstitch": CrossstitchModuleDrawer,
        "pixel_art": PixelArtModuleDrawer,
        "diagonal_stripe": DiagonalStripeModuleDrawer,
        "horizontal_slash": HorizontalSlashModuleDrawer,
        "vertical_slash": VerticalSlashModuleDrawer,
        "triangle_mosaic": TriangleMosaicModuleDrawer,
        "moon_crescent": MoonCrescentModuleDrawer,
        "liquid_drop": LiquidDropModuleDrawer,

    }
    drawer_class = module_drawers.get(dot_style, SquareModuleDrawer)
    drawer = drawer_class()
    
    fg = hex_to_rgb(fill_color) if str(fill_color).startswith('#') else (0, 0, 0)
    bg = hex_to_rgb(back_color) if str(back_color).startswith('#') else (255, 255, 255)
    
    if gradient_type == "Solid Color" or not fill_color_end or fill_color_end == fill_color:
        fg_end = fg
    elif fill_color_end == "#000000" and fill_color.lower() in ["#ffffff", "#fff"]:
        fg_end = fg
    else:
        fg_end = hex_to_rgb(fill_color_end) if str(fill_color_end).startswith('#') else fg

    if gradient_type in ["Vertical Gradient", "Linear Vertical"]:
        color_mask = VerticalGradiantColorMask(back_color=bg, top_color=fg, bottom_color=fg_end)
    elif gradient_type in ["Horizontal Gradient", "Linear Horizontal"]:
        color_mask = HorizontalGradiantColorMask(back_color=bg, left_color=fg, right_color=fg_end)
    elif gradient_type in ["Radial Gradient", "Radial Center"]:
        color_mask = RadialGradiantColorMask(back_color=bg, center_color=fg, edge_color=fg_end)
    elif gradient_type in ["Diagonal (TL to BR)", "Diagonal Gradient"]:
        color_mask = DiagonalGradiantColorMask(back_color=bg, start_color=fg, end_color=fg_end, direction="TL_BR")
    elif gradient_type in ["Diagonal (TR to BL)"]:
        color_mask = DiagonalGradiantColorMask(back_color=bg, start_color=fg, end_color=fg_end, direction="TR_BL")
    else:
        color_mask = SolidFillColorMask(back_color=bg, front_color=fg)

    img = qr.make_image(
        image_factory=CustomStyledPilImage,
        module_drawer=drawer,
        color_mask=color_mask,
    ).convert("RGBA")
    
    # Custom Eyes
    # The eyes are 7x7 modules at top-left, top-right, and bottom-left.
    border_modules = quiet_zone
    s = box_size
    modules_count = len(qr.modules)
    
    eye_positions = [
        (border_modules, border_modules), # Top-Left
        (modules_count + border_modules - 7, border_modules), # Top-Right
        (border_modules, modules_count + border_modules - 7) # Bottom-Left
    ]
    
    draw = ImageDraw.Draw(img)
    eye_rgb = hex_to_rgb(eye_color) if eye_color and str(eye_color).startswith('#') else fg
    eyeball_rgb = hex_to_rgb(eyeball_color) if eyeball_color and str(eyeball_color).startswith('#') else eye_rgb
    
    # Ensure eyes and eyeballs have contrast against background
    bg_lum = bg[0]*0.299 + bg[1]*0.587 + bg[2]*0.114
    if eye_rgb == bg or (eye_color == "#000000" and fg != (0, 0, 0) and bg_lum < 128):
        eye_rgb = fg
    if eyeball_rgb == bg or (eyeball_color == "#000000" and fg != (0, 0, 0) and bg_lum < 128):
        eyeball_rgb = eye_rgb
    
    # Save globals to avoid overwriting across iterations
    global_eye_frame_style = eye_frame_style
    global_eyeball_style = eyeball_style
    global_eye_rgb = eye_rgb
    global_eyeball_rgb = eyeball_rgb

    # We will erase the existing eyes and draw new ones
    for ex, ey in eye_positions:
        px = ex * s
        py = ey * s
        
        # Determine corner position
        corner = "tl"
        if ex > border_modules and ey == border_modules:
            corner = "tr"
        elif ex == border_modules and ey > border_modules:
            corner = "bl"

        # Apply specific styling if eyes are not linked
        link_eyes = params.get("link_eyes", True)
        
        # Reset to globals at start of each iteration
        eye_frame_style = global_eye_frame_style
        eyeball_style = global_eyeball_style
        eye_rgb = global_eye_rgb
        eyeball_rgb = global_eyeball_rgb

        if not link_eyes:
            pos_frame = params.get(f"eye_frame_style_{corner}")
            if pos_frame:
                eye_frame_style = pos_frame
            pos_eball = params.get(f"eyeball_style_{corner}")
            if pos_eball:
                eyeball_style = pos_eball
            pos_ecol = params.get(f"eye_color_{corner}")
            if pos_ecol:
                eye_rgb = hex_to_rgb(pos_ecol) if str(pos_ecol).startswith('#') else fg
            pos_ebcol = params.get(f"eyeball_color_{corner}")
            if pos_ebcol:
                eyeball_rgb = hex_to_rgb(pos_ebcol) if str(pos_ebcol).startswith('#') else eye_rgb

        # Restore the aliases used further down the file
        current_eye_frame_style = eye_frame_style
        current_eyeball_style = eyeball_style
        current_eye_rgb = eye_rgb
        current_eyeball_rgb = eyeball_rgb

        # Erase existing eye
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=bg + (255,))
        
        # Draw outer frame
        draw_eye_frame(draw, px, py, s, current_eye_frame_style, current_eye_rgb, bg, img=img)

        # Draw inner eyeball
        ebx = px + 2*s
        eby = py + 2*s
        draw_eyeball(draw, ebx, eby, px, py, s, current_eyeball_style, current_eyeball_rgb, bg, img=img)

    if bg_transparent:
        img = remove_qr_background(img, back_color)

    if logo_image:
        img = apply_logo_overlay(
            img, logo_image,
            remove_logo_bg=remove_logo_bg,
            logo_bg_color=logo_bg_color,
            logo_bg_tolerance=logo_bg_tolerance,
            logo_size_ratio=logo_size_ratio,
            logo_card_shape=logo_card_shape,
            logo_card_padding=logo_card_padding,
            bg=bg
        )

    return img

import qrcode.image.svg
def generate_svg_qr(data, fill_color="#000000", back_color="#ffffff", box_size=30, bg_transparent=False, error_correction="H", quiet_zone=4, canvas_radius=0):
    """Generates a raw SVG QR code (without custom styled dots or frames)"""
    _ec_map = {
        "L": qrcode.constants.ERROR_CORRECT_L,
        "M": qrcode.constants.ERROR_CORRECT_M,
        "Q": qrcode.constants.ERROR_CORRECT_Q,
        "H": qrcode.constants.ERROR_CORRECT_H,
    }
    ec_level = _ec_map.get(error_correction, qrcode.constants.ERROR_CORRECT_M)
    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.QRCode(
        error_correction=ec_level,
        box_size=box_size,
        border=quiet_zone,
        image_factory=factory
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image()
    svg_str = img.to_string().decode('utf-8')
    
    import re
    # 1. Replace width and height to be 100% and responsive with aspect-ratio constraint
    svg_str = re.sub(r'width="[^"]+"', 'width="100%"', svg_str, count=1)
    svg_str = re.sub(r'height="[^"]+"', 'height="100%"', svg_str, count=1)
    if 'style=' not in svg_str:
        svg_str = svg_str.replace('<svg ', '<svg style="max-width: 100%; max-height: 100vh; height: auto;" ', 1)
    
    # 2. Add custom fill color to paths (replacing standard black style="fill:#000000;...")
    svg_str = svg_str.replace("fill:#000000", f"fill:{fill_color}")
    
    # 3. Add background color rect matching back_color if not transparent
    if not bg_transparent:
        match = re.search(r'viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"', svg_str)
        if match:
            v_w = float(match.group(1))
            v_h = float(match.group(2))
            rx = v_w * (canvas_radius / 300.0) if canvas_radius > 0 else 0
            if rx > 0:
                rect_str = f'<rect width="{v_w}" height="{v_h}" fill="{back_color}" rx="{rx}" ry="{rx}"/>'
            else:
                rect_str = f'<rect width="{v_w}" height="{v_h}" fill="{back_color}"/>'
            tag_end = svg_str.find('>')
            if tag_end != -1:
                svg_str = svg_str[:tag_end+1] + "\n  " + rect_str + svg_str[tag_end+1:]
            
    return svg_str.encode('utf-8')
