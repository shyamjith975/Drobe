import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class StyleGuide(Base):
    __tablename__ = "style_guides"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    category = Column(String(100), index=True, nullable=False) # Old Money, Quiet Luxury, Streetwear, Wedding, Minimalist, Casual
    description = Column(Text, nullable=False)
    hero_image = Column(String(500), nullable=False)
    gallery_images = Column(JSON, default=list)
    color_palette = Column(JSON, default=list) # e.g. ["#191919", "#F7F5F0", "#B8B1A5"]
    clothing_combinations = Column(JSON, default=list) # e.g. ["Polo shirt + chinos + suede loafers", "Linen shirt + relaxed tailored trousers"]
    stylist_tips = Column(JSON, default=list)
    occasion = Column(String(150), default="Versatile / All Seasons")
    author_name = Column(String(150), default="DROBE Editorial Board")
    author_title = Column(String(150), default="Senior Fashion Director")
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system") # booking, social, payment, campaign, system
    is_read = Column(Boolean, default=False)
    reference_id = Column(String(100), nullable=True) # e.g. booking_id or post_id
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), index=True)

    user = relationship("User", back_populates="notifications")
