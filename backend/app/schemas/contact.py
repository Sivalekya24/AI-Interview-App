from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


# ==============================
# Create Contact
# ==============================

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


# ==============================
# Contact Response
# ==============================

class ContactResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==============================
# Update Contact Status
# ==============================

class ContactStatusUpdate(BaseModel):
    status: str