import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API is running"}

def test_generate_qr_endpoint_post():
    payload = {
        "data": "https://example.com",
        "dots_style": "star",
        "eye_frame_style": "circle",
        "eyeball_style": "gear"
    }
    response = client.post("/api/generator/generate", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 0

def test_generate_svg_endpoint_post():
    payload = {
        "data": "https://example.com",
        "fill_color": "#000000"
    }
    response = client.post("/api/generator/generate/svg", json=payload)
    assert response.status_code == 200
    assert "image/svg+xml" in response.headers["content-type"]
    assert b"<svg" in response.content

def test_generate_qr_max_length_validation():
    long_data = "A" * 4001
    payload = {"data": long_data}
    response = client.post("/api/generator/generate", json=payload)
    assert response.status_code == 422

def test_generate_qr_target_size_bounds_validation():
    payload_too_large = {"data": "test", "target_size": 9000}
    response1 = client.post("/api/generator/generate", json=payload_too_large)
    assert response1.status_code == 422

    payload_too_small = {"data": "test", "target_size": 5}
    response2 = client.post("/api/generator/generate", json=payload_too_small)
    assert response2.status_code == 422
