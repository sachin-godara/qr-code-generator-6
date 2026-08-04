import pytest
from PIL import Image
from engines.core.utils import hex_to_rgb
from engines.core.noise import value_noise_1d, fractal_noise_1d
from engines.dots import MODULE_DRAWER_REGISTRY
from engines.eyes import draw_eye_frame, draw_eyeball
from engines.logo import PRESET_LOGO_BRAND_COLORS, make_color_transparent, remove_qr_background
from engines.frames import apply_layout_frame

def test_hex_to_rgb():
    assert hex_to_rgb("#FF0000") == (255, 0, 0)
    assert hex_to_rgb("00FF00") == (0, 255, 0)
    assert hex_to_rgb("invalid") == (0, 0, 0)

def test_noise_functions():
    n1 = value_noise_1d(10, 1.0, 1.0)
    assert isinstance(n1, list)
    fn = fractal_noise_1d(10, 1.0, 1.0, 2.0, 0.5, 0)
    assert isinstance(fn, list)

def test_module_drawers_registry():
    assert len(MODULE_DRAWER_REGISTRY) >= 30
    assert "diamond" in MODULE_DRAWER_REGISTRY
    assert "star" in MODULE_DRAWER_REGISTRY
    assert "clover" in MODULE_DRAWER_REGISTRY

def test_eye_frames_and_eyeballs_rendering():
    img = Image.new("RGBA", (300, 300), (255, 255, 255, 255))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    
    # Test outer frame
    draw_eye_frame(draw, 10, 10, 10, "octagon", (0, 0, 0), (255, 255, 255))
    draw_eye_frame(draw, 100, 10, 10, "star", (255, 0, 0), (255, 255, 255))
    
    # Test inner eyeball
    draw_eyeball(draw, 30, 30, 10, 10, 10, "diamond", (0, 0, 0), (255, 255, 255))
    draw_eyeball(draw, 120, 30, 100, 10, 10, "gear", (255, 0, 0), (255, 255, 255))
    
    assert img.size == (300, 300)

def test_logo_utilities():
    assert "wifi" in PRESET_LOGO_BRAND_COLORS
    assert PRESET_LOGO_BRAND_COLORS["wifi"] == "#0f766e"
    
    img = Image.new("RGBA", (100, 100), (255, 255, 255, 255))
    transparent = make_color_transparent(img, (255, 255, 255), tolerance=10)
    assert transparent.mode == "RGBA"

def test_layout_frames():
    qr_img = Image.new("RGBA", (200, 200), (0, 0, 0, 255))
    framed = apply_layout_frame(qr_img, layout_template="border", frame_color="#000000", padding=20)
    assert framed.size == (240, 240)
