import type {
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
export const SCENE_BLACKOUT_0000 = 'SCENE_BLACKOUT_0000' as SceneId;
export const SCENE_FIRST_DEATH = 'SCENE_FIRST_DEATH' as SceneId;
export const LOCATION_1F_LOBBY = '1F_LOBBY' as LocationId;
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
          { type: 'advanceTime', minutes: 108 },
          { type: 'jumpScene', sceneId: SCENE_BLACKOUT_0000 },
        ],
      },
    ],
  },
  [SCENE_BLACKOUT_0000]: {
    id: SCENE_BLACKOUT_0000,
    locationId: LOCATION_1F_LOBBY,
    title: '00:00 — 정전',
    body: '조명이 꺼지고, 첫 루프의 플레이어는 무엇이 오는지 모른다.',
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
