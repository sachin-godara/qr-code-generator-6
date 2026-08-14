import pytest
from fastapi.testclient import TestClient
from main import app
from engines.frames.text_frames import resolve_font_path
from qr_engine import sanitize_svg_color
import io

client = TestClient(app)

def test_security_headers_present():
    """Verify standard defensive security headers are returned on all API responses."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "SAMEORIGIN"
    assert response.headers.get("X-XSS-Protection") == "1; mode=block"
    assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "camera=()" in response.headers.get("Permissions-Policy", "")

def test_font_path_traversal_resilience():
    """Verify path traversal strings in font resolution fallback securely to standard font."""
    # Attempt directory traversal
    resolved = resolve_font_path("../../../../etc/passwd")
    assert "etc" not in resolved
    assert "passwd" not in resolved
    assert resolved.endswith(".ttf")

    # Attempt absolute Windows path
    resolved_win = resolve_font_path("C:\\Windows\\System32\\drivers\\etc\\hosts")
    assert "System32" not in resolved_win
    assert resolved_win.endswith(".ttf")

def test_svg_color_xss_sanitization():
    """Verify malicious color strings cannot inject XML/script tags into SVG."""
    malicious_color = 'black"><script>alert(1)</script><path style="fill:black'
    sanitized = sanitize_svg_color(malicious_color, default="#000000")
    assert sanitized == "#000000"
    assert "<script>" not in sanitized

    # Valid colors pass through safely
    assert sanitize_svg_color("#ff0000") == "#ff0000"
    assert sanitize_svg_color("rgba(255, 0, 0, 0.5)") == "rgba(255, 0, 0, 0.5)"
    assert sanitize_svg_color("blue") == "blue"

def test_scan_file_type_validation():
    """Verify scan endpoint rejects non-image files."""
    fake_file = io.BytesIO(b"malicious executable payload")
    response = client.post(
        "/api/generator/scan",
        files={"file": ("malicious.exe", fake_file, "application/x-msdownload")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_contact_form_bounds_validation():
    """Verify contact form rejects oversized field lengths."""
    payload = {
        "name": "A" * 150, # max is 100
        "email": "valid@example.com",
        "subject": "Hello",
        "message": "Valid message"
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422 # Pydantic validation error
