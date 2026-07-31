import uuid

from sqlalchemy.orm import Session

from app.core.storage import VOICE_UPLOAD_DIR
from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion
from app.models.voice_recording import VoiceRecording
from app.services.interview_service import submit_answer
from app.voice.speech_to_text import speech_to_text


class VoiceService:
    """
    Voice Service

    Responsible for:

    1. Save Audio Recording
    2. Speech-to-Text
    3. Store Voice Recording
    4. Submit Transcript to Interview Engine
    """

    # =====================================================
    # Save Audio File
    # =====================================================

    def save_audio_file(
        self,
        interview_id: int,
        audio_bytes: bytes,
    ) -> str:

        interview_folder = (
            VOICE_UPLOAD_DIR / f"interview_{interview_id}"
        )

        interview_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        filename = f"{uuid.uuid4()}.wav"

        file_path = interview_folder / filename

        with open(file_path, "wb") as file:
            file.write(audio_bytes)

        return str(file_path)

    # =====================================================
    # Speech To Text
    # =====================================================

    def transcribe_audio(
        self,
        audio_bytes: bytes,
    ) -> str:

        transcript = speech_to_text.transcribe(
            audio_bytes
        )

        return transcript

    # =====================================================
    # Submit Voice Answer
    # =====================================================

    def submit_voice_answer(
        self,
        db: Session,
        interview_id: int,
        audio_bytes: bytes,
    ):

        # -----------------------------------------
        # Find Interview
        # -----------------------------------------

        interview = (
            db.query(Interview)
            .filter(
                Interview.id == interview_id
            )
            .first()
        )

        if interview is None:
            raise Exception("Interview not found.")

        # -----------------------------------------
        # Find Current Question
        # -----------------------------------------

        question = (
            db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.interview_id == interview.id,
                InterviewQuestion.question_number == interview.current_question,
            )
            .first()
        )

        if question is None:
            raise Exception("Question not found.")

        # -----------------------------------------
        # Save Audio File
        # -----------------------------------------

        audio_path = self.save_audio_file(
            interview_id=interview_id,
            audio_bytes=audio_bytes,
        )

        # -----------------------------------------
        # Convert Speech to Text
        # -----------------------------------------

        transcript = self.transcribe_audio(
            audio_bytes
        )

        # -----------------------------------------
        # Save Voice Recording
        # -----------------------------------------

        voice_recording = VoiceRecording(

            interview_id=interview.id,

            question_id=question.id,

            audio_path=audio_path,

            transcript=transcript,

            duration=None,
        )

        db.add(voice_recording)

        db.commit()

        db.refresh(voice_recording)

        # -----------------------------------------
        # Submit Transcript to Interview Engine
        # -----------------------------------------

        interview_result = submit_answer(

            db=db,

            interview_id=interview.id,

            answer=transcript,
        )

        interview_result["transcript"] = transcript

        # -----------------------------------------
        # Return Response
        # -----------------------------------------

        return interview_result


voice_service = VoiceService()