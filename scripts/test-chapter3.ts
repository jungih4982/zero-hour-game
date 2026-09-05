import assert from 'node:assert/strict';
import {
  DEDUCTION_SPACE_NOT_ALIGNED,
  FLAG_0106_AVOIDANCE_PLANNED,
  FLAG_BAND_CUSTODY_PLAYER,
  FLAG_BAND_CUSTODY_YUJIN,
  MEMORY_0106_SEAL,
  SCENE_CH3_0106_SOLO,
  SCENE_CH3_0106_TAEJUN,
  SCENE_CH3_0106_YUJIN,
  SCENE_CH3_MISSING_WORKER,
  SCENE_CH3_THREE_TESTIMONIES,
  SCENE_CH3_TRANSFER_SOLO,
  SCENE_CH3_TRANSFER_TAEJUN,
  SCENE_CH3_TRANSFER_YUJIN,
  SCENE_CH4_MILESTONE_A_END,
  SCENE_CH4_OPENING,
  SECOND_DEATH_ID,
  CLUE_0106_CARD_READER,
  CLUE_0106_RADIO_RESPONSE,
  CLUE_06_B2_LABEL,
  spaceNotAlignedDeduction,
} from '../src/content/chapter3';
import {
  CLUE_06_CARD,
  FLAG_TAEJUN_SAW_PHONE,
  LOCATION_1F_LOBBY,
  SCENE_CHAPTER02_END,
} from '../src/content/prologue';
import { getLoopResetTarget, storyScenes } from '../src/content/story';
import {
  applyEffects,
  getAvailableChoices,
  resetLoop,
  type NarrativeEngineState,
  type SceneId,
} from '../src/engine';
import {
  investigationFlag,
  sceneInvestigations,
} from '../src/gameplay/investigation';
import { canFormDeduction, isCorrectDeductionConnection } from '../src/gameplay/deductions';
import { getActionTimeCost } from '../src/gameplay/gameClock';

type Route = 'yujin' | 'taejun' | 'solo';

function createState(route: Route): NarrativeEngineState {
  return {
    persistent: {
      loopCount: 2,
      clueIds: [CLUE_06_CARD],
      deductionIds: [],
      memories: [],
      deathIntel: [],
      deathRecords: [],
      flags: {},
    },
    volatile: {
      time: 170 as NarrativeEngineState['volatile']['time'],
      currentSceneId: SCENE_CHAPTER02_END,
      currentLocationId: LOCATION_1F_LOBBY,
      visitedSceneIds: [SCENE_CHAPTER02_END],
      itemIds: [],
      flags: route === 'taejun' ? { [FLAG_TAEJUN_SAW_PHONE]: true } : {},
    },
  };
}

function enterScene(state: NarrativeEngineState): NarrativeEngineState {
  const scene = storyScenes[state.volatile.currentSceneId];
  const entered = applyEffects(state, scene.onEnter ?? []);
  return entered.volatile.visitedSceneIds.includes(scene.id)
    ? entered
    : {
        ...entered,
        volatile: {
          ...entered.volatile,
          visitedSceneIds: [...entered.volatile.visitedSceneIds, scene.id],
        },
      };
}

function choose(state: NarrativeEngineState, choiceId: string): NarrativeEngineState {
  const scene = storyScenes[state.volatile.currentSceneId];
  const choice = getAvailableChoices(scene, state).find((entry) => entry.id === choiceId);
  assert(choice, `${choiceId} must be available in ${scene.id}`);
  return enterScene(applyEffects(state, choice.effects));
}

function inspect(
  state: NarrativeEngineState,
  sceneId: SceneId,
  hotspotId: string,
): NarrativeEngineState {
  const investigation = sceneInvestigations[sceneId];
  const hotspot = investigation.hotspots.find((entry) => entry.id === hotspotId);
  assert(hotspot, `${hotspotId} must exist in ${sceneId}`);
  return applyEffects(state, [
    ...hotspot.effects,
    {
      type: 'setFlag',
      flag: investigationFlag(sceneId, hotspotId),
      value: true,
      scope: 'loop',
    },
  ]);
}

