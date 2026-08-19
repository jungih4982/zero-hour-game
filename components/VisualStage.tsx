// components/VisualStage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VisualStageProps {
  speaker?: string;
  isTabletSplit?: boolean;
  bgTheme?: 'LOBBY' | 'DARK_LOBBY' | 'LINEN' | 'DESK' | 'BLACKOUT';
  locationName?: string;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  speaker,
  isTabletSplit,
  bgTheme = 'LOBBY',
  locationName = '1F 지상 로비',
}) => {
  const getSpeakerStyle = (name?: string) => {
    switch (name) {
      case '수간호사 유진':
        return { tagColor: '#00E5FF', role: '수간호사 (26세)', emoji: '👩‍⚕️' };
      case '의문의 소녀 세아':
        return { tagColor: '#B794F4', role: '피험체 환자 (19세)', emoji: '🥀' };
      case '딜러 카밀라':
        return { tagColor: '#FF4D4D', role: '카지노 딜러 (27세)', emoji: '🃏' };
      default:
        return { tagColor: '#718096', role: '독백 / 시스템', emoji: '👤' };
    }
  };

  const getThemeBgColor = () => {
    switch (bgTheme) {
      case 'BLACKOUT':
        return '#1A0508'; // 정전 붉은 비상등
      case 'DESK':
        return '#0B1320'; // 원무과 푸른 조명
      case 'LINEN':
        return '#120E1C'; // 린넨실 보랏빛 음영
      case 'DARK_LOBBY':
        return '#080C14'; // 지하 관리구역 암흑
      default:
        return '#0A0E17'; // 기본 로비
    }
  };

  const speakerInfo = getSpeakerStyle(speaker);
  const isNarrator = !speaker || speaker.includes('주인공') || speaker.includes('시스템');

  return (
    <View style={[styles.container, isTabletSplit && styles.tabletContainer]}>
      {/* 배경 레이어 */}
      <View style={[styles.backgroundLayer, { backgroundColor: getThemeBgColor() }]}>
        <View style={[styles.vignetteOverlay, bgTheme === 'BLACKOUT' && styles.blackoutOverlay]} />
        <Text style={styles.locationTag}>📍 {locationName}</Text>
        {bgTheme === 'BLACKOUT' && (
          <Text style={styles.emergencyTag}>🚨 EMERGENCY BLACKOUT</Text>
        )}
      </View>

      {/* 캐릭터 스탠딩 */}
      {!isNarrator && (
        <View style={styles.characterContainer}>
          <View style={[styles.spritePlaceholder, { borderColor: speakerInfo.tagColor }]}>
            <Text style={styles.spriteEmoji}>{speakerInfo.emoji}</Text>
            <Text style={[styles.spriteName, { color: speakerInfo.tagColor }]}>
              {speaker}
            </Text>
            <Text style={styles.spriteRole}>{speakerInfo.role}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    backgroundColor: '#050709',
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 2,
    borderColor: '#1E2638',
  },
  tabletContainer: {
    height: '100%',
    flex: 1.2,
    borderBottomWidth: 0,
    borderRightWidth: 2,
    borderColor: '#1E2638',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    padding: 16,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blackoutOverlay: {
    backgroundColor: 'rgba(180, 0, 0, 0.25)',
  },
  locationTag: {
    color: '#ECC94B',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(10, 15, 24, 0.85)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  emergencyTag: {
    color: '#FF4D4D',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  characterContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  spritePlaceholder: {
    width: 150,
    height: 180,
    backgroundColor: 'rgba(18, 22, 31, 0.9)',
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  spriteEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  spriteName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  spriteRole: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 2,
  },
});