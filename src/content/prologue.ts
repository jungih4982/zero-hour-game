import type {
  ChoiceCondition,
  ClueId,
  DeathIntel,
  GameTime,
  LocationId,
  MemoryId,
  MemoryRecord,
  NarrativeChoice,
  NarrativeEffect,
  NarrativeScene,
  SceneId,
} from '../engine/types';

export const SCENE_CH00_ENTRANCE = 'SCENE_ACT0_DRIVE' as SceneId;
export const SCENE_ACT0_WATCH_CALL = 'SCENE_ACT0_WATCH_CALL' as SceneId;
export const SCENE_ACT0_MESSAGES = 'SCENE_ACT0_MESSAGES' as SceneId;
export const SCENE_ACT0_LAST_CALL = 'SCENE_ACT0_LAST_CALL' as SceneId;
export const SCENE_ACT0_ARRIVAL = 'SCENE_ACT0_ARRIVAL' as SceneId;
export const SCENE_CH00_YUJIN_FIRST = 'SCENE_ACT1_YUJIN_FIRST' as SceneId;
export const SCENE_ACT1_YUJIN_SEARCH = 'SCENE_ACT1_YUJIN_SEARCH' as SceneId;
export const SCENE_CH00_YUJIN_DENIAL = 'SCENE_ACT1_YUJIN_DENIAL' as SceneId;
export const SCENE_ACT1_YUJIN_WARNING = 'SCENE_ACT1_YUJIN_WARNING' as SceneId;
export const SCENE_ACT2_THIRD_FLOOR = 'SCENE_ACT2_THIRD_FLOOR' as SceneId;
export const SCENE_ACT2_NURSE_AT_302 = 'SCENE_ACT2_NURSE_AT_302' as SceneId;
export const SCENE_ACT2_ROOM_CONTRADICTION = 'SCENE_ACT2_ROOM_CONTRADICTION' as SceneId;
export const SCENE_ACT2_WRISTBAND = 'SCENE_ACT2_WRISTBAND' as SceneId;
export const SCENE_ACT2_REMOTE_KNOWLEDGE = 'SCENE_ACT2_REMOTE_KNOWLEDGE' as SceneId;
export const SCENE_ACT3_MAP_AND_TAEJUN = 'SCENE_ACT3_MAP_AND_TAEJUN' as SceneId;
export const SCENE_BLACKOUT_0000 = 'SCENE_ACT3_BLACKOUT' as SceneId;
export const SCENE_FIRST_DEATH = 'SCENE_FIRST_DEATH' as SceneId;
export const SCENE_LOOP2_RESET_AWAKENING = 'SCENE_LOOP2_RESET_AWAKENING' as SceneId;
export const SCENE_VERTICAL_SLICE_TITLE = 'SCENE_VERTICAL_SLICE_TITLE' as SceneId;
export const SCENE_LOOP2_FIRST_CALL_TEST = 'SCENE_LOOP2_FIRST_CALL_TEST' as SceneId;
export const SCENE_LOOP2_EARLY_ARRIVAL = 'SCENE_LOOP2_EARLY_ARRIVAL' as SceneId;
export const SCENE_LOOP2_FIRST_PHONE = 'SCENE_LOOP2_FIRST_PHONE' as SceneId;
export const SCENE_LOOP2_PHONE_PARADOX = 'SCENE_LOOP2_PHONE_PARADOX' as SceneId;
export const SCENE_LOOP2_YUJIN_FOREKNOWLEDGE = 'SCENE_LOOP2_YUJIN_FOREKNOWLEDGE' as SceneId;
export const SCENE_LOOP2_YUJIN_MINIMAL = 'SCENE_LOOP2_YUJIN_MINIMAL' as SceneId;
export const SCENE_LOOP2_STAFF_DOOR = 'SCENE_LOOP2_STAFF_DOOR' as SceneId;
export const SCENE_LOOP2_BLACKOUT_INTERVENTION = 'SCENE_LOOP2_BLACKOUT_INTERVENTION' as SceneId;
export const SCENE_LOOP2_OPERATIONS_CORRIDOR = 'SCENE_LOOP2_OPERATIONS_CORRIDOR' as SceneId;
export const SCENE_LOOP2_SEA_FIRST_MEETING = 'SCENE_LOOP2_SEA_FIRST_MEETING' as SceneId;
export const SCENE_LOOP2_TAEJUN_REJECTION = 'SCENE_LOOP2_TAEJUN_REJECTION' as SceneId;
export const SCENE_LOOP2_SEOYUN_RECHECK = 'SCENE_LOOP2_SEOYUN_RECHECK' as SceneId;
export const SCENE_LOOP2_RETURN_302 = 'SCENE_LOOP2_RETURN_302' as SceneId;
export const SCENE_LOOP2_SECOND_PHONE = 'SCENE_LOOP2_SECOND_PHONE' as SceneId;
export const SCENE_VERTICAL_SLICE_END = 'SCENE_VERTICAL_SLICE_END' as SceneId;

export const LOCATION_MOUNTAIN_ROAD = 'MOUNTAIN_ROAD' as LocationId;
export const LOCATION_CAR = 'CAR' as LocationId;
export const LOCATION_HOSPITAL_EXTERIOR = 'HOSPITAL_EXTERIOR' as LocationId;
export const LOCATION_1F_LOBBY = '1F_LOBBY' as LocationId;
export const LOCATION_3F_CORRIDOR = '3F_CORRIDOR' as LocationId;
export const LOCATION_ROOM_302 = 'ROOM_302' as LocationId;
export const LOCATION_1F_STAFF_DOOR = '1F_STAFF_DOOR' as LocationId;
export const LOCATION_B1_OPERATIONS_CORRIDOR = 'B1_OPERATIONS_CORRIDOR' as LocationId;

export const CLUE_WATCH_GIFT = 'CLUE_WATCH_GIFT' as ClueId;
export const CLUE_YUJIN_KNOWN = 'CLUE_YUJIN_KNOWN' as ClueId;
export const CLUE_B1_MAP = 'CLUE_B1_MAP' as ClueId;
export const CLUE_302_OCCUPIED = 'CLUE_302_OCCUPIED' as ClueId;
export const CLUE_WRISTBAND_DOB = 'CLUE_WRISTBAND_DOB' as ClueId;
export const CLUE_FIRST_PHONE = 'CLUE_FIRST_PHONE' as ClueId;
export const CLUE_SECOND_PHONE = 'CLUE_SECOND_PHONE' as ClueId;
export const CLUE_SEA_KNOWS = 'CLUE_SEA_KNOWS' as ClueId;

export const FLAG_YUJIN_WARY = 'FLAG_YUJIN_WARY';
export const FLAG_FIRST_DEATH_AVOIDED = 'FLAG_FIRST_DEATH_AVOIDED';
export const MEMORY_BLACKOUT_0000 = 'MEMORY_BLACKOUT_0000' as MemoryId;
export const MEMORY_RESET_WATCH = 'MEMORY_RESET_WATCH' as MemoryId;
export const FIRST_DEATH_ID = 'DEATH_ZERO_HOUR_UNKNOWN';

