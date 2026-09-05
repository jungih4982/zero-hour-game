import type {
  ClueId,
  DeathIntel,
  GameTime,
  NarrativeEffect,
  NarrativeEngineState,
} from './types';

function appendUnique<T>(values: readonly T[], value: T): readonly T[] {
  return values.includes(value) ? values : [...values, value];
}

function addDeathIntel(
  state: NarrativeEngineState,
  intel: DeathIntel,
): NarrativeEngineState {
  const deathIntel = state.persistent.deathIntel.some(
    (known) => known.memoryId === intel.memoryId,
  )
    ? state.persistent.deathIntel
    : [...state.persistent.deathIntel, intel];
  const clueIds = (intel.learnedClueIds ?? []).reduce<readonly ClueId[]>(
    (known, clueId) => appendUnique(known, clueId),
    state.persistent.clueIds,
  );

  return {
    ...state,
    persistent: {
      ...state.persistent,
      clueIds,
      deathIntel,
    },
  };
}

/** Applies one effect immutably and returns the resulting engine state. */
export function applyEffect(
  state: NarrativeEngineState,
  effect: NarrativeEffect,
): NarrativeEngineState {
  switch (effect.type) {
    case 'gainClue':
      return {
        ...state,
        persistent: {
          ...state.persistent,
          clueIds: appendUnique(state.persistent.clueIds, effect.clueId),
        },
      };
    case 'gainDeduction':
      return {
        ...state,
        persistent: {
          ...state.persistent,
          deductionIds: appendUnique(
            state.persistent.deductionIds,
            effect.deductionId,
          ),
        },
      };
    case 'gainMemory':
      return state.persistent.memories.some(
        (memory) => memory.id === effect.memory.id,
      )
        ? state
        : {
            ...state,
            persistent: {
              ...state.persistent,
              memories: [...state.persistent.memories, effect.memory],
            },
          };
    case 'gainItem':
      return {
        ...state,
        volatile: {
          ...state.volatile,
          itemIds: appendUnique(state.volatile.itemIds, effect.itemId),
        },
      };
    case 'removeItem':
      return {
        ...state,
        volatile: {
          ...state.volatile,
          itemIds: state.volatile.itemIds.filter(
            (itemId) => itemId !== effect.itemId,
          ),
        },
      };
    case 'gainDeathIntel':
      return addDeathIntel(state, effect.intel);
    case 'advanceTime':
      return {
        ...state,
        volatile: {
          ...state.volatile,
          time: (state.volatile.time + effect.minutes) as GameTime,
        },
      };
    case 'setTime':
      return {
        ...state,
        volatile: { ...state.volatile, time: effect.time },
      };
    case 'moveLocation':
      return {
        ...state,
        volatile: { ...state.volatile, currentLocationId: effect.locationId },
      };
    case 'setFlag':
      return effect.scope === 'persistent'
        ? {
            ...state,
            persistent: {
              ...state.persistent,
              flags: { ...state.persistent.flags, [effect.flag]: effect.value },
            },
          }
        : {
            ...state,
            volatile: {
              ...state.volatile,
              flags: { ...state.volatile.flags, [effect.flag]: effect.value },
            },
          };
    case 'triggerDeath': {
      const alreadyRecorded = state.persistent.deathRecords.some(
        (record) =>
          record.deathId === effect.deathId &&
          record.loopCount === state.persistent.loopCount,
      );
      const deadState: NarrativeEngineState = {
        ...state,
        volatile: { ...state.volatile, deathId: effect.deathId },
        persistent: {
          ...state.persistent,
          deathRecords: alreadyRecorded
            ? state.persistent.deathRecords
            : [
                ...state.persistent.deathRecords,
                {
                  deathId: effect.deathId,
                  loopCount: state.persistent.loopCount,
                  time: state.volatile.time,
                  sceneId: state.volatile.currentSceneId,
                },
              ],
        },
      };
      return effect.intel ? addDeathIntel(deadState, effect.intel) : deadState;
    }
    case 'jumpScene':
      return {
        ...state,
        volatile: { ...state.volatile, currentSceneId: effect.sceneId },
      };
  }
}

/** Applies effects from left to right, passing each result to the next effect. */
export function applyEffects(
  state: NarrativeEngineState,
  effects: readonly NarrativeEffect[],
): NarrativeEngineState {
  return effects.reduce(applyEffect, state);
}
