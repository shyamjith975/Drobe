import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, JSON
from app.core.database import Base, generate_uuid

class CelebrityLook(Base):
    __tablename__ = "celebrity_looks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    celebrity_name = Column(String(100), nullable=False, index=True)
    event_name = Column(String(150), nullable=False) # e.g. "Royal Wedding Reception in Udaipur", "Venice Film Festival Premiere"
    image_url = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    original_designer = Column(String(100), nullable=False) # e.g. "Sabyasachi Mukherjee", "Haider Ackermann"
    original_price_est = Column(String(50), default="₹4,50,000")
    
    # Outfit Architecture
    silhouette_type = Column(String(100), default="Structured Double-Breasted & Fluid Draped")
    key_fabrics = Column(String(150), default="Silk Velvet, Zardozi Hand-Embroidery, Organza Dupatta")
    color_palette = Column(JSON, default=lambda: ["#1B4D3E", "#D4AF37", "#191919"])
    
    # Breakdown Components with DROBE Boutique Alternatives
    breakdown_items = Column(JSON, default=list)
    # [
    #   {
    #     "piece_name": "Embroidered Velvet Bandi / Cape",
    #     "luxury_original_cost": "₹1,80,000",
    #     "drobe_alternative_title": "Zardozi Mulberry Silk Velvet Cape",
    #     "boutique_name": "Maison Heritage Kochi",
    #     "price": "₹28,500",
    #     "image_url": "/images/emerald_silk_gown.jpg",
    #     "product_id": "prod-101"
    #   }
    # ]
    
    budget_recreation_cost = Column(String(50), default="₹45,000")
    savings_percentage = Column(Integer, default=85)
    
    # Stylist Guidance & Verification
    stylist_notes = Column(Text, nullable=False)
    reviewed_by_stylist_name = Column(String(100), default="Maya Nambiar")
    is_expert_reviewed = Column(Boolean, default=True) # DROBE Expert Reviewed Badge
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
