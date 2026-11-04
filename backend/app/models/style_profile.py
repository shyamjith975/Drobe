import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class CustomerStyleProfile(Base):
    __tablename__ = "customer_style_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Self-perception & Portrait
    selfie_url = Column(String(500), nullable=True)
    
    # Style Questionnaire & Personality
    style_personalities = Column(JSON, default=lambda: ["Classic Minimalist", "Old Money Heritage"])
    face_shape = Column(String(50), default="Oval") # Oval, Round, Square, Heart, Diamond, Oblong
    body_structure = Column(String(50), default="Hourglass") # Hourglass, Rectangle, Inverted Triangle, Pear / Spoon, Athletic
    height_cm = Column(Integer, default=168)
    
    # Fit & Sizing
    sizes = Column(JSON, default=lambda: {"top": "M", "bottom": "30", "dress": "UK 10", "shoes": "UK 6"})
    fit_preferences = Column(JSON, default=lambda: ["Tailored", "Relaxed"]) # Relaxed, Tailored, Oversized, Structured, Bodycon
    
    # Lifestyle & Occasions
    lifestyle_activities = Column(JSON, default=lambda: ["Corporate / Office", "Festive Celebrations", "Weekend Casual"])
    occasion_needs = Column(JSON, default=lambda: ["Capsule Wardrobe Refresh", "Upcoming Wedding Guest"])
    
    # Budget Preferences
    budget_tier = Column(String(50), default="Mid-Luxury") # Accessible Chic, Mid-Luxury, High Luxury / Couture, Bespoke Designer
    budget_ranges = Column(JSON, default=lambda: {
        "tops": "₹2,500 - ₹6,000",
        "dresses": "₹6,000 - ₹20,000",
        "occasion_wear": "₹15,000 - ₹50,000",
        "accessories": "₹3,000 - ₹12,000"
    })
    
    # Color Harmony & Fabrics (Human-First Preference)
    skin_undertone = Column(String(50), default="Warm") # Warm, Cool, Neutral, Olive
    favorite_colors = Column(JSON, default=lambda: ["#191919", "#F7F5F0", "#1B4D3E", "#D4AF37", "#F4DCD6"])
    colors_to_avoid = Column(JSON, default=lambda: ["Neon Green", "Mustard Yellow"])
    fabrics_preferred = Column(JSON, default=lambda: ["Mulberry Silk", "Mongolian Cashmere", "Normandy Flax Linen", "Virgin Wool"])
    fabrics_avoided = Column(JSON, default=lambda: ["Polyester", "Acrylic"])
    
    # Privacy & Access Control
    share_with_stylists = Column(Boolean, default=True) # Customer consent toggle to share with booked stylists & professionals
    notes_for_stylist = Column(Text, nullable=True) # Specific allergies, comfort preferences, style icons, etc.
    
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="style_profile")
