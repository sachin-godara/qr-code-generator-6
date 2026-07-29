import json
import re

options_path = 'f:/Project 001/qr code generator 6/frontend/src/data/options.ts'
templates_path = 'f:/Project 001/qr code generator 6/frontend/src/data/templates.ts'

with open(options_path, 'r', encoding='utf-8') as f:
    opts_content = f.read()

def get_valid(regex):
    matches = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', re.search(regex, opts_content, re.DOTALL).group(0))
    return set(m.strip() for m in matches)

valid_dots = get_valid(r'export const DOT_STYLES.*?;')
valid_frames = get_valid(r'export const EYE_FRAME_STYLES.*?;')
valid_balls = get_valid(r'export const EYEBALL_STYLES.*?;')

with open(templates_path, 'r', encoding='utf-8') as f:
    tmpl_content = f.read()

invalid_found = []
for tmpl in re.finditer(r'\{[^{}]*name:\s*[\'"]([^\'"]+)[\'"].*?settings:\s*(\{.*?\})', tmpl_content, re.DOTALL):
    name = tmpl.group(1)
    settings_str = tmpl.group(2)
    
    dots = re.search(r'dots_style:\s*[\'"]([^\'"]+)[\'"]', settings_str)
    frame = re.search(r'eye_frame_style:\s*[\'"]([^\'"]+)[\'"]', settings_str)
    ball = re.search(r'eyeball_style:\s*[\'"]([^\'"]+)[\'"]', settings_str)
    
    if dots and dots.group(1) not in valid_dots:
        invalid_found.append((name, 'dots_style', dots.group(1)))
    if frame and frame.group(1) not in valid_frames:
        invalid_found.append((name, 'eye_frame_style', frame.group(1)))
    if ball and ball.group(1) not in valid_balls:
        invalid_found.append((name, 'eyeball_style', ball.group(1)))

print(invalid_found)
