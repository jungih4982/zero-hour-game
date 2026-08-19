// data/scenarioNodes.ts
import { JobType } from '../store/useGameStore';

export interface Choice {
  text: string;
  costAp: number;
  nextNodeId: string;
  requiredJob?: JobType;
  requiredClue?: string;
  unlockClue?: string;
  triggerDeathId?: string;
  deathCause?: string;
  deathTrait?: string;
  sanityChange?: number;
}

export interface ScenarioNode {
  nodeId: string;
  timeSlot: string;
  locationName: string;
  speakerName: string;
  scriptText: string;
  choices: Choice[];
  bgTheme?: 'LOBBY' | 'DARK_LOBBY' | 'LINEN' | 'DESK' | 'BLACKOUT';
}

export const SCENARIO_NODES: Record<string, ScenarioNode> = {
  // ==========================================
  // [22:00] 오프닝: 폭설 속 백야 요양원 진입
  // ==========================================
  NODE_PROLOGUE_INTRO: {
    nodeId: 'NODE_PROLOGUE_INTRO',
    timeSlot: '22:00',
    locationName: '1F 지상 로비 입구',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '유리창을 거세게 때리는 눈보라 소리.\n\n가벼운 수면장애로 입원했던 여동생 지우가 연락이 끊긴 지 3주째.\n차를 몰고 산속 깊은 이곳까지 올라왔지만, 방금 전 산사태로 유일한 진입로가 완전히 무너져 내렸다.\n\n이제 날이 밝을 때까지, 이 기괴한 병원에 고립되었다.',
    choices: [
      {
        text: '접수처 데스크의 수간호사에게 다가간다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
    ],
  },

  // ==========================================
  // [22:00] 로비 허브: 수간호사 유진과의 대치
  // ==========================================
  NODE_1F_LOBBY_START: {
    nodeId: 'NODE_1F_LOBBY_START',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“...강지우 환자분 말씀이십니까?”\n\n유진이 반무테 안경을 치켜올리며 위조된 듯한 서류 한 장을 차갑게 내민다.\n\n“해당 환자는 지난달 15일 자진 퇴원 처리되었습니다. 도로가 끊겼으니 날이 밝을 때까지 소파에서 조용히 대기하십시오.”',
    choices: [
      {
        text: '[기자 특화] 서류 조작 흔적을 지적하며 원무과 PC를 기습 조사한다. (AP 0)',
        requiredJob: 'JOURNALIST',
        costAp: 0,
        unlockClue: 'CLUE_BLACKOUT_TIME_0000',
        nextNodeId: 'NODE_1F_DESK_HACK',
      },
      {
        text: '[루프 지식] “00시 정전 프로토콜... 지우를 B3 이카루스로 옮기려는 거죠?” (AP 1)',
        requiredClue: 'CLUE_BLACKOUT_TIME_0000',
        costAp: 1,
        nextNodeId: 'NODE_1F_YUJIN_SHOCKED',
      },
      {
        text: '복도 끝 린넨실 환풍구에서 들려오는 이상한 긁는 소리를 확인한다. (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_1F_LINEN_ROOM',
      },
      {
        text: '로비 소파에 앉아 유진의 동태를 살피며 시간을 보낸다. (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_1F_WAIT_SOFA',
      },
      {
        text: '[충동적 행동] 잠긴 유리창을 깨고 바깥 절벽 눈보라 속으로 뛰어내린다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
        triggerDeathId: 'DEATH_01',
        deathCause: '절벽 추락사',
        deathTrait: '야간 시야',
      },
    ],
  },

  // ==========================================
  // [조사 1] 원무과 PC 해킹 (기자 전용)
  // ==========================================
  NODE_1F_DESK_HACK: {
    nodeId: 'NODE_1F_DESK_HACK',
    timeSlot: '22:00',
    locationName: '1F 원무과 내부',
    speakerName: '주인공 (독백)',
    bgTheme: 'DESK',
    scriptText:
      '유진이 다른 환자의 링거를 확인하러 자리를 비운 틈을 타 데스크 서류함을 열었다.\n\n붉은색 극비 도장이 찍힌 지우의 진짜 차트가 드러났다.\n\n[피험체 코드 #09: 강지우 / 00:00 코드 블랙 발령 시 B3 심층 연구동 이관]\n\n자정이 되면 병원 전체가 정전된다. 이것이 지우를 빼돌릴 타이밍이다!',
    choices: [
      {
        text: '차트를 덮고 아무 일 없었다는 듯 로비로 돌아간다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
    ],
  },

  // ==========================================
  // [조사 2] 유진의 심리적 동요 (루프 지식)
  // ==========================================
  NODE_1F_YUJIN_SHOCKED: {
    nodeId: 'NODE_1F_YUJIN_SHOCKED',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“...당신, 대체 그걸 어떻게...”\n\n유진의 차분하던 눈동자가 심하게 흔들린다. 차트를 쥔 손끝이 잘게 떨린다.\n\n“00시 정전 프로토콜은 본사 보안팀과 병원장님만 아는 극비 사항인데... 대체 당신 정체가 뭡니까?”',
    choices: [
      {
        text: '“동생을 살리러 왔습니다. 날 도우면 당신 동생의 신변도 보장하죠.” (AP 0)',
        costAp: 0,
        unlockClue: 'CLUE_LINEN_MASTER_KEY',
        nextNodeId: 'NODE_1F_YUJIN_ALLIANCE',
      },
      {
        text: '경고만 남긴 채 돌아선다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
    ],
  },

  NODE_1F_YUJIN_ALLIANCE: {
    nodeId: 'NODE_1F_YUJIN_ALLIANCE',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“...좋아요. 린넨실 환풍구 뒤에 B1 지하 관리구역으로 통하는 비상 사다리가 있어요.\n이 마스터키를 받아요. 하지만 자정이 되면 방호복 무장 경비대가 로비로 진입할 테니 조심해요.”\n\n[단서: 린넨실 마스터키 획득]',
    choices: [
      {
        text: '열쇠를 챙기고 린넨실로 향한다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_1F_LINEN_ROOM',
      },
    ],
  },

  // ==========================================
  // [조사 3] 린넨실 환풍구의 소녀 세아
  // ==========================================
  NODE_1F_LINEN_ROOM: {
    nodeId: 'NODE_1F_LINEN_ROOM',
    timeSlot: '22:00',
    locationName: '1F 린넨실 환풍구',
    speakerName: '의문의 소녀 세아',
    bgTheme: 'LINEN',
    scriptText:
      '어두컴컴한 린넨실 구석, 헐렁한 환자복을 입은 연보라빛 머리의 소녀가 웅크린 채 손톱으로 벽을 긁고 있다.\n\n“쉿... 째깍, 째깍... 시계가 열두 번 울리면 하얀 옷을 입은 사신들이 총을 들고 내려와... 불이 꺼지면 도망쳐야 해...”',
    choices: [
      {
        text: '세아를 달래며 지하 보일러실로 가는 지름길을 묻는다. (AP 0)',
        costAp: 0,
        unlockClue: 'CLUE_B1_SECRET_DOOR',
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
      {
        text: '소녀를 자극하지 않고 조용히 빠져나온다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
    ],
  },

  // ==========================================
  // [대기] 소파에서 시간 보내기
  // ==========================================
  NODE_1F_WAIT_SOFA: {
    nodeId: 'NODE_1F_WAIT_SOFA',
    timeSlot: '22:00',
    locationName: '1F 로비 소파',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '소파에 앉아 벽시계를 응시한다. 초침이 돌아가는 소리가 유난히 크게 울린다.\n병원 직원들은 극도로 긴장한 표정으로 무전을 주고받고 있다. 자정이 다가오고 있다.',
    choices: [
      {
        text: '다시 일어나 탐색을 시작한다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
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
    scriptText:
      '─── 콰아아앙!!\n\n자정을 알리는 괘종시계의 12번째 종소리와 함께, 병원 전체의 전력이 일제히 차단되었다.\n\n끼이익거리는 붉은 비상 비상등 아래로 사이렌이 요란하게 울린다.\n\n[경고: 코드 블랙 발령. 격리구역 차단 및 소거조 투입]\n\n무거운 방호복과 전술 조끼를 착용한 무장 경비대원들이 로비 정문으로 난입하기 시작한다!',
    choices: [
      {
        text: '[루프 지식] 세아가 알려준 B1 보일러실 비밀 통로로 몸을 날린다! (AP 0)',
        requiredClue: 'CLUE_B1_SECRET_DOOR',
        costAp: 0,
        nextNodeId: 'NODE_B1_BOILER_ROOM',
      },
      {
        text: '어둠 속에서 비상구 유도등을 따라 필사적으로 달린다! (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_B1_BOILER_ROOM',
      },
      {
        text: '[위험] 경비대 순찰조를 향해 소리치며 정면으로 저항한다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
        triggerDeathId: 'DEATH_02',
        deathCause: '테이저건 심장 마비사',
        deathTrait: '전기 내성',
      },
    ],
  },

  // ==========================================
  // [00:30] B1 관리구역 & 지하 카지노 허브
  // ==========================================
  NODE_B1_BOILER_ROOM: {
    nodeId: 'NODE_B1_BOILER_ROOM',
    timeSlot: '00:30',
    locationName: 'B1 보일러실 지하통로',
    speakerName: '주인공 (독백)',
    bgTheme: 'DARK_LOBBY',
    scriptText:
      '간신히 지상 로비의 경비대를 따돌리고 지하 관리구역으로 숨어들었다.\n\n증기 파이프가 쉭쉭거리는 통로 끝, 붉은 네온사인이 희미하게 번지는 두꺼운 방음 철문 너머로 재즈 음악과 칩이 부딪히는 소리가 새어나온다.',
    choices: [
      {
        text: '불빛이 새어나오는 카지노 비밀문으로 향한다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_B1_CASINO_HUB',
      },
      {
        text: '[B2 직통 키카드] 특수 격리병동 철문을 열고 진입한다. (AP 1)',
        requiredClue: 'CLUE_B2_KEYCARD',
        costAp: 1,
        nextNodeId: 'NODE_B2_QUARANTINE_START',
      },
    ],
  },

  NODE_B1_CASINO_HUB: {
    nodeId: 'NODE_B1_CASINO_HUB',
    timeSlot: '01:00',
    locationName: 'B1 비밀 카지노',
    speakerName: '딜러 카밀라',
    bgTheme: 'DARK_LOBBY',
    scriptText:
      '“어머, 위층에서 총소리가 요란하더니 웬 손님이 굴러들어왔네?”\n\n버건디빛 머리를 쓸어넘기며 붉은 조끼를 입은 여성이 카지노 칩을 능숙하게 굴린다.\n\n“경비대한테 넘기기 전에, 나와 목숨을 건 베팅 한 판 어때? 이기면 B2 구역 키카드를 줄게.”',
    choices: [
      {
        text: '카밀라의 게임 테이블로 다가간다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_B1_CASINO_HUB',
      },
      {
        text: '보일러실 통로로 조용히 물러난다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_B1_BOILER_ROOM',
      },
    ],
  },

  NODE_B2_QUARANTINE_START: {
    nodeId: 'NODE_B2_QUARANTINE_START',
    timeSlot: '02:00',
    locationName: 'B2 특수 격리병동',
    speakerName: '의문의 소녀 세아',
    bgTheme: 'DARK_LOBBY',
    scriptText:
      '푸른 신경가스가 바닥에 깔려 있다. 유리 캡슐 안에 갇힌 세아가 유리를 두드리며 울먹인다.\n“약... 주황색 진정제를 줘... 안 그러면 뇌가 녹아내려...”',
    choices: [
      {
        text: '환기 밸브를 맨손으로 돌리려 시도한다. (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_B2_QUARANTINE_START',
        triggerDeathId: 'DEATH_03',
        deathCause: '신경가스 질식',
        deathTrait: '독극물 감지',
      },
    ],
  },
};

export default SCENARIO_NODES;