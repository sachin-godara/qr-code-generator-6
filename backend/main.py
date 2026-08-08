from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from routers import generator, contact
from limiter import limiter

app = FastAPI(
    title="Custom QR Studio API",
    description="Backend API for generating highly customized QR Codes.",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

import os

# Configure CORS
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

if "*" in ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Accept", "Authorization"],
    )

# Include Routers
app.include_router(generator.router)
app.include_router(contact.router)

@app.get("/api/health")
@limiter.limit("60/minute")
def health_check(request: Request):
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    is_dev = os.getenv("ENV", "development").lower() == "development"
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=is_dev)

