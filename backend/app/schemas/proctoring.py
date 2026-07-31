from pydantic import BaseModel


# =====================================================
# Face Detection
# =====================================================

class FaceDetectionResponse(BaseModel):

    face_count: int

    status: str


# =====================================================
# Mobile Detection
# =====================================================

class MobileDetectionResponse(BaseModel):

    detected: bool

    confidence: float

    status: str


# =====================================================
# Voice Detection
# =====================================================

class VoiceDetectionResponse(BaseModel):

    volume: float

    status: str


# =====================================================
# Lip Sync Detection
# =====================================================

class LipSyncDetectionResponse(BaseModel):

    mouth_open: bool

    status: str


# =====================================================
# Complete Proctoring Response
# =====================================================

class ProctoringResponse(BaseModel):

    face: FaceDetectionResponse

    mobile: MobileDetectionResponse

    voice: VoiceDetectionResponse

    lip_sync: LipSyncDetectionResponse