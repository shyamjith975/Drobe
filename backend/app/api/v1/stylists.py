from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User, UserProfile
from app.models.marketplace import ProfessionalProfile, ProfessionalService, AvailabilityRule, StylistReview
from app.models.payment import ProfessionalWallet
from app.schemas.all_schemas import StylistOnboard, ServiceCreate, StylistReviewCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/stylists", tags=["Professional Marketplace"])

def serialize_stylist(stylist: ProfessionalProfile) -> dict:
    user = stylist.user
    profile = user.profile if user else None
    return {
        "id": stylist.id,
        "user_id": stylist.user_id,
        "user": {
            "username": profile.username if profile else "",
            "display_name": profile.display_name if profile else "",
            "avatar_url": profile.avatar_url if profile else None,
            "is_verified": profile.is_verified if profile else False
        },
        "category": stylist.category,
        "specializations": stylist.specializations or [],
        "bio": stylist.bio,
        "experience_years": stylist.experience_years,
        "languages": stylist.languages or [],
        "base_city": stylist.base_city,
        "operating_cities": stylist.operating_cities or [],
        "starting_price": stylist.starting_price,
        "currency": stylist.currency,
        "rating": stylist.rating,
        "reviews_count": stylist.reviews_count,
        "instant_booking_enabled": stylist.instant_booking_enabled,
        "verification_status": stylist.verification_status,
        "portfolio_images": stylist.portfolio_images or [],
        "services": [
            {
                "id": s.id,
                "title": s.title,
                "description": s.description,
                "category": s.category,
                "service_mode": s.service_mode,
                "duration_minutes": s.duration_minutes,
                "price": s.price,
                "currency": s.currency,
                "advance_percentage": s.advance_percentage,
                "travel_fee": s.travel_fee,
                "cancellation_policy": s.cancellation_policy,
                "is_active": s.is_active
            }
            for s in stylist.services if s.is_active
        ]
    }

@router.get("/")
def list_stylists(
    city: Optional[str] = None,
    category: Optional[str] = None,
    service_mode: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProfessionalProfile)
    
    if category and category.lower() != "all":
        query = query.filter(ProfessionalProfile.category.ilike(f"%{category}%"))

    stylists = query.order_by(desc(ProfessionalProfile.rating)).all()

    # In-memory city check against base_city OR operating_cities array (e.g. Kozhikode, Kochi, Bengaluru)
    results = []
    for s in stylists:
        if city and city.lower() != "all":
            city_lower = city.lower().strip()
            matches_base = bool(s.base_city and city_lower in s.base_city.lower())
            matches_op = any(city_lower in c.lower() for c in (s.operating_cities or []))
            if not (matches_base or matches_op):
                continue
        results.append(serialize_stylist(s))
    
    return results

@router.get("/meta/cities")
def list_available_cities(db: Session = Depends(get_db)):
    """Fetch distinct available cities with active stylists and consultants from database"""
    stylists = db.query(ProfessionalProfile).all()
    city_set = set()
    for s in stylists:
        if s.base_city:
            # Handle multi-city strings e.g. "Chicago Flagship & Fort Kochi" or "Kochi & Bengaluru"
            parts = [p.strip() for p in s.base_city.replace('&', ',').replace('•', ',').split(',')]
            for part in parts:
                clean_name = part.replace('Flagship', '').replace('Atelier', '').strip()
                if clean_name and len(clean_name) > 2:
                    city_set.add(clean_name)
        for c in (s.operating_cities or []):
            if c:
                city_set.add(c.strip())
    
    # Always ensure primary fashion hub cities exist
    for default_city in ["Kochi", "Kozhikode", "Bengaluru", "Mumbai", "Delhi", "Chicago"]:
        city_set.add(default_city)
        
    return sorted(list(city_set))

@router.get("/{stylist_id}")
def get_stylist_by_id(stylist_id: str, db: Session = Depends(get_db)):
    stylist = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stylist profile not found")
    
    data = serialize_stylist(stylist)
    # Add reviews
    reviews = db.query(StylistReview).filter(StylistReview.stylist_id == stylist_id).order_by(desc(StylistReview.created_at)).all()
    data["reviews"] = [
        {
            "id": r.id,
            "rating": r.rating,
            "review_text": r.review_text,
            "customer_name": r.customer.profile.display_name if (r.customer and r.customer.profile) else "Fashion Client",
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in reviews
    ]
    return data

@router.post("/onboard", status_code=status.HTTP_201_CREATED)
def onboard_stylist(
    payload: StylistOnboard,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(ProfessionalProfile).filter(ProfessionalProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stylist profile already exists for this account")

    # Update role to stylist
    current_user.role = "stylist"

    stylist = ProfessionalProfile(
        user_id=current_user.id,
        category=payload.category,
        specializations=payload.specializations,
        bio=payload.bio,
        experience_years=payload.experience_years,
        languages=payload.languages,
        base_city=payload.base_city,
        operating_cities=payload.operating_cities,
        starting_price=payload.starting_price,
        portfolio_images=payload.portfolio_images,
        verification_status="verified" # Auto-verified for instant access in dev/testing
    )
    db.add(stylist)
    db.flush()

    # Create associated wallet
    wallet = ProfessionalWallet(stylist_id=stylist.id)
    db.add(wallet)

    db.commit()
    db.refresh(stylist)
    return serialize_stylist(stylist)

@router.post("/{stylist_id}/services", status_code=status.HTTP_201_CREATED)
def add_service(
    stylist_id: str,
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stylist = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stylist profile not found")
    
    if stylist.user_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit services for this stylist")

    service = ProfessionalService(
        stylist_id=stylist_id,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        service_mode=payload.service_mode,
        duration_minutes=payload.duration_minutes,
        price=payload.price,
        currency=payload.currency,
        advance_percentage=payload.advance_percentage,
        travel_fee=payload.travel_fee
    )
    db.add(service)
    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "title": service.title,
        "description": service.description,
        "category": service.category,
        "service_mode": service.service_mode,
        "price": service.price,
        "duration_minutes": service.duration_minutes
    }

@router.post("/{stylist_id}/reviews", status_code=status.HTTP_201_CREATED)
def add_review(
    stylist_id: str,
    payload: StylistReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stylist = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stylist not found")

    review = StylistReview(
        stylist_id=stylist_id,
        customer_id=current_user.id,
        booking_id=payload.booking_id,
        rating=payload.rating,
        review_text=payload.review_text
    )
    db.add(review)

    # Recalculate average rating
    all_reviews = db.query(StylistReview).filter(StylistReview.stylist_id == stylist_id).all()
    total_rating = sum(r.rating for r in all_reviews) + payload.rating
    count = len(all_reviews) + 1
    stylist.rating = round(total_rating / count, 1)
    stylist.reviews_count = count

    db.commit()
    return {"message": "Review added successfully", "new_rating": stylist.rating}
