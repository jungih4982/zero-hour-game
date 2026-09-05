import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  BrainCircuit,
  LockKeyhole,
  MapPinned,
  NotebookTabs,
  PackageOpen,
  UserRound,
  X,
} from 'lucide-react-native';
import type { ClueId, DeductionId, LocationId, NarrativeEngineState } from '../engine';
import { canFormDeduction, deductions, isCorrectDeductionConnection } from '../gameplay/deductions';
import { formatIncidentTime } from '../gameplay/gameClock';

export type FieldKitTab = 'map' | 'people' | 'evidence' | 'deduction' | 'items';
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
  card06: require('../../assets/backgrounds/special/CG_06Card_Evidence_v01.png'),
  seoyun: require('../../assets/characters/seoyun/sprites/CHAR_Seoyun_Phone_Tense_Bust_v02.png'),
  yujin: require('../../assets/characters/yujin/sprites/CHAR_Yujin_Guarded_Full_v01.png'),
  taejun: require('../../assets/characters/taejun/sprites/CHAR_Taejun_Watchful_Full_v01.png'),
  sea: require('../../assets/characters/sea/sprites/CHAR_Sea_Wary_Full_v01.png'),
  minseo: require('../../assets/characters/minseo/sprites/CHAR_Minseo_Clinical_Full_v02.png'),
};

type PersonEntry = PictureCopy & {
  id: 'seoyun' | 'yujin' | 'taejun' | 'sea' | 'minseo';
  name: string;
  role: string;
  frame: 'bust' | 'full';
  knownWhen: (state: NarrativeEngineState) => boolean;
};

const people: readonly PersonEntry[] = [
  {
    id: 'seoyun',
    name: '서윤',
    role: '통화 상대',
    frame: 'bust',
    title: '서윤',
    detail: '백야의료원 주소를 보낸 사람. 전화 너머의 말과 현장의 기록이 서로 어긋나고 있다.',
    image: pictures.seoyun,
    knownWhen: () => true,
  },
  {
    id: 'yujin',
    name: '한유진',
    role: '원무과 직원',
    frame: 'full',
    title: '한유진',
    detail: '환자 조회와 병실 확인을 맡고 있다. 직접 본 사실과 전산 기록 사이에서 경계하고 있다.',
    image: pictures.yujin,
    knownWhen: (state) => state.persistent.clueIds.includes('CLUE_YUJIN_KNOWN' as ClueId)
      || state.volatile.visitedSceneIds.some((sceneId) => String(sceneId).includes('YUJIN')),
  },
  {
    id: 'taejun',
    name: '강태준',
    role: '보안 담당',
    frame: 'full',
    title: '강태준',
    detail: '통제 구역과 CCTV 기록에 접근할 수 있다. 협조보다 시설의 안전을 먼저 판단한다.',
    image: pictures.taejun,
    knownWhen: (state) => state.persistent.clueIds.some((clueId) =>
      ['CLUE_B1_MAP', 'CLUE_CCTV_GAP'].includes(String(clueId)))
      || state.volatile.visitedSceneIds.some((sceneId) => String(sceneId).includes('TAEJUN')),
  },
  {
    id: 'sea',
    name: '윤세아',
    role: '지하 구역의 환자',
    frame: 'full',
    title: '윤세아',
    detail: '린넨실에서 마주친 환자. 처음 본 나의 죽음과 반복을 이미 알고 있었다.',
    image: pictures.sea,
    knownWhen: (state) => state.persistent.clueIds.includes('CLUE_SEA_KNOWS' as ClueId)
      || state.volatile.visitedSceneIds.some((sceneId) => String(sceneId).includes('SEA_FIRST')),
  },
  {
    id: 'minseo',
    name: '차민서',
    role: '의사',
    frame: 'full',
    title: '차민서',
    detail: '유진과 함께 302호를 확인한 의사. 확실하지 않은 사실은 먼저 말하지 않는다.',
    image: pictures.minseo,
    knownWhen: (state) => state.persistent.clueIds.includes('CLUE_06_CARD' as ClueId)
      || state.volatile.visitedSceneIds.some((sceneId) =>
        ['SCENE_LOOP2_06_CARD', 'SCENE_LOOP2_SEOYUN_UNCERTAIN', 'SCENE_LOOP2_OLD_MAP_SEARCH']
          .includes(String(sceneId))),
  },
];

