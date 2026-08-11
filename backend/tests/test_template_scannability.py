import os
import re
import json
import pytest
import cv2
import numpy as np
from services.qr_service import generate_qr_image

def get_templates():
    import subprocess
    js_code = """
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), '..', 'frontend', 'src', 'data', 'templates.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/export const PRESET_TEMPLATES:\\s*Template\\[\\]\\s*=\\s*(\\[[\\s\\S]*?\\]);/);
    if(match) {
        const evaluate = new Function('return ' + match[1]);
        const templates = evaluate();
        console.log(JSON.stringify(templates));
    }
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
            
    assert found_payload, f"Template '{name}' failed to scan"
