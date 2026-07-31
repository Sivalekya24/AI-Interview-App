import cv2
import numpy as np

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.proctoring import ProctoringResponse
from app.services.proctoring_engine import proctoring_engine
from app.services.proctoring_service import proctoring_service
from app.schemas.frontend_violation import (
    FrontendViolationRequest,
    FrontendViolationResponse,
)

router = APIRouter(
    prefix="/proctoring",
    tags=["Proctoring"],
)


@router.post(
    "/face-check",
    response_model=ProctoringResponse,
)
async def face_check(

    interview_id: int,

    image: UploadFile = File(...),

    db: Session = Depends(get_db),

):

    image_bytes = await image.read()

    image_np = np.frombuffer(
        image_bytes,
        np.uint8,
    )

    frame = cv2.imdecode(
        image_np,
        cv2.IMREAD_COLOR,
    )

    # ------------------------------------------
    # Analyze Frame
    # ------------------------------------------

    results = proctoring_engine.analyze(
        frame=frame,
        audio_bytes=None,
    )

    # ------------------------------------------
    # Save Violations
    # ------------------------------------------

    proctoring_service.process_detection_results(

        db=db,

        interview_id=interview_id,

        results=results,

    )

    return results

@router.post(
    "/violation",
    response_model=FrontendViolationResponse,
)
def report_frontend_violation(
    request: FrontendViolationRequest,
    db: Session = Depends(get_db),
):

    proctoring_service.save_frontend_violation(

        db=db,

        interview_id=request.interview_id,

        violation_type=request.violation_type,

    )

    proctoring_service.terminate_interview_if_needed(
    db=db,
    interview_id=request.interview_id,
    )

    return FrontendViolationResponse(

        success=True,

        message="Violation saved successfully.",

    )