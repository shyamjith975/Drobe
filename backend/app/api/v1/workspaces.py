import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.booking import Booking
from app.models.workspace import StylingWorkspace
from app.schemas.all_schemas import WorkspaceUpdateSchema
from app.api.deps import get_current_user

router = APIRouter(prefix="/workspaces", tags=["Styling Workspaces"])

def serialize_workspace(w: StylingWorkspace) -> dict:
    booking = w.booking
    customer_profile = booking.customer.profile if (booking and booking.customer) else None
    stylist_user = booking.stylist.user if (booking and booking.stylist) else None
    stylist_profile = stylist_user.profile if stylist_user else None

    return {
        "id": w.id,
        "booking_id": w.booking_id,
        "customer_id": booking.customer_id if booking else None,
        "customer_name": customer_profile.display_name if customer_profile else "Client",
        "stylist_id": booking.stylist_id if booking else None,
        "stylist_name": stylist_profile.display_name if stylist_profile else "Stylist",
        "service_title": booking.service.title if (booking and booking.service) else "Consultation",
        "booking_date": booking.booking_date if booking else None,
        "booking_time": booking.booking_time if booking else None,
        "customer_requirements": w.customer_requirements or (booking.notes if booking else ""),
        "reference_images": w.reference_images or (booking.reference_images if booking else []),
        "stylist_prep_notes": w.stylist_prep_notes or "",
        "moodboards": w.moodboards or [],
        "product_recommendations": w.product_recommendations or [],
        "session_notes": w.session_notes or "",
        "final_report": w.final_report or {},
        "follow_up_recommendations": w.follow_up_recommendations or "",
        "status": w.status or "active",
        "created_at": w.created_at.isoformat() if w.created_at else None,
        "updated_at": w.updated_at.isoformat() if w.updated_at else None,
    }

@router.get("/booking/{booking_id}")
def get_or_create_workspace(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # Authorize: user must be the customer or the stylist
    stylist_profile = current_user.stylist_profile
    is_client = booking.customer_id == current_user.id
    is_stylist = stylist_profile and (booking.stylist_id == stylist_profile.id)
    if not (is_client or is_stylist or current_user.role == "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this styling workspace")

    workspace = db.query(StylingWorkspace).filter(StylingWorkspace.booking_id == booking_id).first()
    if not workspace:
        workspace = StylingWorkspace(
            booking_id=booking.id,
            customer_requirements=booking.notes or "Capsule wardrobe styling and color coordination for upcoming season.",
            reference_images=[{"url": img, "caption": "Inspiration"} for img in (booking.reference_images or [])],
            status="active"
        )
        db.add(workspace)
        db.commit()
        db.refresh(workspace)

    return serialize_workspace(workspace)

@router.put("/booking/{booking_id}")
def update_workspace(
    booking_id: str,
    payload: WorkspaceUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    stylist_profile = current_user.stylist_profile
    is_client = booking.customer_id == current_user.id
    is_stylist = stylist_profile and (booking.stylist_id == stylist_profile.id)
    if not (is_client or is_stylist or current_user.role == "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    workspace = db.query(StylingWorkspace).filter(StylingWorkspace.booking_id == booking_id).first()
    if not workspace:
        workspace = StylingWorkspace(booking_id=booking.id)
        db.add(workspace)

    payload_dict = payload.model_dump(exclude_unset=True)
    for field, value in payload_dict.items():
        if hasattr(workspace, field):
            setattr(workspace, field, value)

    db.commit()
    db.refresh(workspace)
    return serialize_workspace(workspace)

@router.post("/booking/{booking_id}/deliver")
def deliver_workspace(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workspace = db.query(StylingWorkspace).filter(StylingWorkspace.booking_id == booking_id).first()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

    workspace.status = "delivered"
    report = dict(workspace.final_report or {})
    report["delivered_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    workspace.final_report = report

    # Mark booking as completed if not already
    booking = workspace.booking
    if booking:
        booking.status = "completed"

    db.commit()
    db.refresh(workspace)
    return serialize_workspace(workspace)
