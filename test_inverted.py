import sys
import os
import cv2
import numpy as np

sys.path.append(os.path.abspath('backend'))
from services.qr_service import generate_qr_image
from services.scan_service import deep_scan_qr

params = {
    "dots_style": "gapped",
    "bg_color": "#000000",
    "dots_color": "#ffffff",
    "box_size": 10
}
data = "https://example.com/tiktok/test"
img_io = generate_qr_image(data, params)
img_bytes = img_io.getvalue()

try:
    res = deep_scan_qr(img_bytes)
    print("Result on inverted:", res)
except Exception as e:
    print("Failed:", e)
