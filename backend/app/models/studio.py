import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class PartnerStudio(Base):
    __tablename__ = "partner_studios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    address = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=False)
    rating = Column(Float, default=4.95)
    reviews_count = Column(Integer, default=42)
    contact_phone = Column(String(50), default="+91 484 231 9900")
    operating_hours = Column(String(100), default="10:00 AM - 8:00 PM (Tue - Sun)")
    services = Column(JSON, default=lambda: [
        {
            "title": "Seasonal Colour Draping & Skin Undertone Analysis",
            "duration_minutes": 60,
            "price": 3500.0,
            "description": "Instrument and fabric draping to determine your ideal seasonal palette and undertone harmony."
        },
        {
            "title": "Body Proportion & Silhouette Mapping",
            "duration_minutes": 45,
            "price": 2800.0,
            "description": "Architectural silhouette analysis to determine garment cuts, necklines, and waistlines that flatter your posture."
        },
        {
            "title": "Senior Stylist Consultation & Printed Style Dossier",
            "duration_minutes": 90,
            "price": 6000.0,
            "description": "1-on-1 private session with a DROBE Master Stylist, complete with a bound printed style dossier and digital lookbook."
        },
        {
            "title": "Bridal Trousseau & Heritage Silk Draping",
            "duration_minutes": 120,
            "price": 8500.0,
            "description": "Bespoke bridal styling session with Kasavu, silk, and heritage textile draping trials."
        }
    ])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    appointments = relationship("StudioAppointment", back_populates="studio", cascade="all, delete-orphan")

class StudioAppointment(Base):
    __tablename__ = "studio_appointments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    studio_id = Column(String(36), ForeignKey("partner_studios.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    service_title = Column(String(150), nullable=False)
    appointment_date = Column(String(50), nullable=False)
    appointment_time = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    studio = relationship("PartnerStudio", back_populates="appointments")
    customer = relationship("User")

