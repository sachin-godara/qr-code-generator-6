import math
import numpy as np
from PIL import Image, ImageDraw
from engines.core.noise import (
    generate_deckled_rect,
    draw_topographic_frame_func,
    draw_crystal_frame_func
)

def find_coeffs(pa, pb):
    matrix = []
    for p1, p2 in zip(pa, pb):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0]*p1[0], -p2[0]*p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1]*p1[0], -p2[1]*p1[1]])
    A = np.matrix(matrix, dtype=np.float32)
    B = np.array(pb).reshape(8)
    res = np.dot(np.linalg.inv(A.T * A) * A.T, B)
    return np.array(res).reshape(8)

def make_sharp_corner(draw, px, py, corner, s, r, color):
    if corner == "TL":
        draw.rectangle([px, py, px + r - 1, py + s - 1], fill=color)
        draw.rectangle([px, py, px + s - 1, py + r - 1], fill=color)
    elif corner == "TR":
        draw.rectangle([px + 7*s - r, py, px + 7*s - 1, py + s - 1], fill=color)
        draw.rectangle([px + 7*s - s, py, px + 7*s - 1, py + r - 1], fill=color)
    elif corner == "BL":
        draw.rectangle([px, py + 7*s - s, px + r - 1, py + 7*s - 1], fill=color)
        draw.rectangle([px, py + 7*s - r, px + s - 1, py + 7*s - 1], fill=color)
    elif corner == "BR":
        draw.rectangle([px + 7*s - r, py + 7*s - s, px + 7*s - 1, py + 7*s - 1], fill=color)
        draw.rectangle([px + 7*s - s, py + 7*s - r, px + 7*s - 1, py + 7*s - 1], fill=color)

