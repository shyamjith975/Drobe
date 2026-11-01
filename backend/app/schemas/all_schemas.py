import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- AUTH & USER -----------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "enthusiast" # enthusiast, stylist, creator, brand, store
    username: str = Field(..., min_length=3, max_length=50)
    display_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    city: Optional[str] = "Kochi"
    fashion_interests: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CustomerRegisterSchema(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    city: Optional[str] = "Kochi"
    fashion_interests: Optional[List[str]] = []

class BoutiqueRegisterSchema(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=150)
    owner_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    category: str = "Boutique & Designer Studio"
    city: str = "Kochi"
    state: Optional[str] = "Kerala"
    address: Optional[str] = None
    website_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    business_registration_details: Optional[str] = None

class ConsultantRegisterSchema(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    category: str = "Personal Stylist"
    experience_years: int = 3
    specializations: List[str] = []
    city: str = "Kochi"
    operating_cities: List[str] = []
    languages: List[str] = ["English", "Hindi"]
    bio: str = "Fashion consultant and personal wardrobe stylist."
    starting_price: float = 2500.0

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    token: str
    new_password: str = Field(..., min_length=6)

class RefreshTokenSchema(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    website_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    fashion_interests: Optional[List[str]] = None

# ----------------- SOCIAL & POSTS -----------------
class ProductTagInput(BaseModel):
    product_id: Optional[str] = None
    title: str
    brand_name: str
    price: float
    currency: str = "INR"
    shopping_url: Optional[str] = None
    pin_x: float = 50.0
    pin_y: float = 50.0

class PostCreate(BaseModel):
    caption: str
    description: Optional[str] = None
    category: str = "Casual"
    occasion: Optional[str] = None
    city: Optional[str] = None
    tags: List[str] = []
    media_urls: List[str]
    product_tags: Optional[List[ProductTagInput]] = []
    tagged_stylist_id: Optional[str] = None

class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[str] = None

class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_private: bool = False
    cover_url: Optional[str] = None

# ----------------- MARKETPLACE & STYLISTS -----------------
class ServiceCreate(BaseModel):
    title: str
    description: str
    category: str = "Personal Styling"
    service_mode: str = "virtual_consultation"
    duration_minutes: int = 60
    price: float
    currency: str = "INR"
    advance_percentage: float = 50.0
    travel_fee: float = 0.0

class StylistOnboard(BaseModel):
    category: str = "Personal Stylist"
    specializations: List[str] = ["Personal Styling", "Wardrobe Audit"]
    bio: str
    experience_years: int = 3
    languages: List[str] = ["English", "Malayalam"]
    base_city: str
    operating_cities: List[str]
    starting_price: float = 1500.0
    portfolio_images: List[str] = []

class StylistReviewCreate(BaseModel):
    rating: float = Field(..., ge=1.0, le=5.0)
    review_text: str
    booking_id: Optional[str] = None

# ----------------- BOOKINGS & PAYMENTS -----------------
class BookingCreate(BaseModel):
    stylist_id: str
    service_id: str
    booking_date: str # YYYY-MM-DD
    booking_time: str # HH:MM
    service_mode: str = "virtual_consultation"
    notes: Optional[str] = None
    location_address: Optional[str] = None
    city: Optional[str] = None
    reference_images: Optional[List[str]] = []

class BookingStatusUpdate(BaseModel):
    status: str # accepted, confirmed, completed, cancelled, rejected, disputed
    reason: Optional[str] = None

class PaymentOrderCreate(BaseModel):
    booking_id: str
    amount: float

class PaymentVerifyRequest(BaseModel):
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: Optional[str] = "valid_signature_mock"

class PayoutRequestCreate(BaseModel):
    amount: float
    payout_method: str = "upi"
    account_details: str

# ----------------- COMMERCE & BRANDS -----------------
class BrandCreate(BaseModel):
    brand_name: str
    category: str = "Clothing Brand"
    tagline: Optional[str] = None
    description: str
    logo_url: str
    banner_url: Optional[str] = None
    city: str
    address: Optional[str] = None
    store_hours: Optional[str] = "10:00 AM - 9:00 PM"
    website_url: Optional[str] = None
    instagram_handle: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str = "Menswear"
    price: float
    discount_price: Optional[float] = None
    currency: str = "INR"
    images: List[str]
    available_sizes: List[str] = ["S", "M", "L", "XL"]
    available_colors: List[str] = ["Black", "White", "Navy"]
    shopping_url: str
    store_city: Optional[str] = None

# ----------------- CREATOR CAMPAIGNS -----------------
class CampaignCreate(BaseModel):
    title: str
    description: str
    category: str = "Seasonal Lookbook"
    required_creator_type: str = "Fashion Influencer"
    target_city: str = "All India"
    budget_inr: float
    deliverables: List[str]
    application_deadline: str

class CampaignApplyRequest(BaseModel):
    proposal: str
    quoted_price: float
    deliverables_plan: str

class CampaignApplicationStatus(BaseModel):
    status: str # accepted, rejected, completed

# ----------------- MESSAGING -----------------
class SendMessageRequest(BaseModel):
    recipient_id: str
    content: str
    media_url: Optional[str] = None

# ----------------- ADMIN -----------------
class AdminVerificationAction(BaseModel):
    status: str # verified, rejected, pending
    notes: Optional[str] = None

class DisputeResolveAction(BaseModel):
    resolution: str # refund_customer, payout_stylist, split
    reason: str
