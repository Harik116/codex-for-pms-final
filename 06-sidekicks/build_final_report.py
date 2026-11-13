import hashlib
import json
import re
from pathlib import Path


root = Path(__file__).resolve().parents[1]
modules = [
    ("01-origin-story", 2, "Origin Story"),
    ("02-super-hearing", 6, "Super Hearing"),
    ("03-rewind", 15, "Rewind"),
    ("04-x-ray-vision", 7, "X-Ray Vision"),
    ("05-super-speed", 20, "Super Speed"),
    ("06-sidekicks", 5, "Sidekicks"),
]
prompts = []
for folder, number, name in modules:
    source = (root / folder / "prompts.md").read_text(encoding="utf-8")
    matches = list(re.finditer(r"^### (\d+)\.\n", source, re.MULTILINE))
    selected = next(match for match in matches if int(match[1]) == number)
    next_start = next((match.start() for match in matches if match.start() > selected.start()), len(source))
    prompt = source[selected.end():next_start].lstrip("\n").rstrip("\n")
    assert prompt.strip()
    prompts.append({"module": name, "number": number, "path": f"{folder}/prompts.md", "text": prompt})

weekly_source = (root / "03-rewind/weekly-ping-evidence.md").read_text(encoding="utf-8")
weekly = []
pattern = r"^\| (2026-\d{2}-\d{2}) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| ([\d.]+)% \|$"
for match in re.finditer(pattern, weekly_source, re.MULTILINE):
    week, pings, taken, declined, missed, acceptance = match.groups()
    weekly.append({"week": week, "pings": int(pings), "taken": int(taken), "declined": int(declined), "missed": int(missed), "acceptance": float(acceptance)})
assert len(weekly) == 10
assert sum(row["pings"] for row in weekly) == 1696
responder_rows = []
for match in re.finditer(r"^\| (2026-\d{2}-\d{2}) \| (Meteor Mite|The Gale) \| (\d+) \| (\d+) \|$", weekly_source, re.MULTILINE):
    week, responder, pings, taken = match.groups()
    responder_rows.append({"week": week, "responder": responder, "pings": int(pings), "taken": int(taken)})
assert len(responder_rows) == 20
for row in weekly:
    for name, key in [("Meteor Mite", "mite"), ("The Gale", "gale")]:
        source_row = next(item for item in responder_rows if item["week"] == row["week"] and item["responder"] == name)
        row[key] = source_row["pings"]
        row[f"{key}Taken"] = source_row["taken"]

tracked_sources = ["AGENTS.md", "03-rewind/weekly-ping-evidence.md", "03-rewind/ticket-ping-comparison.md", "03-rewind/three-question-investigation.md", "05-super-speed/brief.md", "05-super-speed/prototype.html", ".agents/skills/review-checklist/SKILL.md"]
data = {
    "prompts": prompts,
    "weekly": weekly,
    "prototype": (root / "05-super-speed/prototype.html").read_text(encoding="utf-8"),
    "skill": (root / ".agents/skills/review-checklist/SKILL.md").read_text(encoding="utf-8"),
    "sources": [{"path": name, "sha256": hashlib.sha256((root / name).read_bytes()).hexdigest()} for name in tracked_sources],
}
template = (root / "06-sidekicks/final-report.template.html").read_text(encoding="utf-8")
assert template.count("__REPORT_DATA__") == 1
serialized = json.dumps(data, ensure_ascii=True).replace("<", "\\u003c")
output = root / "final-report.html"
output.write_text(template.replace("__REPORT_DATA__", serialized), encoding="utf-8")
print(f"Created {output}; six exact prompts, ten weekly rows, and complete embedded prototype.")
