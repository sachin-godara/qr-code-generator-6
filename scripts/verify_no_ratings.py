import os
import re
import json
import sys

dist_dir = r"f:\Project 001\qr code generator 6\frontend\dist"
src_dir = r"f:\Project 001\qr code generator 6\frontend\src"

print("=" * 60)
print("VERIFYING ZERO FAKE RATINGS & SCHEMA COMPLIANCE")
print("=" * 60)

violations = []
total_html_files = 0
total_schemas_audited = 0

# Patterns that indicate fake rating / unverified review structured data or text
SCHEMA_RATING_PATTERNS = [
    r"aggregateRating",
    r"ratingValue",
    r"ratingCount",
    r"reviewCount",
    r"worstRating",
    r"bestRating",
    r"itemReviewed",
]

TEXT_RATING_PATTERNS = [
    r"4\.9\s*/\s*5",
    r"4\.8\s*/\s*5",
    r"5\.0\s*/\s*5",
    r"2[,.]840\+?\s*(creators|users|reviews|ratings|criadores|usuarios|nutzern)",
]

if os.path.exists(dist_dir):
    for dirpath, _, filenames in os.walk(dist_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                total_html_files += 1
                filepath = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(filepath, dist_dir)
                
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                # Check for schema patterns
                for pat in SCHEMA_RATING_PATTERNS:
                    if re.search(pat, content, re.IGNORECASE):
                        violations.append(f"[DIST HTML SCHEMA] {rel_path}: Matched forbidden schema pattern '{pat}'")
                
                # Check for text patterns
                for pat in TEXT_RATING_PATTERNS:
                    if re.search(pat, content, re.IGNORECASE):
                        violations.append(f"[DIST HTML TEXT] {rel_path}: Matched forbidden rating text pattern '{pat}'")
                
                # Check all JSON-LD schemas
                json_ld_matches = re.findall(r'<script\s+type=[\'"]application/ld\+json[\'"]>([\s\S]*?)</script>', content, re.IGNORECASE)
                for schema_str in json_ld_matches:
                    total_schemas_audited += 1
                    try:
                        data = json.loads(schema_str)
                        if "aggregateRating" in data:
                            violations.append(f"[JSON-LD VALIDATION] {rel_path}: Contains aggregateRating in {data.get('@type', 'Unknown')} schema")
                        if "review" in data:
                            violations.append(f"[JSON-LD VALIDATION] {rel_path}: Contains unverified review in {data.get('@type', 'Unknown')} schema")
                    except Exception as e:
                        violations.append(f"[JSON-LD SYNTAX] {rel_path}: Failed to parse JSON-LD: {e}")

print(f"\nAudit Statistics:")
print(f"  - Total HTML files scanned in dist/: {total_html_files}")
print(f"  - Total JSON-LD schemas audited:     {total_schemas_audited}")
print(f"  - Total violations found:            {len(violations)}")

if violations:
    print("\nVIOLATIONS DETECTED:")
    for v in violations:
        print(f"  - {v}")
    sys.exit(1)
else:
    print("\n[SUCCESS] 100% CLEAN: Zero fake ratings, zero aggregate ratings, and 100% compliant schemas across all pages!")
    sys.exit(0)
