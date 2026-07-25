import math
from PIL import Image, ImageDraw, ImageFont

def hex_to_rgb(hex_color):
    hex_color = str(hex_color).lstrip('#')
    if len(hex_color) != 6:
        return (0,0,0)
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def apply_layout_frame(qr_img, layout_template="none", frame_color="#000000", padding=20, corner_radius=15, border_thickness=10):
    if layout_template == "none":
        return qr_img
        
    # Ensure qr_img is RGBA to handle transparency if needed
    if qr_img.mode != 'RGBA':
        qr_img = qr_img.convert('RGBA')
        
    qr_w, qr_h = qr_img.size
    bg_color = hex_to_rgb(frame_color)
    
    if layout_template == "border":
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Draw white background card for QR code
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        # Draw border
        if border_thickness > 0:
            draw.rounded_rectangle([(border_thickness//2, border_thickness//2), 
                                    (new_w - border_thickness//2, new_h - border_thickness//2)], 
                                   radius=corner_radius, outline=bg_color, width=border_thickness)
        
        # Paste QR Code
        new_img.paste(qr_img, (padding, padding), qr_img)
        return new_img
        
    elif layout_template == "double_border":
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Draw outer solid frame
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        
        # Draw white inner area
        draw.rounded_rectangle([(border_thickness, border_thickness), 
                                (new_w - border_thickness, new_h - border_thickness)], 
                               radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        
        # Draw inner line
        inner_line_offset = border_thickness * 2
        if border_thickness > 0:
            draw.rounded_rectangle([(inner_line_offset, inner_line_offset), 
                                    (new_w - inner_line_offset, new_h - inner_line_offset)], 
                                   radius=max(0, corner_radius - inner_line_offset), outline=bg_color, width=max(1, border_thickness // 3))
        
        # Paste QR
        new_img.paste(qr_img, (padding, padding), qr_img)
        return new_img
        
    elif layout_template == "circle":
        new_w = qr_w + padding * 4
        new_h = qr_h + padding * 4
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # White circle background
        draw.ellipse([(padding, padding), (new_w - padding, new_h - padding)], fill=(255, 255, 255, 255))
        
        # Circle border
        if border_thickness > 0:
            draw.ellipse([(padding + border_thickness//2, padding + border_thickness//2), 
                          (new_w - padding - border_thickness//2, new_h - padding - border_thickness//2)], 
                         outline=bg_color, width=border_thickness)
                         
        new_img.paste(qr_img, (padding * 2, padding * 2), qr_img)
        return new_img
        
    elif layout_template == "circle_sunburst":
        new_w = qr_w + padding * 4
        new_h = qr_h + padding * 4
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # White circle background
        draw.ellipse([(padding, padding), (new_w - padding, new_h - padding)], fill=(255, 255, 255, 255))
        
        # Circle border
        if border_thickness > 0:
            draw.ellipse([(padding + border_thickness//2, padding + border_thickness//2), 
                          (new_w - padding - border_thickness//2, new_h - padding - border_thickness//2)], 
                         outline=bg_color, width=border_thickness)
                         
        new_img.paste(qr_img, (padding * 2, padding * 2), qr_img)
        
        # Sunburst rays
        cx = new_w // 2
        cy = new_h // 2
        r_orbit = (new_w - padding * 2) // 2
        num_rays = 36
        for i in range(num_rays):
            angle = i * (2 * math.pi / num_rays)
            ray_len = int(border_thickness * 1.5) if i % 2 == 0 else int(border_thickness * 0.8)
            x1 = int(cx + r_orbit * math.cos(angle))
            y1 = int(cy + r_orbit * math.sin(angle))
            x2 = int(cx + (r_orbit + ray_len) * math.cos(angle))
            y2 = int(cy + (r_orbit + ray_len) * math.sin(angle))
            draw.line([(x1, y1), (x2, y2)], fill=bg_color, width=max(2, border_thickness // 3))
            
        return new_img
        
    elif layout_template == "circle_sprinkles":
        new_w = qr_w + padding * 4
        new_h = qr_h + padding * 4
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # White circle background
        draw.ellipse([(padding, padding), (new_w - padding, new_h - padding)], fill=(255, 255, 255, 255))
        
        # Circle border
        if border_thickness > 0:
            draw.ellipse([(padding + border_thickness//2, padding + border_thickness//2), 
                          (new_w - padding - border_thickness//2, new_h - padding - border_thickness//2)], 
                         outline=bg_color, width=border_thickness)
                         
        new_img.paste(qr_img, (padding * 2, padding * 2), qr_img)
        
        # Sprinkles
        cx = new_w // 2
        cy = new_h // 2
        r_orbit = (new_w - padding * 2) // 2 + border_thickness
        sprinkle_r = max(4, border_thickness * 3 // 4)
        for i in range(8):
            angle = i * (2 * math.pi / 8)
            sx = int(cx + r_orbit * math.cos(angle))
            sy = int(cy + r_orbit * math.sin(angle))
            draw.ellipse([sx - sprinkle_r, sy - sprinkle_r, sx + sprinkle_r, sy + sprinkle_r], fill=bg_color)
            
        return new_img
        
    elif layout_template == "dotted_border":
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        offset = border_thickness // 2 + 2
        dot_r = max(2, border_thickness // 2)
        
        for x in range(corner_radius, new_w - corner_radius, dot_r * 3):
            draw.ellipse([x - dot_r, offset - dot_r, x + dot_r, offset + dot_r], fill=bg_color)
            draw.ellipse([x - dot_r, new_h - offset - dot_r, x + dot_r, new_h - offset + dot_r], fill=bg_color)
            
        for y in range(corner_radius, new_h - corner_radius, dot_r * 3):
            draw.ellipse([offset - dot_r, y - dot_r, offset + dot_r, y + dot_r], fill=bg_color)
            draw.ellipse([new_w - offset - dot_r, y - dot_r, new_w - offset + dot_r, y + dot_r], fill=bg_color)
            
        for a in range(180, 271, 15):
            rad = a * math.pi / 180
            px = int(corner_radius + (corner_radius - offset) * math.cos(rad))
            py = int(corner_radius + (corner_radius - offset) * math.sin(rad))
            draw.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r], fill=bg_color)
            
        for a in range(270, 361, 15):
            rad = a * math.pi / 180
            px = int((new_w - corner_radius) + (corner_radius - offset) * math.cos(rad))
            py = int(corner_radius + (corner_radius - offset) * math.sin(rad))
            draw.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r], fill=bg_color)
            
        for a in range(0, 91, 15):
            rad = a * math.pi / 180
            px = int((new_w - corner_radius) + (corner_radius - offset) * math.cos(rad))
            py = int((new_h - corner_radius) + (corner_radius - offset) * math.sin(rad))
            draw.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r], fill=bg_color)
            
        for a in range(90, 181, 15):
            rad = a * math.pi / 180
            px = int(corner_radius + (corner_radius - offset) * math.cos(rad))
            py = int((new_h - corner_radius) + (corner_radius - offset) * math.sin(rad))
            draw.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r], fill=bg_color)

        new_img.paste(qr_img, (padding, padding), qr_img)
        return new_img

    elif layout_template == "brackets":
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        bw = border_thickness
        blen = max(20, min(new_w, new_h) // 6)
        
        draw.rectangle([0, 0, blen, bw], fill=bg_color)
        draw.rectangle([0, 0, bw, blen], fill=bg_color)
        draw.rectangle([new_w - blen, 0, new_w, bw], fill=bg_color)
        draw.rectangle([new_w - bw, 0, new_w, blen], fill=bg_color)
        draw.rectangle([0, new_h - bw, blen, new_h], fill=bg_color)
        draw.rectangle([0, new_h - blen, bw, new_h], fill=bg_color)
        draw.rectangle([new_w - blen, new_h - bw, new_w, new_h], fill=bg_color)
        draw.rectangle([new_w - bw, new_h - blen, new_w, new_h], fill=bg_color)

        new_img.paste(qr_img, (padding, padding), qr_img)
        return new_img

    elif layout_template == "retro_stamp":
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        draw.rectangle([(0, 0), (new_w, new_h)], fill=bg_color)
        
        sr = max(6, border_thickness)
        spacing = sr * 3
        for x in range(spacing, new_w, spacing):
            draw.ellipse([x - sr, -sr, x + sr, sr], fill=(255, 255, 255, 0))
            draw.ellipse([x - sr, new_h - sr, x + sr, new_h + sr], fill=(255, 255, 255, 0))
        for y in range(spacing, new_h, spacing):
            draw.ellipse([-sr, y - sr, sr, y + sr], fill=(255, 255, 255, 0))
            draw.ellipse([new_w - sr, y - sr, new_w + sr, y + sr], fill=(255, 255, 255, 0))
            
        draw.rectangle([(border_thickness, border_thickness), (new_w - border_thickness, new_h - border_thickness)], fill=(255, 255, 255, 255))
        
        new_img.paste(qr_img, (padding, padding), qr_img)
        return new_img

    elif layout_template == "phone_frame":
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + 40
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=30, fill=(255, 255, 255, 255))
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=30, outline=bg_color, width=6)
        
        notch_w = new_w // 3
        draw.rounded_rectangle([(new_w // 2 - notch_w // 2, 4), (new_w // 2 + notch_w // 2, 18)], radius=6, fill=bg_color)
        
        bar_w = new_w // 4
        draw.rounded_rectangle([(new_w // 2 - bar_w // 2, new_h - 16), (new_w // 2 + bar_w // 2, new_h - 10)], radius=3, fill=bg_color)
        
        new_img.paste(qr_img, (padding, padding + 20), qr_img)
        return new_img

    elif layout_template == "hexagon":
        new_w = qr_w + padding * 3
        new_h = qr_h + padding * 3
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        cx = new_w // 2
        cy = new_h // 2
        R_val = new_w // 2
        
        p_out = []
        for i in range(6):
            angle = i * math.pi / 3 - math.pi / 2
            p_out.append((int(cx + R_val * math.cos(angle)), int(cy + R_val * math.sin(angle))))
        draw.polygon(p_out, fill=bg_color)
        
        R_in = R_val - border_thickness
        p_in = []
        for i in range(6):
            angle = i * math.pi / 3 - math.pi / 2
            p_in.append((int(cx + R_in * math.cos(angle)), int(cy + R_in * math.sin(angle))))
        draw.polygon(p_in, fill=(255, 255, 255, 255))
        
        new_img.paste(qr_img, (int(padding * 1.5), int(padding * 1.5)), qr_img)
        return new_img
        
    return qr_img

def apply_text_frame(qr_img, text_template="none", frame_color="#000000", text="SCAN ME", text_color="#ffffff", text_size=40, padding=20, corner_radius=15, border_thickness=10, top_text="SCAN ME", font_name="Outfit-Bold.ttf"):
    if text_template == "none":
        return qr_img
        
    if qr_img.mode != 'RGBA':
        qr_img = qr_img.convert('RGBA')
        
    qr_w, qr_h = qr_img.size
    bg_color = hex_to_rgb(frame_color)
    
    # Try loading selected font, fallback to arialbd, then default
    try:
        font = ImageFont.truetype(font_name, text_size)
    except:
        try:
            font = ImageFont.truetype("arialbd.ttf", text_size)
        except:
            font = ImageFont.load_default()
        
    # Calculate text dimensions dynamically
    dummy_draw = ImageDraw.Draw(Image.new("RGBA", (1,1)))
    
    def get_fitted_font(txt, max_w, initial_size):
        if not txt:
            try:
                f = ImageFont.truetype(font_name, initial_size)
            except:
                try:
                    f = ImageFont.truetype("arialbd.ttf", initial_size)
                except:
                    f = ImageFont.load_default()
            return f, 0, 0
        curr_size = initial_size
        f = font
        while curr_size > 12:
            try:
                f = ImageFont.truetype(font_name, curr_size)
            except:
                try:
                    f = ImageFont.truetype("arialbd.ttf", curr_size)
                except:
                    break
            bbox = dummy_draw.textbbox((0, 0), txt, font=f)
            w = bbox[2] - bbox[0]
            if w <= max_w:
                return f, w, bbox[3] - bbox[1]
            curr_size -= 2
        try:
            f = ImageFont.truetype(font_name, max(12, curr_size))
        except:
            try:
                f = ImageFont.truetype("arialbd.ttf", max(12, curr_size))
            except:
                f = ImageFont.load_default()
        bbox = dummy_draw.textbbox((0, 0), txt, font=f)
        return f, bbox[2] - bbox[0], bbox[3] - bbox[1]

    text_w, text_h = 0, 0
    if text:
        text_bbox = dummy_draw.textbbox((0, 0), text, font=font)
        text_w = text_bbox[2] - text_bbox[0]
        text_h = text_bbox[3] - text_bbox[1]
        
    top_w, top_h = 0, 0
    if top_text:
        top_bbox = dummy_draw.textbbox((0, 0), top_text, font=font)
        top_w = top_bbox[2] - top_bbox[0]
        top_h = top_bbox[3] - top_bbox[1]
        
    if text_template == "top_text":
        text_area_height = text_h + padding * 2 if text_h > 0 else padding * 2
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + text_area_height
        
        new_img = Image.new("RGBA", (new_w, new_h), color=bg_color + (255,))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        
        # Paste QR centered horizontally, and at the bottom vertically
        qr_pos = ((new_w - qr_w) // 2, padding + text_area_height)
        new_img.paste(qr_img, qr_pos, qr_img)
        
        if text:
            text_x = (new_w - text_w) // 2
            text_y = (text_area_height - text_h) // 2 - text_h // 4
            draw.text((text_x, text_y), text, fill=hex_to_rgb(text_color), font=font)
        return new_img
        
    elif text_template == "bottom_text":
        text_area_height = text_h + padding * 2 if text_h > 0 else padding * 2
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + text_area_height
        
        new_img = Image.new("RGBA", (new_w, new_h), color=bg_color + (255,))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        
        # Paste QR centered horizontally, and at the top vertically
        qr_pos = ((new_w - qr_w) // 2, padding)
        new_img.paste(qr_img, qr_pos, qr_img)
        
        if text:
            text_x = (new_w - text_w) // 2
            text_y = qr_h + padding + (text_area_height - text_h) // 2 - text_h // 4
            draw.text((text_x, text_y), text, fill=hex_to_rgb(text_color), font=font)
        return new_img
        
    elif text_template == "top_bottom_text":
        t_area_h = top_h + padding * 2 if top_h > 0 else padding * 2
        b_area_h = text_h + padding * 2 if text_h > 0 else padding * 2
        
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + t_area_h + b_area_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=bg_color + (255,))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        
        qr_pos = ((new_w - qr_w) // 2, padding + t_area_h)
        new_img.paste(qr_img, qr_pos, qr_img)
        
        if top_text:
            t_x = (new_w - top_w) // 2
            t_y = (t_area_h - top_h) // 2 - top_h // 4
            draw.text((t_x, t_y), top_text, fill=hex_to_rgb(text_color), font=font)
            
        if text:
            b_x = (new_w - text_w) // 2
            b_y = new_h - b_area_h + (b_area_h - text_h) // 2 - text_h // 4
            draw.text((b_x, b_y), text, fill=hex_to_rgb(text_color), font=font)
            
        return new_img
        
    elif text_template == "speech_bubble":
        pointer_h = int(qr_h * 0.05)
        pointer_w = int(qr_w * 0.08)
        bubble_h = text_h + padding * 2 if text_h > 0 else padding * 2
        
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + pointer_h + bubble_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # White background for the upper part
        draw.rounded_rectangle([(0, 0), (new_w, qr_h + padding * 2)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        # Draw border outline for the upper part
        if border_thickness > 0:
            draw.rounded_rectangle([(border_thickness//2, border_thickness//2), 
                                    (new_w - border_thickness//2, qr_h + padding * 2 - border_thickness//2)], 
                                   radius=corner_radius, outline=bg_color, width=border_thickness)
                                   
        # Paste QR
        new_img.paste(qr_img, (padding, padding), qr_img)
        
        # Pointer
        p1 = (new_w // 2, qr_h + padding * 2 - 2)
        p2 = (new_w // 2 - pointer_w // 2, qr_h + padding * 2 + pointer_h)
        p3 = (new_w // 2 + pointer_w // 2, qr_h + padding * 2 + pointer_h)
        draw.polygon([p1, p2, p3], fill=bg_color)
        
        # Bubble
        bubble_y1 = qr_h + padding * 2 + pointer_h - 2
        bubble_y2 = new_h
        draw.rounded_rectangle([(0, bubble_y1), (new_w, bubble_y2)], radius=corner_radius, fill=bg_color)
        
        if text:
            text_x = (new_w - text_w) // 2
            text_y = bubble_y1 + (bubble_h - text_h) // 2 - text_h // 4
            draw.text((text_x, text_y), text, fill=hex_to_rgb(text_color), font=font)
            
        return new_img
        
    elif text_template == "bottom_tab":
        tab_h = text_h + padding * 2 if text_h > 0 else padding * 2
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + tab_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Outer tab card background (solid color)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        
        # Inner white area where QR sits
        draw.rounded_rectangle([(border_thickness, border_thickness), 
                                (new_w - border_thickness, qr_h + padding * 2 - border_thickness//2)], 
                               radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
                               
        # Paste QR
        new_img.paste(qr_img, (padding, padding), qr_img)
        
        if text:
            text_x = (new_w - text_w) // 2
            text_y = qr_h + padding * 2 + (tab_h - text_h) // 2 - text_h // 4
            draw.text((text_x, text_y), text, fill=hex_to_rgb(text_color), font=font)
            
        return new_img

    elif text_template == "side_tab":
        tab_w = text_h + padding * 2 if text_h > 0 else padding * 2
        new_w = qr_w + padding * 2 + tab_w
        new_h = qr_h + padding * 2
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        draw.rounded_rectangle([(tab_w, border_thickness), 
                                (new_w - border_thickness, new_h - border_thickness)], 
                               radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        
        new_img.paste(qr_img, (tab_w + padding, padding), qr_img)
        
        if text:
            text_canvas = Image.new("RGBA", (text_w, text_h), (0, 0, 0, 0))
            t_draw = ImageDraw.Draw(text_canvas)
            t_draw.text((0, 0), text, fill=hex_to_rgb(text_color), font=font)
            rotated_text = text_canvas.rotate(90, expand=True)
            rot_w, rot_h = rotated_text.size
            tx = (tab_w - rot_w) // 2
            ty = (new_h - rot_h) // 2
            new_img.paste(rotated_text, (tx, ty), rotated_text)
            
        return new_img

    elif text_template == "right_tab":
        tab_w = text_h + padding * 2 if text_h > 0 else padding * 2
        new_w = qr_w + padding * 2 + tab_w
        new_h = qr_h + padding * 2
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        draw.rounded_rectangle([(0, 0), (new_w, new_h)], radius=corner_radius, fill=bg_color)
        draw.rounded_rectangle([(border_thickness, border_thickness), 
                                (new_w - tab_w, new_h - border_thickness)], 
                               radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        
        new_img.paste(qr_img, (padding, padding), qr_img)
        
        if text:
            text_canvas = Image.new("RGBA", (text_w, text_h), (0, 0, 0, 0))
            t_draw = ImageDraw.Draw(text_canvas)
            t_draw.text((0, 0), text, fill=hex_to_rgb(text_color), font=font)
            rotated_text = text_canvas.rotate(270, expand=True)
            rot_w, rot_h = rotated_text.size
            tx = new_w - tab_w + (tab_w - rot_w) // 2
            ty = (new_h - rot_h) // 2
            new_img.paste(rotated_text, (tx, ty), rotated_text)
            
        return new_img

    elif text_template == "floating_badge":
        badge_h = text_h + padding if text_h > 0 else padding
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + badge_h // 2
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        card_y1 = badge_h // 2
        draw.rounded_rectangle([(0, card_y1), (new_w, new_h)], radius=corner_radius, fill=(255, 255, 255, 255))
        if border_thickness > 0:
            draw.rounded_rectangle([(border_thickness//2, card_y1 + border_thickness//2), 
                                    (new_w - border_thickness//2, new_h - border_thickness//2)], 
                                   radius=corner_radius, outline=bg_color, width=border_thickness)
                                   
        new_img.paste(qr_img, (padding, card_y1 + padding), qr_img)
        
        if text:
            badge_w = text_w + padding * 2
            bx1 = (new_w - badge_w) // 2
            by1 = 0
            bx2 = bx1 + badge_w
            by2 = badge_h
            draw.rounded_rectangle([(bx1, by1), (bx2, by2)], radius=badge_h // 2, fill=bg_color)
            
            tx = bx1 + padding
            ty = (badge_h - text_h) // 2 - text_h // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=font)
            
        return new_img

    elif text_template == "speech_bubble_top":
        pointer_h = int(qr_h * 0.05)
        pointer_w = int(qr_w * 0.08)
        
        # Fit font for bubble
        max_bubble_w = qr_w + padding * 2
        f_bubble, tw_bubble, th_bubble = get_fitted_font(text, max_bubble_w - padding * 2, text_size)
        bubble_h = th_bubble + padding * 2 if text else padding * 2
        
        new_w = qr_w + padding * 2
        new_h = qr_h + padding * 2 + pointer_h + bubble_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Draw the bubble at the top
        bubble_y1 = 0
        bubble_y2 = bubble_h
        draw.rounded_rectangle([(0, bubble_y1), (new_w, bubble_y2)], radius=corner_radius, fill=bg_color)
        
        if text:
            text_x = (new_w - tw_bubble) // 2
            text_y = bubble_y1 + (bubble_h - th_bubble) // 2 - th_bubble // 4
            draw.text((text_x, text_y), text, fill=hex_to_rgb(text_color), font=f_bubble)
            
        # Draw the pointer pointing down from the bubble
        p1 = (new_w // 2, bubble_h + pointer_h + 2)
        p2 = (new_w // 2 - pointer_w // 2, bubble_h - 2)
        p3 = (new_w // 2 + pointer_w // 2, bubble_h - 2)
        draw.polygon([p1, p2, p3], fill=bg_color)
        
        # White card for QR at the bottom
        qr_card_y1 = bubble_h + pointer_h
        qr_card_y2 = new_h
        
        if border_thickness > 0:
            draw.rounded_rectangle([(0, qr_card_y1), (new_w, qr_card_y2)], radius=corner_radius, fill=bg_color)
            draw.rounded_rectangle([(border_thickness, qr_card_y1 + border_thickness), 
                                    (new_w - border_thickness, qr_card_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(0, qr_card_y1), (new_w, qr_card_y2)], radius=corner_radius, fill=(255, 255, 255, 255))
                                   
        # Paste QR
        new_img.paste(qr_img, (padding, qr_card_y1 + padding), qr_img)
        return new_img

    elif text_template == "drink_cup":
        straw_h = int(qr_h * 0.18)
        new_w = qr_w + padding * 4
        
        # Fit font for bottom cup label
        max_label_w = new_w - padding * 4.5
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + straw_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # 1. Straw
        sx = new_w // 2
        sy1 = straw_h + padding
        sy2 = padding * 2
        draw.line([(sx, sy1), (sx, sy2)], fill=bg_color, width=16)
        draw.line([(sx, sy2), (sx - 30, padding)], fill=bg_color, width=16)
        
        # 2. Cup body tapered polygon
        y_top = straw_h + padding * 2
        y_bottom = new_h - padding
        
        pt_tl = (padding, y_top)
        pt_tr = (new_w - padding, y_top)
        pt_br = (new_w - padding * 2, y_bottom)
        pt_bl = (padding * 2, y_bottom)
        
        # White background cup
        draw.polygon([pt_tl, pt_tr, pt_br, pt_bl], fill=(255, 255, 255, 255))
        
        # 3. Liquid level
        y_liquid = y_top + int((y_bottom - y_top) * 0.25)
        liq_l_x = padding + int((pt_bl[0] - pt_tl[0]) * 0.25)
        liq_r_x = new_w - padding - int((pt_tr[0] - pt_br[0]) * 0.25)
        
        # Draw liquid fill (semi-transparent)
        liq_img = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
        liq_draw = ImageDraw.Draw(liq_img)
        liq_color = bg_color + (100,)
        liq_draw.polygon([(liq_l_x, y_liquid), (liq_r_x, y_liquid), pt_br, pt_bl], fill=liq_color)
        
        new_img = Image.alpha_composite(new_img, liq_img)
        draw = ImageDraw.Draw(new_img)
        
        # Cup outline
        draw.polygon([pt_tl, pt_tr, pt_br, pt_bl], outline=bg_color, width=border_thickness)
        # Lip of the cup (rim)
        draw.rounded_rectangle([(padding - 10, y_top - 5), (new_w - padding + 10, y_top + 10)], radius=6, fill=bg_color)
        
        # 4. QR card inside cup
        qr_x = (new_w - qr_w) // 2
        qr_y = y_top + (y_bottom - y_top - label_h - qr_h) // 2
        
        # White backing card for QR
        card_p = 10
        cx1, cy1 = qr_x - card_p, qr_y - card_p
        cx2, cy2 = qr_x + qr_w + card_p, qr_y + qr_h + card_p
        
        if border_thickness > 0:
            bt_half = max(2, border_thickness // 2)
            draw.rounded_rectangle([(cx1, cy1), (cx2, cy2)], radius=12, fill=bg_color)
            draw.rounded_rectangle([(cx1 + bt_half, cy1 + bt_half), (cx2 - bt_half, cy2 - bt_half)], radius=max(0, 12 - bt_half), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(cx1, cy1), (cx2, cy2)], radius=12, fill=(255, 255, 255, 255))
        
        # Paste QR
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # 5. Label banner at the bottom
        if text:
            lbl_w = max(tw_lbl + padding * 2, new_w - padding * 4.5)
            lbl_x1 = (new_w - lbl_w) // 2
            lbl_y1 = y_bottom - label_h
            lbl_x2 = lbl_x1 + lbl_w
            lbl_y2 = y_bottom
            
            draw.rounded_rectangle([(lbl_x1, lbl_y1), (lbl_x2, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "ribbon_banner":
        new_w = qr_w + padding * 4
        
        # Fit font for ribbon
        max_ribbon_w = new_w - padding * 3
        f_ribbon, tw_ribbon, th_ribbon = get_fitted_font(text, max_ribbon_w - 20, text_size)
        ribbon_h = th_ribbon + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + ribbon_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # 1. Draw base white card for QR code
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding - ribbon_h // 2
        
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=corner_radius, fill=bg_color)
            draw.rounded_rectangle([(card_x1 + border_thickness, card_y1 + border_thickness), 
                                    (card_x2 - border_thickness, card_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=corner_radius, fill=(255, 255, 255, 255))
            
        # Paste QR
        new_img.paste(qr_img, (padding * 2, card_y1 + padding), qr_img)
        
        # 2. Ribbon flaps (tails) sticking out the sides
        rx1 = padding
        rx2 = new_w - padding
        ry1 = card_y2 - ribbon_h // 2 - 10
        ry2 = card_y2 + ribbon_h // 2 - 10
        
        v_offset = 20
        lt_pts = [
            (rx1 + 20, ry1 + 10), 
            (rx1 + 20, ry2 + 10), 
            (0, ry2 + 10), 
            (v_offset, (ry1 + ry2) // 2 + 10), 
            (0, ry1 + 10)
        ]
        rt_pts = [
            (rx2 - 20, ry1 + 10), 
            (rx2 - 20, ry2 + 10), 
            (new_w, ry2 + 10), 
            (new_w - v_offset, (ry1 + ry2) // 2 + 10), 
            (new_w, ry1 + 10)
        ]
        
        shadow_color = tuple(max(0, c - 40) for c in bg_color)
        
        # Draw tails
        draw.polygon(lt_pts, fill=shadow_color)
        draw.polygon(rt_pts, fill=shadow_color)
        
        # Ribbon folds
        draw.polygon([(rx1 + 20, ry2), (rx1 + 20, ry2 + 10), (rx1 + 40, ry2)], fill=shadow_color)
        draw.polygon([(rx2 - 20, ry2), (rx2 - 20, ry2 + 10), (rx2 - 40, ry2)], fill=shadow_color)
        
        # 3. Main ribbon banner rectangle in front
        draw.rectangle([(rx1 + 20, ry1), (rx2 - 20, ry2)], fill=bg_color)
        if border_thickness > 0:
            draw.rectangle([(rx1 + 20, ry1), (rx2 - 20, ry2)], outline=(255, 255, 255, 255), width=max(1, border_thickness // 4))
            
        if text:
            tx = (new_w - tw_ribbon) // 2
            ty = ry1 + (ribbon_h - th_ribbon) // 2 - th_ribbon // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_ribbon)
            
        return new_img

    elif text_template == "coffee_cup":
        cup_w = 90
        new_w = qr_w + padding * 4 + cup_w
        
        # Fit font for bottom bag label
        max_bag_w = qr_w + padding * 2
        f_bag, tw_bag, th_bag = get_fitted_font(text, max_bag_w - 20, text_size)
        bag_h = th_bag + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + bag_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # 1. Main Bag body
        bag_x1 = padding + cup_w
        bag_y1 = padding + 20
        bag_x2 = new_w - padding
        bag_y2 = new_h - padding
        
        # Bag background and border
        if border_thickness > 0:
            draw.rounded_rectangle([(bag_x1, bag_y1), (bag_x2, bag_y2)], radius=corner_radius, fill=bg_color)
            draw.rounded_rectangle([(bag_x1 + border_thickness, bag_y1 + border_thickness), 
                                    (bag_x2 - border_thickness, bag_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(bag_x1, bag_y1), (bag_x2, bag_y2)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        # Bag top fold (paper bag look)
        fold_y = bag_y1 + 15
        draw.polygon([(bag_x1 + border_thickness, bag_y1 + border_thickness), 
                      (bag_x2 - border_thickness, bag_y1 + border_thickness), 
                      (bag_x2 - 15 - border_thickness, fold_y), 
                      (bag_x1 + 15 + border_thickness, fold_y)], fill=bg_color)
            
        # Paste QR Code on the bag
        new_img.paste(qr_img, (bag_x1 + padding, bag_y1 + padding + 10), qr_img)
        
        # 2. Coffee Cup on the left
        cx_c = padding + cup_w // 2 - 10
        cy_c = new_h // 2 + 10
        
        cup_y1 = cy_c - 50
        cup_y2 = cy_c + 60
        cup_tx = 30
        cup_bx = 20
        
        draw.polygon([(cx_c - cup_tx, cup_y1), (cx_c + cup_tx, cup_y1), 
                      (cx_c + cup_bx, cup_y2), (cx_c - cup_bx, cup_y2)], fill=(255, 255, 255, 255))
                      
        draw.polygon([(cx_c - 26, cy_c - 20), (cx_c + 26, cy_c - 20), 
                      (cx_c + 23, cy_c + 20), (cx_c - 23, cy_c + 20)], fill=bg_color)
                      
        draw.polygon([(cx_c - cup_tx, cup_y1), (cx_c + cup_tx, cup_y1), 
                      (cx_c + cup_bx, cup_y2), (cx_c - cup_bx, cup_y2)], outline=bg_color, width=6)
                      
        draw.rounded_rectangle([(cx_c - cup_tx - 4, cup_y1 - 10), (cx_c + cup_tx + 4, cup_y1)], radius=4, fill=bg_color)
        draw.rectangle([(cx_c - 6, cup_y1 - 15), (cx_c + 6, cup_y1 - 10)], fill=bg_color)
        
        # 3. Label text at the bottom of the bag
        if text:
            lbl_y1 = bag_y2 - bag_h
            lbl_y2 = bag_y2
            draw.rounded_rectangle([(bag_x1 + border_thickness, lbl_y1 - border_thickness//2), 
                                    (bag_x2 - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=bg_color)
            
            tx = bag_x1 + (bag_x2 - bag_x1 - tw_bag) // 2
            ty = lbl_y1 + (bag_h - th_bag) // 2 - th_bag // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_bag)
            
        return new_img

    elif text_template == "food_dome":
        dome_h = int(qr_h * 0.15)
        new_w = qr_w + padding * 4
        
        # Fit font for dome label
        max_dome_w = new_w - padding * 4
        f_dome, tw_dome, th_dome = get_fitted_font(text, max_dome_w - 20, text_size)
        label_h = th_dome + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + dome_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        y_platter = new_h - padding - label_h - 15
        dome_y1 = padding + dome_h
        dome_y2 = y_platter
        
        # Fill dome transparently
        dome_img = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
        dome_draw = ImageDraw.Draw(dome_img)
        dome_draw.chord([(padding, dome_y1), (new_w - padding, dome_y2 + 20)], start=180, end=360, fill=bg_color + (60,))
        new_img = Image.alpha_composite(new_img, dome_img)
        draw = ImageDraw.Draw(new_img)
        
        draw.arc([(padding, dome_y1), (new_w - padding, dome_y2 + 20)], start=180, end=360, fill=bg_color, width=border_thickness)
        
        knob_r = 14
        draw.ellipse([(new_w//2 - knob_r, dome_y1 - knob_r + 4), (new_w//2 + knob_r, dome_y1 + knob_r)], fill=bg_color)
        
        draw.rounded_rectangle([(padding - 15, y_platter), (new_w - padding + 15, y_platter + 16)], radius=8, fill=bg_color)
        
        # QR card inside
        qr_x = (new_w - qr_w) // 2
        qr_y = dome_y1 + (y_platter - dome_y1 - qr_h) // 2 + 10
        
        card_p = 10
        cx1, cy1 = qr_x - card_p, qr_y - card_p
        cx2, cy2 = qr_x + qr_w + card_p, qr_y + qr_h + card_p
        
        if border_thickness > 0:
            bt_half = max(2, border_thickness // 2)
            draw.rounded_rectangle([(cx1, cy1), (cx2, cy2)], radius=12, fill=bg_color)
            draw.rounded_rectangle([(cx1 + bt_half, cy1 + bt_half), (cx2 - bt_half, cy2 - bt_half)], radius=max(0, 12 - bt_half), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(cx1, cy1), (cx2, cy2)], radius=12, fill=(255, 255, 255, 255))
            
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Text label at the bottom
        if text:
            lbl_y1 = y_platter + 25
            lbl_y2 = new_h - padding
            draw.rounded_rectangle([(padding + 10, lbl_y1), (new_w - padding - 10, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_dome) // 2
            ty = lbl_y1 + (label_h - th_dome) // 2 - th_dome // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_dome)
            
        return new_img

    elif text_template == "shopping_bag":
        handle_h = 70
        new_w = qr_w + padding * 4
        
        # Fit font for bag label
        max_bag_w = new_w - padding * 4
        f_bag, tw_bag, th_bag = get_fitted_font(text, max_bag_w - 20, text_size)
        label_h = th_bag + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + handle_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Handle (arc at the top)
        handle_box = [(new_w // 2 - 60, padding), (new_w // 2 + 60, padding + handle_h + 10)]
        draw.arc(handle_box, start=180, end=360, fill=bg_color, width=12)
        
        # Bag body
        bag_y1 = padding + handle_h
        bag_y2 = new_h - padding
        
        if border_thickness > 0:
            draw.rounded_rectangle([(padding, bag_y1), (new_w - padding, bag_y2)], radius=corner_radius, fill=bg_color)
            draw.rounded_rectangle([(padding + border_thickness, bag_y1 + border_thickness), 
                                    (new_w - padding - border_thickness, bag_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(padding, bag_y1), (new_w - padding, bag_y2)], radius=corner_radius, fill=(255, 255, 255, 255))
            
        qr_x = (new_w - qr_w) // 2
        qr_y = bag_y1 + (bag_y2 - bag_y1 - label_h - qr_h) // 2 + 5
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Label text at the bottom of the bag
        if text:
            lbl_y1 = bag_y2 - label_h
            lbl_y2 = bag_y2
            draw.rounded_rectangle([(padding + border_thickness, lbl_y1 - border_thickness//2), 
                                    (new_w - padding - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=bg_color)
            
            tx = (new_w - tw_bag) // 2
            ty = lbl_y1 + (label_h - th_bag) // 2 - th_bag // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_bag)
            
        return new_img

    elif text_template == "ticket_stub":
        new_w = qr_w + padding * 4
        
        # Fit font for ticket label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + label_h
        y_div = new_h - label_h - padding * 1.5
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Ticket background
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=corner_radius, fill=bg_color)
            draw.rounded_rectangle([(card_x1 + border_thickness, card_y1 + border_thickness), 
                                    (card_x2 - border_thickness, card_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=corner_radius, fill=(255, 255, 255, 255))
            
        # Draw ticket cutouts (notches) using transparent circles on alpha channel
        cut_r = 16
        cut_img = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
        cut_draw = ImageDraw.Draw(cut_img)
        cut_draw.ellipse([card_x1 - cut_r, y_div - cut_r, card_x1 + cut_r, y_div + cut_r], fill=(0,0,0,0))
        cut_draw.ellipse([card_x2 - cut_r, y_div - cut_r, card_x2 + cut_r, y_div + cut_r], fill=(0,0,0,0))
        
        # We need to make these circular notch cutouts transparent on the final image.
        # Draw transparent circles onto new_img:
        # A simpler way in Pillow is drawing on new_img directly with (0,0,0,0) and using a proper composite, or simply drawing them with back_color if it's not transparent, but (0,0,0,0) works if we set draw to blend or just clear the pixels.
        # In Pillow, to clear pixels on RGBA, we can draw a circle with color=(0,0,0,0) using a modified draw.
        # But wait! A simpler way to get perfect cutouts is:
        draw.ellipse([card_x1 - cut_r, y_div - cut_r, card_x1 + cut_r, y_div + cut_r], fill=(255, 255, 255, 0))
        draw.ellipse([card_x2 - cut_r, y_div - cut_r, card_x2 + cut_r, y_div + cut_r], fill=(255, 255, 255, 0))
        
        # Let's draw borders around the notches if border_thickness > 0
        if border_thickness > 0:
            draw.arc([card_x1 - cut_r, y_div - cut_r, card_x1 + cut_r, y_div + cut_r], start=270, end=90, fill=bg_color, width=border_thickness)
            draw.arc([card_x2 - cut_r, y_div - cut_r, card_x2 + cut_r, y_div + cut_r], start=90, end=270, fill=bg_color, width=border_thickness)
            
        # Draw dotted ticket division line
        for x in range(card_x1 + cut_r + 4, card_x2 - cut_r - 4, 15):
            draw.ellipse([x - 3, y_div - 3, x + 3, y_div + 3], fill=bg_color)
            
        # Paste QR
        new_img.paste(qr_img, (padding * 2, card_y1 + padding), qr_img)
        
        # Draw label at bottom
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = y_div + (label_h - th_lbl) // 2 + 10
            draw.text((tx, ty), text, fill=hex_to_rgb(frame_color), font=f_lbl)
            
        return new_img

    elif text_template == "polaroid_photo":
        new_w = qr_w + padding * 4
        
        # Polaroid bottom margin is extra wide
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 3 if text else padding * 3
        
        new_h = qr_h + padding * 5 + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Polaroid thick white card body
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=12, fill=(255, 255, 255, 255))
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=12, outline=bg_color, width=border_thickness)
            
        # Photo area (dark/gray background)
        photo_x1 = padding * 2
        photo_y1 = padding * 2
        photo_x2 = new_w - padding * 2
        photo_y2 = new_h - padding * 2 - label_h
        
        draw.rectangle([(photo_x1, photo_y1), (photo_x2, photo_y2)], fill=(245, 245, 245, 255))
        if border_thickness > 0:
            draw.rectangle([(photo_x1, photo_y1), (photo_x2, photo_y2)], outline=bg_color, width=max(2, border_thickness // 3))
            
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = photo_y1 + (photo_y2 - photo_y1 - qr_h) // 2
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Polaroid label text at bottom
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = photo_y2 + (label_h - th_lbl) // 2
            draw.text((tx, ty), text, fill=hex_to_rgb(frame_color), font=f_lbl)
            
        return new_img

    elif text_template == "price_tag":
        taper_h = 65
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + taper_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Tag polygon points (outer)
        y_top = padding + taper_h
        y_bottom = new_h - padding
        
        pt_tl = (padding, y_top)
        pt_tc1 = (new_w // 2 - 40, padding)
        pt_tc2 = (new_w // 2 + 40, padding)
        pt_tr = (new_w - padding, y_top)
        pt_br = (new_w - padding, y_bottom)
        pt_bl = (padding, y_bottom)
        
        if border_thickness > 0:
            draw.polygon([pt_tl, pt_tc1, pt_tc2, pt_tr, pt_br, pt_bl], fill=bg_color)
            
            # Inner white tag body
            bt = border_thickness
            pt_tl_in = (padding + bt, y_top + bt // 2)
            pt_tc1_in = (new_w // 2 - 40 + bt // 2, padding + bt)
            pt_tc2_in = (new_w // 2 + 40 - bt // 2, padding + bt)
            pt_tr_in = (new_w - padding - bt, y_top + bt // 2)
            pt_br_in = (new_w - padding - bt, y_bottom - bt)
            pt_bl_in = (padding + bt, y_bottom - bt)
            
            draw.polygon([pt_tl_in, pt_tc1_in, pt_tc2_in, pt_tr_in, pt_br_in, pt_bl_in], fill=(255, 255, 255, 255))
        else:
            draw.polygon([pt_tl, pt_tc1, pt_tc2, pt_tr, pt_br, pt_bl], fill=(255, 255, 255, 255))
            
        # Draw hole at top
        hx, hy = new_w // 2, padding + 24
        hr = 8
        draw.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=(255, 255, 255, 0))
        if border_thickness > 0:
            draw.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], outline=bg_color, width=3)
            
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = y_top + (y_bottom - y_top - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Label text banner at bottom
        if text:
            lbl_y1 = y_bottom - label_h
            lbl_y2 = y_bottom
            draw.rounded_rectangle([(padding + border_thickness, lbl_y1 - border_thickness//2), 
                                    (new_w - padding - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "browser_window":
        header_h = 55
        new_w = qr_w + padding * 4
        
        # Fit font for bottom label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + header_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Outer browser card body
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=15, fill=bg_color)
            draw.rounded_rectangle([(card_x1 + border_thickness, card_y1 + border_thickness), 
                                    (card_x2 - border_thickness, card_y2 - border_thickness)], 
                                   radius=15 - border_thickness, fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=15, fill=(255, 255, 255, 255))
            
        # Draw Browser Header (soft gray background)
        header_y1 = card_y1 + border_thickness
        header_y2 = header_y1 + header_h
        header_color = tuple(min(255, c + 220) for c in hex_to_rgb("#e0e0e0"))
        draw.rectangle([(card_x1 + border_thickness, header_y1), (card_x2 - border_thickness, header_y2)], fill=header_color)
        
        # Draw macOS-style window control dots (red, yellow, green)
        dot_r = 5
        cy = header_y1 + header_h // 2
        draw.ellipse([card_x1 + border_thickness + 20 - dot_r, cy - dot_r, card_x1 + border_thickness + 20 + dot_r, cy + dot_r], fill="#FF5F56")
        draw.ellipse([card_x1 + border_thickness + 36 - dot_r, cy - dot_r, card_x1 + border_thickness + 36 + dot_r, cy + dot_r], fill="#FFBD2E")
        draw.ellipse([card_x1 + border_thickness + 52 - dot_r, cy - dot_r, card_x1 + border_thickness + 52 + dot_r, cy + dot_r], fill="#27C93F")
        
        # Draw address bar
        addr_x1 = card_x1 + border_thickness + 70
        addr_x2 = card_x2 - border_thickness - 20
        addr_y1 = cy - 10
        addr_y2 = cy + 10
        draw.rounded_rectangle([(addr_x1, addr_y1), (addr_x2, addr_y2)], radius=6, fill=(255, 255, 255, 255), outline="#cccccc", width=1)
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = header_y2 + (card_y2 - border_thickness - header_y2 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Label banner at bottom
        if text:
            lbl_y1 = card_y2 - border_thickness - label_h
            lbl_y2 = card_y2 - border_thickness
            draw.rounded_rectangle([(card_x1 + border_thickness, lbl_y1), (card_x2 - border_thickness, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "coffee_mug":
        handle_w = 60
        new_w = qr_w + padding * 4 + handle_w
        
        # Fit font for label
        max_label_w = qr_w + padding * 2
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Mug main body card
        mug_x1 = padding
        mug_y1 = padding
        mug_x2 = new_w - padding - handle_w
        mug_y2 = new_h - padding
        
        # Handle (solid outer, transparent inner)
        hx1 = mug_x2 - 10
        hx2 = new_w - padding
        hy1 = padding + 80
        hy2 = mug_y2 - 80
        
        draw.rounded_rectangle([(hx1, hy1), (hx2, hy2)], radius=25, fill=bg_color)
        draw.rounded_rectangle([(hx1, hy1 + border_thickness + 10), (hx2 - border_thickness - 10, hy2 - border_thickness - 10)], radius=15, fill=(255, 255, 255, 0))
        
        # Mug body outline and white background
        if border_thickness > 0:
            draw.rounded_rectangle([(mug_x1, mug_y1), (mug_x2, mug_y2)], radius=corner_radius, fill=bg_color)
            draw.rounded_rectangle([(mug_x1 + border_thickness, mug_y1 + border_thickness), 
                                    (mug_x2 - border_thickness, mug_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(mug_x1, mug_y1), (mug_x2, mug_y2)], radius=corner_radius, fill=(255, 255, 255, 255))
            
        # Paste QR
        qr_x = mug_x1 + (mug_x2 - mug_x1 - qr_w) // 2
        qr_y = mug_y1 + (mug_y2 - mug_y1 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Label banner at bottom
        if text:
            lbl_y1 = mug_y2 - label_h
            lbl_y2 = mug_y2
            draw.rounded_rectangle([(mug_x1 + border_thickness, lbl_y1 - border_thickness//2), 
                                    (mug_x2 - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=max(0, corner_radius - border_thickness), fill=bg_color)
            
            tx = mug_x1 + (mug_x2 - mug_x1 - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "award_badge":
        ribbon_h = 90
        
        # Fit font for circular label
        max_label_w = qr_w
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        # Medallion circle diameter needs to fit QR code, gap, and label
        circle_d = qr_h + label_h + padding * 2 + 20
        r = circle_d // 2
        
        new_w = circle_d + padding * 4
        new_h = circle_d + padding * 4 + ribbon_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # 1. Draw ribbon tails at bottom first (so badge sits on top)
        # Left ribbon tail
        ry_top = new_h - ribbon_h - 40
        lt_pts = [
            (new_w // 2 - 40, ry_top),
            (new_w // 2 - 80, new_h - padding),
            (new_w // 2 - 55, new_h - padding - 15),
            (new_w // 2 - 25, new_h - padding),
            (new_w // 2 - 10, ry_top)
        ]
        # Right ribbon tail
        rt_pts = [
            (new_w // 2 + 10, ry_top),
            (new_w // 2 + 25, new_h - padding),
            (new_w // 2 + 55, new_h - padding - 15),
            (new_w // 2 + 80, new_h - padding),
            (new_w // 2 + 40, ry_top)
        ]
        
        shadow_color = tuple(max(0, c - 40) for c in bg_color)
        draw.polygon(lt_pts, fill=shadow_color)
        draw.polygon(rt_pts, fill=shadow_color)
        
        # 2. Draw circular badge outer border
        cx = new_w // 2
        cy = padding * 2 + r
        
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_color)
        
        # 3. Create a canvas for the inner white area of the badge
        badge_canvas = Image.new("RGBA", (new_w, new_h), (255, 255, 255, 255))
        canvas_draw = ImageDraw.Draw(badge_canvas)
        
        # Paste QR onto the canvas
        qr_x = (new_w - qr_w) // 2
        qr_y = cy - r + border_thickness + padding + 10
        badge_canvas.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Draw label text inside the medallion bottom on the canvas
        if text:
            lbl_y1 = qr_y + qr_h + 15
            lbl_y2 = lbl_y1 + label_h
            lbl_w = max(tw_lbl + padding * 2, 120)
            lbl_x1 = (new_w - lbl_w) // 2
            lbl_x2 = lbl_x1 + lbl_w
            
            canvas_draw.rounded_rectangle([(lbl_x1, lbl_y1), (lbl_x2, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            canvas_draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        # Create badge mask for the inner circle
        badge_mask = Image.new("L", (new_w, new_h), 0)
        mask_draw = ImageDraw.Draw(badge_mask)
        inner_r = r - border_thickness if border_thickness > 0 else r
        mask_draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=255)
        
        # Paste canvas onto new_img using the circular mask
        new_img.paste(badge_canvas, (0, 0), badge_mask)
        
        return new_img

    elif text_template == "vintage_stamp":
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        # Draw solid background in frame color
        draw.rectangle([(card_x1, card_y1), (card_x2, card_y2)], fill=bg_color)
        
        # Scallop holes along edges (spacing every 24 pixels, radius 7)
        hole_r = 7
        # Top and bottom edges
        for x in range(card_x1 + 15, card_x2, 24):
            draw.ellipse([x - hole_r, card_y1 - hole_r, x + hole_r, card_y1 + hole_r], fill=(255, 255, 255, 0))
            draw.ellipse([x - hole_r, card_y2 - hole_r, x + hole_r, card_y2 + hole_r], fill=(255, 255, 255, 0))
        # Left and right edges
        for y in range(card_y1 + 15, card_y2, 24):
            draw.ellipse([card_x1 - hole_r, y - hole_r, card_x1 + hole_r, y + hole_r], fill=(255, 255, 255, 0))
            draw.ellipse([card_x2 - hole_r, y - hole_r, card_x2 + hole_r, y + hole_r], fill=(255, 255, 255, 0))
            
        # Draw inner stamp body in white
        bt = border_thickness if border_thickness > 0 else 6
        draw.rectangle([(card_x1 + bt, card_y1 + bt), (card_x2 - bt, card_y2 - bt)], fill=(255, 255, 255, 255))
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = card_y1 + bt + (card_y2 - card_y1 - bt * 2 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Write text at bottom
        if text:
            lbl_y1 = card_y2 - bt - label_h
            lbl_y2 = card_y2 - bt
            draw.rectangle([(card_x1 + bt, lbl_y1), (card_x2 - bt, lbl_y2)], fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "chat_bubble":
        tail_h = 24
        header_h = 45
        new_w = qr_w + padding * 4
        
        # Fit font for bubble label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + tail_h + label_h + header_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Bubble body card coordinates
        bx1 = padding
        by1 = padding
        bx2 = new_w - padding
        by2 = new_h - padding - tail_h
        
        bt = border_thickness if border_thickness > 0 else 8
        
        # 1. Draw outer solid balloon and tail
        tail_pts = [
            (bx2 - 50, by2 - 2),
            (bx2 - 20, new_h - padding),
            (bx2 - 20, by2 - 2)
        ]
        draw.rounded_rectangle([(bx1, by1), (bx2, by2)], radius=corner_radius, fill=bg_color)
        draw.polygon(tail_pts, fill=bg_color)
        
        # 2. Draw inner white body and tail to form the border outline
        inner_tail_pts = [
            (bx2 - 50 + bt, by2 - bt),
            (bx2 - 20 - bt, new_h - padding - bt),
            (bx2 - 20 - bt, by2 - bt)
        ]
        draw.rounded_rectangle([(bx1 + bt, by1 + bt), (bx2 - bt, by2 - bt)], 
                               radius=max(0, corner_radius - bt), fill=(255, 255, 255, 255))
        draw.polygon(inner_tail_pts, fill=(255, 255, 255, 255))
        
        # 3. Draw colored Chat Header at the top inside the outline
        hdr_y1 = by1 + bt
        hdr_y2 = hdr_y1 + header_h
        draw.rounded_rectangle([(bx1 + bt, hdr_y1), (bx2 - bt, hdr_y2)], radius=max(0, corner_radius - bt), fill=bg_color)
        # Cover bottom corners of header rounded rectangle to make it flat at the bottom
        draw.rectangle([(bx1 + bt, hdr_y2 - 10), (bx2 - bt, hdr_y2)], fill=bg_color)
        
        # 4. Draw Support Icon (small white bubble) in the header
        icon_cx = bx1 + bt + 25
        icon_cy = hdr_y1 + header_h // 2
        draw.ellipse([icon_cx - 10, icon_cy - 8, icon_cx + 10, icon_cy + 8], fill=(255, 255, 255, 255))
        draw.polygon([(icon_cx - 6, icon_cy + 6), (icon_cx - 10, icon_cy + 10), (icon_cx - 2, icon_cy + 8)], fill=(255, 255, 255, 255))
        
        # 5. Draw "Support Online" text in header
        f_hdr, tw_hdr, th_hdr = get_fitted_font("Support Online", 130, 18)
        tx_hdr = icon_cx + 18
        ty_hdr = hdr_y1 + (header_h - th_hdr) // 2 - th_hdr // 4
        draw.text((tx_hdr, ty_hdr), "Support Online", fill=(255, 255, 255, 255), font=f_hdr)
        
        # 6. Draw Green Status Dot in header
        dot_cx = bx2 - bt - 20
        dot_cy = hdr_y1 + header_h // 2
        draw.ellipse([dot_cx - 5, dot_cy - 5, dot_cx + 5, dot_cy + 5], fill="#2ecc71")
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = hdr_y2 + (by2 - hdr_y2 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Chat bubble label pill at bottom
        if text:
            lbl_y1 = by2 - label_h
            lbl_y2 = by2
            lbl_w = max(tw_lbl + padding * 2, 130)
            lbl_x1 = (new_w - lbl_w) // 2
            lbl_x2 = lbl_x1 + lbl_w
            
            draw.rounded_rectangle([(lbl_x1, lbl_y1 - bt//2), (lbl_x2, lbl_y2 - bt)], radius=12, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "vinyl_record":
        sleeve_w = qr_w + padding * 4
        record_ext = qr_w // 2 + 20
        new_w = sleeve_w + record_ext
        
        # Fit font for label
        max_label_w = sleeve_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # 1. Draw vinyl record peeking out on the right
        rx = sleeve_w + 10
        ry = padding + qr_h // 2 + 10
        rr = (qr_h // 2) + 20
        
        # Outer black record disc
        draw.ellipse([rx - rr, ry - rr, rx + rr, ry + rr], fill="#111111")
        # Concentric grooves (dark gray lines)
        for offset in range(12, rr - 15, 12):
            draw.ellipse([rx - rr + offset, ry - rr + offset, rx + rr - offset, ry + rr - offset], outline="#333333", width=2)
            
        # Vinyl record center sticker
        sr = rr // 3
        draw.ellipse([rx - sr, ry - sr, rx + sr, ry + sr], fill=bg_color)
        draw.ellipse([rx - 6, ry - 6, rx + 6, ry + 6], fill=(255, 255, 255, 0)) # spindle hole
        
        # 2. Draw Record Sleeve
        sx1 = padding
        sy1 = padding
        sx2 = sleeve_w - padding
        sy2 = new_h - padding
        
        if border_thickness > 0:
            draw.rounded_rectangle([(sx1, sy1), (sx2, sy2)], radius=15, fill=bg_color)
            draw.rounded_rectangle([(sx1 + border_thickness, sy1 + border_thickness), 
                                    (sx2 - border_thickness, sy2 - border_thickness)], 
                                   radius=15 - border_thickness, fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(sx1, sy1), (sx2, sy2)], radius=15, fill=(255, 255, 255, 255))
            
        # Draw sleeve cutout notch on the right edge
        draw.ellipse([sx2 - 25, (sy1 + sy2) // 2 - 40, sx2 + 25, (sy1 + sy2) // 2 + 40], fill=(255, 255, 255, 0))
        if border_thickness > 0:
            draw.arc([sx2 - 25, (sy1 + sy2) // 2 - 40, sx2 + 25, (sy1 + sy2) // 2 + 40], start=90, end=270, fill=bg_color, width=border_thickness)
            
        # Paste QR centered in the sleeve
        qr_x = sx1 + (sx2 - sx1 - qr_w) // 2
        qr_y = sy1 + (sy2 - sy1 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Sleeve text label at bottom
        if text:
            lbl_y1 = sy2 - label_h
            lbl_y2 = sy2
            draw.rounded_rectangle([(sx1 + border_thickness, lbl_y1 - border_thickness//2), 
                                    (sx2 - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=10, fill=bg_color)
            
            tx = sx1 + (sx2 - sx1 - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "security_shield":
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        # Shield geometry where the entire shield contains the QR and the text banner inside its outline
        new_h = qr_h + padding * 4 + label_h + 30
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Shield polygon coordinates (outer)
        y_top = padding + 25
        y_bottom = new_h - padding
        
        pt_tc = (new_w // 2, padding)
        pt_tr = (new_w - padding, y_top)
        pt_br = (new_w - padding, y_bottom - 45)
        pt_tip = (new_w // 2, y_bottom)
        pt_bl = (padding, y_bottom - 45)
        pt_tl = (padding, y_top)
        
        bt = border_thickness if border_thickness > 0 else 8
        
        # Draw outer shield solid in frame color
        draw.polygon([pt_tc, pt_tr, pt_br, pt_tip, pt_bl, pt_tl], fill=bg_color)
        
        # Draw inner shield solid in white
        pt_tc_in = (new_w // 2, padding + bt)
        pt_tr_in = (new_w - padding - bt, y_top + bt // 2)
        pt_br_in = (new_w - padding - bt, y_bottom - 45 - bt // 2)
        pt_tip_in = (new_w // 2, y_bottom - bt)
        pt_bl_in = (padding + bt, y_bottom - 45 - bt // 2)
        pt_tl_in = (padding + bt, y_top + bt // 2)
        
        draw.polygon([pt_tc_in, pt_tr_in, pt_br_in, pt_tip_in, pt_bl_in, pt_tl_in], fill=(255, 255, 255, 255))
        
        # Draw checkmark badge at top center
        badge_x, badge_y = new_w // 2, padding + 15
        brr = 14
        draw.ellipse([badge_x - brr, badge_y - brr, badge_x + brr, badge_y + brr], fill=bg_color)
        draw.line([(badge_x - 6, badge_y), (badge_x - 2, badge_y + 4)], fill=hex_to_rgb(text_color), width=3)
        draw.line([(badge_x - 2, badge_y + 4), (badge_x + 6, badge_y - 4)], fill=hex_to_rgb(text_color), width=3)
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = y_top + (y_bottom - y_top - label_h - qr_h) // 2
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Label V-banner at bottom inside the shield
        if text:
            # We draw the V-banner at the bottom of the white area
            lbl_y1 = y_bottom - 45 - bt // 2 - label_h
            
            lbl_pts = [
                (padding + bt, lbl_y1),
                (new_w - padding - bt, lbl_y1),
                (new_w - padding - bt, y_bottom - 45 - bt // 2),
                (new_w // 2, y_bottom - bt),
                (padding + bt, y_bottom - 45 - bt // 2)
            ]
            draw.polygon(lbl_pts, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "laptop_mockup":
        deck_h = 30
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + deck_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Laptop screen bezel
        screen_x1 = padding
        screen_y1 = padding
        screen_x2 = new_w - padding
        screen_y2 = new_h - padding - deck_h - label_h
        
        # Draw screen background bezel (dark gray MacBook style)
        draw.rounded_rectangle([(screen_x1, screen_y1), (screen_x2, screen_y2)], radius=15, fill="#1e1e1e")
        # Draw inner display content area (white)
        draw.rounded_rectangle([(screen_x1 + 10, screen_y1 + 10), (screen_x2 - 10, screen_y2 - 10)], radius=10, fill=(255, 255, 255, 255))
        
        # Draw camera dot at the top bezel
        draw.ellipse([new_w // 2 - 2, screen_y1 + 4, new_w // 2 + 2, screen_y1 + 8], fill="#333333")
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = screen_y1 + (screen_y2 - screen_y1 - qr_h) // 2 + 4
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Keyboard deck (trapezoid at the base of the screen)
        deck_y1 = screen_y2
        deck_y2 = deck_y1 + deck_h
        
        d_pts = [
            (screen_x1 - 15, deck_y2),
            (screen_x2 + 15, deck_y2),
            (screen_x2, deck_y1),
            (screen_x1, deck_y1)
        ]
        # Draw keyboard deck in anodized aluminum silver
        draw.polygon(d_pts, fill="#d2d2d2")
        # Bottom edge highlight
        draw.line([(screen_x1 - 15, deck_y2), (screen_x2 + 15, deck_y2)], fill="#b0b0b0", width=3)
        # Display notch cutout (thumb groove for opening screen)
        draw.rounded_rectangle([(new_w // 2 - 25, deck_y1), (new_w // 2 + 25, deck_y1 + 6)], radius=3, fill="#333333")
        
        # Write text label below the laptop deck
        if text:
            lbl_y1 = deck_y2 + 10
            lbl_y2 = new_h - padding
            draw.rounded_rectangle([(padding + border_thickness, lbl_y1), (new_w - padding - border_thickness, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "chef_hat":
        puff_h = 70
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + puff_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        card_x1 = padding
        card_y1 = padding + puff_h
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        cy_puff = padding + 40
        bt = border_thickness if border_thickness > 0 else 6
        
        # 1. Draw outer silhouette of chef hat puffs and base card in orange
        draw.ellipse([(padding + 25, cy_puff - 25), (padding + 105, cy_puff + 55)], fill=bg_color)
        draw.ellipse([(new_w - padding - 105, cy_puff - 25), (new_w - padding - 25, cy_puff + 55)], fill=bg_color)
        draw.ellipse([(new_w // 2 - 50, padding), (new_w // 2 + 50, padding + 90)], fill=bg_color)
        draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=corner_radius, fill=bg_color)
        
        # 2. Draw inner white areas to merge puffs and cuff
        draw.ellipse([(padding + 25 + bt, cy_puff - 25 + bt), (padding + 105 - bt, cy_puff + 55 - bt)], fill=(255, 255, 255, 255))
        draw.ellipse([(new_w - padding - 105 + bt, cy_puff - 25 + bt), (new_w - padding - 25 - bt, cy_puff + 55 - bt)], fill=(255, 255, 255, 255))
        draw.ellipse([(new_w // 2 - 50 + bt, padding + bt), (new_w // 2 + 50 - bt, padding + 90 - bt)], fill=(255, 255, 255, 255))
        draw.rounded_rectangle([(card_x1 + bt, card_y1 + bt), (card_x2 - bt, card_y2 - bt)], radius=max(0, corner_radius - bt), fill=(255, 255, 255, 255))
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = card_y1 + (card_y2 - card_y1 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        # Cuff text banner at bottom
        if text:
            lbl_y1 = card_y2 - label_h
            lbl_y2 = card_y2
            draw.rounded_rectangle([(card_x1 + bt, lbl_y1 - bt//2), (card_x2 - bt, lbl_y2 - bt)], 
                                   radius=max(0, corner_radius - bt), fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "game_console":
        controls_h = 135
        new_w = qr_w + padding * 4
        
        # Fit font for console label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + controls_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Console body card
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=20, fill=bg_color)
            draw.rounded_rectangle([(card_x1 + border_thickness, card_y1 + border_thickness), 
                                    (card_x2 - border_thickness, card_y2 - border_thickness)], 
                                   radius=20 - border_thickness, fill=(245, 245, 245, 255))
        else:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=20, fill=(245, 245, 245, 255))
            
        # Screen area (white backdrop for QR)
        scr_x1 = padding * 2
        scr_y1 = padding * 2
        scr_x2 = new_w - padding * 2
        scr_y2 = qr_h + padding * 2
        
        draw.rectangle([(scr_x1, scr_y1), (scr_x2, scr_y2)], fill=(255, 255, 255, 255))
        draw.rectangle([(scr_x1, scr_y1), (scr_x2, scr_y2)], outline="#333333", width=3)
        
        # Paste QR
        new_img.paste(qr_img, (padding * 2, padding * 2), qr_img)
        
        # Draw D-pad cross on bottom left
        dx = padding * 2 + 40
        dy = scr_y2 + 50
        cross_w = 12
        cross_l = 36
        draw.rectangle([(dx - cross_w//2, dy - cross_l//2), (dx + cross_w//2, dy + cross_l//2)], fill=bg_color)
        draw.rectangle([(dx - cross_l//2, dy - cross_w//2), (dx + cross_l//2, dy + cross_w//2)], fill=bg_color)
        
        # Draw A/B Buttons on bottom right
        bx = new_w - padding * 2 - 50
        by = scr_y2 + 50
        draw.ellipse([bx - 12, by + 5, bx + 12, by + 29], fill="#e74c3c")  # B Button
        draw.ellipse([bx + 16, by - 15, bx + 40, by + 9], fill="#e74c3c") # A Button
        
        # Draw Select/Start slanted buttons
        sx = new_w // 2
        sy = scr_y2 + 75
        draw.rounded_rectangle([(sx - 35, sy), (sx - 10, sy + 8)], radius=3, fill="#888888")
        draw.rounded_rectangle([(sx + 10, sy), (sx + 35, sy + 8)], radius=3, fill="#888888")
        
        # Console text label banner at bottom
        if text:
            lbl_y1 = card_y2 - label_h
            lbl_y2 = card_y2
            draw.rounded_rectangle([(card_x1 + border_thickness, lbl_y1 - border_thickness//2), 
                                    (card_x2 - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "map_pin":
        pointer_h = 75
        
        # Fit font for pin label
        max_label_w = qr_w - 20
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        circle_d = qr_h + label_h + padding * 2 + 30
        r = circle_d // 2
        
        new_w = circle_d + padding * 4
        new_h = circle_d + padding * 4 + pointer_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        cx = new_w // 2
        cy = padding * 2 + r
        
        # 1. Draw pointer tip solid in frame color
        tip_x, tip_y = cx, new_h - padding
        sh_y = cy + int(r * 0.7)
        sh_offset = int(r * 0.7)
        draw.polygon([(cx - sh_offset, sh_y), (tip_x, tip_y), (cx + sh_offset, sh_y)], fill=bg_color)
        
        # 2. Draw outer circle solid in frame color
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_color)
        
        # 3. Draw inner white circle
        bt = border_thickness if border_thickness > 0 else 8
        inner_r = r - bt
        draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(255, 255, 255, 255))
        
        # Draw inner pointer tip in white to merge inside
        draw.polygon([(cx - sh_offset + bt, sh_y - bt), (tip_x, tip_y - bt * 2), (cx + sh_offset - bt, sh_y - bt)], fill=(255, 255, 255, 255))
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = cy - r + bt + padding + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Draw label banner at the bottom of the inner white area
        if text:
            lbl_y1 = cy + inner_r - label_h - 15
            lbl_y2 = cy + inner_r - 15
            lbl_w = max(tw_lbl + padding * 2, 130)
            lbl_x1 = (new_w - lbl_w) // 2
            lbl_x2 = lbl_x1 + lbl_w
            
            draw.rounded_rectangle([(lbl_x1, lbl_y1), (lbl_x2, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "rsvp_envelope":
        envelope_h = 100
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + envelope_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # 1. Draw card sliding out from the top of the envelope
        card_x1 = padding * 2
        card_y1 = padding
        card_x2 = new_w - padding * 2
        card_y2 = padding + qr_h + 40
        
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=10, fill=bg_color)
            draw.rounded_rectangle([(card_x1 + border_thickness, card_y1 + border_thickness), 
                                    (card_x2 - border_thickness, card_y2 - border_thickness)], 
                                   radius=max(0, 10 - border_thickness), fill=(255, 255, 255, 255))
        else:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=10, fill=(255, 255, 255, 255))
            
        # Paste QR centered in the peeking card
        new_img.paste(qr_img, (padding * 2, padding + 20), qr_img)
        
        # 2. Draw Envelope Pocket at the bottom (overlapping card bottom)
        env_x1 = padding
        env_y1 = card_y2 - 20
        env_x2 = new_w - padding
        env_y2 = new_h - padding
        
        draw.rectangle([(env_x1, env_y1), (env_x2, env_y2)], fill=bg_color)
        
        # Draw triangular flap opening lines on pocket
        draw.polygon([(env_x1, env_y1), (new_w // 2, env_y1 + 45), (env_x1, env_y2)], outline="#ffffff", width=2)
        draw.polygon([(env_x2, env_y1), (new_w // 2, env_y1 + 45), (env_x2, env_y2)], outline="#ffffff", width=2)
        
        # Draw wax seal in center of pocket
        wax_x, wax_y = new_w // 2, env_y1 + 40
        draw.ellipse([wax_x - 18, wax_y - 18, wax_x + 18, wax_y + 18], fill="#d35400")
        # Draw small inner seal swirl
        draw.arc([wax_x - 10, wax_y - 10, wax_x + 10, wax_y + 10], start=0, end=270, fill="#ffffff", width=2)
        
        # Envelope text banner at bottom
        if text:
            lbl_y1 = env_y2 - label_h
            lbl_y2 = env_y2
            draw.rounded_rectangle([(env_x1 + border_thickness, lbl_y1 - border_thickness//2), 
                                    (env_x2 - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "diploma_scroll":
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        # Draw parchment base scroll card
        parchment_color = (255, 253, 240, 255)  # Soft cream
        if border_thickness > 0:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=15, fill=bg_color)
            draw.rounded_rectangle([(card_x1 + border_thickness, card_y1 + border_thickness), 
                                    (card_x2 - border_thickness, card_y2 - border_thickness)], 
                                   radius=15 - border_thickness, fill=parchment_color)
        else:
            draw.rounded_rectangle([(card_x1, card_y1), (card_x2, card_y2)], radius=15, fill=parchment_color)
            
        # Draw curly roll lines at sides
        draw.arc([card_x1 - 10, card_y1 + 10, card_x1 + 10, card_y2 - 10], start=90, end=270, fill=bg_color, width=2)
        draw.arc([card_x2 - 10, card_y1 + 10, card_x2 + 10, card_y2 - 10], start=270, end=90, fill=bg_color, width=2)
        
        # Draw Graduation Cap tilted at top-left
        cap_cx, cap_cy = card_x1 + 35, card_y1 + 25
        # Cap diamond top
        draw.polygon([
            (cap_cx, cap_cy - 12),
            (cap_cx + 25, cap_cy),
            (cap_cx, cap_cy + 12),
            (cap_cx - 25, cap_cy)
        ], fill=bg_color)
        # Cap base
        draw.polygon([
            (cap_cx - 12, cap_cy + 6),
            (cap_cx + 12, cap_cy + 6),
            (cap_cx + 8, cap_cy + 15),
            (cap_cx - 8, cap_cy + 15)
        ], fill=bg_color)
        # Tassel
        draw.line([(cap_cx + 10, cap_cy + 4), (cap_cx + 20, cap_cy + 16)], fill="#d35400", width=2)
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = card_y1 + (card_y2 - card_y1 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Scroll text banner at bottom (ribbon styled)
        if text:
            lbl_y1 = card_y2 - label_h
            lbl_y2 = card_y2
            draw.rounded_rectangle([(card_x1 + border_thickness, lbl_y1 - border_thickness//2), 
                                    (card_x2 - border_thickness, lbl_y2 - border_thickness)], 
                                   radius=8, fill=bg_color)
            
            # Gold outline for ribbon text
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "pizza_slice":
        crust_h = 45
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + crust_h + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Pizza triangular slice points
        y_top = padding + crust_h
        y_bottom = new_h - padding - label_h
        
        pt_tl = (padding, y_top)
        pt_tr = (new_w - padding, y_top)
        pt_tip = (new_w // 2, y_bottom)
        
        # 1. Draw yellow cheese base polygon
        cheese_color = (255, 245, 230, 255)  # Warm yellow-white
        draw.polygon([pt_tl, pt_tr, pt_tip], fill=cheese_color)
        
        # 2. Paste QR code centered on the cheese area
        qr_x = (new_w - qr_w) // 2
        qr_y = y_top + (y_bottom - y_top - qr_h) // 2
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # 3. Draw pepperoni toppings over cheese/QR
        draw.ellipse([new_w // 2 - 25, y_top + 45, new_w // 2 - 5, y_top + 65], fill="#e74c3c")
        draw.ellipse([new_w // 2 + 10, y_top + 65, new_w // 2 + 30, y_top + 85], fill="#e74c3c")
        draw.ellipse([new_w // 2 - 15, y_top + 105, new_w // 2 + 5, y_top + 125], fill="#e74c3c")
        
        # 4. Draw outer orange outline lines OVER the QR code corners
        bt = border_thickness if border_thickness > 0 else 8
        draw.line([pt_tl, pt_tr], fill=bg_color, width=bt + 4)  # Thicker top crust
        draw.line([pt_tr, pt_tip], fill=bg_color, width=bt)     # Right edge
        draw.line([pt_tip, pt_tl], fill=bg_color, width=bt)     # Left edge
        
        # 5. Top crust label banner
        if text:
            # We place the label at the bottom of the slice
            lbl_y1 = y_bottom + 15
            lbl_y2 = lbl_y1 + label_h
            
            draw.rounded_rectangle([(padding + border_thickness, lbl_y1), (new_w - padding - border_thickness, lbl_y2)], radius=10, fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "thought_cloud":
        new_w = qr_w + padding * 4
        
        # Fit font for label
        max_label_w = new_w - padding * 4
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, max_label_w - 20, text_size)
        label_h = th_lbl + padding * 2 if text else padding * 2
        
        new_h = qr_h + padding * 4 + label_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        card_x1 = padding
        card_y1 = padding
        card_x2 = new_w - padding
        card_y2 = new_h - padding
        
        bt = border_thickness if border_thickness > 0 else 6
        
        # Draw three trailing cloud circles at bottom left
        c1_cx, c1_cy = padding + 40, card_y2 - 25
        c2_cx, c2_cy = padding + 20, card_y2 - 5
        c3_cx, c3_cy = padding + 5, card_y2 + 8
        
        draw.ellipse([c1_cx - 15, c1_cy - 15, c1_cx + 15, c1_cy + 15], fill=bg_color)
        draw.ellipse([c2_cx - 10, c2_cy - 10, c2_cx + 10, c2_cy + 10], fill=bg_color)
        draw.ellipse([c3_cx - 6, c3_cy - 6, c3_cx + 6, c3_cy + 6], fill=bg_color)
        
        bt1 = min(bt, 12)
        bt2 = min(bt, 8)
        bt3 = min(bt, 4)
        
        draw.ellipse([c1_cx - 15 + bt1, c1_cy - 15 + bt1, c1_cx + 15 - bt1, c1_cy + 15 - bt1], fill=(255, 255, 255, 255))
        draw.ellipse([c2_cx - 10 + bt2, c2_cy - 10 + bt2, c2_cx + 10 - bt2, c2_cy + 10 - bt2], fill=(255, 255, 255, 255))
        draw.ellipse([c3_cx - 6 + bt3, c3_cy - 6 + bt3, c3_cx + 6 - bt3, c3_cy + 6 - bt3], fill=(255, 255, 255, 255))
        
        # Draw main puffy cloud silhouette (overlapping circles)
        # We draw the solid frame color silhouette first
        card_x1 = padding * 2
        card_y1 = padding + 40
        card_x2 = new_w - padding * 2
        card_y2 = new_h - padding
        
        # Left puff (orange silhouette)
        draw.ellipse([(card_x1 - 50, card_y1), (card_x1 + 50, card_y1 + 100)], fill=bg_color)
        # Right puff (orange silhouette)
        draw.ellipse([(card_x2 - 50, card_y1), (card_x2 + 50, card_y1 + 100)], fill=bg_color)
        # Top tall puff (orange silhouette)
        draw.ellipse([(new_w // 2 - 65, card_y1 - 35), (new_w // 2 + 65, card_y1 + 95)], fill=bg_color)
        # Base cloud card (orange silhouette)
        draw.rounded_rectangle([(card_x1, card_y1 + 25), (card_x2, card_y2)], radius=15, fill=bg_color)
        
        # Draw inner white areas to merge puffs
        # Left puff (white inner)
        draw.ellipse([(card_x1 - 50 + bt, card_y1 + bt), (card_x1 + 50 - bt, card_y1 + 100 - bt)], fill=(255, 255, 255, 255))
        # Right puff (white inner)
        draw.ellipse([(card_x2 - 50 + bt, card_y1 + bt), (card_x2 + 50 - bt, card_y1 + 100 - bt)], fill=(255, 255, 255, 255))
        # Top tall puff (white inner)
        draw.ellipse([(new_w // 2 - 65 + bt, card_y1 - 35 + bt), (new_w // 2 + 65 - bt, card_y1 + 95 - bt)], fill=(255, 255, 255, 255))
        # Base cloud card (white inner)
        draw.rounded_rectangle([(card_x1 + bt, card_y1 + 25 + bt), (card_x2 - bt, card_y2 - bt)], radius=max(0, 15 - bt), fill=(255, 255, 255, 255))
        
        # Paste QR
        qr_x = (new_w - qr_w) // 2
        qr_y = card_y1 + 25 + (card_y2 - card_y1 - 25 - label_h - qr_h) // 2 + 10
        new_img.paste(qr_img, (qr_x, qr_y), qr_img)
        
        # Cloud label banner at bottom
        if text:
            lbl_y1 = card_y2 - label_h
            lbl_y2 = card_y2
            draw.rounded_rectangle([(card_x1 + bt, lbl_y1 - bt//2), (card_x2 - bt, lbl_y2 - bt)], 
                                   radius=max(0, 15 - bt), fill=bg_color)
            
            tx = (new_w - tw_lbl) // 2
            ty = lbl_y1 + (label_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img
        
    return qr_img

def apply_frame(qr_img, layout_template="none", text_template="none", frame_color="#000000", text="SCAN ME", text_color="#ffffff", text_size=40, padding=20, corner_radius=15, border_thickness=10, top_text="SCAN ME", frame_template=None, font_name="Outfit-Bold.ttf"):
    # Backward compatibility checks:
    # 1. If keyword argument 'frame_template' is passed:
    if frame_template is not None:
        if frame_template in {"circle_sprinkles", "circle_sunburst", "double_border"}:
            layout_template = frame_template
            text_template = "none"
        else:
            layout_template = "none"
            text_template = frame_template
            
    # 2. If positional arguments shifted (e.g. text_template holds a color string starting with '#' and layout_template is an old template name)
    text_templates = {"none", "top_text", "bottom_text", "top_bottom_text", "speech_bubble", "bottom_tab"}
    if text_template not in text_templates and layout_template in {"top_text", "bottom_text", "top_bottom_text", "speech_bubble", "bottom_tab", "circle_sprinkles", "circle_sunburst", "double_border"}:
        # Positional arguments shifted
        old_frame_template = layout_template
        old_frame_color = text_template
        old_text = frame_color
        old_text_color = text
        old_text_size = text_color
        old_padding = text_size
        old_corner_radius = padding
        old_border_thickness = corner_radius
        old_top_text = border_thickness if isinstance(border_thickness, str) else "SCAN ME"
        
        if old_frame_template in {"circle_sprinkles", "circle_sunburst", "double_border"}:
            layout_template = old_frame_template
            text_template = "none"
        else:
            layout_template = "none"
            text_template = old_frame_template
            
        frame_color = old_frame_color
        text = old_text
        text_color = old_text_color
        text_size = old_text_size
        padding = old_padding
        corner_radius = old_corner_radius
        border_thickness = old_border_thickness
        top_text = old_top_text

    # Apply layout frame first
    framed_img = apply_layout_frame(
        qr_img, 
        layout_template=layout_template, 
        frame_color=frame_color, 
        padding=padding, 
        corner_radius=corner_radius, 
        border_thickness=border_thickness
    )
    
    # Then apply text frame
    final_img = apply_text_frame(
        framed_img, 
        text_template=text_template, 
        frame_color=frame_color, 
        text=text, 
        text_color=text_color, 
        text_size=text_size, 
        padding=padding, 
        corner_radius=corner_radius, 
        border_thickness=border_thickness, 
        top_text=top_text,
        font_name=font_name
    )
    
    return final_img
