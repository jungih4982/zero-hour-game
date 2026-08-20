// components/VisualStage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VisualStageProps {
  speaker: string;
  locationName: string;
  bgTheme?: 'LOBBY' | 'DARK_LOBBY' | 'LINEN' | 'DESK' | 'BLACKOUT';
  isTabletSplit?: boolean;
}

export const VisualStage: React.FC<VisualStageProps> = ({ speaker, locationName, bgTheme }) => {
  // 테마별 배경색 설정 (나중엔 진짜 배경 이미지로 교체하면 됨)
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

  return (
    <View style={[styles.container, { backgroundColor: getThemeColor() }]}>
      {/* 현재 장소 표시 (호텔 더스크 감성) */}
      <View style={styles.locationBadge}>
        <Text style={styles.locationText}>📍 {locationName}</Text>
      </View>

      {/* 캐릭터 실루엣 렌더링 (미연시 연출 핵심!) */}
      <View style={styles.characterContainer}>
        {speaker.includes('독백') ? (
          // 독백일 때는 1인칭 시점이므로 빈 공간 연출
          <View style={styles.monologueEffect} />
        ) : (
          // NPC 대화일 때는 중앙에 거대한 캐릭터 실루엣 배치
          <View style={styles.spritePlaceholder}>
            <Text style={styles.spriteIcon}>
              {speaker.includes('유진') ? '👩‍⚕️' : speaker.includes('세아') ? '👧' : speaker.includes('카밀라') ? '🃏' : '👤'}
            </Text>
          </View>
        )}
      </View>

      {/* 비주얼 노벨 특유의 하단 어두운 그라데이션 (대화창 가독성 확보) */}
      <View style={styles.bottomVignette} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // ⭐️ 전체 화면 꽉 채우기
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationBadge: {
    position: 'absolute',
    top: 24,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderColor: '#63B3ED',
  },
  locationText: { color: '#E2E8F0', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  
  characterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 160, // 하단 대화창 공간 비워두기
  },
  spritePlaceholder: {
    width: 250,
    height: 400,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteIcon: { fontSize: 120, opacity: 0.8 },
  monologueEffect: { flex: 1 },
  
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.7)', // 대화창 뒤를 어둡게 눌러줌
  }
});