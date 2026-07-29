import re

with open(r'f:\Project 001\qr code generator 6\backend\qr_engine.py', 'r', encoding='utf-8') as f:
    text = f.read()
matches = re.findall(r'eyeball_style\s*==\s*[\'\"]([^\'\"]+)[\'\"]', text)
print(list(set(matches)))
