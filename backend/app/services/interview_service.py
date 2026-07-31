from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.ai.groq_service import groq_service
from app.models.interview import Interview
from app.models.interview_answer import InterviewAnswer
from app.models.interview_question import InterviewQuestion
from app.models.resume import Resume
from app.services.report_service import report_service

# ==========================================================
# Build Complete Interview History
# ==========================================================

def build_interview_history(
    db: Session,
    interview_id: int,
) -> str:

    questions = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id
        )
        .order_by(
            InterviewQuestion.question_number
        )
        .all()
    )

    history = "================ INTERVIEW HISTORY ================\n\n"

    for question in questions:

        history += (
            f"--------------------------------------------------\n"
            f"Question {question.question_number}\n"
            f"--------------------------------------------------\n"
            f"Topic       : {question.topic}\n"
            f"Difficulty  : {question.difficulty}\n"
            f"Question    : {question.question}\n\n"
        )

        if question.answer:

            history += (
                f"Candidate Answer:\n"
                f"{question.answer.answer}\n\n"
                f"AI Feedback:\n"
                f"{question.answer.ai_feedback}\n\n"
                f"Score : {question.answer.ai_score}\n\n"
            )

        else:

            history += (
                "Candidate Answer : Not Answered\n\n"
            )

    history += "=================================================="

    return history

# ==========================================================
# Update Overall Interview Score
# ==========================================================

def update_overall_score(
    db: Session,
    interview: Interview,
):

    answers = (
        db.query(InterviewAnswer)
        .join(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id
        )
        .all()
    )

    if not answers:

        interview.overall_score = 0.0

    else:

        valid_scores = []

        for answer in answers:

            if answer.ai_score is not None:
                valid_scores.append(answer.ai_score)

        if not valid_scores:

            interview.overall_score = 0.0

        else:

            interview.overall_score = round(
                sum(valid_scores) / len(valid_scores),
                2,
            )

    db.commit()

    db.refresh(interview)

    return interview.overall_score

# ==========================================================
# Start Interview
# ==========================================================

def start_interview(
    db: Session,
    user_id: int,
):
    

    # ------------------------------------------------------
    # Load Resume
    # ------------------------------------------------------

    resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == user_id
        )
        .first()
    )

    if resume is None:

        raise HTTPException(
            status_code=404,
            detail="Please upload your resume first."
        )

    if resume.parsed_data is None:

        raise HTTPException(
            status_code=400,
            detail="Resume has not been parsed."
        )

    # ------------------------------------------------------
    # Check Existing Interview
    # ------------------------------------------------------

    existing_interview = (
            db.query(Interview)
            .filter(
                Interview.user_id == user_id,
                Interview.status == "IN_PROGRESS"
            )
            .order_by(
                Interview.created_at.desc()
            )
            .first()
        )

    if existing_interview:

        if existing_interview.status == "TERMINATED":

            raise HTTPException(
                status_code=403,
                detail="Your interview has been terminated due to policy violations. Please contact the recruiter."
            )

        if existing_interview.status == "COMPLETED":

            raise HTTPException(
                status_code=400,
                detail="You have already completed your interview."
            )

        if existing_interview.status == "IN_PROGRESS":

            current_question = (
                db.query(InterviewQuestion)
                .filter(
                    InterviewQuestion.interview_id == existing_interview.id,
                    InterviewQuestion.question_number == existing_interview.current_question,
                )
                .first()
            )

            return {
                "interview_id": existing_interview.id,
                "question_number": current_question.question_number,
                "difficulty": current_question.difficulty,
                "topic": current_question.topic,
                "question": current_question.question,
            }

    # ------------------------------------------------------
    # Create Interview
    # ------------------------------------------------------
   
    interview = Interview(

        user_id=user_id,

        resume_id=resume.id,

        status="IN_PROGRESS",

        current_question=1,

        difficulty="Easy",

        overall_score=0.0,

        started_at=datetime.now(),

    )

    db.add(interview)

    db.commit()

    

    db.refresh(interview)

    # ------------------------------------------------------
    # Generate Interview Blueprint
    # ------------------------------------------------------

    blueprint = groq_service.create_interview_blueprint(
        resume.parsed_data
    )

    if "questions" not in blueprint:

        raise HTTPException(
            status_code=500,
            detail="Interview blueprint generation failed."
        )

    # ------------------------------------------------------
    # Store Interview Questions
    # ------------------------------------------------------

    for item in blueprint["questions"]:

        interview_question = InterviewQuestion(

            interview_id=interview.id,

            question_number=item["number"],

            topic=item["topic"],

            category=item["category"],

            expected_skill=item["expected_skill"],

            difficulty=item["difficulty"],

            status="PENDING",

            question=None,

        )

        db.add(interview_question)

    db.commit()

    # ------------------------------------------------------
    # Load First Planned Question
    # ------------------------------------------------------

    first_question = (

        db.query(InterviewQuestion)

        .filter(

            InterviewQuestion.interview_id == interview.id,

            InterviewQuestion.question_number == 1,

        )

        .first()

    )

    if first_question is None:

        raise HTTPException(
            status_code=500,
            detail="First interview question not found."
        )

    # ------------------------------------------------------
    # Generate First Question
    # ------------------------------------------------------

    generated_question = groq_service.generate_question(

        parsed_resume=resume.parsed_data,

        topic=first_question.topic,

        category=first_question.category,

        difficulty=first_question.difficulty,

        previous_questions=[],

        previous_answers=[],

    )

    first_question.question = generated_question

    first_question.status = "GENERATED"

    db.commit()

    db.refresh(first_question)

    # ------------------------------------------------------
    # Response
    # ------------------------------------------------------

    return {

        "interview_id": interview.id,

        "question_number": first_question.question_number,

        "difficulty": first_question.difficulty,

        "topic": first_question.topic,

        "question": first_question.question,

    }
