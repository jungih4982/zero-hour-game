import type {
  ClueId,
  NarrativeEffect,
  NarrativeEngineState,
  SceneId,
} from '../engine';

export const CLUE_B1_UNMARKED_ROOMS = 'CLUE_B1_UNMARKED_ROOMS' as ClueId;
export const CLUE_B1_TRANSFER_TRACKS = 'CLUE_B1_TRANSFER_TRACKS' as ClueId;

export const B1_LINEN_ROOM_FOUND_FLAG = 'B1_LINEN_ROOM_FOUND';

export type InvestigationHotspot = {
  id: string;
  label: string;
  shortLabel: string;
  discovery: string;
  x: number;
  y: number;
  usesSearchOpportunity?: boolean;
  effects: readonly NarrativeEffect[];
};

export type SceneInvestigation = {
  sceneId: SceneId;
  prompt: string;
  optionalInspectionLimit?: number;
  hotspots: readonly InvestigationHotspot[];
};

const operationsCorridorInvestigation: SceneInvestigation = {
  sceneId: 'SCENE_LOOP2_OPERATIONS_CORRIDOR' as SceneId,
  prompt: '손전등 빛이 돌아오기 전에 복도를 살핀다.',
  optionalInspectionLimit: 1,
  hotspots: [
    {
      id: 'unmarked-doors',
      label: '표찰을 떼어 낸 문',
      shortLabel: '문',
      discovery: '떼어 낸 표찰 아래에 관찰창을 막은 나사 자국이 남아 있다.',
      x: 0.19,
      y: 0.39,
      usesSearchOpportunity: true,
      effects: [
        { type: 'gainClue', clueId: CLUE_B1_UNMARKED_ROOMS },
        { type: 'advanceTime', minutes: 2 },
      ],
    },
    {
      id: 'linen-carts',
      label: '벽에 세워 둔 린넨 카트',
      shortLabel: '흔적',
      discovery: '젖은 바퀴 자국이 복도 끝이 아니라 열린 린넨실 쪽으로 꺾여 있다.',
      x: 0.27,
      y: 0.57,
      usesSearchOpportunity: true,
      effects: [
        { type: 'gainClue', clueId: CLUE_B1_TRANSFER_TRACKS },
        { type: 'advanceTime', minutes: 2 },
      ],
    },
    {
      id: 'linen-room',
      label: '반쯤 열린 린넨실',
      shortLabel: '소리',
      discovery: '문 안에서 억눌린 숨소리가 들렸다. 환자복을 입은 여자가 숨어 있다.',
      x: 0.68,
      y: 0.43,
      effects: [
        { type: 'setFlag', flag: B1_LINEN_ROOM_FOUND_FLAG, value: true, scope: 'loop' },
        { type: 'advanceTime', minutes: 2 },
      ],
    },
  ],
};

export const sceneInvestigations: Readonly<Record<string, SceneInvestigation>> = {
  [operationsCorridorInvestigation.sceneId]: operationsCorridorInvestigation,
};

export function investigationFlag(sceneId: SceneId, hotspotId: string): string {
  return `INVESTIGATED:${sceneId}:${hotspotId}`;
}

export function isHotspotInspected(
  state: NarrativeEngineState,
  sceneId: SceneId,
  hotspotId: string,
): boolean {
  return state.volatile.flags[investigationFlag(sceneId, hotspotId)] === true;
}

export function getUsedSearchOpportunities(
  state: NarrativeEngineState,
  investigation: SceneInvestigation,
): number {
  return investigation.hotspots.filter(
    (hotspot) => hotspot.usesSearchOpportunity
      && isHotspotInspected(state, investigation.sceneId, hotspot.id),
  ).length;
}

export function canInspectHotspot(
  state: NarrativeEngineState,
  investigation: SceneInvestigation,
  hotspot: InvestigationHotspot,
): boolean {
  if (isHotspotInspected(state, investigation.sceneId, hotspot.id)) return false;
  if (!hotspot.usesSearchOpportunity) return true;

  const limit = investigation.optionalInspectionLimit;
  return limit === undefined
    || getUsedSearchOpportunities(state, investigation) < limit;
}
