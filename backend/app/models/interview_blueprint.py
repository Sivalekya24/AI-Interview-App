from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


class InterviewBlueprint(Base):

    __tablename__ = "interview_blueprints"

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

    question_number = Column(
        Integer,
        nullable=False,
    )

    topic = Column(
        String(200),
        nullable=False,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    difficulty = Column(
        String(20),
        nullable=False,
    )

    status = Column(
        String(20),
        default="PENDING",
    )

    interview = relationship(
        "Interview",
        back_populates="blueprint"
    )