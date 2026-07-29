import re

file_path = r'f:\Project 001\qr code generator 6\frontend\src\react\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove state
content = re.sub(r'const \[scanResult, setScanResult\][^\n]*\n', '', content)
content = re.sub(r'const \[isScanning, setIsScanning\][^\n]*\n', '', content)

# 2. Remove handleScanTest function
content = re.sub(r'const handleScanTest = async \(\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)

# 3. Remove isScanning animation block
content = re.sub(r'\{isScanning && \([\s\S]*?bg-green-500/15[\s\S]*?\)\}', '', content)

# 4. Remove scan result bubble
content = re.sub(r'\{scanResult && \([\s\S]*?bg-green-50[\s\S]*?\)\}', '', content)

# 5. Remove Scan Test buttons carefully
content = re.sub(r'<button\s*onClick=\{handleScanTest\}[^>]*>\s*<span[^>]*>qr_code_scanner</span>\s*</button>', '', content)
content = re.sub(r'<button\s*onClick=\{handleScanTest\}[^>]*>\s*<span[^>]*>qr_code_scanner</span>\s*<span[^>]*>Test</span>\s*</button>', '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
