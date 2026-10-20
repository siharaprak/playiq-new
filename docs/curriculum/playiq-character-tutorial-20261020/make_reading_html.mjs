import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { marked } = await import(pathToFileURL(require.resolve('marked')).href);
const root = dirname(fileURLToPath(import.meta.url));
const names = [...Array.from({ length: 11 }, (_, i) => `Module_${i}_Student_Text.md`),
  'Capstone_Student_Text.md'];
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const modules = names.map((name, i) => {
  const source = readFileSync(join(root, name), 'utf8');
  const title = source.split('\n')[0].replace(/^# /, '');
  return { id: `module-${i}`, title, html: marked.parse(source) };
});
const combined = readFileSync(join(root,
  'PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261020.md'), 'utf8');
const introduction = combined.split('\\newpage')[0];
const nav = modules.map((m) => `<a href="#${m.id}">${escape(m.title)}</a>`).join('\n');
const output = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>PlayIQ - Complete Course Reading Edition - October 20, 2026</title>
<style>
:root{color-scheme:light;--ink:#172a3a;--accent:#095f75;--line:#d3e0e5}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:17px/1.65 system-ui,-apple-system,sans-serif}
nav{position:fixed;left:0;top:0;bottom:0;width:265px;padding:28px 20px;background:#f5f8fa;overflow:auto;border-right:1px solid var(--line)}
nav strong{display:block;margin-bottom:12px;font-size:20px}nav a{display:block;padding:9px 0;color:#154a60;line-height:1.4;text-decoration:none;border-bottom:1px solid #e4eaee}
nav a:hover,nav a:focus{text-decoration:underline}main{margin-left:265px;max-width:1110px;padding:42px 54px 100px;overflow-wrap:anywhere}
section{padding-top:20px;margin-bottom:65px;scroll-margin-top:20px}h1{font-size:2rem;line-height:1.25;color:#153b50}h2{font-size:1.45rem;line-height:1.35;margin-top:2rem;color:#15546b}h3{font-size:1.12rem;margin-top:1.7rem}
p,li{max-width:85ch}a{color:#066380}blockquote{margin:24px 0;padding:10px 22px;border-left:4px solid #48a2b4;background:#f5fafb}blockquote p{margin:5px 0}
pre{position:relative;margin:24px 0;padding:46px 18px 20px;background:#f5f7f9;border:1px solid var(--line);border-radius:8px;overflow:auto;font-size:14px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}p code,li code{background:#f1f4f6;padding:1px 4px}pre code{display:block;max-width:100%;background:none;padding:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
.diagram code{min-width:max-content;white-space:pre;overflow-wrap:normal;word-break:normal}
.copy{position:absolute;right:10px;top:9px;background:#fff;border:1px solid #7899a8;border-radius:4px;padding:6px 10px;color:#16455b;cursor:pointer;font:13px system-ui}
table{border-collapse:collapse;width:100%;margin:22px 0;font-size:14px;table-layout:fixed}th,td{border:1px solid #c6d6de;padding:9px;vertical-align:top;overflow-wrap:anywhere}th{background:#edf3f6;text-align:left}
img{display:block;max-width:320px;max-height:430px;width:auto;height:auto;margin:22px auto}hr{border:0;border-top:1px solid var(--line);margin:30px 0}
.notice{padding:14px 18px;border:1px solid var(--line);border-radius:8px;background:#f7fafb}.print-link{display:block;margin-top:16px;font-weight:600}
@media(max-width:900px){nav{position:static;width:auto;max-height:300px}main{margin:0;padding:25px 20px}table{font-size:12px}}
@media print{nav,.copy,.screen-only{display:none}main{margin:0;padding:0;max-width:none}body{font:10pt/1.4 Arial,sans-serif;color:#111}section{break-before:page}pre{padding:10px;font-size:8pt;border-color:#bbb}h1,h2,h3{break-after:avoid}a{color:inherit}table{font-size:8pt}img{max-height:220px}}
</style></head><body><nav aria-label="Course modules"><strong>PlayIQ Course 1</strong><a href="#overview">Reading guide</a>${nav}
<a class="print-link" href="output/pdf/PLAYIQ_CURRENT_COMBINED_COURSE_LIGHT_PRINT_20261020.pdf">Open print PDF</a>
<p style="font-size:13px">Complete student text.<br>Revision: October 20, 2026.<br>Website deployment is separate.</p></nav><main>
<section id="overview"><p class="notice">Complete reading edition with a white background. Use the module links to move through the course. Copy buttons copy whole code blocks; when clipboard access is unavailable, the block is selected for you to copy manually. The PDF is the print edition.</p>
${marked.parse(introduction)}</section>
${modules.map((m) => `<section id="${m.id}">${m.html}</section>`).join('\n')}
</main><script>
document.querySelectorAll('pre > code').forEach((code) => {
  if (/[┌─═║╔]/.test(code.textContent)) code.parentNode.classList.add('diagram');
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'copy'; button.textContent = 'Copy block';
  button.setAttribute('aria-label', 'Copy this complete prompt or reference block');
  button.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('manual copy');
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
    } catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      button.textContent = 'Selected: press Ctrl/Cmd+C';
    }
  });
  code.parentNode.insertBefore(button, code);
});
</script></body></html>`;
const target = join(root, 'PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261020.html');
writeFileSync(target, output, 'utf8');
console.log(`Created ${target}`);
