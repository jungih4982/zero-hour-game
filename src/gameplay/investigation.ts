import type {
  ClueId,
  ItemId,
  NarrativeEffect,
  NarrativeEngineState,
  SceneId,
} from '../engine';
import { chapter3Investigations } from '../content/chapter3';

export const CLUE_B1_UNMARKED_ROOMS = 'CLUE_B1_UNMARKED_ROOMS' as ClueId;
export const CLUE_B1_TRANSFER_TRACKS = 'CLUE_B1_TRANSFER_TRACKS' as ClueId;

export const B1_LINEN_ROOM_FOUND_FLAG = 'B1_LINEN_ROOM_FOUND';
export const ROOM_302_WRISTBAND_FOUND_FLAG = 'ROOM_302_WRISTBAND_FOUND';
export const OLD_MAP_PASSAGE_FOUND_FLAG = 'OLD_MAP_PASSAGE_FOUND';

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
  fitHotspotsToStage?: boolean;
  hiddenDialogueBeatIndices?: readonly number[];
  optionalInspectionLimit?: number;
  hotspots: readonly InvestigationHotspot[];
};

const room302Investigation: SceneInvestigation = {
  sceneId: 'SCENE_ACT2_ROOM_CONTRADICTION' as SceneId,
  prompt: '유진이 재촉하는 동안 302호의 흔적을 직접 확인한다.',
  hiddenDialogueBeatIndices: [1, 3, 6],
  hotspots: [
    {
      id: 'recent-use-traces',
      label: '남은 사용 흔적',
      shortLabel: '흔적',
      discovery: '하지만 사용하지 않은 방은 아니었다. 이불 한쪽이 몸의 무게만큼 꺼져 있었고, 수액 튜브 끝에는 새 거즈가 감겨 있었다. 물컵 바깥에는 손자국이 남아 있었다. 침대 밑 슬리퍼 한 짝은 복도 쪽을 향했다.',
      x: 0.46,
      y: 0.48,
      effects: [
        { type: 'gainClue', clueId: 'CLUE_302_OCCUPIED' as ClueId },
        { type: 'advanceTime', minutes: 2 },
      ],
    },
    {
      id: 'missing-phone',
      label: '진동이 끊긴 곳',
      shortLabel: '전화',
      discovery: '커튼 뒤와 서랍, 침대 아래를 확인했다. 전화는 보이지 않았다.',
      x: 0.82,
      y: 0.47,
      effects: [{ type: 'advanceTime', minutes: 2 }],
    },
    {
      id: 'torn-wristband',
      label: '난간 아래의 흰 조각',
      shortLabel: '조각',
      discovery: '침대 난간 아래에서 찢어진 환자 손목밴드가 보였다. 이름이 있어야 할 부분은 뜯겨 있었고 병실 번호와 생년월일만 남아 있었다.',
      x: 0.36,
      y: 0.52,
      effects: [
        {
          type: 'setFlag',
          flag: ROOM_302_WRISTBAND_FOUND_FLAG,
          value: true,
          scope: 'loop',
        },
        { type: 'advanceTime', minutes: 2 },
      ],
    },
  ],
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

const oldMapInvestigation: SceneInvestigation = {
  sceneId: 'SCENE_LOOP2_OLD_MAP_SEARCH' as SceneId,
  prompt: '태준이 올라오기 전에 현재 구조와 오래된 안내도를 대조한다.',
  hotspots: [
    {
      id: 'map-date',
      label: '안내도 제작 연도',
      shortLabel: '연도',
      discovery: '안내도는 현재 병동이 정비되기 전 제작됐다. 폐기되지 않은 채 대기 공간 벽에 남아 있다.',
      x: 0.72,
      y: 0.68,
      effects: [{ type: 'advanceTime', minutes: 1 }],
    },
    {
      id: 'room-302-outline',
      label: '302호 뒤의 빈 공간',
      shortLabel: '구조',
      discovery: '302호 뒤쪽에 병실이 아닌 좁고 긴 공간이 표시돼 있다. 반대쪽 끝은 간호사실 뒤편과 이어진다.',
      x: 0.55,
      y: 0.44,
      effects: [
        { type: 'gainClue', clueId: 'CLUE_OLD_302_PASSAGE' as ClueId },
        { type: 'gainItem', itemId: 'ITEM_OLD_MAP_PHOTO' as ItemId },
        { type: 'setFlag', flag: OLD_MAP_PASSAGE_FOUND_FLAG, value: true, scope: 'loop' },
        { type: 'advanceTime', minutes: 2 },
      ],
    },
    {
      id: 'current-wall',
      label: '현재 병동의 막힌 벽',
      shortLabel: '현재',
      discovery: '출입문 유리 너머로 보이는 벽면에는 문도 복도도 없다. 안내도의 공간은 현재 구조에서 완전히 지워져 있다.',
      x: 0.34,
      y: 0.55,
      effects: [{ type: 'advanceTime', minutes: 1 }],
    },
  ],
};

export const sceneInvestigations: Readonly<Record<string, SceneInvestigation>> = {
  [room302Investigation.sceneId]: room302Investigation,
  [operationsCorridorInvestigation.sceneId]: operationsCorridorInvestigation,
  [oldMapInvestigation.sceneId]: oldMapInvestigation,
  ...chapter3Investigations,
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

export function getAvailableInvestigationHotspots(
  state: NarrativeEngineState,
  investigation: SceneInvestigation,
): readonly InvestigationHotspot[] {
  return investigation.hotspots.filter((hotspot) =>
    canInspectHotspot(state, investigation, hotspot));
}
