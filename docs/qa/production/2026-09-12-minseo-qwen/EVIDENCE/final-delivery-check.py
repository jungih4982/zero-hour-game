"""Check local report links, PNG readability, and freeze the new batch manifest."""
from pathlib import Path
import csv, hashlib, json, re
from PIL import Image

batch = Path(__file__).resolve().parent.parent
root = Path('C:/Dev/zero-hour-game')
manifest = batch/'artifact-manifest.csv'
missing = []
mds = list(batch.rglob('*.md'))+[root/'docs/qa/README.md']
for md in mds:
    for target in re.findall(r'!?\[[^\]]*\]\(([^)\n]+)\)',md.read_text(encoding='utf-8-sig')):
        if re.match(r'https?://',target):
            continue
        linked = (md.parent/target.split('#')[0]).resolve()
        if linked != manifest and not linked.exists():
            missing.append({'document':str(md), 'target':target})
assert not missing, missing
pngs = list(batch.rglob('*.png'))
for png in pngs:
    with Image.open(png) as img:
        img.verify()
test_exit = (batch/'EVIDENCE/npm-test-after-exit.txt').read_text(encoding='utf-8-sig').strip()
cleanup = json.loads((batch/'EVIDENCE/session-cleanup.json').read_text(encoding='utf-8-sig'))
assert test_exit == '0'
assert cleanup['metroStopped'] and cleanup['isolatedEmulatorStopped'] and cleanup['savePreserved']
result = {'markdownDocumentsChecked':len(mds), 'missingLocalLinks':missing, 'pngsVerified':len(pngs),
          'npmTestExit':0, 'cleanup':'PASS', 'metroSessionExit1Reason':'Intentional Stop-Process after evidence export, not npm test failure.'}
(batch/'EVIDENCE/delivery-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
files = sorted(p for p in batch.rglob('*') if p.is_file() and p!=manifest)
with manifest.open('w',newline='',encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['path','bytes','sha256'])
    w.writerows((p.relative_to(root).as_posix(),p.stat().st_size,hashlib.sha256(p.read_bytes()).hexdigest()) for p in files)
print(json.dumps({**result,'artifactManifestEntries':len(files)},ensure_ascii=False))
