from pathlib import Path

import pandas as pd
from docx import Document as DocxDocument
from pypdf import PdfReader


SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".csv",
    ".xlsx",
}


def extract_text(
    file_path: str,
    file_extension: str,
) -> str:

    extension = file_extension.lower()

    if extension == ".pdf":
        return _extract_pdf(file_path)

    if extension == ".docx":
        return _extract_docx(file_path)

    if extension == ".txt":
        return _extract_txt(file_path)

    if extension == ".csv":
        return _extract_csv(file_path)

    if extension == ".xlsx":
        return _extract_xlsx(file_path)

    raise ValueError(
        f"Unsupported file type: {extension}"
    )


def _extract_pdf(file_path: str) -> str:

    reader = PdfReader(file_path)

    pages = []

    for page in reader.pages:

        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n\n".join(pages)


def _extract_docx(file_path: str) -> str:

    document = DocxDocument(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n\n".join(paragraphs)


def _extract_txt(file_path: str) -> str:

    path = Path(file_path)

    return path.read_text(
        encoding="utf-8",
        errors="ignore",
    )


def _extract_csv(file_path: str) -> str:

    df = pd.read_csv(file_path)

    return df.to_csv(
        index=False
    )


def _extract_xlsx(file_path: str) -> str:

    excel = pd.ExcelFile(file_path)

    sheets = []

    for sheet_name in excel.sheet_names:

        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name,
        )

        sheets.append(
            f"Sheet: {sheet_name}\n"
            f"{df.to_csv(index=False)}"
        )

    return "\n\n".join(sheets)