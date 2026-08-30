import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  LOCATION_CAR,
  LOCATION_MOUNTAIN_ROAD,
  SCENE_CH00_ENTRANCE,
  SCENE_LOOP2_RESET_AWAKENING,
  prologueScenes,
} from '../content/prologue';
import {
  LOOP_START_TIME,
  applyEffects,
  getAvailableChoices,
  resetLoop,
} from '../engine';
import type { DeductionId, LocationId, NarrativeEngineState, SceneId } from '../engine';
import { canFormDeduction, deductions } from '../gameplay/deductions';
import {
  canInspectHotspot,
  investigationFlag,
  isHotspotInspected,
  sceneInvestigations,
} from '../gameplay/investigation';

const SAVE_VERSION = 4;

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

export function createInitialNarrativeState(): NarrativeEngineState {
  return {
    persistent: {
      loopCount: 1,
      clueIds: [],
      deductionIds: [],
      memories: [],
      deathIntel: [],
      deathRecords: [],
      flags: {},
    },
    volatile: {
      time: LOOP_START_TIME,
      currentSceneId: SCENE_CH00_ENTRANCE,
      currentLocationId: LOCATION_MOUNTAIN_ROAD,
      visitedSceneIds: [SCENE_CH00_ENTRANCE],
      itemIds: [],
      flags: {},
    },
  };
}

function appendVisited(
  state: NarrativeEngineState,
  sceneId: SceneId,
): NarrativeEngineState {
  if (state.volatile.visitedSceneIds.includes(sceneId)) return state;
  return {
    ...state,
    volatile: {
      ...state.volatile,
      visitedSceneIds: [...state.volatile.visitedSceneIds, sceneId],
    },
  };
}

type NarrativeStore = {
  engineState: NarrativeEngineState;
  selectChoice: (choiceId: string) => void;
  formDeduction: (deductionId: DeductionId) => void;
  inspectHotspot: (hotspotId: string) => void;
  beginNextLoop: () => void;
  restartStory: () => void;
};

export function migrateNarrativeState(
  persisted: unknown,
  storedVersion: number,
): NarrativeEngineState {
  const candidate = persisted as Partial<NarrativeStore> | undefined;
  const saved = candidate?.engineState;
  if (!saved?.persistent || !saved.volatile) {
    return createInitialNarrativeState();
  }
  if (storedVersion === 3) {
    const migrated = migrateVersion3OperationsNames(saved);
    if (prologueScenes[migrated.volatile.currentSceneId]) return migrated;
  }
  if (
    storedVersion >= SAVE_VERSION &&
    prologueScenes[saved.volatile.currentSceneId]
  ) {
    return saved;
  }

  // v3 changes the canonical opening, reset anchor, and every story scene id.
  // Older saves cannot be mapped without inventing narrative state.
  return createInitialNarrativeState();
}

export const useNarrativeStore = create<NarrativeStore>()(
  persist(
    (set) => ({
      engineState: createInitialNarrativeState(),
      selectChoice: (choiceId) =>
        set(({ engineState }) => {
          const scene = prologueScenes[engineState.volatile.currentSceneId];
          const choice = getAvailableChoices(scene, engineState).find(
            (candidate) => candidate.id === choiceId,
          );
          if (!choice || engineState.volatile.deathId) return { engineState };

          const afterChoice = applyEffects(engineState, choice.effects);
          const nextScene = prologueScenes[afterChoice.volatile.currentSceneId];
          const afterEntry = applyEffects(afterChoice, nextScene.onEnter ?? []);
          return {
            engineState: appendVisited(afterEntry, nextScene.id),
          };
        }),
      formDeduction: (deductionId) =>
        set(({ engineState }) => {
          const definition = deductions.find((entry) => entry.id === deductionId);
          if (
            !definition
            || engineState.persistent.deductionIds.includes(deductionId)
            || !canFormDeduction(engineState, definition)
          ) {
            return { engineState };
          }
          return {
            engineState: applyEffects(engineState, [
              { type: 'gainDeduction', deductionId },
            ]),
          };
        }),
      inspectHotspot: (hotspotId) =>
        set(({ engineState }) => {
          const sceneId = engineState.volatile.currentSceneId;
          const investigation = sceneInvestigations[sceneId];
          const hotspot = investigation?.hotspots.find((entry) => entry.id === hotspotId);
          if (
            !hotspot
            || isHotspotInspected(engineState, sceneId, hotspotId)
            || !canInspectHotspot(engineState, investigation, hotspot)
          ) {
            return { engineState };
          }
          return {
            engineState: applyEffects(engineState, [
              ...hotspot.effects,
              {
                type: 'setFlag',
                flag: investigationFlag(sceneId, hotspotId),
                value: true,
                scope: 'loop',
              },
            ]),
          };
        }),
      beginNextLoop: () =>
        set(({ engineState }) => ({
          engineState: appendVisited(
            resetLoop(engineState, SCENE_LOOP2_RESET_AWAKENING, LOCATION_CAR),
            SCENE_LOOP2_RESET_AWAKENING,
          ),
        })),
      restartStory: () => set({ engineState: createInitialNarrativeState() }),
    }),
    {
      name: 'zero-hour-narrative-save',
      version: SAVE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (store) => ({ engineState: store.engineState }),
      migrate: (persisted, storedVersion) => ({
        engineState: migrateNarrativeState(persisted, storedVersion),
      }) as NarrativeStore,
    },
  ),
);
