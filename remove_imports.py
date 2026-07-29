file_path = r'f:\Project 001\qr code generator 6\backend\services\qr_service.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
    
# Remove 'import cv2' and 'import numpy as np' and 'from pyzbar.pyzbar import decode'
lines = content.split('\n')
new_lines = [l for l in lines if 'import cv2' not in l and 'from pyzbar.pyzbar import decode' not in l and 'import numpy as np' not in l]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
print("Cleaned up imports in qr_service.py")
