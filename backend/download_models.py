import os
import urllib.request

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models", "wechat_qr"))
os.makedirs(MODELS_DIR, exist_ok=True)

BASE_URL = "https://raw.githubusercontent.com/WeChatCV/opencv_3rdparty/wechat_qrcode/"
FILES = [
    "detect.prototxt",
    "detect.caffemodel",
    "sr.prototxt",
    "sr.caffemodel"
]

print("Downloading WeChat QR models...")
for filename in FILES:
    file_path = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(file_path):
        url = BASE_URL + filename
        print(f"Downloading {filename}...")
        urllib.request.urlretrieve(url, file_path)
        print(f"Saved to {file_path}")
    else:
        print(f"{filename} already exists.")

print("All models downloaded.")
