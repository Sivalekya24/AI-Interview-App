from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)

    email = Column(String(255), nullable=False)

    message = Column(Text, nullable=False)

    status = Column(String(20), nullable=False, default="NEW")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )