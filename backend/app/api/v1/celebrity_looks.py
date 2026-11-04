from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.celebrity_look import CelebrityLook
from app.schemas.all_schemas import CelebrityLookCreate

router = APIRouter(prefix="/celebrity-looks", tags=["Celebrity Looks & Recreate"])

def serialize_look(look: CelebrityLook) -> dict:
    return {
        "id": look.id,
        "title": look.title,
        "celebrity_name": look.celebrity_name,
        "event_name": look.event_name,
        "image_url": look.image_url,
        "description": look.description,
        "original_designer": look.original_designer,
        "original_price_est": look.original_price_est,
        "silhouette_type": look.silhouette_type,
        "key_fabrics": look.key_fabrics,
        "color_palette": look.color_palette or [],
        "breakdown_items": look.breakdown_items or [],
        "budget_recreation_cost": look.budget_recreation_cost,
        "savings_percentage": look.savings_percentage,
        "stylist_notes": look.stylist_notes,
        "reviewed_by_stylist_name": look.reviewed_by_stylist_name,
        "is_expert_reviewed": look.is_expert_reviewed,
        "created_at": look.created_at.isoformat() if look.created_at else None,
    }

@router.get("/")
def list_celebrity_looks(db: Session = Depends(get_db)):
    looks = db.query(CelebrityLook).order_by(desc(CelebrityLook.created_at)).all()
    return [serialize_look(l) for l in looks]

@router.get("/{look_id}")
def get_celebrity_look(look_id: str, db: Session = Depends(get_db)):
    look = db.query(CelebrityLook).filter(CelebrityLook.id == look_id).first()
    if not look:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Celebrity look not found")
    return serialize_look(look)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_celebrity_look(payload: CelebrityLookCreate, db: Session = Depends(get_db)):
    look = CelebrityLook(
        title=payload.title,
        celebrity_name=payload.celebrity_name,
        event_name=payload.event_name,
        image_url=payload.image_url,
        description=payload.description,
        original_designer=payload.original_designer,
        original_price_est=payload.original_price_est or "₹4,50,000",
        silhouette_type=payload.silhouette_type or "Structured",
        key_fabrics=payload.key_fabrics or "Silk",
        color_palette=payload.color_palette or [],
        breakdown_items=payload.breakdown_items or [],
        budget_recreation_cost=payload.budget_recreation_cost or "₹45,000",
        savings_percentage=payload.savings_percentage or 85,
        stylist_notes=payload.stylist_notes,
        reviewed_by_stylist_name=payload.reviewed_by_stylist_name or "Maya Nambiar",
        is_expert_reviewed=payload.is_expert_reviewed if payload.is_expert_reviewed is not None else True
    )
    db.add(look)
    db.commit()
    db.refresh(look)
    return serialize_look(look)
