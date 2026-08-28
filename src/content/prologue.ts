import type {
  ClueId,
  DeathIntel,
  GameTime,
  LocationId,
  MemoryId,
  MemoryRecord,
  NarrativeScene,
  SceneId,
} from '../engine/types';

export const SCENE_CH00_ENTRANCE = 'SCENE_CH00_ENTRANCE' as SceneId;
export const SCENE_CH00_YUJIN_FIRST = 'SCENE_CH00_YUJIN_FIRST' as SceneId;
export const SCENE_CH00_YUJIN_DENIAL = 'SCENE_CH00_YUJIN_DENIAL' as SceneId;
export const SCENE_CH00_MESSAGE = 'SCENE_CH00_MESSAGE' as SceneId;
export const SCENE_CH00_FIRST_ANOMALY = 'SCENE_CH00_FIRST_ANOMALY' as SceneId;
export const SCENE_CH01_DECISION_2218 = 'SCENE_CH01_DECISION_2218' as SceneId;
export const SCENE_CH01_RECORDS_2227 = 'SCENE_CH01_RECORDS_2227' as SceneId;
export const SCENE_CH01_RECORDS_BLOCKED_2240 = 'SCENE_CH01_RECORDS_BLOCKED_2240' as SceneId;
export const SCENE_CH01_WARD_302_2227 = 'SCENE_CH01_WARD_302_2227' as SceneId;
export const SCENE_CH01_WRISTBAND_2234 = 'SCENE_CH01_WRISTBAND_2234' as SceneId;
export const SCENE_CH01_WATCH_2227 = 'SCENE_CH01_WATCH_2227' as SceneId;
export const SCENE_CH01_YUJIN_CALL_2234 = 'SCENE_CH01_YUJIN_CALL_2234' as SceneId;
export const SCENE_CH01_CONFRONT_2227 = 'SCENE_CH01_CONFRONT_2227' as SceneId;
export const SCENE_CH01_CALL_BELL_2252 = 'SCENE_CH01_CALL_BELL_2252' as SceneId;
export const SCENE_CH01_ROOM_302_TRACE_2305 = 'SCENE_CH01_ROOM_302_TRACE_2305' as SceneId;
export const SCENE_CH01_TELL_YUJIN_2305 = 'SCENE_CH01_TELL_YUJIN_2305' as SceneId;
export const SCENE_CH01_KEEP_SEARCHING_2305 = 'SCENE_CH01_KEEP_SEARCHING_2305' as SceneId;
export const SCENE_CH01_CHALLENGE_YUJIN_2305 = 'SCENE_CH01_CHALLENGE_YUJIN_2305' as SceneId;
export const SCENE_CH01_BROADCAST_2312 = 'SCENE_CH01_BROADCAST_2312' as SceneId;
export const SCENE_LOOP2_CONVERSATION_COMPRESSED = 'SCENE_LOOP2_CONVERSATION_COMPRESSED' as SceneId;
export const SCENE_LOOP2_SERVICE_DOOR_SCOUTED = 'SCENE_LOOP2_SERVICE_DOOR_SCOUTED' as SceneId;
export const SCENE_LOOP2_PREPARE_2355 = 'SCENE_LOOP2_PREPARE_2355' as SceneId;
export const SCENE_LOOP2_BLACKOUT_INTERVENTION = 'SCENE_LOOP2_BLACKOUT_INTERVENTION' as SceneId;
export const SCENE_LOOP2_SERVICE_CORRIDOR = 'SCENE_LOOP2_SERVICE_CORRIDOR' as SceneId;
export const SCENE_BLACKOUT_0000 = 'SCENE_BLACKOUT_0000' as SceneId;
export const SCENE_FIRST_DEATH = 'SCENE_FIRST_DEATH' as SceneId;
export const LOCATION_1F_LOBBY = '1F_LOBBY' as LocationId;
export const LOCATION_1F_WEST_WARD = '1F_WEST_WARD' as LocationId;
export const LOCATION_1F_STAFF_ELEVATOR = '1F_STAFF_ELEVATOR' as LocationId;
export const LOCATION_1F_SERVICE_DOOR = '1F_SERVICE_DOOR' as LocationId;
export const LOCATION_B1_SERVICE_CORRIDOR = 'B1_SERVICE_CORRIDOR' as LocationId;
export const CLUE_302_MATCHING_DOB = 'CLUE_302_MATCHING_DOB' as ClueId;
export const CLUE_302_OCCUPIED = 'CLUE_302_OCCUPIED' as ClueId;
export const CLUE_WRISTBAND_06 = 'CLUE_WRISTBAND_06' as ClueId;
export const CLUE_YUJIN_CALL = 'CLUE_YUJIN_CALL' as ClueId;
export const CLUE_SERVICE_CORRIDOR_LOG = 'CLUE_SERVICE_CORRIDOR_LOG' as ClueId;
export const FLAG_YUJIN_WARY = 'FLAG_YUJIN_WARY';
export const FLAG_CONVERSATION_COMPRESSED = 'FLAG_CONVERSATION_COMPRESSED';
export const FLAG_FIRST_DEATH_AVOIDED = 'FLAG_FIRST_DEATH_AVOIDED';
export const MEMORY_BLACKOUT_0000 = 'MEMORY_BLACKOUT_0000' as MemoryId;
export const FIRST_DEATH_ID = 'DEATH_BLACKOUT_SECURITY';

