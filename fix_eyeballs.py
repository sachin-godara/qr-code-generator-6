import os
from PIL import Image, ImageDraw

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_eyeballs():
    eyeball_styles = [
        "square", "rounded", "octagon", "corner_brackets", "target_bullseye", 
        "hexagon", "diamond", "star", "gear", "flower", "circle", "tiny_dot", 
        "tiny_square", "hollow_circle", "hollow_square", "minimal_cross", 
        "minimal_x", "vertical_pill", "horizontal_pill"
    ]
    
    out_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews\eyeballs"
    os.makedirs(out_dir, exist_ok=True)
    
    s = 48
    ebx, eby = 28, 28
    px, py = ebx - 2*s, eby - 2*s
    eyeball_rgb = (255, 0, 255) # Magenta magic color
    bg = (255, 255, 255, 0)
    
    # We will use the exact logic from qr_engine.py
    for eyeball_style in eyeball_styles:
        img_ball = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img_ball)
        
        # [Insert draw logic for eyeball_style here]
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        r2 = max(1, s // 1.5)
        s2 = s // 2
        
        # Star calculation
        inner_r = s * 0.6
        outer_r = s * 1.5
        import math
        p_eb_star = []
        for i in range(10):
            angle = i * math.pi / 5 - math.pi / 2
            r = outer_r if i % 2 == 0 else inner_r
            p_eb_star.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))

        # Octagon calc
        p_eb_oct = [
            (ebx + s, eby), (ebx + 2*s, eby),
            (ebx + 3*s, eby + s), (ebx + 3*s, eby + 2*s),
            (ebx + 2*s, eby + 3*s), (ebx + s, eby + 3*s),
            (ebx, eby + 2*s), (ebx, eby + s)
        ]
        
        # Hexagon calc
        p_eb_hex = [
            (cx, eby), (ebx + 3*s, eby + 0.75*s), (ebx + 3*s, eby + 2.25*s),
            (cx, eby + 3*s), (ebx, eby + 2.25*s), (ebx, eby + 0.75*s)
        ]

        if eyeball_style == "rounded":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        elif eyeball_style == "octagon":
            draw.polygon(p_eb_oct, fill=eyeball_rgb + (255,))
        elif eyeball_style == "corner_brackets":
            draw.rectangle([ebx, eby, ebx + s2 - 1, eby + s2 - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + 3*s - s2, eby, ebx + 3*s - 1, eby + s2 - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx, eby + 3*s - s2, ebx + s2 - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + 3*s - s2, eby + 3*s - s2, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "target_bullseye":
            draw.ellipse([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], outline=eyeball_rgb + (255,), width=max(1, s // 2))
            draw.ellipse([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "hexagon":
            draw.polygon(p_eb_hex, fill=eyeball_rgb + (255,))
        elif eyeball_style == "diamond":
            y1, y2 = eby, eby + 3*s
            x1, x2 = ebx, ebx + 3*s
            draw.polygon([(cx, y1), (x2, cy), (cx, y2), (x1, cy)], fill=eyeball_rgb + (255,))
        elif eyeball_style == "star":
            draw.polygon(p_eb_star, fill=eyeball_rgb + (255,))
        elif eyeball_style == "gear":
            draw.ellipse([cx - s, cy - s, cx + s, cy + s], fill=eyeball_rgb + (255,))
            for i in range(8):
                angle = i * math.pi / 4
                gx = cx + s * math.cos(angle)
                gy = cy + s * math.sin(angle)
                draw.rectangle([gx - s2, gy - s2, gx + s2, gy + s2], fill=eyeball_rgb + (255,))
        elif eyeball_style == "flower":
            draw.ellipse([cx - s2, cy - s2, cx + s2, cy + s2], fill=eyeball_rgb + (255,))
            dot_r = s // 1.5
            for i in range(8):
                angle = i * math.pi / 4
                fx = cx + s * math.cos(angle)
                fy = cy + s * math.sin(angle)
                draw.ellipse([fx - dot_r, fy - dot_r, fx + dot_r, fy + dot_r], fill=eyeball_rgb + (255,))
        elif eyeball_style == "circle":
            draw.ellipse([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "tiny_dot":
            draw.ellipse([px + 3*s, py + 3*s, px + 4*s - 1, py + 4*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "tiny_square":
            draw.rectangle([px + 3*s, py + 3*s, px + 4*s - 1, py + 4*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "hollow_circle":
            draw.ellipse([px + 2*s, py + 2*s, px + 5*s - 1, py + 5*s - 1], outline=eyeball_rgb + (255,), width=max(1, s // 2))
        elif eyeball_style == "hollow_square":
            draw.rectangle([px + 2*s, py + 2*s, px + 5*s - 1, py + 5*s - 1], outline=eyeball_rgb + (255,), width=max(1, s // 2))
        elif eyeball_style == "minimal_cross":
            w = max(1, s // 3)
            draw.line([px + 3.5*s, py + 1.5*s, px + 3.5*s, py + 5.5*s], fill=eyeball_rgb + (255,), width=w)
            draw.line([px + 1.5*s, py + 3.5*s, px + 5.5*s, py + 3.5*s], fill=eyeball_rgb + (255,), width=w)
        elif eyeball_style == "minimal_x":
            w = max(1, s // 3)
            draw.line([px + 2*s, py + 2*s, px + 5*s, py + 5*s], fill=eyeball_rgb + (255,), width=w)
            draw.line([px + 5*s, py + 2*s, px + 2*s, py + 5*s], fill=eyeball_rgb + (255,), width=w)
        elif eyeball_style == "vertical_pill":
            draw.rounded_rectangle([px + 3*s, py + 1.5*s, px + 4*s - 1, py + 5.5*s - 1], radius=s//2, fill=eyeball_rgb + (255,))
        elif eyeball_style == "horizontal_pill":
            draw.rounded_rectangle([px + 1.5*s, py + 3*s, px + 5.5*s - 1, py + 4*s - 1], radius=s//2, fill=eyeball_rgb + (255,))
        elif eyeball_style == "square":
            draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        else:
            draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        
        # Recolor
        new_data = []
        for p in img_ball.getdata():
            if p[:3] == eyeball_rgb: # Magenta pixels become fully transparent (if they were drawn over bg)
                # wait, eyeball_rgb is the eyeball itself. We want it to be black for recolor_previews.py
                # Actually, the user's previews should be black (0, 0, 0, 255) with transparent background
                new_data.append((0, 0, 0, 255))
            elif p[:3] == (255, 255, 255): # White holes become transparent
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(p)
        img_ball.putdata(new_data)
        
        img_ball.save(os.path.join(out_dir, f"{eyeball_style}.png"))
        print(f"Generated {eyeball_style}.png")

draw_eyeballs()
