import type { LocationId, NarrativeEngineState, NarrativeScene, SceneId } from '../engine';
import {
  SCENE_CH3_BAND_REQUEST,
  SCENE_CH3_RESET_2123,
  chapter3Scenes,
} from './chapter3';
import {
  LOCATION_CAR,
  SCENE_CHAPTER02_END,
  SCENE_LOOP2_RESET_AWAKENING,
  prologueScenes,
} from './prologue';

const chapter2End = prologueScenes[SCENE_CHAPTER02_END];

export const storyScenes: Readonly<Record<string, NarrativeScene>> = {
  ...prologueScenes,
  [SCENE_CHAPTER02_END]: {
    ...chapter2End,
    choices: [{
      id: 'BEGIN_CHAPTER_3',
      text: '세 사람에게 같은 질문을 시작한다.',
      kind: 'standard',
      effects: [{ type: 'jumpScene', sceneId: SCENE_CH3_BAND_REQUEST }],
    }],
  },
  ...chapter3Scenes,
};

export type LoopResetTarget = {
  sceneId: SceneId;
  locationId: LocationId;
};

export function getLoopResetTarget(state: NarrativeEngineState): LoopResetTarget {
  const learned0106 = state.persistent.memories.some(
    (memory) => memory.id === 'MEMORY_0106_SEAL',
  );
  return learned0106
    ? { sceneId: SCENE_CH3_RESET_2123, locationId: LOCATION_CAR }
    : { sceneId: SCENE_LOOP2_RESET_AWAKENING, locationId: LOCATION_CAR };
}
