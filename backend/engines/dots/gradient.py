import numpy as np
from PIL import Image
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import QRColorMask

class CustomStyledPilImage(StyledPilImage):
    """
    Subclass of StyledPilImage that fixes the python qrcode library bug on dark backgrounds.
    When back_color is dark, self.paint_color must be light/white so module drawing is distinct
    from back_color during extrapolation.
    """
    def init_new_image(self):
        if hasattr(self, 'color_mask') and hasattr(self.color_mask, 'back_color'):
            bg = self.color_mask.back_color
            bg_lum = bg[0] * 0.299 + bg[1] * 0.587 + bg[2] * 0.114
            if bg_lum < 128:
                self.paint_color = (255, 255, 255, 255) if len(bg) == 4 else (255, 255, 255)
        super().init_new_image()

class FastQRColorMask(QRColorMask):
    """
    High-performance base class for vectorized color masks that replaces the slow
    pure-Python pixel-by-pixel loop with C-speed NumPy array math and PIL operations.
    """
    def __init__(self, back_color=(255, 255, 255)):
        self.back_color = back_color
        self.has_transparency = len(self.back_color) == 4
        self.paint_color = (0, 0, 0)

    def generate_fg_gradient(self, width: int, height: int) -> np.ndarray:
        raise NotImplementedError

    def apply_mask(self, image: Image.Image, use_cache: bool = False):
        width, height = image.size
        img_arr = np.array(image.convert("RGBA"), dtype=np.float32)
        
        bg_rgb = np.array(self.back_color[:3], dtype=np.float32)
        paint_rgb = np.array(self.paint_color[:3], dtype=np.float32)
        
        diff_total = np.linalg.norm(paint_rgb - bg_rgb)
        if diff_total < 1e-3:
            norm = np.ones((height, width, 1), dtype=np.float32)
        else:
            diff_curr = np.linalg.norm(img_arr[:, :, :3] - bg_rgb, axis=2, keepdims=True)
            norm = np.clip(diff_curr / diff_total, 0.0, 1.0)
            
        fg_grad = self.generate_fg_gradient(width, height)
        
        # Blend RGB: (1 - norm) * bg + norm * fg
        result_rgb = (1.0 - norm) * bg_rgb + norm * fg_grad
        
        if self.has_transparency:
            bg_a = float(self.back_color[3]) if len(self.back_color) > 3 else 0.0
            alpha = (1.0 - norm) * bg_a + norm * 255.0
        else:
            alpha = np.full((height, width, 1), 255.0, dtype=np.float32)
            
        final_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
        image.paste(Image.fromarray(final_arr, "RGBA"))

class FastSolidFillColorMask(FastQRColorMask):
    def __init__(self, back_color=(255, 255, 255), front_color=(0, 0, 0)):
        super().__init__(back_color=back_color)
        self.front_color = front_color

    def generate_fg_gradient(self, width: int, height: int) -> np.ndarray:
        fg = np.array(self.front_color[:3], dtype=np.float32)
        return np.broadcast_to(fg, (height, width, 3))

class FastVerticalGradientColorMask(FastQRColorMask):
    def __init__(self, back_color=(255, 255, 255), top_color=(0, 0, 0), bottom_color=(0, 0, 0)):
        super().__init__(back_color=back_color)
        self.top_color = top_color
        self.bottom_color = bottom_color

    def generate_fg_gradient(self, width: int, height: int) -> np.ndarray:
        t = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None, None]
        top = np.array(self.top_color[:3], dtype=np.float32)
        bot = np.array(self.bottom_color[:3], dtype=np.float32)
        grad_col = top * (1.0 - t) + bot * t
        return np.tile(grad_col, (1, width, 1))

class FastHorizontalGradientColorMask(FastQRColorMask):
    def __init__(self, back_color=(255, 255, 255), left_color=(0, 0, 0), right_color=(0, 0, 0)):
        super().__init__(back_color=back_color)
        self.left_color = left_color
        self.right_color = right_color

    def generate_fg_gradient(self, width: int, height: int) -> np.ndarray:
        t = np.linspace(0.0, 1.0, width, dtype=np.float32)[None, :, None]
        left = np.array(self.left_color[:3], dtype=np.float32)
        right = np.array(self.right_color[:3], dtype=np.float32)
        grad_row = left * (1.0 - t) + right * t
        return np.tile(grad_row, (height, 1, 1))

class FastRadialGradientColorMask(FastQRColorMask):
    def __init__(self, back_color=(255, 255, 255), center_color=(0, 0, 0), edge_color=(0, 0, 0)):
        super().__init__(back_color=back_color)
        self.center_color = center_color
        self.edge_color = edge_color

    def generate_fg_gradient(self, width: int, height: int) -> np.ndarray:
        y, x = np.ogrid[:height, :width]
        cx, cy = (width - 1) / 2.0, (height - 1) / 2.0
        max_r = np.sqrt(cx * cx + cy * cy)
        dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        t = np.clip(dist / max_r, 0.0, 1.0)[:, :, None].astype(np.float32)
        
        center = np.array(self.center_color[:3], dtype=np.float32)
        edge = np.array(self.edge_color[:3], dtype=np.float32)
        return center * (1.0 - t) + edge * t

class DiagonalGradiantColorMask(FastQRColorMask):
    """
    Fills in the foreground with a gradient sweeping diagonally from corner to corner.
    Vectorized with NumPy for ultra-fast C-speed execution.
    """
    def __init__(
        self, back_color=(255, 255, 255), start_color=(0, 0, 0), end_color=(0, 0, 255), direction="TL_BR"
    ):
        super().__init__(back_color=back_color)
        self.start_color = start_color
        self.end_color = end_color
        self.direction = direction

    def generate_fg_gradient(self, width: int, height: int) -> np.ndarray:
        y, x = np.ogrid[:height, :width]
        if self.direction == "TR_BL":
            ratio = (((width - 1 - x) / max(1, width - 1)) + (y / max(1, height - 1))) / 2.0
        else:
            ratio = ((x / max(1, width - 1)) + (y / max(1, height - 1))) / 2.0
        t = np.clip(ratio, 0.0, 1.0)[:, :, None].astype(np.float32)
        
        start = np.array(self.start_color[:3], dtype=np.float32)
        end = np.array(self.end_color[:3], dtype=np.float32)
        return start * (1.0 - t) + end * t
