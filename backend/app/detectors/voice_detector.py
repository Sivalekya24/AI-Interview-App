import io

import librosa
import numpy as np
import soundfile as sf


class VoiceDetector:

    def __init__(self):

        # Thresholds (can be tuned later)
        self.silence_threshold = 0.01
        self.loud_threshold = 0.20

    # =====================================================
    # Detect Voice
    # =====================================================

    def detect_voice(
        self,
        audio_bytes: bytes,
    ):

        audio, sample_rate = sf.read(
            io.BytesIO(audio_bytes)
        )

        if len(audio.shape) > 1:
            audio = np.mean(audio, axis=1)

        rms = librosa.feature.rms(
            y=audio
        )[0]

        average_volume = float(np.mean(rms))

        if average_volume < self.silence_threshold:

            return {

                "volume": round(average_volume, 4),

                "status": "NO_VOICE",

            }

        elif average_volume > self.loud_threshold:

            return {

                "volume": round(average_volume, 4),

                "status": "LOUD_VOICE",

            }

        else:

            return {

                "volume": round(average_volume, 4),

                "status": "NORMAL_VOICE",

            }


voice_detector = VoiceDetector()