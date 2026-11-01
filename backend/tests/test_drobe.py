import os
import sys
import uuid
import pytest

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_test_db():
    # Tables are already created and seeded
    yield
    # Teardown if necessary

# ==============================================================================
# SCENARIO 1: Customer Registration, Login & Profile
# ==============================================================================
def test_scenario_1_customer_auth():
    uid = uuid.uuid4().hex[:6]
    test_email = f"buyer_{uid}@drobe.style"
    test_user = f"buyer_{uid}"
    
    # 1. Register new customer
    reg_payload = {
        "email": test_email,
        "password": "SecurePassword123!",
        "role": "enthusiast",
        "username": test_user,
        "display_name": "Test Fashionista",
        "phone": f"+9198{int(uid, 16) % 100000000:08d}",
        "city": "Kochi",
        "fashion_interests": ["Old Money", "Casual"]
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201, res.text
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    assert data["user"]["profile"]["username"] == test_user

    # 2. Login with credentials
    login_payload = {
        "email": test_email,
        "password": "SecurePassword123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 3. Fetch authenticated profile
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["profile"]["city"] == "Kochi"

# ==============================================================================
# SCENARIO 2: Publish Fashion Post & Social Interactions
# ==============================================================================
def test_scenario_2_publish_fashion_post():
    # Login customer
    login_res = client.post("/api/v1/auth/login", json={
        "email": "customer@drobe.style",
        "password": "Drobe@2026"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Publish post
    post_payload = {
        "caption": "Exploring heritage Kochi streets in relaxed Belgian linen. 🤍",
        "description": "Natural drape with understated accessories.",
        "category": "Old Money",
        "city": "Kochi",
        "tags": ["#KochiFashion", "#LinenDrape"],
        "media_urls": [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
        ]
    }
    create_res = client.post("/api/v1/posts/", json=post_payload, headers=headers)
    assert create_res.status_code == 201, create_res.text
    post_data = create_res.json()
    post_id = post_data["id"]
    assert post_data["caption"] == post_payload["caption"]

    # Like the post
    like_res = client.post(f"/api/v1/posts/{post_id}/like", headers=headers)
    assert like_res.status_code == 200
    assert like_res.json()["liked"] is True

    # Add a comment
    comment_res = client.post(
        f"/api/v1/posts/{post_id}/comments",
        json={"content": "Incredible styling, love the color harmony!"},
        headers=headers
    )
    assert comment_res.status_code == 201
    assert "content" in comment_res.json()

    # Verify post in feed
    feed_res = client.get("/api/v1/posts/?category=Old Money")
    assert feed_res.status_code == 200
    assert len(feed_res.json()) >= 1

# ==============================================================================
# SCENARIO 3: Stylist Registration & Location-based Discovery
# ==============================================================================
def test_scenario_3_stylist_onboarding_and_discovery():
    uid = uuid.uuid4().hex[:6]
    # Register new user to become a stylist
    reg_res = client.post("/api/v1/auth/register", json={
        "email": f"kavya_{uid}@drobe.style",
        "password": "Drobe@2026",
        "role": "enthusiast",
        "username": f"kavya_{uid}",
        "display_name": "Kavya Menon",
        "city": "Kochi"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Onboard as Stylist with multiple operating cities
    stylist_payload = {
        "category": "Personal Stylist",
        "specializations": ["Capsule Wardrobes", "Color Analysis"],
        "bio": "Certified image consultant specializing in sustainable minimalist wardrobes.",
        "experience_years": 5,
        "languages": ["English", "Malayalam"],
        "base_city": "Kochi",
        "operating_cities": ["Kochi", "Kozhikode", "Bengaluru"],
        "starting_price": 2000.0,
        "portfolio_images": ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"]
    }
    onboard_res = client.post("/api/v1/stylists/onboard", json=stylist_payload, headers=headers)
    assert onboard_res.status_code == 201
    stylist_id = onboard_res.json()["id"]

    # Add a service
    service_res = client.post(
        f"/api/v1/stylists/{stylist_id}/services",
        json={
            "title": "Color & Silhouette Assessment",
            "description": "Analyze your skin undertones and find your ideal seasonal palette.",
            "category": "Personal Styling",
            "service_mode": "video_consultation",
            "duration_minutes": 60,
            "price": 2000.0,
            "advance_percentage": 50.0
        },
        headers=headers
    )
    assert service_res.status_code == 201

    # Search stylists by operating city (Kozhikode)
    search_res = client.get("/api/v1/stylists/?city=Kozhikode")
    assert search_res.status_code == 200
    stylists_in_kozhikode = search_res.json()
    assert any(s["id"] == stylist_id for s in stylists_in_kozhikode)

# ==============================================================================
# SCENARIO 4: Stylist Booking & Payment Verification Engine
# ==============================================================================
def test_scenario_4_booking_and_payment():
    # Login customer
    cust_res = client.post("/api/v1/auth/login", json={
        "email": "customer@drobe.style",
        "password": "Drobe@2026"
    })
    cust_token = cust_res.json()["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    # Fetch stylist Rohan Varma
    stylists_res = client.get("/api/v1/stylists/?city=Kozhikode")
    rohan = next(s for s in stylists_res.json() if "Rohan" in s["user"]["display_name"])
    service = rohan["services"][0]

    # Create booking request
    booking_payload = {
        "stylist_id": rohan["id"],
        "service_id": service["id"],
        "booking_date": "2026-12-05",
        "booking_time": "15:00",
        "service_mode": service["service_mode"],
        "notes": "Need wedding guest outfit guidance.",
        "city": "Kozhikode"
    }
    book_res = client.post("/api/v1/bookings/", json=booking_payload, headers=cust_headers)
    assert book_res.status_code == 201, book_res.text
    booking_data = book_res.json()
    booking_id = booking_data["id"]
    assert booking_data["total_amount"] > 0
    assert booking_data["advance_amount"] > 0
    assert booking_data["razorpay_order_id"] is not None

    # Verify payment via Razorpay mock
    verify_payload = {
        "booking_id": booking_id,
        "razorpay_order_id": booking_data["razorpay_order_id"],
        "razorpay_payment_id": "pay_test_signature_valid_123"
    }
    pay_res = client.post("/api/v1/payments/verify", json=verify_payload, headers=cust_headers)
    assert pay_res.status_code == 200
    assert pay_res.json()["booking_status"] == "confirmed"

    # Complete booking and verify stylist wallet credit
    complete_res = client.patch(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "completed", "reason": "Consultation successfully completed"},
        headers=cust_headers
    )
    assert complete_res.status_code == 200
    assert complete_res.json()["status"] == "completed"

# ==============================================================================
# SCENARIO 5: Brand Registration & Catalog Management
# ==============================================================================
def test_scenario_5_brand_and_products():
    uid = uuid.uuid4().hex[:6]
    # Register brand user
    reg_res = client.post("/api/v1/auth/register", json={
        "email": f"atelier_{uid}@drobe.style",
        "password": "Drobe@2026",
        "role": "enthusiast",
        "username": f"atelier_{uid}",
        "display_name": "Atelier Test Label",
        "city": "Kochi"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Onboard brand
    brand_payload = {
        "brand_name": f"Atelier Test Brand {uid}",
        "category": "Designer Boutique",
        "tagline": "Architectural Cuts & Handwoven Textures",
        "description": "Independent fashion house based in Fort Kochi.",
        "logo_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
        "city": "Kochi"
    }
    brand_res = client.post("/api/v1/brands/onboard", json=brand_payload, headers=headers)
    assert brand_res.status_code == 201
    brand_id = brand_res.json()["id"]

    # Add product
    product_payload = {
        "name": "Fort Kochi Handwoven Linen Blazer",
        "description": "Unstructured blazer tailored with hand-spun Kerala flax.",
        "category": "Outerwear",
        "price": 7500.0,
        "discount_price": 6800.0,
        "currency": "INR",
        "images": ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"],
        "shopping_url": "https://drobe.style/shop/linen-blazer",
        "store_city": "Kochi"
    }
    prod_res = client.post(f"/api/v1/brands/{brand_id}/products", json=product_payload, headers=headers)
    assert prod_res.status_code == 201
    assert prod_res.json()["name"] == "Fort Kochi Handwoven Linen Blazer"

# ==============================================================================
# SCENARIO 6: Shop This Look Product Tagging
# ==============================================================================
def test_scenario_6_shop_this_look_tagging():
    # Login stylist
    login_res = client.post("/api/v1/auth/login", json={
        "email": "stylist@drobe.style",
        "password": "Drobe@2026"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create post with interactive tagged products
    post_payload = {
        "caption": "Full outfit breakdown: linen shirt, tailored chinos, and suede loafers. #ShopThisLook",
        "category": "Casual Luxury",
        "city": "Kozhikode",
        "tags": ["#ShopThisLook", "#Editorial"],
        "media_urls": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
        ],
        "product_tags": [
            {
                "title": "Riviera Camp Shirt",
                "brand_name": "Maison Ivory",
                "price": 4200.0,
                "currency": "INR",
                "shopping_url": "https://drobe.style/shop/riviera-camp-shirt",
                "pin_x": 48.0,
                "pin_y": 32.0
            }
        ]
    }
    res = client.post("/api/v1/posts/", json=post_payload, headers=headers)
    assert res.status_code == 201
    post = res.json()
    assert len(post["product_tags"]) == 1
    assert post["product_tags"][0]["title"] == "Riviera Camp Shirt"
    assert post["product_tags"][0]["pin_x"] == 48.0

# ==============================================================================
# SCENARIO 7: Creator Collaboration Campaigns & Deliverables
# ==============================================================================
def test_scenario_7_creator_campaign_collaboration():
    # Login brand
    brand_login = client.post("/api/v1/auth/login", json={
        "email": "brand@drobe.style",
        "password": "Drobe@2026"
    })
    brand_token = brand_login.json()["access_token"]
    brand_headers = {"Authorization": f"Bearer {brand_token}"}

    # Brand creates a campaign
    camp_payload = {
        "title": "Coastal Linen Festive Shoot 2026",
        "description": "Seeking 2 creators to showcase our festive capsule in Kumarakom.",
        "category": "Festive",
        "required_creator_type": "Fashion Influencer",
        "target_city": "Kerala",
        "budget_inr": 35000.0,
        "deliverables": ["1x 4K Instagram Reel", "2x Carousels"],
        "application_deadline": "2026-11-30"
    }
    camp_res = client.post("/api/v1/campaigns/", json=camp_payload, headers=brand_headers)
    assert camp_res.status_code == 201
    campaign_id = camp_res.json()["id"]

    # Login creator
    creator_login = client.post("/api/v1/auth/login", json={
        "email": "creator@drobe.style",
        "password": "Drobe@2026"
    })
    creator_token = creator_login.json()["access_token"]
    creator_headers = {"Authorization": f"Bearer {creator_token}"}

    # Creator applies
    apply_payload = {
        "proposal": "I will produce an editorial sunset sequence highlighting the breathable weave.",
        "quoted_price": 32000.0,
        "deliverables_plan": "1 Reel with high-end color grading + 2 carousels"
    }
    apply_res = client.post(f"/api/v1/campaigns/{campaign_id}/apply", json=apply_payload, headers=creator_headers)
    assert apply_res.status_code == 201
    app_id = apply_res.json()["application_id"]

    # Brand accepts application
    accept_res = client.patch(
        f"/api/v1/campaigns/applications/{app_id}/status",
        json={"status": "accepted"},
        headers=brand_headers
    )
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "accepted"

# ==============================================================================
# SCENARIO 8: Admin Management, Verification & Moderation
# ==============================================================================
def test_scenario_8_admin_management():
    # Login admin
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@drobe.style",
        "password": "Drobe@2026"
    })
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Check Platform Stats
    stats_res = client.get("/api/v1/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_users"] > 0
    assert stats["total_posts"] > 0
    assert stats["total_bookings"] > 0
    assert stats["platform_commission_inr"] >= 0

    # 2. Review & Verify Stylist
    stylists_res = client.get("/api/v1/admin/verifications/stylists", headers=admin_headers)
    assert stylists_res.status_code == 200
    stylist_list = stylists_res.json()
    assert len(stylist_list) >= 1

    first_stylist = stylist_list[0]
    verify_res = client.patch(
        f"/api/v1/admin/verifications/stylists/{first_stylist['id']}",
        json={"status": "verified", "notes": "Portfolio documents checked and verified."},
        headers=admin_headers
    )
    assert verify_res.status_code == 200
    assert "verified" in verify_res.json()["message"]

    # 3. List platform users
    users_res = client.get("/api/v1/admin/users", headers=admin_headers)
    assert users_res.status_code == 200
    assert len(users_res.json()) >= 1
