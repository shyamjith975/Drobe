# DROBE — Discover. Express. Connect. Style.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red)](https://www.sqlalchemy.org)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Expo](https://img.shields.io/badge/Expo-51.0+-000020?logo=expo&logoColor=white)](https://expo.dev)
[![Tests Passing](https://img.shields.io/badge/Pytest-8%20Passed%20(100%25)-brightgreen)](backend/tests/test_drobe.py)

**DROBE** is a production-oriented cross-platform Fashion Social Community + Professional Stylist Marketplace + Brand Discovery + Creator Collaboration Platform built for Web, Mobile (iOS/Android), and Tablet.

DROBE is strictly **HUMAN-FIRST** — rejecting AI recommendations and virtual try-ons in favor of living human fashion directors, regional artisans, and seasoned bridal trousseau consultants.

---

## 📸 Key Capabilities

1. **Responsive Editorial Social Feed**: Pinterest-inspired masonry grid and Instagram-style fashion lookbooks with interactive **"Shop This Look"** product pin overlays, likes, nested comments, and saves.
2. **Professional Stylist Marketplace**: Multi-city discovery across **Kozhikode, Kochi, Bengaluru, Mumbai, and Delhi** with verified badges, real portfolios, ratings, and instant booking capabilities.
3. **End-to-End Booking & Payment Engine**: Booking lifecycle tracking (`requested` → `confirmed` → `completed`), Razorpay sandbox integration, automated 20% platform commission deductions, and an immutable double-entry **Professional Wallet Ledger**.
4. **Editorial Fashion Education & Style Guides**: Human-crafted guides for *Old Money*, *Quiet Luxury*, *Kerala Kasavu Modernization*, *Smart Casual Linen*, accompanied by color swatches and stylist formulas.
5. **Creator Collaboration Hub**: Verified brand sponsorship campaigns with transparent budgets in INR, deliverable trackers, and interactive pitch proposals.
6. **Boutique & Brand Storefronts**: Discover physical stores and luxury labels with direct product catalogues and outbound shopping links.
7. **Wedding & Occasion Suite**: Bridal trousseau planning, groom raw-silk sherwanis, and family color coordination boards.
8. **Administrative Governance Dashboard**: Platform KPI analytics, stylist verification queue, user management, and content moderation.

---

## 📁 Monorepo Architecture

```
drobe/
├── apps/
│   ├── web/               # Next.js / Vite React TypeScript responsive web app (Port: 3000)
│   ├── admin/             # Executive operations & verification dashboard (Port: 3001)
│   └── mobile/            # React Native Expo application with Expo Router & tabs
├── backend/
│   ├── app/
│   │   ├── api/v1/        # Modular REST API endpoints (auth, posts, stylists, bookings, payments, brands, etc.)
│   │   ├── core/          # Argon2id crypto, JWT tokens, config, database engine
│   │   ├── models/        # SQLAlchemy 2.x declarative models with UUID keys
│   │   ├── schemas/       # Pydantic v2 validation models
│   │   └── main.py        # FastAPI application entry point with CORS & static uploads
│   ├── migrations/        # Alembic database migration scripts
│   ├── seed.py            # Rich database seeder with real editorial photography & profiles
│   ├── tests/             # Pytest suite testing all 8 critical user journeys (100% passing)
│   └── requirements.txt
├── packages/
│   ├── api-client/        # Centralized typed TypeScript API client
│   ├── design-tokens/     # Luxury editorial color tokens, typography & breakpoints
│   └── shared-types/      # Common TypeScript domain interfaces
├── docs/
│   ├── architecture.md    # Master system topology & responsive breakpoints
│   └── er_diagram.md      # Full database schema and Mermaid ER diagram
├── docker-compose.yml     # Multi-container orchestration (PostgreSQL, Redis, Backend, Web, Admin)
├── .env.example           # Complete environment variables reference
└── package.json           # Workspace root
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** & **npm**

### 2. Backend Setup & Database Seeding
```bash
# Navigate to backend and install requirements
pip install -r backend/requirements.txt

# Run the rich database seeder (seeds test accounts, stylists, products, lookbooks)
python backend/seed.py

# Run the Pytest test suite (validates all 8 critical user journeys)
pytest backend/tests/test_drobe.py -v

# Start the FastAPI backend server
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
- Interactive Swagger API Documentation: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- API Health Status: [http://localhost:8000/health](http://localhost:8000/health)

### 3. Customer Web App
```bash
# Start customer web application on port 3000
npm --prefix apps/web run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Admin Dashboard
```bash
# Start executive operations portal on port 3001
npm --prefix apps/admin run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔑 Pre-Seeded Test Accounts

You can log in or switch roles instantaneously using the header **Role Switcher** on the web app:

| Role | Email | Password | Persona & Location |
|---|---|---|---|
| **Fashion Enthusiast** | `customer@drobe.style` | `Drobe@2026` | Priya Nair (Kochi) |
| **Personal Stylist** | `stylist@drobe.style` | `Drobe@2026` | Rohan Varma (Kozhikode, Kochi, Bengaluru) |
| **Bridal Stylist** | `maya@drobe.style` | `Drobe@2026` | Maya Nambiar (Kochi, Trivandrum) |
| **Fashion Creator** | `creator@drobe.style` | `Drobe@2026` | Ananya Roy (Mumbai) |
| **Clothing Brand** | `brand@drobe.style` | `Drobe@2026` | Maison Ivory (Bengaluru) |
| **Platform Admin** | `admin@drobe.style` | `Drobe@2026` | Vikramaditya Menon |

---

## 🧪 Automated Testing Scenarios (100% Pass)

Run with:
```bash
pytest backend/tests/test_drobe.py -v
```

1. **Scenario 1**: Customer Registration, Argon2id password verification, JWT issuance, and profile retrieval.
2. **Scenario 2**: Publishing a fashion look, social feed retrieval, and liking/commenting.
3. **Scenario 3**: Stylist onboarding, multi-city operating configuration (Kozhikode, Kochi, Bengaluru), and location discovery.
4. **Scenario 4**: Stylist booking request, quotation calculation, Razorpay sandbox checkout verification, and booking confirmation.
5. **Scenario 5**: Brand onboarding, product catalogue creation, and direct shopping URL management.
6. **Scenario 6**: Interactive **"Shop This Look"** product pin tagging with coordinate offsets and pricing.
7. **Scenario 7**: Creator collaboration campaign sponsorship, pitch application, and brand acceptance.
8. **Scenario 8**: Administrative KPI metrics (`/admin/stats`), stylist verification approval, and user status toggling.

---

## 🎨 Design System & Visual Palette

DROBE utilizes a curated luxury fashion color system:
- **Charcoal Black (`#191919`)**: Primary typography and high-contrast buttons.
- **Warm Ivory (`#F7F5F0`)**: Editorial canvas background.
- **Soft Grey (`#EAE8E3`)**: Borders and card dividers.
- **Stone (`#B8B1A5`)**: Neutral metadata and muted controls.
- **Champagne Gold (`#D4AF37`)**: Instant bookings and verified badges.
- **Terracotta (`#B85D43`)**: Editorial alerts and role badges.
- **Emerald Green (`#2D5A46`)**: Financial earnings and verified checkmarks.

Typography combines **Playfair Display** & **Cormorant Garamond** for editorial headlines with **Inter** for crisp interface typography.

---

## 🚢 Docker Deployment

A production-ready `docker-compose.yml` is provided for containerized deployment:

```bash
docker-compose up --build
```
Containers:
- `drobe_postgres`: PostgreSQL 16 database
- `drobe_redis`: Redis 7 cache & queue
- `drobe_backend`: FastAPI REST API
- `drobe_web`: Customer web application
- `drobe_admin`: Operations admin portal

---

## 📄 License
DROBE Proprietary Architecture • All Rights Reserved.
