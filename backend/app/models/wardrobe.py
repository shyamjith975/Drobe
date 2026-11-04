import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False, index=True) # Tops, Bottoms, Dresses, Outerwear, Shoes, Bags, Accessories
    color = Column(String(50), default="Charcoal")
    color_hex = Column(String(20), default="#191919")
    material = Column(String(100), default="100% Cashmere")
    brand = Column(String(100), default="Maison Drobe")
    image_url = Column(String(500), nullable=False)
    purchase_price = Column(Float, nullable=True)
    purchase_date = Column(String(50), nullable=True)
    tags = Column(JSON, default=list) # ["Winter", "Minimalist", "Work"]
    is_favorite = Column(Boolean, default=False)
    shared_with_stylist = Column(Boolean, default=True) # Shared with assigned stylists during consultations
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="wardrobe_items")

class WardrobeOutfit(Base):
    __tablename__ = "wardrobe_outfits"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    name = Column(String(150), nullable=False)
    occasion = Column(String(100), default="Business Casual")
    item_ids = Column(JSON, default=list) # List of WardrobeItem IDs
    image_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="wardrobe_outfits")

class WardrobeGap(Base):
    __tablename__ = "wardrobe_gaps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(150), nullable=False)
    category = Column(String(50), default="Outerwear")
    priority = Column(String(20), default="High") # High, Medium, Low
    notes = Column(Text, nullable=True)
    recommended_by_stylist = Column(Boolean, default=False)
    stylist_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="wardrobe_gaps")
