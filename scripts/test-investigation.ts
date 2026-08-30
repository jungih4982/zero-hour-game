import { prologueScenes, SCENE_LOOP2_OPERATIONS_CORRIDOR, SCENE_LOOP2_SEA_FIRST_MEETING } from '../src/content/prologue';
import { applyEffects, getAvailableChoices, LOOP_START_TIME } from '../src/engine';
import type { NarrativeEngineState } from '../src/engine';
import {
  canInspectHotspot,
  investigationFlag,
  sceneInvestigations,
} from '../src/gameplay/investigation';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Investigation test failed: ${message}`);
}

let state: NarrativeEngineState = {
  persistent: {
    loopCount: 2,
    clueIds: [],
    deductionIds: [],
    memories: [],
    deathIntel: [],
    deathRecords: [],
    flags: {},
  },
  volatile: {
    time: LOOP_START_TIME,
    currentSceneId: SCENE_LOOP2_OPERATIONS_CORRIDOR,
    currentLocationId: prologueScenes[SCENE_LOOP2_OPERATIONS_CORRIDOR].locationId,
    visitedSceneIds: [SCENE_LOOP2_OPERATIONS_CORRIDOR],
    itemIds: [],
    flags: {},
  },
};

const investigation = sceneInvestigations[SCENE_LOOP2_OPERATIONS_CORRIDOR];
assert(investigation !== undefined, 'B1 investigation must exist');
assert(getAvailableChoices(prologueScenes[SCENE_LOOP2_OPERATIONS_CORRIDOR], state).length === 0, 'Sea must not be found before inspecting the corridor');

function inspect(current: NarrativeEngineState, hotspotId: string) {
  const hotspot = investigation.hotspots.find((entry) => entry.id === hotspotId);
  assert(hotspot !== undefined, `missing hotspot: ${hotspotId}`);
  assert(canInspectHotspot(current, investigation, hotspot), `${hotspotId} must be inspectable`);
  return applyEffects(current, [
    ...hotspot.effects,
    {
      type: 'setFlag',
      flag: investigationFlag(SCENE_LOOP2_OPERATIONS_CORRIDOR, hotspot.id),
      value: true,
      scope: 'loop',
    },
  ]);
}

const unmarkedRooms = investigation.hotspots.find((hotspot) => hotspot.id === 'unmarked-doors');
const transferTracks = investigation.hotspots.find((hotspot) => hotspot.id === 'linen-carts');
const linenRoom = investigation.hotspots.find((hotspot) => hotspot.id === 'linen-room');
assert(unmarkedRooms !== undefined && transferTracks !== undefined && linenRoom !== undefined, 'all B1 hotspots must exist');

let facilityRoute = inspect(state, 'unmarked-doors');
assert(!canInspectHotspot(facilityRoute, investigation, transferTracks), 'one optional search must close the competing route clue');
assert(canInspectHotspot(facilityRoute, investigation, linenRoom), 'the required linen-room discovery must remain available');
facilityRoute = inspect(facilityRoute, 'linen-room');

const facilityEnterSea = getAvailableChoices(
  prologueScenes[SCENE_LOOP2_OPERATIONS_CORRIDOR],
  facilityRoute,
).find((choice) => choice.id === 'ASK_SEA_ABOUT_SEOYUN');
assert(facilityEnterSea !== undefined, 'linen room inspection must reveal Sea');
facilityRoute = applyEffects(facilityRoute, facilityEnterSea.effects);
const facilityChoices = getAvailableChoices(prologueScenes[SCENE_LOOP2_SEA_FIRST_MEETING], facilityRoute);
assert(facilityChoices.some((choice) => choice.id === 'FACE_TAEJUN_IN_B1'), 'facility clue route must retain direct confrontation');
assert(!facilityChoices.some((choice) => choice.id === 'USE_B1_TRANSFER_ROUTE'), 'facility clue route must trade away the quiet escape');

state = inspect(state, 'linen-carts');
state = inspect(state, 'linen-room');

const enterSea = getAvailableChoices(
  prologueScenes[SCENE_LOOP2_OPERATIONS_CORRIDOR],
  state,
).find((choice) => choice.id === 'ASK_SEA_ABOUT_SEOYUN');
assert(enterSea !== undefined, 'linen room inspection must reveal Sea');
state = applyEffects(state, enterSea.effects);
assert(state.volatile.currentSceneId === SCENE_LOOP2_SEA_FIRST_MEETING, 'Sea scene must follow the linen room discovery');

const seaChoices = getAvailableChoices(prologueScenes[SCENE_LOOP2_SEA_FIRST_MEETING], state);
assert(seaChoices.some((choice) => choice.id === 'FACE_TAEJUN_IN_B1'), 'direct confrontation route must remain');
assert(seaChoices.some((choice) => choice.id === 'USE_B1_TRANSFER_ROUTE'), 'transfer-track investigation must unlock the quiet escape route');

console.log('B1 investigation trade-off and optional escape route passed.');