const locations: readonly LocationEntry[] = [
  { id: 'MOUNTAIN_ROAD' as LocationId, floor: '외부', name: '산길', title: '산길', detail: '백야의료원으로 이어지는 외곽 도로', image: pictures.road },
  { id: 'CAR' as LocationId, floor: '외부', name: '차 안', title: '차 안', detail: '첫 통화가 시작된 곳', image: pictures.road },
  { id: 'HOSPITAL_EXTERIOR' as LocationId, floor: '외부', name: '정문', title: '정문', detail: '주차장과 병원 출입구', image: pictures.exterior },
  { id: '1F_LOBBY' as LocationId, floor: '1F', name: '로비', title: '로비', detail: '접수처와 원무과가 있는 중앙 홀', image: pictures.lobby },
  { id: '1F_STAFF_DOOR' as LocationId, floor: '1F', name: '복도 끝', title: '복도 끝', detail: '지하 계단으로 이어지는 잠긴 문', image: pictures.staffDoor },
  { id: '3F_CORRIDOR' as LocationId, floor: '3F', name: '입원병동', title: '입원병동', detail: '301호와 302호가 있는 복도', image: pictures.corridor },
  { id: 'ROOM_302' as LocationId, floor: '3F', name: '302호', title: '302호', detail: '기록과 현장이 맞지 않는 병실', image: pictures.room302 },
  { id: 'B1_OPERATIONS_CORRIDOR' as LocationId, floor: 'B1', name: '지하 구역', title: '지하 구역', detail: '표찰이 사라진 문들이 이어지는 통제 구역', image: pictures.b1 },
  { id: 'B1_DOCUMENT_TRANSFER' as LocationId, floor: 'B1', name: '문서 이송실', title: '문서 이송실', detail: '01시 06분에 자동 밀폐되는 보관 구역', image: pictures.b1 },
];

const clueCopy: Readonly<Record<string, PictureCopy>> = {
  CLUE_WATCH_GIFT: { title: '오래된 손목시계', detail: '서윤이 선물한 시계. 시간은 정확했다.', image: pictures.death },
  CLUE_CONTRADICTORY_MESSAGES: { title: '서로 부정하는 문자', detail: '같은 대화창에서 오지 말라는 문자와 그 문자를 믿지 말라는 문자가 차례로 도착했다.', image: pictures.road },
  CLUE_YUJIN_KNOWN: { title: '먼저 나온 이름', detail: '서윤은 듣지 못했어야 할 유진의 이름을 알고 있었다.', image: pictures.corridor },
  CLUE_B1_MAP: { title: '피난 안내도', detail: '복도 끝에서 지하로 이어지는 계단이 표시돼 있다.', image: pictures.map },
  CLUE_302_OCCUPIED: { title: '비어 있지 않은 302호', detail: '직원의 설명과 달리 방금까지 환자가 머문 흔적이 있다.', image: pictures.room302 },
  CLUE_WRISTBAND_DOB: { title: '찢어진 손목밴드', detail: '이름은 뜯겼지만 생년월일은 서윤과 같았다.', image: pictures.room302 },
  CLUE_FIRST_PHONE: { title: '첫 번째 휴대전화', detail: '302호의 전화가 울리는 동안 서윤과 통화 중이었다.', image: pictures.seoyun },
  CLUE_SECOND_PHONE: { title: '동시에 존재한 전화', detail: '같은 번호와 기기가 서로 다른 두 곳에 존재했다.', image: pictures.seoyun },
  CLUE_SEA_KNOWS: { title: '세아의 경고', detail: '세아는 처음 만난 나의 죽음과 반복을 알고 있었다.', image: pictures.b1 },
  CLUE_B1_UNMARKED_ROOMS: { title: '막아 버린 관찰창', detail: '표찰을 뗀 문 아래에 관찰창을 막았던 자국이 남았다.', image: pictures.b1 },
  CLUE_B1_TRANSFER_TRACKS: { title: '꺾인 바퀴 자국', detail: '젖은 카트 바퀴 자국이 열린 린넨실로 이어진다.', image: pictures.b1 },
  CLUE_CCTV_GAP: { title: '사라진 1분', detail: '302호 앞 CCTV 영상이 정전과 무관하게 정확히 1분간 비어 있다.', image: pictures.corridor },
  CLUE_06_CARD: { title: '06 카드', detail: '302호 침대 옆에서 발견된 카드. 손목밴드와 같은 숫자가 남아 있다.', image: pictures.card06 },
  CLUE_OLD_302_PASSAGE: { title: '현재에는 없는 통로', detail: '오래된 안내도에는 302호 뒤에서 간호사실로 이어지는 좁은 공간이 표시돼 있다.', image: pictures.map },
  CLUE_TESTIMONY_YUJIN: { title: '유진의 답', detail: '근무한 뒤로 302호 뒤에는 문이 없었다.', image: pictures.lobby },
  CLUE_TESTIMONY_TAEJUN: { title: '태준의 답', detail: '폐쇄 전 도면에는 통로가 있었다.', image: pictures.map },
  CLUE_TESTIMONY_MINSEO: { title: '민서의 답', detail: '현재 구조에는 통로가 없어야 한다.', image: pictures.corridor },
  CLUE_0106_LEDGER: { title: '뜯긴 이송 장부', detail: '06 / 302 / 21:41 입실과 한…으로 시작하는 서명 흔적이 남았다.', image: pictures.card06 },
  CLUE_0106_HIDDEN_STAIR: { title: '맞은편 벽의 계단', detail: '문서 이송실 맞은편 벽 뒤에서 B2 계단 개방음이 들렸다.', image: pictures.b1 },
  CLUE_0106_CARD_READER: { title: '06 카드의 잠금', detail: '06 카드는 이송실 문이 아니라 맞은편 벽 안쪽 잠금을 연다.', image: pictures.card06 },
  CLUE_0106_RADIO_RESPONSE: { title: '벽 너머의 응답', detail: '세 번 두드리자 맞은편 계단에서 같은 간격으로 응답이 돌아왔다.', image: pictures.b1 },
  CLUE_06_B2_LABEL: { title: '관찰실 06 / B2', detail: '오래된 라벨 아래에서 B2 관찰실 표기가 드러났다.', image: pictures.card06 },
};

