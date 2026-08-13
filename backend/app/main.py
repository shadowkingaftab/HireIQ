from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from proofhire.backend.app.core.config import settings
from proofhire.backend.app.core.exception_handlers import add_exception_handlers
from proofhire.backend.app.lifecycle import register_lifecycle_handlers

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register lifecycle handlers (startup/shutdown)
register_lifecycle_handlers(app)

# Add exception handlers
add_exception_handlers(app)

@app.get("/")
async def root():
    return {"message": "Welcome to ProofHire API", "version": settings.VERSION}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
