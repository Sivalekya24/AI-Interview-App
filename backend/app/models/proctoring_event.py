from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ProctoringEvent(Base):
    __tablename__ = "proctoring_events"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id"),
        nullable=False,
    )

    violation_type = Column(
        String(50),
        nullable=False,
    )

    severity = Column(
        String(20),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    detected_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    interview = relationship(
        "Interview",
        back_populates="proctoring_events"
    )