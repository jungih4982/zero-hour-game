from pathlib import Path
import subprocess,hashlib,json,csv,re,datetime
r=Path('C:/Dev/zero-hour-game');o=r/'docs/qa/full-audit/2026-09-11-phase0';e=o/'EVIDENCE'
def git(*args):return subprocess.check_output(['git','-C',str(r),*args]).decode('utf-8-sig').strip()
with (e/'tracked-sha256-before.csv').open(encoding='utf-8-sig') as f:before=list(csv.DictReader(f))
changed=[]
for row in before:
 p=r/row['Path'];h=hashlib.sha256(p.read_bytes()).hexdigest().upper() if p.is_file() else 'MISSING'
 if h!=row['SHA256'].upper():changed.append({'path':row['Path'],'before':row['SHA256'],'after':h})
head=git('rev-parse','HEAD');branch=git('branch','--show-current');untracked=git('ls-files','--others','--exclude-standard').splitlines();outside=[p for p in untracked if not p.startswith('docs/qa/full-audit/2026-09-11-phase0/')]
staged=git('diff','--cached','--name-only');unstaged=git('diff','--name-only')
result={'timestamp_local':datetime.datetime.now().astimezone().isoformat(),'root':str(r),'head':head,'branch':branch,'initial_tracked_files_hashed':len(before),'changed_original_tracked_files':changed,'staged_diff_files':staged.splitlines(),'unstaged_diff_files':unstaged.splitlines(),'new_untracked_outside_audit':outside,'pass':not(changed or staged or unstaged or outside) and head=='2f6e21a8eac8829bf216fdc177abb5b8b512304d' and branch=='master','scope':'Tracked source/content/assets/config/dependencies only; ignored runtime build/cache artifacts are separate.'}
(e/'preservation-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
(e/'git-after.txt').write_text('\n'.join([str(r),head,branch,git('status','--short'), 'STAGED_DIFF='+staged,'UNSTAGED_DIFF='+unstaged]),encoding='utf-8')
# Check internal Markdown links and basic inventory counts, without checking external links.
missing=[]
for p in o.rglob('*.md'):
 for dest in re.findall(r'\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
  if dest.startswith(('http:','https:','#')):continue
  target=(p.parent/dest.split('#')[0]).resolve()
  if not target.exists() and target.name!='artifact-manifest.csv':missing.append([p.name,dest])
for p in o.rglob('*.json'):json.loads(p.read_text(encoding='utf-8-sig'))
with (o/'COVERAGE.csv').open(encoding='utf-8-sig') as f:coverage=list(csv.DictReader(f))
with (o/'ISSUES.csv').open(encoding='utf-8-sig') as f:issues=list(csv.DictReader(f))
assert len(coverage)==70 and len(issues)==13
qa={'markdown_missing_local_links':missing,'json_parse':'PASS','coverage_rows':len(coverage),'issue_rows':len(issues),'zero_byte_pngs':[p.name for p in o.rglob('*.png') if p.stat().st_size==0]}
(e/'artifact-validation.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding='utf-8')
# Manifest is produced last and excludes itself to avoid a recursive hash.
with (e/'artifact-manifest.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['path','bytes','sha256'])
 for p in sorted(o.rglob('*')):
  if p.is_file() and p.name!='artifact-manifest.csv':w.writerow([p.relative_to(r).as_posix(),p.stat().st_size,hashlib.sha256(p.read_bytes()).hexdigest()])
print(json.dumps(result,ensure_ascii=False));print(json.dumps(qa));print('Audit files:',sum(1 for p in o.rglob('*') if p.is_file()))
if not result['pass'] or missing:raise SystemExit(1)
