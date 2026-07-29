import os
import sys
import re
from PIL import Image

sys.path.append(r'f:\Project 001\qr code generator 6\backend')
from qr_engine import generate_styled_qr

try:
    from pyzbar.pyzbar import decode
except ImportError:
    print("pyzbar not installed")
    sys.exit(1)

def get_options(array_name):
    options_file = r'f:\Project 001\qr code generator 6\frontend\src\data\options.ts'
    with open(options_file, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(f'export const {array_name}\\s*=\\s*\\[(.*?)\\];', content, re.DOTALL)
    if not match: return []
    return re.findall(r'[\'"]([^\'"]+)[\'"]', match.group(1))

def test_qr(dot='square', frame='square', ball='square'):
    try:
        qr_img = generate_styled_qr(
            data="https://example.com/test-qr-code", 
            box_size=10, 
            dot_style=dot,
            eye_frame_style=frame,
            eyeball_style=ball,
            quiet_zone=4,
            bg_transparent=False
        )
        
        decoded = decode(qr_img)
        return len(decoded) > 0
    except Exception as e:
        print(f"Error testing dot={dot} frame={frame} ball={ball}: {e}")
        return False

if __name__ == "__main__":
    dot_styles = get_options('DOT_STYLES')
    eye_frame_styles = get_options('EYE_FRAME_STYLES')
    eyeball_styles = get_options('EYEBALL_STYLES')
    
    failing_dots = []
    for d in dot_styles:
        if not test_qr(dot=d): failing_dots.append(d)
        
    failing_frames = []
    for f in eye_frame_styles:
        if f != 'none' and not test_qr(frame=f): failing_frames.append(f)
        
    failing_balls = []
    for b in eyeball_styles:
        if not test_qr(ball=b): failing_balls.append(b)
        
    print(f"Failed Dots: {failing_dots}")
    print(f"Failed Frames: {failing_frames}")
    print(f"Failed Balls: {failing_balls}")
