from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.commerce import BrandProfile, Product, StorePromotion
from app.schemas.all_schemas import BrandCreate, ProductCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/brands", tags=["Brands & Stores Marketplace"])

def serialize_brand(brand: BrandProfile) -> dict:
    return {
        "id": brand.id,
        "user_id": brand.user_id,
        "brand_name": brand.brand_name,
        "category": brand.category,
        "tagline": brand.tagline,
        "description": brand.description,
        "logo_url": brand.logo_url,
        "banner_url": brand.banner_url,
        "city": brand.city,
        "address": brand.address,
        "store_hours": brand.store_hours,
        "website_url": brand.website_url,
        "instagram_handle": brand.instagram_handle,
        "is_verified": brand.is_verified,
        "products_count": len(brand.products) if brand.products else 0
    }

def serialize_product(p: Product) -> dict:
    return {
        "id": p.id,
        "brand_id": p.brand_id,
        "brand_name": p.brand.brand_name if p.brand else "Featured Brand",
        "name": p.name,
        "description": p.description,
        "category": p.category,
        "price": p.price,
        "discount_price": p.discount_price,
        "currency": p.currency,
        "images": p.images or [],
        "available_sizes": p.available_sizes or [],
        "available_colors": p.available_colors or [],
        "shopping_url": p.shopping_url,
        "store_city": p.store_city,
        "is_available": p.is_available,
        "click_count": p.click_count
    }

@router.get("/")
def list_brands(
    city: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BrandProfile)
    if city and city.lower() != "all":
        query = query.filter(BrandProfile.city.ilike(f"%{city}%"))
    if category and category.lower() != "all":
        query = query.filter(BrandProfile.category.ilike(f"%{category}%"))

    brands = query.all()
    return [serialize_brand(b) for b in brands]

@router.get("/{brand_id}")
def get_brand_details(brand_id: str, db: Session = Depends(get_db)):
    brand = db.query(BrandProfile).filter(BrandProfile.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")

    data = serialize_brand(brand)
    data["products"] = [serialize_product(p) for p in brand.products if p.is_available]
    return data

@router.post("/onboard", status_code=status.HTTP_201_CREATED)
def onboard_brand(
    payload: BrandCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(BrandProfile).filter(BrandProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Brand profile already exists for this account")

    current_user.role = "brand"

    brand = BrandProfile(
        user_id=current_user.id,
        brand_name=payload.brand_name,
        category=payload.category,
        tagline=payload.tagline,
        description=payload.description,
        logo_url=payload.logo_url,
        banner_url=payload.banner_url,
        city=payload.city,
        address=payload.address,
        store_hours=payload.store_hours,
        website_url=payload.website_url,
        instagram_handle=payload.instagram_handle,
        is_verified=True
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return serialize_brand(brand)

@router.get("/{brand_id}/products")
def list_brand_products(brand_id: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.brand_id == brand_id).all()
    return [serialize_product(p) for p in products]

@router.post("/{brand_id}/products", status_code=status.HTTP_201_CREATED)
def add_product(
    brand_id: str,
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    brand = db.query(BrandProfile).filter(BrandProfile.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")

    if brand.user_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to add products for this brand")

    product = Product(
        brand_id=brand_id,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        price=payload.price,
        discount_price=payload.discount_price,
        currency=payload.currency,
        images=payload.images,
        available_sizes=payload.available_sizes,
        available_colors=payload.available_colors,
        shopping_url=payload.shopping_url,
        store_city=payload.store_city or brand.city
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return serialize_product(product)

@router.post("/products/{product_id}/click")
def track_product_click(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        product.click_count += 1
        db.commit()
    return {"message": "Click recorded"}
