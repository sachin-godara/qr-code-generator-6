import cv2
import numpy as np
from pyzbar.pyzbar import decode, ZBarSymbol
import io
import logging

logger = logging.getLogger(__name__)

def attempt_decode(image_matrix) -> str:
    """Helper to try pyzbar decode on a given matrix"""
    # Try just QR codes first to avoid false positives and speed up
    decoded_objects = decode(image_matrix, symbols=[ZBarSymbol.QRCODE])
    if decoded_objects:
        return decoded_objects[0].data.decode('utf-8')
    return None

def deep_scan_qr(file_bytes: bytes) -> str:
    """
    Applies a waterfall of computer vision techniques to stubbornly scan a QR code.
    Returns the decoded text, or raises an Exception if all passes fail.
    """
    try:
        # Convert raw bytes to numpy array for cv2
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image bytes into a valid image matrix.")
            
        # 1. Clean Pristine Pass (RGB)
        result = attempt_decode(img)
        if result: return result
        
        # Convert to Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 2. Pristine Grayscale
        result = attempt_decode(gray)
        if result: return result
        
        # Helper lists for filters
        passes = []
        
        # Pass A: Simple Thresholding
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
        passes.append(thresh)
        
        # Pass B: Adaptive Thresholding (great for gradients and shadows)
        adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        passes.append(adaptive)
        
        # Pass C: Blur to reduce noise (like stars or hearts acting as dots)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        passes.append(blurred)
        
        # Pass D: Morphological Close (dilates then erodes, solidifying broken QR blocks)
        kernel = np.ones((3,3), np.uint8)
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        passes.append(closed)
        
        # Try all passes normally
        for p in passes:
            result = attempt_decode(p)
            if result: return result
            
        # Try all passes INVERTED (Fixes Dark Mode QR Codes)
        # We invert the original grayscale and then recreate the passes to be thorough
        gray_inv = cv2.bitwise_not(gray)
        
        result = attempt_decode(gray_inv)
        if result: return result
        
        # Inverted Simple Thresh
        _, thresh_inv = cv2.threshold(gray_inv, 127, 255, cv2.THRESH_BINARY)
        result = attempt_decode(thresh_inv)
        if result: return result
        
        # Inverted Adaptive
        adaptive_inv = cv2.adaptiveThreshold(gray_inv, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        result = attempt_decode(adaptive_inv)
        if result: return result
        
        # Inverted Blur
        blurred_inv = cv2.GaussianBlur(gray_inv, (5, 5), 0)
        result = attempt_decode(blurred_inv)
        if result: return result

        # Pass E: Aggressive Downscale/Upscale (Fixes tiny intricate artifacts)
        h, w = gray.shape
        small = cv2.resize(gray, (w // 2, h // 2), interpolation=cv2.INTER_AREA)
        large = cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC)
        
        result = attempt_decode(large)
        if result: return result
        
        result = attempt_decode(cv2.bitwise_not(large))
        if result: return result

    except Exception as e:
        logger.exception("Error in deep_scan_qr OpenCV processing")
        raise e
        
    raise ValueError("Deep Scan failed: No valid QR code detected after all passes.")
