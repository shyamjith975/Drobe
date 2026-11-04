import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class OccasionProject(Base):
    __tablename__ = "occasion_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(200), nullable=False) # e.g. "Royal Udaipur Wedding Experience"
    occasion_type = Column(String(100), default="Wedding") # Wedding, Engagement, Gala, Red Carpet, Editorial Photoshoot
    event_date = Column(String(50), nullable=False) # YYYY-MM-DD
    city = Column(String(100), default="Udaipur")
    total_budget = Column(Float, default=85000.0)
    
    # Booked Professionals & Services Breakdown
    # [
    #   { "role": "Personal Stylist", "professional_name": "Maya Nambiar", "service": "Bridal Trousseau", "status": "confirmed", "fee": 18000 },
    #   { "role": "Makeup Artist", "professional_name": "Zara Khan Studio", "service": "Bridal HD Glam", "status": "confirmed", "fee": 25000 },
    #   { "role": "Photographer", "professional_name": "Lumière Atelier", "service": "Editorial Portraiture", "status": "confirmed", "fee": 35000 },
    #   { "role": "Boutique Attire", "boutique_name": "Atelier Maison", "service": "Silk Velvet Gown", "status": "purchased", "fee": 38500 }
    # ]
    booked_services = Column(JSON, default=list)
    
    status = Column(String(50), default="active") # planning, active, completed
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    customer = relationship("User", back_populates="occasion_projects")
