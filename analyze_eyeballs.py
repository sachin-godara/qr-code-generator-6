import os
from PIL import Image

eyeball_dir = r'f:\Project 001\qr code generator 6\frontend\public\previews\eyeballs'
print(f'{"Style":<20} | {"Bounding Box (L, T, R, B)":<30} | {"Size (W, H)"}')
print('-' * 70)
for file in os.listdir(eyeball_dir):
    if file.endswith('.png'):
        img = Image.open(os.path.join(eyeball_dir, file)).convert('RGBA')
        bbox = img.getbbox()
        if bbox:
            w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
            print(f'{file.replace(".png",""):<20} | {str(bbox):<30} | {w}x{h}')
        else:
            print(f'{file.replace(".png",""):<20} | {"EMPTY":<30} | 0x0')
