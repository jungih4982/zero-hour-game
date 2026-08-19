// components/CasinoModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useGameStore } from '../store/useGameStore';

interface CasinoModalProps {
  visible: boolean;
  onClose: () => void;
  onDie: (cause: string, trait: string) => void;
}

const WHEEL_SECTORS = [
  { id: 1, label: '1: 꽝', type: 'MISS' },
  { id: 2, label: '2: 진통제 (Sanity +20)', type: 'SANITY' },
  { id: 3, label: '3: 꽝', type: 'MISS' },
  { id: 4, label: '4: 경비대 무전기', type: 'ITEM_RADIO' },
  { id: 5, label: '5: 꽝', type: 'MISS' },
  { id: 6, label: '6: 수면가스탄', type: 'ITEM_GAS' },
  { id: 7, label: '7: B2 직통 키카드 (대박)', type: 'KEYCARD' },
  { id: 8, label: '8: 💀 즉시 사살 (사망)', type: 'DEATH' },
];

export const CasinoModal: React.FC<CasinoModalProps> = ({
  visible,
  onClose,
  onDie,
}) => {
  const store = useGameStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'WHEEL' | 'ROULETTE'>('WHEEL');

  // 1. 빅휠 돌리기 로직
  const spinWheel = () => {
    if (store.chips < 1) {
      Alert.alert('칩 부족', '베팅할 칩이 부족합니다! (필요: 1개)');
      return;
    }

    useGameStore.setState((state) => ({ chips: Math.max(0, state.chips - 1) }));
    setIsSpinning(true);
    setWheelResult('카밀라가 휠을 힘차게 돌립니다...');

    setTimeout(() => {
      setIsSpinning(false);
      // 타짜 직업이거나 패시브 보유 시 보정
      const hasGamblerEye = store.unlockedTraits.includes('타짜의 눈');
      let chosenIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);

      // 보정 확률로 7번 키카드 유도
      if (hasGamblerEye && Math.random() < 0.3) {
        chosenIndex = 6; // 7번 슬롯
      }

      const outcome = WHEEL_SECTORS[chosenIndex];
      setWheelResult(`🎯 결과: [${outcome.label}]`);

      if (outcome.type === 'DEATH') {
        setTimeout(() => {
          onClose();
          onDie('도박장 린치사', '타짜의 눈');
        }, 1200);
      } else if (outcome.type === 'KEYCARD') {
        store.unlockClue('CLUE_B2_KEYCARD');
        Alert.alert('🎰 대박!', 'B2 직통 키카드를 획득했습니다!');
      }
    }, 1500);
  };

  // 2. 처방전 룰렛 베팅 로직
  const betRoulette = (color: 'RED' | 'BLUE' | 'BLACK_ZERO') => {
    if (store.chips < 1) {
      Alert.alert('칩 부족', '베팅할 칩이 부족합니다!');
      return;
    }

    useGameStore.setState((state) => ({ chips: Math.max(0, state.chips - 1) }));
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      const rand = Math.random();

      if (color === 'BLACK_ZERO') {
        // 1/10 확률로 금고 번호 대박, 실패 시 즉사
        if (rand < 0.25 || store.selectedJob === 'GAMBLER') {
          store.unlockClue('CLUE_DIRECTOR_SAFE_CODE');
          Alert.alert('🃏 36배 적중!', '원장실 금고 마스터 비밀번호 획득!');
        } else {
          onClose();
          onDie('도박장 린치사', '타짜의 눈');
        }
      } else {
        // Red / Blue 50% 배당
        if (rand < 0.5) {
          useGameStore.setState((state) => ({ chips: state.chips + 2 }));
          Alert.alert('승리', '칩 2개를 획득했습니다!');
        } else {
          Alert.alert('패배', '칩을 잃었습니다.');
        }
      }
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* 상단 탭 */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabButton, gameMode === 'WHEEL' && styles.activeTab]}
              onPress={() => setGameMode('WHEEL')}
            >
              <Text style={styles.tabText}>개조된 빅휠</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, gameMode === 'ROULETTE' && styles.activeTab]}
              onPress={() => setGameMode('ROULETTE')}
            >
              <Text style={styles.tabText}>처방전 룰렛</Text>
            </TouchableOpacity>
          </View>

          {/* 딜러 카밀라 안내 */}
          <View style={styles.dealerBox}>
            <Text style={styles.dealerTitle}>🃏 딜러 카밀라</Text>
            <Text style={styles.dealerSub}>
              "목숨을 걸든 칩을 걸든 자유야. 이길 자신은 있고?"
            </Text>
            <Text style={styles.chipsCount}>보유 칩: {store.chips}개</Text>
          </View>

          {/* 메인 게임 영역 */}
          {gameMode === 'WHEEL' ? (
            <View style={styles.gameArea}>
              <Text style={styles.resultText}>
                {wheelResult || '휠을 돌려 B2 키카드나 물자를 확보하세요.'}
              </Text>
              <TouchableOpacity
                style={[styles.actionButton, isSpinning && styles.disabledButton]}
                disabled={isSpinning}
                onPress={spinWheel}
              >
                <Text style={styles.actionButtonText}>
                  {isSpinning ? '회전 중...' : '빅휠 회전 (🪙 칩 1개)'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gameArea}>
              <Text style={styles.resultText}>베팅 항목을 선택하세요</Text>
              <View style={styles.rouletteGrid}>
                <TouchableOpacity
                  style={[styles.rouletteBtn, { backgroundColor: '#E53E3E' }]}
                  disabled={isSpinning}
                  onPress={() => betRoulette('RED')}
                >
                  <Text style={styles.rouletteText}>RED (진정제 x2)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rouletteBtn, { backgroundColor: '#3182CE' }]}
                  disabled={isSpinning}
                  onPress={() => betRoulette('BLUE')}
                >
                  <Text style={styles.rouletteText}>BLUE (각성제 x2)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rouletteBtn, { backgroundColor: '#171923', borderColor: '#E2E8F0', borderWidth: 1 }]}
                  disabled={isSpinning}
                  onPress={() => betRoulette('BLACK_ZERO')}
                >
                  <Text style={[styles.rouletteText, { color: '#FEB2B2' }]}>
                    BLACK 0 (금고 암호 x36 / 💀사망위험)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>도박장에서 나가기</Text>
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
    maxWidth: 500,
    backgroundColor: '#0F131C',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E53E3E',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#2D3748',
  },
  activeTab: {
    borderColor: '#E53E3E',
  },
  tabText: {
    color: '#EDF2F7',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dealerBox: {
    backgroundColor: '#1C1520',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E53E3E',
    marginBottom: 14,
  },
  dealerTitle: {
    color: '#FEB2B2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dealerSub: {
    color: '#CBD5E0',
    fontSize: 13,
    marginTop: 2,
  },
  chipsCount: {
    color: '#ECC94B',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 6,
  },
  gameArea: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resultText: {
    color: '#E2E8F0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    minHeight: 38,
  },
  actionButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rouletteGrid: {
    width: '100%',
    gap: 10,
  },
  rouletteBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rouletteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#A0AEC0',
    fontSize: 13,
  },
});