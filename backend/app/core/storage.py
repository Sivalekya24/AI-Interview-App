from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

VOICE_UPLOAD_DIR = BASE_DIR / "uploads" / "voice"

VOICE_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)