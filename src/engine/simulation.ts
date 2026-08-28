import {
  CLUE_302_MATCHING_DOB,
  CLUE_302_OCCUPIED,
  CLUE_SERVICE_CORRIDOR_LOG,
  CLUE_WRISTBAND_06,
  CLUE_YUJIN_CALL,
  FLAG_YUJIN_WARY,
  FLAG_CONVERSATION_COMPRESSED,
  FLAG_FIRST_DEATH_AVOIDED,
  FIRST_DEATH_ID,
  LOCATION_1F_LOBBY,
  LOCATION_B1_SERVICE_CORRIDOR,
  MEMORY_BLACKOUT_0000,
  SCENE_CH00_ENTRANCE,
  SCENE_CH00_FIRST_ANOMALY,
  SCENE_CH00_MESSAGE,
  SCENE_CH00_YUJIN_DENIAL,
  SCENE_CH00_YUJIN_FIRST,
  SCENE_CH01_CALL_BELL_2252,
  SCENE_FIRST_DEATH,
  SCENE_LOOP2_BLACKOUT_INTERVENTION,
  SCENE_LOOP2_SERVICE_CORRIDOR,
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
  routeClueCounts: Readonly<Record<'A' | 'B' | 'C' | 'D', number>>;
  room302ChoiceUnlocked: boolean;
  yujinInterventionMinutes: number;
  loop2ConversationMinutes: number;
  loop2TimeSavedMinutes: number;
  loop2NewRouteUnlocked: boolean;
  loop2FirstDeathAvoided: boolean;
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
  const atDecision = choose(atAnomaly, 'RECHECK_DISAPPEARED_RECORD');

  const routeAResult = choose(atDecision, 'INVESTIGATE_RECORDS');
  const routeBResult = choose(atDecision, 'INVESTIGATE_WEST_WARD');
  const routeBWristband = choose(routeBResult, 'CHECK_WRISTBAND');
  const routeCWatch = choose(atDecision, 'WATCH_YUJIN');
  const routeCResult = choose(routeCWatch, 'FOLLOW_YUJIN');
  const routeDResult = choose(atDecision, 'CONFRONT_YUJIN');
  const routeClueIds = [
    CLUE_302_MATCHING_DOB,
    CLUE_302_OCCUPIED,
    CLUE_WRISTBAND_06,
    CLUE_YUJIN_CALL,
  ] as const;
  const countRouteClues = (state: NarrativeEngineState) =>
    routeClueIds.filter((clueId) => state.persistent.clueIds.includes(clueId))
      .length;
  const routeClueCounts = {
    A: countRouteClues(routeAResult),
    B: countRouteClues(routeBWristband),
    C: countRouteClues(routeCResult),
    D: countRouteClues(routeDResult),
  };
  assert(
    routeAResult.persistent.clueIds.includes(CLUE_302_MATCHING_DOB),
    'Route A must award the matching date-of-birth clue',
  );
  assert(
    routeBResult.persistent.clueIds.includes(CLUE_302_OCCUPIED),
    'Route B must award the room 302 clue',
  );
  assert(
    routeBWristband.persistent.clueIds.includes(CLUE_WRISTBAND_06),
    'Route B must award the wristband clue when it is inspected',
  );
  assert(
    routeCResult.persistent.clueIds.includes(CLUE_YUJIN_CALL),
    'Route C must award the Yujin call clue',
  );
  assert(
    routeClueCounts.A === 1 &&
      routeClueCounts.B === 2 &&
      routeClueCounts.C === 1 &&
      routeClueCounts.D === 0,
    'routes must remain mutually exclusive and award only their own clues',
  );
  assert(
    routeDResult.volatile.flags[FLAG_YUJIN_WARY] === true,
    'Route D must make Yujin wary for the current loop',
  );

  const routeABell = choose(
    choose(routeAResult, 'MEMORIZE_RECORD_DETAILS'),
    'LEAVE_LOCKED_TERMINAL',
  );
  const beforeInterventionTime = routeBWristband.volatile.time;
  const routeBBell = choose(routeBWristband, 'COMPLY_WITH_YUJIN');
  const yujinInterventionMinutes =
    routeBBell.volatile.time - beforeInterventionTime;
  assert(
    yujinInterventionMinutes === 18 &&
      routeBBell.volatile.flags[FLAG_YUJIN_WARY] === true,
    'Yujin intervention must return the player to the lobby and cost 18 minutes',
  );
  assert(
    routeABell.volatile.currentSceneId === SCENE_CH01_CALL_BELL_2252 &&
      routeBBell.volatile.currentSceneId === SCENE_CH01_CALL_BELL_2252,
    'routes must converge at the 22:52 call bell',
  );
  const identifyRoomChoiceId = 'CHALLENGE_EMPTY_ROOM_BELL';
  assert(
    !getAvailableChoices(prologueScenes[SCENE_CH01_CALL_BELL_2252], routeABell)
      .some((choice) => choice.id === identifyRoomChoiceId),
    'the room 302 response must be hidden without its clue',
  );
  const room302ChoiceUnlocked = getAvailableChoices(
    prologueScenes[SCENE_CH01_CALL_BELL_2252],
    routeBBell,
  ).some((choice) => choice.id === identifyRoomChoiceId);
  assert(
    room302ChoiceUnlocked,
    'the room 302 response must appear with its clue',
  );

  const atBellResult = choose(routeABell, 'TELL_YUJIN_ABOUT_BELL');
  const atFixedEvent = choose(
    atBellResult,
    'WAIT_FOR_BROADCAST_AFTER_TELLING',
  );
  const atBlackout = choose(atFixedEvent, 'CONTINUE_TO_ZERO_HOUR');
  const atDeathScene = choose(atBlackout, 'MOVE_IN_DARKNESS');
  assert(
    atDeathScene.volatile.currentSceneId === SCENE_FIRST_DEATH,
    'the Loop 1 route must reach the first death scene',
  );

  const deathScene = prologueScenes[SCENE_FIRST_DEATH];
  const afterDeath = applyEffects(atDeathScene, deathScene.onEnter ?? []);
  assert(
    !afterDeath.persistent.clueIds.includes(CLUE_SERVICE_CORRIDOR_LOG),
    'Loop 1 must not obtain the service corridor clue',
  );
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
  const blackoutKnowledge = afterDeath.persistent.memories.find(
    (memory) => memory.id === MEMORY_BLACKOUT_0000,
  );
  assert(
    blackoutKnowledge?.payoff?.unlocksLocationId ===
      LOCATION_B1_SERVICE_CORRIDOR &&
      blackoutKnowledge.payoff.timeSavedMinutes === 9,
    'the first death memory must describe its route and time payoff',
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

  const beforeCompressedConversation = atYujinLoop2.volatile.time;
  const afterCompressedConversation = choose(
    atYujinLoop2,
    'COMPRESS_REPEATED_YUJIN_CONVERSATION',
  );
  const loop2ConversationMinutes =
    afterCompressedConversation.volatile.time - beforeCompressedConversation;
  const loop2TimeSavedMinutes = 10 - loop2ConversationMinutes;
  assert(
    loop2ConversationMinutes === 1 &&
      loop2TimeSavedMinutes === 9 &&
      afterCompressedConversation.volatile.flags[
        FLAG_CONVERSATION_COMPRESSED
      ] === true,
    'Foreknowledge must compress the repeated conversation and save 9 minutes',
  );

  const atScoutedDoor = choose(
    afterCompressedConversation,
    'SCOUT_SERVICE_DOOR_EARLY',
  );
  const atPreparedDoor = choose(
    atScoutedDoor,
    'PREEMPT_BLACKOUT_AT_SERVICE_DOOR',
  );
  const atKnownBlackout = choose(atPreparedDoor, 'WAIT_FOR_KNOWN_BLACKOUT');
  assert(
    atKnownBlackout.volatile.currentSceneId ===
      SCENE_LOOP2_BLACKOUT_INTERVENTION &&
      atKnownBlackout.volatile.time === (120 as typeof atKnownBlackout.volatile.time) &&
      atKnownBlackout.volatile.deathId === undefined,
    'Loop 2 must preempt the blackout at the service door without dying',
  );
  const inServiceCorridor = choose(atKnownBlackout, 'ENTER_SERVICE_CORRIDOR');
  const loop2NewRouteUnlocked =
    inServiceCorridor.volatile.currentSceneId === SCENE_LOOP2_SERVICE_CORRIDOR &&
    inServiceCorridor.volatile.currentLocationId === LOCATION_B1_SERVICE_CORRIDOR &&
    inServiceCorridor.persistent.clueIds.includes(CLUE_SERVICE_CORRIDOR_LOG);
  const loop2FirstDeathAvoided =
    inServiceCorridor.volatile.flags[FLAG_FIRST_DEATH_AVOIDED] === true &&
    inServiceCorridor.volatile.deathId === undefined;
  assert(
    loop2NewRouteUnlocked,
    'Loop 2 must enter the new service corridor and obtain its clue',
  );
  assert(
    loop2FirstDeathAvoided,
    'the service corridor intervention must avoid the Loop 1 death',
  );

  return {
    loop1ChoiceKinds: loop1Choices.map((choice) => choice.kind),
    loop2ChoiceKinds: loop2Choices.map((choice) => choice.kind),
    retainedMemoryCount: loop2State.persistent.memories.length,
    retainedDeathRecordCount: loop2State.persistent.deathRecords.length,
    routeClueCounts,
    room302ChoiceUnlocked,
    yujinInterventionMinutes,
    loop2ConversationMinutes,
    loop2TimeSavedMinutes,
    loop2NewRouteUnlocked,
    loop2FirstDeathAvoided,
  };
}
