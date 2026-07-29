import re

file_path = r'f:\Project 001\qr code generator 6\backend\services\qr_service.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'def analyze_qr_scannability', content)
if match:
    start_idx = match.start()
    
    new_func = '''def analyze_qr_scannability(data: str, params: dict) -> dict:
    """
    Generates a QR code from the data and params, and calculates its readability score.
    Returns:
        {"scannable": bool, "readability_score": int, "decoded_data": str, "error": str}
    """
    try:
        import copy
        structural_params = copy.deepcopy(params)
        # 1. Force Pure Structural (Black & White, No Gradients)
        structural_params['dots_color'] = '#000000'
        structural_params['bg_color'] = '#FFFFFF'
        structural_params['eye_color'] = '#000000'
        structural_params['eyeball_color'] = '#000000'
        structural_params['gradient_type'] = 'none'
        
        # We don't remove the logo, because the logo size physically destroys dots.
        # But we remove the color of the frame if it exists, to avoid contrast issues.
        structural_params['frame_color'] = '#000000'
        structural_params['frame_text_color'] = '#000000'
        structural_params['canvas_border_color'] = '#000000'

        # Generate the structurally pure image in memory
        png_io = generate_qr_image(data, structural_params)
        img_bytes = png_io.getvalue()
        
        # Convert bytes to cv2 image
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # 2. Base structural decode
        base_decoded = decode(img)
        
        if not base_decoded:
            return {
                "scannable": False,
                "readability_score": 0,
                "decoded_data": None,
                "error": "Structurally unreadable! The chosen shapes (dots, eyes) distort the QR code too much, or the logo is too large. Try changing styles or increasing the Error Correction level."
            }
            
        decoded_data = base_decoded[0].data.decode('utf-8')
        
        # 3. Granular Score Calculation (0-100)
        # We start at 0 and add 5 points for every degradation level it survives.
        score = 0
        
        # Test A: Progressive Shrinking (10 levels, max 50 points)
        # We scale from 1.0 down to 0.1 in steps of 0.1 (or 0.09).
        # We'll just test 10 specific scales.
        scales = [0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.1]
        for scale in scales:
            new_w, new_h = max(1, int(img.shape[1] * scale)), max(1, int(img.shape[0] * scale))
            shrunk = cv2.resize(img, (new_w, new_h))
            if decode(shrunk):
                score += 5
            else:
                break # If it fails at 0.65, it will fail at 0.55 too
                
        # Test B: Progressive Blurring (10 levels, max 50 points)
        kernels = [3, 5, 7, 9, 11, 13, 15, 19, 23, 27]
        for k in kernels:
            blurred = cv2.GaussianBlur(img, (k, k), 0)
            if decode(blurred):
                score += 5
            else:
                break
                
        # Ensure score is at least 10 if it passed base decode, and max 100
        final_score = max(10, min(100, score))
                
        return {
            "scannable": True,
            "readability_score": final_score,
            "decoded_data": decoded_data,
            "error": None
        }
    except Exception as e:
        return {
            "scannable": False,
            "readability_score": 0,
            "decoded_data": None,
            "error": f"An error occurred during structural scan test: {str(e)}"
        }
'''
    new_content = content[:start_idx] + new_func
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed qr_service.py!")
else:
    print("Could not find analyze_qr_scannability")
