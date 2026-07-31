from sqlalchemy import func
from sqlalchemy.orm import Session
import csv
import io
import os
from fastapi.responses import FileResponse
from datetime import datetime
from fastapi.responses import StreamingResponse
from app.models.user import User
from app.models.interview import Interview
from app.models.interview_answer import InterviewAnswer
from app.models.interview_report import InterviewReport
from app.core.security import hash_password
from app.models.proctoring_event import ProctoringEvent
from app.schemas.user import (
    RecruiterUserCreate,
    RecruiterUserUpdate,
)
from io import BytesIO

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)
import mimetypes
from app.models import user
from sqlalchemy.orm import joinedload
class RecruiterService:

    # =====================================================
    # Dashboard
    # =====================================================

    def get_dashboard(
        self,
        db: Session,
    ):

        total_users = db.query(User).count()

        total_interviews = db.query(Interview).count()

        completed_interviews = (

            db.query(Interview)

            .filter(
                Interview.status == "COMPLETED"
            )

            .count()

        )

        running_interviews = (

            db.query(Interview)

            .filter(
                Interview.status == "IN_PROGRESS"
            )

            .count()

        )

        terminated_interviews = (

    db.query(Interview)

    .filter(
        Interview.status == "TERMINATED"
    )

    .count()

)

        average_score = (

            db.query(
                func.avg(
                    Interview.overall_score
                )
            )

            .scalar()

            or 0

        )

        total_violations = db.query(
    ProctoringEvent
).count()

        return {

            "total_users": total_users,

            "total_interviews": total_interviews,

            "completed_interviews": completed_interviews,

            "running_interviews": running_interviews,

            "terminated_interviews": terminated_interviews,

            "total_violations": total_violations,


            "average_score": round(
                average_score,
                2,
            ),

        }

    # =====================================================
    # Users
    # =====================================================

    def get_all_users(
        self,
        db: Session,
    ):

        return (

            db.query(User)

            .order_by(User.id.desc())

            .all()

        )

    def get_user(
        self,
        db: Session,
        user_id: int,
    ):

        return (

            db.query(User)

            .filter(
                User.id == user_id
            )

            .first()

        )
    
    # =====================================================
    # Create User
    # =====================================================

    def create_user(
        self,
        db: Session,
        user_data: RecruiterUserCreate,
    ):

        existing_user = db.query(User).filter(
            User.email == user_data.email
        ).first()

        if existing_user:
            return None

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password=hash_password(user_data.password),
            role=user_data.role,
            is_active=True,
        )

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

        return new_user


    # =====================================================
    # Update User
    # =====================================================

    def update_user(
        self,
        db: Session,
        user_id: int,
        user_data: RecruiterUserUpdate,
    ):

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if user is None:
            return None

        if user_data.full_name is not None:
            user.full_name = user_data.full_name

        if user_data.email is not None:
            user.email = user_data.email

        if user_data.password is not None:
            user.password = hash_password(
                user_data.password
            )

        if user_data.role is not None:
            user.role = user_data.role

        if user_data.is_active is not None:
            user.is_active = user_data.is_active

        db.commit()

        db.refresh(user)

        return user


    # =====================================================
    # Activate User
    # =====================================================

    def activate_user(
        self,
        db: Session,
        user_id: int,
    ):

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if user is None:
            return None

        user.is_active = True

        db.commit()

        db.refresh(user)

        return user


    # =====================================================
    # Deactivate User
    # =====================================================

    def deactivate_user(
        self,
        db: Session,
        user_id: int,
    ):

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if user is None:
            return None

        user.is_active = False

        db.commit()

        db.refresh(user)

        return user
        
    
    # =====================================================
    # Interviews
    # =====================================================

    def get_all_interviews(
        self,
        db: Session,
    ):

        return (

            db.query(Interview)

            .order_by(
                Interview.id.desc()
            )

            .all()

        )

    def get_interview(
    self,
    db: Session,
    interview_id: int,
):
        interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id
        )
        .first()
        )

        if interview is None:
            return None

        interview.candidate_name = (
            interview.user.full_name
            if interview.user
            else None
        )

        interview.candidate_email = (
            interview.user.email
            if interview.user
            else None
        )

        interview.resume_filename = (
            interview.resume.filename
            if interview.resume
            else None
        )

        return interview

    def view_resume(
    self,
    db: Session,
    interview_id: int,
):
        interview = (
            db.query(Interview)
            .filter(
                Interview.id == interview_id
            )
            .first()
        )

        if interview is None:
            return None

        if interview.resume is None:
            return None

        if not os.path.exists(
            interview.resume.filepath
        ):
            return None

        mime_type, _ = mimetypes.guess_type(
            interview.resume.filepath
        )

        return FileResponse(
            path=interview.resume.filepath,
            filename=interview.resume.filename,
            media_type=mime_type or "application/octet-stream",
        )

    def download_resume(
    self,
    db: Session,
    interview_id: int,
):

        interview = (
            db.query(Interview)
            .filter(
                Interview.id == interview_id
            )
            .first()
        )

        if interview is None:
            return None

        if interview.resume is None:
            return None

        if not os.path.exists(
            interview.resume.filepath
        ):
            return None

        mime_type, _ = mimetypes.guess_type(
            interview.resume.filepath
        )

        return FileResponse(
            path=interview.resume.filepath,
            filename=interview.resume.filename,
            media_type=mime_type or "application/octet-stream",
        )
    # =====================================================
    # Running Interviews
    # =====================================================

    # =====================================================
    # Running Interviews
    # =====================================================

    def get_running_interviews(
        self,
        db: Session,
    ):

        interviews = (

            db.query(Interview)

            .options(

                joinedload(Interview.user),
                 joinedload(Interview.resume),

            )

            .filter(

                Interview.status == "IN_PROGRESS"

            )

            .order_by(

                Interview.started_at.desc()

            )

            .all()

        )

        result = []

        for interview in interviews:

            violation_count = (

                db.query(ProctoringEvent)

                .filter(

                    ProctoringEvent.interview_id == interview.id

                )

                .count()

            )

            result.append(
    {
        "id": interview.id,
        "user_id": interview.user_id,
        "resume_id": interview.resume_id,
        "status": interview.status,
        "current_question": interview.current_question,
        "difficulty": interview.difficulty,
        "overall_score": interview.overall_score or 0,
        "started_at": interview.started_at,
        "completed_at": interview.completed_at,

        "candidate_name": (
            interview.user.full_name
            if interview.user
            else None
        ),

        "candidate_email": (
            interview.user.email
            if interview.user
            else None
        ),

        "resume_filename": (
            interview.resume.filename
            if interview.resume
            else None
        ),
    }
)

        return result


    # =====================================================
    # Live Interview
    # =====================================================

    def get_live_interview(
    self,
    db: Session,
    interview_id: int,
):

        interview = (

            db.query(Interview)

            .options(
                joinedload(Interview.user),
                joinedload(Interview.resume),
            )

            .filter(
                Interview.id == interview_id,
                Interview.status == "IN_PROGRESS",
            )

            .first()

        )

        if interview is None:
            return None

        interview.candidate_name = (
            interview.user.full_name
            if interview.user
            else None
        )

        interview.candidate_email = (
            interview.user.email
            if interview.user
            else None
        )

        interview.resume_filename = (
            interview.resume.filename
            if interview.resume
            else None
        )

        violations = (

            db.query(ProctoringEvent)

            .filter(
                ProctoringEvent.interview_id == interview.id
            )

            .order_by(
                ProctoringEvent.detected_at.desc()
            )

            .all()

        )

        interview.violations = [

            {

                "id": violation.id,

                "type": violation.violation_type,

                "description": violation.description,

                "severity": violation.severity,

                "detected_at": violation.detected_at,

            }

            for violation in violations

        ]

        return interview

    # =====================================================
    # Interview Answers
    # =====================================================

    def get_interview_answers(
    self,
    db: Session,
    interview_id: int,
):
        answers = (

            db.query(InterviewAnswer)

            .join(InterviewAnswer.question)

            .filter(
                InterviewAnswer.question.has(
                    interview_id=interview_id
                )
            )

            .all()

        )

        result = []

        for answer in answers:

            result.append({

                "id": answer.id,

                "question": answer.question.question,

                "answer": answer.answer,

                "ai_score": answer.ai_score,

                "ai_feedback": answer.ai_feedback,

                "strengths": answer.ai_strengths,

                "weaknesses": answer.ai_weaknesses,

                "difficulty": answer.next_difficulty,

                "created_at": answer.created_at,

            })

        return {
            "answers": result
        }

    # =====================================================
    # Final Report
    # =====================================================

    def get_report(
        self,
        db: Session,
        interview_id: int,
    ):

        return (

            db.query(
                InterviewReport
            )

            .filter(
                InterviewReport.interview_id == interview_id
            )

            .first()

        )

    def download_report(
    self,
    db: Session,
    interview_id: int,
):

        interview = (
            db.query(Interview)
            .options(
                joinedload(Interview.user),
                joinedload(Interview.resume),
                joinedload(Interview.report),
            )
            .filter(
                Interview.id == interview_id
            )
            .first()
        )

        if interview is None:
            return None

        report = interview.report

        if report is None:
            return None

        buffer = BytesIO()

        doc = SimpleDocTemplate(buffer)

        styles = getSampleStyleSheet()

        story = []

        story.append(
            Paragraph(
                "<b>AI Interview Report</b>",
                styles["Title"],
            )
        )

        story.append(Spacer(1, 20))

        story.append(
            Paragraph(
                f"<b>Candidate :</b> {interview.user.full_name}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph(
                f"<b>Email :</b> {interview.user.email}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph(
                f"<b>Status :</b> {interview.status}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph(
                f"<b>Difficulty :</b> {interview.difficulty}",
                styles["BodyText"],
            )
        )

        if interview.resume:

            story.append(
                Paragraph(
                    f"<b>Resume :</b> {interview.resume.filename}",
                    styles["BodyText"],
                )
            )

        story.append(Spacer(1, 20))

        story.append(
            Paragraph(
                "<b>Scores</b>",
                styles["Heading2"],
            )
        )

        story.append(
            Paragraph(
                f"Overall Score : {report.overall_score}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph(
                f"Technical : {report.technical_score}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph(
                f"Communication : {report.communication_score}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph(
                f"Problem Solving : {report.problem_solving_score}",
                styles["BodyText"],
            )
        )

        story.append(Spacer(1, 15))

        story.append(
            Paragraph(
                "<b>Recommendation</b>",
                styles["Heading2"],
            )
        )

        story.append(
            Paragraph(
                report.recommendation or "-",
                styles["BodyText"],
            )
        )

        story.append(Spacer(1, 15))

        story.append(
            Paragraph(
                "<b>Strengths</b>",
                styles["Heading2"],
            )
        )

        story.append(
            Paragraph(
                report.strengths or "-",
                styles["BodyText"],
            )
        )

        story.append(Spacer(1, 15))

        story.append(
            Paragraph(
                "<b>Weaknesses</b>",
                styles["Heading2"],
            )
        )

        story.append(
            Paragraph(
                report.weaknesses or "-",
                styles["BodyText"],
            )
        )

        story.append(Spacer(1, 15))

        story.append(
            Paragraph(
                "<b>Summary</b>",
                styles["Heading2"],
            )
        )

        story.append(
            Paragraph(
                report.summary or "-",
                styles["BodyText"],
            )
        )

        doc.build(story)

        buffer.seek(0)

        return StreamingResponse(

            buffer,

            media_type="application/pdf",

            headers={
                "Content-Disposition":
                f'attachment; filename="Interview_{interview.id}.pdf"'
            },

        )
        
    # =====================================================
    # All Proctoring Violations
    # =====================================================

    def get_all_violations(
        self,
        db: Session,
    ):

        return (

            db.query(ProctoringEvent)

            .order_by(
                ProctoringEvent.detected_at.desc()
            )

            .all()

        )


    # =====================================================
    # Interview Violations
    # =====================================================

    def get_interview_violations(
        self,
        db: Session,
        interview_id: int,
    ):

        return (

            db.query(ProctoringEvent)

            .filter(
                ProctoringEvent.interview_id == interview_id
            )

            .order_by(
                ProctoringEvent.detected_at.desc()
            )

            .all()

        )
    
    # =====================================================
    # Download Users CSV
    # =====================================================

    def download_users(
        self,
        db: Session,
    ):

        users = db.query(User).order_by(User.id).all()

        output = io.StringIO()

        writer = csv.writer(output)

        writer.writerow([
            "ID",
            "Full Name",
            "Email",
            "Role",
            "Active",
            "Created At",
        ])

        for user in users:

            writer.writerow([
                user.id,
                user.full_name,
                user.email,
                user.role,
                user.is_active,
                user.created_at,
            ])

        output.seek(0)

        return StreamingResponse(

            iter([output.getvalue()]),

            media_type="text/csv",

            headers={
                "Content-Disposition":
                "attachment; filename=users.csv"
            },

        )
    
    # =====================================================
    # Download Interview Results
    # =====================================================

    def download_interviews(
        self,
        db: Session,
    ):

        interviews = (

            db.query(
                Interview
            )

            .order_by(
                Interview.id
            )

            .all()

        )

        output = io.StringIO()

        writer = csv.writer(output)

        writer.writerow([

            "Interview ID",

            "Candidate",

            "Email",

            "Status",

            "Difficulty",

            "Overall Score",

            "Started At",

            "Completed At",

        ])

        for interview in interviews:

            writer.writerow([

                interview.id,

                interview.user.full_name,

                interview.user.email,

                interview.status,

                interview.difficulty,

                interview.overall_score,

                interview.started_at,

                interview.completed_at,

            ])

        output.seek(0)

        return StreamingResponse(

            iter([output.getvalue()]),

            media_type="text/csv",

            headers={

                "Content-Disposition":

                "attachment; filename=interviews.csv"

            },

        )

    # =====================================================
    # Terminate Interview
    # =====================================================

    def terminate_interview(
        self,
        db: Session,
        interview_id: int,
    ):

        interview = (
            db.query(Interview)
            .filter(Interview.id == interview_id)
            .first()
        )

        if interview is None:
            return None

        if interview.status != "IN_PROGRESS":
            return None

        interview.status = "TERMINATED"
        interview.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(interview)

        return interview

    


recruiter_service = RecruiterService()