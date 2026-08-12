import re

path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if 'export const PRESET_TEMPLATES' in line:
        start_idx = i + 1
        break

end_idx = -1
for i in range(len(lines)-1, -1, -1):
    if '];' in lines[i]:
        end_idx = i
        break

pre_lines = lines[:start_idx]
post_lines = lines[end_idx:]
array_lines = lines[start_idx:end_idx]

# Parse array_lines into individual templates
# We rely on `  {` and `  },`
templates = []
current_template_lines = []
in_template = False
brace_depth = 0

for line in array_lines:
    if not in_template:
        if line.strip() == '{':
            in_template = True
            current_template_lines = [line]
            brace_depth = 1
        else:
            # Maybe some whitespace or comments
            if line.strip():
                print(f"Warning: Non-template line found: {line.strip()}")
            current_template_lines.append(line)
    else:
        current_template_lines.append(line)
        if '{' in line:
            brace_depth += line.count('{')
        if '}' in line:
            brace_depth -= line.count('}')
            
        if brace_depth == 0:
            in_template = False
            templates.append(current_template_lines)
            current_template_lines = []

if current_template_lines:
    # Append any remaining lines (like trailing spaces)
    if not any(l.strip() for l in current_template_lines):
        pass # just trailing spaces
    else:
        print("Warning: Unfinished template at the end.")
        templates.append(current_template_lines)

print(f"Parsed {len(templates)} templates.")

# Function to get category
def get_category(template_lines):
    for line in template_lines:
        match = re.search(r'category:\s*"([^"]+)"', line)
        if match:
            return match.group(1)
    return "Unknown"

# Now we separate them out
none_template = []
social_templates = []
restaurant_templates = []
education_templates = []
other_templates = []

for t in templates:
    cat = get_category(t)
    name_match = None
    for line in t:
        nm = re.search(r'name:\s*"([^"]+)"', line)
        if nm:
            name_match = nm.group(1)
            break
            
    if name_match == "None":
        none_template.append(t)
    elif cat == "Social":
        social_templates.append(t)
    elif cat == "Restaurant":
        restaurant_templates.append(t)
    elif cat == "Education":
        education_templates.append(t)
    else:
        other_templates.append(t)

print(f"None: {len(none_template)}")
print(f"Social: {len(social_templates)}")
print(f"Restaurant: {len(restaurant_templates)}")
print(f"Education: {len(education_templates)}")
print(f"Other: {len(other_templates)}")

# Combine them back
new_templates = []
new_templates.extend(none_template)
new_templates.extend(social_templates)
new_templates.extend(restaurant_templates)
new_templates.extend(education_templates)
new_templates.extend(other_templates)

# Flatten
new_array_lines = []
for t in new_templates:
    new_array_lines.extend(t)

new_lines = pre_lines + new_array_lines + post_lines

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    
print("Successfully reordered and saved templates.ts!")
