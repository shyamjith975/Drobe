from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.content import StyleGuide
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/style-guides", tags=["Editorial Style Guides"])

def serialize_guide(g: StyleGuide) -> dict:
    return {
        "id": g.id,
        "title": g.title,
        "category": g.category,
        "description": g.description,
        "hero_image": g.hero_image,
        "gallery_images": g.gallery_images or [],
        "color_palette": g.color_palette or [],
        "clothing_combinations": g.clothing_combinations or [],
        "stylist_tips": g.stylist_tips or [],
        "occasion": g.occasion,
        "author_name": g.author_name,
        "author_title": g.author_title,
        "is_featured": g.is_featured,
        "created_at": g.created_at.isoformat() if g.created_at else None
    }

@router.get("/")
def list_style_guides(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(StyleGuide)
    if category and category.lower() != "all":
        query = query.filter(StyleGuide.category.ilike(f"%{category}%"))

    guides = query.order_by(desc(StyleGuide.created_at)).all()
    return [serialize_guide(g) for g in guides]

@router.get("/{guide_id}")
def get_guide_by_id(guide_id: str, db: Session = Depends(get_db)):
    guide = db.query(StyleGuide).filter(StyleGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Style guide not found")
    return serialize_guide(guide)
