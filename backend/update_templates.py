import sys, re

with open('../frontend/src/data/templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
  'Wine Bottle Label': [(r"\"dots_style\":\s*\"diamond\"", "\"dots_style\": \"classy\"")],
  'Discord Dark Mode': [(r"\"dots_style\":\s*\"minimal_dots\"", "\"dots_style\": \"rounded\"")],
  'Gold Signal WiFi': [(r"\"dots_style\":\s*\"diamond\"", "\"dots_style\": \"classy\"")],
  'Scan For WiFi Teal': [(r"\"dots_style\":\s*\"sleek_dash\"", "\"dots_style\": \"rounded\"")],
  'Prescription Info': [(r"\"dots_style\":\s*\"sleek_dash\"", "\"dots_style\": \"rounded\"")],
  'Tech App Download': [(r"\"dots_style\":\s*\"fishtail\"", "\"dots_style\": \"rounded\""), (r"\"eye_frame_style\":\s*\"dynamic_swept\"", "\"eye_frame_style\": \"rounded\"")],
  'Table Check Out': [(r"\"dots_style\":\s*\"sleek_dash\"", "\"dots_style\": \"rounded\"")],
  'Soft Mint Wellness': [(r"\"dots_style\":\s*\"liquid_drop\"", "\"dots_style\": \"rounded\"")]
}

blocks = re.split(r'(?=\s*\{\s*\"name\":\s*\"[^\"]+\")', content)
for i in range(len(blocks)):
    for name, rules in replacements.items():
        if f'\"name\": \"{name}\"' in blocks[i]:
            for find_pattern, replace_str in rules:
                blocks[i] = re.sub(find_pattern, replace_str, blocks[i])

with open('../frontend/src/data/templates.ts', 'w', encoding='utf-8') as f:
    f.write(''.join(blocks))

print('Updated templates.ts')
