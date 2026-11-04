from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.studio import PartnerStudio, StudioAppointment
from app.api.deps import get_current_user

router = APIRouter(prefix="/studios", tags=["Partner Styling Studios & Experience Centres"])

class StudioAppointmentCreate(BaseModel):
    service_title: str
    appointment_date: str
    appointment_time: str
    price: float
    notes: Optional[str] = None

class PartnerStudioCreate(BaseModel):
    name: str
    city: str
    address: str
    image_url: str
    contact_phone: Optional[str] = "+91 484 231 9900"
    operating_hours: Optional[str] = "10:00 AM - 8:00 PM (Tue - Sun)"
    services: Optional[list] = None

def serialize_studio(s: PartnerStudio) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "city": s.city,
        "address": s.address,
        "image_url": s.image_url,
        "rating": s.rating,
        "reviews_count": s.reviews_count,
        "contact_phone": s.contact_phone,
        "operating_hours": s.operating_hours,
        "services": s.services or [],
        "is_active": s.is_active,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }

def serialize_appointment(a: StudioAppointment) -> dict:
    return {
        "id": a.id,
        "studio_id": a.studio_id,
        "studio_name": a.studio.name if a.studio else "DROBE Studio",
        "studio_city": a.studio.city if a.studio else "",
        "service_title": a.service_title,
        "appointment_date": a.appointment_date,
        "appointment_time": a.appointment_time,
        "price": a.price,
        "status": a.status,
        "notes": a.notes,
        "created_at": a.created_at.isoformat() if a.created_at else None,
    }

@router.get("/")
def list_studios(city: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PartnerStudio).filter(PartnerStudio.is_active == True)
    if city and city.lower() != "all":
        query = query.filter(PartnerStudio.city.ilike(f"%{city}%"))
    studios = query.order_by(desc(PartnerStudio.rating)).all()
    
    # If database has no studios yet, return default curated partner experience centres
    if not studios:
        default_studios = [
            {
                "id": "studio-kochi",
                "name": "DROBE Atelier & Experience Centre · Kochi",
                "city": "Kochi",
                "address": "Atelier 4, Panampilly Nagar Waterfront Avenue, Kochi, Kerala 682036",
                "image_url": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
                "rating": 4.96,
                "reviews_count": 58,
                "contact_phone": "+91 484 231 9900",
                "operating_hours": "10:00 AM - 8:00 PM (Tue - Sun)",
                "services": [
                    {
                        "title": "Seasonal Colour Draping & Skin Undertone Analysis",
                        "duration_minutes": 60,
                        "price": 3500.0,
                        "description": "Instrument and fabric draping to determine your ideal seasonal palette and undertone harmony."
                    },
                    {
                        "title": "Body Proportion & Silhouette Mapping",
                        "duration_minutes": 45,
                        "price": 2800.0,
                        "description": "Architectural silhouette analysis to determine garment cuts, necklines, and waistlines that flatter your posture."
                    },
                    {
                        "title": "Senior Stylist Consultation & Printed Style Dossier",
                        "duration_minutes": 90,
                        "price": 6000.0,
                        "description": "1-on-1 private session with a DROBE Master Stylist, complete with a bound printed style dossier and digital lookbook."
                    },
                    {
                        "title": "Bridal Trousseau & Heritage Silk Draping",
                        "duration_minutes": 120,
                        "price": 8500.0,
                        "description": "Bespoke bridal styling session with Kasavu, silk, and heritage textile draping trials."
                    }
                ],
                "is_active": True
            },
            {
                "id": "studio-blr",
                "name": "DROBE Sartorial Lounge · Bengaluru",
                "city": "Bengaluru",
                "address": "12th Main Road, Indiranagar, Bengaluru, Karnataka 560038",
                "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
                "rating": 4.94,
                "reviews_count": 72,
                "contact_phone": "+91 80 4120 7700",
                "operating_hours": "10:30 AM - 8:30 PM (Tue - Sun)",
                "services": [
                    {
                        "title": "Executive Wardrobe & Capsule Strategy",
                        "duration_minutes": 75,
                        "price": 4500.0,
                        "description": "Strategic capsule planning for tech executives, entrepreneurs, and leadership conferences."
                    },
                    {
                        "title": "Seasonal Colour Draping & Undertone Scan",
                        "duration_minutes": 60,
                        "price": 3500.0,
                        "description": "Comprehensive physical fabric drape testing across 12-season color psychology."
                    }
                ],
                "is_active": True
            },
            {
                "id": "studio-calicut",
                "name": "DROBE Heritage Styling Studio · Kozhikode",
                "city": "Kozhikode",
                "address": "Beach Road Boulevard, Kozhikode, Kerala 673032",
                "image_url": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
                "rating": 4.97,
                "reviews_count": 39,
                "contact_phone": "+91 495 276 4411",
                "operating_hours": "11:00 AM - 8:00 PM (Daily)",
                "services": [
                    {
                        "title": "South Indian Wedding & Groom Wardrobe Curation",
                        "duration_minutes": 90,
                        "price": 5500.0,
                        "description": "Bespoke linen, raw silk, and handloom styling with master craftsman fitting."
                    },
                    {
                        "title": "Personal Color & Silhouette Analysis",
                        "duration_minutes": 60,
                        "price": 3200.0,
                        "description": "In-studio drape assessment and custom color swatch card."
                    }
                ],
                "is_active": True
            },
            {
                "id": "studio-mumbai",
                "name": "DROBE High-Fashion Vault & Studio · Mumbai",
                "city": "Mumbai",
                "address": "Pali Hill, Bandra West, Mumbai, Maharashtra 400050",
                "image_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
                "rating": 4.98,
                "reviews_count": 91,
                "contact_phone": "+91 22 2640 8822",
                "operating_hours": "11:00 AM - 9:00 PM (Tue - Sun)",
                "services": [
                    {
                        "title": "Red Carpet & Editorial Look Architecture",
                        "duration_minutes": 90,
                        "price": 7500.0,
                        "description": "High-fashion silhouette draping, designer garment trials, and runway aesthetic curation."
                    },
                    {
                        "title": "Seasonal Undertone & Fabric Draping",
                        "duration_minutes": 60,
                        "price": 4000.0,
                        "description": "Precision color analysis for camera, studio lighting, and daylight."
                    }
                ],
                "is_active": True
            }
        ]
        if city and city.lower() != "all":
            default_studios = [s for s in default_studios if city.lower() in s["city"].lower()]
        return default_studios

    return [serialize_studio(s) for s in studios]

