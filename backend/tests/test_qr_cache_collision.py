from PIL import Image
from services.qr_service import _compute_cache_key

def test_different_images_same_dimensions_produce_distinct_cache_keys():
    # Two distinct 100x100 RGBA images (one red, one blue)
    img1 = Image.new("RGBA", (100, 100), (255, 0, 0, 255))
    img2 = Image.new("RGBA", (100, 100), (0, 0, 255, 255))

    key1 = _compute_cache_key("https://example.com", {"logo_image": img1})
    key2 = _compute_cache_key("https://example.com", {"logo_image": img2})

    assert key1 != key2, "Cache keys collided for different images of identical size and mode!"
