    elif text_template == "menu_board":
        # A-frame sidewalk menu board
        board_h = qr_h + padding * 2
        board_w = qr_w + padding * 2
        leg_w = padding
        leg_h = padding * 2
        
        # Fit font for top wooden plank
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, board_w - padding, text_size) if text else (None, 0, 0)
        plank_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        new_w = board_w + leg_w * 2
        new_h = board_h + plank_h + leg_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Wooden legs
        draw.polygon([(leg_w, 0), (leg_w * 2, 0), (leg_w, new_h), (0, new_h)], fill=bg_color)
        draw.polygon([(new_w - leg_w * 2, 0), (new_w - leg_w, 0), (new_w, new_h), (new_w - leg_w, new_h)], fill=bg_color)
        
        # Chalkboard base
        board_y1 = plank_h
        board_y2 = board_y1 + board_h
        board_x1 = leg_w
        board_x2 = new_w - leg_w
        draw.rectangle([(board_x1, board_y1), (board_x2, board_y2)], fill=(40, 40, 40, 255))
        
        # Wooden plank header
        draw.rectangle([(0, 0), (new_w, plank_h)], fill=bg_color)
        
        # Paste QR on chalkboard
        new_img.paste(qr_img, (board_x1 + padding, board_y1 + padding), qr_img)
        
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = (plank_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "wine_glass":
        # Wine glass silhouette
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding if th_lbl > 0 else padding
        
        bowl_w = qr_w + padding * 4
        bowl_h = qr_h + padding * 2 + lbl_h
        stem_w = padding
        stem_h = padding * 4
        base_w = bowl_w // 2
        
        new_w = bowl_w
        new_h = bowl_h + stem_h + padding
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Wine inside the bowl (semi-transparent)
        wine_h = int(bowl_h * 0.6)
        draw.chord([(0, 0), (bowl_w, bowl_h * 2)], 180, 360, fill=bg_color)
        
        # Stem
        draw.rectangle([(new_w // 2 - stem_w // 2, bowl_h - padding), (new_w // 2 + stem_w // 2, bowl_h + stem_h)], fill=bg_color)
        
        # Base
        draw.polygon([(new_w // 2 - base_w // 2, bowl_h + stem_h + padding), 
                      (new_w // 2 + base_w // 2, bowl_h + stem_h + padding), 
                      (new_w // 2 + stem_w // 2, bowl_h + stem_h), 
                      (new_w // 2 - stem_w // 2, bowl_h + stem_h)], fill=bg_color)
        
        # White background for QR code
        draw.rounded_rectangle([(padding, padding + lbl_h), (new_w - padding, bowl_h - padding)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        # Paste QR
        new_img.paste(qr_img, (padding * 2, padding + lbl_h + padding // 2), qr_img)
        
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = padding
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "burger_shape":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding if th_lbl > 0 else padding
        
        bun_top_h = lbl_h + padding * 2
        bun_bottom_h = padding * 3
        patty_h = padding
        lettuce_h = padding // 2
        
        new_w = qr_w + padding * 4
        qr_area_h = qr_h + padding * 2
        new_h = bun_top_h + lettuce_h + patty_h + qr_area_h + bun_bottom_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Top Bun (semi ellipse)
        draw.chord([(0, 0), (new_w, bun_top_h * 2)], 180, 360, fill=bg_color)
        
        # Lettuce (zig zag)
        ly = bun_top_h
        draw.rectangle([(padding // 2, ly), (new_w - padding // 2, ly + lettuce_h)], fill=(max(0, hex_to_rgb(bg_color)[0]-40), min(255, hex_to_rgb(bg_color)[1]+40), max(0, hex_to_rgb(bg_color)[2]-40), 255))
        
        # Patty
        py = ly + lettuce_h
        draw.rounded_rectangle([(padding, py), (new_w - padding, py + patty_h)], radius=patty_h//2, fill=(max(0, hex_to_rgb(bg_color)[0]-80), max(0, hex_to_rgb(bg_color)[1]-80), max(0, hex_to_rgb(bg_color)[2]-80), 255))
        
        # White QR Area
        qy = py + patty_h
        draw.rectangle([(padding * 2, qy), (new_w - padding * 2, qy + qr_area_h)], fill=(255, 255, 255, 255))
        new_img.paste(qr_img, (padding * 2, qy + padding), qr_img)
        
        # Bottom Bun
        by = qy + qr_area_h
        draw.rounded_rectangle([(padding, by), (new_w - padding, by + bun_bottom_h)], radius=corner_radius, fill=bg_color)
        
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = bun_top_h - lbl_h - padding // 2
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "plate_fork_knife":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w * 1.5, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        plate_d = max(qr_w + padding * 4, qr_h + padding * 4)
        utensil_w = padding * 2
        
        new_w = plate_d + utensil_w * 2 + padding * 2
        new_h = plate_d + lbl_h + padding
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Banner at top
        banner_y1 = 0
        banner_y2 = lbl_h
        draw.rounded_rectangle([(new_w // 2 - tw_lbl // 2 - padding, banner_y1), (new_w // 2 + tw_lbl // 2 + padding, banner_y2)], radius=corner_radius, fill=bg_color)
        
        # Plate
        px1 = utensil_w + padding
        py1 = lbl_h + padding
        px2 = px1 + plate_d
        py2 = py1 + plate_d
        draw.ellipse([(px1, py1), (px2, py2)], fill=bg_color)
        draw.ellipse([(px1 + padding, py1 + padding), (px2 - padding, py2 - padding)], fill=(255,255,255,255))
        
        # Paste QR
        new_img.paste(qr_img, (px1 + (plate_d - qr_w) // 2, py1 + (plate_d - qr_h) // 2), qr_img)
        
        # Fork (left)
        fx = padding // 2
        fy1 = py1 + padding
        fy2 = py2 - padding
        draw.rectangle([(fx + utensil_w // 2 - 2, fy1 + utensil_w), (fx + utensil_w // 2 + 2, fy2)], fill=bg_color) # handle
        draw.rectangle([(fx, fy1), (fx + utensil_w, fy1 + utensil_w)], fill=bg_color) # head
        
        # Knife (right)
        kx = px2 + padding // 2
        ky1 = py1 + padding
        ky2 = py2 - padding
        draw.rectangle([(kx + utensil_w // 2 - 2, ky1 + utensil_w), (kx + utensil_w // 2 + 2, ky2)], fill=bg_color) # handle
        draw.polygon([(kx + utensil_w // 2, ky1), (kx + utensil_w, ky1 + utensil_w), (kx + utensil_w // 2, ky1 + utensil_w)], fill=bg_color) # blade
        
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = (lbl_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "coffee_bean":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        new_w = int((qr_w + padding * 4) * 1.2)
        new_h = int((qr_h + lbl_h + padding * 6) * 1.2)
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Large Bean Oval
        draw.ellipse([(0, 0), (new_w, new_h)], fill=bg_color)
        
        # Crease
        draw.polygon([(new_w // 2 - padding, 0), (new_w // 2 + padding, 0), (new_w // 2 - padding, new_h), (new_w // 2 + padding, new_h)], fill=(255, 255, 255, 100))
        
        # White QR base
        qx1 = (new_w - qr_w) // 2 - padding
        qy1 = (new_h - qr_h - lbl_h) // 2 - padding
        qx2 = qx1 + qr_w + padding * 2
        qy2 = qy1 + qr_h + padding * 2
        draw.rounded_rectangle([(qx1, qy1), (qx2, qy2)], radius=corner_radius, fill=(255, 255, 255, 255))
        
        # Paste QR
        new_img.paste(qr_img, (qx1 + padding, qy1 + padding), qr_img)
        
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = qy2 + padding
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "sushi_roll":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        new_w = qr_w + padding * 6
        new_h = qr_h + padding * 6 + lbl_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Nori Border (Dark seaweed)
        nori_r = max(corner_radius, 40)
        draw.rounded_rectangle([(0, 0), (new_w, new_h - lbl_h)], radius=nori_r, fill=(20, 30, 20, 255))
        
        # Rice (White area)
        draw.rounded_rectangle([(padding, padding), (new_w - padding, new_h - lbl_h - padding)], radius=nori_r - padding, fill=(255, 255, 255, 255))
        
        # Filling Accents (Salmon/Avocado squares around QR)
        accent_s = padding * 1.5
        draw.rounded_rectangle([(padding * 2, padding * 2), (padding * 2 + accent_s, padding * 2 + accent_s)], radius=4, fill=(255, 127, 80, 255)) # Salmon
        draw.rounded_rectangle([(new_w - padding * 2 - accent_s, padding * 2), (new_w - padding * 2, padding * 2 + accent_s)], radius=4, fill=(173, 255, 47, 255)) # Avocado
        
        # Paste QR centered in rice
        qx = (new_w - qr_w) // 2
        qy = (new_h - lbl_h - qr_h) // 2
        new_img.paste(qr_img, (qx, qy), qr_img)
        
        # Soy Sauce / Tag below
        tag_y1 = new_h - lbl_h - padding
        tag_y2 = new_h
        tag_x1 = (new_w - tw_lbl - padding * 2) // 2
        tag_x2 = tag_x1 + tw_lbl + padding * 2
        draw.rounded_rectangle([(tag_x1, tag_y1), (tag_x2, tag_y2)], radius=8, fill=bg_color)
        
        if text:
            tx = (new_w - tw_lbl) // 2
            ty = tag_y1 + (lbl_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "beer_mug":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        mug_w = qr_w + padding * 4
        mug_h = qr_h + padding * 4 + lbl_h
        handle_w = padding * 3
        
        new_w = mug_w + handle_w
        new_h = mug_h + padding * 2 # For foam
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Handle
        hx1 = mug_w - padding
        hy1 = padding * 4
        hx2 = hx1 + handle_w * 2
        hy2 = mug_h - padding * 4
        draw.ellipse([(hx1, hy1), (hx2, hy2)], outline=bg_color, width=padding)
        
        # Mug Body
        draw.rounded_rectangle([(0, padding * 2), (mug_w, new_h)], radius=corner_radius, fill=(255, 255, 255, 255), outline=bg_color, width=border_thickness or 8)
        
        # Foam (circles on top)
        for i in range(5):
            fx = i * (mug_w // 5) - padding
            fy = 0
            fs = padding * 3
            draw.ellipse([(fx, fy), (fx + fs, fy + fs)], fill=(255, 255, 255, 255), outline=bg_color, width=4)
            
        # Paste QR
        new_img.paste(qr_img, ((mug_w - qr_w) // 2, padding * 4), qr_img)
        
        # Mug Label (Text)
        if text:
            lbl_y1 = padding * 4 + qr_h + padding
            lbl_y2 = lbl_y1 + lbl_h
            draw.rectangle([(padding, lbl_y1), (mug_w - padding, lbl_y2)], fill=bg_color)
            tx = (mug_w - tw_lbl) // 2
            ty = lbl_y1 + (lbl_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "ice_cream_cone":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        scoop_d = max(qr_w, qr_h) + padding * 4
        cone_h = qr_h * 1.5
        
        new_w = scoop_d
        new_h = scoop_d + int(cone_h)
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Cone (Triangle)
        cx1 = padding
        cy1 = scoop_d - padding * 2
        cx2 = new_w - padding
        cy2 = cy1
        cx3 = new_w // 2
        cy3 = new_h
        draw.polygon([(cx1, cy1), (cx2, cy2), (cx3, cy3)], fill=(210, 180, 140, 255)) # Tan cone color
        
        # Scoop (Circle)
        draw.ellipse([(0, 0), (scoop_d, scoop_d)], fill=bg_color)
        draw.ellipse([(padding, padding), (scoop_d - padding, scoop_d - padding)], fill=(255, 255, 255, 255))
        
        # Paste QR
        new_img.paste(qr_img, ((new_w - qr_w) // 2, (scoop_d - qr_h) // 2), qr_img)
        
        # Text on banner across the intersection
        if text:
            ban_y1 = scoop_d - lbl_h // 2
            ban_y2 = ban_y1 + lbl_h
            draw.rounded_rectangle([(0, ban_y1), (new_w, ban_y2)], radius=8, fill=bg_color)
            tx = (new_w - tw_lbl) // 2
            ty = ban_y1 + (lbl_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "tea_pot":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        pot_w = qr_w + padding * 4
        pot_h = qr_h + padding * 2 + lbl_h
        spout_w = padding * 3
        handle_w = padding * 3
        
        new_w = pot_w + spout_w + handle_w
        new_h = pot_h + padding * 2
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Handle (left)
        draw.ellipse([(0, pot_h // 3), (handle_w * 2, pot_h)], outline=bg_color, width=padding)
        
        # Spout (right)
        draw.polygon([(handle_w + pot_w - padding, pot_h // 2), 
                      (new_w, pot_h // 3), 
                      (new_w - padding, pot_h // 3 + padding), 
                      (handle_w + pot_w - padding, pot_h // 2 + padding * 2)], fill=bg_color)
        
        # Pot Body
        draw.ellipse([(handle_w, padding * 2), (handle_w + pot_w, pot_h + padding * 2)], fill=bg_color)
        draw.ellipse([(handle_w + padding, padding * 3), (handle_w + pot_w - padding, pot_h + padding * 2 - padding)], fill=(255, 255, 255, 255))
        
        # Lid
        draw.chord([(handle_w + pot_w // 4, 0), (handle_w + pot_w - pot_w // 4, padding * 4)], 180, 360, fill=bg_color)
        
        # Paste QR
        new_img.paste(qr_img, (handle_w + padding * 2, padding * 3 + padding), qr_img)
        
        if text:
            tx = handle_w + (pot_w - tw_lbl) // 2
            ty = padding * 3 + qr_h + padding * 2
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img

    elif text_template == "hot_soup_bowl":
        f_lbl, tw_lbl, th_lbl = get_fitted_font(text, qr_w, text_size) if text else (None, 0, 0)
        lbl_h = th_lbl + padding * 2 if th_lbl > 0 else padding * 2
        
        bowl_w = qr_w + padding * 6
        bowl_h = qr_h + padding * 4
        steam_h = padding * 3
        
        new_w = bowl_w
        new_h = bowl_h + steam_h + lbl_h
        
        new_img = Image.new("RGBA", (new_w, new_h), color=(255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Steam lines
        for i in range(3):
            sx = new_w // 2 + (i - 1) * padding * 2
            draw.line([(sx, 0), (sx + padding, steam_h // 2), (sx, steam_h)], fill=(200, 200, 200, 200), width=padding//2)
            
        # Bowl (Chord)
        draw.chord([(0, steam_h - bowl_h + padding * 2), (bowl_w, steam_h + bowl_h)], 0, 180, fill=bg_color)
        draw.chord([(padding, steam_h - bowl_h + padding * 3), (bowl_w - padding, steam_h + bowl_h - padding)], 0, 180, fill=(255, 255, 255, 255))
        
        # Paste QR
        new_img.paste(qr_img, ((new_w - qr_w) // 2, steam_h + padding * 2), qr_img)
        
        if text:
            # Banner below bowl
            by1 = steam_h + bowl_h // 2 + padding
            by2 = by1 + lbl_h
            draw.rounded_rectangle([(padding * 2, by1), (new_w - padding * 2, by2)], radius=10, fill=bg_color)
            tx = (new_w - tw_lbl) // 2
            ty = by1 + (lbl_h - th_lbl) // 2 - th_lbl // 4
            draw.text((tx, ty), text, fill=hex_to_rgb(text_color), font=f_lbl)
            
        return new_img
