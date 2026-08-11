import sys
import os
import cv2
import numpy as np

sys.path.append(os.path.abspath('backend'))
from services.scan_service import get_wechat_detector

d = get_wechat_detector()
print(f"Detector initialized: {d is not None}")
