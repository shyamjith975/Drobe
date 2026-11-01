import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base, generate_uuid

class Post(Base):
    __tablename__ = "posts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    caption = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), index=True, default="Casual") # Streetwear, Old Money, Wedding, Luxury, etc.
    occasion = Column(String(100), nullable=True) # Cocktail, Brunch, Festive, Travel
    city = Column(String(100), index=True, nullable=True)
    tags = Column(JSON, default=list) # ["#menswear", "#quietluxury"]
    tagged_stylist_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    visibility = Column(String(50), default="public")
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    saves_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Relationships
    author = relationship("User", foreign_keys=[user_id], back_populates="posts")
    tagged_stylist = relationship("User", foreign_keys=[tagged_stylist_id])
    media = relationship("PostMedia", back_populates="post", cascade="all, delete-orphan", order_by="PostMedia.order_index")
    product_tags = relationship("ProductTag", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan", order_by="desc(Comment.created_at)")
    saved_by = relationship("SavedPost", back_populates="post", cascade="all, delete-orphan")

class PostMedia(Base):
    __tablename__ = "post_media"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(36), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    media_url = Column(String(500), nullable=False)
    media_type = Column(String(20), default="image") # image, video
    order_index = Column(Integer, default=0)
    aspect_ratio = Column(Float, default=1.0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    post = relationship("Post", back_populates="media")

class ProductTag(Base):
    __tablename__ = "post_product_tags"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(36), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), nullable=True) # Optional link to registered store product
    title = Column(String(200), nullable=False)
    brand_name = Column(String(150), nullable=False)
    price = Column(Float, default=0.0)
    currency = Column(String(10), default="INR")
    shopping_url = Column(String(500), nullable=True)
    pin_x = Column(Float, default=50.0) # percentage X on media (0-100)
    pin_y = Column(Float, default=50.0) # percentage Y on media (0-100)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    post = relationship("Post", back_populates="product_tags")

class Like(Base):
    __tablename__ = "likes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(36), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_like"),)
    post = relationship("Post", back_populates="likes")
    user = relationship("User")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(36), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(String(36), ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    post = relationship("Post", back_populates="comments")
    author = relationship("User")
    parent = relationship("Comment", remote_side=[id], backref="replies")

class Follow(Base):
    __tablename__ = "follows"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    follower_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    following_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    __table_args__ = (UniqueConstraint("follower_id", "following_id", name="uq_user_follow"),)
    follower = relationship("User", foreign_keys=[follower_id])
    following = relationship("User", foreign_keys=[following_id])

class Collection(Base):
    __tablename__ = "collections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    is_private = Column(Boolean, default=False)
    cover_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    items = relationship("SavedPost", back_populates="collection", cascade="all, delete-orphan")

class SavedPost(Base):
    __tablename__ = "saved_posts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    post_id = Column(String(36), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    collection_id = Column(String(36), ForeignKey("collections.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_user_saved_post"),)
    post = relationship("Post", back_populates="saved_by")
    collection = relationship("Collection", back_populates="items")

class ContentReport(Base):
    __tablename__ = "content_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    reporter_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50), nullable=False) # post, user, comment
    target_id = Column(String(36), nullable=False, index=True)
    reason = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    status = Column(String(50), default="pending") # pending, reviewed, dismissed, action_taken
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
