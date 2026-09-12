"""One-time extraction of approved paragraphs; no source manuscript edits."""
import json, pathlib, re
root=pathlib.Path(__file__).resolve().parents[5]
assert not (root/'src/content/chapter4.ts').exists(), 'One-time extraction only; preserve subsequent integration edits.'
source=(root/'docs/story/production/v02/scripts/CH04_BELOW_THE_WARD.md').read_text(encoding='utf8')
keys=['Y-01','Y-02','Y-03','T-01','T-02','T-03','S-01']
speakers={'유진':'yujin','태준':'taejun','주인공':'player','세아':'sea','보안 직원':'unknown'}
data=[]
for key in keys:
    m=re.search(r'### SCENE '+key+r' — (.+)\n\n([\s\S]*?)(?=\n### |\n---|\Z)',source)
    body=m[2].split('\n획득:')[0].strip()
    paragraphs=[]; voices=[]
    for p in body.split('\n\n'):
        voice='narrator'
        for name,speaker in speakers.items():
            if p.startswith(name+': '): voice=speaker; p=p[len(name)+2:]; break
        paragraphs.append(p.replace('“','"').replace('”','"').replace('`',''))
        voices.append(voice)
    data.append((key,m[1],'\n\n'.join(paragraphs),voices))
out="""import type { ClueId, GameTime, ItemId, LocationId, NarrativeChoice, NarrativeEffect, NarrativeScene, SceneId } from '../engine';
import type { SpeakerId } from '../ui/dialogueBeats';
import { BLACKOUT_TIME } from './timeContract';

// Text: docs/story/production/v02/scripts/CH04_BELOW_THE_WARD.md, named sections below.
const id = (key: string) => `SCENE_CH4_${key.replace('-', '_')}` as SceneId;
const move = (choiceId: string, text: string, target: string, minutes = 0, extra: NarrativeEffect[] = []): NarrativeChoice => ({
  id: choiceId, text, kind: 'standard', effects: [...extra, {type:'advanceTime',minutes}, {type:'jumpScene',sceneId:id(target)}],
});
const flag = (name: string, value: boolean | string, scope: 'loop' | 'persistent' = 'loop'): NarrativeEffect => ({type:'setFlag',flag:name,value,scope});
const clue = (name: string): NarrativeEffect => ({type:'gainClue',clueId:name as ClueId});
export const chapter4RouteChoices: readonly NarrativeChoice[] = [
  move('CH4_ROUTE_YUJIN','한유진 — 서윤의 입실 기록을 확인한다.','Y-01',50,[flag('CH4_MAIN_ROUTE','yujin'),{type:'moveLocation',locationId:'1F_LOBBY' as LocationId}]),
  move('CH4_ROUTE_TAEJUN','강태준 — 1시 06분 사고를 막는다.','T-01',50,[flag('CH4_MAIN_ROUTE','taejun'),{type:'moveLocation',locationId:'1F_LOBBY' as LocationId}]),
  move('CH4_ROUTE_SEA','윤세아 — B2의 문을 기억하게 한다.','S-01',50,[flag('CH4_MAIN_ROUTE','sea'),{type:'moveLocation',locationId:'1F_STAFF_DOOR' as LocationId}]),
];

export const chapter4Text: Readonly<Record<string, {title:string; body:string; speakers:readonly SpeakerId[]}>> = {
"""
for key,title,body,voices in data:
    out+=f"  '{key}': {{ title: {json.dumps(title,ensure_ascii=False)}, body: `"+body+"`, speakers: "+json.dumps(voices)+" },\n"
out+="""};

function scene(key:string, choices:readonly NarrativeChoice[], onEnter:readonly NarrativeEffect[] = []): NarrativeScene {
  return {id:id(key),locationId:(key==='S-01'?'1F_STAFF_DOOR':'1F_LOBBY') as LocationId,
    title:chapter4Text[key].title,body:chapter4Text[key].body,choices,onEnter};
}
export const chapter4Scenes: Readonly<Record<string,NarrativeScene>> = {
  [id('Y-01')]: scene('Y-01',[move('CH4_Y_CALL_WARD','유진의 병실 확인을 기다린다.','Y-02',2)]),
  [id('Y-02')]: scene('Y-02',[move('CH4_Y_COMPARE_LABELS','내려온 라벨과 전산 기록을 대조한다.','Y-LABELS',2)]),
  [id('Y-LABELS')]: {
    id:id('Y-LABELS'),locationId:'1F_LOBBY' as LocationId,title:'중복 라벨',
    body:`잠시 뒤 내려온 두 라벨을 비교한다.

첫 라벨: 302 / 21:41 / 이서윤, 인쇄가 선명함.

두 번째 라벨: 302 / 21:41 / 이서윤, 바코드 끝 네 자리가 다름.

전산 화면: 해당 이름 검색 결과 없음.

프린터 이력: 한 번만 출력한 것으로 표시.`,
    choices:[move('CH4_Y_LABEL_DEDUCTION','서로 다른 전산 이력이 같은 프린터에 겹쳐 출력됐다.','Y-PROOF',1,[clue('DOUBLE_LABEL')])],
  },
  [id('Y-PROOF')]: {
    id:id('Y-PROOF'),locationId:'1F_LOBBY' as LocationId,title:'한 번의 출력',
    body:`"제가 출력 버튼을 누른 건 한 번이에요."

"그런데 두 장이 나왔고요."

"네."

유진은 처음으로 기록이 없다고 말하지 않았다.`,
    choices:[move('CH4_Y_ASK_AIR','1시 06분 이송실 밀폐를 말한다.','Y-03',2)],
  },
  [id('Y-03')]: scene('Y-03',[],[flag('TRUST_YUJIN',true,'persistent'),flag('CH4_YUJIN_COOPERATING',true),clue('B1_MANUAL_AIR_VALVE')]),
  [id('T-01')]: scene('T-01',[move('CH4_T_WATCH_SIGNAL','카메라 신호를 함께 확인한다.','T-02',1)]),
  [id('T-02')]: scene('T-02',[move('CH4_T_PREVENT_TRANSFER','김 기사님이 이송실에 들어가지 않게 한다.','T-03',2)]),
  [id('T-03')]: scene('T-03',[],[flag('TRUST_TAEJUN',true,'persistent'),flag('CH4_TAEJUN_COOPERATING',true),flag('CH4_WORKER_TRANSFER_CANCELED',true),clue('CCTV_ORIGINAL_GAP'),{type:'gainItem',itemId:'B2_SECURITY_KEY' as ItemId}]),
  [id('S-01')]: scene('S-01',[],[{type:'waitUntil',time:BLACKOUT_TIME}]),
};

export const chapter4ParagraphSpeakers: Readonly<Record<string,readonly SpeakerId[]>> = {
  ...Object.fromEntries(Object.entries(chapter4Text).map(([key,value])=>[id(key),value.speakers])),
  [id('Y-LABELS')]: ['narrator','narrator','narrator','narrator','narrator'],
  [id('Y-PROOF')]: ['yujin','player','yujin','narrator'],
};
export const chapter4ProductionStops: readonly string[] = [id('Y-03'),id('T-03'),id('S-01')];
"""
(root/'src/content/chapter4.ts').write_text(out,encoding='utf8')
print('Extracted 7 approved scenes, label comparison and proof; no manuscript files modified.')
