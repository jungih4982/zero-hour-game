// components/VisualStage.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { InvestigationSpot } from '../data/scenarioNodes';

interface VisualStageProps {
  speaker: string;
  locationName: string;
  bgTheme?: 'LOBBY' | 'DARK_LOBBY' | 'LINEN' | 'DESK' | 'BLACKOUT';
  spots?: InvestigationSpot[]; // ⭐️ 전달받은 조사 스팟 배열
  onSpotClick?: (nextNodeId: string) => void; // ⭐️ 터치했을 때 실행될 함수
}

export const VisualStage: React.FC<VisualStageProps> = ({ speaker, locationName, bgTheme, spots = [], onSpotClick }) => {
  const getThemeColor = () => {
    switch (bgTheme) {
      case 'BLACKOUT': return '#050000';
      case 'DARK_LOBBY': return '#0A1118';
      case 'LINEN': return '#12140D';
      case 'DESK': return '#1A1820';
      case 'LOBBY':
      default: return '#141821';
    }
  };

  // ⭐️ 스팟 반짝거림(Pulsing) 애니메이션 효과
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: getThemeColor() }]}>
      <View style={styles.locationBadge}>
        <Text style={styles.locationText}>📍 {locationName}</Text>
      </View>

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

      {/* ⭐️ 조사 스팟 렌더링 (화면 위에 떠다니게 배치) */}
      {spots.map((spot) => (
        <TouchableOpacity 
          key={spot.id} 
          style={[styles.investigationSpot, { left: `${spot.x}%`, top: `${spot.y}%` }]}
          onPress={() => onSpotClick && onSpotClick(spot.nextNodeId)}
        >
          <Animated.View style={[styles.spotGlow, { transform: [{ scale: pulseAnim }], opacity: pulseAnim }]} />
          <View style={styles.spotInner}>
            <Text style={styles.spotIcon}>{spot.icon}</Text>
            <Text style={styles.spotLabel}>{spot.label}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.bottomVignette} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  locationBadge: { position: 'absolute', top: 24, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4, borderLeftWidth: 3, borderColor: '#63B3ED', zIndex: 10 },
  locationText: { color: '#E2E8F0', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  characterContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 160 },
  spritePlaceholder: { width: 250, height: 400, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  spriteIcon: { fontSize: 120, opacity: 0.8 },
  monologueEffect: { flex: 1 },
  bottomVignette: { position: 'absolute', bottom: 0, width: '100%', height: 250, backgroundColor: 'rgba(0,0,0,0.7)', pointerEvents: 'none' },

  // ⭐️ 스팟 스타일
  investigationSpot: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  spotInner: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(10, 14, 23, 0.8)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
  },
  spotIcon: { fontSize: 18 },
  spotLabel: {
    position: 'absolute',
    bottom: -20,
    width: 80,
    textAlign: 'center',
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});