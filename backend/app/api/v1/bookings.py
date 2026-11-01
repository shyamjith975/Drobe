from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.marketplace import ProfessionalProfile, ProfessionalService
from app.models.booking import Booking, BookingStatusHistory
from app.models.payment import PaymentOrder, ProfessionalWallet, WalletLedger
from app.schemas.all_schemas import BookingCreate, BookingStatusUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings Engine"])

def serialize_booking(b: Booking) -> dict:
    customer_profile = b.customer.profile if b.customer else None
    stylist_user = b.stylist.user if b.stylist else None
    stylist_profile = stylist_user.profile if stylist_user else None

    return {
        "id": b.id,
        "customer_id": b.customer_id,
        "customer_name": customer_profile.display_name if customer_profile else "Fashion Client",
        "stylist_id": b.stylist_id,
        "stylist_name": stylist_profile.display_name if stylist_profile else "Professional Stylist",
        "stylist_avatar": stylist_profile.avatar_url if stylist_profile else None,
        "service_id": b.service_id,
        "service_title": b.service.title if b.service else "Styling Consultation",
        "service_mode": b.service_mode,
        "booking_date": b.booking_date,
        "booking_time": b.booking_time,
        "status": b.status,
        "notes": b.notes,
        "location_address": b.location_address,
        "city": b.city,
        "reference_images": b.reference_images or [],
        "total_amount": b.total_amount,
        "advance_amount": b.advance_amount,
        "paid_amount": b.paid_amount,
        "currency": b.currency,
        "platform_commission": b.platform_commission,
        "stylist_payout": b.stylist_payout,
        "razorpay_order_id": b.razorpay_order_id,
        "created_at": b.created_at.isoformat() if b.created_at else None
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stylist = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == payload.stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stylist not found")

    service = db.query(ProfessionalService).filter(
        ProfessionalService.id == payload.service_id,
        ProfessionalService.stylist_id == payload.stylist_id
    ).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found for this stylist")

    # Calculate financial amounts
    total_amount = float(service.price + (service.travel_fee or 0.0))
    advance_amount = round(total_amount * (service.advance_percentage / 100.0), 2)
    commission_rate = settings.DEFAULT_COMMISSION_PERCENTAGE / 100.0 # 20%
    platform_commission = round(total_amount * commission_rate, 2)
    stylist_payout = round(total_amount - platform_commission, 2)

    # Initial status based on instant booking toggle
    initial_status = "accepted" if stylist.instant_booking_enabled else "requested"

    # Razorpay mock order ID
    mock_rzp_order_id = f"order_{uuid.uuid4().hex[:14]}"

    booking = Booking(
        customer_id=current_user.id,
        stylist_id=payload.stylist_id,
        service_id=payload.service_id,
        booking_date=payload.booking_date,
        booking_time=payload.booking_time,
        service_mode=payload.service_mode,
        status=initial_status,
        notes=payload.notes,
        location_address=payload.location_address,
        city=payload.city or stylist.base_city,
        reference_images=payload.reference_images or [],
        total_amount=total_amount,
        advance_amount=advance_amount,
        paid_amount=0.0,
        currency="INR",
        platform_commission=platform_commission,
        stylist_payout=stylist_payout,
        razorpay_order_id=mock_rzp_order_id
    )
    db.add(booking)
    db.flush()

    # Create PaymentOrder
    payment_order = PaymentOrder(
        booking_id=booking.id,
        user_id=current_user.id,
        order_type="booking",
        amount=advance_amount,
        currency="INR",
        razorpay_order_id=mock_rzp_order_id,
        status="created"
    )
    db.add(payment_order)

    # History record
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status=None,
        to_status=initial_status,
        changed_by_user_id=current_user.id,
        reason="Booking request placed by client"
    )
    db.add(history)

    db.commit()
    db.refresh(booking)
    return serialize_booking(booking)

@router.get("/")
def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Customer bookings or Stylist bookings
    stylist_profile = current_user.stylist_profile
    if stylist_profile:
        bookings = db.query(Booking).filter(
            (Booking.customer_id == current_user.id) | (Booking.stylist_id == stylist_profile.id)
        ).order_by(desc(Booking.created_at)).all()
    else:
        bookings = db.query(Booking).filter(Booking.customer_id == current_user.id).order_by(desc(Booking.created_at)).all()

    return [serialize_booking(b) for b in bookings]

@router.get("/{booking_id}")
def get_booking_details(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    return serialize_booking(booking)

@router.patch("/{booking_id}/status")
def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    old_status = booking.status
    new_status = payload.status.lower()

    booking.status = new_status

    # Record history
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status=old_status,
        to_status=new_status,
        changed_by_user_id=current_user.id,
        reason=payload.reason
    )
    db.add(history)

    # If completed, credit stylist wallet
    if new_status == "completed" and old_status != "completed":
        wallet = db.query(ProfessionalWallet).filter(ProfessionalWallet.stylist_id == booking.stylist_id).first()
        if wallet:
            payout = booking.stylist_payout
            wallet.available_balance += payout
            wallet.total_earned += payout
            ledger = WalletLedger(
                wallet_id=wallet.id,
                booking_id=booking.id,
                entry_type="credit",
                amount=payout,
                currency="INR",
                description=f"Earnings from completed booking #{booking.id[:8]}",
                balance_after=wallet.available_balance
            )
            db.add(ledger)

    db.commit()
    return {"message": "Booking status updated successfully", "status": booking.status}
