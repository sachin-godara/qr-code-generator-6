import re

templates_path = 'f:/Project 001/qr code generator 6/frontend/src/data/templates.ts'
with open(templates_path, 'r', encoding='utf-8') as f:
    templates_content = f.read()

templates_to_delete = [
    'Discord Dark Mode',
    'Gold Signal WiFi',
    'Scan For WiFi Teal',
    'Prescription Info',
    'Tech App Download',
    'Table Check Out',
    'Soft Mint Wellness'
]

for name in templates_to_delete:
    name_idx = templates_content.find(f'name: "{name}"')
    if name_idx == -1:
        print(f"Template {name} not found!")
        continue
    
    # Find the nearest '{' before the name
    start_idx = templates_content.rfind('{', 0, name_idx)
    
    # Walk forward to find matching '}'
    brace_count = 0
    end_idx = start_idx
    for i in range(start_idx, len(templates_content)):
        if templates_content[i] == '{':
            brace_count += 1
        elif templates_content[i] == '}':
            brace_count -= 1
        
        if brace_count == 0:
            end_idx = i + 1
            break
            
    # Check for trailing comma and whitespace
    while end_idx < len(templates_content) and templates_content[end_idx] in [',', ' ', '\n', '\r']:
        end_idx += 1
        
    print(f"Deleting {name} from {start_idx} to {end_idx}")
    templates_content = templates_content[:start_idx] + templates_content[end_idx:]

with open(templates_path, 'w', encoding='utf-8') as f:
    f.write(templates_content)

print("Done.")
