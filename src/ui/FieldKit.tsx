import React, { useMemo, useState } from 'react';
import {
  BrainCircuit,
  LockKeyhole,
  MapPinned,
  NotebookTabs,
  PackageOpen,
  X,
} from 'lucide-react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {
  ClueId,
  DeductionId,
  LocationId,
  NarrativeEngineState,
} from '../engine';
import {
  canFormDeduction,
  deductions,
  isCorrectDeductionConnection,
} from '../gameplay/deductions';

export type FieldKitTab = 'map' | 'evidence' | 'deduction' | 'items';

type LocationEntry = {
  id: LocationId;
  floor: string;
  name: string;
  detail: string;
};

const locations: readonly LocationEntry[] = [
  { id: 'MOUNTAIN_ROAD' as LocationId, floor: '외부', name: '산길', detail: '백야의료원으로 이어지는 외곽 도로' },
  { id: 'CAR' as LocationId, floor: '외부', name: '차 안', detail: '첫 통화가 시작된 곳' },
  { id: 'HOSPITAL_EXTERIOR' as LocationId, floor: '외부', name: '정문', detail: '주차장과 병원 출입구' },
  { id: '1F_LOBBY' as LocationId, floor: '1F', name: '로비', detail: '접수처와 원무과가 있는 중앙 홀' },
  { id: '1F_STAFF_DOOR' as LocationId, floor: '1F', name: '복도 끝', detail: '지하 계단으로 이어지는 잠긴 문' },
  { id: '3F_CORRIDOR' as LocationId, floor: '3F', name: '입원병동', detail: '301호와 302호가 있는 복도' },
  { id: 'ROOM_302' as LocationId, floor: '3F', name: '302호', detail: '기록과 현장이 맞지 않는 병실' },
  { id: 'B1_OPERATIONS_CORRIDOR' as LocationId, floor: 'B1', name: '지하 구역', detail: '표찰이 사라진 문들이 이어지는 통제 구역' },
];

const clueCopy: Readonly<Record<string, { title: string; detail: string }>> = {
  CLUE_WATCH_GIFT: { title: '오래된 손목시계', detail: '서윤이 선물한 시계. 시간은 정확했다.' },
  CLUE_YUJIN_KNOWN: { title: '먼저 나온 이름', detail: '서윤은 듣지 못했어야 할 유진의 이름을 알고 있었다.' },
  CLUE_B1_MAP: { title: '피난 안내도', detail: '1층 복도 끝에서 지하로 이어지는 계단이 표시돼 있다.' },
  CLUE_302_OCCUPIED: { title: '비어 있지 않은 302호', detail: '직원의 설명과 달리 방금까지 환자가 머문 흔적이 남아 있었다.' },
  CLUE_WRISTBAND_DOB: { title: '찢어진 손목밴드', detail: '이름은 뜯겼지만 생년월일은 서윤과 같았다.' },
  CLUE_FIRST_PHONE: { title: '첫 번째 휴대전화', detail: '302호의 전화가 울리는 동안 서윤과의 통화는 계속됐다.' },
  CLUE_SECOND_PHONE: { title: '동시에 존재한 전화', detail: '같은 번호와 같은 기기가 서로 다른 두 곳에 존재했다.' },
  CLUE_SEA_KNOWS: { title: '세아의 경고', detail: '세아는 처음 만난 나의 죽음과 반복을 알고 있었다.' },
  CLUE_B1_UNMARKED_ROOMS: { title: '막아 버린 관찰창', detail: '표찰을 떼어 낸 문 아래에 관찰창을 막았던 나사 자국이 남아 있다.' },
  CLUE_B1_TRANSFER_TRACKS: { title: '꺾인 바퀴 자국', detail: '젖은 카트 바퀴 자국이 열린 린넨실 쪽으로 이어진다.' },
};

