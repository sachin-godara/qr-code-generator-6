# 🔌 01 - FastAPI Routers, Schemas & API Endpoints

> **Complete specification for all REST API endpoints (`backend/routers/generator.py`, `backend/routers/contact.py`), Pydantic V2 request validation schemas, rate limiting policies, and HTTP caching headers.**

---

## 📋 1. Request Schemas (Pydantic V2)

`backend/routers/generator.py` defines strict validation schemas using **Pydantic V2**:

```python
class QRRequest(BaseModel):
    data: str = Field(..., max_length=4000)
    dots_color: str = Field("#000000", max_length=50)
    bg_color: str = Field("#ffffff", max_length=50)
    bg_transparent: bool = False
    bg_image: Optional[str] = None
    bg_blend_mode: str = Field("normal", max_length=30)
    bg_image_opacity: int = Field(100, ge=0, le=100)
    dots_style: str = Field("square", max_length=50)
    
    # Eye styling
    link_eyes: bool = True
    eye_color: str = Field("#000000", max_length=50)
    eyeball_color: str = Field("#000000", max_length=50)
    eye_frame_style: str = Field("square", max_length=50)
    eyeball_style: str = Field("square", max_length=50)
    
    eye_color_tl: Optional[str] = Field(None, max_length=50)
    eyeball_color_tl: Optional[str] = Field(None, max_length=50)
    eye_frame_style_tl: Optional[str] = Field(None, max_length=50)
    eyeball_style_tl: Optional[str] = Field(None, max_length=50)
    
    eye_color_tr: Optional[str] = Field(None, max_length=50)
    eyeball_color_tr: Optional[str] = Field(None, max_length=50)
    eye_frame_style_tr: Optional[str] = Field(None, max_length=50)
    eyeball_style_tr: Optional[str] = Field(None, max_length=50)

    eye_color_bl: Optional[str] = Field(None, max_length=50)
    eyeball_color_bl: Optional[str] = Field(None, max_length=50)
    eye_frame_style_bl: Optional[str] = Field(None, max_length=50)
    eyeball_style_bl: Optional[str] = Field(None, max_length=50)
    
    # Frame styling
    frame_style: str = Field("none", max_length=50)
    frame_color: str = Field("#000000", max_length=50)
    frame_text: str = Field("SCAN ME", max_length=100)
    frame_text_color: str = Field("#ffffff", max_length=50)
    frame_text_size: int = Field(60, ge=10, le=200)
    frame_padding: int = Field(30, ge=0, le=200)
    frame_radius: int = Field(25, ge=0, le=100)
    frame_border: int = Field(15, ge=0, le=100)
    top_text: str = Field("SCAN ME", max_length=100)
    font_name: str = Field("Outfit-Bold.ttf", max_length=100)
    
    # Gradient styling
    gradient_type: str = Field("Solid Color", max_length=50)
    dots_color_end: str = Field("#000000", max_length=50)
    
    # Logo embedding
    logo_image: Optional[str] = None
    preset_logo: str = Field("None", max_length=50)
    preset_logo_color: Optional[str] = Field(None, max_length=50)
    logo_card_shape: str = Field("None", max_length=50)
    remove_logo_bg: bool = False
    logo_size_ratio: float = Field(0.18, ge=0.05, le=0.5)
    logo_card_padding: int = Field(10, ge=0, le=100)
    logo_clear_size: float = Field(0.5, ge=0.0, le=5.0)
    logo_bg_color: str = Field("#ffffff", max_length=50)
    logo_bg_tolerance: int = Field(30, ge=0, le=255)
    
    # Canvas Effects
    effect_shadow: str = Field("none", max_length=50)
    effect_shadow_color: str = Field("rgba(0,0,0,0.15)", max_length=50)
    canvas_radius: int = Field(0, ge=0, le=200)
    canvas_border_width: int = Field(0, ge=0, le=100)
    canvas_border_color: str = Field("#000000", max_length=50)
    canvas_border_radius: int = Field(16, ge=0, le=200)
    invert_colors: bool = False

    box_size: int = Field(10, ge=1, le=30)
    error_correction: str = Field("H", max_length=5)
    quiet_zone: int = Field(4, ge=0, le=20)
    target_size: Optional[int] = Field(None, ge=10, le=4096)
    no_stretching: bool = False
    
    model_config = {"extra": "ignore"}
```

---

## 🚀 2. Endpoint Specification Matrix

| Method | Endpoint | Rate Limit | Media Type | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/generator/generate` | `120/min` | `image/png` | Generates high-res PNG image. |
| `POST` | `/api/generator/generate/svg` | `60/min` | `image/svg+xml` | Generates lossless XML vector SVG. |
| `POST` | `/api/generator/generate/pdf` | `60/min` | `application/pdf` | Generates printable vector PDF. |
| `GET` | `/api/generator/preview/frame/{style}` | `200/min` | `image/png` | Returns cached frame thumbnail. |
| `GET` | `/api/generator/preview/text_frame/{style}` | `200/min` | `image/png` | Returns cached text frame thumbnail. |
| `POST` | `/api/generator/generate/batch` | `10/min` | `application/zip` | Generates up to 50 QR codes in a streamed ZIP. |
| `POST` | `/api/generator/scan` | `60/min` | `application/json` | Uploads image file and executes computer vision scanner. |
| `POST` | `/api/contact` | `10/min` | `application/json` | Ingests user inquiries and contact form submissions. |
| `GET` | `/api/health` | `60/min` | `application/json` | Health check probe returning `{"status": "ok"}`. |

---

## ⚡ 3. HTTP Caching Headers Strategy

To maximize performance, endpoints emit tailored `Cache-Control` headers:
- **Generated Images (`/generate`, `/svg`, `/pdf`)**:
  `Cache-Control: public, max-age=86400, stale-while-revalidate=3600` (Allows CDNs and client browsers to cache identical payloads for 24 hours).
- **Static Previews (`/preview/frame/*`)**:
  `Cache-Control: public, max-age=604800, immutable` (Permanent 7-day browser caching for immutable frame icon assets).
