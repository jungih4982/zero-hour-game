import type { LocationId, NarrativeEngineState, SceneId } from '../engine';
import { storyScenes } from '../content/story';
import { createTimeContract } from '../content/timeContract';
import { MEMORY_0106_SEAL, seal0106Memory } from '../content/chapter3';

export const SAVE_VERSION = 6;

const LEGACY_OPERATIONS_SCENE = 'SCENE_LOOP2_SERVICE_CORRIDOR' as SceneId;
const LEGACY_OPERATIONS_LOCATION = 'B1_SERVICE_CORRIDOR' as LocationId;

function migrateVersion3OperationsNames(
  saved: NarrativeEngineState,
): NarrativeEngineState {
  const currentSceneId =
    saved.volatile.currentSceneId === LEGACY_OPERATIONS_SCENE
      ? ('SCENE_LOOP2_OPERATIONS_CORRIDOR' as SceneId)
      : saved.volatile.currentSceneId;
  const currentLocationId =
    saved.volatile.currentLocationId === LEGACY_OPERATIONS_LOCATION
      ? ('B1_OPERATIONS_CORRIDOR' as LocationId)
      : saved.volatile.currentLocationId;

  return {
    persistent: {
      ...saved.persistent,
      memories: saved.persistent.memories.map((memory) =>
        memory.payoff?.unlocksLocationId === LEGACY_OPERATIONS_LOCATION
          ? {
              ...memory,
              payoff: {
                ...memory.payoff,
                unlocksLocationId: 'B1_OPERATIONS_CORRIDOR' as LocationId,
              },
            }
          : memory,
      ),
    },
    volatile: {
      ...saved.volatile,
      currentSceneId,
      currentLocationId,
      visitedSceneIds: saved.volatile.visitedSceneIds.map((sceneId) =>
        sceneId === LEGACY_OPERATIONS_SCENE
          ? ('SCENE_LOOP2_OPERATIONS_CORRIDOR' as SceneId)
          : sceneId,
      ),
    },
  };
}

/** Preserve legacy time and all knowledge/inventory. Never infer elapsed time from a scene id. */
export function migrateSavedNarrativeState(persisted: unknown, version: number): NarrativeEngineState | undefined {
  const saved = (persisted as { engineState?: NarrativeEngineState } | undefined)?.engineState;
  if (!saved?.persistent || !saved.volatile || version < 3) return undefined;
  const named = version === 3 ? migrateVersion3OperationsNames(saved) : saved;
  // Update copied payoff metadata only. Acquisition, source, knowledge and clock are evidence.
  const state = version < 6 ? { ...named, persistent: { ...named.persistent,
    memories: named.persistent.memories.map(memory => memory.id === MEMORY_0106_SEAL
      ? { ...memory, payoff: seal0106Memory.payoff } : memory),
  } } : named;
  if (!storyScenes[state.volatile.currentSceneId]) return undefined;
  if (version >= 5 && state.volatile.clock) return state;
  const clock = createTimeContract();
  const visited = state.volatile.visitedSceneIds;
  const events: Record<string, 'legacy'> = {};
  if (state.volatile.flags.FLAG_FIRST_DEATH_AVOIDED
    || visited.includes('SCENE_ACT3_BLACKOUT' as SceneId)
    || visited.includes('SCENE_LOOP2_BLACKOUT_INTERVENTION' as SceneId)) events.blackout = 'legacy';
  if (visited.some(id => id.startsWith('SCENE_CH3_0106_'))) events.seal0106 = 'legacy';
  return { ...state, volatile: { ...state.volatile, clock: { ...clock, contractVersion: 0, events } } };
}
