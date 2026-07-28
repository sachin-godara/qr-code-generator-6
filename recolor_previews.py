import os
from PIL import Image

def recolor_dir(directory, target_color):
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return
        
    for filename in os.listdir(directory):
        if filename.endswith(".png"):
            filepath = os.path.join(directory, filename)
            try:
                img = Image.open(filepath).convert("RGBA")
                data = img.getdata()
                new_data = []
                
                # Check if it needs recoloring (has blue or black, we just recolor everything non-transparent to target_color)
                for item in data:
                    # item is (R, G, B, A)
                    if item[3] > 0: # If not fully transparent
                        # keep original alpha, change RGB to target_color
                        new_data.append(target_color + (item[3],))
                    else:
                        new_data.append(item)
                
                img.putdata(new_data)
                img.save(filepath, "PNG")
                print(f"Recolored: {filepath}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    target_color = (24, 24, 27) # #18181b (Sleek Black)
    
    base_dir = r"f:\Project 001\qr code generator 6\frontend\public\previews"
    
    recolor_dir(os.path.join(base_dir, "dots"), target_color)
    recolor_dir(os.path.join(base_dir, "eye_frames"), target_color)
    recolor_dir(os.path.join(base_dir, "eyeballs"), target_color)
    
    print("Done recoloring previews!")
