from pathlib import Path
import re, json
root=Path.cwd()
p=root/'src/content/prologue.ts'
s=p.read_text(encoding='utf-8')
s="import { BLACKOUT_TIME } from './timeContract';\n"+s
s=s.replace('usableFrom: 70 as GameTime,','usableFrom: 0 as GameTime,').replace('usableUntil: 120 as GameTime,','usableUntil: BLACKOUT_TIME,\n    eventTime: BLACKOUT_TIME,')
s=s.replace('    timeSavedMinutes: 8,\n','')
costs={'ASK_ABOUT_OTHER_CALLS':32,'DO_NOT_EXPLAIN_LOOP_YET':40,'TEST_MESSAGE_ANOMALY':34,'LEAVE_AFTER_MESSAGE_TEST':9,
 'ENTER_B1':1,'ASK_SEA_ABOUT_SEOYUN':1,'USE_B1_TRANSFER_ROUTE':1,'FACE_TAEJUN_IN_B1':1,'RETURN_UPSTAIRS_WITH_TAEJUN':1,
 'RETURN_TO_302_FOR_SECOND_PHONE':2,'CALL_BOTH_SEOYUN_PHONES':1,'KEEP_SECOND_PHONE':1,'ASK_TAEJUN_ABOUT_CCTV':1,
 'SHOW_SECOND_PHONE_TO_TAEJUN':1,'PRESS_TAEJUN_ON_CCTV_GAP':2,'COMPARE_06_WITH_WRISTBAND':1,'ASK_WHERE_06_CARD_WAS_FOUND':2,
 'KEEP_MINSEO_WARNING_PRIVATE':2,'TELL_MINSEO_ONLY_WALL_CLUE':3,'LINK_CCTV_GAP_TO_OLD_PASSAGE':1,'SEND_OLD_MAP_TO_SEOYUN':1,'ACCEPT_INDEPENDENT_SEARCH_RULE':1}
changes=[]
for id,minutes in costs.items():
 pattern=r"(to\(\s*'"+id+r"',.*?,\s*\w+,\s*)(\d+)"
 m=re.search(pattern,s,re.S)
 if not m: raise Exception('Missing choice '+id)
 changes.append({'choice':id,'before':int(m[2]),'after':minutes})
 s,n=re.subn(pattern,lambda m:m[1]+str(minutes),s,flags=re.S)
 assert n==1
s=s.replace("SCENE_BLACKOUT_0000, 9)","SCENE_BLACKOUT_0000, 0, { effects: [{ type: 'waitUntil', time: BLACKOUT_TIME }] })")
s=s.replace("SCENE_LOOP2_BLACKOUT_INTERVENTION, 5, {","SCENE_LOOP2_BLACKOUT_INTERVENTION, 0, {\n        effects: [{ type: 'waitUntil', time: BLACKOUT_TIME }],")
p.write_text(s,encoding='utf-8')
(root/'docs/qa/production/2026-09-12-f01-dual-art/EVIDENCE/time-cost-changes.json').write_text(json.dumps(changes,indent=2),encoding='utf-8')
p=root/'src/content/story.ts';s=p.read_text(encoding='utf-8');s="import { CHAPTER3_START_TIME } from './timeContract';\n"+s
s=s.replace("effects: [{ type: 'jumpScene', sceneId: SCENE_CH3_BAND_REQUEST }],","effects: [{ type: 'waitUntil', time: CHAPTER3_START_TIME }, { type: 'jumpScene', sceneId: SCENE_CH3_BAND_REQUEST }],")
p.write_text(s,encoding='utf-8')
p=root/'src/content/chapter3.ts';s=p.read_text(encoding='utf-8');s="import { SECOND_DEATH_TIME } from './timeContract';\n"+s
s=s.replace("  { type: 'setTime', time: 223 as GameTime },\n",'').replace("    onEnter: [{ type: 'setTime', time: 184 as GameTime }],\n",'')
s=s.replace("{ type: 'setTime', time: 223 as GameTime }","{ type: 'waitUntil', time: SECOND_DEATH_TIME }")
p.write_text(s,encoding='utf-8')
p=root/'src/gameplay/choicePresentation.ts';s=p.read_text(encoding='utf-8').replace('첫 번째 밤보다 8분 앞섰다','첫 번째 밤보다 먼저 도착했다').replace('검증을 미룬 대신 첫 번째 밤보다 8분을 확보했다.','검증을 미룬 대신 첫 번째 밤보다 먼저 도착했다.');p.write_text(s,encoding='utf-8')
