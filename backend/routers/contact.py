from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
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
    print(f"--- New Contact Form Submission ---")
    print(f"Name: {form.name}")
    print(f"Email: {form.email}")
    print(f"Subject: {form.subject}")
    print(f"Message: {form.message}")
    print(f"-----------------------------------")
    
    # Simulate a small delay as if sending an email
    import asyncio
    await asyncio.sleep(0.5)
    
    return {"status": "success", "message": "Message received"}