type ChoiceOptions = {
  kind?: NarrativeChoice['kind'];
  conditions?: readonly ChoiceCondition[];
  effects?: readonly NarrativeEffect[];
  locationId?: LocationId;
};

function to(
  id: string,
  text: string,
  sceneId: SceneId,
  minutes: number,
  options: ChoiceOptions = {},
): NarrativeChoice {
  return {
    id,
    text,
    kind: options.kind ?? 'standard',
    conditions: options.conditions,
    effects: [
      ...(options.effects ?? []),
      { type: 'advanceTime', minutes },
      ...(options.locationId
        ? [{ type: 'moveLocation', locationId: options.locationId } as const]
        : []),
      { type: 'jumpScene', sceneId },
    ],
  };
}

const knowsBlackout: readonly ChoiceCondition[] = [
  { type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 },
];

export const blackoutMemory: MemoryRecord = {
  id: MEMORY_BLACKOUT_0000,
  title: '자정에 열린 문',
  description: '정전과 동시에 복도 끝 직원용 문의 전자 잠금이 풀린다.',
  acquiredOnLoop: 1,
  sourceSceneId: SCENE_FIRST_DEATH,
  payoff: {
    predictsEvent: '자정 정전과 직원용 문 잠금 해제',
    usableFrom: 70 as GameTime,
    usableUntil: 120 as GameTime,
    changes: ['riskAvoided', 'routeUnlocked', 'eventPreempted'],
    avoidsRisk: FIRST_DEATH_ID,
    unlocksLocationId: LOCATION_B1_OPERATIONS_CORRIDOR,
  },
};

export const resetWatchMemory: MemoryRecord = {
  id: MEMORY_RESET_WATCH,
  title: '돌아온 균열',
  description: '몸과 전화는 첫 통화 때로 돌아왔지만 아날로그 시계의 금은 그대로 남았다.',
  acquiredOnLoop: 1,
  sourceSceneId: SCENE_LOOP2_RESET_AWAKENING,
  payoff: {
    predictsEvent: '서윤의 첫 통화가 같은 말과 같은 잡음으로 반복됨',
    changes: ['informationCombined', 'timeSaved'],
    timeSavedMinutes: 8,
  },
};

export const firstDeathIntel: DeathIntel = {
  memoryId: MEMORY_BLACKOUT_0000,
  deathId: FIRST_DEATH_ID,
  title: 'ZERO HOUR',
  description: '누가 어떻게 죽였는지는 보이지 않았다. 자정에 불이 꺼지고 직원용 문이 열린다는 사실만 남았다.',
};

