import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw

OUTPUT_DIR = r"f:\Project 001\qr code generator 6\DEMOS_APPROACHES"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SIZE = 400
S = SIZE / 7.0  
CENTER = SIZE / 2.0
BG = (255, 255, 255)
FG = (0, 0, 0)
THICK = max(1, int(S * 1.1))
R0 = 3.5 * S

def create_blank():
    return Image.new('RGB', (SIZE, SIZE), BG)

# APPROACH 1: Signed Distance Fields (SDF) & Metaballs
# Instead of drawing paths, we evaluate a mathematical distance field per pixel.
# This allows for "liquid" blending and perfect stroke offsets.
def generate_sdf():
    # Evaluate SDF on a grid
    y, x = np.ogrid[0:SIZE, 0:SIZE]
    
    # Center coordinates
    cx, cy = CENTER, CENTER
    
    # Distance to a square
    dx = np.abs(x - cx) - (R0 - THICK)
    dy = np.abs(y - cy) - (R0 - THICK)
    dist_square = np.sqrt(np.maximum(dx, 0)**2 + np.maximum(dy, 0)**2) + np.minimum(np.maximum(dx, dy), 0)
    
    # Distance to 4 corner circles (Metaballs)
    r_circle = 1.5 * S
    c1 = np.sqrt((x - (cx - R0 + r_circle))**2 + (y - (cy - R0 + r_circle))**2) - r_circle
    c2 = np.sqrt((x - (cx + R0 - r_circle))**2 + (y - (cy - R0 + r_circle))**2) - r_circle
    c3 = np.sqrt((x - (cx - R0 + r_circle))**2 + (y - (cy + R0 - r_circle))**2) - r_circle
    c4 = np.sqrt((x - (cx + R0 - r_circle))**2 + (y - (cy + R0 - r_circle))**2) - r_circle
    
    # Smooth minimum (polynomial smin) to blend shapes like liquid
    def smin(a, b, k=20.0):
        h = np.maximum(k - np.abs(a - b), 0.0) / k
        return np.minimum(a, b) - h * h * k * (1.0 / 4.0)
        
    d = dist_square
    d = smin(d, c1)
    d = smin(d, c2)
    d = smin(d, c3)
    d = smin(d, c4)
    
    # To make a frame, we take the absolute value of the distance minus a thickness
    frame_dist = np.abs(d) - THICK/2
    
    # Render
    mask = (frame_dist < 0).astype(np.uint8) * 255
    
    # Create image
    img = Image.new('RGB', (SIZE, SIZE), BG)
    mask_img = Image.fromarray(mask, mode='L')
    img.paste(FG, (0, 0), mask_img)
    img.save(os.path.join(OUTPUT_DIR, "01_sdf_metaball.png"))

# APPROACH 2: Cellular Automata Growth
# Start with a basic outline, and run a cellular automaton to "grow" organic/tech appendages.
def generate_cellular():
    grid = np.zeros((SIZE, SIZE), dtype=np.uint8)
    
    # Draw basic thick square on grid
    inner = int(CENTER - R0 + THICK)
    outer = int(CENTER + R0 - THICK)
    grid[inner:outer, inner:outer] = 1
    grid[inner+THICK:outer-THICK, inner+THICK:outer-THICK] = 0
    
    # Add random seeds along the border
    for i in range(200):
        rx = random.randint(inner-10, outer+10)
        ry = random.randint(inner-10, outer+10)
        if grid[ry, rx] == 0:
            grid[ry, rx] = random.choice([0, 1])
            
    # Run simple Game of Life-like rules
    for step in range(5): # run a few generations
        neighbors = sum(np.roll(np.roll(grid, i, 0), j, 1)
                     for i in (-1, 0, 1) for j in (-1, 0, 1)
                     if (i != 0 or j != 0))
        # Rule: B3/S234 (organic/maze-like growth)
        grid = (neighbors == 3) | (grid & ((neighbors == 2) | (neighbors == 3) | (neighbors == 4)))
        
    mask = (grid * 255).astype(np.uint8)
    # Mask out the very center to keep eyeball area clear
    mask[int(CENTER - 1.5*S):int(CENTER + 1.5*S), int(CENTER - 1.5*S):int(CENTER + 1.5*S)] = 0
    
    img = Image.new('RGB', (SIZE, SIZE), BG)
    mask_img = Image.fromarray(mask, mode='L')
    img.paste(FG, (0, 0), mask_img)
    img.save(os.path.join(OUTPUT_DIR, "02_cellular_automata.png"))

