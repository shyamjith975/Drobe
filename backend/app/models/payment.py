import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_type = Column(String(50), default="booking") # booking, campaign_escrow, subscription
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    razorpay_order_id = Column(String(100), unique=True, index=True, nullable=False)
    razorpay_payment_id = Column(String(100), index=True, nullable=True)
    status = Column(String(50), default="created") # created, paid, failed, refunded
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

class ProfessionalWallet(Base):
    __tablename__ = "professional_wallets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stylist_id = Column(String(36), ForeignKey("professional_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    available_balance = Column(Float, default=0.0)
    pending_balance = Column(Float, default=0.0)
    total_earned = Column(Float, default=0.0)
    currency = Column(String(10), default="INR")
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    ledger_entries = relationship("WalletLedger", back_populates="wallet", cascade="all, delete-orphan")

class WalletLedger(Base):
    __tablename__ = "wallet_ledger"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    wallet_id = Column(String(36), ForeignKey("professional_wallets.id", ondelete="CASCADE"), nullable=False, index=True)
    booking_id = Column(String(36), ForeignKey("bookings.id", ondelete="SET NULL"), nullable=True)
    entry_type = Column(String(50), nullable=False) # credit (booking payment), debit (withdrawal), commission
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    description = Column(Text, nullable=False)
    balance_after = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    wallet = relationship("ProfessionalWallet", back_populates="ledger_entries")

class PayoutRequest(Base):
    __tablename__ = "payout_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stylist_id = Column(String(36), ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    payout_method = Column(String(50), default="bank_transfer") # upi, bank_transfer
    account_details = Column(Text, nullable=False) # UPI ID or Bank account details
    status = Column(String(50), default="pending") # pending, approved, processed, rejected
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    processed_at = Column(DateTime, nullable=True)
