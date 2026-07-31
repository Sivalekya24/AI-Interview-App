from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def create_default_admin():

    db: Session = SessionLocal()

    try:

        existing = (
            db.query(User)
            .filter(User.email == "admin@shnoor.com")
            .first()
        )

        if existing:
            print("Recruiter already exists.")
            return

        admin = User(
            full_name="Recruiter Admin",
            email="admin@shnoor.com",
            password=hash_password("Admin@123"),
            role="RECRUITER",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Recruiter account created.")

    finally:
        db.close()