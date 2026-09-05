import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Image,
  type ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BrainCircuit,
  Check,
  ChevronRight,
  Clock,
  MapPinned,
  Menu,
  RotateCcw,
  Search,
} from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { TypewriterText } from '../../components/TypewriterText';
import {
  SCENE_ACT0_ARRIVAL,
  SCENE_ACT0_LAST_CALL,
  SCENE_ACT0_MESSAGES,
  SCENE_ACT0_WATCH_CALL,
  SCENE_ACT3_MAP_AND_TAEJUN,
  SCENE_ACT1_YUJIN_SEARCH,
  SCENE_ACT1_YUJIN_WARNING,
  SCENE_CH00_YUJIN_DENIAL,
  SCENE_CH00_YUJIN_FIRST,
  SCENE_CH00_ENTRANCE,
  SCENE_FIRST_DEATH,
  SCENE_LOOP2_YUJIN_FOREKNOWLEDGE,
  SCENE_LOOP2_YUJIN_MINIMAL,
  SCENE_LOOP2_06_CARD,
  SCENE_LOOP2_CCTV_GAP,
  SCENE_LOOP2_EARLY_ARRIVAL,
  SCENE_LOOP2_FIRST_PHONE,
  SCENE_LOOP2_OLD_MAP_SEARCH,
  SCENE_LOOP2_SEOYUN_NEW_RULE,
  SCENE_LOOP2_SEOYUN_UNCERTAIN,
  SCENE_LOOP2_TAEJUN_MAP,
  SCENE_CHAPTER02_END,
  SCENE_LOOP2_SEA_FIRST_MEETING,
  SCENE_LOOP2_FIRST_CALL_TEST,
  SCENE_LOOP2_MESSAGE_TEST,
  SCENE_LOOP2_PHONE_PARADOX,
  SCENE_LOOP2_RETURN_302,
  SCENE_LOOP2_SECOND_PHONE,
  SCENE_LOOP2_SEOYUN_RECHECK,
  SCENE_LOOP2_TAEJUN_REJECTION,
  SCENE_VERTICAL_SLICE_END,
  SCENE_VERTICAL_SLICE_TITLE,
} from '../content/prologue';
import {
  SCENE_CH3_0106_SOLO,
  SCENE_CH3_0106_TAEJUN,
  SCENE_CH3_0106_YUJIN,
  SCENE_CH3_BAND_REQUEST,
  SCENE_CH3_DEATH_SOLO,
  SCENE_CH3_DEATH_TAEJUN,
  SCENE_CH3_DEATH_YUJIN,
  SCENE_CH3_MINSEO_QUESTION,
  SCENE_CH3_MISSING_CARD,
  SCENE_CH3_MISSING_WORKER,
  SCENE_CH3_LAST_RADIO,
  SCENE_CH3_THREE_TESTIMONIES,
  SCENE_CH3_TRANSFER_SOLO,
  SCENE_CH3_TRANSFER_TAEJUN,
  SCENE_CH3_TRANSFER_YUJIN,
  SCENE_CH4_MILESTONE_A_END,
  SCENE_CH4_OPENING,
} from '../content/chapter3';
import { storyScenes } from '../content/story';
import { getAvailableChoices } from '../engine';
import type { NarrativeScene } from '../engine';
import { useNarrativeStore } from '../store/useNarrativeStore';
import {
  getDialogueSpeedMilliseconds,
  useGamePreferences,
} from '../store/useGamePreferences';
import {
  getDialogueBeats,
  speakerLabels,
  type SpeakerId,
} from './dialogueBeats';
import { FieldKit } from './FieldKit';
import { GameMenu } from './GameMenu';
import {
  canInspectHotspot,
  getAvailableInvestigationHotspots,
  getUsedSearchOpportunities,
  isHotspotInspected,
  sceneInvestigations,
} from '../gameplay/investigation';
import {
  createDeathMemoryState,
  getDeathMemoryFragments,
  getDeathMemorySequence,
  isDeathMemoryComplete,
  selectDeathMemoryFragment,
} from '../gameplay/deathMemory';
import {
  getChoiceGroupPresentation,
  getChoicePresentation,
  type ChoiceOutcomeCue,
  type ForeknowledgeIntervention,
} from '../gameplay/choicePresentation';
import {
  formatIncidentTime,
  getActionTimeCost,
  getIncidentClockProgress,
} from '../gameplay/gameClock';
import {
  getContextualTutorialGuide,
  tutorialGuideIds,
} from '../gameplay/tutorial';
import {
  canFormDeduction,
  DEDUCTION_302_HIDDEN_ROUTE,
  deductions,
} from '../gameplay/deductions';
import {
  getCharacterStageAnchors,
  getCoverPlacement,
  getGameLayout,
  getInvestigationHotspotPosition,
} from './layout';
import {
  createNarrativeInputState,
  updateNarrativeInput,
  type NarrativeInputEvent,
} from './narrativeInput';

const backgrounds = {
  carInterior: require('../../assets/backgrounds/car/BG_Car_Interior_Night_v01.png'),
  exterior: require('../../assets/backgrounds/exterior/BG_Hospital_Exterior_Arrival_v01.png'),
  lobby: require('../../assets/backgrounds/1f/BG_1F_Lobby_v01.png'),
  staffDoor: require('../../assets/backgrounds/1f/BG_1F_StaffDoor_Normal_v01.png'),
  staffDoorBlackout: require('../../assets/backgrounds/1f/BG_1F_StaffDoor_Blackout_v01.png'),
  corridor: require('../../assets/backgrounds/3f/BG_3F_Corridor_Normal_v01.png'),
  blackout: require('../../assets/backgrounds/3f/BG_3F_Corridor_Blackout_v01.png'),
  room302Normal: require('../../assets/backgrounds/3f/BG_302Room_Normal_v01.png'),
  room302Cleared: require('../../assets/backgrounds/3f/BG_302Room_Cleared_v01.png'),
  evacuationMap: require('../../assets/backgrounds/3f/BG_3F_OldEvacuationMap_v01.png'),
  operationsCorridor: require('../../assets/backgrounds/b1/BG_B1_OperationsCorridor_Blackout_v01.png'),
  operationsCorridorPortrait: require('../../assets/backgrounds/b1/BG_B1_OperationsCorridor_Portrait_v01.png'),
  firstDeath: require('../../assets/backgrounds/special/CG_FirstDeath_Midnight_v01.png'),
  card06Evidence: require('../../assets/backgrounds/special/CG_06Card_Evidence_v01.png'),
};

const cleared302SceneIds = new Set<string>([
  SCENE_LOOP2_RETURN_302,
  SCENE_LOOP2_SECOND_PHONE,
  SCENE_VERTICAL_SLICE_END,
]);

const characterSprites = {
  seoyunPhoneTense: require('../../assets/characters/seoyun/sprites/CHAR_Seoyun_Phone_Tense_Bust_v02.png'),
  seoyunPhoneFrightened: require('../../assets/characters/seoyun/sprites/CHAR_Seoyun_Phone_Frightened_Bust_v01.png'),
  seoyunPhoneGuarded: require('../../assets/characters/seoyun/sprites/CHAR_Seoyun_Phone_Guarded_Bust_v01.png'),
  yujinGuarded: require('../../assets/characters/yujin/sprites/CHAR_Yujin_Guarded_Full_v01.png'),
  yujinAlarmed: require('../../assets/characters/yujin/sprites/CHAR_Yujin_Alarmed_Full_v03.png'),
  taejunWatchful: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Watchful_Full_v01.png'),
  taejunCold: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Cold_Full_v01.png'),
  taejunConfrontational: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Confrontational_Full_v01.png'),
  seaWary: require('../../assets/characters/sea/sprites/CHAR_Sea_Wary_Full_v01.png'),
  seaConfused: require('../../assets/characters/sea/sprites/CHAR_Sea_Confused_Full_v03.png'),
  minseoClinical: require('../../assets/characters/minseo/sprites/CHAR_Minseo_Clinical_Full_v02.png'),
};

type CharacterSpeaker = Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea' | 'minseo'>;

type BackgroundFocalPoint = {
  portraitX: number;
  portraitY: number;
  portraitZoom: number;
};

const sceneBackgroundFocalPoints: Readonly<
  Partial<Record<string, BackgroundFocalPoint>>
> = {
  [SCENE_CH00_ENTRANCE]: { portraitX: 0.56, portraitY: 0.62, portraitZoom: 1.08 },
  [SCENE_ACT0_WATCH_CALL]: { portraitX: 0.58, portraitY: 0.62, portraitZoom: 1.08 },
  [SCENE_ACT0_MESSAGES]: { portraitX: 0.6, portraitY: 0.62, portraitZoom: 1.08 },
  [SCENE_ACT0_LAST_CALL]: { portraitX: 0.6, portraitY: 0.62, portraitZoom: 1.08 },
  [SCENE_ACT0_ARRIVAL]: { portraitX: 0.66, portraitY: 0.58, portraitZoom: 1.06 },
  [SCENE_ACT3_MAP_AND_TAEJUN]: { portraitX: 0.48, portraitY: 0.54, portraitZoom: 1.04 },
  [SCENE_LOOP2_06_CARD]: { portraitX: 0.52, portraitY: 0.54, portraitZoom: 1 },
  [SCENE_LOOP2_OLD_MAP_SEARCH]: { portraitX: 0.48, portraitY: 0.54, portraitZoom: 1.04 },
  [SCENE_LOOP2_TAEJUN_MAP]: { portraitX: 0.48, portraitY: 0.54, portraitZoom: 1.04 },
};

const locationBackgroundFocalPoints: Readonly<
  Partial<Record<string, BackgroundFocalPoint>>
> = {
  '1F_LOBBY': { portraitX: 0.54, portraitY: 0.74, portraitZoom: 1.14 },
  '1F_STAFF_DOOR': { portraitX: 0.56, portraitY: 0.68, portraitZoom: 1.1 },
  '3F_CORRIDOR': { portraitX: 0.54, portraitY: 0.7, portraitZoom: 1.12 },
  ROOM_302: { portraitX: 0.54, portraitY: 0.66, portraitZoom: 1.1 },
  B1_OPERATIONS_CORRIDOR: { portraitX: 0.5, portraitY: 0.55, portraitZoom: 1 },
};

type CharacterVisual = {
  id: CharacterSpeaker;
  source: ImageSourcePropType;
  name: string;
  expression: 'neutral' | 'tense' | 'frightened' | 'guarded' | 'alarmed' | 'wary' | 'confused' | 'watchful' | 'cold' | 'clinical';
  crop: 'bust' | 'full';
  scale?: number;
  offsetY?: number;
};

const expressionLabels: Readonly<Record<CharacterVisual['expression'], string>> = {
  neutral: '차분한 표정',
  tense: '긴장한 표정',
  frightened: '겁먹은 표정',
  guarded: '경계하는 표정',
  alarmed: '놀란 표정',
  wary: '경계하는 표정',
  confused: '혼란스러운 표정',
  watchful: '주시하는 표정',
  cold: '차가운 표정',
  clinical: '차분한 표정',
};

const defaultCharacterVisuals: Readonly<
  Record<CharacterSpeaker, CharacterVisual>
> = {
  seoyun: {
    id: 'seoyun',
    source: characterSprites.seoyunPhoneTense,
    name: '서윤',
    expression: 'tense',
    crop: 'bust',
    scale: 1.08,
  },
  yujin: {
    id: 'yujin',
    source: characterSprites.yujinGuarded,
    name: '한유진',
    expression: 'guarded',
    crop: 'full',
  },
  taejun: {
    id: 'taejun',
    source: characterSprites.taejunWatchful,
    name: '강태준',
    expression: 'watchful',
    crop: 'full',
    scale: 1.03,
  },
  sea: {
    id: 'sea',
    source: characterSprites.seaWary,
    name: '윤세아',
    expression: 'wary',
    crop: 'full',
    scale: 1.03,
  },
  minseo: {
    id: 'minseo',
    source: characterSprites.minseoClinical,
    name: '차민서',
    expression: 'clinical',
    crop: 'full',
    scale: 1.02,
  },
};

