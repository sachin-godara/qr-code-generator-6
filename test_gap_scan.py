import sys
import os
sys.path.append(os.path.abspath('backend'))

from services.qr_service import generate_qr_image
from services.scan_service import deep_scan_qr

def test_qr(desc, p):
    data = "https://example.com/tiktok/test"
    img_io = generate_qr_image(data, p)
    try:
        res = deep_scan_qr(img_io.getvalue())
        print(f"{desc}: SUCCESS ({res})")
    except Exception as e:
        print(f"{desc}: FAIL ({e})")

test_qr("Base (Square)", {"box_size": 10})
test_qr("Gapped Dots only", {"dots_style": "gapped", "box_size": 10})
test_qr("Swept Frame only", {"eye_frame_style": "dynamic_swept", "box_size": 10})
test_qr("Clover Ball only", {"eyeball_style": "clover", "box_size": 10})
test_qr("All three together", {
    "dots_style": "gapped",
    "eye_frame_style": "dynamic_swept",
    "eyeball_style": "clover",
    "box_size": 10
})
