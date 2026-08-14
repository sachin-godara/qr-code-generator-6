import json
from pathlib import Path
from collections import Counter

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8-sig'))
scan_root = detect.get('scan_root', '')
counts = Counter()

for cat in ['code', 'document', 'paper', 'image', 'video']:
    files = detect.get('files', {}).get(cat, [])
    for f in files:
        if 'graphify-out' in f:
            continue
        rel_path = f[len(scan_root):].lstrip('\\/')
        parts = rel_path.split('\\')
        if len(parts) > 1:
            counts[parts[0]] += 1
        else:
            counts['(root)'] += 1

print('Top 5 directories:')
for d, c in counts.most_common(5):
    print(f'  {d}: {c} files')