# ==========================================================
# Submit Candidate Answer
# ==========================================================

def submit_answer(
    db: Session,
    interview_id: int,
    answer: str,
):

    # ------------------------------------------------------
    # Validate Answer
    # ------------------------------------------------------

    if not answer or not answer.strip():

        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty."
        )

    # ------------------------------------------------------
    # Load Interview
    # ------------------------------------------------------

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id
        )
        .first()
    )

    if interview is None:

        raise HTTPException(
            status_code=404,
            detail="Interview not found."
        )

    if interview.status == "TERMINATED":

        raise HTTPException(
            status_code=403,
            detail="Interview has been terminated."
        )

    if interview.status == "COMPLETED":

        raise HTTPException(
            status_code=400,
            detail="Interview already completed."
        )

    # ------------------------------------------------------
    # Load Current Question
    # ------------------------------------------------------

    current_question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id,
            InterviewQuestion.question_number == interview.current_question,
        )
        .first()
    )

    if current_question is None:

        raise HTTPException(
            status_code=404,
            detail="Current question not found."
        )

    if current_question.answer:

        raise HTTPException(
            status_code=400,
            detail="Question already answered."
        )

    # ------------------------------------------------------
    # Save Candidate Answer
    # ------------------------------------------------------

    interview_answer = InterviewAnswer(

        question_id=current_question.id,

        answer=answer,

    )

    db.add(interview_answer)

    db.commit()

    db.refresh(interview_answer)

    # ------------------------------------------------------
    # Load Resume
    # ------------------------------------------------------

    resume = (
        db.query(Resume)
        .filter(
            Resume.id == interview.resume_id
        )
        .first()
    )

    if resume is None:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # ------------------------------------------------------
    # Evaluate Answer using Groq
    # ------------------------------------------------------

    evaluation = groq_service.evaluate_answer(

        question=current_question.question,

        answer=answer,

        topic=current_question.topic,

        difficulty=current_question.difficulty,

    )

    interview_answer.ai_score = evaluation["overall_score"]

    interview_answer.ai_feedback = evaluation["feedback"]

    interview_answer.ai_strengths = "\n".join(
        evaluation.get("strengths", [])
    )

    interview_answer.ai_weaknesses = "\n".join(
        evaluation.get("weaknesses", [])
    )

    interview_answer.next_difficulty = evaluation["next_difficulty"]
    db.commit()

    # ------------------------------------------------------
    # Update Overall Score
    # ------------------------------------------------------

    update_overall_score(
        db,
        interview,
    )

    # ------------------------------------------------------
    # Build Interview History
    # ------------------------------------------------------

    history = build_interview_history(
        db,
        interview.id,
    )

    # ------------------------------------------------------
    # Check Interview Completion
    # ------------------------------------------------------

    if interview.current_question >= 20:

        report = report_service.generate_final_report(

            parsed_resume=resume.parsed_data,

            interview_history=history,

        )

        report_service.save_report(

            db=db,

            interview=interview,

            report=report,

        )

        interview.overall_score = report.get(
            "overall_score",
            interview.overall_score,
        )

        interview.recommendation = report.get(
            "recommendation",
            "Consider",
        )

        interview.status = "COMPLETED"

        interview.completed_at = datetime.now()

        db.commit()

        return {

            "status": "INTERVIEW_COMPLETED",

            "overall_score": interview.overall_score,

            "report": report,

        }

    # ------------------------------------------------------
    # Load Next Planned Question
    # ------------------------------------------------------

    next_question_number = interview.current_question + 1

    next_question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id,
            InterviewQuestion.question_number == next_question_number,
        )
        .first()
    )

    if next_question is None:

        raise HTTPException(
            status_code=404,
            detail="Next interview question not found."
        )

    # ------------------------------------------------------
    # Collect Previous Questions
    # ------------------------------------------------------

    previous_questions = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id
        )
        .order_by(
            InterviewQuestion.question_number
        )
        .all()
    )

    previous_question_list = []

    previous_answer_list = []

    for q in previous_questions:

        if q.question:

            previous_question_list.append(q.question)

        if q.answer:

            previous_answer_list.append(q.answer.answer)

    # ------------------------------------------------------
    # Generate Next Question
    # ------------------------------------------------------

    generated_question = groq_service.generate_question(

        parsed_resume=resume.parsed_data,

        topic=next_question.topic,

        category=next_question.category,

        difficulty=evaluation["next_difficulty"],

        previous_questions=previous_question_list,

        previous_answers=previous_answer_list,

    )

    # ------------------------------------------------------
    # Update Question
    # ------------------------------------------------------

    next_question.question = generated_question

    next_question.difficulty = evaluation["next_difficulty"]

    next_question.status = "GENERATED"

    # ------------------------------------------------------
    # Update Interview
    # ------------------------------------------------------

    interview.current_question = next_question_number

    interview.difficulty = evaluation["next_difficulty"]

    db.commit()

    db.refresh(interview)

    db.refresh(next_question)

    # ------------------------------------------------------
    # Return Response
    # ------------------------------------------------------

    return {

        "status": "NEXT_QUESTION",

        "interview_id": interview.id,

        "question_number": next_question.question_number,

        "difficulty": next_question.difficulty,

        "topic": next_question.topic,

        "question": next_question.question,

        "overall_score": interview.overall_score,

        "feedback": interview_answer.ai_feedback,

    }

def get_interview_status(
    db: Session,
    interview_id: int,
    user_id: int,
):
    return (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == user_id,
        )
        .first()
    )

def get_current_interview(
    db: Session,
    user_id: int,
):
    interview = (
        db.query(Interview)
        .filter(
            Interview.user_id == user_id
        )
        .order_by(
            Interview.created_at.desc()
        )
        .first()
    )

    if interview is None:
        return {
            "id": None,
            "status": "NOT_STARTED",
        }

    question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id,
            InterviewQuestion.question_number == interview.current_question,
        )
        .first()
    )

    return {
        "id": interview.id,
        "status": interview.status,
        "current_question": interview.current_question,
        "difficulty": interview.difficulty,
        "question": question.question if question else None,
        "question_number": question.question_number if question else 1,
        "topic": question.topic if question else "",
    }