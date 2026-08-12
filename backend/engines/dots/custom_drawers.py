import math
from PIL import Image, ImageDraw
from qrcode.image.styles.moduledrawers.pil import StyledPilQRModuleDrawer, ANTIALIASING_FACTOR
from qrcode.main import ActiveWithNeighbors

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
        
        x, y = box[0]
        self.img._img.paste(nw, (x, y))
        self.img._img.paste(ne, (x + self.corner_width, y))
        self.img._img.paste(se, (x + self.corner_width, y + self.corner_width))
        self.img._img.paste(sw, (x, y + self.corner_width))

class ScallopedModuleDrawer(StyledPilQRModuleDrawer):
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
        base = Image.new(mode, (fake_width, fake_width), front_color)
        base_draw = ImageDraw.Draw(base)
        
        # Draw a circle (pie slice) using back_color at the top-left (0,0) corner
        radius = int(fake_width * 0.9) # Slightly smaller than the full corner for a nice edge
        base_draw.pieslice([-radius, -radius, radius, radius], 0, 360, fill=back_color)
        
        self.NW_CORNER = base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        self.SW_CORNER = self.NW_CORNER.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        self.SE_CORNER = self.NW_CORNER.transpose(Image.Transpose.ROTATE_180)
        self.NE_CORNER = self.NW_CORNER.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active:
            return
        nw_exposed = not is_active.W and not is_active.N
        ne_exposed = not is_active.N and not is_active.E
        se_exposed = not is_active.E and not is_active.S
        sw_exposed = not is_active.S and not is_active.W
        
        nw = self.NW_CORNER if nw_exposed else self.SQUARE
        ne = self.NE_CORNER if ne_exposed else self.SQUARE
        se = self.SE_CORNER if se_exposed else self.SQUARE
        sw = self.SW_CORNER if sw_exposed else self.SQUARE
        
        x, y = box[0]
        self.img._img.paste(nw, (x, y))
        self.img._img.paste(ne, (x + self.corner_width, y))
        self.img._img.paste(se, (x + self.corner_width, y + self.corner_width))
        self.img._img.paste(sw, (x, y + self.corner_width))

class SteppedModuleDrawer(StyledPilQRModuleDrawer):
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
        base = Image.new(mode, (fake_width, fake_width), front_color)
        base_draw = ImageDraw.Draw(base)
        
        # Cutout a small square at the top-left (0,0) corner
        step_size = int(fake_width * 0.5)
        base_draw.rectangle([0, 0, step_size, step_size], fill=back_color)
        
        self.NW_CORNER = base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        self.SW_CORNER = self.NW_CORNER.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        self.SE_CORNER = self.NW_CORNER.transpose(Image.Transpose.ROTATE_180)
        self.NE_CORNER = self.NW_CORNER.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active:
            return
        nw_exposed = not is_active.W and not is_active.N
        ne_exposed = not is_active.N and not is_active.E
        se_exposed = not is_active.E and not is_active.S
        sw_exposed = not is_active.S and not is_active.W
        
        nw = self.NW_CORNER if nw_exposed else self.SQUARE
        ne = self.NE_CORNER if ne_exposed else self.SQUARE
        se = self.SE_CORNER if se_exposed else self.SQUARE
        sw = self.SW_CORNER if sw_exposed else self.SQUARE
        
        x, y = box[0]
        self.img._img.paste(nw, (x, y))
        self.img._img.paste(ne, (x + self.corner_width, y))
        self.img._img.paste(se, (x + self.corner_width, y + self.corner_width))
        self.img._img.paste(sw, (x, y + self.corner_width))

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

