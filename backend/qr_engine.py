import qrcode
import math
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import (
    SquareModuleDrawer, GappedSquareModuleDrawer, CircleModuleDrawer,
    RoundedModuleDrawer, VerticalBarsDrawer, HorizontalBarsDrawer
)
from qrcode.image.styles.colormasks import SolidFillColorMask, VerticalGradiantColorMask, HorizontalGradiantColorMask, RadialGradiantColorMask
from PIL import Image, ImageDraw

import os
import fitz

PRESET_LOGO_BRAND_COLORS = {
    "link": "#6d28d9",
    "location": "#dc2626",
    "wifi": "#0f766e",
    "vcard": "#1d4ed8",
    "email": "#d97706",
    "scan": "#be185d",
    "whatsapp": "#25d366",
    "instagram": "#e1306c",
    "facebook": "#1877f2",
    "youtube": "#ff0000",
    "phone": "#10b981",
    "coffee": "#d97706",
    "shopping": "#8b5cf6",
    "music": "#06b6d4",
    "globe": "#3b82f6",
    "heart": "#f43f5e",
    "star": "#f59e0b",
    "calendar": "#0ea5e9",
    "payment": "#10b981",
    "store": "#f97316",
    "chat": "#3b82f6",
    "app": "#8b5cf6",
    "discord": "#5865f2"
}

