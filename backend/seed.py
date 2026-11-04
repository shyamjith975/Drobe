import os
import sys

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserProfile
from app.models.marketplace import ProfessionalProfile, ProfessionalService, AvailabilityRule, StylistReview
from app.models.social import Post, PostMedia, ProductTag, Like, Comment
from app.models.commerce import BrandProfile, Product
from app.models.campaign import CreatorCampaign, CampaignApplication
from app.models.content import StyleGuide, Notification
from app.models.booking import Booking, BookingStatusHistory
from app.models.payment import ProfessionalWallet, WalletLedger
from app.models.style_profile import CustomerStyleProfile
from app.models.workspace import StylingWorkspace
from app.models.wardrobe import WardrobeItem, WardrobeOutfit, WardrobeGap
from app.models.celebrity_look import CelebrityLook
from app.models.occasion import OccasionProject
from app.models.studio import PartnerStudio

def seed_database():
    print("🌱 Dropping and creating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    default_password = hash_password("Drobe@2026")

    print("👤 Seeding core platform users...")
    # 1. Admin
    admin_user = User(
        email="admin@drobe.style",
        password_hash=default_password,
        role="admin",
        status="active",
        email_verified=True
    )
    db.add(admin_user)
    db.flush()
    db.add(UserProfile(
        user_id=admin_user.id,
        username="drobe_admin",
        display_name="Vikramaditya Menon",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        bio="DROBE Lead Editorial & Operations Director.",
        city="Kochi",
        is_verified=True
    ))

    # 2. Customer
    customer_user = User(
        email="customer@drobe.style",
        password_hash=default_password,
        role="enthusiast",
        status="active",
        email_verified=True
    )
    db.add(customer_user)
    db.flush()
    db.add(UserProfile(
        user_id=customer_user.id,
        username="priya_nair",
        display_name="Priya Nair",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio="Fashion enthusiast, minimalist aesthetics & vintage architecture.",
        city="Kochi",
        fashion_interests=["Old Money", "Minimalist", "Wedding & Occasion"]
    ))

    # 3. Stylist (Rohan Varma)
    stylist_user1 = User(
        email="stylist@drobe.style",
        password_hash=default_password,
        role="stylist",
        status="active",
        email_verified=True
    )
    db.add(stylist_user1)
    db.flush()
    db.add(UserProfile(
        user_id=stylist_user1.id,
        username="rohan_varma_style",
        display_name="Rohan Varma",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        bio="Celebrity & Wedding Menswear Stylist. Trained in London & Milan. Specializing in bespoke tailoring & Old Money aesthetics.",
        city="Kozhikode",
        is_verified=True
    ))

    # 4. Stylist (Maya Nambiar)
    stylist_user2 = User(
        email="maya@drobe.style",
        password_hash=default_password,
        role="stylist",
        status="active",
        email_verified=True
    )
    db.add(stylist_user2)
    db.flush()
    db.add(UserProfile(
        user_id=stylist_user2.id,
        username="maya_nambiar_couture",
        display_name="Maya Nambiar",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        bio="Bridal & Occasion Stylist. Modernising traditional South Indian handlooms with contemporary silhouettes.",
        city="Kochi",
        is_verified=True
    ))

    # 5. Creator (Ananya Roy)
    creator_user = User(
        email="creator@drobe.style",
        password_hash=default_password,
        role="creator",
        status="active",
        email_verified=True
    )
    db.add(creator_user)
    db.flush()
    db.add(UserProfile(
        user_id=creator_user.id,
        username="ananya_creates",
        display_name="Ananya Roy",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        bio="Fashion creator exploring quiet luxury, sustainable textiles and coastal looks.",
        city="Mumbai",
        is_verified=True
    ))

    # 6. Brand (Maison Ivory)
    brand_user = User(
        email="brand@drobe.style",
        password_hash=default_password,
        role="brand",
        status="active",
        email_verified=True
    )
    db.add(brand_user)
    db.flush()
    db.add(UserProfile(
        user_id=brand_user.id,
        username="maison_ivory",
        display_name="Maison Ivory",
        avatar_url="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80",
        bio="Minimalist sartorial label inspired by earthy textures and understated luxury.",
        city="Bengaluru",
        is_verified=True
    ))

    db.commit()

    print("👔 Seeding Professional Stylists & Services...")
    # Stylist 1: Rohan Varma
    stylist1 = ProfessionalProfile(
        user_id=stylist_user1.id,
        category="Personal & Wedding Stylist",
        specializations=["Groom Styling", "Old Money Wardrobe", "Capsule Wardrobes", "Editorial Consultation"],
        bio="10+ years styling for high-profile weddings, runway shows and executive clients. Known for sharp silhouettes, Italian linen cuts, and curated palettes.",
        experience_years=10,
        languages=["English", "Malayalam", "Hindi"],
        base_city="Kozhikode",
        operating_cities=["Kozhikode", "Kochi", "Bengaluru", "Mumbai", "Thrissur"],
        starting_price=2500.0,
        currency="INR",
        rating=4.9,
        reviews_count=38,
        instant_booking_enabled=True,
        verification_status="verified",
        is_identity_verified=True,
        is_qualification_verified=True,
        is_skill_assessed=True,
        verification_level="DROBE Master Stylist · Elite Certified",
        degrees_and_certifications=["Istituto Marangoni Milan (Fashion Styling)", "Savile Row Academy Tailoring"],
        service_radius_km=35,
        portfolio_images=[
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
        ]
    )
    db.add(stylist1)
    db.flush()

    # Stylist 1 Multi-Format Services
    s1_service1 = ProfessionalService(
        stylist_id=stylist1.id,
        title="Complete Virtual Wardrobe Audit & Capsule Plan",
        description="A 75-minute in-depth digital audit of your existing closet. We categorize what to keep, tailor, and invest in, delivering a personalized 15-look digital lookbook.",
        category="Wardrobe Services",
        service_mode="virtual_consultation",
        format_type="virtual_consultation",
        duration_minutes=75,
        price=3500.0,
        advance_percentage=50.0,
        deliverables=["Wardrobe Audit Matrix", "15-Look Digital Lookbook", "Curated Boutique Shortlist"],
        instant_booking_available=True
    )
    s1_service2 = ProfessionalService(
        stylist_id=stylist1.id,
        title="In-Person Boutique Shopping Escort",
        description="Personal in-store shopping session in high-end boutiques. Stylist reserves fitting rooms in advance and curates head-to-toe outfits suited to your body proportions.",
        category="Personal Styling",
        service_mode="physical_shopping",
        format_type="physical_shopping",
        duration_minutes=240,
        price=15000.0,
        advance_percentage=40.0,
        travel_fee=1500.0,
        deliverables=["Pre-session Store Sourcing", "VIP Fitting Room Reservations", "Alterations Direction", "Full Look Completion"],
        instant_booking_available=True
    )
    s1_service3 = ProfessionalService(
        stylist_id=stylist1.id,
        title="15-Min Quick Emergency Styling SOS Call",
        description="Instant video/audio consultation for immediate styling emergencies: gala attire decisions, tie/lapel pairing, last-minute color harmony.",
        category="Emergency Styling",
        service_mode="virtual_consultation",
        format_type="emergency_call",
        duration_minutes=15,
        price=850.0,
        advance_percentage=100.0,
        deliverables=["Immediate Outfit Verdict", "Accessory & Footwear Pairing", "Color Harmony Fix"],
        instant_booking_available=True
    )
    s1_service4 = ProfessionalService(
        stylist_id=stylist1.id,
        title="Full Wedding & Occasion Wardrobe Curation",
        description="Comprehensive wedding styling for the groom and wedding party across Haldi, Mehendi, Sangeet, and Reception. Includes fabrics, cuts, jewelry, and footwear coordination.",
        category="Wedding & Occasion",
        service_mode="physical_shopping",
        format_type="wedding_assignment",
        duration_minutes=180,
        price=12000.0,
        advance_percentage=40.0,
        travel_fee=1500.0,
        deliverables=["4-Ceremony Moodboards", "Custom Embroidery Sketches", "Groom Jewelry Curation", "On-Site Draping Assistant"],
        instant_booking_available=False
    )
    db.add_all([s1_service1, s1_service2, s1_service3, s1_service4])

    # Stylist 1 Wallet
    wallet1 = ProfessionalWallet(
        stylist_id=stylist1.id,
        available_balance=16400.0,
        pending_balance=3500.0,
        total_earned=24000.0
    )
    db.add(wallet1)
    db.flush()
    db.add(WalletLedger(
        wallet_id=wallet1.id,
        entry_type="credit",
        amount=16400.0,
        currency="INR",
        description="Payout from completed luxury groom styling package",
        balance_after=16400.0
    ))

    # Stylist 2: Maya Nambiar
    stylist2 = ProfessionalProfile(
        user_id=stylist_user2.id,
        category="Bridal & Occasion Stylist",
        specializations=["Kerala Kasavu Modernization", "Bridal Trousseau", "Jewelry Coordination", "Destination Weddings"],
        bio="Bridal consultant who has styled over 200+ South Indian weddings. Seamlessly blends heritage weaving techniques with modern minimalist aesthetics.",
        experience_years=8,
        languages=["English", "Malayalam", "Tamil"],
        base_city="Kochi",
        operating_cities=["Kochi", "Kozhikode", "Bengaluru", "Chennai", "Trivandrum"],
        starting_price=3000.0,
        currency="INR",
        rating=5.0,
        reviews_count=52,
        instant_booking_enabled=True,
        verification_status="verified",
        is_identity_verified=True,
        is_qualification_verified=True,
        is_skill_assessed=True,
        verification_level="DROBE Master Stylist · Elite Certified",
        degrees_and_certifications=["NIFT New Delhi (Textile & Fashion)", "Sotheby's Institute of Art"],
        service_radius_km=40,
        portfolio_images=[
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
        ]
    )
    db.add(stylist2)
    db.flush()

    s2_service1 = ProfessionalService(
        stylist_id=stylist2.id,
        title="Bridal Heritage Trousseau Consultation",
        description="End-to-end bridal styling covering saree draping styles, blouse embroidery direction, antique temple jewelry matching, and ceremony aesthetics.",
        category="Wedding & Occasion",
        service_mode="physical_shopping",
        format_type="wedding_assignment",
        duration_minutes=120,
        price=8500.0,
        advance_percentage=50.0,
        deliverables=["Bridal Palette Swatches", "Artisan Weavers Shortlist", "Temple Jewelry Direct Sourcing", "Ceremony Draping Guide"],
        instant_booking_available=True
    )
    s2_service2 = ProfessionalService(
        stylist_id=stylist2.id,
        title="15-Min Saree & Jewelry Pairing SOS Call",
        description="Need urgent feedback on your saree pleats, jewelry layering, or footwear? Connect in real-time for immediate professional clarity.",
        category="Emergency Styling",
        service_mode="virtual_consultation",
        format_type="emergency_call",
        duration_minutes=15,
        price=950.0,
        advance_percentage=100.0,
        deliverables=["Instant Draping Feedback", "Jewelry Layering Check", "Occasion Protocol Advice"],
        instant_booking_available=True
    )
    db.add_all([s2_service1, s2_service2])

    # Reviews for Stylist 1
    db.add(StylistReview(
        stylist_id=stylist1.id,
        customer_id=customer_user.id,
        rating=5.0,
        review_text="Rohan transformed my wardrobe completely! His eye for fit, subtle colors and linen fabrics is unmatched in Kerala. Truly world-class styling advice."
    ))

    print("🏷️ Seeding Fashion Brands & Catalog Products...")
    brand_profile = BrandProfile(
        user_id=brand_user.id,
        brand_name="Maison Ivory",
        category="Designer Clothing Brand",
        tagline="Quiet Luxury & Artisanal Linen Tailoring",
        description="Crafting relaxed tailoring, pure Italian and Irish linens, and minimalist silhouettes for the modern connoisseur.",
        logo_url="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
        banner_url="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
        city="Bengaluru",
        address="104 Lavelle Road, Richmond Town, Bengaluru",
        store_hours="Mon - Sun: 11:00 AM - 8:30 PM",
        website_url="https://drobe.style/brands/maison-ivory",
        is_verified=True
    )
    db.add(brand_profile)
    db.flush()

    # Brand Products
    prod1 = Product(
        brand_id=brand_profile.id,
        name="The Riviera Camp-Collar Linen Shirt",
        description="Cut from 100% breathable European flax linen. Features mother-of-pearl buttons and a relaxed French placket.",
        category="Shirts",
        price=4800.0,
        discount_price=4200.0,
        currency="INR",
        images=[
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
        ],
        available_sizes=["S", "M", "L", "XL"],
        available_colors=["Warm Ivory", "Sage Green", "Charcoal"],
        shopping_url="https://drobe.style/shop/riviera-camp-shirt",
        store_city="Bengaluru"
    )
    prod2 = Product(
        brand_id=brand_profile.id,
        name="Double-Pleated Tailored Chinos",
        description="Relaxed high-rise fit crafted from organic cotton twill. Perfect pairing for linen shirts and leather Belgian loafers.",
        category="Trousers",
        price=5400.0,
        discount_price=4900.0,
        currency="INR",
        images=[
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
        ],
        available_sizes=["30", "32", "34", "36"],
        available_colors=["Stone Beige", "Muted Olive", "Navy"],
        shopping_url="https://drobe.style/shop/double-pleated-chinos",
        store_city="Bengaluru"
    )
    prod3 = Product(
        brand_id=brand_profile.id,
        name="Belgian Suede Tassel Loafers",
        description="Handcrafted in soft Italian calf suede with flexible leather soles. The definitive quiet luxury footwear statement.",
        category="Footwear",
        price=8900.0,
        currency="INR",
        images=[
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
        ],
        available_sizes=["UK 7", "UK 8", "UK 9", "UK 10"],
        available_colors=["Taupe Suede", "Espresso", "Midnight Blue"],
        shopping_url="https://drobe.style/shop/belgian-suede-loafers",
        store_city="Bengaluru"
    )
    db.add_all([prod1, prod2, prod3])

    print("📸 Seeding Editorial Social Posts & Shop-This-Look Tags...")
    # Post 1: Old Money Riviera Ensemble
    post1 = Post(
        user_id=stylist_user1.id,
        caption="The effortless Riviera formula: Unstructured linen shirt, high-waisted stone trousers, and suede loafers. Understated, breathable, and permanently timeless. 🌿✨",
        description="Shot along the Kozhikode beach promenade during golden hour. Keep the wrist bare except for an understated vintage timepiece.",
        category="Old Money",
        occasion="Brunch & Resort",
        city="Kozhikode",
        tags=["#OldMoney", "#LinenStyle", "#MenswearEditorial", "#DROBEStylist"],
        likes_count=142,
        comments_count=18,
        saves_count=89
    )
    db.add(post1)
    db.flush()
    db.add(PostMedia(
        post_id=post1.id,
        media_url="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
        media_type="image",
        order_index=0
    ))
    # Interactive Product Tags for "Shop This Look"
    db.add(ProductTag(
        post_id=post1.id,
        product_id=prod1.id,
        title="Riviera Camp-Collar Shirt",
        brand_name="Maison Ivory",
        price=4200.0,
        currency="INR",
        shopping_url="https://drobe.style/shop/riviera-camp-shirt",
        pin_x=45.0,
        pin_y=35.0
    ))
    db.add(ProductTag(
        post_id=post1.id,
        product_id=prod2.id,
        title="Double-Pleated Chinos",
        brand_name="Maison Ivory",
        price=4900.0,
        currency="INR",
        shopping_url="https://drobe.style/shop/double-pleated-chinos",
        pin_x=50.0,
        pin_y=68.0
    ))
    db.add(ProductTag(
        post_id=post1.id,
        product_id=prod3.id,
        title="Belgian Suede Loafers",
        brand_name="Maison Ivory",
        price=8900.0,
        currency="INR",
        shopping_url="https://drobe.style/shop/belgian-suede-loafers",
        pin_x=52.0,
        pin_y=92.0
    ))

    # Post 2: Modern Kasavu Fusion
    post2 = Post(
        user_id=stylist_user2.id,
        caption="Kerala Kasavu reimagined for the modern Indian wedding. Handwoven ivory cotton paired with a minimalist silk crop jacket. 🤍✨",
        description="Styled for a sunset backwaters wedding in Kumarakom. Real human craftsmanship speaks louder than heavy embroidery.",
        category="Wedding & Occasion",
        occasion="Wedding Guest / Haldi",
        city="Kochi",
        tags=["#KasavuModern", "#KeralaFashion", "#BridalStyling", "#SareeInspiration"],
        likes_count=215,
        comments_count=26,
        saves_count=134
    )
    db.add(post2)
    db.flush()
    db.add(PostMedia(
        post_id=post2.id,
        media_url="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
        media_type="image",
        order_index=0
    ))

    # Post 3: Minimalist Streetwear by Ananya
    post3 = Post(
        user_id=creator_user.id,
        caption="Boxy heavy-cotton silhouette, tailored charcoal trousers, and chunky oxfords. When in doubt, let the cut do the talking. 🖤",
        description="Street shoot in Bandra. Clean lines, monochromatic palette.",
        category="Streetwear",
        occasion="Daily Editorial",
        city="Mumbai",
        tags=["#StreetwearEditorial", "#MinimalistStyle", "#DROBECreator", "#Monochrome"],
        likes_count=98,
        comments_count=12,
        saves_count=45
    )
    db.add(post3)
    db.flush()
    db.add(PostMedia(
        post_id=post3.id,
        media_url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
        media_type="image",
        order_index=0
    ))

    # Comments & Likes
    db.add(Like(post_id=post1.id, user_id=customer_user.id))
    db.add(Like(post_id=post2.id, user_id=customer_user.id))
    db.add(Comment(
        post_id=post1.id,
        user_id=customer_user.id,
        content="That linen drape is perfection! Booking a consultation with you for my brother's reception."
    ))

    print("📖 Seeding Fashion Style Guides & Outfit Education...")
    guide1 = StyleGuide(
        title="The Old Money Wardrobe: The Art of Quiet Elegance",
        category="Old Money",
        description="The Old Money aesthetic is rooted in timeless tailoring, natural breathable fabrics like linen and cashmere, muted earthy tones, and zero visible branding.",
        hero_image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
        gallery_images=[
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
        ],
        color_palette=["#191919", "#F7F5F0", "#B8B1A5", "#8A8176", "#2D5A46"],
        clothing_combinations=[
            "Linen Camp-Collar Shirt + Double-Pleated Chinos + Suede Tassel Loafers",
            "Cashmere Polo Sweater + Tailored Off-White Trousers + Minimalist Watch",
            "Unstructured Linen Blazer + Crisp Cotton Poplin Shirt + Belgian Loafers"
        ],
        stylist_tips=[
            "Always prioritize fabric texture over logos. Look for 100% linen, organic cotton twill, and pure silk.",
            "Avoid ultra-tight fits; Old Money tailoring relies on comfortable, flowing drapes with clean breaks at the hem.",
            "Footwear must be meticulously kept: suede brushing and cedar shoe trees are essential."
        ],
        occasion="Cocktail, Resort, Fine Dining, Casual Business",
        author_name="Rohan Varma",
        author_title="Senior Editorial Stylist",
        is_featured=True
    )

    guide2 = StyleGuide(
        title="Modern Kerala Wedding: The Kasavu Transformation",
        category="Wedding & Occasion",
        description="Reinterpreting Kerala's traditional golden Kasavu handlooms with contemporary cuts, corset blouses, tailored nehru jackets, and minimalist antique gold.",
        hero_image="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
        gallery_images=[
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
        ],
        color_palette=["#F7F5F0", "#D4AF37", "#191919", "#B85D43"],
        clothing_combinations=[
            "Ivory Kasavu Saree + Structured Silk Cape + Matte Gold Temple Choker",
            "Handloom Mundu + Raw Silk Kurta + Handcrafted Kolhapuris in Tan"
        ],
        stylist_tips=[
            "Balance the gold zari border with matte fabrics elsewhere to keep the look editorial and modern.",
            "Incorporate fresh jasmine flowers in modern sculptural hair updos."
        ],
        occasion="Kerala Weddings, Engagements, Onam Celebrations, Temple Ceremonies",
        author_name="Maya Nambiar",
        author_title="Bridal & Occasion Director",
        is_featured=True
    )

    guide3 = StyleGuide(
        title="Smart Casual Mastery: Linen Shirt + Chinos + Loafers",
        category="Casual Luxury",
        description="The ultimate versatile uniform that transitions effortlessly from client meetings in Kochi to dinner in Bengaluru.",
        hero_image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
        gallery_images=[
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
        ],
        color_palette=["#F7F5F0", "#B8B1A5", "#191919"],
        clothing_combinations=[
            "Sage Green Linen Shirt + Stone Chinos + Dark Brown Woven Belt",
            "Ivory Linen Button-down + Charcoal Pleated Trousers + Suede Drivers"
        ],
        stylist_tips=[
            "Roll sleeves twice just below the elbow for an intentional, relaxed silhouette.",
            "Ensure the shirt hem finishes mid-fly so it looks equally sharp tucked or untucked."
        ],
        occasion="Work, Weekend Brunch, Travel",
        author_name="DROBE Editorial Board",
        author_title="Style Curators",
        is_featured=True
    )
    db.add_all([guide1, guide2, guide3])

    print("💼 Seeding Brand Collaboration Campaigns for Creators...")
    campaign1 = CreatorCampaign(
        brand_id=brand_profile.id,
        title="Maison Ivory Resort '26 Creator Campaign",
        description="We are seeking 3 fashion creators to style our Riviera linen collection in an organic coastal or heritage architectural setting.",
        category="Resort & Casual Luxury",
        required_creator_type="Fashion Creator / Visual Storyteller",
        target_city="All India (Preference for Kerala, Goa, Mumbai)",
        budget_inr=45000.0,
        deliverables=[
            "1x High-Production 4K Reel showcasing 3 distinct outfit combinations",
            "2x Editorial Carousel Posts with detailed styling caption",
            "Permission for brand social promotion"
        ],
        application_deadline="2026-11-20",
        status="open",
        applications_count=1
    )
    db.add(campaign1)
    db.flush()

    # Application by Ananya
    db.add(CampaignApplication(
        campaign_id=campaign1.id,
        creator_id=creator_user.id,
        proposal="I'd love to capture the Maison Ivory linen pieces against the Portuguese heritage villas in Goa and Fort Kochi. My audience deeply resonates with quiet luxury aesthetics and textile quality.",
        quoted_price=42000.0,
        deliverables_plan="Reel 1: 'How to Style Linen from Sunrise to Sunset'. Carousels: Macro fabric textures, accessories breakdown, and fit overview.",
        status="pending"
    ))

    print("📅 Seeding Test Booking & Transaction...")
    booking1 = Booking(
        customer_id=customer_user.id,
        stylist_id=stylist1.id,
        service_id=s1_service1.id,
        booking_date="2026-11-12",
        booking_time="14:00",
        service_mode="virtual_consultation",
        status="confirmed",
        notes="Wardrobe refresh for an upcoming destination wedding in Udaipur.",
        total_amount=3500.0,
        advance_amount=1750.0,
        paid_amount=1750.0,
        currency="INR",
        platform_commission=700.0, # 20%
        stylist_payout=2800.0,     # 80%
        razorpay_order_id="order_drobe_seed_001",
        razorpay_payment_id="pay_drobe_seed_001"
    )
    db.add(booking1)
    db.flush()
    db.add(BookingStatusHistory(
        booking_id=booking1.id,
        from_status="accepted",
        to_status="confirmed",
        changed_by_user_id=customer_user.id,
        reason="Advance payment of ₹1,750 confirmed via Razorpay"
    ))

    print("🔔 Seeding In-App Notifications...")
    db.add(Notification(
        user_id=customer_user.id,
        title="Booking Confirmed with Rohan Varma",
        message="Your Virtual Wardrobe Audit is scheduled for Nov 12, 2026 at 2:00 PM. Access details sent.",
        type="booking",
        reference_id=booking1.id
    ))
    db.add(Notification(
        user_id=stylist_user1.id,
        title="New Confirmed Booking #"+booking1.id[:8],
        message="Priya Nair paid advance of ₹1,750 for Virtual Wardrobe Audit.",
        type="booking",
        reference_id=booking1.id
    ))

    print("🎨 Seeding Customer Style Profile (Section 1.A)...")
    customer_style_profile = CustomerStyleProfile(
        user_id=customer_user.id,
        selfie_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        style_personalities=["Classic Minimalist", "Old Money Heritage", "Understated Chic"],
        face_shape="Oval",
        body_structure="Hourglass",
        height_cm=168,
        sizes={"top": "M", "bottom": "30", "dress": "UK 10", "shoes": "UK 6"},
        fit_preferences=["Tailored", "Relaxed Drape", "High-Rise"],
        lifestyle_activities=["Corporate Executive", "Weekend Gallery Openings", "Festive Celebrations"],
        occasion_needs=["Destination Wedding Guest (Udaipur)", "Autumn Capsule Wardrobe"],
        budget_tier="Mid-Luxury",
        budget_ranges={
            "tops": "₹3,500 - ₹8,000",
            "dresses": "₹8,000 - ₹25,000",
            "occasion_wear": "₹20,000 - ₹65,000",
            "accessories": "₹4,000 - ₹15,000"
        },
        skin_undertone="Warm",
        favorite_colors=["#191919", "#F7F5F0", "#1B4D3E", "#D4AF37", "#9E7B66"],
        colors_to_avoid=["Neon Green", "Mustard Yellow", "Electric Blue"],
        fabrics_preferred=["Mulberry Silk", "Mongolian Cashmere", "Belgian Linen", "Virgin Wool"],
        fabrics_avoided=["Polyester", "Acrylic", "Nylon Blends"],
        share_with_stylists=True,
        notes_for_stylist="Prefer breathable natural textiles. Love sharp shoulder silhouettes and high-waisted pleated trousers. No loud neon accents."
    )
    db.add(customer_style_profile)

    print("💼 Seeding Booking-Linked Styling Workspace (Section 1.D)...")
    workspace1 = StylingWorkspace(
        booking_id=booking1.id,
        customer_requirements="Curate a timeless Old Money capsule for 4-day wedding celebrations in Udaipur. Need cocktail, mehendi, and reception looks that coordinate with heritage architectural backdrops.",
        reference_images=[
            {"url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80", "caption": "Silk velvet silhouette reference"},
            {"url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80", "caption": "Antique zardozi embroidery detailing"}
        ],
        stylist_prep_notes="Recommend rich jewel tones (deep emerald #1B4D3E and antique gold #D4AF37). Source cape from Maison Heritage Kochi.",
        moodboards=[
            {
                "title": "Udaipur Heritage Palace Palette",
                "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
                "palette": ["#1B4D3E", "#D4AF37", "#191919", "#F7F5F0"],
                "notes": "Hand-embroidered zardozi velvet cape over crushed tissue silk lehenga."
            },
            {
                "title": "Minimalist Lake Pavilion Cocktail",
                "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
                "palette": ["#0B1B3D", "#191919", "#E5DCC5"],
                "notes": "Double-breasted navy tuxedo tailoring with satin lapels."
            }
        ],
        product_recommendations=[
            {
                "title": "Emerald Cut-Out Mulberry Silk Gown",
                "brand": "Maison Drobe Atelier",
                "price": "₹18,500",
                "url": "/brands/1",
                "image_url": "/images/emerald_silk_gown.jpg",
                "notes": "Stunning bias drape, ideal for the evening reception gala."
            },
            {
                "title": "Oatmeal Double-Breasted Linen Blazer",
                "brand": "Maison Artisans",
                "price": "₹14,500",
                "url": "/brands/1",
                "image_url": "/images/linen_safari_suit.jpg",
                "notes": "Perfect for daytime palace brunch and casual pre-wedding arrivals."
            }
        ],
        session_notes="Client confirmed preference for emerald tones. Fitting scheduled for Friday morning.",
        final_report={
            "summary": "Completed personalized 3-look capsule with minimal jewelry styling.",
            "palette": ["#1B4D3E", "#D4AF37", "#F7F5F0"],
            "dos_donts": [
                "Do: Stick with structured high-waisted cuts",
                "Don't: Mix contrasting bright neons with heritage gold"
            ],
            "delivered_at": "2026-11-12T16:00:00Z"
        },
        follow_up_recommendations="Add a pair of handcrafted Belgian suede slippers to complete the evening ensemble.",
        status="active"
    )
    db.add(workspace1)

    print("👗 Seeding Digital Wardrobe & Memory (Section 1.E)...")
    w_item1 = WardrobeItem(
        user_id=customer_user.id,
        name="Oatmeal Double-Breasted Linen Blazer",
        category="Outerwear",
        color="Oatmeal",
        color_hex="#E5DCC5",
        material="100% Belgian Flax Linen",
        brand="Maison Drobe",
        image_url="/images/linen_safari_suit.jpg",
        purchase_price=14500.0,
        purchase_date="2026-04-15",
        tags=["Smart Casual", "Brunch", "Resort"],
        is_favorite=True,
        shared_with_stylist=True
    )
    w_item2 = WardrobeItem(
        user_id=customer_user.id,
        name="Charcoal Cashmere Mockneck Knit",
        category="Tops",
        color="Midnight Charcoal",
        color_hex="#191919",
        material="Grade-A Mongolian Cashmere",
        brand="Maison Drobe",
        image_url="/images/cashmere_mockneck.jpg",
        purchase_price=11200.0,
        purchase_date="2026-09-10",
        tags=["Executive", "Autumn/Winter", "Travel"],
        is_favorite=True,
        shared_with_stylist=True
    )
    w_item3 = WardrobeItem(
        user_id=customer_user.id,
        name="Tailored Wide-Leg Pleated Trousers",
        category="Bottoms",
        color="Ivory Cream",
        color_hex="#F7F5F0",
        material="Virgin Tropical Wool",
        brand="Atelier Drobe",
        image_url="/images/poplin_skirt_set.jpg",
        purchase_price=8900.0,
        purchase_date="2026-06-20",
        tags=["Office", "Formal", "Capsule"],
        is_favorite=False,
        shared_with_stylist=True
    )
    w_item4 = WardrobeItem(
        user_id=customer_user.id,
        name="Emerald Cut-Out Bias Silk Gown",
        category="Dresses",
        color="Deep Emerald",
        color_hex="#1B4D3E",
        material="Heavy Mulberry Silk Charmeuse",
        brand="Maison Drobe Atelier",
        image_url="/images/emerald_silk_gown.jpg",
        purchase_price=18500.0,
        purchase_date="2026-10-02",
        tags=["Gala", "Wedding", "Black Tie"],
        is_favorite=True,
        shared_with_stylist=True
    )
    db.add_all([w_item1, w_item2, w_item3, w_item4])
    db.flush()

    outfit1 = WardrobeOutfit(
        user_id=customer_user.id,
        name="Old Money Summer Executive",
        occasion="Business Casual",
        item_ids=[w_item1.id, w_item3.id],
        image_url="/images/linen_safari_suit.jpg",
        notes="Pair with Belgian calf suede loafers and a minimal silver signet ring."
    )
    outfit2 = WardrobeOutfit(
        user_id=customer_user.id,
        name="Winter Monochrome Minimalist",
        occasion="Evening Dinner",
        item_ids=[w_item2.id, w_item3.id],
        image_url="/images/cashmere_mockneck.jpg",
        notes="Drape an oversized wool overcoat and unstructured leather tote."
    )
    db.add_all([outfit1, outfit2])

    gap1 = WardrobeGap(
        user_id=customer_user.id,
        title="Double-Faced Camel Hair Overcoat",
        category="Outerwear",
        priority="High",
        notes="Crucial missing staple to bridge winter business attire and formal eveningwear.",
        recommended_by_stylist=True,
        stylist_name="Rohan Varma"
    )
    gap2 = WardrobeGap(
        user_id=customer_user.id,
        title="Structured Top-Handle Box Bag in Espresso Box Calf",
        category="Accessories",
        priority="Medium",
        notes="Everyday structured luxury bag to elevate casual denim and knit combinations.",
        recommended_by_stylist=False,
        stylist_name=None
    )
    db.add_all([gap1, gap2])

    print("✨ Seeding Celebrity Looks & Recreate Breakdown (Section 1.F)...")
    celeb_look1 = CelebrityLook(
        title="Royal Udaipur Palace Reception Silhouette",
        celebrity_name="Deepika Padukone Inspired",
        event_name="Royal Udaipur Palace Wedding Gala",
        image_url="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        description="Deep emerald velvet cape gown with handcrafted antique gold zardozi borders and fluid tissue silk lehenga drape.",
        original_designer="Sabyasachi Mukherjee Couture",
        original_price_est="₹4,80,000",
        silhouette_type="Regal Draped Cape & Floor-Length Bias Column",
        key_fabrics="Silk Velvet, Zardozi Hand-Work, Mulberry Tissue",
        color_palette=["#1B4D3E", "#D4AF37", "#191919"],
        breakdown_items=[
            {
                "piece_name": "Zardozi Hand-Embroidered Velvet Cape",
                "luxury_original_cost": "₹2,10,000",
                "drobe_alternative_title": "Emerald Silk Velvet Cape",
                "boutique_name": "Maison Heritage Kochi",
                "price": "₹26,500",
                "image_url": "/images/emerald_silk_gown.jpg"
            },
            {
                "piece_name": "Bias-Cut Pure Charmeuse Inner Slip",
                "luxury_original_cost": "₹1,20,000",
                "drobe_alternative_title": "Mulberry Silk Slip Gown",
                "boutique_name": "Atelier Fort Kochi",
                "price": "₹14,200",
                "image_url": "/images/poplin_skirt_set.jpg"
            },
            {
                "piece_name": "Antique Polki Kundan Choker Pair",
                "luxury_original_cost": "₹1,50,000",
                "drobe_alternative_title": "Handcrafted Heritage Polki Choker",
                "boutique_name": "Malabar Heritage Vault",
                "price": "₹12,800",
                "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
            }
        ],
        budget_recreation_cost="₹53,500",
        savings_percentage=88,
        stylist_notes="The key to recreating this regal look without couture markup is investing in heavyweight velvet drape and keeping jewelry focused on a single statement antique choker.",
        reviewed_by_stylist_name="Maya Nambiar",
        is_expert_reviewed=True
    )
    celeb_look2 = CelebrityLook(
        title="Old Money Venetian Black-Tie Tuxedo",
        celebrity_name="Jacob Elordi Inspired",
        event_name="Venice Film Festival Premiere & Gala",
        image_url="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        description="Unstructured midnight navy double-breasted tuxedo with satin peak lapels and fluid high-rise trousers.",
        original_designer="Bottega Veneta Sartorial",
        original_price_est="₹3,90,000",
        silhouette_type="Relaxed Double-Breasted Tailoring",
        key_fabrics="Super 150s Merino Wool, Silk Satin Lapels",
        color_palette=["#0B1B3D", "#191919", "#F7F5F0"],
        breakdown_items=[
            {
                "piece_name": "Midnight Navy Double-Breasted Tuxedo",
                "luxury_original_cost": "₹2,80,000",
                "drobe_alternative_title": "Bespoke Navy Wool Tuxedo",
                "boutique_name": "Rohan Varma Sartorial",
                "price": "₹32,000",
                "image_url": "/images/linen_safari_suit.jpg"
            },
            {
                "piece_name": "Patent Leather Belgian Opera Pumps",
                "luxury_original_cost": "₹1,10,000",
                "drobe_alternative_title": "Handcrafted Black Suede Slippers",
                "boutique_name": "Maison Artisans",
                "price": "₹9,500",
                "image_url": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
            }
        ],
        budget_recreation_cost="₹41,500",
        savings_percentage=89,
        stylist_notes="Focus on the waist suppression and high-rise trouser drape. Keep shirt collar points sharp and skip the cummerbund for modern elegance.",
        reviewed_by_stylist_name="Rohan Varma",
        is_expert_reviewed=True
    )
    db.add_all([celeb_look1, celeb_look2])

    print("🏛️ Seeding Multi-Professional Occasion Project (Section 2)...")
    occasion1 = OccasionProject(
        customer_id=customer_user.id,
        title="Royal Udaipur Palace Wedding & Reception",
        occasion_type="Wedding",
        event_date="2026-12-18",
        city="Udaipur",
        total_budget=120000.0,
        booked_services=[
            {"role": "Personal Stylist", "professional_name": "Rohan Varma", "service": "Full Wedding Wardrobe Curation", "status": "confirmed", "fee": 12000},
            {"role": "Bridal Stylist", "professional_name": "Maya Nambiar", "service": "Kasavu & Trousseau Styling", "status": "confirmed", "fee": 18000},
            {"role": "Makeup Artist", "professional_name": "Zara Khan Studio", "service": "Bridal HD Glam & Hair", "status": "confirmed", "fee": 28000},
            {"role": "Editorial Photographer", "professional_name": "Lumière Atelier", "service": "Palace Portraiture", "status": "confirmed", "fee": 38000},
            {"role": "Boutique Attire", "boutique_name": "Maison Heritage Kochi", "service": "Emerald Velvet Gown", "status": "purchased", "fee": 24000}
        ],
        notes="4-day destination wedding at Taj Lake Palace, Udaipur. Multi-professional coordinated schedule.",
        status="active"
    )
    db.add(occasion1)

    print("🏛️ Seeding Partner Styling Studios & Experience Centres (Section 1.H)...")
    studio1 = PartnerStudio(
        id="studio-kochi",
        name="DROBE Atelier & Experience Centre · Kochi",
        city="Kochi",
        address="Atelier 4, Panampilly Nagar Waterfront Avenue, Kochi, Kerala 682036",
        image_url="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
        rating=4.96,
        reviews_count=58,
        contact_phone="+91 484 231 9900",
        operating_hours="10:00 AM - 8:00 PM (Tue - Sun)"
    )
    studio2 = PartnerStudio(
        id="studio-blr",
        name="DROBE Sartorial Lounge · Bengaluru",
        city="Bengaluru",
        address="12th Main Road, Indiranagar, Bengaluru, Karnataka 560038",
        image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        rating=4.94,
        reviews_count=72,
        contact_phone="+91 80 4120 7700",
        operating_hours="10:30 AM - 8:30 PM (Tue - Sun)"
    )
    studio3 = PartnerStudio(
        id="studio-calicut",
        name="DROBE Heritage Styling Studio · Kozhikode",
        city="Kozhikode",
        address="Beach Road Boulevard, Kozhikode, Kerala 673032",
        image_url="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
        rating=4.97,
        reviews_count=39,
        contact_phone="+91 495 276 4411",
        operating_hours="11:00 AM - 8:00 PM (Daily)"
    )
    db.add_all([studio1, studio2, studio3])

    db.commit()
    db.close()
    print("✅ DROBE database seeded successfully with rich editorial data and Styleio benchmark features!")

if __name__ == "__main__":
    seed_database()
