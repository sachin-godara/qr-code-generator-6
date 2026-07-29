import sys

file_path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
brace_level = 0
current_object = []

in_array = False
global_brace_level = 0

for line in lines:
    if "export const templates" in line or in_array:
        in_array = True
    
    # Track the global brace level if we're not buffering
    
    # We buffer top-level objects in the array
    if in_array:
        # A template object starts at global brace level 0 (relative to array elements)
        # Actually it's easier to find lines that start with '  {' and end with '  },' or similar.
        pass

# A robust approach using an array of dictionaries via json.loads
# Wait, templates.ts is a TS file: export const templates: any[] = [
import json
import re

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

prefix_match = re.search(r'(export const templates[^\[]*\[\s*)', text)
if not prefix_match:
    print("Could not find start of templates array")
    sys.exit(1)

prefix = text[:prefix_match.end()]
rest = text[prefix_match.end():]

# Find the end of the array
# We will just parse out the objects.
# But it's easier to use a simple text processor that looks for "{ id: "
# Let's do this:

def remove_object(txt, obj_name):
    idx = txt.find(f'"name": "{obj_name}"')
    if idx == -1:
        return txt
    
    # find start
    start = idx
    while start > 0 and not (txt[start:start+4] == '  {\n' or txt[start:start+3] == '  {'):
        start -= 1
        
    # find end
    end = idx
    while end < len(txt) and not (txt[end:end+4] == '  },\n' or txt[end:end+4] == '  }\n' or txt[end:end+3] == '  }'):
        end += 1
        
    if end < len(txt):
        if txt[end:end+4] == '  },\n':
            end += 4
        elif txt[end:end+4] == '  }\n':
            end += 4
        elif txt[end:end+3] == '  }':
            end += 3
            
    return txt[:start] + txt[end:]

new_text = text
new_text = remove_object(new_text, 'VIP Event Access')
new_text = remove_object(new_text, 'Luxury Property')
new_text = remove_object(new_text, 'Concert VIP Pass')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_text)
print("Removed templates successfully!")
