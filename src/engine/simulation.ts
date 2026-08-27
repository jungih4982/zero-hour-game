import {
  FIRST_DEATH_ID,
  LOCATION_1F_LOBBY,
  MEMORY_BLACKOUT_0000,
  SCENE_FIRST_DEATH,
  SCENE_LOBBY_2200,
  prologueScenes,
} from '../content/prologue';
import { getAvailableChoices } from './choices';
import { applyEffects } from './effects';
import { LOOP_START_TIME, resetLoop } from './loop';
import type { ItemId, NarrativeEngineState } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Prologue simulation failed: ${message}`);
  }
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
      currentSceneId: SCENE_LOBBY_2200,
      currentLocationId: LOCATION_1F_LOBBY,
      visitedSceneIds: [],
      itemIds: ['TEMPORARY_KEY' as ItemId],
      flags: { temporaryTestFlag: true },
    },
  };

  const lobby = prologueScenes[SCENE_LOBBY_2200];
  const loop1Choices = getAvailableChoices(lobby, initialState);
  assert(
    !loop1Choices.some((choice) => choice.kind === 'foreknowledge'),
    'Loop 1 must not expose the Foreknowledge choice',
  );

  const afterLobbyChoice = applyEffects(initialState, loop1Choices[0].effects);
  const blackoutScene = prologueScenes[afterLobbyChoice.volatile.currentSceneId];
  const blackoutChoices = getAvailableChoices(blackoutScene, afterLobbyChoice);
  const atDeathScene = applyEffects(
    afterLobbyChoice,
    blackoutChoices[0].effects,
  );
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
    SCENE_LOBBY_2200,
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

  const loop2Choices = getAvailableChoices(lobby, loop2State);
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
