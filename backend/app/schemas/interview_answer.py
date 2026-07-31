from typing import List
from pydantic import BaseModel


# ==========================================================
# Submit Answer Request
# ==========================================================

class SubmitAnswerRequest(BaseModel):

    interview_id: int

    answer: str


# ==========================================================
# Continue Interview Response
# ==========================================================

class SubmitAnswerResponse(BaseModel):

    question_number: int

    question: str


# ==========================================================
# Final Interview Report
# ==========================================================

class FinalInterviewReportResponse(BaseModel):

    message: str

    overall_score: float

    technical_score: float

    communication_score: float

    problem_solving: float

    strengths: List[str]

    weaknesses: List[str]

    recommendation: str

    summary: str