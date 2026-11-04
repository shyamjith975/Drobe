from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.style_profile import CustomerStyleProfile
from app.schemas.all_schemas import StyleProfileUpdateSchema
from app.api.deps import get_current_user

router = APIRouter(prefix="/style-profile", tags=["Style Profile"])

def serialize_style_profile(p: CustomerStyleProfile) -> dict:
    return {
        "id": p.id,
        "user_id": p.user_id,
        "selfie_url": p.selfie_url,
        "style_personalities": p.style_personalities or ["Classic Minimalist", "Old Money Heritage"],
        "face_shape": p.face_shape or "Oval",
        "body_structure": p.body_structure or "Hourglass",
        "height_cm": p.height_cm or 168,
        "sizes": p.sizes or {"top": "M", "bottom": "30", "dress": "UK 10", "shoes": "UK 6"},
        "fit_preferences": p.fit_preferences or ["Tailored", "Relaxed"],
        "lifestyle_activities": p.lifestyle_activities or ["Corporate / Office", "Festive Celebrations", "Weekend Casual"],
        "occasion_needs": p.occasion_needs or ["Capsule Wardrobe Refresh", "Upcoming Wedding Guest"],
        "budget_tier": p.budget_tier or "Mid-Luxury",
        "budget_ranges": p.budget_ranges or {
            "tops": "₹2,500 - ₹6,000",
            "dresses": "₹6,000 - ₹20,000",
            "occasion_wear": "₹15,000 - ₹50,000",
            "accessories": "₹3,000 - ₹12,000"
        },
        "skin_undertone": p.skin_undertone or "Warm",
        "favorite_colors": p.favorite_colors or ["#191919", "#F7F5F0", "#1B4D3E", "#D4AF37", "#F4DCD6"],
        "colors_to_avoid": p.colors_to_avoid or ["Neon Green", "Mustard Yellow"],
        "fabrics_preferred": p.fabrics_preferred or ["Mulberry Silk", "Mongolian Cashmere", "Normandy Flax Linen", "Virgin Wool"],
        "fabrics_avoided": p.fabrics_avoided or ["Polyester", "Acrylic"],
        "share_with_stylists": p.share_with_stylists if p.share_with_stylists is not None else True,
        "notes_for_stylist": p.notes_for_stylist,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

@router.get("/me")
def get_my_style_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(CustomerStyleProfile).filter(CustomerStyleProfile.user_id == current_user.id).first()
    if not profile:
        # Auto-create initial profile for the user
        profile = CustomerStyleProfile(
            user_id=current_user.id,
            selfie_url=current_user.profile.avatar_url if current_user.profile else None
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return serialize_style_profile(profile)

@router.put("/me")
def update_my_style_profile(
    payload: StyleProfileUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(CustomerStyleProfile).filter(CustomerStyleProfile.user_id == current_user.id).first()
    if not profile:
        profile = CustomerStyleProfile(user_id=current_user.id)
        db.add(profile)

    payload_dict = payload.model_dump(exclude_unset=True)
    for field, value in payload_dict.items():
        if hasattr(profile, field):
            setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return serialize_style_profile(profile)

@router.get("/user/{user_id}")
def get_user_style_profile(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(CustomerStyleProfile).filter(CustomerStyleProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Style profile not found")
    
    # Check access permission: user themselves or customer has allowed sharing
    if user_id != current_user.id and not profile.share_with_stylists:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Client has opted to keep their style profile private"
        )
    
    return serialize_style_profile(profile)
