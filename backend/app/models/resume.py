from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String(255),
        nullable=False
    )

    filepath = Column(
        String(500),
        nullable=False
    )

    raw_text = Column(
        Text,
        nullable=False
    )

    markdown_text = Column(
        Text,
        nullable=False
    )

    parsed_data = Column(
    JSONB,
    nullable=True,
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="resumes"
    )

    interviews = relationship(
    "Interview",
    back_populates="resume",
    cascade="all, delete-orphan"
)