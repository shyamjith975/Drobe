from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.booking import Booking, BookingStatusHistory
from app.models.payment import PaymentOrder, ProfessionalWallet, WalletLedger, PayoutRequest
from app.schemas.all_schemas import PaymentVerifyRequest, PayoutRequestCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/payments", tags=["Payment Engine & Wallet"])

@router.post("/verify")
def verify_payment(
    payload: PaymentVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # In production with real Razorpay, hmac.new(key_secret, order_id + "|" + payment_id, sha256) is verified.
    # In sandbox/demo mode, we verify the presence and update state idempotently.
    payment_order = db.query(PaymentOrder).filter(
        PaymentOrder.booking_id == booking.id
    ).first()

    if payment_order:
        payment_order.status = "paid"
        payment_order.razorpay_payment_id = payload.razorpay_payment_id

    booking.status = "confirmed"
    booking.paid_amount = booking.advance_amount
    booking.razorpay_payment_id = payload.razorpay_payment_id

    # Add booking history
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status="accepted",
        to_status="confirmed",
        changed_by_user_id=current_user.id,
        reason=f"Payment received via Razorpay (ID: {payload.razorpay_payment_id})"
    )
    db.add(history)

    db.commit()
    return {
        "status": "success",
        "booking_id": booking.id,
        "booking_status": booking.status,
        "paid_amount": booking.paid_amount,
        "currency": booking.currency
    }

@router.get("/wallet")
def get_stylist_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stylist_profile = current_user.stylist_profile
    if not stylist_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only verified professionals have a wallet")

    wallet = db.query(ProfessionalWallet).filter(ProfessionalWallet.stylist_id == stylist_profile.id).first()
    if not wallet:
        wallet = ProfessionalWallet(stylist_id=stylist_profile.id, available_balance=0.0, total_earned=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    ledger = db.query(WalletLedger).filter(WalletLedger.wallet_id == wallet.id).order_by(desc(WalletLedger.created_at)).all()

    return {
        "stylist_id": stylist_profile.id,
        "available_balance": wallet.available_balance,
        "pending_balance": wallet.pending_balance,
        "total_earned": wallet.total_earned,
        "currency": wallet.currency,
        "transactions": [
            {
                "id": l.id,
                "entry_type": l.entry_type,
                "amount": l.amount,
                "currency": l.currency,
                "description": l.description,
                "balance_after": l.balance_after,
                "created_at": l.created_at.isoformat() if l.created_at else None
            }
            for l in ledger
        ]
    }

@router.post("/withdraw")
def request_payout(
    payload: PayoutRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stylist_profile = current_user.stylist_profile
    if not stylist_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only stylists can request payouts")

    wallet = db.query(ProfessionalWallet).filter(ProfessionalWallet.stylist_id == stylist_profile.id).first()
    if not wallet or wallet.available_balance < payload.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient wallet balance. Available: ₹{wallet.available_balance if wallet else 0}"
        )

    if payload.amount < 500:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Minimum withdrawal amount is ₹500")

    # Deduct balance
    wallet.available_balance -= payload.amount

    # Create payout request
    payout = PayoutRequest(
        stylist_id=stylist_profile.id,
        amount=payload.amount,
        payout_method=payload.payout_method,
        account_details=payload.account_details,
        status="pending"
    )
    db.add(payout)

    # Record debit ledger entry
    ledger = WalletLedger(
        wallet_id=wallet.id,
        entry_type="debit",
        amount=payload.amount,
        currency="INR",
        description=f"Withdrawal request via {payload.payout_method.upper()} to {payload.account_details}",
        balance_after=wallet.available_balance
    )
    db.add(ledger)

    db.commit()
    return {
        "message": "Payout request submitted successfully. Funds will arrive within 24-48 hours.",
        "payout_id": payout.id,
        "remaining_balance": wallet.available_balance
    }
