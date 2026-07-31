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


class VoiceRecording(Base):
    __tablename__ = "voice_recordings"

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

    question_id = Column(
        Integer,
        ForeignKey("interview_questions.id"),
        nullable=False,
    )

    audio_path = Column(
        String,
        nullable=False,
    )

    transcript = Column(
        String,
        nullable=True,
    )

    duration = Column(
        Float,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    interview = relationship(
        "Interview",
    )

    question = relationship(
        "InterviewQuestion",
    )