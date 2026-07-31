import cv2
import mediapipe as mp


class FaceDetector:

    def __init__(self):

        self.mp_face_detection = mp.solutions.face_detection

        self.detector = self.mp_face_detection.FaceDetection(
            model_selection=0,
            min_detection_confidence=0.6,
        )

    # =====================================================
    # Detect Faces
    # =====================================================

    def detect_faces(
        self,
        frame,
    ):

        rgb = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB,
        )

        results = self.detector.process(rgb)

        face_count = 0

        if results.detections:

            face_count = len(
                results.detections
            )

        return {

            "face_count": face_count,

            "status": self._get_status(
                face_count
            )

        }

    # =====================================================
    # Face Status
    # =====================================================

    def _get_status(
        self,
        face_count: int,
    ):

        if face_count == 0:

            return "NO_FACE"

        elif face_count == 1:

            return "SINGLE_FACE"

        else:

            return "MULTIPLE_FACES"


face_detector = FaceDetector()