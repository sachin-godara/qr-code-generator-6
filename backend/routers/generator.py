import logging
import json
import zipfile
import io
import re
from typing import Optional, Any, List, Dict

from limiter import limiter
from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel, Field

from services.scan_service import deep_scan_qr

from services.qr_service import (
    generate_qr_image,
    generate_qr_svg,
    generate_qr_pdf,
    get_frame_preview,
    get_text_frame_preview,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/generator",
    tags=["Generator"]
)

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
    text_style: str = Field("none", max_length=50)
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
    
    # Effects
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

@router.post("/generate")
@limiter.limit("120/minute")
async def generate_qr(payload: QRRequest, request: Request):
    try:
        img_bytes = await run_in_threadpool(generate_qr_image, payload.data, payload.model_dump())
        content = img_bytes.getvalue() if hasattr(img_bytes, 'getvalue') else img_bytes
        return Response(
            content=content,
            media_type="image/png",
            headers={"Cache-Control": "public, max-age=86400, stale-while-revalidate=3600"}
        )
    except Exception as e:
        logger.exception("Failed to generate QR PNG image")
        raise HTTPException(status_code=500, detail="Failed to generate QR code")

@router.post("/generate/svg")
@limiter.limit("60/minute")
async def generate_svg(payload: QRRequest, request: Request):
    try:
        svg_bytes = await run_in_threadpool(generate_qr_svg, payload.data, payload.model_dump())
        return Response(
            content=svg_bytes,
            media_type="image/svg+xml",
            headers={"Cache-Control": "public, max-age=86400, stale-while-revalidate=3600"}
        )
    except Exception as e:
        logger.exception("Failed to generate QR SVG")
        raise HTTPException(status_code=500, detail="Failed to generate SVG QR code")

@router.post("/generate/pdf")
@limiter.limit("60/minute")
async def generate_pdf(payload: QRRequest, request: Request):
    try:
        pdf_bytes = await run_in_threadpool(generate_qr_pdf, payload.data, payload.model_dump())
        content = pdf_bytes.getvalue() if hasattr(pdf_bytes, 'getvalue') else pdf_bytes
        return Response(
            content=content,
            media_type="application/pdf",
            headers={"Cache-Control": "public, max-age=86400, stale-while-revalidate=3600"}
        )
    except Exception as e:
        logger.exception("Failed to generate QR PDF")
        raise HTTPException(status_code=500, detail="Failed to generate PDF QR code")

@router.get("/preview/frame/{style}")
@limiter.limit("200/minute")
async def get_frame_thumbnail(style: str, request: Request):
    try:
        img_bytes = await run_in_threadpool(get_frame_preview, style)
        return Response(
            content=img_bytes,
            media_type="image/png",
            headers={"Cache-Control": "public, max-age=604800, immutable"}
        )
    except Exception as e:
        logger.exception(f"Failed to render frame thumbnail for style {style}")
        raise HTTPException(status_code=500, detail="Failed to render frame preview")

@router.get("/preview/text_frame/{style}")
@limiter.limit("200/minute")
async def get_text_frame_thumbnail(style: str, request: Request):
    try:
        img_bytes = await run_in_threadpool(get_text_frame_preview, style)
        return Response(
            content=img_bytes,
            media_type="image/png",
            headers={"Cache-Control": "public, max-age=604800, immutable"}
        )
    except Exception as e:
        logger.exception(f"Failed to render text frame thumbnail for style {style}")
        raise HTTPException(status_code=500, detail="Failed to render text frame preview")

class BatchItem(BaseModel):
    data: str = Field(..., max_length=4000)
    filename: Optional[str] = None

class BatchQRRequest(BaseModel):
    items: List[BatchItem]
    settings: Dict[str, Any]
    format: str = "png"
    target_size: Optional[int] = Field(1024, ge=10, le=4096)

def sanitize_filename(name: str) -> str:
    name = re.sub(r'[\\/*?:"<>|\x00-\x1f]', "", name)
    name = name.replace("..", "").strip().strip(".")
    name = name[:64]
    return name if name else "QR_Item"

@router.post("/generate/batch")
@limiter.limit("10/minute")
async def generate_batch(payload: BatchQRRequest, request: Request):
    try:
        if len(payload.items) > 50:
            raise HTTPException(status_code=400, detail="Batch size limited to 50 items per request.")

        zip_buffer = io.BytesIO()
        
        if payload.target_size:
            payload.settings["target_size"] = payload.target_size

        def process_batch():
            with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
                for idx, item in enumerate(payload.items):
                    base_name = sanitize_filename(item.filename) if item.filename else f"QR_Item_{idx+1:03d}"
                    ext = payload.format.lower()
                    if ext not in ["png", "svg", "pdf"]:
                        ext = "png"
                    file_name = f"{base_name}.{ext}"
                    
                    if ext == "svg":
                        svg_bytes = generate_qr_svg(item.data, payload.settings)
                        zip_file.writestr(file_name, svg_bytes)
                    elif ext == "pdf":
                        pdf_io = generate_qr_pdf(item.data, payload.settings)
                        zip_file.writestr(file_name, pdf_io.getvalue())
                    else:
                        png_io = generate_qr_image(item.data, payload.settings)
                        zip_file.writestr(file_name, png_io.getvalue())
            zip_buffer.seek(0)
            return zip_buffer
            
        final_buffer = await run_in_threadpool(process_batch)

        return StreamingResponse(
            final_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=batch_qrcodes.zip"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Batch QR generation failed")
        raise HTTPException(status_code=500, detail="Batch generation failed due to internal error")

ALLOWED_IMAGE_MIMES = {
    "image/png", "image/jpeg", "image/jpg", "image/webp",
    "image/gif", "image/bmp", "image/tiff", "application/octet-stream"
}

@router.post("/scan")
@limiter.limit("60/minute")
async def scan_qr_file(request: Request, file: UploadFile = File(...)):
    try:
        if file.content_type and file.content_type.lower() not in ALLOWED_IMAGE_MIMES:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload a valid image file (PNG, JPEG, WebP, GIF, BMP)."
            )

        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        if len(file_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum scan image size is 10 MB.")

        # Run computer vision processing in threadpool so it doesn't block async event loop
        decoded_text = await run_in_threadpool(deep_scan_qr, file_bytes)
        
        return {"success": True, "text": decoded_text}
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception("Failed to deep scan QR image")
        raise HTTPException(status_code=500, detail="Failed to analyze image for QR code")