@router.get("/{studio_id}")
def get_studio(studio_id: str, db: Session = Depends(get_db)):
    studio = db.query(PartnerStudio).filter(PartnerStudio.id == studio_id).first()
    if not studio:
        # Fallback search in default
        studios = list_studios(db=db)
        found = next((s for s in studios if s["id"] == studio_id), None)
        if found:
            return found
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner studio not found")
    return serialize_studio(studio)

@router.post("/{studio_id}/book", status_code=status.HTTP_201_CREATED)
def book_studio_appointment(
    studio_id: str,
    payload: StudioAppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    studio = db.query(PartnerStudio).filter(PartnerStudio.id == studio_id).first()
    if not studio:
        # If using seeded studio id, create real record
        studio = PartnerStudio(
            id=studio_id,
            name="DROBE Atelier & Experience Centre",
            city="Kochi",
            address="Panampilly Nagar Waterfront, Kochi",
            image_url="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
        )
        db.add(studio)
        db.commit()
        db.refresh(studio)

    appointment = StudioAppointment(
        studio_id=studio.id,
        customer_id=current_user.id,
        service_title=payload.service_title,
        appointment_date=payload.appointment_date,
        appointment_time=payload.appointment_time,
        price=payload.price,
        status="confirmed",
        notes=payload.notes
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return serialize_appointment(appointment)

@router.get("/appointments/me")
def list_my_studio_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appointments = db.query(StudioAppointment).filter(
        StudioAppointment.customer_id == current_user.id
    ).order_by(desc(StudioAppointment.created_at)).all()
    return [serialize_appointment(a) for a in appointments]

