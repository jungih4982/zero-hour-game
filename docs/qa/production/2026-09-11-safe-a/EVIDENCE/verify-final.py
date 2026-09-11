"""Read-only source verification and new audit evidence output; never changes git/index."""
from pathlib import Path
import csv
import difflib
import hashlib
import json
import subprocess
from datetime import datetime

root = Path('C:/Dev/zero-hour-game')
out = Path(__file__).resolve().parent
old = root / 'docs/qa/full-audit/2026-09-11-phase0/EVIDENCE'
expected = {'scripts/test-choice-presentation.ts', 'src/gameplay/choicePresentation.ts', 'src/ui/NarrativePlayer.tsx'}
new_test = 'scripts/test-foreknowledge-history.ts'

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def git(*args):
    return subprocess.check_output(['git', *args], cwd=root)

baseline = list(csv.DictReader((old/'tracked-sha256-before.csv').open(encoding='utf-8-sig')))
changed = [r['Path'] for r in baseline if not (root/r['Path']).exists() or sha(root/r['Path']) != r['SHA256'].lower()]
prior = list(csv.DictReader((old/'artifact-manifest.csv').open(encoding='utf-8-sig')))
prior_mismatches = [r['path'] for r in prior if not (root/r['path']).exists() or sha(root/r['path']) != r['sha256'].lower()]
head = git('rev-parse', 'HEAD').decode().strip()
branch = git('branch', '--show-current').decode().strip()
staged = git('diff', '--cached', '--name-only').decode().splitlines()
actual_diff = git('diff', '--name-only').decode().splitlines()
assert head == '2f6e21a8eac8829bf216fdc177abb5b8b512304d'
assert branch == 'master' and not staged
assert set(changed) == expected == set(actual_diff)
assert len(baseline) == 228 and len(prior) == 101 and not prior_mismatches
assert (root/new_test).is_file()
check = subprocess.run(['git', 'diff', '--check'], cwd=root, capture_output=True)
assert check.returncode == 0, check.stdout + check.stderr
(out/'diff-check.log').write_bytes(check.stdout + check.stderr)
(out/'diff-check-exit.txt').write_text(str(check.returncode)+'\n', encoding='utf-8')
patch = git('diff', '--binary')
addition = f'diff --git a/{new_test} b/{new_test}\nnew file mode 100644\n' + ''.join(difflib.unified_diff(
    [], (root/new_test).read_text(encoding='utf-8').splitlines(keepends=True), fromfile='/dev/null', tofile='b/'+new_test))
(out/'final-code.patch').write_bytes(patch+addition.encode('utf-8'))
with (out/'code-sha256-final.csv').open('w', newline='', encoding='utf-8') as f:
    writer=csv.writer(f); writer.writerow(['path','sha256'])
    for path in sorted([r['Path'] for r in baseline]+[new_test]): writer.writerow([path,sha(root/path)])
result={
    'verifiedAt':datetime.now().astimezone().isoformat(), 'head':head,'branch':branch,
    'stagedFiles':staged,'baselineTrackedCount':len(baseline),
    'unchangedTrackedCount':len(baseline)-len(changed),'expectedModifiedTrackedFiles':sorted(expected),
    'actualModifiedTrackedFiles':sorted(changed),'unexpectedTrackedChanges':[],
    'newTestFile':new_test,'priorArtifactCount':len(prior),'priorArtifactMismatches':prior_mismatches,
    'diffCheckExit':check.returncode,'pass':True,
    'scope':'Baseline tracked content and prior manifest entries; ignored runtime caches are outside this preservation comparison.'
}
(out/'preservation-final.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(out/'git-final-status.txt').write_bytes(git('status','--short'))
(out/'git-final-untracked.txt').write_bytes(git('ls-files','--others','--exclude-standard'))
(out/'git-final-head-branch.txt').write_text(head+'\n'+branch+'\n',encoding='utf-8')
(out/'git-final-staged.patch').write_bytes(git('diff','--cached','--binary'))
print(json.dumps(result,ensure_ascii=False))
