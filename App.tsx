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
  
  // ⭐️ 핵심: 대화 쪼개기용 상태 (현재 몇 번째 대사를 보고 있는지)
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);

  // 모달 상태
  const [isCasinoOpen, setIsCasinoOpen] = useState<boolean>(false);
  const [isDeathLogOpen, setIsDeathLogOpen] = useState<boolean>(false);
  const [isJobSelectOpen, setIsJobSelectOpen] = useState<boolean>(false);

  const nodes = SCENARIO_NODES || {};
  const currentNode: ScenarioNode =
    nodes[currentNodeId] || nodes['NODE_PROLOGUE_INTRO'] || FALLBACK_NODE;
  const currentChoices: Choice[] = currentNode.choices || [];

  const isInsane = (store?.sanity ?? 100) <= 30;

  // ⭐️ 대사를 두 줄 바꿈(\n\n) 기준으로 배열로 쪼갬
  const dialogues = currentNode.scriptText.split('\n\n').filter((t) => t.trim() !== '');
  const isEndOfDialogue = dialogueIdx >= dialogues.length - 1;

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onConfirm) onConfirm();
    } else {
      Alert.alert(title, message, [{ text: '확인', onPress: onConfirm }]);
    }
  };

  // ⭐️ 대화창 탭할 때 다음 대사로 넘기기
  const handleTapDialogue = () => {
    if (!isEndOfDialogue) {
      setDialogueIdx((prev) => prev + 1);
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
          setDialogueIdx(0); // ⭐️ 씬 넘어갈 때 대화 인덱스 초기화
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
          setDialogueIdx(0);
          setSystemLog('🚨 코드 블랙 발령: 방호복 경비대가 로비로 난입합니다!');
        }
      );
      return;
    }

    if (choice.nextNodeId && nodes[choice.nextNodeId]) {
      setCurrentNodeId(choice.nextNodeId);
      setDialogueIdx(0); // ⭐️ 새로운 노드로 갈 때 첫 대사부터 시작
    }
  };

  const rawText = dialogues[dialogueIdx] || '';
  const displayText = isInsane ? distortText(rawText) : rawText;

  return (
    <SafeAreaView style={[styles.safeArea, isInsane && styles.insaneSafeArea]}>
      <StatusBar barStyle="light-content" />

      {/* 상단 HUD (고정) */}
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

      <View style={[styles.mainLayout, isTablet && styles.tabletSplitLayout]}>
        {/* 상단 비주얼 영역 (70% 비율 차지) */}
        <View style={styles.visualSection}>
          <VisualStage
            speaker={currentNode.speakerName}
            isTabletSplit={isTablet}
            bgTheme={currentNode.bgTheme}
            locationName={currentNode.locationName}
          />
        </View>

        {/* 하단 내러티브 및 조작 패널 (30% 비율 차지) */}
        <View style={[styles.controlPanel, isTablet && styles.tabletControlPanel]}>
          
          {/* ⭐️ 대화창 영역 (항상 고정) */}
          <TouchableOpacity 
            style={[styles.dialogBox, isInsane && styles.insaneDialogBox]} 
            activeOpacity={0.8} 
            onPress={handleTapDialogue}
          >
            <View style={styles.speakerTag}>
              <Text style={styles.speakerName}>[{currentNode.speakerName}]</Text>
            </View>

            <TypewriterText
              key={`${currentNode.nodeId}_${dialogueIdx}_${isInsane ? 'insane' : 'normal'}`}
              text={displayText}
              speed={15} // 텍스트 타이핑 속도 조금 더 쾌적하게 올림
              style={styles.scriptText}
            />

            {!isEndOfDialogue && (
              <Text style={styles.tapToContinue}>▼ 화면을 터치해서 다음으로...</Text>
            )}
          </TouchableOpacity>

          {/* ⭐️ 대사를 끝까지 다 봐야만 선택지와 도감 버튼이 나타남! */}
          {isEndOfDialogue && (
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
              {systemLog ? (
                <View style={styles.logBox}>
                  <Text style={styles.logText}>{systemLog}</Text>
                </View>
              ) : null}

              {/* 퀵 메뉴 */}
              <View style={styles.quickBar}>
                <TouchableOpacity style={styles.quickButton} onPress={() => setIsDeathLogOpen(true)}>
                  <Text style={styles.quickButtonText}>📖 사망 도감</Text>
                </TouchableOpacity>
                {currentNode.nodeId === 'NODE_B1_CASINO_HUB' && (
                  <TouchableOpacity style={[styles.quickButton, {borderColor: '#E53E3E'}]} onPress={() => setIsCasinoOpen(true)}>
                    <Text style={[styles.quickButtonText, {color: '#FEB2B2'}]}>🎰 도박 시작</Text>
                  </TouchableOpacity>
                )}
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
                      choice.isEnding && styles.endingButton, // 엔딩 분기 특수 색상
                    ]}
                    onPress={() => handleSelectChoice(choice)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        isDanger && styles.dangerChoiceText,
                        choice.requiredClue && styles.loopClueText,
                        choice.isEnding && styles.endingText,
                      ]}
                    >
                      {choice.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* 모달 3종 */}
          <CasinoModal
            visible={isCasinoOpen}
            onClose={() => setIsCasinoOpen(false)}
            onDie={(cause, trait) => {
              store.triggerDeath('DEATH_04', cause, trait);
              setCurrentNodeId('NODE_1F_LOBBY_START');
              setDialogueIdx(0);
              setSystemLog('루프 리셋: 도박장에서 살해당해 22:00 로비로 되돌아왔습니다.');
            }}
          />
          <DeathLogModal visible={isDeathLogOpen} onClose={() => setIsDeathLogOpen(false)} />
          <JobSelectModal visible={isJobSelectOpen} onClose={() => setIsJobSelectOpen(false)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050709',
    ...(Platform.OS === 'web' ? { height: '100vh' as any } : {}),
  },
  insaneSafeArea: {
    backgroundColor: '#1A080A',
  },
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B0D12',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#1E2638',
    zIndex: 10,
  },
  insaneHud: {
    borderColor: '#E53E3E',
    backgroundColor: '#2B0E12',
  },
  hudHighlight: { color: '#00E5FF', fontWeight: 'bold', fontSize: 13 },
  hudSubText: { color: '#90CDF4', fontSize: 11, marginTop: 2, fontWeight: 'bold' },
  hudCenter: { alignItems: 'center' },
  hudRight: { alignItems: 'flex-end' },
  hudText: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
  apZeroText: { color: '#FF4D4D', fontWeight: 'bold' },
  hudSanity: { color: '#68D391', fontWeight: 'bold', fontSize: 14 },
  sanityWarning: { color: '#FF4D4D' },
  
  // ⭐️ 레이아웃 대격변
  mainLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  tabletSplitLayout: {
    flexDirection: 'row',
  },
  visualSection: {
    flex: 5.5, // 씬 비율 확대
    backgroundColor: '#050709',
  },
  controlPanel: {
    flex: 4.5,
    backgroundColor: '#0A0C10',
    borderTopWidth: 2,
    borderColor: '#1E2638',
    justifyContent: 'flex-start',
  },
  tabletControlPanel: {
    flex: 1,
    borderLeftWidth: 2,
    borderTopWidth: 0,
    borderColor: '#1E2638',
  },

  // ⭐️ 정통 비주얼 노벨 대화창 스타일
  dialogBox: {
    padding: 16,
    backgroundColor: '#0A0E17',
    minHeight: 140,
    borderBottomWidth: 1,
    borderColor: '#1E2638',
  },
  insaneDialogBox: {
    backgroundColor: '#260F14',
    borderColor: '#E53E3E',
  },
  speakerTag: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  speakerName: { color: '#63B3ED', fontSize: 15, fontWeight: 'bold' },
  scriptText: { color: '#EDF2F7', fontSize: 15, lineHeight: 24 },
  tapToContinue: {
    color: '#718096',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 12,
    fontWeight: 'bold',
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  logBox: {
    backgroundColor: '#0D1117',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#00E5FF',
    marginBottom: 12,
  },
  logText: { color: '#A0AEC0', fontSize: 13, lineHeight: 18 },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#11151E',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1C2333',
    alignItems: 'center',
  },
  quickButtonText: { color: '#90CDF4', fontSize: 12, fontWeight: 'bold' },
  hallucinationButton: {
    backgroundColor: '#4A0D17',
    borderColor: '#FF2A4D',
    borderWidth: 2,
    marginBottom: 8,
    padding: 14,
    borderRadius: 8,
  },
  hallucinationText: { color: '#FFA8B8', fontWeight: 'bold', fontSize: 13 },
  choiceButton: {
    backgroundColor: '#151A23',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  choiceText: { color: '#F7FAFC', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  lockedButton: { backgroundColor: '#0D1117', borderColor: '#1E2535', opacity: 0.5 },
  lockedChoiceText: { color: '#4A5568', fontSize: 13 },
  dangerButton: { backgroundColor: '#261214', borderColor: '#742A2A' },
  dangerChoiceText: { color: '#FEB2B2' },
  loopClueButton: { backgroundColor: '#0F2328', borderColor: '#00A3C4' },
  loopClueText: { color: '#76E4F7', fontWeight: 'bold' },
  
  // 엔딩 전용 화려한 버튼
  endingButton: { backgroundColor: '#2D3748', borderColor: '#ECC94B', borderWidth: 2 },
  endingText: { color: '#ECC94B', fontWeight: 'bold', textAlign: 'center' },
});