import cv2
import numpy as np
from pyzbar.pyzbar import decode, ZBarSymbol
import io
import logging
import os

logger = logging.getLogger(__name__)

# Global Detector Singletons
wechat_detector = None
_wechat_initialized = False
aruco_detector = None
standard_detector = None

def get_wechat_detector():
    global wechat_detector, _wechat_initialized
    if not _wechat_initialized and wechat_detector is None:
        _wechat_initialized = True
        try:
            models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "wechat_qr"))
            detect_prototxt = os.path.join(models_dir, "detect.prototxt")
            detect_caffe = os.path.join(models_dir, "detect.caffemodel")
            sr_prototxt = os.path.join(models_dir, "sr.prototxt")
            sr_caffe = os.path.join(models_dir, "sr.caffemodel")
            
            if os.path.exists(detect_prototxt) and os.path.exists(detect_caffe):
                wechat_detector = cv2.wechat_qrcode_WeChatQRCode(
                    detect_prototxt, detect_caffe, sr_prototxt, sr_caffe
                )
        except Exception as e:
            logger.debug(f"WeChat QR Detector unavailable or skipped: {e}")
    return wechat_detector

def get_aruco_detector():
    global aruco_detector
    if aruco_detector is None:
        try:
            if hasattr(cv2, "QRCodeDetectorAruco"):
                params = cv2.QRCodeDetectorAruco_Params()
                aruco_detector = cv2.QRCodeDetectorAruco(params)
        except Exception as e:
            logger.debug(f"Failed to initialize OpenCV ArUco Detector: {e}")
    return aruco_detector

def get_standard_detector():
    global standard_detector
    if standard_detector is None:
        try:
            if hasattr(cv2, "QRCodeDetector"):
                standard_detector = cv2.QRCodeDetector()
        except Exception as e:
            logger.debug(f"Failed to initialize OpenCV Standard Detector: {e}")
    return standard_detector

def pad_quiet_zone(img: np.ndarray, pad: int = 32) -> np.ndarray:
    """
    Adds synthetic white border margin (quiet zone) around the image.
    Essential for tightly cropped user uploads where finder patterns touch the edge.
    """
    if img is None:
        return img
    if len(img.shape) == 2:
        return cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=255)
    return cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=[255, 255, 255])

def try_decode(matrix: np.ndarray, allow_standard_opencv: bool = True, try_barcodes: bool = False) -> str | None:
    """
    Attempts decoding using available engines in order of resilience:
    1. WeChat Neural CNN (detects highly styled / decorated QRs)
    2. PyZbar (extremely fast raster line decoder)
    3. OpenCV ArUco Detector (specialized for occluded / damaged fiducials)
    4. OpenCV Standard Detector (gated by allow_standard_opencv to prevent latency stalls)
    """
    if matrix is None:
        return None

    # 1. WeChat CNN QR Detector
    wc = get_wechat_detector()
    if wc is not None:
        try:
            res, _ = wc.detectAndDecode(matrix)
            if res and len(res) > 0 and res[0]:
                return res[0]
        except Exception:
            pass

    # 2. PyZbar Scanner
    try:
        symbols = None if try_barcodes else [ZBarSymbol.QRCODE]
        decoded_objects = decode(matrix, symbols=symbols)
        if decoded_objects:
            text = decoded_objects[0].data.decode("utf-8", errors="replace")
            if text:
                return text
    except Exception:
        pass

    # 3. OpenCV ArUco Detector
    aruco = get_aruco_detector()
    if aruco is not None:
        try:
            res, _, _ = aruco.detectAndDecode(matrix)
            if res:
                return res
        except Exception:
            pass

    # 4. OpenCV Standard Detector
    if allow_standard_opencv:
        std = get_standard_detector()
        if std is not None:
            try:
                res, _, _ = std.detectAndDecode(matrix)
                if res:
                    return res
            except Exception:
                pass

    return None

# Backward compatibility alias
def attempt_decode(image_matrix) -> str | None:
    return try_decode(image_matrix)

