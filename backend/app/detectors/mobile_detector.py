from ultralytics import YOLO


class MobileDetector:

    def __init__(self):

        # Load YOLOv8 Nano model
        self.model = YOLO("yolov8n.pt")

    # =====================================================
    # Detect Mobile Phone
    # =====================================================

    def detect_mobile(self, frame):

        results = self.model(frame)

        for result in results:

            for box in result.boxes:

                class_id = int(box.cls[0])

                class_name = self.model.names[class_id]

                confidence = float(box.conf[0])

                # YOLO COCO dataset label
                if class_name == "cell phone" and confidence >= 0.50:

                    return {
                        "detected": True,
                        "confidence": round(confidence, 2),
                        "status": "MOBILE_DETECTED",
                    }

        return {
            "detected": False,
            "confidence": 0,
            "status": "NO_MOBILE",
        }


mobile_detector = MobileDetector()