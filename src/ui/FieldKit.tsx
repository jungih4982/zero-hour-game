import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BrainCircuit,
  LockKeyhole,
  MapPinned,
  NotebookTabs,
  PackageOpen,
  X,
} from 'lucide-react-native';
import type { ClueId, DeductionId, LocationId, NarrativeEngineState } from '../engine';
import { canFormDeduction, deductions, isCorrectDeductionConnection } from '../gameplay/deductions';

export type FieldKitTab = 'map' | 'evidence' | 'deduction' | 'items';
type PictureCopy = { title: string; detail: string; image: ImageSourcePropType };
type LocationEntry = PictureCopy & { id: LocationId; floor: string; name: string };

const fieldBoard = require('../../assets/ui/ZH_UI_Mnemosyne_FieldBoard_v001.png');
const pictures = {
  road: require('../../assets/backgrounds/car/BG_Car_Interior_Night_v01.png'),
  exterior: require('../../assets/backgrounds/exterior/BG_Hospital_Exterior_Arrival_v01.png'),
  lobby: require('../../assets/backgrounds/1f/BG_1F_Lobby_v01.png'),
  staffDoor: require('../../assets/backgrounds/1f/BG_1F_StaffDoor_Normal_v01.png'),
  corridor: require('../../assets/backgrounds/3f/BG_3F_Corridor_Normal_v01.png'),
  room302: require('../../assets/backgrounds/3f/BG_302Room_Normal_v01.png'),
  map: require('../../assets/backgrounds/3f/BG_3F_OldEvacuationMap_v01.png'),
  b1: require('../../assets/backgrounds/b1/BG_B1_OperationsCorridor_Portrait_v01.png'),
  death: require('../../assets/backgrounds/special/CG_FirstDeath_Midnight_v01.png'),
  seoyun: require('../../assets/characters/seoyun/sprites/CHAR_Seoyun_Phone_Tense_Bust_v02.png'),
};

const locations: readonly LocationEntry[] = [
  { id: 'MOUNTAIN_ROAD' as LocationId, floor: '외부', name: '산길', title: '산길', detail: '백야의료원으로 이어지는 외곽 도로', image: pictures.road },
  { id: 'CAR' as LocationId, floor: '외부', name: '차 안', title: '차 안', detail: '첫 통화가 시작된 곳', image: pictures.road },
  { id: 'HOSPITAL_EXTERIOR' as LocationId, floor: '외부', name: '정문', title: '정문', detail: '주차장과 병원 출입구', image: pictures.exterior },
  { id: '1F_LOBBY' as LocationId, floor: '1F', name: '로비', title: '로비', detail: '접수처와 원무과가 있는 중앙 홀', image: pictures.lobby },
  { id: '1F_STAFF_DOOR' as LocationId, floor: '1F', name: '복도 끝', title: '복도 끝', detail: '지하 계단으로 이어지는 잠긴 문', image: pictures.staffDoor },
  { id: '3F_CORRIDOR' as LocationId, floor: '3F', name: '입원병동', title: '입원병동', detail: '301호와 302호가 있는 복도', image: pictures.corridor },
  { id: 'ROOM_302' as LocationId, floor: '3F', name: '302호', title: '302호', detail: '기록과 현장이 맞지 않는 병실', image: pictures.room302 },
  { id: 'B1_OPERATIONS_CORRIDOR' as LocationId, floor: 'B1', name: '지하 구역', title: '지하 구역', detail: '표찰이 사라진 문들이 이어지는 통제 구역', image: pictures.b1 },
];

