from fastapi import APIRouter

from app.ai.groq_service import groq_service

router = APIRouter(
    prefix="/groq",
    tags=["Groq"],
)


@router.post("/parse")
def parse_resume():

    sample_resume = """

Name:
D Sivalekya

Skills

Python
FastAPI
React
Machine Learning
OpenCV
SQL

Projects

AI Interview Platform

Edge AI Emotion Recognition

Experience

Software Intern

Education

B.Tech CSE AI

Certifications

ServiceNow CSA

ServiceNow CAD

"""

    return groq_service.parse_resume(sample_resume)