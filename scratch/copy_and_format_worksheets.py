# scratch/copy_and_format_worksheets.py
# Copies worksheets from Downloads to public/worksheets/ and formats them beautifully.

import os
import re

src_dir = r"C:\Users\Iris\Downloads\playiq-worksheet"
dest_dir = r"c:\Users\Iris\OneDrive\Work\playiq-new\public\worksheets"

# Ensure destination directory exists
os.makedirs(dest_dir, exist_ok=True)

# List files
files = [f for f in os.listdir(src_dir) if f.endswith(".md")]

for filename in files:
    src_path = os.path.join(src_dir, filename)
    dest_path = os.path.join(dest_dir, filename)
    
    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Beautify content:
    # 1. Clean up `<br><br><br>` or multiple line breaks with an elegant, presentable markdown answer box.
    # An elegant answer box in Markdown can look like:
    #
    # > **[ YOUR ANSWER ]**
    # > _Type or write your response here..._
    #
    # 2. Fix headings and general styling
    
    # Replace `<br><br><br>` with a nice Answer placeholder block
    cleaned = re.sub(
        r"<br\s*/?>(\s*<br\s*/?>)*", 
        "\n\n> ✍️ **[ YOUR RESPONSE ]**\n> *Enter your analysis or explanation here...*\n\n", 
        content
    )
    
    # Make sure heading titles are formatted with nice styling
    cleaned = cleaned.replace("### Part ", "\n---\n\n### 🧩 Part ")
    cleaned = cleaned.replace("a) ", "* `[ ]` ")
    cleaned = cleaned.replace("b) ", "* `[ ]` ")
    cleaned = cleaned.replace("c) ", "* `[ ]` ")
    cleaned = cleaned.replace("d) ", "* `[ ]` ")
    
    # Write to destination
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(cleaned)
        
    print(f"Formatted and copied: {filename} -> {dest_path}")
