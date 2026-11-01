import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    brand_name = Column(String(150), unique=True, index=True, nullable=False)
    category = Column(String(100), default="Clothing Brand", index=True) # Clothing Brand, Boutique, Designer Label, Footwear, Rental Store
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    logo_url = Column(String(500), nullable=False)
    banner_url = Column(String(500), nullable=True)
    city = Column(String(100), index=True, nullable=False)
    address = Column(Text, nullable=True)
    store_hours = Column(String(150), default="Mon - Sat: 10:00 AM - 9:00 PM")
    website_url = Column(String(300), nullable=True)
    instagram_handle = Column(String(100), nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="brand_profile")
    products = relationship("Product", back_populates="brand", cascade="all, delete-orphan")
    campaigns = relationship("CreatorCampaign", back_populates="brand", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    brand_id = Column(String(36), ForeignKey("brand_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), index=True, default="Menswear")
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    currency = Column(String(10), default="INR")
    images = Column(JSON, default=list) # Array of image URLs
    available_sizes = Column(JSON, default=lambda: ["S", "M", "L", "XL"])
    available_colors = Column(JSON, default=lambda: ["Black", "White", "Navy", "Beige"])
    shopping_url = Column(String(500), nullable=False)
    store_city = Column(String(100), nullable=True)
    is_available = Column(Boolean, default=True)
    click_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    brand = relationship("BrandProfile", back_populates="products")

class StorePromotion(Base):
    __tablename__ = "store_promotions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    brand_id = Column(String(36), ForeignKey("brand_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    discount_percentage = Column(Integer, default=15)
    promo_code = Column(String(50), nullable=True)
    banner_url = Column(String(500), nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
