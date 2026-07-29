import os
import sys
import re
from PIL import Image

sys.path.append(r'f:\Project 001\qr code generator 6\backend')
from qr_engine import generate_styled_qr

def remove_white(img):
    new_data = []
    for p in img.getdata():
        if p[:3] == (255, 255, 255):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(p)
    img.putdata(new_data)
    return img

def get_options(array_name):
    options_file = r'f:\Project 001\qr code generator 6\frontend\src\data\options.ts'
    with open(options_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the array block
    match = re.search(f'export const {array_name}\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        return []
        
    array_content = match.group(1)
    
    # Extract string literals
    items = re.findall(r'[\'"]([^\'"]+)[\'"]', array_content)
    return items

def generate_robust_eyeballs():
    eyeball_styles = get_options('EYEBALL_STYLES')
    
    out_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews\eyeballs"
    os.makedirs(out_dir, exist_ok=True)
    
    s = 48
    quiet_zone = 4
    
    for eyeball_style in eyeball_styles:
        try:
            # Generate full QR with the style
            qr_img = generate_styled_qr(
                data="A", 
                box_size=s, 
                eyeball_style=eyeball_style,
                eye_frame_style="none", # remove frame to avoid overlaps
                quiet_zone=quiet_zone,
                bg_transparent=True,
                fill_color="#000000",
                eyeball_color="#000000"
            )
            
            # Calculate eyeball position
            padding = quiet_zone * s
            px, py = padding, padding
            ebx, eby = px + 2*s, py + 2*s
            
            # Crop exactly 200x200 centered such that ebx is at 28
            crop_box = (ebx - 28, eby - 28, ebx + 172, eby + 172)
            eyeball_crop = qr_img.crop(crop_box)
            eyeball_crop = remove_white(eyeball_crop)
            eyeball_crop.save(os.path.join(out_dir, f"{eyeball_style}.png"))
            print(f"Generated eyeball {eyeball_style}.png")
        except Exception as e:
            print(f"Error generating eyeball {eyeball_style}: {e}")

def generate_robust_eye_frames():
    eye_frame_styles = get_options('EYE_FRAME_STYLES')
    
    out_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews\eye_frames"
    os.makedirs(out_dir, exist_ok=True)
    
    s = 24
    quiet_zone = 4
    
    for eye_frame_style in eye_frame_styles:
        if eye_frame_style == "none":
            continue
            
        try:
            qr_img = generate_styled_qr(
                data="A", 
                box_size=s, 
                eye_frame_style=eye_frame_style,
                eyeball_style="none", # remove eyeball to isolate frame
                dot_style="square", # Doesn't matter
                quiet_zone=quiet_zone,
                bg_transparent=True,
                fill_color="#000000",
                eye_color="#000000"
            )
            
            padding = quiet_zone * s
            px, py = padding, padding
            
            # Crop exactly 200x200 centered such that px is at 16
            crop_box = (px - 16, py - 16, px + 184, py + 184)
            frame_crop = qr_img.crop(crop_box)
            frame_crop = remove_white(frame_crop)
            frame_crop.save(os.path.join(out_dir, f"{eye_frame_style}.png"))
            print(f"Generated eye frame {eye_frame_style}.png")
        except Exception as e:
            print(f"Error generating eye frame {eye_frame_style}: {e}")

if __name__ == "__main__":
    # generate_robust_eyeballs()
    generate_robust_eye_frames()
