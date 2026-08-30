export type DeathMemoryFragmentId =
  | 'blackout'
  | 'stopped-watch'
  | 'unlocked-door';

export type DeathMemoryFragment = {
  id: DeathMemoryFragmentId;
  text: string;
};

export const firstDeathMemoryFragments: readonly DeathMemoryFragment[] = [
  {
    id: 'unlocked-door',
    text: '복도 끝에서 전자 잠금이 풀리는 소리가 났다.',
  },
  {
    id: 'blackout',
    text: '모든 불이 동시에 꺼졌다.',
  },
  {
    id: 'stopped-watch',
    text: '초침이 열두 시를 가리킨 채 멈췄다.',
  },
];

export const firstDeathMemorySequence: readonly DeathMemoryFragmentId[] = [
  'blackout',
  'stopped-watch',
  'unlocked-door',
];

export type DeathMemoryState = {
  acceptedIds: readonly DeathMemoryFragmentId[];
  mistakeId?: DeathMemoryFragmentId;
};

export function createDeathMemoryState(): DeathMemoryState {
  return { acceptedIds: [] };
}

export function selectDeathMemoryFragment(
  state: DeathMemoryState,
  fragmentId: DeathMemoryFragmentId,
): DeathMemoryState {
  if (state.acceptedIds.length === firstDeathMemorySequence.length) return state;
  if (state.acceptedIds.includes(fragmentId)) return state;

  const expectedId = firstDeathMemorySequence[state.acceptedIds.length];
  if (fragmentId !== expectedId) {
    return { acceptedIds: [], mistakeId: fragmentId };
  }

  return {
    acceptedIds: [...state.acceptedIds, fragmentId],
  };
}

export function isDeathMemoryComplete(state: DeathMemoryState): boolean {
  return state.acceptedIds.length === firstDeathMemorySequence.length;
}
