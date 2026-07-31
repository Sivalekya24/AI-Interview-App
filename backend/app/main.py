from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import interview
from app.routers import auth
from app.routers import users
from app.routers import resume
from app.routers import voice
from app.routers import recruiter
from app.routers import proctoring
from app.core.create_default_admin import create_default_admin
from app.routers import groq
from app.routers.contact import router as contact_router
from app.websocket.websocket_router import router as websocket_router
create_default_admin()
import app.models
app = FastAPI(
    title="AI Interview Platform",
    description="AI Powered Interview Platform Backend",
    version="1.0.0"
)

# -----------------------------------------------------
# CORS
# -----------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
             "http://localhost:5173",
             "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Routers
# -----------------------------------------------------

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(voice.router)
app.include_router(recruiter.router)
app.include_router(proctoring.router)
app.include_router(groq.router)
app.include_router(websocket_router)
app.include_router(contact_router)

# -----------------------------------------------------
# Health Check
# -----------------------------------------------------

@app.get("/")
def home():

    return {

        "status": "Running",

        "application": "AI Interview Platform",

        "version": "1.0.0"

    }


@app.get("/health")
def health():

    return {

        "status": "healthy"

    }