def draw_eye_frame(draw, px, py, s, eye_frame_style, eye_rgb, bg, img=None):
    """
    Renders outer eye frame onto draw canvas at (px, py) position with module size s.
    """
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
    elif eye_frame_style == "double_ring":
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
    elif eye_frame_style == "hexagon":
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
    elif eye_frame_style == "diamond":
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
    elif eye_frame_style in ("perfect_leaf", "perfect_leaf_tl", "perfect_leaf_br"):
        r_out = 3.0 * s
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r_out, fill=eye_rgb + (255,))
        draw.rectangle([px, py, px + r_out, py + r_out], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - r_out, py + 7*s - r_out, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        
        r_in = 2.0 * s
        draw.rounded_rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], radius=r_in, fill=bg + (255,))
        draw.rectangle([px + s, py + s, px + s + r_in, py + s + r_in], fill=bg + (255,))
        draw.rectangle([px + 6*s - r_in, py + 6*s - r_in, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
    elif eye_frame_style in ("perfect_leaf_tr", "perfect_leaf_bl"):
        r_out = 3.0 * s
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r_out, fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - r_out, py, px + 7*s - 1, py + r_out], fill=eye_rgb + (255,))
        draw.rectangle([px, py + 7*s - r_out, px + r_out, py + 7*s - 1], fill=eye_rgb + (255,))
        
        r_in = 2.0 * s
        draw.rounded_rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], radius=r_in, fill=bg + (255,))
        draw.rectangle([px + 6*s - r_in, py + s, px + 6*s - 1, py + s + r_in], fill=bg + (255,))
        draw.rectangle([px + s, py + 6*s - r_in, px + s + r_in, py + 6*s - 1], fill=bg + (255,))
    elif eye_frame_style == "deckled":
        outer = generate_deckled_rect(px + 0.3*s, py + 0.3*s, px + 6.7*s - 1, py + 6.7*s - 1, segments=120, 
                                      freq1=4, amp1=0.25*s, 
                                      freq2=20, amp2=0.08*s, seed=hash(f"{px}_{py}_outer") % 10000)
        draw.polygon(outer, fill=eye_rgb + (255,))
        inner = generate_deckled_rect(px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1, segments=120, 
                                      freq1=3, amp1=0.1*s, 
                                      freq2=15, amp2=0.03*s, seed=hash(f"{px}_{py}_inner") % 10000)
        draw.polygon(inner, fill=bg + (255,))
    elif eye_frame_style == "dynamic_swept" and img is not None:
        W = 7 * s * 4
        mask = Image.new("L", (W, W), 0)
        mdraw = ImageDraw.Draw(mask)
        ms = W // 7
        r_out = 3.0 * ms
        mdraw.rounded_rectangle([0, 0, W - 1, W - 1], radius=r_out, fill=255)
        mdraw.rectangle([0, 0, r_out, r_out], fill=255)
        mdraw.rectangle([W - r_out, W - r_out, W - 1, W - 1], fill=255)
        
        r_in = 2.0 * ms
        mdraw.rounded_rectangle([ms, ms, W - ms - 1, W - ms - 1], radius=r_in, fill=0)
        mdraw.rectangle([ms, ms, ms + r_in, ms + r_in], fill=0)
        mdraw.rectangle([W - ms - r_in, W - ms - r_in, W - ms - 1, W - ms - 1], fill=0)
        
        k = 1.0 * ms
        pa = [(0, 0), (W, k), (W, W), (k, W)]
        pb = [(0, 0), (W, 0), (W, W), (0, W)]
        coeffs = find_coeffs(pa, pb)
        warped = mask.transform((W, W), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        warped = warped.resize((7*s, 7*s), Image.Resampling.LANCZOS)
        
        color_patch = Image.new("RGBA", (7*s, 7*s), eye_rgb + (255,))
        color_patch.putalpha(warped)
        img.paste(color_patch, (px, py), color_patch)
    elif eye_frame_style == "dynamic_swept_opposite" and img is not None:
        W = 7 * s * 4
        mask = Image.new("L", (W, W), 0)
        mdraw = ImageDraw.Draw(mask)
        ms = W // 7
        r_out = 3.0 * ms
        mdraw.rounded_rectangle([0, 0, W - 1, W - 1], radius=r_out, fill=255)
        mdraw.rectangle([W - r_out, 0, W - 1, r_out], fill=255)
        mdraw.rectangle([0, W - r_out, r_out, W - 1], fill=255)
        
        r_in = 2.0 * ms
        mdraw.rounded_rectangle([ms, ms, W - ms - 1, W - ms - 1], radius=r_in, fill=0)
        mdraw.rectangle([W - ms - r_in, ms, W - ms - 1, ms + r_in], fill=0)
        mdraw.rectangle([ms, W - ms - r_in, ms + r_in, W - ms - 1], fill=0)
        
        k = 1.0 * ms
        pa = [(0, k), (W, 0), (W - k, W), (0, W)]
        pb = [(0, 0), (W, 0), (W, W), (0, W)]
        coeffs = find_coeffs(pa, pb)
        warped = mask.transform((W, W), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        warped = warped.resize((7*s, 7*s), Image.Resampling.LANCZOS)
        
        color_patch = Image.new("RGBA", (7*s, 7*s), eye_rgb + (255,))
        color_patch.putalpha(warped)
        img.paste(color_patch, (px, py), color_patch)
    elif eye_frame_style == "leaf":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
    elif eye_frame_style == "leaf_opposite":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
        make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
    elif eye_frame_style == "droplet" or eye_frame_style == "droplet_br":
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
    elif eye_frame_style == "shield":
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
    elif eye_frame_style == "pill_frame":
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
    elif eye_frame_style == "tv_frame":
        x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
        rad_tv = int(1.5 * s)
        draw.rounded_rectangle([x1, y1 + s, x2, y2 - s], radius=rad_tv, outline=eye_rgb + (255,), width=s)
    elif eye_frame_style == "house_frame":
        draw.polygon([(px, py + 3.5*s), (px + 3.5*s, py), (px + 7*s - 1, py + 3.5*s), (px + 7*s - 1, py + 7*s - 1), (px, py + 7*s - 1)], fill=eye_rgb + (255,))
        draw.polygon([(px + s, py + 4*s), (px + 3.5*s, py + 1.5*s), (px + 6*s - 1, py + 4*s), (px + 6*s - 1, py + 6*s - 1), (px + s, py + 6*s - 1)], fill=bg + (255,))
        draw.rectangle([px + 5*s, py + s, px + 6*s, py + 3*s], fill=eye_rgb + (255,))
    elif eye_frame_style == "crystal":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
        draw_crystal_frame_func(draw, px, py, s, eye_rgb + (255,))
    elif eye_frame_style == "topographic":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
        draw_topographic_frame_func(draw, px, py, s, eye_rgb + (255,))
    elif eye_frame_style == "squircle":
        draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=int(2.5*s), fill=eye_rgb)
        draw.rounded_rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], radius=int(1.5*s), fill=(255,255,255))
    elif eye_frame_style == "notched_ring":
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb)
        draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
        cx, cy = px + 3.5*s, py + 3.5*s
        draw.rectangle([cx - 0.4*s, py, cx + 0.4*s, py + 0.8*s], fill=(255,255,255))
        draw.rectangle([cx - 0.4*s, py + 6.2*s, cx + 0.4*s, py + 7*s], fill=(255,255,255))
        draw.rectangle([px, cy - 0.4*s, px + 0.8*s, cy + 0.4*s], fill=(255,255,255))
        draw.rectangle([px + 6.2*s, cy - 0.4*s, px + 7*s, cy + 0.4*s], fill=(255,255,255))
    elif eye_frame_style == "circuit_trace":
        out_pts = [
            (px, py), (px + 5.5*s, py), (px + 7*s, py + 1.5*s), (px + 7*s, py + 7*s),
            (px + 1.5*s, py + 7*s), (px, py + 5.5*s)
        ]
        draw.polygon(out_pts, fill=eye_rgb)
        draw.rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
        draw.rectangle([px + 2*s, py, px + 3.5*s, py + 0.8*s], fill=(255,255,255))
    elif eye_frame_style == "fluted_bezel":
        pts = []
        cx, cy = px + 3.5*s, py + 3.5*s
        r_base = 3.5 * s
        amp = 0.2 * s
        for i in range(360):
            rad = math.radians(i)
            r = r_base + amp * math.sin(12 * rad)
            x = cx + r * math.cos(rad)
            y = cy + r * math.sin(rad)
            pts.append((x, y))
        draw.polygon(pts, fill=eye_rgb)
        draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
    elif eye_frame_style == "cushion_cut":
        pts = []
        steps = 20
        def curve_edge(p1, p2, bow_out_vec):
            edge_pts = []
            for i in range(steps):
                t = i / steps
                x = px + (p1[0] + t * (p2[0] - p1[0])) * s
                y = py + (p1[1] + t * (p2[1] - p1[1])) * s
                bow = math.sin(t * math.pi) * 0.4 * s
                x += bow * bow_out_vec[0]
                y += bow * bow_out_vec[1]
                edge_pts.append((x, y))
            return edge_pts
        pts.extend(curve_edge((0, 0), (7, 0), (0, -1)))
        pts.extend(curve_edge((7, 0), (7, 7), (1, 0)))
        pts.extend(curve_edge((7, 7), (0, 7), (0, 1)))
        pts.extend(curve_edge((0, 7), (0, 0), (-1, 0)))
        draw.polygon(pts, fill=eye_rgb)
        draw.rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
    elif eye_frame_style == "hex_nut":
        pts = []
        cx, cy = px + 3.5*s, py + 3.5*s
        for i in range(6):
            rad = math.radians(i * 60 - 30)
            x = cx + 3.5 * s * math.cos(rad)
            y = cy + 3.5 * s * math.sin(rad)
            pts.append((x, y))
        draw.polygon(pts, fill=eye_rgb)
        draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
    elif eye_frame_style == "split_crosshairs":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb)
        draw.rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
        cx, cy = px + 3.5*s, py + 3.5*s
        gap = 0.3 * s
        draw.rectangle([cx - gap, py, cx + gap, py + 1.2*s], fill=(255,255,255))
        draw.rectangle([cx - gap, py + 5.8*s, cx + gap, py + 7*s], fill=(255,255,255))
        draw.rectangle([px, cy - gap, px + 1.2*s, cy + gap], fill=(255,255,255))
        draw.rectangle([px + 5.8*s, cy - gap, px + 7*s, cy + gap], fill=(255,255,255))
    elif eye_frame_style == "aerodynamic_slant":
        out_pts = [
            (px, py + 2.2*s), (px + 3.8*s, py), (px + 7*s, py),
            (px + 7*s, py + 4.8*s), (px + 3.2*s, py + 7*s), (px, py + 7*s)
        ]
        draw.polygon(out_pts, fill=eye_rgb)
        draw.rectangle([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=(255,255,255))
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
    elif eye_frame_style == "steering_wheel":
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        draw.ellipse([px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1], fill=bg + (255,))
        cx, cy = px + 3.5*s, py + 3.5*s
        spoke_w = max(1, int(s * 0.8))
        draw.rectangle([cx - spoke_w//2, cy, cx + spoke_w//2, py + 6*s], fill=eye_rgb + (255,))
        draw.polygon([(cx, cy - spoke_w//2), (cx, cy + spoke_w//2), (px + s, cy + spoke_w//2 + s), (px + s, cy - spoke_w//2 + s)], fill=eye_rgb + (255,))
        draw.polygon([(cx, cy - spoke_w//2), (cx, cy + spoke_w//2), (px + 6*s, cy + spoke_w//2 + s), (px + 6*s, cy - spoke_w//2 + s)], fill=eye_rgb + (255,))
    elif eye_frame_style == "square":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
    elif eye_frame_style == "minimal_ring":
        draw.ellipse([px + s//2, py + s//2, px + 7*s - s//2 - 1, py + 7*s - s//2 - 1], outline=eye_rgb + (255,), width=max(1, s // 2))
    elif eye_frame_style == "ultra_thin_square":
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=max(1, s // 6))
    elif eye_frame_style == "ultra_thin_circle":
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=max(1, s // 6))
    elif eye_frame_style == "dashed_square":
        w = max(1, s // 3)
        for i in range(7):
            if i % 2 == 0:
                draw.rectangle([px + i*s, py, px + (i+1)*s - 1, py + w], fill=eye_rgb + (255,))
                draw.rectangle([px + i*s, py + 7*s - w - 1, px + (i+1)*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
                draw.rectangle([px, py + i*s, px + w, py + (i+1)*s - 1], fill=eye_rgb + (255,))
                draw.rectangle([px + 7*s - w - 1, py + i*s, px + 7*s - 1, py + (i+1)*s - 1], fill=eye_rgb + (255,))
    elif eye_frame_style == "corner_dots":
        dot_s = s
        draw.ellipse([px, py, px + dot_s, py + dot_s], fill=eye_rgb + (255,))
        draw.ellipse([px + 7*s - dot_s, py, px + 7*s, py + dot_s], fill=eye_rgb + (255,))
        draw.ellipse([px, py + 7*s - dot_s, px + dot_s, py + 7*s], fill=eye_rgb + (255,))
        draw.ellipse([px + 7*s - dot_s, py + 7*s - dot_s, px + 7*s, py + 7*s], fill=eye_rgb + (255,))
    elif eye_frame_style == "minimal_corners":
        w = max(1, s // 3)
        c = int(1.5 * s)
        draw.rectangle([px, py, px + c, py + w], fill=eye_rgb + (255,))
        draw.rectangle([px, py, px + w, py + c], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - c, py, px + 7*s, py + w], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - w, py, px + 7*s, py + c], fill=eye_rgb + (255,))
        draw.rectangle([px, py + 7*s - w, px + c, py + 7*s], fill=eye_rgb + (255,))
        draw.rectangle([px, py + 7*s - c, px + w, py + 7*s], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - c, py + 7*s - w, px + 7*s, py + 7*s], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - w, py + 7*s - c, px + 7*s, py + 7*s], fill=eye_rgb + (255,))
    elif eye_frame_style == "target_minimal":
        draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=max(1, s // 4))
        draw.ellipse([px + 1.2*s, py + 1.2*s, px + 5.8*s, py + 5.8*s], outline=eye_rgb + (255,), width=max(1, s // 4))
    elif eye_frame_style == "hollow_diamond":
        cx, cy = px + 3.5*s, py + 3.5*s
        pts = [(cx, py), (px + 7*s, cy), (cx, py + 7*s), (px, cy)]
        draw.polygon(pts, outline=eye_rgb + (255,), width=max(1, s // 2))
    elif eye_frame_style == "brackets_square":
        w = max(1, s // 2)
        c = s
        draw.rectangle([px, py, px + c, py + w], fill=eye_rgb + (255,))
        draw.rectangle([px, py, px + w, py + 7*s], fill=eye_rgb + (255,))
        draw.rectangle([px, py + 7*s - w, px + c, py + 7*s], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - c, py, px + 7*s, py + w], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - w, py, px + 7*s, py + 7*s], fill=eye_rgb + (255,))
        draw.rectangle([px + 7*s - c, py + 7*s - w, px + 7*s, py + 7*s], fill=eye_rgb + (255,))
    elif eye_frame_style == "brackets_curly":
        w = max(1, s // 2)
        cx, cy = px + 3.5*s, py + 3.5*s
        draw.arc([px, py, px + 2*s, cy], start=90, end=270, fill=eye_rgb + (255,), width=w)
        draw.arc([px, cy, px + 2*s, py + 7*s], start=90, end=270, fill=eye_rgb + (255,), width=w)
        draw.arc([px + 5*s, py, px + 7*s, cy], start=270, end=90, fill=eye_rgb + (255,), width=w)
        draw.arc([px + 5*s, cy, px + 7*s, py + 7*s], start=270, end=90, fill=eye_rgb + (255,), width=w)
    elif eye_frame_style == "capsule_horizontal":
        draw.rounded_rectangle([px, py + 1.5*s, px + 7*s - 1, py + 5.5*s - 1], radius=2*s, outline=eye_rgb + (255,), width=s)
    elif eye_frame_style == "geometric_deco":
        x0, y0 = px, py
        x1, y1 = px + 7*s - 1, py + 7*s - 1
        pts = [
            (x0, y0+s), (x0+s, y0), (x1-s, y0), (x1, y0+s),
            (x1, y1-s), (x1-s, y1), (x0+s, y1), (x0, y1-s)
        ]
        draw.polygon(pts, fill=eye_rgb + (255,))
        draw.rectangle([x0 + 1*s, y0 + 1*s, x1 - 1*s, y1 - 1*s], fill=bg + (255,))
        for i in range(3):
            d = i * s * 0.3
            draw.line([x0+d, y0+s+d, x0+s+d, y0+d], fill=bg + (255,), width=max(1, s//8))
    elif eye_frame_style == "superellipse_square":
        cx, cy = px + 3.5*s, py + 3.5*s
        pts = []
        a, b = 3.5*s, 3.5*s
        n = 5.0
        for theta in range(0, 360, 2):
            t = math.radians(theta)
            cos_t = math.cos(t)
            sin_t = math.sin(t)
            x = cx + a * (abs(cos_t) ** (2/n)) * math.copysign(1, cos_t)
            y = cy + b * (abs(sin_t) ** (2/n)) * math.copysign(1, sin_t)
            mod = 1 + 0.05 * math.sin(16*t)
            x = cx + (x - cx) * mod
            y = cy + (y - cy) * mod
            pts.append((x, y))
        draw.polygon(pts, fill=eye_rgb + (255,))
        draw.rectangle([px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1], fill=bg + (255,))
    elif eye_frame_style == "flower_of_life":
        cx, cy = px + 3.5*s, py + 3.5*s
        R = 3.5*s
        draw.ellipse([cx - R, cy - R, cx + R, cy + R], fill=eye_rgb + (255,))
        r = R / 3
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=bg + (255,), width=max(1, s//8))
        for i in range(6):
            rad = math.radians(i * 60)
            x = cx + r * math.cos(rad)
            y = cy + r * math.sin(rad)
            draw.ellipse([x - r, y - r, x + r, y + r], outline=bg + (255,), width=max(1, s//8))
        draw.ellipse([px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1], fill=bg + (255,))
    elif eye_frame_style == "fibonacci_flower":
        cx, cy = px + 3.5*s, py + 3.5*s
        R = 3.5*s
        draw.ellipse([cx - R, cy - R, cx + R, cy + R], fill=eye_rgb + (255,))
        golden_angle = 137.508
        num_seeds = 100
        for i in range(num_seeds):
            r = R * 0.9 * math.sqrt(i) / math.sqrt(num_seeds)
            theta = math.radians(i * golden_angle)
            x = cx + r * math.cos(theta)
            y = cy + r * math.sin(theta)
            dot_size = max(1, s//6)
            draw.ellipse([x - dot_size, y - dot_size, x + dot_size, y + dot_size], fill=bg + (255,))
        draw.ellipse([px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1], fill=bg + (255,))
    elif eye_frame_style == "none":
        pass
    else:
        # Default square
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
