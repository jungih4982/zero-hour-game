import type { NarrativeEngineState } from '../engine';

/** Persistent custody flags describe an experienced night, never present possession. */
export function describeBandState(state: NarrativeEngineState): string | undefined {
  const original = state.volatile.itemIds.some(id => id === 'ITEM_WRISTBAND_ORIGINAL');
  const owner = state.volatile.flags.CH3_BAND_OWNER;
  const history = state.persistent.flags;
  if (original) return '손목밴드 원본 · 현재 소지';
  if (owner === 'yujin') return '이번 밤 · 유진에게 맡긴 손목밴드';
  if (history.BAND_CUSTODY_YUJIN && history.BAND_CUSTODY_PLAYER)
    return '이전 밤들의 보관 기억 · 현재 원본 소지 없음';
  if (history.BAND_CUSTODY_YUJIN) return '이전 밤 유진에게 맡긴 기억 · 현재 원본 소지 없음';
  if (history.BAND_CUSTODY_PLAYER) return '이전 밤 원본을 보관한 기억 · 현재 원본 소지 없음';
  return undefined;
}

export function transferRoomDetail(state: NarrativeEngineState): string {
  return state.persistent.memories.some(memory => memory.id === 'MEMORY_0106_SEAL')
    ? '01시 06분에 자동 밀폐되는 보관 구역'
    : '문서와 회수 물품을 보관하는 B1 이송실';
}
