from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
import logging

logger = logging.getLogger(__name__)
from limiter import limiter

router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"]
)

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@router.post("")
@limiter.limit("5/minute")
async def submit_contact_form(request: Request, form: ContactForm):
    """
    Handle contact form submissions.
    Currently, this just simulates sending an email by printing to the console
    and returning a success response. In a production environment, this would
    integrate with an email service like SendGrid, AWS SES, etc.
    """
    logger.info(
        f"--- New Contact Form Submission ---\n"
        f"Name: {form.name}\n"
        f"Email: {form.email}\n"
        f"Subject: {form.subject}\n"
        f"Message: {form.message}\n"
        f"-----------------------------------"
    )
    
    # Simulate a small delay as if sending an email
    import asyncio
    await asyncio.sleep(0.5)
    
    return {"status": "success", "message": "Message received"}
