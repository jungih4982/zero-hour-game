import type {
  DeathIntel,
  LocationId,
  MemoryId,
  MemoryRecord,
  NarrativeScene,
  SceneId,
} from '../engine/types';

export const SCENE_LOBBY_2200 = 'SCENE_LOBBY_2200' as SceneId;
export const SCENE_BLACKOUT_0000 = 'SCENE_BLACKOUT_0000' as SceneId;
export const SCENE_FIRST_DEATH = 'SCENE_FIRST_DEATH' as SceneId;
export const LOCATION_1F_LOBBY = '1F_LOBBY' as LocationId;
export const MEMORY_BLACKOUT_0000 = 'MEMORY_BLACKOUT_0000' as MemoryId;
export const FIRST_DEATH_ID = 'DEATH_BLACKOUT_SECURITY';

export const blackoutMemory: MemoryRecord = {
  id: MEMORY_BLACKOUT_0000,
  title: '정전 시각',
  description: '백야의료원의 정전은 정확히 00:00에 발생한다.',
  acquiredOnLoop: 1,
  sourceSceneId: SCENE_FIRST_DEATH,
};

export const firstDeathIntel: DeathIntel = {
  memoryId: MEMORY_BLACKOUT_0000,
  deathId: FIRST_DEATH_ID,
  title: '자정의 정전',
  description: '정전 직후 경비 동선이 바뀌며 로비가 위험해진다.',
};

export const prologueScenes: Readonly<Record<string, NarrativeScene>> = {
  [SCENE_LOBBY_2200]: {
    id: SCENE_LOBBY_2200,
    locationId: LOCATION_1F_LOBBY,
    title: '22:00 — 백야의료원 로비',
    body: '유진이 야간 접수대 너머에서 플레이어를 맞는다.',
    choices: [
      {
        id: 'ASK_YUJIN_ABOUT_NIGHT_SHIFT',
        text: '오늘 밤 근무에 관해 묻는다.',
        kind: 'standard',
        effects: [
          { type: 'advanceTime', minutes: 120 },
          { type: 'jumpScene', sceneId: SCENE_BLACKOUT_0000 },
        ],
      },
      {
        id: 'WARN_YUJIN_ABOUT_BLACKOUT',
        text: '[기억] 정확히 자정에 정전될 거예요.',
        kind: 'foreknowledge',
        conditions: [{ type: 'hasMemory', memoryId: MEMORY_BLACKOUT_0000 }],
        effects: [
          { type: 'setFlag', flag: 'warnedYujin', value: true, scope: 'loop' },
          { type: 'advanceTime', minutes: 120 },
          { type: 'jumpScene', sceneId: SCENE_BLACKOUT_0000 },
        ],
      },
    ],
  },
  [SCENE_BLACKOUT_0000]: {
    id: SCENE_BLACKOUT_0000,
    locationId: LOCATION_1F_LOBBY,
    title: '00:00 — 정전',
    body: '조명이 꺼지고, 첫 루프의 플레이어는 무엇이 오는지 모른다.',
    choices: [
      {
        id: 'MOVE_IN_DARKNESS',
        text: '어둠 속에서 소리가 난 방향으로 움직인다.',
        kind: 'standard',
        effects: [{ type: 'jumpScene', sceneId: SCENE_FIRST_DEATH }],
      },
    ],
  },
  [SCENE_FIRST_DEATH]: {
    id: SCENE_FIRST_DEATH,
    locationId: LOCATION_1F_LOBBY,
    title: '첫 번째 죽음',
    body: '혼란 속 경비의 오인 대응으로 쓰러지며 정전 시각을 각인한다.',
    choices: [],
    onEnter: [
      { type: 'gainMemory', memory: blackoutMemory },
      { type: 'triggerDeath', deathId: FIRST_DEATH_ID, intel: firstDeathIntel },
    ],
  },
};
