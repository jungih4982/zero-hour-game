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
      '창문을 거세게 두드리는 산속 눈보라 소리.\n\n가벼운 수면장애로 입원했던 여동생 지우와 연락이 끊긴 지 벌써 3주째다.\n\n지우를 찾기 위해 차를 몰고 이곳까지 올라왔지만, 방금 전 일어난 산사태로 유일한 퇴로마저 완전히 무너져 내렸다.\n\n이제 날이 밝을 때까지, 이 기괴하고 음산한 요양원에 고립되었다.',
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
      '“...강지우 환자분 말씀이십니까?”\n\n수간호사 유진이 반무테 안경을 치켜올리며, 조작된 듯한 서류 한 장을 차갑게 내민다.\n\n“해당 환자는 지난달 15일 자진 퇴원 처리되었습니다. 폭설로 도로가 끊겼으니, 날이 밝을 때까지 로비 소파에서 조용히 대기하십시오.”',
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

  NODE_1F_DESK_HACK: {
    nodeId: 'NODE_1F_DESK_HACK',
    timeSlot: '22:00',
    locationName: '1F 원무과 내부',
    speakerName: '주인공 (독백)',
    bgTheme: 'DESK',
    scriptText:
      '유진이 자리를 비운 틈을 타 데스크 서류함을 샅샅이 뒤졌다.\n\n깊숙한 곳에서 붉은색 극비 도장이 찍힌 지우의 진짜 진료 차트가 나왔다.\n\n[피험체 코드 #09: 강지우 / 00:00 코드 블랙 발령 시 B3 심층 연구동으로 강제 이관]\n\n자정이 되면 병원 전체가 정전된다. 그 혼란을 이용하는 게 지우를 빼돌릴 유일한 기회다!',
    choices: [
      {
        text: '차트를 덮고 아무 일 없었다는 듯 로비로 돌아간다.',
        costAp: 0,
        nextNodeId: 'NODE_1F_LOBBY_START',
      },
    ],
  },

  NODE_1F_YUJIN_SHOCKED: {
    nodeId: 'NODE_1F_YUJIN_SHOCKED',
    timeSlot: '22:00',
    locationName: '1F 접수처 데스크',
    speakerName: '수간호사 유진',
    bgTheme: 'LOBBY',
    scriptText:
      '“...당신, 대체 그걸 어떻게 아는 거지?”\n\n유진의 차분하던 눈동자가 심하게 흔들린다. 차트를 쥔 손끝이 잘게 떨리고 있다.\n\n“00시 정전 프로토콜은 본사 보안팀과 병원장님만 아는 극비 사항인데... 대체 당신 정체가 뭡니까?”',
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
      '“...좋아요. 린넨실 환풍구 뒤에 B1 지하 관리구역으로 통하는 비상 사다리가 있어요.\n\n이 마스터키를 받으세요. 하지만 자정이 되면 방호복으로 무장한 경비대가 로비로 난입할 테니 조심해야 해요.”\n\n[단서: 린넨실 마스터키 획득]',
    choices: [
      {
        text: '열쇠를 챙기고 린넨실로 향한다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_1F_LINEN_ROOM',
      },
    ],
  },

  NODE_1F_LINEN_ROOM: {
    nodeId: 'NODE_1F_LINEN_ROOM',
    timeSlot: '22:00',
    locationName: '1F 린넨실 환풍구',
    speakerName: '의문의 소녀 세아',
    bgTheme: 'LINEN',
    scriptText:
      '어두컴컴한 린넨실 구석, 헐렁한 환자복을 입은 연보라빛 머리의 소녀가 웅크린 채 손톱으로 벽을 긁고 있다.\n\n“쉿... 째깍, 째깍... 시계가 열두 번 울리면 하얀 옷을 입은 사신들이 총을 들고 내려와...\n\n불이 꺼지면 도망쳐야 해...”',
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

  NODE_1F_WAIT_SOFA: {
    nodeId: 'NODE_1F_WAIT_SOFA',
    timeSlot: '22:00',
    locationName: '1F 로비 소파',
    speakerName: '주인공 (독백)',
    bgTheme: 'LOBBY',
    scriptText:
      '소파에 깊숙이 파묻혀 벽시계를 응시한다. 째깍거리는 초침 소리가 유난히 날카롭게 귓가를 때린다.\n\n병원 직원들은 극도로 긴장한 표정으로 암호 같은 무전을 주고받고 있다.\n\n자정이 점점 다가온다.',
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
      '─── 콰아아앙!!\n\n자정을 알리는 12번째 괘종시계 소리와 함께, 병원 전체의 전력이 일제히 차단되었다!\n\n칠흑 같은 어둠 속에서 붉은 비상등이 비명을 지르듯 점멸하고 요란한 사이렌이 울려 퍼진다.\n\n[경고: 코드 블랙 발령. B구역 격리 차단 및 소거조 투입]\n\n무거운 전투화를 신은 무장 경비대원들이 로비 정문을 부수며 난입하기 시작한다!',
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
  // [00:30~01:00] B1 관리구역 & 지하 카지노
  // ==========================================
  NODE_B1_BOILER_ROOM: {
    nodeId: 'NODE_B1_BOILER_ROOM',
    timeSlot: '00:30',
    locationName: 'B1 보일러실 지하통로',
    speakerName: '주인공 (독백)',
    bgTheme: 'DARK_LOBBY',
    scriptText:
      '간신히 로비의 경비대를 따돌리고 어두운 지하 관리구역으로 숨어들었다.\n\n증기 파이프가 쉭쉭거리며 뜨거운 김을 뿜어내는 통로 끝, 붉은 네온사인이 희미하게 번지는 철문 너머로 쿵짝거리는 재즈 음악과 칩 부딪히는 소리가 새어나온다.',
    choices: [
      {
        text: '불빛이 새어나오는 카지노 비밀문으로 향한다. (AP 0)',
        costAp: 0,
        nextNodeId: 'NODE_B1_CASINO_HUB',
      },
      {
        text: '[B2 직통 키카드] B2 특수 격리병동 철문을 열고 직통 진입한다. (AP 1)',
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
      '“어머, 위층에서 총소리가 요란하게 나더니 웬 재미있는 손님이 굴러들어왔네?”\n\n버건디빛 머리를 쓸어넘기며 붉은 조끼를 입은 여성이 카지노 칩을 손가락 사이로 능숙하게 굴린다.\n\n“경비대한테 넘겨지기 전에, 나와 목숨을 건 베팅 한 판 어때? 이기면 B2 구역 키카드를 줄게.”',
    choices: [
      {
        text: '[카밀라 거래] “B2 키카드를 주면 내 차 열쇠와 바깥 정보를 넘기지.” (AP 0)',
        costAp: 0,
        unlockClue: 'CLUE_B2_KEYCARD',
        nextNodeId: 'NODE_ENDING_02_DEAL',
      },
      {
        text: 'B2 특수 격리병동 입구로 발걸음을 옮긴다. (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_B2_QUARANTINE_START',
      },
    ],
  },

  // ==========================================
  // [02:00~03:00] B2 특수 격리병동
  // ==========================================
  NODE_B2_QUARANTINE_START: {
    nodeId: 'NODE_B2_QUARANTINE_START',
    timeSlot: '02:00',
    locationName: 'B2 특수 격리병동',
    speakerName: '의문의 소녀 세아',
    bgTheme: 'DARK_LOBBY',
    scriptText:
      '코를 찌르는 푸른 신경가스가 바닥에 독무처럼 자욱하게 깔려 있다.\n\n유리 캡슐 안에 갇힌 세아가 창백한 손으로 유리를 두드리며 울먹인다.\n\n“오빠... 가스가 차오르고 있어... 날 여기서 꺼내줘, 아니면 나랑 같이 붉은 바다로 가자...”',
    choices: [
      {
        text: '[연구원 특화] 화학 지식으로 가스 밸브를 역분사시켜 정화한다. (AP 0)',
        requiredJob: 'RESEARCHER',
        costAp: 0,
        nextNodeId: 'NODE_B3_LAB_ENTRANCE',
      },
      {
        text: '[위험] 환기 밸브를 맨손으로 힘껏 돌리려 시도한다. (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_B2_QUARANTINE_START',
        triggerDeathId: 'DEATH_03',
        deathCause: '신경가스 질식사',
        deathTrait: '독극물 감지',
      },
      {
        text: '세아를 가둔 캡슐을 파괴하고 B3 심층 연구동으로 함께 내려간다. (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_B3_LAB_ENTRANCE',
      },
      {
        text: '[정신력 파탄] “그래... 세아야, 그냥 모든 걸 포기하고 같이 쉬자...”',
        costAp: 0,
        nextNodeId: 'NODE_ENDING_05_ASSIMILATION',
      },
    ],
  },

  // ==========================================
  // [03:30~04:00] B3 심층 연구동 & 최종 분기
  // ==========================================
  NODE_B3_LAB_ENTRANCE: {
    nodeId: 'NODE_B3_LAB_ENTRANCE',
    timeSlot: '03:30',
    locationName: 'B3 이카루스 핵심 연구실',
    speakerName: '주인공 (독백)',
    bgTheme: 'BLACKOUT',
    scriptText:
      '수많은 생체 실험관이 늘어선 기괴한 안개 속, 뇌파 측정 장치를 달고 의식을 잃은 지우가 매달려 있다!\n\n벽면 메인 모니터에는 [04:00 병원 전체 소각 프로토콜 대기 중]이라는 붉은 카운트다운이 째깍거린다.\n\n원장실 중앙 제어 컴퓨터가 바로 눈앞에 있다.',
    choices: [
      {
        text: '[기자/암호 해독] 원장실 마스터 비밀번호로 컴퓨터를 해킹해 비리를 폭로한다! (AP 0)',
        requiredClue: 'CLUE_DIRECTOR_SAFE_CODE',
        costAp: 0,
        nextNodeId: 'NODE_ENDING_03_EXPOSE',
      },
      {
        text: '지우를 구출하고 비상 발전기를 과부하 시켜 요양원을 폭파 탈출한다! (AP 1)',
        costAp: 1,
        nextNodeId: 'NODE_ENDING_04_TRUE_ESCAPE',
      },
      {
        text: '지우 앞에서 주저하며 04:00 제한시간을 넘겨버린다.',
        costAp: 0,
        nextNodeId: 'NODE_B3_LAB_ENTRANCE',
        triggerDeathId: 'DEATH_05',
        deathCause: '소각로 화형사',
        deathTrait: '위기 질주',
      },
    ],
  },

  // ==========================================
  // 🏆 5대 멀티 엔딩 노드
  // ==========================================

  // [ENDING 01] 영원한 방관자
  NODE_ENDING_01_TIMEOVER: {
    nodeId: 'NODE_ENDING_01_TIMEOVER',
    timeSlot: '04:00',
    locationName: '백야 요양원 전체 소각',
    speakerName: '시스템',
    bgTheme: 'BLACKOUT',
    scriptText:
      '─── 콰아아앙!!\n\n04:00 제한시간 초과. 천장 환기구에서 빨간 화염이 폭포수처럼 쏟아져 내린다.\n\n아무것도 결정하지 못한 채, 진실도, 지우도, 그리고 당신 자신도 고통스러운 잿더미 속으로 소멸했다.\n\n[ENDING 01: 영원한 방관자]',
    choices: [
      {
        text: '🔄 소파에서 다시 눈을 뜬다 (루프 리셋)',
        costAp: 0,
        nextNodeId: 'NODE_PROLOGUE_INTRO',
        isEnding: true,
        endingTitle: 'ENDING 01: 영원한 방관자',
      },
    ],
  },

  // [ENDING 02] 거짓된 안식
  NODE_ENDING_02_DEAL: {
    nodeId: 'NODE_ENDING_02_DEAL',
    timeSlot: '01:30',
    locationName: '산속 산사태 도로',
    speakerName: '딜러 카밀라',
    bgTheme: 'DARK_LOBBY',
    scriptText:
      '카밀라와의 거래를 통해 지하의 비밀을 뒤로 한 채, 혼자 비상탈출로로 빠져나왔다.\n\n눈보라 속 차 안에서 백미러로 불타오르는 병원을 바라본다. 동생 지우를 버렸다는 지독한 죄책감이 평생 당신의 목을 죄어올 것이다.\n\n[ENDING 02: 거짓된 안식]',
    choices: [
      {
        text: '🔄 참회하며 다시 차를 돌린다 (루프 리셋)',
        costAp: 0,
        nextNodeId: 'NODE_PROLOGUE_INTRO',
        isEnding: true,
        endingTitle: 'ENDING 02: 거짓된 안식',
      },
    ],
  },

  // [ENDING 03] 진실의 폭로
  NODE_ENDING_03_EXPOSE: {
    nodeId: 'NODE_ENDING_03_EXPOSE',
    timeSlot: '03:50',
    locationName: 'B3 원무과 서버실',
    speakerName: '주인공 (독백)',
    bgTheme: 'DESK',
    scriptText:
      '딸깍!\n\n이카루스 프로젝트의 참혹한 생체 실험 데이터와 위조 차트가 전 세계 주요 언론사로 일제히 송출되었다.\n\n경보음이 어지럽게 울려 퍼지는 가운데, 당신은 겨우 의식을 차린 지우를 들쳐업고 당당히 정문을 향해 걸어 나간다.\n\n[ENDING 03: 진실의 폭로]',
    choices: [
      {
        text: '🎉 다른 직업과 루트로 도전하기 (루프 리셋)',
        costAp: 0,
        nextNodeId: 'NODE_PROLOGUE_INTRO',
        isEnding: true,
        endingTitle: 'ENDING 03: 진실의 폭로',
      },
    ],
  },

  // [ENDING 04] 이카루스의 낙하 (TRUE ENDING)
  NODE_ENDING_04_TRUE_ESCAPE: {
    nodeId: 'NODE_ENDING_04_TRUE_ESCAPE',
    timeSlot: '04:00',
    locationName: '백야 요양원 외곽',
    speakerName: '주인공 & 지우',
    bgTheme: 'LOBBY',
    scriptText:
      '콰콰콰쾅─!!\n\n과부하된 비상 발전기가 연쇄 폭발을 일으키며 끔찍했던 백야 요양원이 흔적도 없이 산산조각 난다.\n\n자욱한 연기와 어둠이 걷히고 새벽빛이 동틀 무렵, 의식을 되찾은 지우가 당신의 손을 꼭 쥔다.\n\n“오빠... 이제 집에 가자.”\n\n[ENDING 04: 이카루스의 낙하 (TRUE ENDING)]',
    choices: [
      {
        text: '🏆 진 엔딩 클리어! (처음으로 돌아가기)',
        costAp: 0,
        nextNodeId: 'NODE_PROLOGUE_INTRO',
        isEnding: true,
        endingTitle: 'ENDING 04: 이카루스의 낙하',
      },
    ],
  },

  // [ENDING 05] 심연과의 동화
  NODE_ENDING_05_ASSIMILATION: {
    nodeId: 'NODE_ENDING_05_ASSIMILATION',
    timeSlot: '02:30',
    locationName: 'B2 붉은 신경가스 캡슐',
    speakerName: '의문의 소녀 세아',
    bgTheme: 'BLACKOUT',
    scriptText:
      '이성의 끈이 완전히 끊어지고, 환각과 푸른 안개 속으로 몸을 던졌다.\n\n세아가 기괴하지만 아름다운 미소를 지으며 당신의 목을 부드럽게 감싸 안는다.\n\n“잘 왔어... 이제 아무것도 아파할 필요 없어... 영원히 나와 하나가 되는 거야...”\n\n[ENDING 05: 심연과의 동화]',
    choices: [
      {
        text: '🔄 악몽에서 깨어난다 (루프 리셋)',
        costAp: 0,
        nextNodeId: 'NODE_PROLOGUE_INTRO',
        isEnding: true,
        endingTitle: 'ENDING 05: 심연과의 동화',
      },
    ],
  },
};

export default SCENARIO_NODES;