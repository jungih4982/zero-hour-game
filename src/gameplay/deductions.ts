import type {
  ClueId,
  DeductionId,
  MemoryId,
  NarrativeEngineState,
} from '../engine';

export const DEDUCTION_BLACKOUT_ROUTE = 'DEDUCTION_BLACKOUT_ROUTE' as DeductionId;
export const DEDUCTION_PHONE_DUPLICATION = 'DEDUCTION_PHONE_DUPLICATION' as DeductionId;

export type DeductionFact = {
  label: string;
  text: string;
  tone: 'evidence' | 'memory';
};

export type DeductionDefinition = {
  id: DeductionId;
  title: string;
  description: string;
  conclusion: string;
  requiredClueIds: readonly ClueId[];
  requiredMemoryIds: readonly MemoryId[];
  facts: readonly [DeductionFact, DeductionFact];
};

export const blackoutRouteDeduction: DeductionDefinition = {
  id: DEDUCTION_BLACKOUT_ROUTE,
  title: '정전이 여는 길',
  description: '피난 안내도와 첫 번째 죽음의 기억을 연결한다.',
  conclusion: '자정 직전 복도 끝에서 기다리면 잠금이 풀리는 순간 지하로 내려갈 수 있다.',
  requiredClueIds: ['CLUE_B1_MAP' as ClueId],
  requiredMemoryIds: ['MEMORY_BLACKOUT_0000' as MemoryId],
  facts: [
    { label: '현장', text: '지하로 이어지는 피난 안내도', tone: 'evidence' },
    { label: '기억', text: '자정에 풀린 전자 잠금', tone: 'memory' },
  ],
};

export const phoneDuplicationDeduction: DeductionDefinition = {
  id: DEDUCTION_PHONE_DUPLICATION,
  title: '두 장소의 같은 전화',
  description: '첫 번째 밤의 302호 흔적과 지금 눈앞의 전화를 연결한다.',
  conclusion: '설명으로 설득하지 않는다. 같은 흠집과 두 통화 화면을 한 장에 남기면 된다.',
  requiredClueIds: [
    'CLUE_302_OCCUPIED' as ClueId,
    'CLUE_FIRST_PHONE' as ClueId,
  ],
  requiredMemoryIds: ['MEMORY_RESET_WATCH' as MemoryId],
  facts: [
    { label: '첫 번째 밤', text: '비어 있지 않았던 302호', tone: 'memory' },
    { label: '지금', text: '통화 중인데 울리는 같은 전화', tone: 'evidence' },
  ],
};

export const deductions = [
  blackoutRouteDeduction,
  phoneDuplicationDeduction,
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
