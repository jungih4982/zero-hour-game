import type { ChoiceCondition, NarrativeEngineState } from './types';

/** Evaluates one data-driven condition without changing engine state. */
export function evaluateCondition(
  condition: ChoiceCondition,
  state: NarrativeEngineState,
): boolean {
  switch (condition.type) {
    case 'hasMemory':
      return state.persistent.memories.some(
        (memory) => memory.id === condition.memoryId,
      );
    case 'hasClue':
      return state.persistent.clueIds.includes(condition.clueId);
    case 'lacksClue':
      return !state.persistent.clueIds.includes(condition.clueId);
    case 'hasItem':
      return state.volatile.itemIds.includes(condition.itemId);
    case 'hasDeduction':
      return state.persistent.deductionIds.includes(condition.deductionId);
    case 'minimumLoopCount':
      return state.persistent.loopCount >= condition.count;
    case 'maximumLoopCount':
      return state.persistent.loopCount <= condition.count;
    case 'timeBefore':
      return state.volatile.time <= condition.time;
    case 'timeAfter':
      return state.volatile.time >= condition.time;
    case 'timeRange':
      return (
        state.volatile.time >= condition.start &&
        state.volatile.time <= condition.end
      );
    case 'knowsPreviousDeath':
      return state.persistent.deathRecords.some(
        (record) => record.deathId === condition.deathId,
      );
    case 'knowsDeathIntel':
      return state.persistent.deathIntel.some(
        (intel) => intel.memoryId === condition.memoryId,
      );
    case 'flagEquals':
      return (
        (state.volatile.flags[condition.flag] ??
          state.persistent.flags[condition.flag]) === condition.value
      );
  }
}

/** Empty or omitted condition lists pass; otherwise every condition must pass. */
export function evaluateConditions(
  conditions: readonly ChoiceCondition[] | undefined,
  state: NarrativeEngineState,
): boolean {
  return conditions?.every((condition) => evaluateCondition(condition, state)) ?? true;
}
