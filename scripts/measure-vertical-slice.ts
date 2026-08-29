import {
  LOCATION_CAR,
  LOCATION_MOUNTAIN_ROAD,
  SCENE_CH00_ENTRANCE,
  SCENE_LOOP2_RESET_AWAKENING,
  prologueScenes,
} from '../src/content/prologue';
import { LOOP_START_TIME, applyEffects, getAvailableChoices, resetLoop } from '../src/engine';
import type { NarrativeEngineState } from '../src/engine';

const loop1Choices = [
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

const loop2Choices = [
  'RECOGNIZE_RESET',
  'CONTINUE_AFTER_TITLE',
  'DO_NOT_EXPLAIN_LOOP_YET',
  'TAKE_FIRST_PHONE',
  'ANSWER_ON_OWN_PHONE',
  'REVEAL_EXACT_FOREKNOWLEDGE',
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

const traversedBodies: string[] = [];
let choiceCount = 0;

function recordCurrentScene() {
  traversedBodies.push(prologueScenes[state.volatile.currentSceneId].body);
}

function choose(choiceId: string) {
  const scene = prologueScenes[state.volatile.currentSceneId];
  const choice = getAvailableChoices(scene, state).find((candidate) => candidate.id === choiceId);
  if (!choice) throw new Error(`Missing route choice: ${choiceId} in ${scene.id}`);
  state = applyEffects(state, choice.effects);
  const nextScene = prologueScenes[state.volatile.currentSceneId];
  state = applyEffects(state, nextScene.onEnter ?? []);
  choiceCount += 1;
  recordCurrentScene();
}

recordCurrentScene();
loop1Choices.forEach(choose);
state = resetLoop(state, SCENE_LOOP2_RESET_AWAKENING, LOCATION_CAR);
recordCurrentScene();
loop2Choices.forEach(choose);

const visibleCharacters = traversedBodies.join('').replace(/\s/g, '').length;
const sceneCount = traversedBodies.length;
const readingMinutes = visibleCharacters / 210;
const interactionMinutes = (sceneCount * 7 + choiceCount * 6) / 60;
const estimatedMinutes = Math.round(readingMinutes + interactionMinutes);

console.log(
  JSON.stringify(
    {
      route: 'canonical ACT 0–3, reset/title, first phone → B1 → 302 recheck → second phone',
      sceneCount,
      choiceCount,
      visibleCharacters,
      assumptions: {
        koreanCharactersPerMinute: 210,
        sceneOrientationSeconds: 7,
        choiceDecisionSeconds: 6,
      },
      estimatedMinutes,
      targetMinutes: '30–45',
      meetsTarget: estimatedMinutes >= 30 && estimatedMinutes <= 45,
    },
    null,
    2,
  ),
);

if (estimatedMinutes < 30 || estimatedMinutes > 45) {
  throw new Error(`Estimated playtime ${estimatedMinutes}m is outside the 30–45m target.`);
}
