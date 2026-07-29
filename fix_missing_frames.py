import re

templates_path = 'f:/Project 001/qr code generator 6/frontend/src/data/templates.ts'

with open(templates_path, 'r', encoding='utf-8') as f:
    content = f.read()

frame_map = {
    'target_bullseye': 'camera_lens',
    'border': 'rounded',
    'brackets': 'cross_notch_frame'
}

for old, new in frame_map.items():
    content = re.sub(r'(eye_frame_style["\']?\s*:\s*["\'])' + old + r'(["\'])', r'\g<1>' + new + r'\g<2>', content)
    
with open(templates_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete with mapped styles.")
