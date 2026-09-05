import type {
  ChoiceCondition,
  ClueId,
  DeathIntel,
  DeductionId,
  GameTime,
  ItemId,
  LocationId,
  MemoryId,
  MemoryRecord,
  NarrativeChoice,
  NarrativeEffect,
  NarrativeScene,
  SceneId,
} from '../engine/types';
import type { DeductionDefinition } from '../gameplay/deductions';
import type { SceneInvestigation } from '../gameplay/investigation';
// Keep chapter data independent of the registries that consume it. These are
// the existing story IDs, not imports of the legacy scene graph.
const CLUE_06_CARD = 'CLUE_06_CARD' as ClueId;
const FLAG_TAEJUN_SAW_PHONE = 'FLAG_TAEJUN_SAW_PHONE';
const LOCATION_1F_LOBBY = '1F_LOBBY' as LocationId;
const LOCATION_CAR = 'CAR' as LocationId;

export const SCENE_CH3_BAND_REQUEST = 'SCENE_CH3_BAND_REQUEST' as SceneId;
export const SCENE_CH3_BAND_YUJIN = 'SCENE_CH3_BAND_YUJIN' as SceneId;
export const SCENE_CH3_BAND_TAEJUN = 'SCENE_CH3_BAND_TAEJUN' as SceneId;
export const SCENE_CH3_BAND_PLAYER = 'SCENE_CH3_BAND_PLAYER' as SceneId;
export const SCENE_CH3_THREE_TESTIMONIES = 'SCENE_CH3_THREE_TESTIMONIES' as SceneId;
export const SCENE_CH3_MINSEO_QUESTION = 'SCENE_CH3_MINSEO_QUESTION' as SceneId;
export const SCENE_CH3_MINSEO_WATCH = 'SCENE_CH3_MINSEO_WATCH' as SceneId;
export const SCENE_CH3_MINSEO_DEATH = 'SCENE_CH3_MINSEO_DEATH' as SceneId;
export const SCENE_CH3_MISSING_CARD = 'SCENE_CH3_MISSING_CARD' as SceneId;
export const SCENE_CH3_MISSING_WORKER = 'SCENE_CH3_MISSING_WORKER' as SceneId;
export const SCENE_CH3_APPROACH_TAEJUN = 'SCENE_CH3_APPROACH_TAEJUN' as SceneId;
export const SCENE_CH3_APPROACH_YUJIN = 'SCENE_CH3_APPROACH_YUJIN' as SceneId;
export const SCENE_CH3_APPROACH_SOLO = 'SCENE_CH3_APPROACH_SOLO' as SceneId;
export const SCENE_CH3_TRANSFER_TAEJUN = 'SCENE_CH3_TRANSFER_TAEJUN' as SceneId;
export const SCENE_CH3_TRANSFER_YUJIN = 'SCENE_CH3_TRANSFER_YUJIN' as SceneId;
export const SCENE_CH3_TRANSFER_SOLO = 'SCENE_CH3_TRANSFER_SOLO' as SceneId;
export const SCENE_CH3_0106_TAEJUN = 'SCENE_CH3_0106_TAEJUN' as SceneId;
export const SCENE_CH3_0106_YUJIN = 'SCENE_CH3_0106_YUJIN' as SceneId;
export const SCENE_CH3_0106_SOLO = 'SCENE_CH3_0106_SOLO' as SceneId;
export const SCENE_CH3_LAST_CARD = 'SCENE_CH3_LAST_CARD' as SceneId;
export const SCENE_CH3_LAST_RADIO = 'SCENE_CH3_LAST_RADIO' as SceneId;
export const SCENE_CH3_LAST_LABEL = 'SCENE_CH3_LAST_LABEL' as SceneId;
export const SCENE_CH3_DEATH_TAEJUN = 'SCENE_CH3_DEATH_TAEJUN' as SceneId;
export const SCENE_CH3_DEATH_YUJIN = 'SCENE_CH3_DEATH_YUJIN' as SceneId;
export const SCENE_CH3_DEATH_SOLO = 'SCENE_CH3_DEATH_SOLO' as SceneId;
export const SCENE_CH3_RESET_2123 = 'SCENE_CH3_RESET_2123' as SceneId;
export const SCENE_CH4_OPENING = 'SCENE_CH4_OPENING' as SceneId;
export const SCENE_CH4_MILESTONE_A_END = 'SCENE_CH4_MILESTONE_A_END' as SceneId;

export const LOCATION_B1_DOCUMENT_TRANSFER = 'B1_DOCUMENT_TRANSFER' as LocationId;

export const CLUE_TESTIMONY_YUJIN = 'CLUE_TESTIMONY_YUJIN' as ClueId;
export const CLUE_TESTIMONY_TAEJUN = 'CLUE_TESTIMONY_TAEJUN' as ClueId;
export const CLUE_TESTIMONY_MINSEO = 'CLUE_TESTIMONY_MINSEO' as ClueId;
export const CLUE_0106_LEDGER = 'CLUE_0106_LEDGER' as ClueId;
export const CLUE_0106_HIDDEN_STAIR = 'CLUE_0106_HIDDEN_STAIR' as ClueId;
export const CLUE_0106_CARD_READER = 'CLUE_0106_CARD_READER' as ClueId;
export const CLUE_0106_RADIO_RESPONSE = 'CLUE_0106_RADIO_RESPONSE' as ClueId;
export const CLUE_06_B2_LABEL = 'CLUE_06_B2_LABEL' as ClueId;

export const DEDUCTION_SPACE_NOT_ALIGNED = 'DEDUCTION_SPACE_NOT_ALIGNED' as DeductionId;
export const MEMORY_0106_SEAL = 'MEMORY_0106_SEAL' as MemoryId;
export const SECOND_DEATH_ID = 'DEATH_0106_TRANSFER_SEAL';

export const FLAG_BAND_CUSTODY_YUJIN = 'BAND_CUSTODY_YUJIN';
export const FLAG_BAND_CUSTODY_PLAYER = 'BAND_CUSTODY_PLAYER';
export const FLAG_BAND_SECURITY_TIMESTAMP = 'BAND_SECURITY_TIMESTAMP';
export const FLAG_CH3_COMPANION = 'CH3_COMPANION';
export const FLAG_0106_AVOIDANCE_PLANNED = 'FLAG_0106_AVOIDANCE_PLANNED';

