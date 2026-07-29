import re

file_path = r'f:\Project 001\qr code generator 6\backend\services\qr_service.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's extract everything before analyze_qr_scannability
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
        # Generate the image in memory
        png_io = generate_qr_image(data, params)
        img_bytes = png_io.getvalue()
        
        # Convert bytes to cv2 image
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # 1. Base decode
        base_decoded = decode(img)
        required_fallback = False
        
        # 2. Try Fallbacks (simulate smarter cameras)
        if not base_decoded:
            required_fallback = True
            gray_for_fallback = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Fallback A: Increase contrast aggressively
            high_contrast = cv2.convertScaleAbs(gray_for_fallback, alpha=1.5, beta=0)
            base_decoded = decode(high_contrast)
            
            # Fallback B: Adaptive Thresholding (great for gradients)
            if not base_decoded:
                thresh = cv2.adaptiveThreshold(gray_for_fallback, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
                base_decoded = decode(thresh)
                
            # Fallback C: Add large white padding (Quiet Zone enforcement)
            if not base_decoded:
                padded = cv2.copyMakeBorder(gray_for_fallback, 50, 50, 50, 50, cv2.BORDER_CONSTANT, value=255)
                base_decoded = decode(padded)

        if not base_decoded:
            return {
                "scannable": False,
                "readability_score": 0,
                "decoded_data": None,
                "error": "The generated QR code is unreadable even with AI enhancement. Please increase contrast or simplify styles."
            }
            
        decoded_data = base_decoded[0].data.decode('utf-8')
        
        score = 80 if required_fallback else 100
        
        # Test resilience by blurring
        for k in [3, 5, 7, 9, 11, 15, 19]:
            blurred = cv2.GaussianBlur(img, (k, k), 0)
            if not decode(blurred):
                score -= 10
                break
                
        # Test resilience by shrinking
        for scale in [0.8, 0.6, 0.4, 0.3, 0.2]:
            new_w, new_h = max(1, int(img.shape[1] * scale)), max(1, int(img.shape[0] * scale))
            shrunk = cv2.resize(img, (new_w, new_h))
            if not decode(shrunk):
                score -= 10
                break
                
        # Test contrast resilience (convert to grayscale and reduce contrast)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        for alpha in [0.8, 0.6, 0.4, 0.2]:
            low_contrast = cv2.convertScaleAbs(gray, alpha=alpha, beta=128*(1-alpha))
            if not decode(low_contrast):
                score -= 10
                break
                
        return {
            "scannable": True,
            "readability_score": max(10, score),
            "decoded_data": decoded_data,
            "error": None
        }
    except Exception as e:
        return {
            "scannable": False,
            "readability_score": 0,
            "decoded_data": None,
            "error": f"An error occurred during scan test: {str(e)}"
        }
'''
    new_content = content[:start_idx] + new_func
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed qr_service.py!")
else:
    print("Could not find analyze_qr_scannability")
