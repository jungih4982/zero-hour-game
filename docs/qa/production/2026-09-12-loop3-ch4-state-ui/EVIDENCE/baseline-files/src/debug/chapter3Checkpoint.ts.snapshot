import type { NarrativeEngineState } from '../engine';
import { SCENE_CH3_BAND_REQUEST } from '../content/chapter3';
import {
  blackoutMemory, resetWatchMemory, firstDeathIntel, FIRST_DEATH_ID,
  SCENE_FIRST_DEATH, SCENE_CHAPTER02_END, LOCATION_1F_LOBBY,
  CLUE_WRISTBAND_DOB, CLUE_FIRST_PHONE, CLUE_SECOND_PHONE,
  CLUE_CCTV_GAP, CLUE_06_CARD, CLUE_OLD_302_PASSAGE,
  ITEM_SECOND_PHONE, ITEM_OLD_MAP_PHOTO, FLAG_TAEJUN_SAW_PHONE,
} from '../content/prologue';

// Explicit developer checkpoint, never enabled in a release build. Its storage
// and preferences keys are separate from the player's existing save.
export const chapter3QaVariant = typeof __DEV__ !== 'undefined' && __DEV__
  ? process.env.EXPO_PUBLIC_QA_CH3
  : undefined;
export const isChapter3Qa = chapter3QaVariant === 'phone-shown'
  || chapter3QaVariant === 'phone-hidden';

export function createChapter3Checkpoint(): NarrativeEngineState {
  return {
    persistent: {
      loopCount: 2,
      clueIds: [CLUE_WRISTBAND_DOB, CLUE_FIRST_PHONE, CLUE_SECOND_PHONE, CLUE_CCTV_GAP, CLUE_06_CARD, CLUE_OLD_302_PASSAGE],
      deductionIds: [],
      memories: [blackoutMemory, resetWatchMemory],
      deathIntel: [firstDeathIntel],
      deathRecords: [{ deathId: FIRST_DEATH_ID, loopCount: 1, time: 157 as NarrativeEngineState['volatile']['time'], sceneId: SCENE_FIRST_DEATH }],
      flags: {},
    },
    volatile: {
      time: 184 as NarrativeEngineState['volatile']['time'],
      currentSceneId: SCENE_CH3_BAND_REQUEST,
      currentLocationId: LOCATION_1F_LOBBY,
      visitedSceneIds: [SCENE_CHAPTER02_END, SCENE_CH3_BAND_REQUEST],
      itemIds: [ITEM_SECOND_PHONE, ITEM_OLD_MAP_PHOTO],
      flags: chapter3QaVariant === 'phone-shown' ? { [FLAG_TAEJUN_SAW_PHONE]: true } : {},
    },
  };
}