export const prologueScenes: Readonly<Record<string, NarrativeScene>> = {
  [SCENE_CH00_ENTRANCE]: {
    id: SCENE_CH00_ENTRANCE,
    locationId: LOCATION_MOUNTAIN_ROAD,
    title: '퇴근길',
    body: `늦은 저녁. 비는 어느새 눈으로 바뀌어 있었다. 도로 위로 떨어진 눈은 금세 녹아 없어지고, 와이퍼는 앞유리에 맺힌 물기를 일정한 간격으로 걷어냈다.

휴대전화가 울렸다. 차량 화면에 서윤의 이름이 떴다.

"응."

"뭐 해?"

"운전 중."

"어디 가는데?"

"집 가지."

"혼자?"

"그럼 누구랑 가."

서윤이가 웃었다.

"아니, 그냥 물어본 거지."

"뭔데. 너 용건 있을 때 꼭 이렇게 시작하잖아."

"동생이란 사람이 오빠한테 전화도 못 해?"

"전화는 할 수 있지. 그래서 무슨 일인데."

잠깐 말이 없었다.

"오늘 시간 좀 돼?"

"지금 몇 신데. 뭐 부탁하려고."

서윤이가 뜸을 들인 뒤 말했다.

"나 좀 데리러 와줄래?"

"지금? 이 시간에?"

"응. 미안."

"어딘데."

"주소 보낼게."`,
    choices: [
      to('KEEP_SEOYUN_TALKING', '목소리를 놓치지 않게 계속 말을 건다.', SCENE_ACT0_WATCH_CALL, 4, {
        locationId: LOCATION_CAR,
      }),
    ],
  },

  [SCENE_ACT0_WATCH_CALL]: {
    id: SCENE_ACT0_WATCH_CALL,
    locationId: LOCATION_CAR,
    title: '백야의료원',
    body: `메시지 알림이 떴지만 운전 중이라 바로 확인하지는 않았다.

"어디냐고."

"백야의료원."

"뭐? 잠깐. 네가 병원에 왜 있어?"

"그게 좀 길어."

"어디 아파?"

"아니."

"그럼 뭔데."

"오면 얘기할게."

"아니, 지금 얘기해."

"지금은 좀 그래."

신호가 빨간불로 바뀌었다. 차가 멈춘 뒤에야 서윤이가 보낸 주소를 열었다. 도심에서 꽤 떨어진 산 쪽이었다. 예상 소요 시간은 50분이 넘었다.

"서윤아. 여기서 거의 한 시간인데?"

"미안."

"엄마는 알아? 아버지는?"

"몰라. 오빠만 와."

한숨을 쉬며 손목시계를 확인했다. 오래된 아날로그 시계였다.

"근데 오빠. 그 시계 아직도 차?"

"네가 사준 거잖아."

"몇 년 된 건데 그걸 아직 차고 다녀."

"시간 잘 맞아."

"촌스러워."

신호가 바뀌었다. 시계 이야기는 그것으로 끝났다.`,
    choices: [
      to('ASK_ABOUT_OTHER_CALLS', '다른 전화가 무슨 뜻인지 묻는다.', SCENE_ACT0_MESSAGES, 5, {
        effects: [{ type: 'gainClue', clueId: CLUE_WATCH_GIFT }],
      }),
    ],
  },

  [SCENE_ACT0_MESSAGES]: {
    id: SCENE_ACT0_MESSAGES,
    locationId: LOCATION_CAR,
    title: '서로 다른 문자',
    body: `한동안 평범한 이야기가 이어졌다. 그러다 통화 상태가 나빠졌다. 서윤이의 목소리가 짧게 끊겼다가 돌아왔다.

"오빠. 혹시 나한테 다시 전화가 와도."

대답을 기다렸다.

"내가 평소랑 다른 얘기 하면 바로 믿지는 마."

"무슨 얘기."

"그냥 혹시나 해서."

"서윤아. 너 지금 옆에 누구 있어?"

통화가 끊겼다.

곧 메시지가 도착했다.

그냥 오지 마. 집에 가.

조금 전 통화가 떠올랐다. 답장을 쓰기도 전에 메시지가 하나 더 왔다.

방금 문자 무시해. 내가 보낸 거 아니야.

두 메시지는 같은 대화창에 붙어 있었다. 번호도 프로필 사진도 같았다.

곧바로 전화를 걸었다. 몇 차례 연결음이 이어졌지만 서윤이는 받지 않았다.`,
    choices: [to('CONTINUE_TO_BAEKYA', '차를 돌리지 않고 백야의료원으로 향한다.', SCENE_ACT0_LAST_CALL, 6)],
  },

  [SCENE_ACT0_LAST_CALL]: {
    id: SCENE_ACT0_LAST_CALL,
    locationId: LOCATION_CAR,
    title: '마지막 통화',
    body: `목적지까지 10분도 남지 않았을 때 전화가 다시 걸려왔다.

"서윤아?"

바로 대답은 돌아오지 않았다. 전화기 너머로 무언가 부딪히는 소리가 작게 들렸다.

"여보세요?"

"오빠. 지금 오고 있어?"

"응. 거의 다 왔어. 근데 아까 문자 뭐야? 누가 네 폰 만졌어?"

서윤이는 대답하지 않았다.

"오빠, 일단 잘 들어. 병원 도착하면 내 이름부터 말해봐."

"당연히 그러지."

"근데 거기 있는 사람이 나 모른다고 하면…. 내가 여기 온 적도 없고, 그런 사람 없다고 하면…. 그 말은 믿지 마."

"그러니까 그게 무슨 말이냐고. 너 지금 옆에 누구 있어?"

"아니."

짧은 대답이었다.

"경찰 부를까?"

"아직은 하지 마."

"왜?"

이번에도 답은 없었다.

"오빠. 열두 시가 되기 전에는 와."

"어디로."

"병원 안으로. 일단 들어와. 내가 다시 연락할게."

"서윤아. 너 지금 어디 있어?"

잡음이 커졌다.

"오빠, 전화가 끊겨도 일단—"

말이 끝나기 전에 통화가 끊겼다. 다시 전화를 걸어도 연결되지 않았다.`,
    choices: [
      to('ENTER_HOSPITAL_GROUNDS', '주차장으로 들어간다.', SCENE_ACT0_ARRIVAL, 8, {
        locationId: LOCATION_HOSPITAL_EXTERIOR,
      }),
    ],
  },

  [SCENE_ACT0_ARRIVAL]: {
    id: SCENE_ACT0_ARRIVAL,
    locationId: LOCATION_HOSPITAL_EXTERIOR,
    title: '백야의료원',
    body: `산길 끝에서 건물 불빛이 보이기 시작했다. 잠시 뒤 네비게이션 안내가 끝났다.

목적지에 도착했습니다.

도로 오른편으로 백야의료원 간판이 보였다. 건물은 산비탈을 따라 길게 자리 잡고 있었고 위층 몇 군데에는 아직 불이 켜져 있었다.

주차장으로 들어서자 차단기가 자동으로 올라갔다. 늦은 시간이지만 주차장은 완전히 비어 있지 않았다. 승용차 몇 대가 건물 가까운 쪽에 세워져 있었고, 구석에는 병원 로고가 붙은 승합차도 한 대 보였다.

출입구와 가까운 빈자리에 차를 세웠다. 시동을 끄자 라디오와 히터가 멎었다. 차 지붕을 두드리는 눈 소리가 또렷하게 들렸다.

병원 입구로 다가가자 자동문이 열렸다. 밖보다 따뜻한 공기가 얼굴에 닿았다. TV에서 터지는 웃음소리 사이로 자판기 쪽의 낮은 기계음이 섞여 들렸다.

접수처에 앉아 있던 여자가 인기척을 듣고 고개를 들었다. 머리를 단정하게 묶은 채 사원증을 목에 걸고 있었다.

사원증 아래 적힌 이름이 눈에 들어왔다.

한유진.`,
    choices: [
      to('APPROACH_RECEPTION', '접수처로 간다.', SCENE_CH00_YUJIN_FIRST, 3, {
        locationId: LOCATION_1F_LOBBY,
        effects: [{ type: 'gainClue', clueId: CLUE_B1_MAP }],
      }),
    ],
  },

  [SCENE_CH00_YUJIN_FIRST]: {
    id: SCENE_CH00_YUJIN_FIRST,
    locationId: LOCATION_1F_LOBBY,
    title: '한유진',
    body: `"무슨 일로 오셨어요?"

"사람을 찾으러 왔는데요."

"입원하신 분 찾으세요?"

"제 동생입니다. 서윤이라고요."

"서윤 씨요? 생년월일 혹시 아세요?"

말해주자 유진은 모니터 쪽으로 몸을 돌렸다. 키보드로 몇 글자를 입력하고 화면을 확인한 뒤 다시 검색했다.

그 과정은 특별히 수상하지 않았다.

"잠시만요."

몇 초 뒤 유진이 고개를 들었다.

"지금 입원해 계신 분 중에는 안 나오는데요."

오는 길에 서윤이가 했던 말이 떠올랐다.

병원 도착하면 내 이름부터 말해봐.

근데 거기 있는 사람이 나 모른다고 하면, 그 말은 믿지 마.`,
    choices: [to('WAIT_FOR_SEARCH_RESULT', '검색이 끝날 때까지 기다린다.', SCENE_ACT1_YUJIN_SEARCH, 4)],
  },

  [SCENE_ACT1_YUJIN_SEARCH]: {
    id: SCENE_ACT1_YUJIN_SEARCH,
    locationId: LOCATION_1F_LOBBY,
    title: '조회 결과',
    body: `"한 번만 더 봐주시겠어요?"

"생년월일이 아까…."

다시 알려주었다. 유진은 한 번 더 확인했다.

"없습니다."

이번에는 망설이지 않고 대답했다.

"아까 제 동생이 자기가 이 병원에 있다고 했습니다. 오는 길에도 계속 통화했고요."

유진이 나를 바라봤다.

"이 병원에 있다고 직접 말씀하신 거예요?"

"네. 주소도 동생이 보냈습니다."

"입원 환자가 아니면 잠깐 들렀을 수도 있어요. 그건 원무과 쪽에서 확인하셔야 하고요."

"그럼 병동에 한번 물어봐 주세요. 기록에는 없어도 누가 봤을 수도 있잖아요. 사진도 있습니다."

유진은 잠시 생각하다가 내선 전화를 들었다.

"알겠습니다. 한번 확인해 볼게요."`,
    choices: [to('QUESTION_THE_DENIAL', '직접 통화했다는 사실을 다시 말한다.', SCENE_CH00_YUJIN_DENIAL, 4)],
  },

  [SCENE_CH00_YUJIN_DENIAL]: {
    id: SCENE_CH00_YUJIN_DENIAL,
    locationId: LOCATION_1F_LOBBY,
    title: '없는 환자',
    body: `유진이 병동에 전화를 거는 동안 로비를 살폈다. 층별 안내에는 1층 원무과와 외래진료실, 2층 재활병동, 3층 입원병동, 4층 장기요양병동이 적혀 있었다.

잠시 뒤 다른 간호사 한 명이 복도에서 나왔다. 내 휴대전화 화면에 떠 있던 서윤이 사진을 본 순간 걸음이 아주 조금 느려졌다.

"저기요. 혹시 이 사람 본 적 있어요?"

간호사는 사진을 봤다. 그리고 나보다 먼저 유진을 바라봤다.

"아뇨. 잘 모르겠습니다."

간호사가 자리를 떠난 뒤 유진이 말했다.

"말씀드렸잖아요. 여기 계신 분이 아니라고요."

"저 사람은 사진도 제대로 안 봤는데요."

그때 휴대전화가 진동했다. 서윤이였다.

유진이라는 사람이야?

서윤이에게 유진의 이름을 말한 적이 없었다.`,
    choices: [
      to('READ_SEOYUN_WARNING', '유진에게 보이지 않게 답장을 확인한다.', SCENE_ACT1_YUJIN_WARNING, 3, {
        effects: [{ type: 'gainClue', clueId: CLUE_YUJIN_KNOWN }],
      }),
    ],
  },

  [SCENE_ACT1_YUJIN_WARNING]: {
    id: SCENE_ACT1_YUJIN_WARNING,
    locationId: LOCATION_1F_LOBBY,
    title: '말하지 말 것',
    body: `답장을 쓰기도 전에 다음 문장이 나타났다.

유진한테는 아무것도 더 말하지 마.

"연락이 왔습니까?"

유진이 물었다.

"아직 답이 없습니다."

"통화한 분이 맞다면 지금 위치를 보내 달라고 하세요. 병원 안이면 직원이 확인할 수 있습니다."

서윤이에게 전화를 걸었다. 연결음이 울리는 순간, 위층 어딘가에서 아주 약한 진동음이 겹쳤다.

유진도 소리를 들었는지 천장을 올려다봤다. 곧 모니터로 시선을 돌렸다.

엘리베이터 표시가 3층에 멈춰 있었다.`,
    choices: [
      to('GO_TO_THIRD_FLOOR', '입원병동이 있는 3층으로 간다.', SCENE_ACT2_THIRD_FLOOR, 6, {
        locationId: LOCATION_3F_CORRIDOR,
      }),
    ],
  },

  [SCENE_ACT2_THIRD_FLOOR]: {
    id: SCENE_ACT2_THIRD_FLOOR,
    locationId: LOCATION_3F_CORRIDOR,
    title: '3층 입원병동',
    body: `엘리베이터 문이 열리자 간호 스테이션의 전화벨과 텔레비전 소리가 먼저 들렸다. 병실 몇 곳에는 보호자가 남아 있었고 배식 카트가 벽 쪽에 세워져 있었다.

서윤에게 다시 전화를 걸었다.

연결음이 한 번 울렸다.

복도 끝에서 진동음이 들렸다. 아주 짧게 울리고 멈췄다. 다시 걸자 같은 곳에서 같은 길이로 울렸다.

301호를 지나 302호 앞에 섰다.

문이 열리고 간호사 한 명이 나왔다. 문이 닫히기 전 안쪽 침대 끝과 수액대가 보였다.

"면회 시간 끝났습니다."

"방금 이 안에서 전화가 울렸습니다. 서윤이라는 사람을 찾고 있어요."

간호사의 시선이 휴대전화에서 얼굴로 옮겨왔다.`,
    choices: [to('ASK_NURSE_ABOUT_302', '302호에 누가 있는지 묻는다.', SCENE_ACT2_NURSE_AT_302, 4)],
  },

  [SCENE_ACT2_NURSE_AT_302]: {
    id: SCENE_ACT2_NURSE_AT_302,
    locationId: LOCATION_3F_CORRIDOR,
    title: '302호',
    body: `"환자분은 계세요. 그런데 신원은 말씀드릴 수 없습니다. 1층에서 보호자 확인 먼저 하셨어요?"

"접수처에서는 빈 병실이라고 했습니다."

"제가 빈방이라고요?"

뒤에서 유진의 목소리가 들렸다. 계단으로 올라온 듯 숨이 조금 빨랐다.

"302호는 지금 비어 있습니다. 내려가시죠."

간호사가 유진을 쳐다봤다.

"방금 처치하고 나온 환자는요?"

"병실을 잘못 보셨어요."

유진은 나를 보며 말했지만 대답은 간호사에게 하고 있었다.

그때 302호 안에서 전화 진동이 다시 울렸다. 세 사람 모두 들었다.`,
    choices: [
      to('ENTER_ROOM_302_LOOP1', '닫히기 전 문을 붙잡는다.', SCENE_ACT2_ROOM_CONTRADICTION, 5, {
        locationId: LOCATION_ROOM_302,
        effects: [{ type: 'gainClue', clueId: CLUE_302_OCCUPIED }],
      }),
    ],
  },

  [SCENE_ACT2_ROOM_CONTRADICTION]: {
    id: SCENE_ACT2_ROOM_CONTRADICTION,
    locationId: LOCATION_ROOM_302,
    title: '방금까지 누군가 있던 방',
    body: `침대는 비어 있었다.

하지만 사용하지 않은 방은 아니었다. 이불 한쪽이 몸의 무게만큼 꺼져 있었고, 수액 튜브 끝에는 새 거즈가 감겨 있었다. 물컵 바깥에는 손자국이 남아 있었다. 침대 밑 슬리퍼 한 짝은 복도 쪽을 향했다.

진동은 멈췄다.

커튼 뒤와 서랍, 침대 아래를 확인했다. 전화는 보이지 않았다.

"나가세요."

유진이 문밖에서 말했다. 아까 간호사는 이미 사라지고 없었다.

침대 난간 아래에서 찢어진 환자 손목밴드가 보였다. 이름이 있어야 할 부분은 뜯겨 있었고 병실 번호와 생년월일만 남아 있었다.`,
    choices: [to('CHECK_WRISTBAND', '손목밴드의 정보를 확인한다.', SCENE_ACT2_WRISTBAND, 3)],
  },

  [SCENE_ACT2_WRISTBAND]: {
    id: SCENE_ACT2_WRISTBAND,
    locationId: LOCATION_ROOM_302,
    title: '찢어진 이름',
    body: `병실 302.

생년월일은 서윤과 같았다.

이름은 첫 글자 일부만 남아 있었다. 성인지 이름인지도 알 수 없는 세로획 하나였다.

유진이 손목밴드를 빼앗지는 않았다. 대신 문 쪽으로 비켜섰다.

"그걸 가져가시면 안 됩니다. 환자 물품이에요."

"빈방인데 누구 물품입니까?"

유진은 대답하지 않았다.

휴대전화에 메시지가 왔다.

오빠, 너 302호에 있었어?

곧 한 줄이 더 나타났다.

그 방에서 내 이름 봤어?`,
    choices: [
      to('LEAVE_WRISTBAND_AND_REPLY', '손목밴드를 제자리에 두고 방을 나온다.', SCENE_ACT2_REMOTE_KNOWLEDGE, 4, {
        locationId: LOCATION_3F_CORRIDOR,
        effects: [{ type: 'gainClue', clueId: CLUE_WRISTBAND_DOB }],
      }),
    ],
  },

  [SCENE_ACT2_REMOTE_KNOWLEDGE]: {
    id: SCENE_ACT2_REMOTE_KNOWLEDGE,
    locationId: LOCATION_3F_CORRIDOR,
    title: '보고 있지 않은 사람',
    body: `어떻게 알았어?

답장을 보냈다.

표시되던 ‘읽음’이 사라졌다. 전화 버튼을 눌렀지만 연결되지 않았다.

복도 유리창 밖은 완전히 눈으로 가려져 있었다. 간호 스테이션은 여전히 움직였지만 사람들은 필요 이상으로 서로를 보지 않았다.

유진은 엘리베이터 앞에서 기다리고 있었다.

"경비가 오기 전에 내려가세요."

"지하에는 뭐가 있습니까?"

"기계실하고 창고뿐입니다. 보호자가 갈 곳이 아니에요."

지하를 묻기 전이었다.`,
    choices: [
      to('LOOK_FOR_EMPLOYEE_DOOR', '1층 피난 안내도와 직원용 문을 다시 확인한다.', SCENE_ACT3_MAP_AND_TAEJUN, 8, {
        locationId: LOCATION_1F_STAFF_DOOR,
      }),
    ],
  },

  [SCENE_ACT3_MAP_AND_TAEJUN]: {
    id: SCENE_ACT3_MAP_AND_TAEJUN,
    locationId: LOCATION_1F_STAFF_DOOR,
    title: '복도 끝의 문',
    body: `피난 안내도의 아래쪽 계단은 1층 복도 끝에서 시작했다. 실제로는 ‘직원 외 출입금지’ 표지가 붙은 문이 막고 있었다.

사원증 인식기에 붉은 불이 들어와 있었다. 손잡이는 움직이지 않았다.

"거기서 뭐 하십니까?"

경비복을 입은 남자가 다가왔다. 명찰에는 강태준. 오른쪽 관자놀이 위로 짧게 아문 흉터가 있었다.

"피난도를 봤습니다. 지하로 내려가는 계단이 있네요."

"직원 구역입니다. 로비로 가세요."

"서윤이라는 사람을 찾고 있습니다."

태준의 표정은 변하지 않았다. 다만 무전을 잡은 손이 멈췄다.

천장 조명이 한 번 어두워졌다 돌아왔다. 손목의 초침은 정상적으로 움직이고 있었다.`,
    choices: [to('STAY_UNTIL_BLACKOUT', '로비 쪽으로 물러나되 문이 보이는 곳에 남는다.', SCENE_BLACKOUT_0000, 9)],
  },

  [SCENE_BLACKOUT_0000]: {
    id: SCENE_BLACKOUT_0000,
    locationId: LOCATION_1F_STAFF_DOOR,
    title: '00:00',
    body: `모든 불이 동시에 꺼졌다.

발전기가 바로 들어오지 않았다. 로비 텔레비전과 접수 단말기, 비상 유도등까지 한꺼번에 죽었다.

손목에서 작은 소리가 났다.

초침이 열두 시를 가리킨 채 멈췄다.

복도 끝에서 전자 잠금이 풀리는 소리가 났다.

철컥.

어둠 속에서 누군가 뛰었다. 로비 쪽인지 문 쪽인지 구분할 수 없었다. 태준의 목소리가 들렸고, 곧 다른 목소리가 겹쳤다.

"움직이지 마요."

휴대전화 화면을 켰지만 신호도 시간도 표시되지 않았다.`,
    choices: [to('MOVE_TOWARD_UNLOCKED_DOOR', '잠금이 풀린 소리를 따라간다.', SCENE_FIRST_DEATH, 0)],
  },

  [SCENE_FIRST_DEATH]: {
    id: SCENE_FIRST_DEATH,
    locationId: LOCATION_1F_STAFF_DOOR,
    title: '첫 번째 죽음',
    body: `세 걸음을 옮겼다.

바닥의 방향이 갑자기 달라졌다. 계단을 밟은 것 같기도 했고 누군가 어깨를 민 것 같기도 했다.

손을 뻗자 차가운 금속이 손바닥을 스쳤다. 바로 뒤에서 짧은 숨소리가 들렸다.

"그쪽 아니—"

문장은 끝나지 않았다.

충격은 한 번뿐이었다. 통증보다 먼저 손목시계 유리가 깨지는 소리를 들었다.

어둠 속에서 누군가 내 이름을 불렀다. 서윤과 같은 목소리였지만, 서윤이라고 확신하기에는 너무 가까웠다.

마지막으로 기억한 것은 열린 문과 멈춘 초침이었다.`,
    choices: [],
    onEnter: [
      { type: 'gainMemory', memory: blackoutMemory },
      { type: 'gainMemory', memory: resetWatchMemory },
      { type: 'triggerDeath', deathId: FIRST_DEATH_ID, intel: firstDeathIntel },
    ],
  },

  [SCENE_LOOP2_RESET_AWAKENING]: {
    id: SCENE_LOOP2_RESET_AWAKENING,
    locationId: LOCATION_CAR,
    title: '다시 차 안',
    body: `휴대전화 진동음이 들렸다. 와이퍼가 앞유리를 훑었다.

눈을 떴다.

어두운 병원 복도도, 바닥에 쓰러진 자신의 몸도 없었다. 운전 중이던 차 안이었다.

놀라 브레이크에서 발을 떼지 못하자 뒤에서 짧게 경적이 울렸다. 그제야 차가 도로 한가운데 있다는 걸 깨닫고 비상등을 켠 뒤 천천히 갓길로 차를 붙였다.

휴대전화는 계속 울리고 있었다.

서윤.

전화를 받지 못한 채 몸부터 내려다봤다. 옷에도 흔적이 없었다. 손으로 목과 가슴을 만져봤지만 아픈 곳도 없었다.

전화가 끊겼다. 차 안에는 비상등이 깜빡이는 소리만 남았다.

손목시계를 확인했다. 유리 한쪽에 가느다란 금이 가 있었다.

죽기 직전 바닥에서 봤던 것과 같았다.

그 순간 휴대전화가 다시 울렸다.

서윤.

이번에는 한참 망설인 뒤 전화를 받았다.`,
    choices: [
      to('RECOGNIZE_RESET', '깨진 시계와 반복된 첫 문장을 확인한다.', SCENE_VERTICAL_SLICE_TITLE, 1, {
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_RESET_WATCH }],
      }),
    ],
  },

  [SCENE_VERTICAL_SLICE_TITLE]: {
    id: SCENE_VERTICAL_SLICE_TITLE,
    locationId: LOCATION_CAR,
    title: 'ZERO HOUR',
    body: `똑같은 시간.

똑같은 전화.

그리고 죽은 뒤에도 남아 있는 손목시계의 금.

처음으로 돌아온 밤이 다시 시작되고 있었다.`,
    choices: [
      to('CONTINUE_AFTER_TITLE', '같은 통화를 다르게 시작한다.', SCENE_LOOP2_FIRST_CALL_TEST, 1, {
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_RESET_WATCH }],
      }),
    ],
  },

  [SCENE_LOOP2_FIRST_CALL_TEST]: {
    id: SCENE_LOOP2_FIRST_CALL_TEST,
    locationId: LOCATION_CAR,
    title: '두 번째 첫 통화',
    body: `"뭐 해?"

대답하지 못했다.

"여보세요? 오빠?"

같은 목소리였다.

"서윤아."

"응."

"너 지금 어디야?"

"갑자기?"

"어디냐고."

평소보다 목소리에 힘이 들어갔다.

"오빠 왜 그래?"

"일단 말해봐."

잠깐 조용해졌다.

"나 지금…."

나도 모르게 먼저 말했다.

"백야의료원?"

통화 너머가 조용해졌다.

"…뭐?"

"너 거기 있어?"

"어떻게 알았어?"

대답하지 못했다. 손목시계의 금을 다시 봤다.

"오빠 진짜 괜찮아?"

"잠깐만."

같은 밤인지 확인하려면 병원에 다시 가야 했다.`,
    choices: [
      to('DO_NOT_EXPLAIN_LOOP_YET', '설명하지 않고 더 빨리 병원으로 향한다.', SCENE_LOOP2_EARLY_ARRIVAL, 8, {
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_RESET_WATCH }],
        locationId: LOCATION_HOSPITAL_EXTERIOR,
      }),
    ],
  },

  [SCENE_LOOP2_EARLY_ARRIVAL]: {
    id: SCENE_LOOP2_EARLY_ARRIVAL,
    locationId: LOCATION_HOSPITAL_EXTERIOR,
    title: '조금 이른 도착',
    body: `첫 번째 밤보다 일찍 백야의료원에 도착했다.

병원에 들어오기 전, 직원 한 명이 전화하는 소리를 들었다.

"302호요? 확인했어요. 아직 그대로예요."

접수처에는 아직 유진이 없었다.

망설이다 3층으로 올라갔다. 병동 출입문은 잠겨 있었다. 유리문 너머로 보이는 302호 문은 열려 있었고, 조금 전 통화하던 간호사가 병실 안에서 누군가와 이야기하고 있었다.

"조금만 기다리세요. 금방 끝나요."

서윤이에게 전화를 걸었다.

연결음이 시작되자 302호 안에서 휴대전화 진동음이 들렸다. 전화를 끊으면 진동도 멈췄고, 다시 걸면 다시 울렸다.

잠시 뒤 간호사가 병실에서 나왔다. 한 손에는 투명한 지퍼백이 들려 있었다. 휴대전화와 지갑, 열쇠 몇 개가 들어 있는 환자 소지품 봉투였다.

다시 통화 버튼을 누르자 봉투 안의 휴대전화 화면이 켜졌다.`,
    choices: [
      to('TAKE_FIRST_PHONE', '투명 봉투 속 휴대전화를 확인한다.', SCENE_LOOP2_FIRST_PHONE, 4, {
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_RESET_WATCH }],
        locationId: LOCATION_ROOM_302,
      }),
    ],
  },

  [SCENE_LOOP2_FIRST_PHONE]: {
    id: SCENE_LOOP2_FIRST_PHONE,
    locationId: LOCATION_ROOM_302,
    title: '첫 번째 휴대전화',
    body: `간호사가 카트를 밀고 움직이자 유리문 너머에서 봉투를 가리켰다.

"잠깐만요. 저 안의 핸드폰 좀 확인해 주실 수 있습니까?"

"보호자 확인이 먼저예요."

"제 동생한테 전화를 걸면 저 핸드폰이 울립니다. 한 번만 다시 걸어보겠습니다."

간호사가 난처한 표정을 지었지만 자리를 피하지는 않았다.

서윤이에게 다시 전화를 걸었다.

투명한 봉투 안의 휴대전화가 울렸다. 화면에는 발신자 이름이 떴다.

오빠

서윤이가 쓰던 모델, 같은 색상의 케이스, 오른쪽 아래의 작은 흠집까지 같았다.

그런데 통화는 끊기지 않았다.

잠시 뒤 내 휴대전화에서 서윤이의 목소리가 들렸다.`,
    choices: [
      to('ANSWER_ON_OWN_PHONE', '손에 든 전화는 그대로 둔 채 내 전화의 연결을 기다린다.', SCENE_LOOP2_PHONE_PARADOX, 4, {
        effects: [{ type: 'gainClue', clueId: CLUE_FIRST_PHONE }],
      }),
    ],
  },

  [SCENE_LOOP2_PHONE_PARADOX]: {
    id: SCENE_LOOP2_PHONE_PARADOX,
    locationId: LOCATION_ROOM_302,
    title: '한 통화, 두 곳',
    body: `"오빠?"

서윤이의 목소리는 내 휴대전화에서 들렸다.

눈앞의 봉투 안에서도 다른 휴대전화가 계속 울렸다. 화면에는 ‘오빠’가 떠 있었다.

"지금 어디야?"

"아까 말했잖아. 병원 안이야. 오빠는 아직 오는 중이고."

"네 핸드폰이 지금 내 앞에 있어."

"무슨 소리야. 내 핸드폰 여기 있는데."

투명한 봉투를 바라봤다. 눈앞의 기기가 서윤이 것이라면 지금 전화를 받은 상대는 누구인지 설명할 수 없었다.

그때 뒤에서 유진이 다가왔다.

유진의 시선이 내 휴대전화와 봉투 안의 휴대전화 사이를 오갔다.`,
    choices: [
      to('REVEAL_EXACT_FOREKNOWLEDGE', '[기억] 유진이 부정할 말과 자정 정전을 정확히 말한다.', SCENE_LOOP2_YUJIN_FOREKNOWLEDGE, 4, {
        kind: 'foreknowledge',
        conditions: [
          { type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 },
          { type: 'hasClue', clueId: CLUE_FIRST_PHONE },
        ],
        effects: [{ type: 'setFlag', flag: FLAG_YUJIN_WARY, value: true, scope: 'loop' }],
      }),
      to('TELL_YUJIN_ONLY_PHONE_FACT', '전화가 어디서 발견됐는지만 말한다.', SCENE_LOOP2_YUJIN_MINIMAL, 4),
    ],
  },

  [SCENE_LOOP2_YUJIN_FOREKNOWLEDGE]: {
    id: SCENE_LOOP2_YUJIN_FOREKNOWLEDGE,
    locationId: LOCATION_ROOM_302,
    title: '너무 정확한 말',
    body: `"서윤이는 기록에 없고, 이 방은 비어 있다고 하시겠죠. 개인정보 때문에 보여 줄 수 없다는 말도 하실 겁니다. 자정에는 불이 꺼지고 1층 복도 끝 직원용 문이 열립니다."

유진의 얼굴에서 당황이 먼저 사라졌다.

"누가 알려 줬어요?"

"한 번 겪었습니다."

"어디까지 들었습니까?"

유진은 더 이상 환자를 찾는 보호자에게 말하지 않았다. 내부 정보를 훔친 사람을 상대하듯 문을 등지고 섰다.

"전화 내려놓으세요. 경비 부르겠습니다."

정확히 아는 것이 증명이 되지 않았다. 오히려 내가 알 수 없어야 할 것의 목록만 만들었다.

복도 끝에서 태준의 무전 소리가 들렸다. 유진이 그쪽을 보는 순간 반대편 계단으로 나왔다.`,
    choices: [
      to('GO_TO_STAFF_DOOR_AFTER_BACKFIRE', '[기억] 설득을 포기하고 열릴 문으로 간다.', SCENE_LOOP2_STAFF_DOOR, 8, {
        kind: 'foreknowledge',
        conditions: knowsBlackout,
        locationId: LOCATION_1F_STAFF_DOOR,
      }),
    ],
  },

  [SCENE_LOOP2_YUJIN_MINIMAL]: {
    id: SCENE_LOOP2_YUJIN_MINIMAL,
    locationId: LOCATION_ROOM_302,
    title: '필요한 만큼만',
    body: `"이 전화는 봉투 안에 있었습니다. 지금 서윤과 통화 중인 전화는 따로 있고요."

유진은 ‘서윤’이라는 이름보다 열려 있는 봉투를 오래 봤다.

"그 전화 내려놓으세요. 확인하겠습니다."

"누구에게요?"

"제가 답할 수 있는 건 여기까지입니다."

협조는 아니었다. 하지만 경비를 부르기 전에 봉투의 라벨을 떼어 주머니에 넣는 것을 봤다.

첫 번째 전화는 다시 봉투에 넣고 사진만 남겼다. 내 휴대전화에서는 서윤의 통화가 이미 끊겨 있었다.

설득할 시간보다 열릴 문에 먼저 도착하는 편이 중요했다.`,
    choices: [
      to('GO_TO_STAFF_DOOR_QUIETLY', '[기억] 자정 전에 직원용 문으로 간다.', SCENE_LOOP2_STAFF_DOOR, 8, {
        kind: 'foreknowledge',
        conditions: knowsBlackout,
        locationId: LOCATION_1F_STAFF_DOOR,
      }),
    ],
  },

  [SCENE_LOOP2_STAFF_DOOR]: {
    id: SCENE_LOOP2_STAFF_DOOR,
    locationId: LOCATION_1F_STAFF_DOOR,
    title: '열릴 문 앞',
    body: `복도 끝 직원 외 출입금지 문에서 다섯 걸음 떨어져 섰다.

첫 번째에는 문 가까이에서 태준과 마주쳤다. 이번에는 청소 카트 뒤쪽, 피난 안내도가 보이는 곳에 몸을 숨겼다.

사원증 인식기의 붉은 불은 켜져 있었다. 아래로 이어지는 계단의 위치도 알고 있었다.

휴대전화로 서윤에게 메시지를 보냈다.

302호에서 네 전화를 찾았어. 지금 가진 전화로 답해.

읽음 표시가 뜨지 않았다.

손목시계의 금이 조명 아래에서 흰 선처럼 보였다. 초침이 열두 시에 가까워졌다.

로비 쪽에서 태준이 유진에게 무언가 묻는 소리가 났다. 대답은 들리지 않았다.`,
    choices: [
      to('WAIT_FOR_KNOWN_BLACKOUT', '[기억] 전자 잠금이 풀리는 순간을 기다린다.', SCENE_LOOP2_BLACKOUT_INTERVENTION, 5, {
        kind: 'foreknowledge',
        conditions: knowsBlackout,
      }),
    ],
  },

  [SCENE_LOOP2_BLACKOUT_INTERVENTION]: {
    id: SCENE_LOOP2_BLACKOUT_INTERVENTION,
    locationId: LOCATION_1F_STAFF_DOOR,
    title: '00:00 — 선점',
    body: `불이 꺼지기 직전에 문 쪽으로 움직였다.

암전.

철컥.

소리가 끝날 때 손잡이는 이미 손안에 있었다. 문을 당기고 안쪽으로 들어간 뒤 다시 닫았다.

첫 번째에 들었던 발소리가 복도 반대편을 지나갔다. 누구의 것인지는 여전히 알 수 없었다.

휴대전화 화면에는 시간이 표시됐지만 통신 신호가 사라졌다. 손목시계의 초침은 열두 시에서 멈췄다.

이번에는 넘어지지 않았다.

비상등이 뒤늦게 켜졌다. 계단은 아래로 한 층만 이어졌다.`,
    choices: [
      to('ENTER_B1', '지하 1층으로 내려간다.', SCENE_LOOP2_OPERATIONS_CORRIDOR, 2, {
        locationId: LOCATION_B1_OPERATIONS_CORRIDOR,
        effects: [{ type: 'setFlag', flag: FLAG_FIRST_DEATH_AVOIDED, value: true, scope: 'loop' }],
      }),
    ],
  },

  [SCENE_LOOP2_OPERATIONS_CORRIDOR]: {
    id: SCENE_LOOP2_OPERATIONS_CORRIDOR,
    locationId: LOCATION_B1_OPERATIONS_CORRIDOR,
    title: '지하 1층',
    body: `계단 아래에는 창고와 기계실이 이어졌다. 배관, 린넨 카트, 잠긴 약품 보관함. 비밀 시설이라기보다 병원을 움직이는 데 필요한 것들을 숨겨 둔 층에 가까웠다.

그런데 복도 폭에 비해 문이 너무 많았다. 일부 문에는 용도가 적혀 있었고 일부는 표찰을 떼어 낸 자국만 남아 있었다.

휴대전화는 통화 불가였다. 메시지 전송 표시도 멈춰 있었다.

복도 중간에서 여자 목소리가 들렸다.

"오빠—"

발걸음을 멈췄다.

"아니, 잠깐만요."

열린 린넨실 문 안에 환자복을 입은 여자가 서 있었다. 처음 보는 얼굴이었다.`,
    choices: [to('ASK_SEA_ABOUT_SEOYUN', '서윤을 아는지 묻는다.', SCENE_LOOP2_SEA_FIRST_MEETING, 4)],
  },

  [SCENE_LOOP2_SEA_FIRST_MEETING]: {
    id: SCENE_LOOP2_SEA_FIRST_MEETING,
    locationId: LOCATION_B1_OPERATIONS_CORRIDOR,
    title: '윤세아',
    body: `"서윤이라는 사람을 찾고 있습니다. 302호에 있었어요?"

여자는 대답 대신 깨진 손목시계를 봤다.

"이번에는 그쪽으로 가지 마요."

"어느 쪽이요?"

"방금 내려온 계단 말고…"

말을 고르던 여자가 복도 끝을 봤다. 손목에는 환자 밴드를 오래 찼다가 뺀 듯한 자국이 남아 있었다.

"서윤 씨는 위에 있어요. 적어도 지금은."

"어떻게 압니까?"

"전화가 두 번 울렸으니까."

여자는 자신을 윤세아라고 말했다. 더 물으려는 순간 손전등 빛이 복도를 훑었다.

"거기 누구예요?"`,
    choices: [
      to('FACE_TAEJUN_IN_B1', '도망치지 않고 빛 쪽을 본다.', SCENE_LOOP2_TAEJUN_REJECTION, 3, {
        effects: [{ type: 'gainClue', clueId: CLUE_SEA_KNOWS }],
      }),
    ],
  },

  [SCENE_LOOP2_TAEJUN_REJECTION]: {
    id: SCENE_LOOP2_TAEJUN_REJECTION,
    locationId: LOCATION_B1_OPERATIONS_CORRIDOR,
    title: '침입자',
    body: `태준이었다.

"손 보이게 드세요."

"1층 문이 정전 때 열렸습니다."

"그래서 들어왔다는 겁니까?"

"302호의 환자를 찾고 있습니다. 이 사람도—"

린넨실을 돌아봤다. 세아는 없었다. 안에는 접힌 시트와 빈 카트만 있었다.

태준은 내 말을 믿지 않았다. 사원증을 인식기에 대며 계단 문을 열었다.

"위로 갑니다. 지금부터 질문은 경찰 앞에서 하세요."

"지하에 누가 있는지 모릅니까?"

"모르는 사람이 들어와 있는 건 압니다."

태준은 CCTV를 보여 주지도, 사정을 들어 주지도 않았다. 손전등을 내 등 뒤에 둔 채 먼저 계단을 오르게 했다.`,
    choices: [
      to('RETURN_UPSTAIRS_WITH_TAEJUN', '서윤을 찾기 위해 일단 위층으로 돌아간다.', SCENE_LOOP2_SEOYUN_RECHECK, 5, {
        locationId: LOCATION_1F_LOBBY,
      }),
    ],
  },

  [SCENE_LOOP2_SEOYUN_RECHECK]: {
    id: SCENE_LOOP2_SEOYUN_RECHECK,
    locationId: LOCATION_1F_LOBBY,
    title: '다시 302호로',
    body: `1층에 올라오자 휴대전화 신호가 돌아왔다. 보내지지 않던 메시지가 한꺼번에 전송됐다.

서윤이에게서 전화가 왔다.

"오빠, 지금은 자세히 말 못 해."

"왜."

"302호 있지."

"응."

"거기 다시 한번 확인해 봐."

"뭘."

서윤이가 바로 대답하지 않았다.

"아까는 못 본 게 있을 거야."

"그걸 네가 어떻게 알아."

"지금은 설명 못 해."

"서윤아."

"미안. 근데 한 번만 확인해 봐."

"너 내가 거기 들어갔던 것도 알고 있었어?"

통화 너머가 조용해졌다. 멀리서 누군가 서윤이를 부르는 듯한 소리가 들렸다.

"나중에 다시 전화할게."

"잠깐. 너 지금 누구랑—"

통화가 끊겼다.`,
    choices: [
      to('RETURN_TO_302_FOR_SECOND_PHONE', '태준이 유진과 이야기하는 틈에 3층으로 돌아간다.', SCENE_LOOP2_RETURN_302, 6, {
        locationId: LOCATION_ROOM_302,
      }),
    ],
  },

  [SCENE_LOOP2_RETURN_302]: {
    id: SCENE_LOOP2_RETURN_302,
    locationId: LOCATION_ROOM_302,
    title: '보지 못한 쪽',
    body: `302호 문은 닫혀 있었지만 잠기지는 않았다.

투명 소지품 봉투는 사라져 있었다. 첫 번째 휴대전화도 함께 없어졌다. 침구는 정리되어 있었고 물컵과 수액대도 치워져 있었다. 몇 분 사이에 빈 병실처럼 바뀌어 있었다.

서윤이가 말한 대로 아까 보지 못한 쪽을 확인했다.

침대 아래에 손을 넣었다. 처음 확인했던 복도 쪽이 아니라 벽 쪽 바퀴 뒤를 더듬었다.

손끝에 케이스 모서리가 닿았다.

휴대전화를 꺼냈다.

같은 모델. 같은 케이스. 오른쪽 아래에 난 작은 흠집까지 같았다.

첫 번째 휴대전화의 사진과 번갈아 비교했다. 단순히 같은 제품이 아니었다.

서윤이의 휴대전화가 한 대 더 있었다.`,
    choices: [to('CALL_BOTH_SEOYUN_PHONES', '찾은 전화와 통화 중인 전화가 동시에 존재하는지 확인한다.', SCENE_LOOP2_SECOND_PHONE, 4)],
  },

  [SCENE_LOOP2_SECOND_PHONE]: {
    id: SCENE_LOOP2_SECOND_PHONE,
    locationId: LOCATION_ROOM_302,
    title: '두 대',
    body: `서윤이에게 전화를 걸었다.

손에 든 휴대전화가 울렸다.

동시에 복도에서도 같은 벨소리가 울렸다. 유진이 가져간 첫 번째 휴대전화였다.

두 화면에는 모두 같은 발신자가 떠 있었다.

오빠

그런데 내 휴대전화에서는 다른 곳에 있는 서윤이의 목소리가 들렸다.

"둘 다 켜져 있어?"

"두 대 다. 네가 가진 것까지면 세 대야."

잠깐 아무 말도 들리지 않았다.

"너 알고 있었어?"

서윤이가 아주 작게 말했다.

"하나만 있을 줄 알았어."

그 말은 안다는 뜻이면서 동시에 예상이 틀렸다는 뜻이었다.

문밖의 벨소리가 멈췄다. 손에 든 휴대전화는 계속 울리고 있었다.`,
    choices: [
      to('KEEP_SECOND_PHONE', '두 번째 전화를 챙기고 서윤의 다음 말을 기다린다.', SCENE_VERTICAL_SLICE_END, 2, {
        effects: [{ type: 'gainClue', clueId: CLUE_SECOND_PHONE }],
      }),
    ],
  },

  [SCENE_VERTICAL_SLICE_END]: {
    id: SCENE_VERTICAL_SLICE_END,
    locationId: LOCATION_ROOM_302,
    title: '나오지 않은 사람',
    body: `잠시 뒤 서윤이에게서 메시지가 왔다.

차민서는 오빠가 뭘 기억하는지 알면 안 돼.

곧바로 이유를 물었다.

읽음 표시는 뜨지 않았다.

1층에서는 병원 직원들이 302호와 CCTV를 다시 확인하기 시작했다. 그들과 같은 편이 된 것은 아니었다. 오히려 무단으로 제한 구역을 돌아다닌 외부인으로 더 강하게 경계받고 있었다.

서윤이가 백야의료원에 왔다는 사실은 CCTV로 확인됐다.

302호로 들어가는 모습도 남아 있었다.

하지만 나오는 모습은 찍히지 않았다.

그리고 서윤이가 마지막으로 남긴 경고의 이유는 아직 듣지 못했다.`,
    choices: [],
  },
};
