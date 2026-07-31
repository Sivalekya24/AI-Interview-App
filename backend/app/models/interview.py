from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
    )

    status = Column(
        String(50),
        nullable=False,
        default="NOT_STARTED",
    )

    current_question = Column(
        Integer,
        nullable=False,
        default=0,
    )

    difficulty = Column(
        String(20),
        nullable=False,
        default="Easy",
    )

    overall_score = Column(
        Float,
        default=0.0,
    )

    recommendation = Column(
    String(30),
    nullable=True,
)

    started_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="interviews",
    )

    resume = relationship(
        "Resume",
        back_populates="interviews",
    )

    questions = relationship(
    "InterviewQuestion",
    back_populates="interview",
    cascade="all, delete-orphan"
)
    report = relationship(
    "InterviewReport",
    back_populates="interview",
    uselist=False,
    cascade="all, delete-orphan",
) 
    proctoring_events = relationship(
    "ProctoringEvent",
    back_populates="interview",
    cascade="all, delete-orphan",
)
    