const itemCopy: Readonly<Record<string, PictureCopy>> = {
  ITEM_WRISTBAND_ORIGINAL: { title: '손목밴드 원본', detail: '이번 밤에 302호에서 가져온 찢어진 밴드. 죽음 뒤에는 이 밤에 남는다.', image: pictures.room302 },
  ITEM_FIRST_PHONE_PHOTO: { title: '봉투 속 전화 사진', detail: '오른쪽 아래의 흠집까지 서윤의 전화와 일치한다.', image: pictures.seoyun },
  ITEM_SECOND_PHONE: { title: '침대 아래의 휴대전화', detail: '첫 번째 전화와 같은 흠집이 있고 동시에 울린다.', image: pictures.room302 },
  ITEM_WRISTBAND_PHOTO: { title: '손목밴드 사진', detail: '302호와 생년월일이 식별되도록 촬영했다.', image: pictures.room302 },
  ITEM_OLD_MAP_PHOTO: { title: '오래된 안내도 사진', detail: '현재 벽 뒤에 남아 있을지도 모르는 통로의 위치를 찍었다.', image: pictures.map },
};

const tabs: readonly { id: FieldKitTab; label: string; Icon: typeof MapPinned }[] = [
  { id: 'map', label: '현장', Icon: MapPinned },
  { id: 'people', label: '인물', Icon: UserRound },
  { id: 'evidence', label: '단서', Icon: NotebookTabs },
  { id: 'deduction', label: '추론', Icon: BrainCircuit },
  { id: 'items', label: '소지품', Icon: PackageOpen },
];

function SectionHeading({ title, count }: { title: string; count?: string | number }) {
  return <View style={styles.sectionHeading}><View style={styles.sectionRule} /><Text style={styles.sectionTitle}>{title}</Text>{count !== undefined ? <Text style={styles.sectionCount}>{count}</Text> : null}</View>;
}

function EmptyState({ children }: { children: string }) {
  return <View style={styles.emptyState}><View style={styles.emptyReticle}><Text style={styles.emptyReticleText}>＋</Text></View><Text style={styles.emptyText}>{children}</Text></View>;
}

