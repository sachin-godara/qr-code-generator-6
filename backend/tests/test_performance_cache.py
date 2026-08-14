import time
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_cache_and_latency_performance():
    payload = {
        "data": "https://example.com/performance-test",
        "dots_color": "#1e40af",
        "bg_color": "#ffffff",
        "dots_style": "rounded",
        "eye_frame_style": "rounded",
        "eyeball_style": "circle",
        "effect_shadow": "soft",
        "canvas_radius": 12,
        "box_size": 10
    }

    # 1. Cold Request (renders fresh)
    t0 = time.perf_counter()
    r1 = client.post("/api/generator/generate", json=payload)
    t_cold = (time.perf_counter() - t0) * 1000

    assert r1.status_code == 200
    assert r1.headers["content-type"] == "image/png"
    assert "public" in r1.headers.get("cache-control", "")

    # 2. Warm Request (hits in-memory LRU cache)
    t1 = time.perf_counter()
    r2 = client.post("/api/generator/generate", json=payload)
    t_cached = (time.perf_counter() - t1) * 1000

    assert r2.status_code == 200
    assert r1.content == r2.content

    print(f"\n[BENCHMARK] Cold Request: {t_cold:.2f}ms | Cached Hit: {t_cached:.2f}ms | Speedup: {t_cold/max(0.01, t_cached):.1f}x")
    assert t_cached < t_cold
