import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine
import app.models # ensure all models are imported and registered

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.posts import router as posts_router
from app.api.v1.stylists import router as stylists_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.payments import router as payments_router
from app.api.v1.brands import router as brands_router
from app.api.v1.campaigns import router as campaigns_router
from app.api.v1.style_guides import router as style_guides_router
from app.api.v1.discover import router as discover_router
from app.api.v1.messages import router as messages_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.admin import router as admin_router
from app.api.v1.media import router as media_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="DROBE — Luxury Fashion Editorial, Social Community & Professional Marketplace Platform API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all for web, admin, and mobile
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Routers
api_v1 = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1)
app.include_router(posts_router, prefix=api_v1)
app.include_router(stylists_router, prefix=api_v1)
app.include_router(bookings_router, prefix=api_v1)
app.include_router(payments_router, prefix=api_v1)
app.include_router(brands_router, prefix=api_v1)
app.include_router(campaigns_router, prefix=api_v1)
app.include_router(style_guides_router, prefix=api_v1)
app.include_router(discover_router, prefix=api_v1)
app.include_router(messages_router, prefix=api_v1)
app.include_router(notifications_router, prefix=api_v1)
app.include_router(admin_router, prefix=api_v1)
app.include_router(media_router, prefix=api_v1)

@app.get("/")
def root():
    return {
        "platform": "DROBE",
        "tagline": "Discover. Express. Connect. Style.",
        "status": "online",
        "docs_url": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }
