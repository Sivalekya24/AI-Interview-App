from sqlalchemy import (
    Column,
    Integer,
    Float,
    Text,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)

    question_id = Column(
        Integer,
        ForeignKey("interview_questions.id"),
        nullable=False,
    )

    answer = Column(
        Text,
        nullable=False,
    )

    ai_score = Column(
        Float,
        default=0.0,
    )

    ai_feedback = Column(
        Text,
        nullable=True,
    )

    
    ai_strengths = Column(
        Text,
        nullable=True,
    )

    ai_weaknesses = Column(
        Text,
        nullable=True,
    )

    next_difficulty = Column(
        Text,
        nullable=False,
        default="Easy",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    question = relationship(
        "InterviewQuestion",
        back_populates="answer",
    )