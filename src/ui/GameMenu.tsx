import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  ChevronLeft,
  MapPinned,
  Play,
  RotateCcw,
  Settings,
} from 'lucide-react-native';
import {
  type DialogueSpeed,
  useGamePreferences,
} from '../store/useGamePreferences';
import { getTitleBackgroundMotion } from './layout';

const titleBackground = require('../../assets/backgrounds/title/BG_Title_Baekya_Rain_Portrait_v01.png');

const speedOptions: readonly { id: DialogueSpeed; label: string; detail: string }[] = [
  { id: 'relaxed', label: '천천히', detail: '문장을 여유 있게 표시' },
  { id: 'standard', label: '보통', detail: '기본 표시 속도' },
  { id: 'fast', label: '빠르게', detail: '문장을 빠르게 표시' },
];

export function GameMenu({
  mode,
  hasProgress,
  topInset,
  bottomInset,
  onContinue,
  onNewGame,
  onOpenRecords,
  onReturnToTitle,
}: {
  mode: 'title' | 'pause';
  hasProgress: boolean;
  topInset: number;
  bottomInset: number;
  onContinue: () => void;
  onNewGame: () => void;
  onOpenRecords?: () => void;
  onReturnToTitle?: () => void;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const { width, height } = useWindowDimensions();
  const tablet = Math.min(width, height) >= 700;
  const tabletLandscape = tablet && width > height;
  const dialogueSpeed = useGamePreferences((state) => state.dialogueSpeed);
  const setDialogueSpeed = useGamePreferences((state) => state.setDialogueSpeed);
  const seenTutorialGuideIds = useGamePreferences((state) => state.seenTutorialGuideIds);
  const resetTutorialGuides = useGamePreferences((state) => state.resetTutorialGuides);
  const isPause = mode === 'pause';
  const titleMotion = useRef(new Animated.Value(0)).current;
  const titleBackgroundMotion = getTitleBackgroundMotion(tabletLandscape);

  useEffect(() => {
    if (isPause) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(titleMotion, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(titleMotion, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [isPause, titleMotion]);

  useEffect(() => {
    if (!showSettings || Platform.OS === 'web') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowSettings(false);
      return true;
    });
    return () => subscription.remove();
  }, [showSettings]);

  return (
    <View style={[styles.root, isPause && styles.pauseRoot]}>
      {isPause ? (
        <View style={styles.pauseBackdrop} />
      ) : (
        <>
          <Animated.Image
            source={titleBackground}
            resizeMode="cover"
            style={[
              styles.titleBackground,
              { width, height },
              {
                opacity: titleMotion.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
                transform: [
                  {
                    scale: titleMotion.interpolate({
                      inputRange: [0, 1],
                      outputRange: titleBackgroundMotion.scale,
                    }),
                  },
                  {
                    translateX: titleMotion.interpolate({
                      inputRange: [0, 1],
                      outputRange: titleBackgroundMotion.translateX,
                    }),
                  },
                  {
                    translateY: titleMotion.interpolate({
                      inputRange: [0, 1],
                      outputRange: [4, -5],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.titleLight,
              {
                opacity: titleMotion.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.08, 0.18, 0.1],
                }),
              },
            ]}
          />
          <View style={styles.titleShade} />
        </>
      )}

      <View
        style={[
          styles.content,
          tablet && styles.contentTablet,
          tabletLandscape && !showSettings && styles.contentTabletLandscape,
          {
            paddingTop: Math.max(topInset, 18) + 18,
            paddingBottom: Math.max(bottomInset, 18) + 18,
          },
        ]}
      >
        {showSettings ? (
          <View style={[styles.panel, tablet && styles.panelTablet]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="이전 화면"
              onPress={() => setShowSettings(false)}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <ChevronLeft color="#dbe4ec" size={20} />
              <Text style={[styles.backButtonText, tablet && styles.backButtonTextTablet]}>돌아가기</Text>
            </Pressable>
            <Text style={[styles.eyebrow, tablet && styles.eyebrowTablet]}>설정</Text>
            <Text style={[styles.panelTitle, tablet && styles.panelTitleTablet]}>대사 표시 속도</Text>
            <Text style={[styles.panelDescription, tablet && styles.panelDescriptionTablet]}>
              대사가 표시되는 중 화면을 누르면 언제든 문장 전체를 바로 확인할 수 있습니다.
            </Text>
            <View style={styles.speedList}>
              {speedOptions.map((option) => {
                const selected = dialogueSpeed === option.id;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={option.id}
                    onPress={() => setDialogueSpeed(option.id)}
                    style={({ pressed }) => [
                      styles.speedOption,
                      tablet && styles.speedOptionTablet,
                      selected && styles.speedOptionSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={[styles.radio, selected && styles.radioSelected]} />
                    <View style={styles.speedCopy}>
                      <Text style={[styles.speedLabel, tablet && styles.speedLabelTablet, selected && styles.speedLabelSelected]}>
                        {option.label}
                      </Text>
                      <Text style={[styles.speedDetail, tablet && styles.speedDetailTablet]}>{option.detail}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.guideSetting}>
              <View style={styles.guideSettingCopy}>
                <Text style={[styles.guideSettingTitle, tablet && styles.guideSettingTitleTablet]}>조작 안내</Text>
                <Text style={[styles.guideSettingDetail, tablet && styles.guideSettingDetailTablet]}>
                  {seenTutorialGuideIds.length === 0
                    ? '안내가 각 상황에서 다시 표시됩니다.'
                    : '대사 진행, 사건 시각, 현장 기록 안내를 다시 봅니다.'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="조작 안내 다시 보기"
                onPress={resetTutorialGuides}
                style={({ pressed }) => [styles.guideResetButton, pressed && styles.pressed]}
              >
                <RotateCcw color="#c9d6df" size={15} />
                <Text style={styles.guideResetButtonText}>다시 보기</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={[
              isPause ? styles.pauseHeading : styles.titleHeading,
              tabletLandscape && styles.headingTabletLandscape,
            ]}>
              <Text style={[styles.eyebrow, tablet && styles.eyebrowTablet]}>{isPause ? '일시정지' : 'MYSTERY · LOOP · HORROR'}</Text>
              <Text style={[styles.logo, tablet && styles.logoTablet]}>ZERO{`\n`}HOUR</Text>
              <Text style={[styles.subtitle, tablet && styles.subtitleTablet]}>
                {isPause ? '이 밤은 선택한 순간마다 기록됩니다.' : '자정에 사라진 사람을 찾는 반복되는 밤'}
              </Text>
            </View>

            <View style={[styles.menu, isPause && styles.pauseMenu, tabletLandscape && styles.menuTabletLandscape]}>
              <View style={[styles.saveStatus, tablet && styles.saveStatusTablet]}>
                <View style={styles.savePulse} />
                <View>
                  <Text style={[styles.saveTitle, tablet && styles.saveTitleTablet]}>{hasProgress ? '자동 저장됨' : '새 기록'}</Text>
                  <Text style={[styles.saveDetail, tablet && styles.saveDetailTablet]}>대사와 장면, 선택이 바뀔 때마다 진행 상황을 보존합니다.</Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={onContinue}
                style={({ pressed }) => [styles.primaryButton, tablet && styles.primaryButtonTablet, pressed && styles.primaryPressed]}
              >
                <Play color="#081018" fill="#081018" size={18} />
                <Text style={[styles.primaryText, tablet && styles.primaryTextTablet]}>
                  {isPause ? '계속하기' : hasProgress ? '이어하기' : '새 게임 시작'}
                </Text>
              </Pressable>

              {hasProgress && onOpenRecords ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onOpenRecords}
                  style={({ pressed }) => [styles.menuButton, tablet && styles.menuButtonTablet, pressed && styles.pressed]}
                >
                  <MapPinned color="#b9c8d5" size={18} />
                  <Text style={[styles.menuButtonText, tablet && styles.menuButtonTextTablet]}>현장 기록</Text>
                </Pressable>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={() => setShowSettings(true)}
                style={({ pressed }) => [styles.menuButton, tablet && styles.menuButtonTablet, pressed && styles.pressed]}
              >
                <Settings color="#b9c8d5" size={18} />
                <Text style={[styles.menuButtonText, tablet && styles.menuButtonTextTablet]}>설정</Text>
              </Pressable>

              {hasProgress ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onNewGame}
                  style={({ pressed }) => [styles.menuButton, tablet && styles.menuButtonTablet, styles.dangerButton, pressed && styles.pressed]}
                >
                  <RotateCcw color="#a99499" size={17} />
                  <Text style={[styles.dangerText, tablet && styles.dangerTextTablet]}>처음부터 시작</Text>
                </Pressable>
              ) : null}

              {isPause && onReturnToTitle ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onReturnToTitle}
                  style={({ pressed }) => [styles.titleReturn, pressed && styles.pressed]}
                >
                  <Text style={styles.titleReturnText}>메인 화면으로</Text>
                </Pressable>
              ) : null}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: '#05080d',
  },
  pauseRoot: { backgroundColor: 'transparent' },
  titleBackground: { ...StyleSheet.absoluteFillObject },
  titleLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#9cc5dc',
  },
  titleShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 12, 0.48)',
  },
  pauseBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 5, 9, 0.92)',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  contentTablet: { maxWidth: 700, paddingHorizontal: 44 },
  contentTabletLandscape: {
    maxWidth: 1180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 64,
    paddingHorizontal: 76,
  },
  titleHeading: { marginTop: '18%' },
  pauseHeading: { marginTop: 12 },
  headingTabletLandscape: { flex: 1, maxWidth: 430, marginTop: 0 },
  eyebrow: {
    color: '#8fa9bc',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  eyebrowTablet: { fontSize: 11, letterSpacing: 2.8 },
  logo: {
    color: '#f3f5f7',
    fontSize: 48,
    lineHeight: 43,
    fontWeight: '200',
    letterSpacing: 6,
    marginTop: 12,
  },
  logoTablet: { fontSize: 64, lineHeight: 57, letterSpacing: 8, marginTop: 16 },
  subtitle: {
    color: '#9aa9b6',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitleTablet: { fontSize: 16, lineHeight: 24, marginTop: 18 },
  menu: { gap: 8, marginBottom: 8 },
  pauseMenu: { marginTop: 26 },
  menuTabletLandscape: { width: '48%', maxWidth: 520, marginBottom: 0 },
  saveStatus: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    marginBottom: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(10, 18, 27, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(127, 157, 180, 0.2)',
  },
  saveStatusTablet: { minHeight: 70, paddingHorizontal: 18 },
  savePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#7db49f',
  },
  saveTitle: { color: '#dbe5ec', fontSize: 11, fontWeight: '800' },
  saveTitleTablet: { fontSize: 14 },
  saveDetail: { color: '#758797', fontSize: 8, lineHeight: 12, marginTop: 2 },
  saveDetailTablet: { fontSize: 10, lineHeight: 15, marginTop: 3 },
  primaryButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 10,
    backgroundColor: '#dbe5ec',
  },
  primaryButtonTablet: { minHeight: 68 },
  primaryPressed: { backgroundColor: '#bfcbd4' },
  primaryText: { color: '#081018', fontSize: 14, fontWeight: '900' },
  primaryTextTablet: { fontSize: 17 },
  menuButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(9, 16, 24, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(125, 151, 173, 0.2)',
  },
  menuButtonTablet: { minHeight: 62, paddingHorizontal: 20 },
  menuButtonText: { color: '#dbe3ea', fontSize: 12, fontWeight: '800' },
  menuButtonTextTablet: { fontSize: 15 },
  dangerButton: { marginTop: 3, borderColor: 'rgba(140, 94, 103, 0.24)' },
  dangerText: { color: '#aa969a', fontSize: 11, fontWeight: '800' },
  dangerTextTablet: { fontSize: 14 },
  titleReturn: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  titleReturnText: { color: '#738392', fontSize: 10, fontWeight: '800' },
  panel: {
    marginVertical: 'auto',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(7, 13, 20, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(130, 157, 180, 0.26)',
  },
  panelTablet: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 28 },
  backButton: {
    minHeight: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 18,
  },
  backButtonText: { color: '#b9c5d0', fontSize: 10, fontWeight: '800' },
  backButtonTextTablet: { fontSize: 13 },
  panelTitle: { color: '#f0f3f6', fontSize: 22, fontWeight: '800', marginTop: 6 },
  panelTitleTablet: { fontSize: 28, marginTop: 8 },
  panelDescription: { color: '#8493a1', fontSize: 11, lineHeight: 18, marginTop: 8 },
  panelDescriptionTablet: { fontSize: 14, lineHeight: 22, marginTop: 10 },
  speedList: { gap: 8, marginTop: 20 },
  speedOption: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(13, 22, 31, 0.74)',
    borderWidth: 1,
    borderColor: 'rgba(124, 150, 171, 0.18)',
  },
  speedOptionTablet: { minHeight: 74, paddingHorizontal: 18 },
  speedOptionSelected: {
    backgroundColor: 'rgba(48, 74, 94, 0.58)',
    borderColor: 'rgba(151, 186, 210, 0.52)',
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#667889',
  },
  radioSelected: { borderWidth: 4, borderColor: '#c9dbe7' },
  speedCopy: { flex: 1 },
  speedLabel: { color: '#b9c5ce', fontSize: 12, fontWeight: '800' },
  speedLabelTablet: { fontSize: 15 },
  speedLabelSelected: { color: '#f0f4f7' },
  speedDetail: { color: '#728190', fontSize: 9, marginTop: 3 },
  speedDetailTablet: { fontSize: 11, marginTop: 4 },
  guideSetting: {
    minHeight: 68,
    marginTop: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(124, 150, 171, 0.18)',
  },
  guideSettingCopy: { flex: 1 },
  guideSettingTitle: { color: '#d9e2e9', fontSize: 12, fontWeight: '800' },
  guideSettingTitleTablet: { fontSize: 15 },
  guideSettingDetail: { color: '#728190', fontSize: 9, lineHeight: 14, marginTop: 4 },
  guideSettingDetailTablet: { fontSize: 11, lineHeight: 17 },
  guideResetButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 65, 82, 0.42)',
  },
  guideResetButtonText: { color: '#c9d6df', fontSize: 9, fontWeight: '900' },
  pressed: { opacity: 0.64 },
});
