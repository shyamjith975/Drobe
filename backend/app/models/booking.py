import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    stylist_id = Column(String(36), ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id = Column(String(36), ForeignKey("professional_services.id", ondelete="CASCADE"), nullable=False, index=True)
    booking_date = Column(String(50), nullable=False) # YYYY-MM-DD
    booking_time = Column(String(50), nullable=False) # HH:MM
    service_mode = Column(String(100), default="virtual_consultation")
    status = Column(String(50), default="requested", index=True) # requested, accepted, confirmed, completed, cancelled, rejected, disputed
    notes = Column(Text, nullable=True)
    location_address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    reference_images = Column(JSON, default=list)

    # Financial details
    total_amount = Column(Float, nullable=False)
    advance_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    currency = Column(String(10), default="INR")
    platform_commission = Column(Float, default=0.0) # Calculated based on platform rate
    stylist_payout = Column(Float, default=0.0) # total_amount - platform_commission

    # Razorpay tracking
    razorpay_order_id = Column(String(100), nullable=True, index=True)
    razorpay_payment_id = Column(String(100), nullable=True, index=True)

    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    customer = relationship("User", foreign_keys=[customer_id])
    stylist = relationship("ProfessionalProfile", foreign_keys=[stylist_id])
    service = relationship("ProfessionalService", foreign_keys=[service_id], back_populates="bookings")
    status_history = relationship("BookingStatusHistory", back_populates="booking", cascade="all, delete-orphan")

class BookingStatusHistory(Base):
    __tablename__ = "booking_status_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=False)
    changed_by_user_id = Column(String(36), nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    booking = relationship("Booking", back_populates="status_history")
