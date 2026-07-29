from fastapi import APIRouter, HTTPException, BackgroundTasks, Form, UploadFile, File
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional, Any, List, Dict
from services.qr_service import generate_qr_image, generate_qr_svg, generate_qr_pdf, get_frame_preview, get_text_frame_preview
import json
import zipfile
import io
import re

router = APIRouter(
    prefix="/api/generator",
    tags=["Generator"]
)

class QRRequest(BaseModel):
    data: str
    dots_color: str = "#000000"
    bg_color: str = "#ffffff"
    bg_transparent: bool = False
    bg_image: Optional[str] = None
    bg_blend_mode: str = "normal"
    bg_image_opacity: int = 100
    dots_style: str = "square"
    
    # Eye styling
    link_eyes: bool = True
    eye_color: str = "#000000"
    eyeball_color: str = "#000000"
    eye_frame_style: str = "square"
    eyeball_style: str = "square"
    
    eye_color_tl: Optional[str] = None
    eyeball_color_tl: Optional[str] = None
    eye_frame_style_tl: Optional[str] = None
    eyeball_style_tl: Optional[str] = None

    eye_color_tr: Optional[str] = None
    eyeball_color_tr: Optional[str] = None
    eye_frame_style_tr: Optional[str] = None
    eyeball_style_tr: Optional[str] = None

    eye_color_bl: Optional[str] = None
    eyeball_color_bl: Optional[str] = None
    eye_frame_style_bl: Optional[str] = None
    eyeball_style_bl: Optional[str] = None
    
    # Frame styling
    frame_style: str = "none"
    frame_color: str = "#000000"
    text_style: str = "none"
    frame_text: str = "SCAN ME"
    frame_text_color: str = "#ffffff"
    frame_text_size: int = 60
    frame_padding: int = 30
    frame_radius: int = 25
    frame_border: int = 15
    top_text: str = "SCAN ME"
    font_name: str = "Outfit-Bold.ttf"
    
    # Gradient styling
    gradient_type: str = "Solid Color"
    dots_color_end: str = "#000000"
    
    # Logo embedding
    logo_image: Optional[str] = None
    preset_logo: str = "None"
    preset_logo_color: Optional[str] = None
    logo_card_shape: str = "None"
    remove_logo_bg: bool = False
    logo_size_ratio: float = 0.18
    logo_card_padding: int = 10
    logo_clear_size: float = 0.5
    logo_bg_color: str = "#ffffff"
    logo_bg_tolerance: int = 30
    
    # Effects
    effect_shadow: str = "none"
    effect_shadow_color: str = "rgba(0,0,0,0.15)"
    canvas_radius: int = 0
    canvas_border_width: int = 0
    canvas_border_color: str = "#000000"
    canvas_border_radius: int = 16
    invert_colors: bool = False

    # Other configs
    box_size: int = 10
    error_correction: str = "H"
    quiet_zone: int = 4
    
    model_config = {"extra": "allow"}

@router.post("/generate")
async def generate_qr(request: QRRequest):
    try:
        img_bytes = generate_qr_image(request.data, request.model_dump())
        return StreamingResponse(img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/svg")
async def generate_svg(request: QRRequest):
    try:
        svg_bytes = generate_qr_svg(request.data, request.model_dump())
        return Response(content=svg_bytes, media_type="image/svg+xml")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/pdf")
async def generate_pdf(request: QRRequest):
    try:
        pdf_bytes = generate_qr_pdf(request.data, request.model_dump())
        return StreamingResponse(pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/preview/frame/{style}")
async def get_frame_thumbnail(style: str):
    try:
        img_bytes = get_frame_preview(style)
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/preview/text_frame/{style}")
async def get_text_frame_thumbnail(style: str):
    try:
        img_bytes = get_text_frame_preview(style)
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class BatchItem(BaseModel):
    data: str
    filename: Optional[str] = None

class BatchQRRequest(BaseModel):
    items: List[BatchItem]
    settings: Dict[str, Any]
    format: str = "png"
    target_size: Optional[int] = 1024

def sanitize_filename(name: str) -> str:
    # Remove invalid characters for filenames
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    name = name.strip()
    return name if name else "QR_Item"

@router.post("/generate/batch")
async def generate_batch(request: BatchQRRequest):
    try:
        if len(request.items) > 500:
            raise HTTPException(status_code=400, detail="Batch size limited to 500 items per request.")

        # Create an in-memory zip file
        zip_buffer = io.BytesIO()
        
        # Inject target size if requested
        if request.target_size:
            request.settings["target_size"] = request.target_size

        with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
            for idx, item in enumerate(request.items):
                # Generate base filename
                base_name = sanitize_filename(item.filename) if item.filename else f"QR_Item_{idx+1:03d}"
                ext = request.format.lower()
                if ext not in ["png", "svg", "pdf"]:
                    ext = "png"
                file_name = f"{base_name}.{ext}"
                
                # Generate QR code
                if ext == "svg":
                    svg_bytes = generate_qr_svg(item.data, request.settings)
                    zip_file.writestr(file_name, svg_bytes)
                elif ext == "pdf":
                    pdf_io = generate_qr_pdf(item.data, request.settings)
                    zip_file.writestr(file_name, pdf_io.getvalue())
                else:
                    png_io = generate_qr_image(item.data, request.settings)
                    zip_file.writestr(file_name, png_io.getvalue())

        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=batch_qrcodes.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

