import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class ProfessionalProfile(Base):
    __tablename__ = "professional_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    category = Column(String(100), default="Personal Stylist", index=True)
    specializations = Column(JSON, default=list) # ["Wedding Styling", "Wardrobe Audit", "Old Money Aesthetic", "Editorial"]
    bio = Column(Text, nullable=False)
    experience_years = Column(Integer, default=3)
    languages = Column(JSON, default=lambda: ["English", "Malayalam", "Hindi"])
    base_city = Column(String(100), index=True, nullable=False)
    operating_cities = Column(JSON, default=list) # ["Kozhikode", "Kochi", "Bengaluru", "Mumbai"]
    starting_price = Column(Float, default=1500.0)
    currency = Column(String(10), default="INR")
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    instant_booking_enabled = Column(Boolean, default=True)
    verification_status = Column(String(50), default="pending", index=True) # pending, verified, rejected
    verification_documents = Column(JSON, default=list) # ["cert1.pdf", "id.pdf"]
    portfolio_images = Column(JSON, default=list) # URLs of past editorial styling work
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="stylist_profile")
    services = relationship("ProfessionalService", back_populates="stylist", cascade="all, delete-orphan")
    reviews = relationship("StylistReview", back_populates="stylist", cascade="all, delete-orphan")
    availability_rules = relationship("AvailabilityRule", back_populates="stylist", cascade="all, delete-orphan")

class ProfessionalService(Base):
    __tablename__ = "professional_services"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stylist_id = Column(String(36), ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Personal Styling")
    service_mode = Column(String(100), default="virtual_consultation") # virtual_consultation, video_consultation, physical_shopping, home_visit, wedding_assignment
    duration_minutes = Column(Integer, default=60)
    price = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    advance_percentage = Column(Float, default=50.0) # percentage required to confirm booking
    travel_fee = Column(Float, default=0.0)
    cancellation_policy = Column(String(255), default="Free cancellation up to 24 hours before consultation.")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    stylist = relationship("ProfessionalProfile", back_populates="services")
    bookings = relationship("Booking", back_populates="service")

class AvailabilityRule(Base):
    __tablename__ = "availability_rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stylist_id = Column(String(36), ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False) # 0 = Monday, 6 = Sunday
    start_time = Column(String(10), default="10:00")
    end_time = Column(String(10), default="18:00")
    is_available = Column(Boolean, default=True)

    stylist = relationship("ProfessionalProfile", back_populates="availability_rules")

class StylistReview(Base):
    __tablename__ = "stylist_reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stylist_id = Column(String(36), ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    booking_id = Column(String(36), nullable=True)
    rating = Column(Float, default=5.0)
    review_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    stylist = relationship("ProfessionalProfile", back_populates="reviews")
    customer = relationship("User")
