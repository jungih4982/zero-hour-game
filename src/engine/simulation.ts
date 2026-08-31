import {
  CLUE_302_OCCUPIED,
  CLUE_B1_MAP,
  CLUE_FIRST_PHONE,
  CLUE_SECOND_PHONE,
  CLUE_WRISTBAND_DOB,
  FIRST_DEATH_ID,
  FLAG_FIRST_DEATH_AVOIDED,
  FLAG_YUJIN_WARY,
  LOCATION_B1_OPERATIONS_CORRIDOR,
  LOCATION_MOUNTAIN_ROAD,
  MEMORY_BLACKOUT_0000,
  MEMORY_RESET_WATCH,
  ITEM_SECOND_PHONE,
  SCENE_CH00_ENTRANCE,
  SCENE_FIRST_DEATH,
  SCENE_LOOP2_PHONE_PARADOX,
  SCENE_LOOP2_RESET_AWAKENING,
  SCENE_VERTICAL_SLICE_END,
  SCENE_VERTICAL_SLICE_TITLE,
  prologueScenes,
} from '../content/prologue';
import { getAvailableChoices } from './choices';
import { applyEffects } from './effects';
import { DEDUCTION_BLACKOUT_ROUTE } from '../gameplay/deductions';
import {
  investigationFlag,
  sceneInvestigations,
} from '../gameplay/investigation';
import { LOOP_START_TIME, resetLoop } from './loop';
import type { NarrativeEngineState } from './types';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Prologue simulation failed: ${message}`);
}

function choose(state: NarrativeEngineState, choiceId: string): NarrativeEngineState {
  const scene = prologueScenes[state.volatile.currentSceneId];
  const choice = getAvailableChoices(scene, state).find((candidate) => candidate.id === choiceId);
  assert(choice !== undefined, `${choiceId} must be available in ${scene.id}`);
  const afterChoice = applyEffects(state, choice.effects);
  const nextScene = prologueScenes[afterChoice.volatile.currentSceneId];
  return applyEffects(afterChoice, nextScene.onEnter ?? []);
}

export type PrologueSimulationResult = {
  loop1SceneCount: number;
  loop2SceneCount: number;
  retainedMemoryCount: number;
  firstDeathRecorded: boolean;
  titleAppearsAfterReset: boolean;
  yujinForeknowledgeBackfires: boolean;
  b1RouteUnlocked: boolean;
  firstDeathAvoided: boolean;
  twoPhoneParadoxReached: boolean;
  verticalSliceCompleted: boolean;
};

export function runPrologueSimulation(): PrologueSimulationResult {
  let state: NarrativeEngineState = {
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
      visitedSceneIds: [],
      itemIds: [],
      flags: {},
    },
  };

  const loop1Route = [
    'KEEP_SEOYUN_TALKING',
    'ASK_ABOUT_OTHER_CALLS',
    'CONTINUE_TO_BAEKYA',
    'ENTER_HOSPITAL_GROUNDS',
    'APPROACH_RECEPTION',
    'WAIT_FOR_SEARCH_RESULT',
    'QUESTION_THE_DENIAL',
    'READ_SEOYUN_WARNING',
    'GO_TO_THIRD_FLOOR',
    'ASK_NURSE_ABOUT_302',
    'ENTER_ROOM_302_LOOP1',
    'CHECK_WRISTBAND',
    'LEAVE_WRISTBAND_AND_REPLY',
    'LOOK_FOR_EMPLOYEE_DOOR',
    'STAY_UNTIL_BLACKOUT',
    'MOVE_TOWARD_UNLOCKED_DOOR',
  ] as const;

  for (const choiceId of loop1Route) {
    if (choiceId === 'CHECK_WRISTBAND') {
      const investigation = sceneInvestigations[state.volatile.currentSceneId];
      assert(investigation !== undefined, '302 room investigation must exist');
      for (const hotspotId of ['recent-use-traces', 'torn-wristband']) {
        const hotspot = investigation.hotspots.find((entry) => entry.id === hotspotId);
        assert(hotspot !== undefined, `302 ${hotspotId} hotspot must exist`);
        state = applyEffects(state, [
          ...hotspot.effects,
          {
            type: 'setFlag',
            flag: investigationFlag(state.volatile.currentSceneId, hotspot.id),
            value: true,
            scope: 'loop',
          },
        ]);
      }
    }
    state = choose(state, choiceId);
  }

  assert(state.volatile.currentSceneId === SCENE_FIRST_DEATH, 'Loop 1 must end at the first death');
  assert(state.volatile.deathId === FIRST_DEATH_ID, 'the first death must be triggered');
  assert(state.persistent.clueIds.includes(CLUE_B1_MAP), 'arrival must reveal the omitted B1 route');
  assert(state.persistent.clueIds.includes(CLUE_302_OCCUPIED), '302 must contradict Yujin');
  assert(state.persistent.clueIds.includes(CLUE_WRISTBAND_DOB), 'the wristband must match Seo-yoon DOB');
  assert(state.persistent.memories.some((memory) => memory.id === MEMORY_BLACKOUT_0000), 'blackout knowledge must persist');
  assert(state.persistent.memories.some((memory) => memory.id === MEMORY_RESET_WATCH), 'the cracked watch must persist');

  const firstDeathRecorded = state.persistent.deathRecords.some((record) => record.deathId === FIRST_DEATH_ID);
  assert(firstDeathRecorded, 'the first death record must persist');

  state = resetLoop(state, SCENE_LOOP2_RESET_AWAKENING, LOCATION_MOUNTAIN_ROAD);
  assert(state.persistent.loopCount === 2, 'reset must start Loop 2');
  assert(state.persistent.memories.length === 2, 'two confirmed memories must survive reset');

  state = choose(state, 'RECOGNIZE_RESET');
  const titleAppearsAfterReset = state.volatile.currentSceneId === SCENE_VERTICAL_SLICE_TITLE;
  assert(titleAppearsAfterReset, 'the title must appear after death and reset recognition');

  state = choose(state, 'CONTINUE_AFTER_TITLE');
  state = choose(state, 'DO_NOT_EXPLAIN_LOOP_YET');
  state = choose(state, 'TAKE_FIRST_PHONE');
  state = choose(state, 'ANSWER_ON_OWN_PHONE');
  assert(state.volatile.currentSceneId === SCENE_LOOP2_PHONE_PARADOX, 'Loop 2 must find the first phone before B1');
  assert(state.persistent.clueIds.includes(CLUE_FIRST_PHONE), 'the first duplicate phone clue must be recorded');

  const minimalDisclosure = choose(state, 'TELL_YUJIN_ONLY_PHONE_FACT');
  assert(minimalDisclosure.volatile.flags[FLAG_YUJIN_WARY] !== true, 'minimal disclosure must not trigger the exact-knowledge penalty');

  state = choose(state, 'REVEAL_EXACT_FOREKNOWLEDGE');
  const yujinForeknowledgeBackfires = state.volatile.flags[FLAG_YUJIN_WARY] === true;
  assert(yujinForeknowledgeBackfires, 'revealing exact future knowledge must make Yujin wary');
  state = applyEffects(state, [
    { type: 'gainDeduction', deductionId: DEDUCTION_BLACKOUT_ROUTE },
  ]);

  const loop2Route = [
    'GO_TO_STAFF_DOOR_AFTER_BACKFIRE',
    'WAIT_FOR_KNOWN_BLACKOUT',
    'ENTER_B1',
    'ASK_SEA_ABOUT_SEOYUN',
    'FACE_TAEJUN_IN_B1',
    'RETURN_UPSTAIRS_WITH_TAEJUN',
    'RETURN_TO_302_FOR_SECOND_PHONE',
    'CALL_BOTH_SEOYUN_PHONES',
    'KEEP_SECOND_PHONE',
  ] as const;

  let b1RouteUnlocked = false;
  for (const choiceId of loop2Route) {
    if (choiceId === 'ASK_SEA_ABOUT_SEOYUN') {
      const investigation = sceneInvestigations[state.volatile.currentSceneId];
      const hotspot = investigation?.hotspots.find((entry) => entry.id === 'linen-room');
      assert(hotspot !== undefined, 'B1 linen room hotspot must exist');
      state = applyEffects(state, [
        ...hotspot.effects,
        {
          type: 'setFlag',
          flag: investigationFlag(state.volatile.currentSceneId, hotspot.id),
          value: true,
          scope: 'loop',
        },
      ]);
    }
    state = choose(state, choiceId);
    if (choiceId === 'ENTER_B1') {
      b1RouteUnlocked = state.volatile.currentLocationId === LOCATION_B1_OPERATIONS_CORRIDOR;
    }
  }

  const firstDeathAvoided = state.volatile.flags[FLAG_FIRST_DEATH_AVOIDED] === true && state.volatile.deathId === undefined;
  const twoPhoneParadoxReached = state.persistent.clueIds.includes(CLUE_FIRST_PHONE) && state.persistent.clueIds.includes(CLUE_SECOND_PHONE);
  const verticalSliceCompleted = state.volatile.currentSceneId === SCENE_VERTICAL_SLICE_END;

  assert(b1RouteUnlocked, 'Loop 2 must use blackout knowledge to enter B1');
  assert(firstDeathAvoided, 'Loop 2 must use blackout knowledge without dying');
  assert(twoPhoneParadoxReached, 'Loop 2 must reach the two-phone contradiction');
  assert(state.volatile.itemIds.includes(ITEM_SECOND_PHONE), 'the second phone must remain as carried evidence');
  assert(verticalSliceCompleted, 'the vertical slice must end after Seo-yoon acknowledges both phones');
  assert(
    prologueScenes[state.volatile.currentSceneId].locationId !== LOCATION_B1_OPERATIONS_CORRIDOR,
    'the ending must return to the Seo-yoon search rather than stop at Sea',
  );

  return {
    loop1SceneCount: loop1Route.length + 1,
    loop2SceneCount: loop2Route.length + 6,
    retainedMemoryCount: state.persistent.memories.length,
    firstDeathRecorded,
    titleAppearsAfterReset,
    yujinForeknowledgeBackfires,
    b1RouteUnlocked,
    firstDeathAvoided,
    twoPhoneParadoxReached,
    verticalSliceCompleted,
  };
}
