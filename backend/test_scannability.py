import sys
import os
import re
import json

# Add the backend dir to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

import cv2
import numpy as np
from services.qr_service import generate_qr_image

def get_templates():
    with open(r"..\frontend\src\data\templates.ts", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract the array content
    match = re.search(r"export const PRESET_TEMPLATES:\s*Template\[\]\s*=\s*(\[.*?\]);", content, re.DOTALL)
    if not match:
        print("Failed to find templates array")
        sys.exit(1)
        
    array_str = match.group(1)
    
    array_str = re.sub(r",(\s*[}\]])", r"\1", array_str)
    
    try:
        return json.loads(array_str)
    except json.JSONDecodeError as e:
        print("JSON parse error:", e)
        sys.exit(1)

templates = get_templates()
print(f"Loaded {len(templates)} templates.")

qcd = cv2.QRCodeDetector()

failed = []

for idx, t in enumerate(templates):
    name = t.get("name", f"Template {idx}")
    settings = t.get("settings", {})
    
    try:
        # Generate the QR image
        # Using a dummy payload
        payload = "https://example.com"
        
        # Target size 400x400
        settings["target_size"] = 400
        
        img_bytes = generate_qr_image(payload, settings)
        
        # Load with cv2
        nparr = np.frombuffer(img_bytes.getvalue(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Decode using pyzbar
        from pyzbar.pyzbar import decode
        
        # Try normal
        decoded_objs = decode(gray)
        found_payload = any(obj.data.decode('utf-8') == payload for obj in decoded_objs)
        
        # Try inverted
        if not found_payload:
            decoded_objs = decode(cv2.bitwise_not(gray))
            found_payload = any(obj.data.decode('utf-8') == payload for obj in decoded_objs)
                
        if not found_payload:
            print(f"FAILED: {name}")
            failed.append(name)
        else:
            print(f"OK: {name}")
            
    except Exception as e:
        print(f"ERROR on {name}: {e}")
        failed.append(name)

print("\n--- RESULTS ---")
print(f"Total: {len(templates)}")
print(f"Failed: {len(failed)}")
if failed:
    for f in failed:
        print(f" - {f}")
