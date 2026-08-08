import sys, re

with open('../frontend/src/data/templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
  'Wine Bottle Label': [(r"\"eye_frame_style\":\s*\"diamond\"", "\"eye_frame_style\": \"rounded\""), (r"\"eyeball_style\":\s*\"diamond\"", "\"eyeball_style\": \"rounded\"")],
  'Discord Dark Mode': [(r"\"eye_frame_style\":\s*\"squircle\"", "\"eye_frame_style\": \"rounded\"")],
  'Gold Signal WiFi': [(r"\"eye_frame_style\":\s*\"diamond\"", "\"eye_frame_style\": \"rounded\""), (r"\"eyeball_style\":\s*\"diamond\"", "\"eyeball_style\": \"rounded\"")],
  'Scan For WiFi Teal': [(r"\"eye_frame_style\":\s*\"hex_nut\"", "\"eye_frame_style\": \"rounded\""), (r"\"eyeball_style\":\s*\"square\"", "\"eyeball_style\": \"rounded\"")],
  'Prescription Info': [(r"\"eyeball_style\":\s*\"plus\"", "\"eyeball_style\": \"rounded\"")],
  'Table Check Out': [(r"\"eyeball_style\":\s*\"plus\"", "\"eyeball_style\": \"rounded\"")],
  'Soft Mint Wellness': [(r"\"eye_frame_style\":\s*\"leaf\"", "\"eye_frame_style\": \"rounded\""), (r"\"eyeball_style\":\s*\"flower_cut\"", "\"eyeball_style\": \"rounded\"")]
}

blocks = re.split(r'(?=\s*\{\s*\"name\":\s*\"[^\"]+\")', content)
for i in range(len(blocks)):
    for name, rules in replacements.items():
        if f'\"name\": \"{name}\"' in blocks[i]:
            for find_pattern, replace_str in rules:
                blocks[i] = re.sub(find_pattern, replace_str, blocks[i])

with open('../frontend/src/data/templates.ts', 'w', encoding='utf-8') as f:
    f.write(''.join(blocks))

print('Updated eyes in templates.ts')
