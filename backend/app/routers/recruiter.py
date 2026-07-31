from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from fastapi.responses import FileResponse
from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from app.auth.role_checker import require_role
from app.core.database import get_db

from app.schemas.recruiter import (
    DashboardResponse,
    RecruiterUserResponse,
    InterviewResponse,
    InterviewReportResponse,
    ProctoringEventResponse,
)
from app.schemas.user import (
    RecruiterUserCreate,
    RecruiterUserUpdate,
)

from app.services.recruiter_service import recruiter_service


router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"],
)


# =====================================================
# Dashboard
# =====================================================

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
)
def get_dashboard(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_dashboard(db)


# =====================================================
# Users
# =====================================================

@router.get(
    "/users",
    response_model=List[RecruiterUserResponse],
)
def get_all_users(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_all_users(db)


@router.get(
    "/users/{user_id}",
    response_model=RecruiterUserResponse,
)
def get_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    user = recruiter_service.get_user(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return user

# =====================================================
# Create User
# =====================================================

@router.post(
    "/users",
    response_model=RecruiterUserResponse,
)
def create_user(

    user: RecruiterUserCreate,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    created_user = recruiter_service.create_user(
        db,
        user,
    )

    if created_user is None:

        raise HTTPException(
            status_code=400,
            detail="Email already exists.",
        )

    return created_user


# =====================================================
# Update User
# =====================================================

@router.put(
    "/users/{user_id}",
    response_model=RecruiterUserResponse,
)
def update_user(

    user_id: int,

    user: RecruiterUserUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    updated_user = recruiter_service.update_user(
        db,
        user_id,
        user,
    )

    if updated_user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return updated_user


# =====================================================
# Activate User
# =====================================================

@router.patch(
    "/users/{user_id}/activate",
    response_model=RecruiterUserResponse,
)
def activate_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    user = recruiter_service.activate_user(
        db,
        user_id,
    )

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return user


# =====================================================
# Deactivate User
# =====================================================

@router.patch(
    "/users/{user_id}/deactivate",
    response_model=RecruiterUserResponse,
)
def deactivate_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    user = recruiter_service.deactivate_user(
        db,
        user_id,
    )

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return user

# =====================================================
# Download Users
# =====================================================

@router.get(
    "/download/users",
    response_class=StreamingResponse,
)
def download_users(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.download_users(
        db
    )

# =====================================================
# Download Interviews
# =====================================================

@router.get(
    "/download/interviews",
    response_class=StreamingResponse,
)
def download_interviews(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.download_interviews(
        db
    )



# =====================================================
# Interviews
# =====================================================

@router.get(
    "/interviews",
    response_model=List[InterviewResponse],
)
def get_all_interviews(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_all_interviews(db)

@router.get(
    "/interviews/{interview_id}/resume",
)
def view_resume(
    interview_id: int,
    db: Session = Depends(get_db),
):

    response = recruiter_service.view_resume(
        db,
        interview_id,
    )

    if response is None:

        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return response

@router.get(
    "/interviews/{interview_id}/resume/download",
)
def download_resume(
    interview_id: int,
    db: Session = Depends(get_db),
):

    response = recruiter_service.download_resume(
        db,
        interview_id,
    )

    if response is None:

        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return response


# =====================================================
# Running Interviews
# =====================================================

@router.get(
    "/live",
    response_model=List[InterviewResponse],
)
def get_running_interviews(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_running_interviews(
        db,
    )


# =====================================================
# Live Interview
# =====================================================

@router.get(
    "/live/{interview_id}",
    response_model=InterviewResponse,
)
def get_live_interview(

    interview_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    interview = recruiter_service.get_live_interview(

        db,

        interview_id,

    )

    if interview is None:

        raise HTTPException(

            status_code=404,

            detail="Interview not running.",

        )

    return interview

@router.patch(
    "/interviews/{interview_id}/terminate",
    response_model=InterviewResponse,
)
def terminate_interview(

    interview_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    interview = recruiter_service.terminate_interview(
        db,
        interview_id,
    )

    if interview is None:

        raise HTTPException(
            status_code=404,
            detail="Interview not found or already finished.",
        )

    return interview


@router.get(
    "/interviews/{interview_id}",
    response_model=InterviewResponse,
)
def get_interview(

    interview_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    interview = recruiter_service.get_interview(
        db,
        interview_id,
    )

    if not interview:

        raise HTTPException(
            status_code=404,
            detail="Interview not found.",
        )

    return interview


# =====================================================
# Interview Answers
# =====================================================

@router.get(
    "/interviews/{interview_id}/answers",
)
def get_interview_answers(

    interview_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_interview_answers(
        db,
        interview_id,
    )


# =====================================================
# Final Report
# =====================================================

@router.get(
    "/interviews/{interview_id}/report",
    response_model=InterviewReportResponse,
)
def get_report(

    interview_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    report = recruiter_service.get_report(
        db,
        interview_id,
    )

    if not report:

        raise HTTPException(
            status_code=404,
            detail="Report not found.",
        )

    return report

# =====================================================
# Download Interview Report
# =====================================================

@router.get(
    "/interviews/{interview_id}/report/download",
)
def download_report(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("RECRUITER")
    ),
):

    response = recruiter_service.download_report(
        db,
        interview_id,
    )

    if response is None:

        raise HTTPException(
            status_code=404,
            detail="Interview report not found.",
        )

    return response

# =====================================================
# All Violations
# =====================================================

@router.get(
    "/violations",
    response_model=List[ProctoringEventResponse],
)
def get_all_violations(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_all_violations(
        db,
    )


# =====================================================
# Interview Violations
# =====================================================

@router.get(
    "/interviews/{interview_id}/violations",
    response_model=List[ProctoringEventResponse],
)
def get_interview_violations(

    interview_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_role("RECRUITER")
    ),

):

    return recruiter_service.get_interview_violations(

        db,

        interview_id,

    )