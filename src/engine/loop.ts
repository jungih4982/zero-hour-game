import type {
  GameTime,
  LocationId,
  NarrativeEngineState,
  SceneId,
} from './types';

export const LOOP_START_TIME = 0 as GameTime;

export function resetLoop(
  state: NarrativeEngineState,
  startSceneId: SceneId,
  startLocationId: LocationId,
): NarrativeEngineState {
  return {
    persistent: {
      ...state.persistent,
      loopCount: state.persistent.loopCount + 1,
    },
    volatile: {
      time: LOOP_START_TIME,
      currentSceneId: startSceneId,
      currentLocationId: startLocationId,
      visitedSceneIds: [],
      itemIds: [],
      flags: {},
    },
  };
}
