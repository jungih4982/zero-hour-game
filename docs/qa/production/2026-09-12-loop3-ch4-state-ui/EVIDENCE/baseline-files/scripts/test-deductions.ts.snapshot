import {
  CLUE_06_CARD,
  CLUE_302_OCCUPIED,
  CLUE_CCTV_GAP,
  CLUE_FIRST_PHONE,
  CLUE_OLD_302_PASSAGE,
  CLUE_WRISTBAND_DOB,
  ITEM_FIRST_PHONE_PHOTO,
  LOCATION_ROOM_302,
  SCENE_LOOP2_PHONE_PARADOX,
  SCENE_LOOP2_YUJIN_MINIMAL,
  prologueScenes,
  resetWatchMemory,
} from '../src/content/prologue';
import {
  applyEffects,
  getAvailableChoices,
  type GameTime,
  type NarrativeEngineState,
} from '../src/engine';
import {
  DEDUCTION_PHONE_DUPLICATION,
  hidden302RouteDeduction,
  identity06Deduction,
  canFormDeduction,
  isCorrectDeductionConnection,
  phoneDuplicationDeduction,
} from '../src/gameplay/deductions';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const state: NarrativeEngineState = {
  persistent: {
    loopCount: 2,
    clueIds: [CLUE_302_OCCUPIED, CLUE_FIRST_PHONE],
    deductionIds: [],
    memories: [resetWatchMemory],
    deathIntel: [],
    deathRecords: [],
    flags: {},
  },
  volatile: {
    time: 36 as GameTime,
    currentSceneId: SCENE_LOOP2_PHONE_PARADOX,
    currentLocationId: LOCATION_ROOM_302,
    visitedSceneIds: [SCENE_LOOP2_PHONE_PARADOX],
    itemIds: [],
    flags: {},
  },
};

assert(
  canFormDeduction(state, phoneDuplicationDeduction),
  '302호 흔적, 첫 번째 전화, 루프 기억을 확보하면 전화 중복 추론이 가능해야 합니다.',
);
assert(
  !isCorrectDeductionConnection(phoneDuplicationDeduction, [
    CLUE_FIRST_PHONE,
    resetWatchMemory.id,
  ]),
  '관련 있어 보이는 기억이라도 핵심 302호 모순을 대신할 수 없어야 합니다.',
);
assert(
  isCorrectDeductionConnection(phoneDuplicationDeduction, [
    CLUE_FIRST_PHONE,
    CLUE_302_OCCUPIED,
  ]),
  '플레이어가 두 핵심 기록을 직접 고르면 추론이 완성되어야 합니다.',
);

const scene = prologueScenes[SCENE_LOOP2_PHONE_PARADOX];
assert(
  !getAvailableChoices(scene, state).some((choice) => choice.id === 'DOCUMENT_PHONE_PARADOX'),
  '추론을 완성하기 전에는 증거 기록 선택지가 노출되면 안 됩니다.',
);

const deducedState = applyEffects(state, [
  { type: 'gainDeduction', deductionId: DEDUCTION_PHONE_DUPLICATION },
]);
const deductionChoice = getAvailableChoices(scene, deducedState).find(
  (choice) => choice.id === 'DOCUMENT_PHONE_PARADOX',
);
assert(deductionChoice, '완성한 추론은 전화 증거 기록 선택지를 열어야 합니다.');

const afterChoice = applyEffects(deducedState, deductionChoice.effects);
assert(
  afterChoice.volatile.currentSceneId === SCENE_LOOP2_YUJIN_MINIMAL,
  '추론 선택지는 불필요한 대치를 피하는 기존 장면으로 합류해야 합니다.',
);
assert(
  afterChoice.volatile.time === (38 as GameTime),
  '추론 선택지는 일반 대응보다 짧은 2분만 사용해야 합니다.',
);
assert(
  afterChoice.volatile.itemIds.includes(ITEM_FIRST_PHONE_PHOTO),
  '추론 선택지는 첫 번째 전화 사진을 증거로 남겨야 합니다.',
);

const postSliceState: NarrativeEngineState = {
  ...state,
  persistent: {
    ...state.persistent,
    clueIds: [CLUE_WRISTBAND_DOB, CLUE_06_CARD, CLUE_CCTV_GAP, CLUE_OLD_302_PASSAGE],
  },
};

assert(
  canFormDeduction(postSliceState, identity06Deduction),
  '손목밴드와 카드의 06을 확보하면 동일 분류 추론이 가능해야 합니다.',
);
assert(
  isCorrectDeductionConnection(identity06Deduction, [CLUE_WRISTBAND_DOB, CLUE_06_CARD]),
  '서로 다른 밤의 06 기록을 직접 골라야 동일 분류 추론이 완성되어야 합니다.',
);
assert(
  canFormDeduction(postSliceState, hidden302RouteDeduction),
  'CCTV 공백과 오래된 통로를 확보하면 302호 우회 동선 추론이 가능해야 합니다.',
);
assert(
  !isCorrectDeductionConnection(hidden302RouteDeduction, [CLUE_CCTV_GAP, CLUE_06_CARD]),
  '숫자 카드는 영상 공백과 숨은 통로의 연결을 대신할 수 없어야 합니다.',
);
assert(
  isCorrectDeductionConnection(hidden302RouteDeduction, [CLUE_CCTV_GAP, CLUE_OLD_302_PASSAGE]),
  'CCTV 공백과 오래된 안내도를 직접 골라야 숨은 동선 추론이 완성되어야 합니다.',
);

console.log('Phone duplication, 06 identity, and hidden-route deductions passed.');
