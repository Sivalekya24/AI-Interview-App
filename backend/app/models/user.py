from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import DateTime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False, index=True)

    password = Column(String(255), nullable=False)

    google_id = Column(
    String(255),
    unique=True,
    nullable=True,
    )

    is_google_user = Column(
    Boolean,
    default=False,
    )

    role = Column(String(20), nullable=False)

    is_active = Column(Boolean, default=True)
    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 

    resumes = relationship(
    "Resume",
    back_populates="user",
    cascade="all, delete-orphan"
)
    interviews = relationship(
    "Interview",
    back_populates="user",
    cascade="all, delete-orphan",
)
    