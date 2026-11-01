import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class CreatorCampaign(Base):
    __tablename__ = "creator_campaigns"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    brand_id = Column(String(36), ForeignKey("brand_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Festive Launch") # Streetwear, Luxury, Wedding, Summer Collection
    required_creator_type = Column(String(100), default="Fashion Influencer")
    target_city = Column(String(100), default="All India")
    budget_inr = Column(Float, nullable=False)
    deliverables = Column(JSON, default=list) # ["1 Instagram Reel", "2 Feed Carousels", "Style Guide Inclusion"]
    application_deadline = Column(String(50), nullable=False)
    status = Column(String(50), default="open", index=True) # open, reviewing, closed
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    brand = relationship("BrandProfile", back_populates="campaigns")
    applications = relationship("CampaignApplication", back_populates="campaign", cascade="all, delete-orphan")

class CampaignApplication(Base):
    __tablename__ = "campaign_applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("creator_campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    creator_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    proposal = Column(Text, nullable=False)
    quoted_price = Column(Float, nullable=False)
    deliverables_plan = Column(Text, nullable=False)
    status = Column(String(50), default="pending", index=True) # pending, accepted, rejected, completed
    deliverable_urls = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    campaign = relationship("CreatorCampaign", back_populates="applications")
    creator = relationship("User", foreign_keys=[creator_id])
