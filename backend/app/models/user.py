import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="enthusiast", nullable=False) # enthusiast, stylist, creator, brand, store, admin, super_admin
    status = Column(String(50), default="active", nullable=False) # active, pending_verification, suspended, deactivated
    email_verified = Column(Boolean, default=True)
    phone_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    posts = relationship("Post", foreign_keys="[Post.user_id]", back_populates="author", cascade="all, delete-orphan")
    stylist_profile = relationship("ProfessionalProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    brand_profile = relationship("BrandProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    display_name = Column(String(150), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    city = Column(String(100), index=True, nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), default="India")
    website_url = Column(String(300), nullable=True)
    instagram_handle = Column(String(100), nullable=True)
    is_verified = Column(Boolean, default=False)
    fashion_interests = Column(JSON, default=list) # e.g. ["Casual", "Old Money", "Streetwear", "Wedding"]
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="profile")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(500), unique=True, index=True, nullable=False)
    is_revoked = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="refresh_tokens")

class BlockedUser(Base):
    __tablename__ = "blocked_users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    blocker_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    blocked_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
