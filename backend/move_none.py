import re

file_path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_str = 'export const PRESET_TEMPLATES: Template[] = [\n'
start_idx = content.find(start_str)

none_pattern = re.compile(r'\s*\{\s*\"name\":\s*\"None\",.*?\}\s*\,', re.DOTALL)
match = none_pattern.search(content)

if match:
    none_block = match.group(0)
    # Remove it
    content = content.replace(none_block, '')
    # Insert at the beginning of the array
    insert_pos = start_idx + len(start_str)
    content = content[:insert_pos] + none_block + content[insert_pos:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Moved None to the front.")
else:
    print("Could not find None template.")
