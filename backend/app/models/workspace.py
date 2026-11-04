import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class StylingWorkspace(Base):
    __tablename__ = "styling_workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Customer requirements & inspirations
    customer_requirements = Column(Text, nullable=True)
    reference_images = Column(JSON, default=list) # [{ "url": "...", "caption": "..." }]
    
    # Stylist Preparation & Workspace Collaboration
    stylist_prep_notes = Column(Text, nullable=True) # Private preparation notes
    moodboards = Column(JSON, default=list) # [{ "title": "...", "image_url": "...", "palette": ["#191919"], "notes": "..." }]
    
    # Boutique & Product Recommendations
    product_recommendations = Column(JSON, default=list) # [{ "title": "...", "brand": "...", "price": "...", "url": "...", "image_url": "...", "notes": "..." }]
    
    # Session Details & Deliverables
    session_notes = Column(Text, nullable=True) # Real-time notes taken during session
    final_report = Column(JSON, default=dict) # { "summary": "...", "palette": [...], "dos_donts": [...], "shortlist": [...], "delivered_at": "..." }
    follow_up_recommendations = Column(Text, nullable=True)
    
    status = Column(String(50), default="active") # draft, active, delivered, completed
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    booking = relationship("Booking", back_populates="workspace")
