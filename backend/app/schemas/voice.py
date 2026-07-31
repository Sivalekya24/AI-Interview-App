from typing import Optional

from pydantic import BaseModel


class VoiceInterviewResponse(BaseModel):

    status: str

    question_number: Optional[int] = None

    question: Optional[str] = None

    transcript: Optional[str] = None

    difficulty: Optional[str] = None

    feedback: Optional[str] = None

    overall_score: Optional[float] = None