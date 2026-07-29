import re

file_path = r'f:\Project 001\qr code generator 6\frontend\src\react\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# find const handleScanTest
start = content.find('const handleScanTest = async () => {')
if start != -1:
    # find matching closing brace
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
        # Also remove any trailing newline or semicolon
        while end < len(content) and content[end] in [';', '\n', '\r']:
            end += 1
        content = content[:start] + content[end:]

# find isScanning block
content = re.sub(r'\{isScanning && \([\s\S]*?\)\}', '', content)

# find the specific button
content = re.sub(r'<button[\s\S]*?onClick=\{handleScanTest\}[\s\S]*?</button>', '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