const itemCopy: Readonly<Record<string, { title: string; detail: string }>> = {
  ITEM_FIRST_PHONE_PHOTO: { title: '봉투 속 전화 사진', detail: '오른쪽 아래의 흠집까지 서윤의 전화와 일치한다.' },
  ITEM_SECOND_PHONE: { title: '침대 아래의 휴대전화', detail: '첫 번째 전화와 같은 흠집이 있고, 서윤에게 걸면 동시에 울린다.' },
  ITEM_WRISTBAND_PHOTO: { title: '손목밴드 사진', detail: '302호와 생년월일이 식별되도록 촬영했다.' },
};

const tabs: readonly { id: FieldKitTab; label: string; Icon: typeof MapPinned }[] = [
  { id: 'map', label: '동선', Icon: MapPinned },
  { id: 'evidence', label: '단서', Icon: NotebookTabs },
  { id: 'deduction', label: '추론', Icon: BrainCircuit },
  { id: 'items', label: '소지품', Icon: PackageOpen },
];

function EmptyState({ children }: { children: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{children}</Text>
    </View>
  );
}

export function FieldKit({
  state,
  visitedLocationIds,
  onClose,
  topInset,
  bottomInset,
  onFormDeduction,
  initialTab = 'map',
}: {
  state: NarrativeEngineState;
  visitedLocationIds: readonly LocationId[];
  onClose: () => void;
  topInset: number;
  bottomInset: number;
  onFormDeduction: (deductionId: DeductionId) => void;
  initialTab?: FieldKitTab;
}) {
  const [activeTab, setActiveTab] = useState<FieldKitTab>(initialTab);
  const [selectedLocationId, setSelectedLocationId] = useState(
    state.volatile.currentLocationId,
  );
  const [selectedDeductionFacts, setSelectedDeductionFacts] = useState<
    Readonly<Record<string, readonly string[]>>
  >({});
  const [failedDeductionId, setFailedDeductionId] = useState<string>();
  const visitedLocations = useMemo(
    () => locations.filter((location) => visitedLocationIds.includes(location.id)),
    [visitedLocationIds],
  );
  const selectedLocation = locations.find((location) => location.id === selectedLocationId)
    ?? locations.find((location) => location.id === state.volatile.currentLocationId);
  const deductionRecords = useMemo(() => [
    ...state.persistent.clueIds.map((clueId) => ({
      id: clueId as string,
      title: clueCopy[clueId]?.title ?? '확인되지 않은 단서',
      tone: 'evidence' as const,
    })),
    ...state.persistent.memories.map((memory) => ({
      id: memory.id as string,
      title: memory.title,
      tone: 'memory' as const,
    })),
  ], [state.persistent.clueIds, state.persistent.memories]);

  const toggleDeductionFact = (deductionId: string, sourceId: string) => {
    setFailedDeductionId(undefined);
    setSelectedDeductionFacts((current) => {
      const selected = current[deductionId] ?? [];
      const next = selected.includes(sourceId)
        ? selected.filter((id) => id !== sourceId)
        : selected.length >= 2
          ? [sourceId]
          : [...selected, sourceId];
      return { ...current, [deductionId]: next };
    });
  };

  return (
    <View style={styles.layer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="현장 기록 닫기"
        onPress={onClose}
        style={styles.backdrop}
      />
      <View
        style={[
          styles.sheet,
          {
            paddingTop: Math.max(topInset, 18),
            paddingBottom: Math.max(bottomInset, 16),
          },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>현장 기록</Text>
            <Text style={styles.title}>백야의료원</Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.loopText}>{state.persistent.loopCount}번째 밤</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="현장 기록 닫기"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <X color="#d3dbe4" size={20} />
            </Pressable>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                key={id}
                onPress={() => setActiveTab(id)}
                style={({ pressed }) => [
                  styles.tab,
                  active && styles.tabActive,
                  pressed && styles.pressed,
                ]}
              >
                <Icon color={active ? '#eef4fa' : '#7f8d9d'} size={16} strokeWidth={1.7} />
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'map' ? (
            <View>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>확인한 동선</Text>
                <Text style={styles.sectionCount}>{visitedLocations.length}</Text>
              </View>
              <View style={styles.routeList}>
                {visitedLocations.map((location, index) => {
                  const current = location.id === state.volatile.currentLocationId;
                  const selected = location.id === selectedLocation?.id;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${location.floor} ${location.name}`}
                      key={location.id}
                      onPress={() => setSelectedLocationId(location.id)}
                      style={({ pressed }) => [
                        styles.route,
                        selected && styles.routeSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.routeRail}>
                        <View style={[styles.routeDot, current && styles.routeDotCurrent]} />
                        {index < visitedLocations.length - 1 ? <View style={styles.routeLine} /> : null}
                      </View>
                      <Text style={[styles.floor, current && styles.currentText]}>{location.floor}</Text>
                      <View style={styles.routeCopy}>
                        <Text style={[styles.routeName, current && styles.currentText]}>{location.name}</Text>
                        {selected ? <Text style={styles.routeDetail}>{location.detail}</Text> : null}
                      </View>
                      {current ? <Text style={styles.currentBadge}>현재</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {activeTab === 'evidence' ? (
            <View>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>확보한 단서</Text>
                <Text style={styles.sectionCount}>{state.persistent.clueIds.length}</Text>
              </View>
              {state.persistent.clueIds.length === 0 ? (
                <EmptyState>아직 확실한 단서가 없다.</EmptyState>
              ) : state.persistent.clueIds.map((clueId: ClueId, index) => {
                const copy = clueCopy[clueId] ?? { title: '확인되지 않은 단서', detail: String(clueId) };
                return (
                  <View key={clueId} style={styles.record}>
                    <Text style={styles.recordIndex}>{String(index + 1).padStart(2, '0')}</Text>
                    <View style={styles.recordCopy}>
                      <Text style={styles.recordTitle}>{copy.title}</Text>
                      <Text style={styles.recordDetail}>{copy.detail}</Text>
                    </View>
                  </View>
                );
              })}
              {state.persistent.memories.length > 0 ? (
                <>
                  <View style={[styles.sectionHeading, styles.memoryHeading]}>
                    <Text style={styles.sectionTitle}>죽어도 남은 기억</Text>
                    <Text style={[styles.sectionCount, styles.memoryCount]}>{state.persistent.memories.length}</Text>
                  </View>
                  {state.persistent.memories.map((memory) => (
                    <View key={memory.id} style={[styles.record, styles.memoryRecord]}>
                      <Text style={styles.memoryMark}>◈</Text>
                      <View style={styles.recordCopy}>
                        <Text style={styles.memoryTitle}>{memory.title}</Text>
                        <Text style={styles.recordDetail}>{memory.description}</Text>
                      </View>
                    </View>
                  ))}
                </>
              ) : null}
            </View>
          ) : null}

          {activeTab === 'items' ? (
            <View>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>가지고 있는 것</Text>
                <Text style={styles.sectionCount}>{state.volatile.itemIds.length}</Text>
              </View>
              {state.volatile.itemIds.length === 0 ? (
                <EmptyState>지금 사용할 수 있는 물건이 없다.</EmptyState>
              ) : state.volatile.itemIds.map((itemId, index) => {
                const copy = itemCopy[itemId] ?? { title: '확인되지 않은 물건', detail: String(itemId) };
                return (
                  <View key={itemId} style={styles.itemCard}>
                    <View style={styles.itemIcon}><Text style={styles.itemIconText}>{index + 1}</Text></View>
                    <View style={styles.recordCopy}>
                      <Text style={styles.recordTitle}>{copy.title}</Text>
                      <Text style={styles.recordDetail}>{copy.detail}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {activeTab === 'deduction' ? (
            <View>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>연결 가능한 사실</Text>
                <Text style={[styles.sectionCount, styles.memoryCount]}>
                  {state.persistent.deductionIds.length}/{deductions.length}
                </Text>
              </View>
              {deductions.map((deduction) => {
                const formed = state.persistent.deductionIds.includes(deduction.id);
                const available = canFormDeduction(state, deduction);
                const selectedFacts = selectedDeductionFacts[deduction.id] ?? [];
                const requiredCount = deduction.requiredClueIds.length
                  + deduction.requiredMemoryIds.length;
                const acquiredRequiredCount = deduction.requiredClueIds.filter((id) =>
                  state.persistent.clueIds.includes(id)).length
                  + deduction.requiredMemoryIds.filter((id) =>
                    state.persistent.memories.some((memory) => memory.id === id)).length;
                return (
                  <View key={deduction.id} style={styles.deductionCard}>
                    <Text style={styles.deductionTitle}>
                      {formed ? deduction.title : available ? '미완성 추론' : '잠긴 추론'}
                    </Text>
                    <Text style={styles.deductionDescription}>
                      {formed
                        ? deduction.description
                        : available
                          ? deduction.prompt
                          : `연결할 기록 ${acquiredRequiredCount}/${requiredCount}`}
                    </Text>
                    {formed ? (
                      <>
                        <View style={styles.deductionNodes}>
                          {deduction.facts.map((fact, index) => (
                            <React.Fragment key={`${deduction.id}:${fact.label}`}>
                              {index > 0 ? <View style={styles.connectionLine} /> : null}
                              <View style={[
                                styles.factNode,
                                fact.tone === 'memory' && styles.memoryFactNode,
                              ]}>
                                <Text style={[
                                  styles.factLabel,
                                  fact.tone === 'memory' && styles.memoryFactLabel,
                                ]}>{fact.label}</Text>
                                <Text style={styles.factText}>{fact.text}</Text>
                              </View>
                            </React.Fragment>
                          ))}
                        </View>
                        <View style={styles.conclusion}>
                          <Text style={styles.conclusionLabel}>확신</Text>
                          <Text style={styles.conclusionText}>{deduction.conclusion}</Text>
                        </View>
                      </>
                    ) : available ? (
                      <>
                        <View style={styles.deductionInstruction}>
                          <Text style={styles.deductionInstructionText}>연결할 기록 두 개를 고른다.</Text>
                          <Text style={styles.deductionSelectionCount}>{selectedFacts.length}/2</Text>
                        </View>
                        <View style={styles.deductionRecordGrid}>
                          {deductionRecords.map((record) => {
                            const selected = selectedFacts.includes(record.id);
                            return (
                              <Pressable
                                accessibilityRole="button"
                                accessibilityState={{ selected }}
                                key={`${deduction.id}:${record.id}`}
                                onPress={() => toggleDeductionFact(deduction.id, record.id)}
                                style={({ pressed }) => [
                                  styles.deductionRecord,
                                  record.tone === 'memory' && styles.deductionMemoryRecord,
                                  selected && styles.deductionRecordSelected,
                                  pressed && styles.pressed,
                                ]}
                              >
                                <Text style={[
                                  styles.deductionRecordMark,
                                  record.tone === 'memory' && styles.deductionMemoryMark,
                                ]}>
                                  {selected ? '✓' : record.tone === 'memory' ? '◈' : '·'}
                                </Text>
                                <Text style={[
                                  styles.deductionRecordText,
                                  selected && styles.deductionRecordTextSelected,
                                ]}>
                                  {record.title}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                        {failedDeductionId === deduction.id ? (
                          <Text style={styles.deductionMistake}>
                            이 둘만으로는 다음 행동을 확신할 수 없다.
                          </Text>
                        ) : null}
                        <Pressable
                          accessibilityRole="button"
                          disabled={selectedFacts.length !== 2}
                          onPress={() => {
                            if (isCorrectDeductionConnection(deduction, selectedFacts)) {
                              setFailedDeductionId(undefined);
                              onFormDeduction(deduction.id);
                            } else {
                              setFailedDeductionId(deduction.id);
                              setSelectedDeductionFacts((current) => ({
                                ...current,
                                [deduction.id]: [],
                              }));
                            }
                          }}
                          style={({ pressed }) => [
                            styles.deduceButton,
                            selectedFacts.length !== 2 && styles.deduceButtonDisabled,
                            pressed && styles.pressed,
                          ]}
                        >
                          <BrainCircuit color="#111720" size={17} strokeWidth={2} />
                          <Text style={styles.deduceButtonText}>연결을 확인한다</Text>
                        </Pressable>
                      </>
                      ) : (
                      <View style={styles.deductionLocked}>
                        <LockKeyhole color="#526170" size={15} strokeWidth={1.8} />
                        <Text style={styles.deductionLockedText}>
                          확보한 기록 사이에 아직 연결 고리가 없다.
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject, zIndex: 80, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1, 3, 7, 0.72)' },
  sheet: {
    width: '100%',
    height: '78%',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(7, 11, 17, 0.985)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(139, 160, 182, 0.28)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: -12 },
    elevation: 32,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: '#8090a1', fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#f0f4f8', fontSize: 22, fontWeight: '700', marginTop: 3, letterSpacing: -0.4 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loopText: { color: '#9da9b7', fontSize: 11, fontWeight: '700' },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: 'rgba(132, 150, 171, 0.08)' },
  tabs: { flexDirection: 'row', gap: 4, marginTop: 18, padding: 4, borderRadius: 12, backgroundColor: 'rgba(151, 169, 188, 0.06)' },
  tab: { flex: 1, minHeight: 46, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  tabActive: { backgroundColor: 'rgba(123, 148, 174, 0.16)' },
  tabText: { color: '#7f8d9d', fontSize: 11, fontWeight: '800' },
  tabTextActive: { color: '#eef4fa' },
  content: { flex: 1, marginTop: 16 },
  contentInner: { paddingBottom: 24 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 11 },
  sectionTitle: { color: '#aeb9c5', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  sectionCount: { color: '#6f8296', fontSize: 10, fontWeight: '900' },
  routeList: { borderTopWidth: 1, borderTopColor: 'rgba(132, 151, 171, 0.16)' },
  route: { minHeight: 58, flexDirection: 'row', alignItems: 'stretch', paddingRight: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(132, 151, 171, 0.12)' },
  routeSelected: { backgroundColor: 'rgba(83, 109, 136, 0.1)' },
  routeRail: { width: 28, alignItems: 'center' },
  routeDot: { width: 7, height: 7, borderRadius: 4, marginTop: 24, backgroundColor: '#4c5a68', zIndex: 2 },
  routeDotCurrent: { width: 10, height: 10, borderRadius: 5, marginTop: 22, backgroundColor: '#d4e4f2', shadowColor: '#a9d1f1', shadowOpacity: 0.8, shadowRadius: 8 },
  routeLine: { position: 'absolute', top: 30, bottom: -29, width: 1, backgroundColor: 'rgba(106, 129, 151, 0.28)' },
  floor: { width: 34, paddingTop: 20, color: '#667789', fontSize: 9, fontWeight: '900' },
  routeCopy: { flex: 1, justifyContent: 'center', paddingVertical: 12 },
  routeName: { color: '#c8d0d9', fontSize: 14, fontWeight: '700' },
  routeDetail: { color: '#8794a3', fontSize: 11, lineHeight: 17, marginTop: 5 },
  currentText: { color: '#eef4fa' },
  currentBadge: { alignSelf: 'center', color: '#a9c5dc', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  emptyState: { minHeight: 120, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(132, 151, 171, 0.12)' },
  emptyText: { color: '#667585', fontSize: 12 },
  record: { minHeight: 72, flexDirection: 'row', gap: 12, paddingVertical: 13, borderTopWidth: 1, borderTopColor: 'rgba(132, 151, 171, 0.14)' },
  recordIndex: { width: 22, color: '#68798a', fontSize: 9, fontWeight: '900', paddingTop: 2 },
  recordCopy: { flex: 1 },
  recordTitle: { color: '#e0e6ec', fontSize: 14, fontWeight: '700' },
  recordDetail: { color: '#8f9aa7', fontSize: 11, lineHeight: 18, marginTop: 5 },
  memoryHeading: { marginTop: 22 },
  memoryCount: { color: '#9f88cd' },
  memoryRecord: { borderTopColor: 'rgba(153, 125, 210, 0.2)' },
  memoryMark: { width: 22, color: '#a58bd4', fontSize: 13 },
  memoryTitle: { color: '#dccff4', fontSize: 14, fontWeight: '700' },
  itemCard: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13, marginBottom: 8, borderRadius: 12, backgroundColor: 'rgba(111, 135, 158, 0.08)', borderWidth: 1, borderColor: 'rgba(132, 151, 171, 0.14)' },
  itemIcon: { width: 42, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(131, 155, 178, 0.12)' },
  itemIconText: { color: '#b9c6d3', fontSize: 11, fontWeight: '900' },
  deductionCard: { padding: 16, marginBottom: 12, borderRadius: 14, backgroundColor: 'rgba(100, 83, 136, 0.1)', borderWidth: 1, borderColor: 'rgba(157, 126, 212, 0.24)' },
  deductionTitle: { color: '#e6deef', fontSize: 15, fontWeight: '800' },
  deductionDescription: { color: '#8f9aa7', fontSize: 10, lineHeight: 16, marginTop: 4, marginBottom: 12 },
  deductionNodes: { flexDirection: 'row', alignItems: 'center' },
  factNode: { flex: 1, minHeight: 86, padding: 12, justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(104, 132, 157, 0.1)' },
  memoryFactNode: { backgroundColor: 'rgba(139, 105, 193, 0.12)' },
  factLabel: { color: '#7790a7', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  memoryFactLabel: { color: '#a388d0' },
  factText: { color: '#d4dce4', fontSize: 11, lineHeight: 17, fontWeight: '700', marginTop: 5 },
  connectionLine: { width: 18, height: 1, backgroundColor: 'rgba(177, 153, 220, 0.5)' },
  deductionInstruction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  deductionInstructionText: { color: '#aeb7c2', fontSize: 10, fontWeight: '700' },
  deductionSelectionCount: { color: '#a98bd7', fontSize: 10, fontWeight: '900' },
  deductionRecordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  deductionRecord: { width: '48.8%', minHeight: 54, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(101, 127, 151, 0.08)', borderWidth: 1, borderColor: 'rgba(118, 143, 166, 0.16)' },
  deductionMemoryRecord: { backgroundColor: 'rgba(128, 96, 179, 0.1)', borderColor: 'rgba(151, 119, 202, 0.2)' },
  deductionRecordSelected: { backgroundColor: 'rgba(156, 128, 207, 0.22)', borderColor: 'rgba(196, 171, 236, 0.62)' },
  deductionRecordMark: { width: 13, color: '#71869a', fontSize: 11, fontWeight: '900' },
  deductionMemoryMark: { color: '#a88bd6' },
  deductionRecordText: { flex: 1, color: '#aeb9c5', fontSize: 10, lineHeight: 14, fontWeight: '700' },
  deductionRecordTextSelected: { color: '#f0eafa' },
  deductionMistake: { color: '#c98a80', fontSize: 10, lineHeight: 16, marginTop: 10 },
  deductionLocked: { minHeight: 52, paddingHorizontal: 12, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(92, 107, 122, 0.06)' },
  deductionLockedText: { flex: 1, color: '#647281', fontSize: 10, lineHeight: 16 },
  conclusion: { marginTop: 14, padding: 14, borderRadius: 10, backgroundColor: 'rgba(164, 132, 219, 0.14)' },
  conclusionLabel: { color: '#ae91dc', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  conclusionText: { color: '#e1d7f2', fontSize: 12, lineHeight: 19, marginTop: 5 },
  deduceButton: { minHeight: 50, marginTop: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#dbe3ea' },
  deduceButtonDisabled: { opacity: 0.28 },
  deduceButtonText: { color: '#111720', fontSize: 12, fontWeight: '900' },
  pressed: { opacity: 0.68 },
});