def generate_preset_logo(name, color=(0,0,0)):
    svg_path = os.path.join(os.path.dirname(__file__), "assets", "preset_logos", f"{name.lower()}.svg")
    
    if not os.path.exists(svg_path):
        return None
        
    try:
        with open(svg_path, "r", encoding="utf-8") as f:
            svg_content = f.read()
            
        hex_color = "#{:02x}{:02x}{:02x}".format(*color)
        svg_content = svg_content.replace('currentColor', hex_color)
        
        doc = fitz.open("svg", svg_content.encode('utf-8'))
        page = doc[0]
        
        # Original QR code generation used 1000x1000, resized to 200x200
        # PyMuPDF uses the viewBox. Our viewBox is 24x24.
        # We'll render directly to a 200x200 image.
        mat = fitz.Matrix(200 / 24, 200 / 24)
        pix = page.get_pixmap(matrix=mat, alpha=True)
        img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
        
        # Create a padded 200x200 image just in case dimensions are off
        out_img = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
        offset = ((200 - img.width) // 2, (200 - img.height) // 2)
        out_img.paste(img, offset, img)
        return out_img
    except Exception as e:
        print(f"Error generating preset logo: {e}")
        return None

from qrcode.image.styles.moduledrawers.pil import StyledPilQRModuleDrawer, ANTIALIASING_FACTOR

class DiamondModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.diamond = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.diamond)
        p1 = (fake_size // 2, 0)
        p2 = (fake_size - 1, fake_size // 2)
        p3 = (fake_size // 2, fake_size - 1)
        p4 = (0, fake_size // 2)
        draw.polygon([p1, p2, p3, p4], fill=self.img.paint_color)
        self.diamond = self.diamond.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.diamond, (box[0][0], box[0][1]))

class RingModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.ring = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.ring)
        draw.ellipse((0, 0, fake_size - 1, fake_size - 1), fill=self.img.paint_color)
        draw.ellipse((fake_size // 4, fake_size // 4, 3 * fake_size // 4 - 1, 3 * fake_size // 4 - 1), fill=self.img.color_mask.back_color)
        self.ring = self.ring.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.ring, (box[0][0], box[0][1]))

class StarModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.star = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.star)
        cx = fake_size // 2
        cy = fake_size // 2
        r = fake_size // 2
        r_inner = fake_size // 5
        pts = [
            (cx, cy - r),
            (cx + r_inner, cy - r_inner),
            (cx + r, cy),
            (cx + r_inner, cy + r_inner),
            (cx, cy + r),
            (cx - r_inner, cy + r_inner),
            (cx - r, cy),
            (cx - r_inner, cy - r_inner),
        ]
        draw.polygon(pts, fill=self.img.paint_color)
        self.star = self.star.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.star, (box[0][0], box[0][1]))

class FlowerCutModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        draw.rectangle([0, 0, fake_size - 1, fake_size - 1], fill=self.img.paint_color)
        cut_r = fake_size // 6
        mid = fake_size // 2
        draw.ellipse([mid - cut_r, -cut_r, mid + cut_r, cut_r], fill=self.img.color_mask.back_color)
        draw.ellipse([mid - cut_r, fake_size - cut_r, mid + cut_r, fake_size + cut_r], fill=self.img.color_mask.back_color)
        draw.ellipse([-cut_r, mid - cut_r, cut_r, mid + cut_r], fill=self.img.color_mask.back_color)
        draw.ellipse([fake_size - cut_r, mid - cut_r, fake_size + cut_r, mid + cut_r], fill=self.img.color_mask.back_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class CloverModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        cx = fake_size // 2
        cy = fake_size // 2
        cr = fake_size // 6
        draw.ellipse([cx - cr, cy - 0.4*fake_size, cx + cr, cy - 0.05*fake_size], fill=self.img.paint_color)
        draw.ellipse([cx - cr, cy + 0.05*fake_size, cx + cr, cy + 0.4*fake_size], fill=self.img.paint_color)
        draw.ellipse([cx - 0.4*fake_size, cy - cr, cx - 0.05*fake_size, cy + cr], fill=self.img.paint_color)
        draw.ellipse([cx + 0.05*fake_size, cy - cr, cx + 0.4*fake_size, cy + cr], fill=self.img.paint_color)
        draw.rectangle([cx - 0.15*fake_size, cy - 0.15*fake_size, cx + 0.15*fake_size, cy + 0.15*fake_size], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class PlusModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        w = fake_size // 3
        draw.rectangle([0, w, fake_size - 1, fake_size - w - 1], fill=self.img.paint_color)
        draw.rectangle([w, 0, fake_size - w - 1, fake_size - 1], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class RoundedPlusModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        w = fake_size // 3
        r = w // 2
        draw.rounded_rectangle([0, w, fake_size - 1, fake_size - w - 1], radius=r, fill=self.img.paint_color)
        draw.rounded_rectangle([w, 0, fake_size - w - 1, fake_size - 1], radius=r, fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class HeartModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        cx = fake_size // 2
        cy = fake_size // 2
        hr = fake_size // 4
        draw.ellipse([fake_size//2 - 2*hr, fake_size//8, fake_size//2, fake_size//8 + 2*hr], fill=self.img.paint_color)
        draw.ellipse([fake_size//2, fake_size//8, fake_size//2 + 2*hr, fake_size//8 + 2*hr], fill=self.img.paint_color)
        draw.polygon([(0, fake_size//8 + hr), (fake_size - 1, fake_size//8 + hr), (fake_size//2, fake_size - fake_size//8)], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class ShearedModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        offset = fake_size // 5
        p1 = (offset, 0)
        p2 = (fake_size - 1, 0)
        p3 = (fake_size - 1 - offset, fake_size - 1)
        p4 = (0, fake_size - 1)
        draw.polygon([p1, p2, p3, p4], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class BevelModuleDrawer(StyledPilQRModuleDrawer):
    needs_neighbors = True
    
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        self.corner_width = int(self.img.box_size / 2)
        self.setup_corners()
        
    def setup_corners(self):
        mode = self.img.mode
        back_color = self.img.color_mask.back_color
        front_color = self.img.paint_color
        self.SQUARE = Image.new(mode, (self.corner_width, self.corner_width), front_color)
        
        fake_width = self.corner_width * ANTIALIASING_FACTOR
        base = Image.new(mode, (fake_width, fake_width), back_color)
        base_draw = ImageDraw.Draw(base)
        p1 = (fake_width - 1, 0)
        p2 = (fake_width - 1, fake_width - 1)
        p3 = (0, fake_width - 1)
        base_draw.polygon([p1, p2, p3], fill=front_color)
        
        self.NW_BEVEL = base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        self.SW_BEVEL = self.NW_BEVEL.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        self.SE_BEVEL = self.NW_BEVEL.transpose(Image.Transpose.ROTATE_180)
        self.NE_BEVEL = self.NW_BEVEL.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active:
            return
        nw_beveled = not is_active.W and not is_active.N
        ne_beveled = not is_active.N and not is_active.E
        se_beveled = not is_active.E and not is_active.S
        sw_beveled = not is_active.S and not is_active.W
        
        nw = self.NW_BEVEL if nw_beveled else self.SQUARE
        ne = self.NE_BEVEL if ne_beveled else self.SQUARE
        se = self.SE_BEVEL if se_beveled else self.SQUARE
        sw = self.SW_BEVEL if sw_beveled else self.SQUARE
        
        self.img._img.paste(nw, (box[0][0], box[0][1]))
        self.img._img.paste(ne, (box[0][0] + self.corner_width, box[0][1]))
        self.img._img.paste(se, (box[0][0] + self.corner_width, box[0][1] + self.corner_width))
        self.img._img.paste(sw, (box[0][0], box[0][1] + self.corner_width))

class FishtailModuleDrawer(StyledPilQRModuleDrawer):
    needs_neighbors = True
    
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active:
            return
            
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        
        cell = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.paint_color,
        )
        draw = ImageDraw.Draw(cell)
        back_color = self.img.color_mask.back_color
        
        if not is_active.N:
            p1 = (0, 0)
            p2 = (fake_size // 2, fake_size // 4)
            p3 = (fake_size - 1, 0)
            draw.polygon([p1, p2, p3], fill=back_color)
            
        if not is_active.S:
            p1 = (0, fake_size - 1)
            p2 = (fake_size // 2, 3 * fake_size // 4)
            p3 = (fake_size - 1, fake_size - 1)
            draw.polygon([p1, p2, p3], fill=back_color)
            
        if not is_active.W:
            p1 = (0, 0)
            p2 = (fake_size // 4, fake_size // 2)
            p3 = (0, fake_size - 1)
            draw.polygon([p1, p2, p3], fill=back_color)
            
        if not is_active.E:
            p1 = (fake_size - 1, 0)
            p2 = (3 * fake_size // 4, fake_size // 2)
            p3 = (fake_size - 1, fake_size - 1)
            draw.polygon([p1, p2, p3], fill=back_color)
            
        cell_resized = cell.resize((box_size, box_size), Image.Resampling.LANCZOS)
        self.img._img.paste(cell_resized, (box[0][0], box[0][1]))

class SquircleModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        
        cx = fake_size / 2
        cy = fake_size / 2
        rx = (fake_size - 2) / 2
        ry = (fake_size - 2) / 2
        n = 3.0
        pts = []
        for i in range(120):
            theta = i * 2 * math.pi / 120
            cos_t = math.cos(theta)
            sin_t = math.sin(theta)
            x = cx + rx * (abs(cos_t) ** (2/n)) * (1 if cos_t >= 0 else -1)
            y = cy + ry * (abs(sin_t) ** (2/n)) * (1 if sin_t >= 0 else -1)
            pts.append((x, y))
        draw.polygon(pts, fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class HexagonModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        
        cx = fake_size // 2
        r = fake_size // 2
        h = int(r * math.sqrt(3) / 2)
        
        p1 = (cx - r // 2, cx - h)
        p2 = (cx + r // 2, cx - h)
        p3 = (fake_size - 1, cx)
        p4 = (cx + r // 2, cx + h)
        p5 = (cx - r // 2, cx + h)
        p6 = (0, cx)
        
        draw.polygon([p1, p2, p3, p4, p5, p6], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class TargetBullseyeModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        
        draw.ellipse([0, 0, fake_size - 1, fake_size - 1], fill=self.img.paint_color)
        hole_start = fake_size // 5
        hole_end = fake_size - hole_start - 1
        draw.ellipse([hole_start, hole_start, hole_end, hole_end], fill=self.img.color_mask.back_color)
        dot_start = fake_size // 3
        dot_end = fake_size - dot_start - 1
        draw.ellipse([dot_start, dot_start, dot_end, dot_end], fill=self.img.paint_color)
        
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class DiamondTargetModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        
        p1 = (fake_size // 2, 0)
        p2 = (fake_size - 1, fake_size // 2)
        p3 = (fake_size // 2, fake_size - 1)
        p4 = (0, fake_size // 2)
        draw.polygon([p1, p2, p3, p4], fill=self.img.paint_color)
        
        offset1 = fake_size // 5
        h1 = (fake_size // 2, offset1)
        h2 = (fake_size - 1 - offset1, fake_size // 2)
        h3 = (fake_size // 2, fake_size - 1 - offset1)
        h4 = (offset1, fake_size // 2)
        draw.polygon([h1, h2, h3, h4], fill=self.img.color_mask.back_color)
        
        offset2 = fake_size // 3
        d1 = (fake_size // 2, offset2)
        d2 = (fake_size - 1 - offset2, fake_size // 2)
        d3 = (fake_size // 2, fake_size - 1 - offset2)
        d4 = (offset2, fake_size // 2)
        draw.polygon([d1, d2, d3, d4], fill=self.img.paint_color)
        
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class OctagonModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        d = fake_size // 4
        pts = [
            (d, 0), (fake_size - 1 - d, 0),
            (fake_size - 1, d), (fake_size - 1, fake_size - 1 - d),
            (fake_size - 1 - d, fake_size - 1), (d, fake_size - 1),
            (0, fake_size - 1 - d), (0, d)
        ]
        draw.polygon(pts, fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class DottedCrossModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        cx = fake_size // 2
        cy = fake_size // 2
        r = max(2, fake_size // 8)
        
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=self.img.paint_color)
        offset = fake_size // 3
        draw.ellipse([cx - r, cy - offset - r, cx + r, cy - offset + r], fill=self.img.paint_color)
        draw.ellipse([cx - r, cy + offset - r, cx + r, cy + offset + r], fill=self.img.paint_color)
        draw.ellipse([cx - offset - r, cy - r, cx - offset + r, cy + r], fill=self.img.paint_color)
        draw.ellipse([cx + offset - r, cy - r, cx + offset + r, cy + r], fill=self.img.paint_color)
        
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class ArrowModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        p1 = (fake_size // 2, 0)
        p2 = (fake_size - 1, fake_size - 1)
        p3 = (fake_size // 2, 3 * fake_size // 4)
        p4 = (0, fake_size - 1)
        draw.polygon([p1, p2, p3, p4], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class GearDotModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        cx = fake_size // 2
        cy = fake_size // 2
        r = fake_size // 4
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=self.img.paint_color)
        t_w = max(2, fake_size // 8)
        for i in range(6):
            angle = i * math.pi / 3
            tx = cx + 1.2 * r * math.cos(angle)
            ty = cy + 1.2 * r * math.sin(angle)
            draw.rectangle([tx - t_w // 2, ty - t_w // 2, tx + t_w // 2, ty + t_w // 2], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class HourglassModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        pts = [
            (0, 0), (fake_size - 1, 0),
            (fake_size // 2, fake_size // 2),
            (fake_size - 1, fake_size - 1), (0, fake_size - 1)
        ]
        draw.polygon(pts, fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class PinwheelModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        cx = fake_size // 2
        cy = fake_size // 2
        draw.polygon([(cx, cy), (cx, 0), (cx // 2, 0)], fill=self.img.paint_color)
        draw.polygon([(cx, cy), (fake_size - 1, cy), (fake_size - 1, cy // 2)], fill=self.img.paint_color)
        draw.polygon([(cx, cy), (cx, fake_size - 1), (cx + cx // 2, fake_size - 1)], fill=self.img.paint_color)
        draw.polygon([(cx, cy), (0, cy), (0, cy + cy // 2)], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class LeafDropletModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        draw.ellipse([0, 0, fake_size - 1, fake_size - 1], fill=self.img.paint_color)
        draw.polygon([(0, 0), (fake_size // 2, 0), (0, fake_size // 2)], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class PillowModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        margin = fake_size // 8
        draw.ellipse([0, margin, fake_size - 1, fake_size - margin - 1], fill=self.img.paint_color)
        draw.ellipse([margin, 0, fake_size - margin - 1, fake_size - 1], fill=self.img.paint_color)
        draw.rectangle([margin, margin, fake_size - margin - 1, fake_size - margin - 1], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class QuadDotsModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        pad = fake_size // 10
        r = (fake_size // 2) - pad
        draw.ellipse([pad, pad, pad + r * 2, pad + r * 2], fill=self.img.paint_color)
        draw.ellipse([fake_size // 2 + pad, pad, fake_size // 2 + pad + r * 2, pad + r * 2], fill=self.img.paint_color)
        draw.ellipse([pad, fake_size // 2 + pad, pad + r * 2, fake_size // 2 + pad + r * 2], fill=self.img.paint_color)
        draw.ellipse([fake_size // 2 + pad, fake_size // 2 + pad, fake_size // 2 + pad + r * 2, fake_size // 2 + pad + r * 2], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class TechChevronModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        w = fake_size // 3
        draw.polygon([(0, 0), (fake_size - 1, 0), (fake_size - 1, w), (w, w), (w, fake_size - 1), (0, fake_size - 1)], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class SparkleModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(
            self.img.mode,
            (fake_size, fake_size),
            self.img.color_mask.back_color,
        )
        draw = ImageDraw.Draw(self.img_module)
        draw.rectangle([0, 0, fake_size - 1, fake_size - 1], fill=self.img.paint_color)
        r = fake_size // 2
        draw.ellipse([-r, -r, r, r], fill=self.img.color_mask.back_color)
        draw.ellipse([fake_size - 1 - r, -r, fake_size - 1 + r, r], fill=self.img.color_mask.back_color)
        draw.ellipse([-r, fake_size - 1 - r, r, fake_size - 1 + r], fill=self.img.color_mask.back_color)
        draw.ellipse([fake_size - 1 - r, fake_size - 1 - r, fake_size - 1 + r, fake_size - 1 + r], fill=self.img.color_mask.back_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class MedicalCrossModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.img_module)
        thickness = int(fake_size * 0.4)
        margin = int(fake_size * 0.15)
        mid = fake_size // 2
        draw.rectangle([margin, mid - thickness//2, fake_size - margin, mid + thickness//2], fill=self.img.paint_color)
        draw.rectangle([mid - thickness//2, margin, mid + thickness//2, fake_size - margin], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class LotusPetalModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.img_module)
        m = fake_size // 6
        draw.ellipse([m, m, fake_size - m, fake_size - m], fill=self.img.paint_color)
        draw.polygon([(0, 0), (fake_size//2, m), (m, fake_size//2)], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class NetworkNodesModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.img_module = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.img_module)
        node_size = int(fake_size * 0.5)
        margin = (fake_size - node_size) // 2
        mid = fake_size // 2
        line_w = max(1, fake_size // 10)
        draw.rectangle([mid, mid - line_w, fake_size, mid + line_w], fill=self.img.paint_color)
        draw.rectangle([mid - line_w, mid, mid + line_w, fake_size], fill=self.img.paint_color)
        draw.ellipse([margin, margin, fake_size - margin, fake_size - margin], fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def make_color_transparent(img, target_color=(255, 255, 255), tolerance=30):
    img = img.convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item[:4]
        # Check distance to target color
        if (abs(r - target_color[0]) <= tolerance and 
            abs(g - target_color[1]) <= tolerance and 
            abs(b - target_color[2]) <= tolerance):
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    return img

def make_sharp_corner(draw, px, py, corner, s, r, color):
    if corner == "TL":
        draw.rectangle([px, py, px + r - 1, py + s - 1], fill=color)
        draw.rectangle([px, py, px + s - 1, py + r - 1], fill=color)
    elif corner == "TR":
        draw.rectangle([px + 7*s - r, py, px + 7*s - 1, py + s - 1], fill=color)
        draw.rectangle([px + 7*s - s, py, px + 7*s - 1, py + r - 1], fill=color)
    elif corner == "BL":
        draw.rectangle([px, py + 7*s - s, px + r - 1, py + 7*s - 1], fill=color)
        draw.rectangle([px, py + 7*s - r, px + s - 1, py + 7*s - 1], fill=color)
    elif corner == "BR":
        draw.rectangle([px + 7*s - r, py + 7*s - s, px + 7*s - 1, py + 7*s - 1], fill=color)
        draw.rectangle([px + 7*s - s, py + 7*s - r, px + 7*s - 1, py + 7*s - 1], fill=color)

def make_eyeball_sharp_corner(draw, ebx, eby, corner, s, r2, color):
    if corner == "TL":
        draw.rectangle([ebx, eby, ebx + r2 - 1, eby + r2 - 1], fill=color)
    elif corner == "TR":
        draw.rectangle([ebx + 3*s - r2, eby, ebx + 3*s - 1, eby + r2 - 1], fill=color)
    elif corner == "BL":
        draw.rectangle([ebx, eby + 3*s - r2, ebx + r2 - 1, eby + 3*s - 1], fill=color)
    elif corner == "BR":
        draw.rectangle([ebx + 3*s - r2, eby + 3*s - r2, ebx + 3*s - 1, eby + 3*s - 1], fill=color)

def generate_styled_qr(data, fill_color="#000000", back_color="#ffffff", dot_style="square", logo_image=None, box_size=30, eye_color=None, eyeball_color=None, eye_frame_style=None, eyeball_style=None, remove_logo_bg=False, logo_bg_color="#ffffff", logo_bg_tolerance=30, logo_clear_size=0, gradient_type="Solid Color", fill_color_end="#000000", preset_logo="None", preset_logo_color=None, logo_card_shape="None", logo_card_padding=10, logo_size_ratio=0.33, error_correction="H", quiet_zone=4):
    if eye_frame_style is None: eye_frame_style = "square"
    if eyeball_style is None: eyeball_style = "square"
    
    # Generate preset logo if requested
    has_logo = logo_image is not None or preset_logo != "None"
    if preset_logo != "None":
        brand_color = PRESET_LOGO_BRAND_COLORS.get(preset_logo.lower())
        color_to_use = preset_logo_color if preset_logo_color else (brand_color if brand_color else fill_color)
        logo_image = generate_preset_logo(preset_logo, hex_to_rgb(color_to_use))
        
    # Map error correction level string to qrcode constant
    _ec_map = {
        "L": qrcode.constants.ERROR_CORRECT_L,
        "M": qrcode.constants.ERROR_CORRECT_M,
        "Q": qrcode.constants.ERROR_CORRECT_Q,
        "H": qrcode.constants.ERROR_CORRECT_H,
    }
    ec_level = _ec_map.get(error_correction, qrcode.constants.ERROR_CORRECT_H)
    # Always use H when a logo is present (needs max redundancy)
    if has_logo:
        ec_level = qrcode.constants.ERROR_CORRECT_H

    qr = qrcode.QRCode(
        error_correction=ec_level,
        box_size=box_size,
        border=quiet_zone,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Clear modules under the logo to prevent dots showing through
    if has_logo and logo_clear_size >= 0:
        modules_count = len(qr.modules)
        cx = (modules_count - 1) / 2.0
        cy = (modules_count - 1) / 2.0
        
        # The logo is scaled to logo_size_ratio of the total image width
        logo_module_width = (modules_count + 8) * logo_size_ratio
        
        # We clear a circular area based on L2 distance
        clear_radius = (logo_module_width / 2.0) + logo_clear_size
        
        for y in range(modules_count):
            for x in range(modules_count):
                dx = x - cx
                dy = y - cy
                dist = math.sqrt(dx*dx + dy*dy)
                
                if dist < clear_radius:
                    # Do not clear the corner eyes
                    if not (x < 8 and y < 8) and not (x > modules_count - 9 and y < 8) and not (x < 8 and y > modules_count - 9):
                        qr.modules[y][x] = False

    module_drawers = {
        "square": SquareModuleDrawer(),
        "gapped": GappedSquareModuleDrawer(),
        "circle": CircleModuleDrawer(),
        "rounded": RoundedModuleDrawer(),
        "vertical_bars": VerticalBarsDrawer(),
        "horizontal_bars": HorizontalBarsDrawer(),
        "diamond": DiamondModuleDrawer(),
        "ring": RingModuleDrawer(),
        "star": StarModuleDrawer(),
        "flower_cut": FlowerCutModuleDrawer(),
        "clover": CloverModuleDrawer(),
        "plus": PlusModuleDrawer(),
        "rounded_plus": RoundedPlusModuleDrawer(),
        "heart": HeartModuleDrawer(),
        "sheared": ShearedModuleDrawer(),
        "bevel": BevelModuleDrawer(),
        "fishtail": FishtailModuleDrawer(),
        "squircle": SquircleModuleDrawer(),
        "hexagon": HexagonModuleDrawer(),
        "target_bullseye": TargetBullseyeModuleDrawer(),
        "diamond_target": DiamondTargetModuleDrawer(),
        "octagon": OctagonModuleDrawer(),
        "dotted_cross": DottedCrossModuleDrawer(),
        "arrow": ArrowModuleDrawer(),
        "gear_dot": GearDotModuleDrawer(),
        "hourglass": HourglassModuleDrawer(),
        "pinwheel": PinwheelModuleDrawer(),
        "leaf_droplet": LeafDropletModuleDrawer(),
        "pillow": PillowModuleDrawer(),
        "quad_dots": QuadDotsModuleDrawer(),
        "tech_chevron": TechChevronModuleDrawer(),
        "sparkle": SparkleModuleDrawer(),
        "medical_cross": MedicalCrossModuleDrawer(),
        "lotus_petal": LotusPetalModuleDrawer(),
        "network_nodes": NetworkNodesModuleDrawer(),
    }
    drawer = module_drawers.get(dot_style, SquareModuleDrawer())
    
    fg = hex_to_rgb(fill_color) if str(fill_color).startswith('#') else (0, 0, 0)
    bg = hex_to_rgb(back_color) if str(back_color).startswith('#') else (255, 255, 255)
    
    if gradient_type == "Solid Color" or not fill_color_end or fill_color_end == fill_color:
        fg_end = fg
    elif fill_color_end == "#000000" and fill_color.lower() in ["#ffffff", "#fff"]:
        fg_end = fg
    else:
        fg_end = hex_to_rgb(fill_color_end) if str(fill_color_end).startswith('#') else fg

    if gradient_type in ["Vertical Gradient", "Linear Vertical"]:
        color_mask = VerticalGradiantColorMask(back_color=bg, top_color=fg, bottom_color=fg_end)
    elif gradient_type in ["Horizontal Gradient", "Linear Horizontal"]:
        color_mask = HorizontalGradiantColorMask(back_color=bg, left_color=fg, right_color=fg_end)
    elif gradient_type in ["Radial Gradient", "Radial Center"]:
        color_mask = RadialGradiantColorMask(back_color=bg, center_color=fg, edge_color=fg_end)
    elif gradient_type in ["Diagonal (TL to BR)", "Diagonal Gradient"]:
        color_mask = HorizontalGradiantColorMask(back_color=bg, left_color=fg, right_color=fg_end)
    else:
        color_mask = SolidFillColorMask(back_color=bg, front_color=fg)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=drawer,
        color_mask=color_mask,
    ).convert("RGBA")
    
    # Custom Eyes
    # The eyes are 7x7 modules at top-left, top-right, and bottom-left.
    border_modules = 4
    s = box_size
    modules_count = len(qr.modules)
    
    eye_positions = [
        (border_modules, border_modules), # Top-Left
        (modules_count + border_modules - 7, border_modules), # Top-Right
        (border_modules, modules_count + border_modules - 7) # Bottom-Left
    ]
    
    draw = ImageDraw.Draw(img)
    eye_rgb = hex_to_rgb(eye_color) if eye_color and str(eye_color).startswith('#') else fg
    eyeball_rgb = hex_to_rgb(eyeball_color) if eyeball_color and str(eyeball_color).startswith('#') else eye_rgb
    
    # We will erase the existing eyes and draw new ones
    for ex, ey in eye_positions:
        px = ex * s
        py = ey * s
        
        # Erase existing eye
        draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=bg + (255,))
        
        # Draw custom eye
        r = int(s * 1.5)
        r2 = int(r / 2)
        s2 = s // 2
        
        # Draw outer frame
        if eye_frame_style == "rounded":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
        elif eye_frame_style == "octagon":
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            d = 2 * s
            p_out = [
                (x1 + d, y1), (x2 - d, y1),
                (x2, y1 + d), (x2, y2 - d),
                (x2 - d, y2), (x1 + d, y2),
                (x1, y2 - d), (x1, y1 + d)
            ]
            draw.polygon(p_out, fill=eye_rgb + (255,))
            ix1, iy1, ix2, iy2 = px + s, py + s, px + 6*s - 1, py + 6*s - 1
            d_in = s
            p_in = [
                (ix1 + d_in, iy1), (ix2 - d_in, iy1),
                (ix2, iy1 + d_in), (ix2, iy2 - d_in),
                (ix2 - d_in, iy2), (ix1 + d_in, iy2),
                (ix1, iy2 - d_in), (ix1, iy1 + d_in)
            ]
            draw.polygon(p_in, fill=bg + (255,))
        elif eye_frame_style == "corner_brackets":
            draw.rectangle([px, py, px + 2*s - 1, py + s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px, py, px + s - 1, py + 2*s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px + 5*s, py, px + 7*s - 1, py + s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px + 6*s, py, px + 7*s - 1, py + 2*s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px, py + 6*s, px + 2*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px, py + 5*s, px + s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px + 5*s, py + 6*s, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
            draw.rectangle([px + 6*s, py + 5*s, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
        elif eye_frame_style == "double_ring":
            draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=max(1, s2))
            draw.ellipse([px + s + s2, py + s + s2, px + 6*s - s2 - 1, py + 6*s - s2 - 1], outline=eye_rgb + (255,), width=max(1, s2))
        elif eye_frame_style == "dotted_circle":
            cx = px + 3.5 * s
            cy = py + 3.5 * s
            r_dotted = 3.0 * s
            for i in range(12):
                angle = i * (2 * math.pi / 12)
                dx = cx + r_dotted * math.cos(angle)
                dy = cy + r_dotted * math.sin(angle)
                dot_r = max(2, s // 2)
                draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r], fill=eye_rgb + (255,))
        elif eye_frame_style == "hexagon":
            cx = px + 3.5 * s
            cy = py + 3.5 * s
            r_hex = 3.5 * s
            p_out = []
            for i in range(6):
                angle = i * math.pi / 3 - math.pi / 2
                p_out.append((cx + r_hex * math.cos(angle), cy + r_hex * math.sin(angle)))
            draw.polygon(p_out, fill=eye_rgb + (255,))
            p_in = []
            r_hex_in = 2.5 * s
            for i in range(6):
                angle = i * math.pi / 3 - math.pi / 2
                p_in.append((cx + r_hex_in * math.cos(angle), cy + r_hex_in * math.sin(angle)))
            draw.polygon(p_in, fill=bg + (255,))
        elif eye_frame_style == "diamond":
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            cx, cy = px + 3.5*s, py + 3.5*s
            draw.polygon([(cx, y1), (x2, cy), (cx, y2), (x1, cy)], fill=eye_rgb + (255,))
            draw.polygon([(cx, y1 + s), (x2 - s, cy), (cx, y2 - s), (x1 + s, cy)], fill=bg + (255,))
        elif eye_frame_style == "star":
            cx = px + 3.5 * s
            cy = py + 3.5 * s
            R_val = 3.5 * s
            r_val = 1.8 * s
            p_out = []
            for i in range(8):
                angle = i * math.pi / 4 - math.pi / 2
                curr_r = R_val if i % 2 == 0 else r_val
                p_out.append((cx + curr_r * math.cos(angle), cy + curr_r * math.sin(angle)))
            draw.polygon(p_out, fill=eye_rgb + (255,))
            R_in = 2.5 * s
            r_in = 1.2 * s
            p_in = []
            for i in range(8):
                angle = i * math.pi / 4 - math.pi / 2
                curr_r = R_in if i % 2 == 0 else r_in
                p_in.append((cx + curr_r * math.cos(angle), cy + curr_r * math.sin(angle)))
            draw.polygon(p_in, fill=bg + (255,))
        elif eye_frame_style == "gear":
            cx = px + 3.5 * s
            cy = py + 3.5 * s
            draw.ellipse([cx - 3*s, cy - 3*s, cx + 3*s, cy + 3*s], fill=eye_rgb + (255,))
            for i in range(8):
                angle = i * math.pi / 4
                gx = cx + 3.2 * s * math.cos(angle)
                gy = cy + 3.2 * s * math.sin(angle)
                draw.rectangle([gx - s2, gy - s2, gx + s2, gy + s2], fill=eye_rgb + (255,))
            draw.ellipse([cx - 2*s, cy - 2*s, cx + 2*s, cy + 2*s], fill=bg + (255,))
        elif eye_frame_style == "circle":
            draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
        elif eye_frame_style == "leaf":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
            make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
        elif eye_frame_style == "leaf_opposite":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
            make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
        elif eye_frame_style == "droplet" or eye_frame_style == "droplet_br":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
        elif eye_frame_style == "droplet_tl":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
        elif eye_frame_style == "droplet_tr":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
        elif eye_frame_style == "droplet_bl":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
        elif eye_frame_style == "shield":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
            make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
        elif eye_frame_style == "shield_opposite":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
            make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
        elif eye_frame_style == "left_rounded":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TR", s, r, eye_rgb + (255,))
            make_sharp_corner(draw, px, py, "BR", s, r, eye_rgb + (255,))
        elif eye_frame_style == "right_rounded":
            draw.rounded_rectangle([px, py, px + 7*s - 1, py + 7*s - 1], radius=r, outline=eye_rgb + (255,), width=s)
            make_sharp_corner(draw, px, py, "TL", s, r, eye_rgb + (255,))
            make_sharp_corner(draw, px, py, "BL", s, r, eye_rgb + (255,))
        elif eye_frame_style == "solid_square_circle_cut":
            draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
            draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
        elif eye_frame_style == "sheared":
            offset = s
            p1 = (px + offset, py)
            p2 = (px + 7*s - 1, py)
            p3 = (px + 7*s - 1 - offset, py + 7*s - 1)
            p4 = (px, py + 7*s - 1)
            
            draw.line([p1, p2], fill=eye_rgb + (255,), width=s)
            draw.line([p2, p3], fill=eye_rgb + (255,), width=s)
            draw.line([p3, p4], fill=eye_rgb + (255,), width=s)
            draw.line([p4, p1], fill=eye_rgb + (255,), width=s)
            
            draw.ellipse([p1[0]-s//2, p1[1]-s//2, p1[0]+s//2, p1[1]+s//2], fill=eye_rgb + (255,))
            draw.ellipse([p2[0]-s//2, p2[1]-s//2, p2[0]+s//2, p2[1]+s//2], fill=eye_rgb + (255,))
            draw.ellipse([p3[0]-s//2, p3[1]-s//2, p3[0]+s//2, p3[1]+s//2], fill=eye_rgb + (255,))
            draw.ellipse([p4[0]-s//2, p4[1]-s//2, p4[0]+s//2, p4[1]+s//2], fill=eye_rgb + (255,))
        elif eye_frame_style == "crystal_frame":
            # Octagonal bevel cut at corners (crystal/jewel look)
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            bv = s  # bevel size
            p_out = [(x1+bv, y1), (x2-bv, y1), (x2, y1+bv), (x2, y2-bv), (x2-bv, y2), (x1+bv, y2), (x1, y2-bv), (x1, y1+bv)]
            draw.polygon(p_out, fill=eye_rgb + (255,))
            ix1, iy1, ix2, iy2 = px+s, py+s, px+6*s-1, py+6*s-1
            p_in = [(ix1+bv, iy1), (ix2-bv, iy1), (ix2, iy1+bv), (ix2, iy2-bv), (ix2-bv, iy2), (ix1+bv, iy2), (ix1, iy2-bv), (ix1, iy1+bv)]
            draw.polygon(p_in, fill=bg + (255,))
        elif eye_frame_style == "arch_frame":
            # Square sides and bottom, arched top
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            mid_x = (x1 + x2) / 2
            arch_h = 3 * s
            draw.rectangle([x1, y1 + arch_h//2, x2, y2], outline=eye_rgb + (255,), width=s)
            draw.ellipse([x1, y1, x2, y1 + arch_h], outline=eye_rgb + (255,), width=s)
            draw.rectangle([x1+s, y1 + arch_h//2, x2-s, y2-s], fill=bg + (255,))
        elif eye_frame_style == "cross_notch_frame":
            # Square outline with small square notches cut into each side's midpoint
            draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
            notch = s // 2
            mid = 3 * s
            draw.rectangle([px + mid - notch, py - 1, px + mid + notch, py + s], fill=bg + (255,))
            draw.rectangle([px + mid - notch, py + 6*s - 1, px + mid + notch, py + 7*s], fill=bg + (255,))
            draw.rectangle([px - 1, py + mid - notch, px + s, py + mid + notch], fill=bg + (255,))
            draw.rectangle([px + 6*s - 1, py + mid - notch, px + 7*s, py + mid + notch], fill=bg + (255,))
        elif eye_frame_style == "pill_frame":
            # Stadium / pill shape — both left and right sides are semicircles
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            rad = (y2 - y1) // 2
            draw.rounded_rectangle([x1, y1, x2, y2], radius=rad, outline=eye_rgb + (255,), width=s)
        elif eye_frame_style == "pointed_top_frame":
            # Pentagon: flat bottom/sides, pointed peak at top center
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            cx = px + 3.5 * s
            outer = [(x1, y1 + 2*s), (cx, y1), (x2, y1 + 2*s), (x2, y2), (x1, y2)]
            draw.polygon(outer, fill=eye_rgb + (255,))
            inner = [(x1+s, y1+2*s+s//2), (cx, y1+s), (x2-s, y1+2*s+s//2), (x2-s, y2-s), (x1+s, y2-s)]
            draw.polygon(inner, fill=bg + (255,))
        elif eye_frame_style == "aztec_step_frame":
            # Stepped / staircase corners like a Mayan pyramid
            step = s
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            outer = [
                (x1 + 2*step, y1), (x2 - 2*step, y1),
                (x2 - 2*step, y1 + step), (x2 - step, y1 + step),
                (x2 - step, y1 + 2*step), (x2, y1 + 2*step),
                (x2, y2 - 2*step), (x2 - step, y2 - 2*step),
                (x2 - step, y2 - step), (x2 - 2*step, y2 - step),
                (x2 - 2*step, y2), (x1 + 2*step, y2),
                (x1 + 2*step, y2 - step), (x1 + step, y2 - step),
                (x1 + step, y2 - 2*step), (x1, y2 - 2*step),
                (x1, y1 + 2*step), (x1 + step, y1 + 2*step),
                (x1 + step, y1 + step), (x1 + 2*step, y1 + step)
            ]
            draw.polygon(outer, fill=eye_rgb + (255,))
            inner_off = s
            inner = [
                (x1 + inner_off + 2*step, y1 + inner_off), (x2 - inner_off - 2*step, y1 + inner_off),
                (x2 - inner_off - 2*step, y1 + inner_off + step), (x2 - inner_off - step, y1 + inner_off + step),
                (x2 - inner_off - step, y1 + inner_off + 2*step), (x2 - inner_off, y1 + inner_off + 2*step),
                (x2 - inner_off, y2 - inner_off - 2*step), (x2 - inner_off - step, y2 - inner_off - 2*step),
                (x2 - inner_off - step, y2 - inner_off - step), (x2 - inner_off - 2*step, y2 - inner_off - step),
                (x2 - inner_off - 2*step, y2 - inner_off), (x1 + inner_off + 2*step, y2 - inner_off),
                (x1 + inner_off + 2*step, y2 - inner_off - step), (x1 + inner_off + step, y2 - inner_off - step),
                (x1 + inner_off + step, y2 - inner_off - 2*step), (x1 + inner_off, y2 - inner_off - 2*step),
                (x1 + inner_off, y1 + inner_off + 2*step), (x1 + inner_off + step, y1 + inner_off + 2*step),
                (x1 + inner_off + step, y1 + inner_off + step), (x1 + inner_off + 2*step, y1 + inner_off + step)
            ]
            draw.polygon(inner, fill=bg + (255,))
        elif eye_frame_style == "tv_frame":
            # Wide rounded rectangle (wider than tall) — screen / TV shape
            x1, y1, x2, y2 = px, py, px + 7*s - 1, py + 7*s - 1
            rad_tv = int(1.5 * s)
            draw.rounded_rectangle([x1, y1 + s, x2, y2 - s], radius=rad_tv, outline=eye_rgb + (255,), width=s)
        elif eye_frame_style == "house_frame":
            draw.polygon([(px, py + 3.5*s), (px + 3.5*s, py), (px + 7*s - 1, py + 3.5*s), (px + 7*s - 1, py + 7*s - 1), (px, py + 7*s - 1)], fill=eye_rgb + (255,))
            draw.polygon([(px + s, py + 4*s), (px + 3.5*s, py + 1.5*s), (px + 6*s - 1, py + 4*s), (px + 6*s - 1, py + 6*s - 1), (px + s, py + 6*s - 1)], fill=bg + (255,))
            draw.rectangle([px + 5*s, py + s, px + 6*s, py + 3*s], fill=eye_rgb + (255,))
        elif eye_frame_style == "camera_lens":
            draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
            draw.ellipse([px + s, py + s, px + 6*s - 1, py + 6*s - 1], fill=bg + (255,))
            cx, cy = px + 3.5*s, py + 3.5*s
            for angle in [0, 60, 120, 180, 240, 300]:
                rad = math.radians(angle)
                rad2 = math.radians(angle + 20)
                x1, y1 = cx + math.cos(rad)*3.5*s, cy + math.sin(rad)*3.5*s
                x2, y2 = cx + math.cos(rad2)*s, cy + math.sin(rad2)*s
                draw.line([(x1,y1), (x2,y2)], fill=bg + (255,), width=max(1, int(s*0.4)))
        elif eye_frame_style == "steering_wheel":
            draw.ellipse([px, py, px + 7*s - 1, py + 7*s - 1], fill=eye_rgb + (255,))
            draw.ellipse([px + 1.2*s, py + 1.2*s, px + 5.8*s - 1, py + 5.8*s - 1], fill=bg + (255,))
            cx, cy = px + 3.5*s, py + 3.5*s
            spoke_w = max(1, int(s * 0.8))
            draw.rectangle([cx - spoke_w//2, cy, cx + spoke_w//2, py + 6*s], fill=eye_rgb + (255,))
            draw.polygon([(cx, cy - spoke_w//2), (cx, cy + spoke_w//2), (px + s, cy + spoke_w//2 + s), (px + s, cy - spoke_w//2 + s)], fill=eye_rgb + (255,))
            draw.polygon([(cx, cy - spoke_w//2), (cx, cy + spoke_w//2), (px + 6*s, cy + spoke_w//2 + s), (px + 6*s, cy - spoke_w//2 + s)], fill=eye_rgb + (255,))
        elif eye_frame_style == "square":
            draw.rectangle([px, py, px + 7*s - 1, py + 7*s - 1], outline=eye_rgb + (255,), width=s)
        elif eye_frame_style == "none":
            pass

        # Draw inner eyeball
        ebx = px + 2*s
        eby = py + 2*s
        
        if eyeball_style == "rounded":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
        elif eyeball_style == "octagon":
            x1, y1, x2, y2 = ebx, eby, ebx + 3*s - 1, eby + 3*s - 1
            d = s
            p_eb = [
                (x1 + d, y1), (x2 - d, y1),
                (x2, y1 + d), (x2, y2 - d),
                (x2 - d, y2), (x1 + d, y2),
                (x1, y2 - d), (x1, y1 + d)
            ]
            draw.polygon(p_eb, fill=eyeball_rgb + (255,))
        elif eyeball_style == "corner_brackets":
            draw.rectangle([ebx, eby, ebx + s2 - 1, eby + s2 - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + 3*s - s2, eby, ebx + 3*s - 1, eby + s2 - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx, eby + 3*s - s2, ebx + s2 - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + 3*s - s2, eby + 3*s - s2, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "target_bullseye":
            draw.ellipse([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], outline=eyeball_rgb + (255,), width=max(1, s // 2))
            draw.ellipse([ebx + s, eby + s, ebx + 2*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "hexagon":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            r_eb = 1.5 * s
            p_eb = []
            for i in range(6):
                angle = i * math.pi / 3 - math.pi / 2
                p_eb.append((cx + r_eb * math.cos(angle), cy + r_eb * math.sin(angle)))
            draw.polygon(p_eb, fill=eyeball_rgb + (255,))
        elif eyeball_style == "diamond":
            x1, y1, x2, y2 = ebx, eby, ebx + 3*s - 1, eby + 3*s - 1
            cx, cy = ebx + 1.5 * s, eby + 1.5 * s
            draw.polygon([(cx, y1), (x2, cy), (cx, y2), (x1, cy)], fill=eyeball_rgb + (255,))
        elif eyeball_style == "star":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            R_val = 1.5 * s
            r_val = 0.7 * s
            p_eb = []
            for i in range(8):
                angle = i * math.pi / 4 - math.pi / 2
                curr_r = R_val if i % 2 == 0 else r_val
                p_eb.append((cx + curr_r * math.cos(angle), cy + curr_r * math.sin(angle)))
            draw.polygon(p_eb, fill=eyeball_rgb + (255,))
        elif eyeball_style == "gear":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            draw.ellipse([cx - s, cy - s, cx + s, cy + s], fill=eyeball_rgb + (255,))
            for i in range(6):
                angle = i * math.pi / 3
                gx = cx + 1.3 * s * math.cos(angle)
                gy = cy + 1.3 * s * math.sin(angle)
                draw.rectangle([gx - s2, gy - s2, gx + s2, gy + s2], fill=eyeball_rgb + (255,))
        elif eyeball_style == "flower":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            draw.ellipse([cx - s2, cy - s2, cx + s2, cy + s2], fill=eyeball_rgb + (255,))
            for i in range(6):
                angle = i * math.pi / 3
                fx = cx + 1.1 * s * math.cos(angle)
                fy = cy + 1.1 * s * math.sin(angle)
                dot_r = max(2, s // 3)
                draw.ellipse([fx - dot_r, fy - dot_r, fx + dot_r, fy + dot_r], fill=eyeball_rgb + (255,))
        elif eyeball_style == "circle":
            draw.ellipse([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "leaf":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "leaf_opposite":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "droplet" or eyeball_style == "droplet_br":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "droplet_tl":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "droplet_tr":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "droplet_bl":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "shield":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "shield_opposite":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "left_rounded":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TR", s, r2, eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BR", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "right_rounded":
            draw.rounded_rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], radius=r2, fill=eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "TL", s, r2, eyeball_rgb + (255,))
            make_eyeball_sharp_corner(draw, ebx, eby, "BL", s, r2, eyeball_rgb + (255,))
        elif eyeball_style == "sheared":
            offset = s // 2
            p1 = (ebx + offset, eby)
            p2 = (ebx + 3*s - 1, eby)
            p3 = (ebx + 3*s - 1 - offset, eby + 3*s - 1)
            p4 = (ebx, eby + 3*s - 1)
            draw.polygon([p1, p2, p3, p4], fill=eyeball_rgb + (255,))
        elif eyeball_style == "starburst" or eyeball_style == "gear":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            r_sun = 1.5 * s
            num_points = 12
            for i in range(num_points):
                angle = i * (2 * math.pi / num_points)
                x2 = cx + r_sun * math.cos(angle)
                y2 = cy + r_sun * math.sin(angle)
                draw.line([(cx, cy), (x2, y2)], fill=eyeball_rgb + (255,), width=max(2, s // 2))
            draw.ellipse([cx - s, cy - s, cx + s, cy + s], fill=eyeball_rgb + (255,))
        elif eyeball_style == "star":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            R = 1.5 * s
            r_inner = R * 0.4
            points = []
            for i in range(10):
                angle = i * math.pi / 5 - math.pi / 2
                r_curr = R if i % 2 == 0 else r_inner
                points.append((cx + r_curr * math.cos(angle), cy + r_curr * math.sin(angle)))
            draw.polygon(points, fill=eyeball_rgb + (255,))
        elif eyeball_style == "diamond":
            p1 = (ebx + 1.5*s, eby)
            p2 = (ebx + 3*s - 1, eby + 1.5*s)
            p3 = (ebx + 1.5*s, eby + 3*s - 1)
            p4 = (ebx, eby + 1.5*s)
            draw.polygon([p1, p2, p3, p4], fill=eyeball_rgb + (255,))
        elif eyeball_style == "flower_cut":
            draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            cut_r = s // 2
            draw.ellipse([ebx + 1.5*s - cut_r, eby - cut_r, ebx + 1.5*s + cut_r, eby + cut_r], fill=bg + (255,))
            draw.ellipse([ebx + 1.5*s - cut_r, eby + 3*s - cut_r, ebx + 1.5*s + cut_r, eby + 3*s + cut_r], fill=bg + (255,))
            draw.ellipse([ebx - cut_r, eby + 1.5*s - cut_r, ebx + cut_r, eby + 1.5*s + cut_r], fill=bg + (255,))
            draw.ellipse([ebx + 3*s - cut_r, eby + 1.5*s - cut_r, ebx + 3*s + cut_r, eby + 1.5*s + cut_r], fill=bg + (255,))
        elif eyeball_style == "clover":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            cr = s // 2
            draw.ellipse([cx - cr, cy - 1.2*s, cx + cr, cy - 0.2*s], fill=eyeball_rgb + (255,))
            draw.ellipse([cx - cr, cy + 0.2*s, cx + cr, cy + 1.2*s], fill=eyeball_rgb + (255,))
            draw.ellipse([cx - 1.2*s, cy - cr, cx - 0.2*s, cy + cr], fill=eyeball_rgb + (255,))
            draw.ellipse([cx + 0.2*s, cy - cr, cx + 1.2*s, cy + cr], fill=eyeball_rgb + (255,))
            draw.rectangle([cx - 0.5*s, cy - 0.5*s, cx + 0.5*s, cy + 0.5*s], fill=eyeball_rgb + (255,))
        elif eyeball_style == "plus" or eyeball_style == "cross":
            draw.rectangle([ebx, eby + s, ebx + 3*s - 1, eby + 2*s - 1], fill=eyeball_rgb + (255,))
            draw.rectangle([ebx + s, eby, ebx + 2*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
        elif eyeball_style == "flower":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            cr = s // 2
            d = 0.6 * s
            for angle in [math.pi/4, 3*math.pi/4, 5*math.pi/4, 7*math.pi/4]:
                px_petal = cx + d * math.cos(angle)
                py_petal = cy + d * math.sin(angle)
                draw.ellipse([px_petal - cr, py_petal - cr, px_petal + cr, py_petal + cr], fill=eyeball_rgb + (255,))
            draw.ellipse([cx - 0.6*s, cy - 0.6*s, cx + 0.6*s, cy + 0.6*s], fill=eyeball_rgb + (255,))
        elif eyeball_style == "heart":
            cx = ebx + 1.5 * s
            cy = eby + 1.5 * s
            hr = 0.75 * s
            draw.ellipse([ebx + 1.5*s - 2*hr, eby, ebx + 1.5*s, eby + 2*hr], fill=eyeball_rgb + (255,))
            draw.ellipse([ebx + 1.5*s, eby, ebx + 1.5*s + 2*hr, eby + 2*hr], fill=eyeball_rgb + (255,))
            draw.polygon([(ebx, eby + hr), (ebx + 3*s - 1, eby + hr), (ebx + 1.5*s, eby + 3*s - 1)], fill=eyeball_rgb + (255,))
        elif eyeball_style == "rhombus":
            # Standing diamond / rhombus (taller than wide)
            cx, cy = ebx + 1.5*s, eby + 1.5*s
            draw.polygon([(cx, eby), (ebx + 3*s - 1, cy), (cx, eby + 3*s - 1), (ebx, cy)], fill=eyeball_rgb + (255,))
        elif eyeball_style == "rounded_triangle":
            # Smoothly rounded equilateral triangle
            cx, cy = ebx + 1.5*s, eby + 1.5*s
            R_t = 1.4 * s
            rounding = 0.35 * s
            pts = []
            for i in range(3):
                angle = i * 2 * math.pi / 3 - math.pi / 2
                pts.append((cx + R_t * math.cos(angle), cy + R_t * math.sin(angle)))
            draw.polygon(pts, fill=eyeball_rgb + (255,))
            # Soften corners with small circles
            for pt in pts:
                draw.ellipse([pt[0]-rounding, pt[1]-rounding, pt[0]+rounding, pt[1]+rounding], fill=eyeball_rgb + (255,))
        elif eyeball_style == "pinched_square":
            # Square with concave sides — 4-pointed shuriken / pinch shape
            cx, cy = ebx + 1.5*s, eby + 1.5*s
            R_p = 1.5 * s
            # Draw 4 large circles at corners to cut into the square
            draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            bite = 1.2 * s
            draw.ellipse([ebx - bite, eby - bite, ebx + bite, eby + bite], fill=bg + (255,))
            draw.ellipse([ebx + 3*s - 1 - bite, eby - bite, ebx + 3*s - 1 + bite, eby + bite], fill=bg + (255,))
            draw.ellipse([ebx - bite, eby + 3*s - 1 - bite, ebx + bite, eby + 3*s - 1 + bite], fill=bg + (255,))
            draw.ellipse([ebx + 3*s - 1 - bite, eby + 3*s - 1 - bite, ebx + 3*s - 1 + bite, eby + 3*s - 1 + bite], fill=bg + (255,))
        elif eyeball_style == "dumbbell_eyeball":
            cx, cy = ebx + 1.5*s, eby + 1.5*s
            bar_w = s * 0.6
            draw.rectangle([cx - 1.5*s, cy - bar_w//2, cx + 1.5*s, cy + bar_w//2], fill=eyeball_rgb + (255,))
            draw.ellipse([cx - 1.5*s, cy - s, cx - 0.2*s, cy + s], fill=eyeball_rgb + (255,))
            draw.ellipse([cx + 0.2*s, cy - s, cx + 1.5*s, cy + s], fill=eyeball_rgb + (255,))
        else: # square
            draw.rectangle([ebx, eby, ebx + 3*s - 1, eby + 3*s - 1], fill=eyeball_rgb + (255,))
            

    if logo_image:
        try:
            if isinstance(logo_image, Image.Image):
                logo = logo_image
            else:
                logo = Image.open(logo_image)
            
            # Remove background if requested
            if remove_logo_bg:
                target_rgb = hex_to_rgb(logo_bg_color)
                logo = make_color_transparent(logo, target_rgb, logo_bg_tolerance)
                
            # Resize logo to fit inside the QR code
            basewidth = int(img.size[0] * logo_size_ratio)
            wpercent = (basewidth / float(logo.size[0]))
            hsize = int((float(logo.size[1]) * float(wpercent)))
            logo = logo.resize((basewidth, hsize), Image.Resampling.LANCZOS)
            
            # Create a background color square for the logo if needed, or just paste it
            pos = ((img.size[0] - logo.size[0]) // 2, (img.size[1] - logo.size[1]) // 2)
            
            # Draw logo background card if requested
            if logo_card_shape != "None":
                card_draw = ImageDraw.Draw(img)
                card_w = logo.size[0] + logo_card_padding * 2
                card_h = logo.size[1] + logo_card_padding * 2
                cx_img = img.size[0] // 2
                cy_img = img.size[1] // 2
                card_box = [cx_img - card_w//2, cy_img - card_h//2, cx_img + card_w//2, cy_img + card_h//2]
                
                card_rgb = bg + (255,)
                if logo_card_shape == "Circle":
                    card_draw.ellipse(card_box, fill=card_rgb)
                elif logo_card_shape == "Rounded Square":
                    card_draw.rounded_rectangle(card_box, radius=10, fill=card_rgb)
                    
            # if logo has alpha, use it as mask
            if logo.mode == 'RGBA':
                img.paste(logo, pos, logo)
            else:
                img.paste(logo, pos)
        except Exception as e:
            print(f"Error applying logo: {e}")

    return img

import qrcode.image.svg
def generate_svg_qr(data, fill_color="#000000", back_color="#ffffff", box_size=30):
    """Generates a raw SVG QR code (without custom styled dots or frames)"""
    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=4,
        image_factory=factory
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image()
    svg_str = img.to_string().decode('utf-8')
    
    import re
    # 1. Replace width and height to be 100% and responsive
    svg_str = re.sub(r'width="[^"]+"', 'width="100%"', svg_str, count=1)
    svg_str = re.sub(r'height="[^"]+"', 'height="100%"', svg_str, count=1)
    
    # 2. Add custom fill color to paths (replacing standard black style="fill:#000000;...")
    svg_str = svg_str.replace("fill:#000000", f"fill:{fill_color}")
    
    # 3. Add background color rect matching back_color
    match = re.search(r'viewBox="0 0 (\d+) (\d+)"', svg_str)
    if match:
        v_w = match.group(1)
        v_h = match.group(2)
        rect_str = f'<rect width="{v_w}" height="{v_h}" fill="{back_color}"/>'
        tag_end = svg_str.find('>')
        if tag_end != -1:
            svg_str = svg_str[:tag_end+1] + "\n  " + rect_str + svg_str[tag_end+1:]
            
    return svg_str.encode('utf-8')
