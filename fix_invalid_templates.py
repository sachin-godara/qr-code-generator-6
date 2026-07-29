import re
import json

templates_path = 'f:/Project 001/qr code generator 6/frontend/src/data/templates.ts'

with open(templates_path, 'r', encoding='utf-8') as f:
    content = f.read()

dot_map = {
    'clover_4leaf': 'clover',
    'crescent_moon': 'circle',
    'cross_hatch': 'sleek_dash',
    'gradient_mesh': 'minimal_dots',
    'hollow_dots': 'circle',
    'honeycomb': 'hexagon',
    'moon_crescent': 'circle',
    'neon_ring': 'circle',
    'pinwheel': 'star',
    'pixel_cross': 'plus',
    'ring': 'circle',
    'shield_badge': 'target_bullseye',
    'sparkle_star': 'star',
    'starburst': 'star',
    'teardrop': 'leaf_droplet',
    'tech_chevron': 'arrow',
    'wave_bar': 'horizontal_bars'
}

frame_map = {
    'brackets_curly': 'rounded',
    'brackets_square': 'square',
    'capsule_horizontal': 'rounded',
    'circle': 'rounded',
    'corner_brackets': 'square',
    'corner_dots': 'rounded',
    'dashed_square': 'square',
    'diamond': 'octagon',
    'dotted_circle': 'rounded',
    'double_ring': 'rounded',
    'gear': 'cross_notch_frame',
    'hexagon': 'octagon',
    'hollow_diamond': 'square',
    'house_frame': 'pointed_top_frame',
    'minimal_corners': 'square',
    'minimal_ring': 'rounded',
    'pill_frame': 'rounded',
    'sheared': 'leaf',
    'star': 'arch_frame',
    'steering_wheel': 'camera_lens',
    'target_minimal': 'camera_lens',
    'tv_frame': 'rounded',
    'ultra_thin_circle': 'rounded',
    'ultra_thin_square': 'square'
}

ball_map = {
    'corner_brackets': 'square',
    'cross': 'plus',
    'dumbbell_eyeball': 'rounded',
    'flower': 'flower_cut',
    'hollow_circle': 'circle',
    'hollow_square': 'square',
    'horizontal_pill': 'rounded',
    'minimal_cross': 'plus',
    'minimal_x': 'plus',
    'rounded_triangle': 'droplet_tl',
    'slash_back': 'sheared',
    'slash_forward': 'sheared',
    'star': 'rhombus',
    'target_bullseye': 'circle',
    'tiny_dot': 'circle',
    'tiny_square': 'square',
    'vertical_pill': 'rounded'
}

for old, new in dot_map.items():
    content = re.sub(r'(dots_style["\']?\s*:\s*["\'])' + old + r'(["\'])', r'\g<1>' + new + r'\g<2>', content)

for old, new in frame_map.items():
    content = re.sub(r'(eye_frame_style["\']?\s*:\s*["\'])' + old + r'(["\'])', r'\g<1>' + new + r'\g<2>', content)
    
for old, new in ball_map.items():
    content = re.sub(r'(eyeball_style["\']?\s*:\s*["\'])' + old + r'(["\'])', r'\g<1>' + new + r'\g<2>', content)

with open(templates_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete with mapped styles.")
