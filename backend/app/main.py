from fastapi import FastAPI
from app.core.database import Base, engine
from app.models.user import User
from app.routers import auth



app = FastAPI(
    title="AI Interview Platform",
    version="1.0.0"
)

app.include_router(auth.router)


@app.get("/")
def home():
    return {
        "message": "AI Interview Platform Running"
    }