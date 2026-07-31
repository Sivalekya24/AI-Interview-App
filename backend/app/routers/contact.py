from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.role_checker import require_role

from app.schemas.contact import (
    ContactCreate,
    ContactResponse,
)

from app.services.contact_service import contact_service

router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)


# ==========================================
# Public - Submit Contact Message
# ==========================================

@router.post(
    "",
    response_model=ContactResponse,
)
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
):

    return contact_service.create_message(
        db,
        contact,
    )


# ==========================================
# Recruiter - View All Messages
# ==========================================

@router.get(
    "/recruiter",
    response_model=List[ContactResponse],
)
def get_all_messages(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("RECRUITER")),
):

    return contact_service.get_all_messages(db)


# ==========================================
# Recruiter - View One Message
# ==========================================

@router.get(
    "/recruiter/{contact_id}",
    response_model=ContactResponse,
)
def get_message(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("RECRUITER")),
):

    return contact_service.get_message(
        db,
        contact_id,
    )


# ==========================================
# Recruiter - Mark As Read
# ==========================================

@router.patch(
    "/recruiter/{contact_id}/read",
    response_model=ContactResponse,
)
def mark_as_read(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("RECRUITER")),
):

    return contact_service.mark_as_read(
        db,
        contact_id,
    )


# ==========================================
# Recruiter - Delete Message
# ==========================================

@router.delete(
    "/recruiter/{contact_id}",
)
def delete_message(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("RECRUITER")),
):

    return contact_service.delete_message(
        db,
        contact_id,
    )