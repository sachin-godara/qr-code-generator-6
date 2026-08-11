import sys
import os
import cv2
import numpy as np

sys.path.append(os.path.abspath('backend'))
from services.qr_service import generate_qr_image
from services.scan_service import get_wechat_detector

params = {
    "dots_style": "gapped",
    "bg_color": "#ffffff",
    "bg_transparent": True,
    "dots_color": "#000000",
    "box_size": 10
}
data = "https://example.com/tiktok/test"
img_io = generate_qr_image(data, params)
img_bytes = img_io.getvalue()

nparr = np.frombuffer(img_bytes, np.uint8)
img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

detector = get_wechat_detector()
res, _ = detector.detectAndDecode(img)
print("Result with IMREAD_COLOR:", res)

img_bgra = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
if img_bgra.shape[2] == 4:
    # Blend with white background
    alpha = img_bgra[:, :, 3] / 255.0
    img_bgr = np.empty((img_bgra.shape[0], img_bgra.shape[1], 3), dtype=np.uint8)
    for c in range(3):
        img_bgr[:, :, c] = (alpha * img_bgra[:, :, c] + (1 - alpha) * 255).astype(np.uint8)
    res_bgr, _ = detector.detectAndDecode(img_bgr)
    print("Result with blended white bg:", res_bgr)