function runRoute(route: Route, lastCheck: 'CARD' | 'RADIO' | 'LABEL', discloseDeath: boolean, inspections: readonly string[]): NarrativeEngineState {
  let state = createState(route);
  state = choose(state, 'BEGIN_CHAPTER_3');
  assert.equal(state.volatile.time, 184, 'CH3 must begin at 00:27 from the 21:23 anchor');

  state = choose(state, route === 'yujin'
    ? 'CH3_BAND_TO_YUJIN'
    : route === 'taejun'
      ? 'CH3_BAND_SHOW_TAEJUN'
      : 'CH3_BAND_KEEP_ORIGINAL');
  state = choose(state, route === 'yujin'
    ? 'CH3_ASK_SAME_QUESTION_Y'
    : route === 'taejun'
      ? 'CH3_ASK_SAME_QUESTION_T'
      : 'CH3_ASK_SAME_QUESTION_P');

  assert.equal(state.volatile.currentSceneId, SCENE_CH3_THREE_TESTIMONIES);
  assert.equal(getAvailableChoices(storyScenes[state.volatile.currentSceneId], state).length, 0);
  assert.equal(canFormDeduction(state, spaceNotAlignedDeduction), false);
  for (const hotspotId of ['yujin-testimony', 'taejun-testimony', 'minseo-testimony']) {
    state = inspect(state, SCENE_CH3_THREE_TESTIMONIES, hotspotId);
  }
  assert.equal(canFormDeduction(state, spaceNotAlignedDeduction), true);
  assert.equal(isCorrectDeductionConnection(spaceNotAlignedDeduction, [CLUE_06_CARD]), false);
  assert.equal(isCorrectDeductionConnection(spaceNotAlignedDeduction, spaceNotAlignedDeduction.facts.map(fact => fact.sourceId)), true);
  state = applyEffects(state, [{ type: 'gainDeduction', deductionId: DEDUCTION_SPACE_NOT_ALIGNED }]);
  state = choose(state, 'CH3_USE_SPACE_DEDUCTION');
  state = choose(state, discloseDeath ? 'CH3_DISCLOSE_FIRST_DEATH' : 'CH3_SHOW_WATCH_ONLY');
  state = choose(state, discloseDeath ? 'CH3_FIND_MISSING_CARD_D' : 'CH3_FIND_MISSING_CARD_W');
  assert.equal(state.volatile.time, 193, 'the call must take place at 00:36');
  state = choose(state, 'CH3_CALL_MISSING_WORKER');
  assert.equal(state.volatile.currentSceneId, SCENE_CH3_MISSING_WORKER);

  state = choose(state, route === 'yujin'
    ? 'CH3_ENTER_B1_WITH_YUJIN'
    : route === 'taejun'
      ? 'CH3_ENTER_B1_WITH_TAEJUN'
      : 'CH3_ENTER_B1_SOLO');
  state = choose(state, route === 'yujin'
    ? 'CH3_OPEN_TRANSFER_Y'
    : route === 'taejun'
      ? 'CH3_OPEN_TRANSFER_T'
      : 'CH3_OPEN_TRANSFER_S');

  const transferScene = route === 'yujin'
    ? SCENE_CH3_TRANSFER_YUJIN
    : route === 'taejun'
      ? SCENE_CH3_TRANSFER_TAEJUN
      : SCENE_CH3_TRANSFER_SOLO;
  state = inspect(state, transferScene, inspections[0]);
  assert.equal(
    getAvailableChoices(storyScenes[transferScene], state).length,
    0,
    'one B1 inspection must not unlock the fixed event',
  );
  for (const hotspotId of inspections.slice(1)) state = inspect(state, transferScene, hotspotId);
  const ledgerChoice = getAvailableChoices(storyScenes[transferScene], state)[0];
  assert.equal(getActionTimeCost(ledgerChoice.effects, state.volatile.time), 223 - state.volatile.time);
  state = choose(state, route === 'yujin'
    ? 'CH3_READ_LEDGER_Y'
    : route === 'taejun'
      ? 'CH3_READ_LEDGER_T'
      : 'CH3_READ_LEDGER_S');

  assert.equal(
    state.volatile.currentSceneId,
    route === 'yujin'
      ? SCENE_CH3_0106_YUJIN
      : route === 'taejun'
        ? SCENE_CH3_0106_TAEJUN
        : SCENE_CH3_0106_SOLO,
  );
  assert.equal(state.volatile.time, 223, 'the transfer room must seal at 01:06');

  state = choose(state, route === 'yujin'
    ? `CH3_LAST_CHECK_${lastCheck}_Y`
    : route === 'taejun'
      ? `CH3_LAST_CHECK_${lastCheck}_T`
      : `CH3_LAST_CHECK_${lastCheck}_S`);
  state = choose(state, route === 'yujin'
    ? `CH3_DIE_AFTER_${lastCheck}_Y`
    : route === 'taejun'
      ? `CH3_DIE_AFTER_${lastCheck}_T`
      : `CH3_DIE_AFTER_${lastCheck}_S`);

  for (const [branch, clueId] of [['CARD', CLUE_0106_CARD_READER], ['RADIO', CLUE_0106_RADIO_RESPONSE], ['LABEL', CLUE_06_B2_LABEL]] as const) {
    assert.equal(state.persistent.clueIds.includes(clueId), branch === lastCheck, 'unseen last-check evidence must not leak into another branch');
  }

  assert.equal(state.volatile.deathId, SECOND_DEATH_ID);
  assert(state.persistent.memories.some((memory) => memory.id === MEMORY_0106_SEAL));
  assert(state.persistent.deathRecords.some((record) =>
    record.deathId === SECOND_DEATH_ID && record.time === 223));
  assert.equal(
    state.persistent.flags[route === 'yujin' ? FLAG_BAND_CUSTODY_YUJIN : FLAG_BAND_CUSTODY_PLAYER],
    true,
  );

  const target = getLoopResetTarget(state);
  state = enterScene(resetLoop(state, target.sceneId, target.locationId));
  assert.equal(state.persistent.loopCount, 3);
  assert.equal(state.volatile.itemIds.length, 0, 'physical evidence must remain in the abandoned instance');
  assert.deepEqual(state.volatile.flags, {}, 'NPC cooperation and physical ownership must reset');
  const withoutMemory = { ...state, persistent: { ...state.persistent, memories: [] } };
  assert.equal(getAvailableChoices(storyScenes[state.volatile.currentSceneId], withoutMemory).length, 0, 'unexperienced Foreknowledge must stay locked');
  state = choose(state, 'USE_MEMORY_0106_SEAL');
  assert.equal(state.volatile.currentSceneId, SCENE_CH4_OPENING);
  assert.equal(state.volatile.flags[FLAG_0106_AVOIDANCE_PLANNED], true);
  state = choose(state, 'CH4_SET_LOOP_GOAL');
  assert.equal(state.volatile.currentSceneId, SCENE_CH4_MILESTONE_A_END);
  return state;
}

const spots = ['card-06', 'shelf-06', 'transfer-ledger', 'sealed-vent', 'opposite-wall'];
const inspectionSets = spots.flatMap((first, index) => spots.slice(index + 1).map(second => [first, second]));
inspectionSets.push(spots);
let routeCount = 0;
for (const route of ['yujin', 'taejun', 'solo'] as const)
  for (const lastCheck of ['CARD', 'RADIO', 'LABEL'] as const)
    for (const discloseDeath of [false, true])
      for (const inspections of inspectionSets) {
        runRoute(route, lastCheck, discloseDeath, inspections);
        routeCount++;
      }

console.log(`CH3 ${routeCount} routes passed: custody, disclosure, inspection pairs/all, exclusive evidence, 01:06, and Loop 3 memory use.`);
