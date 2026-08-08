import re

templates_path = '../frontend/src/data/templates.ts'
with open(templates_path, 'r', encoding='utf-8') as f:
    templates_content = f.read()

templates_to_delete = [
    'Wine Bottle Label',
    'Discord Dark Mode',
    'Gold Signal WiFi',
    'Scan For WiFi Teal',
    'Prescription Info',
    'Tech App Download',
    'Table Check Out',
    'Soft Mint Wellness'
]

# We will match `  {\n    name: "Template Name",` and then find the matching closing `  },`
# Since all templates are identically formatted by prettier:
for name in templates_to_delete:
    # Find start index
    pattern = re.compile(r'\s*\{\s*name:\s*[\'"]' + re.escape(name) + r'[\'"]')
    match = pattern.search(templates_content)
    if not match:
        continue
    start_idx = match.start()
    
    # Track brackets to find the end
    brace_count = 0
    end_idx = start_idx
    started = False
    
    for i in range(start_idx, len(templates_content)):
        if templates_content[i] == '{':
            brace_count += 1
            started = True
        elif templates_content[i] == '}':
            brace_count -= 1
        
        if started and brace_count == 0:
            end_idx = i + 1
            # Check for trailing comma
            if end_idx < len(templates_content) and templates_content[end_idx] == ',':
                end_idx += 1
            break
            
    # Delete from start_idx to end_idx
    templates_content = templates_content[:start_idx] + templates_content[end_idx:]

with open(templates_path, 'w', encoding='utf-8') as f:
    f.write(templates_content)

print("Updated templates.ts via brace matching!")
