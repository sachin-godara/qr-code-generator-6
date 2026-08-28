import os
import re
import json

root_dir = r"f:\Project 001\qr code generator 6"
exclude_dirs = {"node_modules", ".git", ".venv", "dist", "graphify-out", "Skills", "mcp-server-qrcode-enhanced", ".pytest_cache", ".vscode"}

matches = []

for dirpath, dirnames, filenames in os.walk(root_dir):
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
    for filename in filenames:
        if filename.endswith((".astro", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json", ".md", ".html")):
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    for i, line in enumerate(f, 1):
                        if re.search(r"aggregateRating|ratingValue|ratingCount|reviewCount|worstRating|bestRating|itemReviewed", line, re.IGNORECASE):
                            matches.append({"file": rel_path, "line": i, "content": line.strip(), "type": "schema"})
                        if re.search(r"4\.9\s*/\s*5|4\.8\s*/\s*5|5\.0\s*/\s*5", line, re.IGNORECASE):
                            matches.append({"file": rel_path, "line": i, "content": line.strip(), "type": "score"})
                        if re.search(r"2[,.]840", line, re.IGNORECASE):
                            matches.append({"file": rel_path, "line": i, "content": line.strip(), "type": "count"})
                        if re.search(r"★★★★★|★★★★☆|⭐⭐⭐⭐⭐", line):
                            matches.append({"file": rel_path, "line": i, "content": line.strip(), "type": "stars"})
            except Exception as e:
                pass

print(f"Total matches found: {len(matches)}")
print(json.dumps(matches, indent=2))
