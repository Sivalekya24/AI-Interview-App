import cv2
import mediapipe as mp
import math


class LipSyncDetector:

    def __init__(self):

        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        # Upper and lower lip landmarks
        self.upper_lip = 13
        self.lower_lip = 14

        # Mouth opening threshold
        self.threshold = 0.015

    # =====================================================
    # Detect Lip Movement
    # =====================================================

    def detect_lip_sync(
        self,
        frame,
        voice_status,
    ):

        rgb = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB,
        )

        result = self.face_mesh.process(rgb)

        mouth_open = False

        if result.multi_face_landmarks:

            landmarks = result.multi_face_landmarks[0].landmark

            upper = landmarks[self.upper_lip]

            lower = landmarks[self.lower_lip]

            distance = math.sqrt(
                (upper.x - lower.x) ** 2
                + (upper.y - lower.y) ** 2
            )

            mouth_open = distance > self.threshold

        # -----------------------------
        # Compare with voice
        # -----------------------------

        if mouth_open and voice_status == "NORMAL_VOICE":

            status = "LIP_SYNC_MATCH"

        elif mouth_open and voice_status == "LOUD_VOICE":

            status = "LIP_SYNC_MATCH"

        elif mouth_open and voice_status == "NO_VOICE":

            status = "LIP_SYNC_MISMATCH"

        elif not mouth_open and voice_status != "NO_VOICE":

            status = "LIP_SYNC_MISMATCH"

        else:

            status = "LIP_SYNC_MATCH"

        return {

            "mouth_open": mouth_open,

            "status": status,

        }


lip_sync_detector = LipSyncDetector()