from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.commerce import BrandProfile
from app.models.campaign import CreatorCampaign, CampaignApplication
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
