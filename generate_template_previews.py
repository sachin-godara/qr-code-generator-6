import os
import sys
import re
import json

sys.path.append(r'f:\Project 001\qr code generator 6\backend')
from services.qr_service import generate_qr_image

def generate_template_previews():
    templates_file = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
    
    with open(templates_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the JSON array
    match = re.search(r'export const PRESET_TEMPLATES:\s*Template\[\]\s*=\s*(\[\s*\{.*?\}\s*\])\s*;?', content, re.DOTALL)
    if not match:
        print("Could not find PRESET_TEMPLATES array.")
        return
        
    array_str = match.group(1)
    
    try:
        templates = json.loads(array_str)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return
        
    out_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews\templates"
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Found {len(templates)} templates. Generating previews...")
    
    for i, t in enumerate(templates):
        name = t.get("name")
        clean_name = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
        settings = t.get("settings", {})
        
        try:
            # We must use a dummy payload representing the QR request
            # generate_qr_image handles applying frames, colors, and logos.
            
            # Create a params dict mimicking the frontend QRSettings request
            # We don't need to specify default values here because the backend handles missing values
            
            qr_bytes = generate_qr_image("https://example.com", settings)
            
            out_path = os.path.join(out_dir, f"{clean_name}.png")
            with open(out_path, 'wb') as img_f:
                img_f.write(qr_bytes.getvalue())
            
            print(f"[{i+1}/{len(templates)}] Generated preview for: {name}")
            
        except Exception as e:
            print(f"Error generating preview for {name}: {e}")

if __name__ == "__main__":
    generate_template_previews()
