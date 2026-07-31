from docling.document_converter import DocumentConverter


class DocumentProcessor:

    def __init__(self):

        self.converter = DocumentConverter()

    def convert_to_markdown(
        self,
        file_path: str,
    ) -> str:

        result = self.converter.convert(file_path)

        document = result.document

        markdown = document.export_to_markdown()

        return markdown