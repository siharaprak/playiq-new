from html import escape
from pathlib import Path
import re
import textwrap

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261007.md"
OUTPUT = ROOT / "output" / "pdf" / "PLAYIQ_CURRENT_COMBINED_COURSE_LIGHT_PRINT_20261007.pdf"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "Arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "Arial Bold.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Italic", str(FONT_DIR / "Arial Italic.ttf")))
pdfmetrics.registerFont(TTFont("CourierNew", str(FONT_DIR / "Courier New.ttf")))

PAGE_W, PAGE_H = letter
MARGIN_X = 0.68 * inch
MARGIN_TOP = 0.72 * inch
MARGIN_BOTTOM = 0.66 * inch
CONTENT_W = PAGE_W - 2 * MARGIN_X
CONTENT_H = PAGE_H - MARGIN_TOP - MARGIN_BOTTOM


def inline_markup(value: str) -> str:
    value = escape(value, quote=False)
    value = re.sub(r"`([^`]+)`", r'<font name="CourierNew">\1</font>', value)
    value = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", value)
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    return value


def wrapped_code(lines: list[str], max_chars: int = 112) -> str:
    out: list[str] = []
    for line in lines:
        if len(line) <= max_chars:
            out.append(line)
            continue
        indent = len(line) - len(line.lstrip())
        width = max(30, max_chars - indent)
        chunks = textwrap.wrap(
            line.lstrip(),
            width=width,
            subsequent_indent=" " * min(indent + 2, 14),
            break_long_words=True,
            break_on_hyphens=False,
        )
        out.extend(chunks or [line])
    return "\n".join(out)


def markdown_table(lines: list[str], styles: dict[str, ParagraphStyle]):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if cells and all(re.fullmatch(r":?-{2,}:?", cell.replace(" ", "")) for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return None
    ncols = max(len(row) for row in rows)
    if ncols > 6:
        return Preformatted(
            wrapped_code(lines, 112),
            ParagraphStyle(
                "WideTableCode",
                fontName="CourierNew",
                fontSize=5.8,
                leading=7.0,
                textColor=colors.HexColor("#1c2733"),
                backColor=colors.HexColor("#f6f8fa"),
                borderColor=colors.HexColor("#d8e0e8"),
                borderWidth=0.4,
                borderPadding=5,
            ),
        )
    cell_style = ParagraphStyle(
        "TableCell",
        fontName="Arial",
        fontSize=6.8 if ncols > 4 else 7.2,
        leading=8.4 if ncols > 4 else 9.0,
        textColor=colors.HexColor("#17212b"),
        spaceAfter=0,
    )
    data = []
    for row in rows:
        padded = row + [""] * (ncols - len(row))
        data.append([Paragraph(inline_markup(cell), cell_style) for cell in padded])
    widths = [CONTENT_W / ncols] * ncols
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e9eef3")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#16324f")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#c4ced8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#fbfcfd")]),
            ]
        )
    )
    return table


