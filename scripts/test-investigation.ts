import {
  CLUE_302_OCCUPIED,
  CLUE_CCTV_GAP,
  CLUE_OLD_302_PASSAGE,
  ITEM_OLD_MAP_PHOTO,
  prologueScenes,
  SCENE_ACT2_ROOM_CONTRADICTION,
  SCENE_LOOP2_OLD_MAP_SEARCH,
  SCENE_LOOP2_OPERATIONS_CORRIDOR,
  SCENE_LOOP2_SEA_FIRST_MEETING,
  SCENE_LOOP2_TAEJUN_MAP,
} from '../src/content/prologue';
import { applyEffects, getAvailableChoices, LOOP_START_TIME } from '../src/engine';
import type { NarrativeEngineState } from '../src/engine';
import {
  canInspectHotspot,
  getAvailableInvestigationHotspots,
  investigationFlag,
  OLD_MAP_PASSAGE_FOUND_FLAG,
  sceneInvestigations,
} from '../src/gameplay/investigation';
import { DEDUCTION_302_HIDDEN_ROUTE } from '../src/gameplay/deductions';
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
assert(
  getAvailableInvestigationHotspots(hastyRoomRoute, roomInvestigation).length === 3,
  'the investigation UI must initially direct the player to all three room traces',
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
assert(
  getAvailableInvestigationHotspots(thoroughRoomRoute, roomInvestigation).length === 2,
  'finding one trace must keep guiding the player to the two remaining hotspots',
);
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
assert(
  getAvailableInvestigationHotspots(facilityRoute, investigation).map((hotspot) => hotspot.id).join(',') === 'linen-room',
  'after spending the optional search, guidance must point only to the required discovery',
);
facilityRoute = inspect(facilityRoute, investigation, 'linen-room');
assert(
  getAvailableInvestigationHotspots(facilityRoute, investigation).length === 0,
  'guidance must stop once no valid hotspot remains',
);

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

let oldMapState = createState(SCENE_LOOP2_OLD_MAP_SEARCH);
const oldMapInvestigation = sceneInvestigations[SCENE_LOOP2_OLD_MAP_SEARCH];
assert(oldMapInvestigation !== undefined, 'old 3F map investigation must exist');
assert(
  getAvailableChoices(prologueScenes[SCENE_LOOP2_OLD_MAP_SEARCH], oldMapState).length === 0,
  'the hidden-route action must remain locked before the map is inspected and deduced',
);
oldMapState = inspect(oldMapState, oldMapInvestigation, 'room-302-outline');
assert(oldMapState.persistent.clueIds.includes(CLUE_OLD_302_PASSAGE), 'the 302 outline must record the old passage clue');
assert(oldMapState.volatile.itemIds.includes(ITEM_OLD_MAP_PHOTO), 'the 302 outline must leave a map photo in the inventory');
assert(oldMapState.volatile.flags[OLD_MAP_PASSAGE_FOUND_FLAG] === true, 'the old passage discovery flag must be set');
assert(
  getAvailableChoices(prologueScenes[SCENE_LOOP2_OLD_MAP_SEARCH], oldMapState).length === 0,
  'finding the passage alone must not skip the player deduction',
);
oldMapState = applyEffects(oldMapState, [
  { type: 'gainClue', clueId: CLUE_CCTV_GAP },
  { type: 'gainDeduction', deductionId: DEDUCTION_302_HIDDEN_ROUTE },
]);
const hiddenRouteChoice = getAvailableChoices(
  prologueScenes[SCENE_LOOP2_OLD_MAP_SEARCH],
  oldMapState,
).find((choice) => choice.id === 'LINK_CCTV_GAP_TO_OLD_PASSAGE');
assert(hiddenRouteChoice !== undefined, 'forming the hidden-route deduction must unlock the map action');
oldMapState = applyEffects(oldMapState, hiddenRouteChoice.effects);
assert(
  oldMapState.volatile.currentSceneId === SCENE_LOOP2_TAEJUN_MAP,
  'using the completed route deduction must continue to Taejun with the map evidence',
);

console.log('302 search, B1 trade-off, and old-map investigation passed.');
