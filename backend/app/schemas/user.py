from typing import Optional

from pydantic import BaseModel, EmailStr


# =====================================================
# Public Registration
# =====================================================

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


# =====================================================
# Recruiter Create User
# =====================================================

class RecruiterUserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "USER"


# =====================================================
# Recruiter Update User
# =====================================================

class RecruiterUserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


# =====================================================
# Token
# =====================================================

class Token(BaseModel):
    access_token: str
    token_type: str

# =====================================================
# Google Authentication
# =====================================================

class GoogleLoginRequest(BaseModel):
    credential: str


# =====================================================
# User Response
# =====================================================

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# =====================================================
# Forgot Password
# =====================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# =====================================================
# Reset Password
# =====================================================

class ResetPasswordRequest(BaseModel):
    token: str
    password: str