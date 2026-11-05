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
    booked_services = Column(JSON, default=list)

    # Bridal Party / Group Occasion Room ("Split the Tab")
    # [
    #   { "id": "gm-1", "name": "Meera Patel", "role": "Maid of Honor", "email": "meera@example.com", "phone": "+91 98471 22334", "sizing": "US 6 / UK 10", "assigned_garment": "Sage Banarasi Silk Draped Saree", "split_amount": 16500.0, "payment_status": "paid" },
    #   { "id": "gm-2", "name": "Rhea Sen", "role": "Bridesmaid", "email": "rhea@example.com", "phone": "+91 98950 44556", "sizing": "US 4 / UK 8", "assigned_garment": "Mint Organza Pre-Stitched Lehenga", "split_amount": 14500.0, "payment_status": "pending" }
    # ]
    group_members = Column(JSON, default=list)

    # Collective Visual Palette & Harmony Theme
    # { "title": "Royal Udaipur Sunlit Flora", "primary_colors": ["#1B4D3E", "#D4AF37", "#F4DCD6", "#EAE8E3"], "fabric_family": "Mulberry Silk & Belgian Linen" }
    palette_theme = Column(JSON, default=dict)

    # High-Ticket Multi-Service Escrow Package
    # { "package_title": "Grand Wedding Occasion Sovereign Bundle", "total_gross_inr": 115500.0, "discount_bundle_inr": 8500.0, "net_payable_inr": 107000.0, "platform_fee_inr": 16050.0, "damage_protection_included": True, "damage_protection_fee": 1499.0, "escrow_status": "funded" }
    escrow_package = Column(JSON, default=dict)

    # At-Home White-Glove Trial Concierge Service
    # { "status": "requested", "trial_date": "2026-11-24", "trial_time": "15:00", "delivery_address": "Lake Palace Suite 402, Udaipur", "concierge_fee": 1500.0, "fee_paid": True }
    concierge_trial = Column(JSON, default=dict)
    
    status = Column(String(50), default="active") # planning, active, completed
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    customer = relationship("User", back_populates="occasion_projects")