const ITEM_WRISTBAND_ORIGINAL = 'ITEM_WRISTBAND_ORIGINAL' as ItemId;
const ITEM_WRISTBAND_PHOTO = 'ITEM_WRISTBAND_PHOTO' as ItemId;

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

export const spaceNotAlignedDeduction: DeductionDefinition = {
  id: DEDUCTION_SPACE_NOT_ALIGNED,
  title: '서로 다른 시점의 통로',
  prompt: '302호 뒤 공간에 관한 세 사람의 답을 연결한다.',
  description: '세 사람은 같은 공간을 서로 다른 시점과 기록을 기준으로 설명했다.',
  conclusion: '같은 공간을 보고 있지만 기준으로 삼는 시점이 다르다. 통로가 단순히 철거된 것이라면 서윤이 현재의 방 안에서 문을 봤다는 말이 남는다.',
  requiredClueIds: [
    CLUE_TESTIMONY_YUJIN,
    CLUE_TESTIMONY_TAEJUN,
    CLUE_TESTIMONY_MINSEO,
  ],
  requiredMemoryIds: [],
  facts: [
    { sourceId: CLUE_TESTIMONY_YUJIN, label: '유진', text: '근무한 뒤로 문은 없었다.', tone: 'evidence' },
    { sourceId: CLUE_TESTIMONY_TAEJUN, label: '태준', text: '폐쇄 전 도면에는 통로가 있다.', tone: 'evidence' },
    { sourceId: CLUE_TESTIMONY_MINSEO, label: '민서', text: '현재 구조에는 없어야 한다.', tone: 'evidence' },
  ],
};

export const seal0106Memory: MemoryRecord = {
  id: MEMORY_0106_SEAL,
  title: '한 시 육 분의 밀폐',
  description: '오전 1시 06분에는 B1 문서 이송실 안에 있지 않는다. 맞은편 벽 뒤의 B2 우회 계단을 먼저 연다.',
  acquiredOnLoop: 2,
  sourceSceneId: SCENE_CH3_DEATH_SOLO,
  relatedClueIds: [CLUE_0106_HIDDEN_STAIR],
  payoff: {
    predictsEvent: '01:06 B1 문서 이송실 자동 밀폐',
    usableFrom: 210 as GameTime,
    usableUntil: 223 as GameTime,
    changes: ['riskAvoided', 'routeUnlocked', 'eventPreempted', 'npcBehaviorChanged'],
    avoidsRisk: SECOND_DEATH_ID,
    unlocksLocationId: LOCATION_B1_DOCUMENT_TRANSFER,
  },
};

export const secondDeathIntel: DeathIntel = {
  memoryId: MEMORY_0106_SEAL,
  deathId: SECOND_DEATH_ID,
  title: '01:06',
  description: 'B1 이송실이 밀폐되면 안에서 버틸 수 없다. 맞은편 벽 뒤에는 B2로 내려가는 우회 계단이 있다.',
  learnedClueIds: [CLUE_0106_HIDDEN_STAIR],
};

function inspected(sceneId: SceneId, hotspotId: string): string {
  return `INVESTIGATED:${sceneId}:${hotspotId}`;
}

const testimonyInvestigation: SceneInvestigation = {
  sceneId: SCENE_CH3_THREE_TESTIMONIES,
  prompt: '세 사람이 기준으로 삼은 시점을 각각 확인한다.',
  hotspots: [
    {
      id: 'yujin-testimony',
      label: '유진의 답',
      shortLabel: '유진',
      discovery: '근무를 시작한 뒤로 302호 뒤에는 문이 없었다. 현재 병동에서 직접 본 사실이다.',
      x: 0.26,
      y: 0.45,
      effects: [{ type: 'gainClue', clueId: CLUE_TESTIMONY_YUJIN }],
    },
    {
      id: 'taejun-testimony',
      label: '태준의 답',
      shortLabel: '태준',
      discovery: '시설팀이 보관한 폐쇄 전 도면에는 통로가 있었다. 과거 기록을 기준으로 한 답이다.',
      x: 0.5,
      y: 0.38,
      effects: [{ type: 'gainClue', clueId: CLUE_TESTIMONY_TAEJUN }],
    },
    {
      id: 'minseo-testimony',
      label: '민서의 답',
      shortLabel: '민서',
      discovery: '자신이 확인한 준공 기록대로라면 현재 구조에는 통로가 없어야 한다.',
      x: 0.74,
      y: 0.45,
      effects: [{ type: 'gainClue', clueId: CLUE_TESTIMONY_MINSEO }],
    },
  ],
};

function createTransferInvestigation(sceneId: SceneId): SceneInvestigation {
  return {
    sceneId,
    fitHotspotsToStage: true,
    prompt: '방 안의 물건과 설비를 두 가지 이상 직접 확인한다.',
    hotspots: [
      {
        id: 'card-06',
        label: '06 카드',
        shortLabel: '카드',
        discovery: '병원 로고 아래 바코드가 지워져 있다. 카드 자체에는 06만 남아 있다.',
        x: 0.35,
        y: 0.56,
        usesSearchOpportunity: true,
        effects: [{ type: 'gainClue', clueId: CLUE_06_CARD }, { type: 'advanceTime', minutes: 2 }],
      },
      {
        id: 'shelf-06',
        label: '06 선반',
        shortLabel: '선반',
        discovery: '라벨을 여러 번 떼고 붙인 자국이 남아 있다.',
        x: 0.8,
        y: 0.3,
        usesSearchOpportunity: true,
        effects: [{ type: 'advanceTime', minutes: 2 }],
      },
      {
        id: 'transfer-ledger',
        label: '이송 장부',
        shortLabel: '장부',
        discovery: '오늘 날짜의 반입 기록은 없지만, 서명이 눌린 다음 장에 흔적이 남아 있다.',
        x: 0.58,
        y: 0.85,
        usesSearchOpportunity: true,
        effects: [{ type: 'advanceTime', minutes: 2 }],
      },
      {
        id: 'sealed-vent',
        label: '멈춘 환기구',
        shortLabel: '환기',
        discovery: '바람이 들어오지 않고 낮은 모터음만 들린다.',
        x: 0.5,
        y: 0.05,
        usesSearchOpportunity: true,
        effects: [{ type: 'advanceTime', minutes: 2 }],
      },
      {
        id: 'opposite-wall',
        label: '맞은편 벽',
        shortLabel: '벽',
        discovery: '현재 도면에는 없는 계단 표지의 나사 자국이 남아 있다.',
        x: 0.1,
        y: 0.4,
        usesSearchOpportunity: true,
        effects: [{ type: 'advanceTime', minutes: 2 }],
      },
    ],
  };
}

