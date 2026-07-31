from pydantic import BaseModel


class FrontendViolationRequest(BaseModel):
    interview_id: int
    violation_type: str


class FrontendViolationResponse(BaseModel):
    success: bool
    message: str