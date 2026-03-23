from __future__ import annotations

import json
import sys
from pathlib import Path


def escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_text_stream(lines: list[str]) -> bytes:
    operations = ["BT", "/F1 18 Tf", "72 760 Td", "24 TL"]
    for index, line in enumerate(lines):
        if index > 0:
            operations.append("T*")
        operations.append(f"({escape_pdf_text(line)}) Tj")
    operations.append("ET")
    return "\n".join(operations).encode("utf-8")


def write_minimal_pdf(output_path: Path, pages: list[list[str]]) -> None:
    objects: list[bytes] = []
    page_object_numbers: list[int] = []

    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    objects.append(b"<< /Type /Pages /Kids [] /Count 0 >>")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    for lines in pages:
        content_stream = build_text_stream(lines)
        content_object = (
            f"<< /Length {len(content_stream)} >>\nstream\n".encode("utf-8")
            + content_stream
            + b"\nendstream"
        )
        objects.append(content_object)
        content_object_number = len(objects)

        page_object = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
            f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_object_number} 0 R >>"
        ).encode("utf-8")
        objects.append(page_object)
        page_object_numbers.append(len(objects))

    kids = " ".join(f"{number} 0 R" for number in page_object_numbers)
    objects[1] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_object_numbers)} >>".encode(
        "utf-8"
    )

    output = bytearray(b"%PDF-1.4\n")
    offsets = [0]

    for index, obj in enumerate(objects, start=1):
        offsets.append(len(output))
        output.extend(f"{index} 0 obj\n".encode("utf-8"))
        output.extend(obj)
        output.extend(b"\nendobj\n")

    xref_start = len(output)
    output.extend(f"xref\n0 {len(objects) + 1}\n".encode("utf-8"))
    output.extend(b"0000000000 65535 f \n")

    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("utf-8"))

    output.extend(
        (
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_start}\n%%EOF\n"
        ).encode("utf-8")
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(output)


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: render_book.py <payload-path>", file=sys.stderr)
        return 1

    payload_path = Path(sys.argv[1])
    payload = json.loads(payload_path.read_text(encoding="utf-8"))

    title = payload.get("title") or "My Photobook"
    output_path = Path(payload["outputPath"])
    pages_layout = payload.get("pagesLayout") or []

    if not isinstance(pages_layout, list):
        pages_layout = []

    pages: list[list[str]] = []
    if not pages_layout:
        pages.append(
            [
                title,
                "",
                "זהו PDF ראשוני לבדיקת ה-pipeline.",
                "שלב הרנדר הסופי עם תמונות אמיתיות ו-layout מלא יגיע בשלב הבא.",
            ]
        )
    else:
        for page in pages_layout:
            page_number = page.get("pageNumber", "?")
            layout_type = page.get("layoutType", "custom")
            slots = page.get("slots", [])
            pages.append(
                [
                    title,
                    f"עמוד {page_number}",
                    f"Layout: {layout_type}",
                    f"Items: {len(slots)}",
                ]
            )

    write_minimal_pdf(output_path, pages)
    print(json.dumps({"pdfPath": str(output_path), "status": "Completed"}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
