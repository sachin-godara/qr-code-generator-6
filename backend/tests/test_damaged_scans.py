import io
import cv2
import numpy as np
import pytest
import qrcode
from services.scan_service import deep_scan_qr, pad_quiet_zone

PAYLOAD = "https://damaged-qr-test.com/payload-secure-12345"

@pytest.fixture(scope="module")
def base_qr_cv():
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)
    qr.add_data(PAYLOAD)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    cv_img = np.array(img)[:, :, ::-1].copy()
    return cv_img

def encode_png_bytes(img: np.ndarray) -> bytes:
    _, buf = cv2.imencode(".png", img)
    return buf.tobytes()

def test_clean_baseline(base_qr_cv):
    res = deep_scan_qr(encode_png_bytes(base_qr_cv))
    assert res == PAYLOAD

def test_zero_quiet_zone():
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
    qr.add_data(PAYLOAD)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    cv_img = np.array(img)[:, :, ::-1].copy()
    res = deep_scan_qr(encode_png_bytes(cv_img))
    assert res == PAYLOAD

def test_gradient_shadow(base_qr_cv):
    h, w = base_qr_cv.shape[:2]
    grad = np.linspace(0.2, 1.2, w, endpoint=True)
    shadow_img = np.clip(base_qr_cv * grad[None, :, None], 0, 255).astype(np.uint8)
    res = deep_scan_qr(encode_png_bytes(shadow_img))
    assert res == PAYLOAD

def test_defocus_blur(base_qr_cv):
    blurred = cv2.GaussianBlur(base_qr_cv, (9, 9), 2.5)
    res = deep_scan_qr(encode_png_bytes(blurred))
    assert res == PAYLOAD

def test_scratches_across_data(base_qr_cv):
    h, w = base_qr_cv.shape[:2]
    scratched = base_qr_cv.copy()
    cv2.line(scratched, (150, 40), (150, h - 40), (255, 255, 255), 5)
    cv2.line(scratched, (40, 200), (w - 40, 200), (255, 255, 255), 5)
    cv2.line(scratched, (100, 300), (w - 100, 300), (0, 0, 0), 5)
    res = deep_scan_qr(encode_png_bytes(scratched))
    assert res == PAYLOAD

def test_diagonal_rotation_45(base_qr_cv):
    h, w = base_qr_cv.shape[:2]
    M = cv2.getRotationMatrix2D((w / 2, h / 2), 45, 0.75)
    rot45 = cv2.warpAffine(base_qr_cv, M, (w, h), borderValue=(255, 255, 255))
    res = deep_scan_qr(encode_png_bytes(rot45))
    assert res == PAYLOAD

def test_low_contrast_faded(base_qr_cv):
    faded = np.clip(base_qr_cv * 0.25 + 140, 0, 255).astype(np.uint8)
    res = deep_scan_qr(encode_png_bytes(faded))
    assert res == PAYLOAD

def test_salt_and_pepper_noise(base_qr_cv):
    h, w = base_qr_cv.shape[:2]
    noisy = base_qr_cv.copy()
    num_noise = int(0.04 * w * h)
    for _ in range(num_noise):
        y = np.random.randint(0, h)
        x = np.random.randint(0, w)
        noisy[y, x] = [255, 255, 255] if np.random.rand() > 0.5 else [0, 0, 0]
    res = deep_scan_qr(encode_png_bytes(noisy))
    assert res == PAYLOAD

def test_over_inked_bleed(base_qr_cv):
    kernel = np.ones((3, 3), np.uint8)
    bleed = cv2.erode(base_qr_cv, kernel)
    res = deep_scan_qr(encode_png_bytes(bleed))
    assert res == PAYLOAD

def test_starved_broken_modules(base_qr_cv):
    kernel = np.ones((3, 3), np.uint8)
    starved = cv2.dilate(base_qr_cv, kernel)
    res = deep_scan_qr(encode_png_bytes(starved))
    assert res == PAYLOAD
