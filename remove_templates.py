import json
import re

file_path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the objects by name manually since it's hard to parse TS with regex.
# Let's search for "name: 'VIP Event Access'", etc.
names = ['VIP Event Access', 'Luxury Property', 'Concert VIP Pass']

def remove_template_by_name(text, template_name):
    name_str = f"name: '{template_name}'"
    idx = text.find(name_str)
    if idx == -1:
        name_str = f'name: "{template_name}"'
        idx = text.find(name_str)
    if idx == -1:
        return text

    # Find the start of the object: walk backwards to find the nearest '{' at the top level
    start_idx = idx
    brace_count = 1
    while start_idx > 0:
        start_idx -= 1
        if text[start_idx] == '}':
            brace_count += 1
        elif text[start_idx] == '{':
            brace_count -= 1
            if brace_count == 0:
                # We found the start of the object
                break
    
    # Find the end of the object
    end_idx = idx
    brace_count = 1
    while end_idx < len(text) - 1:
        end_idx += 1
        if text[end_idx] == '{':
            brace_count += 1
        elif text[end_idx] == '}':
            brace_count -= 1
            if brace_count == 0:
                # We found the end of the object
                break
                
    if brace_count == 0:
        # Check for trailing comma
        end_comma = text.find(',', end_idx)
        if end_comma != -1 and not text[end_idx:end_comma].strip(' \t\n\r}'):
             end_idx = end_comma
        
        # Remove it
        return text[:start_idx] + text[end_idx+1:]
    return text

new_content = content
for name in names:
    new_content = remove_template_by_name(new_content, name)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Removed templates!")
