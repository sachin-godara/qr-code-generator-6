import urllib.request
import os

icons = [
    ("adobeacrobatreader", "pdf.svg")
]

for name, filename in icons:
    url = f"https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/{name}.svg"
    for dest_dir in [
        r"f:\Project 001\qr code generator 6\backend\assets\preset_logos",
        r"f:\Project 001\qr code generator 6\frontend\public\preset_logos"
    ]:
        path = os.path.join(dest_dir, filename)
        try:
            urllib.request.urlretrieve(url, path)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            content = content.replace('fill="#F32013"', 'fill="currentColor"')
            content = content.replace('fill="#f32013"', 'fill="currentColor"')
            # Since simple-icons usually have no fill attribute on path, we add it.
            if 'fill="' not in content:
                content = content.replace('<path ', '<path fill="currentColor" ')
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Downloaded and processed {filename} to {dest_dir}")
        except Exception as e:
            print(f"Failed {filename} to {dest_dir}: {e}")
