import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  type ImageSourcePropType,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  BookOpen,
  ChevronRight,
  MapPin,
  RotateCcw,
  SkipForward,
  X,
} from 'lucide-react-native';
import { TypewriterText } from '../../components/TypewriterText';
import {
  SCENE_ACT0_LAST_CALL,
  SCENE_ACT0_MESSAGES,
  SCENE_ACT3_MAP_AND_TAEJUN,
  SCENE_ACT1_YUJIN_SEARCH,
  SCENE_ACT1_YUJIN_WARNING,
  SCENE_CH00_YUJIN_DENIAL,
  SCENE_CH00_YUJIN_FIRST,
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
import { getCharacterStageAnchors, getGameLayout } from './layout';

const backgrounds = {
  exterior: require('../../assets/backgrounds/exterior/BG_Hospital_Exterior_Arrival_v01.png'),
  lobby: require('../../assets/backgrounds/1f/BG_1F_Lobby_v01.png'),
  staffDoor: require('../../assets/backgrounds/1f/BG_1F_StaffDoor_Normal_v01.png'),
  staffDoorBlackout: require('../../assets/backgrounds/1f/BG_1F_StaffDoor_Blackout_v01.png'),
  corridor: require('../../assets/backgrounds/3f/BG_3F_Corridor_Normal_v01.png'),
  blackout: require('../../assets/backgrounds/3f/BG_3F_Corridor_Blackout_v01.png'),
  room302Normal: require('../../assets/backgrounds/3f/BG_302Room_Normal_v01.png'),
  room302Cleared: require('../../assets/backgrounds/3f/BG_302Room_Cleared_v01.png'),
  operationsCorridor: require('../../assets/backgrounds/b1/BG_B1_OperationsCorridor_Blackout_v01.png'),
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
  yujinAlarmed: require('../../assets/characters/yujin/sprites/CHAR_Yujin_Alarmed_Full_v01.png'),
  taejunWatchful: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Watchful_Full_v01.png'),
  taejunCold: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Cold_Full_v01.png'),
  seaWary: require('../../assets/characters/sea/sprites/CHAR_Sea_Wary_Full_v01.png'),
  seaConfused: require('../../assets/characters/sea/sprites/CHAR_Sea_Confused_Full_v01.png'),
};

const locationNames: Readonly<Record<string, string>> = {
  MOUNTAIN_ROAD: '백야산 진입로',
  CAR: '차 안',
  HOSPITAL_EXTERIOR: '백야의료원 앞',
  '1F_LOBBY': '1층 로비',
  '3F_CORRIDOR': '3층 입원병동',
  ROOM_302: '302호',
  '1F_STAFF_DOOR': '복도 끝 직원용 문',
  'B1_OPERATIONS_CORRIDOR': '지하 1층 운영 구역',
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
    crop: 'full',
    scale: 1.05,
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
    crop: 'full',
    scale: 1.05,
  },
  [SCENE_LOOP2_TAEJUN_REJECTION]: {
    id: 'taejun',
    source: characterSprites.taejunCold,
    name: '강태준',
    expression: 'cold',
    crop: 'full',
    scale: 1.06,
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

function getBackground(scene: NarrativeScene): ImageSourcePropType {
  if (scene.id === SCENE_FIRST_DEATH) {
    return backgrounds.firstDeath;
  }
  if (
    scene.locationId === 'CAR' ||
    scene.locationId === 'MOUNTAIN_ROAD' ||
    scene.locationId === 'HOSPITAL_EXTERIOR'
  ) {
    return backgrounds.exterior;
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
    return backgrounds.operationsCorridor;
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
}: {
  character: CharacterVisual;
  width: number;
  height: number;
  stopped: boolean;
  active: boolean;
  portrait: boolean;
}) {
  const scale = character.scale ?? 1;
  const cropFullbodyToPortrait = portrait && character.crop === 'full';
  const illumination = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(illumination, {
      toValue: active ? 1 : 0,
      duration: 220,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [active, illumination]);

  const characterOpacity = illumination.interpolate({
    inputRange: [0, 1],
    outputRange: [0.62, stopped ? 0.86 : 0.96],
  });
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
        scale !== 1 && { transform: [{ scale }] },
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
          { opacity: characterOpacity },
        ]}
      />
      <Animated.Image
        source={character.source}
        resizeMode="contain"
        style={[
          styles.characterDimmer,
          cropFullbodyToPortrait && styles.characterPortraitFull,
          { opacity: dimmerOpacity },
        ]}
      />
    </View>
  );
}

