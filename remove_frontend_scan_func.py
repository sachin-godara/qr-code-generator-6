import re

file_path = r'f:\Project 001\qr code generator 6\frontend\src\react\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('const handleScanTest = async () => {')
if start != -1:
    brace_count = 0
    end = -1
    for i in range(start + len('const handleScanTest = async () => {'), len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            if brace_count == 0:
                end = i + 1
                break
            brace_count -= 1
    if end != -1:
        # Also remove trailing semicolon and spaces/newlines
        while end < len(content) and content[end] in [';', ' ', '\t', '\n', '\r']:
            end += 1
        content = content[:start] + content[end:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Removed handleScanTest!")
