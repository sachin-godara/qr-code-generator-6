import os
import sys
import math
from PIL import Image, ImageDraw

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from qr_engine import make_sharp_corner, make_eyeball_sharp_corner

def draw_outer_frame(draw, px, py, s, eye_frame_style, eye_rgb, bg):
    r = int(s * 1.5)
    r2 = int(r / 2)
    s2 = s // 2

    if eye_frame_style == "rounded":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
    elif eye_frame_style == "octagon":
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        d = 2 * s
        p_out = [
            (x1 + d, y1), (x2 - d, y1),
            (x2, y1 + d), (x2, y2 - d),
            (x2 - d, y2), (x1 + d, y2),
            (x1, y2 - d), (x1, y1 + d)
        ]
        draw.polygon(p_out, fill=eye_rgb + (255,))
        ix1, iy1, ix2, iy2 = px + s, py + s, px + 6*s - 1, py + 6*s - 1
        d_in = s
        p_in = [
            (ix1 + d_in, iy1), (ix2 - d_in, iy1),
            (ix2, iy1 + d_in), (ix2, iy2 - d_in),
            (ix2 - d_in, iy2), (ix1 + d_in, iy2),
            (ix1, iy2 - d_in), (ix1, iy1 + d_in)
        ]
        draw.polygon(p_in, fill=bg + (255,))
    elif eye_frame_style == "corner_brackets":
        draw.rectangle([px, py, px + 2*s - 1, py + s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px, py, px + s - 1, py + 2*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px + 5*s, py, px + 7*s - 1, py + s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px + 6*s, py, px + 7*s - 1, py + 2*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px, py + 6*s, px + 2*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px, py + 5*s, px + s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px + 5*s, py + 6*s, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px + 6*s, py + 5*s, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
    elif eye_frame_style in ["double_ring", "minimal_circle_double"]:
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=max(1, s2))
        draw.ellipse([px + s + s2, py + s + s2, px + 6*s - s2 - 1, py + 6*s - s2 - 1], outline=eye_rgb + (255,), width=max(1, s2))
    elif eye_frame_style == "dotted_circle":
        cx = px + 3.5 * s
        cy = py + 3.5 * s
        r_dotted = 3.0 * s
        for i in range(12):
            angle = i * (2 * math.pi / 12)
            dx = cx + r_dotted * math.cos(angle)
            dy = cy + r_dotted * math.sin(angle)
            dot_r = max(2, s // 2)
            draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r], fill=eye_rgb + (255,))
    elif eye_frame_style in ["hexagon", "neon_cyber_hex"]:
        cx = px + 3.5 * s
        cy = py + 3.5 * s
        r_hex = 3.5 * s
        p_out = []
        for i in range(6):
            angle = i * math.pi / 3 - math.pi / 2
            p_out.append((cx + r_hex * math.cos(angle), cy + r_hex * math.sin(angle)))
        draw.polygon(p_out, fill=eye_rgb + (255,))
        p_in = []
        r_hex_in = 2.5 * s
        for i in range(6):
            angle = i * math.pi / 3 - math.pi / 2
            p_in.append((cx + r_hex_in * math.cos(angle), cy + r_hex_in * math.sin(angle)))
        draw.polygon(p_in, fill=bg + (255,))
    elif eye_frame_style in ["diamond", "diamond_cut"]:
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        cx, cy = px + 3.5*s, py + 3.5*s
        draw.polygon([(cx, y1), (x2, cy), (cx, y2), (x1, cy)], fill=eye_rgb + (255,))
        draw.polygon([(cx, y1 + s), (x2 - s, cy), (cx, y2 - s), (x1 + s, cy)], fill=bg + (255,))
    elif eye_frame_style == "star":
        cx = px + 3.5 * s
        cy = py + 3.5 * s
        R_val = 3.5 * s
        r_val = 1.8 * s
        p_out = []
        for i in range(8):
            angle = i * math.pi / 4 - math.pi / 2
            curr_r = R_val if i % 2 == 0 else r_val
            p_out.append((cx + curr_r * math.cos(angle), cy + curr_r * math.sin(angle)))
        draw.polygon(p_out, fill=eye_rgb + (255,))
        R_in = 2.5 * s
        r_in = 1.2 * s
        p_in = []
        for i in range(8):
            angle = i * math.pi / 4 - math.pi / 2
            curr_r = R_in if i % 2 == 0 else r_in
            p_in.append((cx + curr_r * math.cos(angle), cy + curr_r * math.sin(angle)))
        draw.polygon(p_in, fill=bg + (255,))
    elif eye_frame_style == "gear":
        cx = px + 3.5 * s
        cy = py + 3.5 * s
        draw.ellipse([cx - 3*s, cy - 3*s, cx + 3*s, cy + 3*s], fill=eye_rgb + (255,))
        for i in range(8):
            angle = i * math.pi / 4
            gx = cx + 3.2 * s * math.cos(angle)
            gy = cy + 3.2 * s * math.sin(angle)
            draw.rectangle([gx - s2, gy - s2, gx + s2, gy + s2], fill=eye_rgb + (255,))
        draw.ellipse([cx - 2*s, cy - 2*s, cx + 2*s, cy + 2*s], fill=bg + (255,))
    elif eye_frame_style == "circle":
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
    elif eye_frame_style in ["leaf", "flower_petal"]:
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "leaf_opposite":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
    elif eye_frame_style in ["droplet", "droplet_br"]:
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "droplet_tl":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
    elif eye_frame_style == "droplet_tr":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "droplet_bl":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
    elif eye_frame_style in ["shield", "gothic_shield"]:
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "shield_opposite":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "left_rounded":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "right_rounded":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
    elif eye_frame_style == "solid_square_circle_cut":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
    elif eye_frame_style == "sheared":
        offset = s
        p1 = (px + offset, py)
        p2 = (px + 7*s - 1, py)
        p3 = (px + 7*s - 1 - offset, py + 7*s - 1)
        p4 = (px, py + 7*s - 1)
        draw.line([p1, p2], fill=eye_rgb + (255,), width=s)
        draw.line([p2, p3], fill=eye_rgb + (255,), width=s)
        draw.line([p3, p4], fill=eye_rgb + (255,), width=s)
        draw.line([p4, p1], fill=eye_rgb + (255,), width=s)
        draw.ellipse([p1[0]-s//2, p1[1]-s//2, p1[0]+s//2, p1[1]+s//2], fill=eye_rgb + (255,))
        draw.ellipse([p2[0]-s//2, p2[1]-s//2, p2[0]+s//2, p2[1]+s//2], fill=eye_rgb + (255,))
        draw.ellipse([p3[0]-s//2, p3[1]-s//2, p3[0]+s//2, p3[1]+s//2], fill=eye_rgb + (255,))
        draw.ellipse([p4[0]-s//2, p4[1]-s//2, p4[0]+s//2, p4[1]+s//2], fill=eye_rgb + (255,))
    elif eye_frame_style == "crystal_frame":
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        bv = s
        p_out = [(x1+bv, y1), (x2-bv, y1), (x2, y1+bv), (x2, y2-bv), (x2-bv, y2), (x1+bv, y2), (x1, y2-bv), (x1, y1+bv)]
        draw.polygon(p_out, fill=eye_rgb + (255,))
        ix1, iy1, ix2, iy2 = px+s, py+s, px+6*s-1, py+6*s-1
        p_in = [(ix1+bv, iy1), (ix2-bv, iy1), (ix2, iy1+bv), (ix2, iy2-bv), (ix2-bv, iy2), (ix1+bv, iy2), (ix1, iy2-bv), (ix1, iy1+bv)]
        draw.polygon(p_in, fill=bg + (255,))
    elif eye_frame_style == "arch_frame":
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        arch_h = 3 * s
        draw.rectangle([x1, y1 + arch_h//2, x2, y2], outline=eye_rgb + (255,), width=s)
        draw.ellipse([x1, y1, x2, y1 + arch_h], outline=eye_rgb + (255,), width=s)
        draw.rectangle([x1+s, y1 + arch_h//2, x2-s, y2-s], fill=bg + (255,))
    elif eye_frame_style == "cross_notch_frame":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
        notch = s // 2
        mid = 3 * s
        draw.rectangle([px + mid - notch, py - 1, px + mid + notch, py + s], fill=bg + (255,))
        draw.rectangle([px + mid - notch, py + 6*s - 1, px + mid + notch, py + 7*s], fill=bg + (255,))
        draw.rectangle([px - 1, py + mid - notch, px + s, py + mid + notch], fill=bg + (255,))
        draw.rectangle([px + 6*s - 1, py + mid - notch, px + 7*s, py + mid + notch], fill=bg + (255,))
    elif eye_frame_style in ["pill_frame", "capsule_rounded"]:
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        rad = (y2 - y1) // 2
        draw.rounded_rectangle([x1, y1, x2, y2], radius=rad, outline=eye_rgb + (255,), width=s)
    elif eye_frame_style == "pointed_top_frame":
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        cx = px + 3.5 * s
        outer = [(x1, y1 + 2*s), (cx, y1), (x2, y1 + 2*s), (x2, y2), (x1, y2)]
        draw.polygon(outer, fill=eye_rgb + (255,))
        inner = [(x1+s, y1+2*s+s//2), (cx, y1+s), (x2-s, y1+2*s+s//2), (x2-s, y2-s), (x1+s, y2-s)]
        draw.polygon(inner, fill=bg + (255,))
    elif eye_frame_style == "aztec_step_frame":
        step = s
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        outer = [
            (x1 + 2*step, y1), (x2 - 2*step, y1),
            (x2 - 2*step, y1 + step), (x2 - step, y1 + step),
            (x2 - step, y1 + 2*step), (x2, y1 + 2*step),
            (x2, y2 - 2*step), (x2 - step, y2 - 2*step),
            (x2 - step, y2 - step), (x2 - 2*step, y2 - step),
            (x2 - 2*step, y2), (x1 + 2*step, y2),
            (x1 + 2*step, y2 - step), (x1 + step, y2 - step),
            (x1 + step, y2 - 2*step), (x1, y2 - 2*step),
            (x1, y1 + 2*step), (x1 + step, y1 + 2*step),
            (x1 + step, y1 + step), (x1 + 2*step, y1 + step)
        ]
        draw.polygon(outer, fill=eye_rgb + (255,))
        inner_off = s
        inner = [
            (x1 + inner_off + 2*step, y1 + inner_off), (x2 - inner_off - 2*step, y1 + inner_off),
            (x2 - inner_off - 2*step, y1 + inner_off + step), (x2 - inner_off - step, y1 + inner_off + step),
            (x2 - inner_off - step, y1 + inner_off + 2*step), (x2 - inner_off, y1 + inner_off + 2*step),
            (x2 - inner_off, y2 - inner_off - 2*step), (x2 - inner_off - step, y2 - inner_off - 2*step),
            (x2 - inner_off - step, y2 - inner_off - step), (x2 - inner_off - 2*step, y2 - inner_off - step),
            (x2 - inner_off - 2*step, y2 - inner_off), (x1 + inner_off + 2*step, y2 - inner_off),
            (x1 + inner_off + 2*step, y2 - inner_off - step), (x1 + inner_off + step, y2 - inner_off - step),
            (x1 + inner_off + step, y2 - inner_off - 2*step), (x1 + inner_off, y2 - inner_off - 2*step),
            (x1 + inner_off, y1 + inner_off + 2*step), (x1 + inner_off + step, y1 + inner_off + 2*step),
            (x1 + inner_off + step, y1 + inner_off + step), (x1 + inner_off + 2*step, y1 + inner_off + step)
        ]
        draw.polygon(inner, fill=bg + (255,))
    elif eye_frame_style in ["tv_frame", "vintage_seal"]:
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        rad_tv = int(1.5 * s)
        draw.rounded_rectangle([x1, y1 + s, x2, y2 - s], radius=rad_tv, outline=eye_rgb + (255,), width=s)
    elif eye_frame_style == "house_frame":
        draw.polygon([(px, py + 3.5*s), (px + 3.5*s, py), (px + 7*s - 1, py + 3.5*s), (px + 7*s - 1, py + 7*s - 1), (px, py + 7*s - 1)], fill=eye_rgb + (255,))
        draw.polygon([(px + s, py + 4*s), (px + 3.5*s, py + 1.5*s), (px + 6*s - 1, py + 4*s), (px + 6*s - 1, py + 6*s - 1), (px + s, py + 6*s - 1)], fill=bg + (255,))
        draw.rectangle([px + 5*s, py + s, px + 6*s, py + 3*s], fill=eye_rgb + (255,))
    elif eye_frame_style == "camera_lens":
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
        cx, cy = px + 3.5*s, py + 3.5*s
        for angle in [0, 60, 120, 180, 240, 300]:
            rad = math.radians(angle)
            rad2 = math.radians(angle + 20)
            x1, y1 = cx + math.cos(rad)*3.5*s, cy + math.sin(rad)*3.5*s
            x2, y2 = cx + math.cos(rad2)*s, cy + math.sin(rad2)*s
            draw.line([(x1,y1), (x2,y2)], fill=bg + (255,), width=max(1, int(s*0.4)))
    elif eye_frame_style in ["steering_wheel", "tech_hud", "strikethrough_box"]:
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.ellipse([px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1], fill=bg + (255,))
        cx, cy = px + 3.5*s, py + 3.5*s
        spoke_w = max(1, int(s * 0.8))
        draw.rectangle([cx - spoke_w//2, cy, cx + spoke_w//2, py + 6*s], fill=eye_rgb + (255,))
        draw.polygon([(cx, cy - spoke_w//2), (cx, cy + spoke_w//2), (px + s, cy + spoke_w//2 + s), (px + s, cy - spoke_w//2 + s)], fill=eye_rgb + (255,))
        draw.polygon([(cx, cy - spoke_w//2), (cx, cy + spoke_w//2), (px + 6*s, cy + spoke_w//2 + s), (px + 6*s, cy - spoke_w//2 + s)], fill=eye_rgb + (255,))
    elif eye_frame_style == "minimal_ring":
        draw.ellipse([px + s//2, py + s//2, px + 7*s - s//2 - 1, py + 7*s - s//2 - 1], outline=eye_rgb + (255,), width=max(1, s // 2))
    else: # default square
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)

def draw_inner_eyeball(draw, ebx, eby, s, eyeball_style, eyeball_rgb, bg):
    r = int(s * 1.5)
    r2 = int(r / 2)
    s2 = s // 2

    if eyeball_style == "rounded":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
    elif eyeball_style == "octagon":
        x1, y1, x2, y2 = ebx, eby, ebx + 3*s - 1, eby + 3*s - 1
        d = s
        p_eb = [
            (x1 + d, y1), (x2 - d, y1),
            (x2, y1 + d), (x2, y2 - d),
            (x2 - d, y2), (x1 + d, y2),
            (x1, y2 - d), (x1, y1 + d)
        ]
        draw.polygon(p_eb, fill=eyeball_rgb + (255,))
    elif eyeball_style == "corner_brackets":
        draw.rectangle([ebx, eby, ebx + s2 - 1, eby + s2 - 1], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx + 3*s - s2, eby, ebx + 3*s - 1, eby + s2 - 1], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx, eby + 3*s - s2, ebx + s2 - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx + 3*s - s2, eby + 3*s - s2, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style in ["target_bullseye", "target_dot"]:
        draw.ellipse([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], outline=eyeball_rgb + (255,), width=max(1, s // 2))
        draw.ellipse([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style == "hexagon":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        r_eb = 1.5 * s
        p_eb = []
        for i in range(6):
            angle = i * math.pi / 3 - math.pi / 2
            p_eb.append((cx + r_eb * math.cos(angle), cy + r_eb * math.sin(angle)))
        draw.polygon(p_eb, fill=eyeball_rgb + (255,))
    elif eyeball_style in ["diamond", "gem_cut", "rhombus"]:
        x1, y1, x2, y2 = ebx, eby, ebx + 3*s - 1, eby + 3*s - 1
        cx, cy = ebx + 1.5 * s, eby + 1.5 * s
        draw.polygon([(cx, y1), (x2, cy), (cx, y2), (x1, cy)], fill=eyeball_rgb + (255,))
    elif eyeball_style in ["star", "star_4point"]:
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        R_val = 1.5 * s
        r_val = 0.7 * s
        p_eb = []
        for i in range(8):
            angle = i * math.pi / 4 - math.pi / 2
            curr_r = R_val if i % 2 == 0 else r_val
            p_eb.append((cx + curr_r * math.cos(angle), cy + curr_r * math.sin(angle)))
        draw.polygon(p_eb, fill=eyeball_rgb + (255,))
    elif eyeball_style in ["gear", "gear_cog"]:
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        draw.ellipse([cx - s, cy - s, cx + s, cy + s], fill=eyeball_rgb + (255,))
        for i in range(6):
            angle = i * math.pi / 3
            gx = cx + 1.3 * s * math.cos(angle)
            gy = cy + 1.3 * s * math.sin(angle)
            draw.rectangle([gx - s2, gy - s2, gx + s2, gy + s2], fill=eyeball_rgb + (255,))
    elif eyeball_style == "flower":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        draw.ellipse([cx - s2, cy - s2, cx + s2, cy + s2], fill=eyeball_rgb + (255,))
        for i in range(6):
            angle = i * math.pi / 3
            fx = cx + 1.1 * s * math.cos(angle)
            fy = cy + 1.1 * s * math.sin(angle)
            dot_r = max(2, s // 3)
            draw.ellipse([fx - dot_r, fy - dot_r, fx + dot_r, fy + dot_r], fill=eyeball_rgb + (255,))
    elif eyeball_style in ["circle", "iris_ring"]:
        draw.ellipse([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        if eyeball_style == "iris_ring":
            draw.ellipse([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=bg + (255,))
            draw.ellipse([ebx + 1.3*s, eby + 1.3*s, ebx + 1.7*s - 1, eby + 1.7*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style == "minimal_plus":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        w = 2.4 * s
        t = max(2, int(0.5 * s))
        hw = w / 2
        ht = t / 2
        rad = max(1, int(t / 3))
        draw.rounded_rectangle([cx - hw, cy - ht, cx + hw, cy + ht], radius=rad, fill=eyeball_rgb + (255,))
        draw.rounded_rectangle([cx - ht, cy - hw, cx + ht, cy + hw], radius=rad, fill=eyeball_rgb + (255,))
    elif eyeball_style == "leaf":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "leaf_opposite":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
    elif eyeball_style in ["droplet", "droplet_br", "crescent_eye", "flame"]:
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "droplet_tl":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "droplet_tr":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "droplet_bl":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "shield":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "shield_opposite":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "left_rounded":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "right_rounded":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "sheared":
        offset = s // 2
        p1 = (ebx + offset, eby)
        p2 = (ebx + 3*s - 1, eby)
        p3 = (ebx + 3*s - 1 - offset, eby + 3*s - 1)
        p4 = (ebx, eby + 3*s - 1)
        draw.polygon([p1, p2, p3, p4], fill=eyeball_rgb + (255,))
    elif eyeball_style == "flower_cut":
        draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        cut_r = s // 2
        draw.ellipse([ebx + 1.5*s - cut_r, eby - cut_r, ebx + 1.5*s + cut_r, eby + cut_r], fill=bg + (255,))
        draw.ellipse([ebx + 1.5*s - cut_r, eby + 3*s - cut_r, ebx + 1.5*s + cut_r, eby + 3*s + cut_r], fill=bg + (255,))
        draw.ellipse([ebx - cut_r, eby + 1.5*s - cut_r, ebx + cut_r, eby + 1.5*s + cut_r], fill=bg + (255,))
        draw.ellipse([ebx + 3*s - cut_r, eby + 1.5*s - cut_r, ebx + 3*s + cut_r, eby + 1.5*s + cut_r], fill=bg + (255,))
    elif eyeball_style in ["clover", "gothic_clover"]:
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        cr = s // 2
        draw.ellipse([cx - cr, cy - 1.2*s, cx + cr, cy - 0.2*s], fill=eyeball_rgb + (255,))
        draw.ellipse([cx - cr, cy + 0.2*s, cx + cr, cy + 1.2*s], fill=eyeball_rgb + (255,))
        draw.ellipse([cx - 1.2*s, cy - cr, cx - 0.2*s, cy + cr], fill=eyeball_rgb + (255,))
        draw.ellipse([cx + 0.2*s, cy - cr, cx + 1.2*s, cy + cr], fill=eyeball_rgb + (255,))
        draw.rectangle([cx - 0.5*s, cy - 0.5*s, cx + 0.5*s, cy + 0.5*s], fill=eyeball_rgb + (255,))
    elif eyeball_style == "plus":
        draw.rectangle([ebx, eby + s, ebx + 3*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx + s, eby, ebx + 2*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style in ["cross", "tech_crosshair"]:
        th = int(0.7 * s)
        draw.polygon([
            (ebx + th, eby), (ebx, eby + th),
            (ebx + 3*s - 1 - th, eby + 3*s - 1), (ebx + 3*s - 1, eby + 3*s - 1 - th)
        ], fill=eyeball_rgb + (255,))
        draw.polygon([
            (ebx + 3*s - 1 - th, eby), (ebx + 3*s - 1, eby + th),
            (ebx + th, eby + 3*s - 1), (ebx, eby + 3*s - 1 - th)
        ], fill=eyeball_rgb + (255,))
    elif eyeball_style in ["heart", "heart_solid"]:
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        hr = 0.75 * s
        draw.ellipse([ebx + 1.5*s - 2*hr, eby, ebx + 1.5*s, eby + 2*hr], fill=eyeball_rgb + (255,))
        draw.ellipse([ebx + 1.5*s, eby, ebx + 1.5*s + 2*hr, eby + 2*hr], fill=eyeball_rgb + (255,))
        draw.polygon([(ebx, eby + hr), (ebx + 3*s - 1, eby + hr), (ebx + 1.5*s, eby + 3*s - 1)], fill=eyeball_rgb + (255,))
    elif eyeball_style == "rounded_triangle":
        cx, cy = ebx + 1.5*s, eby + 1.5*s
        R_t = 1.4 * s
        rounding = 0.35 * s
        pts = []
        for i in range(3):
            angle = i * 2 * math.pi / 3 - math.pi / 2
            pts.append((cx + R_t * math.cos(angle), cy + R_t * math.sin(angle)))
        draw.polygon(pts, fill=eyeball_rgb + (255,))
        for pt in pts:
            draw.ellipse([pt[0]-rounding, pt[1]-rounding, pt[0]+rounding, pt[1]+rounding], fill=eyeball_rgb + (255,))
    elif eyeball_style == "pinched_square":
        draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        bite = 1.2 * s
        draw.ellipse([ebx - bite, eby - bite, ebx + bite, eby + bite], fill=bg + (255,))
        draw.ellipse([ebx + 3*s - 1 - bite, eby - bite, ebx + 3*s - 1 + bite, eby + bite], fill=bg + (255,))
        draw.ellipse([ebx - bite, eby + 3*s - 1 - bite, ebx + bite, eby + 3*s - 1 + bite], fill=bg + (255,))
        draw.ellipse([ebx + 3*s - 1 - bite, eby + 3*s - 1 - bite, ebx + 3*s - 1 + bite, eby + 3*s - 1 + bite], fill=bg + (255,))
    elif eyeball_style == "dumbbell_eyeball":
        cx, cy = ebx + 1.5*s, eby + 1.5*s
        bar_w = s * 0.6
        draw.rectangle([cx - 1.5*s, cy - bar_w//2, cx + 1.5*s, cy + bar_w//2], fill=eyeball_rgb + (255,))
        draw.ellipse([cx - 1.5*s, cy - s, cx - 0.2*s, cy + s], fill=eyeball_rgb + (255,))
        draw.ellipse([cx + 0.2*s, cy - s, cx + 1.5*s, cy + s], fill=eyeball_rgb + (255,))
    else: # default square
        draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))

def main():
    out_dir_frames = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'previews', 'eye_frames')
    out_dir_balls = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'previews', 'eyeballs')
    os.makedirs(out_dir_frames, exist_ok=True)
    os.makedirs(out_dir_balls, exist_ok=True)

    # 1. Regenerate all outer eye frame icons (no inner squares)
    frame_files = [f for f in os.listdir(out_dir_frames) if f.endswith('.png')]
    print(f"Generating {len(frame_files)} eye frame previews...")
    for filename in frame_files:
        style = filename.replace('.png', '')
        # 200x200 canvas with RGBA transparent background
        img = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        s = 24
        px, py = 16, 16 # Centering 7*24 = 168 in 200 (16px margin)
        eye_rgb = (0, 0, 0)
        bg = (255, 255, 255) # White cutouts match card background perfectly
        draw_outer_frame(draw, px, py, s, style, eye_rgb, bg)
        out_path = os.path.join(out_dir_frames, filename)
        img.save(out_path, "PNG")

    # 2. Regenerate all inner eyeball icons (no outer frames, scaled up)
    ball_files = [f for f in os.listdir(out_dir_balls) if f.endswith('.png')]
    print(f"Generating {len(ball_files)} eyeball previews...")
    for filename in ball_files:
        style = filename.replace('.png', '')
        # 200x200 canvas with RGBA transparent background
        img = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        s = 48 # Scaled up for optimal UI visibility (3*48 = 144px)
        ebx, eby = 28, 28 # Centering 144 in 200 (28px margin)
        eyeball_rgb = (0, 0, 0)
        bg = (255, 255, 255)
        draw_inner_eyeball(draw, ebx, eby, s, style, eyeball_rgb, bg)
        out_path = os.path.join(out_dir_balls, filename)
        img.save(out_path, "PNG")

    print("All eye frame and eyeball previews successfully regenerated via standalone canvas rendering!")

if __name__ == "__main__":
    main()
