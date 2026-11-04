from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User
from app.models.occasion import OccasionProject
from app.schemas.all_schemas import OccasionProjectCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/occasions", tags=["Occasion Projects & Workspaces"])

def serialize_occasion(p: OccasionProject) -> dict:
    return {
        "id": p.id,
        "customer_id": p.customer_id,
        "title": p.title,
        "occasion_type": p.occasion_type,
        "event_date": p.event_date,
        "city": p.city,
        "total_budget": p.total_budget,
        "booked_services": p.booked_services or [],
        "status": p.status,
        "notes": p.notes,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

@router.get("/projects")
def list_my_occasion_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(OccasionProject).filter(
        OccasionProject.customer_id == current_user.id
    ).order_by(desc(OccasionProject.created_at)).all()
    return [serialize_occasion(p) for p in projects]

@router.post("/projects", status_code=status.HTTP_201_CREATED)
def create_occasion_project(
    payload: OccasionProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = OccasionProject(
        customer_id=current_user.id,
        title=payload.title,
        occasion_type=payload.occasion_type or "Wedding",
        event_date=payload.event_date,
        city=payload.city or "Udaipur",
        total_budget=payload.total_budget or 85000.0,
        booked_services=payload.booked_services or [],
        notes=payload.notes,
        status=payload.status or "active"
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return serialize_occasion(project)

@router.get("/projects/{project_id}")
def get_occasion_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")
    if project.customer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return serialize_occasion(project)

@router.put("/projects/{project_id}")
def update_occasion_project(
    project_id: str,
    payload: OccasionProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(OccasionProject).filter(OccasionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Occasion project not found")
    if project.customer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    payload_dict = payload.model_dump(exclude_unset=True)
    for field, value in payload_dict.items():
        if hasattr(project, field):
            setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return serialize_occasion(project)
