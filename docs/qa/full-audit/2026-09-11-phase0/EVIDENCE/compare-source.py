from pathlib import Path
import re,json,csv
r=Path('C:/Dev/zero-hour-game');o=r/'docs/qa/full-audit/2026-09-11-phase0'
s=(r/'docs/story/LOOP2_SEOYUN_DID_NOT_KNOW.md').read_text(encoding='utf-8')
runtime=(r/'src/content/prologue.ts').read_text(encoding='utf-8')
parts=re.split(r'(SCENE 4-\d+[^\n]*)',s)
rows=[]
for i in range(1,len(parts),2):
    for q in re.findall('“([^”]+)”',parts[i+1]):
        rows.append([parts[i],q,'EXACT_SUBSTRING' if q in runtime else 'NOT_EXACT_SUBSTRING'])
with (o/'DIALOGUE_COMPARISON.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['source_scene','quoted_source_line','runtime_substring_presence_not_semantic_verdict']);w.writerows(rows)
print(json.dumps({'quoted_lines':len(rows),'exact_substrings':sum(x[2]=='EXACT_SUBSTRING' for x in rows),'not_exact_substrings':sum(x[2]!='EXACT_SUBSTRING' for x in rows),'caution':'Includes repeated lines and editorial quotations; substring check is a triage aid, not full source equivalence.'}))
files=list((r/'assets').rglob('*')); media=[p for p in files if p.suffix.lower() in ['.png','.jpg','.jpeg','.webp','.wav','.mp3','.ogg','.m4a']]
code='\n'.join(p.read_text(encoding='utf-8') for d in ['src','components'] for p in (r/d).rglob('*') if p.suffix in ['.ts','.tsx'])
with (o/'ASSET_INVENTORY.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['path','bytes','runtime_filename_reference_candidate','visual_review'])
 for p in media:w.writerow([p.relative_to(r).as_posix(),p.stat().st_size,p.name in code,'see ART_ASSETS and report'])
print('media_files',len(media),'audio_files',sum(p.suffix.lower() in ['.wav','.mp3','.ogg','.m4a'] for p in media))
