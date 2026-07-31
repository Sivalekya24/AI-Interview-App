from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
from app.services.email_service import send_reset_email
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
)
from app.auth.jwt_handler import create_access_token
import secrets
from datetime import datetime, timedelta

from app.core.security import hash_password
from app.models.user import User

def register_user(db: Session, user: UserCreate):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return None

    new_user = User(
    full_name=user.full_name,
    email=user.email,
    password=hash_password(user.password),
    role="USER"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, email: str, password: str):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        return None

    if not verify_password(password, user.password):
        return None

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

def google_login(db: Session, credential: str):

    try:

        # Verify Google ID Token
        google_user = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

    except Exception:

        return None

    email = google_user["email"]

    full_name = google_user.get("name", "")

    google_id = google_user["sub"]

    # ---------------------------------------
    # Existing User?
    # ---------------------------------------

    user = (

        db.query(User)

        .filter(User.email == email)

        .first()

    )

    # ---------------------------------------
    # Create User
    # ---------------------------------------

    if user is None:

        user = User(

            full_name=full_name,

            email=email,

            password=hash_password(google_id),

            role="USER",

            google_id=google_id,

            is_google_user=True,

        )

        db.add(user)

        db.commit()

        db.refresh(user)

    else:

        # Link Google account if not already linked
        if user.google_id is None:

            user.google_id = google_id

            user.is_google_user = True

            db.commit()

    # ---------------------------------------
    # Generate JWT
    # ---------------------------------------

    access_token = create_access_token(

        {

            "sub": user.email,

            "role": user.role,

        }

    )

    return {

        "access_token": access_token,

        "token_type": "bearer",

    }
async def forgot_password(db: Session, email: str):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # Don't reveal whether the email exists
    if user is None:
        return {
            "message": "If the email is registered, a password reset link has been sent."
        }

    token = secrets.token_urlsafe(32)

    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)

    db.commit()

    reset_link = (
    f"{settings.FRONTEND_URL}"
    f"/reset-password?token={token}"
)

    send_reset_email(
        email=user.email,
        full_name=user.full_name,
        reset_link=reset_link,
    )

    return {
        "message": "Password reset link has been sent to your email."
    }
async def reset_password(
    db: Session,
    token: str,
    new_password: str,
):

    user = (
        db.query(User)
        .filter(User.reset_token == token)
        .first()
    )

    if user is None:
        return None

    if (
        user.reset_token_expiry is None
        or user.reset_token_expiry < datetime.utcnow()
    ):
        return False

    user.password = hash_password(new_password)

    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return True
