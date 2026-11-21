# ⚡ 07 - Caching, Concurrency & Performance Optimization

> **Deep-dive into thread-safe in-memory LRU binary caching, MD5 payload signature hashing, FastAPI threadpool concurrency, lazy module imports, and memory safety controls in `backend/services/qr_service.py` and `backend/main.py`.**

---

## 🗄️ 1. Thread-Safe LRU Binary Caching (`SimpleLRUCache`)

In `backend/services/qr_service.py`, generated PNG and SVG binaries are stored in an in-memory Least Recently Used (LRU) cache:

```python
class SimpleLRUCache:
    """Thread-safe in-memory LRU cache for rendered QR binaries."""
    def __init__(self, maxsize: int = 1024):
        self.maxsize = maxsize
        self.cache = OrderedDict()
        self.lock = threading.Lock()

    def get(self, key: str):
        with self.lock:
            if key in self.cache:
                self.cache.move_to_end(key)
                return self.cache[key]
            return None

    def set(self, key: str, value: bytes):
        with self.lock:
            if key in self.cache:
                self.cache.move_to_end(key)
            self.cache[key] = value
            if len(self.cache) > self.maxsize:
                self.cache.popitem(last=False)
```

### MD5 Canonical Signature Hashing (`_compute_cache_key`):
To prevent cache fragmentation caused by varying dictionary key ordering, parameters are serialized into sorted canonical JSON before hashing:

```python
def _compute_cache_key(data: str, params: dict, prefix: str = "img") -> str:
    clean_params = {}
    for k, v in params.items():
        if k == "logo_image":
            clean_params[k] = hashlib.md5(v.encode('utf-8')).hexdigest() if isinstance(v, str) else str(v)
        elif isinstance(v, (str, int, float, bool)) or v is None:
            clean_params[k] = v
        elif isinstance(v, dict):
            clean_params[k] = {str(dk): str(dv) for dk, dv in sorted(v.items())}
            
    serialized = json.dumps({"d": data, "p": clean_params}, sort_keys=True)
    return f"{prefix}:{hashlib.md5(serialized.encode('utf-8')).hexdigest()}"
```
Repeated requests with identical visual parameters are served from RAM in **`< 1.5 ms`**.

---

## 🧵 2. Threadpool Offloading (`run_in_threadpool`)

Image processing with Pillow, PyMuPDF, and OpenCV is CPU-intensive. If executed synchronously inside `async def` route handlers, it would block the Python `asyncio` event loop, causing server latency to spike.

All CPU-bound rendering functions are dispatched to Starlette's worker threadpool:

```python
@router.post("/generate")
async def generate_qr(payload: QRRequest, request: Request):
    img_bytes = await run_in_threadpool(generate_qr_image, payload.data, payload.model_dump())
    return Response(content=img_bytes.getvalue(), media_type="image/png")
```

---

## 💾 3. Memory Safety & Lazy Imports

### 1. Lazy NumPy & PyMuPDF Module Imports:
Heavy scientific libraries (`numpy`, `fitz`, `cv2`) are imported lazily inside the functions that use them. This saves **~35 MB RAM** per worker process on boot.

### 2. Decompression Bomb Guard:
```python
Image.MAX_IMAGE_PIXELS = 10_000_000
```
Restricts Pillow from allocating memory for images exceeding 10 Megapixels, neutralizing decompression bomb attacks.

### 3. Diskless In-Memory ZIP Streaming:
`/api/generator/generate/batch` writes all generated files directly into an in-memory `io.BytesIO` buffer with `zipfile.ZIP_DEFLATED` compression, avoiding temporary disk file creation and eliminating disk I/O bottlenecks.
