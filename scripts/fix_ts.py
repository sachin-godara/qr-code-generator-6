import re
import os
import sys

path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix duplicates: logo_icon_style: "glyph", preset_logo_color: "...",\n      logo_icon_style: "badge",
new_content = re.sub(r'logo_icon_style:\s*"[^"]+",\s*(preset_logo_color:\s*"[^"]+",)\s*\n\s*logo_icon_style:\s*"([^"]+)",',
                     r'\1\n      logo_icon_style: "\2",',
                     content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Duplicates removed.")
