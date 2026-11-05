from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.wardrobe import WardrobeItem, WardrobeOutfit, WardrobeGap
from app.schemas.all_schemas import WardrobeItemCreate, WardrobeOutfitCreate, WardrobeGapCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/wardrobe", tags=["Digital Wardrobe & Memory"])

class ConsignItemRequest(BaseModel):
    rental_price_per_day: float # e.g. 3500.0
    security_deposit_inr: Optional[float] = 10000.0
    delivery_pincode: Optional[str] = "682001"

def serialize_item(item: WardrobeItem) -> dict:
    return {
        "id": item.id,
        "user_id": item.user_id,
        "name": item.name,
        "category": item.category,
        "color": item.color,
        "color_hex": item.color_hex,
        "material": item.material,
        "brand": item.brand,
        "image_url": item.image_url,
        "purchase_price": item.purchase_price,
        "purchase_date": item.purchase_date,
        "tags": item.tags or [],
        "is_favorite": item.is_favorite,
        "shared_with_stylist": item.shared_with_stylist,
        "is_consigned_for_rental": getattr(item, "is_consigned_for_rental", False),
        "rental_price_per_day": getattr(item, "rental_price_per_day", None),
        "consignment_status": getattr(item, "consignment_status", "wardrobe"),
        "consignment_earnings_total": getattr(item, "consignment_earnings_total", 0.0),
        "consignment_payout_pct": getattr(item, "consignment_payout_pct", 60.0),
        "created_at": item.created_at.isoformat() if item.created_at else None,
    }

def serialize_outfit(outfit: WardrobeOutfit) -> dict:
    return {
        "id": outfit.id,
        "user_id": outfit.user_id,
        "name": outfit.name,
        "occasion": outfit.occasion,
        "item_ids": outfit.item_ids or [],
        "image_url": outfit.image_url,
        "notes": outfit.notes,
        "created_at": outfit.created_at.isoformat() if outfit.created_at else None,
    }

def serialize_gap(gap: WardrobeGap) -> dict:
    return {
        "id": gap.id,
        "user_id": gap.user_id,
        "title": gap.title,
        "category": gap.category,
        "priority": gap.priority,
        "notes": gap.notes,
        "recommended_by_stylist": gap.recommended_by_stylist,
        "stylist_name": gap.stylist_name,
        "created_at": gap.created_at.isoformat() if gap.created_at else None,
    }

# ----------------- ITEMS -----------------
@router.get("/items")
def list_my_wardrobe_items(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(WardrobeItem).filter(WardrobeItem.user_id == current_user.id)
    if category and category.lower() != "all":
        query = query.filter(WardrobeItem.category.ilike(f"%{category}%"))
    items = query.order_by(desc(WardrobeItem.created_at)).all()
    return [serialize_item(item) for item in items]

@router.post("/items", status_code=status.HTTP_201_CREATED)
def create_wardrobe_item(
    payload: WardrobeItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = WardrobeItem(
        user_id=current_user.id,
        name=payload.name,
        category=payload.category,
        color=payload.color or "Charcoal",
        color_hex=payload.color_hex or "#191919",
        material=payload.material or "100% Cashmere",
        brand=payload.brand or "Maison Drobe",
        image_url=payload.image_url,
        purchase_price=payload.purchase_price,
        purchase_date=payload.purchase_date,
        tags=payload.tags or [],
        is_favorite=payload.is_favorite or False,
        shared_with_stylist=payload.shared_with_stylist if payload.shared_with_stylist is not None else True
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return serialize_item(item)

@router.delete("/items/{item_id}")
def delete_wardrobe_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wardrobe item not found")
    db.delete(item)
    db.commit()
    return {"success": True, "message": "Wardrobe item deleted"}

@router.post("/items/{item_id}/consign-to-rental")
def consign_wardrobe_item_to_rental(
    item_id: str,
    payload: ConsignItemRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garment not found in your wardrobe")

    item.is_consigned_for_rental = True
    item.rental_price_per_day = payload.rental_price_per_day
    item.consignment_status = "listed_for_rental"
    db.commit()
    db.refresh(item)

    return {
        "message": f"'{item.name}' is now active on the public DROBE Luxury Rental Vault!",
        "item": serialize_item(item),
        "revenue_share": {
            "owner_takehome_pct": 60,
            "owner_per_rental_earnings": payload.rental_price_per_day * 0.60,
            "dry_cleaning_logistics_pct": 25,
            "platform_commission_pct": 15
        }
    }

# ----------------- OUTFITS -----------------
@router.get("/outfits")
def list_my_outfits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    outfits = db.query(WardrobeOutfit).filter(WardrobeOutfit.user_id == current_user.id).order_by(desc(WardrobeOutfit.created_at)).all()
    return [serialize_outfit(o) for o in outfits]

@router.post("/outfits", status_code=status.HTTP_201_CREATED)
def create_outfit(
    payload: WardrobeOutfitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    outfit = WardrobeOutfit(
        user_id=current_user.id,
        name=payload.name,
        occasion=payload.occasion or "Smart Casual",
        item_ids=payload.item_ids or [],
        image_url=payload.image_url,
        notes=payload.notes
    )
    db.add(outfit)
    db.commit()
    db.refresh(outfit)
    return serialize_outfit(outfit)

# ----------------- WARDROBE GAPS -----------------
@router.get("/gaps")
def list_my_wardrobe_gaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gaps = db.query(WardrobeGap).filter(WardrobeGap.user_id == current_user.id).order_by(desc(WardrobeGap.created_at)).all()
    return [serialize_gap(g) for g in gaps]

@router.post("/gaps", status_code=status.HTTP_201_CREATED)
def create_wardrobe_gap(
    payload: WardrobeGapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gap = WardrobeGap(
        user_id=current_user.id,
        title=payload.title,
        category=payload.category or "Outerwear",
        priority=payload.priority or "High",
        notes=payload.notes,
        recommended_by_stylist=payload.recommended_by_stylist or False,
        stylist_name=payload.stylist_name
    )
    db.add(gap)
    db.commit()
    db.refresh(gap)
    return serialize_gap(gap)

# ----------------- STYLIST CLIENT VIEW -----------------
@router.get("/user/{user_id}")
def get_client_shared_wardrobe(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = db.query(WardrobeItem).filter(
        WardrobeItem.user_id == user_id,
        WardrobeItem.shared_with_stylist == True
    ).order_by(desc(WardrobeItem.created_at)).all()

    outfits = db.query(WardrobeOutfit).filter(WardrobeOutfit.user_id == user_id).order_by(desc(WardrobeOutfit.created_at)).all()
    gaps = db.query(WardrobeGap).filter(WardrobeGap.user_id == user_id).order_by(desc(WardrobeGap.created_at)).all()

    return {
        "items": [serialize_item(item) for item in items],
        "outfits": [serialize_outfit(o) for o in outfits],
        "gaps": [serialize_gap(g) for g in gaps]
    }
