import re

file_path = r'f:\Project 001\qr code generator 6\backend\services\qr_service.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the definition of analyze_qr_scannability
match = re.search(r'def analyze_qr_scannability\(', content)
if match:
    start_idx = match.start()
    new_content = content[:start_idx]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Removed analyze_qr_scannability from qr_service.py")
else:
    print("Could not find analyze_qr_scannability")

# Now modify generator.py
gen_path = r'f:\Project 001\qr code generator 6\backend\routers\generator.py'
with open(gen_path, 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

new_lines = []
skip = False
for line in lines:
    if 'def scan_test_qr(' in line:
        skip = True
        # remove previous line which is @router.post("/scan-test")
        if new_lines[-1].strip().startswith('@router.post("/scan-test")'):
            new_lines.pop()
    elif skip and line.strip() == '' and len(new_lines) > 0 and new_lines[-1].strip() == '':
        skip = False
    elif skip and not line.startswith(' ') and not line.startswith('\t') and line.strip() != '':
        # wait, python function might end with empty line, but the next @router will break skip
        if line.startswith('@'):
            skip = False
            new_lines.append(line)
    elif not skip:
        # Also remove analyze_qr_scannability from imports
        if 'analyze_qr_scannability' in line:
            line = line.replace(', analyze_qr_scannability', '')
        new_lines.append(line)

with open(gen_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
print("Removed scan test route from generator.py")
