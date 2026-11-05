import datetime
from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.commerce import BrandProfile
from app.models.subscription import BoutiqueSubscription, CustomerSubscription
from app.api.deps import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions & Memberships"])

class BoutiqueUpgradeRequest(BaseModel):
    tier: str # atelier_club, couture_circle, free
    billing_cycle: Optional[str] = "monthly"

class CustomerSubscribeRequest(BaseModel):
    tier: str # quarterly_reset, annual_elite
    billing_cycle: Optional[str] = "quarterly"
    preferred_stylist_name: Optional[str] = "Maya Nambiar"

class ScheduleResetRequest(BaseModel):
    scheduled_date: str # YYYY-MM-DD
    focus_season: Optional[str] = "Winter / Festive 2026"
    notes: Optional[str] = None

# Public Plans Catalogue
@router.get("/plans")
def get_subscription_plans():
    return {
        "boutique_tiers": [
            {
                "tier": "free",
                "name": "Complimentary Partner",
                "price_inr": 0,
                "billing": "Forever Free",
                "commission_rate_pct": 20.0,
                "features": [
                    "Standard Catalog Listing",
                    "Up to 5 'Shop The Look' Hotspot Pins",
                    "Direct Customer Messages",
                    "Standard Search Ranking"
                ],
                "badge": "Partner"
            },
            {
                "tier": "atelier_club",
                "name": "DROBE Atelier Club",
                "price_inr": 4999,
                "billing": "₹4,999 / month",
                "commission_rate_pct": 12.0,
                "features": [
                    "Reduced 12% Platform Commission (Save 8%)",
                    "Unlimited Interactive Hotspot Pins",
                    "Top 3 City Search Priority & Editorial Picks",
                    "Direct Stylist Client Routing Pipeline",
                    "Verified Atelier Gold Badge",
                    "At-Home White-Glove Trial Integration"
                ],
                "badge": "Most Popular · High ROI",
                "recommended": True
            },
            {
                "tier": "couture_circle",
                "name": "Couture Circle Sovereign",
                "price_inr": 9999,
                "billing": "₹9,999 / month",
                "commission_rate_pct": 8.0,
                "features": [
                    "Lowest 8% Platform Commission",
                    "Dedicated Senior Account Director & Merchandiser",
                    "Homepage Flagship Spotlight & Video Feature",
                    "Quarterly Creator Collab Sponsored Budget",
                    "Exclusive Bridal Trunk Show Host Rights"
                ],
                "badge": "Luxury Sovereign"
            }
        ],
        "customer_tiers": [
            {
                "tier": "free",
                "name": "DROBE Enthusiast",
                "price_inr": 0,
                "billing": "Free",
                "features": [
                    "Style DNA Profile & Questionnaire",
                    "Digital Wardrobe (Up to 25 items)",
                    "Pay-per-Session Stylist Bookings",
                    "Standard Boutique Catalog Access"
                ]
            },
            {
                "tier": "quarterly_reset",
                "name": "Seasonal Wardrobe Reset",
                "price_inr": 3999,
                "billing": "₹3,999 / quarter",
                "features": [
                    "1 Comprehensive Wardrobe Audit per Season (4 / year)",
                    "Personalized 10-Look Digital Lookbook PDF",
                    "10% Direct Discount on Partner Boutiques",
                    "Priority WhatsApp Stylist Concierge Access",
                    "Complimentary Garment Rental Damage Protection"
                ],
                "recommended": True,
                "badge": "Best for Active Fashion Enthusiasts"
            },
            {
                "tier": "annual_elite",
                "name": "DROBE Haute Society",
                "price_inr": 12999,
                "billing": "₹12,999 / year (Save ₹3,000)",
                "features": [
                    "Unlimited Wardrobe Gap Audits & Capsule Planning",
                    "Dedicated Senior Stylist Assigned (Maya Nambiar level)",
                    "Emergency 15-Minute Video Styling Calls (Unlimited)",
                    "VIP Access to Fashion Rental Vault & Event Passes",
                    "At-Home Concierge Trial Fee Waived (Free 2 trials/yr)",
                    "Invitations to Private Fashion Week Showrooms"
                ],
                "badge": "All-Inclusive VIP"
            }
        ]
    }

