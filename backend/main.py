from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generator

app = FastAPI(
    title="Custom QR Studio API",
    description="Backend API for generating highly customized QR Codes.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(generator.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