export const chapter3Investigations: Readonly<Record<string, SceneInvestigation>> = {
  [SCENE_CH3_THREE_TESTIMONIES]: testimonyInvestigation,
  [SCENE_CH3_TRANSFER_TAEJUN]: createTransferInvestigation(SCENE_CH3_TRANSFER_TAEJUN),
  [SCENE_CH3_TRANSFER_YUJIN]: createTransferInvestigation(SCENE_CH3_TRANSFER_YUJIN),
  [SCENE_CH3_TRANSFER_SOLO]: createTransferInvestigation(SCENE_CH3_TRANSFER_SOLO),
};

const minimumTransferChecks = (sceneId: SceneId): ChoiceCondition => ({
  type: 'minimumFlags',
  flags: [
    inspected(sceneId, 'card-06'),
    inspected(sceneId, 'shelf-06'),
    inspected(sceneId, 'transfer-ledger'),
    inspected(sceneId, 'sealed-vent'),
    inspected(sceneId, 'opposite-wall'),
  ],
  count: 2,
});

const enter0106 = [
  { type: 'setTime', time: 223 as GameTime },
  { type: 'gainClue', clueId: CLUE_0106_LEDGER },
] as const;

function deathScene(
  id: SceneId,
  companion: 'taejun' | 'yujin' | 'solo',
): NarrativeScene {
  const outside = companion === 'taejun'
    ? '"잠깐만요. 반대쪽 계단으로 내려갑니다."'
    : companion === 'yujin'
      ? '"수동 밸브가 있을 거예요. 찾고 있어요."'
      : '무전기 너머로 태준이 누군가에게 "B2 계단을 열어"라고 말했다.';
  return {
    id,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '두 번째 죽음',
    body: `숨을 들이마셔도 가슴이 채워지지 않았다. 문을 두드리는 힘이 점점 약해졌다.

문밖에서 목소리가 들렸다.

${outside}

나는 휴대전화 녹음을 켰다.

"한 시 육 분. 이송실 문 닫힘. 안에 있으면 안 돼."

목소리가 제대로 들어갔는지 확인할 수 없었다.

바닥에 누운 시야 끝에서 06 카드가 두 장으로 겹쳐 보였다. 하나는 봉투 옆에 있었고, 다른 하나는 닫힌 문 바깥에 떨어져 있었다.

눈을 감기 전 마지막으로 들은 것은 잠금이 풀리는 소리였다.

이번에는 아래로 이어지는 계단 쪽이었다.`,
    choices: [],
    onEnter: [
      { type: 'gainMemory', memory: { ...seal0106Memory, sourceSceneId: id } },
      { type: 'triggerDeath', deathId: SECOND_DEATH_ID, intel: secondDeathIntel },
    ],
  };
}

