"""Verify the 15-section PlayIQ source package and locally compiled editions."""
from pathlib import Path
import hashlib
import html as html_lib
import json
import re

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
BASELINE = ROOT.parent / "playiq-character-tutorial-20261020"
NAMES = ["Module_00_Student_Text.md"] + [
    f"Module_{index:02d}_Student_Text.md" for index in range(1, 15)
]
COMBINED = ROOT / "PLAYIQ_COMPLETE_COURSE_MASTER_20261027.md"
HTML = ROOT / "PLAYIQ_COMPLETE_COURSE_MASTER_20261027.html"
PDF = ROOT / "output" / "pdf" / "PLAYIQ_COMPLETE_COURSE_LIGHT_PRINT_20261027.pdf"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalize_title(value: str) -> str:
    return value.replace("—", "-").replace("–", "-").replace("‑", "-")


def main() -> None:
    checks = []

    def check(label: str, passed: bool) -> None:
        checks.append({"check": label, "passed": bool(passed)})
        if not passed:
            raise AssertionError(label)

    sources = {name: (ROOT / name).read_text(encoding="utf-8") for name in NAMES}
    combined = COMBINED.read_text(encoding="utf-8")
    html = HTML.read_text(encoding="utf-8")

    check("exactly 15 source sections exist", len(NAMES) == 15 and all((ROOT / n).is_file() for n in NAMES))
    check("Module 14 is the Capstone", sources[NAMES[-1]].startswith("# PlayIQ Module 14: Capstone"))
    check("no separate Capstone source remains", not (ROOT / "Capstone_Student_Text.md").exists())
    check("combined Markdown exists", COMBINED.is_file())
    check("reading HTML exists", HTML.is_file())
    check("print PDF exists", PDF.is_file())
    check("combined edition states 15 sections", "Module 00 plus Modules 1–14 = 15 sections total" in combined)

    for index, name in enumerate(NAMES):
        text = sources[name]
        check(f"{name}: included verbatim in combined edition", text.strip() in combined)
        check(f"{name}: balanced code fences", len(re.findall(r"^```", text, re.M)) % 2 == 0)
        feedback = list(re.finditer(r"^##[^\n]*beta[^\n]*feedback[^\n]*$", text, re.M | re.I))
        check(f"{name}: exactly one beta-only feedback section", len(feedback) == 1)
        if feedback:
            tail = text[feedback[0].end():]
            check(f"{name}: feedback is the final module section", not re.search(r"^##\s+", tail, re.M))
        for target in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", text):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            clean_target = target.split("#", 1)[0]
            if clean_target:
                check(f"{name}: local link exists ({clean_target})", (ROOT / clean_target).exists())
        if index <= 8:
            old_index = 0 if index == 0 else index
            baseline_name = f"Module_{old_index}_Student_Text.md"
            baseline = (BASELINE / baseline_name).read_text(encoding="utf-8")
            expected = baseline.replace("Module 0", "Module 00")
            if index == 0:
                expected = expected.replace(
                    "your Personal Assistant is a separate build at the very end of the Capstone.",
                    "your Personal Assistant is a separate build in Module 11.",
                ).replace(
                    "**PlayIQ Tutor Project**. Keep using this same space in Modules 1–10 and the\nCapstone. If the selected account has no persistent project feature, use one",
                    "**PlayIQ Tutor Project**. Keep using this same space wherever the course asks\nyou to update your Tutor learning record, including the final review in Module\n14. Keep the Personal Assistant work in Modules 11-12 separate. If the\nselected account has no persistent project feature, use one",
                )
            check(f"{name}: October 20 lesson content preserved apart from Module 00 label", text == expected)

    check("Module 9 builds the existing Module 00 Tutor Project", all(
        phrase in sources[NAMES[9]] for phrase in [
            "# PlayIQ Module 9: Build Your Personal AI Tutor",
            "same Project you began in Module 00",
            "Build the six Tutor files",
            "these six separate, readable files",
            "Update the Tutor Project you already created",
            "Module 10 is where you test the finished Tutor",
        ]))
    check("Module 9 keeps a continuous build, not split visits", "These markers do not split the build into separate visits" in sources[NAMES[9]])
    check("Module 9 does not claim Tutor tests already passed", "Six stress tests executed" not in sources[NAMES[9]])
    check("Module 10 owns all six Tutor behavior tests", all(
        phrase in sources[NAMES[10]] for phrase in [
            "Test 1 — Start from what I know", "Test 2 — Give a hint",
            "Test 3 — Check learning one question at a time",
            "Test 4 — Find the missing connection",
            "Test 5 — Be honest about uncertainty",
            "Test 6 — Protect my authorship",
        ]))
    check("Module 10 teaches the repeatable new-idea learning loop", "The repeatable “new idea to learning” loop" in sources[NAMES[10]])
    check("learning preferences are not presented as fixed or guaranteed styles", "permanent diagnosis" in sources[NAMES[10]] and "a promise that one format" in sources[NAMES[10]])
    check("Module 11 builds the student's own assistant in a separate Project", all(
        phrase in sources[NAMES[11]] for phrase in [
            "Build Your Personal AI Assistant", "new private Project/workspace",
            "separate from the Tutor Project", "Assistant Brief",
        ]))
    check("Module 12 tests reminders and explains platform limits", all(
        phrase in sources[NAMES[12]] for phrase in [
            "Test 1 — A normal request", "Test 2 — A missing detail",
            "Test 3 — A boundary", "scheduled notification",
            "journaling on steroids",
        ]))
    check("Module 13 is explicitly optional and creates no required artifact", all(
        phrase in sources[NAMES[13]] for phrase in [
            "possibility preview", "not a course assignment", "no required",
            "You do not need to create a deliverable",
        ]))
    module14_text = " ".join(sources[NAMES[14]].split())
    check("Module 14 includes performance system and Learning Dashboard", all(
        phrase in module14_text for phrase in [
            "# PlayIQ Module 14: Capstone", "six-stage",
            "Build your Learning Dashboard", "Master Trial",
            "Congratulations on completing PlayIQ Course 1",
        ]))
    check("Module 14 makes follow-up price proposed and parent-facing", "proposed price for the next course is **$4,999**" in module14_text and "parent or guardian" in module14_text)
    for index in range(9, 15):
        text = sources[NAMES[index]]
        check(f"Module {index}: names its Skill Tree", "**Skill Tree:**" in text)
        check(f"Module {index}: contains a quick check or quiz", "Quiz" in text or "Quick Recall" in text or "Boss Battle: picture the path" in text)
        check(f"Module {index}: includes a mastery/boss check", "Boss Battle" in text or "Master Trial" in text)

    instruction = (ROOT / "ORION_STUDENT_TUTOR_PROJECT_COMPILATION_INSTRUCTIONS.md").read_text(encoding="utf-8")
    check("Orion instructions separate Tutor and Personal Assistant evidence", all(
        phrase in instruction for phrase in [
            "Module 11 and tested in Module 12", "Never mix its task information",
            "Module 14 is the final course review", "initial compilation outputs",
            "Module 10 tests",
        ]))

    for index, name in enumerate(NAMES):
        title = sources[name].splitlines()[0].removeprefix("# ")
        escaped_title = html_lib.escape(title, quote=False)
        check(f"HTML includes navigation and content for module {index}", f"module-{index}" in html and escaped_title in html)
    check("HTML provides all 15 module sections", len(re.findall(r'<section id="module-\d+">', html)) == 15)
    check("HTML points to the current light print PDF", "PLAYIQ_COMPLETE_COURSE_LIGHT_PRINT_20261027.pdf" in html)

    reader = PdfReader(PDF)
    pdf_text = normalize_title("\n".join(page.extract_text() or "" for page in reader.pages))
    pdf_compact = " ".join(pdf_text.split())
    check("PDF contains all 15 module titles", all(
        " ".join(normalize_title(sources[name].splitlines()[0].removeprefix("# ")).split()) in pdf_compact
        for name in NAMES
    ))
    check("PDF contains Tutor build and test sequence", "Build Your Personal AI Tutor" in pdf_text and "Test Your Tutor and Learn With It" in pdf_text)
    check("PDF contains personal assistant build and test", "Build Your Personal AI Assistant" in pdf_text and "Test Your Assistant" in pdf_text)
    check("PDF contains optional character preview and final Capstone", "Your Orion Character's Next Adventure" in pdf_text and "Capstone" in pdf_text)
    check("Orion reference image matches the pinned site asset", digest(ROOT / "assets" / "orion-reference.png") == "46c38b05a2848d3f4cdabb7f62d1d9b738c3f6efa66fb26bcace46121aa25b54")

    module_hashes = {name: digest(ROOT / name) for name in NAMES}
    result = {
        "revision": "2026-10-27",
        "course_sections": 15,
        "capstone_module": 14,
        "source_commit_base": "bca04d16b435b4359867fd99ef06448eadd558db",
        "evidence_classification": "source_and_local_artifacts_only",
        "runtime_or_student_beta_verified": False,
        "website_or_parent_dashboard_deployed": False,
        "pdf_pages": len(reader.pages),
        "module_sha256": module_hashes,
        "checks": checks,
    }
    (ROOT / "VERIFICATION_RESULTS.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    files = sorted(
        path for path in ROOT.rglob("*")
        if path.is_file() and path.name not in {"SOURCE_MANIFEST.json"}
        and "__pycache__" not in path.relative_to(ROOT).parts
        and "tmp" not in path.relative_to(ROOT).parts
    )
    manifest = {
        "revision": "2026-10-27",
        "course_sections": 15,
        "capstone_module": 14,
        "files": {str(path.relative_to(ROOT)): digest(path) for path in files},
    }
    (ROOT / "SOURCE_MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "checks_passed": sum(item["passed"] for item in checks),
        "checks_total": len(checks),
        "pdf_pages": len(reader.pages),
        "module_sources": len(NAMES),
        "manifest_files": len(files),
        "evidence_classification": result["evidence_classification"],
    }, indent=2))


if __name__ == "__main__":
    main()
