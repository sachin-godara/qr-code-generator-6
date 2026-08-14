import os
import re
import json
import pytest
import cv2
import numpy as np
from services.qr_service import generate_qr_image
from services.scan_service import deep_scan_qr

def get_templates():
    import subprocess
    # Find templates.ts path reliably regardless of cwd
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.abspath(os.path.join(cur_dir, "..", "..", "frontend", "src", "data", "templates.ts")),
        os.path.abspath(os.path.join(cur_dir, "..", "frontend", "src", "data", "templates.ts")),
    ]
    file_path = next((p for p in candidates if os.path.exists(p)), candidates[0])
    
    js_code = f"""
    const fs = require('fs');
    const content = fs.readFileSync({json.dumps(file_path)}, 'utf8');
    const match = content.match(/export const PRESET_TEMPLATES:\\s*Template\\[\\]\\s*=\\s*(\\[[\\s\\S]*?\\]);/);
    if(match) {{
        const evaluate = new Function('return ' + match[1]);
        const templates = evaluate();
        console.log(JSON.stringify(templates));
    }}
    """
    proc = subprocess.run(["node", "-e", js_code], capture_output=True, text=True)
    if proc.returncode != 0:
        raise ValueError(f"Failed to parse TS with node: {proc.stderr}")
    
    return json.loads(proc.stdout)

# Parametrize the test with the list of templates so each gets reported individually
templates_data = get_templates()

@pytest.mark.parametrize("template", templates_data, ids=lambda t: t.get("name", "Unknown"))
def test_template_scannability(template):
    name = template.get("name", "Unknown")
    settings = template.get("settings", {})
    
    # Using a dummy payload
    payload = "https://example.com"
    # Target size 400x400
    settings["target_size"] = 400
    
    img_bytes = generate_qr_image(payload, settings)
    
    # Primary: Test using production deep scan engine
    found_payload = False
    try:
        res = deep_scan_qr(img_bytes.getvalue())
        found_payload = (res == payload)
    except Exception:
        found_payload = False
        
    # Secondary: Fallback to direct OpenCV / PyZbar
    if not found_payload:
        nparr = np.frombuffer(img_bytes.getvalue(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        from pyzbar.pyzbar import decode
        decoded_objs = decode(gray) or decode(cv2.bitwise_not(gray))
        found_payload = any(obj.data.decode('utf-8') == payload for obj in decoded_objs)
            
    assert found_payload, f"Template '{name}' failed to scan"

