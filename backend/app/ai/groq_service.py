import json
import re

from groq import Groq

from app.core.config import settings


class GroqService:

    def __init__(self):

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

        self.model = "llama-3.3-70b-versatile"

    # ==========================================================
    # Generic AI Request
    # ==========================================================

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ):

        response = self.client.chat.completions.create(

            model=self.model,

            temperature=temperature,

            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )

        return response.choices[0].message.content.strip()

    # ==========================================================
    # Extract JSON
    # ==========================================================

    def extract_json(
        self,
        text: str,
    ):

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        try:
            return json.loads(text)

        except Exception:

            match = re.search(
                r"\{.*\}",
                text,
                re.DOTALL,
            )

            if match:

                return json.loads(
                    match.group(0)
                )

            raise Exception(
                "Invalid JSON returned by Groq."
            )

    # ==========================================================
    # Resume Parser
    # ==========================================================

    def parse_resume(
        self,
        resume_text: str,
    ):

        prompt = f"""
    You are an ATS Resume Parser.

    Extract every possible detail.

    Return ONLY JSON.

    JSON

    {{
        "candidate": {{
            "name":"",
            "email":"",
            "phone":"",
            "location":""
        }},

        "summary":"",

        "skills":[],

        "projects":[
            {{
                "name":"",
                "description":"",
                "technologies":[],
                "responsibilities":[]
            }}
        ],

        "experience":[
            {{
                "company":"",
                "role":"",
                "duration":"",
                "description":""
            }}
        ],

        "education":[
            {{
                "degree":"",
                "institution":"",
                "year":""
            }}
        ],

        "certifications":[],

        "languages":[],

        "strengths":[]
    }}

Resume

{resume_text}
"""

        result = self.generate(

            system_prompt="""
You are an ATS Resume Parsing Engine.

Return ONLY JSON.

Never explain.

Never use markdown.
""",

            user_prompt=prompt,
        )

        return self.extract_json(result)
    
        # ==========================================================
    # Create Interview Blueprint
    # ==========================================================

    def create_interview_blueprint(
        self,
        parsed_resume: dict,
    ):

        prompt = f"""
You are a Senior Technical Interviewer.

Generate a personalized interview blueprint.

Candidate Profile

{json.dumps(parsed_resume, indent=4)}

Requirements

1. Total Questions = 20

2. Cover all important areas.

3. Prioritize:
   - Skills
   - Projects
   - Experience
   - Education
   - Core CS Fundamentals
   - Problem Solving

4. Core CS topics should be chosen according to candidate skills.

Examples

Python
→ OOPS
→ Exception Handling
→ Multithreading

FastAPI
→ REST APIs
→ Authentication
→ Dependency Injection

Machine Learning
→ CNN
→ Model Evaluation
→ Feature Engineering

React
→ Hooks
→ State Management

5. Never repeat topics.

6. Increase difficulty gradually.

Return ONLY JSON.

Format

{{
    "questions":[
        {{
            "number":1,
            "topic":"",
            "category":"",
            "expected_skill":"",
            "difficulty":"Easy"
        }}
    ]
}}
"""

        result = self.generate(

            system_prompt="""
You are a Senior Software Engineering Interview Planner.

Return only JSON.
""",

            user_prompt=prompt,

            temperature=0.1,
        )

        return self.extract_json(result)

    # ==========================================================
    # Generate One Interview Question
    # ==========================================================

    def generate_question(

        self,

        parsed_resume: dict,

        topic: str,

        category: str,

        difficulty: str,

        previous_questions: list,

        previous_answers: list,

    ):

        prompt = f"""
You are conducting a real technical interview.

Candidate Resume

{json.dumps(parsed_resume, indent=4)}

Current Topic

{topic}

Category

{category}

Difficulty

{difficulty}

Previous Questions

{json.dumps(previous_questions, indent=4)}

Previous Answers

{json.dumps(previous_answers, indent=4)}

Rules

1. Ask ONLY ONE question.

2. Never repeat previous questions.

3. The question MUST be related to the current topic.

4. Difficulty should be {difficulty}.

5. If Easy:
   Ask fundamentals.

6. If Medium:
   Ask implementation.

7. If Hard:
   Ask architecture, optimization or debugging.

8. Ask like a real interviewer.

Return ONLY the question.

No numbering.

No explanation.

No markdown.
"""

        result = self.generate(

            system_prompt="""
You are an experienced Software Engineering Interviewer.
""",

            user_prompt=prompt,

            temperature=0.4,
        )

        return result.strip()
    
    # ==========================================================
    # Evaluate Candidate Answer
    # ==========================================================

    def evaluate_answer(

        self,

        question: str,

        answer: str,

        topic: str,

        difficulty: str,

    ):

        prompt = f"""
You are a Senior Technical Interviewer.

Evaluate the candidate answer.

Question

{question}

Candidate Answer

{answer}

Topic

{topic}

Difficulty

{difficulty}

Evaluate using the following criteria.

1. Technical Knowledge

2. Correctness

3. Communication

4. Confidence

5. Depth of Knowledge

Return ONLY JSON.

Format

{{
    "technical_score":90,
    "correctness_score":88,
    "communication_score":80,
    "confidence_score":82,
    "depth_score":87,

    "overall_score":85,

    "feedback":"",

    "strengths":[
        ""
    ],

    "weaknesses":[
        ""
    ],

    "next_difficulty":"Medium"
}}

Difficulty Rule

overall_score >=85
→ Hard

overall_score >=60
→ Medium

overall_score <60
→ Easy
"""

        result = self.generate(

            system_prompt="""
You are an experienced technical interviewer.

Return only JSON.
""",

            user_prompt=prompt,

            temperature=0.2,
        )

        return self.extract_json(result)

    # ==========================================================
    # Generate Final Report
    # ==========================================================

    def generate_final_report(

        self,

        parsed_resume,

        interview_history,

    ):

        prompt = f"""
You are a Technical Hiring Manager.

Candidate Resume

{json.dumps(parsed_resume, indent=4)}

Interview History

{interview_history}

Generate a hiring report.

Return ONLY JSON.

Format

{{
    "overall_score":0,

    "technical_summary":"",

    "communication_summary":"",

    "strengths":[
    ],

    "weaknesses":[
    ],

    "skill_scores":{{

    }},

    "recommendation":"Hire"
}}

Recommendation Rules

Overall Score >=85

Hire

Overall Score >=70

Consider

Overall Score <70

Reject
"""

        result = self.generate(

            system_prompt="""
You are a Senior Engineering Manager.

Return only JSON.
""",

            user_prompt=prompt,

            temperature=0.2,
        )

        return self.extract_json(result)


groq_service = GroqService()
    
