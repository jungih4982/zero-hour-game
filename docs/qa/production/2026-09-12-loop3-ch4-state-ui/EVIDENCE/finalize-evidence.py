"""Read project evidence and emit review artifacts; never changes Git or game state."""
import csv, difflib, hashlib, json, pathlib, re, subprocess
from datetime import datetime, timezone

p = pathlib.Path(__file__).resolve().parent
root = p.parents[4]
assert root.as_posix().lower() == 'c:/dev/zero-hour-game'
batch = p.parent
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def write_json(path, value): path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf8')
def git(*args): return subprocess.check_output(['git', *args], cwd=root).decode('utf8')

expected = {
    'docs/qa/README.md', 'package.json', 'scripts/test-responsive-layout.ts',
    'scripts/test-time-contract.ts', 'src/content/chapter3.ts', 'src/content/story.ts',
    'src/engine/choices.ts', 'src/engine/types.ts', 'src/gameplay/choicePresentation.ts',
    'src/gameplay/investigation.ts', 'src/store/narrativeSave.ts', 'src/ui/FieldKit.tsx',
    'src/ui/NarrativePlayer.tsx', 'src/ui/dialogueBeats.ts', 'src/ui/layout.ts',
}
new_code = ['scripts/test-loop3-state.ts', 'scripts/test-chapter4.ts',
            'src/content/chapter4.ts', 'src/gameplay/fieldKnowledge.ts']
rows = list(csv.DictReader((p/'baseline-sha256.csv').open(encoding='utf-8-sig')))
changed, missing, unchanged, art_count, prior_count = [], [], [], 0, 0
for row in rows:
    rel = row['path']; file = root / rel
    assert file.resolve().is_relative_to(root)
    if not file.is_file(): missing.append(rel); continue
    if digest(file) != row['sha256'].lower(): changed.append(rel)
    else: unchanged.append(rel)
    if rel.startswith('assets/'): art_count += 1
    if rel.startswith('docs/qa/production/2026-09-12-f01-dual-art/'): prior_count += 1
assert not missing, missing
assert set(changed) == expected, (set(changed)-expected, expected-set(changed))
assert not any(s.startswith(('assets/','docs/story/')) for s in changed)
assert git('rev-parse','HEAD').strip() == 'f67c6324fdc569857a8bc4e08f07ec3476446ce3'
assert git('branch','--show-current').strip() == 'master'
assert not git('diff','--cached')
diffcheck = subprocess.run(['git','diff','--check'],cwd=root,capture_output=True,text=True)
assert diffcheck.returncode == 0, diffcheck.stdout + diffcheck.stderr
(p/'final-diff-check.log').write_text('git diff --check\nexit=0\n'+diffcheck.stdout+diffcheck.stderr,encoding='utf8')
(p/'final-status.txt').write_text(git('status','--short','--untracked-files=all'),encoding='utf8')
(p/'final-unstaged.patch').write_text(git('diff','--no-ext-diff'),encoding='utf8')
(p/'final-staged.patch').write_text(git('diff','--cached'),encoding='utf8')

# Compare against the incoming uncommitted tree, not only against HEAD.
patch = []
for rel in sorted(changed):
    backup = p/'baseline-files'/rel
    if backup.suffix in ('.ts','.tsx'): backup = pathlib.Path(str(backup)+'.snapshot')
    assert backup.is_file(), backup
    old = backup.read_text(encoding='utf8').splitlines(keepends=True)
    new = (root/rel).read_text(encoding='utf8').splitlines(keepends=True)
    patch.extend(difflib.unified_diff(old,new,fromfile='before-task/'+rel,tofile='after-task/'+rel))
for rel in new_code:
    assert not any(row['path']==rel for row in rows)
    patch.extend(difflib.unified_diff([], (root/rel).read_text(encoding='utf8').splitlines(keepends=True),
                                    fromfile='/dev/null',tofile='after-task/'+rel))
(p/'batch-only.patch').write_text(''.join(patch),encoding='utf8')

