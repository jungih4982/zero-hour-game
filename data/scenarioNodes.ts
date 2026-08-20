// data/scenarioNodes.ts
import { JobType } from '../store/useGameStore';

export interface Choice {
  text: string;
  costAp: number;
  nextNodeId: string;
  requiredJob?: JobType;
  requiredClue?: string;
  unlockClue?: string;
  requiredItem?: string; 
  unlockItem?: string;   
  triggerDeathId?: string;
  deathCause?: string;
  deathTrait?: string;
  sanityChange?: number;
  isEnding?: boolean;
  endingTitle?: string;
}

export interface ScenarioNode {
  nodeId: string;
  timeSlot: string;
  locationName: string;
  speakerName: string;
  scriptText: string;
  choices: Choice[];
  bgTheme?: 'LOBBY' | 'DARK_LOBBY' | 'LINEN' | 'DESK' | 'BLACKOUT';
  isTimeTransitionNode?: boolean;
}

export const SCENARIO_NODES: Record<string, ScenarioNode> = {
  // ==========================================
  // [22:00] 딥 미스터리 프롤로그: 고립
  // ==========================================
  NODE_PROLOGUE_INTRO: {
    nodeId: 'NODE_PROLOGUE_INTRO',
    timeSlot: '22:00',
    locationName: '1F 지상 로비 입구',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '어젯밤, 요양원에 입원한 동생 지우에게서 기괴하게 끊긴 문자가 도착했다.\n\n[오빠, 여긴 병원이 아니... 도와ㅈ...]\n\n그 불길한 한 줄에 미친 듯이 차를 몰아 눈보라 치는 산길을 올랐다.\n\n요양원 정문에 도착해 차에서 내린 바로 그 순간, 등 뒤에서 고막을 찢는 굉음과 함께 거대한 산사태가 쏟아져 내렸다. 유일한 진입로가 완전히 끊겨버렸다.\n\n퇴로를 잃은 채 홀린 듯 무거운 유리문을 밀고 들어서자, 숨이 턱 막힐 듯 짙은 포르말린 냄새가 코를 찔렀다.\n\n텅 빈 로비. 소름 끼치는 적막. 이곳은 병원이 아니다. 거대한 영안실이다.',
    choices: [
      { text: '불길한 예감을 억누르며, 텅 빈 1층 로비 안쪽으로 발걸음을 옮긴다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_EMPTY' },
    ],
  },

  NODE_1F_LOBBY_EMPTY: {
    nodeId: 'NODE_1F_LOBBY_EMPTY',
    timeSlot: '22:00',
    locationName: '1F 텅 빈 로비',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '안내 데스크에는 아무도 없다. 반쯤 깨진 형광등이 신경질적으로 점멸하며 대리석 바닥에 기괴한 그림자를 드리울 뿐이다.\n\n어디선가 일정한 간격으로 물방울이 떨어지는 소리가 들린다. 툭, 툭...\n\n아니, 저건 물이 아니다. 접수처 데스크 아래쪽 대리석 바닥에 검붉은 액체가 웅덩이처럼 고여 있다.',
    choices: [
      { text: '[탐색] 핏자국을 따라 안내 데스크 안쪽을 뒤져본다. (AP 0)', costAp: 0, nextNodeId: 'NODE_1F_DESK_INVESTIGATE' },
      { text: '[탐색] 로비 구석, 어둠이 깔린 대기실 소파 쪽을 살펴본다. (AP 0)', costAp: 0, nextNodeId: 'NODE_1F_WAITING_AREA' },
    ],
  },

  NODE_1F_WAITING_AREA: {
    nodeId: 'NODE_1F_WAITING_AREA',
    timeSlot: '22:00',
    locationName: '1F 대기실 소파',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '가죽이 다 벗겨진 소파 위에 누군가 다급하게 흘리고 간 듯한 크레파스 그림이 떨어져 있다.\n\n검은색으로만 마구 칠해진 종이 한가운데, 붉은 눈을 가진 하얀 옷의 사람들이 누군가를 지하로 끌고 가는 기괴한 묘사.\n\n그림 모서리에 삐뚤빼뚤한 글씨가 적혀 있다.\n[밤 12시가 되면 천사들이 사냥을 시작해]\n\n등줄기를 타고 서늘한 소름이 돋아난다.',
    choices: [
      { text: '그림을 챙겨 들고 다시 접수처 데스크로 돌아간다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_EMPTY' },
    ],
  },

  NODE_1F_DESK_INVESTIGATE: {
    nodeId: 'NODE_1F_DESK_INVESTIGATE',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '주인공 (독백)',
    bgTheme: 'DESK',
    scriptText:
      '데스크 안쪽은 누군가 난장판을 벌인 듯 서류가 흩뿌려져 있다.\n\n바닥에 고인 핏자국 옆, 다급하게 찢겨 나간 흔적이 있는 [야간 병동 근무 일지]를 발견했다.\n\n“...지우의 이름이 없다. 어제 자로 모든 환자 명단이 검은 매직으로 지워져 있어.”\n\n그때, 등 뒤에서 서늘한 구둣발 소리가 들려왔다.',
    choices: [
      { text: '숨을 죽이고 천천히 뒤를 돌아본다.', costAp: 0, nextNodeId: 'NODE_1F_YUJIN_APPEARANCE' },
    ],
  },

  // ==========================================
  // [22:00] 로비 허브: 수간호사 유진과의 조우
  // ==========================================
  NODE_1F_YUJIN_APPEARANCE: {
    nodeId: 'NODE_1F_YUJIN_APPEARANCE',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“이런 시간에, 어떻게 들어오신 겁니까?”\n\n어둠 속에서 걸어 나온 여자는 무표정했다. 빳빳하게 다려진 수간호사 가운을 입었지만, 구두 밑창에 묻은 붉은 얼룩이 내 시선을 사로잡았다.\n\n“...강지우 환자의 보호자분이시군요. 안타깝지만, 해당 환자는 어제 오전 자진 퇴원하셨습니다.”\n\n그녀가 내민 서류에는 잉크조차 마르지 않은 조잡한 위조의 흔적이 역력했다.',
    choices: [
      { text: '[기자 특화] 일지와 서류의 잉크가 마르지 않은 점을 짚어 압박한다. (AP 0)', requiredJob: 'JOURNALIST', costAp: 0, unlockClue: 'CLUE_BLACKOUT_TIME_0000', nextNodeId: 'NODE_1F_DESK_HACK' },
      { text: '[루프 지식] “00시 정전 프로토콜... 환자들을 이카루스로 빼돌린 거 알아.” (AP 1)', requiredClue: 'CLUE_BLACKOUT_TIME_0000', costAp: 1, nextNodeId: 'NODE_1F_YUJIN_SHOCKED' },
      { text: '말없이 그녀의 구두에 묻은 핏자국을 노려본다. (AP 1)', costAp: 1, nextNodeId: 'NODE_1F_YUJIN_CONFRONT' },
    ],
  },

  NODE_1F_DESK_HACK: {
    nodeId: 'NODE_1F_DESK_HACK',
    timeSlot: '22:00',
    locationName: '1F 원무과 내부',
    speakerName: '주인공 (독백)',
    bgTheme: 'DESK',
    scriptText:
      '거짓말을 추궁하자 그녀의 눈동자가 기이하게 흔들렸다. 유진이 무전 호출을 받기 위해 잠시 자리를 비운 사이, 찢겨 나간 일지의 뒷장을 빛에 비춰보았다.\n\n볼펜 자국으로 깊게 눌려 남은 글씨가 떠오른다.\n[피험체 코드 #09 강지우 / 00:00 코드 블랙 발령. B3 심층 연구동 이관 예정]\n\n자정. 병원의 불이 꺼지는 순간, 놈들이 지우를 옮긴다. 그 혼란만이 유일한 기회다.',
    choices: [
      { text: '알아낸 진실을 가슴에 품고, 데스크 밖으로 물러난다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_HUB' },
    ],
  },

  NODE_1F_YUJIN_CONFRONT: {
    nodeId: 'NODE_1F_YUJIN_CONFRONT',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '내 시선을 알아챈 그녀가 구두를 뒤로 슬쩍 숨긴다. 짙은 포르말린 냄새 사이로 비릿한 혈향이 확고해졌다.\n\n“폭설로 도로가 끊겼으니, 날이 밝을 때까지 소파에서 대기하십시오. 그 이상의 배회는... 당신의 안전을 보장할 수 없습니다.”\n\n경고인지 협박인지 모를 말을 남긴 채, 유진은 복도 끝 어둠 속으로 사라졌다.',
    choices: [
      { text: '본격적으로 1층을 탐색하기 위해 몸을 움직인다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_HUB' },
    ],
  },

  NODE_1F_YUJIN_SHOCKED: {
    nodeId: 'NODE_1F_YUJIN_SHOCKED',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“...당신, 대체 그걸 어떻게 아는 거지?”\n\n얼음장 같던 유진의 표정이 일순간 산산조각 났다. 차트를 꽉 쥔 그녀의 손마디가 하얗게 질려 사시나무 떨듯 진동한다.\n\n“00시 정전 프로토콜은... 본사 극비 보안 사항인데. 대체 정체가 뭡니까?”',
    choices: [
      { text: '“내 목적은 동생뿐이야. 날 도우면 당신의 신변도 보장하지.” (AP 0)', costAp: 0, unlockItem: '린넨실 마스터키', nextNodeId: 'NODE_1F_YUJIN_ALLIANCE' },
    ],
  },

  NODE_1F_YUJIN_ALLIANCE: {
    nodeId: 'NODE_1F_YUJIN_ALLIANCE',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“...미친 짓이지만, 나도 이 지옥에 신물이 나던 참이었어.\n\n린넨실 환풍구를 뜯어내면 B1 지하로 직행하는 녹슨 사다리가 나와. 이 마스터키를 챙겨요.\n\n하지만 명심해. 자정이 되는 순간, 방호복을 입은 사냥개들이 로비로 쏟아져 들어올 거야.”\n\n[아이템 획득: 차갑게 식은 린넨실 마스터키]',
    choices: [
      { text: '마스터키를 챙겨 린넨실이 있는 복도로 향한다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_HUB' },
    ],
  },

  // ==========================================
  // [22:00] 로비 허브: 본격적인 자유 탐색
  // ==========================================
  NODE_1F_LOBBY_HUB: {
    nodeId: 'NODE_1F_LOBBY_HUB',
    timeSlot: '22:00',
    locationName: '1F 메인 복도',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '정적만 감도는 1층 복도. 천장의 형광등이 고장 난 벌레처럼 웅웅거리며 깜빡인다.\n\n오른쪽은 악취가 새어 나오는 [린넨실], 정면은 굳게 닫힌 [메인 엘리베이터], 왼쪽은 [대기실 소파]다.\n\n시간이 얼마 없다. 자정이 되기 전에 단서를 찾아 지하로 내려갈 방법을 찾아야 한다.',
    choices: [
      { text: '어둠이 깔린 린넨실 문을 조심스럽게 열어본다. (AP 1)', costAp: 1, nextNodeId: 'NODE_1F_LINEN_ROOM' },
      { text: '메인 엘리베이터의 버튼을 눌러본다. (AP 1)', costAp: 1, nextNodeId: 'NODE_1F_ELEVATOR' },
      { text: '대기실 소파에 앉아 놈들의 동태를 살피며 시간을 보낸다. (AP 1)', costAp: 1, nextNodeId: 'NODE_1F_WAIT_SOFA' },
    ],
  },

  NODE_1F_ELEVATOR: {
    nodeId: 'NODE_1F_ELEVATOR',
    timeSlot: '22:00',
    locationName: '1F 메인 엘리베이터',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '엘리베이터 호출 버튼을 눌렀지만, 둔탁한 기계음만 날 뿐 반응이 없다.\n\n버튼 틈새로 끈적한 피가 말라붙어 있고, 패널 위에는 [B1, B2, B3 접근 금지 - 원장 승인 필요]라는 살벌한 경고문이 붙어 있다.\n\n이곳으로는 지하로 내려갈 수 없다. 다른 통로를 찾아야만 한다.',
    choices: [
      { text: '발길을 돌려 메인 복도로 돌아간다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_HUB' },
    ],
  },

  NODE_1F_LINEN_ROOM: {
    nodeId: 'NODE_1F_LINEN_ROOM',
    timeSlot: '22:00',
    locationName: '1F 린넨실',
    speakerName: '의문의 소녀 세아',
    bgTheme: 'LINEN',
    scriptText:
      '문을 열자 퀴퀴한 곰팡이 냄새가 진동한다.\n\n그리고 구석의 대형 환풍구 앞... 피딱지가 눌어붙은 환자복을 걸친 소녀가 웅크린 채 다 닳은 손톱으로 쇠창살을 벅벅 긁어대고 있다.\n\n“쉿... 째깍, 째깍... 열두 번의 종이 울리면, 하얀 옷을 입은 사신들이 총을 들고 데리러 와...\n불이 꺼지면... 숨도 쉬지 말고 쥐구멍으로 도망쳐야 해...”',
    choices: [
      { text: '[아이템 사용] 마스터키로 환풍구를 열고 지하로 가는 지름길을 확보한다. (AP 0)', requiredItem: '린넨실 마스터키', costAp: 0, unlockClue: 'CLUE_B1_SECRET_DOOR', nextNodeId: 'NODE_1F_LOBBY_HUB' },
      { text: '기괴한 광경에 소름이 끼쳐 조용히 방문을 닫고 나온다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_HUB' },
    ],
  },

  NODE_1F_WAIT_SOFA: {
    nodeId: 'NODE_1F_WAIT_SOFA',
    timeSlot: '22:00',
    locationName: '1F 로비 소파',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '낡은 가죽 소파에 몸을 파묻은 채 거대한 벽시계를 응시한다. 째깍, 째깍. 초침 소리가 고막을 날카롭게 찢는다.\n\n직원들의 움직임이 기계처럼 바빠지고, 무전기를 타고 알 수 없는 암호들이 쉴 새 없이 흘러나온다.\n\n폭풍 전야의 소름 끼치는 정적. 자정이 다가오고 있다.',
    choices: [
      { text: '자리에서 일어나 다시 탐색을 시도한다.', costAp: 0, nextNodeId: 'NODE_1F_LOBBY_HUB' },
    ],
  },

  // ==========================================
  // [00:00] 제로 아워 발발 (AP 0 강제 컷신)
  // ==========================================
  NODE_0000_BLACKOUT_EVENT: {
    nodeId: 'NODE_0000_BLACKOUT_EVENT',
    timeSlot: '00:00',
    locationName: '1F 로비 ➔ 정전 발발',
    speakerName: '시스템 경보',
    bgTheme: 'BLACKOUT',
    isTimeTransitionNode: true,
    scriptText:
      '─── 콰아아앙!!\n\n자정을 알리는 열두 번째 괘종시계 소리와 함께, 고막을 찢는 파열음이 울리며 병원 전체의 전력이 일제히 증발했다!\n\n칠흑 같은 어둠 속, 핏빛 비상등만이 섬뜩하게 점멸하며 발광하기 시작한다.\n\n[경고: 코드 블랙 발령. B구역 격리 차단 및 소거조 투입]\n\n철컥. 샷건 장전 소리. 육중한 전투화를 신은 방호복 경비대원들이 유리를 박살 내며 로비로 쏟아져 들어온다!',
    choices: [
      { text: '[루프 지식] 린넨실 환풍구 뒤 비밀 통로로 짐승처럼 몸을 던진다! (AP 0)', requiredClue: 'CLUE_B1_SECRET_DOOR', costAp: 0, nextNodeId: 'NODE_B1_BOILER_ROOM' },
      { text: '어둠 속 희미한 비상구 유도등만을 의지한 채 필사적으로 질주한다! (AP 1)', costAp: 1, nextNodeId: 'NODE_B1_BOILER_ROOM' },
      { text: '[위험] 이성을 잃고 경비대 순찰조를 향해 정면으로 달려든다.', costAp: 0, nextNodeId: 'NODE_0000_BLACKOUT_EVENT', triggerDeathId: 'DEATH_02', deathCause: '테이저건 심장 마비사', deathTrait: '전기 내성' },
    ],
  },

  NODE_B1_BOILER_ROOM: {
    nodeId: 'NODE_B1_BOILER_ROOM',
    timeSlot: '00:30',
    locationName: 'B1 보일러실 지하통로',
    speakerName: '주인공 (독백)',
    bgTheme: 'DARK_LOBBY',
    scriptText: '간신히 로비의 경비대를 따돌리고 지하로 굴러떨어졌다. 증기 파이프 너머로 네온사인이 일렁이는 카지노 철문이 보인다.',
    choices: [
      { text: '어둠을 틈타 카지노 비밀문으로 진입한다. (AP 0)', costAp: 0, nextNodeId: 'NODE_B1_CASINO_HUB' },
    ],
  },

  NODE_B1_CASINO_HUB: {
    nodeId: 'NODE_B1_CASINO_HUB',
    timeSlot: '01:00',
    locationName: 'B1 비밀 카지노',
    speakerName: '딜러 카밀라',
    bgTheme: 'DARK_LOBBY',
    scriptText: '“경비대한테 목이 물어뜯기기 전에, 나와 영혼을 건 베팅 한 판 어때? 이기면 밑으로 내려갈 B2 키카드를 줄게.”',
    choices: [
      { text: '보일러실로 돌아간다.', costAp: 0, nextNodeId: 'NODE_B1_BOILER_ROOM' }
    ]
  }
};

export default SCENARIO_NODES;