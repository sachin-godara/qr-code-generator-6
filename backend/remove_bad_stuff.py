import json
import re

# 1. Update options.ts
options_path = 'f:/Project 001/qr code generator 6/frontend/src/data/options.ts'
with open(options_path, 'r', encoding='utf-8') as f:
    options_content = f.read()

bad_dots = ['minimal_dots', 'sleek_dash', 'fishtail', 'liquid_drop']
bad_eyes = ['leaf', 'hex_nut']
bad_balls = ['flower_cut', 'plus']

def remove_from_list(content, bad_list):
    for bad in bad_list:
        content = re.sub(rf'"{bad}"\s*,\s*', '', content)
        content = re.sub(rf',\s*"{bad}"', '', content)
    return content

options_content = remove_from_list(options_content, bad_dots)
options_content = remove_from_list(options_content, bad_eyes)
options_content = remove_from_list(options_content, bad_balls)

with open(options_path, 'w', encoding='utf-8') as f:
    f.write(options_content)
    
print("Updated options.ts")

# 2. Delete the 8 templates from templates.ts
templates_path = 'f:/Project 001/qr code generator 6/frontend/src/data/templates.ts'
with open(templates_path, 'r', encoding='utf-8') as f:
    templates_content = f.read()

templates_to_delete = [
    'Wine Bottle Label',
    'Discord Dark Mode',
    'Gold Signal WiFi',
    'Scan For WiFi Teal',
    'Prescription Info',
    'Tech App Download',
    'Table Check Out',
    'Soft Mint Wellness'
]

# Split by the template object start, which looks like { name: "Template Name", ...
# Prettier formatted it to `  {` followed by `    name: "Wine Bottle Label",`
# We can use a regex to match the entire object and remove it.

for name in templates_to_delete:
    # Match from `{` up to the end of the template object. 
    # Since they are in an array, they are separated by `},`
    pattern = r'\{\s*name:\s*[\'"]' + re.escape(name) + r'[\'"].*?\},?'
    templates_content = re.sub(pattern, '', templates_content, flags=re.DOTALL)

with open(templates_path, 'w', encoding='utf-8') as f:
    f.write(templates_content)

print("Updated templates.ts")
