# DROBE — Master Architecture Documentation

## 1. System Vision & Product Principles

DROBE is a production-oriented digital ecosystem uniting:
- **Fashion Enthusiasts**: Discovering trends, following human stylists, and saving looks into curated moodboards.
- **Certified Personal & Wedding Stylists**: Offering virtual wardrobe audits, physical shopping assistance, and bridal trousseau consultations.
- **Fashion Creators & Influencers**: Monetizing aesthetic authority through direct brand collaboration campaigns.
- **Boutiques & Clothing Brands**: Promoting local stores, lookbooks, and tagging products within editorial posts for direct "Shop This Look" conversion.

### Core Non-Negotiable Rules
1. **Human-First**: No generative AI algorithms or fake try-ons. Every outfit pairing, lookbook, and consultation is authored by living human creators.
2. **Persistent Relational Integrity**: All social interactions, bookings, reviews, campaigns, and payments persist in real PostgreSQL / SQLite tables.
3. **Responsive Everywhere**: Adaptive design tailored for small mobile screens, large mobile screens, tablets, laptops, and desktop displays.

---

## 2. Technology Stack & Topology

```
                  +----------------------------------------------+
                  |                 CLIENT LAYER                 |
                  |                                              |
                  |  +--------------------+  +----------------+  |
                  |  |  apps/web (Next/   |  | apps/mobile    |  |
                  |  |  Vite + React)     |  | (Expo/React    |  |
                  |  |  Port: 3000        |  |  Native)       |  |
                  |  +--------------------+  +----------------+  |
                  |  +--------------------+                      |
                  |  | apps/admin (Port   |                      |
                  |  | 3001)              |                      |
                  |  +--------------------+                      |
                  +-----------------------+----------------------+
                                          |
                                          | REST API (JSON)
                                          | Base: /api/v1
                                          v
                  +----------------------------------------------+
                  |               BACKEND API LAYER              |
                  |                                              |
                  |  +----------------------------------------+  |
                  |  | FastAPI REST Application (Port: 8000)  |  |
                  |  | • Argon2id Hashing & JWT Auth          |  |
                  |  | • Role-Based Access Control (RBAC)     |  |
                  |  | • Pydantic v2 Input & Output Schemas   |  |
                  |  | • SQLAlchemy 2.x Declarative Models    |  |
                  |  +----------------------------------------+  |
                  +-----------------------+----------------------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
             +---------------------+             +---------------------+
             |  PostgreSQL Database |             | Local / S3 Storage  |
             |  (or SQLite Dev DB) |             | (Uploads / Media)   |
             +---------------------+             +---------------------+
```

---

## 3. Responsive Breakpoints & Design Tokens

DROBE enforces a luxury editorial design aesthetic inspired by high-fashion print magazines (*Vogue*, *Harper's Bazaar*, *GQ*) and visual discovery engines (*Pinterest*, *Instagram*).

| Breakpoint | Dimensions | Layout Strategy | Navigation Mode |
|---|---|---|---|
| **Mobile Sm** | 320px – 480px | Single-column card feed, compact 1-col masonry | Fixed Bottom Nav bar (Home, Discover, Create +, Stylists, Profile) |
| **Tablet** | 768px – 1024px | 2-column editorial grid, card drawers | Sticky Top Header with icon navigation |
| **Laptop** | 1024px – 1440px | 3-column masonry grid, sidebar filters | Top Navigation + Search Bar + Notifications + Role Switcher |
| **Desktop Wide** | 1440px+ | 4-column visual lookbook grid | Full expansive editorial container |

### Color Palette
- **Charcoal Black (`#191919`)**: Primary dark base for typography, buttons, and high-contrast accents.
- **Warm Ivory (`#F7F5F0`)**: Editorial surface background providing a warm, tactile magazine paper feel.
- **Soft Grey (`#EAE8E3`)**: Subtle border dividers and card backdrops.
- **Stone (`#B8B1A5`)**: Secondary neutral tone for inactive icons and muted captions.
- **Muted Taupe (`#8A8176`)**: Editorial dates, time stamps, and metadata.
- **Accents**: Terracotta (`#B85D43`), Champagne Gold (`#D4AF37`), Emerald Green (`#2D5A46`).

### Typography
- **Headings & Brand Titles**: `Playfair Display` & `Cormorant Garamond` (editorial serif with high contrast strokes).
- **Interface & Metrics**: `Inter` (geometric neo-grotesque sans-serif for crystal clarity across mobile viewports).

---

## 4. Financial & Booking Engine Architecture

```
1. Customer selects Stylist & Service
   └── System computes: Total = Base + Travel, Advance = 50%, Commission = 20%, Stylist Payout = 80%

2. Order created with Razorpay Mock Order ID
   └── Booking status -> 'requested' or 'accepted'

3. Server-side payment verification
   └── POST /api/v1/payments/verify validates payment idempotently
   └── Booking status -> 'confirmed', paid_amount updated

4. Service Delivery & Consultation
   └── Customer & Stylist communicate via Real-Time Messaging or Video session
   └── Booking status -> 'completed'

5. Stylist Wallet Credit
   └── System automatically credits Stylist Wallet with Payout (80%)
   └── Creates immutable WalletLedger transaction entry
```

---

## 5. Security & RBAC Enforcement

- **Argon2id**: Memory-hard password hashing (time_cost=2, memory_cost=65536, parallelism=2).
- **JWT**: Cryptographically signed access tokens and refresh tokens.
- **RBAC**: Multi-role support (`enthusiast`, `stylist`, `creator`, `brand`, `store`, `admin`, `super_admin`) enforced on every protected route via `get_current_user` and `require_admin` dependencies.
