import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
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
  Check,
  ChevronRight,
  MapPinned,
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
  SCENE_LOOP2_SEA_FIRST_MEETING,
  SCENE_LOOP2_FIRST_CALL_TEST,
  SCENE_LOOP2_PHONE_PARADOX,
  SCENE_LOOP2_RETURN_302,
  SCENE_LOOP2_SECOND_PHONE,
  SCENE_LOOP2_SEOYUN_RECHECK,
  SCENE_LOOP2_TAEJUN_REJECTION,
  SCENE_VERTICAL_SLICE_END,
  SCENE_VERTICAL_SLICE_TITLE,
  prologueScenes,
} from '../content/prologue';
import { getAvailableChoices } from '../engine';
import type { NarrativeScene } from '../engine';
import { useNarrativeStore } from '../store/useNarrativeStore';
import {
  getDialogueBeats,
  speakerLabels,
  type SpeakerId,
} from './dialogueBeats';
import { FieldKit } from './FieldKit';
import {
  canInspectHotspot,
  getUsedSearchOpportunities,
  isHotspotInspected,
  sceneInvestigations,
} from '../gameplay/investigation';
import {
  createDeathMemoryState,
  firstDeathMemoryFragments,
  firstDeathMemorySequence,
  isDeathMemoryComplete,
  selectDeathMemoryFragment,
} from '../gameplay/deathMemory';
import {
  getChoicePresentation,
  type ChoiceOutcomeCue,
} from '../gameplay/choicePresentation';
import {
  getCharacterStageAnchors,
  getCoverPlacement,
  getGameLayout,
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
  yujinAlarmed: require('../../assets/characters/yujin/sprites/CHAR_Yujin_Alarmed_Full_v02.png'),
  taejunWatchful: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Watchful_Bust_v02.png'),
  taejunCold: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Cold_Bust_v02.png'),
  seaWary: require('../../assets/characters/sea/sprites/CHAR_Sea_Wary_Full_v01.png'),
  seaConfused: require('../../assets/characters/sea/sprites/CHAR_Sea_Confused_Full_v02.png'),
};

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
  id: Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'>;
  source: ImageSourcePropType;
  name: string;
  expression: 'tense' | 'frightened' | 'guarded' | 'alarmed' | 'wary' | 'confused' | 'watchful' | 'cold';
  crop: 'bust' | 'full';
  scale?: number;
};

const expressionLabels: Readonly<Record<CharacterVisual['expression'], string>> = {
  tense: '긴장한 표정',
  frightened: '겁먹은 표정',
  guarded: '경계하는 표정',
  alarmed: '놀란 표정',
  wary: '경계하는 표정',
  confused: '혼란스러운 표정',
  watchful: '주시하는 표정',
  cold: '차가운 표정',
};

const defaultCharacterVisuals: Readonly<
  Record<Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'>, CharacterVisual>
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
    crop: 'bust',
    scale: 1.02,
  },
  sea: {
    id: 'sea',
    source: characterSprites.seaWary,
    name: '윤세아',
    expression: 'wary',
    crop: 'full',
    scale: 1.03,
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
    crop: 'bust',
    scale: 1.02,
  },
  [SCENE_LOOP2_TAEJUN_REJECTION]: {
    id: 'taejun',
    source: characterSprites.taejunCold,
    name: '강태준',
    expression: 'cold',
    crop: 'bust',
    scale: 1.02,
  },
  [SCENE_LOOP2_SEA_FIRST_MEETING]: {
    id: 'sea',
    source: characterSprites.seaWary,
    name: '윤세아',
    expression: 'wary',
    crop: 'full',
    scale: 1.03,
  },
};

type CharacterExpressionRule = {
  speaker: Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'>;
  visual: CharacterVisual;
  fromBeat?: number;
  toBeat?: number;
};

const seoyunFrightenedVisual: CharacterVisual = {
  ...defaultCharacterVisuals.seoyun,
  source: characterSprites.seoyunPhoneFrightened,
  expression: 'frightened',
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
  [SCENE_ACT0_MESSAGES]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual },
  ],
  [SCENE_ACT0_LAST_CALL]: [
    { speaker: 'seoyun', visual: seoyunFrightenedVisual },
  ],
  [SCENE_ACT1_YUJIN_WARNING]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual },
  ],
  [SCENE_LOOP2_FIRST_CALL_TEST]: [
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 13 },
  ],
  [SCENE_LOOP2_PHONE_PARADOX]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual },
  ],
  [SCENE_LOOP2_SEOYUN_RECHECK]: [
    { speaker: 'seoyun', visual: seoyunGuardedVisual },
  ],
  [SCENE_LOOP2_SECOND_PHONE]: [
    { speaker: 'seoyun', visual: seoyunFrightenedVisual, fromBeat: 6 },
  ],
  [SCENE_LOOP2_SEA_FIRST_MEETING]: [
    { speaker: 'sea', visual: seaConfusedVisual, fromBeat: 4 },
  ],
};

