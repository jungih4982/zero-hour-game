// components/DeathLogModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../store/useGameStore';

interface DeathLogModalProps {
  visible: boolean;
  onClose: () => void;
}

// GDD 4.2에 정의된 전체 사망 도감 기준표
const ALL_DEATHS = [
  {
    deathId: 'DEATH_01',
    name: '절벽 추락사',
    condition: '프롤로그에서 무작정 정문 유리창으로 탈출',
    trait: '야간 시야 (어두운 방 진입 시 AP 소모 1 감소)',
  },
  {
    deathId: 'DEATH_02',
    name: '심장 마비사',
    condition: '로비에서 방호복 괴한의 테이저건 피격',
    trait: '전기 내성 (테이저/트랩 피격 시 1회 즉사 방지)',
  },
  {
    deathId: 'DEATH_03',
    name: '신경가스 질식',
    condition: 'B2 환기구 가스 누출 구역 무단 진입',
    trait: '독극물 감지 (유독가스 및 독극물 선택지 사전 경고)',
  },
  {
    deathId: 'DEATH_04',
    name: '도박장 린치사',
    condition: 'B1 카밀라의 도박에서 빚을 지고 저항',
    trait: '타짜의 눈 (빅휠/룰렛 당첨 확률 15% 영구 보정)',
  },
  {
    deathId: 'DEATH_05',
    name: '소각로 화형',
    condition: '04:00 제한시간 초과로 요양원 전체 소각',
    trait: '위기 질주 (03:00 이후 모든 이동 AP 소모 절반)',
  },
];

export const DeathLogModal: React.FC<DeathLogModalProps> = ({
  visible,
  onClose,
}) => {
  const deathRecords = useGameStore((state) => state.deathRecords || []);
  const unlockedTraits = useGameStore((state) => state.unlockedTraits || []);

  const unlockedDeathIds = new Set(deathRecords.map((d) => d.deathId));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>💀 사망 도감 (Death Log)</Text>
            <Text style={styles.headerSub}>
              해금률: {unlockedDeathIds.size} / {ALL_DEATHS.length}
            </Text>
          </View>

          {/* 보유 영구 패시브 요약 */}
          <View style={styles.traitsSummaryBox}>
            <Text style={styles.traitSummaryTitle}>🧬 활성화된 영구 패시브</Text>
            <Text style={styles.traitSummaryText}>
              {unlockedTraits.length > 0
                ? unlockedTraits.join('  |  ')
                : '아직 해금된 패시브가 없습니다.'}
            </Text>
          </View>

          {/* 사망 리스트 스크롤 */}
          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {ALL_DEATHS.map((item, index) => {
              const isUnlocked = unlockedDeathIds.has(item.deathId);

              return (
                <View
                  key={index}
                  style={[
                    styles.deathCard,
                    isUnlocked ? styles.unlockedCard : styles.lockedCard,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text
                      style={[
                        styles.deathName,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      {isUnlocked ? `[${item.deathId}] ${item.name}` : `[${item.deathId}] ??? (미해금)`}
                    </Text>
                    {isUnlocked && <Text style={styles.unlockedBadge}>해금 완료</Text>}
                  </View>

                  <Text style={styles.deathDesc}>
                    {isUnlocked ? `조건: ${item.condition}` : '특정 조건으로 사망 시 해금됩니다.'}
                  </Text>

                  {isUnlocked && (
                    <View style={styles.traitTag}>
                      <Text style={styles.traitText}>🎁 패시브: {item.trait}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>도감 닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '85%',
    backgroundColor: '#0F131C',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#742A2A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#2D3748',
    paddingBottom: 10,
    marginBottom: 12,
  },
  headerTitle: {
    color: '#FEB2B2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  traitsSummaryBox: {
    backgroundColor: '#1A202C',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00E5FF',
    marginBottom: 12,
  },
  traitSummaryTitle: {
    color: '#90CDF4',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  traitSummaryText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  scrollList: {
    marginBottom: 12,
  },
  deathCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  unlockedCard: {
    backgroundColor: '#201618',
    borderColor: '#9B2C2C',
  },
  lockedCard: {
    backgroundColor: '#12161F',
    borderColor: '#1E2638',
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deathName: {
    color: '#FEB2B2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  lockedText: {
    color: '#718096',
  },
  unlockedBadge: {
    color: '#68D391',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deathDesc: {
    color: '#CBD5E0',
    fontSize: 12,
    lineHeight: 17,
  },
  traitTag: {
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 6,
    borderRadius: 4,
  },
  traitText: {
    color: '#F6E05E',
    fontSize: 11,
  },
  closeBtn: {
    backgroundColor: '#2D3748',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#EDF2F7',
    fontWeight: 'bold',
    fontSize: 13,
  },
});