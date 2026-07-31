from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.services.resume_service import (
    upload_resume,
    get_resume,
)

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post(
    "/upload",
    response_model=ResumeResponse,
)
def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return upload_resume(
        db=db,
        file=file,
        user_id=current_user.id,
    )


@router.get(
    "/me",
    response_model=ResumeResponse,
)
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    resume = get_resume(
        db=db,
        user_id=current_user.id,
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return resume