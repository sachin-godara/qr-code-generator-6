import pytest
from services.qr_service import generate_qr_image, generate_qr_svg

def test_generate_qr_image_default():
    img_bytes = generate_qr_image("https://example.com", {})
    assert img_bytes is not None
    assert img_bytes.getbuffer().nbytes > 0

def test_generate_qr_image_styled():
    params = {
        "dot_style": "diamond",
        "eye_frame_style": "octagon",
        "eyeball_style": "diamond",
        "fill_color": "#1e293b",
        "back_color": "#f8fafc"
    }
    img_bytes = generate_qr_image("https://example.com", params)
    assert img_bytes is not None
    assert img_bytes.getbuffer().nbytes > 0

def test_no_stretching_resolution_strategy():
    # Native 1:1 crisp grid mode
    img_bytes_native = generate_qr_image("test", {"target_size": 1024, "no_stretching": True})
    # Smooth upscaling mode
    img_bytes_smooth = generate_qr_image("test", {"target_size": 1024, "no_stretching": False})
    
    assert img_bytes_native.getbuffer().nbytes > 0
    assert img_bytes_smooth.getbuffer().nbytes > 0
    # Crisp native render has cleaner grid lines and smaller compressed byte size
    assert img_bytes_native.getbuffer().nbytes != img_bytes_smooth.getbuffer().nbytes

def test_generate_qr_svg():
    svg_bytes = generate_qr_svg("https://example.com", {})
    assert svg_bytes is not None
    assert b"<svg" in svg_bytes
