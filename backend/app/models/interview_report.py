from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Text,
    ForeignKey,
    DateTime,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class InterviewReport(Base):
    __tablename__ = "interview_reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id"),
        unique=True,
        nullable=False,
    )

    overall_score = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    technical_score = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    communication_score = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    problem_solving_score = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    recommendation = Column(
        String(50),
        nullable=False,
    )

    strengths = Column(
        Text,
        nullable=True,
    )

    weaknesses = Column(
        Text,
        nullable=True,
    )

    summary = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    interview = relationship(
        "Interview",
        back_populates="report",
    )