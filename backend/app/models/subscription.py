import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class BoutiqueSubscription(Base):
    __tablename__ = "boutique_subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    brand_id = Column(String(36), ForeignKey("brand_profiles.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    tier = Column(String(50), default="free") # free, atelier_club, couture_circle
    tier_name = Column(String(100), default="Complimentary Partner")
    price_monthly_inr = Column(Float, default=0.0) # 0.0, 4999.0, 9999.0
    commission_rate_pct = Column(Float, default=20.0) # 20.0% for free, 12.0% for atelier, 8.0% for couture
    
    status = Column(String(50), default="active") # active, past_due, cancelled
    billing_cycle = Column(String(50), default="monthly") # monthly, annual
    renews_at = Column(DateTime, nullable=True)
    
    # Feature Toggles
    priority_search_ranking = Column(Boolean, default=False)
    unlimited_hotspots = Column(Boolean, default=False)
    stylist_routing_access = Column(Boolean, default=False)
    at_home_concierge_enabled = Column(Boolean, default=False)
    dedicated_curator = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    brand = relationship("BrandProfile")

class CustomerSubscription(Base):
    __tablename__ = "customer_subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    tier = Column(String(50), default="quarterly_reset") # quarterly_reset, annual_elite
    tier_name = Column(String(100), default="Seasonal Wardrobe Reset")
    price_inr = Column(Float, default=3999.0) # 3999 / quarter or 12999 / year
    status = Column(String(50), default="active") # active, paused, cancelled
    
    billing_cycle = Column(String(50), default="quarterly") # quarterly, annual
    resets_total = Column(Integer, default=4)
    resets_used = Column(Integer, default=1)
    
    assigned_stylist_id = Column(String(36), nullable=True)
    assigned_stylist_name = Column(String(100), default="Maya Nambiar")
    next_scheduled_reset = Column(String(50), default="2026-12-15") # Next season date
    
    # Member Perks
    boutique_discount_pct = Column(Integer, default=10) # 10% off boutique partner purchases
    damage_protection_discount = Column(Boolean, default=True) # Complimentary rental damage protection
    whatsapp_concierge_priority = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User")

