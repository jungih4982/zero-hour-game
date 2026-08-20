// App.tsx
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Alert, Platform, Vibration, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { useGameStore } from './store/useGameStore';
import { SCENARIO_NODES, Choice, ScenarioNode } from './data/scenarioNodes';
import { VisualStage } from './components/VisualStage';
import { TypewriterText } from './components/TypewriterText';
import { CasinoModal } from './components/CasinoModal';
import { DeathLogModal } from './components/DeathLogModal';
import { JobSelectModal } from './components/JobSelectModal';
import { InventoryModal } from './components/InventoryModal';
import { MapModal } from './components/MapModal';

const FALLBACK_NODE: ScenarioNode = {
  nodeId: 'NODE_FALLBACK',
  timeSlot: '22:00',
  locationName: '1F 지상 로비 입구',
  speakerName: '시스템',
  scriptText: '데이터를 불러오는 중입니다...',
  choices: [],
};

const distortText = (text: string) => text.replace(/[가-힣]/g, (char) => (Math.random() < 0.2 ? '§#@' : char));

export default function App() {
  const store = useGameStore();

  const [currentNodeId, setCurrentNodeId] = useState<string>('NODE_PROLOGUE_INTRO');
  const [systemLog, setSystemLog] = useState<string>('폭설로 진입로가 무너져 고립되었습니다.');
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);

  const [isTextComplete, setIsTextComplete] = useState<boolean>(false);
  const [forceComplete, setForceComplete] = useState<boolean>(false);

  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isDeathLogOpen, setIsDeathLogOpen] = useState(false);
  const [isJobSelectOpen, setIsJobSelectOpen] = useState(false);
  const [isInvOpen, setIsInvOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [bgmSound, setBgmSound] = useState<Audio.Sound>();
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  
  const lastTapTime = useRef<number>(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const nodes = SCENARIO_NODES || {};
  const currentNode: ScenarioNode = nodes[currentNodeId] || nodes['NODE_PROLOGUE_INTRO'] || FALLBACK_NODE;
  const currentChoices: Choice[] = currentNode.choices || [];
  const isInsane = (store?.sanity ?? 100) <= 30;

  const dialogues = currentNode.scriptText.split('\n\n').filter((t) => t.trim() !== '');
  const isEndOfDialogue = dialogueIdx >= dialogues.length - 1;

  const isSingleSimpleChoice = 
    currentChoices.length === 1 && 
    currentChoices[0].costAp === 0 && 
    !currentChoices[0].requiredJob && 
    !currentChoices[0].requiredClue && 
    !currentChoices[0].requiredItem && 
    !currentChoices[0].triggerDeathId;

  // ⭐️ [버그 원인 제거] 여기서 쓰던 딜레이 걸리던 useEffect 지워버림! 

  useEffect(() => {
    async function loadBGM() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'data:audio/mp3;base64,' },
          { isLooping: true, volume: 0.3 }
        );
        setBgmSound(sound);
      } catch (error) {}
    }
    loadBGM();
    return () => { bgmSound?.unloadAsync(); };
  }, []);

  const triggerShakeEffect = () => {
    if (Platform.OS !== 'web') Vibration.vibrate(400); 
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: false })
    ]).start();
  };

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onConfirm) onConfirm();
    } else { Alert.alert(title, message, [{ text: '확인', onPress: onConfirm }]); }
  };

  const handleSelectChoice = (choice: Choice) => {
    if (choice.costAp > 0 && store.apRemaining < choice.costAp) {
      setSystemLog('⚠️ 행동력(AP)이 부족합니다!'); return;
    }
    if (choice.unlockClue) {
      store.unlockClue(choice.unlockClue);
      setSystemLog(`💡 중요 단서 습득: [${choice.unlockClue}]`);
    }
    if (choice.unlockItem) {
      store.addItem(choice.unlockItem);
      setSystemLog(`🎒 아이템 획득: [${choice.unlockItem}]`);
    }

    if (choice.triggerDeathId && choice.deathCause && choice.deathTrait) {
      triggerShakeEffect();
      showAlert('💀 루프 사망', `사망 원인: ${choice.deathCause}\n영구 패시브 [${choice.deathTrait}] 해금!`, () => {
        store.triggerDeath(choice.triggerDeathId!, choice.deathCause!, choice.deathTrait!);
        setCurrentNodeId('NODE_PROLOGUE_INTRO');
        setDialogueIdx(0);
        // ⭐️ 죽어서 리셋될 때 텍스트 상태 즉시 초기화
        setIsTextComplete(false);
        setForceComplete(false);
        setSystemLog('루프 리셋: 차가운 로비 입구에서 거친 숨을 몰아쉬며 다시 눈을 떴습니다.');
      });
      return;
    }

    let nextAp = store.apRemaining;
    if (choice.costAp > 0) {
      nextAp = Math.max(0, store.apRemaining - choice.costAp);
      store.consumeAp(choice.costAp);
    }

    if (currentNode.timeSlot === '22:00' && nextAp === 0) {
      triggerShakeEffect();
      showAlert('⚠️ 00:00 제로 아워 발발', 'AP가 모두 소진되었습니다! 괘종시계가 12번 울리며 병원 전체가 암전에 빠집니다!', () => {
        useGameStore.setState({ apRemaining: 2 });
        const blackoutNode = nodes['NODE_0000_BLACKOUT_EVENT'];
        store.visitLocation?.(blackoutNode.locationName);
        setCurrentNodeId('NODE_0000_BLACKOUT_EVENT');
        setDialogueIdx(0);
        // ⭐️ 정전 강제 이동 시 텍스트 상태 즉시 초기화
        setIsTextComplete(false);
        setForceComplete(false);
        setSystemLog('🚨 코드 블랙 발령: 방호복 경비대가 로비로 난입합니다!');
      });
      return;
    }

    if (choice.nextNodeId && nodes[choice.nextNodeId]) {
      const nextNode = nodes[choice.nextNodeId];
      store.visitLocation?.(nextNode.locationName);
      setCurrentNodeId(choice.nextNodeId);
      setDialogueIdx(0);
      // ⭐️ 정상 맵 이동 시 텍스트 상태 즉시 초기화 (버그 원천 차단!)
      setIsTextComplete(false);
      setForceComplete(false);
    }
  };

  const handleTapDialogue = async () => {
    const now = Date.now();
    if (now - lastTapTime.current < 250) return; // 0.25초 연타 방지
    lastTapTime.current = now;

    if (!isBgmPlaying && bgmSound) {
      try { await bgmSound.playAsync(); } catch (error) {}
      setIsBgmPlaying(true);
    }

    if (!isTextComplete) {
      setForceComplete(true); // 타이핑 스킵
    } else {
      if (!isEndOfDialogue) {
        setDialogueIdx((prev) => prev + 1);
        // ⭐️ 다음 대사로 넘어갈 때 상태 즉시 초기화 (버그 원천 차단!)
        setIsTextComplete(false);
        setForceComplete(false);
      } else if (isSingleSimpleChoice) {
        // 단일 선택지는 대화창 터치만으로 쾌적하게 이동
        handleSelectChoice(currentChoices[0]);
      }
    }
  };

  const rawText = dialogues[dialogueIdx] || '';
  const displayText = isInsane ? distortText(rawText) : rawText;

  return (
    <SafeAreaView style={[styles.safeArea, isInsane && styles.insaneSafeArea]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.hudContainer, isInsane && styles.insaneHud]}>
        <TouchableOpacity onPress={() => setIsJobSelectOpen(true)}>
          <Text style={styles.hudHighlight}>LOOP #{store?.loopCount ?? 1}</Text>
          <Text style={styles.hudSubText}>{store?.selectedJob} ▾</Text>
        </TouchableOpacity>
        <View style={styles.hudCenter}>
          <Text style={styles.hudText}>{currentNode.timeSlot}</Text>
          <Text style={[styles.hudText, store.apRemaining === 0 && styles.apZeroText]}>AP: {store?.apRemaining ?? 0}/2</Text>
        </View>
        <View style={styles.hudRight}>
          <Text style={[styles.hudSanity, isInsane && styles.sanityWarning]}>SANITY: {store?.sanity ?? 100}%</Text>
        </View>
      </View>

      <Animated.View style={[styles.mainStage, { transform: [{ translateX: shakeAnim }] }]}>
        <VisualStage speaker={currentNode.speakerName} bgTheme={currentNode.bgTheme} locationName={currentNode.locationName} />
        
        <View style={styles.floatingMenu}>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => setIsMapOpen(true)}>
            <View style={styles.iconCircle}><Text style={styles.iconEmoji}>🗺️</Text></View>
            <Text style={styles.iconLabel}>지도</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => setIsInvOpen(true)}>
            <View style={styles.iconCircle}><Text style={styles.iconEmoji}>🎒</Text></View>
            <Text style={styles.iconLabel}>가방</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => setIsDeathLogOpen(true)}>
            <View style={styles.iconCircle}><Text style={styles.iconEmoji}>📖</Text></View>
            <Text style={styles.iconLabel}>도감</Text>
          </TouchableOpacity>
        </View>

        {isEndOfDialogue && isTextComplete && !isSingleSimpleChoice && (
          <View style={styles.choicesOverlay}>
            <ScrollView style={styles.choicesScroll} contentContainerStyle={styles.choicesContent}>
              {systemLog ? (
                <View style={styles.logBox}><Text style={styles.logText}>{systemLog}</Text></View>
              ) : null}

              {currentChoices.map((choice, index) => {
                const userClues = store?.metaClues || [];
                const userItems = store?.inventory || [];
                const isLocked = !!((choice.requiredJob && choice.requiredJob !== store?.selectedJob) || (choice.requiredClue && !userClues.includes(choice.requiredClue)) || (choice.requiredItem && !userItems.includes(choice.requiredItem)));

                if (isLocked) {
                  return (
                    <View key={index} style={[styles.choiceBtn, styles.lockedBtn]}>
                      <Text style={styles.lockedText}>🔒 {choice.requiredClue ? '[단서 필요]' : choice.requiredItem ? '[아이템 필요]' : '[특정 직업 전용]'}</Text>
                    </View>
                  );
                }

                const isDanger = !!choice.triggerDeathId;
                return (
                  <TouchableOpacity key={index} style={[styles.choiceBtn, isDanger && styles.dangerBtn, choice.requiredClue && styles.clueBtn, choice.requiredItem && styles.itemBtn, choice.isEnding && styles.endingBtn]} onPress={() => handleSelectChoice(choice)}>
                    <Text style={[styles.choiceText, isDanger && styles.dangerText, choice.requiredClue && styles.clueText, choice.requiredItem && styles.itemText, choice.isEnding && styles.endingText]}>{choice.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={[styles.vnDialogBox, isInsane && styles.insaneDialogBox]} activeOpacity={1} onPress={handleTapDialogue}>
          <View style={styles.vnSpeakerTag}>
            <Text style={styles.vnSpeakerText}>{currentNode.speakerName}</Text>
          </View>
          
          <TypewriterText 
            key={`${currentNode.nodeId}_${dialogueIdx}_${isInsane ? 'insane' : 'normal'}`} 
            text={displayText} 
            speed={15} 
            style={styles.vnScriptText} 
            forceComplete={forceComplete}
            onComplete={() => setIsTextComplete(true)}
          />
          
          {(!isTextComplete || !isEndOfDialogue) ? (
            <Text style={styles.tapToContinue}>▼ 터치해서 계속...</Text>
          ) : isSingleSimpleChoice ? (
            <Text style={[styles.tapToContinue, { color: '#68D391', fontSize: 13 }]}>▼ {currentChoices[0].text}</Text>
          ) : (
            <Text style={[styles.tapToContinue, { color: '#F6E05E' }]}>▲ 위 화면에서 행동을 선택하세요</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <MapModal visible={isMapOpen} onClose={() => setIsMapOpen(false)} currentLocationName={currentNode.locationName} />
      <CasinoModal visible={isCasinoOpen} onClose={() => setIsCasinoOpen(false)} onDie={(cause, trait) => { 
        triggerShakeEffect(); 
        store.triggerDeath('DEATH_04', cause, trait); 
        setCurrentNodeId('NODE_PROLOGUE_INTRO'); 
        setDialogueIdx(0); 
        setIsTextComplete(false);
        setForceComplete(false);
      }} />
      <DeathLogModal visible={isDeathLogOpen} onClose={() => setIsDeathLogOpen(false)} />
      <JobSelectModal visible={isJobSelectOpen} onClose={() => setIsJobSelectOpen(false)} />
      <InventoryModal visible={isInvOpen} onClose={() => setIsInvOpen(false)} /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050709', ...(Platform.OS === 'web' ? { height: '100vh' as any } : {}) },
  insaneSafeArea: { backgroundColor: '#1A080A' },
  hudContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#050709', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#1E2638', zIndex: 100 },
  insaneHud: { borderColor: '#E53E3E', backgroundColor: '#1A080A' },
  hudHighlight: { color: '#00E5FF', fontWeight: 'bold', fontSize: 13 },
  hudSubText: { color: '#90CDF4', fontSize: 11, marginTop: 2, fontWeight: 'bold' },
  hudCenter: { alignItems: 'center' },
  hudRight: { alignItems: 'flex-end' },
  hudText: { color: '#E2E8F0', fontSize: 13, fontWeight: 'bold' },
  apZeroText: { color: '#FF4D4D' },
  hudSanity: { color: '#68D391', fontWeight: 'bold', fontSize: 13 },
  sanityWarning: { color: '#FF4D4D' },
  
  mainStage: { flex: 1, position: 'relative', overflow: 'hidden' },
  
  floatingMenu: { position: 'absolute', top: 20, right: 16, alignItems: 'center', gap: 16, zIndex: 50 },
  iconWrapper: { alignItems: 'center' },
  iconCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(5, 7, 9, 0.7)', borderWidth: 1, borderColor: '#2D3748', justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 18 },
  iconLabel: { color: '#E2E8F0', fontSize: 10, marginTop: 4, fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },

  choicesOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 180, justifyContent: 'center', alignItems: 'center', padding: 20, zIndex: 40 },
  choicesScroll: { width: '100%', maxWidth: 500, maxHeight: '80%' },
  choicesContent: { paddingBottom: 20 },
  
  logBox: { backgroundColor: 'rgba(13, 17, 23, 0.9)', padding: 12, borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#00E5FF', marginBottom: 16 },
  logText: { color: '#A0AEC0', fontSize: 13, lineHeight: 18 },
  
  choiceBtn: { backgroundColor: 'rgba(21, 26, 35, 0.9)', padding: 16, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#2D3748' },
  choiceText: { color: '#F7FAFC', fontSize: 14, lineHeight: 22, fontWeight: '500', textAlign: 'center' },
  lockedBtn: { backgroundColor: 'rgba(13, 17, 23, 0.6)', borderColor: '#1E2535' },
  lockedText: { color: '#4A5568', fontSize: 13, textAlign: 'center' },
  dangerBtn: { backgroundColor: 'rgba(38, 18, 20, 0.9)', borderColor: '#742A2A' },
  dangerText: { color: '#FEB2B2' },
  clueBtn: { backgroundColor: 'rgba(15, 35, 40, 0.9)', borderColor: '#00A3C4' },
  clueText: { color: '#76E4F7', fontWeight: 'bold' },
  itemBtn: { backgroundColor: 'rgba(43, 35, 19, 0.9)', borderColor: '#D69E2E' },
  itemText: { color: '#F6E05E', fontWeight: 'bold' },
  endingBtn: { backgroundColor: 'rgba(45, 55, 72, 0.9)', borderColor: '#ECC94B', borderWidth: 2 },
  endingText: { color: '#ECC94B', fontWeight: 'bold' },

  vnDialogBox: { position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(10, 14, 23, 0.85)', borderWidth: 1, borderColor: '#2D3748', borderRadius: 12, padding: 20, minHeight: 150, zIndex: 60, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10 },
  insaneDialogBox: { backgroundColor: 'rgba(38, 15, 20, 0.85)', borderColor: '#E53E3E' },
  vnSpeakerTag: { position: 'absolute', top: -14, left: 16, backgroundColor: '#1A365D', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: '#2B6CB0' },
  vnSpeakerText: { color: '#90CDF4', fontSize: 13, fontWeight: 'bold' },
  vnScriptText: { color: '#EDF2F7', fontSize: 15, lineHeight: 26, marginTop: 10 },
  tapToContinue: { position: 'absolute', bottom: 12, right: 16, color: '#718096', fontSize: 11, fontWeight: 'bold' },
});