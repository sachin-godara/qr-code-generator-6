import math
import random

def value_noise_1d(length, frequency, amplitude, seed_offset=0):
    random.seed(seed_offset)
    points = [random.uniform(-amplitude, amplitude) for _ in range(int(frequency) + 2)]
    result = []
    for i in range(length):
        t = (i / length) * frequency
        idx = int(t)
        frac = t - idx
        smooth = frac * frac * (3 - 2 * frac)
        val = points[idx] * (1 - smooth) + points[idx+1] * smooth if idx + 1 < len(points) else points[idx]
        result.append(val)
    return result

def fractal_noise_1d(length, freq1, amp1, freq2, amp2, seed_offset):
    n1 = value_noise_1d(length, freq1, amp1, seed_offset)
    n2 = value_noise_1d(length, freq2, amp2, seed_offset + 100)
    return [a + b for a, b in zip(n1, n2)]

def generate_deckled_rect(x0, y0, x1, y1, segments, freq1, amp1, freq2, amp2, seed):
    points = []
    
    def add_edge(start_x, start_y, end_x, end_y, noise_array):
        for i in range(segments):
            t = i / segments
            x = start_x + t * (end_x - start_x)
            y = start_y + t * (end_y - start_y)
            
            n = noise_array[i]
            if start_x == end_x: # vertical edge
                nx = n if start_y < end_y else -n
                ny = 0
            else: # horizontal edge
                nx = 0
                ny = n if start_x < end_x else -n
            points.append((x + nx, y + ny))

    noise_top = fractal_noise_1d(segments, freq1, amp1, freq2, amp2, seed)
    noise_right = fractal_noise_1d(segments, freq1, amp1, freq2, amp2, seed+1)
    noise_bottom = fractal_noise_1d(segments, freq1, amp1, freq2, amp2, seed+2)
    noise_left = fractal_noise_1d(segments, freq1, amp1, freq2, amp2, seed+3)
    
    add_edge(x0, y0, x1, y0, noise_top)
    add_edge(x1, y0, x1, y1, noise_right)
    add_edge(x1, y1, x0, y1, noise_bottom)
    add_edge(x0, y1, x0, y0, noise_left)
    return points

def draw_topographic_frame_func(draw, px, py, s, color):
    cx, cy = px + 3.5*s, py + 3.5*s
    for y in range(int(py - 2*s), int(py + 9*s)):
        for x in range(int(px - 2*s), int(px + 9*s)):
            dx_dist = abs(x - cx) - 3.0*s
            dy_dist = abs(y - cy) - 3.0*s
            if dx_dist > 0 and dy_dist > 0:
                d = math.sqrt(dx_dist*dx_dist + dy_dist*dy_dist)
            elif dx_dist > 0:
                d = dx_dist
            elif dy_dist > 0:
                d = dy_dist
            else:
                d = max(dx_dist, dy_dist)
            
            noise = math.sin(x*0.1) + math.sin(y*0.1) + math.sin((x+y)*0.07) + math.cos((x-y)*0.05)
            height = d * 0.5 + noise * 5.0
            
            if height % 10 < 3:
                draw.point((x, y), fill=color)

def draw_crystal_frame_func(draw, px, py, s, color):
    for _ in range(40):
        side = random.randint(0, 3)
        if side == 0:
            bx, by = random.uniform(px, px+7*s), py
            dx, dy = random.uniform(-0.5, 0.5), -1
        elif side == 1:
            bx, by = px+7*s, random.uniform(py, py+7*s)
            dx, dy = 1, random.uniform(-0.5, 0.5)
        elif side == 2:
            bx, by = random.uniform(px, px+7*s), py+7*s
            dx, dy = random.uniform(-0.5, 0.5), 1
        else:
            bx, by = px, random.uniform(py, py+7*s)
            dx, dy = -1, random.uniform(-0.5, 0.5)
            
        length = random.randint(int(0.5*s), int(2.5*s))
        pts = [(bx, by)]
        cx2, cy2 = bx, by
        for _ in range(length):
            cx2 += dx * 3 + random.uniform(-2, 2)
            cy2 += dy * 3 + random.uniform(-2, 2)
            pts.append((cx2, cy2))
            
        draw.line(pts, fill=color, width=2, joint="curve")
        
        if random.random() > 0.5:
            cx3, cy3 = pts[len(pts)//2]
            dx2 = dx + random.uniform(-1, 1)
            dy2 = dy + random.uniform(-1, 1)
            pts2 = [(cx3, cy3)]
            for _ in range(length//2):
                cx3 += dx2 * 3
                cy3 += dy2 * 3
                pts2.append((cx3, cy3))
            draw.line(pts2, fill=color, width=2, joint="curve")
