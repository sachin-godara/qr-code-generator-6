from engines.dots import MODULE_DRAWER_REGISTRY
import qrcode
from qrcode.image.styledpil import StyledPilImage
import os

styles = [
    "scalloped", "stepped", "swallowtail", "shield_connect", 
    "leaf_connect", "circuit_bridge", "block_bridge"
]

data = "https://generatecustomqr.com"
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=4,
)
qr.add_data(data)
qr.make(fit=True)

out_dir = r"f:\Project 001\qr code generator 6\backend\test_outputs"
os.makedirs(out_dir, exist_ok=True)

for style in styles:
    drawer_cls = MODULE_DRAWER_REGISTRY[style]
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=drawer_cls(),
        color_mask=qrcode.image.styles.colormasks.SolidFillColorMask(
            back_color=(255, 255, 255),
            front_color=(0, 0, 0)
        )
    )
    path = os.path.join(out_dir, f"{style}_test.png")
    img.save(path)
    print(f"Generated {path}")
