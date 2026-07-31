from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas.user import GoogleLoginRequest
from app.services.auth_service import google_login
from app.core.database import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.auth_service import (
    register_user,
    login_user,
    forgot_password,
    reset_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    created_user = register_user(db, user)

    if created_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return created_user


@router.post(
    "/login",
    response_model=Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = login_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return token

@router.post(
    "/google",
    response_model=Token,
)
def google_auth(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db),
):

    token = google_login(
        db=db,
        credential=request.credential,
    )

    if token is None:

        raise HTTPException(
            status_code=401,
            detail="Google authentication failed.",
        )

    return token

@router.post("/forgot-password")
async def forgot_password_route(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return await forgot_password(
        db=db,
        email=request.email,
    )

@router.post("/reset-password")
async def reset_password_route(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    result = await reset_password(
        db=db,
        token=request.token,
        new_password=request.password,
    )

    if result is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset link.",
        )

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Reset link has expired.",
        )

    return {
        "message": "Password has been reset successfully."
    }