# ----------------- BOUTIQUE SUBSCRIPTIONS -----------------
@router.get("/boutique/me")
def get_my_boutique_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == current_user.id).first()
    if not brand and current_user.role != "admin":
        # Fallback for demo preview
        return {
            "tier": "atelier_club",
            "tier_name": "DROBE Atelier Club",
            "price_monthly_inr": 4999.0,
            "commission_rate_pct": 12.0,
            "status": "active",
            "billing_cycle": "monthly",
            "renews_at": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=22)).isoformat(),
            "priority_search_ranking": True,
            "unlimited_hotspots": True,
            "stylist_routing_access": True,
            "at_home_concierge_enabled": True
        }

    sub = None
    if brand:
        sub = db.query(BoutiqueSubscription).filter(BoutiqueSubscription.brand_id == brand.id).first()
    
    if not sub:
        return {
            "tier": "free",
            "tier_name": "Complimentary Partner",
            "price_monthly_inr": 0.0,
            "commission_rate_pct": 20.0,
            "status": "active",
            "billing_cycle": "monthly",
            "renews_at": None,
            "priority_search_ranking": False,
            "unlimited_hotspots": False,
            "stylist_routing_access": False,
            "at_home_concierge_enabled": False
        }

    return {
        "id": sub.id,
        "brand_id": sub.brand_id,
        "tier": sub.tier,
        "tier_name": sub.tier_name,
        "price_monthly_inr": sub.price_monthly_inr,
        "commission_rate_pct": sub.commission_rate_pct,
        "status": sub.status,
        "billing_cycle": sub.billing_cycle,
        "renews_at": sub.renews_at.isoformat() if sub.renews_at else None,
        "priority_search_ranking": sub.priority_search_ranking,
        "unlimited_hotspots": sub.unlimited_hotspots,
        "stylist_routing_access": sub.stylist_routing_access,
        "at_home_concierge_enabled": sub.at_home_concierge_enabled
    }

@router.post("/boutique/upgrade")
def upgrade_boutique_subscription(
    payload: BoutiqueUpgradeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == current_user.id).first()
    if not brand and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only boutique accounts can subscribe to Atelier tiers.")

    brand_id = brand.id if brand else "demo-brand-1"
    sub = db.query(BoutiqueSubscription).filter(BoutiqueSubscription.brand_id == brand_id).first()
    
    tier_info = {
        "free": {"name": "Complimentary Partner", "price": 0.0, "pct": 20.0, "prio": False, "hotspots": False, "concierge": False},
        "atelier_club": {"name": "DROBE Atelier Club", "price": 4999.0, "pct": 12.0, "prio": True, "hotspots": True, "concierge": True},
        "couture_circle": {"name": "Couture Circle Sovereign", "price": 9999.0, "pct": 8.0, "prio": True, "hotspots": True, "concierge": True}
    }.get(payload.tier, {"name": "DROBE Atelier Club", "price": 4999.0, "pct": 12.0, "prio": True, "hotspots": True, "concierge": True})

    renews = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30)

    if not sub:
        sub = BoutiqueSubscription(
            brand_id=brand_id,
            tier=payload.tier,
            tier_name=tier_info["name"],
            price_monthly_inr=tier_info["price"],
            commission_rate_pct=tier_info["pct"],
            status="active",
            billing_cycle=payload.billing_cycle or "monthly",
            renews_at=renews,
            priority_search_ranking=tier_info["prio"],
            unlimited_hotspots=tier_info["hotspots"],
            stylist_routing_access=tier_info["prio"],
            at_home_concierge_enabled=tier_info["concierge"]
        )
        db.add(sub)
    else:
        sub.tier = payload.tier
        sub.tier_name = tier_info["name"]
        sub.price_monthly_inr = tier_info["price"]
        sub.commission_rate_pct = tier_info["pct"]
        sub.status = "active"
        sub.billing_cycle = payload.billing_cycle or "monthly"
        sub.renews_at = renews
        sub.priority_search_ranking = tier_info["prio"]
        sub.unlimited_hotspots = tier_info["hotspots"]
        sub.stylist_routing_access = tier_info["prio"]
        sub.at_home_concierge_enabled = tier_info["concierge"]

    db.commit()
    db.refresh(sub)
    return {
        "message": f"Successfully activated {tier_info['name']}!",
        "subscription": {
            "tier": sub.tier,
            "tier_name": sub.tier_name,
            "commission_rate_pct": sub.commission_rate_pct,
            "renews_at": sub.renews_at.isoformat() if sub.renews_at else None,
            "status": sub.status
        }
    }