export function NarrativePlayer() {
  const { width, height } = useWindowDimensions();
  const layout = getGameLayout(width, height);
  const [showMemory, setShowMemory] = useState(false);
  const [instantText, setInstantText] = useState(false);
  const [textComplete, setTextComplete] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const engineState = useNarrativeStore((store) => store.engineState);
  const selectChoice = useNarrativeStore((store) => store.selectChoice);
  const beginNextLoop = useNarrativeStore((store) => store.beginNextLoop);
  const restartStory = useNarrativeStore((store) => store.restartStory);
  const scene = prologueScenes[engineState.volatile.currentSceneId];
  const choices = getAvailableChoices(scene, engineState);
  const dialogueBeats = useMemo(() => getDialogueBeats(scene), [scene]);
  const currentBeatIndex = Math.min(beatIndex, dialogueBeats.length - 1);
  const currentBeat = dialogueBeats[currentBeatIndex];
  const currentSpeaker = speakerLabels[currentBeat.speaker];
  const character = getCharacter(scene, currentBeat.speaker, currentBeatIndex);
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
  const duoDialogueLayout = layout.overlayDialogue && duoCast !== undefined;
  const background = getBackground(scene);
  const isDead = engineState.volatile.deathId !== undefined;
  const isTitle = scene.id === SCENE_VERTICAL_SLICE_TITLE;
  const isComplete = scene.id === SCENE_VERTICAL_SLICE_END;
  const stopped = isWatchStopped(scene);
  const hasPersistentMemory = engineState.persistent.memories.length > 0;
  const isLastBeat = currentBeatIndex === dialogueBeats.length - 1;
  const sceneReady = textComplete && isLastBeat;

  useEffect(() => {
    setBeatIndex(0);
  }, [scene.id]);

  useEffect(() => {
    setTextComplete(false);
    setForceComplete(instantText);
  }, [scene.id, currentBeatIndex]);

  const advanceDialogue = () => {
    if (!textComplete) {
      setForceComplete(true);
      return;
    }
    if (!isLastBeat) {
      setTextComplete(false);
      setForceComplete(instantText);
      setBeatIndex((index) => Math.min(index + 1, dialogueBeats.length - 1));
    }
  };

  const toggleInstantText = () => {
    setInstantText((enabled) => {
      const next = !enabled;
      if (next) setForceComplete(true);
      return next;
    });
  };

  const confirmRestart = () => {
    const run = () => {
      setShowMemory(false);
      setBeatIndex(0);
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

  const location =
    locationNames[engineState.volatile.currentLocationId] ??
    engineState.volatile.currentLocationId;
  const duoDialogWidth = Math.min(width - layout.horizontalGutter * 2, width * 0.74);
  const duoDialogHeight = Math.min(
    layout.dialogMaxHeight,
    Math.max(240, height * 0.31),
  );
  const activeDialogHeight = duoDialogueLayout
    ? duoDialogHeight
    : layout.dialogMaxHeight;
  const choiceHeight = Math.min(230, activeDialogHeight * 0.34);
  const duoWidthLimit = (width - layout.horizontalGutter * 3) / 2;
  const stagedSpriteWidth = twoCharacterBeat
    ? Math.min(
        layout.spriteWidth * (layout.overlayDialogue ? 0.88 : 0.82),
        duoWidthLimit,
      )
    : layout.spriteWidth;
  const stagedSpriteHeight = stagedSpriteWidth * 1.5;
  const characterStageAnchors = getCharacterStageAnchors({
    viewportWidth: width,
    horizontalGutter: layout.horizontalGutter,
    spriteWidth: stagedSpriteWidth,
    characterCount: stagedCharacters.length,
    overlayDialogue: layout.overlayDialogue,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.root}>
        <View
          style={[
            styles.stage,
            layout.overlayDialogue ? styles.stageOverlay : { height: layout.stageHeight },
          ]}
        >
          <Image
            source={background}
            resizeMode="cover"
            blurRadius={layout.overlayDialogue ? 0 : 16}
            style={[
              styles.stageBackground,
              !layout.overlayDialogue && styles.stageBackgroundBlurred,
            ]}
          />
          {!layout.overlayDialogue ? (
            <Image source={background} resizeMode="contain" style={styles.stageBackgroundContained} />
          ) : null}

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
                  { bottom: layout.overlayDialogue ? -6 : -4, zIndex: active ? 4 : 2 },
                ]}
              >
                <CharacterSprite
                  character={stagedCharacter}
                  width={stagedSpriteWidth}
                  height={stagedSpriteHeight}
                  stopped={stopped}
                  active={active}
                  portrait={twoCharacterBeat}
                />
              </View>
            );
          })}

          <View style={[styles.colorWash, stopped && styles.colorWashStopped]} />
          <View style={styles.stageTopShade} />
          <View style={styles.stageBottomShade} />
          <View style={styles.filmEdgeLeft} />
          <View style={styles.filmEdgeRight} />

          <View
            style={[
              styles.topHud,
              {
                paddingHorizontal: layout.overlayDialogue
                  ? layout.horizontalGutter
                  : layout.horizontalGutter + 2,
              },
            ]}
          >
            <View style={styles.brandBlock}>
              <Text style={styles.brand}>ZERO HOUR</Text>
              <View style={styles.locationRow}>
                <MapPin color="#aab7c6" size={12} strokeWidth={1.8} />
                <Text numberOfLines={1} style={styles.location}>
                  {location}
                </Text>
              </View>
            </View>

            <View style={styles.hudRight}>
              <View style={styles.watchPill}>
                <View style={[styles.watchDot, stopped && styles.watchDotStopped]} />
                <Text style={[styles.watchText, stopped && styles.watchTextStopped]}>
                  {getWatchStatus(scene)}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="처음부터 시작"
                onPress={confirmRestart}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              >
                <RotateCcw color="#c9d2dd" size={16} strokeWidth={1.7} />
              </Pressable>
            </View>
          </View>

        </View>

        {showMemory && hasPersistentMemory ? (
          <View
            style={[
              styles.memoryOverlay,
              layout.overlayDialogue
                ? {
                    top: 86,
                    right: layout.horizontalGutter,
                    width: Math.min(380, width * 0.34),
                  }
                : {
                    top: 72,
                    left: layout.horizontalGutter,
                    right: layout.horizontalGutter,
                  },
            ]}
          >
            <View style={styles.memoryHeader}>
              <View>
                <Text style={styles.memoryEyebrow}>되돌아온 뒤에도</Text>
                <Text style={styles.memoryPanelTitle}>남아 있는 기억</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="기억 닫기"
                onPress={() => setShowMemory(false)}
                style={styles.memoryClose}
              >
                <X color="#bac4cf" size={18} />
              </Pressable>
            </View>
            {engineState.persistent.memories.map((memory, index) => (
              <View key={memory.id} style={styles.memoryEntry}>
                <Text style={styles.memoryIndex}>{String(index + 1).padStart(2, '0')}</Text>
                <View style={styles.memoryCopy}>
                  <Text style={styles.memoryTitle}>{memory.title}</Text>
                  <Text style={styles.memoryDescription}>{memory.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View
          style={[
            styles.dialogDock,
            layout.overlayDialogue
              ? duoDialogueLayout
                ? {
                    position: 'absolute',
                    left: (width - duoDialogWidth) / 2,
                    bottom: layout.horizontalGutter,
                    width: duoDialogWidth,
                    height: duoDialogHeight,
                  }
                : {
                    position: 'absolute',
                    right: layout.horizontalGutter,
                    bottom: layout.horizontalGutter,
                    width: layout.dialogWidth,
                    height: layout.dialogMaxHeight,
                  }
              : styles.dialogDockStacked,
          ]}
        >
          <View
            style={[
              styles.dialogFrame,
              duoDialogueLayout && styles.dialogFrameDuo,
              stopped && styles.dialogFrameStopped,
            ]}
          >
            <View style={[styles.accentRail, stopped && styles.accentRailStopped]} />

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

              <View style={styles.dialogTools}>
                {hasPersistentMemory ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="남아 있는 기억"
                    onPress={() => setShowMemory((visible) => !visible)}
                    style={({ pressed }) => [
                      styles.toolButton,
                      showMemory && styles.toolButtonActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <BookOpen color={showMemory ? '#d8c9ff' : '#aab6c4'} size={16} strokeWidth={1.7} />
                    <Text style={[styles.toolText, showMemory && styles.toolTextActive]}>
                      {engineState.persistent.memories.length}
                    </Text>
                  </Pressable>
                ) : null}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={instantText ? '문장 연출 켜기' : '문장 한 번에 보기'}
                  onPress={toggleInstantText}
                  style={({ pressed }) => [
                    styles.toolButton,
                    instantText && styles.toolButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <SkipForward color={instantText ? '#d8c9ff' : '#aab6c4'} size={16} strokeWidth={1.7} />
                </Pressable>
              </View>
            </View>

            <View style={styles.dialogRule} />

            <ScrollView
              style={styles.bodyScroll}
              contentContainerStyle={styles.storyContent}
              showsVerticalScrollIndicator={false}
            >
              <TypewriterText
                key={`${scene.id}:${currentBeatIndex}`}
                text={currentBeat.text}
                speed={14}
                forceComplete={forceComplete}
                onComplete={() => setTextComplete(true)}
                style={[
                  styles.bodyText,
                  (isTitle || isComplete) && styles.endingBodyText,
                ]}
              />
              {!sceneReady ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={textComplete ? '다음 대사' : '현재 대사 전체 보기'}
                  onPress={advanceDialogue}
                  style={({ pressed }) => [
                    styles.beatAdvance,
                    pressed && styles.beatAdvancePressed,
                  ]}
                >
                  <ChevronRight color="#b8c6d5" size={17} strokeWidth={1.8} />
                </Pressable>
              ) : null}
            </ScrollView>

            {sceneReady && isDead ? (
              <View style={styles.actionDock}>
                <View style={styles.deathBlock}>
                  <Text style={styles.deathEyebrow}>멈춘 초침</Text>
                  <Text style={styles.deathTitle}>마지막 순간을 기억했다</Text>
                  <Text style={styles.deathDescription}>
                    {engineState.persistent.deathIntel.find(
                      (intel) => intel.deathId === engineState.volatile.deathId,
                    )?.description ?? '열린 문과 멈춘 초침만 남았다.'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setBeatIndex(0);
                      setTextComplete(false);
                      beginNextLoop();
                    }}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.primaryButtonText}>첫 통화로 돌아간다</Text>
                    <ChevronRight color="#10151c" size={18} strokeWidth={2.2} />
                  </Pressable>
                </View>
              </View>
            ) : sceneReady ? (
              <ScrollView
                style={[styles.choiceScroll, { maxHeight: choiceHeight }]}
                contentContainerStyle={styles.choiceList}
                showsVerticalScrollIndicator={choices.length > 3}
              >
                {choices.map((choice, index) => {
                  const foreknowledge = choice.kind === 'foreknowledge';
                  const visibleChoiceText = choice.text.replace('[기억] ', '');
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={visibleChoiceText}
                      key={choice.id}
                      onPress={() => {
                        setBeatIndex(0);
                        setTextComplete(false);
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
                      <Text style={[styles.choiceText, foreknowledge && styles.foreknowledgeText]}>
                        {visibleChoiceText}
                      </Text>
                      <ChevronRight
                        color={foreknowledge ? '#b79ee9' : '#708195'}
                        size={17}
                        strokeWidth={1.7}
                      />
                    </Pressable>
                  );
                })}
                {isComplete ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={confirmRestart}
                    style={({ pressed }) => [styles.endingButton, pressed && styles.pressed]}
                  >
                    <RotateCcw color="#afbac7" size={15} />
                    <Text style={styles.endingButtonText}>첫 통화부터 다시</Text>
                  </Pressable>
                ) : null}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#05070b' },
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#05070b' },
  stage: { position: 'relative', overflow: 'hidden', backgroundColor: '#080d14' },
  stageOverlay: { ...StyleSheet.absoluteFillObject },
  stageBackground: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  stageBackgroundBlurred: { opacity: 0.68, transform: [{ scale: 1.08 }] },
  stageBackgroundContained: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
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
    height: 106,
    backgroundColor: 'rgba(4, 8, 13, 0.62)',
  },
  stageBottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: 'rgba(4, 7, 12, 0.36)',
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
  topHud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 72,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  brandBlock: { flexShrink: 1, paddingRight: 8 },
  brand: { color: '#f5f7fa', fontSize: 11, fontWeight: '900', letterSpacing: 3.1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  location: { color: '#c8d1dc', fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  hudRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  watchPill: {
    minHeight: 34,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(7, 12, 19, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(155, 171, 190, 0.26)',
  },
  watchDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#8da4ba' },
  watchDotStopped: { backgroundColor: '#d45d70' },
  watchText: { color: '#b9c5d1', fontSize: 9, fontWeight: '700' },
  watchTextStopped: { color: '#eb9ba8' },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(155, 171, 190, 0.3)',
    backgroundColor: 'rgba(7, 12, 19, 0.82)',
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
    top: '-3%',
    left: '-42.5%',
    width: '185%',
    height: '185%',
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
  dialogDock: { zIndex: 30 },
  dialogDockStacked: { flex: 1, width: '100%' },
  dialogFrame: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(7, 10, 16, 0.97)',
    borderWidth: 1,
    borderColor: 'rgba(135, 153, 174, 0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.72,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
  },
  dialogFrameDuo: { backgroundColor: 'rgba(7, 10, 16, 0.92)' },
  dialogFrameStopped: { borderColor: 'rgba(141, 64, 79, 0.58)' },
  accentRail: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, backgroundColor: '#6888a6' },
  accentRailStopped: { backgroundColor: '#a64356' },
  dialogHeader: {
    paddingLeft: 20,
    paddingRight: 14,
    paddingTop: 15,
    paddingBottom: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  titleBlock: { flex: 1 },
  speakerRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 5 },
  speakerName: { color: '#e8edf2', fontSize: 11, fontWeight: '800', letterSpacing: 0.15 },
  sceneTitle: { color: '#f3f5f7', fontSize: 20, lineHeight: 26, fontWeight: '700', letterSpacing: -0.35, marginTop: 4 },
  titleReveal: { fontSize: 24, lineHeight: 31, fontWeight: '300', letterSpacing: 3.5 },
  dialogTools: { flexDirection: 'row', gap: 6 },
  toolButton: {
    height: 34,
    minWidth: 34,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(127, 145, 165, 0.3)',
    backgroundColor: 'rgba(18, 25, 35, 0.82)',
  },
  toolButtonActive: { borderColor: 'rgba(158, 129, 218, 0.76)', backgroundColor: 'rgba(39, 28, 59, 0.9)' },
  toolText: { color: '#aab6c4', fontSize: 10, fontWeight: '800' },
  toolTextActive: { color: '#d8c9ff' },
  dialogRule: { height: 1, marginLeft: 20, marginRight: 16, backgroundColor: 'rgba(128, 145, 165, 0.22)' },
  bodyScroll: { flex: 1 },
  storyContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 17 },
  bodyText: { color: '#d5dbe3', fontSize: 15, lineHeight: 25, letterSpacing: -0.08 },
  endingBodyText: { color: '#c9d0d9', textAlign: 'center', paddingVertical: 12 },
  beatAdvance: {
    minHeight: 43,
    marginTop: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(112, 135, 159, 0.22)',
    backgroundColor: 'rgba(15, 23, 33, 0.58)',
  },
  beatAdvancePressed: { opacity: 0.72, transform: [{ scale: 0.995 }] },
  choiceScroll: { flexShrink: 0, borderTopWidth: 1, borderTopColor: 'rgba(128, 145, 165, 0.18)' },
  choiceList: { gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  choiceButton: {
    minHeight: 52,
    paddingHorizontal: 11,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: 'rgba(18, 25, 35, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(74, 91, 110, 0.72)',
  },
  foreknowledgeButton: { backgroundColor: 'rgba(35, 26, 51, 0.96)', borderColor: 'rgba(132, 102, 190, 0.8)' },
  choiceButtonPressed: { opacity: 0.78, transform: [{ scale: 0.995 }] },
  choiceNumber: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 10, 16, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(108, 127, 148, 0.42)',
  },
  choiceNumberMemory: { borderColor: 'rgba(155, 125, 218, 0.62)', backgroundColor: 'rgba(20, 14, 33, 0.7)' },
  choiceIndex: { color: '#8292a4', fontSize: 8, fontWeight: '900' },
  choiceText: { color: '#e8edf2', fontSize: 13, lineHeight: 20, flex: 1, fontWeight: '600' },
  foreknowledgeText: { color: '#d2c0f5' },
  actionDock: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: 'rgba(146, 54, 69, 0.28)' },
  deathBlock: { paddingTop: 14 },
  deathEyebrow: { color: '#d65b6d', fontSize: 7, fontWeight: '900', letterSpacing: 1.8 },
  deathTitle: { color: '#fae9ec', fontSize: 19, fontWeight: '700', marginTop: 6 },
  deathDescription: { color: '#c6aeb2', fontSize: 11, lineHeight: 17, marginTop: 6 },
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
    borderWidth: 1,
    borderColor: 'rgba(103, 123, 145, 0.7)',
    marginTop: 4,
  },
  endingButtonText: { color: '#c5ced8', fontSize: 11, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
