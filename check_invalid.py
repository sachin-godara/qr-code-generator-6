import json
import re

with open('f:/Project 001/qr code generator 6/frontend/src/data/options.ts', 'r', encoding='utf-8') as f:
    opts_content = f.read()

valid_frames = []
for m in re.finditer(r'export const EYE_FRAME_STYLES = \[(.*?)\];', opts_content, re.DOTALL):
    s = m.group(1)
    valid_frames.extend(re.findall(r'\"([a-zA-Z0-9_]+)\"', s))
    
with open('f:/Project 001/qr code generator 6/frontend/src/data/templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const PRESET_TEMPLATES:\s*Template\[\]\s*=\s*(\[\s*\{.*?\}\s*\])\s*;?', content, re.DOTALL)
templates = json.loads(match.group(1))

invalid = set()
for t in templates:
    fs = t.get('settings', {}).get('eye_frame_style')
    if fs and fs not in valid_frames and fs != 'none':
        print(f'Invalid {fs} in {t.get("name")}')
        invalid.add(fs)
print('All invalid:', invalid)