const characterVisuals: Readonly<Partial<Record<string, CharacterVisual>>> = {
  [SCENE_CH00_YUJIN_FIRST]: {
    id: 'yujin',
    source: characterSprites.yujinGuarded,
    name: '한유진',
    expression: 'guarded',
    crop: 'full',
  },
  [SCENE_ACT1_YUJIN_SEARCH]: {
    id: 'yujin',
    source: characterSprites.yujinGuarded,
    name: '한유진',
    expression: 'guarded',
    crop: 'full',
  },
  [SCENE_CH00_YUJIN_DENIAL]: {
    id: 'yujin',
    source: characterSprites.yujinGuarded,
    name: '한유진',
    expression: 'guarded',
    crop: 'full',
    scale: 1.03,
  },
  [SCENE_ACT1_YUJIN_WARNING]: {
    id: 'yujin',
    source: characterSprites.yujinAlarmed,
    name: '한유진',
    expression: 'alarmed',
    crop: 'full',
    scale: 1.04,
  },
  [SCENE_LOOP2_YUJIN_FOREKNOWLEDGE]: {
    id: 'yujin',
    source: characterSprites.yujinAlarmed,
    name: '한유진',
    expression: 'alarmed',
    crop: 'full',
    scale: 1.04,
  },
  [SCENE_LOOP2_YUJIN_MINIMAL]: {
    id: 'yujin',
    source: characterSprites.yujinGuarded,
    name: '한유진',
    expression: 'guarded',
    crop: 'full',
  },
  [SCENE_ACT3_MAP_AND_TAEJUN]: {
    id: 'taejun',
    source: characterSprites.taejunWatchful,
    name: '강태준',
    expression: 'watchful',
    crop: 'full',
    scale: 1.03,
  },
  [SCENE_LOOP2_TAEJUN_REJECTION]: {
    id: 'taejun',
    source: characterSprites.taejunConfrontational,
    name: '강태준',
    expression: 'cold',
    crop: 'full',
    scale: 1.03,
  },
  [SCENE_LOOP2_SEA_FIRST_MEETING]: {
    id: 'sea',
    source: characterSprites.seaWary,
    name: '윤세아',
    expression: 'wary',
    crop: 'full',
    scale: 1.03,
  },
  [SCENE_LOOP2_CCTV_GAP]: {
    id: 'taejun',
    source: characterSprites.taejunWatchful,
    name: '강태준',
    expression: 'watchful',
    crop: 'full',
    scale: 1.03,
  },
  [SCENE_LOOP2_06_CARD]: {
    id: 'yujin',
    source: characterSprites.yujinGuarded,
    name: '한유진',
    expression: 'guarded',
    crop: 'full',
  },
  [SCENE_LOOP2_TAEJUN_MAP]: {
    id: 'taejun',
    source: characterSprites.taejunCold,
    name: '강태준',
    expression: 'cold',
    crop: 'full',
    scale: 1.03,
  },
};

type CharacterExpressionRule = {
  speaker: CharacterSpeaker;
  visual: CharacterVisual;
  fromBeat?: number;
  toBeat?: number;
};

const seoyunFrightenedVisual: CharacterVisual = {
  ...defaultCharacterVisuals.seoyun,
  source: characterSprites.seoyunPhoneFrightened,
  expression: 'frightened',
};

const seoyunNeutralVisual: CharacterVisual = {
  ...defaultCharacterVisuals.seoyun,
  // Keep the calm beat on the same locked face as the tense/guarded set. The
  // superseded neutral render has a pale matte halo and a different face.
  source: characterSprites.seoyunPhoneTense,
  expression: 'neutral',
};

const seoyunTenseVisual: CharacterVisual = {
  ...defaultCharacterVisuals.seoyun,
  source: characterSprites.seoyunPhoneTense,
  expression: 'tense',
};

const seoyunGuardedVisual: CharacterVisual = {
  ...defaultCharacterVisuals.seoyun,
  source: characterSprites.seoyunPhoneGuarded,
  expression: 'guarded',
};

const seaConfusedVisual: CharacterVisual = {
  ...defaultCharacterVisuals.sea,
  source: characterSprites.seaConfused,
  expression: 'confused',
};

const characterExpressionRules: Readonly<
  Partial<Record<string, readonly CharacterExpressionRule[]>>
> = {
  [SCENE_CH00_ENTRANCE]: [
    { speaker: 'seoyun', visual: seoyunNeutralVisual },
  ],
  [SCENE_ACT0_WATCH_CALL]: [
    { speaker: 'seoyun', visual: seoyunNeutralVisual, toBeat: 10 },
    { speaker: 'seoyun', visual: seoyunGuardedVisual, fromBeat: 11 },
  ],
  [SCENE_ACT0_MESSAGES]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual },
  ],
  [SCENE_ACT0_LAST_CALL]: [
    { speaker: 'seoyun', visual: seoyunTenseVisual, toBeat: 6 },
    { speaker: 'seoyun', visual: seoyunGuardedVisual, fromBeat: 7, toBeat: 16 },
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 17 },
  ],
  [SCENE_ACT1_YUJIN_WARNING]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual },
  ],
  [SCENE_LOOP2_FIRST_CALL_TEST]: [
    { speaker: 'seoyun', visual: seoyunTenseVisual, toBeat: 10 },
    { speaker: 'seoyun', visual: seoyunGuardedVisual, fromBeat: 11, toBeat: 18 },
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 19 },
  ],
  [SCENE_LOOP2_MESSAGE_TEST]: [
    { speaker: 'seoyun', visual: seoyunTenseVisual, toBeat: 4 },
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 5 },
  ],
  [SCENE_LOOP2_PHONE_PARADOX]: [
    { speaker: 'seoyun', visual: seoyunTenseVisual, toBeat: 3 },
    { speaker: 'seoyun', visual: seoyunGuardedVisual, fromBeat: 4 },
  ],
  [SCENE_LOOP2_SEOYUN_RECHECK]: [
    { speaker: 'seoyun', visual: seoyunTenseVisual, toBeat: 8 },
    { speaker: 'seoyun', visual: seoyunGuardedVisual, fromBeat: 9 },
  ],
  [SCENE_LOOP2_SECOND_PHONE]: [
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 6 },
  ],
  [SCENE_LOOP2_SEA_FIRST_MEETING]: [
    { speaker: 'sea', visual: seaConfusedVisual, fromBeat: 4 },
  ],
  [SCENE_LOOP2_SEOYUN_UNCERTAIN]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual, toBeat: 16 },
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 17 },
  ],
  [SCENE_LOOP2_SEOYUN_NEW_RULE]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual, toBeat: 10 },
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 11 },
  ],
  [SCENE_LOOP2_06_CARD]: [
    {
      speaker: 'minseo',
      visual: { ...defaultCharacterVisuals.minseo, scale: 0.66, offsetY: -32 },
      fromBeat: 7,
    },
  ],
};

type DuoSceneCast = {
  left: CharacterSpeaker;
  right: CharacterSpeaker;
  rightAppearsAtBeat?: number;
  mirrorLeft?: boolean;
};

const clueCueTitles: Readonly<Record<string, string>> = {
  CLUE_WATCH_GIFT: '서윤이가 선물한 시계',
  CLUE_CONTRADICTORY_MESSAGES: '같은 대화창의 반대되는 문자',
  CLUE_YUJIN_KNOWN: '말하지 않은 이름',
  CLUE_WRISTBAND_DOB: '찢어진 환자 손목밴드',
  CLUE_FIRST_PHONE: '봉투 속 첫 번째 휴대전화',
  CLUE_SECOND_PHONE: '동시에 울린 두 번째 휴대전화',
  CLUE_CCTV_GAP: 'CCTV에서 사라진 1분',
  CLUE_06_CARD: '302호에서 발견된 06 카드',
  CLUE_OLD_302_PASSAGE: '오래된 안내도의 폐쇄 통로',
};

function createClueCue(title: string, firstClue: boolean): ChoiceOutcomeCue {
  return {
    eyebrow: firstClue ? '첫 단서 확보' : '단서 확보',
    title,
    detail: firstClue
      ? '중요한 사실은 현장 기록의 단서 탭에 남습니다.'
      : '새로운 사실이 현장 기록에 추가됐습니다.',
    tone: 'evidence',
  };
}

const duoSceneCasts: Readonly<Partial<Record<string, DuoSceneCast>>> = {
  [SCENE_LOOP2_SEA_FIRST_MEETING]: {
    left: 'sea',
    right: 'taejun',
    rightAppearsAtBeat: 10,
    mirrorLeft: true,
  },
  [SCENE_LOOP2_06_CARD]: {
    left: 'yujin',
    right: 'minseo',
    rightAppearsAtBeat: 7,
  },
};

const sceneCharacterClearBeatIndices: Readonly<Partial<Record<string, readonly number[]>>> = {
  [SCENE_LOOP2_06_CARD]: [3, 4],
  [SCENE_LOOP2_SEOYUN_NEW_RULE]: [19],
  [SCENE_CH3_TRANSFER_TAEJUN]: [4, 5, 6],
  [SCENE_CH3_TRANSFER_YUJIN]: [4, 5, 6],
  [SCENE_CH3_TRANSFER_SOLO]: [4, 5, 6],
  [SCENE_CH3_0106_TAEJUN]: Array.from({ length: 12 }, (_, i) => i + 7),
  [SCENE_CH3_0106_YUJIN]: Array.from({ length: 12 }, (_, i) => i + 9),
  [SCENE_CH3_0106_SOLO]: Array.from({ length: 15 }, (_, i) => i),
  [SCENE_CH3_LAST_RADIO]: [0, 1, 2],
  [SCENE_CH3_DEATH_TAEJUN]: Array.from({ length: 9 }, (_, i) => i),
  [SCENE_CH3_DEATH_YUJIN]: Array.from({ length: 9 }, (_, i) => i),
  [SCENE_CH3_DEATH_SOLO]: Array.from({ length: 9 }, (_, i) => i),
};

function getWatchStatus(scene: NarrativeScene): string {
  if (
    scene.id.includes('BLACKOUT') ||
    scene.id.includes('FIRST_DEATH') ||
    scene.locationId.startsWith('B1')
  ) {
    return '초침 정지';
  }
  return '초침 움직임';
}

function isWatchStopped(scene: NarrativeScene): boolean {
  return getWatchStatus(scene) === '초침 정지';
}

function getBackground(scene: NarrativeScene, portrait = false): ImageSourcePropType {
  if (scene.id === SCENE_FIRST_DEATH) {
    return backgrounds.firstDeath;
  }
  if (
    scene.locationId === 'CAR' ||
    scene.locationId === 'MOUNTAIN_ROAD'
  ) {
    return backgrounds.carInterior;
  }
  if (scene.locationId === 'HOSPITAL_EXTERIOR') {
    return backgrounds.exterior;
  }
  if (scene.id === SCENE_LOOP2_06_CARD) {
    return backgrounds.card06Evidence;
  }
  if (
    scene.id === SCENE_ACT3_MAP_AND_TAEJUN
    || scene.id === SCENE_LOOP2_OLD_MAP_SEARCH
    || scene.id === SCENE_LOOP2_TAEJUN_MAP
  ) {
    return backgrounds.evacuationMap;
  }
  if (scene.locationId === '1F_STAFF_DOOR') {
    return isWatchStopped(scene) ? backgrounds.staffDoorBlackout : backgrounds.staffDoor;
  }
  if (scene.locationId === 'ROOM_302') {
    return cleared302SceneIds.has(scene.id)
      ? backgrounds.room302Cleared
      : backgrounds.room302Normal;
  }
  if (scene.locationId.startsWith('B1_')) {
    return portrait
      ? backgrounds.operationsCorridorPortrait
      : backgrounds.operationsCorridor;
  }
  if (scene.id.includes('BLACKOUT')) {
    return backgrounds.blackout;
  }
  if (
    scene.locationId.includes('CORRIDOR') ||
    scene.locationId.includes('ROOM') ||
    scene.locationId.includes('STAFF')
  ) {
    return backgrounds.corridor;
  }
  return backgrounds.lobby;
}

function isCharacterSpeaker(
  speaker: SpeakerId,
): speaker is CharacterSpeaker {
  return speaker === 'seoyun' || speaker === 'yujin' || speaker === 'taejun' || speaker === 'sea' || speaker === 'minseo';
}

function getPresentedCharacterSpeaker(
  beats: ReturnType<typeof getDialogueBeats>,
  beatIndex: number,
): CharacterSpeaker | undefined {
  const currentSpeaker = beats[beatIndex]?.speaker;
  if (currentSpeaker && isCharacterSpeaker(currentSpeaker)) return currentSpeaker;

  for (let index = beatIndex - 1; index >= 0; index -= 1) {
    const previousSpeaker = beats[index]?.speaker;
    if (previousSpeaker && isCharacterSpeaker(previousSpeaker)) {
      return previousSpeaker;
    }
  }
  return undefined;
}

function getCharacter(
  scene: NarrativeScene,
  speaker: SpeakerId,
  beatIndex: number,
): CharacterVisual | undefined {
  if (!isCharacterSpeaker(speaker)) return undefined;
  let expressionOverride: CharacterVisual | undefined;
  for (const rule of characterExpressionRules[scene.id] ?? []) {
    const afterStart = rule.fromBeat === undefined || beatIndex >= rule.fromBeat;
    const beforeEnd = rule.toBeat === undefined || beatIndex <= rule.toBeat;
    if (rule.speaker === speaker && afterStart && beforeEnd) {
      expressionOverride = rule.visual;
    }
  }
  if (expressionOverride) return expressionOverride;
  const sceneVisual = characterVisuals[scene.id];
  return sceneVisual?.id === speaker
    ? sceneVisual
    : defaultCharacterVisuals[speaker];
}

