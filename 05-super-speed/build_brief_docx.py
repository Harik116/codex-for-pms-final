from pathlib import Path
import re

from docx import Document
from docx.shared import Inches, Pt, RGBColor


folder = Path(__file__).resolve().parent
source = (folder / "brief.md").read_text(encoding="utf-8")
document = Document()
section = document.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.6)
section.bottom_margin = Inches(0.6)
section.left_margin = Inches(0.7)
section.right_margin = Inches(0.7)

for style_name in ["Normal", "Title", "Subtitle", "Heading 1"]:
    style = document.styles[style_name]
    style.font.name = "Arial"
    style.font.color.rgb = RGBColor(0, 0, 0)

normal = document.styles["Normal"]
normal.font.size = Pt(10.5)
normal.paragraph_format.line_spacing = 1.0
normal.paragraph_format.space_after = Pt(4)
normal.paragraph_format.widow_control = True

title = document.styles["Title"]
title.font.size = Pt(20)
title.font.bold = True
title.paragraph_format.space_after = Pt(3)
title.paragraph_format.keep_with_next = True

subtitle = document.styles["Subtitle"]
subtitle.font.size = Pt(9)
subtitle.font.italic = False
subtitle.paragraph_format.space_after = Pt(9)
subtitle.paragraph_format.keep_with_next = True

heading = document.styles["Heading 1"]
heading.font.size = Pt(11)
heading.font.bold = True
heading.paragraph_format.space_before = Pt(6)
heading.paragraph_format.space_after = Pt(3)
heading.paragraph_format.keep_with_next = True

expected = []
for line in source.splitlines():
    if not line.strip():
        continue
    if line.startswith("# "):
        text = line[2:]
        paragraph = document.add_paragraph(text, "Title")
    elif line.startswith("## "):
        text = line[3:]
        paragraph = document.add_paragraph(text, "Heading 1")
    elif line.startswith("Draft for "):
        text = line
        paragraph = document.add_paragraph(text, "Subtitle")
    else:
        text = line.replace("**", "")
        paragraph = document.add_paragraph()
        for index, fragment in enumerate(re.split(r"\*\*(.*?)\*\*", line)):
            run = paragraph.add_run(fragment)
            run.bold = index % 2 == 1
    expected.append(text)

document.core_properties.title = "Give quiet responders a way back"
document.core_properties.subject = "Rook Dispatch product brief"
document.core_properties.author = ""
document.core_properties.last_modified_by = ""
output = folder / "brief.docx"
document.save(output)
verified = Document(output)
assert [paragraph.text for paragraph in verified.paragraphs] == expected
print(f"Created {output}; all {len(expected)} paragraphs match the source.")
