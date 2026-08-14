import os
import re

base_dir = os.path.abspath("../frontend/public/previews")
options_path = os.path.abspath("../frontend/src/data/options.ts")

with open(options_path, "r", encoding="utf-8") as f:
    text = f.read()

dots = re.findall(r'"([a-zA-Z0-9_]+)"', text.split("DOT_STYLES = [")[1].split("];")[0])
eyes = re.findall(r'"([a-zA-Z0-9_]+)"', text.split("EYE_FRAME_STYLES = [")[1].split("];")[0])
eyeballs = re.findall(r'"([a-zA-Z0-9_]+)"', text.split("EYEBALL_STYLES = [")[1].split("];")[0])

missing_dots = [d for d in dots if not os.path.exists(os.path.join(base_dir, "dots", f"{d}.png"))]
missing_eyes = [e for e in eyes if not os.path.exists(os.path.join(base_dir, "eye_frames", f"{e}.png"))]
missing_eyeballs = [b for b in eyeballs if not os.path.exists(os.path.join(base_dir, "eyeballs", f"{b}.png"))]

print(f"Total dots in options: {len(dots)} | Missing: {len(missing_dots)} -> {missing_dots}")
print(f"Total eyes in options: {len(eyes)} | Missing: {len(missing_eyes)} -> {missing_eyes}")
print(f"Total eyeballs in options: {len(eyeballs)} | Missing: {len(missing_eyeballs)} -> {missing_eyeballs}")

tmpl_dir = os.path.join(base_dir, "templates")
tmpl_count = len([f for f in os.listdir(tmpl_dir) if f.endswith(".png")])
print(f"Total template preview PNGs in {tmpl_dir}: {tmpl_count}")