class SleekDashModuleDrawer(StyledPilQRModuleDrawer):
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
        h = fake_size // 4
        draw.rounded_rectangle([0, fake_size // 2 - h // 2, fake_size - 1, fake_size // 2 + h // 2], radius=max(1, h//2), fill=self.img.paint_color)
        self.img_module = self.img_module.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.img_module, (box[0][0], box[0][1]))

class MinimalDotsModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        padding = fake_size // 4
        draw.ellipse((padding, padding, fake_size - padding - 1, fake_size - padding - 1), fill=self.img.paint_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class HollowDotsModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        w = max(1, fake_size // 10)
        padding = fake_size // 8
        draw.ellipse((padding, padding, fake_size - padding - 1, fake_size - padding - 1), outline=self.img.paint_color, width=w)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class CrossstitchModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        w = max(1, fake_size // 6)
        p = fake_size // 5
        draw.line((p, p, fake_size - p, fake_size - p), fill=self.img.paint_color, width=w)
        draw.line((fake_size - p, p, p, fake_size - p), fill=self.img.paint_color, width=w)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class PixelArtModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        p = fake_size // 4
        draw.rectangle((p, p, fake_size - p - 1, fake_size - p - 1), fill=self.img.paint_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.NEAREST)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class DiagonalStripeModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        w = max(1, fake_size // 3)
        draw.line((0, fake_size, fake_size, 0), fill=self.img.paint_color, width=w)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class HorizontalSlashModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        h = fake_size // 3
        cy = fake_size // 2
        draw.rectangle((0, cy - h//2, fake_size - 1, cy + h//2), fill=self.img.paint_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class VerticalSlashModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        w = fake_size // 3
        cx = fake_size // 2
        draw.rectangle((cx - w//2, 0, cx + w//2, fake_size - 1), fill=self.img.paint_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class TriangleMosaicModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        p = fake_size // 8
        pts = [(fake_size//2, p), (fake_size - p, fake_size - p), (p, fake_size - p)]
        draw.polygon(pts, fill=self.img.paint_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class MoonCrescentModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        p = fake_size // 6
        draw.ellipse((p, p, fake_size - p, fake_size - p), fill=self.img.paint_color)
        offset = fake_size // 4
        draw.ellipse((p + offset, p - offset//2, fake_size - p + offset, fake_size - p - offset//2), fill=self.img.color_mask.back_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class LiquidDropModuleDrawer(StyledPilQRModuleDrawer):
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        box_size = self.img.box_size
        fake_size = box_size * ANTIALIASING_FACTOR
        self.shape = Image.new(self.img.mode, (fake_size, fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(self.shape)
        cx = fake_size // 2
        cy_circle = fake_size - fake_size // 3
        r = fake_size // 3
        draw.ellipse((cx - r, cy_circle - r, cx + r, cy_circle + r), fill=self.img.paint_color)
        pts = [(cx, fake_size // 6), (cx - r, cy_circle), (cx + r, cy_circle)]
        draw.polygon(pts, fill=self.img.paint_color)
        self.shape = self.shape.resize((box_size, box_size), Image.Resampling.LANCZOS)

    def drawrect(self, box, is_active: bool):
        if is_active:
            self.img._img.paste(self.shape, (box[0][0], box[0][1]))

class SwallowtailModuleDrawer(StyledPilQRModuleDrawer):
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
        base = Image.new(mode, (fake_width, fake_width), front_color)
        base_draw = ImageDraw.Draw(base)
        
        fw2 = fake_width // 2
        fw4 = fake_width // 4
        # Subtract an inward V-shape at the top-left corner
        base_draw.polygon([(0, 0), (fw2, 0), (fw4, fw4), (0, fw2)], fill=back_color)
        
        self.NW_CORNER = base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        self.SW_CORNER = self.NW_CORNER.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        self.SE_CORNER = self.NW_CORNER.transpose(Image.Transpose.ROTATE_180)
        self.NE_CORNER = self.NW_CORNER.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active: return
        nw_exposed = not is_active.W and not is_active.N
        ne_exposed = not is_active.N and not is_active.E
        se_exposed = not is_active.E and not is_active.S
        sw_exposed = not is_active.S and not is_active.W
        
        nw = self.NW_CORNER if nw_exposed else self.SQUARE
        ne = self.NE_CORNER if ne_exposed else self.SQUARE
        se = self.SE_CORNER if se_exposed else self.SQUARE
        sw = self.SW_CORNER if sw_exposed else self.SQUARE
        
        x, y = box[0]
        self.img._img.paste(nw, (x, y))
        self.img._img.paste(ne, (x + self.corner_width, y))
        self.img._img.paste(se, (x + self.corner_width, y + self.corner_width))
        self.img._img.paste(sw, (x, y + self.corner_width))

class ShieldConnectModuleDrawer(StyledPilQRModuleDrawer):
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
        
        # Rounded Corner Base (Top)
        rnd_base = Image.new(mode, (fake_width, fake_width), back_color)
        rnd_draw = ImageDraw.Draw(rnd_base)
        rnd_draw.pieslice([0, 0, fake_width*2, fake_width*2], 180, 270, fill=front_color)
        rnd_corner = rnd_base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        
        # Bevel Corner Base (Bottom)
        bvl_base = Image.new(mode, (fake_width, fake_width), back_color)
        bvl_draw = ImageDraw.Draw(bvl_base)
        bvl_draw.polygon([(fake_width-1, 0), (fake_width-1, fake_width-1), (0, fake_width-1)], fill=front_color)
        bvl_corner = bvl_base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        
        self.NW_CORNER = rnd_corner
        self.NE_CORNER = rnd_corner.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        self.SW_CORNER = bvl_corner.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        self.SE_CORNER = bvl_corner.transpose(Image.Transpose.ROTATE_180)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active: return
        nw_exposed = not is_active.W and not is_active.N
        ne_exposed = not is_active.N and not is_active.E
        se_exposed = not is_active.E and not is_active.S
        sw_exposed = not is_active.S and not is_active.W
        
        nw = self.NW_CORNER if nw_exposed else self.SQUARE
        ne = self.NE_CORNER if ne_exposed else self.SQUARE
        se = self.SE_CORNER if se_exposed else self.SQUARE
        sw = self.SW_CORNER if sw_exposed else self.SQUARE
        
        x, y = box[0]
        self.img._img.paste(nw, (x, y))
        self.img._img.paste(ne, (x + self.corner_width, y))
        self.img._img.paste(se, (x + self.corner_width, y + self.corner_width))
        self.img._img.paste(sw, (x, y + self.corner_width))

class LeafConnectModuleDrawer(StyledPilQRModuleDrawer):
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
        
        # Rounded Corner Base
        rnd_base = Image.new(mode, (fake_width, fake_width), back_color)
        rnd_draw = ImageDraw.Draw(rnd_base)
        rnd_draw.pieslice([0, 0, fake_width*2, fake_width*2], 180, 270, fill=front_color)
        rnd_corner = rnd_base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        
        # Scalloped Corner Base
        scl_base = Image.new(mode, (fake_width, fake_width), front_color)
        scl_draw = ImageDraw.Draw(scl_base)
        
        # We need to subtract a circle exactly like Scalloped does
        radius = int(fake_width * 0.9)
        scl_draw.pieslice([-radius, -radius, radius, radius], 0, 360, fill=back_color)
        scl_corner = scl_base.resize((self.corner_width, self.corner_width), Image.Resampling.LANCZOS)
        
        # TL/BR = Rounded, TR/BL = Scalloped
        self.NW_CORNER = rnd_corner
        self.SE_CORNER = rnd_corner.transpose(Image.Transpose.ROTATE_180)
        self.NE_CORNER = scl_corner.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        self.SW_CORNER = scl_corner.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active: return
        nw_exposed = not is_active.W and not is_active.N
        ne_exposed = not is_active.N and not is_active.E
        se_exposed = not is_active.E and not is_active.S
        sw_exposed = not is_active.S and not is_active.W
        
        nw = self.NW_CORNER if nw_exposed else self.SQUARE
        ne = self.NE_CORNER if ne_exposed else self.SQUARE
        se = self.SE_CORNER if se_exposed else self.SQUARE
        sw = self.SW_CORNER if sw_exposed else self.SQUARE
        
        x, y = box[0]
        self.img._img.paste(nw, (x, y))
        self.img._img.paste(ne, (x + self.corner_width, y))
        self.img._img.paste(se, (x + self.corner_width, y + self.corner_width))
        self.img._img.paste(sw, (x, y + self.corner_width))

class CircuitBridgeModuleDrawer(StyledPilQRModuleDrawer):
    needs_neighbors = True
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        self.box_size = self.img.box_size
        self.fake_size = self.box_size * ANTIALIASING_FACTOR
        self.images = {}
        for n in [False, True]:
            for e in [False, True]:
                for s in [False, True]:
                    for w in [False, True]:
                        self.images[(n, e, s, w)] = self._create_module(n, e, s, w)

    def _create_module(self, n, e, s, w):
        base = Image.new(self.img.mode, (self.fake_size, self.fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(base)
        
        # Center square (60% size)
        c_min = self.fake_size * 0.2
        c_max = self.fake_size * 0.8
        draw.rectangle([c_min, c_min, c_max, c_max], fill=self.img.paint_color)
        
        # Bridges (40% width)
        b_min = self.fake_size * 0.3
        b_max = self.fake_size * 0.7
        
        if n: draw.rectangle([b_min, 0, b_max, c_min], fill=self.img.paint_color)
        if s: draw.rectangle([b_min, c_max, b_max, self.fake_size], fill=self.img.paint_color)
        if e: draw.rectangle([c_max, b_min, self.fake_size, b_max], fill=self.img.paint_color)
        if w: draw.rectangle([0, b_min, c_min, b_max], fill=self.img.paint_color)
        
        return base.resize((self.box_size, self.box_size), Image.Resampling.LANCZOS)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active: return
        img = self.images[(bool(is_active.N), bool(is_active.E), bool(is_active.S), bool(is_active.W))]
        self.img._img.paste(img, (box[0][0], box[0][1]))

class CapsuleBridgeModuleDrawer(StyledPilQRModuleDrawer):
    needs_neighbors = True
    def initialize(self, *args, **kwargs):
        super().initialize(*args, **kwargs)
        self.box_size = self.img.box_size
        self.fake_size = self.box_size * ANTIALIASING_FACTOR
        self.images = {}
        for n in [False, True]:
            for e in [False, True]:
                for s in [False, True]:
                    for w in [False, True]:
                        self.images[(n, e, s, w)] = self._create_module(n, e, s, w)

    def _create_module(self, n, e, s, w):
        base = Image.new(self.img.mode, (self.fake_size, self.fake_size), self.img.color_mask.back_color)
        draw = ImageDraw.Draw(base)
        
        # Center circle (60% size)
        c_min = self.fake_size * 0.2
        c_max = self.fake_size * 0.8
        draw.ellipse([c_min, c_min, c_max, c_max], fill=self.img.paint_color)
        
        # Bridges (40% width)
        b_min = self.fake_size * 0.3
        b_max = self.fake_size * 0.7
        
        if n: draw.rectangle([b_min, 0, b_max, self.fake_size/2], fill=self.img.paint_color)
        if s: draw.rectangle([b_min, self.fake_size/2, b_max, self.fake_size], fill=self.img.paint_color)
        if e: draw.rectangle([self.fake_size/2, b_min, self.fake_size, b_max], fill=self.img.paint_color)
        if w: draw.rectangle([0, b_min, self.fake_size/2, b_max], fill=self.img.paint_color)
        
        return base.resize((self.box_size, self.box_size), Image.Resampling.LANCZOS)
        
    def drawrect(self, box, is_active: "ActiveWithNeighbors"):
        if not is_active: return
        img = self.images[(bool(is_active.N), bool(is_active.E), bool(is_active.S), bool(is_active.W))]
        self.img._img.paste(img, (box[0][0], box[0][1]))
