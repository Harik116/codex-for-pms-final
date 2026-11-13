from pathlib import Path

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


source_path = Path("C:/Users/Hari/.codex/skills/.system/skill-creator/SKILL.md")
source = source_path.read_text(encoding="utf-8").replace("\r\n", "\n")
output = Path(__file__).resolve().parent / "skill-creator-source.docx"
document = Document()
section = document.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.7)
section.bottom_margin = Inches(0.7)
section.left_margin = Inches(0.7)
section.right_margin = Inches(0.7)

for name in ["Normal", "Title"]:
    style = document.styles[name]
    style.font.name = "Arial"
    style.font.color.rgb = RGBColor(0, 0, 0)
document.styles["Title"].font.size = Pt(22)
document.styles["Title"].paragraph_format.space_after = Pt(8)
document.styles["Title"].paragraph_format.keep_with_next = True
document.styles["Normal"].font.size = Pt(11)
document.styles["Normal"].paragraph_format.space_after = Pt(12)

code = document.styles.add_style("Skill Source", WD_STYLE_TYPE.PARAGRAPH)
code.font.name = "Consolas"
code.font.size = Pt(9)
code.font.color.rgb = RGBColor(0, 0, 0)
code.element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:ascii"), "Consolas")
code.element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:hAnsi"), "Consolas")
code.paragraph_format.space_before = Pt(0)
code.paragraph_format.space_after = Pt(0)
code.paragraph_format.line_spacing = 1.05
code.paragraph_format.widow_control = True

document.add_paragraph("Skill Creator Source", "Title")
document.add_paragraph(
    "Complete SKILL.md instructions and embedded examples for the Skill Creator skill. "
    "The source below is reproduced without summarizing it. Supporting scripts and reference files are not included."
)
lines = source.splitlines()
for line in lines:
    document.add_paragraph(line, "Skill Source")

document.core_properties.title = "Skill Creator Source"
document.core_properties.subject = "Skill Creator SKILL.md source instructions"
document.core_properties.author = ""
document.core_properties.last_modified_by = ""
document.save(output)
verified = Document(output)
assert [paragraph.text for paragraph in verified.paragraphs[2:]] == lines
print(f"Created {output}; verified all {len(lines)} source lines unchanged.")
