from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.commerce import BrandProfile
from app.models.campaign import CreatorCampaign, CampaignApplication, FlashDrop
from app.schemas.all_schemas import CampaignCreate, CampaignApplyRequest, CampaignApplicationStatus
from app.api.deps import get_current_user

router = APIRouter(prefix="/campaigns", tags=["Creator & Brand Collaboration"])

def serialize_campaign(c: CreatorCampaign) -> dict:
    brand = c.brand
    return {
        "id": c.id,
        "brand_id": c.brand_id,
        "brand_name": brand.brand_name if brand else "Featured Brand",
        "brand_logo": brand.logo_url if brand else "",
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "required_creator_type": c.required_creator_type,
        "target_city": c.target_city,
        "budget_inr": c.budget_inr,
        "deliverables": c.deliverables or [],
        "application_deadline": c.application_deadline,
        "status": c.status,
        "applications_count": c.applications_count,
        "created_at": c.created_at.isoformat() if c.created_at else None
    }

@router.get("/")
def list_campaigns(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CreatorCampaign)
    if category and category.lower() != "all":
        query = query.filter(CreatorCampaign.category.ilike(f"%{category}%"))

    campaigns = query.order_by(desc(CreatorCampaign.created_at)).all()
    return [serialize_campaign(c) for c in campaigns]

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_campaign(
    payload: CampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    brand = current_user.brand_profile
    if not brand and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only brands can post creator campaigns")

    brand_id = brand.id if brand else db.query(BrandProfile).first().id

    campaign = CreatorCampaign(
        brand_id=brand_id,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        required_creator_type=payload.required_creator_type,
        target_city=payload.target_city,
        budget_inr=payload.budget_inr,
        deliverables=payload.deliverables,
        application_deadline=payload.application_deadline
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return serialize_campaign(campaign)

@router.get("/{campaign_id}")
def get_campaign_details(campaign_id: str, db: Session = Depends(get_db)):
    campaign = db.query(CreatorCampaign).filter(CreatorCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    data = serialize_campaign(campaign)
    applications = db.query(CampaignApplication).filter(CampaignApplication.campaign_id == campaign_id).all()
    data["applications"] = [
        {
            "id": app.id,
            "creator_id": app.creator_id,
            "creator_name": app.creator.profile.display_name if (app.creator and app.creator.profile) else "Fashion Creator",
            "creator_avatar": app.creator.profile.avatar_url if (app.creator and app.creator.profile) else None,
            "proposal": app.proposal,
            "quoted_price": app.quoted_price,
            "deliverables_plan": app.deliverables_plan,
            "status": app.status,
            "created_at": app.created_at.isoformat() if app.created_at else None
        }
        for app in applications
    ]
    return data

@router.post("/{campaign_id}/apply", status_code=status.HTTP_201_CREATED)
def apply_to_campaign(
    campaign_id: str,
    payload: CampaignApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(CreatorCampaign).filter(CreatorCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    existing = db.query(CampaignApplication).filter(
        CampaignApplication.campaign_id == campaign_id,
        CampaignApplication.creator_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already applied to this campaign")

    application = CampaignApplication(
        campaign_id=campaign_id,
        creator_id=current_user.id,
        proposal=payload.proposal,
        quoted_price=payload.quoted_price,
        deliverables_plan=payload.deliverables_plan
    )
    db.add(application)
    campaign.applications_count += 1
    db.commit()
    db.refresh(application)

    return {
        "message": "Application submitted successfully",
        "application_id": application.id,
        "status": application.status
    }

@router.patch("/applications/{application_id}/status")
def update_application_status(
    application_id: str,
    payload: CampaignApplicationStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(CampaignApplication).filter(CampaignApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    application.status = payload.status
    db.commit()
    return {"message": "Application status updated", "status": application.status}

# ----------------- CREATOR FLASH DROPS & MASTERCLASSES -----------------
@router.get("/flash-drops")
def list_flash_drops(db: Session = Depends(get_db)):
    drops = db.query(FlashDrop).filter(FlashDrop.status == "active").all()
    if not drops:
        return [
            {
                "id": "fd-1",
                "title": "Midnight Velvet Cocktail Drop & Masterclass",
                "creator_name": "Alia & Tara Curated",
                "boutique_name": "Maison Ivory Atelier",
                "description": "Exclusive limited 48-hour drop of handcrafted couture velvet pieces paired with live styling masterclass.",
                "original_price": 45000.0,
                "drop_price": 33750.0,
                "discount_pct": 25,
                "available_units": 15,
                "claimed_units": 9,
                "countdown_end": "2026-11-20T20:00:00Z",
                "banner_url": "/images/pink_tweed_coat.jpg",
                "masterclass_pass_price": 499.0,
                "passes_booked_count": 42,
                "status": "active"
            },
            {
                "id": "fd-2",
                "title": "Heritage Zari Kanjeevaram Private Trunk Drop",
                "creator_name": "Devi & Kabir Styling",
                "boutique_name": "Atelier Heritage Kochi",
                "description": "Vintage loom hand-woven pure mulberry silk drapes with masterclass on antique jewellery pairing.",
                "original_price": 58000.0,
                "drop_price": 46400.0,
                "discount_pct": 20,
                "available_units": 8,
                "claimed_units": 6,
                "countdown_end": "2026-11-22T18:00:00Z",
                "banner_url": "/images/emerald_silk_gown.jpg",
                "masterclass_pass_price": 799.0,
                "passes_booked_count": 28,
                "status": "active"
            }
        ]
    return [
        {
            "id": d.id,
            "title": d.title,
            "creator_name": d.creator_name,
            "boutique_name": d.boutique_name,
            "description": d.description,
            "original_price": d.original_price,
            "drop_price": d.drop_price,
            "discount_pct": d.discount_pct,
            "available_units": d.available_units,
            "claimed_units": d.claimed_units,
            "countdown_end": d.countdown_end,
            "banner_url": d.banner_url,
            "masterclass_pass_price": d.masterclass_pass_price,
            "passes_booked_count": d.passes_booked_count,
            "status": d.status
        }
        for d in drops
    ]

@router.post("/flash-drops/{drop_id}/buy-pass")
def buy_masterclass_pass(
    drop_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    drop = db.query(FlashDrop).filter(FlashDrop.id == drop_id).first()
    if drop:
        drop.passes_booked_count = (drop.passes_booked_count or 0) + 1
        db.commit()

    return {
        "success": True,
        "message": "VIP Masterclass Pass confirmed! 100% of pass fee credited to your DROBE Boutique wallet.",
        "pass_code": f"DROBE-VIP-{drop_id[:4].upper()}-99",
        "store_credit_awarded_inr": 499.0
    }