export function FieldKit({ state, visitedLocationIds, onClose, topInset, bottomInset, onFormDeduction, initialTab = 'map', initialDeductionId }: {
  state: NarrativeEngineState;
  visitedLocationIds: readonly LocationId[];
  onClose: () => void;
  topInset: number;
  bottomInset: number;
  onFormDeduction: (deductionId: DeductionId) => void;
  initialTab?: FieldKitTab;
  initialDeductionId?: DeductionId;
}) {
  const { width, height } = useWindowDimensions();
  const tablet = Math.min(width, height) >= 700;
  const [activeTab, setActiveTab] = useState<FieldKitTab>(initialTab);
  const [selectedLocationId, setSelectedLocationId] = useState(state.volatile.currentLocationId);
  const [selectedFacts, setSelectedFacts] = useState<Readonly<Record<string, readonly string[]>>>({});
  const [failedDeductionId, setFailedDeductionId] = useState<string>();
  const [expandedDeductionId, setExpandedDeductionId] = useState<string | undefined>(() =>
    initialDeductionId
      ?? deductions.find((deduction) =>
        !state.persistent.deductionIds.includes(deduction.id)
          && canFormDeduction(state, deduction))?.id,
  );
  const visitedLocations = useMemo(() => locations.filter((location) => visitedLocationIds.includes(location.id)), [visitedLocationIds]);
  const selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? locations.find((location) => location.id === state.volatile.currentLocationId) ?? visitedLocations.at(-1);
  const deductionRecords = useMemo(() => [
    ...state.persistent.clueIds.map((id) => ({ id: id as string, title: clueCopy[id]?.title ?? '확인되지 않은 단서', image: clueCopy[id]?.image ?? fieldBoard, tone: 'evidence' as const })),
    ...state.persistent.memories.map((memory) => ({ id: memory.id as string, title: memory.title, image: pictures.death, tone: 'memory' as const })),
  ], [state.persistent.clueIds, state.persistent.memories]);
  const availableDeductions = deductions.filter((deduction) => !state.persistent.deductionIds.includes(deduction.id) && canFormDeduction(state, deduction)).length;
  const presentedDeductions = [...deductions].sort((left, right) => {
    const rank = (deduction: (typeof deductions)[number]) => {
      if (deduction.id === expandedDeductionId) return 0;
      if (!state.persistent.deductionIds.includes(deduction.id) && canFormDeduction(state, deduction)) return 1;
      if (state.persistent.deductionIds.includes(deduction.id)) return 2;
      return 3;
    };
    return rank(left) - rank(right);
  });

  const toggleFact = (deductionId: string, sourceId: string, maximum: number) => {
    setFailedDeductionId(undefined);
    setSelectedFacts((current) => {
      const selected = current[deductionId] ?? [];
      const next = selected.includes(sourceId) ? selected.filter((id) => id !== sourceId) : selected.length >= maximum ? [sourceId] : [...selected, sourceId];
      return { ...current, [deductionId]: next };
    });
  };

  return (
    <View style={styles.layer}>
      <ImageBackground source={fieldBoard} resizeMode="cover" style={styles.boardBackground}>
        <View style={styles.boardShade} />
        <View style={[styles.console, tablet && styles.consoleTablet, { paddingTop: Math.max(topInset, 14), paddingBottom: Math.max(bottomInset, 10) }]}>
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
            {[['사건 시각', formatIncidentTime(state.volatile.time as number)], ['EVIDENCE', String(state.persistent.clueIds.length).padStart(2, '0')], ['MEMORY', String(state.persistent.memories.length).padStart(2, '0')]].map(([label, value]) => (
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

            {activeTab === 'people' ? <View>
              <SectionHeading
                title="확인한 인물"
                count={`${people.filter((person) => person.knownWhen(state)).length}/${people.length}`}
              />
              <Text style={styles.peopleIntroduction}>
                직접 확인한 사실만 기록된다. 새로운 정보가 생기면 인물 기록도 바뀐다.
              </Text>
              <View style={styles.peopleGrid}>
                {people.map((person, index) => {
                  const known = person.knownWhen(state);
                  return (
                    <View
                      key={person.id}
                      style={[styles.personCard, tablet && styles.personCardTablet, !known && styles.personCardLocked]}
                    >
                      <View style={[styles.personPortrait, tablet && styles.personPortraitTablet]}>
                        {known ? (
                          <Image
                            source={person.image}
                            resizeMode="contain"
                            style={person.frame === 'full' ? styles.personImageFull : styles.personImageBust}
                          />
                        ) : (
                          <Text style={styles.personUnknownMark}>?</Text>
                        )}
                        <View style={styles.personPortraitShade} />
                        <Text style={styles.personIndex}>{String(index + 1).padStart(2, '0')}</Text>
                      </View>
                      <View style={styles.personCopy}>
                        <Text style={styles.personRole}>{known ? person.role : '아직 만나지 못함'}</Text>
                        <Text style={[styles.personName, tablet && styles.personNameTablet]}>{known ? person.name : '기록 없음'}</Text>
                        <Text numberOfLines={tablet ? 4 : 3} style={[styles.personDetail, tablet && styles.personDetailTablet]}>
                          {known ? person.detail : '이 밤에서 직접 마주치면 기록이 열린다.'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
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
              {presentedDeductions.map((deduction) => {
                const formed = state.persistent.deductionIds.includes(deduction.id);
                const available = canFormDeduction(state, deduction);
                const expanded = expandedDeductionId === deduction.id;
                const chosen = selectedFacts[deduction.id] ?? [];
                const requiredCount = deduction.requiredClueIds.length + deduction.requiredMemoryIds.length;
                const acquiredCount = deduction.requiredClueIds.filter((id) => state.persistent.clueIds.includes(id)).length + deduction.requiredMemoryIds.filter((id) => state.persistent.memories.some((memory) => memory.id === id)).length;
                return <ImageBackground key={deduction.id} source={fieldBoard} resizeMode="cover" style={styles.deductionCard} imageStyle={styles.roundedImage}><View style={styles.deductionShade} />
                  <View style={styles.deductionHeader}><View style={[styles.deductionSeal, formed && styles.deductionSealFormed]}>{available || formed ? <BrainCircuit color={formed ? '#f0e7ff' : '#bea3ef'} size={21} /> : <LockKeyhole color="#657384" size={18} />}</View><View style={styles.deductionHeaderCopy}><Text style={styles.deductionState}>{formed ? 'CONNECTION VERIFIED' : available ? 'CONNECTION AVAILABLE' : 'INSUFFICIENT DATA'}</Text><Text style={styles.deductionTitle}>{formed ? deduction.title : available ? '미완성 추론' : '잠긴 추론'}</Text></View><Text style={styles.deductionProgress}>{formed ? '✓' : `${acquiredCount}/${requiredCount}`}</Text></View>
                  <Text style={styles.deductionDescription}>{formed ? deduction.description : available ? deduction.prompt : '확보한 기록 사이에 아직 연결 고리가 없다.'}</Text>
                  {formed ? <><View style={styles.formedConnection}>{deduction.facts.map((fact, index) => <React.Fragment key={`${deduction.id}:${fact.label}`}>{index > 0 ? <View style={styles.connectionLine}><View style={styles.connectionPulse} /></View> : null}<View style={[styles.factNode, fact.tone === 'memory' && styles.factNodeMemory]}><Text style={styles.factLabel}>{fact.label}</Text><Text numberOfLines={3} style={styles.factText}>{fact.text}</Text></View></React.Fragment>)}</View><View style={styles.conclusion}><Text style={styles.conclusionLabel}>확신</Text><Text style={styles.conclusionText}>{deduction.conclusion}</Text></View></> : available && expanded ? <>
                    <View style={styles.deductionInstruction}><Text style={styles.deductionInstructionText}>연결할 기록 {deduction.facts.length}개를 고른다</Text><Text style={styles.deductionSelectionCount}>{chosen.length}/{deduction.facts.length}</Text></View>
                    <View style={styles.deductionRecordGrid}>{deductionRecords.map((record) => { const selected = chosen.includes(record.id); return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={`${deduction.id}:${record.id}`} onPress={() => toggleFact(deduction.id, record.id, deduction.facts.length)} style={({ pressed }) => [styles.deductionRecord, selected && styles.deductionRecordSelected, pressed && styles.pressed]}><Image source={record.image} resizeMode="cover" style={styles.deductionRecordImage} /><View style={[styles.deductionRecordMark, record.tone === 'memory' && styles.deductionMemoryMark]}><Text style={styles.deductionRecordMarkText}>{selected ? '✓' : record.tone === 'memory' ? '◈' : '·'}</Text></View><Text numberOfLines={2} style={[styles.deductionRecordText, selected && styles.deductionRecordTextSelected]}>{record.title}</Text></Pressable>; })}</View>
                    {failedDeductionId === deduction.id ? <Text style={styles.deductionMistake}>이 기록들만으로는 아직 확정할 수 없다.</Text> : null}
                    <Pressable accessibilityRole="button" disabled={chosen.length !== deduction.facts.length} onPress={() => { if (isCorrectDeductionConnection(deduction, chosen)) { setFailedDeductionId(undefined); setExpandedDeductionId(undefined); onFormDeduction(deduction.id); } else { setFailedDeductionId(deduction.id); setSelectedFacts((current) => ({ ...current, [deduction.id]: [] })); } }} style={({ pressed }) => [styles.deduceButton, chosen.length !== deduction.facts.length && styles.deduceButtonDisabled, pressed && styles.pressed]}><BrainCircuit color="#10161d" size={17} /><Text style={styles.deduceButtonText}>연결을 검증한다</Text></Pressable>
                  </> : available ? <Pressable accessibilityRole="button" accessibilityLabel={`${deduction.prompt} 연결 시작`} onPress={() => { setExpandedDeductionId(deduction.id); setFailedDeductionId(undefined); }} style={({ pressed }) => [styles.deductionOpenButton, pressed && styles.pressed]}><BrainCircuit color="#d7c4f4" size={15} /><Text style={styles.deductionOpenButtonText}>이 추론을 펼친다</Text></Pressable> : null}
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
  consoleTablet: { width: '100%', maxWidth: 1100, alignSelf: 'center', paddingHorizontal: 28 },
  header: { minHeight: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brandBlock: { flex: 1 },
  systemLabel: { color: '#70869a', fontSize: 9, fontWeight: '900', letterSpacing: 1.8 }, title: { color: '#f3f6f9', fontSize: 25, fontWeight: '800', letterSpacing: -0.6, marginTop: 3 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }, liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#a88bdd', shadowColor: '#b29be1', shadowOpacity: 0.9, shadowRadius: 5 }, liveText: { color: '#8190a0', fontSize: 10, fontWeight: '700' },
  closeButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(12,20,29,0.74)', borderWidth: 1, borderColor: 'rgba(139,164,186,0.18)' },
  statusDeck: { height: 66, flexDirection: 'row', borderRadius: 13, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(125,151,175,0.18)', backgroundColor: 'rgba(7,13,20,0.9)' },
  statusPrimary: { width: 82, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: 'rgba(95,73,137,0.22)', borderRightWidth: 1, borderRightColor: 'rgba(164,137,211,0.26)' }, statusCell: { flex: 1, justifyContent: 'center', paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: 'rgba(125,151,175,0.12)' },
  statusLabel: { color: '#66788a', fontSize: 8, fontWeight: '900', letterSpacing: 1.1 }, statusValue: { color: '#cfb9f2', fontSize: 23, fontWeight: '300', marginTop: 1 }, statusText: { color: '#e3eaf0', fontSize: 14, fontWeight: '800', marginTop: 4 }, memoryText: { color: '#cbb6ef' },
  content: { flex: 1, marginTop: 10 }, contentInner: { paddingBottom: 18 }, sectionHeading: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 }, sectionRule: { width: 13, height: 2, backgroundColor: '#8ea7ba' }, sectionTitle: { flex: 1, color: '#b7c3ce', fontSize: 11, fontWeight: '900', letterSpacing: 1 }, sectionCount: { color: '#74879a', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  locationHero: { height: 190, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(146,171,192,0.28)' }, roundedImage: { borderRadius: 15 }, locationHeroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,9,14,0.26)' }, locationReticle: { position: 'absolute', right: 24, top: 28, width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: 'rgba(202,224,240,0.48)', alignItems: 'center', justifyContent: 'center' }, reticleCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#e7f2f9' },
  locationCopy: { padding: 16, paddingTop: 38, backgroundColor: 'rgba(3,8,13,0.7)' }, locationFloor: { color: '#91aec3', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 }, locationName: { color: '#f1f5f8', fontSize: 22, fontWeight: '800', marginTop: 2 }, locationDetail: { color: '#a0afbc', fontSize: 12, lineHeight: 18, marginTop: 3 }, currentTag: { position: 'absolute', right: 13, bottom: 15, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, backgroundColor: 'rgba(120,153,178,0.24)' }, currentTagText: { color: '#dceaf4', fontSize: 9, fontWeight: '900' },
  routeBoard: { minHeight: 220, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(126,151,174,0.22)' }, routeBoardImage: { opacity: 0.58 }, routeBoardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,10,16,0.56)' }, routeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 13 }, routeNode: { width: '31.5%', minHeight: 82, padding: 10, borderRadius: 10, justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(125,151,176,0.22)', backgroundColor: 'rgba(7,14,22,0.78)' }, routeNodeSelected: { borderColor: 'rgba(191,217,236,0.7)', backgroundColor: 'rgba(51,75,96,0.68)' }, routeIndex: { color: '#627486', fontSize: 10, fontWeight: '900' }, routeIndexCurrent: { color: '#bda7e6' }, routeFloor: { color: '#71869a', fontSize: 9, fontWeight: '900', marginTop: 10 }, routeName: { color: '#c7d0d9', fontSize: 13, fontWeight: '800', marginTop: 2 }, routeNameCurrent: { color: '#f1f5f8' },
  peopleIntroduction: { color: '#7f8f9d', fontSize: 10, lineHeight: 16, marginBottom: 11 },
  peopleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  personCard: { width: '48.7%', minHeight: 286, overflow: 'hidden', borderRadius: 14, backgroundColor: 'rgba(8,15,22,0.9)', borderWidth: 1, borderColor: 'rgba(130,157,179,0.24)' },
  personCardTablet: { width: '32.3%', minHeight: 340 },
  personCardLocked: { borderColor: 'rgba(95,112,128,0.14)', backgroundColor: 'rgba(6,11,17,0.62)' },
  personPortrait: { height: 172, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09111a' },
  personPortraitTablet: { height: 220 },
  personImageBust: { width: '118%', height: '118%', marginTop: '10%' },
  personImageFull: { position: 'absolute', top: 0, width: '160%', height: '220%' },
  personPortraitShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 58, backgroundColor: 'rgba(5,10,16,0.34)' },
  personUnknownMark: { color: '#354450', fontSize: 44, fontWeight: '200' },
  personIndex: { position: 'absolute', top: 9, left: 10, color: '#8195a5', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  personCopy: { flex: 1, padding: 11 },
  personRole: { color: '#71899a', fontSize: 7, fontWeight: '900', letterSpacing: 0.8 },
  personName: { color: '#eef3f6', fontSize: 16, fontWeight: '800', marginTop: 3 },
  personNameTablet: { fontSize: 19 },
  personDetail: { color: '#8998a5', fontSize: 9, lineHeight: 14, marginTop: 5 },
  personDetailTablet: { fontSize: 11, lineHeight: 17 },
  evidenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, evidenceCard: { width: '48.7%', height: 190, borderRadius: 13, overflow: 'hidden', backgroundColor: '#0b1119', borderWidth: 1, borderColor: 'rgba(131,156,179,0.2)' }, evidenceImage: { width: '100%', height: 116 }, evidenceImageShade: { position: 'absolute', top: 62, left: 0, right: 0, height: 72, backgroundColor: 'rgba(5,10,16,0.46)' }, evidenceNumber: { position: 'absolute', top: 9, left: 9, width: 28, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(3,8,13,0.78)' }, evidenceNumberText: { color: '#c5d4df', fontSize: 8, fontWeight: '900' }, evidenceCopy: { flex: 1, padding: 10, paddingTop: 8 }, evidenceTitle: { color: '#e9eef3', fontSize: 12, fontWeight: '800' }, evidenceDetail: { color: '#7f8e9d', fontSize: 8, lineHeight: 12, marginTop: 4 },
  memoryRail: { gap: 9, paddingRight: 10 }, memoryCard: { width: 230, height: 128, borderRadius: 13, overflow: 'hidden', padding: 13, justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(172,140,224,0.36)' }, memoryCardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,15,43,0.64)' }, memoryGlyph: { position: 'absolute', top: 12, right: 13, color: '#bda0ec', fontSize: 18 }, memoryTitle: { color: '#ebdfff', fontSize: 13, fontWeight: '800' }, memoryDetail: { color: '#a999bb', fontSize: 9, lineHeight: 13, marginTop: 4 },
  itemCard: { height: 182, marginBottom: 10, borderRadius: 15, overflow: 'hidden', flexDirection: 'row', alignItems: 'flex-end', padding: 15, borderWidth: 1, borderColor: 'rgba(139,165,187,0.28)' }, itemCardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,8,13,0.5)' }, itemIndex: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(8,15,22,0.82)', borderWidth: 1, borderColor: 'rgba(163,188,207,0.35)' }, itemIndexText: { color: '#dae6ef', fontSize: 9, fontWeight: '900' }, itemCopy: { flex: 1, marginLeft: 12, padding: 10, borderRadius: 10, backgroundColor: 'rgba(5,10,16,0.74)' }, itemKind: { color: '#758da0', fontSize: 6, fontWeight: '900', letterSpacing: 1.2 }, itemTitle: { color: '#eef3f6', fontSize: 15, fontWeight: '800', marginTop: 3 }, itemDetail: { color: '#94a3af', fontSize: 9, lineHeight: 14, marginTop: 4 },
  deductionCard: { marginBottom: 12, borderRadius: 15, overflow: 'hidden', padding: 15, borderWidth: 1, borderColor: 'rgba(159,126,212,0.34)' }, deductionShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,7,16,0.8)' }, deductionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, deductionSeal: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(116,81,166,0.18)', borderWidth: 1, borderColor: 'rgba(176,142,225,0.32)' }, deductionSealFormed: { backgroundColor: 'rgba(142,100,198,0.3)', borderColor: 'rgba(213,190,246,0.56)' }, deductionHeaderCopy: { flex: 1 }, deductionState: { color: '#8674a7', fontSize: 6, fontWeight: '900', letterSpacing: 1.15 }, deductionTitle: { color: '#eee8f6', fontSize: 16, fontWeight: '800', marginTop: 2 }, deductionProgress: { color: '#baa1e6', fontSize: 11, fontWeight: '900' }, deductionDescription: { color: '#92909d', fontSize: 10, lineHeight: 16, marginTop: 11 },
  formedConnection: { flexDirection: 'row', alignItems: 'center', marginTop: 14 }, factNode: { flex: 1, minHeight: 94, padding: 11, justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(73,99,122,0.2)', borderWidth: 1, borderColor: 'rgba(116,142,165,0.2)' }, factNodeMemory: { backgroundColor: 'rgba(104,72,148,0.24)', borderColor: 'rgba(166,132,214,0.28)' }, factLabel: { color: '#8b7aa9', fontSize: 7, fontWeight: '900' }, factText: { color: '#d6dce3', fontSize: 10, lineHeight: 15, fontWeight: '700', marginTop: 5 }, connectionLine: { width: 24, height: 1, backgroundColor: 'rgba(190,155,235,0.5)', alignItems: 'center', justifyContent: 'center' }, connectionPulse: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#c4a8ec' }, conclusion: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: 'rgba(119,82,169,0.22)', borderLeftWidth: 2, borderLeftColor: '#a887d5' }, conclusionLabel: { color: '#af91da', fontSize: 7, fontWeight: '900' }, conclusionText: { color: '#e4daef', fontSize: 11, lineHeight: 17, marginTop: 4 },
  deductionInstruction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 8 }, deductionInstructionText: { color: '#b4bac2', fontSize: 9, fontWeight: '800' }, deductionSelectionCount: { color: '#b798e1', fontSize: 10, fontWeight: '900' }, deductionRecordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, deductionRecord: { width: '48.6%', minHeight: 76, borderRadius: 10, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingRight: 8, backgroundColor: 'rgba(12,19,28,0.88)', borderWidth: 1, borderColor: 'rgba(115,139,161,0.22)' }, deductionRecordSelected: { borderColor: 'rgba(208,181,241,0.72)', backgroundColor: 'rgba(92,61,132,0.72)' }, deductionRecordImage: { width: 53, height: '100%', opacity: 0.7 }, deductionRecordMark: { position: 'absolute', left: 6, top: 6, width: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(4,9,14,0.84)' }, deductionMemoryMark: { backgroundColor: 'rgba(70,43,105,0.9)' }, deductionRecordMarkText: { color: '#d4c3ed', fontSize: 8, fontWeight: '900' }, deductionRecordText: { flex: 1, color: '#aeb9c4', fontSize: 9, lineHeight: 13, fontWeight: '700', marginLeft: 8 }, deductionRecordTextSelected: { color: '#f4ecff' }, deductionMistake: { color: '#cf897f', fontSize: 9, lineHeight: 14, marginTop: 9 }, deduceButton: { minHeight: 50, marginTop: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#e2e8ed' }, deduceButtonDisabled: { opacity: 0.28 }, deduceButtonText: { color: '#10161d', fontSize: 11, fontWeight: '900' },
  deductionOpenButton: { minHeight: 48, marginTop: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(104,74,148,0.34)', borderWidth: 1, borderColor: 'rgba(183,148,226,0.32)' }, deductionOpenButtonText: { color: '#ddcff1', fontSize: 10, fontWeight: '900' },
  tabs: { minHeight: 66, flexDirection: 'row', borderRadius: 15, padding: 4, backgroundColor: 'rgba(6,11,17,0.96)', borderWidth: 1, borderColor: 'rgba(126,151,174,0.2)' }, tab: { flex: 1, minHeight: 56, borderRadius: 11, alignItems: 'center', justifyContent: 'center', gap: 3 }, tabActive: { backgroundColor: 'rgba(75,95,116,0.32)' }, tabSignal: { position: 'absolute', top: 0, width: 22, height: 2, borderRadius: 1, backgroundColor: '#c8d9e5' }, tabText: { color: '#718294', fontSize: 9, fontWeight: '900' }, tabTextActive: { color: '#edf3f7' }, tabBadge: { position: 'absolute', top: 4, right: 7, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, backgroundColor: '#526c81' }, tabBadgeMemory: { backgroundColor: '#7656a5' }, tabBadgeText: { color: '#f3f6f8', fontSize: 8, fontWeight: '900' },
  emptyState: { minHeight: 190, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(8,14,21,0.74)', borderWidth: 1, borderColor: 'rgba(125,149,170,0.16)' }, emptyReticle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(129,154,176,0.24)' }, emptyReticleText: { color: '#6b7e8f', fontSize: 18 }, emptyText: { color: '#6e7d8c', fontSize: 12, marginTop: 10 }, pressed: { opacity: 0.67 },
});
