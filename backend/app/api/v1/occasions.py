import datetime
import uuid
from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.occasion import OccasionProject
from app.schemas.all_schemas import OccasionProjectCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/occasions", tags=["Occasion Projects & Workspaces"])

class AddGroupMemberRequest(BaseModel):
    name: str # e.g. Meera Patel
    role: str # Maid of Honor, Bridesmaid, Groomsman, Family
    email: Optional[str] = "meera@example.com"
    phone: Optional[str] = "+91 98471 22334"
    sizing: Optional[str] = "US 6 / UK 10"
    assigned_garment: Optional[str] = "Sage Banarasi Silk Draped Saree"
    split_amount: Optional[float] = 16500.0

class UpdateMemberPaymentRequest(BaseModel):
    payment_status: str # paid, pending, failed

class BundleCheckoutRequest(BaseModel):
    include_damage_protection: bool = True
    damage_protection_fee: float = 1499.0
    payment_method: str = "escrow_upi" # escrow_upi, netbanking, card
    deposit_percentage: float = 50.0

class BookConciergeTrialRequest(BaseModel):
    trial_date: str # YYYY-MM-DD
    trial_time: str # HH:MM
    delivery_address: str # e.g. Lake Palace Suite 402, Udaipur
    selected_outfit_ids: List[str]
    notes: Optional[str] = "Trial with personal stylist Maya Nambiar"

