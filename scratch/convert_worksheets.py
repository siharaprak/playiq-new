import os
import re

src_dir = r"c:\Users\Iris\OneDrive\Work\playiq-new\public\worksheets"
dest_dir = r"c:\Users\Iris\OneDrive\Work\playiq-new\public\worksheets"

# List all markdown files in the worksheets folder
files = [f for f in os.listdir(src_dir) if f.endswith(".md")]

html_header_template = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  body {{
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    margin: 40px auto;
    max-width: 800px;
    padding: 0 20px;
    background-color: #ffffff;
  }}
  h1 {{
    font-size: 26px;
    color: #0f172a;
    border-bottom: 3px solid #7b4fce;
    padding-bottom: 12px;
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }}
  h2, h3 {{
    font-size: 18px;
    color: #7b4fce;
    margin-top: 35px;
    margin-bottom: 15px;
    border-left: 4px solid #00c8ff;
    padding-left: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}
  p {{
    font-size: 14px;
    margin-bottom: 12px;
    color: #334155;
  }}
  ul {{
    list-style-type: none;
    padding-left: 5px;
    margin-bottom: 18px;
  }}
  li {{
    font-size: 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }}
  .checkbox {{
    font-size: 18px;
    font-family: monospace;
    color: #94a3b8;
    margin-right: 10px;
    user-select: none;
  }}
  .instructions {{
    background-color: #f8fafc;
    border-left: 4px solid #7b4fce;
    padding: 15px;
    margin-bottom: 30px;
    font-size: 13px;
    color: #475569;
    font-style: italic;
  }}
  .question {{
    font-size: 14px;
    font-weight: bold;
    color: #0f172a;
    margin-top: 25px;
    margin-bottom: 8px;
  }}
  .response-box {{
    background-color: #f8fafc;
    border: 1px dashed #7b4fce;
    border-left: 4px solid #7b4fce;
    padding: 15px 20px;
    margin: 10px 0 25px 0;
    border-radius: 4px;
    color: #475569;
  }}
  .response-label {{
    margin: 0 0 6px 0;
    font-size: 10px;
    font-weight: bold;
    color: #7b4fce;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: monospace;
  }}
  .response-placeholder {{
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
    font-style: italic;
  }}
  hr {{
    border: 0;
    border-top: 1px solid #e2e8f0;
    margin: 40px 0;
  }}
</style>
</head>
<body>
"""

html_footer = """
</body>
</html>
"""

def convert_md_to_html_doc(md_content, title="PlayIQ Worksheet"):
    lines = md_content.split("\n")
    html_parts = []
    
    in_instructions = False
    in_list = False
    
    for line in lines:
        line_stripped = line.strip()
        
        if not line_stripped:
            continue
            
        # Title `# Title`
        if line_stripped.startswith("# "):
            title_text = line_stripped[2:]
            html_parts.append(f"<h1>{title_text}</h1>")
            continue
            
        # Headers `### 🧩 Part`
        if line_stripped.startswith("### "):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            header_text = line_stripped[4:]
            # Strip emoji if any
            header_text = re.sub(r"^[^\w]*", "", header_text)
            html_parts.append(f"<h3>{header_text}</h3>")
            continue
            
        # Horizontal rules
        if line_stripped == "---":
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            html_parts.append("<hr>")
            continue
            
        # Instructions block
        if "Instructions:" in line_stripped or "**Instructions:**" in line_stripped:
            in_instructions = True
            text = line_stripped.replace("**Instructions:**", "").replace("Instructions:", "").strip()
            html_parts.append(f'<div class="instructions"><strong>Instructions:</strong> {text}</div>')
            continue
            
        # Question lines e.g. `**1.` or `**2.`
        if line_stripped.startswith("**") and any(line_stripped.startswith(f"**{i}.") for i in range(1, 25)):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            # Extract question text
            q_text = line_stripped.replace("**", "").strip()
            html_parts.append(f'<div class="question">{q_text}</div>')
            continue
            
        # Answer boxes
        if line_stripped.startswith("> ✍️") or line_stripped.startswith("> *Enter your analysis") or line_stripped.startswith("✍️") or "[ YOUR RESPONSE ]" in line_stripped:
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            # Render a premium editable answer box
            html_parts.append("""<div class="response-box">
  <p class="response-label">✍️ Student Response Area (Double-click to type)</p>
  <p class="response-placeholder">[ Type your conceptual answer or explanation here... ]</p>
</div>""")
            continue
            
        # Multiple choices e.g. `* `[ ]` text`
        if line_stripped.startswith("* `[ ]` ") or line_stripped.startswith("* `[ ]`"):
            if not in_list:
                html_parts.append("<ul>")
                in_list = True
            choice_text = line_stripped.replace("* `[ ]` ", "").replace("* `[ ]`", "").strip()
            html_parts.append(f'<li><span class="checkbox">&#9744;</span> {choice_text}</li>')
            continue

        # Regular lists
        if line_stripped.startswith("* "):
            if not in_list:
                html_parts.append("<ul>")
                in_list = True
            item_text = line_stripped[2:].strip()
            html_parts.append(f'<li>{item_text}</li>')
            continue
            
        # Skip generic responses placeholders
        if "Enter your analysis" in line_stripped:
            continue
            
        # Default paragraph
        if not line_stripped.startswith(">"):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            html_parts.append(f"<p>{line_stripped}</p>")

    if in_list:
        html_parts.append("</ul>")
        
    return html_header_template.format(title=title) + "\n".join(html_parts) + html_footer

for filename in files:
    src_path = os.path.join(src_dir, filename)
    
    # Generate .doc output name
    doc_filename = filename.replace(".md", ".doc")
    dest_path = os.path.join(dest_dir, doc_filename)
    
    with open(src_path, "r", encoding="utf-8") as f:
        md_content = f.read()
        
    title = filename.replace("_", " ").replace(".md", "")
    html_doc = convert_md_to_html_doc(md_content, title=title)
    
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(html_doc)
        
    print(f"Generated editable Word template: {filename} -> {doc_filename}")

print("All worksheets processed successfully!")
