import type { GameTime, NarrativeEngineState } from './types';

export function elapsedUntil(current: number, target: number): number {
  if (!Number.isSafeInteger(target) || target < 0) throw new Error('Invalid clock target');
  return target > current ? target - current : 0;
}

/** Advance elapsed minutes and record crossed anchors once per loop, including exact boundaries. */
export function advanceClock(state: NarrativeEngineState, minutes: number): NarrativeEngineState {
  if (!Number.isSafeInteger(minutes) || minutes < 0) throw new Error('Invalid elapsed minutes');
  const time = (state.volatile.time + minutes) as GameTime;
  const clock = state.volatile.clock;
  const events = { ...clock?.events };
  for (const anchor of clock?.schedule ?? []) {
    if (anchor.time >= state.volatile.time && anchor.time <= time && events[anchor.id] === undefined) {
      events[anchor.id] = anchor.time;
    }
  }
  return {
    ...state,
    volatile: { ...state.volatile, time, ...(clock ? { clock: { ...clock, events } } : {}) },
  };
}
