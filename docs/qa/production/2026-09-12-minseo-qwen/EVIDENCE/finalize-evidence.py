"""Read-only verification and new evidence files for the Minseo production batch."""
from pathlib import Path
import csv, hashlib, json, re, shutil, subprocess
from urllib.request import urlopen
from PIL import Image

root = Path('C:/Dev/zero-hour-game')
batch = Path(__file__).resolve().parent.parent
out = batch/'EVIDENCE'
comfy = Path('C:/AI/ComfyUI_windows_portable/ComfyUI')

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def dump(name, value):
    (out/name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')

def check_manifest(path, absolute=False):
    rows = list(csv.DictReader(path.open(encoding='utf-8-sig', newline='')))
    differences = []
    for row in rows:
        name = row.get('path', row.get('Path'))
        p = Path(name) if absolute else root/name
        expected = row.get('sha256', row.get('SHA256')).lower()
        actual = sha(p) if p.is_file() else None
        if actual != expected:
            differences.append({'path':name, 'expected':expected, 'actual':actual})
    return {'count':len(rows), 'differences':differences}

def git(*args):
    return subprocess.run(['git', *args], cwd=root, capture_output=True, encoding='utf-8', check=True).stdout

code = check_manifest(root/'docs/qa/production/2026-09-11-safe-a/EVIDENCE/code-sha256-final.csv')
expected = {'assets/ASSET_MANIFEST.json', 'src/ui/NarrativePlayer.tsx', 'src/ui/FieldKit.tsx'}
assert {d['path'] for d in code['differences']} == expected, code
old_batch = check_manifest(root/'docs/qa/production/2026-09-11-safe-a/artifact-manifest.csv')
audit = check_manifest(root/'docs/qa/full-audit/2026-09-11-phase0/EVIDENCE/artifact-manifest.csv')
workflows = check_manifest(out/'comfy-existing-workflows-before.csv', absolute=True)
assert not old_batch['differences'] and not audit['differences'] and not workflows['differences']
head = git('rev-parse','HEAD').strip()
branch = git('branch','--show-current').strip()
staged = git('diff','--cached','--name-only')
assert head == '2f6e21a8eac8829bf216fdc177abb5b8b512304d' and branch == 'master' and not staged
dump('preservation-final.json', {'head':head, 'branch':branch, 'staged':[],
    'priorCode':code, 'priorBatchArtifacts':old_batch, 'phase0Artifacts':audit,
    'existingComfyWorkflows':workflows, 'previousF04FilesPreserved':True})
for filename, args in [('git-final-status.txt',('status','--short')),
        ('git-final-untracked.txt',('ls-files','--others','--exclude-standard')),
        ('cumulative-code.patch',('diff','--binary')),
        ('git-diff-check.txt',('diff','--check'))]:
    (out/filename).write_text(git(*args), encoding='utf-8')
(out/'git-diff-check-exit.txt').write_text('0\n', encoding='utf-8')
old_paths = [r['path'] for r in csv.DictReader((root/'docs/qa/production/2026-09-11-safe-a/EVIDENCE/code-sha256-final.csv').open(encoding='utf-8-sig'))]
new_paths = ['assets/characters/minseo/IDENTITY_LOCK_2026-09-12.md', 'assets/characters/minseo/sprites/CHAR_Minseo_Clinical_ThreeQuarter_v03.png']
with (out/'code-sha256-final.csv').open('w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f); writer.writerow(['path','sha256'])
    writer.writerows((p,sha(root/p)) for p in sorted(old_paths+new_paths))

history = json.load(urlopen('http://127.0.0.1:8188/history'))
matches = []
for job_id, job in history.items():
    filenames = [i['filename'] for node in job.get('outputs',{}).values() for i in node.get('images',[])]
    if 'MINSEO_QWEN_2512_REFINEMENT_20260912_00003_.png' in filenames:
        matches.append((job_id,job))
assert len(matches) == 1
job_id, job = matches[0]
assert job['status']['status_str'] == 'success' and job['status']['completed']
dump('qwen-ui-final-history.json', {job_id:job})
source = comfy/'output/ZERO_HOUR/MINSEO_QWEN_2512_REFINEMENT_20260912_00003_.png'
shutil.copy2(source, batch/'ART_REVIEW/minseo-qwen-final-ui-study.png')
with Image.open(source) as img:
    for key in ('prompt','workflow'):
        dump('qwen-ui-final-'+key+'.json',json.loads(img.info[key]))
shutil.copy2(comfy/'user/default/workflows/ZERO_HOUR_MINSEO_QWEN_2512_20260912.json', out/'qwen-reusable-workflow-final.json')
dump('qwen-ui-final-summary.json', {'jobId':job_id, 'status':'success',
    'uiObservedDurationSeconds':41.94, 'assetDecision':'study only; not integrated',
    'input':'MINSEO_APPROVED_A_RGBA_20260912_00001_.png [output]',
    'inputRGBEqualsOriginalA':True, 'outputSHA256':sha(source)})

app_log = (out/'android-after-app.log').read_text(encoding='utf-8-sig',errors='replace')
crash_log = (out/'android-after-crash.log').read_text(encoding='utf-8-sig',errors='replace')
dump('android-log-summary.json', {
    'appLogErrorLines':[s for s in app_log.splitlines() if re.search(r'FATAL EXCEPTION|E ReactNativeJS|ReactNativeJS.*Error:',s)],
    'crashBufferMentionsGamePackage':'com.jungih4982.zerohourgame' in crash_log,
    'otherCrashProcesses':sorted(set(re.findall(r'(?:Process: |Cmdline: )([^,\r\n]+)',crash_log))),
    'scope':'Targeted app log only; OS/GMS crashes exist, so this is not an overall stability pass.'})

start = json.loads((out/'restored-safe-a-resume.json').read_text(encoding='utf-8-sig'))
final = json.loads((out/'resume-final.json').read_text(encoding='utf-8-sig'))
before = start['zero-hour-narrative-save']['state']['engineState']['volatile']
after = final['zero-hour-narrative-save']['state']['engineState']['volatile']
new_scenes = [s for s in after['visitedSceneIds'] if s not in before['visitedSceneIds']]
dump('gui-scene-scope.json', {'startingScene':before['currentSceneId'], 'newlyVisited':new_scenes,
    'newlyVisitedCount':len(new_scenes), 'includingStartingSceneCount':len(new_scenes)+1,
    'afterChangeReplayedScenes':['SCENE_LOOP2_CCTV_GAP','SCENE_LOOP2_06_CARD','SCENE_LOOP2_SEOYUN_UNCERTAIN'],
    'checkpointSHA256':sha(out/'resume-final.sqlite')})
print(json.dumps({'preservation':'PASS', 'codeHashes':len(old_paths+new_paths), 'oldArtifacts':old_batch['count'],
    'auditArtifacts':audit['count'], 'qwenFinalUIJob':job_id, 'guiNewScenes':len(new_scenes)},ensure_ascii=False))