const clueCopy: Readonly<Record<string, PictureCopy>> = {
  CLUE_WATCH_GIFT: { title: '오래된 손목시계', detail: '서윤이 선물한 시계. 시간은 정확했다.', image: pictures.death },
  CLUE_YUJIN_KNOWN: { title: '먼저 나온 이름', detail: '서윤은 듣지 못했어야 할 유진의 이름을 알고 있었다.', image: pictures.corridor },
  CLUE_B1_MAP: { title: '피난 안내도', detail: '복도 끝에서 지하로 이어지는 계단이 표시돼 있다.', image: pictures.map },
  CLUE_302_OCCUPIED: { title: '비어 있지 않은 302호', detail: '직원의 설명과 달리 방금까지 환자가 머문 흔적이 있다.', image: pictures.room302 },
  CLUE_WRISTBAND_DOB: { title: '찢어진 손목밴드', detail: '이름은 뜯겼지만 생년월일은 서윤과 같았다.', image: pictures.room302 },
  CLUE_FIRST_PHONE: { title: '첫 번째 휴대전화', detail: '302호의 전화가 울리는 동안 서윤과 통화 중이었다.', image: pictures.seoyun },
  CLUE_SECOND_PHONE: { title: '동시에 존재한 전화', detail: '같은 번호와 기기가 서로 다른 두 곳에 존재했다.', image: pictures.seoyun },
  CLUE_SEA_KNOWS: { title: '세아의 경고', detail: '세아는 처음 만난 나의 죽음과 반복을 알고 있었다.', image: pictures.b1 },
  CLUE_B1_UNMARKED_ROOMS: { title: '막아 버린 관찰창', detail: '표찰을 뗀 문 아래에 관찰창을 막았던 자국이 남았다.', image: pictures.b1 },
  CLUE_B1_TRANSFER_TRACKS: { title: '꺾인 바퀴 자국', detail: '젖은 카트 바퀴 자국이 열린 린넨실로 이어진다.', image: pictures.b1 },
};

const itemCopy: Readonly<Record<string, PictureCopy>> = {
  ITEM_FIRST_PHONE_PHOTO: { title: '봉투 속 전화 사진', detail: '오른쪽 아래의 흠집까지 서윤의 전화와 일치한다.', image: pictures.seoyun },
  ITEM_SECOND_PHONE: { title: '침대 아래의 휴대전화', detail: '첫 번째 전화와 같은 흠집이 있고 동시에 울린다.', image: pictures.room302 },
  ITEM_WRISTBAND_PHOTO: { title: '손목밴드 사진', detail: '302호와 생년월일이 식별되도록 촬영했다.', image: pictures.room302 },
};

const tabs: readonly { id: FieldKitTab; label: string; Icon: typeof MapPinned }[] = [
  { id: 'map', label: '현장', Icon: MapPinned },
  { id: 'evidence', label: '단서', Icon: NotebookTabs },
  { id: 'deduction', label: '추론', Icon: BrainCircuit },
  { id: 'items', label: '소지품', Icon: PackageOpen },
];

