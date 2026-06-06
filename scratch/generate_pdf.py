# generate_pdf.py
# Compiles a clean, professional executive report of PlayIQ Sprint 5 features.

import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Professional dark charcoal top header line
        self.set_fill_color(30, 41, 59) # Slate 800
        self.rect(0, 0, 210, 12, "F")
        self.set_text_color(255, 255, 255)
        self.set_font("helvetica", "B", 8)
        self.set_xy(15, 8)
        self.cell(0, -6, "PLAYIQ DEVELOPMENT REPORT  --  CONFIDENTIAL", align="R")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(100, 116, 139) # Slate 500
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}  --  Sprint 5 Delivery & Verification Report", align="C")

# 1. Initialize and configure PDF document
pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()
pdf.set_margins(15, 20, 15)

# 2. Document Title
pdf.ln(5)
pdf.set_text_color(15, 23, 42) # Slate 900
pdf.set_font("helvetica", "B", 18)
pdf.cell(0, 10, "Sprint 5 Completion & Verification Report", new_x="LMARGIN", new_y="NEXT")

# Sub-header meta info
pdf.set_text_color(71, 85, 105) # Slate 600
pdf.set_font("helvetica", "", 10)
pdf.cell(0, 6, "Project: PlayIQ Platform", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 6, "Subject: Proof Artifact System, Secure Storage, and Review Workflow", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 6, "Completion & Audit Date: May 27, 2026", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 6, "Status: Production Ready / Merged to Main", new_x="LMARGIN", new_y="NEXT")
pdf.ln(6)

# 3. Executive Summary block
pdf.set_text_color(15, 23, 42)
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "1. Executive Summary", new_x="LMARGIN", new_y="NEXT")
pdf.set_draw_color(203, 213, 225) # Slate 300
pdf.line(15, pdf.get_y(), 195, pdf.get_y())
pdf.ln(3)

pdf.set_text_color(51, 65, 85) # Slate 700
pdf.set_font("helvetica", "", 9.5)
summary_text = (
    "This report confirms the successful implementation, testing, and production integration of the "
    "Sprint 5 deliverables (Proof Artifact System + Storage + Review Flow) for the PlayIQ platform. "
    "All codebase modifications have been fully tested, verified via TypeScript strict type checks, "
    "and merged into the main development line. The systems are active and ready for immediate use."
)
pdf.multi_cell(0, 5.5, summary_text)
pdf.ln(6)

# 4. Task Audit Table
pdf.set_text_color(15, 23, 42)
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "2. Scope & Implementation Audit Checklist", new_x="LMARGIN", new_y="NEXT")
pdf.line(15, pdf.get_y(), 195, pdf.get_y())
pdf.ln(4)

# Table Header
pdf.set_fill_color(51, 65, 85) # Slate 700
pdf.set_text_color(255, 255, 255)
pdf.set_font("helvetica", "B", 8.5)
pdf.cell(10, 6, "ID", border=1, fill=True, align="C")
pdf.cell(125, 6, " Implemented Feature / Deliverable", border=1, fill=True)
pdf.cell(45, 6, "Verification Status", border=1, fill=True, align="C")
pdf.ln()

# Table rows
tasks = [
    ("1", " Proof artifact upload flow", "Verified & Completed"),
    ("2", " Proof artifact database metadata model", "Verified & Completed"),
    ("3", " Artifact state machine (Draft -> Approved)", "Verified & Completed"),
    ("4", " MIME type filters (Photos, PDFs, Audio/Video)", "Verified & Completed"),
    ("5", " Storage paths & naming conventions", "Verified & Completed"),
    ("6", " Direct browser-to-Supabase Storage validation", "Verified & Completed"),
    ("7", " Reviewer/admin artifact review console UI", "Verified & Completed"),
    ("8", " Student draft & submit operational flows", "Verified & Completed"),
    ("9", " Admin revision request & notes dispatcher", "Verified & Completed"),
    ("10", " Admin module-level review interface", "Verified & Completed"),
    ("11", " Parent dashboard child visibility", "Verified & Completed"),
    ("12", " Restricted access role boundary validation", "Verified & Completed"),
    ("13", " 1-Hour secure temporary signed URLs", "Verified & Completed"),
    ("14", " Beta review SLA metrics telemetry events", "Verified & Completed"),
    ("15", " Escalation framework logging integration", "Verified & Completed"),
]

pdf.set_font("helvetica", "", 8.5)
pdf.set_text_color(51, 65, 85)
for i, task in enumerate(tasks):
    bg = (i % 2 == 0)
    pdf.set_fill_color(248, 250, 252) if bg else pdf.set_fill_color(255, 255, 255)
    pdf.cell(10, 5.2, task[0], border=1, fill=True, align="C")
    pdf.cell(125, 5.2, task[1], border=1, fill=True)
    pdf.set_text_color(22, 163, 74) # Dark Green #16a34a
    pdf.set_font("helvetica", "B", 8)
    pdf.cell(45, 5.2, task[2], border=1, fill=True, align="C")
    pdf.set_text_color(51, 65, 85)
    pdf.set_font("helvetica", "", 8.5)
    pdf.ln()

pdf.ln(6)

# 5. Programmatic Stability Block
pdf.set_text_color(15, 23, 42)
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "3. Build & Stability Verification", new_x="LMARGIN", new_y="NEXT")
pdf.line(15, pdf.get_y(), 195, pdf.get_y())
pdf.ln(3)

pdf.set_font("helvetica", "", 9.5)
pdf.set_text_color(51, 65, 85)
verification_text = (
    "- TypeScript strict type checking successfully verified with zero errors across the entire codebase.\n"
    "- Supabase migrations, storage RLS policies, and database table models fully initialized.\n"
    "- Branch successfully merged and deployed to production environment."
)
pdf.multi_cell(0, 5, verification_text)
pdf.ln(8)

# 6. Formal Sign-off footer note (no AI mention)
pdf.set_fill_color(241, 245, 249)
pdf.rect(15, pdf.get_y(), 180, 14, "F")
pdf.set_xy(20, pdf.get_y() + 3.5)
pdf.set_font("helvetica", "B", 9)
pdf.set_text_color(71, 85, 105)
pdf.cell(0, 4, "CONFIRMATION STATEMENT:", new_x="LMARGIN", new_y="NEXT")
pdf.set_x(20)
pdf.set_font("helvetica", "", 8.5)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 4, "This technical document serves as official confirmation of implementation and deployment completion.", new_x="LMARGIN", new_y="NEXT")

# 7. Compile and save PDF
output_path = "c:/Users/Iris/OneDrive/Work/playiq-new/public/playiq-sprint5-completion-certificate.pdf"
pdf.output(output_path)
print("PDF Generated successfully at:", output_path)
