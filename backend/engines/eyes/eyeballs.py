import math
import numpy as np
from PIL import Image, ImageDraw
from engines.core.noise import generate_deckled_rect
from engines.eyes.eye_frames import find_coeffs

def make_eyeball_sharp_corner(draw, ebx, eby, corner, s, r2, color):
    if corner == "TL":
        draw.rectangle([ebx, eby, ebx + r2 - 1, eby + r2 - 1], fill=color)
    elif corner == "TR":
        draw.rectangle([ebx + 3*s - r2, eby, ebx + 3*s - 1, eby + r2 - 1], fill=color)
    elif corner == "BL":
        draw.rectangle([ebx, eby + 3*s - r2, ebx + r2 - 1, eby + 3*s - 1], fill=color)
    elif corner == "BR":
        draw.rectangle([ebx + 3*s - r2, eby + 3*s - r2, ebx + 3*s - 1, eby + 3*s - 1], fill=color)

def draw_eyeball(draw, ebx, eby, px, py, s, eyeball_style, eyeball_rgb, bg, img=None):
    """
    Renders inner eyeball onto draw canvas at ebx=px+2*s, eby=py+2*s with module size s.
    """
    r2 = int(s * 0.75)
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
    elif eyeball_style == "target_bullseye":
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
    elif eyeball_style == "diamond":
        p1 = (ebx + 1.5*s, eby)
        p2 = (ebx + 3*s - 1, eby + 1.5*s)
        p3 = (ebx + 1.5*s, eby + 3*s - 1)
        p4 = (ebx, eby + 1.5*s)
        draw.polygon([p1, p2, p3, p4], fill=eyeball_rgb + (255,))
    elif eyeball_style == "squircle":
        draw.rounded_rectangle([px + 2*s, py + 2*s, px + 5*s - 1, py + 5*s - 1], radius=int(1.2*s), fill=eyeball_rgb + (255,))
    elif eyeball_style == "notched_ring":
        draw.ellipse([px + 2*s, py + 2*s, px + 5*s - 1, py + 5*s - 1], fill=eyeball_rgb + (255,))
        draw.ellipse([px + 3*s, py + 3*s, px + 4*s - 1, py + 4*s - 1], fill=bg + (255,))
    elif eyeball_style == "circuit_trace":
        pts = [
            (px + 2*s, py + 2*s), (px + 4*s, py + 2*s), (px + 5*s, py + 3*s),
            (px + 5*s, py + 5*s), (px + 3*s, py + 5*s), (px + 2*s, py + 4*s)
        ]
        draw.polygon(pts, fill=eyeball_rgb + (255,))
    elif eyeball_style == "fluted_bezel":
        draw.ellipse([px + 2*s, py + 2*s, px + 5*s - 1, py + 5*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style == "cushion_cut":
        pts = []
        steps = 15
        def curve_edge(p1, p2, bow_out_vec):
            edge_pts = []
            for i in range(steps):
                t = i / steps
                x = px + (p1[0] + t * (p2[0] - p1[0])) * s
                y = py + (p1[1] + t * (p2[1] - p1[1])) * s
                bow = math.sin(t * math.pi) * 0.25 * s
                x += bow * bow_out_vec[0]
                y += bow * bow_out_vec[1]
                edge_pts.append((x, y))
            return edge_pts
        pts.extend(curve_edge((2, 2), (5, 2), (0, -1)))
        pts.extend(curve_edge((5, 2), (5, 5), (1, 0)))
        pts.extend(curve_edge((5, 5), (2, 5), (0, 1)))
        pts.extend(curve_edge((2, 5), (2, 2), (-1, 0)))
        draw.polygon(pts, fill=eyeball_rgb + (255,))
    elif eyeball_style == "hex_nut":
        pts = []
        cx, cy = px + 3.5*s, py + 3.5*s
        for i in range(6):
            rad = math.radians(i * 60 - 30)
            x = cx + 1.5 * s * math.cos(rad)
            y = cy + 1.5 * s * math.sin(rad)
            pts.append((x, y))
        draw.polygon(pts, fill=eyeball_rgb + (255,))
    elif eyeball_style == "split_crosshairs":
        draw.rectangle([px + 2*s, py + 2*s, px + 5*s - 1, py + 5*s - 1], fill=eyeball_rgb + (255,))
        cx, cy = px + 3.5*s, py + 3.5*s
        gap = 0.25 * s
        draw.rectangle([cx - gap, py + 1.8*s, cx + gap, py + 2.4*s], fill=bg + (255,))
        draw.rectangle([cx - gap, py + 4.6*s, cx + gap, py + 5.2*s], fill=bg + (255,))
        draw.rectangle([px + 1.8*s, cy - gap, px + 2.4*s, cy + gap], fill=bg + (255,))
        draw.rectangle([px + 4.6*s, cy - gap, px + 5.2*s, cy + gap], fill=bg + (255,))
    elif eyeball_style == "aerodynamic_slant":
        pts = [(px + 2.6*s, py + 2*s), (px + 5*s, py + 2*s), (px + 4.4*s, py + 5*s), (px + 2*s, py + 5*s)]
        draw.polygon(pts, fill=eyeball_rgb + (255,))
    elif eyeball_style == "starburst":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        r_sun = 1.5 * s
        num_points = 12
        for i in range(num_points):
            angle = i * (2 * math.pi / num_points)
            x2 = cx + r_sun * math.cos(angle)
            y2 = cy + r_sun * math.sin(angle)
            draw.line([(cx, cy), (x2, y2)], fill=eyeball_rgb + (255,), width=max(2, s // 2))
        draw.ellipse([cx - s, cy - s, cx + s, cy + s], fill=eyeball_rgb + (255,))
    elif eyeball_style == "gear":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        
        pts = [
            (cx - 1.167 * s, cy - 1.646 * s), (cx - 1.167 * s, cy - 0.646 * s),
            (cx - 0.792 * s, cy - 0.646 * s), (cx - 0.771 * s, cy - 0.625 * s),
            (cx - 0.833 * s, cy - 0.562 * s), (cx - 0.833 * s, cy - 0.542 * s),
            (cx - 0.875 * s, cy - 0.5 * s), (cx - 1.812 * s, cy - 0.5 * s),
            (cx - 1.812 * s, cy + 0.5 * s), (cx - 0.875 * s, cy + 0.5 * s),
            (cx - 0.833 * s, cy + 0.542 * s), (cx - 0.833 * s, cy + 0.562 * s),
            (cx - 0.792 * s, cy + 0.604 * s), (cx - 0.812 * s, cy + 0.625 * s),
            (cx - 1.167 * s, cy + 0.625 * s), (cx - 1.167 * s, cy + 1.625 * s),
            (cx - 0.167 * s, cy + 1.625 * s), (cx - 0.167 * s, cy + 1.0 * s),
            (cx - 0.146 * s, cy + 0.979 * s), (cx - 0.125 * s, cy + 1.0 * s),
            (cx + 0.125 * s, cy + 1.0 * s), (cx + 0.146 * s, cy + 1.021 * s),
            (cx + 0.146 * s, cy + 1.625 * s), (cx + 1.146 * s, cy + 1.625 * s),
            (cx + 1.146 * s, cy + 0.625 * s), (cx + 0.812 * s, cy + 0.625 * s),
            (cx + 0.792 * s, cy + 0.604 * s), (cx + 0.833 * s, cy + 0.562 * s),
            (cx + 0.833 * s, cy + 0.542 * s), (cx + 0.875 * s, cy + 0.5 * s),
            (cx + 1.792 * s, cy + 0.5 * s), (cx + 1.792 * s, cy - 0.5 * s),
            (cx + 0.875 * s, cy - 0.5 * s), (cx + 0.833 * s, cy - 0.542 * s),
            (cx + 0.833 * s, cy - 0.562 * s), (cx + 0.771 * s, cy - 0.625 * s),
            (cx + 0.792 * s, cy - 0.646 * s), (cx + 1.146 * s, cy - 0.646 * s),
            (cx + 1.146 * s, cy - 1.646 * s), (cx + 0.146 * s, cy - 1.646 * s),
            (cx + 0.146 * s, cy - 1.021 * s), (cx + 0.125 * s, cy - 1.0 * s),
            (cx - 0.125 * s, cy - 1.0 * s), (cx - 0.146 * s, cy - 0.979 * s),
            (cx - 0.167 * s, cy - 1.0 * s), (cx - 0.167 * s, cy - 1.646 * s)
        ]
        
        draw.polygon(pts, fill=eyeball_rgb + (255,))
    elif eyeball_style == "star":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        R = 1.5 * s
        r_inner = R * 0.4
        points = []
        for i in range(10):
            angle = i * math.pi / 5 - math.pi / 2
            r_curr = R if i % 2 == 0 else r_inner
            points.append((cx + r_curr * math.cos(angle), cy + r_curr * math.sin(angle)))
        draw.polygon(points, fill=eyeball_rgb + (255,))
    elif eyeball_style == "flower_cut":
        draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        cut_r = s // 2
        draw.ellipse([ebx + 1.5*s - cut_r, eby - cut_r, ebx + 1.5*s + cut_r, eby + cut_r], fill=bg + (255,))
        draw.ellipse([ebx + 1.5*s - cut_r, eby + 3*s - cut_r, ebx + 1.5*s + cut_r, eby + 3*s + cut_r], fill=bg + (255,))
        draw.ellipse([ebx - cut_r, eby + 1.5*s - cut_r, ebx + cut_r, eby + 1.5*s + cut_r], fill=bg + (255,))
        draw.ellipse([ebx + 3*s - cut_r, eby + 1.5*s - cut_r, ebx + 3*s + cut_r, eby + 1.5*s + cut_r], fill=bg + (255,))
    elif eyeball_style == "clover":
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
    elif eyeball_style == "cross":
        th = int(0.7 * s)
        draw.polygon([
            (ebx + th, eby),
            (ebx, eby + th),
            (ebx + 3*s - 1 - th, eby + 3*s - 1),
            (ebx + 3*s - 1, eby + 3*s - 1 - th)
        ], fill=eyeball_rgb + (255,))
        draw.polygon([
            (ebx + 3*s - 1 - th, eby),
            (ebx + 3*s - 1, eby + th),
            (ebx + th, eby + 3*s - 1),
            (ebx, eby + 3*s - 1 - th)
        ], fill=eyeball_rgb + (255,))
    elif eyeball_style == "flower":
        cx = ebx + 1.5 * s
        cy = eby + 1.5 * s
        cr = s // 2
        d = 0.6 * s
        for angle in [math.pi/4, 3*math.pi/4, 5*math.pi/4, 7*math.pi/4]:
            px_petal = cx + d * math.cos(angle)
            py_petal = cy + d * math.sin(angle)
            draw.ellipse([px_petal - cr, py_petal - cr, px_petal + cr, py_petal + cr], fill=eyeball_rgb + (255,))
        draw.ellipse([cx - 0.6*s, cy - 0.6*s, cx + 0.6*s, cy + 0.6*s], fill=eyeball_rgb + (255,))
    elif eyeball_style == "heart":
        hr = 0.75 * s
        draw.ellipse([ebx + 1.5*s - 2*hr, eby, ebx + 1.5*s, eby + 2*hr], fill=eyeball_rgb + (255,))
        draw.ellipse([ebx + 1.5*s, eby, ebx + 1.5*s + 2*hr, eby + 2*hr], fill=eyeball_rgb + (255,))
        draw.polygon([(ebx, eby + hr), (ebx + 3*s - 1, eby + hr), (ebx + 1.5*s, eby + 3*s - 1)], fill=eyeball_rgb + (255,))
    elif eyeball_style == "rhombus":
        cx, cy = ebx + 1.5*s, eby + 1.5*s
        draw.polygon([(cx, eby), (ebx + 3*s - 1, cy), (cx, eby + 3*s - 1), (ebx, cy)], fill=eyeball_rgb + (255,))
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
        cx, cy = ebx + 1.5*s, eby + 1.5*s
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
        w = max(1, s // 2)
        draw.line([px + 3.5*s, py + 1.5*s, px + 3.5*s, py + 5.5*s], fill=eyeball_rgb + (255,), width=w)
        draw.line([px + 1.5*s, py + 3.5*s, px + 5.5*s, py + 3.5*s], fill=eyeball_rgb + (255,), width=w)
    elif eyeball_style == "minimal_x":
        w = max(1, s // 2)
        draw.line([px + 2*s, py + 2*s, px + 5*s, py + 5*s], fill=eyeball_rgb + (255,), width=w)
        draw.line([px + 5*s, py + 2*s, px + 2*s, py + 5*s], fill=eyeball_rgb + (255,), width=w)
    elif eyeball_style == "vertical_pill":
        draw.rounded_rectangle([px + 2.5*s, py + 1.5*s, px + 4.5*s, py + 5.5*s], radius=s, fill=eyeball_rgb + (255,))
    elif eyeball_style == "horizontal_pill":
        draw.rounded_rectangle([px + 1.5*s, py + 2.5*s, px + 5.5*s, py + 4.5*s], radius=s, fill=eyeball_rgb + (255,))
    elif eyeball_style in ("perfect_leaf", "perfect_leaf_tl", "perfect_leaf_br"):
        r_eb = 1.5 * s
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r_eb, fill=eyeball_rgb + (255,))
        draw.rectangle([ebx, eby, ebx + r_eb, eby + r_eb], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx + 3*s - r_eb, eby + 3*s - r_eb, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style in ("perfect_leaf_tr", "perfect_leaf_bl"):
        r_eb = 1.5 * s
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r_eb, fill=eyeball_rgb + (255,))
        draw.rectangle([ebx + 3*s - r_eb, eby, ebx + 3*s - 1, eby + r_eb], fill=eyeball_rgb + (255,))
        draw.rectangle([ebx, eby + 3*s - r_eb, ebx + r_eb, eby + 3*s - 1], fill=eyeball_rgb + (255,))
    elif eyeball_style == "deckled":
        eyeball = generate_deckled_rect(ebx + 0.3*s, eby + 0.3*s, ebx + 2.7*s - 1, eby + 2.7*s - 1, segments=80, 
                                        freq1=2, amp1=0.05*s, 
                                        freq2=10, amp2=0.02*s, seed=hash(f"{ebx}_{eby}_eyeball") % 10000)
        draw.polygon(eyeball, fill=eyeball_rgb + (255,))
    elif eyeball_style == "dynamic_swept" and img is not None:
        W = 3 * s * 4
        mask = Image.new("L", (W, W), 0)
        mdraw = ImageDraw.Draw(mask)
        ms = W // 3
        r_eb = 1.5 * ms
        mdraw.rounded_rectangle([0, 0, W - 1, W - 1], radius=r_eb, fill=255)
        mdraw.rectangle([0, 0, r_eb, r_eb], fill=255)
        mdraw.rectangle([W - r_eb, W - r_eb, W - 1, W - 1], fill=255)
        
        k = 1.2 * ms
        pa = [(0, 0), (W, k), (W, W), (k, W)]
        pb = [(0, 0), (W, 0), (W, W), (0, W)]
        coeffs = find_coeffs(pa, pb)
        warped = mask.transform((W, W), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        warped = warped.resize((3*s, 3*s), Image.Resampling.LANCZOS)
        
        color_patch = Image.new("RGBA", (3*s, 3*s), eyeball_rgb + (255,))
        color_patch.putalpha(warped)
        img.paste(color_patch, (ebx, eby), color_patch)
    elif eyeball_style == "dynamic_swept_opposite" and img is not None:
        W = 3 * s * 4
        mask = Image.new("L", (W, W), 0)
        mdraw = ImageDraw.Draw(mask)
        ms = W // 3
        r_eb = 1.5 * ms
        mdraw.rounded_rectangle([0, 0, W - 1, W - 1], radius=r_eb, fill=255)
        mdraw.rectangle([W - r_eb, 0, W - 1, r_eb], fill=255)
        mdraw.rectangle([0, W - r_eb, r_eb, W - 1], fill=255)
        
        k = 1.2 * ms
        pa = [(0, k), (W, 0), (W - k, W), (0, W)]
        pb = [(0, 0), (W, 0), (W, W), (0, W)]
        coeffs = find_coeffs(pa, pb)
        warped = mask.transform((W, W), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        warped = warped.resize((3*s, 3*s), Image.Resampling.LANCZOS)
        
        color_patch = Image.new("RGBA", (3*s, 3*s), eyeball_rgb + (255,))
        color_patch.putalpha(warped)
        img.paste(color_patch, (ebx, eby), color_patch)
    elif eyeball_style == "leaf":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "leaf_opposite":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "droplet":
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
    elif eyeball_style == "droplet_br":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
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
    elif eyeball_style == "top_rounded":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "bottom_rounded":
        draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
        make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
    elif eyeball_style == "hollow":
        draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], outline=eyeball_rgb + (255,), width=s)
    elif eyeball_style == "sheared":
        offset = s // 2
        p1 = (ebx + offset, eby)
        p2 = (ebx + 3*s - 1, eby)
        p3 = (ebx + 3*s - 1 - offset, eby + 3*s - 1)
        p4 = (ebx, eby + 3*s - 1)
        draw.polygon([p1, p2, p3, p4], fill=eyeball_rgb + (255,))
    elif eyeball_style == "none":
        pass
    else:
        # Default square
        draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
