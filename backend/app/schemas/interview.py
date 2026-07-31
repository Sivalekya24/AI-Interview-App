from datetime import datetime

from pydantic import BaseModel


class InterviewResponse(BaseModel):

    id: int

    user_id: int

    resume_id: int

    status: str

    current_question: int

    difficulty: str

    overall_score: float

    started_at: datetime | None

    completed_at: datetime | None

    created_at: datetime

    class Config:
        from_attributes = True


class StartInterviewResponse(BaseModel):

    interview_id: int

    question_number: int

    difficulty: str

    question: str