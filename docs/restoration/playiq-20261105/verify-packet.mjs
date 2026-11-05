import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Read-only verification. No network, credentials, writes, installs or application launch.
const packet = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(packet, '../../..');
const prefix = 'docs/restoration/playiq-20261105/';
const manifest = JSON.parse(fs.readFileSync(path.join(packet, 'SOURCE_MANIFEST.json'), 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024 });
let checked = 0;

function verify(relative, expected) {
  assert.match(expected, /^[a-f0-9]{64}$/, `Invalid SHA256 for ${relative}`);
  const full = path.resolve(root, relative);
  assert.ok(full.startsWith(root + path.sep), 'Reference must remain inside the checkout');
  assert.equal(sha256(fs.readFileSync(full)), expected, `Source mismatch: ${relative}`);
  checked++;
}
for (const [relative, expected] of Object.entries(manifest.referenceFiles)) verify(relative, expected);
const curriculumPath = path.dirname(manifest.curriculumManifest);
const curriculum = JSON.parse(fs.readFileSync(path.join(root, manifest.curriculumManifest), 'utf8'));
for (const [relative, expected] of Object.entries(curriculum.files)) verify(path.join(curriculumPath, relative), expected);
assert.equal(curriculum.course_sections, 15);
assert.equal(curriculum.capstone_module, 14);
assert.equal(manifest.publicationScope, 'HANDOFF_DOCUMENTS_ONLY');
assert.equal(manifest.courseApplicationChanged, false);
assert.equal(manifest.deployed, false);
assert.equal(manifest.mediaNarrationVerified, false);

for (const commit of [manifest.integrationBase, manifest.recoveredVisualSource,
  '20c7689480dddf5e03c536479fb7b53cea6cf082', 'cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d']) {
  assert.match(commit, /^[a-f0-9]{40}$/);
  git('cat-file', '-e', `${commit}^{commit}`);
  git('merge-base', '--is-ancestor', commit, 'HEAD');
}
for (const relative of ['src/app/globals.css', 'src/app/layout.tsx', 'src/components/layout/PlayIQLogo.tsx']) {
  assert.deepEqual(git('show', `${manifest.recoveredVisualSource}:${relative}`),
    git('show', `${manifest.integrationBase}:${relative}`), `Visual reference parity changed: ${relative}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [path.relative(root, full).split(path.sep).join('/')];
  });
}
const files = walk(packet);
for (const relative of files.filter(file => /\.(?:md|txt)$/.test(file))) {
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!link || /^(?:https?:|\/)/.test(link)) continue;
    assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root, relative)), link)), `Broken local link: ${relative} -> ${link}`);
  }
}
const prompt = fs.readFileSync(path.join(packet, 'IRIS_PASTE_PROMPT.txt'), 'utf8');
assert.ok(prompt.includes('floating Orion'));
assert.ok(prompt.includes('NOT changing UI or UX'));
assert.ok(prompt.includes('Modules 00, 1 and 2'));
assert.ok(prompt.includes('Capstone at 14'));

let committedFiles = 0;
if (process.argv.includes('--committed')) {
  const changed = git('diff', '--name-only', manifest.integrationBase, 'HEAD').toString('utf8').trim().split('\n').filter(Boolean);
  assert.ok(changed.length > 0, 'No handoff commit found');
  assert.ok(changed.every(file => file.startsWith(prefix)), 'This handoff must change documents only');
  for (const relative of files) {
    assert.equal(sha256(git('show', `HEAD:${relative}`)), sha256(fs.readFileSync(path.join(root, relative))), `Committed file missing or different: ${relative}`);
    committedFiles++;
  }
}
console.log(JSON.stringify({ status: 'PASS', sourceHashesChecked: checked, packetFiles: files.length,
  committedFiles, documentationOnly: process.argv.includes('--committed'),
  applicationChanged: false, deployed: false }, null, 2));
