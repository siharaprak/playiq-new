"""Check course-source preservation and compiled artifacts; never call providers."""
from pathlib import Path
import difflib
import hashlib
import json
import re
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
BASELINE_COMMIT = "01cc75552ad9221db41af1c99853e09b52defd32"
NAMES = [f"Module_{i}_Student_Text.md" for i in range(11)] + ["Capstone_Student_Text.md"]
COMBINED = "PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261020.md"
PDF = "output/pdf/PLAYIQ_CURRENT_COMBINED_COURSE_LIGHT_PRINT_20261020.pdf"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def baseline_path(name):
    git_source = ROOT.parent / "playiq-tutor-pathway-20261007" / name
    if git_source.exists():
        return git_source
    index = 11 if name.startswith("Capstone") else int(name.split("_")[1])
    batch = 1 if index <= 2 else 2 if index <= 6 else 3
    return ROOT.parent / f"Reconstructed_Batch{batch}" / name


def main():
    checks = []
    modules = {}

    def check(label, value):
        checks.append({"check": label, "passed": bool(value)})
        if not value:
            raise AssertionError(label)

    combined = (ROOT / COMBINED).read_text()
    allowed_removals = {
        "Module_1_Student_Text.md": {
            "# PlayIQ Module 1: The AI Learning Code",
            "Your brain builds neural pathways only when it encounters productive friction—when you struggle to recall a formula, when you search for the right word, or when you troubleshoot a logic error. If you let the AI do that heavy lifting, your brain atrophies while the AI stays smart.",
        },
        "Module_2_Student_Text.md": {
            "If you feed it genuine curiosity, disciplined questions, and a desire to understand, AI can accelerate your learning faster than any private tutor in history. But if you feed it laziness, avoidance, and short-term panic, AI will accelerate your dependence, erode your focus, and replace your own voice with robotic prose.",
        },
    }
    for name in NAMES:
        current_path = ROOT / name
        baseline = baseline_path(name)
        old = baseline.read_text()
        new = current_path.read_text()
        removed = []
        added = 0
        old_lines, new_lines = old.splitlines(), new.splitlines()
        for kind, a, b, c, d in difflib.SequenceMatcher(None, old_lines, new_lines).get_opcodes():
            if kind in {"delete", "replace"}:
                removed.extend(line for line in old_lines[a:b] if line.strip())
            if kind in {"insert", "replace"}:
                added += sum(bool(line.strip()) for line in new_lines[c:d])
        check(f"{name}: no unapproved content removed",
              set(removed) <= allowed_removals.get(name, set()))
        if name in {"Module_8_Student_Text.md", "Module_9_Student_Text.md"}:
            check(f"{name}: every original line retained", not removed)
        check(f"{name}: exact source appears in combined reading copy", new.strip() in combined)
        check(f"{name}: code fences balanced", len(re.findall(r"^```", new, re.M)) % 2 == 0)
        beta = re.findall(r"^## Beta[^\n]*", new, re.M | re.I)
        check(f"{name}: one beta-only feedback section", len(beta) == 1)
        tail = new[new.index(beta[0]) + len(beta[0]):]
        check(f"{name}: beta feedback is final section", not re.search(r"^## ", tail, re.M))
        for target in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", new):
            if not re.match(r"(?:https?://|#)", target):
                check(f"{name}: local link exists: {target}", (ROOT / target).exists())
        modules[name] = {"baseline_sha256": digest(baseline), "sha256": digest(current_path),
                         "added_nonempty_lines": added, "removed_nonempty_lines": removed}

    m1 = (ROOT / NAMES[1]).read_text()
    interview = m1.split("1. What fictional name", 1)[1].split("After question ten", 1)[0]
    check("Module 1: ten interview questions", len(re.findall(r"^\d+\. ", "1. What fictional name" + interview, re.M)) == 10)
    first_win = m1.split("## Your mission:", 1)[0]
    check("Module 1: creative first win precedes school lessons", "### Step 7:" in first_win)
    check("Module 1: no algebra opener", "algebra" not in first_win.lower())
    check("Module 1: exact save, reuse, and capability fallback steps",
          all(s in first_win for s in ["one new private chat", "not run yet", "close the saved card".capitalize(), "text-only guardrail test"]))
    check("Module 1: prompt exercise is not presented as LoRA training", "does not train\na model or create a LoRA" in first_win)
    for index in range(5, 11):
        text = (ROOT / NAMES[index]).read_text()
        check(f"Module {index}: no recurring character connection activity", "**Character connection," not in text)
    m9 = (ROOT / NAMES[9]).read_text()
    check("Module 9: six-file integration preserved", "## Part 8: Build the six final files" in m9)
    check("Module 9: existing Project update preserved", "## Part 9: Update the Tutor Project you already created" in m9)
    reader = PdfReader(ROOT / PDF)
    pdf_text = re.sub(r"\s+", " ", "\n".join(page.extract_text() or "" for page in reader.pages))
    for name in NAMES:
        first_line = (ROOT / name).read_text().splitlines()[0].removeprefix("# ")
        check(f"PDF contains {name}", first_line in pdf_text)
    check("PDF contains the new tutorial", all(s in pdf_text for s in ["CHARACTER GUARDRAIL CARD", "floating", "Step 7:"]))
    check("Orion reference matches the pinned existing site asset",
          digest(ROOT / "assets/orion-reference.png") ==
          "46c38b05a2848d3f4cdabb7f62d1d9b738c3f6efa66fb26bcace46121aa25b54")
    result = {"revision": "2026-10-20", "baseline_commit": BASELINE_COMMIT,
              "evidence_classification": "source_and_local_artifacts_only",
              "runtime_or_student_beta_verified": False,
              "pdf_pages": len(reader.pages), "modules": modules, "checks": checks}
    (ROOT / "VERIFICATION_RESULTS.json").write_text(json.dumps(result, indent=2) + "\n")
    files = sorted(p for p in ROOT.rglob("*") if p.is_file()
                   and p.name not in {"SOURCE_MANIFEST.json"} and "__pycache__" not in p.parts)
    manifest = {"revision": "2026-10-20", "baseline_commit": BASELINE_COMMIT,
                "files": {str(p.relative_to(ROOT)): digest(p) for p in files}}
    (ROOT / "SOURCE_MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"checks_passed": len(checks), "pdf_pages": len(reader.pages),
                      "module_sources": len(modules), "manifest_files": len(files)}))


if __name__ == "__main__":
    main()
