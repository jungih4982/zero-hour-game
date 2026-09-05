import type { NarrativeChoice } from '../engine';

export type ChoiceOutcomeTone = 'memory' | 'evidence' | 'risk' | 'route';

export type ChoiceOutcomeCue = {
  eyebrow: string;
  title: string;
  detail: string;
  tone: ChoiceOutcomeTone;
};

export type ForeknowledgeIntervention = {
  known: string;
  changed: string;
  consequence: string;
};

export type ChoicePresentation = {
  meta: string;
  outcome?: ChoiceOutcomeCue;
  intervention?: ForeknowledgeIntervention;
};

export type ChoiceGroupPresentation = {
  eyebrow: string;
  hint: string;
};

const choicePresentations: Readonly<Record<string, ChoicePresentation>> = {
  CH3_BAND_TO_YUJIN: { meta: '사진 보존 · 원본은 유진 보관', outcome: { eyebrow: '보관 경로', title: '유진이 봉인 봉투를 보관한다', detail: '원본을 다시 확인하려면 유진의 협조가 필요하다.', tone: 'evidence' } },
  CH3_BAND_SHOW_TAEJUN: { meta: '보안 촬영 · 원본 회수', outcome: { eyebrow: '시각 기록', title: '태준이 원본을 확인했다', detail: '보안 기록에 소지 시각이 남고 원본은 돌려받는다.', tone: 'evidence' } },
  CH3_BAND_KEEP_ORIGINAL: { meta: '원본 유지 · 유진의 경계', outcome: { eyebrow: '보관 경로', title: '원본은 직접 보관한다', detail: '직접 대조할 수 있지만 유진의 협조는 얻지 못했다.', tone: 'risk' } },
  CH3_ENTER_B1_SOLO: { meta: '4분 단축 · 단독 진입', outcome: { eyebrow: '동선 선택', title: '카트 자국을 따라 먼저 내려간다', detail: '4분을 아꼈지만 현장에서 도와줄 동행자는 없다.', tone: 'risk' } },
  USE_MEMORY_0106_SEAL: {
    meta: '밀폐 시각 기억 · 다음 밤의 행동 변경',
    intervention: {
      known: '01:06 · 이송실이 닫힌 뒤 안에서 숨을 잃었다',
      changed: '21:23 · 서윤에게 죽은 장소와 시각을 먼저 말한다',
      consequence: '이번 밤에는 이송실 안으로 들어가지 않고, 맞은편 계단을 먼저 찾기로 한다.',
    },
  },
  PRESERVE_MESSAGE_SEQUENCE: {
    meta: '문자 순서 보존  ·  정보 우선',
    outcome: {
      eyebrow: '정보 확보',
      title: '모순이 생긴 순서를 남겼다',
      detail: '먼저 도착한 경고와 뒤따른 부정을 다음 반복에서도 기억할 수 있다.',
      tone: 'evidence',
    },
  },
  CONTINUE_TO_BAEKYA: {
    meta: '시간 우선  ·  현장으로 이동',
    outcome: {
      eyebrow: '시간 확보',
      title: '문자보다 서윤에게 먼저 간다',
      detail: '기록을 포기한 대신 2분을 아꼈다.',
      tone: 'route',
    },
  },
  RECOGNIZE_RESET: {
    meta: '죽음의 흔적 대조  ·  루프 확인',
    outcome: {
      eyebrow: '기억 대조',
      title: '반복을 확인했다',
      detail: '깨진 시계가 죽음 뒤에도 남아 있다.',
      tone: 'memory',
    },
    intervention: {
      known: '00:00 · 열린 문을 따라간 뒤 추락했다',
      changed: '21:23 · 깨진 시계로 반복을 확인했다',
      consequence: '죽음의 흔적이 다음 행동을 바꾸는 지식으로 고정됐다.',
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
    intervention: {
      known: '통화로 상황을 설명하는 동안 도착이 늦어졌다',
      changed: '설명을 보류하고 병원으로 바로 향한다',
      consequence: '검증을 미룬 대신 첫 번째 밤보다 8분을 확보했다.',
    },
  },
  TEST_MESSAGE_ANOMALY: {
    meta: '모순 검증  ·  정보 우선',
    outcome: {
      eyebrow: '기억 검증',
      title: '오지 않은 문자를 먼저 말했다',
      detail: '시간을 내준 대신 누군가 서윤의 말을 앞서 보내고 있음을 확인한다.',
      tone: 'memory',
    },
  },
  LEAVE_AFTER_MESSAGE_TEST: {
    meta: '검증 완료  ·  현장으로 이동',
    outcome: {
      eyebrow: '새 모순',
      title: '서윤보다 먼저 온 말을 기록했다',
      detail: '이제 현장에서 그 발신자가 누구인지 확인해야 한다.',
      tone: 'evidence',
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
    intervention: {
      known: '유진에게 휴대전화의 모순만 제한적으로 알렸다',
      changed: '유진의 다음 말과 자정 정전을 먼저 말했다',
      consequence: '정보는 증명했지만 유진의 경계가 상승했다.',
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
    intervention: {
      known: '소리를 따라 어둠 속 계단으로 들어가 죽었다',
      changed: '잠금이 풀리는 순간 문손잡이를 먼저 잡았다',
      consequence: '첫 죽음을 피하고 지하 동선을 열었다.',
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
  CHECK_WRISTBAND: {
    meta: '조사 종료  ·  손목밴드 확인',
  },
  RETURN_TO_302_FOR_SECOND_PHONE: {
    meta: '경비 이탈  ·  302호 재조사',
    outcome: {
      eyebrow: '재조사',
      title: '첫 번째에 보지 못한 쪽을 확인한다',
      detail: '서윤의 경고를 따라 사라진 병실로 돌아간다.',
      tone: 'route',
    },
  },
  CALL_BOTH_SEOYUN_PHONES: {
    meta: '동시 통화 검증  ·  모순 확인',
    outcome: {
      eyebrow: '현장 검증',
      title: '같은 전화가 동시에 울린다',
      detail: '사진이 아니라 작동하는 두 기기를 대조한다.',
      tone: 'evidence',
    },
  },
  KEEP_SECOND_PHONE: {
    meta: '증거물 확보  ·  다음 경고 대기',
    outcome: {
      eyebrow: '증거 확보',
      title: '두 번째 휴대전화를 챙겼다',
      detail: '이번에는 사라지기 전에 직접 가지고 나온다.',
      tone: 'evidence',
    },
  },
  ASK_TAEJUN_ABOUT_CCTV: {
    meta: '보안 기록 재확인',
    outcome: {
      eyebrow: '조사 계속',
      title: '기록이 비는 시간을 찾는다',
      detail: '나오지 않은 사람보다 먼저, 사라진 영상부터 확인한다.',
      tone: 'route',
    },
  },
  SHOW_SECOND_PHONE_TO_TAEJUN: {
    meta: '소지한 증거 제시  ·  협조 가능성',
    outcome: {
      eyebrow: '증거 제시',
      title: '주장을 물건으로 바꿨다',
      detail: '태준도 두 번째 휴대전화를 직접 확인했다.',
      tone: 'evidence',
    },
  },
  PRESS_TAEJUN_ON_CCTV_GAP: {
    meta: '직접 압박  ·  경계 상승',
    outcome: {
      eyebrow: '위험 감수',
      title: '태준에게 확인을 강요했다',
      detail: '빈 1분은 확보했지만 협조를 끌어내지는 못했다.',
      tone: 'risk',
    },
  },
  COMPARE_06_WITH_WRISTBAND: {
    meta: '첫 번째 밤의 기록 대조',
    outcome: {
      eyebrow: '기억 대조',
      title: '서로 다른 물건에 같은 숫자가 남았다',
      detail: '06은 한 번으로 끝난 우연이 아니다.',
      tone: 'memory',
    },
  },
  ASK_WHERE_06_CARD_WAS_FOUND: {
    meta: '정보 제한  ·  위치 확인',
    outcome: {
      eyebrow: '정보 통제',
      title: '아는 것을 숨기고 위치만 얻었다',
      detail: '06의 의미는 드러내지 않은 채 기록에 남긴다.',
      tone: 'route',
    },
  },
  KEEP_MINSEO_WARNING_PRIVATE: {
    meta: '정보 은폐  ·  빠른 단독 조사',
    outcome: {
      eyebrow: '단독 행동',
      title: '통화 내용을 숨겼다',
      detail: '도움을 포기한 대신 먼저 3층으로 향한다.',
      tone: 'risk',
    },
  },
  TELL_MINSEO_ONLY_WALL_CLUE: {
    meta: '정보 일부 공유  ·  신중한 이동',
    outcome: {
      eyebrow: '제한 공유',
      title: '필요한 사실만 민서에게 남겼다',
      detail: '서윤의 기억은 숨기고 302호 벽만 확인한다.',
      tone: 'route',
    },
  },
  LINK_CCTV_GAP_TO_OLD_PASSAGE: {
    meta: '완성한 추론 사용  ·  숨은 동선 제시',
    outcome: {
      eyebrow: '추론 사용',
      title: '빈 1분에 길이 생겼다',
      detail: '영상과 건물 기록을 겹쳐 태준에게 제시한다.',
      tone: 'evidence',
    },
  },
  SEND_OLD_MAP_TO_SEOYUN: {
    meta: '기억 검증  ·  서윤에게 역질문',
    outcome: {
      eyebrow: '검증 요청',
      title: '이번에는 서윤의 기억을 확인한다',
      detail: '안내도 사진을 보내 서로 다른 302호를 대조한다.',
      tone: 'memory',
    },
  },
  ACCEPT_INDEPENDENT_SEARCH_RULE: {
    meta: '조사 원칙 확립  ·  다음 루프 준비',
    outcome: {
      eyebrow: '새 규칙',
      title: '한 사람의 말만 믿지 않는다',
      detail: '직접 본 것과 반복해서 확인한 것만 남긴다.',
      tone: 'route',
    },
  },
};

export function getChoicePresentation(choice: NarrativeChoice): ChoicePresentation {
  return choicePresentations[choice.id] ?? {
    meta: choice.kind === 'foreknowledge'
      ? '남아 있는 기억 사용'
      : choice.kind === 'evidence'
        ? '확보한 증거 제시'
      : '현장에서 판단',
  };
}

export function getChoiceGroupPresentation(
  choices: readonly NarrativeChoice[],
  investigationProgress?: string,
): ChoiceGroupPresentation {
  if (investigationProgress !== undefined) {
    return { eyebrow: '현장 조사', hint: investigationProgress };
  }
  if (choices.length > 1) {
    return { eyebrow: '판단', hint: '선택한 행동은 되돌릴 수 없다' };
  }

  const onlyChoice = choices[0];
  if (onlyChoice?.kind === 'foreknowledge') {
    return { eyebrow: '기억 개입', hint: '지난 반복의 지식으로 현재를 바꾼다' };
  }
  if (onlyChoice?.kind === 'evidence') {
    return { eyebrow: '단서 사용', hint: '확보한 사실을 행동으로 옮긴다' };
  }
  return { eyebrow: '다음 행동', hint: '현재 목표를 이어간다' };
}