function CharacterSprite({
  character,
  width,
  height,
  stopped,
  active,
  portrait,
  duo,
  mirrored,
  choiceMode,
}: {
  character: CharacterVisual;
  width: number;
  height: number;
  stopped: boolean;
  active: boolean;
  portrait: boolean;
  duo: boolean;
  mirrored: boolean;
  choiceMode: boolean;
}) {
  const scale = character.scale ?? 1;
  const cropFullbodyToPortrait = portrait && character.crop === 'full';
  const illumination = useRef(new Animated.Value(active ? 1 : 0)).current;
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const expressionMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceOpacity, {
      toValue: 1,
      duration: 240,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [entranceOpacity]);

  useEffect(() => {
    Animated.timing(illumination, {
      toValue: active ? 1 : 0,
      duration: 220,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [active, illumination]);

  useEffect(() => {
    expressionMotion.stopAnimation();
    expressionMotion.setValue(0);
    if (!active) return;

    const urgent = character.expression === 'frightened' || character.expression === 'alarmed';
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(expressionMotion, {
          toValue: 1,
          duration: urgent ? 900 : 1700,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(expressionMotion, {
          toValue: 0,
          duration: urgent ? 900 : 1700,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [active, character.expression, expressionMotion]);

  const characterOpacity = illumination.interpolate({
    inputRange: [0, 1],
    outputRange: [choiceMode ? 0.2 : 0.76, choiceMode ? 0.36 : stopped ? 0.88 : 1],
  });
  const visibleCharacterOpacity = Animated.multiply(
    entranceOpacity,
    characterOpacity,
  );
  const dimmerOpacity = illumination.interpolate({
    inputRange: [0, 1],
    outputRange: [0.48, 0],
  });
  return (
    <View
      pointerEvents="none"
      style={[
        styles.characterSprite,
        portrait && styles.characterSpritePortrait,
        { width, height },
        character.offsetY !== undefined && { top: character.offsetY },
        (scale !== 1 || mirrored) && {
          transform: [
            ...(scale !== 1 ? [{ scale }] : []),
            ...(mirrored ? [{ scaleX: -1 }] : []),
          ],
        },
      ]}
    >
      {character.crop === 'full' && !portrait ? (
        <View
          style={[
            styles.characterGroundShadow,
            stopped && styles.characterGroundShadowStopped,
            !active && styles.characterGroundShadowInactive,
          ]}
        />
      ) : null}
      <Animated.View
        style={[
          styles.characterLayer,
          {
            transform: [{
              translateY: expressionMotion.interpolate({
                inputRange: [0, 1],
                outputRange: [0, character.expression === 'frightened' || character.expression === 'alarmed' ? -1.8 : -0.8],
              }),
            }],
          },
        ]}
      >
        <Image
          source={character.source}
          resizeMode="contain"
          blurRadius={7}
          style={[
            styles.characterShadow,
            cropFullbodyToPortrait && styles.characterPortraitFull,
            cropFullbodyToPortrait && duo && styles.characterPortraitDuoFull,
            stopped && styles.characterShadowStopped,
            !active && styles.characterShadowInactive,
          ]}
        />
        <Animated.Image
          accessibilityLabel={`${character.name}, ${expressionLabels[character.expression]}, ${active ? '말하는 중' : '듣고 있음'}`}
          source={character.source}
          resizeMode="contain"
          style={[
            styles.characterImage,
            cropFullbodyToPortrait && styles.characterPortraitFull,
            cropFullbodyToPortrait && duo && styles.characterPortraitDuoFull,
            { opacity: visibleCharacterOpacity },
          ]}
        />
        <Animated.Image
          source={character.source}
          resizeMode="contain"
          style={[
            styles.characterDimmer,
            cropFullbodyToPortrait && styles.characterPortraitFull,
            cropFullbodyToPortrait && duo && styles.characterPortraitDuoFull,
            { opacity: dimmerOpacity },
          ]}
        />
      </Animated.View>
    </View>
  );
}

function BottomDialogueGradient({ side = false }: { side?: boolean }) {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <LinearGradient id="dialogueFade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#03060a" stopOpacity="0" />
          <Stop offset="0.16" stopColor="#03060a" stopOpacity="0.3" />
          <Stop offset="0.38" stopColor="#03060a" stopOpacity="0.8" />
          <Stop offset="0.72" stopColor="#03060a" stopOpacity="0.95" />
          <Stop offset="1" stopColor="#020408" stopOpacity="0.99" />
        </LinearGradient>
        <LinearGradient id="dialogueSideFade" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#03060a" stopOpacity="0" />
          <Stop offset="0.08" stopColor="#03060a" stopOpacity="0.44" />
          <Stop offset="0.28" stopColor="#03060a" stopOpacity="0.82" />
          <Stop offset="0.72" stopColor="#03060a" stopOpacity="0.97" />
          <Stop offset="1" stopColor="#020408" stopOpacity="0.99" />
        </LinearGradient>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        fill={side ? 'url(#dialogueSideFade)' : 'url(#dialogueFade)'}
      />
    </Svg>
  );
}

type BackgroundVisual = {
  id: string;
  source: ImageSourcePropType;
  focalX: number;
  focalY: number;
  zoom: number;
};

function getBackgroundVisual(scene: NarrativeScene, portrait: boolean): BackgroundVisual {
  const corridorPhoneScene = [
    SCENE_LOOP2_FIRST_PHONE,
    SCENE_LOOP2_PHONE_PARADOX,
    SCENE_LOOP2_YUJIN_FOREKNOWLEDGE,
    SCENE_LOOP2_YUJIN_MINIMAL,
  ].includes(scene.id);
  const presentationScene = corridorPhoneScene
    ? { ...scene, locationId: '3F_CORRIDOR' as NarrativeScene['locationId'] }
    : scene;
  const focalPoint = sceneBackgroundFocalPoints[scene.id]
    ?? locationBackgroundFocalPoints[presentationScene.locationId];
  return {
    id: `${scene.id}:${presentationScene.locationId}:${portrait ? 'portrait' : 'wide'}`,
    source: getBackground(presentationScene, portrait),
    focalX: portrait ? (focalPoint?.portraitX ?? 0.5) : 0.5,
    focalY: portrait ? (focalPoint?.portraitY ?? 0.5) : 0.5,
    zoom: portrait ? (focalPoint?.portraitZoom ?? 1.08) : 1,
  };
}

function SceneBackground({
  visual,
  viewportWidth,
  viewportHeight,
  onTransitionChange,
}: {
  visual: BackgroundVisual;
  viewportWidth: number;
  viewportHeight: number;
  onTransitionChange: (active: boolean, sceneId: string) => void;
}) {
  const [currentVisual, setCurrentVisual] = useState(visual);
  const [previousVisual, setPreviousVisual] = useState<BackgroundVisual>();
  const currentVisualRef = useRef(visual);
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const onTransitionChangeRef = useRef(onTransitionChange);
  onTransitionChangeRef.current = onTransitionChange;

  useEffect(() => {
    if (visual.id === currentVisualRef.current.id) return;

    const previous = currentVisualRef.current;
    currentVisualRef.current = visual;
    setPreviousVisual(previous);
    setCurrentVisual(visual);
    transitionOpacity.setValue(0);
    onTransitionChangeRef.current(true, visual.id);

    const transition = Animated.timing(transitionOpacity, {
      toValue: 1,
      duration: 360,
      useNativeDriver: Platform.OS !== 'web',
    });
    transition.start(({ finished }) => {
      if (!finished) return;
      setPreviousVisual(undefined);
      onTransitionChangeRef.current(false, visual.id);
    });

    return () => transition.stop();
  }, [transitionOpacity, visual.id]);

  const getImageStyle = (item: BackgroundVisual) => {
    const resolved = Image.resolveAssetSource(item.source);
    return getCoverPlacement({
      viewportWidth,
      viewportHeight,
      imageWidth: resolved.width,
      imageHeight: resolved.height,
      focalX: item.focalX,
      focalY: item.focalY,
      zoom: item.zoom,
    });
  };

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {previousVisual ? (
        <Image
          source={previousVisual.source}
          style={[styles.sceneBackgroundImage, getImageStyle(previousVisual)]}
        />
      ) : null}
      <Animated.Image
        source={currentVisual.source}
        style={[
          styles.sceneBackgroundImage,
          getImageStyle(currentVisual),
          {
            opacity: previousVisual ? transitionOpacity : 1,
          },
        ]}
      />
    </View>
  );
}

export function NarrativePlayer() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const viewportWidth = Math.max(1, width);
  const viewportHeight = Math.max(1, height);
  const layout = getGameLayout(viewportWidth, viewportHeight);
  const tabletSized = Math.min(viewportWidth, viewportHeight) >= 700;
  const tabletLandscape = layout.mode === 'landscape' && tabletSized;
  const tabletPortrait = layout.mode === 'tablet';
  const tabletUi = tabletLandscape || tabletPortrait;
  const [showFieldKit, setShowFieldKit] = useState(false);
  const [showTitleMenu, setShowTitleMenu] = useState(true);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [recordsReturnToTitle, setRecordsReturnToTitle] = useState(false);
  const [narrativeHydrated, setNarrativeHydrated] = useState(
    useNarrativeStore.persist.hasHydrated(),
  );
  const [preferencesHydrated, setPreferencesHydrated] = useState(
    useGamePreferences.persist.hasHydrated(),
  );
  const [beatIndex, setBeatIndex] = useState(0);
  const [deathMemoryState, setDeathMemoryState] = useState(createDeathMemoryState);
  const [choiceOutcomeCue, setChoiceOutcomeCue] = useState<ChoiceOutcomeCue>();
  const [timeShiftCue, setTimeShiftCue] = useState<number>();
  const [foreknowledgeIntervention, setForeknowledgeIntervention] = useState<ForeknowledgeIntervention>();
  const [backgroundTransitionLocked, setBackgroundTransitionLocked] = useState(false);
  const storyScrollRef = useRef<ScrollView>(null);
  const activeBackgroundTransitionRef = useRef<string | undefined>(undefined);
  const resumedSceneRef = useRef<string | undefined>(undefined);
  const engineState = useNarrativeStore((store) => store.engineState);
  const selectChoice = useNarrativeStore((store) => store.selectChoice);
  const formDeduction = useNarrativeStore((store) => store.formDeduction);
  const inspectHotspot = useNarrativeStore((store) => store.inspectHotspot);
  const beginNextLoop = useNarrativeStore((store) => store.beginNextLoop);
  const restartStory = useNarrativeStore((store) => store.restartStory);
  const dialogueSpeed = useGamePreferences((state) => state.dialogueSpeed);
  const seenTutorialGuideIds = useGamePreferences((state) => state.seenTutorialGuideIds);
  const markTutorialGuideSeen = useGamePreferences((state) => state.markTutorialGuideSeen);
  const setPresentationProgress = useGamePreferences(
    (state) => state.setPresentationProgress,
  );
  const scene = storyScenes[engineState.volatile.currentSceneId];
  const hasProgress = engineState.volatile.currentSceneId !== SCENE_CH00_ENTRANCE
    || engineState.volatile.visitedSceneIds.length > 1
    || engineState.persistent.loopCount > 1
    || engineState.persistent.clueIds.length > 0;
  const visitedLocationIds = useMemo(
    () => Array.from(new Set(
      engineState.volatile.visitedSceneIds
        .map((sceneId) => storyScenes[sceneId]?.locationId)
        .filter((locationId): locationId is NarrativeScene['locationId'] => locationId !== undefined),
    )),
    [engineState.volatile.visitedSceneIds],
  );
  const choices = getAvailableChoices(scene, engineState);
  const investigation = sceneInvestigations[scene.id];
  const sideDialogue = layout.overlayDialogue
    && (tabletSized || investigation?.fitHotspotsToStage === true);
  const dialogueBeats = useMemo(() => {
    const beats = getDialogueBeats(scene);
    const hiddenIndices = investigation?.hiddenDialogueBeatIndices;
    return hiddenIndices?.length
      ? beats.filter((_, index) => !hiddenIndices.includes(index))
      : beats;
  }, [scene, investigation]);
  const currentBeatIndex = Math.min(beatIndex, dialogueBeats.length - 1);
  const currentBeat = dialogueBeats[currentBeatIndex];
  const inputEpoch = `${scene.id}:${currentBeatIndex}`;
  const [inputState, setInputState] = useState(() =>
    createNarrativeInputState(inputEpoch),
  );
  const inputStateRef = useRef(inputState);
  inputStateRef.current = inputState;
  const currentSpeaker = speakerLabels[currentBeat.speaker];
  const isLastBeat = currentBeatIndex === dialogueBeats.length - 1;
  const investigationReady = Boolean(
    investigation && inputState.phase === 'ready' && isLastBeat,
  );
  const presentedCharacterSpeaker = getPresentedCharacterSpeaker(
    dialogueBeats,
    currentBeatIndex,
  );
  const clearCharacterForBeat = sceneCharacterClearBeatIndices[scene.id]?.includes(currentBeatIndex) ?? false;
  const character = presentedCharacterSpeaker && !investigationReady && !clearCharacterForBeat
    ? getCharacter(scene, presentedCharacterSpeaker, currentBeatIndex)
    : undefined;
  const duoCast = duoSceneCasts[scene.id];
  const duoHasEntered = duoCast
    ? currentBeatIndex >= (duoCast.rightAppearsAtBeat ?? 0)
    : false;
  const stagedCharacters = character
    ? duoCast && duoHasEntered
      ? [
          getCharacter(scene, duoCast.left, currentBeatIndex),
          getCharacter(scene, duoCast.right, currentBeatIndex),
        ].filter((visual): visual is CharacterVisual => visual !== undefined)
      : [character]
    : [];
  const twoCharacterBeat = stagedCharacters.length === 2;
  const backgroundPresentationScene = scene.id === SCENE_LOOP2_EARLY_ARRIVAL && currentBeatIndex >= 4
    ? { ...scene, locationId: '3F_CORRIDOR' as NarrativeScene['locationId'] }
    : scene;
  const backgroundVisual = getBackgroundVisual(
    backgroundPresentationScene,
    viewportHeight > viewportWidth,
  );
  const isDead = engineState.volatile.deathId !== undefined;
  const deathMemoryFragments = getDeathMemoryFragments(engineState.volatile.deathId);
  const deathMemorySequence = getDeathMemorySequence(engineState.volatile.deathId);
  const deathIntel = engineState.persistent.deathIntel.find(
    (intel) => intel.deathId === engineState.volatile.deathId,
  );
  const retainedDeathMemory = engineState.persistent.memories.find(
    (memory) => memory.id === deathIntel?.memoryId,
  );
  const deathMemoryComplete = isDeathMemoryComplete(deathMemoryState, deathMemorySequence);
  const isTitle = scene.id === SCENE_VERTICAL_SLICE_TITLE;
  const isComplete = scene.id === SCENE_CH4_MILESTONE_A_END;
  const stopped = isWatchStopped(scene);
  const hasPersistentMemory = engineState.persistent.memories.length > 0;
  const fieldRecordCount = engineState.persistent.clueIds.length
    + engineState.volatile.itemIds.length
    + engineState.persistent.memories.length;
  const availableDeductionCount = deductions.filter((deduction) =>
    !engineState.persistent.deductionIds.includes(deduction.id)
      && canFormDeduction(engineState, deduction)).length;
  const fieldKitAvailable = engineState.volatile.visitedSceneIds.length > 1;
  const contextualDeductionId = scene.id === SCENE_LOOP2_OLD_MAP_SEARCH
    && deductions.some((deduction) =>
      deduction.id === DEDUCTION_302_HIDDEN_ROUTE
        && !engineState.persistent.deductionIds.includes(deduction.id)
        && canFormDeduction(engineState, deduction))
    ? DEDUCTION_302_HIDDEN_ROUTE
    : undefined;
  const sceneReady = inputState.phase === 'ready' && isLastBeat;
  const inspectedHotspots = investigation?.hotspots.filter((hotspot) =>
    isHotspotInspected(engineState, scene.id, hotspot.id),
  ) ?? [];
  const usedSearchOpportunities = investigation
    ? getUsedSearchOpportunities(engineState, investigation)
    : 0;
  const availableInvestigationHotspots = investigation
    ? getAvailableInvestigationHotspots(engineState, investigation)
    : [];
  const choiceGroupPresentation = getChoiceGroupPresentation(
    choices,
    investigation ? `${inspectedHotspots.length}/${investigation.hotspots.length} 확인` : undefined,
  );
  const incidentClockProgress = getIncidentClockProgress(engineState.volatile.time as number);
  const activeTutorialGuide = getContextualTutorialGuide({
    seenGuideIds: seenTutorialGuideIds,
    openingBeat: scene.id === SCENE_CH00_ENTRANCE && currentBeatIndex === 0,
    timedChoiceReady: sceneReady && choices.some((choice) => getActionTimeCost(choice.effects, engineState.volatile.time) > 0),
    recordsAvailable: fieldKitAvailable && fieldRecordCount > 0,
  });

  const commitInputEvent = (event: NarrativeInputEvent) => {
    const result = updateNarrativeInput(inputStateRef.current, event);
    inputStateRef.current = result.state;
    setInputState(result.state);
    if (result.command === 'advance' && !isLastBeat) {
      setBeatIndex((index) => Math.min(index + 1, dialogueBeats.length - 1));
    }
  };

  useEffect(() => {
    if (useNarrativeStore.persist.hasHydrated()) {
      setNarrativeHydrated(true);
    }
    return useNarrativeStore.persist.onFinishHydration(() => {
      setNarrativeHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (useGamePreferences.persist.hasHydrated()) {
      setPreferencesHydrated(true);
    }
    return useGamePreferences.persist.onFinishHydration(() => {
      setPreferencesHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!narrativeHydrated || !preferencesHydrated) return;
    if (resumedSceneRef.current !== scene.id) {
      const preferences = useGamePreferences.getState();
      const resumedBeat = preferences.lastSceneId === scene.id
        ? Math.min(preferences.lastBeatIndex, dialogueBeats.length - 1)
        : 0;
      resumedSceneRef.current = scene.id;
      setBeatIndex(resumedBeat);
      return;
    }
    setPresentationProgress(scene.id, currentBeatIndex);
  }, [
    currentBeatIndex,
    dialogueBeats.length,
    narrativeHydrated,
    preferencesHydrated,
    scene.id,
    setPresentationProgress,
  ]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeTutorialGuide) {
        markTutorialGuideSeen(activeTutorialGuide.id);
        return true;
      }
      if (foreknowledgeIntervention) {
        setForeknowledgeIntervention(undefined);
        return true;
      }
      if (showFieldKit) {
        setShowFieldKit(false);
        if (recordsReturnToTitle) {
          setRecordsReturnToTitle(false);
          setShowTitleMenu(true);
        }
        return true;
      }
      if (showPauseMenu) {
        setShowPauseMenu(false);
        return true;
      }
      if (showTitleMenu) return false;
      setShowPauseMenu(true);
      return true;
    });
    return () => subscription.remove();
  }, [
    activeTutorialGuide,
    foreknowledgeIntervention,
    markTutorialGuideSeen,
    recordsReturnToTitle,
    showFieldKit,
    showPauseMenu,
    showTitleMenu,
  ]);

  useEffect(() => {
    setDeathMemoryState(createDeathMemoryState());
  }, [engineState.volatile.deathId]);

  useEffect(() => {
    if (timeShiftCue === undefined) return;
    const timeout = setTimeout(() => setTimeShiftCue(undefined), 1700);
    return () => clearTimeout(timeout);
  }, [timeShiftCue]);

  useEffect(() => {
    if (!sceneReady || !investigation || inspectedHotspots.length === 0) return;
    const frame = requestAnimationFrame(() => {
      storyScrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [scene.id, sceneReady, investigation, inspectedHotspots.length]);

  useEffect(() => {
    commitInputEvent({ type: 'reset', epoch: inputEpoch });
  }, [inputEpoch]);

  const advanceDialogue = () => {
    if (backgroundTransitionLocked) return;
    setChoiceOutcomeCue(undefined);
    commitInputEvent({ type: 'tap', canAdvance: !isLastBeat });
  };

  const handleInspectHotspot = (hotspotId: string) => {
    const hotspot = investigation?.hotspots.find((entry) => entry.id === hotspotId);
    const clueEffect = hotspot?.effects.find((effect) => effect.type === 'gainClue');
    const firstClue = engineState.persistent.clueIds.length === 0;
    const timeCost = hotspot ? getActionTimeCost(hotspot.effects) : 0;
    if (timeCost > 0) setTimeShiftCue(timeCost);
    inspectHotspot(hotspotId);
    if (clueEffect?.type === 'gainClue') {
      setChoiceOutcomeCue(createClueCue(
        hotspot?.label ?? clueCueTitles[clueEffect.clueId] ?? '새로운 단서',
        firstClue,
      ));
    }
  };

  const handleBackgroundTransition = (active: boolean, visualId: string) => {
    if (active) {
      activeBackgroundTransitionRef.current = visualId;
      setBackgroundTransitionLocked(true);
      return;
    }
    if (activeBackgroundTransitionRef.current === visualId) {
      activeBackgroundTransitionRef.current = undefined;
      setBackgroundTransitionLocked(false);
    }
  };

  const confirmRestart = (startImmediately = true) => {
    const run = () => {
      setShowFieldKit(false);
      setForeknowledgeIntervention(undefined);
      setBeatIndex(0);
      setBackgroundTransitionLocked(true);
      commitInputEvent({ type: 'choiceSelected' });
      restartStory();
      setShowPauseMenu(false);
      setShowTitleMenu(!startImmediately);
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('이 밤을 처음부터 다시 시작할까요?')) run();
      return;
    }
    Alert.alert('처음으로 돌아가기', '지금까지의 선택은 되돌릴 수 없습니다.', [
      { text: '취소', style: 'cancel' },
      { text: '처음부터', style: 'destructive', onPress: run },
    ]);
  };

  const dialogueHeight = tabletLandscape
    ? Math.min(
        layout.dialogMaxHeight,
        Math.max(sceneReady ? 470 : 410, viewportHeight * (sceneReady ? 0.62 : 0.54)),
      )
    : tabletPortrait
      ? Math.min(
          sceneReady ? 560 : 520,
          Math.max(sceneReady ? 500 : 460, viewportHeight * (sceneReady ? 0.47 : 0.43)),
        )
    : Math.min(
        layout.mode === 'landscape' ? 350 : isDead ? 560 : isComplete ? 580 : 470,
        Math.max(
          layout.mode === 'landscape' ? 240 : isDead ? 410 : isComplete ? 420 : 310,
          viewportHeight * (
            layout.mode === 'landscape' ? 0.5 : isDead ? 0.55 : isComplete ? 0.56 : 0.45
          ),
        ),
      );
  const dialogueSidePadding = Math.max(
    tabletPortrait ? 38 : 24,
    layout.horizontalGutter,
    insets.left + 16,
    insets.right + 16,
  );
  const dialogueDockRight = Math.max(insets.right + 16, layout.horizontalGutter);
  const dialogueContentMaxWidth = tabletPortrait
    ? Math.min(640, viewportWidth - dialogueSidePadding * 2)
    : sideDialogue
      ? Math.max(320, layout.dialogWidth - dialogueSidePadding * 2)
      : 920;
  const portraitStage = !layout.overlayDialogue;
  const duoWidthLimit = (viewportWidth - layout.horizontalGutter * 3) / 2;
  const stagedSpriteWidth = twoCharacterBeat
    ? Math.min(
        layout.spriteWidth * (layout.overlayDialogue ? 0.88 : 0.82),
        duoWidthLimit,
      )
    : layout.spriteWidth;
  const stagedSpriteHeight = stagedSpriteWidth * 1.5;
  const characterStageAnchors = getCharacterStageAnchors({
    viewportWidth,
    horizontalGutter: layout.horizontalGutter,
    spriteWidth: stagedSpriteWidth,
    characterCount: stagedCharacters.length,
    overlayDialogue: layout.overlayDialogue,
  });

  if (!narrativeHydrated || !preferencesHydrated) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar hidden />
        <Text style={styles.loadingText}>기록을 불러오는 중</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar hidden />
      <View style={styles.root}>
        <View style={[styles.stage, styles.stageOverlay]}>
          <SceneBackground
            visual={backgroundVisual}
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
            onTransitionChange={handleBackgroundTransition}
          />

          {stagedCharacters.map((stagedCharacter, index) => {
            const active = stagedCharacter.id === currentBeat.speaker;
            const remoteCall = stagedCharacter.id === 'seoyun';
            const horizontalPosition = characterStageAnchors[index];

            return (
              <View
                key={`${stagedCharacter.id}:${stagedCharacter.expression}`}
                pointerEvents="none"
                style={[
                  styles.characterAnchor,
                  horizontalPosition,
                  {
                    bottom: portraitStage
                      ? Math.round(dialogueHeight * (
                          sceneReady ? (tabletPortrait ? 0.92 : 0.78) : 0.64
                        ))
                      : -6,
                    zIndex: active ? 4 : 2,
                  },
                ]}
              >
                {remoteCall ? (
                  <View
                    style={[
                      styles.remoteCallFrame,
                      { width: stagedSpriteWidth, height: stagedSpriteHeight },
                    ]}
                  >
                    <View style={styles.remoteCallScanline} />
                    <Text style={styles.remoteCallLabel}>통화 연결 · 서윤</Text>
                  </View>
                ) : null}
                <CharacterSprite
                  character={stagedCharacter}
                  width={stagedSpriteWidth}
                  height={stagedSpriteHeight}
                  stopped={stopped}
                  active={active}
                  portrait={twoCharacterBeat || (portraitStage && stagedCharacter.crop === 'full')}
                  duo={twoCharacterBeat}
                  mirrored={Boolean(twoCharacterBeat && duoCast?.mirrorLeft && index === 0)}
                  choiceMode={sceneReady}
                />
              </View>
            );
          })}

          <View style={[styles.colorWash, stopped && styles.colorWashStopped]} />
          <View style={styles.stageTopShade} />
          <View style={styles.stageBottomShade} />
          <View style={styles.filmEdgeLeft} />
          <View style={styles.filmEdgeRight} />
        </View>

        {!showTitleMenu && !showPauseMenu && !showFieldKit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="일시정지 메뉴"
            onPress={() => setShowPauseMenu(true)}
            style={({ pressed }) => [
              styles.pauseButton,
              {
                top: Math.max(insets.top, 10) + 6,
                right: Math.max(insets.right, 10) + 8,
              },
              pressed && styles.pressed,
            ]}
          >
            <Menu color="#d4dee6" size={18} strokeWidth={1.8} />
          </Pressable>
        ) : null}

        {!showTitleMenu && !showPauseMenu && !showFieldKit && !isDead && !isComplete ? (
          <View
            accessibilityLabel={`사건 시각 ${formatIncidentTime(engineState.volatile.time as number)}, 반복 ${engineState.persistent.loopCount}`}
            pointerEvents="none"
            style={[
              styles.incidentClock,
              tabletUi && styles.incidentClockTablet,
              { top: Math.max(insets.top, 10) + 6 },
            ]}
          >
            <View style={styles.incidentClockHeader}>
              <Clock color="#b9cbd8" size={tabletUi ? 13 : 11} strokeWidth={1.8} />
              <Text style={[styles.incidentClockLabel, tabletUi && styles.incidentClockLabelTablet]}>
                사건 시각
              </Text>
              {timeShiftCue !== undefined ? (
                <Text style={[styles.timeShiftText, tabletUi && styles.timeShiftTextTablet]}>
                  +{timeShiftCue}분
                </Text>
              ) : null}
            </View>
            <View style={styles.incidentClockTimeRow}>
              <Text style={[styles.incidentClockTime, tabletUi && styles.incidentClockTimeTablet]}>
                {formatIncidentTime(engineState.volatile.time as number)}
              </Text>
              <Text style={[styles.incidentClockLoop, tabletUi && styles.incidentClockLoopTablet]}>
                반복 {String(engineState.persistent.loopCount).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.incidentClockRail}>
              <View style={[styles.incidentClockFill, { width: `${incidentClockProgress * 100}%` }]} />
              <View style={styles.midnightMarker} />
            </View>
          </View>
        ) : null}

        {fieldKitAvailable && !isDead && !isComplete && !investigationReady
          && !showTitleMenu && !showPauseMenu && !showFieldKit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={availableDeductionCount > 0 ? '새 추론 확인' : '현장 기록 열기'}
            onPress={() => setShowFieldKit(true)}
            style={({ pressed }) => [
              styles.fieldKitFloatingButton,
              {
                top: Math.max(insets.top, 10) + 6,
                left: Math.max(insets.left, 10) + 8,
              },
              availableDeductionCount > 0 && styles.fieldKitFloatingButtonActive,
              pressed && styles.pressed,
            ]}
          >
            {availableDeductionCount > 0 ? (
              <BrainCircuit color="#d8c9ff" size={18} strokeWidth={1.8} />
            ) : (
              <MapPinned color="#c7d3dd" size={18} strokeWidth={1.7} />
            )}
            <View style={[
              styles.fieldKitFloatingBadge,
              availableDeductionCount > 0 && styles.fieldKitFloatingBadgeActive,
            ]}>
              <Text style={[
                styles.fieldKitFloatingCount,
                availableDeductionCount > 0 && styles.toolTextActive,
              ]}>
                {availableDeductionCount || fieldRecordCount}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {sceneReady && investigation && !isDead && !showFieldKit
          ? investigation.hotspots.map((hotspot, index) => {
              const inspected = isHotspotInspected(engineState, scene.id, hotspot.id);
              const available = canInspectHotspot(engineState, investigation, hotspot);
              const missed = !inspected && !available;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={missed
                    ? `${hotspot.label} 조사 기회 종료`
                    : `${hotspot.label} 조사`}
                  disabled={inspected || missed}
                  key={hotspot.id}
                  onPress={() => handleInspectHotspot(hotspot.id)}
                  style={({ pressed }) => [
                    styles.hotspot,
                    investigation.fitHotspotsToStage ? getInvestigationHotspotPosition({
                      x: hotspot.x, y: hotspot.y, viewportWidth, viewportHeight,
                      dialogueHeight, dialogueWidth: layout.dialogWidth,
                      dialogueRight: dialogueDockRight, sideDialogue, safeTop: insets.top,
                    }) : {
                      left: viewportWidth * hotspot.x - 28,
                      top: viewportHeight * hotspot.y - 28,
                    },
                    inspected && styles.hotspotInspected,
                    missed && styles.hotspotMissed,
                    pressed && styles.hotspotPressed,
                  ]}
                >
                  <View style={styles.hotspotPulse} />
                  {missed
                    ? <Text style={styles.hotspotMissedMark}>×</Text>
                    : inspected
                    ? <Check color="#d7e3ec" size={17} strokeWidth={2.1} />
                    : <Search color="#e8f1f8" size={17} strokeWidth={1.9} />}
                  <Text style={styles.hotspotLabel}>
                    {missed ? '놓침' : inspected ? '확인' : `${index + 1}`}
                  </Text>
                </Pressable>
              );
            })
          : null}

        {choiceOutcomeCue && !isDead && !showFieldKit ? (
          <View
            accessibilityLiveRegion="polite"
            pointerEvents="none"
            style={[
              styles.choiceOutcomeCue,
              tabletUi && styles.choiceOutcomeCueTablet,
              {
                top: Math.max(insets.top + 72, 92),
                left: sideDialogue ? undefined : dialogueSidePadding,
                right: sideDialogue ? dialogueDockRight + dialogueSidePadding : undefined,
                width: Math.min(
                  tabletUi ? 420 : 360,
                  (sideDialogue ? layout.dialogWidth : viewportWidth) - dialogueSidePadding * 2,
                ),
                borderLeftColor: choiceOutcomeCue.tone === 'memory'
                  ? '#ad8ce9'
                  : choiceOutcomeCue.tone === 'risk'
                    ? '#d28a72'
                    : choiceOutcomeCue.tone === 'evidence'
                      ? '#78aac7'
                      : '#84b7a2',
              },
            ]}
          >
            <Text style={[styles.choiceOutcomeEyebrow, tabletUi && styles.choiceOutcomeEyebrowTablet]}>{choiceOutcomeCue.eyebrow}</Text>
            <Text style={[styles.choiceOutcomeTitle, tabletUi && styles.choiceOutcomeTitleTablet]}>{choiceOutcomeCue.title}</Text>
            <Text style={[styles.choiceOutcomeDetail, tabletUi && styles.choiceOutcomeDetailTablet]}>{choiceOutcomeCue.detail}</Text>
          </View>
        ) : null}

        {foreknowledgeIntervention && !showFieldKit && !showPauseMenu && !showTitleMenu ? (
          <View
            accessibilityViewIsModal
            style={styles.interventionOverlay}
          >
            <View style={styles.interventionBackdrop} />
            <View
              style={[
                styles.interventionCard,
                {
                  width: Math.min(tabletUi ? 620 : 440, viewportWidth - 36),
                  padding: tabletUi ? 28 : 20,
                },
              ]}
            >
              <View style={styles.interventionHeader}>
                <View style={styles.interventionGlyph}>
                  <BrainCircuit color="#d8c7ff" size={tabletUi ? 25 : 21} strokeWidth={1.7} />
                </View>
                <View style={styles.interventionHeaderCopy}>
                  <Text style={[styles.interventionEyebrow, tabletUi && styles.interventionEyebrowTablet]}>
                    FOREKNOWLEDGE
                  </Text>
                  <Text style={[styles.interventionTitle, tabletUi && styles.interventionTitleTablet]}>
                    기억이 현재에 개입했다
                  </Text>
                </View>
              </View>

              <View style={styles.interventionTimeline}>
                <View style={styles.interventionTimelineRail} />
                <View style={styles.interventionRow}>
                  <View style={[styles.interventionNode, styles.interventionNodeKnown]} />
                  <View style={styles.interventionCopy}>
                    <Text style={styles.interventionLabel}>이전에 확인한 결말</Text>
                    <Text style={[styles.interventionText, tabletUi && styles.interventionTextTablet, styles.interventionKnownText]}>
                      {foreknowledgeIntervention.known}
                    </Text>
                  </View>
                </View>
                <View style={styles.interventionShift}>
                  <Text style={styles.interventionShiftMark}>↓</Text>
                  <Text style={styles.interventionShiftText}>개입</Text>
                </View>
                <View style={styles.interventionRow}>
                  <View style={[styles.interventionNode, styles.interventionNodeChanged]} />
                  <View style={styles.interventionCopy}>
                    <Text style={[styles.interventionLabel, styles.interventionChangedLabel]}>이번에 바꾼 행동</Text>
                    <Text style={[styles.interventionText, tabletUi && styles.interventionTextTablet, styles.interventionChangedText]}>
                      {foreknowledgeIntervention.changed}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.interventionConsequence}>
                <Text style={styles.interventionConsequenceLabel}>변화</Text>
                <Text style={[styles.interventionConsequenceText, tabletUi && styles.interventionConsequenceTextTablet]}>
                  {foreknowledgeIntervention.consequence}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="변경된 밤을 계속한다"
                onPress={() => setForeknowledgeIntervention(undefined)}
                style={({ pressed }) => [
                  styles.interventionContinue,
                  tabletUi && styles.interventionContinueTablet,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.interventionContinueText, tabletUi && styles.interventionContinueTextTablet]}>
                  변경된 밤을 계속한다
                </Text>
                <ChevronRight color="#17111f" size={18} strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.dialogDock,
            sideDialogue
              ? {
                  height: dialogueHeight,
                  width: layout.dialogWidth,
                  right: dialogueDockRight,
                }
              : { height: dialogueHeight, left: 0, right: 0 },
          ]}
        >
          <BottomDialogueGradient side={sideDialogue} />
          <View
            style={[
              styles.dialogFrame,
              sceneReady && styles.dialogFrameChoice,
              tabletLandscape && styles.dialogFrameTabletLandscape,
              tabletPortrait && styles.dialogFrameTabletPortrait,
              {
                paddingHorizontal: dialogueSidePadding,
                paddingBottom: Math.max(insets.bottom, 14),
              },
            ]}
          >
            <View style={[styles.dialogHeader, { maxWidth: dialogueContentMaxWidth }]}>
              <View style={styles.titleBlock}>
                {currentSpeaker.name ? (
                  <View style={styles.speakerRow}>
                    <Text style={[styles.speakerName, tabletUi && styles.speakerNameTablet]}>
                      {currentSpeaker.name}
                    </Text>
                  </View>
                ) : null}
                {isTitle || isComplete ? (
                  <Text
                    numberOfLines={2}
                    style={[styles.sceneTitle, styles.titleReveal, tabletUi && styles.titleRevealTablet]}
                  >
                    {scene.title}
                  </Text>
                ) : null}
              </View>

            </View>

            <ScrollView
              ref={storyScrollRef}
              pointerEvents={sceneReady ? 'auto' : 'none'}
              scrollEnabled={sceneReady}
              style={[styles.bodyScroll, { maxWidth: dialogueContentMaxWidth }]}
              contentContainerStyle={styles.storyContent}
              showsVerticalScrollIndicator={false}
            >
              {sceneReady && investigation ? null : (
                <TypewriterText
                  key={`${scene.id}:${currentBeatIndex}`}
                  text={currentBeat.text}
                  speed={getDialogueSpeedMilliseconds(dialogueSpeed)}
                  completionRequest={inputState.completionRequest}
                  onComplete={() => {
                    commitInputEvent({
                      type: 'typingComplete',
                      epoch: inputEpoch,
                      canAdvance: !isLastBeat,
                    });
                  }}
                  style={[
                    styles.bodyText,
                    tabletUi && styles.bodyTextTablet,
                    sceneReady && styles.choiceContextText,
                    sceneReady && tabletUi && styles.choiceContextTextTablet,
                    (isTitle || isComplete) && styles.endingBodyText,
                  ]}
                />
              )}
              {!sceneReady ? (
                inputState.phase === 'ready' ? (
                  <Text style={[styles.advanceIndicator, tabletUi && styles.advanceIndicatorTablet]}>⌄</Text>
                ) : null
              ) : isDead ? (
                <View style={styles.actionDock}>
                  <View style={styles.deathBlock}>
                    <Text style={styles.deathEyebrow}>
                      {deathMemoryComplete ? '기억 고정 완료' : '기억 고정'}
                    </Text>
                    <Text style={styles.deathTitle}>
                      {deathMemoryComplete
                        ? retainedDeathMemory?.title ?? '자정에 열린 문'
                        : '흩어진 순간을 순서대로 붙잡는다'}
                    </Text>
                    {deathMemoryComplete ? (
                      <>
                        <Text style={styles.deathDescription}>
                          {deathIntel?.description ?? '열린 문과 멈춘 초침만 남았다.'}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="첫 통화로 돌아간다"
                          onPress={() => {
                            setBeatIndex(0);
                            setBackgroundTransitionLocked(true);
                            commitInputEvent({ type: 'choiceSelected' });
                            beginNextLoop();
                          }}
                          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                        >
                          <Text style={styles.primaryButtonText}>이 기억을 가지고 돌아간다</Text>
                          <ChevronRight color="#10151c" size={18} strokeWidth={2.2} />
                        </Pressable>
                      </>
                    ) : (
                      <>
                        <View style={styles.deathMemoryProgress}>
                          {deathMemorySequence.map((fragmentId, index) => (
                            <View
                              key={fragmentId}
                              style={[
                                styles.deathMemoryStep,
                                index < deathMemoryState.acceptedIds.length
                                  && styles.deathMemoryStepComplete,
                              ]}
                            />
                          ))}
                          <Text style={styles.deathMemoryProgressText}>
                            {deathMemoryState.acceptedIds.length}/{deathMemorySequence.length}
                          </Text>
                        </View>
                        <View style={styles.deathMemoryFragments}>
                          {deathMemoryFragments.map((fragment) => {
                            const accepted = deathMemoryState.acceptedIds.includes(fragment.id);
                            const mistaken = deathMemoryState.mistakeId === fragment.id;
                            return (
                              <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={fragment.text}
                                disabled={accepted}
                                key={fragment.id}
                                onPress={() => setDeathMemoryState((state) =>
                                  selectDeathMemoryFragment(state, fragment.id, deathMemorySequence))}
                                style={({ pressed }) => [
                                  styles.deathMemoryFragment,
                                  accepted && styles.deathMemoryFragmentAccepted,
                                  mistaken && styles.deathMemoryFragmentMistaken,
                                  pressed && styles.pressed,
                                ]}
                              >
                                <Text style={styles.deathMemoryFragmentIndex}>
                                  {accepted
                                    ? String(deathMemoryState.acceptedIds.indexOf(fragment.id) + 1).padStart(2, '0')
                                    : '·'}
                                </Text>
                                <Text style={[
                                  styles.deathMemoryFragmentText,
                                  accepted && styles.deathMemoryFragmentTextAccepted,
                                ]}>
                                  {fragment.text}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                        {deathMemoryState.mistakeId ? (
                          <Text style={styles.deathMemoryMistake}>
                            순서가 끊겼다. 첫 순간부터 다시 떠올린다.
                          </Text>
                        ) : (
                          <Text style={styles.deathMemoryHint}>
                            죽기 직전 벌어진 일을 시간순으로 선택한다.
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                </View>
              ) : (
                <View style={[styles.choiceList, tabletUi && styles.choiceListTablet]}>
                  {!isComplete ? (
                    <View style={styles.choiceHeading}>
                      <Text style={[styles.choiceEyebrow, tabletUi && styles.choiceEyebrowTablet]}>{choiceGroupPresentation.eyebrow}</Text>
                      <Text style={[styles.choiceHint, tabletUi && styles.choiceHintTablet]}>
                        {choiceGroupPresentation.hint}
                      </Text>
                    </View>
                  ) : null}
                  {investigation ? (
                    <View style={styles.investigationSummary}>
                      <Text style={[styles.investigationPrompt, tabletUi && styles.investigationPromptTablet]}>{investigation.prompt}</Text>
                      {investigation.optionalInspectionLimit !== undefined ? (
                        <View style={styles.investigationBudget}>
                          <Text style={styles.investigationBudgetLabel}>추가 조사</Text>
                          <View style={styles.investigationBudgetTicks}>
                            {Array.from({ length: investigation.optionalInspectionLimit }).map((_, index) => (
                              <View
                                key={index}
                                style={[
                                  styles.investigationBudgetTick,
                                  index < usedSearchOpportunities
                                    && styles.investigationBudgetTickUsed,
                                ]}
                              />
                            ))}
                          </View>
                          <Text style={styles.investigationBudgetText}>
                            {usedSearchOpportunities < investigation.optionalInspectionLimit
                              ? '한 곳을 더 살필 수 있다'
                              : '손전등이 돌아온다'}
                          </Text>
                        </View>
                      ) : null}
                      {inspectedHotspots.map((hotspot) => (
                        <View key={hotspot.id} style={styles.discoveryRow}>
                          <Check color="#91b1c8" size={13} />
                          <View style={styles.discoveryCopy}>
                            <Text style={styles.discoveryTitle}>{hotspot.label}</Text>
                            <Text style={styles.discoveryText}>{hotspot.discovery}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                  {investigation
                    && choices.length === 0
                    && availableInvestigationHotspots.length > 0 ? (
                    <View style={styles.investigationContinueHint}>
                      <View style={styles.investigationContinueGlyph}>
                        <Search color="#d5e7f2" size={15} strokeWidth={1.9} />
                      </View>
                      <View style={styles.investigationContinueCopy}>
                        <Text style={[styles.investigationContinueTitle, tabletUi && styles.investigationContinueTitleTablet]}>
                          {inspectedHotspots.length === 0
                            ? '장면에 표시된 지점을 직접 살핀다'
                            : '아직 확인할 수 있는 흔적이 남아 있다'}
                        </Text>
                        <Text style={[styles.investigationContinueText, tabletUi && styles.investigationContinueTextTablet]}>
                          {availableInvestigationHotspots.length}곳 조사 가능
                          {inspectedHotspots.length > 0 ? '  ·  화면의 표시를 선택' : ''}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {choices.length === 0
                    && !isComplete
                    && (
                      !investigation
                        || (inspectedHotspots.length > 0 && availableInvestigationHotspots.length === 0)
                    ) ? (
                    <View style={styles.lockedAction}>
                      <Text style={styles.lockedActionTitle}>
                        {investigation ? '찾아낸 사실을 연결해야 다음 길이 열린다.' : '아직 다음 수를 확신할 수 없다.'}
                      </Text>
                      <Text style={styles.lockedActionText}>
                        현장 기록의 추론 탭에서 관계있는 단서와 기억을 직접 선택한다.
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setShowFieldKit(true)}
                        style={({ pressed }) => [styles.lockedActionButton, pressed && styles.pressed]}
                      >
                        <MapPinned color="#d9e2eb" size={16} />
                        <Text style={styles.lockedActionButtonText}>현장 기록을 펼친다</Text>
                      </Pressable>
                    </View>
                  ) : null}
                  {choices.map((choice, index) => {
                    const foreknowledge = choice.kind === 'foreknowledge';
                    const evidenceChoice = choice.kind === 'evidence';
                    const continuation = choices.length === 1 && !foreknowledge && !evidenceChoice;
                    const presentation = getChoicePresentation(choice);
                    const visibleChoiceText = choice.text.replace(/^\[(?:기억|추론|증거)\]\s*/, '');
                    const timeCost = getActionTimeCost(choice.effects, engineState.volatile.time);
                    const clueEffect = choice.effects.find(
                      (effect) => effect.type === 'gainClue'
                        && !engineState.persistent.clueIds.includes(effect.clueId),
                    );
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${visibleChoiceText}${timeCost > 0 ? `, 사건 시각 ${timeCost}분 소요` : ''}`}
                        key={choice.id}
                        onPress={() => {
                          if (timeCost > 0) setTimeShiftCue(timeCost);
                          setChoiceOutcomeCue(
                            presentation.intervention
                              ? undefined
                              : presentation.outcome
                              ?? (clueEffect?.type === 'gainClue'
                                ? createClueCue(
                                    clueCueTitles[clueEffect.clueId] ?? '새로운 단서',
                                    engineState.persistent.clueIds.length === 0,
                                  )
                                : undefined),
                          );
                          setForeknowledgeIntervention(presentation.intervention);
                          setBeatIndex(0);
                          setBackgroundTransitionLocked(true);
                          commitInputEvent({ type: 'choiceSelected' });
                          selectChoice(choice.id);
                        }}
                        style={({ pressed }) => [
                          styles.choiceButton,
                          tabletUi && styles.choiceButtonTablet,
                          continuation && styles.continuationButton,
                          foreknowledge && styles.foreknowledgeButton,
                          evidenceChoice && styles.evidenceChoiceButton,
                          pressed && styles.choiceButtonPressed,
                        ]}
                      >
                        <View style={[styles.choiceNumber, foreknowledge && styles.choiceNumberMemory, evidenceChoice && styles.choiceNumberEvidence]}>
                          <Text style={[styles.choiceIndex, tabletUi && styles.choiceIndexTablet, foreknowledge && styles.foreknowledgeText, evidenceChoice && styles.evidenceChoiceText]}>
                            {foreknowledge ? '◈' : evidenceChoice ? '◇' : continuation ? '→' : String(index + 1).padStart(2, '0')}
                          </Text>
                        </View>
                        <View style={styles.choiceCopy}>
                          <Text style={[styles.choiceText, tabletUi && styles.choiceTextTablet, foreknowledge && styles.foreknowledgeText, evidenceChoice && styles.evidenceChoiceText]}>
                            {visibleChoiceText}
                          </Text>
                          <View style={styles.choiceMetaRow}>
                            <Text style={[styles.choiceMeta, tabletUi && styles.choiceMetaTablet, foreknowledge && styles.foreknowledgeMeta, evidenceChoice && styles.evidenceChoiceMeta]}>
                              {presentation.meta}
                            </Text>
                            {timeCost > 0 ? (
                              <View style={[styles.choiceTimeBadge, tabletUi && styles.choiceTimeBadgeTablet]}>
                                <Clock color="#b7c9d8" size={tabletUi ? 12 : 10} strokeWidth={1.8} />
                                <Text style={[styles.choiceTimeText, tabletUi && styles.choiceTimeTextTablet]}>+{timeCost}분</Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                        <ChevronRight
                          color={foreknowledge ? '#b79ee9' : evidenceChoice ? '#86c4e4' : '#708195'}
                          size={tabletUi ? 21 : 17}
                          strokeWidth={1.7}
                        />
                      </Pressable>
                    );
                  })}
                  {isComplete ? (
                    <View style={styles.endingSummary}>
                      <Text style={styles.endingEyebrow}>이번 밤에 확인한 것</Text>
                      <Text style={styles.endingFinding}>01:06 밀폐를 기억한 채 세 번째 밤을 시작했다. 다음에는 이송실 밖에서 맞은편 계단을 먼저 확인한다.</Text>
                      <View style={styles.endingStats}>
                        {[
                          ['반복', engineState.persistent.loopCount],
                          ['기억', engineState.persistent.memories.length],
                          ['단서', engineState.persistent.clueIds.length],
                          ['추론', engineState.persistent.deductionIds.length],
                        ].map(([label, value]) => (
                          <View key={label} style={styles.endingStat}>
                            <Text style={styles.endingStatValue}>
                              {String(value).padStart(2, '0')}
                            </Text>
                            <Text style={styles.endingStatLabel}>{label}</Text>
                          </View>
                        ))}
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setShowFieldKit(true)}
                        style={({ pressed }) => [styles.endingRecordButton, pressed && styles.pressed]}
                      >
                        <MapPinned color="#e4eaf0" size={16} />
                        <Text style={styles.endingRecordButtonText}>확보한 기록을 확인한다</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => confirmRestart(true)}
                        style={({ pressed }) => [styles.endingButton, pressed && styles.pressed]}
                      >
                        <RotateCcw color="#8996a4" size={14} />
                        <Text style={styles.endingButtonText}>첫 통화로 돌아간다</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              )}
            </ScrollView>
            {!sceneReady
              && !backgroundTransitionLocked
              && inputState.phase !== 'transitioning' ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  inputState.phase === 'ready'
                    ? '다음 대사'
                    : '현재 대사 전체 보기'
                }
                onPress={advanceDialogue}
                style={({ pressed }) => [
                  styles.advanceLayer,
                  pressed && styles.dialogPressed,
                ]}
              />
            ) : null}
          </View>
        </View>
        <View
          pointerEvents="none"
          style={[styles.bottomSafeScrim, { height: Math.max(insets.bottom, 24) }]}
        />
        {activeTutorialGuide
          && !showTitleMenu
          && !showPauseMenu
          && !showFieldKit
          && !foreknowledgeIntervention
          && !isDead ? (
          <View accessibilityViewIsModal style={styles.tutorialOverlay}>
            <View style={styles.tutorialBackdrop} />
            <View style={[
              styles.tutorialCard,
              tabletUi && styles.tutorialCardTablet,
              { width: Math.min(tabletUi ? 560 : 420, viewportWidth - 36) },
            ]}>
              <View style={styles.tutorialProgress}>
                {tutorialGuideIds.map((guideId, index) => (
                  <View
                    key={guideId}
                    style={[
                      styles.tutorialProgressStep,
                      index < activeTutorialGuide.step && styles.tutorialProgressStepActive,
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.tutorialEyebrow, tabletUi && styles.tutorialEyebrowTablet]}>
                조작 안내 {activeTutorialGuide.step}/3 · {activeTutorialGuide.eyebrow}
              </Text>
              <Text style={[styles.tutorialTitle, tabletUi && styles.tutorialTitleTablet]}>
                {activeTutorialGuide.title}
              </Text>
              <Text style={[styles.tutorialDetail, tabletUi && styles.tutorialDetailTablet]}>
                {activeTutorialGuide.detail}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => markTutorialGuideSeen(activeTutorialGuide.id)}
                style={({ pressed }) => [
                  styles.tutorialButton,
                  tabletUi && styles.tutorialButtonTablet,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.tutorialButtonText, tabletUi && styles.tutorialButtonTextTablet]}>
                  {activeTutorialGuide.action}
                </Text>
                <ChevronRight color="#0a1118" size={18} strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        ) : null}
        {showFieldKit ? (
          <FieldKit
            state={engineState}
            visitedLocationIds={visitedLocationIds}
            onClose={() => {
              setShowFieldKit(false);
              if (recordsReturnToTitle) {
                setRecordsReturnToTitle(false);
                setShowTitleMenu(true);
              }
            }}
            initialTab={availableDeductionCount > 0 ? 'deduction' : 'map'}
            initialDeductionId={contextualDeductionId}
            topInset={insets.top}
            bottomInset={insets.bottom}
            onFormDeduction={formDeduction}
          />
        ) : null}
        {showTitleMenu ? (
          <GameMenu
            mode="title"
            hasProgress={hasProgress}
            topInset={insets.top}
            bottomInset={insets.bottom}
            onContinue={() => setShowTitleMenu(false)}
            onNewGame={() => confirmRestart(true)}
            onOpenRecords={fieldKitAvailable ? () => {
              setRecordsReturnToTitle(true);
              setShowTitleMenu(false);
              setShowFieldKit(true);
            } : undefined}
          />
        ) : null}
        {showPauseMenu ? (
          <GameMenu
            mode="pause"
            hasProgress={hasProgress}
            topInset={insets.top}
            bottomInset={insets.bottom}
            onContinue={() => setShowPauseMenu(false)}
            onNewGame={() => confirmRestart(true)}
            onOpenRecords={() => {
              setShowPauseMenu(false);
              setShowFieldKit(true);
            }}
            onReturnToTitle={() => {
              setShowPauseMenu(false);
              setShowTitleMenu(true);
            }}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#05070b',
  },
  loadingText: {
    color: '#738493',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  safeArea: { flex: 1, backgroundColor: '#05070b' },
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#05070b' },
  stage: { position: 'relative', overflow: 'hidden', backgroundColor: '#080d14' },
  stageOverlay: { ...StyleSheet.absoluteFillObject },
  sceneBackgroundImage: { position: 'absolute' },
  colorWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 13, 22, 0.22)',
  },
  colorWashStopped: { backgroundColor: 'rgba(20, 7, 13, 0.28)' },
  stageTopShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 84,
    backgroundColor: 'rgba(4, 8, 13, 0.3)',
  },
  stageBottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'rgba(4, 7, 12, 0.2)',
  },
  filmEdgeLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: 'rgba(3, 5, 8, 0.7)',
  },
  filmEdgeRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 4,
    backgroundColor: 'rgba(3, 5, 8, 0.7)',
  },
  pauseButton: {
    position: 'absolute',
    zIndex: 45,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5, 11, 18, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(159, 181, 199, 0.26)',
  },
  incidentClock: {
    position: 'absolute',
    zIndex: 44,
    width: 128,
    minHeight: 44,
    left: '50%',
    marginLeft: -64,
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 7,
    borderRadius: 9,
    backgroundColor: 'rgba(4, 9, 15, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(151, 179, 199, 0.22)',
  },
  incidentClockTablet: { width: 160, minHeight: 52, marginLeft: -80, paddingHorizontal: 13, paddingTop: 7 },
  incidentClockHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  incidentClockLabel: { flex: 1, color: '#8195a6', fontSize: 7, fontWeight: '900', letterSpacing: 0.9 },
  incidentClockLabelTablet: { fontSize: 9, letterSpacing: 1.1 },
  timeShiftText: { color: '#d5b997', fontSize: 7, fontWeight: '900' },
  timeShiftTextTablet: { fontSize: 9 },
  incidentClockTimeRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 2 },
  incidentClockTime: { color: '#f0f4f7', fontSize: 15, fontWeight: '400', letterSpacing: 1.2 },
  incidentClockTimeTablet: { fontSize: 19, letterSpacing: 1.6 },
  incidentClockLoop: { color: '#7f6d9e', fontSize: 6, fontWeight: '900' },
  incidentClockLoopTablet: { fontSize: 8 },
  incidentClockRail: { height: 2, marginTop: 4, backgroundColor: 'rgba(113, 137, 157, 0.18)', overflow: 'hidden' },
  incidentClockFill: { height: '100%', backgroundColor: '#8e779f' },
  midnightMarker: { position: 'absolute', left: '33.333%', top: 0, bottom: 0, width: 1, backgroundColor: '#dac9ea' },
  fieldKitFloatingButton: {
    position: 'absolute',
    zIndex: 45,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5, 11, 18, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(159, 181, 199, 0.26)',
  },
  fieldKitFloatingButtonActive: {
    backgroundColor: 'rgba(37, 26, 55, 0.82)',
    borderColor: 'rgba(172, 141, 229, 0.58)',
  },
  fieldKitFloatingBadge: {
    position: 'absolute',
    right: -3,
    bottom: -2,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b2a35',
    borderWidth: 1,
    borderColor: 'rgba(190, 208, 221, 0.34)',
  },
  fieldKitFloatingBadgeActive: {
    backgroundColor: '#392652',
    borderColor: 'rgba(202, 179, 242, 0.62)',
  },
  fieldKitFloatingCount: { color: '#c9d4dd', fontSize: 8, fontWeight: '900' },
  characterAnchor: { position: 'absolute', zIndex: 3 },
  remoteCallFrame: {
    position: 'absolute',
    zIndex: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(126, 176, 204, 0.42)',
    backgroundColor: 'rgba(8, 24, 34, 0.08)',
    overflow: 'hidden',
  },
  remoteCallScanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '52%',
    height: 1,
    backgroundColor: 'rgba(153, 207, 232, 0.18)',
  },
  remoteCallLabel: {
    position: 'absolute',
    top: 8,
    left: 10,
    color: 'rgba(186, 219, 234, 0.78)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  characterSprite: { position: 'relative' },
  characterSpritePortrait: { overflow: 'hidden' },
  characterLayer: { ...StyleSheet.absoluteFillObject },
  characterGroundShadow: {
    position: 'absolute',
    left: '24%',
    right: '24%',
    bottom: '1.2%',
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 2, 5, 0.32)',
    transform: [{ scaleX: 1.12 }],
  },
  characterGroundShadowStopped: { backgroundColor: 'rgba(35, 0, 8, 0.4)' },
  characterGroundShadowInactive: { opacity: 0.22 },
  characterShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.48,
    tintColor: '#02050a',
    transform: [{ translateX: 7 }, { translateY: 9 }, { scale: 1.015 }],
  },
  characterShadowStopped: { opacity: 0.6, tintColor: '#130208' },
  characterShadowInactive: { opacity: 0.24 },
  characterImage: { width: '100%', height: '100%', opacity: 0.96 },
  characterDimmer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.48,
    tintColor: '#050b13',
  },
  characterPortraitFull: {
    position: 'absolute',
    top: '-2%',
    left: '-72.5%',
    width: '245%',
    height: '245%',
  },
  characterPortraitDuoFull: {
    top: '-1.5%',
    left: '-82.5%',
    width: '265%',
    height: '265%',
  },
  hotspot: {
    position: 'absolute',
    zIndex: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(211, 230, 244, 0.72)',
    backgroundColor: 'rgba(7, 15, 23, 0.72)',
    shadowColor: '#b7dcf4',
    shadowOpacity: 0.36,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  hotspotPulse: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(194, 224, 244, 0.2)',
  },
  hotspotInspected: { opacity: 0.58, borderColor: 'rgba(134, 163, 184, 0.4)' },
  hotspotMissed: { opacity: 0.34, borderColor: 'rgba(126, 77, 86, 0.42)' },
  hotspotPressed: { transform: [{ scale: 0.94 }] },
  hotspotLabel: { color: '#afc2d1', fontSize: 7, fontWeight: '900', marginTop: 1 },
  hotspotMissedMark: { color: '#9e6e78', fontSize: 17, lineHeight: 17, fontWeight: '500' },
  choiceOutcomeCue: {
    position: 'absolute',
    zIndex: 27,
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderLeftWidth: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(7, 12, 18, 0.88)',
    shadowColor: '#000',
    shadowOpacity: 0.38,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  choiceOutcomeCueTablet: {
    minHeight: 96,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderLeftWidth: 3,
    borderRadius: 7,
  },
  choiceOutcomeEyebrow: {
    color: '#9ba9b7',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.35,
  },
  choiceOutcomeEyebrowTablet: { fontSize: 10, letterSpacing: 1.6 },
  choiceOutcomeTitle: { color: '#f0f3f6', fontSize: 13, fontWeight: '800', marginTop: 4 },
  choiceOutcomeTitleTablet: { fontSize: 18, marginTop: 5 },
  choiceOutcomeDetail: { color: '#8897a6', fontSize: 9, lineHeight: 14, marginTop: 3 },
  choiceOutcomeDetailTablet: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  interventionOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  interventionBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 3, 8, 0.82)',
  },
  interventionCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184, 151, 235, 0.5)',
    backgroundColor: 'rgba(9, 9, 17, 0.98)',
    shadowColor: '#000',
    shadowOpacity: 0.78,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 26,
  },
  interventionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(177, 145, 226, 0.2)',
  },
  interventionGlyph: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(115, 80, 163, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(191, 157, 242, 0.44)',
  },
  interventionHeaderCopy: { flex: 1 },
  interventionEyebrow: { color: '#a487dc', fontSize: 8, fontWeight: '900', letterSpacing: 1.8 },
  interventionEyebrowTablet: { fontSize: 10, letterSpacing: 2.1 },
  interventionTitle: { color: '#f1ebff', fontSize: 19, fontWeight: '800', marginTop: 4 },
  interventionTitleTablet: { fontSize: 25, marginTop: 6 },
  interventionTimeline: { position: 'relative', marginTop: 18, gap: 7 },
  interventionTimelineRail: {
    position: 'absolute',
    left: 6,
    top: 13,
    bottom: 13,
    width: 1,
    backgroundColor: 'rgba(160, 133, 204, 0.34)',
  },
  interventionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  interventionNode: {
    width: 13,
    height: 13,
    marginTop: 3,
    borderRadius: 7,
    borderWidth: 2,
  },
  interventionNodeKnown: { borderColor: '#755e70', backgroundColor: '#241922' },
  interventionNodeChanged: {
    borderColor: '#c8a8ff',
    backgroundColor: '#6c4d9d',
    shadowColor: '#c5a7fa',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  interventionCopy: { flex: 1 },
  interventionLabel: { color: '#776f7c', fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  interventionChangedLabel: { color: '#a28acb' },
  interventionText: { color: '#a29ba5', fontSize: 14, lineHeight: 21, fontWeight: '600', marginTop: 4 },
  interventionTextTablet: { fontSize: 18, lineHeight: 27 },
  interventionKnownText: { color: '#77717a', textDecorationLine: 'line-through' },
  interventionChangedText: { color: '#eee6ff' },
  interventionShift: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 1, paddingVertical: 2 },
  interventionShiftMark: { width: 13, color: '#9d81d1', fontSize: 13, textAlign: 'center' },
  interventionShiftText: { color: '#8f76ba', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  interventionConsequence: {
    marginTop: 18,
    padding: 13,
    borderRadius: 8,
    backgroundColor: 'rgba(104, 75, 148, 0.17)',
    borderLeftWidth: 2,
    borderLeftColor: '#aa87e1',
  },
  interventionConsequenceLabel: { color: '#9c82c7', fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  interventionConsequenceText: { color: '#d8cee8', fontSize: 12, lineHeight: 18, marginTop: 4 },
  interventionConsequenceTextTablet: { fontSize: 16, lineHeight: 24 },
  interventionContinue: {
    minHeight: 50,
    marginTop: 16,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#bda3e9',
  },
  interventionContinueTablet: { minHeight: 58, marginTop: 20, paddingHorizontal: 20 },
  interventionContinueText: { color: '#18111f', fontSize: 13, fontWeight: '900' },
  interventionContinueTextTablet: { fontSize: 16 },
  memoryBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    backgroundColor: 'rgba(2, 4, 8, 0.58)',
  },
  memoryOverlay: {
    position: 'absolute',
    zIndex: 60,
    padding: 16,
    backgroundColor: 'rgba(8, 9, 16, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(158, 129, 218, 0.62)',
    shadowColor: '#000',
    shadowOpacity: 0.72,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
  },
  memoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  memoryEyebrow: { color: '#9177ca', fontSize: 7, fontWeight: '900', letterSpacing: 1.6 },
  memoryPanelTitle: { color: '#f0eaff', fontSize: 17, fontWeight: '800', marginTop: 4 },
  memoryClose: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  memoryEntry: {
    flexDirection: 'row',
    gap: 11,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: 'rgba(152, 127, 207, 0.2)',
  },
  memoryIndex: { color: '#8068b3', fontSize: 9, fontWeight: '800', paddingTop: 2 },
  memoryCopy: { flex: 1 },
  memoryTitle: { color: '#d7c9f5', fontSize: 13, fontWeight: '700' },
  memoryDescription: { color: '#aaa3b8', fontSize: 11, lineHeight: 17, marginTop: 3 },
  dialogDock: {
    position: 'absolute',
    bottom: 0,
    zIndex: 30,
  },
  bottomSafeScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 31,
    backgroundColor: '#020408',
  },
  dialogFrame: {
    flex: 1,
    paddingTop: 54,
  },
  dialogFrameChoice: { paddingTop: 40 },
  dialogFrameTabletLandscape: { paddingTop: 48 },
  dialogFrameTabletPortrait: { paddingTop: 68 },
  dialogPressed: { opacity: 0.94 },
  advanceLayer: {
    position: 'absolute',
    top: 88,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  dialogHeader: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  titleBlock: { flex: 1 },
  speakerRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  speakerName: { color: '#f0f3f6', fontSize: 13, fontWeight: '800', letterSpacing: 0.15 },
  speakerNameTablet: { fontSize: 18, letterSpacing: 0.2 },
  sceneTitle: { color: '#f3f5f7', fontSize: 20, lineHeight: 26, fontWeight: '700', letterSpacing: -0.35, marginTop: 4 },
  titleReveal: { fontSize: 24, lineHeight: 31, fontWeight: '300', letterSpacing: 3.5 },
  titleRevealTablet: { fontSize: 30, lineHeight: 38, letterSpacing: 4.2 },
  toolTextActive: { color: '#d8c9ff' },
  bodyScroll: {
    flexGrow: 0,
    flexShrink: 1,
    width: '100%',
    maxWidth: 920,
    maxHeight: '86%',
    alignSelf: 'center',
  },
  storyContent: { paddingTop: 5, paddingBottom: 10 },
  bodyText: { color: '#e3e7ec', fontSize: 18, lineHeight: 29, letterSpacing: -0.12 },
  bodyTextTablet: { fontSize: 24, lineHeight: 38, letterSpacing: -0.2 },
  choiceContextText: { color: '#d8dde3', fontSize: 16, lineHeight: 24 },
  choiceContextTextTablet: { fontSize: 21, lineHeight: 32 },
  endingBodyText: { color: '#c9d0d9', textAlign: 'center', paddingVertical: 12 },
  advanceIndicator: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 2,
    color: 'rgba(204, 216, 228, 0.66)',
    fontSize: 16,
    lineHeight: 18,
  },
  advanceIndicatorTablet: { fontSize: 20, lineHeight: 24, marginTop: 6 },
  choiceList: {
    gap: 2,
    marginTop: 8,
    marginHorizontal: -12,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  choiceListTablet: {
    gap: 7,
    marginTop: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  choiceHeading: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  choiceEyebrow: { color: '#aeb9c5', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  choiceEyebrowTablet: { fontSize: 11, letterSpacing: 1.5 },
  choiceHint: { color: '#687788', fontSize: 9 },
  choiceHintTablet: { fontSize: 11 },
  investigationSummary: { gap: 7, marginBottom: 8 },
  investigationPrompt: { color: '#aebbc7', fontSize: 11, lineHeight: 17, marginBottom: 2 },
  investigationPromptTablet: { fontSize: 14, lineHeight: 21 },
  investigationContinueHint: {
    minHeight: 54,
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(35, 69, 88, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(121, 170, 198, 0.18)',
  },
  investigationContinueGlyph: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91, 143, 172, 0.18)',
  },
  investigationContinueCopy: { flex: 1 },
  investigationContinueTitle: { color: '#d9e4eb', fontSize: 11, fontWeight: '800' },
  investigationContinueTitleTablet: { fontSize: 14 },
  investigationContinueText: { color: '#7e9bae', fontSize: 9, fontWeight: '700', marginTop: 3 },
  investigationContinueTextTablet: { fontSize: 11, marginTop: 4 },
  investigationBudget: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 9,
    borderRadius: 7,
    backgroundColor: 'rgba(99, 70, 75, 0.12)',
  },
  investigationBudgetLabel: { color: '#a59195', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  investigationBudgetTicks: { flexDirection: 'row', gap: 3 },
  investigationBudgetTick: { width: 22, height: 2, backgroundColor: '#8db3c9' },
  investigationBudgetTickUsed: { backgroundColor: '#78545b' },
  investigationBudgetText: { flex: 1, color: '#7f8d99', fontSize: 9, textAlign: 'right' },
  discoveryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 7, paddingHorizontal: 9, borderRadius: 8, backgroundColor: 'rgba(91, 121, 145, 0.1)' },
  discoveryCopy: { flex: 1 },
  discoveryTitle: { color: '#d8e0e7', fontSize: 10, fontWeight: '800' },
  discoveryText: { color: '#7f8f9e', fontSize: 9, lineHeight: 14, marginTop: 2 },
  choiceButton: {
    minHeight: 48,
    paddingHorizontal: 2,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(126, 149, 172, 0.45)',
    backgroundColor: 'rgba(3, 7, 12, 0.18)',
  },
  choiceButtonTablet: {
    minHeight: 62,
    paddingHorizontal: 4,
    paddingVertical: 11,
    gap: 11,
  },
  continuationButton: {
    borderLeftColor: 'rgba(111, 133, 153, 0.28)',
    backgroundColor: 'rgba(3, 7, 12, 0.08)',
  },
  foreknowledgeButton: { borderLeftColor: 'rgba(174, 139, 232, 0.68)' },
  evidenceChoiceButton: {
    borderLeftColor: 'rgba(105, 178, 215, 0.72)',
    backgroundColor: 'rgba(15, 47, 65, 0.18)',
  },
  choiceButtonPressed: { backgroundColor: 'rgba(131, 151, 174, 0.12)' },
  choiceNumber: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceNumberMemory: {},
  choiceNumberEvidence: {},
  choiceIndex: { color: '#8292a4', fontSize: 8, fontWeight: '900' },
  choiceIndexTablet: { fontSize: 10 },
  choiceText: {
    color: '#edf0f4',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  choiceTextTablet: { fontSize: 20, lineHeight: 30 },
  choiceCopy: { flex: 1, paddingVertical: 2 },
  choiceMetaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7, marginTop: 4 },
  choiceMeta: { color: '#718194', fontSize: 9, lineHeight: 18, fontWeight: '700' },
  choiceMetaTablet: { fontSize: 12, lineHeight: 22 },
  choiceTimeBadge: { minHeight: 20, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, backgroundColor: 'rgba(91, 122, 147, 0.2)', borderWidth: 1, borderColor: 'rgba(142, 174, 197, 0.28)' },
  choiceTimeBadgeTablet: { minHeight: 24, paddingHorizontal: 9, borderRadius: 12 },
  choiceTimeText: { color: '#b7c9d8', fontSize: 9, fontWeight: '900', letterSpacing: 0.2 },
  choiceTimeTextTablet: { fontSize: 11 },
  foreknowledgeMeta: { color: '#9179c2' },
  evidenceChoiceMeta: { color: '#6fa9c7' },
  lockedAction: { padding: 14, borderRadius: 10, backgroundColor: 'rgba(86, 70, 113, 0.16)', borderWidth: 1, borderColor: 'rgba(154, 126, 201, 0.26)' },
  lockedActionTitle: { color: '#ece8f3', fontSize: 14, fontWeight: '700' },
  lockedActionText: { color: '#928ba0', fontSize: 11, lineHeight: 17, marginTop: 4 },
  lockedActionButton: { minHeight: 48, marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, backgroundColor: 'rgba(137, 119, 170, 0.22)' },
  lockedActionButtonText: { color: '#d9e2eb', fontSize: 11, fontWeight: '900' },
  foreknowledgeText: { color: '#d2c0f5' },
  evidenceChoiceText: { color: '#bfe8fa' },
  actionDock: {
    marginTop: 18,
    paddingTop: 14,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(146, 54, 69, 0.28)',
  },
  deathBlock: { paddingBottom: 4 },
  deathEyebrow: { color: '#d65b6d', fontSize: 7, fontWeight: '900', letterSpacing: 1.8 },
  deathTitle: { color: '#fae9ec', fontSize: 19, fontWeight: '700', marginTop: 6 },
  deathDescription: { color: '#c6aeb2', fontSize: 11, lineHeight: 17, marginTop: 6 },
  deathMemoryProgress: {
    minHeight: 24,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deathMemoryStep: {
    width: 24,
    height: 2,
    backgroundColor: 'rgba(135, 58, 70, 0.34)',
  },
  deathMemoryStepComplete: { backgroundColor: '#d65b6d' },
  deathMemoryProgressText: {
    color: '#806f74',
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 2,
  },
  deathMemoryFragments: { gap: 5, marginTop: 5 },
  deathMemoryFragment: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(129, 72, 82, 0.56)',
    backgroundColor: 'rgba(35, 13, 19, 0.38)',
  },
  deathMemoryFragmentAccepted: {
    borderLeftColor: '#d65b6d',
    backgroundColor: 'rgba(87, 28, 39, 0.42)',
  },
  deathMemoryFragmentMistaken: {
    borderLeftColor: '#8e3949',
    backgroundColor: 'rgba(78, 19, 30, 0.32)',
  },
  deathMemoryFragmentIndex: {
    width: 18,
    color: '#9b626c',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  deathMemoryFragmentText: {
    flex: 1,
    color: '#d3c8cb',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  deathMemoryFragmentTextAccepted: { color: '#fae9ec' },
  deathMemoryHint: { color: '#806f74', fontSize: 9, lineHeight: 14, marginTop: 7 },
  deathMemoryMistake: { color: '#b96977', fontSize: 9, lineHeight: 14, marginTop: 7 },
  primaryButton: {
    minHeight: 50,
    marginTop: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#edf0f3',
  },
  primaryButtonText: { color: '#10151c', fontSize: 13, fontWeight: '900' },
  endingButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 3,
  },
  endingButtonText: { color: '#8996a4', fontSize: 10, fontWeight: '700' },
  endingSummary: {
    marginTop: 7,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(127, 151, 174, 0.22)',
  },
  endingEyebrow: { color: '#8fa0b1', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  endingFinding: { color: '#eef2f5', fontSize: 15, lineHeight: 22, fontWeight: '700', marginTop: 5 },
  endingStats: {
    minHeight: 54,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(90, 113, 135, 0.09)',
  },
  endingStat: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  endingStatValue: { color: '#e0e7ed', fontSize: 14, fontWeight: '800' },
  endingStatLabel: { color: '#718091', fontSize: 8, fontWeight: '800', marginTop: 2 },
  endingRecordButton: {
    minHeight: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#8fb1ca',
    backgroundColor: 'rgba(117, 145, 170, 0.18)',
  },
  endingRecordButtonText: { color: '#e4eaf0', fontSize: 12, fontWeight: '900' },
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  tutorialBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 5, 9, 0.72)' },
  tutorialCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(7, 14, 21, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(145, 177, 200, 0.42)',
    shadowColor: '#000',
    shadowOpacity: 0.68,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
  },
  tutorialCardTablet: { padding: 28, borderRadius: 18 },
  tutorialProgress: { flexDirection: 'row', gap: 5, marginBottom: 16 },
  tutorialProgressStep: { flex: 1, height: 2, backgroundColor: 'rgba(110, 135, 155, 0.2)' },
  tutorialProgressStepActive: { backgroundColor: '#9db8ca' },
  tutorialEyebrow: { color: '#829bad', fontSize: 8, fontWeight: '900', letterSpacing: 1.15 },
  tutorialEyebrowTablet: { fontSize: 10, letterSpacing: 1.5 },
  tutorialTitle: { color: '#f1f5f7', fontSize: 20, lineHeight: 27, fontWeight: '800', marginTop: 7 },
  tutorialTitleTablet: { fontSize: 27, lineHeight: 35, marginTop: 9 },
  tutorialDetail: { color: '#9daab5', fontSize: 12, lineHeight: 19, marginTop: 9 },
  tutorialDetailTablet: { fontSize: 16, lineHeight: 25, marginTop: 12 },
  tutorialButton: {
    minHeight: 52,
    marginTop: 20,
    paddingHorizontal: 16,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d7e1e8',
  },
  tutorialButtonTablet: { minHeight: 62, marginTop: 26, paddingHorizontal: 20 },
  tutorialButtonText: { color: '#0a1118', fontSize: 12, fontWeight: '900' },
  tutorialButtonTextTablet: { fontSize: 15 },
  pressed: { opacity: 0.7 },
});
