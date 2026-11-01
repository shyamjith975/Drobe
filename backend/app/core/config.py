import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    PROJECT_NAME: str = "DROBE Fashion Ecosystem"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database: Supports SQLite for zero-friction local run/testing, or PostgreSQL
    DATABASE_URL: str = "sqlite:///./drobe.db"
    TEST_DATABASE_URL: str = "sqlite:///./test_drobe.db"

    # Security
    SECRET_KEY: str = "drobe_master_jwt_secret_key_super_secure_2026_xyz"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours for dev convenience
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://localhost:19006",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:8000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    # Media Uploads
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    ALLOWED_VIDEO_TYPES: List[str] = ["video/mp4", "video/webm", "video/quicktime"]

    # Razorpay Sandbox
    RAZORPAY_KEY_ID: str = "rzp_test_drobe2026"
    RAZORPAY_KEY_SECRET: str = "drobe_mock_secret_key"
    DEFAULT_COMMISSION_PERCENTAGE: float = 20.0
    CURRENCY: str = "INR"



settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
