// components/VisualStage.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { InvestigationSpot } from '../data/scenarioNodes';

interface VisualStageProps {
  speaker: string;
  locationName: string;
  bgTheme?: 'LOBBY' | 'DARK_LOBBY' | 'LINEN' | 'DESK' | 'BLACKOUT';
  spots?: InvestigationSpot[];
  onSpotClick?: (nextNodeId: string) => void;
}

// ⭐️ 테마별 배경 이미지 맵 (현재 생성된 bg_lobby 외에는 기본 fallback 제공)
const BACKGROUND_IMAGES: Record<string, any> = {
  LOBBY: require('../assets/backgrounds/bg_lobby.png'),
  // 차후 생성할 이미지들 (이미지가 없을 경우 로비 배경 또는 배경색 fallback)
  DESK: require('../assets/backgrounds/bg_lobby.png'),
  LINEN: require('../assets/backgrounds/bg_lobby.png'),
  DARK_LOBBY: require('../assets/backgrounds/bg_lobby.png'),
  BLACKOUT: require('../assets/backgrounds/bg_lobby.png'),
};

export const VisualStage: React.FC<VisualStageProps> = ({ 
  speaker, 
  locationName, 
  bgTheme = 'LOBBY', 
  spots = [], 
  onSpotClick 
}) => {
  const currentBgImage = BACKGROUND_IMAGES[bgTheme] || BACKGROUND_IMAGES.LOBBY;

  // ⭐️ 스팟 반짝거림(Pulsing) 애니메이션 효과
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* ⭐️ 생성된 실제 배경 이미지 적용 */}
      <ImageBackground 
        source={currentBgImage} 
        style={styles.backgroundLayer} 
        resizeMode="cover"
      >
        {/* 테마별 무드 오버레이 (정전 시 붉은 틴트 처리) */}
        <View style={[styles.ambientOverlay, bgTheme === 'BLACKOUT' && styles.blackoutOverlay]} />

        {/* 현재 장소 뱃지 */}
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 {locationName}</Text>
          {bgTheme === 'BLACKOUT' && (
            <Text style={styles.blackoutWarning}>🚨 CODE BLACK</Text>
          )}
        </View>

        {/* 캐릭터 실루엣 레이어 */}
        <View style={styles.characterContainer}>
          {speaker.includes('독백') ? (
            <View style={styles.monologueEffect} />
          ) : (
            <View style={styles.spritePlaceholder}>
              <Text style={styles.spriteIcon}>
                {speaker.includes('유진') ? '👩‍⚕️' : speaker.includes('세아') ? '👧' : speaker.includes('카밀라') ? '🃏' : '👤'}
              </Text>
            </View>
          )}
        </View>

        {/* ⭐️ 조사 스팟 렌더링 (화면 위에 인터랙티브하게 배치) */}
        {spots.map((spot) => (
          <TouchableOpacity 
            key={spot.id} 
            style={[styles.investigationSpot, { left: `${spot.x}%`, top: `${spot.y}%` }]}
            onPress={() => onSpotClick && onSpotClick(spot.nextNodeId)}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.spotGlow, { transform: [{ scale: pulseAnim }], opacity: pulseAnim }]} />
            <View style={styles.spotInner}>
              <Text style={styles.spotIcon}>{spot.icon}</Text>
              <Text style={styles.spotLabel}>{spot.label}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* 대화창 가독성을 위한 하단 비네팅 */}
        <View style={styles.bottomVignette} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#050709',
  },
  backgroundLayer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  ambientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 7, 12, 0.25)', // 기본 서늘한 명도 보정
  },
  blackoutOverlay: {
    backgroundColor: 'rgba(180, 0, 0, 0.45)', // 정전 시 핏빛 오버레이
  },
  locationBadge: { 
    position: 'absolute', 
    top: 24, 
    left: 20, 
    backgroundColor: 'rgba(5, 7, 15, 0.8)', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 6, 
    borderLeftWidth: 3, 
    borderColor: '#00E5FF', 
    zIndex: 10,
    borderWidth: 1,
    borderRightColor: '#1E2638',
    borderTopColor: '#1E2638',
    borderBottomColor: '#1E2638',
  },
  locationText: { 
    color: '#E2E8F0', 
    fontSize: 13, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  blackoutWarning: {
    color: '#FF4D4D',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  characterContainer: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    paddingBottom: 160 
  },
  spritePlaceholder: { 
    width: 260, 
    height: 420, 
    backgroundColor: 'rgba(10, 15, 25, 0.4)', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  spriteIcon: { fontSize: 130, opacity: 0.9 },
  monologueEffect: { flex: 1 },
  bottomVignette: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 280, 
    backgroundColor: 'rgba(5, 7, 12, 0.65)', 
    pointerEvents: 'none' 
  },

  // 스팟 인터랙션 스타일
  investigationSpot: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 25,
  },
  spotInner: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(5, 10, 20, 0.85)',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 229, 255, 0.35)',
  },
  spotIcon: { fontSize: 18 },
  spotLabel: {
    position: 'absolute',
    bottom: -22,
    width: 90,
    textAlign: 'center',
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});