from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Boolean,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class InterviewQuestion(Base):

    __tablename__ = "interview_questions"

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

    # Generated only when this question is asked
    question = Column(
        String,
        nullable=True,
    )

    # Topic from the interview blueprint
    topic = Column(
        String(100),
        nullable=False,
    )

    # Skill being evaluated
    expected_skill = Column(
        String(100),
        nullable=True,
    )

    # Skill / Project / Experience / Core CS
    category = Column(
        String(50),
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

    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    interview = relationship(
        "Interview",
        back_populates="questions",
    )

    answer = relationship(
        "InterviewAnswer",
        back_populates="question",
        uselist=False,
        cascade="all, delete-orphan",
    )