function formatTime(offset: number) {
  const total = 22 * 60 + offset;
  return `${String(Math.floor((total % 1440) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function SectionHeading({ title, count }: { title: string; count?: string | number }) {
  return <View style={styles.sectionHeading}><View style={styles.sectionRule} /><Text style={styles.sectionTitle}>{title}</Text>{count !== undefined ? <Text style={styles.sectionCount}>{count}</Text> : null}</View>;
}

function EmptyState({ children }: { children: string }) {
  return <View style={styles.emptyState}><View style={styles.emptyReticle}><Text style={styles.emptyReticleText}>＋</Text></View><Text style={styles.emptyText}>{children}</Text></View>;
}

export function FieldKit({ state, visitedLocationIds, onClose, topInset, bottomInset, onFormDeduction, initialTab = 'map' }: {
  state: NarrativeEngineState;
  visitedLocationIds: readonly LocationId[];
  onClose: () => void;
  topInset: number;
  bottomInset: number;
  onFormDeduction: (deductionId: DeductionId) => void;
  initialTab?: FieldKitTab;
}) {
  const [activeTab, setActiveTab] = useState<FieldKitTab>(initialTab);
  const [selectedLocationId, setSelectedLocationId] = useState(state.volatile.currentLocationId);
  const [selectedFacts, setSelectedFacts] = useState<Readonly<Record<string, readonly string[]>>>({});
  const [failedDeductionId, setFailedDeductionId] = useState<string>();
  const visitedLocations = useMemo(() => locations.filter((location) => visitedLocationIds.includes(location.id)), [visitedLocationIds]);
  const selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? locations.find((location) => location.id === state.volatile.currentLocationId) ?? visitedLocations.at(-1);
  const deductionRecords = useMemo(() => [
    ...state.persistent.clueIds.map((id) => ({ id: id as string, title: clueCopy[id]?.title ?? '확인되지 않은 단서', image: clueCopy[id]?.image ?? fieldBoard, tone: 'evidence' as const })),
    ...state.persistent.memories.map((memory) => ({ id: memory.id as string, title: memory.title, image: pictures.death, tone: 'memory' as const })),
  ], [state.persistent.clueIds, state.persistent.memories]);
  const availableDeductions = deductions.filter((deduction) => !state.persistent.deductionIds.includes(deduction.id) && canFormDeduction(state, deduction)).length;

  const toggleFact = (deductionId: string, sourceId: string) => {
    setFailedDeductionId(undefined);
    setSelectedFacts((current) => {
      const selected = current[deductionId] ?? [];
      const next = selected.includes(sourceId) ? selected.filter((id) => id !== sourceId) : selected.length >= 2 ? [sourceId] : [...selected, sourceId];
      return { ...current, [deductionId]: next };
    });
  };

  return (
    <View style={styles.layer}>
      <ImageBackground source={fieldBoard} resizeMode="cover" style={styles.boardBackground}>
        <View style={styles.boardShade} />
        <View style={[styles.console, { paddingTop: Math.max(topInset, 14), paddingBottom: Math.max(bottomInset, 10) }]}>
          <View style={styles.header}>
            <View style={styles.brandBlock}>
              <Text style={styles.systemLabel}>MNEMOSYNE // FIELD LINK</Text>
              <Text style={styles.title}>백야의료원</Text>
              <View style={styles.liveRow}><View style={styles.liveDot} /><Text style={styles.liveText}>{tabs.find((tab) => tab.id === activeTab)?.label} 기록 동기화 중</Text></View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="현장 기록 닫기" onPress={onClose} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}><X color="#e5edf4" size={22} /></Pressable>
          </View>

          <View style={styles.statusDeck}>
            <View style={styles.statusPrimary}><Text style={styles.statusLabel}>INSTANCE</Text><Text style={styles.statusValue}>{String(state.persistent.loopCount).padStart(2, '0')}</Text></View>
            {[['TIME', formatTime(state.volatile.time as number)], ['EVIDENCE', String(state.persistent.clueIds.length).padStart(2, '0')], ['MEMORY', String(state.persistent.memories.length).padStart(2, '0')]].map(([label, value]) => (
              <View key={label} style={styles.statusCell}><Text style={styles.statusLabel}>{label}</Text><Text style={[styles.statusText, label === 'MEMORY' && styles.memoryText]}>{value}</Text></View>
            ))}
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
            {activeTab === 'map' && selectedLocation ? <View>
              <SectionHeading title="현재 위치" count={`${visitedLocations.length}곳 확인`} />
              <ImageBackground source={selectedLocation.image} resizeMode="cover" style={styles.locationHero} imageStyle={styles.roundedImage}>
                <View style={styles.locationHeroShade} /><View style={styles.locationReticle}><View style={styles.reticleCore} /></View>
                <View style={styles.locationCopy}><Text style={styles.locationFloor}>{selectedLocation.floor}</Text><Text style={styles.locationName}>{selectedLocation.name}</Text><Text style={styles.locationDetail}>{selectedLocation.detail}</Text></View>
                {selectedLocation.id === state.volatile.currentLocationId ? <View style={styles.currentTag}><Text style={styles.currentTagText}>현재</Text></View> : null}
              </ImageBackground>
              <SectionHeading title="확인한 동선" count="TOUCH TO TRACE" />
              <ImageBackground source={fieldBoard} resizeMode="cover" style={styles.routeBoard} imageStyle={styles.routeBoardImage}>
                <View style={styles.routeBoardShade} /><View style={styles.routeGrid}>{visitedLocations.map((location, index) => {
                  const current = location.id === state.volatile.currentLocationId;
                  const selected = location.id === selectedLocation.id;
                  return <Pressable accessibilityRole="button" accessibilityLabel={`${location.floor} ${location.name}`} key={location.id} onPress={() => setSelectedLocationId(location.id)} style={({ pressed }) => [styles.routeNode, selected && styles.routeNodeSelected, pressed && styles.pressed]}>
                    <Text style={[styles.routeIndex, current && styles.routeIndexCurrent]}>{String(index + 1).padStart(2, '0')}</Text><Text style={styles.routeFloor}>{location.floor}</Text><Text numberOfLines={1} style={[styles.routeName, current && styles.routeNameCurrent]}>{location.name}</Text>
                  </Pressable>;
                })}</View>
              </ImageBackground>
            </View> : null}

            {activeTab === 'evidence' ? <View>
              <SectionHeading title="확보한 단서" count={state.persistent.clueIds.length} />
              {state.persistent.clueIds.length === 0 ? <EmptyState>아직 확실한 단서가 없다.</EmptyState> : <View style={styles.evidenceGrid}>{state.persistent.clueIds.map((clueId: ClueId, index) => {
                const copy = clueCopy[clueId] ?? { title: '확인되지 않은 단서', detail: String(clueId), image: fieldBoard };
                return <View key={clueId} style={styles.evidenceCard}><Image source={copy.image} resizeMode="cover" style={styles.evidenceImage} /><View style={styles.evidenceImageShade} /><View style={styles.evidenceNumber}><Text style={styles.evidenceNumberText}>{String(index + 1).padStart(2, '0')}</Text></View><View style={styles.evidenceCopy}><Text numberOfLines={1} style={styles.evidenceTitle}>{copy.title}</Text><Text numberOfLines={2} style={styles.evidenceDetail}>{copy.detail}</Text></View></View>;
              })}</View>}
              {state.persistent.memories.length > 0 ? <><SectionHeading title="죽어도 남은 기억" count={state.persistent.memories.length} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memoryRail}>{state.persistent.memories.map((memory) => <ImageBackground key={memory.id} source={pictures.death} resizeMode="cover" style={styles.memoryCard} imageStyle={styles.roundedImage}><View style={styles.memoryCardShade} /><Text style={styles.memoryGlyph}>◈</Text><Text numberOfLines={1} style={styles.memoryTitle}>{memory.title}</Text><Text numberOfLines={2} style={styles.memoryDetail}>{memory.description}</Text></ImageBackground>)}</ScrollView></> : null}
            </View> : null}

            {activeTab === 'items' ? <View>
              <SectionHeading title="현재 소지품" count={state.volatile.itemIds.length} />
              {state.volatile.itemIds.length === 0 ? <EmptyState>지금 사용할 수 있는 물건이 없다.</EmptyState> : state.volatile.itemIds.map((itemId, index) => {
                const copy = itemCopy[itemId] ?? { title: '확인되지 않은 물건', detail: String(itemId), image: fieldBoard };
                return <ImageBackground key={itemId} source={copy.image} resizeMode="cover" style={styles.itemCard} imageStyle={styles.roundedImage}><View style={styles.itemCardShade} /><View style={styles.itemIndex}><Text style={styles.itemIndexText}>{String(index + 1).padStart(2, '0')}</Text></View><View style={styles.itemCopy}><Text style={styles.itemKind}>PHYSICAL EVIDENCE</Text><Text style={styles.itemTitle}>{copy.title}</Text><Text style={styles.itemDetail}>{copy.detail}</Text></View></ImageBackground>;
              })}
            </View> : null}

            {activeTab === 'deduction' ? <View>
              <SectionHeading title="기억 연결" count={`${state.persistent.deductionIds.length}/${deductions.length}`} />
              {deductions.map((deduction) => {
                const formed = state.persistent.deductionIds.includes(deduction.id);
                const available = canFormDeduction(state, deduction);
                const chosen = selectedFacts[deduction.id] ?? [];
                const requiredCount = deduction.requiredClueIds.length + deduction.requiredMemoryIds.length;
                const acquiredCount = deduction.requiredClueIds.filter((id) => state.persistent.clueIds.includes(id)).length + deduction.requiredMemoryIds.filter((id) => state.persistent.memories.some((memory) => memory.id === id)).length;
                return <ImageBackground key={deduction.id} source={fieldBoard} resizeMode="cover" style={styles.deductionCard} imageStyle={styles.roundedImage}><View style={styles.deductionShade} />
                  <View style={styles.deductionHeader}><View style={[styles.deductionSeal, formed && styles.deductionSealFormed]}>{available || formed ? <BrainCircuit color={formed ? '#f0e7ff' : '#bea3ef'} size={21} /> : <LockKeyhole color="#657384" size={18} />}</View><View style={styles.deductionHeaderCopy}><Text style={styles.deductionState}>{formed ? 'CONNECTION VERIFIED' : available ? 'CONNECTION AVAILABLE' : 'INSUFFICIENT DATA'}</Text><Text style={styles.deductionTitle}>{formed ? deduction.title : available ? '미완성 추론' : '잠긴 추론'}</Text></View><Text style={styles.deductionProgress}>{formed ? '✓' : `${acquiredCount}/${requiredCount}`}</Text></View>
                  <Text style={styles.deductionDescription}>{formed ? deduction.description : available ? deduction.prompt : '확보한 기록 사이에 아직 연결 고리가 없다.'}</Text>
                  {formed ? <><View style={styles.formedConnection}>{deduction.facts.map((fact, index) => <React.Fragment key={`${deduction.id}:${fact.label}`}>{index > 0 ? <View style={styles.connectionLine}><View style={styles.connectionPulse} /></View> : null}<View style={[styles.factNode, fact.tone === 'memory' && styles.factNodeMemory]}><Text style={styles.factLabel}>{fact.label}</Text><Text numberOfLines={3} style={styles.factText}>{fact.text}</Text></View></React.Fragment>)}</View><View style={styles.conclusion}><Text style={styles.conclusionLabel}>확신</Text><Text style={styles.conclusionText}>{deduction.conclusion}</Text></View></> : available ? <>
                    <View style={styles.deductionInstruction}><Text style={styles.deductionInstructionText}>연결할 기록 두 개를 고른다</Text><Text style={styles.deductionSelectionCount}>{chosen.length}/2</Text></View>
                    <View style={styles.deductionRecordGrid}>{deductionRecords.map((record) => { const selected = chosen.includes(record.id); return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={`${deduction.id}:${record.id}`} onPress={() => toggleFact(deduction.id, record.id)} style={({ pressed }) => [styles.deductionRecord, selected && styles.deductionRecordSelected, pressed && styles.pressed]}><Image source={record.image} resizeMode="cover" style={styles.deductionRecordImage} /><View style={[styles.deductionRecordMark, record.tone === 'memory' && styles.deductionMemoryMark]}><Text style={styles.deductionRecordMarkText}>{selected ? '✓' : record.tone === 'memory' ? '◈' : '·'}</Text></View><Text numberOfLines={2} style={[styles.deductionRecordText, selected && styles.deductionRecordTextSelected]}>{record.title}</Text></Pressable>; })}</View>
                    {failedDeductionId === deduction.id ? <Text style={styles.deductionMistake}>이 둘만으로는 다음 행동을 확신할 수 없다.</Text> : null}
                    <Pressable accessibilityRole="button" disabled={chosen.length !== 2} onPress={() => { if (isCorrectDeductionConnection(deduction, chosen)) { setFailedDeductionId(undefined); onFormDeduction(deduction.id); } else { setFailedDeductionId(deduction.id); setSelectedFacts((current) => ({ ...current, [deduction.id]: [] })); } }} style={({ pressed }) => [styles.deduceButton, chosen.length !== 2 && styles.deduceButtonDisabled, pressed && styles.pressed]}><BrainCircuit color="#10161d" size={17} /><Text style={styles.deduceButtonText}>연결을 검증한다</Text></Pressable>
                  </> : null}
                </ImageBackground>;
              })}
            </View> : null}
          </ScrollView>

          <View style={styles.tabs}>{tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            const badge = id === 'evidence' ? state.persistent.clueIds.length : id === 'deduction' ? availableDeductions : id === 'items' ? state.volatile.itemIds.length : 0;
            return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} key={id} onPress={() => setActiveTab(id)} style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.pressed]}>{active ? <View style={styles.tabSignal} /> : null}<Icon color={active ? '#eff5fa' : '#778798'} size={20} strokeWidth={active ? 2 : 1.6} /><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>{badge > 0 ? <View style={[styles.tabBadge, id === 'deduction' && styles.tabBadgeMemory]}><Text style={styles.tabBadgeText}>{badge}</Text></View> : null}</Pressable>;
          })}</View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject, zIndex: 80, backgroundColor: '#03060a' },
  boardBackground: { flex: 1 }, boardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,10,0.86)' }, console: { flex: 1, paddingHorizontal: 17 },
  header: { minHeight: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brandBlock: { flex: 1 },
  systemLabel: { color: '#70869a', fontSize: 7, fontWeight: '900', letterSpacing: 1.8 }, title: { color: '#f3f6f9', fontSize: 25, fontWeight: '800', letterSpacing: -0.6, marginTop: 3 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }, liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#a88bdd', shadowColor: '#b29be1', shadowOpacity: 0.9, shadowRadius: 5 }, liveText: { color: '#8190a0', fontSize: 8, fontWeight: '700' },
  closeButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(12,20,29,0.74)', borderWidth: 1, borderColor: 'rgba(139,164,186,0.18)' },
  statusDeck: { height: 66, flexDirection: 'row', borderRadius: 13, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(125,151,175,0.18)', backgroundColor: 'rgba(7,13,20,0.9)' },
  statusPrimary: { width: 82, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: 'rgba(95,73,137,0.22)', borderRightWidth: 1, borderRightColor: 'rgba(164,137,211,0.26)' }, statusCell: { flex: 1, justifyContent: 'center', paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: 'rgba(125,151,175,0.12)' },
  statusLabel: { color: '#66788a', fontSize: 6, fontWeight: '900', letterSpacing: 1.1 }, statusValue: { color: '#cfb9f2', fontSize: 23, fontWeight: '300', marginTop: 1 }, statusText: { color: '#e3eaf0', fontSize: 14, fontWeight: '800', marginTop: 4 }, memoryText: { color: '#cbb6ef' },
  content: { flex: 1, marginTop: 10 }, contentInner: { paddingBottom: 18 }, sectionHeading: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 }, sectionRule: { width: 13, height: 2, backgroundColor: '#8ea7ba' }, sectionTitle: { flex: 1, color: '#b7c3ce', fontSize: 9, fontWeight: '900', letterSpacing: 1 }, sectionCount: { color: '#74879a', fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  locationHero: { height: 190, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(146,171,192,0.28)' }, roundedImage: { borderRadius: 15 }, locationHeroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,9,14,0.26)' }, locationReticle: { position: 'absolute', right: 24, top: 28, width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: 'rgba(202,224,240,0.48)', alignItems: 'center', justifyContent: 'center' }, reticleCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#e7f2f9' },
  locationCopy: { padding: 16, paddingTop: 38, backgroundColor: 'rgba(3,8,13,0.7)' }, locationFloor: { color: '#91aec3', fontSize: 8, fontWeight: '900', letterSpacing: 1.5 }, locationName: { color: '#f1f5f8', fontSize: 21, fontWeight: '800', marginTop: 2 }, locationDetail: { color: '#a0afbc', fontSize: 10, lineHeight: 15, marginTop: 3 }, currentTag: { position: 'absolute', right: 13, bottom: 15, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, backgroundColor: 'rgba(120,153,178,0.24)' }, currentTagText: { color: '#dceaf4', fontSize: 7, fontWeight: '900' },
  routeBoard: { minHeight: 220, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(126,151,174,0.22)' }, routeBoardImage: { opacity: 0.58 }, routeBoardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,10,16,0.56)' }, routeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 13 }, routeNode: { width: '31.5%', minHeight: 82, padding: 10, borderRadius: 10, justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(125,151,176,0.22)', backgroundColor: 'rgba(7,14,22,0.78)' }, routeNodeSelected: { borderColor: 'rgba(191,217,236,0.7)', backgroundColor: 'rgba(51,75,96,0.68)' }, routeIndex: { color: '#627486', fontSize: 8, fontWeight: '900' }, routeIndexCurrent: { color: '#bda7e6' }, routeFloor: { color: '#71869a', fontSize: 7, fontWeight: '900', marginTop: 10 }, routeName: { color: '#c7d0d9', fontSize: 11, fontWeight: '800', marginTop: 2 }, routeNameCurrent: { color: '#f1f5f8' },
  evidenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, evidenceCard: { width: '48.7%', height: 190, borderRadius: 13, overflow: 'hidden', backgroundColor: '#0b1119', borderWidth: 1, borderColor: 'rgba(131,156,179,0.2)' }, evidenceImage: { width: '100%', height: 116 }, evidenceImageShade: { position: 'absolute', top: 62, left: 0, right: 0, height: 72, backgroundColor: 'rgba(5,10,16,0.46)' }, evidenceNumber: { position: 'absolute', top: 9, left: 9, width: 28, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(3,8,13,0.78)' }, evidenceNumberText: { color: '#c5d4df', fontSize: 8, fontWeight: '900' }, evidenceCopy: { flex: 1, padding: 10, paddingTop: 8 }, evidenceTitle: { color: '#e9eef3', fontSize: 12, fontWeight: '800' }, evidenceDetail: { color: '#7f8e9d', fontSize: 8, lineHeight: 12, marginTop: 4 },
  memoryRail: { gap: 9, paddingRight: 10 }, memoryCard: { width: 230, height: 128, borderRadius: 13, overflow: 'hidden', padding: 13, justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(172,140,224,0.36)' }, memoryCardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,15,43,0.64)' }, memoryGlyph: { position: 'absolute', top: 12, right: 13, color: '#bda0ec', fontSize: 18 }, memoryTitle: { color: '#ebdfff', fontSize: 13, fontWeight: '800' }, memoryDetail: { color: '#a999bb', fontSize: 9, lineHeight: 13, marginTop: 4 },
  itemCard: { height: 182, marginBottom: 10, borderRadius: 15, overflow: 'hidden', flexDirection: 'row', alignItems: 'flex-end', padding: 15, borderWidth: 1, borderColor: 'rgba(139,165,187,0.28)' }, itemCardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,8,13,0.5)' }, itemIndex: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(8,15,22,0.82)', borderWidth: 1, borderColor: 'rgba(163,188,207,0.35)' }, itemIndexText: { color: '#dae6ef', fontSize: 9, fontWeight: '900' }, itemCopy: { flex: 1, marginLeft: 12, padding: 10, borderRadius: 10, backgroundColor: 'rgba(5,10,16,0.74)' }, itemKind: { color: '#758da0', fontSize: 6, fontWeight: '900', letterSpacing: 1.2 }, itemTitle: { color: '#eef3f6', fontSize: 15, fontWeight: '800', marginTop: 3 }, itemDetail: { color: '#94a3af', fontSize: 9, lineHeight: 14, marginTop: 4 },
  deductionCard: { marginBottom: 12, borderRadius: 15, overflow: 'hidden', padding: 15, borderWidth: 1, borderColor: 'rgba(159,126,212,0.34)' }, deductionShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,7,16,0.8)' }, deductionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, deductionSeal: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(116,81,166,0.18)', borderWidth: 1, borderColor: 'rgba(176,142,225,0.32)' }, deductionSealFormed: { backgroundColor: 'rgba(142,100,198,0.3)', borderColor: 'rgba(213,190,246,0.56)' }, deductionHeaderCopy: { flex: 1 }, deductionState: { color: '#8674a7', fontSize: 6, fontWeight: '900', letterSpacing: 1.15 }, deductionTitle: { color: '#eee8f6', fontSize: 16, fontWeight: '800', marginTop: 2 }, deductionProgress: { color: '#baa1e6', fontSize: 11, fontWeight: '900' }, deductionDescription: { color: '#92909d', fontSize: 10, lineHeight: 16, marginTop: 11 },
  formedConnection: { flexDirection: 'row', alignItems: 'center', marginTop: 14 }, factNode: { flex: 1, minHeight: 94, padding: 11, justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(73,99,122,0.2)', borderWidth: 1, borderColor: 'rgba(116,142,165,0.2)' }, factNodeMemory: { backgroundColor: 'rgba(104,72,148,0.24)', borderColor: 'rgba(166,132,214,0.28)' }, factLabel: { color: '#8b7aa9', fontSize: 7, fontWeight: '900' }, factText: { color: '#d6dce3', fontSize: 10, lineHeight: 15, fontWeight: '700', marginTop: 5 }, connectionLine: { width: 24, height: 1, backgroundColor: 'rgba(190,155,235,0.5)', alignItems: 'center', justifyContent: 'center' }, connectionPulse: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#c4a8ec' }, conclusion: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: 'rgba(119,82,169,0.22)', borderLeftWidth: 2, borderLeftColor: '#a887d5' }, conclusionLabel: { color: '#af91da', fontSize: 7, fontWeight: '900' }, conclusionText: { color: '#e4daef', fontSize: 11, lineHeight: 17, marginTop: 4 },
  deductionInstruction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 8 }, deductionInstructionText: { color: '#b4bac2', fontSize: 9, fontWeight: '800' }, deductionSelectionCount: { color: '#b798e1', fontSize: 10, fontWeight: '900' }, deductionRecordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, deductionRecord: { width: '48.6%', minHeight: 76, borderRadius: 10, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingRight: 8, backgroundColor: 'rgba(12,19,28,0.88)', borderWidth: 1, borderColor: 'rgba(115,139,161,0.22)' }, deductionRecordSelected: { borderColor: 'rgba(208,181,241,0.72)', backgroundColor: 'rgba(92,61,132,0.72)' }, deductionRecordImage: { width: 53, height: '100%', opacity: 0.7 }, deductionRecordMark: { position: 'absolute', left: 6, top: 6, width: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(4,9,14,0.84)' }, deductionMemoryMark: { backgroundColor: 'rgba(70,43,105,0.9)' }, deductionRecordMarkText: { color: '#d4c3ed', fontSize: 8, fontWeight: '900' }, deductionRecordText: { flex: 1, color: '#aeb9c4', fontSize: 9, lineHeight: 13, fontWeight: '700', marginLeft: 8 }, deductionRecordTextSelected: { color: '#f4ecff' }, deductionMistake: { color: '#cf897f', fontSize: 9, lineHeight: 14, marginTop: 9 }, deduceButton: { minHeight: 50, marginTop: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#e2e8ed' }, deduceButtonDisabled: { opacity: 0.28 }, deduceButtonText: { color: '#10161d', fontSize: 11, fontWeight: '900' },
  tabs: { minHeight: 66, flexDirection: 'row', borderRadius: 15, padding: 4, backgroundColor: 'rgba(6,11,17,0.96)', borderWidth: 1, borderColor: 'rgba(126,151,174,0.2)' }, tab: { flex: 1, minHeight: 56, borderRadius: 11, alignItems: 'center', justifyContent: 'center', gap: 3 }, tabActive: { backgroundColor: 'rgba(75,95,116,0.32)' }, tabSignal: { position: 'absolute', top: 0, width: 22, height: 2, borderRadius: 1, backgroundColor: '#c8d9e5' }, tabText: { color: '#718294', fontSize: 8, fontWeight: '900' }, tabTextActive: { color: '#edf3f7' }, tabBadge: { position: 'absolute', top: 5, right: 14, minWidth: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, backgroundColor: '#526c81' }, tabBadgeMemory: { backgroundColor: '#7656a5' }, tabBadgeText: { color: '#f3f6f8', fontSize: 7, fontWeight: '900' },
  emptyState: { minHeight: 190, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(8,14,21,0.74)', borderWidth: 1, borderColor: 'rgba(125,149,170,0.16)' }, emptyReticle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(129,154,176,0.24)' }, emptyReticleText: { color: '#6b7e8f', fontSize: 18 }, emptyText: { color: '#6e7d8c', fontSize: 10, marginTop: 10 }, pressed: { opacity: 0.67 },
});
