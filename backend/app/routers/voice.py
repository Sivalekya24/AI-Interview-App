from fastapi import (
    APIRouter,
    File,
    UploadFile,
    HTTPException,
    Depends,
    Form,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.voice.voice_service import voice_service
from app.schemas.voice import VoiceInterviewResponse


router = APIRouter(
    prefix="/voice",
    tags=["Voice"],
)


# ---------------------------------------------------------
# Speech To Text
# ---------------------------------------------------------

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...)
):

    if not audio.filename:

        raise HTTPException(
            status_code=400,
            detail="Audio file is required."
        )

    audio_bytes = await audio.read()

    transcript = voice_service.transcribe_audio(
        audio_bytes
    )

    return {
        "transcript": transcript
    }


# ---------------------------------------------------------
# Voice Interview
# ---------------------------------------------------------

@router.post(
    "/interview-answer",
    response_model=VoiceInterviewResponse,)
async def submit_voice_answer(

    interview_id: int = Form(...),

    audio: UploadFile = File(...),

    db: Session = Depends(get_db),

):

    if not audio.filename:

        raise HTTPException(
            status_code=400,
            detail="Audio file is required."
        )

    audio_bytes = await audio.read()

    result = voice_service.submit_voice_answer(

        db=db,

        interview_id=interview_id,

        audio_bytes=audio_bytes,

    )

    return result