export const blackoutMemory: MemoryRecord = {
  id: MEMORY_BLACKOUT_0000,
  title: '자정의 잠금 해제',
  description: '00:00 정전 순간 1층 서비스 출입문의 전자 잠금이 풀린다.',
  acquiredOnLoop: 1,
  sourceSceneId: SCENE_FIRST_DEATH,
  payoff: {
    predictsEvent: '00:00 정전과 1층 서비스 출입문 잠금 해제',
    usableFrom: 2 as GameTime,
    usableUntil: 115 as GameTime,
    changes: ['timeSaved', 'riskAvoided', 'routeUnlocked', 'eventPreempted'],
    timeSavedMinutes: 9,
    avoidsRisk: FIRST_DEATH_ID,
    unlocksLocationId: LOCATION_B1_SERVICE_CORRIDOR,
  },
};

export const firstDeathIntel: DeathIntel = {
  memoryId: MEMORY_BLACKOUT_0000,
  deathId: FIRST_DEATH_ID,
  title: '자정의 정전',
  description: '정전 직후 경비 동선이 바뀌며 로비가 위험해진다.',
};

export const prologueScenes: Readonly<Record<string, NarrativeScene>> = {
  [SCENE_CH00_ENTRANCE]: {
    id: SCENE_CH00_ENTRANCE,
    locationId: LOCATION_1F_LOBBY,
    title: '22:00 — 백야의료원 로비',
    body: `폭설이 자동문 안쪽까지 밀려들었다.

문이 닫히는 소리가 유난히 길었다.

돌아보니 유리문 너머로는 눈밖에 보이지 않았다. 조금 전까지 지나온 도로도, 주차장도, 타이어 자국도 보이지 않는다.

로비는 이상할 만큼 따뜻했다.

그리고 조용했다.

병원이라면 들려야 할 것들이 들리지 않았다. 호출 벨도, 바퀴 구르는 소리도, 멀리서 섞이는 말소리도 없었다.

카운터 위 스탠드 하나만 켜져 있었다.`,
    choices: [
      {
        id: 'APPROACH_RECEPTION',
        text: '불이 켜진 접수대로 간다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 2 },
          { type: 'jumpScene', sceneId: SCENE_CH00_YUJIN_FIRST },
        ],
      },
    ],
  },
  [SCENE_CH00_YUJIN_FIRST]: {
    id: SCENE_CH00_YUJIN_FIRST,
    locationId: LOCATION_1F_LOBBY,
    title: '22:02 — 한유진',
    body: `카운터 안쪽에 앉아 있던 여자가 고개를 들었다. 명찰에는 '한유진'이라고 적혀 있었다.

"보호자분?"

다가가자 유진이 모니터 한쪽을 닫았다.

"접수는 끝났습니다."

"사람을 찾으러 왔습니다."

"...성함이요?"`,
    choices: [
      {
        id: 'NAME_SEOYUN',
        text: '"서윤. 서윤이라는 환자입니다."',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 3 },
          { type: 'jumpScene', sceneId: SCENE_CH00_YUJIN_DENIAL },
        ],
      },
      {
        id: 'SHOW_SEOYUN_MESSAGE_EARLY',
        text: '휴대전화에 남은 메시지를 보여준다.',
        kind: 'standard',
        effects: [
          { type: 'setFlag', flag: 'showedMessageEarly', value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 3 },
          { type: 'jumpScene', sceneId: SCENE_CH00_YUJIN_DENIAL },
        ],
      },
      {
        id: 'LOOK_AROUND_LOBBY',
        text: '먼저 주변을 살펴본다.',
        kind: 'standard',
        effects: [
          { type: 'setFlag', flag: 'lookedAroundLobby', value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 3 },
          { type: 'jumpScene', sceneId: SCENE_CH00_YUJIN_DENIAL },
        ],
      },
      {
        id: 'COMPRESS_REPEATED_YUJIN_CONVERSATION',
        text: '[기억] 이 대화의 결론을 알고 있다.',
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 }],
        effects: [
          { type: 'setFlag', flag: FLAG_CONVERSATION_COMPRESSED, value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 1 },
          { type: 'jumpScene', sceneId: SCENE_LOOP2_CONVERSATION_COMPRESSED },
        ],
      },
    ],
  },
  [SCENE_CH00_YUJIN_DENIAL]: {
    id: SCENE_CH00_YUJIN_DENIAL,
    locationId: LOCATION_1F_LOBBY,
    title: '22:05 — 없는 환자',
    body: `유진의 손가락이 키보드 위에서 멈췄다.

아주 잠깐이었다.

"그런 환자는 없습니다."

"다시 확인해 주세요."

"확인했습니다."

"이 병원에서 보낸 문자도 있습니다."

"퇴원한 환자일 수도 있겠네요."

"방금 없다고 했잖아요."

유진은 대답하지 않았다. 모니터 쪽으로 돌렸던 손을 천천히 거뒀다.`,
    choices: [
      {
        id: 'SHOW_SEOYUN_MESSAGE',
        text: '서윤이 보낸 메시지를 다시 보여준다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 3 },
          { type: 'jumpScene', sceneId: SCENE_CH00_MESSAGE },
        ],
      },
    ],
  },
  [SCENE_CH00_MESSAGE]: {
    id: SCENE_CH00_MESSAGE,
    locationId: LOCATION_1F_LOBBY,
    title: '22:08 — 예약 메시지',
    body: `화면에 남은 메시지를 열었다.

오빠.
내가 내일도 여기 있다고 말하면 믿지 마.
00시가 되기 전에 나를 찾아.

"이 번호는 병원 대표번호가 아닙니다."

"서윤이 보낸 겁니다."

유진은 화면을 보지 않았다.

메시지 정보 아래에 예약 전송 시간이 남아 있었다.

21:58`,
    choices: [
      {
        id: 'CHECK_SCHEDULED_TIME',
        text: '예약 전송 시간을 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 4 },
          { type: 'jumpScene', sceneId: SCENE_CH00_FIRST_ANOMALY },
        ],
      },
    ],
  },
  [SCENE_CH00_FIRST_ANOMALY]: {
    id: SCENE_CH00_FIRST_ANOMALY,
    locationId: LOCATION_1F_LOBBY,
    title: '22:12 — 야간 근무 기록지',
    body: `유진은 담당자에게 확인하겠다며 자리에서 일어났다.

로비 벽시계는 22시 12분을 가리켰다. 휴대전화도 22시 12분이었다.

카운터 위에 야간 근무 기록지가 펼쳐져 있었다.

가장 아래쪽. 오늘 날짜 옆에 한 줄이 적혀 있었다.

22:00 보호자 1명 도착.

그 아래에도 글자가 있었다.

00:03 사망 확인.

끝까지 읽기 전에 형광등이 한 번 깜박였다.

다시 내려다봤을 때 두 번째 줄은 없었다.

종이에는 첫 번째 기록만 남아 있었다.`,
    choices: [
      {
        id: 'RECHECK_DISAPPEARED_RECORD',
        text: '사라진 두 번째 기록을 다시 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 6 },
          { type: 'jumpScene', sceneId: SCENE_CH01_DECISION_2218 },
        ],
      },
    ],
  },
  [SCENE_CH01_DECISION_2218]: {
    id: SCENE_CH01_DECISION_2218,
    locationId: LOCATION_1F_LOBBY,
    title: '22:18 — 직접 확인할 것',
    body: `유진이 돌아왔다. 야간 근무 기록지는 이미 접혀 있었다.

"원무 기록은 다시 확인해 보겠습니다. 로비에서 기다려 주세요."

유진은 카운터 안쪽 문으로 들어갔다. 문이 닫히기 전, 잠금이 풀린 원무과 단말기와 병동 출입문이 함께 보였다.

벽시계는 22시 18분이었다.`,
    choices: [
      {
        id: 'INVESTIGATE_RECORDS',
        text: '원무과 단말기를 직접 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_302_MATCHING_DOB },
          { type: 'advanceTime', minutes: 9 },
          { type: 'jumpScene', sceneId: SCENE_CH01_RECORDS_2227 },
        ],
      },
      {
        id: 'INVESTIGATE_WEST_WARD',
        text: '카운터 뒤 병동 출입문으로 들어간다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_302_OCCUPIED },
          { type: 'advanceTime', minutes: 9 },
          { type: 'moveLocation', locationId: LOCATION_1F_WEST_WARD },
          { type: 'jumpScene', sceneId: SCENE_CH01_WARD_302_2227 },
        ],
      },
      {
        id: 'WATCH_YUJIN',
        text: '유진이 무엇을 하는지 지켜본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 9 },
          { type: 'jumpScene', sceneId: SCENE_CH01_WATCH_2227 },
        ],
      },
      {
        id: 'CONFRONT_YUJIN',
        text: '유진에게 정면으로 따진다.',
        kind: 'standard',
        effects: [
          { type: 'setFlag', flag: FLAG_YUJIN_WARY, value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 9 },
          { type: 'jumpScene', sceneId: SCENE_CH01_CONFRONT_2227 },
        ],
      },
    ],
  },
  [SCENE_CH01_RECORDS_2227]: {
    id: SCENE_CH01_RECORDS_2227,
    locationId: LOCATION_1F_LOBBY,
    title: '22:27 — 비공개 환자',
    body: `화면 잠금이 완전히 걸리지 않았다.

서윤의 이름을 검색했다. 결과 없음.

생년월일로 다시 찾자 환자 기록 하나가 나타났다. 이름 칸은 비어 있다.

이름: 비공개
병실: 302
상태: 전실
담당: C.M.S.

환자번호는 오른쪽이 잘려 보이지 않는다. 같은 생년월일이라는 사실만 확인할 수 있다.`,
    choices: [
      {
        id: 'MEMORIZE_RECORD_DETAILS',
        text: '화면에 나온 정보를 기억한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_RECORDS_BLOCKED_2240 },
        ],
      },
    ],
  },
  [SCENE_CH01_RECORDS_BLOCKED_2240]: {
    id: SCENE_CH01_RECORDS_BLOCKED_2240,
    locationId: LOCATION_1F_LOBBY,
    title: '22:40 — 잠긴 화면',
    body: `접수대 안쪽 문이 열렸다. 유진이 돌아왔다.

화면을 본 유진이 단말기 전원 버튼을 눌렀다.

"직원용입니다."

"302호 환자는 누구죠?"

"말씀드릴 수 없습니다."`,
    choices: [
      {
        id: 'LEAVE_LOCKED_TERMINAL',
        text: '화면에서 물러난다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 12 },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_WARD_302_2227]: {
    id: SCENE_CH01_WARD_302_2227,
    locationId: LOCATION_1F_WEST_WARD,
    title: '22:27 — 공실',
    body: `카운터 뒤 출입문은 걸쇠가 닿기 전에 멈춰 있었다. 그대로 밀고 들어갔다.

복도는 다른 병동과 다르지 않다. 소독약 냄새가 나고, 닫힌 병실 문마다 환자 이름표가 붙어 있다.

302호만 '공실'이다.

호출벨 표시등은 아주 약하게 켜져 있다. 문 아래로 빛이 한 줄 새어 나온다. 손잡이는 잠겨 있다.

문 옆 바닥에 찢어진 환자 손목밴드가 떨어져 있다.`,
    choices: [
      {
        id: 'CHECK_WRISTBAND',
        text: '떨어진 손목밴드를 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_WRISTBAND_06 },
          { type: 'setFlag', flag: FLAG_YUJIN_WARY, value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 7 },
          { type: 'jumpScene', sceneId: SCENE_CH01_WRISTBAND_2234 },
        ],
      },
      {
        id: 'LEAVE_WEST_WARD_EARLY',
        text: '더 머물지 않고 로비로 돌아간다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 25 },
          { type: 'moveLocation', locationId: LOCATION_1F_LOBBY },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_WRISTBAND_2234]: {
    id: SCENE_CH01_WRISTBAND_2234,
    locationId: LOCATION_1F_WEST_WARD,
    title: '22:34 — 손목밴드',
    body: `이름과 생년월일 부분은 찢겨 나갔다. 끝에 숫자 두 자리만 남아 있다.

...06

뒤에서 출입문이 열렸다.

"여기서 뭐 하세요?"

"공실이라면서 불은 켜져 있네요."

"로비로 돌아가세요."

유진은 앞장서지 않았다. 로비로 나갈 때까지 복도 끝에 서 있었다.`,
    choices: [
      {
        id: 'COMPLY_WITH_YUJIN',
        text: '손목밴드를 챙기고 물러난다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 18 },
          { type: 'moveLocation', locationId: LOCATION_1F_LOBBY },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_WATCH_2227]: {
    id: SCENE_CH01_WATCH_2227,
    locationId: LOCATION_1F_LOBBY,
    title: '22:27 — 카운터 건너편',
    body: `카운터에서 가장 먼 의자에 앉았다. 기다리는 대신 유진의 손과 출입문을 번갈아 봤다.

유진은 22시 34분에 자리에서 일어났다.

약제실과 반대 방향이었다.`,
    choices: [
      {
        id: 'FOLLOW_YUJIN',
        text: '거리를 두고 따라간다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_YUJIN_CALL },
          { type: 'advanceTime', minutes: 7 },
          { type: 'moveLocation', locationId: LOCATION_1F_STAFF_ELEVATOR },
          { type: 'jumpScene', sceneId: SCENE_CH01_YUJIN_CALL_2234 },
        ],
      },
    ],
  },
  [SCENE_CH01_YUJIN_CALL_2234]: {
    id: SCENE_CH01_YUJIN_CALL_2234,
    locationId: LOCATION_1F_STAFF_ELEVATOR,
    title: '22:34 — 직원 전용 엘리베이터',
    body: `직원 전용 엘리베이터 앞에서 유진이 통화하고 있었다.

"아니요. 아직 모릅니다."

유진은 상대의 말을 들었다.

"제가 처리하겠습니다."

통화를 끝낸 유진이 돌아봤다. 휴대전화를 주머니에 넣었다.

"언제부터 거기 있었어요?"

"방금요."

"여긴 직원 구역입니다."

"그건 아까도 들었습니다."`,
    choices: [
      {
        id: 'RETURN_AFTER_YUJIN_CALL',
        text: '로비로 돌아간다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 18 },
          { type: 'moveLocation', locationId: LOCATION_1F_LOBBY },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_CONFRONT_2227]: {
    id: SCENE_CH01_CONFRONT_2227,
    locationId: LOCATION_1F_LOBBY,
    title: '22:27 — 모순',
    body: `"없다는 환자가 퇴원했을 수도 있다는 건 무슨 뜻입니까."

"제가 표현을 잘못했습니다."

"둘 중 하나겠죠. 없었거나, 퇴원했거나."

유진이 명찰 아래 달린 출입 카드를 안쪽으로 돌려 놓았다.

"확인되는 대로 말씀드리겠습니다."`,
    choices: [
      {
        id: 'END_CONFRONTATION',
        text: '대화를 끝내고 카운터 주변을 살핀다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 25 },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_CALL_BELL_2252]: {
    id: SCENE_CH01_CALL_BELL_2252,
    locationId: LOCATION_1F_LOBBY,
    title: '22:52 — 호출벨',
    body: `호출벨이 울린다.

서쪽 병동 표시등 하나가 붉게 깜박인다.`,
    choices: [
      {
        id: 'GO_TO_ROOM_302',
        text: '302호로 간다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'moveLocation', locationId: LOCATION_1F_WEST_WARD },
          { type: 'jumpScene', sceneId: SCENE_CH01_ROOM_302_TRACE_2305 },
        ],
      },
      {
        id: 'TELL_YUJIN_ABOUT_BELL',
        text: '유진에게 먼저 알린다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_TELL_YUJIN_2305 },
        ],
      },
      {
        id: 'CONTINUE_OTHER_SEARCH',
        text: '다른 행동을 계속한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_KEEP_SEARCHING_2305 },
        ],
      },
      {
        id: 'CHALLENGE_EMPTY_ROOM_BELL',
        text: '[단서] 공실인 방에서 호출벨이 울리는 게 정상입니까?',
        kind: 'standard',
        conditions: [{ type: 'hasClue', clueId: CLUE_302_OCCUPIED }],
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_CHALLENGE_YUJIN_2305 },
        ],
      },
      {
        id: 'RECOGNIZE_WRISTBAND_06',
        text: '[단서] 302호. 문 앞에서 본 숫자가 떠올랐다. "06."',
        kind: 'standard',
        conditions: [{ type: 'hasClue', clueId: CLUE_WRISTBAND_06 }],
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'moveLocation', locationId: LOCATION_1F_WEST_WARD },
          { type: 'jumpScene', sceneId: SCENE_CH01_ROOM_302_TRACE_2305 },
        ],
      },
    ],
  },
  [SCENE_CH01_ROOM_302_TRACE_2305]: {
    id: SCENE_CH01_ROOM_302_TRACE_2305,
    locationId: LOCATION_1F_WEST_WARD,
    title: '23:05 — 사용 흔적',
    body: `302호 앞에 도착했을 때 문이 손바닥 너비만큼 열려 있었다. 안쪽에서 호출버튼이 침대 난간에 부딪힌다.

미지근한 물컵, 구겨진 침구, 최근 교체한 수액, 환자용 슬리퍼 한 켤레가 보인다.

문은 안쪽에서 다시 닫힌다.`,
    choices: [
      {
        id: 'WAIT_FOR_BROADCAST_AFTER_ROOM',
        text: '로비로 돌아가 호출 표시판을 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'moveLocation', locationId: LOCATION_1F_LOBBY },
          { type: 'jumpScene', sceneId: SCENE_CH01_BROADCAST_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_TELL_YUJIN_2305]: {
    id: SCENE_CH01_TELL_YUJIN_2305,
    locationId: LOCATION_1F_LOBBY,
    title: '23:05 — 유진의 대답',
    body: `"제가 확인하겠습니다. 로비에 계세요."

유진은 302호라는 말을 듣기 전에 서쪽 병동을 봤다.`,
    choices: [
      {
        id: 'WAIT_FOR_BROADCAST_AFTER_TELLING',
        text: '표시등을 지켜본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'jumpScene', sceneId: SCENE_CH01_BROADCAST_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_KEEP_SEARCHING_2305]: {
    id: SCENE_CH01_KEEP_SEARCHING_2305,
    locationId: LOCATION_1F_LOBBY,
    title: '23:05 — 닫힌 길',
    body: `원무과 단말기는 잠겨 있다.

병동 출입문에는 유진의 출입 카드가 꽂혀 있다가 곧 빠졌다. 문이 잠긴다.`,
    choices: [
      {
        id: 'WAIT_FOR_BROADCAST_AFTER_SEARCH',
        text: '호출 표시판을 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'jumpScene', sceneId: SCENE_CH01_BROADCAST_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_CHALLENGE_YUJIN_2305]: {
    id: SCENE_CH01_CHALLENGE_YUJIN_2305,
    locationId: LOCATION_1F_LOBBY,
    title: '23:05 — 302호',
    body: `"공실인 방에서 호출벨이 울리는 게 정상입니까?"

"제가 확인하겠습니다."

"302호죠."

유진은 대답하지 않았다.`,
    choices: [
      {
        id: 'WAIT_FOR_BROADCAST_AFTER_CHALLENGE',
        text: '유진이 서쪽 병동으로 가는 것을 본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'jumpScene', sceneId: SCENE_CH01_BROADCAST_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_BROADCAST_2312]: {
    id: SCENE_CH01_BROADCAST_2312,
    locationId: LOCATION_1F_LOBBY,
    title: '23:12 — 응답 확인',
    body: `302호 호출이 멈춘다.

평범한 안내 방송이 나온다.

야간 외래 진료가 종료되었습니다. 보호자께서는—

짧은 노이즈가 문장을 잘랐다. 방송이 끊긴 뒤 다른 음성이 섞인다.

...Subject Six.

잡음.

Response confirmed.

끝.`,
    choices: [
      {
        id: 'CONTINUE_TO_ZERO_HOUR',
        text: '방송이 끊긴 스피커를 올려다본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 48 },
          { type: 'jumpScene', sceneId: SCENE_BLACKOUT_0000 },
        ],
      },
    ],
  },
  [SCENE_LOOP2_CONVERSATION_COMPRESSED]: {
    id: SCENE_LOOP2_CONVERSATION_COMPRESSED,
    locationId: LOCATION_1F_LOBBY,
    title: '22:03 — 이미 들은 대답',
    body: `"...성함이요?"

"서윤. 기록에는 없고, 퇴원했을 수도 있다고 하시겠죠."

유진의 손이 키보드 위에서 멈춘다.

"자정에는 정전이 납니다. 그 전에 확인할 게 있습니다."

유진이 닫으려던 화면을 그대로 둔 채 이쪽을 봤다.`,
    choices: [
      {
        id: 'SCOUT_SERVICE_DOOR_EARLY',
        text: '[기억] 확보한 시간으로 서비스 출입문을 미리 확인한다.',
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 }],
        effects: [
          { type: 'advanceTime', minutes: 9 },
          { type: 'moveLocation', locationId: LOCATION_1F_SERVICE_DOOR },
          { type: 'jumpScene', sceneId: SCENE_LOOP2_SERVICE_DOOR_SCOUTED },
        ],
      },
    ],
  },
  [SCENE_LOOP2_SERVICE_DOOR_SCOUTED]: {
    id: SCENE_LOOP2_SERVICE_DOOR_SCOUTED,
    locationId: LOCATION_1F_SERVICE_DOOR,
    title: '22:12 — 서비스 출입문',
    body: `로비 뒤편 복도를 확인했다. 직원용 서비스 출입문 위에 전자 잠금 표시가 켜져 있다.

문 옆 비상 안내도에는 아래층으로 이어지는 계단이 표시되어 있다.

B1 서비스 통로

손잡이는 움직이지 않는다. 자정에 다시 오면 된다.`,
    choices: [
      {
        id: 'PREEMPT_BLACKOUT_AT_SERVICE_DOOR',
        text: '[기억] 23:55에 이 문 앞으로 돌아온다.',
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 }],
        effects: [
          { type: 'advanceTime', minutes: 103 },
          { type: 'jumpScene', sceneId: SCENE_LOOP2_PREPARE_2355 },
        ],
      },
    ],
  },
  [SCENE_LOOP2_PREPARE_2355]: {
    id: SCENE_LOOP2_PREPARE_2355,
    locationId: LOCATION_1F_SERVICE_DOOR,
    title: '23:55 — 문 앞',
    body: `서비스 출입문 앞에 섰다. 표시등은 붉은색이다.

휴대전화는 23:55.

이번에는 문과 다섯 걸음 거리다.`,
    choices: [
      {
        id: 'WAIT_FOR_KNOWN_BLACKOUT',
        text: '[기억] 잠금이 풀리는 순간까지 기다린다.',
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 }],
        effects: [
          { type: 'advanceTime', minutes: 5 },
          { type: 'jumpScene', sceneId: SCENE_LOOP2_BLACKOUT_INTERVENTION },
        ],
      },
    ],
  },
  [SCENE_LOOP2_BLACKOUT_INTERVENTION]: {
    id: SCENE_LOOP2_BLACKOUT_INTERVENTION,
    locationId: LOCATION_1F_SERVICE_DOOR,
    title: '00:00 — 선점',
    body: `조명이 꺼진다.

전자 잠금 표시도 함께 사라진다.

철컥.

손잡이가 내려간다.

로비 쪽에서 경비의 목소리가 들리지만 이미 문 반대편이다.`,
    choices: [
      {
        id: 'ENTER_SERVICE_CORRIDOR',
        text: '열린 문으로 들어간다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_SERVICE_CORRIDOR_LOG },
          { type: 'setFlag', flag: FLAG_FIRST_DEATH_AVOIDED, value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 1 },
          { type: 'moveLocation', locationId: LOCATION_B1_SERVICE_CORRIDOR },
          { type: 'jumpScene', sceneId: SCENE_LOOP2_SERVICE_CORRIDOR },
        ],
      },
    ],
  },
  [SCENE_LOOP2_SERVICE_CORRIDOR]: {
    id: SCENE_LOOP2_SERVICE_CORRIDOR,
    locationId: LOCATION_B1_SERVICE_CORRIDOR,
    title: '00:01 — B1 서비스 통로',
    body: `계단 아래에는 낮은 천장의 서비스 통로가 이어진다. 배관과 운반 카트 외에는 보이지 않는다.

벽의 출입 기록 단말기에 마지막 승인 한 줄이 남아 있다.

21:58 / B1 전실 승인 / C.M.S.

서윤의 메시지가 도착한 시각과 같다.`,
    choices: [],
  },
  [SCENE_BLACKOUT_0000]: {
    id: SCENE_BLACKOUT_0000,
    locationId: LOCATION_1F_LOBBY,
    title: '00:00 — 정전',
    body: `조명이 꺼졌다.

로비 뒤쪽에서 전자음이 끊긴다. 직원용 서비스 출입문 위의 붉은 표시가 꺼졌다.

철컥.

잠금이 풀렸다.

문으로 가기 전에 서쪽 출입구가 열렸다. 어둠 속에서 멈추라는 목소리가 겹쳤다.`,
    choices: [
      {
        id: 'MOVE_IN_DARKNESS',
        text: '어둠 속에서 소리가 난 방향으로 움직인다.',
        kind: 'standard',
        effects: [{ type: 'jumpScene', sceneId: SCENE_FIRST_DEATH }],
      },
    ],
  },
  [SCENE_FIRST_DEATH]: {
    id: SCENE_FIRST_DEATH,
    locationId: LOCATION_1F_LOBBY,
    title: '첫 번째 죽음',
    body: '혼란 속 경비의 오인 대응으로 쓰러지며 정전 시각을 각인한다.',
    choices: [],
    onEnter: [
      { type: 'gainMemory', memory: blackoutMemory },
      { type: 'triggerDeath', deathId: FIRST_DEATH_ID, intel: firstDeathIntel },
    ],
  },
};
