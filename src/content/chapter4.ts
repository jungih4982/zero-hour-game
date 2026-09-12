import type { ClueId, GameTime, ItemId, LocationId, NarrativeChoice, NarrativeEffect, NarrativeScene, SceneId } from '../engine';
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
  { ...move('CH4_ROUTE_YUJIN','한유진 — 서윤의 입실 기록을 확인한다.','Y-01',50,[flag('CH4_MAIN_ROUTE','yujin'),{type:'moveLocation',locationId:'1F_LOBBY' as LocationId}]),
    unavailableReason: '이 경로는 이전 밤의 라벨 목격 기록을 확인 중입니다.' },
  move('CH4_ROUTE_TAEJUN','강태준 — 1시 06분 사고를 막는다.','T-01',50,[flag('CH4_MAIN_ROUTE','taejun'),{type:'moveLocation',locationId:'1F_LOBBY' as LocationId}]),
  { id:'CH4_ROUTE_SEA', text:'윤세아 — B2의 문을 기억하게 한다.', kind:'standard',
    effects:[flag('CH4_MAIN_ROUTE','sea'),{type:'advanceTime',minutes:50},
      {type:'waitUntil',time:BLACKOUT_TIME},{type:'moveLocation',locationId:'1F_STAFF_DOOR' as LocationId},
      {type:'jumpScene',sceneId:id('S-01')}] },
];

export const chapter4Text: Readonly<Record<string, {title:string; body:string; speakers:readonly SpeakerId[]}>> = {
  'Y-01': { title: "아직 출력되지 않은 라벨", body: `백야의료원에 도착했을 때 유진은 접수처 안쪽에서 환자 팔찌용 라벨을 정리하고 있었다.

"무슨 일로 오셨어요?"

"잠시 뒤 302호 환자 소지품 봉투가 내려옵니다. 라벨을 버리지 말아 주세요."

유진의 손이 멈췄다.

"누구 보호자분이세요?"

"이서윤. 302호. 생년월일은—"

"잠깐만요."

유진은 이름을 검색했다. 화면에는 아무것도 나오지 않았다.

"입원 기록이 없는데요."

"그래도 9시 41분 입실 라벨이 출력됩니다. 같은 번호로 두 번 나올 겁니다."

"어떻게 아세요?"

"한 번은 직접 봤고, 한 번은 없어진 장부에서 봤습니다."`, speakers: ["narrator", "yujin", "player", "narrator", "yujin", "player", "yujin", "narrator", "yujin", "player", "yujin", "player"] },
  'Y-02': { title: "환자부터", body: `유진은 나를 믿지 않았다. 대신 3층에 전화를 걸었다.

"302호 확인 부탁드릴게요. 소지품 봉투랑 입실 라벨도 버리지 말고 내려 주세요."

전화를 끊은 유진이 말했다.

"말씀하신 게 틀리면 바로 나가셔야 합니다."

"맞으면요?"

"환자부터 확인합니다."

그 대답은 충분했다.`, speakers: ["narrator", "yujin", "narrator", "yujin", "player", "yujin", "narrator"] },
  'Y-03': { title: "산소 기록", body: `내가 1시 06분 이송실 밀폐를 말하자 유진은 화재 대응표를 확인했다.

"문서실이면 가스식 소화 설비를 썼을 수 있어요. 산소 농도를 낮추는 방식이요."

"불도 연기도 없었습니다."

"그럼 오작동이거나, 다른 구역 신호가 들어온 거고요."

유진은 B1 수동 밸브의 위치를 종이에 그렸다.

"문이 닫히면 이 밸브부터 여세요. 그런데 제일 좋은 건 안에 안 들어가는 겁니다."

"이번에는 밖에 있을 겁니다."`, speakers: ["narrator", "yujin", "player", "yujin", "narrator", "yujin", "player"] },
  'T-01': { title: "아직 끊기지 않은 영상", body: `태준은 보안실 앞에서 나를 막았다.

"여기는 출입하시면 안 됩니다."

"3층 복도 영상이 잠시 뒤 1분 동안 비게 됩니다. 정전 때문은 아닙니다."

"누구한테 들으셨어요?"

"태준 씨한테요."

태준의 표정이 굳었다.

"아직은 안 들었습니다. 그래서 지금 확인하자는 겁니다."

"지금 장난하시는 거면—"

"영상이 끊기면 302호에 들어간 여자가 사라집니다. 한 시 육 분에는 B1 이송실이 잠기고요. 그 안에 김 기사님이 들어가지 않게 해주세요."`, speakers: ["narrator", "taejun", "player", "taejun", "player", "narrator", "player", "taejun", "player"] },
  'T-02': { title: "예측", body: `태준은 나를 보안실 안으로 들이지 않았다. 문을 반쯤 닫은 채 모니터를 확인했다.

잠시 뒤 무전이 울렸다.

"3층 카메라 하나 신호가 이상합니다."

태준이 문을 다시 열었다.

"몇 분이라고 했죠?"

"거의 1분."

태준은 시간을 쟀다. 58초 뒤 영상이 돌아왔다.

"이제 한 시 육 분 얘기해 보세요."`, speakers: ["narrator", "narrator", "unknown", "narrator", "taejun", "player", "narrator", "taejun"] },
  'T-03': { title: "사람을 먼저 빼낸다", body: `"06 카드가 B1 이송실로 내려갑니다. 그때 김 기사님도 내려가고요. 방 안에 사람이 있으면 안 됩니다."

"왜 잠기는 겁니까."

"모릅니다. 안에서 죽어 봤다는 것밖에는."

태준은 내 얼굴을 오래 보지 않았다. 무전을 들었다.

"김 기사님, 오늘 B1 이송 업무 중지하세요. 내려가지 마시고 로비로 와 주세요."

"믿으시는 겁니까?"

"영상 58초는 맞았습니다. 나머지는 한 시 육 분에 확인하면 되고요."`, speakers: ["player", "taejun", "player", "narrator", "taejun", "player", "taejun"] },
  'S-01': { title: "먼저 기다린다", body: `자정 정전이 오기 전 직원용 문 근처에서 기다렸다. 이번에는 문이 열리자마자 내려가지 않았다.

발소리가 하나 아래에서 올라왔다.

세아가 계단 중간에 서 있었다. 환자복 위에 얇은 카디건을 걸친 채였다.

"늦었네."

"처음 본 사람한테 할 말은 아닌 것 같은데요."

세아는 내 얼굴보다 손목시계를 먼저 봤다.

"처음이었나."

"저를 오빠라고 부른 적도 있습니다."

"미안해요. 그건 내 기억 아닌 것 같아요."

"그럼 누구 기억입니까."

"그걸 알면 여기 안 있죠."`, speakers: ["narrator", "narrator", "narrator", "sea", "player", "narrator", "sea", "player", "sea", "player", "sea"] },
};

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
  [id('S-01')]: scene('S-01',[]),
};

export const chapter4ParagraphSpeakers: Readonly<Record<string,readonly SpeakerId[]>> = {
  ...Object.fromEntries(Object.entries(chapter4Text).map(([key,value])=>[id(key),value.speakers])),
  [id('Y-LABELS')]: ['narrator','narrator','narrator','narrator','narrator'],
  [id('Y-PROOF')]: ['yujin','player','yujin','narrator'],
};
export const chapter4ProductionStops: readonly string[] = [id('Y-03'),id('T-03'),id('S-01')];