export const chapter3Scenes: Readonly<Record<string, NarrativeScene>> = {
  [SCENE_CH3_BAND_REQUEST]: {
    id: SCENE_CH3_BAND_REQUEST,
    locationId: LOCATION_1F_LOBBY,
    title: '아직 가지고 있습니까',
    body: `엘리베이터 쪽에서 태준이 걸어왔다. 조금 전보다 걸음이 빨랐다.

"302호에서 가져오셨다는 손목밴드, 아직 가지고 계십니까?"

나는 주머니에 손을 넣지 않은 채 물었다.

"왜 찾으시는데요."

"확인할 게 생겼습니다."

"무슨 확인입니까."

"그 밴드가 언제, 어디서 나온 건지요."

"그건 이미 말씀드렸잖아요. 302호 침대 옆에서 찾았습니다."

"말씀하신 위치 말고, 물건 자체를 확인해야 합니다."

태준은 손을 내밀지 않았다. 내가 먼저 꺼낼 때까지 기다렸다.`,
    choices: [
      to('CH3_BAND_TO_YUJIN', '사진을 남기고 유진에게 돌려준다.', SCENE_CH3_BAND_YUJIN, 3, {
        effects: [
          { type: 'gainItem', itemId: ITEM_WRISTBAND_PHOTO },
          { type: 'removeItem', itemId: ITEM_WRISTBAND_ORIGINAL },
          { type: 'setFlag', flag: 'CH3_BAND_OWNER', value: 'yujin', scope: 'loop' },
          { type: 'setFlag', flag: 'CH3_YUJIN_COOPERATING', value: true, scope: 'loop' },
          { type: 'setFlag', flag: FLAG_BAND_CUSTODY_YUJIN, value: true, scope: 'persistent' },
          { type: 'setFlag', flag: 'TRUST_YUJIN_PROGRESS', value: 1, scope: 'persistent' },
        ],
      }),
      to('CH3_BAND_SHOW_TAEJUN', '태준에게 확인시킨 뒤 돌려받는다.', SCENE_CH3_BAND_TAEJUN, 3, {
        effects: [
          { type: 'gainItem', itemId: ITEM_WRISTBAND_ORIGINAL },
          { type: 'gainItem', itemId: ITEM_WRISTBAND_PHOTO },
          { type: 'setFlag', flag: FLAG_BAND_CUSTODY_PLAYER, value: true, scope: 'persistent' },
          { type: 'setFlag', flag: FLAG_BAND_SECURITY_TIMESTAMP, value: true, scope: 'persistent' },
          { type: 'setFlag', flag: 'CH3_BAND_OWNER', value: 'player', scope: 'loop' },
          { type: 'setFlag', flag: 'CH3_TAEJUN_COOPERATING', value: true, scope: 'loop' },
          { type: 'setFlag', flag: 'TRUST_TAEJUN_PROGRESS', value: 1, scope: 'persistent' },
        ],
      }),
      to('CH3_BAND_KEEP_ORIGINAL', '사진만 보여 주고 원본은 보관한다.', SCENE_CH3_BAND_PLAYER, 3, {
        effects: [
          { type: 'gainItem', itemId: ITEM_WRISTBAND_ORIGINAL },
          { type: 'gainItem', itemId: ITEM_WRISTBAND_PHOTO },
          { type: 'setFlag', flag: FLAG_BAND_CUSTODY_PLAYER, value: true, scope: 'persistent' },
          { type: 'setFlag', flag: 'TRUST_YUJIN_PROGRESS', value: -1, scope: 'persistent' },
          { type: 'setFlag', flag: 'CH3_BAND_OWNER', value: 'player', scope: 'loop' },
          { type: 'setFlag', flag: 'CH3_YUJIN_WARY', value: true, scope: 'loop' },
        ],
      }),
    ],
    onEnter: [{ type: 'setTime', time: 184 as GameTime }],
  },

  [SCENE_CH3_BAND_YUJIN]: {
    id: SCENE_CH3_BAND_YUJIN,
    locationId: LOCATION_1F_LOBBY,
    body: `나는 밴드를 꺼내 앞뒤를 다시 찍었다. 찢긴 끝과 생년월일, 302가 한 화면에 들어오게 했다.

"사진은 남기겠습니다."

유진이 다가와 새 봉투를 열었다.

"제가 봉인해서 보관할게요. 확인하실 일이 생기면 제 앞에서 보시고요."

"없던 물건이 되지는 않게 해주세요."

유진의 손이 잠깐 멈췄다.

"그러지 않겠습니다."`,
    choices: [to('CH3_ASK_SAME_QUESTION_Y', '세 사람에게 같은 질문을 한다.', SCENE_CH3_THREE_TESTIMONIES, 0)],
  },

  [SCENE_CH3_BAND_TAEJUN]: {
    id: SCENE_CH3_BAND_TAEJUN,
    locationId: LOCATION_1F_LOBBY,
    body: `나는 밴드를 태준에게 건넸다.

"여기서 확인하세요. 가져가지는 마시고요."

태준은 휴대용 카메라로 밴드와 현재 시각을 함께 찍었다. 찢긴 면을 보고 미간을 좁혔다.

"이 숫자, 처음부터 보셨습니까?"

"끝부분만요. 06인지는 카드 보고 알았습니다."

태준은 밴드를 돌려줬다.

"이제 적어도 언제부터 가지고 계셨는지는 남았습니다."`,
    choices: [to('CH3_ASK_SAME_QUESTION_T', '세 사람에게 같은 질문을 한다.', SCENE_CH3_THREE_TESTIMONIES, 0)],
  },

  [SCENE_CH3_BAND_PLAYER]: {
    id: SCENE_CH3_BAND_PLAYER,
    locationId: LOCATION_1F_LOBBY,
    body: `나는 밴드 대신 사진을 열었다.

"원본은 제가 가지고 있겠습니다."

"병실에서 가져오신 물건이에요."

"그러니까 지금은 못 드립니다."

유진은 더 설득하지 않았다. 대신 내 손에 들린 휴대전화와 주머니를 차례로 봤다.

"잃어버리시면 안 됩니다."

"병원에서 잃어버린 걸 제가 찾은 겁니다."

말하고 나서야 목소리에 힘이 들어간 걸 알았다.`,
    choices: [to('CH3_ASK_SAME_QUESTION_P', '세 사람에게 같은 질문을 한다.', SCENE_CH3_THREE_TESTIMONIES, 0)],
  },

  [SCENE_CH3_THREE_TESTIMONIES]: {
    id: SCENE_CH3_THREE_TESTIMONIES,
    locationId: LOCATION_1F_LOBBY,
    title: '같은 질문',
    body: `유진, 태준, 민서는 가까이 서 있었지만 서로의 표정을 먼저 살폈다. 같은 병원 직원이라고 해서 같은 답을 가진 사람들은 아니었다.

나는 오래된 안내도 사진을 열었다.

"세 분한테 같은 것만 묻겠습니다. 302호 뒤에 뭐가 있었습니까?"

"지금 말씀하시는 건 예전 도면 얘기죠?"

"예전이든 지금이든, 알고 있는 것만 말씀해 주세요."

유진은 사진을 확대했다.

"제가 근무한 뒤로는 저쪽에 문이 없었어요. 병실 벽이었습니다."

"폐쇄 전 도면에는 통로가 있습니다."

유진이 태준을 봤다.

"폐쇄 전이요?"

"시설팀 보관본에서 확인했습니다."

민서는 두 사람의 말이 끝난 뒤에야 입을 열었다.

"현재 구조에는 없어야 합니다."

"없습니까, 없어야 합니까."

"제가 확인한 준공 기록대로라면요."

"서윤이는 방 안에 문이 있었다고 했습니다."

민서의 시선이 내 얼굴에서 휴대전화로 옮겨갔다.

"언제 봤다고 하던가요?"

"그건 저도 모릅니다."`,
    choices: [
      to('CH3_USE_SPACE_DEDUCTION', '[추론] 세 답이 기준으로 삼는 시점을 연결한다.', SCENE_CH3_MINSEO_QUESTION, 1, {
        kind: 'evidence',
        conditions: [{ type: 'hasDeduction', deductionId: DEDUCTION_SPACE_NOT_ALIGNED }],
      }),
    ],
  },

  [SCENE_CH3_MINSEO_QUESTION]: {
    id: SCENE_CH3_MINSEO_QUESTION,
    locationId: LOCATION_1F_LOBBY,
    title: '민서의 질문',
    body: `"한 가지만 확인해도 될까요?"

"뭡니까."

"오늘 넘어지거나 머리를 부딪친 적 있습니까?"

"없습니다."

"기억이 끊긴 구간은요."

나는 대답하지 않았다.

"어지럽거나, 방금 본 물건이 다른 자리에 있었던 것처럼 느껴진 적은요?"

"왜 자꾸 제 상태를 묻습니까."

"지금 확인된 현상을 공간 문제라고 단정할 수 없으니까요."

"제가 잘못 봤다는 쪽부터 확인하시겠다는 겁니까?"

"아니요. 잘못 봤다고 결론 내리지 않기 위해 묻는 겁니다."

민서는 손목을 가리켰다.

"시계 좀 볼 수 있을까요?"`,
    choices: [
      to('CH3_SHOW_WATCH_ONLY', '깨진 시계만 보여 준다.', SCENE_CH3_MINSEO_WATCH, 3, {
        effects: [{ type: 'setFlag', flag: 'MINSEO_SAW_WATCH', value: true, scope: 'persistent' }],
      }),
      to('CH3_DISCLOSE_FIRST_DEATH', '첫 죽음 뒤에도 금이 남았다고 말한다.', SCENE_CH3_MINSEO_DEATH, 3, {
        effects: [
          { type: 'setFlag', flag: 'MINSEO_PARTIAL_DISCLOSURE', value: true, scope: 'persistent' },
          { type: 'setFlag', flag: 'TRUST_MINSEO_PROGRESS', value: 1, scope: 'persistent' },
          { type: 'setFlag', flag: 'MINSEO_WARY', value: 1, scope: 'loop' },
        ],
      }),
    ],
  },

  [SCENE_CH3_MINSEO_WATCH]: {
    id: SCENE_CH3_MINSEO_WATCH,
    locationId: LOCATION_1F_LOBBY,
    body: `나는 시계를 풀지 않고 손목을 내밀었다.

"언제 깨졌습니까?"

"기억나지 않습니다."

"그런데 계속 차고 계시네요."

"확실하게 달라진 게 이것뿐이라서요."

민서는 금이 간 유리와 멈추지 않은 초침을 오래 봤다.`,
    choices: [to('CH3_FIND_MISSING_CARD_W', '06 카드가 든 봉투를 찾는다.', SCENE_CH3_MISSING_CARD, 2)],
  },

  [SCENE_CH3_MINSEO_DEATH]: {
    id: SCENE_CH3_MINSEO_DEATH,
    locationId: LOCATION_1F_LOBBY,
    body: `"한 번 죽고 돌아왔을 때도 이 금만 남아 있었습니다."

유진이 숨을 들이켰고 태준은 내가 농담하는지 확인하듯 쳐다봤다. 민서만 바로 표정을 바꾸지 않았다.

"돌아왔다는 건 어느 시점입니까?"

"오후 9시 23분. 서윤이 전화가 왔을 때요."

"그 시각을 어떻게 확신하죠?"

"같은 통화를 두 번 들었습니다."

"죽은 방식도 기억합니까?"

서윤의 경고가 떠올랐다. 차민서는 오빠가 뭘 기억하는지 알면 안 돼.

"지금 말씀드릴 건 여기까지입니다."`,
    choices: [to('CH3_FIND_MISSING_CARD_D', '06 카드가 든 봉투를 찾는다.', SCENE_CH3_MISSING_CARD, 2)],
  },

  [SCENE_CH3_MISSING_CARD]: {
    id: SCENE_CH3_MISSING_CARD,
    locationId: LOCATION_1F_LOBBY,
    title: '사라진 06 카드',
    body: `나는 유진이 들고 있던 투명 봉투를 찾았다. 손에는 아무것도 없었다.

"아까 카드 어디 있습니까?"

"확인하러 보냈어요."

"어디로요."

"원무과 쪽에서 먼저 확인하고, 보관 기록이 없으면 문서실로 내려갑니다."

"지하에도 문서실이 있습니까?"

태준이 먼저 답했다.

"B1에 이송실이 있습니다."

"누가 가져갔습니까?"

"시설 지원 직원이요. 방금 내려갔습니다."

나는 시계를 봤다. 휴대전화는 12시 36분, 손목시계는 12시 34분을 가리켰다.

"찾으러 내려가실 생각이면 하지 마세요."

"왜요."

"지금 B1은 정전 이후 점검 중입니다."

"그런데 카드는 내려보냈고요?"

유진의 표정이 굳었다. 자신도 그 순서가 이상하다는 걸 이제 알아챈 얼굴이었다.`,
    choices: [to('CH3_CALL_MISSING_WORKER', '카드를 가져간 직원을 확인한다.', SCENE_CH3_MISSING_WORKER, 3)],
  },

  [SCENE_CH3_MISSING_WORKER]: {
    id: SCENE_CH3_MISSING_WORKER,
    locationId: LOCATION_1F_LOBBY,
    title: '내려간 사람',
    body: `유진은 접수처 전화로 내선 번호를 눌렀다. 한참 신호가 갔지만 받지 않았다.

"이상하네."

"누가 내려갔다고 했습니까?"

"김 기사님이요. 봉투 하나만 맡기면 된다고 해서."

태준은 무전으로 이름을 불렀다. 대답 대신 잡음이 길게 이어졌다.

"제가 확인하고 오겠습니다."

"같이 가겠습니다."

"안 됩니다."

"그 카드와 손목밴드가 같은 건지 제가 봐야 합니다."

"지금은 사람부터 확인할 겁니다."

그 말에는 반박할 수 없었다.`,
    choices: [
      to('CH3_ENTER_B1_WITH_TAEJUN', '두 번째 휴대전화 사진을 보여 주고 태준과 내려간다.', SCENE_CH3_APPROACH_TAEJUN, 10, {
        kind: 'evidence',
        conditions: [{ type: 'flagEquals', flag: FLAG_TAEJUN_SAW_PHONE, value: true }],
        locationId: LOCATION_B1_DOCUMENT_TRANSFER,
        effects: [{ type: 'setFlag', flag: FLAG_CH3_COMPANION, value: 'taejun', scope: 'loop' }],
      }),
      to('CH3_ENTER_B1_WITH_YUJIN', '봉인한 손목밴드와 함께 유진과 내려간다.', SCENE_CH3_APPROACH_YUJIN, 10, {
        kind: 'evidence',
        conditions: [{ type: 'flagEquals', flag: FLAG_BAND_CUSTODY_YUJIN, value: true }],
        locationId: LOCATION_B1_DOCUMENT_TRANSFER,
        effects: [{ type: 'setFlag', flag: FLAG_CH3_COMPANION, value: 'yujin', scope: 'loop' }],
      }),
      to('CH3_ENTER_B1_SOLO', '화물 승강기의 카트 바퀴 자국을 따라 혼자 내려간다.', SCENE_CH3_APPROACH_SOLO, 6, {
        conditions: [
          { type: 'flagNotEquals', flag: FLAG_TAEJUN_SAW_PHONE, value: true },
          { type: 'flagNotEquals', flag: FLAG_BAND_CUSTODY_YUJIN, value: true },
        ],
        locationId: LOCATION_B1_DOCUMENT_TRANSFER,
        effects: [{ type: 'setFlag', flag: FLAG_CH3_COMPANION, value: 'solo', scope: 'loop' }],
      }),
    ],
  },

  [SCENE_CH3_APPROACH_TAEJUN]: {
    id: SCENE_CH3_APPROACH_TAEJUN,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    body: `"제가 먼저 본 게 있습니다. 길을 찾는 데 도움이 될 수도 있어요."

태준은 잠깐 망설인 뒤 조건을 붙였다.

"제 뒤에서 움직이세요. 제가 멈추라고 하면 바로 멈추고요."`,
    choices: [to('CH3_OPEN_TRANSFER_T', '태준의 뒤에서 문서 이송실로 간다.', SCENE_CH3_TRANSFER_TAEJUN, 0)],
  },

  [SCENE_CH3_APPROACH_YUJIN]: {
    id: SCENE_CH3_APPROACH_YUJIN,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    body: `"제가 같이 내려갈게요. 밴드도 제가 가지고 있고요."

"한 분만 오세요."

유진은 봉인 봉투를 주머니에 넣었다.`,
    choices: [to('CH3_OPEN_TRANSFER_Y', '유진과 문서 이송실로 간다.', SCENE_CH3_TRANSFER_YUJIN, 0)],
  },

  [SCENE_CH3_APPROACH_SOLO]: {
    id: SCENE_CH3_APPROACH_SOLO,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    body: `태준이 먼저 내려간 뒤, 나는 B1에서 봤던 반대편 계단으로 향했다. 정전 때 열린 문은 다시 잠겨 있었지만 린넨 카트가 올라오는 화물 승강기는 점검 때문에 열려 있었다.

누군가를 따라가는 대신, 카트 바퀴 자국을 따라 내려갔다.`,
    choices: [to('CH3_OPEN_TRANSFER_S', '발소리를 피해 문서 이송실로 간다.', SCENE_CH3_TRANSFER_SOLO, 0)],
  },

  [SCENE_CH3_TRANSFER_TAEJUN]: {
    id: SCENE_CH3_TRANSFER_TAEJUN,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '문서 이송실',
    body: `B1의 공기는 위층보다 차가웠다. 복도 끝에 작은 방이 하나 있었고 문 위에는 '문서 이송'이라고 적혀 있었다.

문은 반쯤 열려 있었다.

안쪽 바닥에 투명 봉투가 떨어져 있었다. 06 카드가 봉투 밖으로 미끄러져 나와 있었다. 조금 전 내려왔다는 직원은 보이지 않았다.

무전기 잡음이 벽 너머에서 들렸다.

"김 기사님. 들리시면 대답하세요."

대답은 없었다.

방 안쪽 선반에는 같은 크기의 봉투가 여섯 칸으로 나뉘어 있었다. 01부터 06까지. 앞의 다섯 칸은 비어 있었고 06 칸에만 오래된 접수 라벨이 붙어 있었다.`,
    choices: [to('CH3_READ_LEDGER_T', '확인한 흔적을 장부와 대조한다.', SCENE_CH3_0106_TAEJUN, 0, { effects: [{ type: 'setTime', time: 223 as GameTime }], conditions: [minimumTransferChecks(SCENE_CH3_TRANSFER_TAEJUN)] })],
  },

  [SCENE_CH3_TRANSFER_YUJIN]: {
    id: SCENE_CH3_TRANSFER_YUJIN,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '문서 이송실',
    body: `B1의 공기는 위층보다 차가웠다. 복도 끝에 작은 방이 하나 있었고 문 위에는 '문서 이송'이라고 적혀 있었다.

문은 반쯤 열려 있었다.

안쪽 바닥에 투명 봉투가 떨어져 있었다. 06 카드가 봉투 밖으로 미끄러져 나와 있었다. 조금 전 내려왔다는 직원은 보이지 않았다.

무전기 잡음이 벽 너머에서 들렸다.

"김 기사님. 들리시면 대답하세요."

대답은 없었다.

방 안쪽 선반에는 같은 크기의 봉투가 여섯 칸으로 나뉘어 있었다. 01부터 06까지. 앞의 다섯 칸은 비어 있었고 06 칸에만 오래된 접수 라벨이 붙어 있었다.`,
    choices: [to('CH3_READ_LEDGER_Y', '확인한 흔적을 장부와 대조한다.', SCENE_CH3_0106_YUJIN, 0, { effects: [{ type: 'setTime', time: 223 as GameTime }], conditions: [minimumTransferChecks(SCENE_CH3_TRANSFER_YUJIN)] })],
  },

  [SCENE_CH3_TRANSFER_SOLO]: {
    id: SCENE_CH3_TRANSFER_SOLO,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '문서 이송실',
    body: `B1의 공기는 위층보다 차가웠다. 복도 끝에 작은 방이 하나 있었고 문 위에는 '문서 이송'이라고 적혀 있었다.

문은 반쯤 열려 있었다.

안쪽 바닥에 투명 봉투가 떨어져 있었다. 06 카드가 봉투 밖으로 미끄러져 나와 있었다. 조금 전 내려왔다는 직원은 보이지 않았다.

무전기 잡음이 벽 너머에서 들렸다.

"김 기사님. 들리시면 대답하세요."

대답은 없었다.

방 안쪽 선반에는 같은 크기의 봉투가 여섯 칸으로 나뉘어 있었다. 01부터 06까지. 앞의 다섯 칸은 비어 있었고 06 칸에만 오래된 접수 라벨이 붙어 있었다.`,
    choices: [to('CH3_READ_LEDGER_S', '확인한 흔적을 장부와 대조한다.', SCENE_CH3_0106_SOLO, 0, { effects: [{ type: 'setTime', time: 223 as GameTime }], conditions: [minimumTransferChecks(SCENE_CH3_TRANSFER_SOLO)] })],
  },

  [SCENE_CH3_0106_TAEJUN]: {
    id: SCENE_CH3_0106_TAEJUN,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '눌린 글씨',
    body: `빈 장부 위에 연필을 눕혀 문질렀다. 앞장에 적혔다가 뜯겨 나간 글씨가 희미하게 올라왔다.

06 / 302 / 21:41 입실

그 아래 서명은 끝부분만 남아 있었다.

한…

"사진부터 찍으세요. 원본은 건드리지 말고."

"누가 뜯어갔는지 확인할 수 있습니까?"

"여기 카메라는 복도만 봅니다. 대신 출입 기록은 남아야 해요."

휴대전화 화면이 짧게 흔들렸다. 1시 06분.

문 위의 표시등이 녹색에서 붉은색으로 바뀌었다.

철컥.

문이 닫혔다.

나는 바로 손잡이를 당겼다. 움직이지 않았다.

천장 안쪽에서 모터가 돌아가기 시작했다. 환기구로 들어오던 미약한 공기마저 끊겼다.

문밖에서 손잡이를 당기는 소리가 들렸다.

"안에서 들립니까?"

"문이 안 열립니다."

스피커에서 낯선 안내음이 한 번 울렸다.

보관 구역 소화 절차를 시작합니다.

그런데 방 안에는 연기도 불도 없었다.`,
    choices: [
      to('CH3_LAST_CHECK_CARD_T', '06 카드를 판독기에 댄다.', SCENE_CH3_LAST_CARD, 0),
      to('CH3_LAST_CHECK_RADIO_T', '무전 소리를 따라 벽을 두드린다.', SCENE_CH3_LAST_RADIO, 0),
      to('CH3_LAST_CHECK_LABEL_T', '봉투 라벨을 확인한다.', SCENE_CH3_LAST_LABEL, 0),
    ],
    onEnter: enter0106,
  },

  [SCENE_CH3_0106_YUJIN]: {
    id: SCENE_CH3_0106_YUJIN,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '눌린 글씨',
    body: `빈 장부 위에 연필을 눕혀 문질렀다. 앞장에 적혔다가 뜯겨 나간 글씨가 희미하게 올라왔다.

06 / 302 / 21:41 입실

그 아래 서명은 끝부분만 남아 있었다.

한…

"제 서명 맞아요."

"기록이 없다면서요."

"전산에서 안 나왔어요. 제가 이걸 쓴 기억도 없습니다."

유진은 변명하지 않고 장부를 다시 봤다.

"그런데 제 글씨예요."

휴대전화 화면이 짧게 흔들렸다. 1시 06분.

문 위의 표시등이 녹색에서 붉은색으로 바뀌었다.

철컥.

문이 닫혔다.

나는 바로 손잡이를 당겼다. 움직이지 않았다.

천장 안쪽에서 모터가 돌아가기 시작했다. 환기구로 들어오던 미약한 공기마저 끊겼다.

문밖에서 손잡이를 당기는 소리가 들렸다.

"안에서 들립니까?"

"문이 안 열립니다."

스피커에서 낯선 안내음이 한 번 울렸다.

보관 구역 소화 절차를 시작합니다.

그런데 방 안에는 연기도 불도 없었다.`,
    choices: [
      to('CH3_LAST_CHECK_CARD_Y', '06 카드를 판독기에 댄다.', SCENE_CH3_LAST_CARD, 0),
      to('CH3_LAST_CHECK_RADIO_Y', '무전 소리를 따라 벽을 두드린다.', SCENE_CH3_LAST_RADIO, 0),
      to('CH3_LAST_CHECK_LABEL_Y', '봉투 라벨을 확인한다.', SCENE_CH3_LAST_LABEL, 0),
    ],
    onEnter: enter0106,
  },

  [SCENE_CH3_0106_SOLO]: {
    id: SCENE_CH3_0106_SOLO,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    title: '눌린 글씨',
    body: `빈 장부 위에 연필을 눕혀 문질렀다. 앞장에 적혔다가 뜯겨 나간 글씨가 희미하게 올라왔다.

06 / 302 / 21:41 입실

그 아래 서명은 끝부분만 남아 있었다.

한…

복도에서 발소리가 가까워졌다. 나는 장부와 06 카드가 한 화면에 들어오게 찍었다.

휴대전화 화면이 짧게 흔들렸다. 1시 06분.

문 위의 표시등이 녹색에서 붉은색으로 바뀌었다.

철컥.

문이 닫혔다.

나는 바로 손잡이를 당겼다. 움직이지 않았다.

천장 안쪽에서 모터가 돌아가기 시작했다. 환기구로 들어오던 미약한 공기마저 끊겼다.

복도 무전만 들렸다.

스피커에서 낯선 안내음이 한 번 울렸다.

보관 구역 소화 절차를 시작합니다.

그런데 방 안에는 연기도 불도 없었다.`,
    choices: [
      to('CH3_LAST_CHECK_CARD_S', '06 카드를 판독기에 댄다.', SCENE_CH3_LAST_CARD, 0),
      to('CH3_LAST_CHECK_RADIO_S', '무전 소리를 따라 벽을 두드린다.', SCENE_CH3_LAST_RADIO, 0),
      to('CH3_LAST_CHECK_LABEL_S', '봉투 라벨을 확인한다.', SCENE_CH3_LAST_LABEL, 0),
    ],
    onEnter: enter0106,
  },

  [SCENE_CH3_LAST_CARD]: {
    id: SCENE_CH3_LAST_CARD,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    body: `카드를 문 옆 검은 판에 댔다. 아무 반응도 없었다. 대신 맞은편 벽 안쪽에서 잠금 하나가 풀리는 소리가 났다.

현재 도면에는 없는 방향이었다.`,
    choices: [
      to('CH3_DIE_AFTER_CARD_T', '잠금이 풀린 방향을 기억한다.', SCENE_CH3_DEATH_TAEJUN, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'taejun' }], effects: [{ type: 'gainClue', clueId: CLUE_0106_CARD_READER }] }),
      to('CH3_DIE_AFTER_CARD_Y', '잠금이 풀린 방향을 기억한다.', SCENE_CH3_DEATH_YUJIN, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'yujin' }], effects: [{ type: 'gainClue', clueId: CLUE_0106_CARD_READER }] }),
      to('CH3_DIE_AFTER_CARD_S', '잠금이 풀린 방향을 기억한다.', SCENE_CH3_DEATH_SOLO, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'solo' }], effects: [{ type: 'gainClue', clueId: CLUE_0106_CARD_READER }] }),
    ],
  },

  [SCENE_CH3_LAST_RADIO]: {
    id: SCENE_CH3_LAST_RADIO,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    body: `벽 너머에서 태준의 목소리가 들렸다.

"이쪽에 계단이 있습니다. 그런데 입구가 막혀 있어요."

나는 소리가 가장 가까운 곳을 세 번 두드렸다. 반대편에서 같은 간격으로 세 번 돌아왔다.`,
    onEnter: [{ type: 'gainClue', clueId: CLUE_0106_RADIO_RESPONSE }],
    choices: [
      to('CH3_DIE_AFTER_RADIO_T', '맞은편 벽 뒤의 계단을 기억한다.', SCENE_CH3_DEATH_TAEJUN, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'taejun' }], effects: [{ type: 'gainClue', clueId: CLUE_0106_HIDDEN_STAIR }] }),
      to('CH3_DIE_AFTER_RADIO_Y', '맞은편 벽 뒤의 계단을 기억한다.', SCENE_CH3_DEATH_YUJIN, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'yujin' }], effects: [{ type: 'gainClue', clueId: CLUE_0106_HIDDEN_STAIR }] }),
      to('CH3_DIE_AFTER_RADIO_S', '맞은편 벽 뒤의 계단을 기억한다.', SCENE_CH3_DEATH_SOLO, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'solo' }], effects: [{ type: 'gainClue', clueId: CLUE_0106_HIDDEN_STAIR }] }),
    ],
  },

  [SCENE_CH3_LAST_LABEL]: {
    id: SCENE_CH3_LAST_LABEL,
    locationId: LOCATION_B1_DOCUMENT_TRANSFER,
    body: `숨이 가빠지는 동안 06 칸의 오래된 라벨을 떼었다. 아래에 다른 글씨가 남아 있었다.

관찰실 06 / B2`,
    choices: [
      to('CH3_DIE_AFTER_LABEL_T', '06과 B2의 연결을 기억한다.', SCENE_CH3_DEATH_TAEJUN, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'taejun' }], effects: [{ type: 'gainClue', clueId: CLUE_06_B2_LABEL }] }),
      to('CH3_DIE_AFTER_LABEL_Y', '06과 B2의 연결을 기억한다.', SCENE_CH3_DEATH_YUJIN, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'yujin' }], effects: [{ type: 'gainClue', clueId: CLUE_06_B2_LABEL }] }),
      to('CH3_DIE_AFTER_LABEL_S', '06과 B2의 연결을 기억한다.', SCENE_CH3_DEATH_SOLO, 0, { conditions: [{ type: 'flagEquals', flag: FLAG_CH3_COMPANION, value: 'solo' }], effects: [{ type: 'gainClue', clueId: CLUE_06_B2_LABEL }] }),
    ],
  },

  [SCENE_CH3_DEATH_TAEJUN]: deathScene(SCENE_CH3_DEATH_TAEJUN, 'taejun'),
  [SCENE_CH3_DEATH_YUJIN]: deathScene(SCENE_CH3_DEATH_YUJIN, 'yujin'),
  [SCENE_CH3_DEATH_SOLO]: deathScene(SCENE_CH3_DEATH_SOLO, 'solo'),

  [SCENE_CH3_RESET_2123]: {
    id: SCENE_CH3_RESET_2123,
    locationId: LOCATION_CAR,
    title: '오후 9시 23분',
    body: `차 안에서 숨을 들이켰다.

가슴이 아팠다. 공기는 들어오고 있었지만 몸은 한동안 그 사실을 믿지 못했다.

전화가 울렸다.

서윤.

손목시계 유리의 금은 그대로였다. 금 한쪽 끝에 전에는 없던 흐린 자국이 하나 더 생겨 있었다.

나는 전화를 받기 전에 음성 녹음 목록을 확인했다. 조금 전 남긴 파일은 없었다.

대신 말은 기억났다.

한 시 육 분. 이송실 안에 있으면 안 된다.

그리고 그 맞은편 벽 뒤에는 아래로 내려가는 계단이 있다.`,
    choices: [
      to('USE_MEMORY_0106_SEAL', '[기억] 01:06 밀폐와 맞은편 계단을 먼저 말한다.', SCENE_CH4_OPENING, 0, {
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_0106_SEAL }],
        effects: [{ type: 'setFlag', flag: FLAG_0106_AVOIDANCE_PLANNED, value: true, scope: 'loop' }],
      }),
    ],
  },

  [SCENE_CH4_OPENING]: {
    id: SCENE_CH4_OPENING,
    locationId: LOCATION_CAR,
    title: '숨부터',
    body: `전화를 받자 서윤이가 먼저 말했다.

"뭐 해?"

나는 대답하기 전에 창문을 조금 내렸다. 차가운 공기가 들어왔다. 숨이 막히지 않는다는 걸 확인하고 나서야 입을 열 수 있었다.

"서윤아. 네가 보내려는 문자 두 개, 둘 다 보내지 마."

"무슨 문자?"

"그리고 지금부터 내가 묻는 것만 대답해. 너한테 화난 게 아니라 시간이 없어서 그래."

"…오빠 또 죽었어?"

와이퍼가 한 번 유리를 지나갔다.

"또라는 말부터 설명해."

서윤은 잠시 아무 말도 하지 않았다.

"이번에는 어떻게."

"한 시 육 분. 지하 문서 이송실."

서윤의 숨소리가 작아졌다.

"거긴 들어가면 안 돼."

"이제는 알아."`,
    choices: [to('CH4_SET_LOOP_GOAL', '이번 밤에 바꿀 일을 정리한다.', SCENE_CH4_MILESTONE_A_END, 0)],
  },

  [SCENE_CH4_MILESTONE_A_END]: {
    id: SCENE_CH4_MILESTONE_A_END,
    locationId: LOCATION_CAR,
    title: '이번 밤의 목표',
    body: `이미 확인한 일을 다시 밟을 필요는 없었다.

302호에는 서윤의 휴대전화가 나타난다.

자정에는 복도 끝 직원용 문이 열린다.

B1 이송실은 1시 06분에 밀폐된다.

맞은편 벽 뒤에는 B2로 내려가는 계단이 있다.

하지만 혼자 문을 찾는 것만으로는 부족했다. 문을 열 사람, 환자 기록을 확인할 사람, 겹친 공간을 기억하는 사람이 따로 있었다.

이번에는 한 사람에게 먼저 증명하기로 했다.`,
    choices: [],
  },
};
