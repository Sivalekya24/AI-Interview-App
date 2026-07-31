import os

import fitz
from docx import Document


class TextExtractor:

    def extract(self, file_path: str) -> str:

        extension = os.path.splitext(file_path)[1].lower()

        if extension == ".pdf":
            return self.extract_pdf(file_path)

        elif extension == ".docx":
            return self.extract_docx(file_path)

        raise ValueError("Unsupported file format.")

    def extract_pdf(self, file_path: str) -> str:

        document = fitz.open(file_path)

        text = ""

        for page in document:

            text += page.get_text()

            text += "\n"

        document.close()

        return text.strip()

    def extract_docx(self, file_path: str) -> str:

        document = Document(file_path)

        paragraphs = []

        for paragraph in document.paragraphs:

            value = paragraph.text.strip()

            if value:

                paragraphs.append(value)

        return "\n".join(paragraphs)