from fastapi import FastAPI

app = FastAPI(
    title="AI Interview Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Interview Backend Running Successfully"
    }