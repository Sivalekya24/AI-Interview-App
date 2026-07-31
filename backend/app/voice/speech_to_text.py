import os
import tempfile

from faster_whisper import WhisperModel


class SpeechToText:

    """
    Singleton Whisper Service

    Loads Whisper model only once when the server starts.
    """

    def __init__(self):

        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, audio_bytes: bytes) -> str:

        """
        Converts audio bytes into text.
        """

        temp_file = None

        try:

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".wav"
            ) as file:

                file.write(audio_bytes)

                temp_file = file.name

            segments, info = self.model.transcribe(

                temp_file,

                beam_size=5,

                vad_filter=True,

                language="en"

            )

            transcript = ""

            for segment in segments:

                transcript += segment.text + " "

            transcript = transcript.strip()

            return transcript

        finally:

            if temp_file and os.path.exists(temp_file):

                os.remove(temp_file)


speech_to_text = SpeechToText()