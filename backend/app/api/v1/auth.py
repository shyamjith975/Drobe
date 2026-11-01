import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.user import User, UserProfile, RefreshToken
from app.models.marketplace import ProfessionalProfile
from app.models.commerce import BrandProfile
from app.models.payment import ProfessionalWallet
from app.schemas.all_schemas import (
    UserRegister, UserLogin, TokenResponse,
    CustomerRegisterSchema, BoutiqueRegisterSchema, ConsultantRegisterSchema,
    ForgotPasswordSchema, ResetPasswordSchema, RefreshTokenSchema
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_dict(user: User) -> dict:
    profile = user.profile
    stylist = user.stylist_profile
    brand = user.brand_profile

    return {
        "id": user.id,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "status": user.status,
        "email_verified": user.email_verified,
        "profile": {
            "id": profile.id if profile else None,
            "username": profile.username if profile else "",
            "display_name": profile.display_name if profile else "",
            "avatar_url": profile.avatar_url if profile else None,
            "cover_url": profile.cover_url if profile else None,
            "bio": profile.bio if profile else "",
            "city": profile.city if profile else "",
            "state": profile.state if profile else "",
            "country": profile.country if profile else "India",
            "is_verified": profile.is_verified if profile else False,
            "fashion_interests": profile.fashion_interests if profile else [],
            "followers_count": profile.followers_count if profile else 0,
            "following_count": profile.following_count if profile else 0,
            "posts_count": profile.posts_count if profile else 0,
        } if profile else None,
        "stylist_profile": {
            "id": stylist.id,
            "category": stylist.category,
            "specializations": stylist.specializations or [],
            "verification_status": stylist.verification_status,
            "rating": stylist.rating,
            "starting_price": stylist.starting_price,
            "base_city": stylist.base_city,
            "operating_cities": stylist.operating_cities or [],
        } if stylist else None,
        "brand_profile": {
            "id": brand.id,
            "brand_name": brand.brand_name,
            "category": brand.category,
            "is_verified": brand.is_verified,
            "city": brand.city,
            "logo_url": brand.logo_url,
        } if brand else None,
    }

# ----------------------------------------------------
# 1. CUSTOMER AUTHENTICATION
# ----------------------------------------------------
@router.post("/customer/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_customer(payload: CustomerRegisterSchema, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    if db.query(User).filter(User.email == email_clean).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    base_username = email_clean.split("@")[0].replace(".", "_")
    username = base_username
    counter = 1
    while db.query(UserProfile).filter(UserProfile.username == username).first():
        username = f"{base_username}_{counter}"
        counter += 1

    user = User(
        email=email_clean,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role="enthusiast",
        status="active",
        email_verified=True,
    )
    db.add(user)
    db.flush()

    profile = UserProfile(
        user_id=user.id,
        username=username,
        display_name=payload.full_name,
        city=payload.city or "Kochi",
        fashion_interests=payload.fashion_interests or ["Casual", "Minimalist"],
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

@router.post("/customer/login", response_model=TokenResponse)
def login_customer(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid customer email or password")
    if user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been suspended")

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

# ----------------------------------------------------
# 2. BOUTIQUE / BRAND AUTHENTICATION
# ----------------------------------------------------
@router.post("/boutique/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_boutique(payload: BoutiqueRegisterSchema, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    if db.query(User).filter(User.email == email_clean).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    existing_brand = db.query(BrandProfile).filter(BrandProfile.brand_name.ilike(payload.business_name.strip())).first()
    if existing_brand:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A boutique or brand with this name already exists")

    base_username = payload.business_name.lower().replace(" ", "_").replace("&", "and")
    username = base_username
    counter = 1
    while db.query(UserProfile).filter(UserProfile.username == username).first():
        username = f"{base_username}_{counter}"
        counter += 1

    # Create Boutique User with pending verification
    user = User(
        email=email_clean,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role="brand",
        status="pending_verification",
        email_verified=True,
    )
    db.add(user)
    db.flush()

    profile = UserProfile(
        user_id=user.id,
        username=username,
        display_name=payload.owner_name,
        city=payload.city,
        state=payload.state,
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        is_verified=False
    )
    db.add(profile)
    db.flush()

    brand = BrandProfile(
        user_id=user.id,
        brand_name=payload.business_name.strip(),
        category=payload.category,
        description=f"Exclusive fashion boutique and atelier founded by {payload.owner_name}.",
        logo_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
        banner_url="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
        city=payload.city,
        address=payload.address or f"{payload.city}, {payload.state or 'India'}",
        website_url=payload.website_url,
        instagram_handle=payload.instagram_handle,
        is_verified=False
    )
    db.add(brand)
    db.commit()
    db.refresh(user)

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

@router.post("/boutique/login", response_model=TokenResponse)
def login_boutique(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid boutique email or password")
    if user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been suspended")
    if user.role not in ["brand", "store", "admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please use the Customer or Stylist portal for this account")

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

# ----------------------------------------------------
# 3. CONSULTANT / STYLIST AUTHENTICATION
# ----------------------------------------------------
@router.post("/consultant/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_consultant(payload: ConsultantRegisterSchema, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    if db.query(User).filter(User.email == email_clean).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    base_username = payload.full_name.lower().replace(" ", "_")
    username = base_username
    counter = 1
    while db.query(UserProfile).filter(UserProfile.username == username).first():
        username = f"{base_username}_{counter}"
        counter += 1

    user = User(
        email=email_clean,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role="stylist",
        status="pending_verification",
        email_verified=True,
    )
    db.add(user)
    db.flush()

    profile = UserProfile(
        user_id=user.id,
        username=username,
        display_name=payload.full_name,
        city=payload.city,
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        is_verified=False
    )
    db.add(profile)
    db.flush()

    op_cities = payload.operating_cities if payload.operating_cities else [payload.city]

    stylist = ProfessionalProfile(
        user_id=user.id,
        category=payload.category,
        specializations=payload.specializations or ["Personal Styling", "Wardrobe Audit"],
        bio=payload.bio,
        experience_years=payload.experience_years,
        languages=payload.languages or ["English", "Hindi"],
        base_city=payload.city,
        operating_cities=op_cities,
        starting_price=payload.starting_price,
        rating=5.0,
        verification_status="pending",
        portfolio_images=[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
        ]
    )
    db.add(stylist)
    db.flush()

    # Create wallet for consultant
    wallet = ProfessionalWallet(
        stylist_id=stylist.id,
        available_balance=0.0,
        pending_balance=0.0,
        total_earned=0.0,
        currency="INR"
    )
    db.add(wallet)
    db.commit()
    db.refresh(user)

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

@router.post("/consultant/login", response_model=TokenResponse)
def login_consultant(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid consultant email or password")
    if user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been suspended")
    if user.role not in ["stylist", "creator", "admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please use the Customer or Boutique portal for this account")

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

# ----------------------------------------------------
# 4. ADMIN AUTHENTICATION (NO PUBLIC REGISTRATION)
# ----------------------------------------------------
@router.post("/admin/login", response_model=TokenResponse)
def login_admin(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid administrative credentials")

    if user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted. Only authorized platform administrators may access this portal."
        )

    if user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrative privileges suspended")

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

# ----------------------------------------------------
# 5. PASSWORD MANAGEMENT & REFRESH
# ----------------------------------------------------
@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    # Always return success message to prevent user enumeration
    return {
        "message": "If an account exists with this email, a password reset link has been dispatched.",
        "reset_token_hint": "DROBE-RESET-SECURE"
    }

@router.post("/reset-password")
def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully. You may now log in with your new credentials."}

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshTokenSchema, db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    user_id = decoded.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is invalid or suspended")

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

# ----------------------------------------------------
# 6. GENERAL / BACKWARD COMPATIBLE AUTH
# ----------------------------------------------------
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    return register_customer(
        CustomerRegisterSchema(
            full_name=payload.display_name,
            email=payload.email,
            phone=payload.phone,
            password=payload.password,
            city=payload.city,
            fashion_interests=payload.fashion_interests
        ),
        db
    )

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been suspended")

    token_data = {"sub": user.id, "email": user.email, "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return format_user_dict(current_user)

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}
