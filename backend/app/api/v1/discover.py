from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.core.database import get_db
from app.models.user import User, UserProfile
from app.models.social import Post
from app.models.marketplace import ProfessionalProfile
from app.models.commerce import BrandProfile, Product
from app.models.content import StyleGuide
from app.api.v1.posts import serialize_post
from app.api.v1.stylists import serialize_stylist
from app.api.v1.brands import serialize_brand, serialize_product
from app.api.v1.style_guides import serialize_guide

router = APIRouter(prefix="/discover", tags=["Search & Discovery"])

@router.get("/search")
def unified_search(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    search_term = f"%{q}%"

    # Search Posts
    posts = db.query(Post).filter(
        or_(
            Post.caption.ilike(search_term),
            Post.category.ilike(search_term),
            Post.city.ilike(search_term)
        )
    ).limit(limit).all()

    # Search Stylists
    stylists = db.query(ProfessionalProfile).filter(
        or_(
            ProfessionalProfile.bio.ilike(search_term),
            ProfessionalProfile.category.ilike(search_term),
            ProfessionalProfile.base_city.ilike(search_term)
        )
    ).limit(limit).all()

    # Search Brands
    brands = db.query(BrandProfile).filter(
        or_(
            BrandProfile.brand_name.ilike(search_term),
            BrandProfile.category.ilike(search_term),
            BrandProfile.city.ilike(search_term)
        )
    ).limit(limit).all()

    # Search Products
    products = db.query(Product).filter(
        or_(
            Product.name.ilike(search_term),
            Product.category.ilike(search_term)
        )
    ).limit(limit).all()

    # Search Style Guides
    guides = db.query(StyleGuide).filter(
        or_(
            StyleGuide.title.ilike(search_term),
            StyleGuide.category.ilike(search_term),
            StyleGuide.description.ilike(search_term)
        )
    ).limit(limit).all()

    return {
        "query": q,
        "posts": [serialize_post(p) for p in posts],
        "stylists": [serialize_stylist(s) for s in stylists],
        "brands": [serialize_brand(b) for b in brands],
        "products": [serialize_product(p) for p in products],
        "style_guides": [serialize_guide(g) for g in guides]
    }

@router.get("/trending")
def get_trending(db: Session = Depends(get_db)):
    trending_posts = db.query(Post).order_by(desc(Post.likes_count)).limit(6).all()
    featured_stylists = db.query(ProfessionalProfile).order_by(desc(ProfessionalProfile.rating)).limit(4).all()
    featured_brands = db.query(BrandProfile).limit(4).all()
    featured_guides = db.query(StyleGuide).filter(StyleGuide.is_featured == True).limit(4).all()

    return {
        "categories": [
            "Old Money",
            "Quiet Luxury",
            "Minimalist",
            "Streetwear",
            "Wedding & Occasion",
            "Korean Fashion",
            "Casual Luxury",
            "Kerala Kasavu Modern"
        ],
        "trending_posts": [serialize_post(p) for p in trending_posts],
        "featured_stylists": [serialize_stylist(s) for s in featured_stylists],
        "featured_brands": [serialize_brand(b) for b in featured_brands],
        "featured_guides": [serialize_guide(g) for g in featured_guides]
    }
