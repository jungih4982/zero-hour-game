import type { GameTime, LoopVolatileState } from '../engine/types';

export const BLACKOUT_TIME = 157 as GameTime; // 21:23 -> 00:00
export const CHAPTER3_START_TIME = 184 as GameTime; // 00:27
export const SECOND_DEATH_TIME = 223 as GameTime; // 01:06
export const TIME_CONTRACT_VERSION = 1;

export function createTimeContract(): NonNullable<LoopVolatileState['clock']> {
  return {
    contractVersion: TIME_CONTRACT_VERSION,
    schedule: [
      { id: 'blackout', time: BLACKOUT_TIME },
      { id: 'seal0106', time: SECOND_DEATH_TIME },
    ],
    events: {},
  };
}
