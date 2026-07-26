import os
import re
import json
import sys
from io import BytesIO

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from services.qr_service import generate_qr_image

def get_clean_name(name):
    return name.lower().replace(" ", "_")

def main():
    templates_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data', 'templates.ts')
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'previews', 'templates')
    os.makedirs(out_dir, exist_ok=True)
    
    with open(templates_path, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('[')
    end_idx = content.rfind(']')
    
    array_str = content[start_idx:end_idx+1]
    
    templates = []
    # Regular expression to extract the name and settings block
    # This relies on the fact that the settings object is the last property or we can just grab everything between { and } for settings
    matches = re.finditer(r'\{\s*"name"\s*:\s*"([^"]+)"(.*?)\s*"settings"\s*:\s*(\{.*?\})\s*\}', array_str, re.DOTALL)
    for m in matches:
        name = m.group(1)
        settings_str = m.group(3)
        try:
            settings_str_clean = re.sub(r',\s*\}', '}', settings_str)
            settings = json.loads(settings_str_clean)
            templates.append({'name': name, 'settings': settings})
        except json.JSONDecodeError as e:
            print(f"Failed to parse settings for {name}: {e}")
    
    print(f"Parsed {len(templates)} templates using regex.")
    
    for t in templates:
        name = t.get('name')
        settings = t.get('settings', {})
        
        clean_name = get_clean_name(name)
        out_path = os.path.join(out_dir, f'{clean_name}.png')
        
        if os.path.exists(out_path):
            print(f"Skipping {name}, already exists.")
            continue
            
        print(f"Generating preview for {name}...")
        try:
            img_io = generate_qr_image("https://example.com", settings)
            with open(out_path, 'wb') as out_f:
                out_f.write(img_io.getvalue())
        except Exception as e:
            print(f"Error generating {name}: {e}")

if __name__ == "__main__":
    main()
