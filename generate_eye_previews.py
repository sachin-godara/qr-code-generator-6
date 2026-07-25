import os
from backend.qr_engine import generate_styled_qr

def generate_eye_frames():
    styles = [
        "square", "rounded", "circle", "diamond", "hexagon", "octagon",
        "star", "leaf", "shield", "gear", "droplet_tl", "droplet_tr", "droplet_bl",
        "corner_brackets", "double_ring", "dotted_circle", "leaf_opposite", "shield_opposite", 
        "left_rounded", "right_rounded", "solid_square_circle_cut", "sheared", "crystal_frame", 
        "arch_frame", "cross_notch_frame", "pill_frame", "pointed_top_frame", "aztec_step_frame", 
        "tv_frame", "house_frame", "camera_lens", "steering_wheel"
    ]
    
    out_dir = "frontend/public/previews/eye_frames"
    os.makedirs(out_dir, exist_ok=True)
    
    for style in styles:
        # Generate with blue frame, solid white background
        img = generate_styled_qr(
            data="A",
            fill_color="#000000",
            back_color="#ffffff",
            eye_color="#0050cb",
            eye_frame_style=style,
            eyeball_style="square" # Simple inner eye
        )
        # Crop the top-left eye. Border is 4 modules, eye is 7 modules. Box size is 30.
        # So crop from (120, 120) to (330, 330)
        img = img.crop((120, 120, 330, 330))
        
        # Make white transparent
        img = img.convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            if item[0] == 255 and item[1] == 255 and item[2] == 255:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        
        img.save(os.path.join(out_dir, f"{style}.png"))
        print(f"Generated Eye Frame: {style}.png")

def generate_eyeballs():
    styles = [
        "square", "rounded", "circle", "diamond", "hexagon", "octagon",
        "star", "leaf", "shield", "gear", "flower", "cross", "plus", "rhombus",
        "corner_brackets", "target_bullseye", "leaf_opposite", "shield_opposite", 
        "left_rounded", "right_rounded", "droplet_tl", "droplet_tr", "droplet_bl", 
        "sheared", "flower_cut", "clover", "heart", "rounded_triangle", "pinched_square", 
        "dumbbell_eyeball"
    ]
    
    out_dir = "frontend/public/previews/eyeballs"
    os.makedirs(out_dir, exist_ok=True)
    
    for style in styles:
        img = generate_styled_qr(
            data="A",
            fill_color="#000000",
            back_color="#ffffff",
            eye_color="#0050cb",
            eye_frame_style="square", # Simple outer eye
            eyeball_style=style
        )
        img = img.crop((120, 120, 330, 330))
        
        img = img.convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            if item[0] == 255 and item[1] == 255 and item[2] == 255:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        
        img.save(os.path.join(out_dir, f"{style}.png"))
        print(f"Generated Eyeball: {style}.png")

if __name__ == "__main__":
    generate_eye_frames()
    generate_eyeballs()