def deep_scan_qr(file_bytes: bytes) -> str:
    """
    Applies a comprehensive waterfall of computer vision techniques to stubbornly scan
    damaged, shadowed, blurry, degraded, tight-cropped, or angled QR codes.
    Returns the decoded text, or raises an Exception if all passes fail.
    """
    try:
        # 1. Decode raw bytes into matrix
        nparr = np.frombuffer(file_bytes, np.uint8)
        raw_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if raw_img is None:
            raise ValueError("Could not decode image bytes into a valid image matrix.")
            
        # Prevent memory exhaustion & CPU latency stalls by bounding working resolution to 1000px
        h_img, w_img = raw_img.shape[:2]
        if max(h_img, w_img) > 1000:
            scale = 1000.0 / float(max(h_img, w_img))
            raw_img = cv2.resize(raw_img, (int(w_img * scale), int(h_img * scale)), interpolation=cv2.INTER_AREA)

        # 2. Quiet-Zone Auto-Padding (rescues tightly cropped screenshots)
        img = pad_quiet_zone(raw_img, 36)

        # PASS 0: Pristine RGB & Grayscale (Allow OpenCV standard detector)
        res = try_decode(img, allow_standard_opencv=True)
        if res: return res

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        res = try_decode(gray, allow_standard_opencv=True)
        if res: return res

        # PASS 1: WeChat Multi-Scale for tiny QR in large image
        wc = get_wechat_detector()
        if wc:
            h_pad, w_pad = img.shape[:2]
            if max(h_pad, w_pad) > 800:
                for scale in [0.75, 0.5, 0.33, 0.25]:
                    small_img = cv2.resize(img, (int(w_pad * scale), int(h_pad * scale)), interpolation=cv2.INTER_AREA)
                    try:
                        wc_res, _ = wc.detectAndDecode(small_img)
                        if wc_res and len(wc_res) > 0 and wc_res[0]:
                            return wc_res[0]
                    except Exception:
                        pass

        # PASS 2: CLAHE (Contrast-Limited Adaptive Histogram Equalization - Allow OpenCV detector)
        clahe = cv2.createCLAHE(clipLimit=3.5, tileGridSize=(8, 8))
        clahe_gray = clahe.apply(gray)
        res = try_decode(clahe_gray, allow_standard_opencv=True)
        if res: return res

        # PASS 3: Unsharp Masking (Sharpening for out-of-focus or motion-blurred camera frames)
        gaussian = cv2.GaussianBlur(gray, (0, 0), sigmaX=3.0)
        sharpened = cv2.addWeighted(gray, 1.8, gaussian, -0.8, 0)
        res = try_decode(sharpened, allow_standard_opencv=False)
        if res: return res

        # PASS 4: Bilateral Filtering (Edge-preserving noise and paper-texture suppression)
        bilateral = cv2.bilateralFilter(gray, 9, 75, 75)
        res = try_decode(bilateral, allow_standard_opencv=False)
        if res: return res

        # PASS 5: Adaptive & Multi-Threshold Passes
        # 5a: Otsu Optimal Global Threshold (Allow OpenCV detector)
        _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        res = try_decode(otsu, allow_standard_opencv=True)
        if res: return res

        # 5b: Adaptive Gaussian (window 11)
        adaptive11 = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        res = try_decode(adaptive11, allow_standard_opencv=False)
        if res: return res

        # 5c: Adaptive Gaussian (window 25 for broader module clusters)
        adaptive25 = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 25, 3)
        res = try_decode(adaptive25, allow_standard_opencv=False)
        if res: return res

        # 5d: Simple Threshold 127
        _, thresh127 = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
        res = try_decode(thresh127, allow_standard_opencv=False)
        if res: return res

        # 5e: Morphological Close (re-connects broken QR module blocks)
        kernel3 = np.ones((3, 3), np.uint8)
        closed = cv2.morphologyEx(thresh127, cv2.MORPH_CLOSE, kernel3)
        res = try_decode(closed, allow_standard_opencv=False)
        if res: return res

        # PASS 6: Morphological Thinning / Thickening
        # 6a: Thinning (helps printer ink bleed / over-inking where black modules bleed together)
        thinned = cv2.dilate(gray, kernel3)
        res = try_decode(thinned, allow_standard_opencv=False)
        if res: return res

        # 6b: Thickening (helps faint broken dots / starved ink)
        thickened = cv2.erode(gray, kernel3)
        res = try_decode(thickened, allow_standard_opencv=False)
        if res: return res

        # PASS 7: Inverted Passes (Dark Mode / White-on-Black QR codes)
        gray_inv = cv2.bitwise_not(gray)
        res = try_decode(gray_inv, allow_standard_opencv=False)
        if res: return res

        clahe_inv = clahe.apply(gray_inv)
        res = try_decode(clahe_inv, allow_standard_opencv=False)
        if res: return res

        _, thresh_inv = cv2.threshold(gray_inv, 127, 255, cv2.THRESH_BINARY)
        res = try_decode(thresh_inv, allow_standard_opencv=False)
        if res: return res

        adaptive_inv = cv2.adaptiveThreshold(gray_inv, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        res = try_decode(adaptive_inv, allow_standard_opencv=False)
        if res: return res

        # PASS 8: Multi-Angle Step Rotation Sweep
        # Fixes diagonal / rotated camera captures (PyZbar raster scanlines are horizontal)
        h_g, w_g = gray.shape[:2]
        center = (w_g / 2, h_g / 2)
        for angle in [45, 90, 135, 180, 225, 270, 315]:
            M_rot = cv2.getRotationMatrix2D(center, angle, 1.0)
            rot_gray = cv2.warpAffine(gray, M_rot, (w_g, h_g), borderValue=255)
            res = try_decode(rot_gray, allow_standard_opencv=False)
            if res: return res

            # Also try CLAHE on rotated
            rot_clahe = cv2.warpAffine(clahe_gray, M_rot, (w_g, h_g), borderValue=255)
            res = try_decode(rot_clahe, allow_standard_opencv=False)
            if res: return res

        # PASS 9: Aggressive Downscale/Upscale (Fixes tiny intricate artifacts)
        small = cv2.resize(gray, (w_g // 2, h_g // 2), interpolation=cv2.INTER_AREA)
        large = cv2.resize(small, (w_g, h_g), interpolation=cv2.INTER_CUBIC)
        res = try_decode(large, allow_standard_opencv=False)
        if res: return res

        res = try_decode(cv2.bitwise_not(large), allow_standard_opencv=False)
        if res: return res

        # PASS 10: 1D Barcode Fallback (Rescues UPC-A, EAN-13, Code-128, etc.)
        barcode_res = try_decode(gray, allow_standard_opencv=False, try_barcodes=True)
        if barcode_res: return barcode_res

    except Exception as e:
        logger.exception("Error in deep_scan_qr OpenCV processing")
        raise e
        
    raise ValueError("Deep Scan failed: No valid QR code detected after all passes.")
