import type {
  ClueId,
  DeathIntel,
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
export const SCENE_CH01_LOBBY_DECISION = 'SCENE_CH01_LOBBY_DECISION' as SceneId;
export const SCENE_CH01_RECORDS_RESULT = 'SCENE_CH01_RECORDS_RESULT' as SceneId;
export const SCENE_CH01_RECORDS_INTERRUPTED = 'SCENE_CH01_RECORDS_INTERRUPTED' as SceneId;
export const SCENE_CH01_WEST_WARD_RESULT = 'SCENE_CH01_WEST_WARD_RESULT' as SceneId;
export const SCENE_CH01_WEST_WARD_RETURN = 'SCENE_CH01_WEST_WARD_RETURN' as SceneId;
export const SCENE_CH01_WATCH_YUJIN = 'SCENE_CH01_WATCH_YUJIN' as SceneId;
export const SCENE_CH01_YUJIN_CALL = 'SCENE_CH01_YUJIN_CALL' as SceneId;
export const SCENE_CH01_CALL_BELL_2252 = 'SCENE_CH01_CALL_BELL_2252' as SceneId;
export const SCENE_CH01_BELL_CHECK_RESULT = 'SCENE_CH01_BELL_CHECK_RESULT' as SceneId;
export const SCENE_CH01_BELL_TELL_YUJIN = 'SCENE_CH01_BELL_TELL_YUJIN' as SceneId;
export const SCENE_CH01_BELL_CLUE_RESPONSE = 'SCENE_CH01_BELL_CLUE_RESPONSE' as SceneId;
export const SCENE_CH01_SUBJECT_SIX_2312 = 'SCENE_CH01_SUBJECT_SIX_2312' as SceneId;
export const SCENE_BLACKOUT_0000 = 'SCENE_BLACKOUT_0000' as SceneId;
export const SCENE_FIRST_DEATH = 'SCENE_FIRST_DEATH' as SceneId;
export const LOCATION_1F_LOBBY = '1F_LOBBY' as LocationId;
export const LOCATION_1F_WEST_WARD = '1F_WEST_WARD' as LocationId;
export const LOCATION_1F_STAFF_ELEVATOR = '1F_STAFF_ELEVATOR' as LocationId;
export const CLUE_PATIENT_S06 = 'CLUE_PATIENT_S06' as ClueId;
export const CLUE_ROOM_302_OCCUPIED = 'CLUE_ROOM_302_OCCUPIED' as ClueId;
export const CLUE_YUJIN_CALL = 'CLUE_YUJIN_CALL' as ClueId;
export const MEMORY_BLACKOUT_0000 = 'MEMORY_BLACKOUT_0000' as MemoryId;
export const FIRST_DEATH_ID = 'DEATH_BLACKOUT_SECURITY';

export const blackoutMemory: MemoryRecord = {
  id: MEMORY_BLACKOUT_0000,
  title: '정전 시각',
  description: '백야의료원의 정전은 정확히 00:00에 발생한다.',
  acquiredOnLoop: 1,
  sourceSceneId: SCENE_FIRST_DEATH,
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
        id: 'WARN_YUJIN_ABOUT_BLACKOUT',
        text: '[기억] 정확히 자정에 정전될 거예요.',
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 }],
        effects: [
          { type: 'setFlag', flag: 'warnedYujin', value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 3 },
          { type: 'jumpScene', sceneId: SCENE_CH00_YUJIN_DENIAL },
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
        id: 'WAIT_FOR_YUJIN',
        text: '돌아오는 유진을 기다린다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 6 },
          { type: 'jumpScene', sceneId: SCENE_CH01_LOBBY_DECISION },
        ],
      },
    ],
  },
  [SCENE_CH01_LOBBY_DECISION]: {
    id: SCENE_CH01_LOBBY_DECISION,
    locationId: LOCATION_1F_LOBBY,
    title: '22:18 — 어디부터 볼 것인가',
    body: `유진은 아직 돌아오지 않았다.

접수대 안쪽에는 원무과 단말기가 켜져 있다. 서쪽 복도 위 표지판에는 '병동 301–308'이 적혀 있다.

직원 구역으로 이어지는 문은 완전히 닫히지 않았다.`,
    choices: [
      {
        id: 'INVESTIGATE_RECORDS',
        text: '원무과 단말기를 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_PATIENT_S06 },
          { type: 'advanceTime', minutes: 9 },
          { type: 'jumpScene', sceneId: SCENE_CH01_RECORDS_RESULT },
        ],
      },
      {
        id: 'INVESTIGATE_WEST_WARD',
        text: '서쪽 병동으로 가본다.',
        kind: 'standard',
        effects: [
          { type: 'gainClue', clueId: CLUE_ROOM_302_OCCUPIED },
          { type: 'advanceTime', minutes: 9 },
          { type: 'moveLocation', locationId: LOCATION_1F_WEST_WARD },
          { type: 'jumpScene', sceneId: SCENE_CH01_WEST_WARD_RESULT },
        ],
      },
      {
        id: 'WATCH_YUJIN',
        text: '유진을 지켜본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 9 },
          { type: 'jumpScene', sceneId: SCENE_CH01_WATCH_YUJIN },
        ],
      },
    ],
  },
  [SCENE_CH01_RECORDS_RESULT]: {
    id: SCENE_CH01_RECORDS_RESULT,
    locationId: LOCATION_1F_LOBBY,
    title: '22:27 — 삭제된 환자',
    body: `검색창에 서윤의 이름을 입력했다. 결과는 없다.

생년월일로 다시 찾자 환자 기록 하나가 나타났다. 이름 칸은 비어 있다.

환자 ID: S-06

상태: 관리자 권한으로 삭제됨

S-06이 누구인지는 확인할 수 없다.`,
    choices: [
      {
        id: 'KEEP_CHECKING_RECORDS',
        text: '삭제 기록을 더 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_RECORDS_INTERRUPTED },
        ],
      },
    ],
  },
  [SCENE_CH01_RECORDS_INTERRUPTED]: {
    id: SCENE_CH01_RECORDS_INTERRUPTED,
    locationId: LOCATION_1F_LOBBY,
    title: '22:40 — 직원용 단말기',
    body: `접수대 안쪽 문이 열렸다. 유진이 돌아왔다.

화면을 본 유진이 단말기 전원 버튼을 눌렀다.

"직원용입니다."

"삭제된 환자 기록이 있던데요."

"보신 내용은 잊어 주세요."`,
    choices: [
      {
        id: 'WAIT_AFTER_RECORDS',
        text: '단말기에서 물러난다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 12 },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_WEST_WARD_RESULT]: {
    id: SCENE_CH01_WEST_WARD_RESULT,
    locationId: LOCATION_1F_WEST_WARD,
    title: '22:27 — 302호',
    body: `서쪽 병동에는 소독약 냄새가 남아 있다. 병실 문은 닫혀 있고 간호 스테이션은 비어 있다.

302호 앞에서 호출등이 짧게 켜졌다.

문에는 '공실' 표지가 붙어 있다. 문 아래로 얇은 빛이 새어 나온다.

손잡이는 움직이지 않는다.`,
    choices: [
      {
        id: 'TRY_ROOM_302_AGAIN',
        text: '302호 문을 다시 확인한다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_WEST_WARD_RETURN },
        ],
      },
    ],
  },
  [SCENE_CH01_WEST_WARD_RETURN]: {
    id: SCENE_CH01_WEST_WARD_RETURN,
    locationId: LOCATION_1F_WEST_WARD,
    title: '22:40 — 닫힌 문',
    body: `문 안쪽에서 바퀴가 구르는 소리가 났다. 문 가까이에서 멈췄다.

다시 손잡이를 잡았다. 잠긴 상태는 그대로다.

간호 스테이션 전화기는 연결음 없이 한 번 울리고 멎었다.`,
    choices: [
      {
        id: 'RETURN_FROM_WEST_WARD',
        text: '로비로 돌아간다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 12 },
          { type: 'moveLocation', locationId: LOCATION_1F_LOBBY },
          { type: 'jumpScene', sceneId: SCENE_CH01_CALL_BELL_2252 },
        ],
      },
    ],
  },
  [SCENE_CH01_WATCH_YUJIN]: {
    id: SCENE_CH01_WATCH_YUJIN,
    locationId: LOCATION_1F_LOBBY,
    title: '22:27 — 카운터 건너편',
    body: `접수대 건너편 의자에 앉았다.

유진은 기록지를 정리했다. 세 번 접은 종이를 주머니에 넣고 22시 34분에 자리에서 일어났다.

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
          { type: 'jumpScene', sceneId: SCENE_CH01_YUJIN_CALL },
        ],
      },
    ],
  },
  [SCENE_CH01_YUJIN_CALL]: {
    id: SCENE_CH01_YUJIN_CALL,
    locationId: LOCATION_1F_STAFF_ELEVATOR,
    title: '22:34 — 직원 전용 엘리베이터',
    body: `직원 전용 엘리베이터 앞에서 유진이 통화하고 있었다.

"아니요. 아직 모릅니다."

유진은 상대의 말을 들었다.

"제가 처리하겠습니다."

통화를 끝낸 유진이 돌아봤다. 휴대전화를 주머니에 넣었다.

"여긴 직원 구역입니다."`,
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
  [SCENE_CH01_CALL_BELL_2252]: {
    id: SCENE_CH01_CALL_BELL_2252,
    locationId: LOCATION_1F_LOBBY,
    title: '22:52 — 호출벨',
    body: `호출벨이 울린다.

서쪽 병동 표시등 하나가 붉게 깜박인다.`,
    choices: [
      {
        id: 'CHECK_CALL_BELL',
        text: '호출벨을 확인하러 간다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'moveLocation', locationId: LOCATION_1F_WEST_WARD },
          { type: 'jumpScene', sceneId: SCENE_CH01_BELL_CHECK_RESULT },
        ],
      },
      {
        id: 'TELL_YUJIN_ABOUT_BELL',
        text: '유진에게 알린다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_BELL_TELL_YUJIN },
        ],
      },
      {
        id: 'IDENTIFY_ROOM_302',
        text: '[단서: ROOM_302_OCCUPIED] 302호가 공실이라는 건 이미 확인했다.',
        kind: 'standard',
        conditions: [{ type: 'hasClue', clueId: CLUE_ROOM_302_OCCUPIED }],
        effects: [
          { type: 'advanceTime', minutes: 13 },
          { type: 'jumpScene', sceneId: SCENE_CH01_BELL_CLUE_RESPONSE },
        ],
      },
    ],
  },
  [SCENE_CH01_BELL_CHECK_RESULT]: {
    id: SCENE_CH01_BELL_CHECK_RESULT,
    locationId: LOCATION_1F_WEST_WARD,
    title: '23:05 — 응답 없음',
    body: `302호 호출등은 켜져 있다. 문은 여전히 잠겨 있다.

두 번 노크했다. 안에서 대답은 없다.`,
    choices: [
      {
        id: 'WAIT_FOR_FIXED_EVENT_AFTER_CHECK',
        text: '호출등을 지켜본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'moveLocation', locationId: LOCATION_1F_LOBBY },
          { type: 'jumpScene', sceneId: SCENE_CH01_SUBJECT_SIX_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_BELL_TELL_YUJIN]: {
    id: SCENE_CH01_BELL_TELL_YUJIN,
    locationId: LOCATION_1F_LOBBY,
    title: '23:05 — 유진의 대답',
    body: `"제가 확인하겠습니다. 로비에 계세요."

유진은 302호라는 말을 듣기 전에 서쪽 병동을 봤다.`,
    choices: [
      {
        id: 'WAIT_FOR_FIXED_EVENT_AFTER_TELLING',
        text: '표시등을 지켜본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'jumpScene', sceneId: SCENE_CH01_SUBJECT_SIX_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_BELL_CLUE_RESPONSE]: {
    id: SCENE_CH01_BELL_CLUE_RESPONSE,
    locationId: LOCATION_1F_LOBBY,
    title: '23:05 — 302호',
    body: `"302호죠. 공실 표지도 확인했습니다."

유진이 호출 표시판을 확인했다.

"로비에 계세요."

같은 말이지만 이번에는 대답이 늦었다.`,
    choices: [
      {
        id: 'WAIT_FOR_FIXED_EVENT_AFTER_CLUE',
        text: '유진이 가는 방향을 본다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 7 },
          { type: 'jumpScene', sceneId: SCENE_CH01_SUBJECT_SIX_2312 },
        ],
      },
    ],
  },
  [SCENE_CH01_SUBJECT_SIX_2312]: {
    id: SCENE_CH01_SUBJECT_SIX_2312,
    locationId: LOCATION_1F_LOBBY,
    title: '23:12 — 응답 확인',
    body: `302호 호출이 갑자기 멈춘다.

천장 스피커가 켜졌다. 짧은 노이즈 뒤로 기계적인 영어 음성이 흘러나온다.

Subject Six, response confirmed.

방송은 바로 끊긴다.`,
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
  [SCENE_BLACKOUT_0000]: {
    id: SCENE_BLACKOUT_0000,
    locationId: LOCATION_1F_LOBBY,
    title: '00:00 — 정전',
    body: '조명이 꺼졌다. 무엇이 오는지는 알 수 없었다.',
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
