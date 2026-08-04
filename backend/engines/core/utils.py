"""
Shared color & helper utilities for QR engines.
"""

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color string (#RRGGBB or RRGGBB) to (R, G, B) tuple."""
    hex_color = str(hex_color).lstrip('#')
    if len(hex_color) != 6:
        return (0, 0, 0)
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
