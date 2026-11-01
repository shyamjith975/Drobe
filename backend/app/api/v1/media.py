import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.core.config import settings

router = APIRouter(prefix="/media", tags=["Media Uploads"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate content type
    allowed_types = settings.ALLOWED_IMAGE_TYPES + settings.ALLOWED_VIDEO_TYPES
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{file.content_type}' is not supported. Allowed types: {', '.join(allowed_types)}"
        )

    # Generate unique filename
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    destination_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    # Save file
    try:
        with open(destination_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file: {str(e)}"
        )

    # Return URL path
    file_url = f"/uploads/{unique_name}"
    return {
        "url": file_url,
        "filename": unique_name,
        "content_type": file.content_type,
        "size_bytes": os.path.getsize(destination_path)
    }
