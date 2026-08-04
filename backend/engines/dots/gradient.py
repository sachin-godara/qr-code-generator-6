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
            bg_lum = bg[0]*0.299 + bg[1]*0.587 + bg[2]*0.114
            if bg_lum < 128:
                self.paint_color = (255, 255, 255, 255) if len(bg) == 4 else (255, 255, 255)
        super().init_new_image()

class DiagonalGradiantColorMask(QRColorMask):
    """
    Fills in the foreground with a gradient sweeping diagonally from corner to corner.
    """
    def __init__(
        self, back_color=(255, 255, 255), start_color=(0, 0, 0), end_color=(0, 0, 255), direction="TL_BR"
    ):
        self.back_color = back_color
        self.start_color = start_color
        self.end_color = end_color
        self.direction = direction
        self.has_transparency = len(self.back_color) == 4

    def get_fg_pixel(self, image, x, y):
        width, height = image.size
        if width <= 0 or height <= 0:
            return self.start_color
        if self.direction == "TR_BL":
            ratio = ((width - x) / width + y / height) / 2.0
        else:
            ratio = (x / width + y / height) / 2.0
        ratio = max(0.0, min(1.0, ratio))
        return self.interp_color(self.start_color, self.end_color, ratio)
