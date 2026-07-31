from sqlalchemy.orm import Session

from app.models.proctoring_event import ProctoringEvent
from app.models.interview import Interview
from datetime import datetime, timedelta
class ProctoringService:

    # =====================================================
    # Save Violation
    # =====================================================

    def save_violation(
        self,
        db: Session,
        interview_id: int,
        violation_type: str,
        severity: str,
        description: str,
    ) -> ProctoringEvent:

        violation = ProctoringEvent(

            interview_id=interview_id,

            violation_type=violation_type,

            severity=severity,

            description=description,

        )

        db.add(violation)

        db.commit()

        db.refresh(violation)

        return violation

    # =====================================================
    # Save Frontend Violation
    # =====================================================

    def save_frontend_violation(
        self,
        db: Session,
        interview_id: int,
        violation_type: str,
    ):

        descriptions = {

            "TAB_SWITCH":
                "Candidate switched browser tabs.",

            "FULLSCREEN_EXIT":
                "Candidate exited fullscreen mode.",

            "WINDOW_BLUR":
                "Candidate moved away from interview window.",

        }

        severities = {

            "TAB_SWITCH":
                "HIGH",

            "FULLSCREEN_EXIT":
                "HIGH",

            "WINDOW_BLUR":
                "MEDIUM",

        }

        if not self.should_save_violation(

            db,

            interview_id,

            violation_type,

        ):

            return

        self.save_violation(

            db=db,

            interview_id=interview_id,

            violation_type=violation_type,

            severity=severities.get(

                violation_type,

                "MEDIUM",

            ),

            description=descriptions.get(

                violation_type,

                violation_type,

            ),

        )
        self.terminate_interview_if_needed(
    db=db,
    interview_id=interview_id,
)

    
    
    # =====================================================
    # Check Duplicate Violation
    # =====================================================

    def should_save_violation(
        self,
        db: Session,
        interview_id: int,
        violation_type: str,
        cooldown_seconds: int = 10,
    ):

        latest = (

            db.query(ProctoringEvent)

            .filter(
                ProctoringEvent.interview_id == interview_id,
                ProctoringEvent.violation_type == violation_type,
            )

            .order_by(
                ProctoringEvent.detected_at.desc()
            )

            .first()

        )

        if latest is None:
            return True

        now = datetime.utcnow()

        elapsed = now - latest.detected_at.replace(tzinfo=None)

        return elapsed > timedelta(seconds=cooldown_seconds)

    # =====================================================
    # Process Detection Results
    # =====================================================

    def process_detection_results(
        self,
        db: Session,
        interview_id: int,
        results: dict,
    ):

        # ------------------------------------------
        # Face Detection
        # ------------------------------------------

        face = results["face"]

        if face["status"] == "NO_FACE":

            if self.should_save_violation(

        db,

        interview_id,

        "NO_FACE",

    ):
                
                self.save_violation(

                db=db,

                interview_id=interview_id,

                violation_type="NO_FACE",

                severity="MEDIUM",

                description="Candidate is not visible.",

            )

        elif face["status"] == "MULTIPLE_FACES":

            if self.should_save_violation(

            db,

            interview_id,

            "MULTIPLE_FACES",

        ):

                self.save_violation(

                    db=db,

                    interview_id=interview_id,

                    violation_type="MULTIPLE_FACES",

                    severity="HIGH",

                    description="Multiple faces detected.",

                )

        # ------------------------------------------
        # Mobile Detection
        # ------------------------------------------

        mobile = results["mobile"]

        if mobile["status"] == "MOBILE_DETECTED":

            if self.should_save_violation(

            db,

            interview_id,

            "MOBILE_DETECTED",

        ):

                self.save_violation(

                    db=db,

                    interview_id=interview_id,

                    violation_type="MOBILE_DETECTED",

                    severity="HIGH",

                    description="Mobile phone detected during interview.",

                )

        # ------------------------------------------
        # Voice Detection
        # ------------------------------------------

        voice = results["voice"]

        if voice["status"] == "LOUD_VOICE":

            if self.should_save_violation(

            db,

            interview_id,

            "LOUD_VOICE",

        ):

                self.save_violation(

                    db=db,

                    interview_id=interview_id,

                    violation_type="LOUD_VOICE",

                    severity="MEDIUM",

                    description="Loud voice detected during interview.",

                )

        # ------------------------------------------
        # Lip Sync Detection
        # ------------------------------------------

        lip = results["lip_sync"]

        if lip["status"] == "LIP_SYNC_MISMATCH":

            if self.should_save_violation(

                db,

                interview_id,

                "LIP_SYNC_MISMATCH",

            ):

                self.save_violation(

                    db=db,

                interview_id=interview_id,

                violation_type="LIP_SYNC_MISMATCH",

                severity="HIGH",

                description="Lip synchronization mismatch detected.",

            )
        self.terminate_interview_if_needed(
    db=db,
    interview_id=interview_id,
)

    # =====================================================
    # Get Interview Violations
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
    # Count Violations
    # =====================================================

    def get_violation_count(
        self,
        db: Session,
        interview_id: int,
    ) -> int:

        return (

            db.query(ProctoringEvent)

            .filter(
                ProctoringEvent.interview_id == interview_id
            )

            .count()

        )

    # =====================================================
    # Latest Violation
    # =====================================================

    def get_latest_violation(
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

            .first()

        )


    def terminate_interview_if_needed(
        self,
        db: Session,
        interview_id: int,
        max_violations: int = 100,
    ):

        violation_count = self.get_violation_count(
            db,
            interview_id,
        )

        if violation_count < max_violations:
            return

        interview = (
            db.query(Interview)
            .filter(
                Interview.id == interview_id
            )
            .first()
        )

        if interview is None:
            return

        if interview.status in ("TERMINATED", "COMPLETED"):
            return

        interview.status = "TERMINATED"

        interview.completed_at = datetime.now()

        db.commit()

        db.refresh(interview)

proctoring_service = ProctoringService()