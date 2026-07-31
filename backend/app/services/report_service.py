from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.interview_report import InterviewReport

from app.ai.groq_service import groq_service


class ReportService:

    # =====================================================
    # Generate Final Report
    # =====================================================

    def generate_report(
        self,
        parsed_resume: dict,
        interview_history: str,
    ) -> dict:

        return groq_service.generate_final_report(
            parsed_resume=parsed_resume,
            interview_history=interview_history,
        )

    # =====================================================
    # Save Final Report
    # =====================================================

    def save_report(
        self,
        db: Session,
        interview: Interview,
        report: dict,
    ) -> InterviewReport:

        strengths = report.get("strengths", [])

        if isinstance(strengths, list):
            strengths = "\n".join(strengths)

        weaknesses = report.get("weaknesses", [])

        if isinstance(weaknesses, list):
            weaknesses = "\n".join(weaknesses)

        interview_report = InterviewReport(

            interview_id=interview.id,

            overall_score=report.get(
                "overall_score",
                0,
            ),

            technical_score=0,

            communication_score=0,

            problem_solving_score=0,

            recommendation=report.get(
                "recommendation",
                "Consider",
            ),

            strengths=strengths,

            weaknesses=weaknesses,

            summary=report.get(
                "technical_summary",
                "",
            ),

        )

        db.add(interview_report)

        interview.overall_score = report.get(
            "overall_score",
            0,
        )

        interview.recommendation = report.get(
            "recommendation",
            "Consider",
        )

        db.commit()

        db.refresh(interview_report)

        return interview_report

    # =====================================================
    # Get Report
    # =====================================================

    def get_report(
        self,
        db: Session,
        interview_id: int,
    ):

        return (

            db.query(InterviewReport)

            .filter(
                InterviewReport.interview_id == interview_id
            )

            .first()

        )


report_service = ReportService()