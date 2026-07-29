import io
import cv2
import numpy as np
from PIL import Image
from pyzbar.pyzbar import decode
import sys

def analyze_readability(img_bytes):
    # Convert bytes to cv2 image
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 1. Base decode
    base_decoded = decode(img)
    if not base_decoded:
        return 0
        
    score = 100
    
    # Test resilience by blurring
    for k in [3, 5, 7, 9, 11, 15, 19]:
        blurred = cv2.GaussianBlur(img, (k, k), 0)
        if not decode(blurred):
            score -= 10
            break
            
    # Test resilience by shrinking
    for scale in [0.8, 0.6, 0.4, 0.3, 0.2]:
        shrunk = cv2.resize(img, (0,0), fx=scale, fy=scale)
        if not decode(shrunk):
            score -= 10
            break
            
    # Test contrast (convert to grayscale and reduce contrast)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    for alpha in [0.8, 0.6, 0.4, 0.2]:
        low_contrast = cv2.convertScaleAbs(gray, alpha=alpha, beta=128*(1-alpha))
        if not decode(low_contrast):
            score -= 10
            break
            
    return max(10, score)

if __name__ == "__main__":
    with open("f:/Project 001/qr code generator 6/frontend/public/previews/dots/square.png", "rb") as f:
        print(f"Score for square dot: {analyze_readability(f.read())}%")
