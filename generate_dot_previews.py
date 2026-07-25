import os
import qrcode
from qrcode.image.styledpil import StyledPilImage
from backend.qr_engine import (
    SquareModuleDrawer, GappedSquareModuleDrawer, CircleModuleDrawer,
    RoundedModuleDrawer, VerticalBarsDrawer, HorizontalBarsDrawer,
    DiamondModuleDrawer, RingModuleDrawer, StarModuleDrawer, FlowerCutModuleDrawer,
    CloverModuleDrawer, PlusModuleDrawer, RoundedPlusModuleDrawer, HeartModuleDrawer,
    ShearedModuleDrawer, BevelModuleDrawer, FishtailModuleDrawer, SquircleModuleDrawer,
    HexagonModuleDrawer, TargetBullseyeModuleDrawer, DiamondTargetModuleDrawer,
    OctagonModuleDrawer, DottedCrossModuleDrawer, ArrowModuleDrawer, GearDotModuleDrawer,
    HourglassModuleDrawer, PinwheelModuleDrawer, LeafDropletModuleDrawer, PillowModuleDrawer,
    QuadDotsModuleDrawer, TechChevronModuleDrawer, SparkleModuleDrawer, MedicalCrossModuleDrawer,
    LotusPetalModuleDrawer, NetworkNodesModuleDrawer
)
from PIL import Image

def generate_dots():
    drawers = {
        "square": SquareModuleDrawer(), "circle": CircleModuleDrawer(), "rounded": RoundedModuleDrawer(),
        "diamond": DiamondModuleDrawer(), "hexagon": HexagonModuleDrawer(), "octagon": OctagonModuleDrawer(),
        "gapped": GappedSquareModuleDrawer(), "star": StarModuleDrawer(), "heart": HeartModuleDrawer(),
        "ring": RingModuleDrawer(), "plus": PlusModuleDrawer(), "vertical_bars": VerticalBarsDrawer(),
        "horizontal_bars": HorizontalBarsDrawer(), "flower_cut": FlowerCutModuleDrawer(),
        "clover": CloverModuleDrawer(), "rounded_plus": RoundedPlusModuleDrawer(),
        "sheared": ShearedModuleDrawer(), "bevel": BevelModuleDrawer(), "fishtail": FishtailModuleDrawer(),
        "squircle": SquircleModuleDrawer(), "target_bullseye": TargetBullseyeModuleDrawer(),
        "diamond_target": DiamondTargetModuleDrawer(), "dotted_cross": DottedCrossModuleDrawer(),
        "arrow": ArrowModuleDrawer(), "gear_dot": GearDotModuleDrawer(), "hourglass": HourglassModuleDrawer(),
        "pinwheel": PinwheelModuleDrawer(), "leaf_droplet": LeafDropletModuleDrawer(),
        "pillow": PillowModuleDrawer(), "quad_dots": QuadDotsModuleDrawer(),
        "tech_chevron": TechChevronModuleDrawer(), "sparkle": SparkleModuleDrawer(),
        "medical_cross": MedicalCrossModuleDrawer(), "lotus_petal": LotusPetalModuleDrawer(),
        "network_nodes": NetworkNodesModuleDrawer()
    }
    
    out_dir = "frontend/public/previews/dots"
    os.makedirs(out_dir, exist_ok=True)
    
    for name, drawer in drawers.items():
        # Create a tiny 3x3 QR matrix
        qr = qrcode.QRCode(version=1, box_size=30, border=0)
        qr.add_data("A")
        qr.make(fit=True)
        # Draw with transparent bg
        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=drawer,
            color_mask=qrcode.image.styles.colormasks.SolidFillColorMask(front_color=(0, 80, 203), back_color=(255, 255, 255))
        )
        
        # Crop 5x5 modules from the center. 
        # Total modules = 21 (v1) + 8 (border) = 29. Center is module 14.
        # We want modules 12, 13, 14, 15, 16.
        img = img.crop((12*30, 12*30, 17*30, 17*30))

        # Convert white back_color to transparent
        img = img.convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            if item[0] == 255 and item[1] == 255 and item[2] == 255:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        
        img.save(os.path.join(out_dir, f"{name}.png"))
        print(f"Generated {name}.png")

if __name__ == "__main__":
    generate_dots()