type DuoSceneCast = {
  left: Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'>;
  right: Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'>;
  rightAppearsAtBeat?: number;
  mirrorLeft?: boolean;
};

const duoSceneCasts: Readonly<Partial<Record<string, DuoSceneCast>>> = {
  [SCENE_ACT1_YUJIN_WARNING]: {
    left: 'seoyun',
    right: 'yujin',
  },
  [SCENE_LOOP2_SEA_FIRST_MEETING]: {
    left: 'sea',
    right: 'taejun',
    rightAppearsAtBeat: 10,
    mirrorLeft: true,
  },
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
  if (scene.id === SCENE_ACT3_MAP_AND_TAEJUN) {
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
  if (scene.locationId === 'B1_OPERATIONS_CORRIDOR') {
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
): speaker is Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'> {
  return speaker === 'seoyun' || speaker === 'yujin' || speaker === 'taejun' || speaker === 'sea';
}

function getPresentedCharacterSpeaker(
  beats: ReturnType<typeof getDialogueBeats>,
  beatIndex: number,
): Extract<SpeakerId, 'seoyun' | 'yujin' | 'taejun' | 'sea'> | undefined {
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

  const characterOpacity = illumination.interpolate({
    inputRange: [0, 1],
    outputRange: [choiceMode ? 0.58 : 0.76, choiceMode ? 0.84 : stopped ? 0.88 : 1],
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
    </View>
  );
}

function BottomDialogueGradient() {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <LinearGradient id="dialogueFade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#03060a" stopOpacity="0" />
          <Stop offset="0.28" stopColor="#03060a" stopOpacity="0.3" />
          <Stop offset="0.58" stopColor="#03060a" stopOpacity="0.72" />
          <Stop offset="1" stopColor="#03060a" stopOpacity="0.94" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dialogueFade)" />
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
  const focalPoint = sceneBackgroundFocalPoints[scene.id]
    ?? locationBackgroundFocalPoints[scene.locationId];
  return {
    id: `${scene.id}:${portrait ? 'portrait' : 'wide'}`,
    source: getBackground(scene, portrait),
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
  const [showFieldKit, setShowFieldKit] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [deathMemoryState, setDeathMemoryState] = useState(createDeathMemoryState);
  const [choiceOutcomeCue, setChoiceOutcomeCue] = useState<ChoiceOutcomeCue>();
  const [backgroundTransitionLocked, setBackgroundTransitionLocked] = useState(false);
  const storyScrollRef = useRef<ScrollView>(null);
  const activeBackgroundTransitionRef = useRef<string | undefined>(undefined);
  const engineState = useNarrativeStore((store) => store.engineState);
  const selectChoice = useNarrativeStore((store) => store.selectChoice);
  const formDeduction = useNarrativeStore((store) => store.formDeduction);
  const inspectHotspot = useNarrativeStore((store) => store.inspectHotspot);
  const beginNextLoop = useNarrativeStore((store) => store.beginNextLoop);
  const restartStory = useNarrativeStore((store) => store.restartStory);
  const scene = prologueScenes[engineState.volatile.currentSceneId];
  const visitedLocationIds = useMemo(
    () => Array.from(new Set(
      engineState.volatile.visitedSceneIds
        .map((sceneId) => prologueScenes[sceneId]?.locationId)
        .filter((locationId): locationId is NarrativeScene['locationId'] => locationId !== undefined),
    )),
    [engineState.volatile.visitedSceneIds],
  );
  const choices = getAvailableChoices(scene, engineState);
  const investigation = sceneInvestigations[scene.id];
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
  const character = presentedCharacterSpeaker && !investigationReady
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
  const backgroundVisual = getBackgroundVisual(scene, viewportHeight > viewportWidth);
  const isDead = engineState.volatile.deathId !== undefined;
  const deathIntel = engineState.persistent.deathIntel.find(
    (intel) => intel.deathId === engineState.volatile.deathId,
  );
  const retainedDeathMemory = engineState.persistent.memories.find(
    (memory) => memory.id === deathIntel?.memoryId,
  );
  const deathMemoryComplete = isDeathMemoryComplete(deathMemoryState);
  const isTitle = scene.id === SCENE_VERTICAL_SLICE_TITLE;
  const isComplete = scene.id === SCENE_VERTICAL_SLICE_END;
  const stopped = isWatchStopped(scene);
  const hasPersistentMemory = engineState.persistent.memories.length > 0;
  const fieldRecordCount = engineState.persistent.clueIds.length
    + engineState.volatile.itemIds.length
    + engineState.persistent.memories.length;
  const fieldKitAvailable = engineState.volatile.visitedSceneIds.length > 1;
  const sceneReady = inputState.phase === 'ready' && isLastBeat;
  const inspectedHotspots = investigation?.hotspots.filter((hotspot) =>
    isHotspotInspected(engineState, scene.id, hotspot.id),
  ) ?? [];
  const usedSearchOpportunities = investigation
    ? getUsedSearchOpportunities(engineState, investigation)
    : 0;

  const commitInputEvent = (event: NarrativeInputEvent) => {
    const result = updateNarrativeInput(inputStateRef.current, event);
    inputStateRef.current = result.state;
    setInputState(result.state);
    if (result.command === 'advance' && !isLastBeat) {
      setBeatIndex((index) => Math.min(index + 1, dialogueBeats.length - 1));
    }
  };

  useEffect(() => {
    setBeatIndex(0);
  }, [scene.id]);

  useEffect(() => {
    setDeathMemoryState(createDeathMemoryState());
  }, [engineState.volatile.deathId]);

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

  const confirmRestart = () => {
    const run = () => {
      setShowFieldKit(false);
      setBeatIndex(0);
      setBackgroundTransitionLocked(true);
      commitInputEvent({ type: 'choiceSelected' });
      restartStory();
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

  const dialogueHeight = Math.min(
    layout.mode === 'landscape' ? 350 : isDead ? 560 : isComplete ? 580 : 470,
    Math.max(
      layout.mode === 'landscape' ? 240 : isDead ? 410 : isComplete ? 420 : 310,
      viewportHeight * (
        layout.mode === 'landscape' ? 0.5 : isDead ? 0.55 : isComplete ? 0.56 : 0.41
      ),
    ),
  );
  const dialogueSidePadding = Math.max(
    24,
    layout.horizontalGutter,
    insets.left + 16,
    insets.right + 16,
  );
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
            const horizontalPosition = characterStageAnchors[index];

            return (
              <View
                key={stagedCharacter.id}
                pointerEvents="none"
                style={[
                  styles.characterAnchor,
                  horizontalPosition,
                  {
                    bottom: portraitStage ? Math.round(dialogueHeight * 0.64) : -6,
                    zIndex: active ? 4 : 2,
                  },
                ]}
              >
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
                  onPress={() => inspectHotspot(hotspot.id)}
                  style={({ pressed }) => [
                    styles.hotspot,
                    {
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
              {
                bottom: dialogueHeight + 14,
                left: dialogueSidePadding,
                width: Math.min(460, viewportWidth - dialogueSidePadding * 2),
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
            <Text style={styles.choiceOutcomeEyebrow}>{choiceOutcomeCue.eyebrow}</Text>
            <Text style={styles.choiceOutcomeTitle}>{choiceOutcomeCue.title}</Text>
            <Text style={styles.choiceOutcomeDetail}>{choiceOutcomeCue.detail}</Text>
          </View>
        ) : null}

        <View
          style={[
            styles.dialogDock,
            { height: dialogueHeight },
          ]}
        >
          <BottomDialogueGradient />
          <View
            style={[
              styles.dialogFrame,
              {
                paddingHorizontal: dialogueSidePadding,
                paddingBottom: Math.max(insets.bottom, 14),
              },
            ]}
          >
            <View style={styles.dialogHeader}>
              <View style={styles.titleBlock}>
                {currentSpeaker.name ? (
                  <View style={styles.speakerRow}>
                    <Text style={styles.speakerName}>{currentSpeaker.name}</Text>
                  </View>
                ) : null}
                {isTitle || isComplete ? (
                  <Text numberOfLines={2} style={[styles.sceneTitle, styles.titleReveal]}>
                    {scene.title}
                  </Text>
                ) : null}
              </View>

              {fieldKitAvailable && !isDead ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="현장 기록 열기"
                  onPress={() => setShowFieldKit(true)}
                  style={({ pressed }) => [
                    styles.toolButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <MapPinned color="#b9c6d3" size={15} strokeWidth={1.7} />
                  <Text style={styles.toolLabel}>현장 기록</Text>
                  <Text style={styles.toolText}>
                    {fieldRecordCount}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              ref={storyScrollRef}
              pointerEvents={sceneReady ? 'auto' : 'none'}
              scrollEnabled={sceneReady}
              style={styles.bodyScroll}
              contentContainerStyle={styles.storyContent}
              showsVerticalScrollIndicator={false}
            >
              {sceneReady && investigation ? null : (
                <TypewriterText
                  key={`${scene.id}:${currentBeatIndex}`}
                  text={currentBeat.text}
                  speed={14}
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
                    (isTitle || isComplete) && styles.endingBodyText,
                  ]}
                />
              )}
              {!sceneReady ? (
                inputState.phase === 'ready' ? (
                  <Text style={styles.advanceIndicator}>⌄</Text>
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
                          {firstDeathMemorySequence.map((fragmentId, index) => (
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
                            {deathMemoryState.acceptedIds.length}/{firstDeathMemorySequence.length}
                          </Text>
                        </View>
                        <View style={styles.deathMemoryFragments}>
                          {firstDeathMemoryFragments.map((fragment) => {
                            const accepted = deathMemoryState.acceptedIds.includes(fragment.id);
                            const mistaken = deathMemoryState.mistakeId === fragment.id;
                            return (
                              <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={fragment.text}
                                disabled={accepted}
                                key={fragment.id}
                                onPress={() => setDeathMemoryState((state) =>
                                  selectDeathMemoryFragment(state, fragment.id))}
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
                <View style={styles.choiceList}>
                  {!isComplete ? (
                    <View style={styles.choiceHeading}>
                      <Text style={styles.choiceEyebrow}>{investigation ? '현장 조사' : '다음 행동'}</Text>
                      <Text style={styles.choiceHint}>
                        {investigation
                          ? `${inspectedHotspots.length}/${investigation.hotspots.length} 확인`
                          : '선택한 행동은 되돌릴 수 없다'}
                      </Text>
                    </View>
                  ) : null}
                  {investigation ? (
                    <View style={styles.investigationSummary}>
                      <Text style={styles.investigationPrompt}>{investigation.prompt}</Text>
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
                  {choices.length === 0 && !isComplete && !investigation ? (
                    <View style={styles.lockedAction}>
                      <Text style={styles.lockedActionTitle}>아직 다음 수를 확신할 수 없다.</Text>
                      <Text style={styles.lockedActionText}>확보한 단서와 남아 있는 기억을 연결해야 한다.</Text>
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
                    const presentation = getChoicePresentation(choice);
                    const visibleChoiceText = choice.text.replace(/^\[(?:기억|추론)\]\s*/, '');
                    const timeCost = choice.effects.find(
                      (effect) => effect.type === 'advanceTime',
                    );
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={visibleChoiceText}
                        key={choice.id}
                        onPress={() => {
                          setChoiceOutcomeCue(presentation.outcome);
                          setBeatIndex(0);
                          setBackgroundTransitionLocked(true);
                          commitInputEvent({ type: 'choiceSelected' });
                          selectChoice(choice.id);
                        }}
                        style={({ pressed }) => [
                          styles.choiceButton,
                          foreknowledge && styles.foreknowledgeButton,
                          pressed && styles.choiceButtonPressed,
                        ]}
                      >
                        <View style={[styles.choiceNumber, foreknowledge && styles.choiceNumberMemory]}>
                          <Text style={[styles.choiceIndex, foreknowledge && styles.foreknowledgeText]}>
                            {foreknowledge ? '◈' : String(index + 1).padStart(2, '0')}
                          </Text>
                        </View>
                        <View style={styles.choiceCopy}>
                          <Text style={[styles.choiceText, foreknowledge && styles.foreknowledgeText]}>
                            {visibleChoiceText}
                          </Text>
                          <Text style={[styles.choiceMeta, foreknowledge && styles.foreknowledgeMeta]}>
                            {presentation.meta}
                            {timeCost?.type === 'advanceTime' && timeCost.minutes > 0
                              ? `  ·  ${timeCost.minutes}분`
                              : ''}
                          </Text>
                        </View>
                        <ChevronRight
                          color={foreknowledge ? '#b79ee9' : '#708195'}
                          size={17}
                          strokeWidth={1.7}
                        />
                      </Pressable>
                    );
                  })}
                  {isComplete ? (
                    <View style={styles.endingSummary}>
                      <Text style={styles.endingEyebrow}>이번 밤에 확인한 것</Text>
                      <Text style={styles.endingFinding}>
                        서윤은 302호로 들어갔지만 나오지 않았다.
                      </Text>
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
                        onPress={confirmRestart}
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
        {showFieldKit ? (
          <FieldKit
            state={engineState}
            visitedLocationIds={visitedLocationIds}
            onClose={() => setShowFieldKit(false)}
            topInset={insets.top}
            bottomInset={insets.bottom}
            onFormDeduction={formDeduction}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  characterAnchor: { position: 'absolute', zIndex: 3 },
  characterSprite: { position: 'relative' },
  characterSpritePortrait: { overflow: 'hidden' },
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
    top: '-7%',
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
  choiceOutcomeEyebrow: {
    color: '#9ba9b7',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.35,
  },
  choiceOutcomeTitle: { color: '#f0f3f6', fontSize: 13, fontWeight: '800', marginTop: 4 },
  choiceOutcomeDetail: { color: '#8897a6', fontSize: 9, lineHeight: 14, marginTop: 3 },
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
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  dialogFrame: {
    flex: 1,
    paddingTop: 54,
  },
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
  sceneTitle: { color: '#f3f5f7', fontSize: 20, lineHeight: 26, fontWeight: '700', letterSpacing: -0.35, marginTop: 4 },
  titleReveal: { fontSize: 24, lineHeight: 31, fontWeight: '300', letterSpacing: 3.5 },
  toolButton: {
    minHeight: 40,
    minWidth: 108,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(9, 14, 21, 0.68)',
  },
  toolButtonActive: { backgroundColor: 'rgba(39, 28, 59, 0.72)' },
  toolText: { color: '#aab6c4', fontSize: 10, fontWeight: '800' },
  toolLabel: { color: '#d1d9e1', fontSize: 10, fontWeight: '800' },
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
  endingBodyText: { color: '#c9d0d9', textAlign: 'center', paddingVertical: 12 },
  advanceIndicator: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 2,
    color: 'rgba(204, 216, 228, 0.66)',
    fontSize: 16,
    lineHeight: 18,
  },
  choiceList: {
    gap: 2,
    marginTop: 12,
    marginHorizontal: -12,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
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
  choiceHint: { color: '#687788', fontSize: 9 },
  investigationSummary: { gap: 7, marginBottom: 8 },
  investigationPrompt: { color: '#aebbc7', fontSize: 11, lineHeight: 17, marginBottom: 2 },
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
  foreknowledgeButton: { borderLeftColor: 'rgba(174, 139, 232, 0.68)' },
  choiceButtonPressed: { backgroundColor: 'rgba(131, 151, 174, 0.12)' },
  choiceNumber: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceNumberMemory: {},
  choiceIndex: { color: '#8292a4', fontSize: 8, fontWeight: '900' },
  choiceText: {
    color: '#edf0f4',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  choiceCopy: { flex: 1, paddingVertical: 2 },
  choiceMeta: { color: '#718194', fontSize: 9, fontWeight: '700', marginTop: 3 },
  foreknowledgeMeta: { color: '#9179c2' },
  lockedAction: { padding: 14, borderRadius: 10, backgroundColor: 'rgba(86, 70, 113, 0.16)', borderWidth: 1, borderColor: 'rgba(154, 126, 201, 0.26)' },
  lockedActionTitle: { color: '#ece8f3', fontSize: 14, fontWeight: '700' },
  lockedActionText: { color: '#928ba0', fontSize: 11, lineHeight: 17, marginTop: 4 },
  lockedActionButton: { minHeight: 48, marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, backgroundColor: 'rgba(137, 119, 170, 0.22)' },
  lockedActionButtonText: { color: '#d9e2eb', fontSize: 11, fontWeight: '900' },
  foreknowledgeText: { color: '#d2c0f5' },
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
  pressed: { opacity: 0.7 },
});
