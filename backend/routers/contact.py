from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
import logging

logger = logging.getLogger(__name__)
from limiter import limiter

router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"]
)

from pydantic import BaseModel, EmailStr, Field

class ContactForm(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    subject: str = Field(..., max_length=200)
    message: str = Field(..., max_length=2000)

def _sanitize_log(val: str, max_len: int = 150) -> str:
    clean = val.replace("\r", " ").replace("\n", " ").strip()
    return clean[:max_len]

@router.post("")
@limiter.limit("5/minute")
async def submit_contact_form(request: Request, form: ContactForm):
    """
    Handle contact form submissions.
    """
    safe_name = _sanitize_log(form.name, 100)
    safe_subject = _sanitize_log(form.subject, 150)
    logger.info(f"Contact submission received - from: {safe_name}, email: {form.email}, subject: {safe_subject}")
    
    # Simulate async dispatch
    import asyncio
    await asyncio.sleep(0.1)
    
    return {"status": "success", "message": "Message received"}
