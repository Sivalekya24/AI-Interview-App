from app.detectors.face_detector import face_detector
from app.detectors.mobile_detector import mobile_detector
from app.detectors.voice_detector import voice_detector
from app.detectors.lip_sync_detector import lip_sync_detector


class ProctoringEngine:

    def analyze(self, frame, audio_bytes=None):

        result = {}

        try:
            print("Running Face Detector...")
            result["face"] = face_detector.detect_faces(frame)
            print(result["face"])
        except Exception as e:
            print("FACE ERROR:", e)
            raise

        try:
            print("Running Mobile Detector...")
            result["mobile"] = mobile_detector.detect_mobile(frame)
            print(result["mobile"])
        except Exception as e:
            print("MOBILE ERROR:", e)
            raise

        try:
            print("Running Voice Detector...")
            if audio_bytes:
                result["voice"] = voice_detector.detect_voice(audio_bytes)
            else:
                result["voice"] = {
                    "volume": 0,
                    "status": "NO_AUDIO",
                }
            print(result["voice"])
        except Exception as e:
            print("VOICE ERROR:", e)
            raise

        try:
            print("Running Lip Sync...")
            result["lip_sync"] = lip_sync_detector.detect_lip_sync(
                frame,
                result["voice"]["status"],
            )
            print(result["lip_sync"])
        except Exception as e:
            print("LIP ERROR:", e)
            raise

        return result


proctoring_engine = ProctoringEngine()