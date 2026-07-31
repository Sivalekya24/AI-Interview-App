import os
import shutil
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.services.text_extractor import TextExtractor
from app.services.document_processor import DocumentProcessor
from app.ai.groq_service import groq_service

UPLOAD_FOLDER = "storage/resumes"

ALLOWED_EXTENSIONS = [".pdf", ".docx"]


def upload_resume(
    db: Session,
    file: UploadFile,
    user_id: int,
):

    validate_resume(file)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    replace_old_resume(
        db=db,
        user_id=user_id,
    )

    file_path = save_resume_file(file)

    extractor = TextExtractor()

    raw_text = extractor.extract(file_path)

    processor = DocumentProcessor()

    markdown = processor.convert_to_markdown(file_path)

    parsed_resume = groq_service.parse_resume(markdown)

    print("=" * 80)
    print("GROQ RESULT")
    print(parsed_resume)
    print(type(parsed_resume))
    print("=" * 80)

    if parsed_resume is None:
        raise HTTPException(
            status_code=500,
            detail="Groq returned None."
        )

    resume = Resume(

    filename=file.filename,

    filepath=file_path,

    raw_text=raw_text,

    markdown_text=markdown,

    parsed_data=parsed_resume,

    user_id=user_id,
    )

    db.add(resume)

    print("Resume.parsed_data before commit:")
    print(resume.parsed_data)

    db.commit()

    db.refresh(resume)

    return resume


def validate_resume(file: UploadFile):

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )


def replace_old_resume(
    db: Session,
    user_id: int,
):

    old_resume = (

        db.query(Resume)

        .filter(
            Resume.user_id == user_id
        )

        .first()

    )

    if old_resume:

        if os.path.exists(old_resume.filepath):

            os.remove(old_resume.filepath)

        db.delete(old_resume)

        db.commit()


def save_resume_file(file: UploadFile):

    extension = os.path.splitext(file.filename)[1].lower()

    filename = f"{uuid.uuid4().hex}{extension}"

    filepath = os.path.join(

        UPLOAD_FOLDER,

        filename

    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(

            file.file,

            buffer

        )

    return filepath


def get_resume(
    db: Session,
    user_id: int,
):

    return (

        db.query(Resume)

        .filter(
            Resume.user_id == user_id
        )

        .first()

    )