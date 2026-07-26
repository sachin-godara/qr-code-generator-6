import os

frame_engine_path = r"f:\Project 001\qr code generator 6\backend\frame_engine.py"
temp_frames_path = r"f:\Project 001\qr code generator 6\backend\temp_text_frames.py"

with open(temp_frames_path, "r", encoding="utf-8") as f:
    new_code = f.read()

with open(frame_engine_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace "    return qr_img\n\n\ndef apply_frame" with the new code + original return
target_str = "    return qr_img\n\n\ndef apply_frame"
if target_str in content:
    replacement = new_code + "\n    return qr_img\n\n\ndef apply_frame"
    new_content = content.replace(target_str, replacement)
    
    with open(frame_engine_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully injected text frames.")
else:
    print("Target string not found!")
