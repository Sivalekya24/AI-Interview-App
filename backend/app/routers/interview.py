from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.auth.role_checker import require_role
from app.models.user import User
from typing import Union
from app.schemas.interview import StartInterviewResponse
from app.schemas.interview_answer import (
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    FinalInterviewReportResponse,
)

from app.services.interview_service import (
    start_interview,
    submit_answer,
    get_interview_status as get_interview_status_service,
    get_current_interview,
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.post(
    "/start",
    response_model=StartInterviewResponse,
)
def start(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return start_interview(
        db,
        current_user.id,
    )

@router.post(
    "/answer",
    response_model=Union[
        SubmitAnswerResponse,
        FinalInterviewReportResponse,
    ],
)
def answer(
    request: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return submit_answer(
        db=db,
        interview_id=request.interview_id,
        answer=request.answer,
    )

@router.get("/current")
def current_interview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_current_interview(
        db,
        current_user.id,
    )

@router.get("/{interview_id}/status")
def get_interview_status(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("CANDIDATE")),
):

    interview = get_interview_status_service(
        db,
        interview_id,
        current_user.id,
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found."
        )

    return {
        "status": interview.status
    }