# APPROACH 3: Voronoi Shatter / Delaunay
# Break the frame into crystalline geometric shards using Voronoi cells
def generate_voronoi():
    img = create_blank()
    draw = ImageDraw.Draw(img)
    
    from scipy.spatial import Voronoi
    
    # Generate random points clustered around the frame radius
    points = []
    for _ in range(100):
        angle = random.uniform(0, 2*math.pi)
        r = R0 + random.uniform(-THICK*1.5, THICK*1.5)
        points.append([CENTER + r*math.cos(angle), CENTER + r*math.sin(angle)])
        
    # Add boundary points so Voronoi doesn't go to infinity
    points += [[-SIZE, -SIZE], [SIZE*2, -SIZE], [-SIZE, SIZE*2], [SIZE*2, SIZE*2]]
    
    vor = Voronoi(points)
    
    # Draw valid finite regions that fall within our "frame" thickness
    for region_index in vor.point_region:
        region = vor.regions[region_index]
        if -1 not in region and len(region) > 0:
            polygon = [vor.vertices[i] for i in region]
            # Check if polygon centroid is near our frame
            cx = sum(p[0] for p in polygon) / len(polygon)
            cy = sum(p[1] for p in polygon) / len(polygon)
            
            # If centroid is between R0-THICK and R0, draw it
            dist = max(abs(cx - CENTER), abs(cy - CENTER)) # square distance
            if R0 - THICK*1.5 <= dist <= R0 + THICK*0.5:
                # randomly fill some, outline others, or leave gaps
                if random.random() > 0.1:
                    p_tuples = [(p[0], p[1]) for p in polygon]
                    # shrink polygon slightly for shatter effect
                    scaled_poly = [(cx + (p[0]-cx)*0.85, cy + (p[1]-cy)*0.85) for p in p_tuples]
                    draw.polygon(scaled_poly, fill=FG)
                    
    img.save(os.path.join(OUTPUT_DIR, "03_voronoi_shatter.png"))

# APPROACH 4: L-System Fractal Grammars
# Using a turtle graphics approach to trace a recursive fractal border
def generate_lsystem():
    img = create_blank()
    draw = ImageDraw.Draw(img)
    
    # Koch Snowflake / Quadratic Type 1
    axiom = "F+F+F+F"
    rules = {"F": "F-F+F+F-F"} # Minkowski sausage
    
    # Iterate
    sentence = axiom
    for _ in range(2): # depth
        next_sentence = ""
        for char in sentence:
            next_sentence += rules.get(char, char)
        sentence = next_sentence
        
    # Draw (Turtle)
    x = CENTER - R0 + THICK
    y = CENTER - R0 + THICK
    angle = 0
    step = (2 * (R0 - THICK)) / 9 # calculate step size based on depth
    
    pts = [(x, y)]
    for char in sentence:
        if char == "F":
            x += step * math.cos(math.radians(angle))
            y += step * math.sin(math.radians(angle))
            pts.append((x, y))
        elif char == "+":
            angle += 90
        elif char == "-":
            angle -= 90
            
    # Draw the thick path
    draw.line(pts, fill=FG, width=int(THICK*0.6), joint="curve")
    img.save(os.path.join(OUTPUT_DIR, "04_fractal_lsystem.png"))

def main():
    print("Generating SDF Metaball...")
    generate_sdf()
    print("Generating Cellular Automata...")
    generate_cellular()
    print("Generating Voronoi Shatter...")
    try:
        generate_voronoi()
    except Exception as e:
        print("Scipy not available, skipping Voronoi:", e)
    print("Generating L-System Fractal...")
    generate_lsystem()
    print(f"Done! Saved to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
