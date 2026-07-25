import os
import sys
import re
import json
from PIL import Image

sys.path.insert(0, os.path.abspath('backend'))
from services.qr_service import generate_qr_image

def generate_template_previews():
    ts_file_path = "frontend/src/data/templates.ts"
    out_dir = "frontend/public/previews/templates"
    os.makedirs(out_dir, exist_ok=True)
    
    with open(ts_file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    match = re.search(r"export const PRESET_TEMPLATES:\s*\w+\[\]\s*=\s*(\[.*\]);?", content, re.DOTALL)
    if not match:
        print("Error: Could not find PRESET_TEMPLATES array in TS file")
        return
        
    array_content = match.group(1)
    if array_content.endswith(";"):
        array_content = array_content[:-1]
        
    try:
        templates = json.loads(array_content)
    except Exception as e:
        print("Error decoding templates JSON:", e)
        return
        
    print(f"Generating previews for {len(templates)} templates...")
    
    for t in templates:
        name = t["name"]
        settings = t["settings"]
        clean_name = name.lower().replace(" ", "_")
        
        # Ensure we use ERROR_CORRECT_H if preset_logo is set, following our skill rules
        if settings.get("preset_logo") and settings.get("preset_logo") != "None":
            settings["error_correction"] = "H"
            
        try:
            buf = generate_qr_image("https://github.com", settings)
            img = Image.open(buf)
            img = img.resize((200, 200), Image.Resampling.LANCZOS)
            img.save(os.path.join(out_dir, f"{clean_name}.png"))
            print(f"Generated Template Preview: {clean_name}.png")
        except Exception as e:
            print(f"Error generating preview for {name}: {e}")

if __name__ == "__main__":
    generate_template_previews()
