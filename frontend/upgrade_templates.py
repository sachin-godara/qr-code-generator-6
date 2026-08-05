import json
import re
import random
import sys

def upgrade():
    with open('src/data/templates.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'export const PRESET_TEMPLATES: Template\[\] = (\[.*\]);', content, re.DOTALL)
    if not match:
        print("Could not find templates array")
        sys.exit(1)
        
    templates = json.loads(match.group(1))

    # Mappings
    mappings = {
        "Premium": {
            "fonts": ["Playfair Display (Elegant)", "Montserrat (Geometric)"],
            "dots": ["diamond", "hexagon", "bevel", "target_bullseye"],
            "eyes": ["crystal", "cushion_cut", "octagon", "solid_square_circle_cut"]
        },
        "Business": {
            "fonts": ["Playfair Display (Elegant)", "Montserrat (Geometric)"],
            "dots": ["diamond", "hexagon", "bevel", "target_bullseye"],
            "eyes": ["crystal", "cushion_cut", "octagon", "solid_square_circle_cut"]
        },
        "Social": {
            "fonts": ["Outfit (Modern)", "Roboto (Clean)"],
            "dots": ["rounded", "circle", "squircle", "minimal_dots"],
            "eyes": ["rounded", "left_rounded", "squircle", "camera_lens"]
        },
        "Marketing": {
            "fonts": ["Outfit (Modern)", "Roboto (Clean)"],
            "dots": ["rounded", "circle", "squircle", "minimal_dots"],
            "eyes": ["rounded", "left_rounded", "squircle", "camera_lens"]
        },
        "Restaurant": {
            "fonts": ["Montserrat (Geometric)", "Lora (Serif)"],
            "dots": ["flower_cut", "clover", "leaf_droplet", "circle"],
            "eyes": ["leaf", "droplet_tl", "arch_frame", "deckled"]
        },
        "Retail": {
            "fonts": ["Montserrat (Geometric)", "Lora (Serif)"],
            "dots": ["flower_cut", "clover", "leaf_droplet", "circle"],
            "eyes": ["leaf", "droplet_tl", "arch_frame", "deckled"]
        },
        "Events": {
            "fonts": ["Courier Prime (Retro)", "Playfair Display (Elegant)"],
            "dots": ["star", "heart", "pixel_art", "sparkle"],
            "eyes": ["deckled", "ticket", "geometric_deco", "arch_frame"]
        },
        "WiFi": {
            "fonts": ["Roboto (Clean)", "Outfit (Modern)"],
            "dots": ["network_nodes", "crossstitch", "plus", "sleek_dash"],
            "eyes": ["circuit_trace", "cyberpunk_glitch", "hex_nut", "aerodynamic_slant"]
        },
        "Education": {
            "fonts": ["Roboto (Clean)", "Lora (Serif)"],
            "dots": ["circle", "octagon"],
            "eyes": ["solid_square_circle_cut", "notched_ring"]
        },
        "Signage": {
            "fonts": ["Outfit (Modern)", "Montserrat (Geometric)"],
            "dots": ["diagonal_stripe", "horizontal_slash", "vertical_slash"],
            "eyes": ["pointed_top_frame", "aerodynamic_slant"]
        },
        "All": {
            "fonts": ["Outfit (Modern)"],
            "dots": ["square"],
            "eyes": ["square"]
        }
    }

    random.seed(42) # deterministic assignment
    
    for t in templates:
        # skip None
        if t.get("name") == "None":
            continue
            
        settings = t.get("settings", {})
        cat = t.get("category", "All")
        
        mapping = mappings.get(cat, mappings["All"])
        
        # update font
        if "font_name" not in settings or settings["font_name"] == "Outfit (Modern)":
            settings["font_name"] = random.choice(mapping["fonts"])
            
        # update dots
        if "dots_style" not in settings or settings["dots_style"] == "square":
            settings["dots_style"] = random.choice(mapping["dots"])
            
        # update eyes
        if "eye_frame_style" not in settings or settings["eye_frame_style"] == "square":
            new_eye = random.choice(mapping["eyes"])
            settings["eye_frame_style"] = new_eye
            if "eyeball_style" not in settings or settings["eyeball_style"] == "square":
                settings["eyeball_style"] = "rounded" if new_eye in ["rounded", "circle", "squircle", "camera_lens", "left_rounded"] else "square"

    out = f"import type {{ QRSettings }} from '../types/qr';\n\n"
    out += "export interface Template {\n  name: string;\n  description?: string;\n  category?: string;\n  settings: Partial<QRSettings>;\n}\n\n"
    out += f"export const PRESET_TEMPLATES: Template[] = {json.dumps(templates, indent=2)};\n"

    with open('src/data/templates.ts', 'w', encoding='utf-8') as f:
        f.write(out)

    print("Successfully upgraded templates!")

if __name__ == '__main__':
    upgrade()