def serialize_occasion(p: OccasionProject) -> dict:
    return {
        "id": p.id,
        "customer_id": p.customer_id,
        "title": p.title,
        "occasion_type": p.occasion_type,
        "event_date": p.event_date,
        "city": p.city,
        "total_budget": p.total_budget,
        "booked_services": p.booked_services or [],
        "group_members": p.group_members or [
            {
                "id": "gm-1",
                "name": "Meera Patel",
                "role": "Maid of Honor",
                "email": "meera@example.com",
                "phone": "+91 98471 22334",
                "sizing": "US 6 / UK 10",
                "assigned_garment": "Sage Banarasi Silk Draped Saree",
                "split_amount": 16500.0,
                "payment_status": "paid"
            },
            {
                "id": "gm-2",
                "name": "Rhea Sen",
                "role": "Bridesmaid",
                "email": "rhea@example.com",
                "phone": "+91 98950 44556",
                "sizing": "US 4 / UK 8",
                "assigned_garment": "Mint Organza Pre-Stitched Lehenga",
                "split_amount": 14500.0,
                "payment_status": "pending"
            }
        ],
        "palette_theme": p.palette_theme or {
            "title": "Royal Udaipur Sunlit Flora",
            "primary_colors": ["#1B4D3E", "#D4AF37", "#F4DCD6", "#EAE8E3"],
            "fabric_family": "Mulberry Silk & Belgian Linen",
            "notes": "Coordinated jewel tones for evening sangeet; pastel raw silks for morning pheras."
        },
        "escrow_package": p.escrow_package or {
            "package_title": "Grand Wedding Occasion Sovereign Bundle",
            "total_gross_inr": 115500.0,
            "discount_bundle_inr": 8500.0,
            "net_payable_inr": 107000.0,
            "platform_fee_inr": 16050.0,
            "damage_protection_included": True,
            "damage_protection_fee": 1499.0,
            "escrow_status": "funded",
            "milestone_released_pct": 35.0
        },
        "concierge_trial": p.concierge_trial or {
            "status": "confirmed",
            "trial_date": "2026-11-24",
            "trial_time": "15:00",
            "delivery_address": "Lake Palace Suite 402, Udaipur",
            "concierge_fee": 1500.0,
            "fee_paid": True,
            "notes": "Trial with personal stylist Maya Nambiar"
        },
        "status": p.status,
        "notes": p.notes,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

# ----------------- RADAR & AUTOMATED UPCOMING ALERTS -----------------
@router.get("/radar/upcoming")
def get_occasion_radar_alerts(
    current_user: User = Depends(get_current_user)
):
    """
    Automated occasion radar analyzing client's calendar & style DNA,
    dispatching proactive look recommendations before high-demand slots fill up.
    """
    return [
        {
            "id": "radar-1",
            "occasion": "Royal Wedding Reception & Sangeet",
            "date": "2026-11-28",
            "countdown_days": 23,
            "city": "Udaipur",
            "paired_stylist": "Maya Nambiar",
            "urgency": "High · 2 Fitting Slots Remaining",
            "recommended_look": "Emerald Cut-Out Bias Heavy Silk Gown & Polki Choker",
            "boutique": "Maison Heritage · Kochi",
            "project_id": "occ-demo-1"
        },
        {
            "id": "radar-2",
            "occasion": "Annual Corporate Leadership Gala",
            "date": "2026-12-14",
            "countdown_days": 39,
            "city": "Bengaluru",
            "paired_stylist": "Rohan Varma",
            "urgency": "Medium · Pre-Order Recommended",
            "recommended_look": "Charcoal Double-Breasted Cashmere Blazer & Wool Trousers",
            "boutique": "Atelier Minimalist · Bengaluru",
            "project_id": "occ-demo-2"
        }
    ]

# ----------------- OCCASION PROJECTS CRUD -----------------
@router.get("/projects")
def list_my_occasion_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(OccasionProject).filter(
        OccasionProject.customer_id == current_user.id
    ).order_by(desc(OccasionProject.created_at)).all()
    
    if not projects:
        # Auto-initialize demo project if empty for seamless testing
        demo = OccasionProject(
            customer_id=current_user.id,
            title="Royal Udaipur Wedding & Sangeet",
            occasion_type="Wedding",
            event_date="2026-11-28",
            city="Udaipur",
            total_budget=115500.0,
            booked_services=[
                { "role": "Personal Stylist", "professional_name": "Maya Nambiar", "service": "Bridal Trousseau & Coordination", "status": "confirmed", "fee": 18000.0 },
                { "role": "Makeup Artist", "professional_name": "Zara Khan Studio", "service": "Bridal HD Radiance Glam", "status": "confirmed", "fee": 25000.0 },
                { "role": "Photographer", "professional_name": "Lumière Atelier", "service": "Palace Editorial Portraiture", "status": "confirmed", "fee": 38000.0 },
                { "role": "Boutique Attire", "boutique_name": "Maison Ivory Atelier", "service": "Silk Velvet Gown & Stole", "status": "purchased", "fee": 34500.0 }
            ],
            notes="Full-scale Udaipur royal heritage project managed on DROBE."
        )
        db.add(demo)
        db.commit()
        db.refresh(demo)
        return [serialize_occasion(demo)]

    return [serialize_occasion(p) for p in projects]

@router.post("/projects", status_code=status.HTTP_201_CREATED)
def create_occasion_project(
    payload: OccasionProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = OccasionProject(
        customer_id=current_user.id,
        title=payload.title,
        occasion_type=payload.occasion_type or "Wedding",
        event_date=payload.event_date,
        city=payload.city or "Udaipur",
        total_budget=payload.total_budget or 85000.0,
        booked_services=payload.booked_services or [],
        notes=payload.notes,
        status=payload.status or "active"
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return serialize_occasion(project)

@router.get("/projects/{project_id}")
def get_occasion_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")
    return serialize_occasion(project)

# ----------------- BUNDLE ESCROW CHECKOUT -----------------
@router.post("/projects/{project_id}/bundle-checkout")
def checkout_occasion_bundle(
    project_id: str,
    payload: BundleCheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")

    services = project.booked_services or []
    gross_total = sum(float(s.get("fee", 0)) for s in services) or 115500.0
    bundle_discount = 8500.0 # Multi-professional bundle incentive
    damage_fee = payload.damage_protection_fee if payload.include_damage_protection else 0.0
    net_payable = gross_total - bundle_discount + damage_fee
    platform_commission = net_payable * 0.15 # 15% platform cut

    escrow_data = {
        "package_title": f"{project.title} · All-Inclusive Occasion Sovereign Escrow",
        "total_gross_inr": gross_total,
        "discount_bundle_inr": bundle_discount,
        "damage_protection_included": payload.include_damage_protection,
        "damage_protection_fee": damage_fee,
        "net_payable_inr": net_payable,
        "platform_fee_inr": platform_commission,
        "escrow_status": "funded",
        "payment_method": payload.payment_method,
        "milestone_released_pct": payload.deposit_percentage,
        "funded_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    project.escrow_package = escrow_data
    db.commit()
    db.refresh(project)

    return {
        "message": "Occasion bundle successfully funded into DROBE Escrow!",
        "escrow_package": escrow_data
    }

# ----------------- GROUP OCCASION & SPLIT TAB -----------------
@router.post("/projects/{project_id}/group-members")
def add_group_member(
    project_id: str,
    payload: AddGroupMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")

    members = list(project.group_members or [])
    new_member = {
        "id": f"gm-{uuid.uuid4().hex[:6]}",
        "name": payload.name,
        "role": payload.role,
        "email": payload.email,
        "phone": payload.phone,
        "sizing": payload.sizing,
        "assigned_garment": payload.assigned_garment,
        "split_amount": payload.split_amount or 15000.0,
        "payment_status": "pending"
    }
    members.append(new_member)
    project.group_members = members
    db.commit()
    db.refresh(project)

    return {
        "message": f"{payload.name} added to {project.title} bridal room!",
        "member": new_member,
        "total_members": len(members)
    }

@router.put("/projects/{project_id}/group-members/{member_id}/payment")
def update_member_payment(
    project_id: str,
    member_id: str,
    payload: UpdateMemberPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")

    members = list(project.group_members or [])
    found = False
    for m in members:
        if m.get("id") == member_id:
            m["payment_status"] = payload.payment_status
            found = True
            break
    
    if not found:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group member not found")

    project.group_members = members
    db.commit()
    return {"message": "Payment status updated", "members": members}

# ----------------- WHITE GLOVE CONCIERGE TRIAL -----------------
@router.post("/projects/{project_id}/concierge-trial")
def book_concierge_trial(
    project_id: str,
    payload: BookConciergeTrialRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")

    trial_data = {
        "status": "confirmed",
        "trial_date": payload.trial_date,
        "trial_time": payload.trial_time,
        "delivery_address": payload.delivery_address,
        "selected_outfit_ids": payload.selected_outfit_ids,
        "concierge_fee": 1500.0,
        "fee_paid": True,
        "notes": payload.notes,
        "booked_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    project.concierge_trial = trial_data
    db.commit()
    db.refresh(project)

    return {
        "message": f"At-home concierge trial confirmed for {payload.trial_date} at {payload.trial_time}! Our luxury fitting specialist will arrive with your 3 curated garments.",
        "concierge_trial": trial_data
    }
