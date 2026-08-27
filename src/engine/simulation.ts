import {
  FIRST_DEATH_ID,
  LOCATION_1F_LOBBY,
  MEMORY_BLACKOUT_0000,
  SCENE_CH00_ENTRANCE,
  SCENE_CH00_FIRST_ANOMALY,
  SCENE_CH00_MESSAGE,
  SCENE_CH00_YUJIN_DENIAL,
  SCENE_CH00_YUJIN_FIRST,
  SCENE_FIRST_DEATH,
  prologueScenes,
} from '../content/prologue';
import { getAvailableChoices } from './choices';
import { applyEffects } from './effects';
import { LOOP_START_TIME, resetLoop } from './loop';
import type { ItemId, NarrativeEngineState } from './types';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Prologue simulation failed: ${message}`);
  }
}

function choose(
  state: NarrativeEngineState,
  choiceId: string,
): NarrativeEngineState {
  const scene = prologueScenes[state.volatile.currentSceneId];
  const choice = getAvailableChoices(scene, state).find(
    (candidate) => candidate.id === choiceId,
  );
  assert(choice !== undefined, `${choiceId} must be available`);
  return applyEffects(state, choice.effects);
}

export type PrologueSimulationResult = {
  loop1ChoiceKinds: readonly string[];
  loop2ChoiceKinds: readonly string[];
  retainedMemoryCount: number;
  retainedDeathRecordCount: number;
};

export function runPrologueSimulation(): PrologueSimulationResult {
  const initialState: NarrativeEngineState = {
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
      currentLocationId: LOCATION_1F_LOBBY,
      visitedSceneIds: [],
      itemIds: ['TEMPORARY_KEY' as ItemId],
      flags: { temporaryTestFlag: true },
    },
  };

  const atYujinLoop1 = choose(initialState, 'APPROACH_RECEPTION');
  const yujinScene = prologueScenes[SCENE_CH00_YUJIN_FIRST];
  const loop1Choices = getAvailableChoices(yujinScene, atYujinLoop1);
  assert(
    !loop1Choices.some((choice) => choice.kind === 'foreknowledge'),
    'Loop 1 must not expose the Foreknowledge choice',
  );

  const atDenial = choose(atYujinLoop1, 'NAME_SEOYUN');
  assert(
    atDenial.volatile.currentSceneId === SCENE_CH00_YUJIN_DENIAL,
    'the route must reach Yujin denial',
  );
  const atMessage = choose(atDenial, 'SHOW_SEOYUN_MESSAGE');
  assert(
    atMessage.volatile.currentSceneId === SCENE_CH00_MESSAGE,
    'the route must reach Seo-yoon message',
  );
  const atAnomaly = choose(atMessage, 'CHECK_SCHEDULED_TIME');
  assert(
    atAnomaly.volatile.currentSceneId === SCENE_CH00_FIRST_ANOMALY,
    'the route must reach the first anomaly',
  );
  const atBlackout = choose(atAnomaly, 'WAIT_FOR_YUJIN');
  const atDeathScene = choose(atBlackout, 'MOVE_IN_DARKNESS');
  assert(
    atDeathScene.volatile.currentSceneId === SCENE_FIRST_DEATH,
    'the Loop 1 route must reach the first death scene',
  );

  const deathScene = prologueScenes[SCENE_FIRST_DEATH];
  const afterDeath = applyEffects(atDeathScene, deathScene.onEnter ?? []);
  assert(
    afterDeath.persistent.memories.some(
      (memory) => memory.id === MEMORY_BLACKOUT_0000,
    ),
    'the blackout memory must persist after death',
  );
  assert(
    afterDeath.persistent.deathRecords.some(
      (record) => record.deathId === FIRST_DEATH_ID,
    ),
    'the first death must be recorded',
  );

  const loop2State = resetLoop(
    afterDeath,
    SCENE_CH00_ENTRANCE,
    LOCATION_1F_LOBBY,
  );
  assert(loop2State.persistent.loopCount === 2, 'reset must start Loop 2');
  assert(loop2State.persistent.memories.length === 1, 'memory must survive reset');
  assert(loop2State.volatile.itemIds.length === 0, 'items must reset');
  assert(
    Object.keys(loop2State.volatile.flags).length === 0,
    'loop flags must reset',
  );
  assert(loop2State.volatile.time === LOOP_START_TIME, 'time must reset to 22:00');

  const atYujinLoop2 = choose(loop2State, 'APPROACH_RECEPTION');
  const loop2Choices = getAvailableChoices(yujinScene, atYujinLoop2);
  assert(
    loop2Choices.some((choice) => choice.kind === 'foreknowledge'),
    'Loop 2 must expose the Foreknowledge choice',
  );

  return {
    loop1ChoiceKinds: loop1Choices.map((choice) => choice.kind),
    loop2ChoiceKinds: loop2Choices.map((choice) => choice.kind),
    retainedMemoryCount: loop2State.persistent.memories.length,
    retainedDeathRecordCount: loop2State.persistent.deathRecords.length,
  };
}
