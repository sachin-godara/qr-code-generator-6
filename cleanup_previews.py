import os
import re

def get_options(options_file, array_name):
    with open(options_file, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(f'export const {array_name}\\s*=\\s*\\[(.*?)\\];', content, re.DOTALL)
    if not match: return []
    return re.findall(r'[\'"]([^\'"]+)[\'"]', match.group(1))

options_file = r'f:\Project 001\qr code generator 6\frontend\src\data\options.ts'
valid_eyeballs = get_options(options_file, 'EYEBALL_STYLES')
valid_eye_frames = get_options(options_file, 'EYE_FRAME_STYLES')
valid_dots = get_options(options_file, 'DOT_STYLES')

def cleanup(dir_path, valid_names):
    if not os.path.exists(dir_path): return
    for f in os.listdir(dir_path):
        if f.endswith('.png'):
            name = f[:-4]
            if name not in valid_names:
                print(f"Removing invalid preview: {name}.png from {os.path.basename(dir_path)}")
                os.remove(os.path.join(dir_path, f))

cleanup(r'f:\Project 001\qr code generator 6\frontend\public\previews\eyeballs', valid_eyeballs)
cleanup(r'f:\Project 001\qr code generator 6\frontend\public\previews\eye_frames', valid_eye_frames)
cleanup(r'f:\Project 001\qr code generator 6\frontend\public\previews\dots', valid_dots)
