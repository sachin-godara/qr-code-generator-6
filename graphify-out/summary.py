import json
from pathlib import Path
detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
print('total_files:', detect.get('total_files', 0))
print('total_words:', detect.get('total_words', 0))
for cat in ['code', 'document', 'paper', 'image', 'video']:
    files = detect.get('files', {}).get(cat, [])
    if files:
        print(f'{cat}:', len(files))
if detect.get('skipped_sensitive'):
    print('skipped_sensitive:', len(detect['skipped_sensitive']))