def build_story(text: str):
    sample = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle(
            "CourseTitle", parent=sample["Title"], fontName="Arial-Bold",
            fontSize=20, leading=25, alignment=TA_LEFT,
            textColor=colors.HexColor("#18324b"), spaceAfter=10,
        ),
        "h1": ParagraphStyle(
            "Heading1", parent=sample["Heading1"], fontName="Arial-Bold",
            fontSize=15.5, leading=19, textColor=colors.HexColor("#18324b"),
            spaceBefore=8, spaceAfter=7, keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "Heading2", parent=sample["Heading2"], fontName="Arial-Bold",
            fontSize=12.2, leading=15, textColor=colors.HexColor("#244f72"),
            spaceBefore=8, spaceAfter=5, keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "Heading3", parent=sample["Heading3"], fontName="Arial-Bold",
            fontSize=10, leading=12.5, textColor=colors.HexColor("#30495e"),
            spaceBefore=6, spaceAfter=4, keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body", fontName="Arial", fontSize=8.7, leading=11.5,
            textColor=colors.HexColor("#18212a"), spaceAfter=4.2,
            alignment=TA_LEFT,
        ),
        "list": ParagraphStyle(
            "List", fontName="Arial", fontSize=8.6, leading=11.1,
            leftIndent=13, firstLineIndent=-9, textColor=colors.HexColor("#18212a"),
            spaceAfter=2.5,
        ),
        "quote": ParagraphStyle(
            "Quote", fontName="Arial-Italic", fontSize=8.6, leading=11.4,
            leftIndent=14, rightIndent=8, textColor=colors.HexColor("#34495e"),
            borderColor=colors.HexColor("#9db5c9"), borderWidth=1,
            borderPadding=6, backColor=colors.HexColor("#f6f9fb"),
            spaceBefore=3, spaceAfter=6,
        ),
        "code": ParagraphStyle(
            "Code", fontName="CourierNew", fontSize=6.6, leading=8.2,
            textColor=colors.HexColor("#17212b"), backColor=colors.HexColor("#f5f7f9"),
            borderColor=colors.HexColor("#d8e0e8"), borderWidth=0.4,
            borderPadding=5, spaceBefore=3, spaceAfter=6,
        ),
    }
    story = []
    lines = text.splitlines()
    i = 0
    paragraph: list[str] = []

    def flush_paragraph():
        nonlocal paragraph
        if paragraph:
            content = " ".join(part.strip() for part in paragraph).strip()
            if content:
                story.append(Paragraph(inline_markup(content), styles["body"]))
            paragraph = []

    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()
        if not stripped:
            flush_paragraph()
            i += 1
            continue
        if stripped == "\\newpage":
            flush_paragraph()
            story.append(PageBreak())
            i += 1
            continue
        if stripped.startswith("```"):
            flush_paragraph()
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i].rstrip())
                i += 1
            i += 1
            story.append(Preformatted(wrapped_code(code_lines), styles["code"]))
            continue
        if stripped.startswith("|"):
            flush_paragraph()
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].rstrip())
                i += 1
            table = markdown_table(table_lines, styles)
            if table:
                story.append(table)
                story.append(Spacer(1, 5))
            continue
        if stripped in {"---", "***", "___"}:
            flush_paragraph()
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#c7d1da"), spaceBefore=4, spaceAfter=6))
            i += 1
            continue
        heading = re.match(r"^(#{1,3})\s+(.*)$", stripped)
        if heading:
            flush_paragraph()
            level = len(heading.group(1))
            style = styles["title"] if level == 1 and not story else styles[f"h{level}"] if level > 1 else styles["h1"]
            story.append(Paragraph(inline_markup(heading.group(2)), style))
            i += 1
            continue
        if stripped.startswith(">"):
            flush_paragraph()
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip().lstrip("> ").strip())
                i += 1
            quoted = " ".join(part for part in quote_lines if part)
            story.append(Paragraph(inline_markup(quoted), styles["quote"]))
            continue
        if re.match(r"^[-*+]\s+", stripped):
            flush_paragraph()
            item = re.sub(r"^[-*+]\s+", "• ", stripped)
            story.append(Paragraph(inline_markup(item), styles["list"]))
            i += 1
            continue
        if re.match(r"^\d+[.)]\s+", stripped):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped), styles["list"]))
            i += 1
            continue
        paragraph.append(line)
        i += 1
    flush_paragraph()
    return story


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFont("Arial", 7.3)
    canvas.setFillColor(colors.HexColor("#536779"))
    canvas.drawString(MARGIN_X, PAGE_H - 0.42 * inch, "PlayIQ Course 1  |  Light Print Edition  |  2026-10-07")
    canvas.setStrokeColor(colors.HexColor("#d7dfe6"))
    canvas.setLineWidth(0.45)
    canvas.line(MARGIN_X, PAGE_H - 0.49 * inch, PAGE_W - MARGIN_X, PAGE_H - 0.49 * inch)
    canvas.line(MARGIN_X, 0.48 * inch, PAGE_W - MARGIN_X, 0.48 * inch)
    canvas.setFillColor(colors.HexColor("#536779"))
    canvas.drawRightString(PAGE_W - MARGIN_X, 0.31 * inch, f"Page {doc.page}")
    canvas.restoreState()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    source_text = SOURCE.read_text(encoding="utf-8")
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
        title="PlayIQ Current Combined Course — Light Print Edition",
        author="PlayIQ Curriculum",
        subject="Updated course source, Tutor Project pathway, and Capstone Personal Assistant",
    )
    frame = Frame(
        MARGIN_X,
        MARGIN_BOTTOM,
        CONTENT_W,
        CONTENT_H,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="main",
    )
    doc.addPageTemplates([PageTemplate(id="print", frames=[frame], onPage=on_page)])
    doc.build(build_story(source_text))
    print(f"Created {OUTPUT}")


if __name__ == "__main__":
    main()
