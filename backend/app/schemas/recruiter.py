from datetime import datetime
from typing import Optional,List

from pydantic import BaseModel


# =====================================================
# Dashboard
# =====================================================

class DashboardResponse(BaseModel):

    total_users: int

    total_interviews: int

    completed_interviews: int

    running_interviews: int

    terminated_interviews: int

    total_violations: int

    average_score: float
    


# =====================================================
# User
# =====================================================

class RecruiterUserResponse(BaseModel):

    id: int

    full_name: str

    email: str

    is_active: bool

    created_at: datetime

    class Config:
        from_attributes = True

class InterviewViolationResponse(BaseModel):
    id: int
    type: str
    description: str
    severity: str
    detected_at: datetime

# =====================================================
# Interview
# =====================================================

class InterviewResponse(BaseModel):

    id: int

    user_id: int

    resume_id: int

    status: str

    current_question: int

    difficulty: str

    overall_score: float

    started_at: Optional[datetime]

    completed_at: Optional[datetime]

    # ===============================
    # Candidate Details
    # ===============================

    candidate_name: Optional[str] = None

    candidate_email: Optional[str] = None

    resume_filename: Optional[str] = None

    violations: List[InterviewViolationResponse] = []


    class Config:
        from_attributes = True


# =====================================================
# Interview Report
# =====================================================

class InterviewReportResponse(BaseModel):

    interview_id: int

    overall_score: float

    technical_score: float

    communication_score: float

    problem_solving_score: float

    recommendation: str

    strengths: Optional[str]

    weaknesses: Optional[str]

    summary: Optional[str]

    class Config:
        from_attributes = True

# =====================================================
# Proctoring Event
# =====================================================

from datetime import datetime
from pydantic import BaseModel


class ProctoringEventResponse(BaseModel):

    id: int

    interview_id: int

    violation_type: str

    severity: str

    description: str

    detected_at: datetime

    class Config:
        from_attributes = True