# ----------------- CUSTOMER DROBE CLUB SUBSCRIPTIONS -----------------
@router.get("/customer/me")
def get_my_customer_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(CustomerSubscription).filter(CustomerSubscription.user_id == current_user.id).first()
    if not sub:
        # Default active tier for high-converting customer demo
        return {
            "tier": "quarterly_reset",
            "tier_name": "Seasonal Wardrobe Reset",
            "price_inr": 3999.0,
            "status": "active",
            "billing_cycle": "quarterly",
            "resets_total": 4,
            "resets_used": 1,
            "assigned_stylist_name": "Maya Nambiar",
            "next_scheduled_reset": "2026-11-28",
            "boutique_discount_pct": 10,
            "damage_protection_discount": True,
            "whatsapp_concierge_priority": True,
            "renews_at": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=45)).isoformat()
        }

    return {
        "id": sub.id,
        "tier": sub.tier,
        "tier_name": sub.tier_name,
        "price_inr": sub.price_inr,
        "status": sub.status,
        "billing_cycle": sub.billing_cycle,
        "resets_total": sub.resets_total,
        "resets_used": sub.resets_used,
        "assigned_stylist_name": sub.assigned_stylist_name,
        "next_scheduled_reset": sub.next_scheduled_reset,
        "boutique_discount_pct": sub.boutique_discount_pct,
        "damage_protection_discount": sub.damage_protection_discount,
        "whatsapp_concierge_priority": sub.whatsapp_concierge_priority,
        "renews_at": sub.renews_at.isoformat() if sub.renews_at else None
    }

@router.post("/customer/subscribe")
def subscribe_customer(
    payload: CustomerSubscribeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(CustomerSubscription).filter(CustomerSubscription.user_id == current_user.id).first()
    price = 12999.0 if payload.tier == "annual_elite" else 3999.0
    name = "DROBE Haute Society" if payload.tier == "annual_elite" else "Seasonal Wardrobe Reset"
    total_resets = 12 if payload.tier == "annual_elite" else 4
    renews = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365 if payload.tier == "annual_elite" else 90)

    if not sub:
        sub = CustomerSubscription(
            user_id=current_user.id,
            tier=payload.tier,
            tier_name=name,
            price_inr=price,
            status="active",
            billing_cycle=payload.billing_cycle or "quarterly",
            resets_total=total_resets,
            resets_used=0,
            assigned_stylist_name=payload.preferred_stylist_name or "Maya Nambiar",
            next_scheduled_reset=(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=14)).strftime("%Y-%m-%d"),
            renews_at=renews
        )
        db.add(sub)
    else:
        sub.tier = payload.tier
        sub.tier_name = name
        sub.price_inr = price
        sub.status = "active"
        sub.billing_cycle = payload.billing_cycle or "quarterly"
        sub.resets_total = total_resets
        sub.assigned_stylist_name = payload.preferred_stylist_name or "Maya Nambiar"
        sub.renews_at = renews

    db.commit()
    db.refresh(sub)
    return {
        "message": f"Welcome to {name}! Your personal styling membership is active.",
        "subscription": {
            "tier": sub.tier,
            "tier_name": sub.tier_name,
            "resets_total": sub.resets_total,
            "assigned_stylist_name": sub.assigned_stylist_name,
            "next_scheduled_reset": sub.next_scheduled_reset
        }
    }

@router.post("/customer/schedule-reset")
def schedule_customer_reset(
    payload: ScheduleResetRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(CustomerSubscription).filter(CustomerSubscription.user_id == current_user.id).first()
    if sub:
        sub.next_scheduled_reset = payload.scheduled_date
        sub.resets_used = min(sub.resets_total, (sub.resets_used or 0) + 1)
        db.commit()
    
    return {
        "message": f"Seasonal reset consultation confirmed for {payload.scheduled_date} with your assigned stylist!",
        "scheduled_date": payload.scheduled_date,
        "focus_season": payload.focus_season
    }

