import type { NarrativeChoice } from '../engine';

export type ChoiceOutcomeTone = 'memory' | 'evidence' | 'risk' | 'route';

export type ChoiceOutcomeCue = {
  eyebrow: string;
  title: string;
  detail: string;
  tone: ChoiceOutcomeTone;
};

export type ChoicePresentation = {
  meta: string;
  outcome?: ChoiceOutcomeCue;
};

const choicePresentations: Readonly<Record<string, ChoicePresentation>> = {
  RECOGNIZE_RESET: {
    meta: '죽음의 흔적 대조  ·  루프 확인',
    outcome: {
      eyebrow: '기억 대조',
      title: '반복을 확인했다',
      detail: '깨진 시계가 죽음 뒤에도 남아 있다.',
      tone: 'memory',
    },
  },
  CONTINUE_AFTER_TITLE: {
    meta: '반복된 통화 선점',
    outcome: {
      eyebrow: '선행 지식',
      title: '같은 통화를 다르게 시작한다',
      detail: '서윤이 말하기 전에 위치를 짚는다.',
      tone: 'memory',
    },
  },
  DO_NOT_EXPLAIN_LOOP_YET: {
    meta: '시간 단축  ·  먼저 도착',
    outcome: {
      eyebrow: '시간 선점',
      title: '첫 번째 밤보다 8분 앞섰다',
      detail: '설명 대신 사건이 벌어질 장소로 향한다.',
      tone: 'route',
    },
  },
  TAKE_FIRST_PHONE: {
    meta: '사건 발생 전 302호 확인',
    outcome: {
      eyebrow: '사건 선점',
      title: '사라지기 전의 전화를 찾았다',
      detail: '첫 번째 밤에는 보지 못한 순간이다.',
      tone: 'evidence',
    },
  },
  DOCUMENT_PHONE_PARADOX: {
    meta: '완성한 추론 사용  ·  증거 확보',
    outcome: {
      eyebrow: '추론 사용',
      title: '말 대신 모순을 남겼다',
      detail: '같은 흠집과 두 통화 화면을 한 장에 담았다.',
      tone: 'evidence',
    },
  },
  REVEAL_EXACT_FOREKNOWLEDGE: {
    meta: '반응 변화  ·  경비 위험',
    outcome: {
      eyebrow: '기억 공개',
      title: '정확한 지식이 경계를 불렀다',
      detail: '유진이 보호자가 아닌 침입자를 대하듯 움직인다.',
      tone: 'risk',
    },
  },
  GO_TO_STAFF_DOOR_AFTER_BACKFIRE: {
    meta: '정전 동선 선점  ·  경비 이탈',
    outcome: {
      eyebrow: '경로 예측',
      title: '설득을 버리고 열린 문으로 향한다',
      detail: '첫 번째 죽음에서 본 시간을 이용한다.',
      tone: 'route',
    },
  },
  GO_TO_STAFF_DOOR_QUIETLY: {
    meta: '정전 동선 선점  ·  경비 회피',
    outcome: {
      eyebrow: '경로 예측',
      title: '의심을 남기지 않고 문을 선점했다',
      detail: '자정에 잠금이 풀릴 장소를 이미 알고 있다.',
      tone: 'route',
    },
  },
  WAIT_FOR_KNOWN_BLACKOUT: {
    meta: '죽음 회피  ·  지하 동선 개방',
    outcome: {
      eyebrow: '죽음 경로 변경',
      title: '이번에는 넘어지지 않았다',
      detail: '잠금이 풀리는 순간 손잡이를 먼저 잡았다.',
      tone: 'memory',
    },
  },
  USE_B1_TRANSFER_ROUTE: {
    meta: '확보한 동선 사용  ·  경비 회피',
    outcome: {
      eyebrow: '현장 정보 사용',
      title: '손전등의 반대편으로 빠져나갔다',
      detail: '카트 바퀴 자국이 숨은 동선을 만들었다.',
      tone: 'route',
    },
  },
  FACE_TAEJUN_IN_B1: {
    meta: '정면 대응  ·  발각 위험',
    outcome: {
      eyebrow: '위험 감수',
      title: '도망치지 않고 태준을 마주했다',
      detail: '우회로 대신 그의 반응을 확인한다.',
      tone: 'risk',
    },
  },
  ASK_SEA_ABOUT_SEOYUN: {
    meta: '조사 종료  ·  소리의 주인 확인',
  },
};

export function getChoicePresentation(choice: NarrativeChoice): ChoicePresentation {
  return choicePresentations[choice.id] ?? {
    meta: choice.kind === 'foreknowledge'
      ? '남아 있는 기억 사용'
      : '현장에서 판단',
  };
}
