import re

path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

styles = set(re.findall(r'dots_style:\s*"([^"]+)"', text))
print("Dot styles:")
for s in sorted(styles):
    print(s)
