import type {
  ClueId,
  DeductionId,
  MemoryId,
  NarrativeEngineState,
} from '../engine';
import { spaceNotAlignedDeduction } from '../content/chapter3';

export const DEDUCTION_BLACKOUT_ROUTE = 'DEDUCTION_BLACKOUT_ROUTE' as DeductionId;
export const DEDUCTION_PHONE_DUPLICATION = 'DEDUCTION_PHONE_DUPLICATION' as DeductionId;
export const DEDUCTION_06_IDENTITY = 'DEDUCTION_06_IDENTITY' as DeductionId;
export const DEDUCTION_302_HIDDEN_ROUTE = 'DEDUCTION_302_HIDDEN_ROUTE' as DeductionId;

export type DeductionFact = {
  sourceId: ClueId | MemoryId;
  label: string;
  text: string;
  tone: 'evidence' | 'memory';
};

export type DeductionDefinition = {
  id: DeductionId;
  title: string;
  prompt: string;
  description: string;
  conclusion: string;
  requiredClueIds: readonly ClueId[];
  requiredMemoryIds: readonly MemoryId[];
  facts: readonly DeductionFact[];
};

export const blackoutRouteDeduction: DeductionDefinition = {
  id: DEDUCTION_BLACKOUT_ROUTE,
  title: '정전이 여는 길',
  prompt: '자정에 풀리는 잠금은 어느 동선과 이어지는가?',
  description: '피난 안내도와 첫 번째 죽음의 기억을 연결한다.',
  conclusion: '자정 직전 복도 끝에서 기다리면 잠금이 풀리는 순간 지하로 내려갈 수 있다.',
  requiredClueIds: ['CLUE_B1_MAP' as ClueId],
  requiredMemoryIds: ['MEMORY_BLACKOUT_0000' as MemoryId],
  facts: [
    {
      sourceId: 'CLUE_B1_MAP' as ClueId,
      label: '현장',
      text: '지하로 이어지는 피난 안내도',
      tone: 'evidence',
    },
    {
      sourceId: 'MEMORY_BLACKOUT_0000' as MemoryId,
      label: '기억',
      text: '자정에 풀린 전자 잠금',
      tone: 'memory',
    },
  ],
};

export const phoneDuplicationDeduction: DeductionDefinition = {
  id: DEDUCTION_PHONE_DUPLICATION,
  title: '두 장소의 같은 전화',
  prompt: '첫 번째 밤과 지금의 302호를 잇는 모순은 무엇인가?',
  description: '첫 번째 밤의 302호 흔적과 지금 눈앞의 전화를 연결한다.',
  conclusion: '설명으로 설득하지 않는다. 같은 흠집과 두 통화 화면을 한 장에 남기면 된다.',
  requiredClueIds: [
    'CLUE_302_OCCUPIED' as ClueId,
    'CLUE_FIRST_PHONE' as ClueId,
  ],
  requiredMemoryIds: ['MEMORY_RESET_WATCH' as MemoryId],
  facts: [
    {
      sourceId: 'CLUE_302_OCCUPIED' as ClueId,
      label: '첫 번째 밤',
      text: '비어 있지 않았던 302호',
      tone: 'memory',
    },
    {
      sourceId: 'CLUE_FIRST_PHONE' as ClueId,
      label: '지금',
      text: '통화 중인데 울리는 같은 전화',
      tone: 'evidence',
    },
  ],
};

export const identity06Deduction: DeductionDefinition = {
  id: DEDUCTION_06_IDENTITY,
  title: '같은 06',
  prompt: '서로 다른 밤에 남은 06은 무엇을 함께 가리키는가?',
  description: '첫 번째 밤의 손목밴드와 지금 발견된 카드를 대조한다.',
  conclusion: '06은 우연한 병실 번호가 아니다. 두 물건은 같은 분류 체계로 관리된 대상을 가리킨다.',
  requiredClueIds: ['CLUE_WRISTBAND_DOB' as ClueId, 'CLUE_06_CARD' as ClueId],
  requiredMemoryIds: [],
  facts: [
    { sourceId: 'CLUE_WRISTBAND_DOB' as ClueId, label: '첫 번째 밤', text: '찢어진 손목밴드 끝의 06', tone: 'memory' },
    { sourceId: 'CLUE_06_CARD' as ClueId, label: '지금', text: '302호 침대 옆에서 나온 06 카드', tone: 'evidence' },
  ],
};

export const hidden302RouteDeduction: DeductionDefinition = {
  id: DEDUCTION_302_HIDDEN_ROUTE,
  title: '사라지는 302호 동선',
  prompt: '302호에서 나오지 않은 사람과 현재에는 없는 길을 연결한다.',
  description: 'CCTV가 비는 1분과 오래된 안내도의 폐쇄 통로를 겹친다.',
  conclusion: '서윤은 일반 복도를 지나지 않았다. 영상이 비는 동안 302호 뒤의 옛 통로를 이용했을 가능성이 있다.',
  requiredClueIds: ['CLUE_CCTV_GAP' as ClueId, 'CLUE_OLD_302_PASSAGE' as ClueId],
  requiredMemoryIds: [],
  facts: [
    { sourceId: 'CLUE_CCTV_GAP' as ClueId, label: '보안 기록', text: '302호 앞 영상이 비는 1분', tone: 'evidence' },
    { sourceId: 'CLUE_OLD_302_PASSAGE' as ClueId, label: '건물 기록', text: '현재 벽 뒤에 표시된 옛 통로', tone: 'evidence' },
  ],
};

export const deductions = [
  blackoutRouteDeduction,
  phoneDuplicationDeduction,
  identity06Deduction,
  hidden302RouteDeduction,
  spaceNotAlignedDeduction,
] as const;

export function canFormDeduction(
  state: NarrativeEngineState,
  definition: DeductionDefinition,
): boolean {
  return definition.requiredClueIds.every((id) => state.persistent.clueIds.includes(id))
    && definition.requiredMemoryIds.every((id) =>
      state.persistent.memories.some((memory) => memory.id === id),
    );
}

export function isCorrectDeductionConnection(
  definition: DeductionDefinition,
  selectedSourceIds: readonly string[],
): boolean {
  if (selectedSourceIds.length !== definition.facts.length) return false;
  return definition.facts.every((fact) => selectedSourceIds.includes(fact.sourceId));
}
