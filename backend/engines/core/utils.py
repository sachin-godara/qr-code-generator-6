def hex_to_rgb(hex_color):
    """
    Converts a hex color string (e.g. '#FF0000' or 'FF0000') to an RGB tuple (255, 0, 0).
    Returns (0, 0, 0) if invalid.
    """
    hex_color = str(hex_color).lstrip('#')
    if len(hex_color) != 6:
        return (0, 0, 0)
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
