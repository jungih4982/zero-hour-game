export type DeathMemoryFragmentId =
  | 'blackout'
  | 'stopped-watch'
  | 'unlocked-door'
  | 'sealed-door'
  | 'air-stopped'
  | 'hidden-stairs';

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

export const secondDeathMemoryFragments: readonly DeathMemoryFragment[] = [
  { id: 'hidden-stairs', text: '이번에는 아래로 이어지는 계단 쪽이었다.' },
  { id: 'sealed-door', text: '문이 닫혔다.' },
  { id: 'air-stopped', text: '환기구로 들어오던 미약한 공기마저 끊겼다.' },
];

export const secondDeathMemorySequence: readonly DeathMemoryFragmentId[] = [
  'sealed-door',
  'air-stopped',
  'hidden-stairs',
];

export function getDeathMemoryFragments(deathId: string | undefined): readonly DeathMemoryFragment[] {
  return deathId === 'DEATH_0106_TRANSFER_SEAL'
    ? secondDeathMemoryFragments
    : firstDeathMemoryFragments;
}

export function getDeathMemorySequence(deathId: string | undefined): readonly DeathMemoryFragmentId[] {
  return deathId === 'DEATH_0106_TRANSFER_SEAL'
    ? secondDeathMemorySequence
    : firstDeathMemorySequence;
}

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
  sequence: readonly DeathMemoryFragmentId[] = firstDeathMemorySequence,
): DeathMemoryState {
  if (state.acceptedIds.length === sequence.length) return state;
  if (state.acceptedIds.includes(fragmentId)) return state;

  const expectedId = sequence[state.acceptedIds.length];
  if (fragmentId !== expectedId) {
    return { acceptedIds: [], mistakeId: fragmentId };
  }

  return {
    acceptedIds: [...state.acceptedIds, fragmentId],
  };
}

export function isDeathMemoryComplete(
  state: DeathMemoryState,
  sequence: readonly DeathMemoryFragmentId[] = firstDeathMemorySequence,
): boolean {
  return state.acceptedIds.length === sequence.length;
}
