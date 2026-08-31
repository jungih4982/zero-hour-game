import {
  CLUE_302_OCCUPIED,
  prologueScenes,
  SCENE_ACT2_ROOM_CONTRADICTION,
  SCENE_LOOP2_OPERATIONS_CORRIDOR,
  SCENE_LOOP2_SEA_FIRST_MEETING,
} from '../src/content/prologue';
import { applyEffects, getAvailableChoices, LOOP_START_TIME } from '../src/engine';
import type { NarrativeEngineState } from '../src/engine';
import {
  canInspectHotspot,
  investigationFlag,
  sceneInvestigations,
} from '../src/gameplay/investigation';
import { getDialogueBeats } from '../src/ui/dialogueBeats';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Investigation test failed: ${message}`);
}

function createState(sceneId: NarrativeEngineState['volatile']['currentSceneId']): NarrativeEngineState {
  return {
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
    currentSceneId: sceneId,
    currentLocationId: prologueScenes[sceneId].locationId,
    visitedSceneIds: [sceneId],
    itemIds: [],
    flags: {},
  },
  };
}

function inspect(
  current: NarrativeEngineState,
  investigation: NonNullable<(typeof sceneInvestigations)[string]>,
  hotspotId: string,
) {
  const hotspot = investigation.hotspots.find((entry) => entry.id === hotspotId);
  assert(hotspot !== undefined, `missing hotspot: ${hotspotId}`);
  assert(canInspectHotspot(current, investigation, hotspot), `${hotspotId} must be inspectable`);
  return applyEffects(current, [
    ...hotspot.effects,
    {
      type: 'setFlag',
      flag: investigationFlag(investigation.sceneId, hotspot.id),
      value: true,
      scope: 'loop',
    },
  ]);
}

const roomInvestigation = sceneInvestigations[SCENE_ACT2_ROOM_CONTRADICTION];
assert(roomInvestigation !== undefined, '302 investigation must exist');
const roomBeats = getDialogueBeats(prologueScenes[SCENE_ACT2_ROOM_CONTRADICTION]);
const hiddenDiscoveries = roomInvestigation.hiddenDialogueBeatIndices?.map(
  (index) => roomBeats[index]?.text,
) ?? [];
assert(
  hiddenDiscoveries.every((text) => roomInvestigation.hotspots.some((hotspot) => hotspot.discovery === text)),
  'every hidden canonical beat must be revealed verbatim by a 302 hotspot',
);

let hastyRoomRoute = createState(SCENE_ACT2_ROOM_CONTRADICTION);
assert(
  getAvailableChoices(prologueScenes[SCENE_ACT2_ROOM_CONTRADICTION], hastyRoomRoute).length === 0,
  'the wristband action must stay locked before it is found',
);
hastyRoomRoute = inspect(hastyRoomRoute, roomInvestigation, 'torn-wristband');
assert(
  getAvailableChoices(prologueScenes[SCENE_ACT2_ROOM_CONTRADICTION], hastyRoomRoute)
    .some((choice) => choice.id === 'CHECK_WRISTBAND'),
  'finding the wristband must unlock the exit action',
);
assert(
  !hastyRoomRoute.persistent.clueIds.includes(CLUE_302_OCCUPIED),
  'leaving as soon as the wristband is found must miss the occupied-room clue',
);

let thoroughRoomRoute = createState(SCENE_ACT2_ROOM_CONTRADICTION);
thoroughRoomRoute = inspect(thoroughRoomRoute, roomInvestigation, 'recent-use-traces');
thoroughRoomRoute = inspect(thoroughRoomRoute, roomInvestigation, 'torn-wristband');
assert(
  thoroughRoomRoute.persistent.clueIds.includes(CLUE_302_OCCUPIED),
  'checking the room use traces must record the occupied-room contradiction',
);
assert(
  getAvailableChoices(prologueScenes[SCENE_ACT2_ROOM_CONTRADICTION], thoroughRoomRoute)
    .some((choice) => choice.id === 'CHECK_WRISTBAND'),
  'the thorough route must still allow the wristband action',
);

let state = createState(SCENE_LOOP2_OPERATIONS_CORRIDOR);
const investigation = sceneInvestigations[SCENE_LOOP2_OPERATIONS_CORRIDOR];
assert(investigation !== undefined, 'B1 investigation must exist');
assert(getAvailableChoices(prologueScenes[SCENE_LOOP2_OPERATIONS_CORRIDOR], state).length === 0, 'Sea must not be found before inspecting the corridor');

const unmarkedRooms = investigation.hotspots.find((hotspot) => hotspot.id === 'unmarked-doors');
const transferTracks = investigation.hotspots.find((hotspot) => hotspot.id === 'linen-carts');
const linenRoom = investigation.hotspots.find((hotspot) => hotspot.id === 'linen-room');
assert(unmarkedRooms !== undefined && transferTracks !== undefined && linenRoom !== undefined, 'all B1 hotspots must exist');

let facilityRoute = inspect(state, investigation, 'unmarked-doors');
assert(!canInspectHotspot(facilityRoute, investigation, transferTracks), 'one optional search must close the competing route clue');
assert(canInspectHotspot(facilityRoute, investigation, linenRoom), 'the required linen-room discovery must remain available');
facilityRoute = inspect(facilityRoute, investigation, 'linen-room');

const facilityEnterSea = getAvailableChoices(
  prologueScenes[SCENE_LOOP2_OPERATIONS_CORRIDOR],
  facilityRoute,
).find((choice) => choice.id === 'ASK_SEA_ABOUT_SEOYUN');
assert(facilityEnterSea !== undefined, 'linen room inspection must reveal Sea');
facilityRoute = applyEffects(facilityRoute, facilityEnterSea.effects);
const facilityChoices = getAvailableChoices(prologueScenes[SCENE_LOOP2_SEA_FIRST_MEETING], facilityRoute);
assert(facilityChoices.some((choice) => choice.id === 'FACE_TAEJUN_IN_B1'), 'facility clue route must retain direct confrontation');
assert(!facilityChoices.some((choice) => choice.id === 'USE_B1_TRANSFER_ROUTE'), 'facility clue route must trade away the quiet escape');

state = inspect(state, investigation, 'linen-carts');
state = inspect(state, investigation, 'linen-room');

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

console.log('302 active search and B1 investigation trade-off passed.');