save = json.loads((p/'final-resume.json').read_text(encoding='utf8'))
state = save['zero-hour-narrative-save']['state']['engineState']
assert save == json.loads((p/'fresh-final-cold-resumed.json').read_text(encoding='utf8'))
write_json(p/'RESUME_MANIFEST.json', {
    'sqlite':str(p/'final-resume.sqlite'), 'sha256':digest(p/'final-resume.sqlite'),
    'jsonSha256':digest(p/'final-resume.json'),
    'head':git('rev-parse','HEAD').strip(), 'branch':'master', 'saveVersion':6,
    'scene':state['volatile']['currentSceneId'], 'location':state['volatile']['currentLocationId'],
    'loop':state['persistent']['loopCount'], 'offset':state['volatile']['time'], 'displayTime':'22:16',
    'clock':state['volatile']['clock'], 'items':state['volatile']['itemIds'],
    'persistentFlags':state['persistent']['flags'], 'loopFlags':state['volatile']['flags'],
    'preferences':save['zero-hour-game-preferences']['state'],
    'counts':{k:len(state['persistent'][k]) for k in ['memories','clueIds','deductionIds']},
    'firstInput':'확보한 기록을 확인한다.', 'nextPlayableChoice':None,
    'boundary':'T-03 다음 보조 조사/B2 미구현. 정식 엔딩 아님.',
    'provenance':'Final Metro 04 fresh normal UI: first night band left, two resets, Loop2 unmarked door and linen (no cart), all map investigations, CH3 Yujin custody/watch/all five/radio, Loop3 memory, CH4 Taejun. Cold resume then byte-copy branch return. Parsed saves identical.',
})

broken = []
for doc in [root/'docs/qa/README.md', *batch.glob('*.md')]:
    for target in re.findall(r'\[[^\]\n]+\]\(([^)]+)\)',doc.read_text(encoding='utf8')):
        if '://' in target or target.startswith('#'): continue
        file = doc.parent / target.split('#')[0]
        # This report is emitted immediately below after its inputs are checked.
        if not file.exists() and file.resolve() != (p/'final-integrity.json').resolve():
            broken.append({'file':str(doc),'target':target})
assert not broken, broken

original = root/'docs/qa/production/2026-09-12-f01-dual-art/EVIDENCE/fresh-loop3-memory-choice.sqlite'
assert digest(original)=='752b1f562e5604ddf14e60170aa8b43b270ae39a871113de6ef62cd3bc53d17e'
write_json(p/'final-integrity.json',{
    'at':datetime.now(timezone.utc).isoformat(), 'root':str(root), 'head':git('rev-parse','HEAD').strip(),
    'branch':'master','stagedChanges':0,'baselineFiles':len(rows),'unchangedFiles':len(unchanged),
    'expectedChangedFiles':sorted(changed),'missingFiles':missing,'unexpectedChangedFiles':[],
    'newCodeFiles':new_code,'baselineAssetFilesChecked':art_count,'assetChanges':0,
    'priorF01FilesChecked':prior_count,'priorF01Changes':0,'canonicalStoryChanges':0,
    'originalLoop3SaveSha256':digest(original),'gitDiffCheckExit':0,'brokenReportLinks':broken,
    'fullTests':'tests-after-04.log (includes typecheck); no code edits since Metro 04',
    'guiSaveChecks':'final-gui-save-checks.log',
})
files = sorted(f for f in batch.rglob('*') if f.is_file() and f.name != 'artifact-manifest.csv')
with (p/'artifact-manifest.csv').open('w',encoding='utf8',newline='') as f:
    writer=csv.writer(f);writer.writerow(['path','bytes','sha256'])
    for file in files: writer.writerow([file.relative_to(batch).as_posix(),file.stat().st_size,digest(file)])
print(json.dumps({'baseline':len(rows),'preserved':len(unchanged),'intentionalChanges':len(changed),
                  'newCodeFiles':len(new_code),'assetsPreserved':art_count,'priorF01Preserved':prior_count,
                  'manifestFiles':len(files),'missing':0,'unexpectedChanges':0,'brokenLinks':0,'diffCheck':'PASS'},ensure_ascii=False))
