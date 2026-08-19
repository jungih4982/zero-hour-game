// App.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useGameStore } from './store/useGameStore';
import { SCENARIO_NODES, Choice, ScenarioNode } from './data/scenarioNodes';
import { VisualStage } from './components/VisualStage';
import { TypewriterText } from './components/TypewriterText';
import { CasinoModal } from './components/CasinoModal';
import { DeathLogModal } from './components/DeathLogModal';
import { JobSelectModal } from './components/JobSelectModal';

const FALLBACK_NODE: ScenarioNode = {
  nodeId: 'NODE_FALLBACK',
  timeSlot: '22:00',
  locationName: '1F 지상 로비',
  speakerName: '시스템',
  scriptText: '데이터를 불러오는 중입니다...',
  choices: [],
};

const distortText = (text: string) => {
  return text.replace(/[가-힣]/g, (char) => (Math.random() < 0.2 ? '§#@' : char));
};

export default function App() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const store = useGameStore();

  const [currentNodeId, setCurrentNodeId] = useState<string>('NODE_PROLOGUE_INTRO');
  const [systemLog, setSystemLog] = useState<string>('폭설로 진입로가 무너져 고립되었습니다.');

  // 모달 상태
  const [isCasinoOpen, setIsCasinoOpen] = useState<boolean>(false);
  const [isDeathLogOpen, setIsDeathLogOpen] = useState<boolean>(false);
  const [isJobSelectOpen, setIsJobSelectOpen] = useState<boolean>(false);

  const nodes = SCENARIO_NODES || {};
  const currentNode: ScenarioNode =
    nodes[currentNodeId] || nodes['NODE_PROLOGUE_INTRO'] || FALLBACK_NODE;
  const currentChoices: Choice[] = currentNode.choices || [];

  const isInsane = (store?.sanity ?? 100) <= 30;

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onConfirm) onConfirm();
    } else {
      Alert.alert(title, message, [{ text: '확인', onPress: onConfirm }]);
    }
  };

  const handleSelectChoice = (choice: Choice) => {
    if (choice.costAp > 0 && store.apRemaining < choice.costAp) {
      setSystemLog('⚠️ 행동력(AP)이 부족합니다!');
      return;
    }

    if (choice.unlockClue) {
      store.unlockClue(choice.unlockClue);
      setSystemLog(`💡 중요 단서 습득: [${choice.unlockClue}]`);
    }

    if (choice.triggerDeathId && choice.deathCause && choice.deathTrait) {
      showAlert(
        '💀 루프 사망',
        `사망 원인: ${choice.deathCause}\n영구 패시브 [${choice.deathTrait}] 해금!`,
        () => {
          store.triggerDeath(choice.triggerDeathId!, choice.deathCause!, choice.deathTrait!);
          setCurrentNodeId('NODE_1F_LOBBY_START');
          setSystemLog('루프 리셋: 차가운 로비 소파에서 심장 박동과 함께 다시 눈을 떴습니다.');
        }
      );
      return;
    }

    let nextAp = store.apRemaining;
    if (choice.costAp > 0) {
      nextAp = Math.max(0, store.apRemaining - choice.costAp);
      store.consumeAp(choice.costAp);
    }

    if (currentNode.timeSlot === '22:00' && nextAp === 0) {
      showAlert(
        '⚠️ 00:00 제로 아워 발발',
        'AP가 모두 소진되었습니다! 괘종시계가 12번 울리며 병원 전체가 암전에 빠집니다!',
        () => {
          useGameStore.setState({ apRemaining: 2 });
          setCurrentNodeId('NODE_0000_BLACKOUT_EVENT');
          setSystemLog('🚨 코드 블랙 발령: 방호복 경비대가 로비로 난입합니다!');
        }
      );
      return;
    }

    if (choice.nextNodeId && nodes[choice.nextNodeId]) {
      setCurrentNodeId(choice.nextNodeId);
    }
  };

  const displayText = isInsane ? distortText(currentNode.scriptText) : currentNode.scriptText;

  return (
    <SafeAreaView style={[styles.safeArea, isInsane && styles.insaneSafeArea]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.mainLayout, isTablet && styles.tabletSplitLayout]}>
        {/* 비주얼 스테이지 */}
        <VisualStage
          speaker={currentNode.speakerName}
          isTabletSplit={isTablet}
          bgTheme={currentNode.bgTheme}
          locationName={currentNode.locationName}
        />

        {/* 조작 및 내러티브 패널 */}
        <View style={[styles.controlPanel, isTablet && styles.tabletControlPanel]}>
          {/* 상단 HUD */}
          <View style={[styles.hudContainer, isInsane && styles.insaneHud]}>
            <TouchableOpacity onPress={() => setIsJobSelectOpen(true)}>
              <Text style={styles.hudHighlight}>LOOP #{store?.loopCount ?? 1}</Text>
              <Text style={styles.hudSubText}>직업: {store?.selectedJob} ▾</Text>
            </TouchableOpacity>
            <View style={styles.hudCenter}>
              <Text style={styles.hudText}>TIME: {currentNode.timeSlot}</Text>
              <Text style={[styles.hudText, store.apRemaining === 0 && styles.apZeroText]}>
                AP: {store?.apRemaining ?? 0}/2
              </Text>
            </View>
            <View style={styles.hudRight}>
              <Text style={[styles.hudSanity, isInsane && styles.sanityWarning]}>
                SANITY: {store?.sanity ?? 100}%
              </Text>
              <Text style={styles.hudSubText}>CHIPS: {store?.chips ?? 0}개</Text>
            </View>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* 대화 및 지문 카드 */}
            <View style={[styles.storyCard, isInsane && styles.insaneCard]}>
              <View style={styles.speakerTag}>
                <Text style={styles.speakerName}>[{currentNode.speakerName}]</Text>
              </View>

              <TypewriterText
                key={currentNode.nodeId + (isInsane ? '_insane' : '_normal')}
                text={displayText}
                speed={18}
                style={styles.scriptText}
              />

              {systemLog ? (
                <View style={styles.logBox}>
                  <Text style={styles.logText}>{systemLog}</Text>
                </View>
              ) : null}
            </View>

            {/* 도감 / 직업 퀵 버튼 */}
            <View style={styles.quickBar}>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => setIsDeathLogOpen(true)}
              >
                <Text style={styles.quickButtonText}>
                  📖 사망 도감 ({(store?.deathRecords || []).length}회)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => setIsJobSelectOpen(true)}
              >
                <Text style={styles.quickButtonText}>👤 직업 변경</Text>
              </TouchableOpacity>
            </View>

            {/* 환각 선택지 */}
            {isInsane && (
              <TouchableOpacity
                style={[styles.choiceButton, styles.hallucinationButton]}
                onPress={() => {
                  showAlert('환각', '벽을 긁어대다 손톱이 부러졌습니다. 정신력이 더 깎입니다.');
                  store.reduceSanity(10);
                }}
              >
                <Text style={styles.hallucinationText}>
                  👁️ [환각] 벽 뒤에서 지우의 목소리가 들린다... 벽을 긁어낸다!
                </Text>
              </TouchableOpacity>
            )}

            {/* 시나리오 선택지 */}
            <Text style={styles.choiceSectionTitle}>가능한 행동</Text>
            {currentChoices.map((choice, index) => {
              const userClues = store?.metaClues || [];
              const isJobLocked = !!(choice.requiredJob && choice.requiredJob !== store?.selectedJob);
              const isClueLocked = !!(choice.requiredClue && !userClues.includes(choice.requiredClue));
              const isLocked = isJobLocked || isClueLocked;

              if (isLocked) {
                return (
                  <View key={index} style={[styles.choiceButton, styles.lockedButton]}>
                    <Text style={styles.lockedChoiceText}>
                      🔒 {choice.requiredClue ? '[루프 지식 필요] ???' : `[${choice.requiredJob} 전용] ???`}
                    </Text>
                  </View>
                );
              }

              const isDanger = !!choice.triggerDeathId;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.choiceButton,
                    isDanger && styles.dangerButton,
                    choice.requiredClue && styles.loopClueButton,
                  ]}
                  onPress={() => handleSelectChoice(choice)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      isDanger && styles.dangerChoiceText,
                      choice.requiredClue && styles.loopClueText,
                    ]}
                  >
                    {choice.text}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* B1 카지노 전용 버튼 */}
            {currentNode.nodeId === 'NODE_B1_CASINO_HUB' && (
              <TouchableOpacity
                style={[styles.choiceButton, styles.casinoEntryButton]}
                onPress={() => setIsCasinoOpen(true)}
              >
                <Text style={styles.casinoEntryText}>
                  🎰 카밀라와 칩 베팅 시작하기 (빅휠 / 처방전 룰렛)
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* 모달 3종 */}
          <CasinoModal
            visible={isCasinoOpen}
            onClose={() => setIsCasinoOpen(false)}
            onDie={(cause, trait) => {
              store.triggerDeath('DEATH_04', cause, trait);
              setCurrentNodeId('NODE_1F_LOBBY_START');
              setSystemLog('루프 리셋: 도박장에서 살해당해 22:00 로비로 되돌아왔습니다.');
            }}
          />

          <DeathLogModal
            visible={isDeathLogOpen}
            onClose={() => setIsDeathLogOpen(false)}
          />

          <JobSelectModal
            visible={isJobSelectOpen}
            onClose={() => setIsJobSelectOpen(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0C10',
    // '100vh' 뒤에 as any 를 붙여서 타입 에러를 무시하게 만듭니다.
    ...(Platform.OS === 'web' ? { height: '100vh' as any } : {}),
  },
  insaneSafeArea: {
    backgroundColor: '#1A080A',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  tabletSplitLayout: {
    flexDirection: 'row',
  },
  controlPanel: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },
  tabletControlPanel: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: '#1E2638',
  },
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#12161F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#1E2638',
  },
  insaneHud: {
    borderColor: '#E53E3E',
    backgroundColor: '#2B0E12',
  },
  hudHighlight: { color: '#00E5FF', fontWeight: 'bold', fontSize: 13 },
  hudSubText: { color: '#90CDF4', fontSize: 11, marginTop: 2, fontWeight: 'bold' },
  hudCenter: { alignItems: 'center' },
  hudRight: { alignItems: 'flex-end' },
  hudText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' },
  apZeroText: { color: '#FF4D4D', fontWeight: 'bold' },
  hudSanity: { color: '#68D391', fontWeight: 'bold', fontSize: 13 },
  sanityWarning: { color: '#FF4D4D' },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  storyCard: {
    backgroundColor: '#151922',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#232B3E',
  },
  insaneCard: {
    borderColor: '#E53E3E',
    backgroundColor: '#260F14',
  },
  speakerTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E2638',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  speakerName: { color: '#63B3ED', fontSize: 14, fontWeight: 'bold' },
  scriptText: { color: '#EDF2F7', fontSize: 14, lineHeight: 22, marginBottom: 8 },
  logBox: {
    backgroundColor: '#0D1117',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#00E5FF',
    marginTop: 4,
  },
  logText: { color: '#A0AEC0', fontSize: 12, lineHeight: 18 },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#11151E',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1C2333',
    alignItems: 'center',
  },
  quickButtonText: { color: '#90CDF4', fontSize: 11, fontWeight: 'bold' },
  hallucinationButton: {
    backgroundColor: '#4A0D17',
    borderColor: '#FF2A4D',
    borderWidth: 2,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  hallucinationText: { color: '#FFA8B8', fontWeight: 'bold', fontSize: 13 },
  choiceSectionTitle: {
    color: '#718096',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  choiceButton: {
    backgroundColor: '#1A202C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  choiceText: { color: '#F7FAFC', fontSize: 13, lineHeight: 19, fontWeight: '500' },
  lockedButton: { backgroundColor: '#10141D', borderColor: '#1E2535', opacity: 0.6 },
  lockedChoiceText: { color: '#4A5568', fontSize: 12 },
  dangerButton: { backgroundColor: '#261214', borderColor: '#742A2A' },
  dangerChoiceText: { color: '#FEB2B2' },
  loopClueButton: { backgroundColor: '#0F2328', borderColor: '#00A3C4' },
  loopClueText: { color: '#76E4F7', fontWeight: 'bold' },
  casinoEntryButton: { backgroundColor: '#351119', borderColor: '#E53E3E', marginTop: 6 },
  casinoEntryText: { color: '#FEB2B2', fontWeight: 'bold', fontSize: 13 },
});