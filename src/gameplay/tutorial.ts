export const tutorialGuideIds = ['dialogue', 'time', 'records'] as const;

export type TutorialGuideId = (typeof tutorialGuideIds)[number];

export type TutorialGuide = {
  id: TutorialGuideId;
  step: number;
  eyebrow: string;
  title: string;
  detail: string;
  action: string;
};

export const tutorialGuides: Readonly<Record<TutorialGuideId, TutorialGuide>> = {
  dialogue: {
    id: 'dialogue',
    step: 1,
    eyebrow: '첫 번째 기록',
    title: '화면을 눌러 밤을 진행한다',
    detail: '대사가 나타나는 중에 누르면 문장이 완성되고, 다시 누르면 다음 순간으로 넘어갑니다.',
    action: '밤을 시작한다',
  },
  time: {
    id: 'time',
    step: 2,
    eyebrow: '사건 시각',
    title: '선택할 때마다 밤이 흐른다',
    detail: '표시된 시간은 현실 시계가 아니라 이 밤의 사건 시각입니다. 오래 걸리는 행동은 다른 사건을 놓치게 할 수 있습니다.',
    action: '시간을 확인한다',
  },
  records: {
    id: 'records',
    step: 3,
    eyebrow: '현장 기록',
    title: '중요한 사실은 기록에 남는다',
    detail: '단서와 기억을 다시 읽고 서로 연결하면, 다음 반복에서 불가능했던 행동이 열립니다.',
    action: '기억해 둔다',
  },
};

export function getContextualTutorialGuide({
  seenGuideIds,
  openingBeat,
  timedChoiceReady,
  recordsAvailable,
}: {
  seenGuideIds: readonly TutorialGuideId[];
  openingBeat: boolean;
  timedChoiceReady: boolean;
  recordsAvailable: boolean;
}): TutorialGuide | undefined {
  if (openingBeat && !seenGuideIds.includes('dialogue')) {
    return tutorialGuides.dialogue;
  }
  if (timedChoiceReady && !seenGuideIds.includes('time')) {
    return tutorialGuides.time;
  }
  if (recordsAvailable && !seenGuideIds.includes('records')) {
    return tutorialGuides.records;
  }
  return undefined;
}
