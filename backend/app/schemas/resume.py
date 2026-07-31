from datetime import datetime

from pydantic import BaseModel


class ResumeResponse(BaseModel):

    id: int

    filename: str

    filepath: str

    raw_text: str

    markdown_text: str

    uploaded_at: datetime

    user_id: int

    class Config:
        from_attributes = True