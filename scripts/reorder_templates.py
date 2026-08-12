import sys

path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

none_end = -1
tiktok_start = -1

for i, line in enumerate(lines):
    if 'name: "TikTok Pulse",' in line:
        # the template object starts 1 line before `name: "TikTok Pulse",`
        tiktok_start = i - 1
        break

for i, line in enumerate(lines):
    if 'name: "At Your Service",' in line:
        # "At Your Service" is the template immediately after "None".
        # It starts 1 line before `name: "At Your Service",`
        none_end = i - 1
        break

array_end = len(lines) - 2 # The second to last line is usually '];\n'

if tiktok_start != -1 and none_end != -1:
    social_templates = lines[tiktok_start:array_end]
    rest_of_templates = lines[none_end:tiktok_start]
    
    new_lines = lines[:none_end] + social_templates + rest_of_templates + lines[array_end:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Reordered successfully!")
else:
    print(f"Error: Could not find boundaries. tiktok_start={tiktok_start}, none_end={none_end}")
