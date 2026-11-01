from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.core.database import get_db
from app.models.user import User, UserProfile
from app.models.social import Post, ContentReport
from app.models.marketplace import ProfessionalProfile
from app.models.commerce import BrandProfile, Product
from app.models.booking import Booking
from app.models.campaign import CreatorCampaign
from app.models.payment import PayoutRequest, WalletLedger
from app.schemas.all_schemas import AdminVerificationAction
from app.api.deps import require_admin
from app.api.v1.stylists import serialize_stylist
from app.api.v1.brands import serialize_brand
from app.api.v1.bookings import serialize_booking

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    verified_stylists = db.query(func.count(ProfessionalProfile.id)).filter(ProfessionalProfile.verification_status == "verified").scalar() or 0
    pending_stylists = db.query(func.count(ProfessionalProfile.id)).filter(ProfessionalProfile.verification_status == "pending").scalar() or 0
    active_brands = db.query(func.count(BrandProfile.id)).scalar() or 0
    total_posts = db.query(func.count(Post.id)).scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar() or 0
    total_campaigns = db.query(func.count(CreatorCampaign.id)).scalar() or 0
    
    # Financial metrics
    total_gmv = db.query(func.sum(Booking.total_amount)).filter(Booking.status.in_(["confirmed", "completed"])).scalar() or 0.0
    total_commissions = db.query(func.sum(Booking.platform_commission)).filter(Booking.status.in_(["confirmed", "completed"])).scalar() or 0.0

    return {
        "total_users": total_users,
        "verified_stylists": verified_stylists,
        "pending_stylists": pending_stylists,
        "active_brands": active_brands,
        "total_posts": total_posts,
        "total_bookings": total_bookings,
        "active_campaigns": total_campaigns,
        "total_gmv_inr": round(float(total_gmv), 2),
        "platform_commission_inr": round(float(total_commissions), 2)
    }

@router.get("/users")
def list_all_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    users = db.query(User).order_by(desc(User.created_at)).offset(skip).limit(limit).all()
    results = []
    for u in users:
        p = u.profile
        results.append({
            "id": u.id,
            "email": u.email,
            "role": u.role,
            "status": u.status,
            "username": p.username if p else "",
            "display_name": p.display_name if p else "",
            "city": p.city if p else "",
            "created_at": u.created_at.isoformat() if u.created_at else None
        })
    return results

@router.patch("/users/{user_id}/status")
def change_user_status(
    user_id: str,
    action: AdminVerificationAction,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.status = action.status
    db.commit()
    return {"message": f"User status changed to {action.status}"}

@router.get("/verifications/stylists")
def get_pending_stylist_verifications(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    stylists = db.query(ProfessionalProfile).order_by(desc(ProfessionalProfile.created_at)).all()
    return [serialize_stylist(s) for s in stylists]

@router.patch("/verifications/stylists/{stylist_id}")
def verify_stylist(
    stylist_id: str,
    payload: AdminVerificationAction,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    stylist = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stylist not found")

    stylist.verification_status = payload.status
    if stylist.user and stylist.user.profile:
        stylist.user.profile.is_verified = (payload.status == "verified")

    db.commit()
    return {"message": f"Stylist verification status updated to {payload.status}"}

@router.get("/verifications/brands")
def get_brand_verifications(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    brands = db.query(BrandProfile).order_by(desc(BrandProfile.created_at)).all()
    return [serialize_brand(b) for b in brands]

@router.patch("/verifications/brands/{brand_id}")
def verify_brand(
    brand_id: str,
    payload: AdminVerificationAction,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    brand = db.query(BrandProfile).filter(BrandProfile.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")

    brand.is_verified = (payload.status == "verified")
    if brand.user:
        brand.user.status = "active" if payload.status == "verified" else "pending_verification"
        if brand.user.profile:
            brand.user.profile.is_verified = brand.is_verified

    db.commit()
    return {"message": f"Brand verification status updated to {payload.status}"}

@router.get("/bookings")
def list_admin_bookings(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    q = db.query(Booking).order_by(desc(Booking.created_at))
    if status_filter and status_filter.lower() != "all":
        q = q.filter(Booking.status == status_filter)
    bookings = q.all()
    return [serialize_booking(b) for b in bookings]

@router.get("/reports")
def list_content_reports(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    reports = db.query(ContentReport).order_by(desc(ContentReport.created_at)).all()
    return [
        {
            "id": r.id,
            "reporter_id": r.reporter_id,
            "target_type": r.target_type,
            "target_id": r.target_id,
            "reason": r.reason,
            "details": r.details,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in reports
    ]

@router.delete("/posts/{post_id}")
def admin_delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post removed by administrator"}

@router.get("/payouts")
def list_payout_requests(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    payouts = db.query(PayoutRequest).order_by(desc(PayoutRequest.created_at)).all()
    return [
        {
            "id": p.id,
            "stylist_id": p.stylist_id,
            "amount": p.amount,
            "currency": p.currency,
            "payout_method": p.payout_method,
            "account_details": p.account_details,
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in payouts
    ]
