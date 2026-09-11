from pathlib import Path
import json,csv,re,hashlib
r=Path('C:/Dev/zero-hour-game');o=r/'docs/qa/full-audit/2026-09-11-phase0';e=o/'EVIDENCE'
sim=json.loads((e/'normal-state-simulation.json').read_text(encoding='utf-8'))['log'];save=json.loads((e/'isolated-gui-save.json').read_text(encoding='utf-8'))['zero-hour-narrative-save']['state']['engineState']
first=[x['scene'] for x in sim if x['loop']==1];second=save['volatile']['visitedSceneIds'];gui=first+second;simids={x['scene'] for x in sim}
with (o/'COVERAGE.csv').open(encoding='utf-8-sig') as f: rows=list(csv.DictReader(f))
for row in rows:
 sid=row['scene_id'];row['automatic']='BODY_TO_BEATS_PASS'+(';NORMAL_STATE_SIM_VISITED' if sid in simids else '')+(';CH3_MATRIX_198_PASS' if sid.startswith('SCENE_CH3_') else '')
 row['gui']='SCENE_OBSERVED_PARTIAL_DIALOGUE' if sid in gui else 'NOT_PLAYED'
 if sid=='SCENE_ACT0_ARRIVAL':row['gui']='UI_TRAVERSED_NOT_INDIVIDUALLY_OBSERVED'
 row['evidence']='EVIDENCE/GUI_PLAY_LOG.md' if sid in gui else 'EVIDENCE/npm-test.log;EVIDENCE/normal-state-simulation.json'
with (o/'COVERAGE.csv').open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
for file,field,value in [('ART_ASSETS.csv','review','FACE_AND_BODY_SHEET_VIEWED'),('ASSET_INVENTORY.csv','visual_review','CONTACT_SHEET_VIEWED_NOT_ALL_PIXELS_OR_GUI')]:
 with (o/file).open(encoding='utf-8-sig') as f: rr=list(csv.DictReader(f))
 for row in rr:row[field]=value
 with (o/file).open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=rr[0].keys());w.writeheader();w.writerows(rr)
counts={'runtime_scenes':len(rows),'gui_traversed':len(gui),'gui_individually_observed':len(gui)-1,'gui_not_played':len(rows)-len(gui),'assets_contact_sheet_viewed':95,'normal_sim_unique_scenes':len(simids)}
(e/'coverage-summary.json').write_text(json.dumps(counts,indent=2),encoding='utf-8');(e/'gui-scene-sequence.json').write_text(json.dumps(gui,indent=2),encoding='utf-8')
content=[['CH00/CH01 first night','Implemented', '17 scene path traversed;16 individually observed','Original early detailed approval transcript unavailable; runtime and index checked'],['Loop2 first intervention through B1','Implemented','11 scenes observed; stopped at B1 0/3','Normal UI; death avoided; deduction gate verified'],['CH2 B1 onward and 4-111..152','Implemented with source differences','NOT_PLAYED','Current source read; normal simulation; F02 F03 F06'],['CH3 Three Testimonies','Implemented','NOT_PLAYED','93 canonical lines +198 matrix routes PASS; current source read'],['Loop3 reset and CH4 opening','2 CH4 opening nodes only','NOT_PLAYED','Normal simulation reached milestone end'],['CH4 trust routes/B2/06/4:10','NOT_IMPLEMENTED','NOT_APPLICABLE','Full script read; absent from active story graph'],['CH5 The Sixth Room','NOT_IMPLEMENTED','NOT_APPLICABLE','Full script read'],['CH6 Nights Left Behind','NOT_IMPLEMENTED','NOT_APPLICABLE','Full script read'],['CH7 Zero Hour and 3 endings','NOT_IMPLEMENTED','NOT_APPLICABLE','Full script read; F10 canon conflict'],['Legacy app/scenario/store','Dormant reference','NOT_PLAYED','Entry/type/initial state inspected; not fully read or migrated']]
with (o/'CONTENT_COVERAGE.csv').open('w',encoding='utf-8-sig',newline='') as f:w=csv.writer(f);w.writerow(['content','implementation','gui','source_and_automatic']);w.writerows(content)
report=(o/'AUDIT_REPORT.md').read_text(encoding='utf-8');blocks=re.findall(r'### (F\d+) — ([^\n]+)\n(.*?)(?=\n### F|\n## 4\.)',report,re.S)
with (o/'ISSUES.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['id','priority','title','scope_reproduction_evidence_minimum_fix_impact_approval'])
 for iid,title,body in blocks:w.writerow([iid,'P1' if int(iid[1:])<=10 else 'P2',title,body.strip()])
# Empty attempted captures are not evidence. Remove only the two new audit files.
for name in ['android-investigation-once.png','android-seoyun-call.png']:
 p=e/name
 if p.exists() and p.stat().st_size==0:p.unlink()
print(json.dumps(counts));print('issues',len(blocks))
